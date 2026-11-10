import React from 'react';
import { BiometricAppointment, formatDateVN } from '../../utils/biometricStorage';
import { Button } from '../ui/Button';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  FileText,
  AlertTriangle,
  Home,
  FolderOpen,
  FilePlus,
} from 'lucide-react';

interface SubmissionSuccessViewProps {
  maHoSo: string;
  procedureTitle: string;
  submissionDate?: string;
  appointment?: BiometricAppointment | null;
  onNavigateHome: () => void;
  onNavigateMyApplications: () => void;
  onNavigateMyAppointments: () => void;
  onNavigateNewSubmission?: () => void;
}

export const SubmissionSuccessView: React.FC<SubmissionSuccessViewProps> = ({
  maHoSo,
  procedureTitle,
  submissionDate = new Date().toLocaleDateString('vi-VN'),
  appointment,
  onNavigateHome,
  onNavigateMyApplications,
  onNavigateMyAppointments,
  onNavigateNewSubmission,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl border border-[#D9DFDC] p-6 sm:p-8 space-y-6">
        {/* Header Icon + Success message */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-[#E8F3EE] text-[#006B3F] flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="text-[22px] sm:text-[24px] font-bold text-[#1A2421]">
            Nộp hồ sơ thành công!
          </h2>
          <p className="text-[14px] text-[#5F6B66]">
            Hồ sơ đề nghị của bạn đã được gửi đến cơ quan quản lý xuất nhập cảnh.
          </p>
        </div>

        {/* Thông tin hồ sơ vừa nộp */}
        <div className="bg-[#F9FAFB] border border-[#E5E9E7] rounded-xl p-4 sm:p-5 space-y-3 text-[13px]">
          <div className="flex items-center justify-between border-b border-[#E5E9E7] pb-2.5">
            <span className="text-[#5F6B66] font-medium">Mã hồ sơ:</span>
            <span className="text-[16px] font-bold font-mono text-[#006B3F]">
              {maHoSo}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-[#E5E9E7] pb-2.5">
            <span className="text-[#5F6B66] font-medium">Tên thủ tục:</span>
            <span className="font-semibold text-[#1A2421] text-right">
              {procedureTitle}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-[#E5E9E7] pb-2.5">
            <span className="text-[#5F6B66] font-medium">Ngày nộp:</span>
            <span className="font-medium text-[#1A2421]">{submissionDate}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#5F6B66] font-medium">Trạng thái hồ sơ:</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Đã gửi</span>
            </span>
          </div>
        </div>

        {/* Thông tin lịch hẹn thu nhận sinh trắc (nếu có lịch hẹn) */}
        {appointment && (
          <div className="bg-[#EFF6FF]/60 border border-[#BFDBFE] rounded-xl p-4 sm:p-5 space-y-3.5 text-[13px]">
            <div className="flex items-center justify-between border-b border-[#BFDBFE]/60 pb-2.5">
              <span className="text-[12px] font-semibold text-[#1D4ED8] uppercase tracking-wide">
                Lịch hẹn thu nhận sinh trắc kèm theo
              </span>
              <span className="font-mono font-bold text-[#1D4ED8] text-[15px]">
                {appointment.id}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 leading-relaxed">
              <div className="flex items-start gap-2 sm:col-span-2">
                <MapPin className="w-4 h-4 text-[#1D4ED8] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#5F6B66] text-[12px] block">Cơ quan tiếp nhận:</span>
                  <span className="font-semibold text-[#1A2421]">{appointment.coQuan}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-[#1D4ED8] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#5F6B66] text-[12px] block">Ngày hẹn:</span>
                  <span className="font-bold text-[#1A2421]">
                    {formatDateVN(appointment.ngay)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#1D4ED8] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#5F6B66] text-[12px] block">Khung giờ:</span>
                  <span className="font-bold text-[#1D4ED8]">
                    {appointment.khungGio || 'Theo thông báo'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#1D4ED8] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#5F6B66] text-[12px] block">Số điện thoại liên hệ:</span>
                  <span className="font-medium text-[#1A2421]">{appointment.sdt}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-[#1D4ED8] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#5F6B66] text-[12px] block">Trạng thái lịch hẹn:</span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[12px] font-semibold bg-white text-[#1D4ED8] border border-[#BFDBFE]">
                    {appointment.trangThai}
                  </span>
                </div>
              </div>
            </div>

            {/* Lưu ý quan trọng */}
            <div className="bg-[#FFF8E7] border border-[#F4E29D] rounded-lg p-3 text-[12.5px] text-[#B26A00] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#B26A00]" />
              <div className="leading-snug">
                <strong>Lưu ý:</strong> Vui lòng mang theo CCCD/CMND và sổ hộ khẩu khi đến
                thu nhận sinh trắc.
              </div>
            </div>
          </div>
        )}

        {/* Các nút bấm điều hướng */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onNavigateHome}
            icon={<Home className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Về trang chủ
          </Button>

          {onNavigateNewSubmission && (
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onNavigateNewSubmission}
              icon={<FilePlus className="w-4 h-4" />}
              className="w-full sm:w-auto text-[#006B3F] hover:bg-[#E8F3EE] border-[#006B3F]/30"
            >
              Nộp hồ sơ khác
            </Button>
          )}

          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onNavigateMyApplications}
            icon={<FolderOpen className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Xem hồ sơ của tôi
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onNavigateMyAppointments}
            icon={<Calendar className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Xem lịch hẹn của tôi
          </Button>
        </div>
      </div>
    </div>
  );
};
