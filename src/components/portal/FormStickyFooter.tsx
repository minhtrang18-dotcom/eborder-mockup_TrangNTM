import React from 'react';
import { ArrowLeft, Save, Printer, Send } from 'lucide-react';
import { Button } from '../ui/Button';

export interface FormStickyFooterProps {
  onBack: () => void;
  onSaveDraft?: () => void;
  onPrint?: () => void;
  onSubmit?: () => void;
  submitText?: string;
  saveDraftText?: string;
  showSaveDraft?: boolean;
  showSubmit?: boolean;
  isReadOnly?: boolean;
  isLao?: boolean;
  disableSubmit?: boolean;
  isSubmitting?: boolean;
}

export const FormStickyFooter: React.FC<FormStickyFooterProps> = ({
  onBack,
  onSaveDraft,
  onPrint,
  onSubmit,
  submitText,
  saveDraftText,
  showSaveDraft = true,
  showSubmit = false,
  isReadOnly = false,
  isLao = false,
  disableSubmit = false,
  isSubmitting = false,
}) => {
  return (
    <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-xs border-t border-[#D9DFDC] p-3 sm:p-4 shadow-lg">
      <div className="max-w-[1040px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Nút Quay lại (Ghost) */}
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={onBack}
          className="min-h-[44px] px-5 text-[14px]"
          icon={<ArrowLeft className="w-4 h-4 text-[#006B3F]" />}
        >
          {isLao ? 'ຍ້ອນກັບ' : 'Quay lại'}
        </Button>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Nút In phiếu (Secondary) */}
          {onPrint && (
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onPrint}
              className="min-h-[44px] px-4 text-[14px] border-[#006B3F] text-[#006B3F] hover:bg-[#E8F3EE] cursor-pointer"
              icon={<Printer className="w-4 h-4 text-[#006B3F]" />}
            >
              {isLao ? 'ພິມໃບສະເໜີ' : 'In phiếu'}
            </Button>
          )}

          {/* Nút Lưu nháp (chỉ hiện khi không phải Chế độ Xem) */}
          {!isReadOnly && showSaveDraft && onSaveDraft && (
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onSaveDraft}
              className="min-h-[44px] px-4 text-[14px]"
              icon={<Save className="w-4 h-4 text-[#1A2421]" />}
            >
              {saveDraftText || (isLao ? 'ບັນທຶກຮ່າງ' : 'Lưu nháp')}
            </Button>
          )}

          {/* Nút Nộp hồ sơ / Gửi bổ sung (nếu có) */}
          {!isReadOnly && showSubmit && onSubmit && (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={onSubmit}
              disabled={disableSubmit || isSubmitting}
              className={`min-h-[44px] px-6 text-[14px] font-semibold ${
                disableSubmit || isSubmitting ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
              }`}
              icon={
                isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                ) : (
                  <Send className="w-4 h-4 text-white" />
                )
              }
              iconPosition="right"
            >
              {isSubmitting
                ? 'Đang xử lý...'
                : submitText || (isLao ? 'ສົ່ງເອກະສານ' : 'Nộp hồ sơ')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
