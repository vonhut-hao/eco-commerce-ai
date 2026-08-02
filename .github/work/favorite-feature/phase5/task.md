# Task: Phase 5 - UI Components & Product Page Integration

## 1. Requirements
Build a reusable heart button component and integrate it into product items across the shop and product detail pages.

## 2. Steps
1. Create [`fe/src/components/common/FavoriteButton.tsx`](file:///E:/intelljProject/flix-plaftform/fe/src/components/common/FavoriteButton.tsx):
   - Lucide `Heart` icon with filled/outline state.
   - Smooth animation and loading indicator during API call.
   - Prompt login if user is unauthenticated.

2. Update [`ShopPage.tsx`](file:///E:/intelljProject/flix-plaftform/fe/src/pages/ShopPage.tsx):
   - Place `FavoriteButton` on product cards.
   - Fetch batch favorite status on product list load.

3. Update [`ProductDetailPage.tsx`](file:///E:/intelljProject/flix-plaftform/fe/src/pages/ProductDetailPage.tsx):
   - Add favorite heart button next to the "Add to Cart" button.
