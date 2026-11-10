import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Shield, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import {
  findAccountByIdNumber,
  checkAccountLockStatus,
  recordLoginAttempt,
  saveSession,
  verifyPassword,
  EbSession,
} from '../../utils/ebAuthStorage';

interface LoginViewProps {
  prefilledIdNumber?: string;
  onLoginSuccess: (session: EbSession) => void;
  onNavigateRegister: () => void;
  onNavigateForgotPassword: (prefilledId?: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'danger' | 'info') => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  prefilledIdNumber = '',
  onLoginSuccess,
  onNavigateRegister,
  onNavigateForgotPassword,
  onShowToast,
}) => {
  const [idNumber, setIdNumber] = useState(prefilledIdNumber);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Trạng thái kiểm tra và khóa tài khoản
  const [isLocked, setIsLocked] = useState(false);
  const [lockRemainingSeconds, setLockRemainingSeconds] = useState(0);

  // Lỗi form
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [idError, setIdError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Cập nhật khi có prefilledIdNumber từ đăng ký hoặc quên mật khẩu
  useEffect(() => {
    if (prefilledIdNumber) {
      setIdNumber(prefilledIdNumber);
    }
  }, [prefilledIdNumber]);

  // Kiểm tra thời gian khóa tài khoản nếu có
  useEffect(() => {
    if (!idNumber) {
      setIsLocked(false);
      setLockRemainingSeconds(0);
      return;
    }

    const status = checkAccountLockStatus(idNumber);
    if (status.isLocked) {
      setIsLocked(true);
      setLockRemainingSeconds(status.remainingSeconds);
    } else {
      setIsLocked(false);
      setLockRemainingSeconds(0);
    }
  }, [idNumber]);

  // Đếm ngược đồng hồ khóa tài khoản
  useEffect(() => {
    if (!isLocked || lockRemainingSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsLocked(false);
          setGeneralError(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isLocked, lockRemainingSeconds]);

  const formatLockTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setIdError(null);

    // Validate định dạng ID
    const cleanId = idNumber.replace(/\D/g, '');
    if (!cleanId) {
      setIdError('Vui lòng nhập Số định danh.');
      return;
    }
    if (cleanId.length !== 13) {
      setIdError('Số định danh phải gồm đúng 13 chữ số.');
      return;
    }

    if (!password) {
      setGeneralError('Vui lòng nhập mật khẩu.');
      return;
    }

    // Kiểm tra khóa trước khi xử lý
    const lockStatus = checkAccountLockStatus(cleanId);
    if (lockStatus.isLocked) {
      setIsLocked(true);
      setLockRemainingSeconds(lockStatus.remainingSeconds);
      return;
    }

    setIsLoggingIn(true);

    // Giả lập xử lý spinner 600ms
    setTimeout(async () => {
      const account = findAccountByIdNumber(cleanId);

      // Nếu tài khoản không tồn tại hoặc sai mật khẩu
      // Báo CHUNG một thông báo để bảo mật: "Số định danh/CMND hoặc mật khẩu không đúng"
      let isSuccess = false;
      if (account) {
        const passwordMatches = await verifyPassword(account, password);
        if (passwordMatches) {
          isSuccess = true;
        }
      }

      if (isSuccess && account) {
        // Đăng nhập đúng: xóa bộ đếm sai
        recordLoginAttempt(cleanId, true);
        saveSession(
          {
            id: account.id,
            fullName: account.fullName,
            idNumber: account.idNumber,
            gender: account.gender,
            dob: account.dob || account.dateOfBirth,
            dateOfBirth: account.dateOfBirth || account.dob,
          },
          rememberMe
        );

        setIsLoggingIn(false);
        onLoginSuccess({
          userId: account.id,
          fullName: account.fullName,
          idNumber: account.idNumber,
          gender: account.gender,
          dob: account.dob || account.dateOfBirth,
          dateOfBirth: account.dateOfBirth || account.dob,
          loginAt: new Date().toISOString(),
          rememberMe,
        });
      } else {
        // Đăng nhập sai: Ghi nhận lần sai (chỉ tính vào account nếu tồn tại)
        const attemptResult = recordLoginAttempt(cleanId, false);
        setIsLoggingIn(false);

        if (attemptResult.isLocked) {
          setIsLocked(true);
          const remaining = checkAccountLockStatus(cleanId).remainingSeconds;
          setLockRemainingSeconds(remaining);
        } else {
          setGeneralError('Số định danh hoặc mật khẩu không đúng.');
        }
      }
    }, 600);
  };

  const handleLaeIdLogin = () => {
    onShowToast('Tính năng đăng nhập bằng LAeID đang được tích hợp.', 'info');
  };

  return (
    <div className="w-full max-w-[440px] mx-auto animate-fadeIn">
      <div className="bg-white border border-[#D9DFDC] rounded-[12px] p-6 sm:p-8 shadow-sm space-y-6">
        {/* Tiêu đề & mô tả ngắn */}
        <div className="text-center space-y-1">
          <h2 className="text-[22px] font-bold text-[#1A2421]">Đăng nhập</h2>
          <p className="text-[13px] text-[#5F6B66]">
            Cổng Dịch vụ công cấp giấy thông hành
          </p>
        </div>

        {/* Banner vàng nếu tài khoản bị khóa 5 phút */}
        {isLocked && (
          <div className="p-3.5 bg-[#FFF8E7] border border-[#F4E29D] border-l-4 border-l-[#B26A00] rounded-lg flex items-start gap-2.5 text-[13px] text-[#B26A00] animate-fadeIn">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-[#B26A00]" />
            <div>
              <div className="font-bold leading-tight">Tài khoản tạm khóa do nhập sai nhiều lần</div>
              <div className="text-[12px] text-[#1A2421] mt-0.5">
                Vui lòng thử lại sau:{' '}
                <strong className="font-mono font-bold text-[#B26A00] text-[13px]">
                  {formatLockTime(lockRemainingSeconds)}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* Lỗi chung không khớp thông tin */}
        {generalError && !isLocked && (
          <div className="p-3 bg-[#FFF5F5] border border-[#FCA5A5] border-l-4 border-l-[#C62828] rounded-lg text-[13px] text-[#C62828] font-medium animate-shake">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Số định danh */}
          <div className="space-y-1">
            <label className="text-[13px] font-medium text-[#1A2421] block">
              Số định danh <span className="text-[#C62828] font-bold">*</span>
            </label>
            <input
              type="text"
              value={idNumber}
              disabled={isLoggingIn}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '');
                setIdNumber(digits);
                setIdError(null);
                setGeneralError(null);
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

          {/* Mật khẩu */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-medium text-[#1A2421]">
                Mật khẩu <span className="text-[#C62828] font-bold">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                disabled={isLoggingIn || isLocked}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setGeneralError(null);
                }}
                placeholder="Nhập mật khẩu..."
                className="w-full h-[44px] pl-3.5 pr-11 text-[14px] text-[#1A2421] bg-white border border-[#D9DFDC] rounded-[8px] outline-none focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/15 disabled:bg-[#F5F7F6]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5F6B66] hover:text-[#1A2421] p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Ghi nhớ đăng nhập & Quên mật khẩu */}
          <div className="flex items-center justify-between text-[13px] pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-[#1A2421] select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#006B3F] rounded border-[#D9DFDC] focus:ring-[#006B3F] cursor-pointer"
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>

            <button
              type="button"
              onClick={() => onNavigateForgotPassword(idNumber)}
              className="text-[#006B3F] hover:text-[#005733] hover:underline font-medium cursor-pointer"
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* Nút Đăng nhập (Primary, full width, spinner giả lập 600ms) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoggingIn || isLocked}
              className={`w-full h-[44px] rounded-[8px] font-semibold text-[14px] flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer
                ${
                  isLoggingIn || isLocked
                    ? 'bg-[#E3E8E5] text-[#8A9691] cursor-not-allowed border border-[#D9DFDC]'
                    : 'bg-[#006B3F] text-white hover:bg-[#005733] active:bg-[#004729]'
                }
              `}
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                <span>Đăng nhập</span>
              )}
            </button>
          </div>

          {/* Dải phân cách "hoặc" */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#D9DFDC]" />
            </div>
            <div className="relative flex justify-center text-[12px] uppercase">
              <span className="bg-white px-3 text-[#5F6B66]">hoặc</span>
            </div>
          </div>

          {/* Nút Secondary: Đăng nhập bằng LAeID (Giả lập) */}
          <button
            type="button"
            onClick={handleLaeIdLogin}
            className="w-full h-[44px] border border-[#D9DFDC] hover:bg-[#F5F7F6] text-[#1A2421] rounded-[8px] font-medium text-[13px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Shield className="w-4 h-4 text-[#006B3F]" />
            <span>Đăng nhập bằng LAeID</span>
          </button>

          {/* Dòng cuối: Chưa có tài khoản? Đăng ký */}
          <div className="text-center pt-2">
            <span className="text-[13px] text-[#5F6B66]">Chưa có tài khoản? </span>
            <button
              type="button"
              onClick={onNavigateRegister}
              className="text-[13px] text-[#006B3F] font-semibold hover:underline cursor-pointer"
            >
              Đăng ký
            </button>
          </div>

          {/* Lối tắt điền nhanh các tài khoản kiểm thử */}
          <div className="pt-3 border-t border-[#D9DFDC]/80 space-y-2">
            <div className="text-[11.5px] font-semibold text-[#5F6B66] text-center">
              Tài khoản kiểm thử (Mật khẩu chung: <span className="font-mono text-[#006B3F]">123aA@</span>):
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setIdNumber('0311840139633');
                  setPassword('123aA@');
                  setIdError(null);
                  setGeneralError(null);
                  onShowToast('Đã điền tài khoản: Somchai Keovongsa (Tỉnh giáp biên giới Bokeo)', 'info');
                }}
                className="w-full px-2.5 py-1.5 rounded-md border border-[#D9DFDC] hover:border-[#006B3F] hover:bg-[#E8F3EE]/50 text-left text-[11.5px] flex items-center justify-between transition-colors cursor-pointer"
                title="Bấm để điền nhanh tài khoản Somchai Keovongsa (tỉnh giáp biên giới)"
              >
                <span>
                  <strong>Somchai</strong>: <span className="font-mono font-medium">0311840139633</span>
                </span>
                <span className="text-[10.5px] text-[#006B3F] font-semibold">Tỉnh giáp biên giới (Bokeo)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIdNumber('1234567890123');
                  setPassword('123aA@');
                  setIdError(null);
                  setGeneralError(null);
                  onShowToast('Đã điền tài khoản: Trương Tùng Lan (Tỉnh không giáp biên giới Luang Prabang)', 'info');
                }}
                className="w-full px-2.5 py-1.5 rounded-md border border-[#D9DFDC] hover:border-[#006B3F] hover:bg-[#E8F3EE]/50 text-left text-[11.5px] flex items-center justify-between transition-colors cursor-pointer"
                title="Bấm để điền nhanh tài khoản Trương Tùng Lan"
              >
                <span>
                  <strong>Lan</strong>: <span className="font-mono font-medium">1234567890123</span>
                </span>
                <span className="text-[10.5px] text-[#1D4ED8] font-medium">Tỉnh không biên giới (Luang Prabang)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIdNumber('0311840139631');
                  setPassword('123aA@');
                  setIdError(null);
                  setGeneralError(null);
                  onShowToast('Đã điền tài khoản: Bounmy Sisavath (Chưa có nơi thường trú)', 'info');
                }}
                className="w-full px-2.5 py-1.5 rounded-md border border-[#D9DFDC] hover:border-[#D71920] hover:bg-[#FFF5F5] text-left text-[11.5px] flex items-center justify-between transition-colors cursor-pointer"
                title="Bấm để điền nhanh tài khoản chưa có nơi thường trú"
              >
                <span>
                  <strong>Bounmy</strong>: <span className="font-mono font-medium">0311840139631</span>
                </span>
                <span className="text-[10.5px] text-[#D71920] font-semibold">Chưa có nơi thường trú</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIdNumber('1234567890124');
                  setPassword('123aA@');
                  setIdError(null);
                  setGeneralError(null);
                  onShowToast('Đã điền tài khoản: Trần Nam Huân (Chưa có sinh trắc, đang có LH-0001)', 'info');
                }}
                className="w-full px-2.5 py-1.5 rounded-md border border-[#D9DFDC] hover:border-[#006B3F] hover:bg-[#E8F3EE]/50 text-left text-[11.5px] flex items-center justify-between transition-colors cursor-pointer"
                title="Bấm để điền nhanh tài khoản Trần Nam Huân"
              >
                <span>
                  <strong>Huân</strong>: <span className="font-mono font-medium">1234567890124</span>
                </span>
                <span className="text-[10.5px] text-[#B26A00] font-medium">Có LH-0001</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
