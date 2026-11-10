import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

interface AdminUnitComboboxProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  emptyMessage?: string;
}

export const AdminUnitCombobox: React.FC<AdminUnitComboboxProps> = ({
  id,
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Chọn hoặc nhập...',
  required = false,
  disabled = false,
  error,
  className = '',
  emptyMessage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external value
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on input value
  const filteredOptions = useMemo(() => {
    const term = inputValue.trim().toLowerCase();
    if (!term) {
      return options;
    }
    return options.filter((opt) => opt.toLowerCase().includes(term));
  }, [inputValue, options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setInputValue(nextVal);
    onChange(nextVal);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSelectOption = (opt: string) => {
    setInputValue(opt);
    onChange(opt);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue('');
    onChange('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isOpen) {
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
      }
    } else if (e.key === 'Enter') {
      if (isOpen && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        e.preventDefault();
        handleSelectOption(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} id={id} className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-[13px] font-medium text-[#1F2937] flex items-center">
          <span>{label}</span>
          {required && <span className="text-[#D71920] ml-1 font-bold">*</span>}
        </label>
      )}

      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          disabled={disabled}
          onChange={handleInputChange}
          onFocus={() => {
            if (!disabled) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full text-[14px] text-[#1F2937] placeholder:text-[#9CA3AF] bg-[#FFFFFF] border rounded px-3 py-2 pr-14 transition-colors outline-none ${
            error
              ? 'border-[#D71920] focus:ring-1 focus:ring-[#D71920]'
              : 'border-[#D9E1DC] focus:border-[#006B3F] focus:ring-1 focus:ring-[#006B3F]'
          } ${disabled ? 'bg-[#F5F7F6] text-[#9CA3AF] cursor-not-allowed' : ''}`}
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {inputValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-[#9CA3AF] hover:text-[#4B5563] rounded cursor-pointer transition-colors"
              title="Xóa lựa chọn"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                setIsOpen(!isOpen);
                inputRef.current?.focus();
              }
            }}
            className="p-1 text-[#6B7280] hover:text-[#1F2937] rounded cursor-pointer transition-colors"
            title="Mở danh sách"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-[#006B3F]' : ''
              }`}
            />
          </button>
        </div>

        {/* Dropdown Options List */}
        {isOpen && !disabled && (
          <div className="absolute z-40 left-0 right-0 top-full mt-1 bg-white border border-[#D9E1DC] rounded-lg shadow-lg max-h-56 overflow-y-auto divide-y divide-[#F3F4F6] animate-fadeIn">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => {
                const isSelected = value.trim() === opt.trim();
                const isHighlighted = idx === highlightedIndex;

                return (
                  <button
                    key={`${opt}-${idx}`}
                    type="button"
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full text-left px-3 py-2 text-[13px] flex items-center justify-between transition-colors cursor-pointer ${
                      isHighlighted
                        ? 'bg-[#E8F3EE] text-[#006B3F]'
                        : isSelected
                        ? 'bg-[#F0FDF4] text-[#006B3F] font-semibold'
                        : 'text-[#1F2937] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    <span className="truncate">{opt}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#006B3F] shrink-0 ml-2" />}
                  </button>
                );
              })
            ) : (
              <div className="p-3 text-center text-[12px] text-[#6B7280]">
                {emptyMessage ? (
                  <span className="text-[#6B7280] leading-relaxed block">{emptyMessage}</span>
                ) : (
                  <>
                    <span>Không có trong danh mục có sẵn. Bạn có thể nhấn để giữ nguyên nội dung vừa gõ: </span>
                    <strong className="text-[#1F2937] block mt-0.5">&quot;{inputValue}&quot;</strong>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-[12px] text-[#D71920]">{error}</p>}
    </div>
  );
};
