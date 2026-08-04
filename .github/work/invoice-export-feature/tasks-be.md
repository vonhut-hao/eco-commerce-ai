# Backend Task Breakdown: Invoice Export (PDF Generation)

- [x] **Phase 1: PDF Library Setup & Dependency Management**
  - [x] Add PDF generation library (OpenPDF `com.github.librepdf:openpdf` or equivalent) to `be/catalog/pom.xml`.

- [x] **Phase 2: DTO & Data Builder Implementation**
  - [x] Create `InvoiceDataDto` in `be/catalog/src/main/java/com/flix/catalog/common/dto/InvoiceDataDto.java` containing:
    - Order ID, createdAt timestamp, OrderStatus
    - Customer name, email, shipping address
    - Itemized line items list (product name, quantity, unit price, line carbon footprint, total price)
    - Order summary totals (subtotal, total carbon footprint, final amount)
    - Payment method details

- [x] **Phase 3: PDF Generation Service Implementation**
  - [x] Create `InvoicePdfService` in `be/catalog/src/main/java/com/flix/catalog/invoice/service/InvoicePdfService.java`.
  - [x] Implement PDF layout builder using OpenPDF (Header banner, Flix Platform branding, Customer & Shipping block, Itemized table, Financial & Carbon footprint summary, Footer).
  - [x] Create `InvoiceService` in `be/catalog/src/main/java/com/flix/catalog/invoice/service/InvoiceService.java` to handle data assembly and ownership authorization checks.

- [x] **Phase 4: REST Controller & Security Integration**
  - [x] Create `InvoiceController` in `be/catalog/src/main/java/com/flix/catalog/api/controller/InvoiceController.java`.
  - [x] Add endpoint `GET /v1/catalog/orders/{id}/invoice/pdf`.
  - [x] Enforce security checks (`@PreAuthorize("isAuthenticated()")` + `SecurityUtils.validateOwnership` / Admin check).
  - [x] Return `ResponseEntity<byte[]>` with `Content-Type: application/pdf` and `Content-Disposition: inline; filename="invoice-{id}.pdf"`.

- [x] **Phase 5: Automated Testing & Verification**
  - [x] Add unit test `InvoicePdfServiceTest` verifying PDF binary byte stream creation.
  - [x] Add integration test `InvoiceIT.groovy` in `be/flix-integration-test` verifying `GET /v1/catalog/orders/{id}/invoice/pdf` (200 OK for owner/admin, 403 Forbidden for unauthorized user).
