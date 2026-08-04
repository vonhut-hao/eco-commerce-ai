# Export Invoice (PDF & Web Print) Implementation Plan

This document outlines the complete system architecture, API contracts, and implementation design for the **Export Invoice** feature across the Flix Platform.

---

## 1. Feature Architecture & System Design

The Export Invoice feature allows customers and administrators to preview, print, and download official PDF invoices for completed orders.

### System Architecture Workflow

```mermaid
flowchart TD
    Client[Frontend Client / User] -->|1. Request PDF| Endpoint[GET /v1/catalog/orders/{id}/invoice/pdf]
    Endpoint -->|2. Authorize| Security[SecurityUtils / validateOwnership or Admin Role]
    Security -->|3. Fetch Order Data| OrderRepo[OrderRepository & OrderItemRepository]
    OrderRepo -->|4. Map Data| DataBuilder[Invoice Data Builder]
    DataBuilder -->|5. Render PDF| PDFEngine[Invoice PDF Generator Engine]
    PDFEngine -->|6. Stream Binary| Response[ResponseEntity byte[] application/pdf]
```

---

## 2. API Contract & Endpoint Details

### PDF Invoice Endpoint
- **HTTP Method:** `GET`
- **Path:** `/v1/catalog/orders/{id}/invoice/pdf` (Alias: `/api/v1/catalog/orders/{id}/invoice/pdf`)
- **Headers:** `Authorization: Bearer <token>`
- **Response Headers:**
  - `Content-Type: application/pdf`
  - `Content-Disposition: inline; filename="invoice-{orderId}.pdf"`
- **Access Control:** Authenticated user who owns the order (`validateOwnership`) OR Admin (`ROLE_ADMIN`).

---

## 3. Core Business Rules

1. **Order Ownership Validation:** Non-admin users can only generate and download invoices for orders belonging to their own account.
2. **Order Status Requirement:** Invoices can only be generated for valid orders (or completed/processed orders).
3. **Data Integrity & Consistency:**
   - PDF contents must strictly derive from server-side order records (order ID, date, customer name, shipping address, line items, line carbon footprint, total amount, payment method).
4. **Export Formats:**
   - **Backend PDF Stream:** Primary secure export mechanism for saving/downloading.
   - **Frontend Print View:** Secondary browser-native print view (`window.print()` with `@media print`).

---

## 4. Work Breakdown Directory

- **Backend Tasks Document:** [`tasks-be.md`](file:///.github/work/invoice-export-feature/tasks-be.md)
- **Frontend Tasks Document:** [`tasks-fe.md`](file:///.github/work/invoice-export-feature/tasks-fe.md)
