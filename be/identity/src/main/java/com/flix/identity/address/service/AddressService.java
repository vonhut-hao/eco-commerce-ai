package com.flix.identity.address.service;

import com.flix.common.enums.ErrorCode;
import com.flix.common.exception.BusinessException;
import com.flix.common.exception.UserNotFoundException;
import com.flix.identity.common.dto.AddressRequest;
import com.flix.identity.common.dto.AddressResponse;
import com.flix.identity.dao.AddressesRepository;
import com.flix.identity.dao.UserRepository;
import com.flix.identity.entity.AddressesEntity;
import com.flix.identity.entity.User;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AddressService {

    AddressesRepository addressesRepository;
    UserRepository userRepository;

    public AddressResponse createAddress(Long userId, AddressRequest request) {
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        List<AddressesEntity> existingAddresses = addressesRepository.findByUserIdOrderByIdDesc(userId);

        boolean setAsDefault = existingAddresses.isEmpty() || Boolean.TRUE.equals(request.isDefault());
        if (setAsDefault) {
            addressesRepository.resetDefaultAddressForUser(userId);
        }

        AddressesEntity address = AddressesEntity.builder()
                .recipientName(request.recipientName())
                .phoneNumber(request.phoneNumber())
                .fullAddress(request.fullAddress())
                .isDefault(setAsDefault)
                .user(user)
                .build();

        AddressesEntity savedAddress = addressesRepository.save(address);
        log.info("Created address {} for user {}", savedAddress.getId(), userId);
        return AddressResponse.from(savedAddress);
    }

    @Transactional(readOnly = true)
    public List<AddressResponse> getUserAddresses(Long userId) {
        return addressesRepository.findByUserIdOrderByIdDesc(userId)
                .stream()
                .map(AddressResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public AddressResponse getAddressDetails(Long id, Long userId) {
        AddressesEntity address = addressesRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_REQUEST));
        return AddressResponse.from(address);
    }

    public AddressResponse updateAddress(Long id, Long userId, AddressRequest request) {
        AddressesEntity address = addressesRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_REQUEST));

        if (Boolean.TRUE.equals(request.isDefault())) {
            addressesRepository.resetDefaultAddressForUser(userId);
            address.setIsDefault(true);
        } else if (Boolean.FALSE.equals(request.isDefault()) && Boolean.TRUE.equals(address.getIsDefault())) {
            address.setIsDefault(false);
        }

        address.setRecipientName(request.recipientName());
        address.setPhoneNumber(request.phoneNumber());
        address.setFullAddress(request.fullAddress());

        AddressesEntity updatedAddress = addressesRepository.save(address);
        log.info("Updated address {} for user {}", updatedAddress.getId(), userId);
        return AddressResponse.from(updatedAddress);
    }

    public void deleteAddress(Long id, Long userId) {
        AddressesEntity address = addressesRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_REQUEST));
        addressesRepository.delete(address);
        log.info("Deleted address {} for user {}", id, userId);
    }

    public AddressResponse setDefaultAddress(Long id, Long userId) {
        AddressesEntity address = addressesRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_REQUEST));

        addressesRepository.resetDefaultAddressForUser(userId);
        address.setIsDefault(true);

        AddressesEntity updatedAddress = addressesRepository.save(address);
        log.info("Set address {} as default for user {}", updatedAddress.getId(), userId);
        return AddressResponse.from(updatedAddress);
    }
}
