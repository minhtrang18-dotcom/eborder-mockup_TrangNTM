import React from 'react';
import { ArrowRight, FileCheck, RefreshCw, AlertCircle, Truck, Clock } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ProcedureItem {
  id: string;
  code: string;
  name: string;
  description: string;
  processingDays: string;
  fee: string;
  level: string;
  target: string;
}

export const PROCEDURES_DATA: ProcedureItem[] = [
  {
    id: 'TTHC-01',
    code: 'BCA-XNC-001',
    name: 'Cấp sổ thông hành biên giới Việt Nam - Lào',
    description:
      'Cấp cho công dân Việt Nam có hộ khẩu thường trú tại các tỉnh có chung đường biên giới tiếp giáp nước CHDCND Lào.',
    processingDays: '03 ngày làm việc',
    fee: '50.000 VNĐ / sổ',
    level: 'Toàn trình (Mức 4)',
    target: 'Cư dân thường trú tỉnh biên giới',
  },
  {
    id: 'TTHC-02',
    code: 'BCA-XNC-002',
    name: 'Cấp đổi, cấp lại sổ thông hành biên giới Việt Nam - Lào',
    description:
      'Thực hiện khi sổ thông hành còn thời hạn nhưng bị rách, hư hỏng, hết trang thị thực hoặc bị thất lạc.',
    processingDays: '03 ngày làm việc',
    fee: '50.000 VNĐ / sổ',
    level: 'Toàn trình (Mức 4)',
    target: 'Công dân đã có sổ thông hành',
  },
  {
    id: 'TTHC-03',
    code: 'BCA-XNC-003',
    name: 'Cấp giấy thông hành biên giới tạm thời',
    description:
      'Giải quyết cho trường hợp công dân qua lại biên giới vì lý do khẩn cấp, thăm thân nhân hoặc việc gia đình đột xuất.',
    processingDays: '01 ngày làm việc (24h)',
    fee: '20.000 VNĐ / giấy',
    level: 'Một phần (Mức 3)',
    target: 'Công dân Việt Nam và thân nhân',
  },
  {
    id: 'TTHC-04',
    code: 'BCA-XNC-004',
    name: 'Cấp giấy phép phương tiện cơ giới đường bộ liên vận Việt - Lào',
    description:
      'Cấp giấy phép lưu hành biên giới cho ô tô, xe thương mại và xe máy qua lại các cặp cửa khẩu quốc tế hai nước.',
    processingDays: '02 ngày làm việc',
    fee: '50.000 VNĐ / phương tiện',
    level: 'Toàn trình (Mức 4)',
    target: 'Chủ phương tiện / Doanh nghiệp',
  },
];

interface ProceduresSectionProps {
  onViewDetail: (procedure: ProcedureItem) => void;
  onSubmitProcedure: (procedure: ProcedureItem) => void;
}

export const ProceduresSection: React.FC<ProceduresSectionProps> = ({
  onViewDetail,
  onSubmitProcedure,
}) => {
  return (
    <section className="space-y-4">
      {/* Tiêu đề nhóm / section: 16–18px, SemiBold */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#D9E1DC] pb-3">
        <div>
          <h3 className="text-[18px] font-semibold text-[#1F2937] leading-tight">
            Thủ tục hành chính nổi bật
          </h3>
          <p className="text-[13px] text-[#6B7280] mt-0.5">
            Các dịch vụ công trực tuyến phục vụ người dân và doanh nghiệp qua lại biên giới Việt Nam - Lào
          </p>
        </div>
        <button
          type="button"
          onClick={() => onViewDetail(PROCEDURES_DATA[0])}
          className="text-[13px] font-medium text-[#006B3F] hover:text-[#004D2C] flex items-center gap-1 self-start sm:self-auto"
        >
          Xem tất cả thủ tục <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Danh sách 4 thẻ thủ tục */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PROCEDURES_DATA.map((item, idx) => (
          <div
            key={item.id}
            className="bg-[#FFFFFF] border border-[#D9E1DC] rounded-lg p-5 flex flex-col justify-between hover:border-[#006B3F] transition-all group"
          >
            <div>
              {/* Badge mức độ & mã */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-mono text-[#6B7280] bg-[#F5F7F6] px-2 py-0.5 rounded border border-[#D9E1DC]">
                  {item.code}
                </span>
                <span className="text-[11px] font-medium text-[#008A4B] bg-[#E6F5EE] px-2 py-0.5 rounded border border-[#B0DFCA]">
                  {item.level}
                </span>
              </div>

              {/* Tên thủ tục */}
              <h4 className="text-[15px] font-semibold text-[#1F2937] group-hover:text-[#006B3F] transition-colors leading-snug line-clamp-2 min-h-[42px]">
                {item.name}
              </h4>

              {/* 1 dòng mô tả */}
              <p className="text-[13px] text-[#6B7280] mt-2 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              {/* Thông tin phụ: Thời gian & Lệ phí */}
              <div className="mt-4 pt-3 border-t border-[#D9E1DC] space-y-1.5 text-[12px]">
                <div className="flex items-center justify-between text-[#6B7280]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Thời hạn:
                  </span>
                  <span className="font-medium text-[#1F2937]">{item.processingDays}</span>
                </div>
                <div className="flex items-center justify-between text-[#6B7280]">
                  <span>Lệ phí nhà nước:</span>
                  <span className="font-semibold text-[#006B3F]">{item.fee}</span>
                </div>
              </div>
            </div>

            {/* Thao tác: Link "Xem chi tiết" và Nút nộp */}
            <div className="mt-5 pt-3 border-t border-[#D9E1DC] flex items-center justify-between">
              <button
                type="button"
                onClick={() => onViewDetail(item)}
                className="text-[13px] font-medium text-[#006B3F] hover:underline cursor-pointer"
              >
                Xem chi tiết
              </button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => onSubmitProcedure(item)}
              >
                Nộp hồ sơ
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
