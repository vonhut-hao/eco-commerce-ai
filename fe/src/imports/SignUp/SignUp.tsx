import svgPaths from "./svg-fixyv1ym10";
import imgAvatar from "./7705565c9d1f1ad164d1a412463787770179a8c2.png";
import imgAvatar1 from "./6432783271794e49ead071f5ad7588f1f6e1d48c.png";
import imgAvatar2 from "./838cafac52f51d8d0fd5103a426068cfcde77550.png";

function Header() {
  return (
    <div className="content-stretch flex flex-col items-start py-[20px] relative shrink-0 w-full" data-name="Header">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#25521f] text-[40px] whitespace-nowrap">
        <p className="leading-[56px]">GreenLife</p>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1a1c19] text-[48px] tracking-[-0.96px] w-full">
        <p className="leading-[56px] mb-0">Begin Your</p>
        <p className="leading-[56px]">Sustainable Journey</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#42493e] text-[18px] w-full">
        <p className="leading-[28px] mb-0">Join thousands of conscious consumers making a positive</p>
        <p className="leading-[28px] mb-0">impact. Create your GreenLife account and start earning Green</p>
        <p className="leading-[28px]">Points with every eco-friendly purchase.</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#42493e] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Track your environmental impact</p>
      </div>
    </div>
  );
}

function Item() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Item">
      <div className="bg-[#3d6b35] relative rounded-[12px] shrink-0 size-[8px]" data-name="Background" />
      <Container2 />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#42493e] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Earn Green Points on every order</p>
      </div>
    </div>
  );
}

function Item1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Item">
      <div className="bg-[#3d6b35] relative rounded-[12px] shrink-0 size-[8px]" data-name="Background" />
      <Container3 />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#42493e] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Get personalized eco-product recommendations</p>
      </div>
    </div>
  );
}

function Item2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Item">
      <div className="bg-[#3d6b35] relative rounded-[12px] shrink-0 size-[8px]" data-name="Background" />
      <Container4 />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#42493e] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Access AI-powered sustainability advisor</p>
      </div>
    </div>
  );
}

function Item3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Item">
      <div className="bg-[#3d6b35] relative rounded-[12px] shrink-0 size-[8px]" data-name="Background" />
      <Container5 />
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start pt-[16px] relative shrink-0 w-full" data-name="List">
      <Item />
      <Item1 />
      <Item2 />
      <Item3 />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start max-w-[512px] pb-[48px] relative shrink-0 w-full" data-name="Container">
      <Heading />
      <Container1 />
      <List />
    </div>
  );
}

function Margin() {
  return (
    <div className="flex-[1_0_0] max-w-[512px] min-h-[452px] relative w-[512px]" data-name="Margin">
      <div className="content-stretch flex flex-col items-start max-w-[inherit] min-h-[inherit] pb-[178px] pt-[50px] relative size-full">
        <Container />
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div className="mr-[-16px] pointer-events-none relative rounded-[12px] shrink-0 size-[40px]" data-name="Avatar">
      <div className="absolute inset-0 overflow-hidden rounded-[12px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAvatar} />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#fafaf5] border-solid inset-0 rounded-[12px]" />
    </div>
  );
}

function Avatar1() {
  return (
    <div className="pointer-events-none relative rounded-[12px] shrink-0 size-[40px]" data-name="Avatar">
      <div className="absolute inset-0 overflow-hidden rounded-[12px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAvatar1} />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#fafaf5] border-solid inset-0 rounded-[12px]" />
    </div>
  );
}

function ImgAvatarMargin() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-16px] relative shrink-0 size-[40px]" data-name="Img - Avatar:margin">
      <Avatar1 />
    </div>
  );
}

function Avatar2() {
  return (
    <div className="pointer-events-none relative rounded-[12px] shrink-0 size-[40px]" data-name="Avatar">
      <div className="absolute inset-0 overflow-hidden rounded-[12px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAvatar2} />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#fafaf5] border-solid inset-0 rounded-[12px]" />
    </div>
  );
}

function ImgAvatarMargin1() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-16px] relative shrink-0 size-[40px]" data-name="Img - Avatar:margin">
      <Avatar2 />
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#e8e8e4] content-stretch flex items-center justify-center p-[2px] relative rounded-[12px] shrink-0 size-[40px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border-2 border-[#fafaf5] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#42493e] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">+12k</p>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 size-[40px]" data-name="Margin">
      <BackgroundBorder />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Container">
      <Avatar />
      <ImgAvatarMargin />
      <ImgAvatarMargin1 />
      <Margin1 />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#42493e] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Join 12,000+ conscious shoppers</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Container">
      <Container7 />
      <Container8 />
    </div>
  );
}

function LeftPanelContent() {
  return (
    <div className="bg-[#fafaf5] h-full relative shrink-0 w-[704px]" data-name="Left Panel (Content)">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start justify-between p-[64px] relative size-full">
          <Header />
          <div className="absolute bg-[#e8e8e4] blur-[32px] opacity-50 right-[-128px] rounded-[12px] size-[256px] top-[-128px]" data-name="Decorative element" />
          <Margin />
          <Container6 />
        </div>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#25521f] text-[32px] text-center whitespace-nowrap">
        <p className="leading-[40px]">Create Account</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#42493e] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">Start your GreenLife journey today</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Heading1 />
        <Container10 />
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1a1c19] text-[14px] tracking-[1.3px] uppercase w-full">
        <p className="leading-[20px]">USERNAME</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pb-[2px] pt-px relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] w-full">
          <p className="leading-[normal]">johndoe</p>
        </div>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="relative shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[11px] pl-[41px] pr-[17px] pt-[12px] relative size-full">
          <Container12 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#c2c9bb] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute bottom-[21.43%] content-stretch flex flex-col items-center justify-center left-[12px] top-[21.43%]" data-name="Container">
      <div className="relative shrink-0 size-[16px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <path d={svgPaths.p85bff00} fill="var(--fill-0, #42493E)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Input />
      <Container13 />
    </div>
  );
}

function Username() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Username">
      <Label />
      <Container11 />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1a1c19] text-[14px] tracking-[1.3px] uppercase w-full">
        <p className="leading-[20px]">EMAIL</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pb-[2px] pt-px relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] w-full">
          <p className="leading-[normal]">hello@example.com</p>
        </div>
      </div>
    </div>
  );
}

function Input1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[11px] pl-[41px] pr-[17px] pt-[12px] relative size-full">
          <Container15 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#c2c9bb] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute bottom-[21.43%] content-stretch flex flex-col items-center justify-center left-[12px] top-[21.43%]" data-name="Container">
      <div className="h-[16px] relative shrink-0 w-[20px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 16">
          <path d={svgPaths.p13e73800} fill="var(--fill-0, #42493E)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Input1 />
      <Container16 />
    </div>
  );
}

function Email() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Email">
      <Label1 />
      <Container14 />
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1a1c19] text-[14px] tracking-[1.3px] uppercase w-full">
        <p className="leading-[20px]">PASSWORD</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pb-[2px] pt-px relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] w-full">
          <p className="leading-[normal]">••••••••</p>
        </div>
      </div>
    </div>
  );
}

function Input2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[11px] pt-[12px] px-[41px] relative size-full">
          <Container18 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#c2c9bb] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute bottom-[19.57%] content-stretch flex flex-col items-center justify-center left-[12px] top-[28.26%]" data-name="Container">
      <div className="h-[21px] relative shrink-0 w-[16px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 21">
          <path d={svgPaths.p12930f00} fill="var(--fill-0, #42493E)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[18.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 16.5">
        <g id="Container">
          <path d={svgPaths.pf0742c0} fill="var(--fill-0, #42493E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bottom-[29.79%] content-stretch flex flex-col items-center justify-center right-[12px] top-[38.48%]" data-name="Button">
      <Container20 />
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0 w-full" data-name="Container">
      <Input2 />
      <Container19 />
      <Button />
    </div>
  );
}

function PasswordStrength() {
  return (
    <div className="content-stretch flex gap-[4px] h-[8px] items-start justify-center pt-[4px] relative shrink-0 w-full" data-name="Password Strength">
      <div className="bg-[#3d6b35] flex-[1_0_0] h-full min-w-px relative rounded-[12px]" data-name="Background" />
      <div className="bg-[#3d6b35] flex-[1_0_0] h-full min-w-px relative rounded-[12px]" data-name="Background" />
      <div className="bg-[#3d6b35] flex-[1_0_0] h-full min-w-px relative rounded-[12px]" data-name="Background" />
      <div className="bg-[#e8e8e4] flex-[1_0_0] h-full min-w-px relative rounded-[12px]" data-name="Background" />
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d6b35] text-[10px] text-right whitespace-nowrap">
        <p className="leading-[15px]">Strong</p>
      </div>
    </div>
  );
}

function Password() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Password">
      <Label2 />
      <Container17 />
      <PasswordStrength />
      <Container21 />
    </div>
  );
}

function Label3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1a1c19] text-[14px] tracking-[1.3px] uppercase w-full">
        <p className="leading-[20px]">CONFIRM PASSWORD</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pb-[2px] pt-px relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] w-full">
          <p className="leading-[normal]">••••••••</p>
        </div>
      </div>
    </div>
  );
}

function Input3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[11px] pt-[12px] px-[41px] relative size-full">
          <Container23 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#c2c9bb] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute bottom-[21.43%] content-stretch flex flex-col items-center justify-center left-[12px] top-[21.43%]" data-name="Container">
      <div className="h-[21px] relative shrink-0 w-[16px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 21">
          <path d={svgPaths.p12930f00} fill="var(--fill-0, #42493E)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[18.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 16.5">
        <g id="Container">
          <path d={svgPaths.pf0742c0} fill="var(--fill-0, #42493E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bottom-[32.81%] content-stretch flex flex-col items-center justify-center right-[12px] top-[32.81%]" data-name="Button">
      <Container25 />
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Input3 />
      <Container24 />
      <Button1 />
    </div>
  );
}

function ConfirmPassword() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Confirm Password">
      <Label3 />
      <Container22 />
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0" data-name="Container">
      <div className="relative rounded-[2px] shrink-0 size-[16px]" data-name="Input">
        <div aria-hidden="true" className="absolute border border-[#c2c9bb] border-solid inset-0 pointer-events-none rounded-[2px]" />
      </div>
    </div>
  );
}

function Checkbox() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="Checkbox">
      <Container26 />
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#42493e] text-[14px] whitespace-nowrap">
        <p>
          <span className="leading-[21px]">{`I agree to the `}</span>
          <span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-['Nimbus_Sans:Regular',sans-serif] leading-[21px] not-italic text-[#25521f] underline">Terms of Service</span>
          <span className="leading-[21px]">{` and `}</span>
          <span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-['Nimbus_Sans:Regular',sans-serif] leading-[21px] not-italic text-[#25521f] underline">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}

function SubmitButton() {
  return (
    <div className="bg-[#3d6b35] content-stretch flex items-center justify-center py-[12px] relative rounded-[4px] shrink-0 w-full" data-name="Submit Button">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Create Account</p>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="content-stretch flex flex-col items-start px-[16px] relative shrink-0" data-name="Margin">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#42493e] text-[14px] whitespace-nowrap">
        <p className="leading-[21px]">or continue with</p>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="content-stretch flex items-center py-[8px] relative shrink-0 w-full" data-name="Divider">
      <div className="flex-[1_0_0] h-px min-w-px relative" data-name="Horizontal Divider">
        <div aria-hidden="true" className="absolute border-[#c2c9bb] border-solid border-t inset-0 pointer-events-none" />
      </div>
      <Margin2 />
      <div className="flex-[1_0_0] h-px min-w-px relative" data-name="Horizontal Divider">
        <div aria-hidden="true" className="absolute border-[#c2c9bb] border-solid border-t inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Svg() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path d={svgPaths.p29ad9380} fill="var(--fill-0, #4285F4)" id="Vector" />
          <path d={svgPaths.p73c0a80} fill="var(--fill-0, #34A853)" id="Vector_2" />
          <path d={svgPaths.p1f69ba00} fill="var(--fill-0, #FBBC05)" id="Vector_3" />
          <path d={svgPaths.p3d0b3f00} fill="var(--fill-0, #EA4335)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function GoogleButton() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center px-px py-[13px] relative rounded-[4px] shrink-0 w-full" data-name="Google Button">
      <div aria-hidden="true" className="absolute border border-[#c2c9bb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Svg />
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1a1c19] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Google</p>
      </div>
    </div>
  );
}

function Form() {
  return (
    <div className="relative shrink-0 w-full" data-name="Form">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start pt-[8px] relative size-full">
        <Username />
        <Email />
        <Password />
        <ConfirmPassword />
        <Checkbox />
        <SubmitButton />
        <Divider />
        <GoogleButton />
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#42493e] text-[14px] text-center whitespace-nowrap">
          <p>
            <span className="leading-[21px]">{`Already have an account? `}</span>
            <span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-['Nimbus_Sans:Regular',sans-serif] leading-[21px] not-italic text-[#25521f] underline">Sign In</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-white max-w-[448px] relative rounded-[4px] shrink-0 w-[448px]" data-name="Background+Border">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start max-w-[inherit] p-[40px] relative size-full">
        <Container9 />
        <Form />
        <Container27 />
      </div>
    </div>
  );
}

function RightPanelForm() {
  return (
    <div className="bg-white h-full relative shrink-0 w-[576px]" data-name="Right Panel (Form)">
      <div aria-hidden="true" className="absolute border-[rgba(194,201,187,0.3)] border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[25px] pr-[24px] py-[24px] relative size-full">
          <BackgroundBorder1 />
        </div>
      </div>
    </div>
  );
}

function Main() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start max-w-[1280px] min-w-px relative self-stretch" data-name="Main">
      <LeftPanelContent />
      <RightPanelForm />
    </div>
  );
}

export default function SignUp() {
  return (
    <div className="content-stretch flex items-start justify-center relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(250, 250, 245) 0%, rgb(250, 250, 245) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Sign up">
      <Main />
    </div>
  );
}