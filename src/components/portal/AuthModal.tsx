import React, { useState } from 'react';
import { X, Shield, Lock, User, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface AuthModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (userName: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  mode: initialMode,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [idNumber, setIdNumber] = useState('038090001234');
  const [fullName, setFullName] = useState('Khamvongsa Somchai');
  const [password, setPassword] = useState('12345678');
  const [phone, setPhone] = useState('0912345678');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(fullName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px] animate-fadeIn">
      <div
        className="bg-[#FFFFFF] border border-[#D9E1DC] rounded-xl w-full max-w-md shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#D9E1DC] flex items-center justify-between bg-[#FFFFFF]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded bg-[#E8F3EE] text-[#006B3F]">
              <Shield className="w-5 h-5 text-[#006B3F]" />
            </span>
            <div>
              <h3 className="text-[17px] font-bold text-[#1F2937]">
                {mode === 'login' ? 'Đăng nhập Cổng Dịch vụ công' : 'Đăng ký tài khoản công dân'}
              </h3>
              <p className="text-[12px] text-[#6B7280]">
                {mode === 'login'
                  ? 'Sử dụng Căn cước công dân hoặc VNeID'
                  : 'Đăng ký để nộp và theo dõi hồ sơ thông hành'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F5F7F6] rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'register' && (
            <Input
              label="Họ và tên công dân"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="NGUYỄN VĂN A"
              required
              leftIcon={<User className="w-4 h-4" />}
            />
          )}

          <Input
            label="Số Căn cước công dân / Hộ chiếu"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            placeholder="Nhập 12 số CCCD"
            required
            leftIcon={<Shield className="w-4 h-4" />}
          />

          {mode === 'register' && (
            <Input
              label="Số điện thoại di động"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0912 345 678"
              required
            />
          )}

          <Input
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            leftIcon={<Lock className="w-4 h-4" />}
          />

          <div className="flex items-center justify-between text-[12px]">
            <label className="flex items-center gap-1.5 text-[#6B7280] cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded accent-[#006B3F]" />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            {mode === 'login' && (
              <a href="#forgot" className="text-[#006B3F] hover:underline font-medium">
                Quên mật khẩu?
              </a>
            )}
          </div>

          <Button
            variant="primary"
            size="lg"
            type="submit"
            className="w-full"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            {mode === 'login' ? 'Đăng nhập hệ thống' : 'Đăng ký tài khoản'}
          </Button>

          <div className="text-center pt-2 border-t border-[#D9E1DC] text-[13px] text-[#6B7280]">
            {mode === 'login' ? (
              <div>
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-[#006B3F] font-semibold hover:underline"
                >
                  Đăng ký ngay
                </button>
              </div>
            ) : (
              <div>
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-[#006B3F] font-semibold hover:underline"
                >
                  Đăng nhập
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
