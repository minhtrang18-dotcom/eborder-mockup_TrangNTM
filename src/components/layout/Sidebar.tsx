import React from 'react';
import {
  FileText,
  PlusCircle,
  BarChart3,
  Layers,
  Settings,
  HelpCircle,
  Radio,
  FileCheck2,
} from 'lucide-react';

export type NavTabId =
  | 'applications'
  | 'new_application'
  | 'checkpoint_monitor'
  | 'stats'
  | 'design_system';

interface SidebarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  pendingCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingCount = 2,
}) => {
  const navItems: {
    id: NavTabId;
    label: string;
    description: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeType?: 'warning' | 'normal';
  }[] = [
    {
      id: 'applications',
      label: 'Quản lý hồ sơ cấp phép',
      description: 'Danh sách và duyệt thông hành',
      icon: <FileText className="w-5 h-5 shrink-0" />,
      badge: pendingCount > 0 ? `${pendingCount} chờ duyệt` : undefined,
      badgeType: 'warning',
    },
    {
      id: 'new_application',
      label: 'Đăng ký cấp thẻ mới',
      description: 'Mẫu khai báo cư dân / thương nhân',
      icon: <PlusCircle className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'checkpoint_monitor',
      label: 'Giám sát luồng cửa khẩu',
      description: 'Kiểm soát e-Gate & Barie tự động',
      icon: <Radio className="w-5 h-5 shrink-0" />,
      badge: 'Trực tiếp',
    },
    {
      id: 'stats',
      label: 'Thống kê & Báo cáo',
      description: 'Lưu lượng qua lại biên giới',
      icon: <BarChart3 className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'design_system',
      label: 'Quy chuẩn Design System',
      description: 'Bảng đối soát Token & Specs',
      icon: <Layers className="w-5 h-5 shrink-0" />,
      badge: 'Chuẩn hoá',
    },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-[#FFFFFF] border-r border-[#D9E1DC] flex flex-col justify-between">
      <div className="py-4">
        {/* Navigation Category Label */}
        <div className="px-5 pb-2 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">
          Phân hệ nghiệp vụ
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col space-y-0.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full text-left px-5 py-3 transition-colors flex items-center justify-between text-[14px] cursor-pointer
                  ${
                    isActive
                      ? 'bg-[#E8F3EE] text-[#006B3F] font-semibold border-l-4 border-[#006B3F]'
                      : 'bg-[#FFFFFF] text-[#1F2937] font-medium hover:bg-[#E8F3EE] hover:text-[#006B3F] border-l-4 border-transparent'
                  }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={
                      isActive
                        ? 'text-[#006B3F]'
                        : 'text-[#6B7280] group-hover:text-[#006B3F]'
                    }
                  >
                    {item.icon}
                  </span>
                  <div className="truncate">
                    <div className="leading-tight">{item.label}</div>
                    <div className="text-[11px] text-[#6B7280] font-normal truncate mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`ml-2 shrink-0 text-[11px] font-medium px-2 py-0.5 rounded ${
                      item.badgeType === 'warning'
                        ? 'bg-[#FEF9E7] text-[#9A740E] border border-[#F4E29D]'
                        : 'bg-[#E8F3EE] text-[#006B3F] border border-[#D9E1DC]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Cửa khẩu phân quyền */}
        <div className="mt-8 px-5">
          <div className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
            Đơn vị quản lý
          </div>
          <div className="p-3 bg-[#F5F7F6] border border-[#D9E1DC] rounded">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-[#1F2937]">
              <FileCheck2 className="w-4 h-4 text-[#006B3F]" />
              <span>Đồn Biên phòng Hữu Nghị</span>
            </div>
            <p className="text-[12px] text-[#6B7280] mt-1">
              Phạm vi kiểm soát: Cửa khẩu Quốc tế Hữu Nghị - Lạng Sơn
            </p>
            <div className="mt-2 text-[11px] text-[#006B3F] font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#008A4B]" />
              Hệ thống kết nối trực tuyến
            </div>
          </div>
        </div>
      </div>

      {/* Footer support */}
      <div className="p-4 border-t border-[#D9E1DC] bg-[#FFFFFF] text-[12px] text-[#6B7280] space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[#1F2937] font-medium hover:text-[#006B3F] cursor-pointer">
            <HelpCircle className="w-4 h-4 text-[#6B7280]" />
            Hướng dẫn nghiệp vụ
          </span>
          <span className="text-[#9CA3AF]">F1</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[#1F2937] font-medium hover:text-[#006B3F] cursor-pointer">
            <Settings className="w-4 h-4 text-[#6B7280]" />
            Cấu hình thiết bị
          </span>
          <span className="text-[#9CA3AF]">v2.6</span>
        </div>
      </div>
    </aside>
  );
};
