import React, { useState } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { clearAllDemoData } from '../../utils/ebAuthStorage';

interface AuthAppFooterProps {
  onDataReset: () => void;
}

export const AuthAppFooter: React.FC<AuthAppFooterProps> = ({ onDataReset }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleConfirmReset = () => {
    clearAllDemoData();
    setShowConfirmModal(false);
    onDataReset();
  };

  return (
    <footer className="mt-auto border-t border-[#D9DFDC] bg-white py-4 px-4 sm:px-6 select-none">
      <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#5F6B66]">
        {/* Bản quyền */}
        <div>
          © 2026 Cổng Dịch vụ công e-Border Pass. Cục Quản lý Xuất nhập cảnh CHDCND Lào.
        </div>

        {/* Nút Xóa dữ liệu demo */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#C62828] hover:text-[#9B1116] hover:underline cursor-pointer bg-[#FFF5F5] px-2.5 py-1 rounded-md border border-[#FCA5A5]/60 transition-colors"
            title="Xóa toàn bộ tài khoản và phiên đăng nhập lưu trong localStorage để thử nghiệm lại"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa dữ liệu demo</span>
          </button>
        </div>
      </div>

      {/* Modal xác nhận xóa dữ liệu demo */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px] animate-fadeIn">
          <div
            className="bg-white border border-[#D9DFDC] rounded-[16px] w-full max-w-md shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFF5F5] text-[#C62828] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="text-[#5F6B66] hover:text-[#1A2421] p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-[16px] font-bold text-[#1A2421]">Xác nhận xóa dữ liệu demo?</h3>
              <p className="text-[13px] text-[#5F6B66] leading-relaxed">
                Hành động này sẽ xóa toàn bộ danh sách tài khoản đã đăng ký (khóa <code className="bg-[#F5F7F6] px-1 py-0.5 rounded text-[#1A2421]">eb_accounts</code>) và phiên đăng nhập hiện tại (<code className="bg-[#F5F7F6] px-1 py-0.5 rounded text-[#1A2421]">eb_session</code>) trong trình duyệt của bạn.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-[#D9DFDC] text-[#1A2421] hover:bg-[#F5F7F6] rounded-lg text-[13px] font-medium transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2 bg-[#C62828] hover:bg-[#9B1116] text-white rounded-lg text-[13px] font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
