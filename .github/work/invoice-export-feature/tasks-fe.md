# Frontend Task Breakdown: Invoice Export UI & Download

- [ ] **Phase 1: API Service Layer Integration**
  - [ ] Add `downloadOrderInvoicePdf(orderId: string | number)` method to invoice/order API client module.
  - [ ] Configure request to fetch binary `blob` stream (`responseType: 'blob'`).
  - [ ] Handle binary response download creation (`URL.createObjectURL(blob)` trigger download anchor).

- [ ] **Phase 2: Invoice Preview Component & Modal**
  - [ ] Create `InvoicePreviewModal` component to display styled invoice metadata before printing/downloading.
  - [ ] Render Flix Platform header branding, Order #, Order Date, Customer details, Itemized table, Carbon Footprint badge, and Order Totals.

- [ ] **Phase 3: Action Handlers & Print CSS**
  - [ ] Implement **"Download PDF"** button action triggering `downloadOrderInvoicePdf(orderId)` with loading state spinner.
  - [ ] Implement **"Print Invoice"** button action triggering `window.print()`.
  - [ ] Add `@media print` CSS rules hiding navigation, sidebars, buttons, and headers when printing.

- [ ] **Phase 4: Order History & Details Page Integration**
  - [ ] Add "Download Invoice" / "View Invoice" action buttons to Order Details page and Order History items.
  - [ ] Handle error notifications (e.g. Toast alert if invoice download fails or user is unauthorized).
