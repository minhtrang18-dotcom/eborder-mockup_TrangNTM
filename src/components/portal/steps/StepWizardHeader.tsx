import React from 'react';
import { Check } from 'lucide-react';

interface StepWizardHeaderProps {
  currentStep: number;
  completedSteps: Set<number>;
  stepErrors: Record<number, boolean>;
  procedureTitle: string;
  onSelectStep: (step: number) => void;
}

export const StepWizardHeader: React.FC<StepWizardHeaderProps> = ({
  currentStep,
  completedSteps,
  stepErrors,
  procedureTitle,
  onSelectStep,
}) => {
  const steps = [
    { number: 1, title: 'Thông tin cá nhân' },
    { number: 2, title: 'Địa chỉ và hồ sơ đính kèm' },
    { number: 3, title: 'Trẻ em đi kèm và xác nhận' },
  ];

  const today = new Date();
  const dayStr = today.getDate().toString().padStart(2, '0');
  const monthStr = (today.getMonth() + 1).toString().padStart(2, '0');
  const yearStr = today.getFullYear();
  const todayFormatted = `${dayStr}/${monthStr}/${yearStr}`;

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-[#D9E1DC] shadow-xs">
      {/* 1. Dải thông tin nhỏ chỉ đọc phía trên */}
      <div className="bg-[#F5F7F6] border-b border-[#D9E1DC]/80 px-4 py-2 text-[13px] text-[#4B5563]">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-y-1 gap-x-4">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#1F2937]">Thủ tục:</span>
            <span className="text-[#006B3F] font-semibold">{procedureTitle}</span>
          </div>
          <div className="flex items-center gap-4 text-[13px]">
            <div>
              <span className="font-semibold text-[#1F2937]">Ngày nộp:</span>{' '}
              <span>{todayFormatted}</span>
            </div>
            <div>
              <span className="font-semibold text-[#1F2937]">Cơ quan tiếp nhận:</span>{' '}
              <span>Công an Tỉnh Bokeo</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Thanh tab 3 bước */}
      <div className="max-w-5xl mx-auto px-4 py-3">
        {/* Bản Desktop: 3 tab ngang với đường tiến độ nối */}
        <div className="hidden md:flex items-center justify-between gap-3 relative">
          {steps.map((st, idx) => {
            const isActive = currentStep === st.number;
            const isCompleted = completedSteps.has(st.number) && !isActive;
            const hasError = !!stepErrors[st.number];
            const canClick = isCompleted || st.number < currentStep;

            return (
              <React.Fragment key={st.number}>
                {idx > 0 && (
                  <div
                    className={`flex-1 h-1 rounded transition-colors ${
                      completedSteps.has(idx) ? 'bg-[#006B3F]' : 'bg-[#E5E7EB]'
                    }`}
                  />
                )}
                <button
                  type="button"
                  disabled={!canClick}
                  onClick={() => canClick && onSelectStep(st.number)}
                  className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all text-left select-none ${
                    isActive
                      ? 'bg-[#006B3F] text-white font-bold shadow-xs cursor-default'
                      : isCompleted
                      ? 'bg-[#E6F5EE] text-[#006B3F] font-semibold border border-[#B0DFCA] hover:bg-[#D4EFE3] cursor-pointer'
                      : 'bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB] cursor-not-allowed opacity-85'
                  }`}
                >
                  {/* Số bước hoặc icon check */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0 ${
                      isActive
                        ? 'bg-white text-[#006B3F]'
                        : isCompleted
                        ? 'bg-[#008A4B] text-white'
                        : 'bg-[#E5E7EB] text-[#6B7280]'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : st.number}
                  </div>

                  <span className="text-[15px] whitespace-nowrap">
                    {st.number}. {st.title}
                  </span>

                  {/* Chấm đỏ nhỏ ở góc tab khi có lỗi */}
                  {hasError && (
                    <span
                      className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#D71920] border-2 border-white rounded-full animate-pulse"
                      title="Bước này có thông tin cần bổ sung"
                    />
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Bản Mobile: Thu gọn thành dòng chữ kèm thanh tiến độ */}
        <div className="md:hidden space-y-2">
          <div className="flex items-center justify-between text-[14px]">
            <span className="font-bold text-[#006B3F]">
              Bước {currentStep}/3 · {steps[currentStep - 1]?.title}
            </span>
            {stepErrors[currentStep] && (
              <span className="text-[12px] bg-[#FEECEC] text-[#D71920] px-2 py-0.5 rounded font-semibold">
                Có lỗi nhập liệu
              </span>
            )}
          </div>
          <div className="w-full bg-[#E5E7EB] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#006B3F] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
