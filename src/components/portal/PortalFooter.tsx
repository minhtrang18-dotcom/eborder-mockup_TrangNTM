import React from 'react';
import { Shield, Phone, Mail, MapPin, ExternalLink, HelpCircle } from 'lucide-react';
import { PublicNavTab } from './HorizontalNavbar';

interface PortalFooterProps {
  onSelectTab: (tab: PublicNavTab) => void;
}

export const PortalFooter: React.FC<PortalFooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-[#1F2937] text-[#D1D5DB] border-t border-[#374151] mt-12">
      {/* Top Footer Banner */}
      <div className="border-b border-[#374151] py-4 bg-[#111827]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px]">
          <div className="flex items-center gap-2 text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-[#008A4B]" />
            <span className="font-medium">
              CỔNG THÔNG TIN ĐIỆN TỬ PHỤC VỤ CÔNG TÁC THÔNG HÀNH BIÊN GIỚI QUỐC GIA
            </span>
          </div>
          <div className="text-[#9CA3AF] text-xs">
            Vận hành 24/7 phục vụ công dân và doanh nghiệp hai nước Việt Nam - Lào
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Cột 1: Thông tin cơ quan */}
          <div className="md:col-span-6 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#006B3F] flex items-center justify-center text-white shrink-0">
                <Shield className="w-6 h-6 text-[#D6A928]" />
              </div>
              <div>
                <h4 className="text-[16px] font-bold text-[#FFFFFF] leading-snug">
                  CỔNG DỊCH VỤ CÔNG CẤP GIẤY THÔNG HÀNH
                </h4>
                <p className="text-[12px] text-[#9CA3AF]">
                  Sở Cảnh sát Xuất nhập cảnh · Bộ Công an Lào
                </p>
              </div>
            </div>

            <div className="space-y-2 text-[13px] text-[#9CA3AF] pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#006B3F] shrink-0 mt-0.5" />
                <span>
                  Trụ sở: Đại lộ Lan Xang, Bản Hatsady, Quận Chanthabuly, Thủ đô Viêng Chăn, CHDCND Lào | Văn phòng tiếp nhận: Đường 13 Nam, Bản Phonsavanh, TP. Pakse, Tỉnh Champasak, Lào
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#006B3F] shrink-0" />
                <span>Tổng đài hỗ trợ cấp thông hành: <strong className="text-white">(+856) 21 212 520</strong> | ĐT trực ban: (+856) 21 212 521</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#006B3F] shrink-0" />
                <span>Email hỗ trợ kỹ thuật: <strong className="text-white">hotro.borderpass@police.gov.la</strong></span>
              </div>
            </div>

            <p className="text-[12px] text-[#6B7280] pt-2">
              Cơ quan chủ quản: Sở Cảnh sát Xuất nhập cảnh · Bộ Công an Lào phối hợp Ban Quản lý cửa khẩu biên giới Lào - Việt Nam.
            </p>
          </div>

          {/* Cột 2: Link nhanh */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-[14px] font-semibold text-[#FFFFFF] uppercase tracking-wider border-b border-[#374151] pb-2">
              Liên kết nhanh
            </h5>
            <ul className="space-y-2 text-[13px]">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('procedures')}
                  className="hover:text-white hover:underline flex items-center gap-1.5 transition-colors"
                >
                  <span className="text-[#006B3F]">›</span> Thủ tục hành chính
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('submit_online')}
                  className="hover:text-white hover:underline flex items-center gap-1.5 transition-colors"
                >
                  <span className="text-[#006B3F]">›</span> Nộp hồ sơ trực tuyến
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('lookup')}
                  className="hover:text-white hover:underline flex items-center gap-1.5 transition-colors"
                >
                  <span className="text-[#006B3F]">›</span> Tra cứu tiến độ hồ sơ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('laws')}
                  className="hover:text-white hover:underline flex items-center gap-1.5 transition-colors"
                >
                  <span className="text-[#006B3F]">›</span> Văn bản pháp luật
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('faq')}
                  className="hover:text-white hover:underline flex items-center gap-1.5 transition-colors"
                >
                  <span className="text-[#006B3F]">›</span> Câu hỏi thường gặp (FAQ)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('contact')}
                  className="hover:text-white hover:underline flex items-center gap-1.5 transition-colors"
                >
                  <span className="text-[#006B3F]">›</span> Liên hệ cơ quan cấp phép
                </button>
              </li>
            </ul>
          </div>

          {/* Cột 3: Cửa khẩu áp dụng chính */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-[14px] font-semibold text-[#FFFFFF] uppercase tracking-wider border-b border-[#374151] pb-2">
              Các Cửa khẩu quốc tế trọng điểm
            </h5>
            <div className="space-y-1.5 text-[12px] text-[#9CA3AF]">
              <div className="p-2 bg-[#111827] rounded border border-[#374151]">
                <strong className="text-white block">Cửa khẩu Quốc tế Cầu Treo (Hà Tĩnh)</strong>
                <span>Tiếp giáp Cửa khẩu quốc tế Nam Phao (Bolikhamxay)</span>
              </div>
              <div className="p-2 bg-[#111827] rounded border border-[#374151]">
                <strong className="text-white block">Cửa khẩu Quốc tế Cha Lo (Quảng Bình)</strong>
                <span>Tiếp giáp Cửa khẩu quốc tế Naphao (Khammouane)</span>
              </div>
              <div className="p-2 bg-[#111827] rounded border border-[#374151]">
                <strong className="text-white block">Cửa khẩu Quốc tế Lao Bảo (Quảng Trị)</strong>
                <span>Tiếp giáp Cửa khẩu quốc tế Dansavanh (Savannakhet)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#374151] py-4 text-center text-[12px] text-[#9CA3AF] bg-[#111827]">
        <div className="max-w-[1240px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 Cổng dịch vụ công cấp giấy thông hành biên giới Việt Nam - Lào. Bảo lưu mọi quyền.
          </span>
          <span className="text-xs text-[#6B7280]">
            Phiên bản phát hành v2.6 · Chuẩn Design System e-Border Pass
          </span>
        </div>
      </div>
    </footer>
  );
};
