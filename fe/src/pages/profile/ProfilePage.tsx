import { UserInfoCard } from "@/components/profile/UserInfoCard";
import { GreenImpactMetrics } from "@/components/profile/GreenImpactMetrics";
import { OrderHistory } from "@/components/profile/OrderHistory";
import { AccountPreferences } from "@/components/profile/AccountPreferences";

export default function ProfilePage() {
  return (
    <main className="flex-1 pb-20 md:pb-0">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-8 md:py-12 flex flex-col gap-10 md:gap-12">

        {/* Profile header — full width */}
        <UserInfoCard />

        {/* Green Impact Metrics */}
        <GreenImpactMetrics />

        {/* Divider */}
        <div className="border-t border-[#c2c9bb]" />

        <OrderHistory />

        {/* Divider */}
        <div className="border-t border-[#c2c9bb]" />

        <AccountPreferences />
      </div>
    </main>
  );
}
