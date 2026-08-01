import svgPaths from "./svg-70ii59n453";

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
        <p className="leading-[60px] mb-0">Welcome Back to</p>
        <p className="leading-[60px]">Conscious Living</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#42493e] text-[18px] w-full">
        <p className="leading-[29.25px] mb-0">Sign in to continue your sustainable journey. Track your green</p>
        <p className="leading-[29.25px]">impact, manage orders, and discover eco-friendly products.</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start max-w-[512px] relative shrink-0 w-full" data-name="Container">
      <Heading />
      <Container1 />
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

function Container3() {
  return (
    <div className="h-[21px] relative shrink-0 w-[22px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 21">
        <g id="Container">
          <path d={svgPaths.p13774060} fill="var(--fill-0, #42493E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#42493e] text-[12px] tracking-[1.2px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">ECO-CERTIFIED PRODUCTS</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex gap-[8px] items-center left-0 top-[calc(50%-11.5px)]" data-name="Container">
      <Container3 />
      <Container4 />
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[15px] relative shrink-0 w-[22px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 15">
        <g id="Container">
          <path d={svgPaths.p3e801e80} fill="var(--fill-0, #42493E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#42493e] text-[12px] tracking-[1.2px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">TRANSPARENT SUPPLY CHAIN</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex gap-[7.99px] items-center left-[244.8px] top-[calc(50%-11.5px)]" data-name="Container">
      <Container6 />
      <Container7 />
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[16px] relative shrink-0 w-[22px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 16">
        <g id="Container">
          <path d={svgPaths.p146eb80} fill="var(--fill-0, #42493E)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#42493e] text-[12px] tracking-[1.2px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">CARBON-TRACKED SHIPPING</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex gap-[8px] items-center left-0 top-[calc(50%+36.5px)]" data-name="Container">
      <Container9 />
      <Container10 />
    </div>
  );
}

function TrustIndicators() {
  return (
    <div className="h-[97px] relative shrink-0 w-[512px]" data-name="Trust Indicators">
      <div aria-hidden="true" className="absolute border-[rgba(194,201,187,0.3)] border-solid border-t inset-0 pointer-events-none" />
      <Container2 />
      <Container5 />
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
          <TrustIndicators />
        </div>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#25521f] text-[32px] text-center whitespace-nowrap">
        <p className="leading-[40px]">Sign in</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#42493e] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">Enter your credentials to access your account.</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Heading1 />
        <Container12 />
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1a1c19] text-[14px] tracking-[1.3px] uppercase w-full">
        <p className="leading-[20px]">Username or email</p>
      </div>
    </div>
  );
}

function Container14() {
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
          <Container14 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#c2c9bb] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container15() {
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

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Input />
      <Container15 />
    </div>
  );
}

function Username() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Username">
      <Label />
      <Container13 />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1a1c19] text-[14px] tracking-[1.3px] uppercase w-full">
        <p className="leading-[20px]">PASSWORD</p>
      </div>
    </div>
  );
}

function Container17() {
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

function Input1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[11px] pt-[12px] px-[41px] relative size-full">
          <Container17 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#c2c9bb] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container18() {
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

function Container19() {
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
      <Container19 />
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0 w-full" data-name="Container">
      <Input1 />
      <Container18 />
      <Button />
    </div>
  );
}

function Password() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Password">
      <Label1 />
      <Container16 />
    </div>
  );
}

function SubmitButton() {
  return (
    <div className="bg-[#3d6b35] content-stretch flex items-center justify-center py-[12px] relative rounded-[4px] shrink-0 w-full" data-name="Submit Button">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Sign In</p>
      </div>
    </div>
  );
}

function Margin1() {
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
      <Margin1 />
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
        <Password />
        <SubmitButton />
        <Divider />
        <GoogleButton />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#42493e] text-[14px] text-center whitespace-nowrap">
          <p>
            <span className="leading-[21px]">{`Don’t have an account? `}</span>
            <span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-['Nimbus_Sans:Regular',sans-serif] leading-[21px] not-italic text-[#25521f] underline">Create Account</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-white max-w-[448px] relative rounded-[4px] shrink-0 w-[448px]" data-name="Background+Border">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start max-w-[inherit] p-[40px] relative size-full">
        <Container11 />
        <Form />
        <Container20 />
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
          <BackgroundBorder />
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

export default function SignIn() {
  return (
    <div className="content-stretch flex items-start justify-center relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(250, 250, 245) 0%, rgb(250, 250, 245) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Sign in">
      <Main />
    </div>
  );
}