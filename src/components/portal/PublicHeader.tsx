import React, { useState } from 'react';
import { Globe, User, ChevronDown, Shield, FileText, LogOut } from 'lucide-react';

interface PublicHeaderProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  currentLang: 'la' | 'vi';
  onChangeLang: (lang: 'la' | 'vi') => void;
  userLoggedIn: boolean;
  onLogout: () => void;
  onSwitchToAdmin: () => void;
  onGoToMyApplications?: () => void;
  onGoToAccountInfo?: () => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  onOpenAuth,
  currentLang,
  onChangeLang,
  userLoggedIn,
  onLogout,
  onSwitchToAdmin,
  onGoToMyApplications,
  onGoToAccountInfo,
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#D9E1DC]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Bên trái: Logo + Tên Cổng dịch vụ công */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-11 h-11 rounded-lg bg-[#006B3F] flex items-center justify-center text-white shrink-0 relative shadow-2xs">
            <Shield className="w-6 h-6 text-[#D6A928]" />
            <span className="absolute -bottom-1 -right-1 text-[9px] bg-[#D6A928] text-[#1F2937] font-bold px-1 rounded-sm leading-none py-0.5">
              LA-VN
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#006B3F] uppercase tracking-wider block">
              BỘ CÔNG AN LÀO · SỞ CẢNH SÁT XUẤT NHẬP CẢNH
            </span>
            <h1 className="text-[16px] sm:text-[18px] font-bold text-[#1F2937] leading-tight">
              Cổng Dịch Vụ Công Cấp Giấy Thông Hành
            </h1>
            <span className="text-[11px] text-[#6B7280] hidden sm:block">
              ລະບົບການບໍລິການສາທາລະນະທາງເອເລັກໂຕຣນິກ ສຳລັບໜັງສືຜ່ານແດນ (Lào - Việt Nam)
            </span>
          </div>
        </div>

        {/* Bên phải: Dropdown ngôn ngữ + Đăng nhập | Đăng ký hoặc User dropdown */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Dropdown chọn ngôn ngữ */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#D9E1DC] bg-[#FFFFFF] hover:bg-[#F5F7F6] text-[13px] font-medium text-[#1F2937] transition-colors cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#006B3F]" />
              <span>{currentLang === 'la' ? 'Tiếng Lào (ພາສາລາວ)' : 'Tiếng Việt'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-[#FFFFFF] border border-[#D9E1DC] rounded shadow-md z-50 py-1">
                <button
                  type="button"
                  onClick={() => {
                    onChangeLang('vi');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-[13px] flex items-center justify-between hover:bg-[#E8F3EE] hover:text-[#006B3F] ${
                    currentLang === 'vi' ? 'font-semibold text-[#006B3F] bg-[#E8F3EE]' : 'text-[#1F2937]'
                  }`}
                >
                  <span>Tiếng Việt</span>
                  {currentLang === 'vi' && <span className="text-[#006B3F] text-xs">✓</span>}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChangeLang('la');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-[13px] flex items-center justify-between hover:bg-[#E8F3EE] hover:text-[#006B3F] ${
                    currentLang === 'la' ? 'font-semibold text-[#006B3F] bg-[#E8F3EE]' : 'text-[#1F2937]'
                  }`}
                >
                  <span>Tiếng Lào (ພາສາລາວ)</span>
                  {currentLang === 'la' && <span className="text-[#006B3F] text-xs">✓</span>}
                </button>
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-[#D9E1DC] hidden sm:block" />

          {/* Đăng nhập | Đăng ký hoặc User Avatar dropdown */}
          {userLoggedIn ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg border border-[#D9E1DC] bg-[#FFFFFF] hover:bg-[#F5F7F6] transition-colors cursor-pointer select-none shadow-2xs"
              >
                <div className="w-7 h-7 rounded-full bg-[#E8F3EE] text-[#006B3F] border border-[#B0DFCA] flex items-center justify-center font-bold text-xs shrink-0">
                  <User className="w-4 h-4 text-[#006B3F]" />
                </div>
                <span className="text-[13px] font-semibold text-[#1F2937] max-w-[140px] truncate hidden sm:inline">
                  Somchai Keovongsa
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-[#FFFFFF] border border-[#D9E1DC] rounded-xl shadow-xl z-50 py-1 animate-fadeIn">
                  <div className="px-3.5 py-2.5 border-b border-[#D9E1DC] bg-[#F5F7F6]">
                    <div className="text-[11px] text-[#6B7280]">Tài khoản công dân</div>
                    <div className="text-[13px] font-bold text-[#1F2937] truncate">
                      Somchai Keovongsa
                    </div>
                    <div className="text-[11px] font-mono text-[#006B3F]">
                      LAeID: 01-089201948
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (onGoToAccountInfo) onGoToAccountInfo();
                    }}
                    className="w-full text-left px-3.5 py-2 text-[13px] text-[#1F2937] hover:bg-[#E8F3EE] hover:text-[#006B3F] transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#6B7280]" />
                    <span>Thông tin tài khoản</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (onGoToMyApplications) onGoToMyApplications();
                    }}
                    className="w-full text-left px-3.5 py-2 text-[13px] text-[#1F2937] hover:bg-[#E8F3EE] hover:text-[#006B3F] transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-[#6B7280]" />
                    <span>Hồ sơ của tôi</span>
                  </button>

                  <div className="border-t border-[#D9E1DC] my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3.5 py-2 text-[13px] text-[#D71920] hover:bg-[#FEECEC] transition-colors flex items-center gap-2.5 cursor-pointer font-medium"
                  >
                    <LogOut className="w-4 h-4 text-[#D71920]" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center text-[14px] font-medium text-[#1F2937]">
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="hover:text-[#006B3F] cursor-pointer transition-colors"
              >
                Đăng nhập
              </button>
              <span className="mx-2 text-[#9CA3AF]">|</span>
              <button
                type="button"
                onClick={() => onOpenAuth('register')}
                className="hover:text-[#006B3F] cursor-pointer transition-colors"
              >
                Đăng ký
              </button>
            </div>
          )}

          {/* Nút chuyển đổi nhanh phân hệ Cán bộ Biên phòng kiểm soát */}
          <button
            type="button"
            onClick={onSwitchToAdmin}
            className="hidden lg:inline-flex items-center gap-1 text-[12px] font-medium text-[#006B3F] bg-[#E8F3EE] px-2.5 py-1 rounded border border-[#D9E1DC] hover:bg-[#006B3F] hover:text-white transition-colors cursor-pointer"
          >
            <span>Phân hệ Cán bộ</span>
          </button>
        </div>
      </div>
    </header>
  );
};
