package com.flix.catalog.order.service;

import com.flix.catalog.common.dto.OrderRequest;
import com.flix.catalog.common.dto.OrderResponse;
import com.flix.catalog.dao.CartItemRepository;
import com.flix.catalog.dao.OrderRepository;
import com.flix.catalog.dao.PaymentMethodRepository;
import com.flix.catalog.dao.ProductRepository;
import com.flix.catalog.dao.PromotionRepository;
import com.flix.catalog.entity.*;
import com.flix.catalog.enums.PaymentStatus;
import com.flix.catalog.enums.PromotionEnum;
import com.flix.common.enums.ErrorCode;
import com.flix.common.exception.BusinessException;
import com.flix.common.util.SecurityUtils;
import com.flix.identity.dao.UserProfileRepository;
import com.flix.identity.dao.UserRepository;
import com.flix.identity.entity.User;
import com.flix.identity.entity.UserProfile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
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
    private final PromotionRepository promotionRepository;

    public OrderResponse createOrUpdateOrder(Long id, OrderRequest request) {
        log.info("Receiving request to {} order. Order ID: {}", (id != null ? "update" : "create"), id);
        if (id != null) {
            return updateOrder(id, request);
        }
        return createOrder(request);
    }

    public List<OrderResponse> listOrders(Long userId) {
        log.info("Fetching orders list for user ID: {}", userId);
        List<OrderResponse> orders = orderRepository.findByUserIdOrderByIdDesc(userId).stream()
                .map(OrderResponse::from)
                .toList();
        log.debug("Found {} orders for user ID: {}", orders.size(), userId);
        return orders;
    }

    public List<OrderResponse> listAllOrders() {
        log.info("Fetching all orders for admin");
        List<OrderResponse> orders = orderRepository.findAllByOrderByIdDesc().stream()
                .map(OrderResponse::from)
                .toList();
        log.debug("Found total {} orders in system", orders.size());
        return orders;
    }

    public OrderResponse getOrderDetails(Long orderId) {
        log.debug("Fetching order details for order ID: {}", orderId);
        OrderEntity orderEntity = orderRepository.findById(orderId)
                .orElseThrow(() -> {
                    log.warn("Get order details failed: Order ID {} not found", orderId);
                    return new BusinessException(ErrorCode.ORDER_NOT_FOUND);
                });
        authorizeOrderAccess(orderEntity.getUser().getId());
        return OrderResponse.from(orderEntity);
    }

    // =========================================================================
    // 1. CREATE ORDER
    // =========================================================================
    private OrderResponse createOrder(OrderRequest request) {
        Long userId = getCurrentUserId();
        log.info("Start creating order for user ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("Create order failed: User ID {} not found", userId);
                    return new BusinessException(ErrorCode.USER_NOT_FOUND);
                });

        var cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            log.warn("Create order failed: Cart is empty for user ID {}", userId);
            throw new BusinessException(ErrorCode.CART_EMPTY);
        }

        PaymentMethodEntity paymentMethod = resolvePaymentMethod(request.paymentMethodId());
        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setUser(user);
        orderEntity.setPaymentMethodEntity(paymentMethod);
        orderEntity.setStatus(OrderStatus.PENDING);
        orderEntity.setPaymentStatus(request.paymentStatus() != null ? request.paymentStatus() : PaymentStatus.UNPAID);

        long rawTotalAmount = 0L;
        double totalCarbonFootprint = 0.0;
        int greenPointsEarned = 0;

        for (var cartItem : cartItems) {
            ProductEntity product = productRepository.findById(cartItem.getProduct().getId())
                    .orElseThrow(() -> {
                        log.warn("Create order failed: Product ID {} not found", cartItem.getProduct().getId());
                        return new BusinessException(ErrorCode.PRODUCT_NOT_FOUND);
                    });

            if (product.getStock() < cartItem.getQuantity()) {
                log.warn("Create order failed: Insufficient stock for product ID {}. Available: {}, Requested: {}",
                        product.getId(), product.getStock(), cartItem.getQuantity());
                throw new BusinessException(ErrorCode.INSUFFICIENT_STOCK);
            }

            long lineAmount = product.getPrice() * cartItem.getQuantity();
            double lineCarbonFootprint = (product.getCarbonIndex() == null ? 0.0 : product.getCarbonIndex()) * cartItem.getQuantity();
            int lineGreenPoints = (product.getGreenPoints() == null ? 0 : product.getGreenPoints()) * cartItem.getQuantity();

            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
            log.debug("Deducted stock for product ID {}. Remaining stock: {}", product.getId(), product.getStock());

            OrderItemEntity orderItemEntity = new OrderItemEntity();
            orderItemEntity.setQuantity(cartItem.getQuantity());
            orderItemEntity.setPrice(lineAmount);
            orderItemEntity.setLineCarbonFootprint(lineCarbonFootprint);
            orderItemEntity.setProductEntity(product);
            orderItemEntity.setOrderEntity(orderEntity);
            orderEntity.getOrderItems().add(orderItemEntity);

            rawTotalAmount += lineAmount;
            totalCarbonFootprint += lineCarbonFootprint;
            greenPointsEarned += lineGreenPoints;
        }

        if (rawTotalAmount <= 0) {
            log.warn("Create order failed: Raw total amount is invalid ({}) for user ID {}", rawTotalAmount, userId);
            throw new BusinessException(ErrorCode.ORDER_TOTAL_INVALID);
        }

        long finalTotalAmount = rawTotalAmount;
        if (request.promotionId() != null) {
            log.info("Applying promotion ID: {} to order for user ID: {}", request.promotionId(), userId);
            PromotionEntity promotion = promotionRepository.findById(request.promotionId())
                    .orElseThrow(() -> {
                        log.warn("Create order failed: Promotion ID {} not found", request.promotionId());
                        return new BusinessException(ErrorCode.PROMOTION_NOT_FOUND);
                    });

            long discountAmount = validateAndCalculateDiscount(promotion, rawTotalAmount, userId, paymentMethod, orderEntity.getOrderItems());
            finalTotalAmount = rawTotalAmount - discountAmount;

            promotion.setUsedCount(promotion.getUsedCount() == null ? 1 : promotion.getUsedCount() + 1);
            promotionRepository.save(promotion);
            log.info("Successfully applied promotion ID: {}. Discount: {}, New usedCount: {}",
                    promotion.getId(), discountAmount, promotion.getUsedCount());

            orderEntity.setPromotion(promotion);
        }

        orderEntity.setTotalAmount(finalTotalAmount);
        OrderEntity savedOrder = orderRepository.save(orderEntity);

        updateUserProfile(user, greenPointsEarned, totalCarbonFootprint);
        cartItemRepository.deleteByUserId(userId);

        log.info("Successfully created order ID: {} for user ID: {} with final amount: {}",
                savedOrder.getId(), userId, savedOrder.getTotalAmount());
        return OrderResponse.from(savedOrder);
    }

    // =========================================================================
    // 2. UPDATE ORDER
    // =========================================================================
    private OrderResponse updateOrder(Long id, OrderRequest request) {
        log.info("Start updating order ID: {}", id);

        if (!isAdmin()) {
            log.warn("Update order failed: User is not authorized as admin");
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        OrderEntity orderEntity = orderRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Update order failed: Order ID {} not found", id);
                    return new BusinessException(ErrorCode.ORDER_NOT_FOUND);
                });

        if (orderEntity.getStatus() == OrderStatus.COMPLETED) {
            log.warn("Update order failed: Order ID {} is already completed", id);
            throw new BusinessException(ErrorCode.ORDER_ALREADY_COMPLETED);
        }
        if (orderEntity.getStatus() == OrderStatus.CANCELLED) {
            log.warn("Update order failed: Order ID {} is cancelled and cannot be updated", id);
            throw new BusinessException(ErrorCode.ORDER_CANNOT_CANCEL);
        }

        // Cập nhật PaymentStatus từ request nếu có
        if (request.paymentStatus() != null) {
            log.info("Updating payment status for order ID: {} to {}", id, request.paymentStatus());
            orderEntity.setPaymentStatus(request.paymentStatus());
        }

        PaymentMethodEntity currentPaymentMethod = orderEntity.getPaymentMethodEntity();
        if (request.paymentMethodId() != null) {
            log.debug("Updating payment method for order ID: {} to payment method ID: {}", id, request.paymentMethodId());
            currentPaymentMethod = resolvePaymentMethod(request.paymentMethodId());
            orderEntity.setPaymentMethodEntity(currentPaymentMethod);
        }

        // Xử lý đổi Promotion
        if (request.promotionId() != null &&
                (orderEntity.getPromotion() == null || !orderEntity.getPromotion().getId().equals(request.promotionId()))) {

            log.info("Changing promotion for order ID: {}. Old promotion ID: {}, New promotion ID: {}",
                    id, (orderEntity.getPromotion() != null ? orderEntity.getPromotion().getId() : "NONE"), request.promotionId());

            if (orderEntity.getPromotion() != null) {
                revertPromotionUsage(orderEntity.getPromotion());
            }

            PromotionEntity newPromotion = promotionRepository.findById(request.promotionId())
                    .orElseThrow(() -> {
                        log.warn("Update order failed: New promotion ID {} not found", request.promotionId());
                        return new BusinessException(ErrorCode.PROMOTION_NOT_FOUND);
                    });

            long rawTotalAmount = calculateRawTotalAmount(orderEntity);
            long discountAmount = validateAndCalculateDiscount(newPromotion, rawTotalAmount, orderEntity.getUser().getId(), currentPaymentMethod, orderEntity.getOrderItems());

            newPromotion.setUsedCount(newPromotion.getUsedCount() == null ? 1 : newPromotion.getUsedCount() + 1);
            promotionRepository.save(newPromotion);

            orderEntity.setPromotion(newPromotion);
            orderEntity.setTotalAmount(rawTotalAmount - discountAmount);
            log.info("Successfully updated order ID: {} with new promotion ID: {}. New total amount: {}",
                    id, newPromotion.getId(), orderEntity.getTotalAmount());
        }

        if (request.status() != null) {
            OrderStatus newStatus = request.status();
            OrderStatus oldStatus = orderEntity.getStatus();
            log.info("Updating status for order ID: {} from {} to {}", id, oldStatus, newStatus);

            if (oldStatus == OrderStatus.DELIVERY && newStatus == OrderStatus.PENDING) {
                log.warn("Update order failed: Cannot revert from DELIVERY to PENDING for order ID {}", id);
                throw new BusinessException(ErrorCode.ORDER_IN_DELIVERY);
            }

            if (newStatus == OrderStatus.CANCELLED) {
                cancelOrderLogic(orderEntity);
            } else {
                orderEntity.setStatus(newStatus);
                // Tự động chuyển sang PAID nếu đơn hoàn tất (COD) mà chưa thanh toán
                if (newStatus == OrderStatus.COMPLETED && orderEntity.getPaymentStatus() == PaymentStatus.UNPAID) {
                    log.info("Order ID: {} status changed to COMPLETED. Automatically updating payment status to PAID", id);
                    orderEntity.setPaymentStatus(PaymentStatus.PAID);
                }
            }
        }

        log.info("Successfully updated order ID: {} with final status: {} and payment status: {}",
                id, orderEntity.getStatus(), orderEntity.getPaymentStatus());
        return OrderResponse.from(orderRepository.save(orderEntity));
    }

    // =========================================================================
    // 3. CANCEL ORDER LOGIC
    // =========================================================================
    private void cancelOrderLogic(OrderEntity orderEntity) {
        log.info("Executing cancellation logic for order ID: {}", orderEntity.getId());

        if (orderEntity.getStatus() == OrderStatus.COMPLETED) {
            log.warn("Cancel order failed: Order ID {} is already completed", orderEntity.getId());
            throw new BusinessException(ErrorCode.ORDER_ALREADY_COMPLETED);
        }
        if (orderEntity.getStatus() == OrderStatus.DELIVERY) {
            log.warn("Cancel order failed: Order ID {} is in delivery state", orderEntity.getId());
            throw new BusinessException(ErrorCode.ORDER_IN_DELIVERY);
        }
        if (orderEntity.getStatus() == OrderStatus.CANCELLED) {
            log.warn("Cancel order failed: Order ID {} is already cancelled", orderEntity.getId());
            throw new BusinessException(ErrorCode.ORDER_CANNOT_CANCEL);
        }

        for (OrderItemEntity item : orderEntity.getOrderItems()) {
            ProductEntity product = item.getProductEntity();
            int newStock = product.getStock() + item.getQuantity();
            product.setStock(newStock);
            productRepository.save(product);
            log.debug("Restored stock for product ID {}. New stock: {}", product.getId(), newStock);
        }

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
        log.debug("Reverted profile points for user ID {}. Deducted GreenPoints: {}, Deducted CarbonIndex: {}",
                user.getId(), greenPointsDeducted, carbonFootprintDeducted);

        // Hoàn lại lượt dùng Promotion
        if (orderEntity.getPromotion() != null) {
            revertPromotionUsage(orderEntity.getPromotion());
        }

        // Đổi trạng thái thanh toán sang REFUNDED nếu đơn đã từng thanh toán
        if (orderEntity.getPaymentStatus() == PaymentStatus.PAID) {
            log.info("Order ID: {} was PAID. Automatically updating payment status to REFUNDED upon cancellation", orderEntity.getId());
            orderEntity.setPaymentStatus(PaymentStatus.REFUNDED);
        }

        orderEntity.setStatus(OrderStatus.CANCELLED);
        log.info("Order ID: {} successfully cancelled with final payment status: {}", orderEntity.getId(), orderEntity.getPaymentStatus());
    }

    // =========================================================================
    // HELPER METHODS: VALIDATION & CALCULATIONS
    // =========================================================================

    private long validateAndCalculateDiscount(PromotionEntity promotion, long rawTotalAmount, Long userId, PaymentMethodEntity paymentMethod, List<OrderItemEntity> orderItems) {
        log.debug("Validating promotion ID: {} for raw total amount: {} and user ID: {}", promotion.getId(), rawTotalAmount, userId);
        LocalDateTime now = LocalDateTime.now();

        if (Boolean.FALSE.equals(promotion.getIsActive())) {
            log.warn("Promotion validation failed: Promotion ID {} is inactive", promotion.getId());
            throw new BusinessException(ErrorCode.PROMOTION_NOT_ACTIVE);
        }

        if (promotion.getStartDate() == null || promotion.getEndDate() == null
                || promotion.getStartDate().isAfter(promotion.getEndDate())) {
            log.warn("Promotion validation failed: Promotion ID {} has invalid start/end dates", promotion.getId());
            throw new BusinessException(ErrorCode.PROMOTION_INVALID_DATE);
        }

        if (now.isBefore(promotion.getStartDate())) {
            log.warn("Promotion validation failed: Promotion ID {} has not started yet (Start: {}, Current: {})",
                    promotion.getId(), promotion.getStartDate(), now);
            throw new BusinessException(ErrorCode.PROMOTION_NOT_STARTED);
        }

        if (now.isAfter(promotion.getEndDate())) {
            log.warn("Promotion validation failed: Promotion ID {} is expired (End: {}, Current: {})",
                    promotion.getId(), promotion.getEndDate(), now);
            throw new BusinessException(ErrorCode.PROMOTION_EXPIRED);
        }

        if (promotion.getUsageLimit() != null && promotion.getUsedCount() != null
                && promotion.getUsedCount() >= promotion.getUsageLimit()) {
            log.warn("Promotion validation failed: Promotion ID {} reached usage limit ({}/{})",
                    promotion.getId(), promotion.getUsedCount(), promotion.getUsageLimit());
            throw new BusinessException(ErrorCode.PROMOTION_OUT_OF_USAGE);
        }

        if (promotion.getMinOrderValue() != null
                && BigDecimal.valueOf(rawTotalAmount).compareTo(promotion.getMinOrderValue()) < 0) {
            log.warn("Promotion validation failed: Raw amount {} is below minimum order value {} for promotion ID {}",
                    rawTotalAmount, promotion.getMinOrderValue(), promotion.getId());
            throw new BusinessException(ErrorCode.ORDER_NOT_ENOUGH_FOR_PROMOTION);
        }

        boolean alreadyUsed = orderRepository.existsByUserIdAndPromotionIdAndStatusNot(userId, promotion.getId(), OrderStatus.CANCELLED);
        if (alreadyUsed) {
            log.warn("Promotion validation failed: User ID {} has already used promotion ID {}", userId, promotion.getId());
            throw new BusinessException(ErrorCode.PROMOTION_ALREADY_USED_BY_USER);
        }

        if (promotion.getDiscountValue() == null || promotion.getDiscountValue().compareTo(BigDecimal.ZERO) <= 0) {
            log.warn("Promotion validation failed: Promotion ID {} has invalid discount value ({})", promotion.getId(), promotion.getDiscountValue());
            throw new BusinessException(ErrorCode.PROMOTION_INVALID_DISCOUNT_VALUE);
        }

        BigDecimal subtotalBd = BigDecimal.valueOf(rawTotalAmount);
        BigDecimal discount = BigDecimal.ZERO;

        if (promotion.getDiscountType() == PromotionEnum.PERCENTAGE) {
            discount = subtotalBd.multiply(promotion.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);

            if (promotion.getMaxDiscountAmount() != null
                    && discount.compareTo(promotion.getMaxDiscountAmount()) > 0) {
                log.debug("Discount calculated ({}) exceeds max discount amount ({}). Capping to max.",
                        discount, promotion.getMaxDiscountAmount());
                discount = promotion.getMaxDiscountAmount();
            }
        } else if (promotion.getDiscountType() == PromotionEnum.FIXED_AMOUNT) {
            discount = promotion.getDiscountValue();
        }

        if (discount.longValue() > rawTotalAmount) {
            log.warn("Promotion validation failed: Discount amount ({}) exceeds raw total amount ({}) for promotion ID {}",
                    discount.longValue(), rawTotalAmount, promotion.getId());
            throw new BusinessException(ErrorCode.PROMOTION_DISCOUNT_EXCEEDS_ORDER_TOTAL);
        }

        log.debug("Promotion ID {} successfully validated. Final calculated discount: {}", promotion.getId(), discount.longValue());
        return discount.longValue();
    }

    private void revertPromotionUsage(PromotionEntity promotion) {
        log.debug("Reverting usage count for promotion ID: {}. Current usage: {}", promotion.getId(), promotion.getUsedCount());

        if (promotion.getUsedCount() == null || promotion.getUsedCount() <= 0) {
            log.warn("Revert promotion usage failed: Invalid usedCount ({}) for promotion ID {}", promotion.getUsedCount(), promotion.getId());
            throw new BusinessException(ErrorCode.PROMOTION_USAGE_COUNT_INVALID);
        }

        promotion.setUsedCount(promotion.getUsedCount() - 1);
        promotionRepository.save(promotion);
        log.info("Successfully reverted promotion ID: {}. New usedCount: {}", promotion.getId(), promotion.getUsedCount());
    }

    private long calculateRawTotalAmount(OrderEntity orderEntity) {
        long total = orderEntity.getOrderItems().stream()
                .mapToLong(OrderItemEntity::getPrice)
                .sum();
        log.debug("Calculated raw total amount for order ID {}: {}", orderEntity.getId(), total);
        return total;
    }

    private void updateUserProfile(User user, int greenPointsEarned, double totalCarbonFootprint) {
        log.debug("Updating profile for user ID: {}. Adding GreenPoints: {}, CarbonFootprint: {}",
                user.getId(), greenPointsEarned, totalCarbonFootprint);

        UserProfile userProfile = userProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> createDefaultUserProfile(user));

        int currentGreenPoints = userProfile.getGreenPoints() == null ? 0 : userProfile.getGreenPoints();
        double currentCarbonIndex = userProfile.getTotalCarbonIndex() == null ? 0.0 : userProfile.getTotalCarbonIndex();

        userProfile.setGreenPoints(currentGreenPoints + greenPointsEarned);
        userProfile.setTotalCarbonIndex(currentCarbonIndex + totalCarbonFootprint);
        userProfileRepository.save(userProfile);
        log.debug("Successfully updated profile for user ID: {}. New total GreenPoints: {}", user.getId(), userProfile.getGreenPoints());
    }

    private UserProfile createDefaultUserProfile(User user) {
        log.info("Creating default user profile for user ID: {}", user.getId());
        UserProfile profile = new UserProfile();
        profile.setUser(user);
        profile.setFullName(user.getUsername());
        profile.setGreenPoints(0);
        profile.setTotalCarbonIndex(0.0);
        user.setUserProfile(profile);
        return userProfileRepository.save(profile);
    }

    private PaymentMethodEntity resolvePaymentMethod(Long paymentMethodId) {
        log.debug("Resolving payment method ID: {}", paymentMethodId);
        if (paymentMethodId != null) {
            return paymentMethodRepository.findById(paymentMethodId)
                    .filter(PaymentMethodEntity::getIsActive)
                    .orElseThrow(() -> {
                        log.warn("Payment method resolution failed: Payment method ID {} not found or inactive", paymentMethodId);
                        return new BusinessException(ErrorCode.PAYMENT_METHOD_NOT_FOUND);
                    });
        }

        log.info("No payment method ID provided, resolving default payment method");
        return paymentMethodRepository.findFirstByIsActiveTrueOrderByIdAsc()
                .orElseGet(() -> paymentMethodRepository.save(createDefaultPaymentMethod()));
    }

    private PaymentMethodEntity createDefaultPaymentMethod() {
        log.info("Creating default payment method: {}", DEFAULT_PAYMENT_METHOD_NAME);
        PaymentMethodEntity paymentMethodEntity = new PaymentMethodEntity();
        paymentMethodEntity.setMethodName(DEFAULT_PAYMENT_METHOD_NAME);
        paymentMethodEntity.setIsActive(true);
        return paymentMethodEntity;
    }

    private boolean isAdmin() {
        boolean adminRole = SecurityUtils.isAdminRole(currentJwt());
        log.debug("Checking admin privileges: {}", adminRole);
        return adminRole;
    }

    private void authorizeOrderAccess(Long ownerUserId) {
        log.debug("Authorizing order access for owner user ID: {}", ownerUserId);
        if (!isAdmin()) {
            SecurityUtils.validateOwnership(ownerUserId, currentJwt());
        }
    }
}