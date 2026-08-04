package com.flix.catalog.api.controller;

import com.flix.catalog.invoice.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping({"/v1/catalog/orders", "/api/v1/catalog/orders"})
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping("/{id}/invoice/pdf")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<byte[]> getOrderInvoicePdf(
            @PathVariable("id") Long orderId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        byte[] pdfBytes = invoiceService.generateOrderInvoicePdf(orderId, jwt);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.inline()
                .filename("invoice-" + orderId + ".pdf")
                .build());

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
