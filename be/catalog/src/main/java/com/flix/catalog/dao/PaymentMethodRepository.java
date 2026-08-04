package com.flix.catalog.dao;

import com.flix.catalog.entity.PaymentMethodEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethodEntity, Long> {
    Optional<PaymentMethodEntity> findByMethodName(String methodName);

    Optional<PaymentMethodEntity> findFirstByIsActiveTrueOrderByIdAsc();

    List<PaymentMethodEntity> findByIsActiveTrue();

    boolean existsByMethodName(String methodName);

    boolean existsByMethodNameAndIdNot(String methodName, Long id);
}
