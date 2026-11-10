import React from 'react';
import { User, X } from 'lucide-react';
import { EbSession, findAccountByIdNumber } from '../../utils/ebAuthStorage';

interface AccountInfoModalProps {
  session: EbSession;
  onClose: () => void;
}

export const AccountInfoModal: React.FC<AccountInfoModalProps> = ({ session, onClose }) => {
  const account = findAccountByIdNumber(session.idNumber);

  const getInitial = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    const last = parts[parts.length - 1];
    return last.charAt(0).toUpperCase();
  };

  const maskPhone = (raw?: string) => {
    if (!raw) return '—';
    const clean = raw.trim();
    if (clean.length < 7) return clean;
    return `${clean.slice(0, 3)} ***** ${clean.slice(-3)}`;
  };

  const maskEmail = (raw?: string) => {
    if (!raw) return '—';
    const clean = raw.trim();
    const [name, domain] = clean.split('@');
    if (!domain) return clean;
    const maskedName = name.length <= 2 ? `${name}*` : `${name.slice(0, 2)}***`;
    return `${maskedName}@${domain}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px] animate-fadeIn">
      <div
        className="bg-white border border-[#D9DFDC] rounded-[16px] w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header modal */}
        <div className="px-6 py-4 border-b border-[#D9DFDC] flex items-center justify-between bg-[#F5F7F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E8F3EE] text-[#006B3F] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <h3 className="text-[16px] font-bold text-[#1A2421]">Thông tin tài khoản</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#5F6B66] hover:text-[#1A2421] hover:bg-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nội dung chỉ đọc */}
        <div className="p-6 space-y-4 text-[13px] text-[#1A2421]">
          <div className="flex items-center gap-4 p-4 bg-[#E8F3EE]/40 border border-[#D9DFDC] rounded-xl">
            <div className="w-14 h-14 rounded-full bg-[#006B3F] text-white flex items-center justify-center font-bold text-[20px] shadow-sm shrink-0">
              {getInitial(session.fullName)}
            </div>
            <div>
              <h4 className="text-[16px] font-bold text-[#1A2421]">{session.fullName}</h4>
              <p className="text-[12px] text-[#5F6B66]">Công dân CHDCND Lào</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#E8F3EE] text-[#006B3F]">
                Đã xác thực danh tính
              </span>
            </div>
          </div>

          <div className="space-y-3 divide-y divide-[#D9DFDC]/60 pt-2">
            <div className="flex justify-between py-2">
              <span className="text-[#5F6B66]">Số định danh / Số CMND:</span>
              <span className="font-mono font-bold text-[#006B3F]">{session.idNumber}</span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-[#5F6B66]">Ngày, tháng, năm sinh:</span>
              <span className="font-medium text-[#1A2421]">
                {account?.dob || account?.dateOfBirth || session?.dob || session?.dateOfBirth
                  ? (() => {
                      const d = account?.dob || account?.dateOfBirth || session?.dob || session?.dateOfBirth || '';
                      if (d.includes('-')) {
                        const parts = d.split('-');
                        if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
                      }
                      return d;
                    })()
                  : 'Chưa cập nhật'}
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-[#5F6B66]">Giới tính:</span>
              <span className="font-medium text-[#1A2421]">
                {account?.gender || session?.gender || 'Chưa cập nhật'}
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-[#5F6B66]">Số điện thoại:</span>
              <span className="font-mono font-medium text-[#1A2421]">
                {maskPhone(account?.phone)}
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-[#5F6B66]">Địa chỉ Email:</span>
              <span className="font-medium text-[#1A2421]">
                {maskEmail(account?.email)}
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-[#5F6B66]">Nơi thường trú:</span>
              <span className="font-medium text-[#1A2421] text-right max-w-xs">
                {account?.residence
                  ? typeof account.residence === 'string'
                    ? account.residence
                    : `${account.residence.detail ? account.residence.detail + ', ' : ''}${
                        account.residence.subUnit ? account.residence.subUnit + ', ' : ''
                      }${account.residence.village ? account.residence.village + ', ' : ''}${
                        account.residence.district ? account.residence.district + ', ' : ''
                      }${account.residence.province}`
                  : 'Chưa cập nhật'}
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-[#5F6B66]">Ngày đăng ký tài khoản:</span>
              <span className="font-medium text-[#1A2421]">
                {account?.createdAt
                  ? new Date(account.createdAt).toLocaleDateString('vi-VN')
                  : 'Hôm nay'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer modal */}
        <div className="px-6 py-3 border-t border-[#D9DFDC] bg-[#F5F7F6] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#D9DFDC] text-[#1A2421] hover:bg-[#E8F3EE] rounded-lg text-[13px] font-medium transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
