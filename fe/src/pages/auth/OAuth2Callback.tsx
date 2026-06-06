import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

export default function OAuth2Callback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search || location.hash.replace(/^#/, ''));
    const token = params.get("token");
    const expiresIn = params.get("expiresIn");

    if (token) {
      localStorage.setItem("accessToken", token);
      if (expiresIn) {
        localStorage.setItem("expiresIn", expiresIn);
      }
      navigate("/profile", { replace: true });
    } else {
      // OAuth failed or no token — go back to sign in
      navigate("/signin", { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf5]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#25521f] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#42493e] text-[16px]">Đang xác thực...</p>
      </div>
    </div>
  );
}
