import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  AlertTriangle,
  QrCode,
  Printer,
  ShieldCheck,
  User,
  Car,
  MapPin,
  Calendar,
  XCircle,
} from 'lucide-react';
import { BorderPassApplication } from '../../types/borderPass';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';

interface ApplicationDetailModalProps {
  application: BorderPassApplication | null;
  onClose: () => void;
  onApprove: (id: string, note?: string) => void;
  onReject: (id: string, reason: string) => void;
  onRequestMoreInfo: (id: string) => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  onClose,
  onApprove,
  onReject,
  onRequestMoreInfo,
}) => {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px] animate-fadeIn">
      <div
        className="bg-[#FFFFFF] border border-[#D9E1DC] rounded-lg w-full max-w-4xl max-h-[92vh] flex flex-col shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#D9E1DC] flex items-center justify-between bg-[#FFFFFF]">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded bg-[#E8F3EE] text-[#006B3F]">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-[18px] font-bold text-[#1F2937]">
                  Thẩm định hồ sơ thông hành #{application.id}
                </h3>
                <StatusBadge status={application.status} />
              </div>
              <p className="text-[12px] text-[#6B7280] mt-0.5">
                Nộp lúc {application.submissionDate} · Đăng ký tại {application.checkpoint}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F5F7F6] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 bg-[#FFFFFF]">
          {/* Blacklist / Alert Notification Banner */}
          {application.isBlacklistFlag && (
            <div className="p-4 rounded border border-[#FCA5A5] bg-[#FEECEC] text-[#D71920] flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-[14px]">
                  CẢNH BÁO AN NINH TRỌNG ĐIỂM: Đối tượng nằm trong danh sách Blacklist
                </strong>
                <p className="text-[13px] mt-0.5 text-[#1F2937]">
                  Cơ quan phối hợp phát hiện trùng khớp dữ liệu cảnh báo từ chối xuất nhập cảnh số
                  098/TB-BTLBP. Tuyệt đối không phê duyệt khi chưa có lệnh chỉ huy.
                </p>
              </div>
            </div>
          )}

          {/* Section 1: Thông tin nhân thân */}
          <div>
            <h4 className="text-[16px] font-semibold text-[#1F2937] pb-2 border-b border-[#D9E1DC] flex items-center gap-2">
              <User className="w-4 h-4 text-[#006B3F]" />
              1. Thông tin nhân thân & Xác thực Căn cước
            </h4>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Ảnh thẻ & QR Thẻ */}
              <div className="md:col-span-3 flex flex-col items-center text-center p-3 bg-[#F5F7F6] border border-[#D9E1DC] rounded">
                <img
                  src={application.avatarUrl}
                  alt={application.applicantName}
                  className="w-28 h-36 object-cover rounded border border-[#D9E1DC] shadow-xs"
                />
                <span className="text-[12px] text-[#6B7280] mt-2">Ảnh thẻ chuẩn ICAO 3x4</span>

                {application.status === 'APPROVED' && (
                  <div className="mt-3 pt-3 border-t border-[#D9E1DC] w-full flex flex-col items-center">
                    <div className="p-2 bg-white border border-[#D9E1DC] rounded">
                      <QrCode className="w-16 h-16 text-[#006B3F]" />
                    </div>
                    <span className="text-[11px] font-mono text-[#006B3F] font-semibold mt-1">
                      {application.qrCodeToken}
                    </span>
                    <span className="text-[10px] text-[#6B7280]">Mã QR quét tại e-Gate</span>
                  </div>
                )}
              </div>

              {/* Thông tin chi tiết */}
              <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
                <div>
                  <label className="text-[13px] font-medium text-[#6B7280] block">
                    Họ và tên đương đơn
                  </label>
                  <p className="font-semibold text-[#1F2937] text-[15px] mt-0.5">
                    {application.applicantName}
                  </p>
                </div>

                <div>
                  <label className="text-[13px] font-medium text-[#6B7280] block">
                    Số Căn cước / Hộ chiếu
                  </label>
                  <p className="font-mono font-medium text-[#1F2937] text-[15px] mt-0.5">
                    {application.nationalId}
                  </p>
                </div>

                <div>
                  <label className="text-[13px] font-medium text-[#6B7280] block">
                    Ngày tháng năm sinh & Giới tính
                  </label>
                  <p className="text-[#1F2937] mt-0.5">
                    {application.dob} · Giới tính: {application.gender}
                  </p>
                </div>

                <div>
                  <label className="text-[13px] font-medium text-[#6B7280] block">
                    Số điện thoại liên lạc
                  </label>
                  <p className="font-mono text-[#1F2937] mt-0.5">{application.phoneNumber}</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[13px] font-medium text-[#6B7280] block">
                    Nơi cư trú thường trú tại khu vực biên giới
                  </label>
                  <p className="text-[#1F2937] mt-0.5">{application.residenceAddress}</p>
                </div>

                <div className="sm:col-span-2 p-3 bg-[#E8F3EE] rounded border border-[#D9E1DC] flex items-center justify-between text-[13px]">
                  <span className="text-[#006B3F] font-medium flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#008A4B]" />
                    Xác thực Cơ sở dữ liệu Quốc gia về Dân cư (VNeID mức 2)
                  </span>
                  <span className="text-[#008A4B] font-semibold text-xs">TRÙNG KHỚP 100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Thông tin Giấy phép & Phương tiện */}
          <div>
            <h4 className="text-[16px] font-semibold text-[#1F2937] pb-2 border-b border-[#D9E1DC] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#006B3F]" />
              2. Đăng ký Cửa khẩu & Phương tiện lưu thông
            </h4>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-[14px]">
              <div className="p-3 bg-[#F5F7F6] rounded border border-[#D9E1DC]">
                <label className="text-[12px] font-medium text-[#6B7280] block">
                  Cửa khẩu đăng ký qua lại
                </label>
                <div className="font-semibold text-[#1F2937] mt-1">{application.checkpoint}</div>
              </div>

              <div className="p-3 bg-[#F5F7F6] rounded border border-[#D9E1DC]">
                <label className="text-[12px] font-medium text-[#6B7280] block">
                  Diện đề nghị cấp phép
                </label>
                <div className="font-semibold text-[#1F2937] mt-1">
                  {application.passType === 'THUONG_TRU' && 'Cư dân biên giới (Thường trú)'}
                  {application.passType === 'KINH_DOANH' && 'Thương nhân tiểu ngạch'}
                  {application.passType === 'VAN_TAI' && 'Lái xe vận tải liên vận'}
                  {application.passType === 'THAM_THAN' && 'Thăm thân nhân / Việc riêng'}
                </div>
              </div>

              <div className="p-3 bg-[#F5F7F6] rounded border border-[#D9E1DC]">
                <label className="text-[12px] font-medium text-[#6B7280] block">
                  Phương tiện đăng ký kèm theo
                </label>
                <div className="font-semibold text-[#1F2937] mt-1 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-[#6B7280]" />
                  {application.vehiclePlate ? (
                    <span className="font-mono text-[#006B3F]">{application.vehiclePlate}</span>
                  ) : (
                    <span>Không có phương tiện (Đi bộ)</span>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3 p-3 bg-[#FFFFFF] border border-[#D9E1DC] rounded">
                <label className="text-[13px] font-medium text-[#1F2937] block">
                  Ghi chú thẩm định của cán bộ thụ lý:
                </label>
                <p className="text-[13px] text-[#6B7280] mt-1 italic">
                  "{application.statusNote}"
                </p>
                <div className="mt-2 text-[12px] text-[#6B7280]">
                  Cán bộ chịu trách nhiệm: <strong>{application.officerInCharge}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Form từ chối nếu bật */}
          {showRejectForm && (
            <div className="p-4 bg-[#FEECEC] border border-[#FCA5A5] rounded space-y-2">
              <label className="text-[13px] font-semibold text-[#D71920] block">
                Nhập lý do từ chối cấp giấy phép thông hành:
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Nhập căn cứ pháp lý hoặc lý do cụ thể (VD: Giấy tờ hết hạn, vi phạm quy chế khu vực biên giới...)"
                rows={3}
                className="w-full text-[13px] text-[#1F2937] placeholder:text-[#6B7280] bg-white border border-[#FCA5A5] rounded p-2.5 outline-none focus:ring-1 focus:ring-[#D71920]"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRejectForm(false)}
                >
                  Hủy bỏ
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={!rejectReason.trim()}
                  onClick={() => {
                    onReject(application.id, rejectReason);
                    setShowRejectForm(false);
                  }}
                  icon={<XCircle className="w-4 h-4" />}
                >
                  Xác nhận Từ chối hồ sơ
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Standard Buttons */}
        <div className="px-6 py-4 border-t border-[#D9E1DC] bg-[#F5F7F6] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="md"
              onClick={onClose}
            >
              Đóng cửa sổ
            </Button>
            {application.status === 'APPROVED' && (
              <Button
                variant="secondary"
                size="md"
                icon={<Printer className="w-4 h-4" />}
                onClick={() => window.print()}
              >
                In Giấy Phép Thông Hành
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {application.status !== 'REJECTED' && !showRejectForm && (
              <Button
                variant="danger"
                size="md"
                onClick={() => setShowRejectForm(true)}
                icon={<XCircle className="w-4 h-4" />}
              >
                Từ chối cấp phép
              </Button>
            )}

            {application.status === 'PENDING' && (
              <Button
                variant="secondary"
                size="md"
                onClick={() => onRequestMoreInfo(application.id)}
              >
                Yêu cầu bổ sung tài liệu
              </Button>
            )}

            {application.status !== 'APPROVED' && (
              <Button
                variant="primary"
                size="md"
                onClick={() => onApprove(application.id)}
                icon={<CheckCircle className="w-4 h-4" />}
              >
                Phê duyệt & Xuất mã e-Pass
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
