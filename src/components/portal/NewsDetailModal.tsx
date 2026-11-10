import React from 'react';
import { X, Calendar, Share2, Printer, Shield } from 'lucide-react';
import { NewsItem } from './NewsSection';
import { Button } from '../ui/Button';

interface NewsDetailModalProps {
  news: NewsItem | null;
  onClose: () => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ news, onClose }) => {
  if (!news) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px] animate-fadeIn">
      <div
        className="bg-[#FFFFFF] border border-[#D9E1DC] rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#D9E1DC] flex items-center justify-between bg-[#FFFFFF]">
          <div className="flex items-center gap-2 text-[12px] text-[#6B7280]">
            <span className="font-semibold text-[#006B3F] bg-[#E8F3EE] px-2 py-0.5 rounded">
              {news.category}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {news.date}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F5F7F6] rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-[14px]">
          <h3 className="text-[20px] font-bold text-[#1F2937] leading-snug">
            {news.title}
          </h3>

          <div className="w-full h-52 rounded-lg overflow-hidden border border-[#D9E1DC]">
            <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" />
          </div>

          <p className="font-medium text-[#1F2937] leading-relaxed text-[15px]">
            {news.summary}
          </p>

          <p className="text-[#6B7280] leading-relaxed">
            Theo quy định tại Hiệp định Quy chế Biên giới Việt Nam - Lào, sổ thông hành được cấp cho công dân cư trú thường trú tại khu vực biên giới nhằm mục đích thăm thân, buôn bán tiểu ngạch và vận tải hàng hóa liên vận. Việc liên thông điện tử cấp độ 4 giúp giảm thời gian chờ đợi từ 7 ngày xuống còn 3 ngày làm việc.
          </p>

          <p className="text-[#6B7280] leading-relaxed">
            Các cá nhân, tổ chức có thể theo dõi tiến độ giải quyết hồ sơ tại mục Tra cứu hoặc liên hệ tổng đài 1900 8198 để được hướng dẫn chi tiết.
          </p>
        </div>

        <div className="px-6 py-3 border-t border-[#D9E1DC] bg-[#F5F7F6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<Printer className="w-4 h-4" />}
              onClick={() => window.print()}
            >
              In bài viết
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};
