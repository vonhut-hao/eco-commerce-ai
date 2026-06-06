import { Routes, Route, Navigate } from "react-router";
import SignInPage from "@/pages/auth/SignInPage";
import SignUpPage from "@/pages/auth/SignUpPage";
import OAuth2Callback from "@/pages/auth/OAuth2Callback";
import ProfilePage from "@/pages/profile/ProfilePage";
import { MainLayout } from "@/components/layout/MainLayout";

export default function App() {
  return (
    <Routes>
      {/* Auth pages – standalone layout (no header/footer) */}
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/oauth2/callback" element={<OAuth2Callback />} />

      {/* Pages with main layout (header + footer + bottom nav) */}
      <Route element={<MainLayout />}>
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}
