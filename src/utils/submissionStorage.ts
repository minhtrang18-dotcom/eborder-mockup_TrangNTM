// Quản lý dữ liệu hồ sơ thông hành: eb_applications và eb_audit_log
// Cung cấp các thao tác Xem, Tiếp tục chỉnh sửa, Bổ sung, Xóa, In phiếu
import { addCitizenNotification } from './notificationStorage';

export type ApplicationStatus =
  | 'Hồ sơ chưa gửi'
  | 'Đã gửi'
  | 'Yêu cầu bổ sung'
  | 'Từ chối tiếp nhận'
  | 'Đã rút'
  | 'Đã tiếp nhận'
  | 'Đang thẩm định'
  | 'Chờ phê duyệt cấp'
  | 'Chờ phê duyệt từ chối'
  | 'Đã phê duyệt'
  | 'Đã từ chối cấp'
  | 'Đang in'
  | 'Chờ trả kết quả'
  | 'Hoàn tất';

export const ALL_APPLICATION_STATUSES: ApplicationStatus[] = [
  'Hồ sơ chưa gửi',
  'Đã gửi',
  'Yêu cầu bổ sung',
  'Từ chối tiếp nhận',
  'Đã rút',
  'Đã tiếp nhận',
  'Đang thẩm định',
  'Chờ phê duyệt cấp',
  'Chờ phê duyệt từ chối',
  'Đã phê duyệt',
  'Đã từ chối cấp',
  'Đang in',
  'Chờ trả kết quả',
  'Hoàn tất',
];

export type PaymentStatus =
  | '-'
  | 'Chờ thanh toán'
  | 'Đang xử lý giao dịch'
  | 'Thanh toán lỗi'
  | 'Đã thanh toán'
  | 'Không phát sinh lệ phí';

export const ALL_PAYMENT_STATUSES: PaymentStatus[] = [
  '-',
  'Chờ thanh toán',
  'Đang xử lý giao dịch',
  'Thanh toán lỗi',
  'Đã thanh toán',
  'Không phát sinh lệ phí',
];

export type ApplicationAppointmentStatus = 'Chờ xác nhận' | 'Đã xác nhận';

export interface ApplicationAppointment {
  ngay: string; // YYYY-MM-DD
  khungGio: string; // e.g. "09:00–10:00"
  coQuan: string;
  sdt: string;
  ghiChu?: string;
  trangThai: ApplicationAppointmentStatus;
}

export interface SupplementRequest {
  ngayYeuCau: string;
  donViYeuCau: string;
  noiDung: string;
  giayToThieu: string[];
}

export interface StoredApplication {
  maHoSo: string; // Sinh dạng HS-yyyyMMdd-xxxx khi lưu nháp lần đầu
  taiKhoan: string; // Số định danh công dân
  userId?: string;
  thuTuc: 'cap-so' | 'tam-thoi';
  procedure?: 'cap-so' | 'tam-thoi';
  loaiThuTuc: string;
  trangThai: ApplicationStatus;
  ngayLuu: string;
  ngayGui?: string;
  ngayTao?: string;
  duLieu: Record<string, any>;
  formData?: Record<string, any>;
  yeuCauBoSung?: SupplementRequest;
  soLanBoSung: number; // Mặc định 0
  hoTenNguoiNop: string;
  cccd?: string;
  donViTiepNhan?: 'Cửa khẩu' | 'Phòng Xuất nhập cảnh';
  cuaKhau?: string;
  phongXNC?: string;
  checkpoint?: string;
  truongHopDeNghi?: string;
  lyDoCuThe?: string;
  currentStep?: number;
  ngheNghiep?: string;
  ngheNghiepKhac?: string;
  mauToc?: string;
  mauTocKhac?: string;
  mauMat?: string;
  mauMatKhac?: string;
  receivingAgency?: string;
  // Lịch hẹn thu nhận sinh trắc gắn liền với hồ sơ
  lichHen?: ApplicationAppointment;
  // Thông tin thanh toán lệ phí (Mock Finlink Gateway)
  paymentStatus?: PaymentStatus;
  paymentAmount?: number;
  paymentMethod?: string;
  paymentTxnId?: string;
  paidAt?: string;
  paymentAgency?: string;
}

const STORAGE_KEY = 'eb_applications';
const LEGACY_STORAGE_KEY = 'danh_sach_ho_so';
const AUDIT_LOG_KEY = 'eb_audit_log';

// Định dạng thời gian Việt Nam dd/MM/yyyy HH:mm
export function formatCurrentDateTimeVN(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(
    now.getHours()
  )}:${pad(now.getMinutes())}`;
}

// Sinh mã hồ sơ dạng HS-yyyyMMdd-xxxx khi lưu nháp lần đầu
export function generateApplicationCode(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `HS-${y}${m}${d}-${rand}`;
}

// Lệ phí chuẩn theo thủ tục: cap-so: 200.000đ; tam-thoi: 100.000đ
export function getStandardProcedureFee(thuTuc?: 'cap-so' | 'tam-thoi' | string): number {
  if (thuTuc === 'tam-thoi' || thuTuc?.includes('tạm thời')) {
    return 100000;
  }
  return 200000;
}

// Sinh mã giao dịch Finlink giả lập (dạng FL + 8 chữ số)
export function generateFinlinkTxnId(): string {
  const rand = Math.floor(10000000 + Math.random() * 90000000);
  return `FL${rand}`;
}

// Ghi nhật ký hệ thống vào eb_audit_log (taiKhoan, maHoSo, hanhDong, thoiDiem)
export function logAuditAction(entry: {
  taiKhoan: string;
  maHoSo: string;
  hanhDong: string;
  thoiDiem?: string;
}): void {
  try {
    const raw = localStorage.getItem(AUDIT_LOG_KEY);
    const logs = raw ? JSON.parse(raw) : [];
    logs.unshift({
      taiKhoan: entry.taiKhoan,
      maHoSo: entry.maHoSo,
      hanhDong: entry.hanhDong,
      thoiDiem: entry.thoiDiem || formatCurrentDateTimeVN(),
    });
    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Lỗi khi ghi eb_audit_log:', e);
  }
}

// Lấy danh sách hồ sơ (chỉ hồ sơ của tài khoản đang đăng nhập)
export function getStoredApplications(filterUserIdentifier?: string): StoredApplication[] {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        raw = legacyRaw;
        localStorage.setItem(STORAGE_KEY, legacyRaw);
      }
    }

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    const list: StoredApplication[] = Array.isArray(parsed) ? parsed : [];

    if (filterUserIdentifier) {
      const cleanFilter = filterUserIdentifier.replace(/\D/g, '');
      return list.filter((app) => {
        const appTaiKhoan = (app.taiKhoan || '').replace(/\D/g, '');
        const appCccd = (app.cccd || '').replace(/\D/g, '');
        const appUserId = app.userId || '';

        return (
          (cleanFilter && appTaiKhoan === cleanFilter) ||
          (cleanFilter && appCccd === cleanFilter) ||
          appUserId === filterUserIdentifier
        );
      });
    }

    return list;
  } catch (e) {
    console.error('Error reading eb_applications from localStorage', e);
    return [];
  }
}

// Đọc hồ sơ theo mã trực tiếp từ localStorage (đảm bảo dữ liệu mới nhất)
export function getStoredApplicationByCode(maHoSo: string): StoredApplication | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const list: StoredApplication[] = JSON.parse(raw);
    if (!Array.isArray(list)) return undefined;
    return list.find((a) => a.maHoSo === maHoSo);
  } catch (e) {
    console.error('Error reading application by code', e);
    return undefined;
  }
}

// Lưu hoặc cập nhật hồ sơ
export function saveOrUpdateApplication(
  app: Omit<StoredApplication, 'maHoSo' | 'ngayLuu'> & {
    maHoSo?: string;
    ngayLuu?: string;
  }
): StoredApplication {
  const currentList = getStoredApplications(); // Lấy tất cả
  const maHoSo = app.maHoSo || generateApplicationCode();
  const ngayLuu = app.ngayLuu || formatCurrentDateTimeVN();
  const existingIndex = currentList.findIndex((item) => item.maHoSo === maHoSo);

  const recordToSave: StoredApplication = {
    maHoSo,
    taiKhoan: app.taiKhoan || app.cccd || app.userId || '',
    userId: app.userId,
    thuTuc: app.thuTuc || app.procedure || (app.loaiThuTuc?.includes('tạm thời') ? 'tam-thoi' : 'cap-so'),
    procedure: app.procedure || app.thuTuc || (app.loaiThuTuc?.includes('tạm thời') ? 'tam-thoi' : 'cap-so'),
    loaiThuTuc: app.loaiThuTuc,
    trangThai: app.trangThai,
    ngayLuu,
    ngayGui: app.ngayGui,
    ngayTao: app.ngayTao || ngayLuu,
    duLieu: app.duLieu || app.formData || {},
    formData: app.formData || app.duLieu || {},
    yeuCauBoSung: app.yeuCauBoSung,
    soLanBoSung: app.soLanBoSung || 0,
    hoTenNguoiNop: app.hoTenNguoiNop,
    cccd: app.cccd || app.taiKhoan,
    donViTiepNhan: app.donViTiepNhan,
    cuaKhau: app.cuaKhau,
    phongXNC: app.phongXNC,
    checkpoint:
      app.checkpoint ||
      app.cuaKhau ||
      (app.phongXNC ? `Phòng Xuất nhập cảnh – Công an tỉnh ${app.phongXNC}` : undefined),
    truongHopDeNghi: app.truongHopDeNghi,
    lyDoCuThe: app.lyDoCuThe,
    currentStep: app.currentStep,
    ngheNghiep: app.ngheNghiep,
    ngheNghiepKhac: app.ngheNghiepKhac,
    mauToc: app.mauToc,
    mauTocKhac: app.mauTocKhac,
    mauMat: app.mauMat,
    mauMatKhac: app.mauMatKhac,
    paymentStatus: app.paymentStatus ?? (existingIndex >= 0 ? currentList[existingIndex].paymentStatus : '-'),
    paymentAmount: app.paymentAmount ?? (existingIndex >= 0 ? currentList[existingIndex].paymentAmount : undefined),
    paymentMethod: app.paymentMethod ?? (existingIndex >= 0 ? currentList[existingIndex].paymentMethod : undefined),
    paymentTxnId: app.paymentTxnId ?? (existingIndex >= 0 ? currentList[existingIndex].paymentTxnId : undefined),
    paidAt: app.paidAt ?? (existingIndex >= 0 ? currentList[existingIndex].paidAt : undefined),
    paymentAgency: app.paymentAgency ?? (existingIndex >= 0 ? currentList[existingIndex].paymentAgency : undefined),
  };

  let updatedList: StoredApplication[];

  if (existingIndex >= 0) {
    updatedList = [...currentList];
    updatedList[existingIndex] = {
      ...updatedList[existingIndex],
      ...recordToSave,
    };
  } else {
    updatedList = [recordToSave, ...currentList];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(updatedList));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('eb_applications_updated', { detail: { maHoSo } }));
    }
  } catch (e) {
    console.error('Error saving eb_applications to localStorage', e);
  }

  return recordToSave;
}

// Cập nhật trạng thái thanh toán và thông tin giao dịch lệ phí
export function updateApplicationPaymentStatus(
  maHoSo: string,
  paymentUpdate: {
    paymentStatus: PaymentStatus;
    paymentAmount?: number;
    paymentMethod?: string;
    paymentTxnId?: string;
    paidAt?: string;
    paymentAgency?: string;
  }
): StoredApplication | undefined {
  const allApps = getStoredApplications();
  const idx = allApps.findIndex((a) => a.maHoSo === maHoSo);
  if (idx === -1) return undefined;

  const target = allApps[idx];
  const updatedApp: StoredApplication = {
    ...target,
    paymentStatus: paymentUpdate.paymentStatus,
    paymentAmount: paymentUpdate.paymentAmount !== undefined ? paymentUpdate.paymentAmount : target.paymentAmount,
    paymentMethod: paymentUpdate.paymentMethod !== undefined ? paymentUpdate.paymentMethod : target.paymentMethod,
    paymentTxnId: paymentUpdate.paymentTxnId !== undefined ? paymentUpdate.paymentTxnId : target.paymentTxnId,
    paidAt: paymentUpdate.paidAt !== undefined ? paymentUpdate.paidAt : target.paidAt,
    paymentAgency: paymentUpdate.paymentAgency !== undefined ? paymentUpdate.paymentAgency : target.paymentAgency,
  };

  allApps[idx] = updatedApp;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allApps));
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(allApps));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('eb_applications_updated', { detail: { maHoSo } }));
    }
  } catch (e) {
    console.error('Error updating payment status:', e);
  }

  return updatedApp;
}

// Cán bộ tiếp nhận hồ sơ hợp lệ: chuyển trạng thái sang "Đã tiếp nhận" kèm thông báo thu lệ phí
export function officerAcceptApplication(
  maHoSo: string,
  options?: { zeroFee?: boolean }
): { success: boolean; application?: StoredApplication; error?: string } {
  const allApps = getStoredApplications();
  const idx = allApps.findIndex((a) => a.maHoSo === maHoSo);
  if (idx === -1) {
    return { success: false, error: 'Không tìm thấy hồ sơ' };
  }

  const app = allApps[idx];
  const isZeroFee = !!options?.zeroFee;
  const feeAmount = isZeroFee ? 0 : getStandardProcedureFee(app.thuTuc);
  const paymentStatus: PaymentStatus = isZeroFee ? 'Không phát sinh lệ phí' : 'Chờ thanh toán';

  // Xác định cơ quan thu lệ phí: Phòng Xuất nhập cảnh theo địa bàn hoặc theo hồ sơ
  const paymentAgency =
    app.paymentAgency ||
    (app.phongXNC
      ? `Phòng Xuất nhập cảnh – Công an tỉnh ${app.phongXNC}`
      : 'Phòng Quản lý xuất nhập cảnh');

  const updatedApp: StoredApplication = {
    ...app,
    trangThai: 'Đã tiếp nhận',
    paymentStatus,
    paymentAmount: feeAmount,
    paymentAgency,
  };

  allApps[idx] = updatedApp;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allApps));
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(allApps));

    // Ghi nhật ký hệ thống
    logAuditAction({
      taiKhoan: app.taiKhoan,
      maHoSo,
      hanhDong: isZeroFee
        ? 'can_bo_tiep_nhan_ho_so_khong_thu_phi'
        : 'can_bo_tiep_nhan_ho_so_kem_yeu_cau_nop_phi',
    });

    // Gửi thông báo đến chuông của công dân
    const notifContent = isZeroFee
      ? `Hồ sơ ${maHoSo} đã được tiếp nhận và không phát sinh lệ phí.`
      : `Hồ sơ ${maHoSo} đã được tiếp nhận. Vui lòng thanh toán lệ phí ${feeAmount.toLocaleString(
          'vi-VN'
        )} đồng trên Cổng dịch vụ công để hồ sơ được xử lý tiếp.`;

    addCitizenNotification({
      taiKhoan: app.taiKhoan,
      tieuDe: 'Hồ sơ đã được tiếp nhận',
      noiDung: notifContent,
      maHoSo,
      loai: isZeroFee ? 'info' : 'payment_required',
      link: isZeroFee ? '#/tra-cuu-ho-so' : `#/thanh-toan/${maHoSo}`,
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('eb_applications_updated', { detail: { maHoSo } }));
    }

    return { success: true, application: updatedApp };
  } catch (e) {
    console.error('Error officer accepting application:', e);
    return { success: false, error: 'Lỗi cập nhật tiếp nhận hồ sơ' };
  }
}

// Đối soát giao dịch treo (Thành công / Thất bại)
export function officerReconcilePendingPayment(
  maHoSo: string,
  outcome: 'success' | 'failed'
): { success: boolean; application?: StoredApplication; error?: string } {
  const allApps = getStoredApplications();
  const idx = allApps.findIndex((a) => a.maHoSo === maHoSo);
  if (idx === -1) {
    return { success: false, error: 'Không tìm thấy hồ sơ' };
  }

  const app = allApps[idx];
  if (app.paymentStatus !== 'Đang xử lý giao dịch') {
    return {
      success: false,
      error: `Hồ sơ ${maHoSo} không ở trạng thái "Đang xử lý giao dịch" (hiện tại: ${app.paymentStatus})`,
    };
  }

  const nowStr = formatCurrentDateTimeVN();
  let updatedApp: StoredApplication;

  if (outcome === 'success') {
    const txnId = app.paymentTxnId || generateFinlinkTxnId();
    updatedApp = {
      ...app,
      paymentStatus: 'Đã thanh toán',
      paymentTxnId: txnId,
      paidAt: nowStr,
    };

    logAuditAction({
      taiKhoan: app.taiKhoan,
      maHoSo,
      hanhDong: 'doi_soat_thanh_cong',
    });

    addCitizenNotification({
      taiKhoan: app.taiKhoan,
      tieuDe: 'Đối soát thanh toán thành công',
      noiDung: `Giao dịch thanh toán lệ phí hồ sơ ${maHoSo} đã được đối soát thành công. Mã giao dịch: ${txnId}.`,
      maHoSo,
      loai: 'payment_success',
      link: '#/tra-cuu-ho-so',
    });
  } else {
    updatedApp = {
      ...app,
      paymentStatus: 'Thanh toán lỗi',
    };

    logAuditAction({
      taiKhoan: app.taiKhoan,
      maHoSo,
      hanhDong: 'doi_soat_that_bai',
    });

    addCitizenNotification({
      taiKhoan: app.taiKhoan,
      tieuDe: 'Đối soát thanh toán thất bại',
      noiDung: `Giao dịch thanh toán lệ phí hồ sơ ${maHoSo} đối soát thất bại do lỗi cổng thanh toán. Vui lòng thực hiện thanh toán lại.`,
      maHoSo,
      loai: 'payment_required',
      link: `#/thanh-toan/${maHoSo}`,
    });
  }

  allApps[idx] = updatedApp;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allApps));
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(allApps));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('eb_applications_updated', { detail: { maHoSo } }));
    }

    return { success: true, application: updatedApp };
  } catch (e) {
    console.error('Error reconciling payment:', e);
    return { success: false, error: 'Lỗi khi đối soát giao dịch' };
  }
}

// Xóa hồ sơ (chỉ áp dụng cho hồ sơ có trạng thái "Hồ sơ chưa gửi")
export function deleteStoredApplication(
  maHoSo: string,
  taiKhoan: string
): { success: boolean; error?: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { success: false, error: 'Không tìm thấy hồ sơ' };
    const list: StoredApplication[] = JSON.parse(raw);
    const existingIndex = list.findIndex((a) => a.maHoSo === maHoSo);

    if (existingIndex === -1) {
      return { success: false, error: 'Hồ sơ không tồn tại' };
    }

    const target = list[existingIndex];
    if (target.trangThai !== 'Hồ sơ chưa gửi') {
      return {
        success: false,
        error: `Hồ sơ ${maHoSo} đã được gửi hoặc đã thay đổi trạng thái nên không thể xóa`,
      };
    }

    list.splice(existingIndex, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(list));

    // Ghi 1 dòng vào eb_audit_log
    logAuditAction({
      taiKhoan,
      maHoSo,
      hanhDong: 'xoa',
    });

    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Lỗi khi xóa hồ sơ khỏi hệ thống' };
  }
}

// Xóa hồ sơ của danh sách công dân (dùng khi reset demo test)
export function deleteApplicationsForCitizens(idNumbers: string[]): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const list: StoredApplication[] = JSON.parse(raw);
    if (!Array.isArray(list)) return;
    const cleanIds = idNumbers.map((id) => id.replace(/\D/g, ''));
    const filtered = list.filter((app) => {
      const appCccd = (app.cccd || app.taiKhoan || '').replace(/\D/g, '');
      const appUser = (app.userId || '').replace(/\D/g, '');
      return !cleanIds.includes(appCccd) && !cleanIds.includes(appUser);
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Lỗi khi xóa hồ sơ của tài khoản test:', e);
  }
}

// Kiểm tra hồ sơ nháp có đầy đủ dữ liệu để in phiếu không (Mục 7)
export function validateStoredApplicationForPrint(app: StoredApplication): {
  isValid: boolean;
  missingFields: string[];
} {
  const missing: string[] = [];
  const d = app.duLieu || app.formData || {};

  // Nếu hồ sơ đã gửi hoặc đang xử lý -> không cần kiểm tra lại, cho in ngay
  if (app.trangThai !== 'Hồ sơ chưa gửi') {
    return { isValid: true, missingFields: [] };
  }

  // Họ tên Latin
  if (!d.fullNameLatin && !app.hoTenNguoiNop) missing.push('Họ và tên');
  // Ngày sinh
  if (!d.dob) missing.push('Ngày sinh');
  // Giới tính
  if (!d.gender) missing.push('Giới tính');
  // Nơi sinh
  if (!d.birthProvince && !d.birthDistrict) missing.push('Nơi sinh');
  // Nơi thường trú
  if (!d.resProvince && !d.resDistrict) missing.push('Nơi thường trú');
  // Số thẻ căn cước
  if (!d.nationalId && !app.cccd && !app.taiKhoan) missing.push('Số căn cước/CMND');
  // Chiều cao
  if (!d.heightCm) missing.push('Chiều cao');
  // Ảnh chân dung
  if (!d.portraitImgUrl) missing.push('Ảnh chân dung');

  // Với thủ tục tạm thời
  if (app.thuTuc === 'tam-thoi' || app.procedure === 'tam-thoi') {
    if (!app.donViTiepNhan && !d.donViTiepNhan) missing.push('Đơn vị tiếp nhận');
    if (!app.truongHopDeNghi && !d.truongHopDeNghi) missing.push('Trường hợp đề nghị');
    if (!d.validityStartDate) missing.push('Thời hạn sử dụng');
    const occ = app.ngheNghiep || d.ngheNghiep || d.occupation;
    if (!occ) missing.push('Nghề nghiệp');
    if (!d.tripPurpose) missing.push('Mục đích chuyến đi');
    const hair = app.mauToc || d.mauToc || d.hairColor;
    if (!hair) missing.push('Màu tóc');
    const eye = app.mauMat || d.mauMat || d.eyeColor;
    if (!eye) missing.push('Màu mắt');
  }

  return {
    isValid: missing.length === 0,
    missingFields: missing,
  };
}

// Cán bộ giả lập đổi trạng thái hồ sơ (Demo Panel)
export function updateApplicationStatusByOfficer(
  maHoSo: string,
  newStatus: ApplicationStatus,
  yeuCauBoSungData?: SupplementRequest
): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const list: StoredApplication[] = JSON.parse(raw);
    const index = list.findIndex((a) => a.maHoSo === maHoSo);
    if (index === -1) return false;

    list[index].trangThai = newStatus;
    if (newStatus === 'Yêu cầu bổ sung' && yeuCauBoSungData) {
      list[index].yeuCauBoSung = yeuCauBoSungData;
    } else if (newStatus !== 'Yêu cầu bổ sung') {
      delete list[index].yeuCauBoSung;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch (e) {
    console.error('Error updating status by officer', e);
    return false;
  }
}

// Tạo nhanh 6 hồ sơ mẫu cho tài khoản đang đăng nhập (Mục 8 Demo Panel)
// (3 cap-so, 3 tam-thoi) với trạng thái:
// 1. Hồ sơ chưa gửi (thiếu dữ liệu)
// 2. Hồ sơ chưa gửi (đủ dữ liệu)
// 3. Đã gửi
// 4. Yêu cầu bổ sung
// 5. Đang thẩm định
// 6. Hoàn tất
export function createMockSeedApplications(
  taiKhoan: string,
  fullName: string = 'Trương Tùng Lan'
): StoredApplication[] {
  const cleanId = (taiKhoan || '1234567890123').replace(/\D/g, '');
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const todayStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
  const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  // Ngày mai cho ngày bắt đầu tạm thời
  const tmr = new Date(now);
  tmr.setDate(tmr.getDate() + 1);
  const startYMD = `${tmr.getFullYear()}-${pad(tmr.getMonth() + 1)}-${pad(tmr.getDate())}`;
  const endD = new Date(tmr);
  endD.setDate(endD.getDate() + 2);
  const endYMD = `${endD.getFullYear()}-${pad(endD.getMonth() + 1)}-${pad(endD.getDate())}`;

  // Ảnh chân dung mẫu hợp lệ (SVG Base64)
  const samplePortrait =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="160" viewBox="0 0 120 160"><rect width="120" height="160" fill="%23E2E8F0"/><circle cx="60" cy="55" r="30" fill="%2394A3B8"/><path d="M20 140 C20 100, 100 100, 100 140 Z" fill="%2394A3B8"/></svg>';

  // Dữ liệu form hoàn chỉnh hợp lệ
  const completeCapSoForm = {
    fullNameLao: fullName,
    fullNameLatin: 'TRUONG TUNG LAN',
    dob: '1998-03-12',
    gender: 'Nam',
    ethnicity: 'Lao',
    religion: 'Phật giáo',
    nationality: 'Lào',
    occupation: 'Buôn bán/Kinh doanh',
    birthProvince: 'Thủ đô Viêng Chăn (Vientiane Prefecture)',
    birthDistrict: 'Huyện Chanthabuly',
    birthVillage: 'Bản Hatsady',
    birthAddressDetail: 'Số 15 Đại lộ Lane Xang',
    resProvince: 'Thủ đô Viêng Chăn (Vientiane Prefecture)',
    resDistrict: 'Huyện Chanthabuly',
    resVillage: 'Bản Hatsady',
    resUnit: 'Đơn vị 01',
    resAddressDetail: 'Số 15 Đại lộ Lane Xang',
    nationalId: cleanId,
    idIssueDate: '2020-05-10',
    idIssuePlace: 'Công an Thủ đô Viêng Chăn',
    householdBookNo: 'HK-99201',
    householdIssueDate: '2019-01-15',
    householdIssuePlace: 'Công an Thủ đô Viêng Chăn',
    heightCm: '172',
    scars: 'Nốt ruồi 0.5cm dưới đuôi mắt phải',
    portraitImgUrl: samplePortrait,
    portraitFileName: 'anh_chan_dung_3x4.jpg',
    unlockedParts: { 1: true, 2: true, 3: true },
    completedParts: { 1: true, 2: true, 3: true },
    attachments: [
      {
        id: 'doc-cccd',
        name: 'Bản sao CCCD/Hộ chiếu của người đề nghị',
        required: true,
        docType: 'Bản sao',
        file: { name: 'cccd_mat_truoc_sau.pdf', size: '1.2 MB' },
        quantity: 1,
        note: 'Đã chứng thực',
      },
    ],
  };

  const completeTamThoiForm = {
    ...completeCapSoForm,
    mauToc: 'Đen',
    mauMat: 'Nâu',
    donViTiepNhan: 'Phòng Xuất nhập cảnh',
    phongXNC: 'Thủ đô Viêng Chăn (Vientiane Prefecture)',
    truongHopDeNghi: 'Cư dân biên giới sang vùng biên giới đối diện giải quyết việc gia đình',
    lyDoCuThe: 'Sang thăm người thân gia đình tại tỉnh biên giới giáp ranh',
    validityStartDate: startYMD,
    validityEndDate: endYMD,
    tripPurpose: 'Thăm thân',
    occupation: 'Buôn bán/Kinh doanh',
    unlockedParts: { 1: true, 2: true, 3: true },
    completedParts: { 1: true, 2: true, 3: true },
    children: [
      {
        id: 'child-1',
        fullNameLao: 'Trương Tuấn Kiệt',
        fullNameLatin: 'TRUONG TUAN KIET',
        citizenId: '010992819201',
        dob: '2018-06-20',
        gender: 'Nam',
        relationship: 'Con ruột',
      },
    ],
    attachments: [
      {
        id: 'doc-cccd',
        name: 'Bản sao CCCD/Hộ chiếu của người đề nghị',
        required: true,
        docType: 'Bản sao',
        file: { name: 'cccd_cong_dan.pdf', size: '1.5 MB' },
        quantity: 1,
        note: '',
      },
      {
        id: 'doc-birth-cert',
        name: 'Bản sao Giấy khai sinh của trẻ em đi kèm',
        required: true,
        docType: 'Bản sao',
        file: undefined, // Chưa tải
        quantity: 1,
        note: 'Cần bổ sung',
      },
    ],
  };

  const mockApps: StoredApplication[] = [
    // 1. cap-so: Hồ sơ chưa gửi (thiếu dữ liệu)
    {
      maHoSo: `HS-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-1001`,
      taiKhoan: cleanId,
      userId: cleanId,
      thuTuc: 'cap-so',
      procedure: 'cap-so',
      loaiThuTuc: 'Cấp sổ thông hành',
      trangThai: 'Hồ sơ chưa gửi',
      ngayLuu: `${todayStr} 08:30`,
      ngayTao: `${todayStr} 08:30`,
      duLieu: {
        fullNameLao: fullName,
        fullNameLatin: 'TRUONG TUNG LAN',
        dob: '1998-03-12',
        gender: 'Nam',
        ethnicity: '', // thiếu
        religion: '', // thiếu
        unlockedParts: { 1: true },
        completedParts: {},
      },
      formData: {},
      soLanBoSung: 0,
      hoTenNguoiNop: fullName,
      cccd: cleanId,
      paymentStatus: '-',
    },
    // 2. cap-so: Hồ sơ chưa gửi (đủ dữ liệu, có thể in ngay)
    {
      maHoSo: `HS-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-1002`,
      taiKhoan: cleanId,
      userId: cleanId,
      thuTuc: 'cap-so',
      procedure: 'cap-so',
      loaiThuTuc: 'Cấp sổ thông hành',
      trangThai: 'Hồ sơ chưa gửi',
      ngayLuu: `${todayStr} 09:15`,
      ngayTao: `${todayStr} 09:15`,
      duLieu: completeCapSoForm,
      formData: completeCapSoForm,
      soLanBoSung: 0,
      hoTenNguoiNop: fullName,
      cccd: cleanId,
      mauToc: 'Đen',
      mauMat: 'Nâu',
      ngheNghiep: 'Buôn bán/Kinh doanh',
      paymentStatus: '-',
    },
    // 3. cap-so: Đã gửi
    {
      maHoSo: `HS-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-1003`,
      taiKhoan: cleanId,
      userId: cleanId,
      thuTuc: 'cap-so',
      procedure: 'cap-so',
      loaiThuTuc: 'Cấp sổ thông hành',
      trangThai: 'Đã gửi',
      ngayLuu: `${todayStr} 10:00`,
      ngayGui: `${todayStr} 10:00`,
      ngayTao: `${todayStr} 09:30`,
      duLieu: completeCapSoForm,
      formData: completeCapSoForm,
      soLanBoSung: 0,
      hoTenNguoiNop: fullName,
      cccd: cleanId,
      mauToc: 'Đen',
      mauMat: 'Nâu',
      ngheNghiep: 'Buôn bán/Kinh doanh',
      paymentStatus: '-',
    },
    // 4. tam-thoi: Yêu cầu bổ sung
    {
      maHoSo: `HS-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-2001`,
      taiKhoan: cleanId,
      userId: cleanId,
      thuTuc: 'tam-thoi',
      procedure: 'tam-thoi',
      loaiThuTuc: 'Cấp giấy thông hành tạm thời',
      trangThai: 'Yêu cầu bổ sung',
      ngayLuu: `${todayStr} 11:20`,
      ngayGui: `${todayStr} 10:45`,
      ngayTao: `${todayStr} 10:15`,
      duLieu: completeTamThoiForm,
      formData: completeTamThoiForm,
      soLanBoSung: 0,
      yeuCauBoSung: {
        ngayYeuCau: todayStr,
        donViYeuCau: 'Phòng Xuất nhập cảnh – Công an tỉnh Vientiane',
        noiDung: 'Vui lòng bổ sung bản sao giấy khai sinh của trẻ em đi kèm',
        giayToThieu: ['Bản sao Giấy khai sinh của trẻ em đi kèm'],
      },
      hoTenNguoiNop: fullName,
      cccd: cleanId,
      donViTiepNhan: 'Phòng Xuất nhập cảnh',
      phongXNC: 'Thủ đô Viêng Chăn (Vientiane Prefecture)',
      truongHopDeNghi: 'Cư dân biên giới sang vùng biên giới đối diện giải quyết việc gia đình',
      mauToc: 'Đen',
      mauMat: 'Nâu',
      ngheNghiep: 'Buôn bán/Kinh doanh',
      paymentStatus: '-',
    },
    // 5. tam-thoi: Đang thẩm định
    {
      maHoSo: `HS-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-2002`,
      taiKhoan: cleanId,
      userId: cleanId,
      thuTuc: 'tam-thoi',
      procedure: 'tam-thoi',
      loaiThuTuc: 'Cấp giấy thông hành tạm thời',
      trangThai: 'Đang thẩm định',
      ngayLuu: `${todayStr} 14:10`,
      ngayGui: `${todayStr} 13:00`,
      ngayTao: `${todayStr} 12:40`,
      duLieu: completeTamThoiForm,
      formData: completeTamThoiForm,
      soLanBoSung: 0,
      hoTenNguoiNop: fullName,
      cccd: cleanId,
      donViTiepNhan: 'Phòng Xuất nhập cảnh',
      phongXNC: 'Thủ đô Viêng Chăn (Vientiane Prefecture)',
      truongHopDeNghi: 'Cư dân biên giới sang vùng biên giới đối diện giải quyết việc gia đình',
      mauToc: 'Đen',
      mauMat: 'Nâu',
      ngheNghiep: 'Buôn bán/Kinh doanh',
      paymentStatus: 'Chờ thanh toán',
      paymentAmount: 100000,
      paymentAgency: 'Phòng Xuất nhập cảnh – Công an tỉnh Vientiane',
    },
    // 6. tam-thoi: Hoàn tất
    {
      maHoSo: `HS-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-2003`,
      taiKhoan: cleanId,
      userId: cleanId,
      thuTuc: 'tam-thoi',
      procedure: 'tam-thoi',
      loaiThuTuc: 'Cấp giấy thông hành tạm thời',
      trangThai: 'Hoàn tất',
      ngayLuu: `${todayStr} 16:45`,
      ngayGui: `${todayStr} 14:30`,
      ngayTao: `${todayStr} 14:00`,
      duLieu: completeTamThoiForm,
      formData: completeTamThoiForm,
      soLanBoSung: 0,
      hoTenNguoiNop: fullName,
      cccd: cleanId,
      donViTiepNhan: 'Phòng Xuất nhập cảnh',
      phongXNC: 'Thủ đô Viêng Chăn (Vientiane Prefecture)',
      truongHopDeNghi: 'Cư dân biên giới sang vùng biên giới đối diện giải quyết việc gia đình',
      mauToc: 'Đen',
      mauMat: 'Nâu',
      ngheNghiep: 'Buôn bán/Kinh doanh',
      paymentStatus: 'Đã thanh toán',
      paymentAmount: 100000,
      paymentMethod: 'QR ngân hàng (Finlink VietQR)',
      paymentTxnId: 'FL88291032',
      paidAt: `${todayStr} 15:00`,
      paymentAgency: 'Phòng Xuất nhập cảnh – Công an tỉnh Vientiane',
    },
  ];

  // Ghi đè hoặc thêm vào eb_applications
  const existingList = getStoredApplications();
  // Giữ lại các hồ sơ của các tài khoản khác
  const otherList = existingList.filter((a) => {
    const aCccd = (a.cccd || a.taiKhoan || '').replace(/\D/g, '');
    const aUser = (a.userId || '').replace(/\D/g, '');
    return aCccd !== cleanId && aUser !== cleanId;
  });

  const updated = [...mockApps, ...otherList];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error seeding mock applications:', e);
  }

  return mockApps;
}
