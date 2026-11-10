// Quản lý tài khoản và phiên đăng nhập e-Border Pass
// Lưu vào localStorage: 'eb_accounts', 'eb_session' (hoặc sessionStorage nếu không nhớ mật khẩu)

import { seedThreeTestAccountsBiometricAndAppointments } from './biometricStorage';

export type UserResidence =
  | string
  | {
      province: string;
      district: string;
      village: string;
      subUnit: string;
      detail: string;
    };

export interface EbAccount {
  id: string;
  fullName: string;
  idNumber: string; // 13 chữ số
  dob?: string;
  dateOfBirth?: string;
  gender?: 'Nam' | 'Nữ' | string;
  residence?: UserResidence | null;
  contactChannel: 'sms' | 'email';
  phone?: string;
  email?: string;
  passwordHash: string; // SHA-256 + salt
  salt: string;
  failedCount: number;
  lockedUntil?: number; // timestamp mở khóa (ms)
  createdAt: string;
}

export interface EbSession {
  userId: string;
  fullName: string;
  idNumber: string;
  gender?: string;
  dob?: string;
  dateOfBirth?: string;
  loginAt: string;
  rememberMe?: boolean;
}

const STORAGE_ACCOUNTS_KEY = 'eb_accounts';
const STORAGE_SESSION_KEY = 'eb_session';

// Chú ý bảo mật: Đây là demo chạy thuần phía client. Trong hệ thống thật, mật khẩu phải được băm và xác thực phía server (backend) sử dụng bcrypt hoặc argon2.
async function hashPasswordWithSalt(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(password + ':::' + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function generateRandomSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Lấy danh sách tài khoản
export function getEbAccounts(): EbAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Lưu danh sách tài khoản
export function saveEbAccounts(accounts: EbAccount[]): void {
  try {
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Lỗi khi lưu eb_accounts:', err);
  }
}

// Tìm tài khoản theo số định danh / CMND
export function findAccountByIdNumber(idNumber: string): EbAccount | undefined {
  const clean = idNumber.replace(/\D/g, '');
  const accounts = getEbAccounts();
  const found = accounts.find((acc) => acc.idNumber.replace(/\D/g, '') === clean);
  if (found) return found;

  // Fallback các tài khoản kiểm thử chuyên dụng
  if (clean === '0311840139633') {
    return {
      id: 'acc_demo_border',
      fullName: 'Somchai Keovongsa',
      idNumber: '0311840139633',
      dob: '1992-05-15',
      dateOfBirth: '1992-05-15',
      gender: 'Nam',
      contactChannel: 'sms',
      phone: '02055667788',
      email: 'somchai.k@lao.gov.la',
      residence: {
        province: 'Bokeo',
        district: 'Huyện Houayxay',
        village: 'Bản Houayxay',
        subUnit: 'Đơn vị 01',
        detail: 'Số 88 đường Mittaphap',
      },
      passwordHash: '',
      salt: '',
      failedCount: 0,
      createdAt: new Date().toISOString(),
    };
  }

  if (clean === '0311840139631') {
    return {
      id: 'acc_demo_no_residence',
      fullName: 'Bounmy Sisavath',
      idNumber: '0311840139631',
      dob: '1994-09-10',
      dateOfBirth: '1994-09-10',
      gender: 'Nữ',
      contactChannel: 'sms',
      phone: '02055998877',
      email: 'bounmy.s@lao.gov.la',
      residence: null, // Không có thông tin nơi thường trú
      passwordHash: '',
      salt: '',
      failedCount: 0,
      createdAt: new Date().toISOString(),
    };
  }

  if (clean === '1234567890123') {
    return {
      id: 'acc_test_lan',
      fullName: 'Trương Tùng Lan',
      idNumber: '1234567890123',
      dob: '1998-03-12',
      dateOfBirth: '1998-03-12',
      gender: 'Nữ',
      contactChannel: 'sms',
      phone: '02055112233',
      email: 'lan.truong@lao.gov.la',
      residence: {
        province: 'Luang Prabang', // Tỉnh không giáp biên giới
        district: 'Huyện Luang Prabang',
        village: 'Bản Xieng Mouane',
        subUnit: 'Đơn vị 01',
        detail: 'Số 15 đường Sisavangvong',
      },
      passwordHash: '',
      salt: '',
      failedCount: 0,
      createdAt: new Date().toISOString(),
    };
  }

  if (clean === '1234567890124') {
    return {
      id: 'acc_test_huan',
      fullName: 'Trần Nam Huân',
      idNumber: '1234567890124',
      dob: '1993-07-25',
      dateOfBirth: '1993-07-25',
      gender: 'Nam',
      contactChannel: 'sms',
      phone: '02055223344',
      email: 'huan.tran@lao.gov.la',
      residence: {
        province: 'Vientiane',
        district: 'Huyện Vang Vieng',
        village: 'Bản Savang',
        subUnit: 'Đơn vị 02',
        detail: 'Số 24 đường Khun Bulom',
      },
      passwordHash: '',
      salt: '',
      failedCount: 0,
      createdAt: new Date().toISOString(),
    };
  }

  if (clean === '1234567890125') {
    return {
      id: 'acc_test_vu',
      fullName: 'Châu Đông Vũ',
      idNumber: '1234567890125',
      dob: '1996-11-18',
      dateOfBirth: '1996-11-18',
      gender: 'Nam',
      contactChannel: 'sms',
      phone: '02055334455',
      email: 'vu.chau@lao.gov.la',
      residence: {
        province: 'Bokeo',
        district: 'Huyện Houayxay',
        village: 'Bản Houayxay',
        subUnit: 'Đơn vị 01',
        detail: 'Số 88 đường Mittaphap',
      },
      passwordHash: '',
      salt: '',
      failedCount: 0,
      createdAt: new Date().toISOString(),
    };
  }

  // Fallback định danh 1234567891234 chuyên dụng để chạy kiểm thử sinh trắc & đặt lịch hẹn
  if (clean === '1234567891234') {
    return {
      id: 'acc_demo_test_biometric',
      fullName: 'Khamphanh Chanthalavong',
      idNumber: '1234567891234',
      dob: '1995-08-20',
      dateOfBirth: '1995-08-20',
      gender: 'Nam',
      contactChannel: 'sms',
      phone: '02099887766',
      email: 'khamphanh.c@lao.gov.la',
      residence: {
        province: 'Thủ đô Viêng Chăn',
        district: 'Huyện Chanthabuly',
        village: 'Bản Hatsady',
        subUnit: 'Đơn vị 01',
        detail: 'Số 10 Đại lộ Lane Xang',
      },
      passwordHash: '',
      salt: '',
      failedCount: 0,
      createdAt: new Date().toISOString(),
    };
  }

  return undefined;
}

// Kiểm tra trùng lặp khi đăng ký
export function checkAccountDuplicates(
  idNumber: string,
  contactChannel: 'sms' | 'email',
  phone?: string,
  email?: string
): { idDuplicate: boolean; contactDuplicate: boolean } {
  const cleanId = idNumber.replace(/\D/g, '');
  const accounts = getEbAccounts();
  const idDuplicate = accounts.some((a) => a.idNumber.replace(/\D/g, '') === cleanId);

  let contactDuplicate = false;
  if (contactChannel === 'sms' && phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    contactDuplicate = accounts.some(
      (a) => a.phone && a.phone.replace(/\D/g, '') === cleanPhone
    );
  } else if (contactChannel === 'email' && email) {
    const cleanEmail = email.trim().toLowerCase();
    contactDuplicate = accounts.some(
      (a) => a.email && a.email.trim().toLowerCase() === cleanEmail
    );
  }

  return { idDuplicate, contactDuplicate };
}

// Đăng ký tài khoản mới (Chỉ gọi sau khi xác thực OTP thành công)
export async function registerNewAccount(data: {
  fullName: string;
  idNumber: string;
  dob?: string;
  dateOfBirth?: string;
  gender?: 'Nam' | 'Nữ' | string;
  residence?: UserResidence | null;
  contactChannel: 'sms' | 'email';
  phone?: string;
  email?: string;
  passwordPlain: string;
}): Promise<EbAccount> {
  const salt = generateRandomSalt();
  const passwordHash = await hashPasswordWithSalt(data.passwordPlain, salt);
  const cleanId = data.idNumber.replace(/\D/g, '');
  const birthVal = data.dateOfBirth || data.dob || undefined;

  const newAccount: EbAccount = {
    id: `acc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    fullName: data.fullName.trim(),
    idNumber: cleanId,
    dob: birthVal,
    dateOfBirth: birthVal,
    gender: data.gender || undefined,
    residence: data.residence || null,
    contactChannel: data.contactChannel,
    phone: data.phone?.trim() || undefined,
    email: data.email?.trim() || undefined,
    passwordHash,
    salt,
    failedCount: 0,
    createdAt: new Date().toISOString(),
  };

  const accounts = getEbAccounts();
  // Nếu đã có tài khoản trùng (trường hợp cực đoan), thay thế hoặc thêm
  const filtered = accounts.filter((a) => a.idNumber.replace(/\D/g, '') !== cleanId);
  filtered.push(newAccount);
  saveEbAccounts(filtered);

  return newAccount;
}

// Kiểm tra mật khẩu tài khoản
export async function verifyPassword(account: EbAccount, passwordPlain: string): Promise<boolean> {
  const cleanId = account.idNumber.replace(/\D/g, '');
  // Tài khoản kiểm thử chuyên biệt 1234567891234: chấp nhận mọi mật khẩu để đăng nhập kiểm thử thuận tiện
  if (cleanId === '1234567891234') {
    return true;
  }
  // Các tài khoản test chuyên dụng: chấp nhận mật khẩu chung 123aA@
  if (
    ['1234567890123', '1234567890124', '1234567890125', '0311840139633', '0311840139631'].includes(cleanId) &&
    passwordPlain === '123aA@'
  ) {
    return true;
  }
  const hash = await hashPasswordWithSalt(passwordPlain, account.salt);
  return hash === account.passwordHash;
}

// Cập nhật thông tin đăng nhập sai / khóa tài khoản
export function recordLoginAttempt(
  idNumber: string,
  success: boolean
): {
  isLocked: boolean;
  lockedUntil?: number;
  remainingMinutes?: number;
} {
  const cleanId = idNumber.replace(/\D/g, '');
  const accounts = getEbAccounts();
  const accIndex = accounts.findIndex((a) => a.idNumber.replace(/\D/g, '') === cleanId);

  if (accIndex === -1) {
    return { isLocked: false };
  }

  const acc = accounts[accIndex];
  const now = Date.now();

  if (success) {
    acc.failedCount = 0;
    acc.lockedUntil = undefined;
    saveEbAccounts(accounts);
    return { isLocked: false };
  }

  // Tăng đếm sai
  acc.failedCount = (acc.failedCount || 0) + 1;
  if (acc.failedCount >= 5) {
    // Khóa 5 phút
    acc.lockedUntil = now + 5 * 60 * 1000;
  }
  saveEbAccounts(accounts);

  if (acc.lockedUntil && acc.lockedUntil > now) {
    return {
      isLocked: true,
      lockedUntil: acc.lockedUntil,
      remainingMinutes: Math.ceil((acc.lockedUntil - now) / 60000),
    };
  }

  return { isLocked: false };
}

// Kiểm tra xem tài khoản có đang bị khóa không
export function checkAccountLockStatus(idNumber: string): {
  isLocked: boolean;
  lockedUntil?: number;
  remainingSeconds: number;
} {
  const cleanId = idNumber.replace(/\D/g, '');
  const accounts = getEbAccounts();
  const acc = accounts.find((a) => a.idNumber.replace(/\D/g, '') === cleanId);

  if (!acc || !acc.lockedUntil) {
    return { isLocked: false, remainingSeconds: 0 };
  }

  const now = Date.now();
  if (acc.lockedUntil > now) {
    return {
      isLocked: true,
      lockedUntil: acc.lockedUntil,
      remainingSeconds: Math.ceil((acc.lockedUntil - now) / 1000),
    };
  } else {
    // Hết hạn khóa thì tự động mở khóa
    acc.failedCount = 0;
    acc.lockedUntil = undefined;
    saveEbAccounts(accounts);
    return { isLocked: false, remainingSeconds: 0 };
  }
}

// Đặt lại mật khẩu mới
export async function resetAccountPassword(
  idNumber: string,
  newPasswordPlain: string
): Promise<boolean> {
  const cleanId = idNumber.replace(/\D/g, '');
  const accounts = getEbAccounts();
  const acc = accounts.find((a) => a.idNumber.replace(/\D/g, '') === cleanId);
  if (!acc) return false;

  const newSalt = generateRandomSalt();
  const newHash = await hashPasswordWithSalt(newPasswordPlain, newSalt);

  acc.salt = newSalt;
  acc.passwordHash = newHash;
  acc.failedCount = 0;
  acc.lockedUntil = undefined;

  saveEbAccounts(accounts);
  return true;
}

// Quản lý Phiên đăng nhập (eb_session)
export function getCurrentSession(): EbSession | null {
  try {
    // Ưu tiên localStorage (Ghi nhớ) rồi đến sessionStorage
    const local = localStorage.getItem(STORAGE_SESSION_KEY);
    if (local) {
      return JSON.parse(local);
    }
    const session = sessionStorage.getItem(STORAGE_SESSION_KEY);
    if (session) {
      return JSON.parse(session);
    }
    return null;
  } catch {
    return null;
  }
}

export function saveSession(
  user: {
    id: string;
    fullName: string;
    idNumber: string;
    gender?: string;
    dob?: string;
    dateOfBirth?: string;
  },
  rememberMe: boolean
): void {
  const birth = user.dateOfBirth || user.dob;
  const session: EbSession = {
    userId: user.id,
    fullName: user.fullName,
    idNumber: user.idNumber,
    gender: user.gender,
    dob: birth,
    dateOfBirth: birth,
    loginAt: new Date().toISOString(),
    rememberMe,
  };

  const str = JSON.stringify(session);
  if (rememberMe) {
    localStorage.setItem(STORAGE_SESSION_KEY, str);
    sessionStorage.removeItem(STORAGE_SESSION_KEY);
  } else {
    sessionStorage.setItem(STORAGE_SESSION_KEY, str);
    localStorage.removeItem(STORAGE_SESSION_KEY);
  }
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_SESSION_KEY);
  sessionStorage.removeItem(STORAGE_SESSION_KEY);
}

// Tiện ích xóa dữ liệu demo
export function clearAllDemoData(): void {
  localStorage.removeItem(STORAGE_ACCOUNTS_KEY);
  localStorage.removeItem(STORAGE_SESSION_KEY);
  sessionStorage.removeItem(STORAGE_SESSION_KEY);
}

// Khởi tạo các tài khoản mẫu có sẵn để tiện kiểm thử nhanh
export async function seedDemoAccountIfNeeded(): Promise<void> {
  const accounts = getEbAccounts();
  let modified = false;

  // 1. Tài khoản công dân Somchai Keovongsa
  if (!accounts.some((a) => a.idNumber.replace(/\D/g, '') === '0108920194801')) {
    const salt = generateRandomSalt();
    const passwordHash = await hashPasswordWithSalt('Somchai@2026', salt);
    const demoAcc: EbAccount = {
      id: 'acc_demo_001',
      fullName: 'Somchai Keovongsa',
      idNumber: '0108920194801',
      dob: '1992-05-15',
      contactChannel: 'sms',
      phone: '02055667788',
      email: 'somchai.k@lao.gov.la',
      residence: {
        province: 'Bokeo',
        district: 'Houayxay',
        village: 'Bản Houayxay',
        subUnit: 'Đơn vị 01',
        detail: 'Số 12 đường Mittaphap',
      },
      passwordHash,
      salt,
      failedCount: 0,
      createdAt: new Date().toISOString(),
    };
    accounts.push(demoAcc);
    modified = true;
  }

  // 2. Tài khoản chuyên biệt kiểm thử sinh trắc & đặt lịch hẹn: 1234567891234
  if (!accounts.some((a) => a.idNumber.replace(/\D/g, '') === '1234567891234')) {
    const saltTest = generateRandomSalt();
    const passwordHashTest = await hashPasswordWithSalt('123456', saltTest);
    const testAcc: EbAccount = {
      id: 'acc_demo_test_biometric',
      fullName: 'Khamphanh Chanthalavong',
      idNumber: '1234567891234',
      dob: '1995-08-20',
      contactChannel: 'sms',
      phone: '02099887766',
      email: 'khamphanh.c@lao.gov.la',
      residence: {
        province: 'Thủ đô Viêng Chăn',
        district: 'Chanthabuly',
        village: 'Hatsady',
        subUnit: 'Đơn vị 01',
        detail: 'Số 10 Đại lộ Lane Xang',
      },
      passwordHash: passwordHashTest,
      salt: saltTest,
      failedCount: 0,
      createdAt: new Date().toISOString(),
    };
    accounts.push(testAcc);
    modified = true;
  }

  // 3. Khởi tạo / Cập nhật các tài khoản test chuyên dụng theo yêu cầu:
  // - 0311840139633: Somchai Keovongsa (Tỉnh giáp biên giới: Bokeo)
  // - 1234567890123: Trương Tùng Lan (Tỉnh không giáp biên giới: Luang Prabang)
  // - 0311840139631: Bounmy Sisavath (Chưa có thông tin nơi thường trú: residence = null)
  // - 1234567890124: Trần Nam Huân (Vientiane)
  // - 1234567890125: Châu Đông Vũ (Bokeo)
  const testAccountConfigs = [
    {
      id: 'acc_demo_border',
      fullName: 'Somchai Keovongsa',
      idNumber: '0311840139633',
      dob: '1992-05-15',
      dateOfBirth: '1992-05-15',
      gender: 'Nam',
      contactChannel: 'sms' as const,
      phone: '02055667788',
      email: 'somchai.k@lao.gov.la',
      residence: {
        province: 'Bokeo', // Tỉnh giáp biên giới
        district: 'Huyện Houayxay',
        village: 'Bản Houayxay',
        subUnit: 'Đơn vị 01',
        detail: 'Số 88 đường Mittaphap',
      },
    },
    {
      id: 'acc_demo_no_residence',
      fullName: 'Bounmy Sisavath',
      idNumber: '0311840139631',
      dob: '1994-09-10',
      dateOfBirth: '1994-09-10',
      gender: 'Nữ',
      contactChannel: 'sms' as const,
      phone: '02055998877',
      email: 'bounmy.s@lao.gov.la',
      residence: null, // Chưa có thông tin nơi thường trú
    },
    {
      id: 'acc_test_lan',
      fullName: 'Trương Tùng Lan',
      idNumber: '1234567890123',
      dob: '1998-03-12',
      dateOfBirth: '1998-03-12',
      gender: 'Nữ',
      contactChannel: 'sms' as const,
      phone: '02055112233',
      email: 'lan.truong@lao.gov.la',
      residence: {
        province: 'Luang Prabang', // Tỉnh không giáp biên giới
        district: 'Huyện Luang Prabang',
        village: 'Bản Xieng Mouane',
        subUnit: 'Đơn vị 01',
        detail: 'Số 15 đường Sisavangvong',
      },
    },
    {
      id: 'acc_test_huan',
      fullName: 'Trần Nam Huân',
      idNumber: '1234567890124',
      dob: '1993-07-25',
      dateOfBirth: '1993-07-25',
      gender: 'Nam',
      contactChannel: 'sms' as const,
      phone: '02055223344',
      email: 'huan.tran@lao.gov.la',
      residence: {
        province: 'Vientiane',
        district: 'Huyện Vang Vieng',
        village: 'Bản Savang',
        subUnit: 'Đơn vị 02',
        detail: 'Số 24 đường Khun Bulom',
      },
    },
    {
      id: 'acc_test_vu',
      fullName: 'Châu Đông Vũ',
      idNumber: '1234567890125',
      dob: '1996-11-18',
      dateOfBirth: '1996-11-18',
      gender: 'Nam',
      contactChannel: 'sms' as const,
      phone: '02055334455',
      email: 'vu.chau@lao.gov.la',
      residence: {
        province: 'Bokeo',
        district: 'Huyện Houayxay',
        village: 'Bản Houayxay',
        subUnit: 'Đơn vị 01',
        detail: 'Số 88 đường Mittaphap',
      },
    },
  ];

  for (const cfg of testAccountConfigs) {
    const existingIndex = accounts.findIndex(
      (a) => a.idNumber.replace(/\D/g, '') === cfg.idNumber
    );

    if (existingIndex >= 0) {
      // Nếu đã tồn tại: cập nhật lại họ tên, mật khẩu, giới tính, ngày sinh và trạng thái
      const existing = accounts[existingIndex];
      const salt = existing.salt || generateRandomSalt();
      const passwordHash = await hashPasswordWithSalt('123aA@', salt);

      accounts[existingIndex] = {
        ...existing,
        fullName: cfg.fullName,
        salt,
        passwordHash,
        failedCount: 0,
        lockedUntil: undefined,
        residence: cfg.residence,
        gender: cfg.gender,
        dob: cfg.dob,
        dateOfBirth: cfg.dateOfBirth,
      };
      modified = true;
    } else {
      // Nếu chưa có: tạo mới
      const salt = generateRandomSalt();
      const passwordHash = await hashPasswordWithSalt('123aA@', salt);
      accounts.push({
        id: cfg.id,
        fullName: cfg.fullName,
        idNumber: cfg.idNumber,
        dob: cfg.dob,
        dateOfBirth: cfg.dateOfBirth,
        gender: cfg.gender,
        contactChannel: cfg.contactChannel,
        phone: cfg.phone,
        email: cfg.email,
        residence: cfg.residence,
        passwordHash,
        salt,
        failedCount: 0,
        createdAt: new Date().toISOString(),
      });
      modified = true;
    }
  }

  if (modified) {
    saveEbAccounts(accounts);
  }

  // Khởi tạo trạng thái sinh trắc & lịch hẹn cho 3 tài khoản test
  seedThreeTestAccountsBiometricAndAppointments();
}
