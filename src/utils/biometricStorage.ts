// Quản lý dữ liệu sinh trắc học và lịch hẹn thu nhận sinh trắc
// Lưu vào localStorage: 'eb_demo_biometric', 'eb_biometric_done', 'eb_biometric_appointments'
// Lưu vào sessionStorage: 'eb_biometric_passed_{idNumber}'

import { deleteApplicationsForCitizens } from './submissionStorage';

export type BiometricCheckResult = 'has_biometric' | 'no_biometric' | 'error';
export type DemoBiometricMode = 'co' | 'chua' | 'loi' | 'has_biometric' | 'no_biometric' | 'error' | 'auto';

export type AppointmentStatus =
  | 'Chờ cơ quan xác nhận'
  | 'Đã xác nhận'
  | 'Đã hủy';

export interface BiometricAppointment {
  id: string; // "LH-" + 6 ký tự số
  maHoSo?: string; // Mã hồ sơ liên kết (nếu có)
  ownerId: string; // Số định danh công dân
  coQuan: string; // Phòng Xuất nhập cảnh – Công an tỉnh ... hoặc tên Cửa khẩu
  ngay: string; // YYYY-MM-DD
  khungGio?: string; // Khung giờ tiếp nhận
  sdt: string;
  ghiChu?: string;
  trangThai: AppointmentStatus;
  lyDo?: string; // Lý do từ chối hồ sơ (nếu có)
  createdAt: string; // ISO timestamp
  loaiThuTuc?: 'cap-so' | 'tam-thoi' | string;
  donViTiepNhan?: 'Cửa khẩu' | 'Phòng Xuất nhập cảnh';
  cuaKhau?: string;
}

export const TIME_SLOTS: string[] = [
  '08:00–09:00',
  '09:00–10:00',
  '10:00–11:00',
  '14:00–15:00',
  '15:00–16:00',
];

const STORAGE_DEMO_MODE_KEY = 'eb_demo_biometric';
const STORAGE_BIOMETRIC_DONE_KEY = 'eb_biometric_done';
const STORAGE_APPOINTMENTS_KEY = 'eb_biometric_appointments';

// Cờ phát triển cho phép bỏ qua kiểm tra sinh trắc
export const DEV_SKIP_BIOMETRIC_CHECK: boolean = false;

// Danh sách số định danh dùng để demo, mặc định luôn có dữ liệu sinh trắc
export const BIOMETRIC_WHITELIST: string[] = ['0311840139633', '0311840139631'];

// Tài khoản đăng nhập chuyên biệt dùng để chạy riêng luồng kiểm tra sinh trắc và đặt lịch hẹn
export const BIOMETRIC_ALWAYS_REQUIRE_ID: string = '1234567891234';

// 3 tài khoản test chuyên dụng theo yêu cầu kiểm thử luồng sinh trắc:
// - 1234567890123: Trương Tùng Lan (Chưa có sinh trắc, chưa có lịch hẹn)
// - 1234567890124: Trần Nam Huân (Chưa có sinh trắc, đang có lịch LH-0001)
// - 1234567890125: Châu Đông Vũ (Đã có sinh trắc)
export const SPECIAL_TEST_ACCOUNT_IDS: string[] = [
  '1234567890123',
  '1234567890124',
  '1234567890125',
];

export function isSpecialTestAccount(idNumber: string): boolean {
  const cleanId = (idNumber || '').replace(/\D/g, '');
  return SPECIAL_TEST_ACCOUNT_IDS.includes(cleanId);
}

// Đảm bảo 2 số định danh demo luôn có trong eb_biometric_done khi khởi động
export function initBiometricWhitelistIfNeeded(): void {
  try {
    const raw = localStorage.getItem(STORAGE_BIOMETRIC_DONE_KEY);
    let list: string[] = raw ? JSON.parse(raw) : [];

    let modified = false;
    for (const id of BIOMETRIC_WHITELIST) {
      if (!list.includes(id)) {
        list.push(id);
        modified = true;
      }
    }
    if (modified || !raw) {
      localStorage.setItem(STORAGE_BIOMETRIC_DONE_KEY, JSON.stringify(list));
    }
  } catch (e) {
    console.error(e);
  }
}

// Tự động khởi tạo ngay khi nạp module
initBiometricWhitelistIfNeeded();

// Lấy chế độ demo hiện tại (chuẩn hóa về: 'co' | 'chua' | 'loi')
export function getDemoBiometricMode(): 'co' | 'chua' | 'loi' {
  try {
    const val = localStorage.getItem(STORAGE_DEMO_MODE_KEY);
    if (val === 'co' || val === 'has_biometric') {
      return 'co';
    }
    if (val === 'loi' || val === 'error') {
      return 'loi';
    }
    if (val === 'chua' || val === 'no_biometric') {
      return 'chua';
    }
  } catch (e) {
    console.error(e);
  }
  return 'chua';
}

// Lưu chế độ demo: 'co' (Đã có), 'chua' (Chưa có), 'loi' (Lỗi kết nối)
export function setDemoBiometricMode(mode: DemoBiometricMode): void {
  try {
    const normalized = mode === 'has_biometric' ? 'co' : mode === 'no_biometric' ? 'chua' : mode === 'error' ? 'loi' : mode;
    localStorage.setItem(STORAGE_DEMO_MODE_KEY, normalized);
  } catch (e) {
    console.error(e);
  }
}

// Kiểm tra công dân đã hoàn thành sinh trắc trong hệ thống chưa (qua eb_biometric_done)
export function isBiometricCompletedForCitizen(idNumber: string): boolean {
  try {
    const cleanId = (idNumber || '').replace(/\D/g, '');
    if (!cleanId) return false;
    // Số định danh trong whitelist luôn luôn được tính là đã có sinh trắc
    if (BIOMETRIC_WHITELIST.includes(cleanId)) {
      return true;
    }
    const raw = localStorage.getItem(STORAGE_BIOMETRIC_DONE_KEY);
    if (!raw) return false;
    if (raw === 'true') return true;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.some((item) => String(item).replace(/\D/g, '') === cleanId);
      }
      if (typeof parsed === 'object' && parsed !== null) {
        return !!parsed[cleanId];
      }
    } catch {}
    return false;
  } catch (e) {
    console.error(e);
    return false;
  }
}

// Đánh dấu công dân đã hoàn thành thu nhận sinh trắc (lưu vào eb_biometric_done)
export function markBiometricCompletedForCitizen(idNumber: string): void {
  try {
    const cleanId = (idNumber || '').replace(/\D/g, '');
    if (!cleanId) return;
    const raw = localStorage.getItem(STORAGE_BIOMETRIC_DONE_KEY);
    let list: string[] = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          list = parsed.map((item) => String(item).replace(/\D/g, ''));
        }
      } catch {}
    }
    if (!list.includes(cleanId)) {
      list.push(cleanId);
    }
    localStorage.setItem(STORAGE_BIOMETRIC_DONE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
}

// Xóa công dân khỏi danh sách đã có sinh trắc (dùng cho giả lập thiếu sinh trắc)
export function removeBiometricCompletedForCitizen(idNumber: string): void {
  try {
    const cleanId = (idNumber || '').replace(/\D/g, '');
    if (!cleanId) return;
    // Bỏ qua thao tác xóa đối với các số thuộc whitelist để không làm mất tư cách đã có sinh trắc
    if (BIOMETRIC_WHITELIST.includes(cleanId)) {
      return;
    }
    const raw = localStorage.getItem(STORAGE_BIOMETRIC_DONE_KEY);
    if (!raw) return;
    let list: string[] = [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        list = parsed.map((item) => String(item).replace(/\D/g, ''));
      }
    } catch {}
    const filtered = list.filter((item) => item !== cleanId);
    // Luôn bảo toàn các số trong whitelist
    for (const wId of BIOMETRIC_WHITELIST) {
      if (!filtered.includes(wId)) {
        filtered.push(wId);
      }
    }
    localStorage.setItem(STORAGE_BIOMETRIC_DONE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error(e);
  }
}

// Xóa toàn bộ danh sách đã có sinh trắc trong hệ thống (nhưng giữ nguyên whitelist)
export function clearAllBiometricDone(): void {
  try {
    localStorage.setItem(STORAGE_BIOMETRIC_DONE_KEY, JSON.stringify([...BIOMETRIC_WHITELIST]));
  } catch (e) {
    console.error(e);
  }
}

// Thực hiện kiểm tra dữ liệu sinh trắc học theo thứ tự quy tắc logic điều hướng:
// 2e) Lỗi kết nối: eb_demo_biometric = "loi"
// 2a) DEV_SKIP_BIOMETRIC_CHECK = true, số định danh thuộc BIOMETRIC_WHITELIST,
//     eb_biometric_done = true, hoặc eb_demo_biometric = "co" -> ĐÃ CÓ sinh trắc
// 2c) Còn lại -> CHƯA CÓ sinh trắc
export function evaluateBiometricStatus(idNumber: string): BiometricCheckResult {
  const cleanId = (idNumber || '').replace(/\D/g, '');

  // QUAN TRỌNG - Mục 4: Với 3 tài khoản test (Lan 1234567890123, Huân 1234567890124, Vũ 1234567890125):
  // Bỏ qua giá trị eb_demo_biometric (demo panel không được ép kết quả); chỉ dùng trạng thái thật của tài khoản ở mục 2.
  // - 1234567890123 (Lan): Chưa có sinh trắc -> 'no_biometric'
  // - 1234567890124 (Huân): Chưa có sinh trắc -> 'no_biometric'
  // - 1234567890125 (Vũ): Đã có sinh trắc trong eb_biometric_done -> 'has_biometric'
  if (SPECIAL_TEST_ACCOUNT_IDS.includes(cleanId)) {
    return isBiometricCompletedForCitizen(cleanId) ? 'has_biometric' : 'no_biometric';
  }

  const mode = getDemoBiometricMode();

  // 2e) Lỗi kết nối (mock bằng demo panel: eb_demo_biometric = "loi")
  if (mode === 'loi' || (mode as string) === 'error') {
    return 'error';
  }

  // 2a) Nếu DEV_SKIP_BIOMETRIC_CHECK = true, hoặc số định danh của tài khoản nằm trong BIOMETRIC_WHITELIST,
  // hoặc eb_biometric_done của tài khoản = true, hoặc eb_demo_biometric = "co" -> coi là ĐÃ CÓ sinh trắc.
  if (
    DEV_SKIP_BIOMETRIC_CHECK ||
    BIOMETRIC_WHITELIST.includes(cleanId) ||
    isBiometricCompletedForCitizen(cleanId) ||
    mode === 'co' ||
    (mode as string) === 'has_biometric'
  ) {
    return 'has_biometric';
  }

  // 2c) CHƯA CÓ sinh trắc
  return 'no_biometric';
}

// Quản lý cờ phiên trong sessionStorage
export function setBiometricSessionPassed(idNumber: string): void {
  try {
    const cleanId = idNumber.replace(/\D/g, '');
    sessionStorage.setItem(`eb_biometric_passed_${cleanId}`, 'true');
  } catch (e) {
    console.error(e);
  }
}

export function hasBiometricSessionPassed(idNumber: string): boolean {
  try {
    const cleanId = idNumber.replace(/\D/g, '');
    return sessionStorage.getItem(`eb_biometric_passed_${cleanId}`) === 'true';
  } catch (e) {
    console.error(e);
    return false;
  }
}

export function clearBiometricSessionPassed(idNumber: string): void {
  try {
    const cleanId = idNumber.replace(/\D/g, '');
    sessionStorage.removeItem(`eb_biometric_passed_${cleanId}`);
  } catch (e) {
    console.error(e);
  }
}

// Lấy danh sách lịch hẹn
export function getBiometricAppointments(ownerId?: string): BiometricAppointment[] {
  try {
    const raw = localStorage.getItem(STORAGE_APPOINTMENTS_KEY);
    if (!raw) return [];
    const list: BiometricAppointment[] = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    // Chuẩn hóa dữ liệu nếu có trạng thái cũ
    list.forEach((item) => {
      if ((item.trangThai as string) === 'Chờ xác nhận') {
        item.trangThai = 'Chờ cơ quan xác nhận';
      }
    });
    if (ownerId) {
      const cleanOwner = ownerId.replace(/\D/g, '');
      return list.filter((a) => a.ownerId.replace(/\D/g, '') === cleanOwner);
    }
    return list;
  } catch (e) {
    console.error(e);
    return [];
  }
}

// Lưu hoặc cập nhật lịch hẹn
export function saveBiometricAppointment(appointment: BiometricAppointment): void {
  try {
    const list = getBiometricAppointments();
    const existingIndex = list.findIndex((a) => a.id === appointment.id);
    if (existingIndex >= 0) {
      list[existingIndex] = appointment;
    } else {
      list.unshift(appointment);
    }
    localStorage.setItem(STORAGE_APPOINTMENTS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
}

// Cập nhật trạng thái hoặc thông tin lịch hẹn
export function updateBiometricAppointment(
  id: string,
  updates: Partial<BiometricAppointment>
): BiometricAppointment | null {
  try {
    const list = getBiometricAppointments();
    const index = list.findIndex((a) => a.id === id);
    if (index >= 0) {
      const updated = { ...list[index], ...updates };
      list[index] = updated;
      localStorage.setItem(STORAGE_APPOINTMENTS_KEY, JSON.stringify(list));
      return updated;
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

// Tìm lịch hẹn còn hiệu lực của công dân (Chờ cơ quan xác nhận, Đã xác nhận)
export function getActiveAppointment(ownerId: string): BiometricAppointment | undefined {
  const appointments = getBiometricAppointments(ownerId);
  return appointments.find(
    (a) =>
      a.trangThai === 'Chờ cơ quan xác nhận' ||
      a.trangThai === 'Đã xác nhận'
  );
}

// Lấy lịch hẹn gần nhất (không phân biệt trạng thái)
export function getLatestAppointment(ownerId: string): BiometricAppointment | undefined {
  const appointments = getBiometricAppointments(ownerId);
  if (appointments.length === 0) return undefined;
  return appointments[0]; // Do saveBiometricAppointment unshift lịch mới lên đầu
}

// Hàm đếm số lịch theo khung giờ (không còn giới hạn lượt)
export function getSlotBookingCount(dateStr: string, slot: string, excludeId?: string): number {
  return 0;
}

// Các helper ngày tháng cho lịch hẹn
export function formatDateToYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDateVN(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

export function getTomorrowDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getMaxBookingDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Kiểm tra ngày hẹn hợp lệ (từ ngày mai đến 30 ngày sau, bỏ Thứ Bảy và Chủ Nhật, không vượt quá maxValidityDate)
export function validateAppointmentDate(
  dateStr: string,
  maxValidityDate?: string
): { valid: boolean; error?: string } {
  if (!dateStr || !dateStr.trim()) {
    return { valid: false, error: 'Vui lòng chọn ngày hẹn' };
  }

  const parts = dateStr.split('-');
  if (parts.length !== 3) {
    return { valid: false, error: 'Ngày hẹn không hợp lệ. Vui lòng chọn ngày khác' };
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const selected = new Date(year, month, day);

  if (isNaN(selected.getTime())) {
    return { valid: false, error: 'Ngày hẹn không hợp lệ. Vui lòng chọn ngày khác' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 30);

  // Thứ 7 (6) hoặc Chủ Nhật (0)
  const dayOfWeek = selected.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return { valid: false, error: 'Ngày hẹn không hợp lệ. Vui lòng chọn ngày khác' };
  }

  // Ngoài khoảng [tomorrow, maxDate]
  if (selected < tomorrow || selected > maxDate) {
    return { valid: false, error: 'Ngày hẹn không hợp lệ. Vui lòng chọn ngày khác' };
  }

  // Đối với thủ tục cấp giấy thông hành tạm thời: không được chọn sau "Ngày bắt đầu sử dụng"
  if (maxValidityDate && maxValidityDate.trim()) {
    const vParts = maxValidityDate.split('-');
    if (vParts.length === 3) {
      const vDate = new Date(parseInt(vParts[0], 10), parseInt(vParts[1], 10) - 1, parseInt(vParts[2], 10));
      if (!isNaN(vDate.getTime()) && selected > vDate) {
        return { valid: false, error: 'Ngày hẹn không được sau Ngày bắt đầu sử dụng' };
      }
    }
  }

  return { valid: true };
}

// Tìm ngày làm việc kế tiếp (bỏ qua T7, CN)
export function getNextWorkingDay(fromDateStr: string): string {
  let cur: Date;
  if (fromDateStr && fromDateStr.includes('-')) {
    const parts = fromDateStr.split('-');
    cur = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  } else {
    cur = new Date();
  }

  cur.setDate(cur.getDate() + 1);
  while (cur.getDay() === 0 || cur.getDay() === 6) {
    cur.setDate(cur.getDate() + 1);
  }
  return formatDateToYMD(cur);
}

// Tạo mã lịch hẹn ngẫu nhiên: LH-XXXXXX (6 chữ số)
export function generateAppointmentCode(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `LH-${num}`;
}

// Tính ngày hẹn = ngày hiện tại + 7 ngày (tính động theo ngày chạy, bỏ qua thứ Bảy, Chủ nhật)
export function calculateAppointmentDatePlus7WorkingDays(baseDate: Date = new Date()): string {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + 7);
  // Bỏ qua Thứ Bảy (6) và Chủ Nhật (0)
  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() + 1);
  }
  return formatDateToYMD(d);
}

// Khởi tạo trạng thái sinh trắc & lịch hẹn cho 3 tài khoản test (chạy mỗi lần tải trang)
export function seedThreeTestAccountsBiometricAndAppointments(): void {
  try {
    // 1. Châu Đông Vũ (1234567890125): ĐÃ có sinh trắc -> ghi eb_biometric_done = true
    markBiometricCompletedForCitizen('1234567890125');

    // 2. Trần Nam Huân (1234567890124): CHƯA có sinh trắc, ĐANG có 1 lịch hẹn còn hiệu lực LH-0001
    const allApps = getBiometricAppointments();
    const existingLH0001 = allApps.find((a) => a.id === 'LH-0001');
    if (!existingLH0001) {
      const huanAppointment: BiometricAppointment = {
        id: 'LH-0001',
        ownerId: '1234567890124',
        coQuan: 'Phòng Xuất nhập cảnh – Công an tỉnh Vientiane',
        ngay: calculateAppointmentDatePlus7WorkingDays(),
        khungGio: '09:00–10:00',
        sdt: '02055223344',
        trangThai: 'Đã xác nhận',
        createdAt: new Date().toISOString(),
        loaiThuTuc: 'cap-so',
        donViTiepNhan: 'Phòng Xuất nhập cảnh',
      };
      saveBiometricAppointment(huanAppointment);
    }

    // Đảm bảo Huân không có trong eb_biometric_done
    removeBiometricCompletedForCitizen('1234567890124');

    // 3. Trương Tùng Lan (1234567890123): CHƯA có sinh trắc, KHÔNG có lịch hẹn
    // Khi khởi động lần đầu, đảm bảo không có trong eb_biometric_done
    const seededFlag = localStorage.getItem('eb_test_accounts_seeded_init');
    if (!seededFlag) {
      removeBiometricCompletedForCitizen('1234567890123');
      localStorage.setItem('eb_test_accounts_seeded_init', 'true');
    }
  } catch (e) {
    console.error('Lỗi khi seed trạng thái sinh trắc 3 tài khoản test:', e);
  }
}

// Đặt lại dữ liệu 3 tài khoản test về đúng trạng thái ban đầu ở mục 2
// - 1234567890123 (Lan): xóa lịch hẹn mới đặt, xóa khỏi eb_biometric_done
// - 1234567890124 (Huân): khôi phục LH-0001 ("Đã xác nhận", dynamic + 7 ngày, 09:00-09:30), xóa lịch khác, xóa khỏi eb_biometric_done
// - 1234567890125 (Vũ): giữ eb_biometric_done = true, xóa lịch hẹn nếu có
// - Xóa hồ sơ nháp/đã nộp của cả 3 tài khoản
export function resetThreeTestAccounts(): void {
  try {
    // 1. Quản lý appointments:
    const allAppointments = getBiometricAppointments();
    // Lọc bỏ tất cả lịch hẹn của Lan, Huân và Vũ
    const otherAppointments = allAppointments.filter(
      (a) =>
        a.ownerId !== '1234567890123' &&
        a.ownerId !== '1234567890124' &&
        a.ownerId !== '1234567890125'
    );

    // Khôi phục chuẩn xác LH-0001 cho Huân
    const huanLH0001: BiometricAppointment = {
      id: 'LH-0001',
      ownerId: '1234567890124',
      coQuan: 'Phòng Xuất nhập cảnh – Công an tỉnh Vientiane',
      ngay: calculateAppointmentDatePlus7WorkingDays(),
      khungGio: '09:00 - 09:30',
      sdt: '02055223344',
      trangThai: 'Đã xác nhận',
      createdAt: new Date().toISOString(),
      loaiThuTuc: 'cap-so',
      donViTiepNhan: 'Phòng Xuất nhập cảnh',
    };

    localStorage.setItem(
      STORAGE_APPOINTMENTS_KEY,
      JSON.stringify([huanLH0001, ...otherAppointments])
    );

    // 2. Trạng thái sinh trắc:
    // Lan: chưa có sinh trắc
    removeBiometricCompletedForCitizen('1234567890123');
    clearBiometricSessionPassed('1234567890123');
    // Huân: chưa có sinh trắc
    removeBiometricCompletedForCitizen('1234567890124');
    clearBiometricSessionPassed('1234567890124');
    // Vũ: đã có sinh trắc
    markBiometricCompletedForCitizen('1234567890125');

    // 3. Xóa hồ sơ (kể cả bản nháp) của cả 3 tài khoản test
    deleteApplicationsForCitizens(SPECIAL_TEST_ACCOUNT_IDS);
  } catch (e) {
    console.error('Lỗi khi đặt lại 3 tài khoản test:', e);
  }
}
