import React, { useState, useEffect, useCallback } from 'react';
import { Shield, User, LogOut, ChevronDown, Menu, X, Bell, CheckCheck, CreditCard, Calendar } from 'lucide-react';
import { EbSession } from '../../utils/ebAuthStorage';
import {
  getCitizenNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  CitizenNotification,
} from '../../utils/notificationStorage';

export type AppNavRoute =
  | 'dang-ky'
  | 'dang-nhap'
  | 'quen-mat-khau'
  | 'trang-chu'
  | 'tra-cuu-thu-tuc'
  | 'nop-ho-so'
  | 'tra-cuu-ho-so'
  | 'lich-hen';

interface AuthAppHeaderProps {
  session: EbSession | null;
  currentRoute?: string;
  onLogout: () => void;
  onOpenProfile: () => void;
  onNavigateTab: (tab: AppNavRoute) => void;
}

export const AuthAppHeader: React.FC<AuthAppHeaderProps> = ({
  session,
  currentRoute,
  onLogout,
  onOpenProfile,
  onNavigateTab,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<CitizenNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = useCallback(() => {
    if (!session?.idNumber) return;
    const list = getCitizenNotifications(session.idNumber);
    setNotifications(list);
    setUnreadCount(getUnreadNotificationCount(session.idNumber));
  }, [session?.idNumber]);

  useEffect(() => {
    loadNotifications();
    const handleUpdate = () => loadNotifications();
    window.addEventListener('eb_notifications_updated', handleUpdate);
    window.addEventListener('eb_notification_added', handleUpdate);
    return () => {
      window.removeEventListener('eb_notifications_updated', handleUpdate);
      window.removeEventListener('eb_notification_added', handleUpdate);
    };
  }, [loadNotifications]);

  const getInitial = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    return parts[parts.length - 1].charAt(0).toUpperCase();
  };

  const navMenuItems: { key: AppNavRoute; label: string }[] = [
    { key: 'trang-chu', label: 'Trang chủ' },
    { key: 'tra-cuu-thu-tuc', label: 'Tra cứu thủ tục' },
    { key: 'nop-ho-so', label: 'Nộp hồ sơ' },
    { key: 'tra-cuu-ho-so', label: 'Hồ sơ của tôi' },
    { key: 'lich-hen', label: 'Lịch hẹn của tôi' },
  ];

  const isMenuItemActive = (key: AppNavRoute) => {
    if (key === 'nop-ho-so') {
      return (
        currentRoute === 'nop-ho-so' ||
        currentRoute?.startsWith('ke-khai') ||
        currentRoute?.startsWith('nop-ho-so')
      );
    }
    if (key === 'lich-hen') {
      return (
        currentRoute === 'lich-hen' ||
        currentRoute?.startsWith('sinh-trac')
      );
    }
    return currentRoute === key;
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#D9DFDC] shadow-xs select-none">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between gap-4">
        {/* Logo / Biểu tượng + Tiêu đề Cổng Dịch vụ công */}
        <div
          onClick={() => {
            if (session) {
              onNavigateTab('trang-chu');
            } else {
              onNavigateTab('dang-nhap');
            }
          }}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          {/* Logo huy hiệu */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#006B3F] to-[#004D2C] p-0.5 flex items-center justify-center shadow-xs">
            <div className="w-full h-full rounded-[10px] border border-white/30 flex items-center justify-center bg-[#006B3F]">
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] font-black tracking-tight text-[#006B3F]">
                e-Border Pass
              </span>
              <span className="text-[12px] text-[#5F6B66] font-medium hidden sm:inline">·</span>
              <span className="text-[14px] font-bold text-[#1A2421] hidden sm:inline">
                Cổng Dịch vụ công
              </span>
            </div>
            <span className="text-[11px] text-[#5F6B66] font-normal leading-tight">
              Cấp Sổ thông hành điện tử (CHDCND Lào)
            </span>
          </div>
        </div>

        {/* Menu cho các màn sau đăng nhập: Trang chủ | Tra cứu thủ tục | Nộp hồ sơ | Tra cứu hồ sơ */}
        {session && (
          <nav className="hidden lg:flex items-center space-x-1 text-[14px]">
            {navMenuItems.map((item, idx) => {
              const active = isMenuItemActive(item.key);
              return (
                <React.Fragment key={item.key}>
                  {idx > 0 && <span className="text-[#D9DFDC] px-1 select-none">|</span>}
                  <button
                    type="button"
                    onClick={() => onNavigateTab(item.key)}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      active
                        ? 'font-bold text-[#006B3F] bg-[#E8F3EE]'
                        : 'font-medium text-[#1A2421] hover:text-[#006B3F] hover:bg-[#F5F7F6]'
                    }`}
                  >
                    {item.label}
                  </button>
                </React.Fragment>
              );
            })}
          </nav>
        )}

        {/* Khối bên phải: Đã đăng nhập hoặc Chưa đăng nhập */}
        {session ? (
          <div className="flex items-center gap-2">
            {/* Chuông thông báo công dân */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-xl text-slate-700 hover:text-[#006B3F] hover:bg-[#F5F7F6] transition-colors cursor-pointer"
                aria-label="Thông báo"
                title="Thông báo"
              >
                <Bell className="w-5 h-5 text-slate-700" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-xs animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notifDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotifDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#D9DFDC] rounded-2xl shadow-xl z-50 animate-scaleUp overflow-hidden">
                    <div className="p-3.5 bg-slate-50 border-b border-[#D9DFDC] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#006B3F]" />
                        <span className="font-bold text-[14px] text-slate-900">Thông báo</span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                            {unreadCount} mới
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (session?.idNumber) {
                              markAllNotificationsAsRead(session.idNumber);
                              loadNotifications();
                            }
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#006B3F] hover:text-[#004D2C] transition-colors cursor-pointer"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          Đã đọc tất cả
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => {
                          const isPayment =
                            notif.type === 'payment' ||
                            notif.type === 'payment_required' ||
                            notif.loai === 'payment_required';
                          const title = notif.tieuDe || notif.title || 'Thông báo hệ thống';
                          const content = notif.noiDung || notif.content || '';
                          const timeStr = notif.createdAt
                            ? new Date(notif.createdAt).toLocaleString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                day: '2-digit',
                                month: '2-digit',
                              })
                            : '';

                          return (
                            <div
                              key={notif.id}
                              onClick={() => {
                                markNotificationAsRead(notif.id);
                                setNotifDropdownOpen(false);
                                if (notif.link) {
                                  window.location.hash = notif.link;
                                } else if (notif.maHoSo) {
                                  window.location.hash = `#/thanh-toan/${notif.maHoSo}`;
                                }
                              }}
                              className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${
                                !notif.read ? 'bg-[#E8F3EE]/40' : 'bg-white'
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                  isPayment
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-[#E8F3EE] text-[#006B3F]'
                                }`}
                              >
                                {isPayment ? (
                                  <CreditCard className="w-4 h-4" />
                                ) : (
                                  <Bell className="w-4 h-4" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <h4 className="text-[13px] font-semibold text-slate-900 truncate">
                                    {title}
                                  </h4>
                                  {!notif.read && (
                                    <span className="w-2 h-2 rounded-full bg-[#006B3F] shrink-0" />
                                  )}
                                </div>
                                <p className="text-[12px] text-slate-600 mt-0.5 line-clamp-3 leading-relaxed">
                                  {content}
                                </p>
                                <div className="flex items-center justify-between mt-2 pt-1">
                                  <span className="text-[10px] text-slate-400">{timeStr}</span>
                                  {isPayment && (
                                    <span className="text-[11px] font-semibold text-blue-600 hover:underline">
                                      Thanh toán ngay &rarr;
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="py-8 text-center text-slate-400 text-[13px]">
                          Không có thông báo mới
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 rounded-xl hover:bg-[#F5F7F6] border border-transparent hover:border-[#D9DFDC] transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#006B3F] text-white flex items-center justify-center font-bold text-[13px] shadow-xs">
                  {getInitial(session.fullName)}
                </div>
                <div className="text-left hidden md:block">
                  <span className="text-[13px] font-semibold text-[#1A2421] block leading-tight max-w-[140px] truncate">
                    {session.fullName}
                  </span>
                  <span className="text-[11px] font-mono text-[#5F6B66] block">
                    {session.idNumber}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-[#5F6B66]" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-56 bg-white border border-[#D9DFDC] rounded-xl shadow-lg py-1.5 z-50 animate-scaleUp text-[13px]">
                    <div className="px-4 py-2 border-b border-[#D9DFDC]/60 block md:hidden">
                      <span className="font-semibold text-[#1A2421] block truncate">
                        {session.fullName}
                      </span>
                      <span className="text-[11px] text-[#5F6B66] font-mono">
                        {session.idNumber}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full text-left px-4 py-2.5 text-[#1A2421] hover:bg-[#F5F7F6] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-[#006B3F]" />
                      <span>Thông tin tài khoản</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        onNavigateTab('lich-hen');
                      }}
                      className="w-full text-left px-4 py-2.5 text-[#1A2421] hover:bg-[#F5F7F6] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-[#006B3F]" />
                      <span>Lịch hẹn của tôi</span>
                    </button>

                    <div className="my-1 border-t border-[#D9DFDC]/60" />

                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2.5 text-[#C62828] hover:bg-[#FFF5F5] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile toggle button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#1A2421] hover:bg-[#F5F7F6] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateTab('dang-nhap')}
              className="text-[13px] font-semibold text-[#006B3F] hover:text-[#005733] px-3 py-1.5 rounded-lg hover:bg-[#E8F3EE] transition-colors cursor-pointer"
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('dang-ky')}
              className="text-[13px] font-semibold bg-[#006B3F] text-white hover:bg-[#005733] px-3.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Đăng ký
            </button>
          </div>
        )}
      </div>

      {/* Mobile nav drawer */}
      {session && mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#D9DFDC] bg-white px-4 py-3 space-y-1">
          {navMenuItems.map((item) => {
            const active = isMenuItemActive(item.key);
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateTab(item.key);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-[14px] transition-colors ${
                  active
                    ? 'font-bold text-[#006B3F] bg-[#E8F3EE]'
                    : 'font-medium text-[#1A2421] hover:bg-[#F5F7F6]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
