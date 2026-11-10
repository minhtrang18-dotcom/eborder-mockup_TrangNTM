import React, { useEffect } from 'react';
import { Printer, X, ArrowLeft, Download } from 'lucide-react';
import { Button } from '../ui/Button';

export interface PrintableFormData {
  maHoSo?: string;
  loaiThuTuc: 'CAP_SO' | 'TAM_THOI' | 'CAP_DOI' | string;
  fullName: string;
  fullNameLatin: string;
  dob: string;
  gender: string;
  ethnicity?: string;
  religion?: string;
  nationality?: string;
  occupation?: string;
  ngheNghiep?: string;
  ngheNghiepKhac?: string;
  occupationDetail?: string;
  hairColor?: string;
  mauToc?: string;
  mauTocKhac?: string;
  hairColorDetail?: string;
  eyeColor?: string;
  mauMat?: string;
  mauMatKhac?: string;
  eyeColorDetail?: string;
  tripPurpose?: string;
  tripPurposeDetail?: string;
  validityStartDate?: string;
  validityEndDate?: string;
  portraitImgUrl?: string;
  birthVillage: string;
  birthDistrict: string;
  birthProvince: string;
  resVillage: string;
  resUnit: string;
  resDistrict: string;
  resProvince: string;
  nationalId: string;
  idIssueDate: string;
  idIssuePlace: string;
  householdBookNo: string;
  householdIssueDate: string;
  householdIssuePlace: string;
  heightCm: string;
  scars?: string;
  scarsLocation?: string;
  children?: Array<{
    fullName: string;
    fullNameLatin: string;
    citizenId?: string;
    dob: string;
    gender: string;
  }>;
  createdDate?: string;
  donViTiepNhan?: string;
  truongHopDeNghi?: string;
  lyDoCuThe?: string;
  procedure?: 'cap-so' | 'tam-thoi';
}

interface PrintableApplicationFormProps {
  data: PrintableFormData;
  onClose: () => void;
  autoPrint?: boolean;
  procedure?: 'cap-so' | 'tam-thoi';
}

export const PrintableApplicationForm: React.FC<PrintableApplicationFormProps> = ({
  data,
  onClose,
  autoPrint = false,
  procedure,
}) => {
  useEffect(() => {
    if (autoPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [autoPrint]);

  // Xác định ô tick
  const isCapSo =
    data.loaiThuTuc === 'CAP_SO' ||
    data.loaiThuTuc === 'Cấp sổ thông hành' ||
    data.loaiThuTuc === 'ຂໍອອກໜັງສືຜ່ານແດນ';

  const isTamThoi =
    procedure === 'tam-thoi' ||
    data.procedure === 'tam-thoi' ||
    data.loaiThuTuc === 'TAM_THOI' ||
    data.loaiThuTuc === 'tam-thoi' ||
    data.loaiThuTuc === 'Cấp giấy thông hành tạm thời' ||
    data.loaiThuTuc === 'ຂໍໜັງສືຜ່ານແດນຊົ່ວຄາວ';

  const isCapDoi =
    data.loaiThuTuc === 'CAP_DOI' ||
    data.loaiThuTuc === 'Cấp đổi sổ thông hành' ||
    data.loaiThuTuc === 'ປ່ຽນໜັງສືຜ່ານແດນ';

  // Lấy ngày tháng năm hiện tại
  const now = new Date();
  const currentDay = now.getDate().toString().padStart(2, '0');
  const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
  const currentYear = now.getFullYear();

  // Helper format ngày: YYYY-MM-DD -> DD/MM/YYYY
  const formatDisplayDate = (dStr?: string) => {
    if (!dStr) return '....................';
    if (dStr.includes('-')) {
      const parts = dStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }
    return dStr;
  };

  // Helper format chiều cao từ cm sang m: 172 -> 1.72 m
  const formatHeightInMeters = (cmVal?: string | number) => {
    const n = Number(cmVal);
    if (!cmVal || isNaN(n) || n <= 0) return '...... m';
    return `${(n / 100).toFixed(2)} m`;
  };

  // KHI LÀ GIẤY THÔNG HÀNH BIÊN GIỚI TẠM THỜI -> ÁP DỤNG MẪU KHỔ A5 NGANG CHUẨN
  if (isTamThoi) {
    const fullNameClean = (data.fullName || '').trim();
    const nameParts = fullNameClean.split(/\s+/);
    const ho = nameParts.length > 1 ? nameParts[0] : '';
    const ten = nameParts.length > 1 ? nameParts.slice(1).join(' ') : fullNameClean;

    // Địa chỉ: Bản/Huyện/Tỉnh (lấy nơi đăng ký khai sinh, nếu không có thì lấy nơi thường trú)
    const birthPlace = [
      data.birthVillage ? `Bản ${data.birthVillage}` : '',
      data.birthDistrict ? `Huyện ${data.birthDistrict}` : '',
      data.birthProvince ? `Tỉnh ${data.birthProvince}` : '',
    ].filter(Boolean).join(', ');

    const resPlace = [
      data.resVillage ? `Bản ${data.resVillage}` : '',
      data.resDistrict ? `Huyện ${data.resDistrict}` : '',
      data.resProvince ? `Tỉnh ${data.resProvince}` : '',
    ].filter(Boolean).join(', ');

    const displayLocation = birthPlace || resPlace || '................................................';

    // Mục đích chuyến đi (nếu "Khác" thì in nội dung cụ thể)
    const displayPurpose = data.tripPurpose === 'Khác'
      ? (data.tripPurposeDetail || 'Khác')
      : (data.tripPurpose || '........................');

    // Nghề nghiệp: nếu chọn "Khác" thì in nội dung đã nhập tay (không in chữ "Khác"); các trường hợp còn lại in giá trị đã chọn.
    const displayOccupation =
      data.occupation === 'Khác' || data.ngheNghiep === 'Khác'
        ? (data.ngheNghiepKhac || data.occupationDetail || '').trim() || '................'
        : (data.occupation || data.ngheNghiep || '................');

    // Màu tóc: nếu chọn "Khác" thì in nội dung đã nhập tay (không in chữ "Khác"); các trường hợp còn lại in giá trị đã chọn.
    const displayHairColor =
      data.hairColor === 'Khác' || data.mauToc === 'Khác'
        ? (data.mauTocKhac || data.hairColorDetail || '').trim() || '......'
        : (data.hairColor || data.mauToc || '......');

    // Màu mắt: nếu chọn "Khác" thì in nội dung đã nhập tay (không in chữ "Khác"); các trường hợp còn lại in giá trị đã chọn.
    const displayEyeColor =
      data.eyeColor === 'Khác' || data.mauMat === 'Khác'
        ? (data.mauMatKhac || data.eyeColorDetail || '').trim() || '......'
        : (data.eyeColor || data.mauMat || '......');

    // 4 ô Trẻ em đi cùng dưới 12 tuổi (mỗi ô in Họ, Tên, Ngày tháng năm sinh của trẻ đã khai, ô thừa để trống)
    const childList = (data.children || []).slice(0, 4);
    const childBoxes = [0, 1, 2, 3].map((idx) => {
      const child = childList[idx];
      return {
        idx: idx + 1,
        hasChild: !!child,
        name: child ? (child.fullName || child.fullNameLatin || '') : '',
        dob: child?.dob ? formatDisplayDate(child.dob) : '',
      };
    });

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex flex-col items-center justify-start p-2 sm:p-6 print:p-0 print:bg-white print:static print:overflow-visible">
        {/* Thanh công cụ xem trước (ẨN KHI IN THẬT bằng class no-print) */}
        <div className="no-print w-full max-w-[880px] bg-white border border-[#D9E1DC] rounded-t-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md mb-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Đóng
            </Button>
            <span className="text-[13px] text-[#006B3F] font-semibold bg-[#E8F3EE] px-2.5 py-1 rounded-full border border-[#B0DFCA]">
              Khổ A5 ngang • Giấy thông hành biên giới tạm thời
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.print()}
              icon={<Download className="w-4 h-4 text-[#006B3F]" />}
            >
              Tải PDF
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => window.print()}
              icon={<Printer className="w-4 h-4" />}
            >
              In phiếu
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#6B7280] hover:text-[#1F2937] rounded hover:bg-[#F5F7F6] cursor-pointer"
              title="Đóng cửa sổ xem trước"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TỜ ĐƠN KHỔ A5 NGANG THEO ĐÚNG MẪU YÊU CẦU */}
        <div
          id="printable-paper"
          className="w-full max-w-[880px] bg-white text-black shadow-2xl p-6 sm:p-7 print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none print:h-auto border border-[#D9E1DC] print:border-none font-serif text-[12.5px] leading-snug select-text"
          style={{
            fontFamily: '"Times New Roman", Times, serif',
          }}
        >
          {/* CSS NHÚNG CHO TRANG IN KHỔ A5 NGANG */}
          <style dangerouslySetInnerHTML={{
            __html: `
              @media print {
                @page {
                  size: A5 landscape;
                  margin: 6mm 8mm;
                }
                body * {
                  visibility: hidden;
                }
                #printable-paper, #printable-paper * {
                  visibility: visible;
                }
                #printable-paper {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 210mm !important;
                  max-width: 210mm !important;
                  height: 148mm !important;
                  max-height: 148mm !important;
                  margin: 0 !important;
                  padding: 6mm 8mm !important;
                  box-shadow: none !important;
                  border: none !important;
                  box-sizing: border-box;
                  page-break-after: avoid;
                  overflow: hidden !important;
                }
                .no-print {
                  display: none !important;
                }
              }
            `
          }} />

          {/* 1. ĐẦU GIẤY */}
          <div className="flex items-start justify-between border-b border-black pb-2.5 mb-2.5">
            {/* Cơ quan bên trái */}
            <div className="space-y-0.5">
              <p className="font-bold text-[13px] uppercase tracking-wide">
                CỘNG HÒA DÂN CHỦ NHÂN DÂN LÀO
              </p>
              <p className="font-bold text-[12px] uppercase">
                Tổng cục Cảnh sát
              </p>
              <p className="font-semibold text-[11.5px]">
                Cảnh sát Quản lý xuất nhập cảnh
              </p>
            </div>

            {/* Tiêu đề lớn chính giữa */}
            <div className="text-center px-2 flex-1">
              <h1 className="text-[17px] sm:text-[19px] font-bold uppercase tracking-wider text-black">
                GIẤY THÔNG HÀNH BIÊN GIỚI TẠM THỜI
              </h1>
              {data.maHoSo && (
                <p className="text-[10px] text-gray-500 font-sans tracking-wide mt-0.5">
                  Mã hồ sơ: {data.maHoSo}
                </p>
              )}
            </div>

            {/* Góc trên bên phải: "Đơn số: ......  Số: ......" (để trống) + Ô vuông QR (placeholder, để trống) */}
            <div className="flex items-start gap-2.5 text-right">
              <div className="text-[11px] leading-tight pt-0.5 text-left">
                <p>Đơn số: ....................</p>
                <p className="mt-1">Số: ....................</p>
              </div>
              <div className="w-[52px] h-[52px] border-2 border-black border-dashed flex flex-col items-center justify-center p-1 shrink-0 text-center bg-gray-50">
                <span className="text-[9px] font-sans font-bold text-gray-400">QR CODE</span>
              </div>
            </div>
          </div>

          {/* 2. THÂN GIẤY (Bên trái & Bên phải) */}
          <div className="grid grid-cols-12 gap-3.5 items-start">
            {/* Bên trái: khung ảnh 3x4 hiển thị ảnh chân dung đã tải; dưới ảnh dòng "Chữ ký hoặc dấu vân tay ngón cái phải" (để trống) */}
            <div className="col-span-3 flex flex-col items-center text-center">
              <div className="w-[105px] h-[140px] border border-black overflow-hidden flex flex-col items-center justify-center bg-gray-100 shadow-2xs">
                {data.portraitImgUrl ? (
                  <img
                    src={data.portraitImgUrl}
                    alt="Ảnh chân dung"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-2 text-center text-gray-400 text-[10.5px]">
                    Ảnh 3x4 cm
                  </div>
                )}
              </div>
              <div className="text-[10.5px] italic leading-tight mt-1 text-gray-800">
                <p className="font-medium">Chữ ký hoặc dấu vân tay</p>
                <p className="font-medium">ngón cái phải</p>
                <div className="h-10"></div>
              </div>
            </div>

            {/* Bên phải điền sẵn: Họ, Tên, Quốc tịch, Nghề nghiệp, Ngày tháng năm sinh; Bản/Huyện/Tỉnh; Thẻ căn cước số; Giới tính; Mục đích chuyến đi; Đặc điểm nhận dạng: cao ... m, tóc ..., mắt ...; Thời hạn 03 ngày, từ ngày ... đến ngày ...; Cấp tại: ... và Ngày: ... để trống */}
            {/* KHÔNG in Dân tộc, Tôn giáo, Vết sẹo lên giấy */}
            <div className="col-span-9 space-y-1.5 text-[12px] leading-snug pl-1">
              {/* Họ, Tên */}
              <div className="flex flex-wrap items-baseline gap-x-3">
                <div>
                  Họ: <strong className="underline decoration-dotted underline-offset-2">{ho || '................'}</strong>
                </div>
                <div>
                  Tên: <strong className="underline decoration-dotted underline-offset-2">{ten || '................'}</strong>
                </div>
                {data.fullNameLatin && (
                  <div className="text-gray-700 italic">
                    (Latin: {data.fullNameLatin})
                  </div>
                )}
              </div>

              {/* Quốc tịch & Nghề nghiệp */}
              <div className="flex flex-wrap items-baseline gap-x-4">
                <div>
                  Quốc tịch: <strong className="underline decoration-dotted underline-offset-2">{data.nationality || 'Lào'}</strong>
                </div>
                <div>
                  Nghề nghiệp: <strong className="underline decoration-dotted underline-offset-2">{displayOccupation}</strong>
                </div>
              </div>

              {/* Ngày tháng năm sinh & Giới tính */}
              <div className="flex flex-wrap items-baseline gap-x-4">
                <div>
                  Ngày tháng năm sinh: <strong className="underline decoration-dotted underline-offset-2">{formatDisplayDate(data.dob)}</strong>
                </div>
                <div>
                  Giới tính: <strong className="underline decoration-dotted underline-offset-2">{data.gender || '................'}</strong>
                </div>
              </div>

              {/* Bản/Huyện/Tỉnh (lấy nơi đăng ký khai sinh, nếu không có thì lấy nơi thường trú) */}
              <div>
                Bản/Huyện/Tỉnh: <strong className="underline decoration-dotted underline-offset-2">{displayLocation}</strong>
              </div>

              {/* Thẻ căn cước số */}
              <div>
                Thẻ căn cước số: <strong className="underline decoration-dotted underline-offset-2 font-mono">{data.nationalId || '................'}</strong>
              </div>

              {/* Mục đích chuyến đi (nếu "Khác" thì in nội dung cụ thể) */}
              <div>
                Mục đích chuyến đi: <strong className="underline decoration-dotted underline-offset-2">{displayPurpose}</strong>
              </div>

              {/* Đặc điểm nhận dạng: cao ... m, tóc ..., mắt ... (chiều cao đổi cm sang m, 2 chữ số thập phân) */}
              <div>
                Đặc điểm nhận dạng: cao <strong className="underline decoration-dotted underline-offset-2">{formatHeightInMeters(data.heightCm)}</strong>, tóc <strong className="underline decoration-dotted underline-offset-2">{displayHairColor}</strong>, mắt <strong className="underline decoration-dotted underline-offset-2">{displayEyeColor}</strong>
              </div>

              {/* Thời hạn 03 ngày, từ ngày ... đến ngày ... */}
              <div>
                Thời hạn 03 ngày, từ ngày <strong className="underline decoration-dotted underline-offset-2">{formatDisplayDate(data.validityStartDate)}</strong> đến ngày <strong className="underline decoration-dotted underline-offset-2">{formatDisplayDate(data.validityEndDate)}</strong>
              </div>

              {/* Cấp tại: ...... và Ngày: ...... để trống */}
              <div className="flex flex-wrap items-baseline justify-between pt-0.5">
                <div>
                  Cấp tại: ................................................................
                </div>
                <div>
                  Ngày: ...... tháng ...... năm 20...
                </div>
              </div>
            </div>
          </div>

          {/* 3. MỤC TRẺ EM ĐI CÙNG DƯỚI 12 TUỔI (4 ô, mỗi ô in Họ, Tên, Ngày tháng năm sinh của trẻ đã khai, ô thừa để trống) */}
          <div className="mt-2.5 pt-2 border-t border-gray-400">
            <p className="font-bold text-[11.5px] uppercase tracking-wide mb-1">
              Trẻ em đi cùng dưới 12 tuổi:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10.5px]">
              {childBoxes.map((box) => (
                <div
                  key={box.idx}
                  className="border border-black p-1.5 rounded-xs min-h-[46px] flex flex-col justify-between bg-white"
                >
                  <div className="font-bold text-[10px] text-gray-800">
                    Ô {box.idx}:
                  </div>
                  <div className="leading-tight">
                    <div>
                      Họ, Tên: <span className="font-semibold">{box.hasChild ? box.name : '........................'}</span>
                    </div>
                    <div>
                      Ngày sinh: <span className="font-semibold">{box.hasChild ? box.dob : '................'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. CUỐI GIẤY: "Chữ ký và đóng dấu của cán bộ" (để trống) */}
          <div className="mt-2 flex justify-end text-center">
            <div className="w-56 pr-2">
              <p className="font-bold text-[12px]">
                Chữ ký và đóng dấu của cán bộ
              </p>
              <div className="h-12"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex flex-col items-center justify-start p-2 sm:p-6 print:p-0 print:bg-white print:static print:overflow-visible">
      {/* Thanh công cụ xem trước (ẨN KHI IN THẬT bằng class no-print) */}
      <div className="no-print w-full max-w-[840px] bg-white border border-[#D9E1DC] rounded-t-xl px-4 py-3 flex items-center justify-between shadow-md mb-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Đóng
          </Button>
          <span className="text-[13px] text-[#6B7280] hidden sm:inline">
            Xem trước bản in (Khổ giấy A4 tiêu chuẩn)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.print()}
            icon={<Download className="w-4 h-4 text-[#006B3F]" />}
          >
            Tải PDF
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => window.print()}
            icon={<Printer className="w-4 h-4" />}
          >
            In phiếu ngay
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#6B7280] hover:text-[#1F2937] rounded hover:bg-[#F5F7F6]"
            title="Đóng cửa sổ in"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* TỜ ĐƠN A4 CHÍNH THỨC - DÙNG FONT TIMES NEW ROMAN CHO ĐÚNG CHUẨN VĂN BẢN HÀNH CHÍNH */}
      <div
        id="printable-paper"
        className="w-full max-w-[840px] bg-white text-black shadow-2xl p-8 sm:p-12 print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none print:h-auto min-h-[1100px] border border-[#D9E1DC] print:border-none font-serif text-[14px] leading-relaxed select-text"
        style={{
          fontFamily: '"Times New Roman", Times, serif',
        }}
      >
        {/* CSS NHÚNG CHO TRANG IN KHỔ A4 */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body * {
                visibility: hidden;
              }
              #printable-paper, #printable-paper * {
                visibility: visible;
              }
              #printable-paper {
                position: absolute;
                left: 0;
                top: 0;
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 12mm 15mm !important;
                box-shadow: none !important;
                border: none !important;
              }
              .no-print {
                display: none !important;
              }
              @page {
                size: A4 portrait;
                margin: 10mm 15mm;
              }
            }
          `
        }} />

        {/* 1 & 2. HEADER: BÊN TRÁI & BÊN PHẢI */}
        <div className="grid grid-cols-2 gap-4 items-start pb-4">
          {/* Góc trên bên trái: Quốc huy Lào (placeholder tròn) + 3 dòng cơ quan */}
          <div className="flex items-start gap-3">
            {/* Biểu trưng quốc huy tròn */}
            <div className="w-14 h-14 rounded-full border-2 border-black flex flex-col items-center justify-center p-1 shrink-0 text-center">
              <span className="text-[9px] font-bold uppercase tracking-tighter">QUỐC HUY</span>
              <span className="text-[14px] leading-none">🇱🇦</span>
            </div>
            <div className="text-[13px] leading-snug">
              <p className="font-bold uppercase">Bộ Tư lệnh Công an tỉnh</p>
              <p className="font-semibold">Phòng An ninh Công an tỉnh</p>
              <p className="text-[12px] italic">Bộ phận quản lý xuất - nhập cảnh</p>
              {data.maHoSo && (
                <p className="text-[11px] font-mono mt-1 text-gray-700">
                  Số HS: <strong>{data.maHoSo}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Góc trên bên phải: Quốc hiệu & Tiêu ngữ */}
          <div className="text-center space-y-1">
            <p className="font-bold text-[14px] uppercase tracking-wide">
              Cộng hòa Dân chủ Nhân dân Lào
            </p>
            <p className="font-semibold text-[13px]">
              Hòa bình Độc lập Dân chủ Thống nhất Thịnh vượng
            </p>
            <p className="text-[12px] tracking-widest text-gray-700">
              ........ ⚜⚜⚜ 000 ⚜⚜⚜ ........
            </p>
          </div>
        </div>

        {/* 3. TIÊU ĐỀ CHÍNH GIỮA TRANG */}
        {isTamThoi || data.procedure === 'tam-thoi' ? (
          <div className="text-center pt-4 pb-2">
            <h1 className="text-[20px] sm:text-[22px] font-bold uppercase tracking-wider">
              ĐƠN ĐỀ NGHỊ CẤP GIẤY THÔNG HÀNH SỬ DỤNG MỘT LẦN
            </h1>
          </div>
        ) : (
          <div className="text-center pt-4 pb-3">
            <h1 className="text-[22px] font-bold uppercase tracking-wider">
              ĐƠN ĐỀ NGHỊ
            </h1>
          </div>
        )}

        {/* 4. DÒNG THỦ TỤC: TICK BOX CHO CẤP SỔ / ĐƠN VỊ TIẾP NHẬN & TRƯỜNG HỢP CHO TẠM THỜI */}
        {!(isTamThoi || data.procedure === 'tam-thoi') ? (
          <div className="text-center text-[13.5px] pb-5 border-b border-gray-400">
            <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
              <span className="inline-flex items-center gap-1.5">
                <span>Đề nghị cấp Sổ thông hành</span>
                <span className="text-[16px] font-bold font-sans">
                  {isCapSo ? '☑' : '☐'}
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span>Giấy thông hành sử dụng một lần</span>
                <span className="text-[16px] font-bold font-sans">
                  {isTamThoi ? '☑' : '☐'}
                </span>
              </span>

              <span>và</span>

              <span className="inline-flex items-center gap-1.5">
                <span>Đổi Sổ thông hành</span>
                <span className="text-[16px] font-bold font-sans">
                  {isCapDoi ? '☑' : '☐'}
                </span>
              </span>
            </div>
          </div>
        ) : (
          <div className="pb-4 pt-1 border-b border-gray-400 space-y-1.5 text-[14px]">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-semibold">Đơn vị tiếp nhận:</span>
              <span className="font-semibold underline decoration-dotted underline-offset-4 flex-1">
                {data.donViTiepNhan || '—'}
              </span>
            </div>
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-semibold">Trường hợp đề nghị:</span>
              <span className="font-semibold underline decoration-dotted underline-offset-4 flex-1">
                {data.truongHopDeNghi || '—'}
              </span>
            </div>
            {data.lyDoCuThe && (
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-semibold">Lý do cụ thể:</span>
                <span className="underline decoration-dotted underline-offset-4 flex-1">
                  {data.lyDoCuThe}
                </span>
              </div>
            )}
          </div>
        )}

        {/* 5. CÁC DÒNG THÔNG TIN CÁ NHÂN (MỖI DÒNG CÓ GẠCH CHÂN CHO GIÁ TRỊ) */}
        <div className="pt-4 space-y-2.5 text-[14px]">
          {/* Dòng 1: Tên và họ + ngày tháng năm sinh + giới tính */}
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span>Tên và họ:</span>
            <span className="font-bold underline decoration-dotted underline-offset-4 flex-1 min-w-[180px]">
              {data.fullName}
            </span>
            <span>ngày, tháng, năm sinh:</span>
            <span className="font-semibold underline decoration-dotted underline-offset-4 px-1">
              {data.dob}
            </span>
            <span>giới tính:</span>
            <span className="font-semibold underline decoration-dotted underline-offset-4 px-1">
              {data.gender}
            </span>
          </div>

          {/* Dòng 2: Name & Surname (Latin) */}
          <div className="flex items-baseline gap-x-2">
            <span>Name & Surname:</span>
            <span className="font-bold tracking-wider underline decoration-dotted underline-offset-4 flex-1">
              {data.fullNameLatin}
            </span>
          </div>

          {/* Dòng 3: Dân tộc + tôn giáo */}
          <div className="flex items-baseline justify-center gap-x-12">
            <div className="flex items-baseline gap-x-2">
              <span>dân tộc:</span>
              <span className="font-semibold underline decoration-dotted underline-offset-4 px-2 min-w-[120px] text-center">
                {data.ethnicity || 'Lào Lùm'}
              </span>
            </div>
            <div className="flex items-baseline gap-x-2">
              <span>tôn giáo:</span>
              <span className="font-semibold underline decoration-dotted underline-offset-4 px-2 min-w-[120px] text-center">
                {data.religion || 'Phật giáo'}
              </span>
            </div>
          </div>

          {/* Dòng 4: Sinh tại bản + huyện + tỉnh */}
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span>Sinh tại bản:</span>
            <span className="font-semibold underline decoration-dotted underline-offset-4 flex-1 min-w-[120px]">
              {data.birthVillage}
            </span>
            <span>huyện:</span>
            <span className="font-semibold underline decoration-dotted underline-offset-4 flex-1 min-w-[120px]">
              {data.birthDistrict}
            </span>
            <span>tỉnh:</span>
            <span className="font-semibold underline decoration-dotted underline-offset-4 flex-1 min-w-[120px]">
              {data.birthProvince}
            </span>
          </div>

          {/* Dòng 5: Hiện nay ở bản + đơn vị + huyện + tỉnh */}
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span>Hiện nay ở bản:</span>
            <span className="font-semibold underline decoration-dotted underline-offset-4 flex-1 min-w-[100px]">
              {data.resVillage}
            </span>
            <span>đơn vị:</span>
            <span className="font-semibold underline decoration-dotted underline-offset-4 px-2">
              {data.resUnit || 'Đơn vị 12'}
            </span>
            <span>huyện:</span>
            <span className="font-semibold underline decoration-dotted underline-offset-4 flex-1 min-w-[100px]">
              {data.resDistrict}
            </span>
            <span>tỉnh:</span>
            <span className="font-semibold underline decoration-dotted underline-offset-4 flex-1 min-w-[100px]">
              {data.resProvince}
            </span>
          </div>

          {/* Dòng 6: Số chứng minh nhân dân + ngày + cấp bởi Công an tỉnh */}
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span>Số chứng minh nhân dân:</span>
            <span className="font-bold underline decoration-dotted underline-offset-4 px-1">
              {data.nationalId}
            </span>
            <span>ngày:</span>
            <span className="font-semibold underline decoration-dotted underline-offset-4 px-1">
              {data.idIssueDate}
            </span>
            <span>cấp bởi Công an tỉnh:</span>
            <span className="font-semibold underline decoration-dotted underline-offset-4 flex-1 min-w-[120px]">
              {data.idIssuePlace}
            </span>
          </div>

          {/* Dòng 7: Số sổ hộ khẩu + ngày + cấp bởi Công an huyện */}
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span>Số sổ hộ khẩu:</span>
            <span className="font-bold underline decoration-dotted underline-offset-4 px-1">
              {data.householdBookNo}
            </span>
            <span>ngày:</span>
            <span className="font-semibold underline decoration-dotted underline-offset-4 px-1">
              {data.householdIssueDate}
            </span>
            <span>cấp bởi Công an huyện:</span>
            <span className="font-semibold underline decoration-dotted underline-offset-4 flex-1 min-w-[120px]">
              {data.householdIssuePlace}
            </span>
          </div>

          {/* Dòng 8: Đặc điểm nhận dạng: chiều cao + vết sẹo + ở đâu */}
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span>Đặc điểm nhận dạng: chiều cao:</span>
            <span className="font-semibold underline decoration-dotted underline-offset-4 px-2">
              {data.heightCm} cm
            </span>
            <span>vết sẹo:</span>
            <span className="font-semibold underline decoration-dotted underline-offset-4 flex-1 min-w-[100px]">
              {data.scars || 'Không có'}
            </span>
            <span>ở đâu:</span>
            <span className="font-semibold underline decoration-dotted underline-offset-4 flex-1 min-w-[100px]">
              {data.scarsLocation || (data.scars ? 'Vùng mặt/tay' : 'Không có')}
            </span>
          </div>
        </div>

        {/* 6. MỤC TRẺ EM ĐI KÈM DƯỚI 12 TUỔI (LIỆT KÊ TỰ ĐỘNG, ẨN NẾU RỖNG) */}
        {data.children && data.children.length > 0 && (
          <div className="pt-4 space-y-2">
            <p className="font-bold text-[14px]">
              Trẻ em đi kèm dưới 12 tuổi:
            </p>
            {data.children.map((child, idx) => (
              <div key={idx} className="pl-4 space-y-1 text-[13.5px]">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-bold">{idx + 1}.</span>
                  <span>Tên và họ:</span>
                  <span className="font-semibold underline decoration-dotted underline-offset-4 flex-1 min-w-[160px]">
                    {child.fullName}
                  </span>
                  {child.citizenId && (
                    <>
                      <span>Số định danh:</span>
                      <span className="font-semibold underline decoration-dotted underline-offset-4 px-1">
                        {child.citizenId}
                      </span>
                    </>
                  )}
                  <span>ngày, tháng, năm sinh:</span>
                  <span className="font-semibold underline decoration-dotted underline-offset-4 px-1">
                    {child.dob}
                  </span>
                  <span>giới tính:</span>
                  <span className="font-semibold underline decoration-dotted underline-offset-4 px-1">
                    {child.gender}
                  </span>
                </div>
                <div className="flex items-baseline gap-x-2 pl-4">
                  <span>Name & Surname:</span>
                  <span className="font-semibold underline decoration-dotted underline-offset-4 flex-1">
                    {child.fullNameLatin}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 7. MỤC HƯỚNG DẪN: NỘI DUNG TĨNH Y HỆT BẢN GỐC */}
        <div className="pt-5 pb-2 text-[12.5px] leading-relaxed">
          <p className="font-bold uppercase tracking-wider text-[13px] mb-1">
            Hướng dẫn:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-800">
            <li>
              Khi đến nộp đơn tại cơ quan tiếp nhận cần mang theo bản chính Giấy chứng minh nhân dân và Sổ hộ khẩu để cán bộ đối chiếu.
            </li>
            <li>
              Nộp kèm 02 ảnh chân dung cỡ 3x4 cm chụp không quá 06 tháng, nền sáng màu, chụp thẳng mặt, đầu để trần, không đeo kính râm.
            </li>
            <li>
              Người đề nghị phải hoàn toàn chịu trách nhiệm trước pháp luật về tính chính xác và trung thực của các thông tin đã kê khai.
            </li>
          </ul>
        </div>

        {/* 8. CUỐI TRANG: KÍNH ĐƠN & 3 CỘT CHỮ KÝ */}
        <div className="pt-4 space-y-3">
          {/* Dòng ngày tháng căn phải */}
          <div className="text-right text-[13.5px] italic">
            Kính đơn, ngày {currentDay} tháng {currentMonth} năm {currentYear}
          </div>

          {/* 3 cột ký tên chừa khoảng trắng để ký tay */}
          <div className="grid grid-cols-3 gap-2 text-center text-[13px] pt-1">
            {/* Cột 1 */}
            <div>
              <p className="font-bold">Bộ phận quản lý xuất - nhập cảnh</p>
              <p className="text-[11.5px] italic text-gray-600">(Ký, ghi rõ họ tên và đóng dấu)</p>
              <div className="h-24"></div>
            </div>

            {/* Cột 2 */}
            <div>
              <p className="font-bold">Cán bộ xuất nhập cảnh</p>
              <p className="text-[11.5px] italic text-gray-600">(Ký và ghi rõ họ tên)</p>
              <div className="h-24"></div>
            </div>

            {/* Cột 3 */}
            <div>
              <p className="font-bold">Chữ ký người đề nghị</p>
              <p className="text-[11.5px] italic text-gray-600">(Ký và ghi rõ họ tên)</p>
              <div className="h-24"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
