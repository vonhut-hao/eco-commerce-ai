package com.flix.catalog.paymentmethod.service;

import com.flix.catalog.common.dto.PaymentMethodRequest;
import com.flix.catalog.common.dto.PaymentMethodResponse;
import com.flix.catalog.dao.PaymentMethodRepository;
import com.flix.catalog.entity.PaymentMethodEntity;
import com.flix.common.enums.ErrorCode;
import com.flix.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;

    @Transactional(readOnly = true)
    public List<PaymentMethodResponse> getActivePaymentMethods() {
        log.info("Fetching all active payment methods for customer checkout");
        return paymentMethodRepository.findByIsActiveTrue().stream()
                .map(PaymentMethodResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PaymentMethodResponse> getAllPaymentMethods() {
        log.info("Fetching all payment methods for admin management");
        return paymentMethodRepository.findAll().stream()
                .map(PaymentMethodResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public PaymentMethodResponse getPaymentMethodById(Long id) {
        log.info("Fetching payment method with ID: {}", id);
        PaymentMethodEntity entity = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.PAYMENT_METHOD_NOT_FOUND));
        return PaymentMethodResponse.from(entity);
    }

    @Transactional
    public PaymentMethodResponse createPaymentMethod(PaymentMethodRequest request) {
        log.info("Creating payment method: {}", request.methodName());

        if (paymentMethodRepository.existsByMethodName(request.methodName())) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }

        PaymentMethodEntity entity = new PaymentMethodEntity();
        request.toEntity(entity);
        if (entity.getIsActive() == null) {
            entity.setIsActive(true);
        }

        PaymentMethodEntity saved = paymentMethodRepository.save(entity);
        log.info("Successfully created payment method with ID: {}", saved.getId());
        return PaymentMethodResponse.from(saved);
    }

    @Transactional
    public PaymentMethodResponse updatePaymentMethod(Long id, PaymentMethodRequest request) {
        log.info("Updating payment method ID: {}", id);
        PaymentMethodEntity entity = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.PAYMENT_METHOD_NOT_FOUND));

        if (request.methodName() != null && paymentMethodRepository.existsByMethodNameAndIdNot(request.methodName(), id)) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }

        request.toEntity(entity);
        PaymentMethodEntity updated = paymentMethodRepository.save(entity);
        log.info("Successfully updated payment method ID: {}", updated.getId());
        return PaymentMethodResponse.from(updated);
    }

    @Transactional
    public PaymentMethodResponse togglePaymentMethodStatus(Long id, Boolean isActive) {
        log.info("Toggling payment method ID: {} active status to: {}", id, isActive);
        PaymentMethodEntity entity = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.PAYMENT_METHOD_NOT_FOUND));

        entity.setIsActive(isActive != null ? isActive : !Boolean.TRUE.equals(entity.getIsActive()));
        PaymentMethodEntity updated = paymentMethodRepository.save(entity);
        return PaymentMethodResponse.from(updated);
    }

    @Transactional
    public void deletePaymentMethod(Long id) {
        log.info("Deleting payment method ID: {}", id);
        PaymentMethodEntity entity = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.PAYMENT_METHOD_NOT_FOUND));

        try {
            paymentMethodRepository.delete(entity);
        } catch (Exception e) {
            log.warn("Hard delete failed for payment method ID {}, performing soft deactivation", id);
            entity.setIsActive(false);
            paymentMethodRepository.save(entity);
        }
    }
}
