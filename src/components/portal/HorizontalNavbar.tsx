import React, { useState } from 'react';
import {
  Home,
  ChevronDown,
  FileText,
  Search,
  HelpCircle,
  MessageSquare,
  Star,
  BookOpen,
  Phone,
  Info,
} from 'lucide-react';

export type PublicNavTab =
  | 'home'
  | 'intro'
  | 'procedures'
  | 'submit_online'
  | 'lookup'
  | 'feedback'
  | 'rating'
  | 'faq'
  | 'laws'
  | 'contact'
  | 'login';

interface HorizontalNavbarProps {
  activeTab: PublicNavTab;
  onSelectTab: (tab: PublicNavTab) => void;
}

export const HorizontalNavbar: React.FC<HorizontalNavbarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const [supportDropdownOpen, setSupportDropdownOpen] = useState(false);

  const isSupportActive =
    activeTab === 'faq' || activeTab === 'laws' || activeTab === 'contact';

  return (
    <nav className="bg-[#FFFFFF] border-b border-[#D9E1DC] sticky top-18 z-30 shadow-xs">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 flex items-center justify-between overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-1 min-w-max py-1">
          {/* 1. Trang chủ */}
          <button
            type="button"
            onClick={() => onSelectTab('home')}
            className={`px-3.5 py-2.5 rounded text-[14px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer select-none relative ${
              activeTab === 'home'
                ? 'bg-[#E8F3EE] text-[#006B3F] font-semibold border-b-2 border-[#006B3F]'
                : 'bg-[#FFFFFF] text-[#1F2937] hover:bg-[#E8F3EE] hover:text-[#006B3F]'
            }`}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Trang chủ</span>
          </button>

          {/* 2. Giới thiệu */}
          <button
            type="button"
            onClick={() => onSelectTab('intro')}
            className={`px-3.5 py-2.5 rounded text-[14px] font-medium transition-colors cursor-pointer select-none ${
              activeTab === 'intro'
                ? 'bg-[#E8F3EE] text-[#006B3F] font-semibold border-b-2 border-[#006B3F]'
                : 'bg-[#FFFFFF] text-[#1F2937] hover:bg-[#E8F3EE] hover:text-[#006B3F]'
            }`}
          >
            <span>Giới thiệu</span>
          </button>

          {/* 3. Thủ tục hành chính */}
          <button
            type="button"
            onClick={() => onSelectTab('procedures')}
            className={`px-3.5 py-2.5 rounded text-[14px] font-medium transition-colors cursor-pointer select-none ${
              activeTab === 'procedures'
                ? 'bg-[#E8F3EE] text-[#006B3F] font-semibold border-b-2 border-[#006B3F]'
                : 'bg-[#FFFFFF] text-[#1F2937] hover:bg-[#E8F3EE] hover:text-[#006B3F]'
            }`}
          >
            <span>Thủ tục hành chính</span>
          </button>

          {/* 4. Nộp hồ sơ trực tuyến */}
          <button
            type="button"
            onClick={() => onSelectTab('submit_online')}
            className={`px-3.5 py-2.5 rounded text-[14px] font-medium transition-colors cursor-pointer select-none ${
              activeTab === 'submit_online'
                ? 'bg-[#E8F3EE] text-[#006B3F] font-semibold border-b-2 border-[#006B3F]'
                : 'bg-[#FFFFFF] text-[#1F2937] hover:bg-[#E8F3EE] hover:text-[#006B3F]'
            }`}
          >
            <span>Nộp hồ sơ trực tuyến</span>
          </button>

          {/* 5. Tra cứu hồ sơ */}
          <button
            type="button"
            onClick={() => onSelectTab('lookup')}
            className={`px-3.5 py-2.5 rounded text-[14px] font-medium transition-colors cursor-pointer select-none ${
              activeTab === 'lookup'
                ? 'bg-[#E8F3EE] text-[#006B3F] font-semibold border-b-2 border-[#006B3F]'
                : 'bg-[#FFFFFF] text-[#1F2937] hover:bg-[#E8F3EE] hover:text-[#006B3F]'
            }`}
          >
            <span>Tra cứu hồ sơ</span>
          </button>

          {/* 6. Phản ánh - Kiến nghị */}
          <button
            type="button"
            onClick={() => onSelectTab('feedback')}
            className={`px-3.5 py-2.5 rounded text-[14px] font-medium transition-colors cursor-pointer select-none ${
              activeTab === 'feedback'
                ? 'bg-[#E8F3EE] text-[#006B3F] font-semibold border-b-2 border-[#006B3F]'
                : 'bg-[#FFFFFF] text-[#1F2937] hover:bg-[#E8F3EE] hover:text-[#006B3F]'
            }`}
          >
            <span>Phản ánh - Kiến nghị</span>
          </button>

          {/* 7. Đánh giá */}
          <button
            type="button"
            onClick={() => onSelectTab('rating')}
            className={`px-3.5 py-2.5 rounded text-[14px] font-medium transition-colors cursor-pointer select-none ${
              activeTab === 'rating'
                ? 'bg-[#E8F3EE] text-[#006B3F] font-semibold border-b-2 border-[#006B3F]'
                : 'bg-[#FFFFFF] text-[#1F2937] hover:bg-[#E8F3EE] hover:text-[#006B3F]'
            }`}
          >
            <span>Đánh giá</span>
          </button>

          {/* 8. Hỗ trợ (Dropdown) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSupportDropdownOpen(!supportDropdownOpen)}
              onMouseEnter={() => setSupportDropdownOpen(true)}
              className={`px-3.5 py-2.5 rounded text-[14px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer select-none ${
                isSupportActive
                  ? 'bg-[#E8F3EE] text-[#006B3F] font-semibold border-b-2 border-[#006B3F]'
                  : 'bg-[#FFFFFF] text-[#1F2937] hover:bg-[#E8F3EE] hover:text-[#006B3F]'
              }`}
            >
              <span>Hỗ trợ</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  supportDropdownOpen ? 'rotate-180 text-[#006B3F]' : 'text-[#6B7280]'
                }`}
              />
            </button>

            {/* Dropdown Menu: Hỏi đáp (FAQ), Văn bản pháp luật, Liên hệ */}
            {supportDropdownOpen && (
              <div
                onMouseLeave={() => setSupportDropdownOpen(false)}
                className="absolute right-0 mt-1 w-52 bg-[#FFFFFF] border border-[#D9E1DC] rounded shadow-lg z-50 py-1.5 animate-fadeIn"
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('faq');
                    setSupportDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-[13px] flex items-center gap-2.5 hover:bg-[#E8F3EE] hover:text-[#006B3F] transition-colors ${
                    activeTab === 'faq' ? 'text-[#006B3F] bg-[#E8F3EE] font-medium' : 'text-[#1F2937]'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-[#6B7280]" />
                  <span>Hỏi đáp (FAQ)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('laws');
                    setSupportDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-[13px] flex items-center gap-2.5 hover:bg-[#E8F3EE] hover:text-[#006B3F] transition-colors ${
                    activeTab === 'laws' ? 'text-[#006B3F] bg-[#E8F3EE] font-medium' : 'text-[#1F2937]'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-[#6B7280]" />
                  <span>Văn bản pháp luật</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('contact');
                    setSupportDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-[13px] flex items-center gap-2.5 hover:bg-[#E8F3EE] hover:text-[#006B3F] transition-colors ${
                    activeTab === 'contact' ? 'text-[#006B3F] bg-[#E8F3EE] font-medium' : 'text-[#1F2937]'
                  }`}
                >
                  <Phone className="w-4 h-4 text-[#6B7280]" />
                  <span>Liên hệ</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Trợ giúp trực tuyến hotline */}
        <div className="hidden lg:flex items-center gap-1.5 text-[12px] text-[#6B7280] font-medium">
          <span>Tổng đài hỗ trợ:</span>
          <span className="font-bold text-[#006B3F]">1900 8198</span>
        </div>
      </div>
    </nav>
  );
};
