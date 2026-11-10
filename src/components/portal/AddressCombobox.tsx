import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MapPin, ChevronDown, X, Check, Globe } from 'lucide-react';

export interface AddressItem {
  id: string;
  vi: string;
  la: string;
  country?: string;
}

export const SAMPLE_LOCATIONS_5_LEVELS: AddressItem[] = [
  {
    id: 'lao-1',
    vi: 'Đơn vị 5, Bản Thongkhankham, Huyện Chanthabuly, Thủ đô Viêng Chăn, Lào',
    la: 'ໜ່ວຍ 5, ບ້ານທົ່ງຂັນຄຳ, ເມືອງຈັນທະບູລີ, ນະຄອນຫຼວງວຽງຈັນ, ລາວ',
    country: 'Lào',
  },
  {
    id: 'lao-2',
    vi: 'Đơn vị 12, Bản Phonxay, Huyện Sisattanak, Thủ đô Viêng Chăn, Lào',
    la: 'ໜ່ວຍ 12, ບ້ານໂພນໄຊ, ເມືອງສີສັດຕະນາກ, ນະຄອນຫຼວງວຽງຈັນ, ລາວ',
    country: 'Lào',
  },
  {
    id: 'lao-3',
    vi: 'Đơn vị 3, Bản Sihom, Huyện Chanthabuly, Thủ đô Viêng Chăn, Lào',
    la: 'ໜ່ວຍ 3, ບ້ານສີຫອມ, ເມືອງຈັນທະບູລີ, ນະຄອນຫຼວງວຽງຈັນ, ລາວ',
    country: 'Lào',
  },
  {
    id: 'lao-4',
    vi: 'Đơn vị 2, Bản Anou, Huyện Chanthabuly, Thủ đô Viêng Chăn, Lào',
    la: 'ໜ່ວຍ 2, ບ້ານອານຸ, ເມືອງຈັນທະບູລີ, ນະຄອນຫຼວງວຽງຈັນ, ລາວ',
    country: 'Lào',
  },
  {
    id: 'lao-5',
    vi: 'Đơn vị 7, Bản Kaognhot, Huyện Sisattanak, Thủ đô Viêng Chăn, Lào',
    la: 'ໜ່ວຍ 7, ບ້ານເກົ້າຍອດ, ເມືອງສີສັດຕະນາກ, ນະຄອນຫຼວງວຽງຈັນ, ລາວ',
    country: 'Lào',
  },
  {
    id: 'lao-6',
    vi: 'Đơn vị 4, Bản Phonsinuan, Huyện Sisattanak, Thủ đô Viêng Chăn, Lào',
    la: 'ໜ່ວຍ 4, ບ້ານໂພນສີນວນ, ເມືອງສີສັດຕະນາກ, ນະຄອນຫຼວງວຽງຈັນ, ລາວ',
    country: 'Lào',
  },
  {
    id: 'lao-7',
    vi: 'Đơn vị 1, Bản Saphanthong Neua, Huyện Sisattanak, Thủ đô Viêng Chăn, Lào',
    la: 'ໜ່ວຍ 1, ບ້ານສະພານທອງເໜືອ, ເມືອງສີສັດຕະນາກ, ນະຄອນຫຼວງວຽງຈັນ, ລາວ',
    country: 'Lào',
  },
  {
    id: 'lao-8',
    vi: 'Đơn vị 8, Bản Dongpalan, Huyện Sisattanak, Thủ đô Viêng Chăn, Lào',
    la: 'ໜ່ວຍ 8, ບ້ານດົງປ່າລານ, ເມືອງສີສັດຕະນາກ, ນະຄອນຫຼວງວຽງຈັນ, ລາວ',
    country: 'Lào',
  },
  {
    id: 'lao-9',
    vi: 'Đơn vị 6, Bản Nongbone, Huyện Xaysetha, Thủ đô Viêng Chăn, Lào',
    la: 'ໜ່ວຍ 6, ບ້ານໜອງບອນ, ເມືອງໄຊເສດຖາ, ນະຄອນຫຼວງວຽງຈັນ, ລາວ',
    country: 'Lào',
  },
  {
    id: 'lao-10',
    vi: 'Đơn vị 9, Bản That Luang, Huyện Xaysetha, Thủ đô Viêng Chăn, Lào',
    la: 'ໜ່ວຍ 9, ບ້ານທາດຫຼວງ, ເມືອງໄຊເສດຖາ, ນະຄອນຫຼວງວຽງຈัน, ລາວ',
    country: 'Lào',
  },
  {
    id: 'lao-11',
    vi: 'Đơn vị 10, Bản Phonthan, Huyện Xaysetha, Thủ đô Viêng Chăn, Lào',
    la: 'ໜ່ວຍ 10, ບ້ານໂພນທັນ, ເມືອງໄຊເສດຖາ, ນະຄອນຫຼວງວຽງຈັນ, ລາວ',
    country: 'Lào',
  },
  {
    id: 'lao-12',
    vi: 'Đơn vị 2, Bản Wattay Yai, Huyện Sikhottabong, Thủ đô Viêng Chăn, Lào',
    la: 'ໜ່ວຍ 2, ບ້ານວັດໄຕໃຫຍ່, ເມືອງສີໂຄດຕະບອງ, ນະຄອນຫຼວງວຽງຈັນ, ລາວ',
    country: 'Lào',
  },
  {
    id: 'lao-13',
    vi: 'Đơn vị 5, Bản Nongteng, Huyện Sikhottabong, Thủ đô Viêng Chăn, Lào',
    la: 'ໜ່ວຍ 5, ບ້ານໜອງແຕ່ງ, ເມືອງສີໂຄດຕະບອງ, ນະຄອນຫຼວງວຽງຈັນ, ລາວ',
    country: 'Lào',
  },
  {
    id: 'lao-14',
    vi: 'Đơn vị 11, Bản Dongdok, Huyện Xaythany, Thủ đô Viêng Chăn, Lào',
    la: 'ໜ່ວຍ 11, ບ້ານດົງໂດກ, ເມືອງໄຊທານີ, ນະຄອນຫຼວງວຽງຈັນ, ລາວ',
    country: 'Lào',
  },
  {
    id: 'lao-15',
    vi: 'Đơn vị 1, Bản Luang Prabang, Huyện Luang Prabang, Tỉnh Luang Prabang, Lào',
    la: 'ໜ່ວຍ 1, ບ້ານຫຼວງພະບາງ, ເມືອງຫຼວງພະບາງ, ແຂວງຫຼວງພະບາງ, ລາວ',
    country: 'Lào',
  },
  {
    id: 'lao-16',
    vi: 'Đơn vị 4, Bản Pakse, Huyện Pakse, Tỉnh Champasak, Lào',
    la: 'ໜ່ວຍ 4, ບ້ານປາກເຊ, ເມືອງປາກເຊ, ແຂວງຈຳປາສັກ, ລາວ',
    country: 'Lào',
  },
  {
    id: 'lao-17',
    vi: 'Đơn vị 2, Bản Kaysone, Huyện Kaysone Phomvihane, Tỉnh Savannakhet, Lào',
    la: 'ໜ່ວຍ 2, ບ້ານໄກສອນ, ເມືອງໄກສອນ ພົມວິຫານ, ແຂວງສະຫວັນນະເຂດ, ລາວ',
    country: 'Lào',
  },
  {
    id: 'lao-18',
    vi: 'Đơn vị 3, Bản Thakhek, Huyện Thakhek, Tỉnh Khammouane, Lào',
    la: 'ໜ່ວຍ 3, ບ້ານທ່າແຂກ, ເມືອງທ່າແຂກ, ແຂວງຄຳມ່ວນ, ລາວ',
    country: 'Lào',
  },
  // Quốc gia khác (sinh ở nước ngoài)
  {
    id: 'int-1',
    vi: 'Phường Hàng Trống, Quận Hoàn Kiếm, Thành phố Hà Nội, Việt Nam',
    la: 'ຫວອດຮ່າງຈົ໋ງ, ເມືອງຮວ່ານກຽມ, ນະຄອນຮ່າໂນ້ຍ, ຫວຽດນາມ',
    country: 'Việt Nam',
  },
  {
    id: 'int-2',
    vi: 'Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Việt Nam',
    la: 'ຫວອດເບ໊ນແຫງ້, ເມືອງ 1, ນະຄອນໂຮ່ຈີມິນ, ຫວຽດນາມ',
    country: 'Việt Nam',
  },
  {
    id: 'int-3',
    vi: 'Phường Thạch Thang, Quận Hải Châu, Thành phố Đà Nẵng, Việt Nam',
    la: 'ຫວອດແທກທາງ, ເມືອງຫາຍເຈົາ, ນະຄອນດານັງ, ຫວຽດນາມ',
    country: 'Việt Nam',
  },
  {
    id: 'int-4',
    vi: 'Quận Pathum Wan, Thủ đô Bangkok, Thái Lan',
    la: 'ເຂດປະທຸມວັນ, ນະຄອນຫຼວງບາງກອກ, ໄທ',
    country: 'Thái Lan',
  },
  {
    id: 'int-5',
    vi: 'Quận Muang, Tỉnh Udon Thani, Thái Lan',
    la: 'ເມືອງ, ແຂວງອຸດອນທານີ, ໄທ',
    country: 'Thái Lan',
  },
  {
    id: 'int-6',
    vi: 'Quận Muang, Tỉnh Nong Khai, Thái Lan',
    la: 'ເມືອງ, ແຂວງໜອງຄາຍ, ໄທ',
    country: 'Thái Lan',
  },
  {
    id: 'int-7',
    vi: 'Quận Shinjuku, Thủ đô Tokyo, Nhật Bản',
    la: 'ເຂດຊິນຈູກຸ, ນະຄອນຫຼວງໂຕກຽວ, ຍີ່ປຸ່ນ',
    country: 'Nhật Bản',
  },
  {
    id: 'int-8',
    vi: 'Quận 1, Thủ đô Paris, Pháp',
    la: 'ເຂດ 1, ນະຄອນຫຼວງປາຣີ, ຝຣັ່ງ',
    country: 'Pháp',
  },
];

function removeDiacritics(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd');
}

interface AddressComboboxProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  isLao?: boolean;
  placeholder?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

export const AddressCombobox: React.FC<AddressComboboxProps> = ({
  id,
  label,
  value,
  onChange,
  required = true,
  isLao = false,
  placeholder,
  error,
  helperText,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Đồng bộ giá trị ngoài truyền vào
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lọc gợi ý theo giá trị nhập
  const suggestions = useMemo(() => {
    const rawTerm = inputValue.trim();
    if (!rawTerm) {
      return SAMPLE_LOCATIONS_5_LEVELS.slice(0, 8);
    }
    const cleanTerm = removeDiacritics(rawTerm);
    const matches = SAMPLE_LOCATIONS_5_LEVELS.filter((item) => {
      const matchVi = removeDiacritics(item.vi).includes(cleanTerm);
      const matchLa = item.la.toLowerCase().includes(rawTerm.toLowerCase());
      const matchCountry = item.country ? removeDiacritics(item.country).includes(cleanTerm) : false;
      return matchVi || matchLa || matchCountry;
    });

    return matches.slice(0, 10);
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setInputValue(nextVal);
    onChange(nextVal);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSelectOption = (item: AddressItem) => {
    const selectedText = isLao ? item.la : item.vi;
    setInputValue(selectedText);
    onChange(selectedText);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue('');
    onChange('');
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        e.preventDefault();
        handleSelectOption(suggestions[highlightedIndex]);
      } else {
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const defaultPlaceholder = isLao
    ? 'ປ້ອນ ຫຼື ເລືອກ ຫົວໜ່ວຍການປົກຄອງ...'
    : 'Nhập hoặc chọn đơn vị hành chính...';

  return (
    <div ref={containerRef} className={`w-full flex flex-col gap-1.5 relative ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-[13px] font-medium text-[#1F2937] flex items-center"
        >
          <span>{label}</span>
          {required && <span className="text-[#D71920] ml-1 font-bold">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {/* Icon vị trí / pin bên trong ô */}
        <span className="absolute left-3 text-[#006B3F] pointer-events-none flex items-center">
          <MapPin className="w-4 h-4" />
        </span>

        <input
          ref={inputRef}
          id={id}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || defaultPlaceholder}
          autoComplete="off"
          className={`w-full text-[14px] text-[#1F2937] placeholder:text-[#6B7280] bg-[#FFFFFF] border rounded pl-9 pr-14 py-2 transition-colors outline-none
            ${error ? 'border-[#D71920] focus:ring-1 focus:ring-[#D71920]' : 'border-[#D9E1DC] focus:border-[#006B3F] focus:ring-1 focus:ring-[#006B3F]'}`}
        />

        {/* Nút X xóa nhanh & Mũi tên Dropdown */}
        <div className="absolute right-2.5 flex items-center gap-1 text-[#6B7280]">
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:text-[#1F2937] hover:bg-[#F3F4F6] rounded-full transition-colors"
              title="Xóa nội dung"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setIsOpen((prev) => !prev);
              inputRef.current?.focus();
            }}
            className="p-1 hover:text-[#006B3F] transition-colors"
            tabIndex={-1}
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#006B3F]' : ''}`} />
          </button>
        </div>
      </div>

      {error ? (
        <p className="text-[12px] text-[#D71920] font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[12px] text-[#6B7280]">{helperText}</p>
      ) : null}

      {/* DROPDOWN DANH SÁCH GỢI Ý 5 CẤP */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-[#D9E1DC] rounded-lg shadow-xl overflow-hidden animate-fadeIn max-h-64 overflow-y-auto">
          {suggestions.length > 0 ? (
            <ul className="py-1 text-[13px] text-[#1F2937] divide-y divide-[#F0F2F1]">
              {suggestions.map((item, idx) => {
                const displayText = isLao ? item.la : item.vi;
                const isSelected = displayText.trim() === inputValue.trim();
                const isHighlighted = idx === highlightedIndex;
                const isForeign = item.country && item.country !== 'Lào';

                return (
                  <li
                    key={item.id}
                    onClick={() => handleSelectOption(item)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`px-3 py-2.5 flex items-start gap-2.5 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#E8F3EE] text-[#006B3F] font-semibold'
                        : isHighlighted
                        ? 'bg-[#F5F7F6] text-[#1F2937]'
                        : 'hover:bg-[#F5F7F6]'
                    }`}
                  >
                    {isForeign ? (
                      <Globe className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-[#006B3F]' : 'text-[#6B7280]'}`} />
                    ) : (
                      <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-[#006B3F]' : 'text-[#006B3F]'}`} />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="leading-snug">{displayText}</div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#006B3F] shrink-0 mt-0.5 ml-2" />
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-4 py-3 text-[13px] text-[#6B7280] text-center">
              {isLao ? 'ບໍ່ພົບທີ່ຢູ່ທີ່ກົງກັນ. ທ່ານສາມາດປ້ອນໂດຍກົງໄດ້.' : 'Không tìm thấy gợi ý phù hợp. Bạn có thể tự gõ địa chỉ.'}
            </div>
          )}

          <div className="px-3 py-1.5 bg-[#F9FAFB] border-t border-[#F0F2F1] text-[11px] text-[#6B7280] flex items-center justify-between">
            <span>{isLao ? 'ລວມ 5 ຂັ້ນ: ປະເທດ → ແຂວງ → ເມືອງ → ບ້ານ → ໜ່ວຍ' : 'Đủ 5 cấp: Đơn vị → Bản → Huyện → Tỉnh/Thành phố → Quốc gia'}</span>
            <span className="hidden sm:inline font-mono text-[10px] text-[#9CA3AF]">ESC để đóng</span>
          </div>
        </div>
      )}
    </div>
  );
};
