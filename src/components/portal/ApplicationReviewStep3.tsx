import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  FileCheck,
  User,
  MapPin,
  FileText,
  ShieldCheck,
  X,
  Printer,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SubmissionProcedureType } from './StartSubmissionView';
import { saveOrUpdateApplication, StoredApplication } from '../../utils/submissionStorage';
import { PrintableApplicationForm } from './PrintableApplicationForm';

interface ApplicationReviewStep3Props {
  procedureType: SubmissionProcedureType;
  currentDraftId?: string;
  onBackToStep2: () => void;
  onFinishSubmission: (maHoSo: string) => void;
}

export const ApplicationReviewStep3: React.FC<ApplicationReviewStep3Props> = ({
  procedureType,
  currentDraftId,
  onBackToStep2,
  onFinishSubmission,
}) => {
  const [agreement, setAgreement] = useState(true);
  const [successToast, setSuccessToast] = useState<{ maHoSo: string } | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const getProcedureTitle = () => {
    switch (procedureType) {
      case 'CAP_DOI':
        return 'Cấp đổi sổ thông hành';
      case 'TAM_THOI':
        return 'Cấp giấy thông hành tạm thời';
      case 'CAP_SO':
      default:
        return 'Cấp sổ thông hành';
    }
  };

  const handleSubmit = () => {
    const savedRecord = saveOrUpdateApplication({
      maHoSo: currentDraftId,
      loaiThuTuc: getProcedureTitle(),
      hoTenNguoiNop: 'Somchai Khamvongsa',
      trangThai: 'Đã gửi',
      taiKhoan: '01-089201948',
      thuTuc: 'cap-so',
      duLieu: {},
      soLanBoSung: 0,
      cccd: '01-089201948',
    });

    // Hiển thị thông báo xác nhận dạng toast/snackbar (nền trắng, border trái #006B3F, icon dấu tích)
    setSuccessToast({ maHoSo: savedRecord.maHoSo });
  };

  // Tự động biến mất sau 2.5 giây và điều hướng quay lại
  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => {
        onFinishSubmission(successToast.maHoSo);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [successToast, onFinishSubmission]);

  return (
    <div className="space-y-6 max-w-[1040px] mx-auto animate-fadeIn pb-6 relative">
      {/* Toast/Snackbar xác nhận nộp hồ sơ thành công (nền trắng, border trái xanh lá #006B3F, icon dấu tích) */}
      {successToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-bounce-subtle">
          <div className="bg-[#FFFFFF] border border-[#D9E1DC] border-l-4 border-l-[#006B3F] rounded-lg p-4 shadow-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-full bg-[#E8F3EE] text-[#006B3F] shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[#006B3F]" />
              </span>
              <div>
                <strong className="text-[14px] text-[#1F2937] block font-semibold">
                  Gửi hồ sơ thành công!
                </strong>
                <span className="text-[13px] text-[#6B7280]">
                  Mã hồ sơ của bạn là <strong className="text-[#006B3F] font-mono">{successToast.maHoSo}</strong>.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onFinishSubmission(successToast.maHoSo)}
              className="p-1 text-[#6B7280] hover:text-[#1F2937] rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-[13px] text-[#6B7280] flex items-center gap-1.5">
        <button
          type="button"
          onClick={onBackToStep2}
          className="hover:text-[#006B3F] hover:underline cursor-pointer"
        >
          Trang chủ
        </button>
        <span className="text-[#9CA3AF]">/</span>
        <button
          type="button"
          onClick={onBackToStep2}
          className="hover:text-[#006B3F] hover:underline cursor-pointer"
        >
          Nộp hồ sơ trực tuyến
        </button>
        <span className="text-[#9CA3AF]">/</span>
        <span className="text-[#1F2937] font-medium">Bước 3: Xác nhận & gửi</span>
      </nav>

      {/* Step Indicator (3 bước) — Bước 3 đang ACTIVE */}
      <div className="bg-[#FFFFFF] border border-[#D9E1DC] rounded-lg p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-2 relative">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E8F3EE] text-[#008A4B] border border-[#B0DFCA] flex items-center justify-center text-[13px] font-bold shrink-0">
              ✓
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-[#008A4B] block uppercase tracking-wider">
                Bước 1 (Đã chọn)
              </span>
              <span className="text-[13px] sm:text-[14px] font-medium text-[#1F2937] truncate block">
                Chọn thủ tục
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#D9E1DC] hidden sm:block ml-auto shrink-0" />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E8F3EE] text-[#008A4B] border border-[#B0DFCA] flex items-center justify-center text-[13px] font-bold shrink-0">
              ✓
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-[#008A4B] block uppercase tracking-wider">
                Bước 2 (Đã kê khai)
              </span>
              <span className="text-[13px] sm:text-[14px] font-medium text-[#1F2937] truncate block">
                Kê khai & đính kèm hồ sơ
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#D9E1DC] hidden sm:block ml-auto shrink-0" />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#006B3F] text-white flex items-center justify-center text-[13px] font-bold shrink-0 shadow-xs">
              3
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-[#006B3F] block uppercase tracking-wider">
                Bước 3 (Hiện tại)
              </span>
              <span className="text-[13px] sm:text-[14px] font-semibold text-[#006B3F] truncate block">
                Xác nhận & gửi
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tiêu đề trang */}
      <div>
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#1F2937] leading-tight">
          Xác nhận thông tin & Nộp hồ sơ
        </h2>
        <p className="text-[14px] text-[#6B7280] mt-1">
          Vui lòng kiểm tra lại toàn bộ thông tin đã kê khai trước khi bấm nút nộp hồ sơ chính thức.
        </p>
      </div>

      {/* Tóm tắt hồ sơ */}
      <Card title="Tóm tắt thông tin hồ sơ đề nghị" subtitle="Hồ sơ được xác thực qua cơ sở dữ liệu dân cư">
        <div className="space-y-4 text-[13px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-[#D9E1DC]">
            <div>
              <span className="text-[#6B7280] block text-[12px]">Thủ tục đề nghị:</span>
              <strong className="text-[15px] text-[#006B3F]">{getProcedureTitle()}</strong>
            </div>
            <div>
              <span className="text-[#6B7280] block text-[12px]">Cơ quan tiếp nhận:</span>
              <span className="font-semibold text-[#1F2937]">Phòng Quản lý Xuất nhập cảnh</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-4 border-b border-[#D9E1DC]">
            <div>
              <span className="text-[#6B7280] block text-[12px]">Họ và tên:</span>
              <span className="font-semibold text-[#1F2937]">Somchai Khamvongsa</span>
            </div>
            <div>
              <span className="text-[#6B7280] block text-[12px]">Số CMND / Căn cước:</span>
              <span className="font-mono font-semibold text-[#1F2937]">01-089201948</span>
            </div>
            <div>
              <span className="text-[#6B7280] block text-[12px]">Ngày, tháng, năm sinh:</span>
              <span className="text-[#1F2937]">18/05/1992</span>
            </div>
            <div>
              <span className="text-[#6B7280] block text-[12px]">Giới tính & Dân tộc:</span>
              <span className="text-[#1F2937]">Nam · Lào Lùm</span>
            </div>
            <div>
              <span className="text-[#6B7280] block text-[12px]">Nơi ở hiện tại:</span>
              <span className="text-[#1F2937]">Bản Phonxay, Huyện Sisattanak, Viêng Chăn</span>
            </div>
            <div>
              <span className="text-[#6B7280] block text-[12px]">Chiều cao & Dấu vết:</span>
              <span className="text-[#1F2937]">172 cm (Không có sẹo dị tật)</span>
            </div>
          </div>

          {/* Tài liệu đính kèm & Ảnh */}
          <div className="space-y-2">
            <span className="text-[#6B7280] block text-[12px] font-semibold uppercase">
              Tài liệu & ảnh thẻ đính kèm:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-2.5 bg-[#F5F7F6] border border-[#D9E1DC] rounded flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#006B3F] shrink-0" />
                <span className="truncate">Bản sao CMND (Đã đính kèm)</span>
              </div>
              <div className="p-2.5 bg-[#F5F7F6] border border-[#D9E1DC] rounded flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#006B3F] shrink-0" />
                <span className="truncate">Bản sao Sổ hộ khẩu (Đã đính kèm)</span>
              </div>
              <div className="p-2.5 bg-[#F5F7F6] border border-[#D9E1DC] rounded flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#006B3F] shrink-0" />
                <span className="truncate">Ảnh thẻ 3x4 (Đạt chuẩn ICAO)</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Cam kết của người nộp */}
      <div className="p-4 bg-[#FFFFFF] border border-[#D9E1DC] rounded-xl flex items-start gap-3">
        <input
          type="checkbox"
          id="cb-agreement"
          checked={agreement}
          onChange={(e) => setAgreement(e.target.checked)}
          className="accent-[#006B3F] w-4 h-4 mt-0.5 cursor-pointer"
        />
        <label htmlFor="cb-agreement" className="text-[13px] text-[#1F2937] leading-relaxed cursor-pointer select-none">
          Tôi xin cam đoan các thông tin kê khai trên là hoàn toàn đúng sự thật và chịu mọi trách nhiệm trước pháp luật về tính chính xác của các giấy tờ đính kèm.
        </label>
      </div>

      {/* Thanh hành động cuối trang */}
      <div className="sticky bottom-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-xs border border-[#D9E1DC] rounded-xl p-4 sm:p-5 flex items-center justify-between shadow-lg">
        <Button
          variant="ghost"
          size="md"
          onClick={onBackToStep2}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Quay lại chỉnh sửa
        </Button>

        {/* Nút In phiếu (Secondary) đặt cạnh nút Nộp hồ sơ, bên trái nút đó */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setShowPrintModal(true)}
            icon={<Printer className="w-5 h-5 text-[#1F2937]" />}
          >
            In phiếu
          </Button>

          <Button
            variant="primary"
            size="lg"
            disabled={!agreement}
            onClick={handleSubmit}
            icon={<ShieldCheck className="w-5 h-5" />}
            iconPosition="left"
          >
            Nộp hồ sơ
          </Button>
        </div>
      </div>

      {/* Cửa sổ / Khu vực in riêng bản scan điện tử ĐƠN ĐỀ NGHỊ */}
      {showPrintModal && (
        <PrintableApplicationForm
          data={{
            maHoSo: currentDraftId || `HS${Date.now()}`,
            loaiThuTuc: procedureType,
            fullName: 'Somchai Khamvongsa',
            fullNameLatin: 'SOMCHAI KHAMVONGSA',
            dob: '18/05/1992',
            gender: 'Nam',
            ethnicity: 'Lào Lùm',
            religion: 'Phật giáo',
            birthVillage: 'Bản Thongkhankham',
            birthDistrict: 'Huyện Chanthabuly',
            birthProvince: 'Thủ đô Viêng Chăn',
            resVillage: 'Bản Phonxay',
            resUnit: 'Đơn vị 12',
            resDistrict: 'Huyện Sisattanak',
            resProvince: 'Thủ đô Viêng Chăn',
            nationalId: '01-089201948',
            idIssueDate: '15/08/2021',
            idIssuePlace: 'Công an Thủ đô Viêng Chăn',
            householdBookNo: 'VTN-882910',
            householdIssueDate: '20/11/2019',
            householdIssuePlace: 'Công an Huyện Sisattanak',
            heightCm: '172',
            scars: 'Không có',
            scarsLocation: 'Không có',
            children: [
              {
                fullName: 'Manee Khamvongsa',
                fullNameLatin: 'MANEE KHAMVONGSA',
                dob: '12/09/2018',
                gender: 'Nữ',
              },
            ],
          }}
          onClose={() => setShowPrintModal(false)}
          autoPrint={true}
        />
      )}
    </div>
  );
};
