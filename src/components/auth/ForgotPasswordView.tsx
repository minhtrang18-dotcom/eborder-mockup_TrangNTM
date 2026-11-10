import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { OtpVerificationStep } from './OtpVerificationStep';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { SimulatedOtpNotification } from './SimulatedOtpToast';
import {
  findAccountByIdNumber,
  resetAccountPassword,
  verifyPassword,
} from '../../utils/ebAuthStorage';

interface ForgotPasswordViewProps {
  initialIdNumber?: string;
  onNavigateLogin: (prefilledId?: string) => void;
  onSendSimulatedOtp: (notification: SimulatedOtpNotification) => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({
  initialIdNumber = '',
  onNavigateLogin,
  onSendSimulatedOtp,
}) => {
  // Thanh bước 3 bước:
  // "1. Xác định tài khoản" → "2. Xác thực OTP" → "3. Đặt mật khẩu mới"
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form Bước 1
  const [idNumber, setIdNumber] = useState(initialIdNumber);
  const [channel, setChannel] = useState<'sms' | 'email'>('sms');
  const [idError, setIdError] = useState<string | null>(null);
  const [isSubmittingStep1, setIsSubmittingStep1] = useState(false);

  // Thông tin tài khoản tìm thấy (nếu có thật)
  const [targetAccountFound, setTargetAccountFound] = useState<boolean>(false);
  const [targetIdNumber, setTargetIdNumber] = useState<string>('');

  // OTP data
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [maskedDestination, setMaskedDestination] = useState<string>('');

  // Form Bước 3 (Đặt mật khẩu mới)
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Kiểm tra tài khoản xem kênh nào đã đăng ký
  const cleanCurrentId = idNumber.replace(/\D/g, '');
  const matchedAccount = findAccountByIdNumber(cleanCurrentId);
  const hasSms = Boolean(matchedAccount?.phone);
  const hasEmail = Boolean(matchedAccount?.email);

  const generateRandomOtpCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const maskPhone = (raw: string) => {
    const clean = raw.trim();
    if (clean.length < 7) return clean;
    return `${clean.slice(0, 3)} ***** ${clean.slice(-3)}`;
  };

  const maskEmail = (raw: string) => {
    const clean = raw.trim();
    const [name, domain] = clean.split('@');
    if (!domain) return clean;
    const maskedName = name.length <= 2 ? `${name}*` : `${name.slice(0, 2)}***`;
    return `${maskedName}@${domain}`;
  };

  // Bước 1: Gửi mã xác thực
  const handleProceedStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setIdError(null);

    const cleanId = idNumber.replace(/\D/g, '');
    if (!cleanId) {
      setIdError('Vui lòng nhập Số định danh.');
      return;
    }
    if (cleanId.length !== 13) {
      setIdError('Số định danh phải gồm đúng 13 chữ số.');
      return;
    }

    setIsSubmittingStep1(true);

    setTimeout(() => {
      setIsSubmittingStep1(false);
      setTargetIdNumber(cleanId);

      const acc = findAccountByIdNumber(cleanId);
      const code = generateRandomOtpCode();
      setGeneratedOtp(code);

      if (acc) {
        setTargetAccountFound(true);

        let dest = '';
        if (channel === 'sms' && acc.phone) {
          dest = maskPhone(acc.phone);
        } else if (channel === 'email' && acc.email) {
          dest = maskEmail(acc.email);
        } else {
          // Nếu kênh chọn không có sẵn thì lấy kênh còn lại của tài khoản
          if (acc.phone) {
            dest = maskPhone(acc.phone);
          } else if (acc.email) {
            dest = maskEmail(acc.email);
          } else {
            dest = maskPhone('020 ***** 678');
          }
        }
        setMaskedDestination(dest);

        // Chỉ sinh thông báo mô phỏng khi tài khoản có thật
        onSendSimulatedOtp({
          id: `otp_${Date.now()}`,
          channel: channel,
          recipient: dest,
          code,
        });
      } else {
        // Tài khoản không tồn tại: vẫn sang bước 2 để tránh dò tài khoản,
        // nhưng KHÔNG sinh mã thật và gán điểm đến mẫu
        setTargetAccountFound(false);
        const dummyDest =
          channel === 'sms' ? '020 ***** 678' : 'so***@gmail.com';
        setMaskedDestination(dummyDest);
      }

      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  // Bước 2: Gửi lại mã OTP
  const handleResendOtp = (): string => {
    const newCode = generateRandomOtpCode();
    setGeneratedOtp(newCode);

    if (targetAccountFound) {
      onSendSimulatedOtp({
        id: `otp_${Date.now()}`,
        channel: channel,
        recipient: maskedDestination,
        code: newCode,
      });
    }

    return newCode;
  };

  // Bước 2: Xác thực OTP thành công
  const handleOtpVerifiedSuccess = () => {
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Bước 3: Đặt lại mật khẩu mới
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setConfirmPasswordError(null);

    const hasMinLength = newPassword.length >= 8;
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const isDuplicateId =
      targetIdNumber.length > 0 && newPassword.includes(targetIdNumber);

    if (!newPassword) {
      setPasswordError('Vui lòng nhập mật khẩu mới.');
      return;
    }
    if (!hasMinLength || !hasUpper || !hasLower || !hasNumber) {
      setPasswordError(
        'Mật khẩu phải từ 8 ký tự, gồm chữ hoa, chữ thường và chữ số.'
      );
      return;
    }
    if (isDuplicateId) {
      setPasswordError('Mật khẩu không được trùng hoặc chứa số định danh.');
      return;
    }

    if (!confirmNewPassword) {
      setConfirmPasswordError('Vui lòng nhập lại mật khẩu mới.');
      return;
    }
    if (confirmNewPassword !== newPassword) {
      setConfirmPasswordError('Mật khẩu nhập lại không khớp.');
      return;
    }

    // Kiểm tra không được trùng mật khẩu hiện tại nếu tài khoản có thật
    if (targetAccountFound && targetIdNumber) {
      const acc = findAccountByIdNumber(targetIdNumber);
      if (acc) {
        const isSameOld = await verifyPassword(acc, newPassword);
        if (isSameOld) {
          setPasswordError('Mật khẩu mới không được trùng với mật khẩu hiện tại.');
          return;
        }
      }
    }

    setIsResetting(true);

    setTimeout(async () => {
      if (targetAccountFound && targetIdNumber) {
        await resetAccountPassword(targetIdNumber, newPassword);
      }
      setIsResetting(false);
      setIsResetSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  };

  return (
    <div className="w-full max-w-[520px] mx-auto animate-fadeIn">
      <div className="bg-white border border-[#D9DFDC] rounded-[12px] p-6 sm:p-8 shadow-sm">
        {/* Thanh bước 3 bước */}
        {!isResetSuccess && (
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-[#D9DFDC] z-0" />
              <div
                className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-[#006B3F] z-0 transition-all duration-300"
                style={{
                  width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
                }}
              />

              {/* Bước 1 */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-colors ${
                    currentStep >= 1
                      ? 'bg-[#006B3F] text-white'
                      : 'bg-[#F5F7F6] text-[#5F6B66] border border-[#D9DFDC]'
                  }`}
                >
                  1
                </div>
                <span
                  className={`text-[12px] mt-1 font-medium ${
                    currentStep === 1 ? 'text-[#006B3F] font-semibold' : 'text-[#5F6B66]'
                  }`}
                >
                  Xác định tài khoản
                </span>
              </div>

              {/* Bước 2 */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-colors ${
                    currentStep >= 2
                      ? 'bg-[#006B3F] text-white'
                      : 'bg-[#F5F7F6] text-[#5F6B66] border border-[#D9DFDC]'
                  }`}
                >
                  2
                </div>
                <span
                  className={`text-[12px] mt-1 font-medium ${
                    currentStep === 2 ? 'text-[#006B3F] font-semibold' : 'text-[#5F6B66]'
                  }`}
                >
                  Xác thực OTP
                </span>
              </div>

              {/* Bước 3 */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-colors ${
                    currentStep === 3
                      ? 'bg-[#006B3F] text-white'
                      : 'bg-[#F5F7F6] text-[#5F6B66] border border-[#D9DFDC]'
                  }`}
                >
                  3
                </div>
                <span
                  className={`text-[12px] mt-1 font-medium ${
                    currentStep === 3 ? 'text-[#006B3F] font-semibold' : 'text-[#5F6B66]'
                  }`}
                >
                  Đặt mật khẩu mới
                </span>
              </div>
            </div>
          </div>
        )}

        {/* BƯỚC 1: XÁC ĐỊNH TÀI KHOẢN */}
        {currentStep === 1 && (
          <form onSubmit={handleProceedStep1} noValidate className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-[22px] font-bold text-[#1A2421]">Quên mật khẩu</h2>
              <p className="text-[13px] text-[#5F6B66]">
                Nhập số định danh để nhận mã xác thực đặt lại mật khẩu
              </p>
            </div>

            <div className="space-y-4">
              {/* Số định danh */}
              <div className="space-y-1">
                <label className="text-[13px] font-medium text-[#1A2421] block">
                  Số định danh <span className="text-[#C62828] font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '');
                    setIdNumber(digits);
                    setIdError(null);
                  }}
                  placeholder="Nhập 13 chữ số"
                  maxLength={13}
                  className={`w-full h-[44px] px-3.5 text-[14px] text-[#1A2421] font-mono bg-white border rounded-[8px] outline-none transition-all
                    ${
                      idError
                        ? 'border-[#C62828] focus:ring-2 focus:ring-[#C62828]/20'
                        : 'border-[#D9DFDC] focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/15'
                    }
                  `}
                />
                {idError && <p className="text-[12px] text-[#C62828] font-medium">{idError}</p>}
              </div>

              {/* Kênh nhận mã */}
              <div className="space-y-2 pt-1">
                <label className="text-[13px] font-medium text-[#1A2421] block">
                  Chọn kênh nhận mã xác thực:
                </label>

                <div className="space-y-2">
                  {/* SMS */}
                  <label
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                      channel === 'sms'
                        ? 'border-[#006B3F] bg-[#E8F3EE]/20'
                        : 'border-[#D9DFDC] hover:border-[#006B3F]/40'
                    } ${matchedAccount && !hasSms ? 'opacity-50 cursor-not-allowed bg-[#F5F7F6]' : ''}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="forgotChannel"
                        value="sms"
                        disabled={Boolean(matchedAccount && !hasSms)}
                        checked={channel === 'sms'}
                        onChange={() => setChannel('sms')}
                        className="w-4 h-4 text-[#006B3F] focus:ring-[#006B3F]"
                      />
                      <span className="text-[13px] font-medium text-[#1A2421]">Qua tin nhắn SMS</span>
                    </div>
                    {matchedAccount && !hasSms && (
                      <span className="text-[11px] text-[#5F6B66] italic">Chưa đăng ký</span>
                    )}
                  </label>

                  {/* Email */}
                  <label
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                      channel === 'email'
                        ? 'border-[#006B3F] bg-[#E8F3EE]/20'
                        : 'border-[#D9DFDC] hover:border-[#006B3F]/40'
                    } ${matchedAccount && !hasEmail ? 'opacity-50 cursor-not-allowed bg-[#F5F7F6]' : ''}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="forgotChannel"
                        value="email"
                        disabled={Boolean(matchedAccount && !hasEmail)}
                        checked={channel === 'email'}
                        onChange={() => setChannel('email')}
                        className="w-4 h-4 text-[#006B3F] focus:ring-[#006B3F]"
                      />
                      <span className="text-[13px] font-medium text-[#1A2421]">Qua Email</span>
                    </div>
                    {matchedAccount && !hasEmail && (
                      <span className="text-[11px] text-[#5F6B66] italic">Chưa đăng ký</span>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Thông báo quy chuẩn: Luôn hiện thông báo chung để tránh dò tài khoản */}
            <p className="text-[12px] text-[#5F6B66] bg-[#F5F7F6] p-2.5 rounded-lg border border-[#D9DFDC]">
              Nếu tài khoản tồn tại trong hệ thống, mã xác thực sẽ được gửi tới phương thức liên lạc đã đăng ký.
            </p>

            <div className="space-y-3 pt-1">
              <button
                type="submit"
                disabled={isSubmittingStep1}
                className="w-full h-[44px] bg-[#006B3F] text-white hover:bg-[#005733] active:bg-[#004729] rounded-[8px] font-semibold text-[14px] flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                {isSubmittingStep1 ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang gửi mã...</span>
                  </>
                ) : (
                  <>
                    <span>Gửi mã xác thực</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => onNavigateLogin(idNumber)}
                  className="inline-flex items-center gap-1.5 text-[13px] text-[#006B3F] hover:text-[#005733] hover:underline font-medium cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Quay lại đăng nhập</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* BƯỚC 2: XÁC THỰC OTP (Dùng chung component với Register) */}
        {currentStep === 2 && (
          <OtpVerificationStep
            maskedDestination={maskedDestination}
            expectedOtp={generatedOtp}
            onSuccess={handleOtpVerifiedSuccess}
            onBackToStep1={() => setCurrentStep(1)}
            onResendOtp={handleResendOtp}
          />
        )}

        {/* BƯỚC 3: ĐẶT MẬT KHẨU MỚI */}
        {currentStep === 3 && !isResetSuccess && (
          <form onSubmit={handleResetPassword} noValidate className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-1">
              <h2 className="text-[22px] font-bold text-[#1A2421]">Đặt mật khẩu mới</h2>
              <p className="text-[13px] text-[#5F6B66]">
                Thiết lập mật khẩu mới an toàn cho tài khoản của bạn
              </p>
            </div>

            <div className="space-y-4">
              {/* Mật khẩu mới */}
              <div className="space-y-1">
                <label className="text-[13px] font-medium text-[#1A2421] block">
                  Mật khẩu mới <span className="text-[#C62828] font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError(null);
                    }}
                    placeholder="Tối thiểu 8 ký tự..."
                    className={`w-full h-[44px] pl-3.5 pr-11 text-[14px] text-[#1A2421] bg-white border rounded-[8px] outline-none transition-all
                      ${
                        passwordError
                          ? 'border-[#C62828] focus:ring-2 focus:ring-[#C62828]/20'
                          : 'border-[#D9DFDC] focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/15'
                      }
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5F6B66] hover:text-[#1A2421] p-1"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-[12px] text-[#C62828] font-medium">{passwordError}</p>
                )}

                <PasswordStrengthMeter password={newPassword} idNumber={targetIdNumber} />
              </div>

              {/* Nhập lại mật khẩu mới */}
              <div className="space-y-1">
                <label className="text-[13px] font-medium text-[#1A2421] block">
                  Nhập lại mật khẩu mới <span className="text-[#C62828] font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={(e) => {
                      setConfirmNewPassword(e.target.value);
                      setConfirmPasswordError(null);
                    }}
                    placeholder="Nhập lại chính xác mật khẩu mới..."
                    className={`w-full h-[44px] pl-3.5 pr-11 text-[14px] text-[#1A2421] bg-white border rounded-[8px] outline-none transition-all
                      ${
                        confirmPasswordError
                          ? 'border-[#C62828] focus:ring-2 focus:ring-[#C62828]/20'
                          : 'border-[#D9DFDC] focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/15'
                      }
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    aria-label={showConfirmNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5F6B66] hover:text-[#1A2421] p-1"
                  >
                    {showConfirmNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {confirmPasswordError && (
                  <p className="text-[12px] text-[#C62828] font-medium">{confirmPasswordError}</p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isResetting}
                className="w-full h-[44px] bg-[#006B3F] text-white hover:bg-[#005733] active:bg-[#004729] rounded-[8px] font-semibold text-[14px] flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                {isResetting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang cập nhật...</span>
                  </>
                ) : (
                  <span>Đặt lại mật khẩu</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* MÀN HÌNH THÀNH CÔNG SAU ĐẶT LẠI MẬT KHẨU */}
        {isResetSuccess && (
          <div className="text-center space-y-6 py-4 animate-scaleUp">
            <div className="w-16 h-16 bg-[#E8F3EE] rounded-full flex items-center justify-center mx-auto text-[#006B3F] ring-8 ring-[#E8F3EE]/50">
              <CheckCircle2 className="w-10 h-10 text-[#006B3F]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-[22px] font-bold text-[#1A2421]">Đặt lại mật khẩu thành công!</h3>
              <p className="text-[14px] text-[#5F6B66] leading-relaxed max-w-sm mx-auto">
                Mật khẩu tài khoản của bạn đã được cập nhật an toàn. Mọi khóa tài khoản và số lần thử sai trước đó đã được xóa.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigateLogin(targetIdNumber)}
                className="w-full h-[44px] bg-[#006B3F] text-white hover:bg-[#005733] active:bg-[#004729] rounded-[8px] font-semibold text-[14px] flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <span>Đăng nhập</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
