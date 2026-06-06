export function AppFooter() {
  return (
    <footer className="bg-[#e2e3de] w-full">
      <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
          <div className="flex flex-col gap-4">
            <span className="text-[#1a1c19] font-['Nimbus_Sans',sans-serif] font-bold text-xl">GreenLife</span>
            <p className="text-[#42493e] text-[14px] leading-[22px] max-w-[200px]">
              Empowering conscious living through curated sustainable products.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-[#1a1c19] text-[13px] tracking-widest uppercase">SUSTAINABILITY</h4>
            <ul className="flex flex-col gap-2">
              {["Green Points Policy", "Carbon Calculator", "Recycling Guide"].map((item) => (
                <li key={item} className="text-[#42493e] text-[14px] opacity-90 cursor-pointer hover:text-[#25521f] transition-colors">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden md:block" />
          <div className="flex flex-col gap-4">
            <h4 className="text-[#1a1c19] text-[13px] tracking-widest uppercase">NEWSLETTER</h4>
            <div className="flex flex-col gap-2">
              <div className="bg-[#fafaf5] border border-[#c2c9bb] rounded-sm px-4 py-3">
                <input type="email" placeholder="email@address.com" className="w-full bg-transparent text-[#6b7280] text-[14px] outline-none" />
              </div>
              <button className="cursor-pointer bg-[#25521f] text-white text-[13px] tracking-widest uppercase py-2.5 rounded-sm hover:bg-[#1e4219] transition-colors">
                JOIN THE MOVEMENT
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-[#c2c9bb] mt-10 pt-6 text-center">
          <p className="text-[#42493e] text-[13px] opacity-70">© 2026 GreenLife. Powered by sustainable hosting.</p>
        </div>
      </div>
    </footer>
  );
}
