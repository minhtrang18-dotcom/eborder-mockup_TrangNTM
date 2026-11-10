import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CreditCard,
  QrCode,
  Wallet,
  Globe,
  Building2,
  FileText,
  User,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
} from 'lucide-react';
import {
  StoredApplication,
  getStoredApplicationByCode,
  updateApplicationPaymentStatus,
  logAuditAction,
  generateFinlinkTxnId,
  formatCurrentDateTimeVN,
  getStandardProcedureFee,
} from '../../utils/submissionStorage';
import { addCitizenNotification } from '../../utils/notificationStorage';

interface PaymentViewProps {
  maHoSo: string;
  onBack: () => void;
  onPaymentSuccess?: (app: StoredApplication) => void;
}

const PAYMENT_METHODS = [
  {
    id: 'qr',
    name: 'QR ngân hàng (Finlink VietQR)',
    description: 'Quét mã QR qua ứng dụng ngân hàng hoặc ví điện tử (khuyên dùng)',
    icon: QrCode,
    badge: 'Khuyên dùng',
  },
  {
    id: 'wallet',
    name: 'Ví điện tử (MoMo, ZaloPay, Viettel Money)',
    description: 'Thanh toán trực tiếp qua liên kết ví điện tử phổ biến',
    icon: Wallet,
  },
  {
    id: 'napas',
    name: 'Thẻ nội địa / Tài khoản ngân hàng (ATM / Napas)',
    description: 'Thẻ ATM nội địa của hơn 40 ngân hàng thương mại',
    icon: CreditCard,
  },
  {
    id: 'intl',
    name: 'Thẻ quốc tế (Visa, MasterCard, JCB)',
    description: 'Hỗ trợ thẻ tín dụng / ghi nợ quốc tế phát hành toàn cầu',
    icon: Globe,
  },
];

export const PaymentView: React.FC<PaymentViewProps> = ({
  maHoSo,
  onBack,
  onPaymentSuccess,
}) => {
  const [app, setApp] = useState<StoredApplication | null>(null);
  const [selectedMethodId, setSelectedMethodId] = useState<string>('qr');
  const [showGatewayModal, setShowGatewayModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'error' | 'warning';
    text: string;
  } | null>(null);
  const [pendingDialogMessage, setPendingDialogMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Tải dữ liệu hồ sơ mới nhất
  const reloadApplication = () => {
    const current = getStoredApplicationByCode(maHoSo);
    if (current) {
      setApp(current);
    }
  };

  useEffect(() => {
    reloadApplication();
  }, [maHoSo]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  if (!app) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <p className="text-slate-600 mb-4">Không tìm thấy thông tin hồ sơ {maHoSo}</p>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại Tra cứu hồ sơ
          </button>
        </div>
      </div>
    );
  }

  const feeAmount =
    app.paymentAmount !== undefined && app.paymentAmount !== null
      ? app.paymentAmount
      : getStandardProcedureFee(app.thuTuc);

  const agencyName =
    app.paymentAgency ||
    (app.phongXNC
      ? `Phòng Xuất nhập cảnh – Công an tỉnh ${app.phongXNC}`
      : 'Phòng Quản lý xuất nhập cảnh');

  // Kiểm tra tính hợp lệ trước khi mở cổng
  const handleInitiatePayment = () => {
    // Concurrency check: đọc lại từ storage mới nhất
    const freshApp = getStoredApplicationByCode(maHoSo);
    if (!freshApp) return;

    if (freshApp.paymentStatus === 'Đã thanh toán') {
      setToastMessage({
        type: 'warning',
        text: `Hồ sơ ${maHoSo} đã được thanh toán lệ phí.`,
      });
      setApp(freshApp);
      return;
    }

    if (freshApp.paymentStatus === 'Đang xử lý giao dịch') {
      setPendingDialogMessage(
        'Giao dịch đang được xử lý. Vui lòng không thanh toán lại và kiểm tra lại sau ít phút.'
      );
      setApp(freshApp);
      return;
    }

    setShowGatewayModal(true);
  };

  // Xử lý 3 kịch bản mô phỏng cổng thanh toán Finlink
  const handleGatewayScenario = (scenario: 'success' | 'failed' | 'timeout') => {
    setIsProcessing(true);

    const selectedMethod = PAYMENT_METHODS.find((m) => m.id === selectedMethodId);
    const methodName = selectedMethod ? selectedMethod.name : 'Cổng Finlink';

    setTimeout(() => {
      setIsProcessing(false);
      setShowGatewayModal(false);

      if (scenario === 'success') {
        const txnId = generateFinlinkTxnId();
        const paidAt = formatCurrentDateTimeVN();

        const updated = updateApplicationPaymentStatus(maHoSo, {
          paymentStatus: 'Đã thanh toán',
          paymentAmount: feeAmount,
          paymentMethod: methodName,
          paymentTxnId: txnId,
          paidAt,
          paymentAgency: agencyName,
        });

        // Audit log
        logAuditAction({
          taiKhoan: app.taiKhoan,
          maHoSo,
          hanhDong: 'thanh_toan_thanh_cong',
        });

        // Gửi thông báo đến chuông công dân
        addCitizenNotification({
          taiKhoan: app.taiKhoan,
          tieuDe: 'Thanh toán lệ phí thành công',
          noiDung: `Thanh toán thành công lệ phí hồ sơ ${maHoSo}. Mã giao dịch: ${txnId}.`,
          maHoSo,
          loai: 'payment_success',
          link: '#/tra-cuu-ho-so',
        });

        setToastMessage({
          type: 'success',
          text: `Thanh toán thành công lệ phí hồ sơ ${maHoSo}. Mã giao dịch: ${txnId}`,
        });

        if (updated) {
          setApp(updated);
          if (onPaymentSuccess) {
            onPaymentSuccess(updated);
          }
        }
      } else if (scenario === 'failed') {
        const updated = updateApplicationPaymentStatus(maHoSo, {
          paymentStatus: 'Thanh toán lỗi',
          paymentAmount: feeAmount,
          paymentMethod: methodName,
          paymentAgency: agencyName,
        });

        logAuditAction({
          taiKhoan: app.taiKhoan,
          maHoSo,
          hanhDong: 'thanh_toan_that_bai',
        });

        addCitizenNotification({
          taiKhoan: app.taiKhoan,
          tieuDe: 'Thanh toán lệ phí thất bại',
          noiDung: `Giao dịch thanh toán lệ phí hồ sơ ${maHoSo} không thành công. Quý công dân vui lòng thử lại.`,
          maHoSo,
          loai: 'payment_required',
          link: `#/thanh-toan/${maHoSo}`,
        });

        setToastMessage({
          type: 'error',
          text: 'Thanh toán không thành công. Vui lòng thử lại.',
        });

        if (updated) setApp(updated);
      } else if (scenario === 'timeout') {
        // Mất kết nối / Treo giao dịch
        const updated = updateApplicationPaymentStatus(maHoSo, {
          paymentStatus: 'Đang xử lý giao dịch',
          paymentAmount: feeAmount,
          paymentMethod: methodName,
          paymentAgency: agencyName,
        });

        logAuditAction({
          taiKhoan: app.taiKhoan,
          maHoSo,
          hanhDong: 'thanh_toan_mat_ket_noi',
        });

        setPendingDialogMessage(
          'Giao dịch đang được xử lý. Vui lòng không thanh toán lại và kiểm tra lại sau ít phút.'
        );

        if (updated) setApp(updated);
      }
    }, 600);
  };

  const isAlreadyPaid = app.paymentStatus === 'Đã thanh toán';
  const isPending = app.paymentStatus === 'Đang xử lý giao dịch';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-3 duration-200">
          <div
            className={`flex items-start gap-3 p-4 rounded-xl shadow-xl border text-sm max-w-md ${
              toastMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : toastMessage.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : toastMessage.type === 'error' ? (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="font-medium">{toastMessage.text}</div>
          </div>
        </div>
      )}

      {/* Top back bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại Tra cứu hồ sơ
        </button>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Cổng Dịch vụ công – Thanh toán trực tuyến Finlink
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Banner header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white mb-2 backdrop-blur-sm">
                Thanh toán phí, lệ phí trực tuyến
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                {app.loaiThuTuc ||
                  (app.thuTuc === 'tam-thoi'
                    ? 'Cấp giấy thông hành tạm thời'
                    : 'Cấp sổ thông hành')}
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm mt-1">
                Mã hồ sơ tiếp nhận:{' '}
                <span className="font-mono font-bold text-white tracking-wide">
                  {app.maHoSo}
                </span>
              </p>
            </div>

            {/* Price display badge */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-right sm:min-w-48">
              <div className="text-xs text-blue-200 uppercase font-medium">Số tiền cần nộp</div>
              <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight mt-0.5">
                {feeAmount.toLocaleString('vi-VN')} <span className="text-sm font-semibold">VNĐ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Thông tin hồ sơ & Cơ quan thu tiền */}
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Thông tin nộp hồ sơ và cơ quan thu tiền
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/70 p-5 rounded-xl border border-slate-200 text-sm">
              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <span className="text-slate-500 text-xs block">Họ và tên người nộp:</span>
                    <span className="font-semibold text-slate-900 uppercase">
                      {app.hoTenNguoiNop || 'Công dân'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CreditCard className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <span className="text-slate-500 text-xs block">Số định danh / CCCD:</span>
                    <span className="font-mono font-medium text-slate-800">
                      {app.cccd || app.taiKhoan}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <span className="text-slate-500 text-xs block">Cơ quan thu lệ phí:</span>
                    <span className="font-medium text-slate-900">{agencyName}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <span className="text-slate-500 text-xs block">Trạng thái thanh toán hiện tại:</span>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        app.paymentStatus === 'Đã thanh toán'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.paymentStatus === 'Đang xử lý giao dịch'
                          ? 'bg-sky-100 text-sky-800'
                          : app.paymentStatus === 'Thanh toán lỗi'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {app.paymentStatus || 'Chờ thanh toán'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cảnh báo nếu đang xử lý hoặc đã thanh toán */}
          {isAlreadyPaid && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-emerald-900 text-sm">Hồ sơ đã được thanh toán lệ phí</h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Mã giao dịch: <span className="font-mono font-bold">{app.paymentTxnId}</span> |
                  Thời gian: <span className="font-medium">{app.paidAt}</span>. Quý công dân có thể xem
                  hoặc in biên lai điện tử tại mục Tra cứu hồ sơ.
                </p>
              </div>
            </div>
          )}

          {isPending && (
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 flex items-start gap-3">
              <Clock className="w-5 h-5 text-sky-600 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h3 className="font-semibold text-sky-900 text-sm">Giao dịch đang được xử lý</h3>
                <p className="text-xs text-sky-800 mt-0.5">
                  Hệ thống đang đồng bộ kết quả với cổng thanh toán. Vui lòng không thực hiện thanh toán
                  lại để tránh trừ tiền 2 lần. Bạn có thể kiểm tra lại trạng thái sau ít phút.
                </p>
              </div>
            </div>
          )}

          {/* Lựa chọn phương thức thanh toán */}
          {!isAlreadyPaid && (
            <div>
              <h2 className="text-base font-semibold text-slate-900 mb-3 flex items-center justify-between">
                <span>Chọn phương thức thanh toán</span>
                <span className="text-xs font-normal text-slate-500">
                  Tích hợp Cổng thanh toán quốc gia Finlink
                </span>
              </h2>

              <div className="grid grid-cols-1 gap-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethodId === method.id;
                  return (
                    <label
                      key={method.id}
                      className={`relative flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={method.id}
                        checked={isSelected}
                        onChange={() => setSelectedMethodId(method.id)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-700">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 text-sm">
                            {method.name}
                          </span>
                          {method.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              {method.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{method.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-6 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
            >
              Quay lại danh sách
            </button>

            {!isAlreadyPaid && !isPending && (
              <button
                type="button"
                onClick={handleInitiatePayment}
                disabled={!selectedMethodId}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-md transition-all active:scale-[0.99]"
              >
                <CreditCard className="w-4 h-4" />
                Thanh toán {feeAmount.toLocaleString('vi-VN')} VNĐ
              </button>
            )}

            {isAlreadyPaid && (
              <button
                type="button"
                onClick={onBack}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all"
              >
                Xem danh sách hồ sơ
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gateway Simulation Modal */}
      {showGatewayModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Gateway Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm tracking-wider">
                  FL
                </div>
                <div>
                  <h3 className="font-bold text-sm">Finlink Payment Gateway (Giả lập)</h3>
                  <p className="text-xs text-slate-400">Cổng thanh toán điện tử DVC Quốc gia</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGatewayModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-5">
                <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                  <span>Hồ sơ thanh toán:</span>
                  <span className="font-mono font-bold text-slate-800">{app.maHoSo}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                  <span>Phương thức:</span>
                  <span className="font-medium text-slate-800">
                    {PAYMENT_METHODS.find((m) => m.id === selectedMethodId)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 mt-2">
                  <span className="text-sm font-semibold text-slate-700">Tổng tiền nộp:</span>
                  <span className="text-xl font-black text-blue-600 font-mono">
                    {feeAmount.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Chọn kịch bản kiểm thử (Demo Sandbox):
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Bấm một trong các nút bên dưới để mô phỏng phản hồi từ cổng thanh toán Finlink:
                </p>

                <div className="space-y-3">
                  {/* Scenario 1: Thành công */}
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleGatewayScenario('success')}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-bold text-sm">Kịch bản 1: Thanh toán thành công</div>
                        <div className="text-xs text-emerald-700">
                          Sinh mã GD, cập nhật trạng thái &quot;Đã thanh toán&quot;, cho phép in biên lai
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Scenario 2: Thất bại */}
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleGatewayScenario('failed')}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-900 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      <div>
                        <div className="font-bold text-sm">Kịch bản 2: Thanh toán thất bại</div>
                        <div className="text-xs text-rose-700">
                          Báo lỗi &quot;Thanh toán không thành công&quot;, cập nhật &quot;Thanh toán lỗi&quot;, cho phép thử lại
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Scenario 3: Mất kết nối / Treo */}
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleGatewayScenario('timeout')}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-900 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-sky-600 shrink-0" />
                      <div>
                        <div className="font-bold text-sm">Kịch bản 3: Mất kết nối / Treo giao dịch</div>
                        <div className="text-xs text-sky-700">
                          Cập nhật &quot;Đang xử lý giao dịch&quot;, khóa thanh toán lại, chờ Đối soát
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {isProcessing && (
                <div className="flex items-center justify-center gap-2 py-3 text-sm text-slate-600">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  Đang xử lý giao dịch qua cổng Finlink...
                </div>
              )}
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-right">
              <button
                type="button"
                onClick={() => setShowGatewayModal(false)}
                disabled={isProcessing}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 font-medium"
              >
                Hủy giao dịch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog thông báo khi mất kết nối / Đang xử lý */}
      {pendingDialogMessage && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Thông báo giao dịch</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              {pendingDialogMessage}
            </p>
            <button
              type="button"
              onClick={() => {
                setPendingDialogMessage(null);
                onBack();
              }}
              className="w-full px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              Tôi đã hiểu và quay về Tra cứu hồ sơ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
