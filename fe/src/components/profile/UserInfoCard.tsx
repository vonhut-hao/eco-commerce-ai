import { useState, useEffect } from "react";
import { Leaf } from "lucide-react";
import { profileService, UserProfile, CreateOrUpdateProfile } from "@/services/profile.service";
import { authService } from "@/services/auth.service";
import { EditProfilePanel } from "./EditProfilePanel";

export function UserInfoCard() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const userId = authService.getUserId();
    if (userId) {
      profileService.getProfile(userId).then(setProfile).catch(console.error);
    }
  }, []);

  const handleSave = async (updated: CreateOrUpdateProfile) => {
    const newProfile = await profileService.updateProfile(updated);
    setProfile(newProfile);
    setEditing(false);
  };

  if (!profile) {
    return <div className="h-40 flex items-center justify-center">Loading...</div>;
  }

  const username = profile.userName;
  const fullName = profile.fullName || username;
  const email = profile.email;
  const initial = profile.userName ? profile.userName.charAt(0).toUpperCase() : "U";

  return (
    <>
      {/* ── Mobile layout: centered column ── */}
      <div className="flex flex-col gap-5 md:hidden">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 relative shadow-md">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-[#8fbf8a] to-[#3d7035]" />
                <span className="absolute inset-0 flex items-center justify-center text-white font-['Nimbus_Sans',sans-serif] font-bold text-4xl select-none">
                  {initial}
                </span>
              </>
            )}
          </div>
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-[#1a1c19] font-['Nimbus_Sans',sans-serif] font-bold text-[20px] leading-tight">
              {fullName}
            </h2>
            {profile.fullName && <p className="text-[#6b7280] text-[13px]">@{username}</p>}
            <span className="inline-flex items-center gap-1 bg-[#f1deb8] text-[#6f6143] text-[11px] px-2.5 py-0.5 rounded-full w-fit tracking-wide mt-0.5">
              <Leaf size={10} /> GREEN CHAMPION
            </span>
          </div>
        </div>
        <div className="bg-[#fafaf5] rounded-lg border border-[#e2e3de] divide-y divide-[#e2e3de]">
          <div className="flex items-center justify-between px-4 py-2.5 gap-3">
            <span className="text-[#6b7280] text-[11px] tracking-widest uppercase shrink-0">Email</span>
            <span className="text-[#1a1c19] text-[13px] text-right truncate">{email}</span>
          </div>
          {profile.phoneNumber && (
            <div className="flex items-center justify-between px-4 py-2.5 gap-3">
              <span className="text-[#6b7280] text-[11px] tracking-widest uppercase shrink-0">Phone</span>
              <span className="text-[#1a1c19] text-[13px] text-right">{profile.phoneNumber}</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setEditing(true)}
          className="cursor-pointer w-full bg-[#25521f] text-white text-[13px] tracking-widest uppercase py-2.5 rounded-full hover:bg-[#1e4219] transition-colors"
        >
          Edit Profile
        </button>
      </div>

      {/* ── Desktop layout: inline ── */}
      <div className="hidden md:flex items-center gap-6">
        <div className="w-[170px] h-[170px] rounded-full overflow-hidden shrink-0 relative shadow-lg">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-[#8fbf8a] to-[#3d7035]" />
              <span className="absolute inset-0 flex items-center justify-center text-white font-['Nimbus_Sans',sans-serif] font-bold text-[80px] select-none">
                {initial}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-col gap-4 flex-1 min-w-0">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-[#1a1c19] font-['Nimbus_Sans',sans-serif] font-bold text-[26px] leading-tight">
                {fullName}
              </h2>
              <span className="inline-flex items-center gap-1 bg-[#f1deb8] text-[#6f6143] text-[11px] px-2.5 py-0.5 rounded-full tracking-[0.275px]">
                <Leaf size={10} /> GREEN CHAMPION
              </span>
            </div>
            <p className="text-[#6b7280] text-[14px]">@{username}</p>
          </div>

          <div className="flex items-start">
            <div className="flex flex-col gap-0.5 pr-6 border-r border-[#e2e3de]">
              <span className="text-[#1a1c19] font-['Nimbus_Sans',sans-serif] font-bold text-[20px] leading-tight">1,250</span>
              <span className="text-[#6b7280] text-[12px]">Green Points</span>
            </div>
            <div className="flex flex-col gap-0.5 px-6 border-r border-[#e2e3de]">
              <span className="text-[#1a1c19] font-['Nimbus_Sans',sans-serif] font-bold text-[20px] leading-tight">32.4kg</span>
              <span className="text-[#6b7280] text-[12px]">CO2e Saved</span>
            </div>
            <div className="flex flex-col gap-0.5 pl-6">
              <span className="text-[#1a1c19] font-['Nimbus_Sans',sans-serif] font-bold text-[20px] leading-tight">3</span>
              <span className="text-[#6b7280] text-[12px]">Orders</span>
            </div>
          </div>

          <div className="flex items-center gap-0 flex-wrap">
            <span className="text-[#6b7280] text-[13px]">{email}</span>
            {profile.phoneNumber && (
              <>
                <span className="text-[#e2e3de] px-2.5">·</span>
                <span className="text-[#6b7280] text-[13px]">{profile.phoneNumber}</span>
              </>
            )}
            <div className="pl-5">
              <button
                onClick={() => setEditing(true)}
                className="cursor-pointer bg-transparent border border-[#c2c9bb] text-[#42493e] text-[13px] tracking-[1.3px] uppercase px-6 py-[5px] rounded-full hover:border-[#25521f] hover:text-[#25521f] transition-colors whitespace-nowrap"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <EditProfilePanel
          profile={profile}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      )}
    </>
  );
}
