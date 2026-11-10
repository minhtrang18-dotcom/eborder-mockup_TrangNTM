import React from 'react';
import { BarChart3, TrendingUp, Calendar, Download } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const StatsReportView: React.FC = () => {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-[22px] font-bold text-[#1F2937]">
            Thống kê & Phân tích lưu lượng xuất nhập cảnh
          </h2>
          <p className="text-[14px] text-[#6B7280] mt-1">
            Tổng hợp dữ liệu luân chuyển cư dân và phương tiện thương mại qua các cửa khẩu biên giới
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="md" icon={<Calendar className="w-4 h-4" />}>
            Tháng 09/2026
          </Button>
          <Button variant="primary" size="md" icon={<Download className="w-4 h-4" />}>
            Xuất dữ liệu PDF/Excel
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] border border-[#D9E1DC] rounded-lg p-5">
          <div className="text-[13px] font-medium text-[#6B7280]">Tổng lượt xuất nhập cảnh</div>
          <div className="text-[26px] font-bold text-[#1F2937] mt-1">48.210</div>
          <div className="text-[12px] text-[#008A4B] font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +12.4% so với tháng trước
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D9E1DC] rounded-lg p-5 border-l-4 border-l-[#006B3F]">
          <div className="text-[13px] font-medium text-[#6B7280]">Cư dân biên giới</div>
          <div className="text-[26px] font-bold text-[#006B3F] mt-1">29.430</div>
          <div className="text-[12px] text-[#6B7280] mt-1">Chiếm 61% tổng lưu lượng</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D9E1DC] rounded-lg p-5 border-l-4 border-l-[#2563EB]">
          <div className="text-[13px] font-medium text-[#6B7280]">Xe vận tải hàng hóa</div>
          <div className="text-[26px] font-bold text-[#2563EB] mt-1">14.120</div>
          <div className="text-[12px] text-[#6B7280] mt-1">Trung bình 470 xe/ngày</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D9E1DC] rounded-lg p-5 border-l-4 border-l-[#D71920]">
          <div className="text-[13px] font-medium text-[#6B7280]">Số vụ ngăn chặn / Cảnh báo</div>
          <div className="text-[26px] font-bold text-[#D71920] mt-1">101</div>
          <div className="text-[12px] text-[#6B7280] mt-1">Từ chối xuất nhập cảnh</div>
        </div>
      </div>

      {/* Checkpoint breakdown */}
      <Card
        title="Lưu lượng thông quan theo từng Cửa khẩu quốc tế"
        subtitle="Dữ liệu ghi nhận từ hệ thống e-Pass và cổng kiểm soát e-Gate"
      >
        <div className="space-y-4">
          {[
            { name: 'Cửa khẩu Quốc tế Hữu Nghị (Lạng Sơn)', count: 18450, percent: 38 },
            { name: 'Cửa khẩu Quốc tế Mộc Bài (Tây Ninh)', count: 12210, percent: 25 },
            { name: 'Cửa khẩu Quốc tế Móng Cái (Quảng Ninh)', count: 9840, percent: 20 },
            { name: 'Cửa khẩu Quốc tế Lào Cai', count: 5410, percent: 11 },
            { name: 'Cửa khẩu Tân Thanh (Lạng Sơn)', count: 2300, percent: 6 },
          ].map((item) => (
            <div key={item.name} className="space-y-1.5">
              <div className="flex justify-between text-[13px]">
                <span className="font-medium text-[#1F2937]">{item.name}</span>
                <span className="font-semibold text-[#1F2937]">
                  {item.count.toLocaleString()} lượt ({item.percent}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#F5F7F6] rounded-full overflow-hidden border border-[#D9E1DC]">
                <div
                  className="h-full bg-[#006B3F] rounded-full transition-all duration-500"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
