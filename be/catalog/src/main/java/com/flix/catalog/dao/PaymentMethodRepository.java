package com.flix.catalog.dao;

import com.flix.catalog.entity.PaymentMethodEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethodEntity, Long> {
    Optional<PaymentMethodEntity> findByMethodName(String methodName);

    Optional<PaymentMethodEntity> findFirstByIsActiveTrueOrderByIdAsc();
}
