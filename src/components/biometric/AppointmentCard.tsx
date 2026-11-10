import React from 'react';
import {
  BiometricAppointment,
  AppointmentStatus,
  formatDateVN,
} from '../../utils/biometricStorage';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  FileText,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';

interface AppointmentCardProps {
  appointment: BiometricAppointment;
  onNavigateViewApplication?: (maHoSo: string) => void;
  compact?: boolean;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onNavigateViewApplication,
}) => {
  // Badge trạng thái theo chuẩn: chỉ còn 3 trạng thái "Chờ cơ quan xác nhận", "Đã xác nhận", "Đã hủy"
  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Chờ cơ quan xác nhận':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-[#FFF8E7] text-[#B26A00] border border-[#F4E29D]">
            <Clock className="w-3.5 h-3.5" />
            <span>Chờ cơ quan xác nhận</span>
          </span>
        );
      case 'Đã xác nhận':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-[#E8F3EE] text-[#006B3F] border border-[#A5D6A7]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đã xác nhận</span>
          </span>
        );
      case 'Đã hủy':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
            <XCircle className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>Đã hủy</span>
          </span>
        );
    }
  };

  const isActive =
    appointment.trangThai === 'Chờ cơ quan xác nhận' ||
    appointment.trangThai === 'Đã xác nhận';

  return (
    <div className="bg-white border border-[#D9DFDC] rounded-xl p-5 shadow-xs space-y-4 text-[13px] text-[#1A2421] relative">
      {/* Header thẻ: Badge trạng thái bên trái, Mã lịch hẹn nhỏ gọn bên góc phải */}
      <div className="flex items-center justify-between gap-2 border-b border-[#E5E9E7] pb-3">
        <div className="flex items-center gap-2">
          {getStatusBadge(appointment.trangThai)}
        </div>
        <span
          className="text-[11px] font-mono text-[#8C9893]"
          title={`Mã lịch hẹn: ${appointment.id}`}
        >
          Mã LH: {appointment.id}
        </span>
      </div>

      {/* Dòng Ngày giờ hẹn: chữ lớn, đậm */}
      <div className="flex items-center gap-3 bg-[#F8FAF9] p-3.5 rounded-xl border border-[#E5E9E7]">
        <div className="p-2.5 rounded-lg bg-[#E8F3EE] text-[#006B3F] shrink-0">
          <Calendar className="w-6 h-6 text-[#006B3F]" />
        </div>
        <div>
          <span className="text-[11px] text-[#5F6B66] uppercase tracking-wider font-semibold block">
            Thời gian hẹn thu nhận sinh trắc
          </span>
          <div className="text-[17px] sm:text-[19px] font-bold text-[#1A2421] mt-0.5">
            {appointment.khungGio ? `${appointment.khungGio}, ` : ''}
            {formatDateVN(appointment.ngay)}
          </div>
        </div>
      </div>

      {/* Chi tiết thông tin lịch hẹn */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 leading-relaxed pt-1">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-[#006B3F] shrink-0 mt-0.5" />
          <div>
            <span className="text-[#5F6B66] block text-[12px]">Cơ quan tiếp nhận:</span>
            <span className="font-semibold text-[#1A2421]">{appointment.coQuan}</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Phone className="w-4 h-4 text-[#006B3F] shrink-0 mt-0.5" />
          <div>
            <span className="text-[#5F6B66] block text-[12px]">Số điện thoại liên hệ:</span>
            <span className="font-semibold text-[#1A2421]">{appointment.sdt}</span>
          </div>
        </div>

        {appointment.maHoSo && (
          <div className="flex items-start gap-2 sm:col-span-2">
            <FileText className="w-4 h-4 text-[#006B3F] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#5F6B66] block text-[12px]">Hồ sơ gắn kèm:</span>
              <button
                type="button"
                onClick={() => onNavigateViewApplication?.(appointment.maHoSo!)}
                className="font-mono font-bold text-[#006B3F] hover:underline cursor-pointer inline-flex items-center gap-1 group text-[13px] bg-[#E8F3EE] px-2 py-0.5 rounded mt-0.5"
                title="Bấm để xem chi tiết hồ sơ này"
              >
                <span>{appointment.maHoSo}</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {appointment.ghiChu && (
          <div className="sm:col-span-2 flex items-start gap-2 bg-[#F9FAFB] p-2.5 rounded-lg border border-[#E5E9E7]">
            <FileText className="w-4 h-4 text-[#5F6B66] shrink-0 mt-0.5" />
            <div className="text-[12px]">
              <span className="font-medium text-[#5F6B66]">Ghi chú:</span>{' '}
              <span className="text-[#1A2421]">{appointment.ghiChu}</span>
            </div>
          </div>
        )}

        {appointment.trangThai === 'Đã hủy' && appointment.lyDo && (
          <div className="sm:col-span-2 flex items-start gap-2 bg-[#FFF5F5] p-2.5 rounded-lg border border-[#FCA5A5] text-[#C62828] text-[12px]">
            <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Lý do hủy:</span> {appointment.lyDo}
            </div>
          </div>
        )}
      </div>

      {/* Dưới thẻ lịch hẹn đang hiệu lực (Chờ xác nhận/Đã xác nhận) hiện dòng nhỏ */}
      {isActive && (
        <div className="pt-2.5 border-t border-[#E5E9E7] text-[12px] text-[#5F6B66] italic">
          * Lịch hẹn đã được gửi đến cơ quan nên không thể đổi hoặc hủy. Nếu cần thay đổi, vui lòng liên hệ cơ quan tiếp nhận.
        </div>
      )}
    </div>
  );
};
