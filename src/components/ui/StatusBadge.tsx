import React from 'react';
import { PassStatus } from '../../types/borderPass';

interface StatusBadgeProps {
  status: PassStatus;
  label?: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  showDot = true,
}) => {
  // Màu trạng thái (dùng cho badge/nhãn trạng thái hồ sơ):
  // - Thành công / Hoàn tất: #008A4B
  // - Đang xử lý / Thông tin: #2563EB
  // - Chờ xử lý / Chờ phê duyệt: #D6A928
  // - Cảnh báo: #D97706
  // - Lỗi / Từ chối / Blacklist: #D71920

  const config: Record<
    PassStatus,
    {
      color: string;
      bgColor: string;
      borderColor: string;
      dotColor: string;
      defaultLabel: string;
    }
  > = {
    APPROVED: {
      color: '#008A4B',
      bgColor: '#E6F5EE',
      borderColor: '#B0DFCA',
      dotColor: '#008A4B',
      defaultLabel: 'Đã phê duyệt / Hợp lệ',
    },
    PROCESSING: {
      color: '#2563EB',
      bgColor: '#EFF6FF',
      borderColor: '#BFDBFE',
      dotColor: '#2563EB',
      defaultLabel: 'Đang xử lý / Thông tin',
    },
    PENDING: {
      color: '#B45309', // Chờ xử lý với màu vàng nhấn #D6A928
      bgColor: '#FEF9E7',
      borderColor: '#F4E29D',
      dotColor: '#D6A928',
      defaultLabel: 'Chờ phê duyệt',
    },
    WARNING: {
      color: '#D97706',
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A',
      dotColor: '#D97706',
      defaultLabel: 'Cảnh báo kiểm tra',
    },
    REJECTED: {
      color: '#D71920',
      bgColor: '#FEECEC',
      borderColor: '#FCA5A5',
      dotColor: '#D71920',
      defaultLabel: 'Từ chối / Blacklist',
    },
  };

  const item = config[status];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium rounded border leading-none"
      style={{
        color: item.color,
        backgroundColor: item.bgColor,
        borderColor: item.borderColor,
      }}
    >
      {showDot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: item.dotColor }}
        />
      )}
      <span>{label || item.defaultLabel}</span>
    </span>
  );
};
