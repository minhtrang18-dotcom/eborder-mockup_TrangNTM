import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  className = '',
  id,
  disabled,
  ...props
}) => {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[13px] font-medium text-[#1F2937] flex items-center"
        >
          <span>{label}</span>
          {props.required && <span className="text-[#D71920] ml-1 font-bold">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {leftIcon && (
          <span className="absolute left-3 text-[#6B7280] pointer-events-none flex items-center">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          disabled={disabled}
          className={`w-full text-[14px] text-[#1F2937] placeholder:text-[#6B7280] bg-[#FFFFFF] border rounded px-3 py-2 transition-colors outline-none
            ${error ? 'border-[#D71920] focus:ring-1 focus:ring-[#D71920]' : 'border-[#D9E1DC] focus:border-[#006B3F] focus:ring-1 focus:ring-[#006B3F]'}
            ${leftIcon ? 'pl-9' : ''}
            ${rightIcon ? 'pr-9' : ''}
            ${disabled ? 'bg-[#F5F7F6] text-[#9CA3AF] cursor-not-allowed border-[#D9E1DC]' : ''}
            ${className}`}
          {...props}
        />

        {rightIcon && (
          <span className="absolute right-3 text-[#6B7280] pointer-events-none flex items-center">
            {rightIcon}
          </span>
        )}
      </div>

      {error ? (
        <p className="text-[12px] text-[#D71920]">{error}</p>
      ) : helperText ? (
        <p className="text-[12px] text-[#6B7280]">{helperText}</p>
      ) : null}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  helperText,
  error,
  options,
  className = '',
  id,
  disabled,
  ...props
}) => {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-[13px] font-medium text-[#1F2937] flex items-center"
        >
          <span>{label}</span>
          {props.required && <span className="text-[#D71920] ml-1 font-bold">*</span>}
        </label>
      )}

      <div className="relative w-full">
        <select
          id={selectId}
          disabled={disabled}
          className={`w-full appearance-none text-[14px] text-[#1F2937] bg-[#FFFFFF] border rounded px-3 py-2 pr-8 transition-colors outline-none cursor-pointer
            ${error ? 'border-[#D71920] focus:ring-1 focus:ring-[#D71920]' : 'border-[#D9E1DC] focus:border-[#006B3F] focus:ring-1 focus:ring-[#006B3F]'}
            ${disabled ? 'bg-[#F5F7F6] text-[#9CA3AF] cursor-not-allowed border-[#D9E1DC]' : ''}
            ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B7280]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>

      {error ? (
        <p className="text-[12px] text-[#D71920]">{error}</p>
      ) : helperText ? (
        <p className="text-[12px] text-[#6B7280]">{helperText}</p>
      ) : null}
    </div>
  );
};
