import React from 'react';
import { Calendar, ArrowRight, BellRing } from 'lucide-react';

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  imageUrl: string;
  category: string;
}

export const NEWS_DATA: NewsItem[] = [
  {
    id: 'NEWS-01',
    title: 'Triển khai cấp Giấy thông hành biên giới điện tử qua Cổng Dịch vụ công từ tháng 10/2026',
    date: '28/09/2026',
    summary:
      'Tạo điều kiện thuận lợi tối đa cho công dân các tỉnh tiếp giáp Lào (Điện Biên, Sơn La, Thanh Hóa, Nghệ An, Hà Tĩnh, Quảng Bình, Quảng Trị, Thừa Thiên Huế, Quảng Nam, Kon Tum) nộp hồ sơ trực tuyến không cần đến trực tiếp cơ quan công an.',
    imageUrl:
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=300&auto=format&fit=crop&q=80',
    category: 'Thông báo chính sách',
  },
  {
    id: 'NEWS-02',
    title: 'Hiệp định Quy chế Quản lý Biên giới và Cửa khẩu biên giới trên đất liền Việt Nam - Lào',
    date: '25/09/2026',
    summary:
      'Cập nhật thời hạn sử dụng của Sổ thông hành biên giới có giá trị không quá 12 tháng, không gia hạn; khi hết hạn được cấp đổi sổ mới theo trình tự điện tử liên thông.',
    imageUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80',
    category: 'Văn bản hướng dẫn',
  },
  {
    id: 'NEWS-03',
    title: 'Phân luồng e-Gate thông quan tự động tại các Cửa khẩu Quốc tế Cầu Treo, Cha Lo và Lao Bảo',
    date: '22/09/2026',
    summary:
      'Lực lượng Biên phòng hai bên phối hợp lắp đặt hệ thống Barie quét mã QR e-Pass, rút ngắn thời gian làm thủ tục qua lại biên giới chỉ còn dưới 15 giây mỗi lượt.',
    imageUrl:
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=300&auto=format&fit=crop&q=80',
    category: 'Tin tức cửa khẩu',
  },
];

interface NewsSectionProps {
  onSelectNews: (news: NewsItem) => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ onSelectNews }) => {
  return (
    <section className="space-y-4">
      {/* Tiêu đề nhóm / section: 16–18px, SemiBold */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#D9E1DC] pb-3">
        <div className="flex items-center gap-2">
          <BellRing className="w-5 h-5 text-[#006B3F]" />
          <h3 className="text-[18px] font-semibold text-[#1F2937] leading-tight">
            Tin tức, thông báo
          </h3>
        </div>
        <button
          type="button"
          onClick={() => onSelectNews(NEWS_DATA[0])}
          className="text-[13px] font-medium text-[#006B3F] hover:text-[#004D2C] flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          Xem tất cả tin tức <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Danh sách 3 tin dạng card ngang: ảnh thumbnail nhỏ bên trái, tiêu đề + ngày đăng bên phải */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {NEWS_DATA.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectNews(item)}
            className="bg-[#FFFFFF] border border-[#D9E1DC] rounded-lg p-3 hover:border-[#006B3F] transition-all cursor-pointer group flex gap-3.5 items-start"
          >
            {/* Ảnh thumbnail nhỏ bên trái */}
            <div className="w-24 h-24 sm:w-28 sm:h-24 rounded overflow-hidden shrink-0 bg-[#F5F7F6] border border-[#D9E1DC]">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Tiêu đề + ngày đăng bên phải */}
            <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
              <div>
                <span className="text-[11px] font-medium text-[#006B3F] bg-[#E8F3EE] px-2 py-0.5 rounded inline-block mb-1">
                  {item.category}
                </span>
                <h4 className="text-[14px] font-semibold text-[#1F2937] group-hover:text-[#006B3F] transition-colors leading-snug line-clamp-2">
                  {item.title}
                </h4>
              </div>

              <div className="flex items-center gap-1.5 text-[12px] text-[#6B7280] mt-2 pt-1 border-t border-[#D9E1DC]/60">
                <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                <span>{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
