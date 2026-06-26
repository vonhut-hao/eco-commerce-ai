package com.flix.catalog.order.service;

import com.flix.catalog.common.dto.OrderItemResponse;
import com.flix.catalog.common.dto.OrderRequest;
import com.flix.catalog.common.dto.OrderResponse;
import com.flix.catalog.dao.CartItemRepository;
import com.flix.catalog.dao.OrderRepository;
import com.flix.catalog.dao.PaymentMethodRepository;
import com.flix.catalog.dao.ProductRepository;
import com.flix.catalog.entity.*;
import com.flix.common.enums.ErrorCode;
import com.flix.common.exception.BusinessException;
import com.flix.common.util.SecurityUtils;
import com.flix.identity.dao.UserProfileRepository;
import com.flix.identity.dao.UserRepository;
import com.flix.identity.entity.User;
import com.flix.identity.entity.UserProfile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.flix.common.util.SecurityUtils.currentJwt;
import static com.flix.common.util.SecurityUtils.getCurrentUserId;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class OrderService {
    private static final String DEFAULT_PAYMENT_METHOD_NAME = "DEFAULT";

    private final OrderRepository orderRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    public OrderResponse createOrUpdateOrder(Long id, OrderRequest request) {
        if (id != null) {
            return updateOrder(id, request);
        }
        return createOrder(request);
    }

    public List<OrderResponse> listOrders(Long userId) {
        log.info("List orders for user ID: {}", userId);
        return orderRepository.findByUserIdOrderByIdDesc(userId).stream()
                .map(OrderResponse::from)
                .toList();
    }

    public List<OrderResponse> listAllOrders() {
        log.info("List all orders for admin");
        return orderRepository.findAllByOrderByIdDesc().stream()
                .map(OrderResponse::from)
                .toList();
    }

    public OrderResponse getOrderDetails(Long orderId) {
        OrderEntity orderEntity = orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND));
        authorizeOrderAccess(orderEntity.getUser().getId());
        return OrderResponse.from(orderEntity);
    }

    private OrderResponse createOrder(OrderRequest request) {
        Long userId = getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        var cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new BusinessException(ErrorCode.CART_EMPTY);
        }

        PaymentMethodEntity paymentMethod = resolvePaymentMethod(request.paymentMethodId());
        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setUser(user);
        orderEntity.setPaymentMethodEntity(paymentMethod);
        orderEntity.setStatus(OrderStatus.PENDING);

        long totalAmount = 0L;
        double totalCarbonFootprint = 0.0;
        int greenPointsEarned = 0;

        for (var cartItem : cartItems) {
            ProductEntity product = productRepository.findById(cartItem.getProduct().getId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND));
            if (product.getStock() < cartItem.getQuantity()) {
                throw new BusinessException(ErrorCode.INSUFFICIENT_STOCK);
            }

            long lineAmount = product.getPrice() * cartItem.getQuantity();
            double lineCarbonFootprint = (product.getCarbonIndex() == null ? 0.0 : product.getCarbonIndex()) * cartItem.getQuantity();
            int lineGreenPoints = (product.getGreenPoints() == null ? 0 : product.getGreenPoints()) * cartItem.getQuantity();

            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);

            OrderItemEntity orderItemEntity = new OrderItemEntity();
            orderItemEntity.setQuantity(cartItem.getQuantity());
            orderItemEntity.setPrice(lineAmount);
            orderItemEntity.setLineCarbonFootprint(lineCarbonFootprint);
            orderItemEntity.setProductEntity(product);
            orderItemEntity.setOrderEntity(orderEntity);
            orderEntity.getOrderItems().add(orderItemEntity);

            totalAmount += lineAmount;
            totalCarbonFootprint += lineCarbonFootprint;
            greenPointsEarned += lineGreenPoints;
        }

        orderEntity.setTotalAmount(totalAmount);
        OrderEntity savedOrder = orderRepository.save(orderEntity);

        updateUserProfile(user, greenPointsEarned, totalCarbonFootprint);
        cartItemRepository.deleteByUserId(userId);

        log.info("Created order with ID: {}", savedOrder.getId());
        return OrderResponse.from(savedOrder);
    }

    private OrderResponse updateOrder(Long id, OrderRequest request) {
        if (!isAdmin()) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        OrderEntity orderEntity = orderRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND));

        if (orderEntity.getStatus() == OrderStatus.COMPLETED || orderEntity.getStatus() == OrderStatus.CANCELLED) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }

        if (request.paymentMethodId() != null) {
            orderEntity.setPaymentMethodEntity(resolvePaymentMethod(request.paymentMethodId()));
        }

        if (request.status() != null) {
            OrderStatus newStatus = request.status();

            if (newStatus == OrderStatus.CANCELLED && orderEntity.getStatus() == OrderStatus.PENDING) {
                // Restore stock
                for (OrderItemEntity item : orderEntity.getOrderItems()) {
                    ProductEntity product = item.getProductEntity();
                    product.setStock(product.getStock() + item.getQuantity());
                    productRepository.save(product);
                }

                // Deduct points/carbon footprint from profile
                int greenPointsDeducted = 0;
                double carbonFootprintDeducted = 0.0;
                for (OrderItemEntity item : orderEntity.getOrderItems()) {
                    ProductEntity product = item.getProductEntity();
                    greenPointsDeducted += (product.getGreenPoints() == null ? 0 : product.getGreenPoints()) * item.getQuantity();
                    carbonFootprintDeducted += (product.getCarbonIndex() == null ? 0.0 : product.getCarbonIndex()) * item.getQuantity();
                }

                User user = orderEntity.getUser();
                UserProfile userProfile = userProfileRepository.findByUserId(user.getId())
                        .orElseGet(() -> createDefaultUserProfile(user));

                int currentGreenPoints = userProfile.getGreenPoints() == null ? 0 : userProfile.getGreenPoints();
                double currentCarbonIndex = userProfile.getTotalCarbonIndex() == null ? 0.0 : userProfile.getTotalCarbonIndex();

                userProfile.setGreenPoints(Math.max(0, currentGreenPoints - greenPointsDeducted));
                userProfile.setTotalCarbonIndex(Math.max(0.0, currentCarbonIndex - carbonFootprintDeducted));
                userProfileRepository.save(userProfile);
            }

            orderEntity.setStatus(newStatus);
        } else {
            orderEntity.setStatus(OrderStatus.COMPLETED);
        }

        log.info("Updated order with ID: {} to status: {}", id, orderEntity.getStatus());
        return OrderResponse.from(orderRepository.save(orderEntity));
    }

    private void updateUserProfile(User user, int greenPointsEarned, double totalCarbonFootprint) {
        UserProfile userProfile = userProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> createDefaultUserProfile(user));

        int currentGreenPoints = userProfile.getGreenPoints() == null ? 0 : userProfile.getGreenPoints();
        double currentCarbonIndex = userProfile.getTotalCarbonIndex() == null ? 0.0 : userProfile.getTotalCarbonIndex();

        userProfile.setGreenPoints(currentGreenPoints + greenPointsEarned);
        userProfile.setTotalCarbonIndex(currentCarbonIndex + totalCarbonFootprint);
        userProfileRepository.save(userProfile);
    }

    private UserProfile createDefaultUserProfile(User user) {
        UserProfile profile = new UserProfile();
        profile.setUser(user);
        profile.setFullName(user.getUsername());
        profile.setGreenPoints(0);
        profile.setTotalCarbonIndex(0.0);
        user.setUserProfile(profile);
        return userProfileRepository.save(profile);
    }

    private PaymentMethodEntity resolvePaymentMethod(Long paymentMethodId) {
        if (paymentMethodId != null) {
            return paymentMethodRepository.findById(paymentMethodId)
                    .filter(PaymentMethodEntity::getIsActive)
                    .orElseThrow(() -> new BusinessException(ErrorCode.PAYMENT_METHOD_NOT_FOUND));
        }

        return paymentMethodRepository.findFirstByIsActiveTrueOrderByIdAsc()
                .orElseGet(() -> paymentMethodRepository.save(createDefaultPaymentMethod()));
    }

    private PaymentMethodEntity createDefaultPaymentMethod() {
        PaymentMethodEntity paymentMethodEntity = new PaymentMethodEntity();
        paymentMethodEntity.setMethodName(DEFAULT_PAYMENT_METHOD_NAME);
        paymentMethodEntity.setIsActive(true);
        return paymentMethodEntity;
    }

    private boolean isAdmin() {
        return SecurityUtils.isAdminRole(currentJwt());
    }

    private void authorizeOrderAccess(Long ownerUserId) {
        if (!isAdmin()) {
            SecurityUtils.validateOwnership(ownerUserId, currentJwt());
        }
    }
}
