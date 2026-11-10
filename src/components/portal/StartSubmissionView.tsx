import React, { useState } from 'react';
import {
  BookPlus,
  RefreshCw,
  Clock,
  ArrowRight,
  ArrowLeft,
  Loader2,
  FileText,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { Button } from '../ui/Button';

export type SubmissionProcedureType = 'CAP_SO' | 'CAP_DOI' | 'TAM_THOI';

interface StartSubmissionViewProps {
  userLoggedIn?: boolean;
  onOpenLogin?: () => void;
  onNavigateHome: () => void;
  initialSelectedType?: SubmissionProcedureType | null;
  onSelectProcedure?: (type: SubmissionProcedureType) => void;
  onProceedToStep2?: (procedureType?: SubmissionProcedureType) => void | Promise<any>;
  onShowToast?: (msg: string, type?: 'success' | 'danger' | 'info') => void;
}

export const StartSubmissionView: React.FC<StartSubmissionViewProps> = ({
  onNavigateHome,
  initialSelectedType = null,
  onSelectProcedure,
  onProceedToStep2,
  onShowToast,
}) => {
  // Mặc định CHƯA chọn thủ tục nào -> Không thẻ nào được tô, nút Nộp hồ sơ bị khóa
  const [selectedProcedure, setSelectedProcedure] =
    useState<SubmissionProcedureType | null>(initialSelectedType || null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Accordion state cho phần câu hỏi thường gặp
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleChoose = (type: SubmissionProcedureType) => {
    setSelectedProcedure(type);
    if (onSelectProcedure) {
      onSelectProcedure(type);
    }
  };

  const handleProceed = async () => {
    if (!selectedProcedure || isProcessing) return;

    if (selectedProcedure === 'CAP_DOI') {
      if (onShowToast) {
        onShowToast('Thủ tục Cấp đổi sổ thông hành sẽ được mở ở giai đoạn sau.', 'info');
      } else {
        alert('Thủ tục Cấp đổi sổ thông hành sẽ được mở ở giai đoạn sau.');
      }
      return;
    }

    setIsProcessing(true);
    try {
      if (onProceedToStep2) {
        await onProceedToStep2(selectedProcedure);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const procedures = [
    {
      id: 'CAP_SO' as SubmissionProcedureType,
      title: 'Cấp sổ thông hành',
      description:
        'Cấp sổ thông hành biên giới Việt Nam - Lào cho công dân Việt Nam có hộ khẩu thường trú tại tỉnh có chung đường biên giới.',
      icon: BookPlus,
      processingDays: '03 ngày làm việc',
      fee: '200.000 VNĐ',
      level: 'Toàn trình',
    },
    {
      id: 'TAM_THOI' as SubmissionProcedureType,
      title: 'Cấp giấy thông hành tạm thời',
      description:
        'Cấp giấy thông hành có giá trị sử dụng một lần cho công dân qua lại khu vực biên giới để giải quyết việc khẩn cấp.',
      icon: Clock,
      processingDays: '01 ngày làm việc',
      fee: '100.000 VNĐ',
      level: 'Một phần',
    },
    {
      id: 'CAP_DOI' as SubmissionProcedureType,
      title: 'Cấp đổi sổ thông hành',
      description:
        'Cấp đổi sổ thông hành khi sổ cũ bị hỏng, rách, hết trang thị thực hoặc bị mất nhưng vẫn còn thời hạn giá trị.',
      icon: RefreshCw,
      processingDays: '03 ngày làm việc',
      fee: '200.000 VNĐ',
      level: 'Toàn trình',
    },
  ];

  const faqs = [
    {
      q: 'Trẻ em đi kèm cần giấy tờ gì khi nộp hồ sơ?',
      a: 'Trẻ em dưới 14 tuổi đi kèm cha, mẹ hoặc người giám hộ cần có: Bản sao giấy khai sinh (hoặc trích lục hộ tịch điện tử), giấy tờ chứng minh quan hệ giám hộ hợp pháp nếu không phải cha mẹ đẻ, và tờ khai M01 do cha/mẹ/người giám hộ ký thay.',
    },
    {
      q: 'Có cần thu nhận sinh trắc (vân tay, khuôn mặt) không?',
      a: 'Công dân chưa có dữ liệu sinh trắc trên hệ thống e-Border sẽ được đặt lịch hẹn đến trực tiếp cơ quan quản lý xuất nhập cảnh hoặc cửa khẩu để thu nhận sinh trắc. Nếu đã có dữ liệu sinh trắc, hồ sơ sẽ được xử lý trực tuyến hoàn toàn.',
    },
    {
      q: 'Thời gian nhận kết quả và phương thức nhận như thế nào?',
      a: 'Sau khi hồ sơ được phê duyệt, công dân nhận mã giấy/sổ thông hành điện tử trên Cổng dịch vụ công hoặc nhận ấn phẩm bản giấy trực tiếp tại cơ quan tiếp nhận hồ sơ.',
    },
  ];

  return (
    <div className="space-y-6 max-w-[1080px] mx-auto animate-fadeIn">
      {/* 1. Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-[13px] text-[#6B7280] flex items-center gap-1.5">
        <button
          type="button"
          onClick={onNavigateHome}
          className="hover:text-[#006B3F] hover:underline cursor-pointer"
        >
          Trang chủ
        </button>
        <span className="text-[#9CA3AF]">/</span>
        <span className="text-[#1F2937] font-medium">Nộp hồ sơ trực tuyến</span>
      </nav>

      {/* 2. Tiêu đề trang & mô tả */}
      <div>
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#1F2937] leading-tight">
          Nộp hồ sơ trực tuyến
        </h2>
        <p className="text-[14px] text-[#6B7280] mt-1">
          Chọn thủ tục bạn muốn nộp hồ sơ
        </p>
      </div>

      {/* 3. Danh sách thủ tục dạng thẻ chọn một (Radio card) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {procedures.map((item) => {
          const isSelected = selectedProcedure === item.id;
          const IconComp = item.icon;

          return (
            <div
              key={item.id}
              onClick={() => handleChoose(item.id)}
              className={`rounded-xl p-5 sm:p-6 transition-all cursor-pointer relative flex flex-col justify-between group ${
                isSelected
                  ? 'border-2 border-[#006B3F] bg-[#F4F9F6] shadow-sm'
                  : 'border border-[#D9DFDC] bg-white hover:border-[#006B3F]/70 hover:shadow-2xs'
              }`}
            >
              <div>
                {/* Hàng đầu: Icon minh họa và Radio Indicator */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#006B3F] text-white shadow-xs'
                        : 'bg-[#E8F3EE] text-[#006B3F] group-hover:bg-[#006B3F] group-hover:text-white'
                    }`}
                  >
                    <IconComp className="w-6 h-6" />
                  </div>

                  {/* Radio button tròn */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors mt-1 ${
                      isSelected
                        ? 'border-[#006B3F] bg-white'
                        : 'border-[#CBD5E1] bg-white group-hover:border-[#006B3F]/60'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#006B3F] animate-scaleIn" />
                    )}
                  </div>
                </div>

                {/* Tên thủ tục */}
                <h3
                  className={`text-[17px] font-bold leading-snug transition-colors ${
                    isSelected ? 'text-[#006B3F]' : 'text-[#1F2937]'
                  }`}
                >
                  {item.title}
                </h3>

                {/* 1 dòng mô tả */}
                <p className="text-[13px] text-[#5F6B66] mt-2 leading-relaxed min-h-[48px]">
                  {item.description}
                </p>
              </div>

              {/* Thông tin thời hạn & lệ phí */}
              <div className="mt-4 pt-3.5 border-t border-[#D9DFDC]/70 flex items-center justify-between text-[12px] text-[#6B7280]">
                <span>
                  Thời hạn: <strong className="text-[#1F2937] font-semibold">{item.processingDays}</strong>
                </span>
                <span className="font-semibold text-[#006B3F]">{item.fee}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Thanh điều hướng hành động: Nút Nộp hồ sơ (Primary) & Nút Quay lại (Phụ) */}
      <div className="p-4 sm:p-5 bg-white border border-[#D9DFDC] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="text-[13px] text-[#5F6B66] flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#006B3F] shrink-0" />
          <span>
            {selectedProcedure ? (
              <>
                Đang chọn:{' '}
                <strong className="text-[#006B3F] font-semibold">
                  {selectedProcedure === 'CAP_SO' && 'Cấp sổ thông hành'}
                  {selectedProcedure === 'TAM_THOI' && 'Cấp giấy thông hành tạm thời'}
                  {selectedProcedure === 'CAP_DOI' && 'Cấp đổi sổ thông hành'}
                </strong>
              </>
            ) : (
              <span className="text-[#6B7280] italic">
                Vui lòng chọn 1 thủ tục trong danh sách ở trên để tiếp tục
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 shrink-0">
          {/* Nút phụ "Quay lại" (về trang chủ) */}
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onNavigateHome}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Quay lại
          </Button>

          {/* Nút chính "Nộp hồ sơ" (Primary), bị khóa cho đến khi chọn 1 thủ tục */}
          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={!selectedProcedure || isProcessing}
            onClick={handleProceed}
            icon={isProcessing ? undefined : <ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            className={
              !selectedProcedure
                ? 'opacity-50 cursor-not-allowed bg-[#006B3F]/70'
                : 'shadow-xs hover:shadow-sm'
            }
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý...</span>
              </span>
            ) : (
              <span>Nộp hồ sơ</span>
            )}
          </Button>
        </div>
      </div>

      {/* 5. Câu hỏi thường gặp */}
      <div className="pt-2 space-y-3">
        <div className="flex items-center gap-2 border-b border-[#D9DFDC] pb-2">
          <HelpCircle className="w-5 h-5 text-[#006B3F]" />
          <h3 className="text-[16px] font-semibold text-[#1F2937]">
            Câu hỏi thường gặp về nộp hồ sơ trực tuyến
          </h3>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={faq.q}
                className="bg-white border border-[#D9DFDC] rounded-lg overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full text-left p-3.5 sm:p-4 font-semibold text-[13.5px] text-[#1F2937] flex items-center justify-between hover:bg-[#F5F7F6] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2 pr-2">
                    <span className="text-[#006B3F] font-bold shrink-0">Q{index + 1}.</span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6B7280] shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-[#006B3F]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-[13px] text-[#5F6B66] border-t border-[#D9DFDC] bg-white leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
