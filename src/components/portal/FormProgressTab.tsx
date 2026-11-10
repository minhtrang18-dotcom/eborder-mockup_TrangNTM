import React from 'react';
import { Check } from 'lucide-react';

export interface FormProgressTabProps {
  activePart: 1 | 2 | 3;
  unlockedParts: { [key: number]: boolean };
  completedParts: { [key: number]: boolean };
  hasErrorParts: { [key: number]: boolean };
  onSelectPart: (part: 1 | 2 | 3) => void;
  isLao?: boolean;
  procedure?: 'cap-so' | 'tam-thoi';
  procedureTitle?: string;
  receivingUnitName?: string;
}

export const FormProgressTab: React.FC<FormProgressTabProps> = ({
  activePart,
  unlockedParts,
  completedParts,
  hasErrorParts,
  onSelectPart,
  isLao = false,
  procedure = 'cap-so',
  procedureTitle,
  receivingUnitName,
}) => {
  const tabs = [
    { num: 1 as const, title: isLao ? '1. ຂໍ້ມູນສ່ວນຕົວ' : '1. Thông tin cá nhân' },
    { num: 2 as const, title: isLao ? '2. ທີ່ຢູ່ ແລະ ເດັກນ້ອຍຕິດຕາມ' : '2. Địa chỉ và trẻ em đi kèm' },
    { num: 3 as const, title: isLao ? '3. ເອກະສານຄັດຕິດ ແລະ ຮັບຜົນ' : '3. Giấy tờ đính kèm và nhận kết quả' },
  ];

  const currentTabObj = tabs.find((t) => t.num === activePart) || tabs[0];
  const progressPercent = Math.round(((activePart - 1) / 2) * 100);

  const displayProcTitle =
    procedureTitle ||
    (procedure === 'tam-thoi'
      ? (isLao ? 'ຂໍໜັງສືຜ່ານແດນຊົ່ວຄາວ' : 'Cấp giấy thông hành tạm thời')
      : (isLao ? 'ຂໍອອກໜັງສືຜ່ານແດນ' : 'Cấp mới sổ thông hành'));

  const displayUnit =
    receivingUnitName ||
    (procedure === 'tam-thoi'
      ? 'Chưa chọn'
      : isLao
      ? 'ກອງບັນຊາການ ປກສ ແຂວງບໍ່ແກ້ວ'
      : 'Công an Tỉnh Bokeo');

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-[#D9E1DC] shadow-xs">
      {/* Dải thông tin nhỏ chỉ đọc phía trên */}
      <div className="bg-[#F5F7F6] border-b border-[#E5E9E7] px-4 py-2 text-[13px] text-[#4B5563]">
        <div className="max-w-[1040px] mx-auto flex flex-wrap items-center justify-between gap-y-1 gap-x-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1F2937]">
              {isLao ? 'ຂັ້ນຕອນ:' : 'Thủ tục:'}
            </span>
            <span className="text-[#006B3F] font-semibold">
              {displayProcTitle}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <span className="font-medium text-[#6B7280]">
                {isLao ? 'ວັນທີຍື່ນ:' : 'Ngày nộp:'}
              </span>{' '}
              <span className="text-[#1F2937] font-medium">
                {`${new Date().getDate().toString().padStart(2, '0')}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${new Date().getFullYear()}`}
              </span>
            </div>
            <div className="hidden sm:inline">
              <span className="font-medium text-[#6B7280]">
                {procedure === 'tam-thoi' ? 'Đơn vị tiếp nhận:' : isLao ? 'ອົງການຮັບ:' : 'Cơ quan tiếp nhận:'}
              </span>{' '}
              <span className="text-[#1F2937] font-medium">
                {displayUnit}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Thanh tabs */}
      <div className="max-w-[1040px] mx-auto px-4 py-3">
        {/* Mobile: Hiển thị dòng tóm tắt + thanh tiến độ */}
        <div className="md:hidden space-y-2">
          <div className="flex items-center justify-between text-[14px]">
            <span className="font-bold text-[#006B3F]">
              {isLao ? `ພາກ ${activePart}/3` : `Phần ${activePart}/3`} · {currentTabObj.title.replace(/^[0-9]\.\s*/, '')}
            </span>
            <span className="text-[12px] font-medium text-[#6B7280]">{progressPercent}%</span>
          </div>
          <div className="w-full bg-[#E5E7EB] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#006B3F] h-full transition-all duration-300"
              style={{ width: `${Math.max(15, progressPercent)}%` }}
            />
          </div>
        </div>

        {/* Desktop: 3 tabs nằm ngang */}
        <div className="hidden md:grid grid-cols-3 gap-3">
          {tabs.map((tab) => {
            const isVisible = activePart === tab.num;
            const isUnlocked = !!unlockedParts[tab.num];
            const isCompleted = !!completedParts[tab.num];
            const hasError = !!hasErrorParts[tab.num];

            let buttonClass = '';
            if (isVisible) {
              buttonClass = 'bg-[#006B3F] text-white font-bold shadow-xs border-[#006B3F] cursor-pointer';
            } else if (isUnlocked) {
              buttonClass =
                'bg-[#F0FDF4] text-[#006B3F] border-[#86EFAC] hover:bg-[#DCFCE7] cursor-pointer font-medium';
            } else {
              buttonClass = 'bg-[#F9FAFB] text-[#9CA3AF] border-[#E5E7EB] cursor-not-allowed';
            }

            return (
              <button
                key={tab.num}
                type="button"
                disabled={!isUnlocked}
                onClick={() => {
                  if (isUnlocked) {
                    onSelectPart(tab.num);
                  }
                }}
                className={`relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border text-left transition-colors text-[15px] ${buttonClass}`}
              >
                {/* Badge số hoặc dấu tick */}
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 ${
                    isVisible
                      ? 'bg-white text-[#006B3F]'
                      : isCompleted
                      ? 'bg-[#008A4B] text-white'
                      : isUnlocked
                      ? 'bg-[#006B3F] text-white'
                      : 'bg-[#E5E7EB] text-[#9CA3AF]'
                  }`}
                >
                  {isCompleted && !isVisible ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    tab.num
                  )}
                </span>

                <span className="truncate flex-1">{tab.title}</span>

                {/* Chấm đỏ nếu có lỗi */}
                {hasError && (
                  <span
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#D71920] rounded-full border-2 border-white flex items-center justify-center shadow-xs"
                    title="Có trường cần hoàn thành"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
