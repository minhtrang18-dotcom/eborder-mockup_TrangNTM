import React from 'react';
import { Check } from 'lucide-react';

export interface FormAccordionSectionProps {
  partNumber: 1 | 2 | 3;
  title: string;
  instruction?: string;
  children?: React.ReactNode;
  id?: string;
}

export const FormAccordionSection: React.FC<FormAccordionSectionProps> = ({
  partNumber,
  title,
  instruction,
  children,
  id,
}) => {
  return (
    <section
      id={id || `section-part-${partNumber}`}
      className="rounded-xl border border-[#D9E1DC] bg-white shadow-sm overflow-hidden transition-all duration-300 motion-safe:animate-fadeIn"
    >
      {/* Header của thẻ lớn */}
      <div className="px-5 py-4 flex items-center justify-between gap-3 border-b border-[#E5E9E7] bg-[#F0FDF4]/70">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-8 h-8 rounded-full bg-[#006B3F] text-white flex items-center justify-center text-[14px] font-bold shrink-0 shadow-xs">
            {partNumber}
          </span>
          <div className="min-w-0">
            <h3 className="text-[18px] font-bold text-[#006B3F] truncate">
              Phần {partNumber}: {title}
            </h3>
            {instruction && (
              <p className="text-[14px] text-[#4B5563] mt-0.5">{instruction}</p>
            )}
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="text-[15px] font-bold text-[#D71920] bg-white px-2 py-0.5 rounded border border-[#FECACA] leading-none">
            *
          </span>
        </div>
      </div>

      {/* Nội dung phần luôn mở đầy đủ */}
      <div className="p-5 sm:p-6 space-y-6">
        {children}
      </div>
    </section>
  );
};
