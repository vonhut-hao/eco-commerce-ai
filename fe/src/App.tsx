import { Routes, Route, Navigate } from "react-router";
import SignInPage from "@/pages/auth/SignInPage";
import SignUpPage from "@/pages/auth/SignUpPage";
import OAuth2Callback from "@/pages/auth/OAuth2Callback";
import ProfilePage from "@/pages/profile/ProfilePage";
import ShopPage from "@/pages/ShopPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrdersPage from "@/pages/OrdersPage";
import AdminPage from "@/pages/admin/AdminPage";
import { MainLayout } from "@/components/layout/MainLayout";
import ChatPage from "@/pages/chat/ChatPage.tsx";
import { authService } from "@/services/auth.service";

function AdminRoute({ children }: { children: React.ReactNode }) {
  const isAdmin = authService.isAdmin();
  return isAdmin ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Auth pages – standalone layout (no header/footer) */}
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/oauth2/callback" element={<OAuth2Callback />} />

      {/* Pages with main layout (header + footer + bottom nav) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<ShopPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
          <Route path="/chat-page" element={<ChatPage />}/>
          <Route path="/chat-page/:conversationId" element={<ChatPage />}/>
          <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
      </Route>
      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

