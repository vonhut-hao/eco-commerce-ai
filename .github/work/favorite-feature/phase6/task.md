# Task: Phase 6 - Dedicated Favorites Page & Navigation Header

## 1. Requirements
Build the user's Wishlist / Favorites page and add navigation shortcuts to headers and bottom navigation bar.

## 2. Steps
1. Create [`fe/src/pages/FavoritesPage.tsx`](file:///E:/intelljProject/flix-plaftform/fe/src/pages/FavoritesPage.tsx):
   - Grid layout displaying user favorited products.
   - Empty state illustration when no items are favorited.
   - Quick action to remove from favorites or add directly to cart.

2. Update [`App.tsx`](file:///E:/intelljProject/flix-plaftform/fe/src/App.tsx):
   - Register `/favorites` route inside `MainLayout`.

3. Update Navigation Header Components:
   - Update [`DesktopHeader.tsx`](file:///E:/intelljProject/flix-plaftform/fe/src/components/layout/DesktopHeader.tsx) with Wishlist icon button.
   - Update [`MobileHeader.tsx`](file:///E:/intelljProject/flix-plaftform/fe/src/components/layout/MobileHeader.tsx).
   - Update [`BottomNav.tsx`](file:///E:/intelljProject/flix-plaftform/fe/src/components/layout/BottomNav.tsx).
