import React from 'react';
import { Shield, Bell, User, Search, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  onRefresh?: () => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh }) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF] border-b border-[#D9E1DC]">
      {/* Top Banner / Agency Bar */}
      <div className="bg-[#006B3F] text-white px-4 lg:px-6 py-1.5 flex items-center justify-between text-[12px] font-medium tracking-wide">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#D6A928] animate-pulse" />
          <span>CỔNG QUẢN LÝ THÔNG HÀNH BIÊN GIỚI QUỐC GIA - HỆ THỐNG e-BORDER PASS</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs opacity-90">
          <span>Phiên trực: Ca sáng (06:00 - 14:00)</span>
          <span>·</span>
          <span>Đường dây nóng KSBP: 1900 8198</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo & Portal Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#006B3F] flex items-center justify-center text-white relative shadow-sm">
            <Shield className="w-6 h-6 text-[#D6A928]" />
            <span className="absolute -bottom-1 -right-1 text-[9px] bg-[#D6A928] text-[#1F2937] font-bold px-1 rounded-sm leading-none py-0.5">
              VN
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[18px] lg:text-[20px] font-bold text-[#1F2937] tracking-tight leading-none">
                e-Border Pass
              </h1>
              <span className="text-[11px] font-semibold bg-[#E8F3EE] text-[#006B3F] px-2 py-0.5 rounded border border-[#D9E1DC]">
                PHIÊN BẢN v2.6 CHUẨN HOÁ
              </span>
            </div>
            <p className="text-[12px] text-[#6B7280] mt-0.5 hidden sm:block">
              Hệ thống Kiểm soát & Cấp Giấy phép Thông hành Biên giới Điện tử
            </p>
          </div>
        </div>

        {/* Global Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block w-64 lg:w-72">
            <input
              type="text"
              placeholder="Tra cứu CCCD / Mã hồ sơ / Biển số xe..."
              className="w-full text-[13px] text-[#1F2937] placeholder:text-[#6B7280] bg-[#F5F7F6] border border-[#D9E1DC] rounded px-3 py-1.5 pl-8 focus:bg-white focus:border-[#006B3F] focus:ring-1 focus:ring-[#006B3F] outline-none"
            />
            <Search className="w-4 h-4 text-[#6B7280] absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              icon={<RefreshCw className="w-4 h-4" />}
              title="Làm mới dữ liệu"
            >
              <span className="hidden sm:inline">Cập nhật</span>
            </Button>
          )}

          {/* Notification */}
          <div className="relative">
            <button
              type="button"
              className="w-9 h-9 rounded flex items-center justify-center text-[#1F2937] hover:bg-[#E8F3EE] hover:text-[#006B3F] transition-colors relative"
              aria-label="Thông báo hệ thống"
            >
              <Bell className="w-5 h-5 text-[#1F2937]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D71920]" />
            </button>
          </div>

          <div className="h-6 w-px bg-[#D9E1DC]" />

          {/* Officer profile info */}
          <div className="flex items-center gap-2.5 pl-1">
            <div className="w-8 h-8 rounded-full bg-[#E8F3EE] border border-[#D9E1DC] flex items-center justify-center text-[#006B3F]">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-[13px] font-medium text-[#1F2937] leading-tight">
                Đ/c Đ.úy Nguyễn Minh Tuấn
              </div>
              <div className="text-[11px] text-[#6B7280]">Trạm KSBP Cửa khẩu Hữu Nghị</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
