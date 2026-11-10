import React from 'react';
import { X, CheckCircle, Clock, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { ProcedureItem } from './ProceduresSection';
import { Button } from '../ui/Button';

interface ProcedureDetailModalProps {
  procedure: ProcedureItem | null;
  onClose: () => void;
  onSubmit: (procedure: ProcedureItem) => void;
}

export const ProcedureDetailModal: React.FC<ProcedureDetailModalProps> = ({
  procedure,
  onClose,
  onSubmit,
}) => {
  if (!procedure) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px] animate-fadeIn">
      <div
        className="bg-[#FFFFFF] border border-[#D9E1DC] rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#D9E1DC] flex items-center justify-between bg-[#FFFFFF]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded bg-[#E8F3EE] text-[#006B3F]">
              <FileText className="w-5 h-5 text-[#006B3F]" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#6B7280] bg-[#F5F7F6] px-2 py-0.5 rounded border border-[#D9E1DC]">
                  {procedure.code}
                </span>
                <span className="text-[11px] font-medium text-[#008A4B] bg-[#E6F5EE] px-2 py-0.5 rounded border border-[#B0DFCA]">
                  {procedure.level}
                </span>
              </div>
              <h3 className="text-[17px] font-bold text-[#1F2937] mt-1 leading-snug">
                {procedure.name}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F5F7F6] rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-[14px]">
          <div>
            <h4 className="text-[15px] font-semibold text-[#1F2937] mb-1">Mô tả thủ tục</h4>
            <p className="text-[#6B7280] leading-relaxed">{procedure.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#F5F7F6] border border-[#D9E1DC] rounded-lg">
            <div>
              <span className="text-[12px] font-medium text-[#6B7280] block">Thời hạn giải quyết</span>
              <strong className="text-[#1F2937] text-[14px] mt-0.5 block">{procedure.processingDays}</strong>
            </div>
            <div>
              <span className="text-[12px] font-medium text-[#6B7280] block">Lệ phí nhà nước</span>
              <strong className="text-[#006B3F] text-[14px] mt-0.5 block">{procedure.fee}</strong>
            </div>
            <div className="sm:col-span-2 pt-2 border-t border-[#D9E1DC]">
              <span className="text-[12px] font-medium text-[#6B7280] block">Đối tượng áp dụng</span>
              <span className="text-[#1F2937]">{procedure.target}</span>
            </div>
          </div>

          <div>
            <h4 className="text-[15px] font-semibold text-[#1F2937] mb-2">Thành phần hồ sơ yêu cầu</h4>
            <ul className="space-y-1.5 text-[13px] text-[#1F2937]">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#008A4B] shrink-0 mt-0.5" />
                <span>01 Tờ khai điện tử đề nghị cấp sổ thông hành biên giới (theo mẫu M01).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#008A4B] shrink-0 mt-0.5" />
                <span>02 Ảnh chân dung cỡ 3x4cm nền trắng, chụp không quá 06 tháng.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#008A4B] shrink-0 mt-0.5" />
                <span>Bản sao Căn cước công dân hoặc trích lục dữ liệu dân cư VNeID mức 2.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#008A4B] shrink-0 mt-0.5" />
                <span>Trường hợp cấp đổi: Nộp lại sổ thông hành biên giới cũ đã được cấp.</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-[#E8F3EE] rounded border border-[#D9E1DC] flex items-center gap-2 text-[13px] text-[#006B3F]">
            <ShieldCheck className="w-5 h-5 text-[#008A4B] shrink-0" />
            <span>
              Hồ sơ nộp trực tuyến qua Cổng DVC sẽ nhận kết quả mã e-Pass điện tử và sổ bản giấy gửi về tận nhà qua bưu điện.
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-[#D9E1DC] bg-[#F5F7F6] flex items-center justify-between gap-3">
          <Button variant="ghost" size="md" onClick={onClose}>
            Đóng
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => {
              onClose();
              onSubmit(procedure);
            }}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Nộp hồ sơ trực tuyến ngay
          </Button>
        </div>
      </div>
    </div>
  );
};
