import React, { useState } from 'react';
import { Search, BookPlus, RefreshCw, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeroSectionProps {
  onSearch: (keyword: string) => void;
  onSelectShortcut: (shortcutType: 'CAP_SO' | 'CAP_DOI' | 'TAM_THOI') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onSelectShortcut,
}) => {
  const [keyword, setKeyword] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword.trim());
  };

  return (
    <section className="bg-[#E8F3EE] border border-[#D9E1DC] rounded-xl p-6 sm:p-10 lg:p-12 relative overflow-hidden">
      {/* Decorative subtle border motif */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
        {/* Emblem badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#D9E1DC] text-[#006B3F] text-[12px] font-semibold">
          <ShieldCheck className="w-4 h-4 text-[#008A4B]" />
          <span>Áp dụng theo Hiệp định Quy chế Biên giới Việt Nam - Lào</span>
        </div>

        {/* Tiêu đề lớn: 24–28px, Bold */}
        <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] tracking-tight leading-tight">
          Cổng dịch vụ công cấp giấy thông hành
        </h2>

        {/* Mô tả ngắn 1 dòng: 14px Regular, text #6B7280 */}
        <p className="text-[14px] sm:text-[15px] text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
          Tiếp nhận, xử lý trực tuyến hồ sơ cấp mới, cấp đổi và cấp giấy thông hành biên giới giữa hai nước Việt Nam - Lào nhanh chóng, minh bạch.
        </p>

        {/* Ô tìm kiếm lớn, nổi bật */}
        <form
          onSubmit={handleSearchSubmit}
          className="pt-2 max-w-2xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0 bg-[#FFFFFF] p-1.5 rounded-lg border border-[#D9E1DC] shadow-xs focus-within:border-[#006B3F] focus-within:ring-1 focus-within:ring-[#006B3F] transition-all">
            <div className="flex items-center flex-1 w-full pl-3 pr-2">
              <Search className="w-5 h-5 text-[#6B7280] shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Nhập từ khóa tìm kiếm thủ tục, giấy tờ, biểu mẫu..."
                className="w-full text-[14px] text-[#1F2937] placeholder:text-[#6B7280] bg-transparent border-none outline-none px-3 py-2"
              />
            </div>
            <Button
              variant="primary"
              size="lg"
              type="submit"
              className="w-full sm:w-auto shrink-0"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Tìm kiếm
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2.5 text-[12px] text-[#6B7280]">
            <span>Từ khóa gợi ý:</span>
            <button
              type="button"
              onClick={() => {
                setKeyword('Cấp sổ thông hành');
                onSearch('Cấp sổ thông hành');
              }}
              className="text-[#006B3F] hover:underline"
            >
              Cấp sổ thông hành
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setKeyword('Cấp đổi sổ');
                onSearch('Cấp đổi sổ');
              }}
              className="text-[#006B3F] hover:underline"
            >
              Cấp đổi sổ
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setKeyword('Tạm thời');
                onSearch('Tạm thời');
              }}
              className="text-[#006B3F] hover:underline"
            >
              Thông hành tạm thời
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setKeyword('Cửa khẩu Cầu Treo');
                onSearch('Cửa khẩu Cầu Treo');
              }}
              className="text-[#006B3F] hover:underline"
            >
              Cửa khẩu Cầu Treo
            </button>
          </div>
        </form>

        {/* 3 nút lối tắt dạng thẻ (card) ngay dưới ô tìm kiếm */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-3xl mx-auto text-left">
          {/* Lối tắt 1: Nộp hồ sơ cấp sổ */}
          <div
            onClick={() => onSelectShortcut('CAP_SO')}
            className="p-4 bg-[#FFFFFF] border border-[#D9E1DC] hover:border-[#006B3F] rounded-lg transition-all cursor-pointer group flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-lg bg-[#E8F3EE] group-hover:bg-[#006B3F] text-[#006B3F] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
              <BookPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-[#1F2937] group-hover:text-[#006B3F] leading-tight transition-colors">
                Nộp hồ sơ cấp sổ
              </h3>
              <p className="text-[12px] text-[#6B7280] mt-1 line-clamp-2">
                Dành cho công dân cấp mới lần đầu sổ thông hành biên giới Việt - Lào
              </p>
              <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#006B3F] mt-2 group-hover:translate-x-0.5 transition-transform">
                Nộp ngay <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Lối tắt 2: Nộp hồ sơ cấp đổi */}
          <div
            onClick={() => onSelectShortcut('CAP_DOI')}
            className="p-4 bg-[#FFFFFF] border border-[#D9E1DC] hover:border-[#006B3F] rounded-lg transition-all cursor-pointer group flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-lg bg-[#E8F3EE] group-hover:bg-[#006B3F] text-[#006B3F] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-[#1F2937] group-hover:text-[#006B3F] leading-tight transition-colors">
                Nộp hồ sơ cấp đổi
              </h3>
              <p className="text-[12px] text-[#6B7280] mt-1 line-clamp-2">
                Dành cho trường hợp sổ sắp hết hạn, hết trang thị thực hoặc bị hư hỏng
              </p>
              <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#006B3F] mt-2 group-hover:translate-x-0.5 transition-transform">
                Nộp ngay <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Lối tắt 3: Nộp giấy thông hành tạm thời */}
          <div
            onClick={() => onSelectShortcut('TAM_THOI')}
            className="p-4 bg-[#FFFFFF] border border-[#D9E1DC] hover:border-[#006B3F] rounded-lg transition-all cursor-pointer group flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-lg bg-[#E8F3EE] group-hover:bg-[#006B3F] text-[#006B3F] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-[#1F2937] group-hover:text-[#006B3F] leading-tight transition-colors">
                Nộp giấy thông hành tạm thời
              </h3>
              <p className="text-[12px] text-[#6B7280] mt-1 line-clamp-2">
                Giải quyết nhu cầu qua lại biên giới khẩn cấp, thời vụ ngắn hạn
              </p>
              <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#006B3F] mt-2 group-hover:translate-x-0.5 transition-transform">
                Nộp ngay <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
