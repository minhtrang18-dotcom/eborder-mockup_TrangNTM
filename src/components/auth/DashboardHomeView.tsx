import React, { useState } from 'react';
import {
  User,
  LogOut,
  FileSearch,
  FilePlus,
  Files,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { EbSession, findAccountByIdNumber } from '../../utils/ebAuthStorage';

interface DashboardHomeViewProps {
  session: EbSession;
  onLogout: () => void;
  onShowToast: (msg: string, type?: 'success' | 'danger' | 'info') => void;
  onNavigate?: (route: string) => void;
  onProceedToCapSo?: () => void | Promise<any>;
}

export const DashboardHomeView: React.FC<DashboardHomeViewProps> = ({
  session,
  onLogout,
  onShowToast,
  onNavigate,
  onProceedToCapSo,
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Lấy chi tiết tài khoản từ localStorage
  const account = findAccountByIdNumber(session.idNumber);

  // Chữ cái đầu của tên đại diện
  const getInitial = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    const last = parts[parts.length - 1];
    return last.charAt(0).toUpperCase();
  };

  // Che số điện thoại hoặc email
  const maskPhone = (raw?: string) => {
    if (!raw) return '—';
    const clean = raw.trim();
    if (clean.length < 7) return clean;
    return `${clean.slice(0, 3)} ***** ${clean.slice(-3)}`;
  };

  const maskEmail = (raw?: string) => {
    if (!raw) return '—';
    const clean = raw.trim();
    const [name, domain] = clean.split('@');
    if (!domain) return clean;
    const maskedName = name.length <= 2 ? `${name}*` : `${name.slice(0, 2)}***`;
    return `${maskedName}@${domain}`;
  };

  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.hash = `#/${route}`;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-[1040px] mx-auto">
      {/* 1. Lời chào & Banner đón tiếp */}
      <div className="bg-gradient-to-r from-[#006B3F] to-[#005733] rounded-[16px] p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        {/* Họa tiết mờ */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#FFFFFF_2px,transparent_2px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-[12px] font-medium backdrop-blur-xs">
              <Shield className="w-3.5 h-3.5" />
              <span>Cổng Dịch vụ công e-Border Pass (CHDCND Lào)</span>
            </div>
            <h1 className="text-[24px] sm:text-[28px] font-extrabold tracking-tight">
              Xin chào, {session.fullName}
            </h1>
            <p className="text-[14px] text-white/80 max-w-xl">
              Hệ thống cấp và quản lý Sổ thông hành biên giới trực tuyến. Bạn đang đăng nhập với Số định danh:{' '}
              <span className="font-mono font-bold text-white bg-white/20 px-2 py-0.5 rounded">
                {session.idNumber}
              </span>
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowProfileModal(true)}
              className="bg-white text-[#006B3F] hover:bg-[#F5F7F6] text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              Xem thông tin cá nhân
            </button>
          </div>
        </div>
      </div>

      {/* 2. Lối tắt thao tác nhanh (3 thẻ) */}
      <div className="space-y-3">
        <h2 className="text-[16px] font-bold text-[#1A2421] uppercase tracking-wider">
          Dịch vụ trực tuyến nổi bật
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Thẻ 1: Tra cứu thủ tục */}
          <div
            onClick={() => handleNavigate('tra-cuu-thu-tuc')}
            className="bg-white border border-[#D9DFDC] hover:border-[#006B3F] hover:shadow-md transition-all rounded-[12px] p-6 cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#E8F3EE] group-hover:bg-[#006B3F] transition-colors flex items-center justify-center text-[#006B3F] group-hover:text-white">
                <FileSearch className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#1A2421] group-hover:text-[#006B3F] transition-colors">
                  Tra cứu thủ tục
                </h3>
                <p className="text-[13px] text-[#5F6B66] mt-1 leading-relaxed">
                  Xem quy định, điều kiện cấp mới, cấp đổi và cấp giấy thông hành tạm thời.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-[#D9DFDC]/60 flex items-center justify-between text-[13px] font-semibold text-[#006B3F]">
              <span>Khám phá ngay</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Thẻ 2: Nộp hồ sơ */}
          <div
            onClick={() => handleNavigate('nop-ho-so')}
            className="bg-white border border-[#D9DFDC] hover:border-[#006B3F] hover:shadow-md transition-all rounded-[12px] p-6 cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#E8F3EE] group-hover:bg-[#006B3F] transition-colors flex items-center justify-center text-[#006B3F] group-hover:text-white">
                <FilePlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#1A2421] group-hover:text-[#006B3F] transition-colors">
                  Nộp hồ sơ
                </h3>
                <p className="text-[13px] text-[#5F6B66] mt-1 leading-relaxed">
                  Kê khai thông tin, đính kèm tài liệu và gửi hồ sơ đề nghị cấp sổ trực tuyến.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-[#D9DFDC]/60 flex items-center justify-between text-[13px] font-semibold text-[#006B3F]">
              <span>Thực hiện nộp</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Thẻ 3: Tra cứu hồ sơ */}
          <div
            onClick={() => handleNavigate('tra-cuu-ho-so')}
            className="bg-white border border-[#D9DFDC] hover:border-[#006B3F] hover:shadow-md transition-all rounded-[12px] p-6 cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#E8F3EE] group-hover:bg-[#006B3F] transition-colors flex items-center justify-center text-[#006B3F] group-hover:text-white">
                <Files className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#1A2421] group-hover:text-[#006B3F] transition-colors">
                  Tra cứu hồ sơ
                </h3>
                <p className="text-[13px] text-[#5F6B66] mt-1 leading-relaxed">
                  Kiểm tra tiến độ xét duyệt, tiếp tục chỉnh sửa hồ sơ nháp hoặc xem kết quả.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-[#D9DFDC]/60 flex items-center justify-between text-[13px] font-semibold text-[#006B3F]">
              <span>Xem hồ sơ</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* MODAL THÔNG TIN TÀI KHOẢN (CHỈ ĐỌC) */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px] animate-fadeIn">
          <div
            className="bg-white border border-[#D9DFDC] rounded-[16px] w-full max-w-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="px-6 py-4 border-b border-[#D9DFDC] flex items-center justify-between bg-[#F5F7F6]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E8F3EE] text-[#006B3F] flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <h3 className="text-[16px] font-bold text-[#1A2421]">Thông tin tài khoản</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="p-1.5 text-[#5F6B66] hover:text-[#1A2421] hover:bg-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nội dung chỉ đọc */}
            <div className="p-6 space-y-4 text-[13px] text-[#1A2421]">
              <div className="flex items-center gap-4 p-4 bg-[#E8F3EE]/40 border border-[#D9DFDC] rounded-xl">
                <div className="w-14 h-14 rounded-full bg-[#006B3F] text-white flex items-center justify-center font-bold text-[20px] shadow-sm shrink-0">
                  {getInitial(session.fullName)}
                </div>
                <div>
                  <h4 className="text-[16px] font-bold text-[#1A2421]">{session.fullName}</h4>
                  <p className="text-[12px] text-[#5F6B66]">Công dân CHDCND Lào</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#E8F3EE] text-[#006B3F]">
                    Đã xác thực danh tính
                  </span>
                </div>
              </div>

              <div className="space-y-3 divide-y divide-[#D9DFDC]/60 pt-2">
                <div className="flex justify-between py-2">
                  <span className="text-[#5F6B66]">Số định danh / Số CMND:</span>
                  <span className="font-mono font-bold text-[#006B3F]">{session.idNumber}</span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-[#5F6B66]">Ngày, tháng, năm sinh:</span>
                  <span className="font-medium text-[#1A2421]">
                    {account?.dob ? new Date(account.dob).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-[#5F6B66]">Số điện thoại:</span>
                  <span className="font-mono font-medium text-[#1A2421]">
                    {maskPhone(account?.phone)}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-[#5F6B66]">Địa chỉ Email:</span>
                  <span className="font-medium text-[#1A2421]">
                    {maskEmail(account?.email)}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-[#5F6B66]">Nơi thường trú:</span>
                  <span className="font-medium text-[#1A2421] text-right max-w-xs">
                    {account?.residence
                      ? typeof account.residence === 'string'
                        ? account.residence
                        : `${account.residence.detail ? account.residence.detail + ', ' : ''}${
                            account.residence.subUnit ? account.residence.subUnit + ', ' : ''
                          }${account.residence.village ? account.residence.village + ', ' : ''}${
                            account.residence.district ? account.residence.district + ', ' : ''
                          }${account.residence.province}`
                      : 'Chưa cập nhật'}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-[#5F6B66]">Ngày đăng ký tài khoản:</span>
                  <span className="font-medium text-[#1A2421]">
                    {account?.createdAt
                      ? new Date(account.createdAt).toLocaleDateString('vi-VN')
                      : 'Hôm nay'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer modal */}
            <div className="px-6 py-3 border-t border-[#D9DFDC] bg-[#F5F7F6] flex justify-end">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-white border border-[#D9DFDC] text-[#1A2421] hover:bg-[#E8F3EE] rounded-lg text-[13px] font-medium transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
