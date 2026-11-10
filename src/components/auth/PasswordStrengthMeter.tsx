import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
  idNumber?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  idNumber = '',
}) => {
  if (!password) return null;

  // 4 tiêu chí:
  // 1. Tối thiểu 8 ký tự
  // 2. Có chữ in hoa (A-Z)
  // 3. Có chữ thường (a-z)
  // 4. Có chữ số (0-9)
  // Không được trùng số định danh (nếu có số định danh)
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const cleanId = idNumber.replace(/\D/g, '');
  const isDuplicateId = cleanId.length > 0 && password.includes(cleanId);

  const passedCriteriaCount = [hasMinLength, hasUpper, hasLower, hasNumber].filter(
    Boolean
  ).length;

  let strengthLabel = 'Yếu';
  let strengthColor = '#C62828'; // Đỏ
  let widthPercent = 33;

  if (passedCriteriaCount === 4 && !isDuplicateId) {
    strengthLabel = 'Mạnh';
    strengthColor = '#1B7F4B'; // Xanh lá thành công
    widthPercent = 100;
  } else if (passedCriteriaCount >= 2) {
    strengthLabel = 'Trung bình';
    strengthColor = '#B26A00'; // Vàng cảnh báo
    widthPercent = 66;
  }

  return (
    <div className="space-y-2 pt-1 animate-fadeIn">
      {/* Thanh đo độ mạnh */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#5F6B66]">Độ mạnh mật khẩu:</span>
          <span className="font-semibold" style={{ color: strengthColor }}>
            {strengthLabel}
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#D9DFDC] rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300 rounded-full"
            style={{ width: `${widthPercent}%`, backgroundColor: strengthColor }}
          />
        </div>
      </div>

      {/* Danh sách 4 tiêu chí tự tick xanh khi đạt */}
      <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1">
        <div className="flex items-center gap-1.5">
          {hasMinLength ? (
            <Check className="w-3.5 h-3.5 text-[#1B7F4B] shrink-0" />
          ) : (
            <X className="w-3.5 h-3.5 text-[#5F6B66] shrink-0" />
          )}
          <span className={hasMinLength ? 'text-[#1B7F4B] font-medium' : 'text-[#5F6B66]'}>
            Ít nhất 8 ký tự
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {hasUpper ? (
            <Check className="w-3.5 h-3.5 text-[#1B7F4B] shrink-0" />
          ) : (
            <X className="w-3.5 h-3.5 text-[#5F6B66] shrink-0" />
          )}
          <span className={hasUpper ? 'text-[#1B7F4B] font-medium' : 'text-[#5F6B66]'}>
            Chữ hoa (A-Z)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {hasLower ? (
            <Check className="w-3.5 h-3.5 text-[#1B7F4B] shrink-0" />
          ) : (
            <X className="w-3.5 h-3.5 text-[#5F6B66] shrink-0" />
          )}
          <span className={hasLower ? 'text-[#1B7F4B] font-medium' : 'text-[#5F6B66]'}>
            Chữ thường (a-z)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {hasNumber ? (
            <Check className="w-3.5 h-3.5 text-[#1B7F4B] shrink-0" />
          ) : (
            <X className="w-3.5 h-3.5 text-[#5F6B66] shrink-0" />
          )}
          <span className={hasNumber ? 'text-[#1B7F4B] font-medium' : 'text-[#5F6B66]'}>
            Chữ số (0-9)
          </span>
        </div>
      </div>

      {isDuplicateId && (
        <p className="text-[11px] text-[#C62828] font-medium">
          Mật khẩu không được chứa số định danh / CMND.
        </p>
      )}
    </div>
  );
};
