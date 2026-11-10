import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  headerAction,
  children,
  className = '',
  noPadding = false,
}) => {
  return (
    <div
      className={`bg-[#FFFFFF] border border-[#D9E1DC] rounded-lg overflow-hidden ${className}`}
    >
      {(title || headerAction) && (
        <div className="px-5 py-4 border-b border-[#D9E1DC] flex flex-wrap items-center justify-between gap-3 bg-[#FFFFFF]">
          <div>
            {title && (
              <h3 className="text-[17px] font-semibold text-[#1F2937] leading-snug">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[13px] text-[#6B7280] mt-0.5">{subtitle}</p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  );
};
