import React from 'react';

export interface FormSectionProps {
  partNumber: 1 | 2 | 3;
  title: string;
  instruction?: string;
  children: React.ReactNode;
  id?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  partNumber,
  title,
  instruction,
  children,
  id,
}) => {
  return (
    <section
      id={id || `section-part-${partNumber}`}
      className="rounded-xl border border-[#D9E1DC] bg-white shadow-xs overflow-hidden transition-all duration-300"
    >
      {/* Header của phần */}
      <div className="px-5 py-4 bg-[#F0FDF4] border-b border-[#BBF7D0] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-8 h-8 rounded-full bg-[#006B3F] text-white flex items-center justify-center text-[15px] font-bold shrink-0 shadow-xs">
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

        <span className="text-[15px] font-bold text-[#D71920] bg-white px-2 py-0.5 rounded border border-[#FECACA] leading-none">
          *
        </span>
      </div>

      {/* Nội dung phần */}
      <div className="p-5 sm:p-6 space-y-6">{children}</div>
    </section>
  );
};
