function Text() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[32px] not-italic relative shrink-0 text-[24px] text-white whitespace-nowrap">🌱</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[14px] text-white tracking-[0.35px] whitespace-nowrap">GreenLife</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[15px] not-italic relative shrink-0 text-[#a3cc84] text-[10px] tracking-[1px] uppercase whitespace-nowrap">Admin Panel</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[78.938px]" data-name="Container">
      <Container2 />
      <Container3 />
    </div>
  );
}

function Container() {
  return (
    <div className="border-[#3b6323] border-b-[0.667px] border-solid content-stretch flex gap-[8px] items-center px-[16px] py-[20px] relative shrink-0 w-full" data-name="Container">
      <Text />
      <Container1 />
    </div>
  );
}

function Text1() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#cde3b8] text-[16px] text-center whitespace-nowrap">📊</p>
    </div>
  );
}

function Text2() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#cde3b8] text-[14px] text-center whitespace-nowrap">Thống kê</p>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[10px] relative shrink-0 w-full" data-name="Button">
      <Text1 />
      <Text2 />
    </div>
  );
}

function Text3() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#cde3b8] text-[16px] text-center whitespace-nowrap">🌿</p>
    </div>
  );
}

function Text4() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#cde3b8] text-[14px] text-center whitespace-nowrap">Sản phẩm</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex gap-[12px] h-[46px] items-center pb-[10px] pt-[12px] px-[16px] relative shrink-0 w-[224px]" data-name="Button">
      <Text3 />
      <Text4 />
    </div>
  );
}

function Text5() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#cde3b8] text-[16px] text-center whitespace-nowrap">📦</p>
    </div>
  );
}

function Text6() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#cde3b8] text-[14px] text-center whitespace-nowrap">Đơn hàng</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex gap-[12px] h-[46px] items-center pb-[10px] pt-[12px] px-[16px] relative shrink-0 w-[224px]" data-name="Button">
      <Text5 />
      <Text6 />
    </div>
  );
}

function Text7() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#cde3b8] text-[16px] text-center whitespace-nowrap">👤</p>
    </div>
  );
}

function Text8() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#cde3b8] text-[14px] text-center whitespace-nowrap">Người dùng</p>
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex gap-[12px] h-[46px] items-center pb-[10px] pt-[12px] px-[16px] relative shrink-0 w-[224px]" data-name="Button">
      <Text7 />
      <Text8 />
    </div>
  );
}

function Text9() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">🗂️</p>
    </div>
  );
}

function Text10() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">Danh mục</p>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#4a7a2c] content-stretch flex gap-[12px] items-center px-[16px] py-[10px] relative shrink-0 w-[224px]" data-name="Button">
      <Text9 />
      <Text10 />
    </div>
  );
}

function ButtonMargin() {
  return (
    <div className="content-stretch flex flex-col items-center pt-[2px] relative shrink-0 w-full" data-name="Button:margin">
      <Button4 />
    </div>
  );
}

function Text11() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#cde3b8] text-[16px] text-center whitespace-nowrap">🏷️</p>
    </div>
  );
}

function Text12() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#cde3b8] text-[14px] text-center whitespace-nowrap">Mã giảm giá</p>
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex gap-[12px] h-[46px] items-center pb-[10px] pt-[12px] px-[16px] relative shrink-0 w-[224px]" data-name="Button">
      <Text11 />
      <Text12 />
    </div>
  );
}

function Text13() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#cde3b8] text-[16px] text-center whitespace-nowrap">⭐</p>
    </div>
  );
}

function Text14() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#cde3b8] text-[14px] text-center whitespace-nowrap">Đánh giá</p>
    </div>
  );
}

function Button6() {
  return (
    <div className="content-stretch flex gap-[12px] h-[46px] items-center pb-[10px] pt-[12px] px-[16px] relative shrink-0 w-[224px]" data-name="Button">
      <Text13 />
      <Text14 />
    </div>
  );
}

function Text15() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#cde3b8] text-[16px] text-center whitespace-nowrap">🖼️</p>
    </div>
  );
}

function Text16() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#cde3b8] text-[14px] text-center whitespace-nowrap">Banner</p>
    </div>
  );
}

function Button7() {
  return (
    <div className="content-stretch flex gap-[12px] h-[46px] items-center pb-[10px] pt-[12px] px-[16px] relative shrink-0 w-[224px]" data-name="Button">
      <Text15 />
      <Text16 />
    </div>
  );
}

function Navigation() {
  return (
    <div className="content-stretch flex flex-[685.677_0_0] flex-col items-start min-h-px overflow-clip py-[16px] relative w-full" data-name="Navigation">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
      <ButtonMargin />
      <Button5 />
      <Button6 />
      <Button7 />
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-[#3b6323] content-stretch flex items-center justify-center relative rounded-[22369600px] shrink-0 size-[28px]" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[16px] not-italic relative shrink-0 text-[#7ab55a] text-[12px] whitespace-nowrap">A</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Admin</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[13.333px] not-italic relative shrink-0 text-[#7ab55a] text-[10px] whitespace-nowrap">admin@greenlife.vn</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[94.281px]" data-name="Container">
      <Container8 />
      <Container9 />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <Container6 />
      <Container7 />
    </div>
  );
}

function Container4() {
  return (
    <div className="border-[#3b6323] border-solid border-t-[0.667px] content-stretch flex flex-col items-start p-[16px] relative shrink-0 w-full" data-name="Container">
      <Container5 />
    </div>
  );
}

function Sidebar() {
  return (
    <div className="bg-[#243d16] content-stretch flex flex-col h-full items-start relative shrink-0 w-[224px]" data-name="Sidebar">
      <Container />
      <Navigation />
      <Container4 />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="Icon">
          <path d="M2.5 5H17.5" id="Vector" stroke="#6B7C5E" strokeWidth="1.66667" />
          <path d="M2.5 10H17.5" id="Vector_2" stroke="#6B7C5E" strokeWidth="1.66667" />
          <path d="M2.5 15H17.5" id="Vector_3" stroke="#6B7C5E" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-name="Button">
      <Icon />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 1">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1c2513] text-[16px] whitespace-nowrap">Danh mục</p>
    </div>
  );
}

function Text17() {
  return (
    <div className="bg-[#e8f3de] border-[#cde3b8] border-[0.667px] border-solid content-stretch flex flex-col items-start px-[10px] py-[4px] relative rounded-[22369600px] shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#3b6323] text-[12px] whitespace-nowrap">🌿 Eco Dashboard</p>
    </div>
  );
}

function ContainerAlign() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px relative" data-name="Container:align">
      <Text17 />
    </div>
  );
}

function Header() {
  return (
    <div className="bg-white border-[#dae8d0] border-b-[0.667px] border-solid content-stretch flex gap-[16px] items-center px-[24px] py-[14px] relative shrink-0 w-full" data-name="Header">
      <Button8 />
      <Heading />
      <ContainerAlign />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b7c5e] text-[14px] whitespace-nowrap">10 danh mục · 7 danh mục gốc</p>
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-[#3b6323] content-stretch flex items-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">+ Thêm danh mục</p>
    </div>
  );
}

function ButtonAlign() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px relative" data-name="Button:align">
      <Button9 />
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Container">
      <Container12 />
      <ButtonAlign />
    </div>
  );
}

function Container16() {
  return (
    <div className="bg-[#e8f3de] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#3b6323] text-[14px] whitespace-nowrap">H</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#1c2513] text-[14px] whitespace-nowrap">{`Home & Kitchen`}</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6b7c5e] text-[12px] whitespace-nowrap">Sản phẩm nhà bếp thân thiện môi trường</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-[814.885_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Container18 />
      <Container19 />
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#a3cc84] text-[12px] whitespace-nowrap">28 sản phẩm</p>
    </div>
  );
}

function Button10() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative self-stretch shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#4a7a2c] text-[12px] text-center whitespace-nowrap">Sửa</p>
    </div>
  );
}

function Button11() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative self-stretch shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#ff6467] text-[12px] text-center whitespace-nowrap">Xóa</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Container">
      <Button10 />
      <Button11 />
    </div>
  );
}

function Container15() {
  return (
    <div className="bg-[#f4f8f1] border-[#dae8d0] border-b-[0.667px] border-solid content-stretch flex gap-[12px] items-center px-[20px] py-[14px] relative shrink-0 w-[1048.667px]" data-name="Container">
      <Container16 />
      <Container17 />
      <Container20 />
      <Container21 />
    </div>
  );
}

function Text18() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start pr-[4px] relative shrink-0 w-[18px]" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular','Noto_Sans:Regular','Noto_Sans_Math:Regular','Noto_Sans_Symbols:Regular','Noto_Sans_Symbols2:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#cde3b8] text-[14px] whitespace-nowrap">└</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#1c2513] text-[14px] whitespace-nowrap">Cookware</p>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#a3cc84] text-[12px] whitespace-nowrap">Nồi, chảo bền vững</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-[815.5_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Container25 />
      <Container26 />
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#a3cc84] text-[12px] whitespace-nowrap">12 sản phẩm</p>
    </div>
  );
}

function Button12() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative self-stretch shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#4a7a2c] text-[12px] text-center whitespace-nowrap">Sửa</p>
    </div>
  );
}

function Button13() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative self-stretch shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#ff6467] text-[12px] text-center whitespace-nowrap">Xóa</p>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Container">
      <Button12 />
      <Button13 />
    </div>
  );
}

function Container23() {
  return (
    <div className="border-[#f0f5ec] border-b-[0.667px] border-solid content-stretch flex gap-[12px] items-center pl-[40px] pr-[20px] py-[12px] relative shrink-0 w-[1048.667px]" data-name="Container">
      <Text18 />
      <Container24 />
      <Container27 />
      <Container28 />
    </div>
  );
}

function Text19() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start pr-[4px] relative shrink-0 w-[18px]" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular','Noto_Sans:Regular','Noto_Sans_Math:Regular','Noto_Sans_Symbols:Regular','Noto_Sans_Symbols2:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#cde3b8] text-[14px] whitespace-nowrap">└</p>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#1c2513] text-[14px] whitespace-nowrap">Storage</p>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#a3cc84] text-[12px] whitespace-nowrap">Đồ lưu trữ tái sử dụng</p>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-[815.385_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Container31 />
      <Container32 />
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#a3cc84] text-[12px] whitespace-nowrap">16 sản phẩm</p>
    </div>
  );
}

function Button14() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative self-stretch shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#4a7a2c] text-[12px] text-center whitespace-nowrap">Sửa</p>
    </div>
  );
}

function Button15() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative self-stretch shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#ff6467] text-[12px] text-center whitespace-nowrap">Xóa</p>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Container">
      <Button14 />
      <Button15 />
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex gap-[12px] items-center pl-[40px] pr-[20px] py-[12px] relative shrink-0 w-[1048.667px]" data-name="Container">
      <Text19 />
      <Container30 />
      <Container33 />
      <Container34 />
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Container23 />
      <Container29 />
    </div>
  );
}

function Container14() {
  return (
    <div className="bg-white border-[#dae8d0] border-[0.667px] border-solid content-stretch flex flex-col h-[186.667px] items-start overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <Container15 />
      <Container22 />
    </div>
  );
}

function Container37() {
  return (
    <div className="bg-[#e8f3de] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#3b6323] text-[14px] whitespace-nowrap">P</p>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#1c2513] text-[14px] whitespace-nowrap">Personal Care</p>
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6b7c5e] text-[12px] whitespace-nowrap">Chăm sóc cá nhân tự nhiên</p>
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex flex-[814.469_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Container39 />
      <Container40 />
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#a3cc84] text-[12px] whitespace-nowrap">34 sản phẩm</p>
    </div>
  );
}

function Button16() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative self-stretch shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#4a7a2c] text-[12px] text-center whitespace-nowrap">Sửa</p>
    </div>
  );
}

function Button17() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative self-stretch shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#ff6467] text-[12px] text-center whitespace-nowrap">Xóa</p>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Container">
      <Button16 />
      <Button17 />
    </div>
  );
}

function Container36() {
  return (
    <div className="bg-[#f4f8f1] border-[#dae8d0] border-b-[0.667px] border-solid content-stretch flex gap-[12px] items-center px-[20px] py-[14px] relative shrink-0 w-[1048.667px]" data-name="Container">
      <Container37 />
      <Container38 />
      <Container41 />
      <Container42 />
    </div>
  );
}

function Text20() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start pr-[4px] relative shrink-0 w-[18px]" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular','Noto_Sans:Regular','Noto_Sans_Math:Regular','Noto_Sans_Symbols:Regular','Noto_Sans_Symbols2:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#cde3b8] text-[14px] whitespace-nowrap">└</p>
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#1c2513] text-[14px] whitespace-nowrap">Skincare</p>
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#a3cc84] text-[12px] whitespace-nowrap">Chăm sóc da tự nhiên</p>
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex flex-[815.5_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Container45 />
      <Container46 />
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#a3cc84] text-[12px] whitespace-nowrap">21 sản phẩm</p>
    </div>
  );
}

function Button18() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative self-stretch shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#4a7a2c] text-[12px] text-center whitespace-nowrap">Sửa</p>
    </div>
  );
}

function Button19() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative self-stretch shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#ff6467] text-[12px] text-center whitespace-nowrap">Xóa</p>
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Container">
      <Button18 />
      <Button19 />
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex gap-[12px] items-center pl-[40px] pr-[20px] py-[12px] relative shrink-0 w-full" data-name="Container">
      <Text20 />
      <Container44 />
      <Container47 />
      <Container48 />
    </div>
  );
}

function Container35() {
  return (
    <div className="bg-white border-[#dae8d0] border-[0.667px] border-solid content-stretch flex flex-col h-[126px] items-start overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <Container36 />
      <Container43 />
    </div>
  );
}

function ContainerMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[12px] relative shrink-0 w-full" data-name="Container:margin">
      <Container35 />
    </div>
  );
}

function Container51() {
  return (
    <div className="bg-[#e8f3de] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#3b6323] text-[14px] whitespace-nowrap">F</p>
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#1c2513] text-[14px] whitespace-nowrap">Fashion</p>
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6b7c5e] text-[12px] whitespace-nowrap">Thời trang bền vững</p>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-[817.313_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Container53 />
      <Container54 />
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#a3cc84] text-[12px] whitespace-nowrap">19 sản phẩm</p>
    </div>
  );
}

function Button20() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative self-stretch shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#4a7a2c] text-[12px] text-center whitespace-nowrap">Sửa</p>
    </div>
  );
}

function Button21() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative self-stretch shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#ff6467] text-[12px] text-center whitespace-nowrap">Xóa</p>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Container">
      <Button20 />
      <Button21 />
    </div>
  );
}

function Container50() {
  return (
    <div className="bg-[#f4f8f1] border-[#dae8d0] border-b-[0.667px] border-solid content-stretch flex gap-[12px] items-center px-[20px] py-[14px] relative shrink-0 w-[1048.667px]" data-name="Container">
      <Container51 />
      <Container52 />
      <Container55 />
      <Container56 />
    </div>
  );
}

function Container49() {
  return (
    <div className="bg-white border-[#dae8d0] border-[0.667px] border-solid content-stretch flex flex-col h-[66px] items-start overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <Container50 />
    </div>
  );
}

function ContainerMargin1() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[12px] relative shrink-0 w-full" data-name="Container:margin">
      <Container49 />
    </div>
  );
}

function Container59() {
  return (
    <div className="bg-[#e8f3de] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#3b6323] text-[14px] whitespace-nowrap">F</p>
    </div>
  );
}

function Container61() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#1c2513] text-[14px] whitespace-nowrap">{`Food & Beverage`}</p>
    </div>
  );
}

function Container62() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6b7c5e] text-[12px] whitespace-nowrap">{`Thực phẩm & đồ uống hữu cơ`}</p>
    </div>
  );
}

function Container60() {
  return (
    <div className="content-stretch flex flex-[814.99_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Container61 />
      <Container62 />
    </div>
  );
}

function Container63() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#a3cc84] text-[12px] whitespace-nowrap">22 sản phẩm</p>
    </div>
  );
}

function Button22() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative self-stretch shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#4a7a2c] text-[12px] text-center whitespace-nowrap">Sửa</p>
    </div>
  );
}

function Button23() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative self-stretch shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#ff6467] text-[12px] text-center whitespace-nowrap">Xóa</p>
    </div>
  );
}

function Container64() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Container">
      <Button22 />
      <Button23 />
    </div>
  );
}

function Container58() {
  return (
    <div className="bg-[#f4f8f1] border-[#dae8d0] border-b-[0.667px] border-solid content-stretch flex gap-[12px] items-center px-[20px] py-[14px] relative shrink-0 w-[1048.667px]" data-name="Container">
      <Container59 />
      <Container60 />
      <Container63 />
      <Container64 />
    </div>
  );
}

function Container57() {
  return (
    <div className="bg-white border-[#dae8d0] border-[0.667px] border-solid content-stretch flex flex-col h-[66px] items-start overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <Container58 />
    </div>
  );
}

function ContainerMargin2() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[12px] relative shrink-0 w-full" data-name="Container:margin">
      <Container57 />
    </div>
  );
}

function Container67() {
  return (
    <div className="bg-[#e8f3de] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#3b6323] text-[14px] whitespace-nowrap">T</p>
    </div>
  );
}

function Container69() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#1c2513] text-[14px] whitespace-nowrap">Travel</p>
    </div>
  );
}

function Container70() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6b7c5e] text-[12px] whitespace-nowrap">Phụ kiện du lịch xanh</p>
    </div>
  );
}

function Container68() {
  return (
    <div className="content-stretch flex flex-[819.865_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Container69 />
      <Container70 />
    </div>
  );
}

function Container71() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#a3cc84] text-[12px] whitespace-nowrap">11 sản phẩm</p>
    </div>
  );
}

function Button24() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative self-stretch shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#4a7a2c] text-[12px] text-center whitespace-nowrap">Sửa</p>
    </div>
  );
}

function Button25() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative self-stretch shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#ff6467] text-[12px] text-center whitespace-nowrap">Xóa</p>
    </div>
  );
}

function Container72() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Container">
      <Button24 />
      <Button25 />
    </div>
  );
}

function Container66() {
  return (
    <div className="bg-[#f4f8f1] border-[#dae8d0] border-b-[0.667px] border-solid content-stretch flex gap-[12px] items-center px-[20px] py-[14px] relative shrink-0 w-[1048.667px]" data-name="Container">
      <Container67 />
      <Container68 />
      <Container71 />
      <Container72 />
    </div>
  );
}

function Container65() {
  return (
    <div className="bg-white border-[#dae8d0] border-[0.667px] border-solid content-stretch flex flex-col h-[66px] items-start overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <Container66 />
    </div>
  );
}

function ContainerMargin3() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[12px] relative shrink-0 w-full" data-name="Container:margin">
      <Container65 />
    </div>
  );
}

function Container75() {
  return (
    <div className="bg-[#e8f3de] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#3b6323] text-[14px] whitespace-nowrap">O</p>
    </div>
  );
}

function Container77() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#1c2513] text-[14px] whitespace-nowrap">Office</p>
    </div>
  );
}

function Container78() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6b7c5e] text-[12px] whitespace-nowrap">Văn phòng phẩm thân thiện</p>
    </div>
  );
}

function Container76() {
  return (
    <div className="content-stretch flex flex-[822.208_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Container77 />
      <Container78 />
    </div>
  );
}

function Container79() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#a3cc84] text-[12px] whitespace-nowrap">8 sản phẩm</p>
    </div>
  );
}

function Button26() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative self-stretch shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#4a7a2c] text-[12px] text-center whitespace-nowrap">Sửa</p>
    </div>
  );
}

function Button27() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative self-stretch shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#ff6467] text-[12px] text-center whitespace-nowrap">Xóa</p>
    </div>
  );
}

function Container80() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Container">
      <Button26 />
      <Button27 />
    </div>
  );
}

function Container74() {
  return (
    <div className="bg-[#f4f8f1] border-[#dae8d0] border-b-[0.667px] border-solid content-stretch flex gap-[12px] items-center px-[20px] py-[14px] relative shrink-0 w-[1048.667px]" data-name="Container">
      <Container75 />
      <Container76 />
      <Container79 />
      <Container80 />
    </div>
  );
}

function Container73() {
  return (
    <div className="bg-white border-[#dae8d0] border-[0.667px] border-solid content-stretch flex flex-col h-[66px] items-start overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <Container74 />
    </div>
  );
}

function ContainerMargin4() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[12px] relative shrink-0 w-full" data-name="Container:margin">
      <Container73 />
    </div>
  );
}

function Container83() {
  return (
    <div className="bg-[#e8f3de] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic relative shrink-0 text-[#3b6323] text-[14px] whitespace-nowrap">P</p>
    </div>
  );
}

function Container85() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#1c2513] text-[14px] whitespace-nowrap">Pet</p>
    </div>
  );
}

function Container86() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6b7c5e] text-[12px] whitespace-nowrap">Sản phẩm thú cưng tự nhiên</p>
    </div>
  );
}

function Container84() {
  return (
    <div className="content-stretch flex flex-[822.844_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Container85 />
      <Container86 />
    </div>
  );
}

function Container87() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#a3cc84] text-[12px] whitespace-nowrap">7 sản phẩm</p>
    </div>
  );
}

function Button28() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative self-stretch shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#4a7a2c] text-[12px] text-center whitespace-nowrap">Sửa</p>
    </div>
  );
}

function Button29() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative self-stretch shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#ff6467] text-[12px] text-center whitespace-nowrap">Xóa</p>
    </div>
  );
}

function Container88() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Container">
      <Button28 />
      <Button29 />
    </div>
  );
}

function Container82() {
  return (
    <div className="bg-[#f4f8f1] border-[#dae8d0] border-b-[0.667px] border-solid content-stretch flex gap-[12px] items-center px-[20px] py-[14px] relative shrink-0 w-[1048.667px]" data-name="Container">
      <Container83 />
      <Container84 />
      <Container87 />
      <Container88 />
    </div>
  );
}

function Container81() {
  return (
    <div className="bg-white border-[#dae8d0] border-[0.667px] border-solid content-stretch flex flex-col h-[66px] items-start overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <Container82 />
    </div>
  );
}

function ContainerMargin5() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[12px] relative shrink-0 w-full" data-name="Container:margin">
      <Container81 />
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col h-[730.667px] items-start pt-[16px] relative shrink-0 w-[1050px]" data-name="Container">
      <Container14 />
      <ContainerMargin />
      <ContainerMargin1 />
      <ContainerMargin2 />
      <ContainerMargin3 />
      <ContainerMargin4 />
      <ContainerMargin5 />
    </div>
  );
}

function Categories() {
  return (
    <div className="content-stretch flex flex-col h-[782.667px] items-start pb-[16px] relative shrink-0 w-[1050px]" data-name="Categories">
      <Container11 />
      <Container13 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="content-stretch flex flex-[769.333_0_0] flex-col items-start min-h-px overflow-clip p-[24px] relative w-full" data-name="Main Content">
      <Categories />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-[1098_0_0] flex-col h-full items-start min-w-px overflow-clip relative" data-name="Container">
      <Header />
      <MainContent />
    </div>
  );
}

function App() {
  return (
    <div className="bg-[#f4f8f1] content-stretch flex h-[823.333px] items-start overflow-clip relative shrink-0 w-[1322px]" data-name="App">
      <Sidebar />
      <Container10 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 2">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1c2513] text-[16px] whitespace-nowrap">Thêm danh mục</p>
    </div>
  );
}

function Button30() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Regular','Noto_Sans:Regular','Noto_Sans_Math:Regular','Noto_Sans_Symbols:Regular','Noto_Sans_Symbols2:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#6b7c5e] text-[16px] text-center whitespace-nowrap">✕</p>
    </div>
  );
}

function Container90() {
  return (
    <div className="border-[#dae8d0] border-b-[0.667px] border-solid content-stretch flex items-center justify-between px-[24px] py-[16px] relative shrink-0 w-full" data-name="Container">
      <Heading1 />
      <Button30 />
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start pb-[4px] relative shrink-0 w-[400px]" data-name="Label">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#6b7c5e] text-[12px] whitespace-nowrap">Tên danh mục *</p>
    </div>
  );
}

function TextInput() {
  return <div className="border-[#dae8d0] border-[0.667px] border-solid h-[37.333px] relative rounded-[8px] shrink-0 w-full" data-name="Text Input" />;
}

function Container92() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Label />
      <TextInput />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start pb-[4px] relative shrink-0 w-[400px]" data-name="Label">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#6b7c5e] text-[12px] whitespace-nowrap">Mô tả</p>
    </div>
  );
}

function TextArea() {
  return <div className="absolute border-[#dae8d0] border-[0.667px] border-solid h-[57.333px] left-0 rounded-[8px] top-0 w-[400px]" data-name="Text Area" />;
}

function Container94() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="Container">
      <TextArea />
    </div>
  );
}

function Container93() {
  return (
    <div className="content-stretch flex flex-col h-[100px] items-start pt-[16px] relative shrink-0 w-[400px]" data-name="Container">
      <Label1 />
      <Container94 />
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start pb-[4px] relative shrink-0 w-[400px]" data-name="Label">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#6b7c5e] text-[12px] whitespace-nowrap">Danh mục cha (để trống nếu là danh mục gốc)</p>
    </div>
  );
}

function Container96() {
  return (
    <div className="absolute content-stretch flex h-[18px] items-center left-[16px] overflow-clip top-[8px] w-[354.667px]" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#1c2513] text-[14px] whitespace-nowrap">— Không có (danh mục gốc) —</p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[6px] relative shrink-0 w-[10px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="6" preserveAspectRatio="none" viewBox="0 0 10 6" width="10">
        <g id="Icon">
          <path d="M1 1L5 5L9 1" id="Vector" stroke="#1C2513" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Container97() {
  return (
    <div className="absolute content-stretch flex h-[34px] items-center justify-center left-[379.67px] top-0 w-[20px]" data-name="Container">
      <Icon1 />
    </div>
  );
}

function Dropdown() {
  return (
    <div className="border-[#dae8d0] border-[0.667px] border-solid h-[35.333px] relative rounded-[8px] shrink-0 w-full" data-name="Dropdown">
      <Container96 />
      <Container97 />
    </div>
  );
}

function Container95() {
  return (
    <div className="content-stretch flex flex-col h-[71.333px] items-start pt-[16px] relative shrink-0 w-[400px]" data-name="Container">
      <Label2 />
      <Dropdown />
    </div>
  );
}

function Container91() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[20px] relative shrink-0 w-full" data-name="Container">
      <Container92 />
      <Container93 />
      <Container95 />
    </div>
  );
}

function Button31() {
  return (
    <div className="border-[#dae8d0] border-[0.667px] border-solid content-stretch flex flex-col h-full items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b7c5e] text-[14px] text-center whitespace-nowrap">Hủy</p>
    </div>
  );
}

function Button32() {
  return (
    <div className="bg-[#3b6323] content-stretch flex flex-col h-full items-center justify-center opacity-50 px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">Thêm</p>
    </div>
  );
}

function Container98() {
  return (
    <div className="border-[#dae8d0] border-solid border-t-[0.667px] content-stretch flex gap-[12px] h-[70px] items-start justify-end px-[24px] py-[16px] relative shrink-0 w-full" data-name="Container">
      <Button31 />
      <Button32 />
    </div>
  );
}

function Container89() {
  return (
    <div className="bg-white content-stretch drop-shadow-[0px_20px_12.5px_rgba(0,0,0,0.1),0px_8px_5px_rgba(0,0,0,0.1)] flex flex-col items-start max-w-[448px] relative rounded-[16px] shrink-0 w-[448px]" data-name="Container">
      <Container90 />
      <Container91 />
      <Container98 />
    </div>
  );
}

function Categories1() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.3)] content-stretch flex h-[823.333px] items-center justify-center left-0 p-[16px] top-0 w-[1322px]" data-name="Categories">
      <Container89 />
    </div>
  );
}

export default function AdminPanelDesign() {
  return (
    <div className="bg-[#f4f8f1] content-stretch flex flex-col items-start relative size-full" data-name="Admin Panel Design">
      <App />
      <Categories1 />
    </div>
  );
}