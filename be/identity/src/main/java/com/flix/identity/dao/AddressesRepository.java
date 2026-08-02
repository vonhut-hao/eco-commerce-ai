package com.flix.identity.dao;

import com.flix.identity.entity.AddressesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressesRepository extends JpaRepository<AddressesEntity, Long> {

    List<AddressesEntity> findByUserIdOrderByIdDesc(Long userId);

    Optional<AddressesEntity> findByIdAndUserId(Long id, Long userId);

    @Modifying
    @Query("UPDATE AddressesEntity a SET a.isDefault = false WHERE a.user.id = :userId")
    void resetDefaultAddressForUser(@Param("userId") Long userId);
}
