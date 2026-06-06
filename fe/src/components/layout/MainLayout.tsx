import { Outlet } from "react-router";
import { DesktopHeader } from "./DesktopHeader";
import { MobileHeader } from "./MobileHeader";
import { AppFooter } from "./AppFooter";
import { BottomNav } from "./BottomNav";

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf5]">
      <MobileHeader />
      <DesktopHeader />
      <Outlet />
      <AppFooter />
      <BottomNav />
    </div>
  );
}
