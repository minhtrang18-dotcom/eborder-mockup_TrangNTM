export type PassStatus =
  | 'APPROVED'      // Thành công / Hoàn tất (#008A4B)
  | 'PROCESSING'    // Đang xử lý / Thông tin (#2563EB)
  | 'PENDING'       // Chờ xử lý / Chờ phê duyệt (#D6A928)
  | 'WARNING'       // Cảnh báo (#D97706)
  | 'REJECTED';     // Lỗi / Từ chối / Blacklist (#D71920)

export type PassType =
  | 'THUONG_TRU'    // Cư dân biên giới (Thường trú)
  | 'KINH_DOANH'    // Thương nhân / Giao thương tiểu ngạch
  | 'VAN_TAI'       // Tài xế xe vận tải liên vận
  | 'THAM_THAN';    // Thăm thân nhân / Lao động thời vụ

export interface BorderPassApplication {
  id: string; // e.g. "BP-2026-0891"
  applicantName: string;
  nationalId: string; // CCCD/Hộ chiếu
  gender: 'Nam' | 'Nữ';
  dob: string;
  phoneNumber: string;
  residenceAddress: string;
  checkpoint: string; // e.g. "Cửa khẩu Quốc tế Hữu Nghị"
  passType: PassType;
  submissionDate: string;
  expiryDate: string;
  vehiclePlate?: string;
  status: PassStatus;
  statusNote: string;
  officerInCharge: string;
  avatarUrl: string;
  qrCodeToken: string;
  isBlacklistFlag?: boolean;
}

export interface CheckpointStat {
  id: string;
  name: string;
  province: string;
  todayCount: number;
  approvedCount: number;
  pendingCount: number;
  alertCount: number;
}
