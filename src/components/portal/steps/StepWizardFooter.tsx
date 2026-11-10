import React from 'react';
import { ArrowLeft, Save, Printer, Send } from 'lucide-react';
import { Button } from '../../ui/Button';

interface StepWizardFooterProps {
  currentStep: number;
  onBack: () => void;
  onSaveDraft: () => void;
  onNext: () => void;
  onPrintTicket?: () => void;
  onSubmit: () => void;
}

export const StepWizardFooter: React.FC<StepWizardFooterProps> = ({
  currentStep,
  onBack,
  onSaveDraft,
  onNext,
  onPrintTicket,
  onSubmit,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#D9E1DC] py-3.5 px-4 sm:px-8 shadow-xl">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Nút 1: "Quay lại" (Ghost) */}
        <Button
          variant="ghost"
          size="lg"
          onClick={onBack}
          className="min-h-[48px] text-[16px] font-medium px-5 cursor-pointer text-[#006B3F] hover:bg-[#E8F3EE]"
          icon={<ArrowLeft className="w-5 h-5 text-[#006B3F]" />}
        >
          Quay lại
        </Button>

        {/* Cụm nút bên phải */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Nút "Lưu nháp" (Secondary) - có ở cả 3 bước */}
          <Button
            variant="secondary"
            size="lg"
            onClick={onSaveDraft}
            className="min-h-[48px] text-[16px] font-semibold px-5 border-[#9CA3AF] text-[#1F2937] hover:bg-[#F3F4F6] cursor-pointer"
            icon={<Save className="w-5 h-5 text-[#1F2937]" />}
          >
            Lưu nháp
          </Button>

          {/* Bước 1 và 2: Nút "Tiếp tục" (Primary) */}
          {(currentStep === 1 || currentStep === 2) && (
            <Button
              variant="primary"
              size="lg"
              onClick={onNext}
              className="min-h-[48px] text-[16px] font-semibold px-7 bg-[#006B3F] hover:bg-[#005432] text-white shadow-xs cursor-pointer"
            >
              Tiếp tục
            </Button>
          )}

          {/* Bước 3: Nút "In phiếu" (Secondary) và "Nộp hồ sơ" (Primary) */}
          {currentStep === 3 && (
            <>
              {onPrintTicket && (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={onPrintTicket}
                  className="min-h-[48px] text-[16px] font-semibold px-5 border-[#9CA3AF] text-[#1F2937] hover:bg-[#F3F4F6] cursor-pointer"
                  icon={<Printer className="w-5 h-5 text-[#1F2937]" />}
                >
                  In phiếu
                </Button>
              )}
              <Button
                variant="primary"
                size="lg"
                onClick={onSubmit}
                className="min-h-[48px] text-[16px] font-semibold px-7 bg-[#006B3F] hover:bg-[#005432] text-white shadow-xs cursor-pointer"
                icon={<Send className="w-5 h-5 text-white" />}
                iconPosition="right"
              >
                Nộp hồ sơ
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
