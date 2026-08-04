package com.flix.catalog.invoice.service;

import com.flix.catalog.common.dto.InvoiceDataDto;
import com.flix.catalog.dao.OrderRepository;
import com.flix.catalog.entity.OrderEntity;
import com.flix.common.enums.ErrorCode;
import com.flix.common.exception.BusinessException;
import com.flix.common.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class InvoiceService {

    private final OrderRepository orderRepository;
    private final InvoicePdfService invoicePdfService;

    @Transactional(readOnly = true)
    public byte[] generateOrderInvoicePdf(Long orderId, Jwt jwt) {
        log.info("Generating invoice PDF for order ID: {}", orderId);

        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND));

        if (!SecurityUtils.isAdminRole(jwt)) {
            SecurityUtils.validateOwnership(order.getUser().getId(), jwt);
        }

        InvoiceDataDto data = InvoiceDataDto.from(order);
        return invoicePdfService.generatePdf(data);
    }
}
