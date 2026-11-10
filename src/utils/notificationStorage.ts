// Quản lý thông báo công dân trên Cổng Dịch vụ công: eb_notifications
export interface CitizenNotification {
  id: string;
  taiKhoan: string; // Số định danh công dân
  maHoSo?: string;
  title?: string;
  tieuDe?: string;
  content?: string;
  noiDung?: string;
  createdAt: string;
  read: boolean;
  type?: 'payment' | 'appointment' | 'status' | 'general' | 'payment_required' | 'payment_success' | 'info';
  loai?: string;
  link?: string;
  amount?: number;
}

const STORAGE_NOTIFICATIONS_KEY = 'eb_notifications';

// Lấy danh sách thông báo của tài khoản
export function getCitizenNotifications(taiKhoan?: string): CitizenNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_NOTIFICATIONS_KEY);
    if (!raw) return [];
    const list: CitizenNotification[] = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    if (taiKhoan) {
      const clean = taiKhoan.replace(/\D/g, '');
      return list.filter((n) => !n.taiKhoan || n.taiKhoan.replace(/\D/g, '') === clean);
    }
    return list;
  } catch (e) {
    console.error('Lỗi khi nạp thông báo:', e);
    return [];
  }
}

// Thêm thông báo mới cho công dân
export function addCitizenNotification(
  entry: Omit<CitizenNotification, 'id' | 'createdAt' | 'read'>
): CitizenNotification {
  try {
    const list = getCitizenNotifications();
    const newNoti: CitizenNotification = {
      ...entry,
      id: `NOTI-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    list.unshift(newNoti);
    localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(list));
    // Phát event để cập nhật ngay chuông thông báo nếu đang mở
    window.dispatchEvent(new CustomEvent('eb_notification_added', { detail: newNoti }));
    return newNoti;
  } catch (e) {
    console.error('Lỗi khi thêm thông báo:', e);
    return {
      ...entry,
      id: `NOTI-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
  }
}

// Đánh dấu đã đọc 1 thông báo
export function markNotificationAsRead(id: string): void {
  try {
    const list = getCitizenNotifications();
    const idx = list.findIndex((n) => n.id === id);
    if (idx !== -1) {
      list[idx].read = true;
      localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('eb_notifications_updated'));
    }
  } catch (e) {
    console.error('Lỗi khi đánh dấu đã đọc:', e);
  }
}

// Đánh dấu tất cả đã đọc
export function markAllNotificationsAsRead(taiKhoan: string): void {
  try {
    const list = getCitizenNotifications();
    const clean = taiKhoan.replace(/\D/g, '');
    let changed = false;
    for (const item of list) {
      if ((!item.taiKhoan || item.taiKhoan.replace(/\D/g, '') === clean) && !item.read) {
        item.read = true;
        changed = true;
      }
    }
    if (changed) {
      localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('eb_notifications_updated'));
    }
  } catch (e) {
    console.error('Lỗi khi đánh dấu tất cả đã đọc:', e);
  }
}

// Đếm số thông báo chưa đọc
export function getUnreadNotificationCount(taiKhoan: string): number {
  const notis = getCitizenNotifications(taiKhoan);
  return notis.filter((n) => !n.read).length;
}
