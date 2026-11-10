import React from 'react';
import { ArrowDown, Check } from 'lucide-react';
import { Button } from '../ui/Button';

export interface SectionContinueButtonProps {
  nextPartName: string;
  isCompleted: boolean;
  onContinue: () => void;
  isLao?: boolean;
}

export const SectionContinueButton: React.FC<SectionContinueButtonProps> = ({
  nextPartName,
  isCompleted,
  onContinue,
  isLao = false,
}) => {
  return (
    <div className="pt-6 border-t border-[#E5E9E7] flex flex-col items-center justify-center text-center space-y-2">
      {isCompleted ? (
        <div className="flex flex-col items-center gap-1.5">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8F3EE] text-[#008A4B] text-[15px] font-bold border border-[#B0DFCA]">
            <Check className="w-5 h-5 stroke-[2.5]" />
            <span>{isLao ? '✓ ໄດ້ສຳເລັດພາກນີ້ແລ້ວ' : '✓ Đã hoàn thành phần này'}</span>
          </div>
          <p className="text-[13px] text-[#6B7280]">
            Bạn vẫn có thể trực tiếp sửa các thông tin bên trên bất kỳ lúc nào.
          </p>
        </div>
      ) : (
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onContinue}
          className="min-h-[48px] px-8 text-[16px] font-semibold group cursor-pointer"
        >
          <span>{isLao ? 'ຕໍ່ໄປ' : 'Tiếp tục'}</span>
          <span className="inline-flex ml-2 transition-transform motion-safe:animate-bounce-gentle">
            <ArrowDown className="w-5 h-5 stroke-[2.5]" />
          </span>
        </Button>
      )}
    </div>
  );
};
