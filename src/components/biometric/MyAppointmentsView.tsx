import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { EbSession } from '../../utils/ebAuthStorage';
import {
  BiometricAppointment,
  getBiometricAppointments,
  seedThreeTestAccountsBiometricAndAppointments,
} from '../../utils/biometricStorage';
import { AppointmentCard } from './AppointmentCard';
import { Calendar, ArrowLeft, Clock, History, ChevronDown } from 'lucide-react';

interface MyAppointmentsViewProps {
  session: EbSession;
  onNavigateHome: () => void;
  onNavigateViewApplication?: (maHoSo: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'danger' | 'info') => void;
}

export const MyAppointmentsView: React.FC<MyAppointmentsViewProps> = ({
  session,
  onNavigateHome,
  onNavigateViewApplication,
}) => {
  const [appointments, setAppointments] = useState<BiometricAppointment[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(true);

  const loadAppointments = useCallback(() => {
    const cleanId = (session.idNumber || '').replace(/\D/g, '');
    // Đảm bảo tài khoản 1234567890124 (Trần Nam Huân) thấy ngay 1 lịch hẹn "Đã xác nhận"
    if (cleanId === '1234567890124') {
      const currentList = getBiometricAppointments('1234567890124');
      if (currentList.length === 0) {
        seedThreeTestAccountsBiometricAndAppointments();
      }
    }
    const list = getBiometricAppointments(session.idNumber);
    setAppointments(list);
  }, [session.idNumber]);

  useEffect(() => {
    loadAppointments();
    const handleUpdate = () => loadAppointments();
    window.addEventListener('eb_biometric_appointments_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('eb_biometric_appointments_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [loadAppointments]);

  // Phân loại: Lịch hẹn ĐANG HIỆU LỰC (Chờ cơ quan xác nhận / Đã xác nhận) & Lịch sử lịch hẹn (Đã hủy)
  const { activeAppointment, historyAppointments } = useMemo(() => {
    const active = appointments.find(
      (a) =>
        a.trangThai === 'Chờ cơ quan xác nhận' ||
        a.trangThai === 'Đã xác nhận'
    );
    const history = appointments.filter((a) => a.trangThai === 'Đã hủy');
    return { activeAppointment: active || null, historyAppointments: history };
  }, [appointments]);

  return (
    <div className="w-full max-w-[800px] mx-auto animate-fadeIn py-6 px-4 sm:px-6 space-y-6">
      {/* Thanh breadcrumb/quay lại */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 text-[13px] text-[#5F6B66] hover:text-[#006B3F] font-medium cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ</span>
        </button>
      </div>

      {/* Tiêu đề & mô tả */}
      <div className="space-y-1">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#1A2421]">
          Lịch hẹn của tôi
        </h2>
        <p className="text-[13px] text-[#5F6B66]">
          Theo dõi lịch hẹn thu nhận sinh trắc (chụp ảnh chân dung & lấy dấu vân tay) tại cơ quan quản lý xuất nhập cảnh.
        </p>
      </div>

      {/* Trường hợp chưa có lịch hẹn nào */}
      {appointments.length === 0 ? (
        <div className="bg-white border border-[#D9DFDC] rounded-xl p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#F5F7F6] text-[#9CA3AF] flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-[16px] font-bold text-[#1A2421]">
              Bạn chưa có lịch hẹn thu nhận sinh trắc nào
            </h3>
            <p className="text-[13px] text-[#5F6B66]">
              Lịch hẹn chỉ được tạo khi nộp hồ sơ yêu cầu thu nhận sinh trắc.
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={onNavigateHome}
              className="px-4 py-2 text-[13px] font-semibold text-[#006B3F] bg-[#E8F3EE] hover:bg-[#D5EADB] rounded-lg transition-colors cursor-pointer"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* PHÍA TRÊN: THẺ LỊCH HẸN ĐANG HIỆU LỰC (nổi bật) */}
          {activeAppointment ? (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-[#006B3F] font-bold text-[14px] uppercase tracking-wide">
                <Clock className="w-4 h-4 text-[#006B3F]" />
                <span>Lịch hẹn đang hiệu lực</span>
              </div>
              <div className="ring-2 ring-[#006B3F]/20 rounded-xl">
                <AppointmentCard
                  appointment={activeAppointment}
                  onNavigateViewApplication={onNavigateViewApplication}
                />
              </div>
            </div>
          ) : (
            <div className="bg-[#F8FAF9] border border-[#D9DFDC] rounded-xl p-4 text-[13px] text-[#5F6B66]">
              Bạn hiện không có lịch hẹn nào đang hiệu lực.
            </div>
          )}

          {/* PHÍA DƯỚI: MỤC LỊCH SỬ LỊCH HẸN (liệt kê Đã hủy, thu gọn được) */}
          {historyAppointments.length > 0 && (
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="w-full flex items-center justify-between p-3.5 bg-white border border-[#D9DFDC] rounded-xl hover:bg-[#F5F7F6] transition-colors cursor-pointer text-left shadow-2xs"
              >
                <div className="flex items-center gap-2.5 text-[#1A2421] font-bold text-[14px]">
                  <History className="w-4 h-4 text-[#5F6B66]" />
                  <span>Lịch sử lịch hẹn ({historyAppointments.length})</span>
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-[#5F6B66] font-medium">
                  <span>{showHistory ? 'Thu gọn' : 'Xem lịch sử'}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showHistory ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {showHistory && (
                <div className="space-y-4 pt-1 animate-fadeIn">
                  {historyAppointments.map((app) => (
                    <AppointmentCard
                      key={app.id}
                      appointment={app}
                      onNavigateViewApplication={onNavigateViewApplication}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
