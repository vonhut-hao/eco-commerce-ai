package com.flix.catalog.cart.service;

import com.flix.catalog.common.dto.CartItemRequest;
import com.flix.catalog.common.dto.CartItemResponse;
import com.flix.catalog.dao.CartItemRepository;
import com.flix.catalog.dao.ProductRepository;
import com.flix.catalog.entity.CartItemEntity;
import com.flix.catalog.entity.ProductEntity;
import com.flix.common.enums.ErrorCode;
import com.flix.common.exception.BusinessException;
import com.flix.identity.dao.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CartItemService {
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartItemResponse createOrUpdateCartItem(Long id, CartItemRequest request) {
        int quantity = request.quantity() == null ? 1 : request.quantity();

        CartItemEntity cartItemEntity;
        if (id != null) {
            cartItemEntity = cartItemRepository.findById(id)
                    .orElseThrow(() -> new BusinessException(ErrorCode.CART_ITEM_NOT_FOUND));
            log.info("Updated cart item with ID: {}", id);
        } else {
            var userEntity = userRepository.findById(request.userId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
            cartItemEntity = cartItemRepository.findByUserIdAndProductId(request.userId(), request.productId())
                    .orElseGet(CartItemEntity::new);
            if (cartItemEntity.getId() == null) {
                log.info("Created cart item for user ID: {} and product ID: {}", request.userId(), request.productId());
            } else {
                log.info("Merged cart item quantity for user ID: {} and product ID: {}", request.userId(), request.productId());
                quantity += cartItemEntity.getQuantity();
            }
            cartItemEntity.setUser(userEntity);
        }

        var productEntity = productRepository.findById(request.productId())
                .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND));

        cartItemEntity.setProduct(productEntity);

        if (productEntity.getStock() < quantity) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_PRODUCT_STOCK);
        }

        cartItemEntity.setQuantity(quantity);

        return CartItemResponse.from(cartItemRepository.save(cartItemEntity));
    }

    public List<CartItemResponse> listCartItems(Long userId) {
        log.info("List cart items for user ID: {}", userId);
        return cartItemRepository.findByUserId(userId).stream()
                .map(CartItemResponse::from)
                .toList();
    }

    public void deleteCartItem(Long id) {
        if (id == null) {
            throw new BusinessException(ErrorCode.CART_ITEM_NOT_FOUND);
        }

        var cartItemEntity = cartItemRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.CART_ITEM_NOT_FOUND));
        cartItemRepository.delete(cartItemEntity);
        log.info("Deleted cart item with ID: {}", id);
    }
}
