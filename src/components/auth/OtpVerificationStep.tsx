import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RefreshCw, AlertCircle, Clock } from 'lucide-react';

interface OtpVerificationStepProps {
  maskedDestination: string; // VD: "020 ***** 678" hoặc "so***@gmail.com"
  expectedOtp: string; // Mã OTP 6 số sinh ra trong bộ nhớ
  maxResends?: number; // Tối đa 5 lần gửi
  onSuccess: () => void;
  onBackToStep1: () => void;
  onResendOtp: () => string; // Hàm tạo mã mới và trả về
}

export const OtpVerificationStep: React.FC<OtpVerificationStepProps> = ({
  maskedDestination,
  expectedOtp: initialExpectedOtp,
  maxResends = 5,
  onSuccess,
  onBackToStep1,
  onResendOtp,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [currentExpectedOtp, setCurrentExpectedOtp] = useState(initialExpectedOtp);

  // Đếm ngược 5 phút (300 giây)
  const [remainingTime, setRemainingTime] = useState<number>(300);

  // Khóa nút "Gửi lại mã" trong 60 giây sau mỗi lần gửi
  const [resendCooldown, setResendCooldown] = useState<number>(60);

  // Số lần gửi lại mã đã dùng
  const [resendCount, setResendCount] = useState<number>(1);

  // Số lần nhập sai mã (tối đa 5 lần)
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [isLockedByFailures, setIsLockedByFailures] = useState<boolean>(false);

  // Thông báo lỗi
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setCurrentExpectedOtp(initialExpectedOtp);
  }, [initialExpectedOtp]);

  // Tự động focus vào ô đầu tiên
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Timer 5 phút
  useEffect(() => {
    if (remainingTime <= 0) return;
    const interval = setInterval(() => {
      setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [remainingTime]);

  // Cooldown 60s cho gửi lại mã
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Format mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Xử lý gõ ô OTP
  const handleDigitChange = (index: number, val: string) => {
    if (isLockedByFailures || remainingTime <= 0) return;
    const numeric = val.replace(/\D/g, '');

    // Nếu paste nhiều chữ số vào một ô
    if (numeric.length > 1) {
      handlePasteString(numeric);
      return;
    }

    const next = [...digits];
    next[index] = numeric.slice(-1);
    setDigits(next);
    setErrorMessage(null);

    // Tự nhảy sang ô tiếp theo nếu có ký tự
    if (numeric && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const next = [...digits];
        next[index] = '';
        setDigits(next);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  const handlePasteString = (pasteStr: string) => {
    const cleaned = pasteStr.replace(/\D/g, '').slice(0, 6);
    if (!cleaned) return;
    const next = ['', '', '', '', '', ''];
    for (let i = 0; i < cleaned.length; i++) {
      next[i] = cleaned[i];
    }
    setDigits(next);
    setErrorMessage(null);
    const focusIdx = Math.min(cleaned.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    handlePasteString(pasted);
  };

  // Xác nhận OTP
  const handleConfirm = () => {
    if (isLockedByFailures || remainingTime <= 0) return;

    const fullCode = digits.join('');
    if (fullCode.length < 6) {
      setErrorMessage('Vui lòng nhập đủ 6 chữ số mã xác thực.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      if (fullCode === currentExpectedOtp) {
        onSuccess();
      } else {
        const newFailed = failedAttempts + 1;
        setFailedAttempts(newFailed);

        if (newFailed >= 5) {
          setIsLockedByFailures(true);
          setErrorMessage(
            'Bạn đã nhập sai mã 5 lần. Vui lòng bấm "Gửi lại mã" để nhận mã mới.'
          );
        } else {
          const remainingAttempts = 5 - newFailed;
          setErrorMessage(`Mã không đúng, bạn còn ${remainingAttempts} lần thử.`);
        }
      }
    }, 300);
  };

  // Gửi lại mã
  const handleResend = () => {
    if (resendCooldown > 0 || resendCount >= maxResends) return;

    const newCode = onResendOtp();
    setCurrentExpectedOtp(newCode);

    // Reset các trạng thái
    setDigits(['', '', '', '', '', '']);
    setRemainingTime(300); // 5 phút mới
    setResendCooldown(60); // 60s cooldown
    setResendCount((prev) => prev + 1);
    setFailedAttempts(0);
    setIsLockedByFailures(false);
    setErrorMessage(null);

    inputRefs.current[0]?.focus();
  };

  const isExpired = remainingTime <= 0;
  const isCodeComplete = digits.join('').length === 6;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1.5">
        <h3 className="text-[20px] font-bold text-[#1A2421]">Nhập mã xác thực</h3>
        <p className="text-[13px] text-[#5F6B66] leading-relaxed">
          Mã gồm 6 chữ số đã được gửi tới{' '}
          <strong className="text-[#1A2421] font-semibold">{maskedDestination}</strong>
        </p>
      </div>

      {/* Vùng 6 ô nhập OTP */}
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              disabled={isLockedByFailures || isExpired}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              aria-label={`Chữ số mã xác thực thứ ${idx + 1}`}
              className={`w-11 h-12 sm:w-12 sm:h-13 text-center text-[22px] font-bold font-mono text-[#1A2421] bg-white border-2 rounded-lg outline-none transition-all
                ${
                  errorMessage
                    ? 'border-[#C62828] bg-[#FFF5F5] focus:border-[#C62828]'
                    : digit
                    ? 'border-[#006B3F] bg-[#E8F3EE]/30'
                    : 'border-[#D9DFDC] hover:border-[#006B3F]/50 focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/20'
                }
                ${isLockedByFailures || isExpired ? 'bg-[#F5F7F6] text-[#A0ACA7] border-[#D9DFDC] cursor-not-allowed' : ''}
              `}
            />
          ))}
        </div>

        {/* Thông báo lỗi nếu có */}
        {errorMessage && (
          <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#C62828] font-medium animate-shake text-center">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Trạng thái hết hạn */}
        {isExpired && !errorMessage && (
          <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#C62828] font-semibold text-center">
            <Clock className="w-4 h-4 shrink-0" />
            <span>Mã đã hết hạn. Vui lòng gửi lại mã mới.</span>
          </div>
        )}
      </div>

      {/* Bộ đếm ngược thời gian hiệu lực và Nút gửi lại */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 text-[13px] border-t border-[#D9DFDC]/60">
        <div className="flex items-center gap-1.5 text-[#5F6B66]">
          <Clock className="w-4 h-4 text-[#006B3F]" />
          <span>Hiệu lực mã:</span>
          <span
            className={`font-mono font-bold ${
              remainingTime < 60 ? 'text-[#C62828]' : 'text-[#006B3F]'
            }`}
          >
            {formatTime(remainingTime)}
          </span>
        </div>

        <div>
          {resendCooldown > 0 ? (
            <span className="text-[12px] text-[#5F6B66] bg-[#F5F7F6] px-2.5 py-1 rounded-md border border-[#D9DFDC]">
              Gửi lại mã sau {resendCooldown}s
            </span>
          ) : resendCount >= maxResends ? (
            <span className="text-[12px] text-[#C62828]">
              Đã hết lượt gửi lại ({maxResends}/{maxResends})
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#006B3F] hover:text-[#005733] hover:underline cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Gửi lại mã</span>
              <span className="text-[11px] text-[#5F6B66]">
                ({resendCount}/{maxResends})
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Nút Xác nhận và Quay lại */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!isCodeComplete || isExpired || isLockedByFailures || isVerifying}
          className={`w-full h-[44px] rounded-lg font-semibold text-[14px] flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer
            ${
              !isCodeComplete || isExpired || isLockedByFailures || isVerifying
                ? 'bg-[#E3E8E5] text-[#8A9691] cursor-not-allowed border border-[#D9DFDC]'
                : 'bg-[#006B3F] text-white hover:bg-[#005733] active:bg-[#004729]'
            }
          `}
        >
          {isVerifying ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Đang kiểm tra...</span>
            </>
          ) : (
            <span>Xác nhận</span>
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={onBackToStep1}
            className="inline-flex items-center gap-1.5 text-[13px] text-[#006B3F] hover:text-[#005733] hover:underline font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Đổi kênh nhận mã / sửa thông tin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
