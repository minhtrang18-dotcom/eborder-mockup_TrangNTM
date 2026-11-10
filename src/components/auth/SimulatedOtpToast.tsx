import React, { useEffect, useState } from 'react';
import { MessageSquare, Mail, X, Info } from 'lucide-react';

export interface SimulatedOtpNotification {
  id: string;
  channel: 'sms' | 'email';
  recipient: string; // Đã che hoặc chưa che
  code: string;
}

interface SimulatedOtpToastProps {
  notification: SimulatedOtpNotification | null;
  onClose: () => void;
}

export const SimulatedOtpToast: React.FC<SimulatedOtpToastProps> = ({
  notification,
  onClose,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 15000); // Tự ẩn sau 15 giây
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [notification, onClose]);

  if (!notification || !visible) return null;

  const isSms = notification.channel === 'sms';

  return (
    <div className="fixed top-5 right-5 z-[9999] max-w-sm w-full animate-slideInRight select-none">
      <div className="bg-white border-2 border-[#006B3F] rounded-xl shadow-2xl p-4 text-[#1A2421] relative overflow-hidden ring-4 ring-[#006B3F]/10">
        {/* Dải màu nhận diện trên cùng */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#006B3F]" />

        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E8F3EE] flex items-center justify-center text-[#006B3F] shrink-0">
              {isSms ? (
                <MessageSquare className="w-4 h-4 text-[#006B3F]" />
              ) : (
                <Mail className="w-4 h-4 text-[#006B3F]" />
              )}
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-[#1A2421] leading-tight">
                {isSms ? 'Tin nhắn SMS · e-Border Pass' : 'Email · noreply@eborderpass.gov.la'}
              </h4>
              <p className="text-[11px] text-[#5F6B66]">Gửi tới: {notification.recipient}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setVisible(false);
              onClose();
            }}
            className="text-[#5F6B66] hover:text-[#1A2421] p-1 rounded-md hover:bg-[#F5F7F6] transition-colors"
            title="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nội dung tin nhắn giả lập */}
        <div className="mt-3 p-3 bg-[#F5F7F6] rounded-lg border border-[#D9DFDC]">
          <p className="text-[13px] text-[#1A2421] leading-relaxed">
            Mã xác thực của bạn là{' '}
            <strong className="text-[18px] font-mono tracking-widest text-[#006B3F] bg-[#E8F3EE] px-2 py-0.5 rounded font-extrabold inline-block mx-1">
              {notification.code}
            </strong>
            . Có hiệu lực 5 phút. Không chia sẻ mã này cho bất kỳ ai.
          </p>
        </div>

        {/* Nhãn nhỏ chế độ demo */}
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#B26A00] bg-[#FFF8E7] px-2.5 py-1 rounded">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span className="font-medium">Chế độ demo: tin nhắn được mô phỏng trên màn hình</span>
        </div>
      </div>
    </div>
  );
};
