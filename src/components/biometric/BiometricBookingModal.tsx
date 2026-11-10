import React, { useState, useEffect, useRef } from 'react';
import {
  BiometricAppointment,
  TIME_SLOTS,
  formatDateVN,
  formatDateToYMD,
  getTomorrowDate,
  getMaxBookingDate,
  validateAppointmentDate,
} from '../../utils/biometricStorage';
import { Button } from '../ui/Button';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
  Info,
} from 'lucide-react';

export interface BookingModalResult {
  isExisting: boolean;
  appointmentId?: string;
  agency: string;
  date: string;
  timeSlot: string;
  phone: string;
  notes?: string;
}

interface BiometricBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  procedureTitle?: string;
  receivingAgency: string;
  validityStartDate?: string;
  userPhone?: string;
  existingAppointment?: BiometricAppointment | null;
  // Reschedule mode for "Lịch hẹn của tôi"
  isRescheduleOnly?: boolean;
  appointmentToReschedule?: BiometricAppointment | null;
  modalTitle?: string;
  confirmButtonText?: string;
  onConfirm: (result: BookingModalResult) => void;
}

export const BiometricBookingModal: React.FC<BiometricBookingModalProps> = ({
  isOpen,
  onClose,
  receivingAgency,
  validityStartDate,
  userPhone = '',
  existingAppointment,
  isRescheduleOnly = false,
  appointmentToReschedule,
  modalTitle,
  confirmButtonText,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const minDateStr = formatDateToYMD(getTomorrowDate());
  const maxDateStr = formatDateToYMD(getMaxBookingDate());

  // Effective max date considering validityStartDate for tam-thoi
  const effectiveMaxDateStr =
    validityStartDate && validityStartDate < maxDateStr ? validityStartDate : maxDateStr;

  // Local form state
  const [appointmentDate, setAppointmentDate] = useState<string>(
    appointmentToReschedule?.ngay || ''
  );
  const [timeSlot, setTimeSlot] = useState<string>(
    appointmentToReschedule?.khungGio || ''
  );
  const [phoneNumber, setPhoneNumber] = useState<string>(
    appointmentToReschedule?.sdt || userPhone || ''
  );
  const [notes, setNotes] = useState<string>(
    appointmentToReschedule?.ghiChu || ''
  );

  // Field errors
  const [errors, setErrors] = useState<{
    date?: string;
    timeSlot?: string;
    phone?: string;
  }>({});

  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const timeSlotRef = useRef<HTMLSelectElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);

  // Sync state when modal opens or initial values change
  useEffect(() => {
    if (appointmentToReschedule) {
      setAppointmentDate(appointmentToReschedule.ngay);
      setTimeSlot(appointmentToReschedule.khungGio || '');
      setPhoneNumber(appointmentToReschedule.sdt || userPhone || '');
      setNotes(appointmentToReschedule.ghiChu || '');
    } else {
      setAppointmentDate('');
      setTimeSlot('');
      setPhoneNumber(userPhone || '');
      setNotes('');
    }
    setErrors({});
  }, [appointmentToReschedule, userPhone, isOpen]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: { date?: string; timeSlot?: string; phone?: string } = {};

    // 1. Ngày hẹn
    const dateCheck = validateAppointmentDate(appointmentDate, validityStartDate);
    if (!dateCheck.valid && dateCheck.error) {
      newErrors.date = dateCheck.error;
    }

    // 2. Khung giờ
    if (!timeSlot.trim()) {
      newErrors.timeSlot = 'Vui lòng chọn khung giờ';
    }

    // 3. Số điện thoại
    const cleanPhone = phoneNumber.trim().replace(/\s+/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Vui lòng nhập số điện thoại liên hệ';
    } else if (!/^\d{10}$/.test(cleanPhone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.date && dateInputRef.current) {
        dateInputRef.current.focus();
      } else if (newErrors.timeSlot && timeSlotRef.current) {
        timeSlotRef.current.focus();
      } else if (newErrors.phone && phoneRef.current) {
        phoneRef.current.focus();
      }
      return false;
    }

    return true;
  };

  // Submit handler
  const handleConfirm = () => {
    // If citizen already has an active appointment and we're linking it to the application:
    if (existingAppointment && !isRescheduleOnly) {
      onConfirm({
        isExisting: true,
        appointmentId: existingAppointment.id,
        agency: existingAppointment.coQuan,
        date: existingAppointment.ngay,
        timeSlot: existingAppointment.khungGio || '',
        phone: existingAppointment.sdt,
        notes: existingAppointment.ghiChu,
      });
      return;
    }

    // Validate manual inputs
    if (!validateForm()) return;

    onConfirm({
      isExisting: false,
      appointmentId: appointmentToReschedule?.id,
      agency: receivingAgency,
      date: appointmentDate,
      timeSlot,
      phone: phoneNumber.trim().replace(/\s+/g, ''),
      notes: notes.trim() || undefined,
    });
  };

  const hasExistingAppointment = !!existingAppointment && !isRescheduleOnly;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#D9DFDC] space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E9E7] pb-3">
          <div className="flex items-center gap-2 text-[#1A2421]">
            <Calendar className="w-5 h-5 text-[#006B3F]" />
            <h3 className="text-[17px] font-bold">
              {modalTitle || 'Chọn ngày hẹn thu nhận sinh trắc'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Banner */}
        {hasExistingAppointment ? (
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] p-3.5 rounded-xl text-[13px] flex items-start gap-2.5">
            <Info className="w-5 h-5 shrink-0 mt-0.5 text-[#1D4ED8]" />
            <div className="leading-relaxed">
              Bạn đang có lịch hẹn thu nhận sinh trắc còn hiệu lực tại{' '}
              <strong>{existingAppointment.coQuan}</strong>. Hồ sơ của bạn sẽ được gửi
              kèm với lịch hẹn đã có này.
            </div>
          </div>
        ) : (
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] p-3.5 rounded-xl text-[13px] flex items-start gap-2.5">
            <Info className="w-5 h-5 shrink-0 mt-0.5 text-[#1D4ED8]" />
            <div className="leading-relaxed">
              Bạn chưa có dữ liệu sinh trắc. Vui lòng chọn ngày hẹn đến {receivingAgency} để thu nhận sinh trắc. Hồ sơ sẽ được gửi kèm lịch hẹn của bạn.
            </div>
          </div>
        )}

        {/* Content Body */}
        {hasExistingAppointment ? (
          /* Nhánh hiển thị thẻ lịch hẹn đã có của công dân */
          <div className="bg-[#F9FAFB] border border-[#D9DFDC] rounded-xl p-4 space-y-3 text-[13px]">
            <div className="flex items-center justify-between border-b border-[#E5E9E7] pb-2">
              <span className="text-[12px] font-semibold text-[#5F6B66] uppercase">
                Lịch hẹn hiện tại
              </span>
              <span className="font-mono font-bold text-[#006B3F] text-[14px]">
                {existingAppointment.id}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#006B3F] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[12px] text-[#5F6B66] block">Cơ quan tiếp nhận:</span>
                  <span className="font-semibold text-[#1A2421]">
                    {existingAppointment.coQuan}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-[#006B3F] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[12px] text-[#5F6B66] block">Ngày hẹn:</span>
                    <span className="font-semibold text-[#1A2421]">
                      {formatDateVN(existingAppointment.ngay)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[#006B3F] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[12px] text-[#5F6B66] block">Khung giờ:</span>
                    <span className="font-semibold text-[#006B3F]">
                      {existingAppointment.khungGio || 'Chưa chọn'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <Phone className="w-4 h-4 text-[#006B3F] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[12px] text-[#5F6B66] block">Số điện thoại liên hệ:</span>
                  <span className="font-medium text-[#1A2421]">{existingAppointment.sdt}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E5E9E7] flex items-center justify-between">
                <span className="text-[12px] text-[#5F6B66]">Trạng thái:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-[#E8F3EE] text-[#006B3F] border border-[#A5D6A7]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{existingAppointment.trangThai}</span>
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Nhánh nhập liệu đặt lịch hẹn mới hoặc đổi lịch */
          <div className="space-y-4 text-[13px]">
            {/* 1. Cơ quan tiếp nhận (chỉ đọc) */}
            <div className="space-y-1">
              <label className="font-semibold text-[#1A2421] block">
                Cơ quan tiếp nhận
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  disabled
                  value={receivingAgency}
                  className="w-full h-[40px] px-3 bg-[#F3F4F6] text-[#4B5563] border border-[#D9DFDC] rounded-lg font-medium cursor-not-allowed select-none"
                />
                <MapPin className="w-4 h-4 text-[#9CA3AF] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p className="text-[11px] text-[#5F6B66] italic">
                * Được xác định tự động theo thông tin cơ quan tiếp nhận của hồ sơ
              </p>
            </div>

            {/* 2. Ngày hẹn */}
            <div className="space-y-1">
              <label className="font-semibold text-[#1A2421] block">
                Ngày hẹn <span className="text-red-500">*</span>
              </label>
              <input
                ref={dateInputRef}
                type="date"
                min={minDateStr}
                max={effectiveMaxDateStr}
                value={appointmentDate}
                onChange={(e) => {
                  setAppointmentDate(e.target.value);
                  if (errors.date) {
                    setErrors((prev) => ({ ...prev, date: undefined }));
                  }
                  // Reset khung giờ nếu đổi ngày
                  setTimeSlot('');
                }}
                className={`w-full h-[40px] px-3 bg-white text-[#1A2421] border rounded-lg outline-none transition-colors ${
                  errors.date
                    ? 'border-red-500 bg-red-50/30 focus:border-red-500'
                    : 'border-[#D9DFDC] focus:border-[#006B3F]'
                }`}
              />
              {errors.date && (
                <p className="text-[12px] text-red-600 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.date}</span>
                </p>
              )}
              <p className="text-[11px] text-[#5F6B66]">
                Chỉ được chọn từ ngày mai đến 30 ngày sau, không tính Thứ Bảy và Chủ Nhật.
              </p>
            </div>

            {/* 3. Khung giờ */}
            <div className="space-y-1">
              <label className="font-semibold text-[#1A2421] block">
                Khung giờ <span className="text-red-500">*</span>
              </label>
              <select
                ref={timeSlotRef}
                disabled={!appointmentDate}
                value={timeSlot}
                onChange={(e) => {
                  setTimeSlot(e.target.value);
                  if (errors.timeSlot) {
                    setErrors((prev) => ({ ...prev, timeSlot: undefined }));
                  }
                }}
                className={`w-full h-[40px] px-3 bg-white text-[#1A2421] border rounded-lg outline-none transition-colors ${
                  !appointmentDate
                    ? 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed border-[#D9DFDC]'
                    : errors.timeSlot
                    ? 'border-red-500 bg-red-50/30 focus:border-red-500'
                    : 'border-[#D9DFDC] focus:border-[#006B3F]'
                }`}
              >
                <option value="">
                  {appointmentDate ? '-- Chọn khung giờ --' : '-- Vui lòng chọn ngày hẹn trước --'}
                </option>
                {appointmentDate &&
                  TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
              </select>
              {errors.timeSlot && (
                <p className="text-[12px] text-red-600 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.timeSlot}</span>
                </p>
              )}
            </div>

            {/* 4. Số điện thoại liên hệ */}
            <div className="space-y-1">
              <label className="font-semibold text-[#1A2421] block">
                Số điện thoại liên hệ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  ref={phoneRef}
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (errors.phone) {
                      setErrors((prev) => ({ ...prev, phone: undefined }));
                    }
                  }}
                  placeholder="Ví dụ: 0205566778"
                  className={`w-full h-[40px] px-3 bg-white text-[#1A2421] border rounded-lg outline-none transition-colors ${
                    errors.phone
                      ? 'border-red-500 bg-red-50/30 focus:border-red-500'
                      : 'border-[#D9DFDC] focus:border-[#006B3F]'
                  }`}
                />
                <Phone className="w-4 h-4 text-[#9CA3AF] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.phone && (
                <p className="text-[12px] text-red-600 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            {/* 5. Ghi chú */}
            <div className="space-y-1">
              <label className="font-semibold text-[#1A2421] block">
                Ghi chú <span className="text-[#5F6B66] font-normal">(tối đa 255 ký tự)</span>
              </label>
              <textarea
                rows={2}
                maxLength={255}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt nếu có..."
                className="w-full p-2.5 bg-white text-[#1A2421] border border-[#D9DFDC] rounded-lg outline-none focus:border-[#006B3F] text-[13px] resize-none"
              />
              <div className="text-[11px] text-[#5F6B66] text-right">
                {notes.length}/255 ký tự
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[#E5E9E7] flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
          >
            Quay lại
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleConfirm}
          >
            {confirmButtonText || 'Xác nhận và nộp hồ sơ'}
          </Button>
        </div>
      </div>
    </div>
  );
};
