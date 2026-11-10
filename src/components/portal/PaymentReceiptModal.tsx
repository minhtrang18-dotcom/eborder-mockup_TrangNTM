import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck } from 'lucide-react';
import { StoredApplication } from '../../utils/submissionStorage';

interface PaymentReceiptModalProps {
  application: StoredApplication | null;
  onClose: () => void;
}

// Chuyển đổi số tiền thành chữ tiếng Việt chuẩn hóa cho các mức lệ phí thông hành
function formatAmountToWords(amount?: number): string {
  if (!amount) return 'Không đồng';
  if (amount === 200000) return 'Hai trăm nghìn đồng chẵn';
  if (amount === 100000) return 'Một trăm nghìn đồng chẵn';
  if (amount === 50000) return 'Năm mươi nghìn đồng chẵn';
  return `${amount.toLocaleString('vi-VN')} đồng`;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  application,
  onClose,
}) => {
  if (!application) return null;

  const handlePrint = () => {
    window.print();
  };

  const amount = application.paymentAmount || 0;
  const amountStr = amount.toLocaleString('vi-VN') + ' VNĐ';
  const amountWords = formatAmountToWords(amount);
  const txnId = application.paymentTxnId || 'FL' + Math.floor(10000000 + Math.random() * 90000000);
  const paidTime = application.paidAt || application.ngayGui || 'Hôm nay';
  const agency =
    application.paymentAgency ||
    (application.phongXNC
      ? `Phòng Xuất nhập cảnh – Công an tỉnh ${application.phongXNC}`
      : 'Cơ quan Quản lý xuất nhập cảnh');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header toolbar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-base">Biên lai thu lệ phí điện tử</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              In biên lai
            </button>
            <button
              onClick={onClose}
              type="button"
              aria-label="Đóng"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Receipt Content - Printable Area */}
        <div className="p-8 bg-white print:p-0 text-slate-800 font-sans">
          {/* Quốc hiệu & Tiêu ngữ */}
          <div className="text-center pb-5 border-b border-dashed border-slate-300">
            <div className="text-xs uppercase tracking-widest font-semibold text-slate-600">
              CỘNG HÒA DÂN CHỦ NHÂN DÂN LÀO
            </div>
            <div className="text-xs italic text-slate-500">
              Hòa bình - Độc lập - Dân chủ - Thống nhất - Thịnh vượng
            </div>
            <div className="w-24 h-0.5 bg-slate-400 mx-auto my-2" />
            <h2 className="text-xl font-bold uppercase tracking-wide text-slate-900 mt-2">
              BIÊN LAI THU TIỀN PHÍ, LỆ PHÍ ĐIỆN TỬ
            </h2>
            <div className="text-xs text-slate-500 mt-1">
              (Bản thể hiện của hóa đơn/biên lai điện tử Cổng Dịch vụ công)
            </div>
          </div>

          {/* Body details */}
          <div className="mt-6 space-y-3.5 text-sm">
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500">Mã hồ sơ:</span>
              <span className="font-mono font-bold text-slate-900 text-base">
                {application.maHoSo}
              </span>
            </div>

            <div className="flex justify-between items-start py-1 border-b border-slate-100">
              <span className="text-slate-500 min-w-32">Thủ tục hành chính:</span>
              <span className="font-semibold text-slate-800 text-right">
                {application.loaiThuTuc ||
                  (application.thuTuc === 'tam-thoi'
                    ? 'Cấp giấy thông hành tạm thời'
                    : 'Cấp sổ thông hành')}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500">Người nộp lệ phí:</span>
              <span className="font-semibold text-slate-900 uppercase">
                {application.hoTenNguoiNop || 'Công dân'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500">Số định danh / CCCD:</span>
              <span className="font-mono text-slate-700">
                {application.cccd || application.taiKhoan || '—'}
              </span>
            </div>

            <div className="flex justify-between items-start py-1 border-b border-slate-100">
              <span className="text-slate-500 min-w-32">Đơn vị thu tiền:</span>
              <span className="font-medium text-slate-800 text-right">{agency}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500">Cổng thanh toán trung gian:</span>
              <span className="font-medium text-slate-700">Cổng thanh toán Finlink (DVC Quốc gia)</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500">Hình thức thanh toán:</span>
              <span className="font-medium text-slate-800">
                {application.paymentMethod || 'Cổng thanh toán Finlink'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500">Mã giao dịch (TxnID):</span>
              <span className="font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                {txnId}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500">Thời gian thanh toán:</span>
              <span className="text-slate-700 font-medium">{paidTime}</span>
            </div>

            {/* Số tiền highlight */}
            <div className="mt-4 p-4 rounded-xl bg-amber-50/70 border border-amber-200">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-amber-900 text-sm">Số tiền thanh toán:</span>
                <span className="text-2xl font-black text-amber-700 font-mono tracking-tight">
                  {amountStr}
                </span>
              </div>
              <div className="mt-1 text-xs text-amber-800 italic">
                (Bằng chữ: <span className="font-medium">{amountWords}</span>)
              </div>
            </div>
          </div>

          {/* Dấu điện tử xác thực */}
          <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-xs text-slate-400 space-y-1 text-center sm:text-left">
              <div>* Biên lai điện tử có giá trị pháp lý theo quy định hiện hành.</div>
              <div>* Mã tra cứu xác thực hóa đơn trực tuyến: {txnId}</div>
            </div>

            {/* Electronic Stamp */}
            <div className="relative inline-flex flex-col items-center justify-center p-3 px-5 rounded-lg border-2 border-emerald-600 bg-emerald-50/60 text-emerald-800 shadow-sm rotate-[-2deg]">
              <div className="flex items-center gap-1 font-bold text-xs uppercase tracking-wider">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Cổng Dịch Vụ Công
              </div>
              <div className="text-lg font-black tracking-widest text-emerald-700 my-0.5">
                ĐÃ THANH TOÁN
              </div>
              <div className="text-[10px] text-emerald-700/80 font-mono">
                Xác thực điện tử: {paidTime}
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            In biên lai
          </button>
        </div>
      </div>
    </div>
  );
};
