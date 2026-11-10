import React, { useState, useEffect } from 'react';
import {
  DemoBiometricMode,
  getDemoBiometricMode,
  setDemoBiometricMode,
  getLatestAppointment,
  getBiometricAppointments,
  updateBiometricAppointment,
  formatDateVN,
  markBiometricCompletedForCitizen,
  removeBiometricCompletedForCitizen,
  clearBiometricSessionPassed,
  clearAllBiometricDone,
  isSpecialTestAccount,
  resetThreeTestAccounts,
} from '../../utils/biometricStorage';
import { addCitizenNotification } from '../../utils/notificationStorage';
import {
  Settings,
  ChevronDown,
  CheckCircle,
  RefreshCw,
  XCircle,
  Award,
  AlertTriangle,
  RotateCcw,
  UserCheck,
  Briefcase,
  FileText,
  PlusCircle,
} from 'lucide-react';
import {
  ALL_APPLICATION_STATUSES,
  ApplicationStatus,
  getStoredApplications,
  updateApplicationStatusByOfficer,
  createMockSeedApplications,
  officerAcceptApplication,
  officerReconcilePendingPayment,
  StoredApplication,
} from '../../utils/submissionStorage';

interface BiometricDemoPanelProps {
  currentCitizenId?: string;
  onRefreshData?: () => void;
  onShowToast: (msg: string, type?: 'success' | 'danger' | 'info') => void;
  onResetTestAccounts?: () => void;
}

export const BiometricDemoPanel: React.FC<BiometricDemoPanelProps> = ({
  currentCitizenId = '',
  onRefreshData,
  onShowToast,
  onResetTestAccounts,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [demoMode, setDemoMode] = useState<DemoBiometricMode>('chua');

  // State cho Giả lập cán bộ xử lý
  const [userApps, setUserApps] = useState<StoredApplication[]>([]);
  const [selectedAppCode, setSelectedAppCode] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>('Yêu cầu bổ sung');
  const [noiDungBoSung, setNoiDungBoSung] = useState('Vui lòng bổ sung bản sao giấy khai sinh của trẻ em đi kèm');
  const [selectedGiayToThieu, setSelectedGiayToThieu] = useState<string[]>([
    'Bản sao Giấy khai sinh của trẻ em đi kèm',
  ]);
  const [isZeroFee, setIsZeroFee] = useState(false);

  const refreshUserApps = () => {
    if (!currentCitizenId) return;
    const all = getStoredApplications(currentCitizenId);
    // Danh sách hồ sơ không phải nháp
    const nonDraft = all.filter((a) => a.trangThai !== 'Hồ sơ chưa gửi');
    setUserApps(nonDraft);
    if (nonDraft.length > 0) {
      if (!selectedAppCode || !nonDraft.some((a) => a.maHoSo === selectedAppCode)) {
        setSelectedAppCode(nonDraft[0].maHoSo);
      }
    } else {
      setSelectedAppCode('');
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshUserApps();
    }
  }, [isOpen, currentCitizenId]);

  useEffect(() => {
    setDemoMode(getDemoBiometricMode());
  }, []);

  const handleModeChange = (newMode: DemoBiometricMode) => {
    const normalized =
      newMode === 'has_biometric' || newMode === 'co'
        ? 'co'
        : newMode === 'error' || newMode === 'loi'
        ? 'loi'
        : 'chua';
    setDemoMode(normalized);
    setDemoBiometricMode(normalized);

    // QUAN TRỌNG - Mục 4: Với 3 tài khoản test (Lan, Huân, Vũ), không ghi đè dữ liệu của họ
    if (isSpecialTestAccount(currentCitizenId)) {
      onShowToast(
        'Đã đổi chế độ demo. 3 tài khoản test (Lan, Huân, Vũ) giữ nguyên trạng thái thực tế theo quy tắc Mục 4.',
        'info'
      );
      onRefreshData?.();
      return;
    }

    if (normalized === 'co') {
      if (currentCitizenId) {
        markBiometricCompletedForCitizen(currentCitizenId);
      }
      onShowToast('Đã chọn chế độ: Đã có sinh trắc', 'success');
    } else if (normalized === 'chua') {
      if (currentCitizenId) {
        removeBiometricCompletedForCitizen(currentCitizenId);
        clearBiometricSessionPassed(currentCitizenId);
      }
      onShowToast('Đã chọn chế độ: Chưa có sinh trắc', 'info');
    } else if (normalized === 'loi') {
      onShowToast('Đã chọn chế độ: Lỗi kết nối', 'danger');
    }
    onRefreshData?.();
  };

  // Nút Đặt lại 3 tài khoản test theo đúng mục 6
  const handleResetThreeTestAccounts = () => {
    resetThreeTestAccounts();
    onShowToast('Đã đặt lại 3 tài khoản test về trạng thái ban đầu và đăng xuất.', 'success');
    onResetTestAccounts?.();
  };

  const getModeLabel = (mode: DemoBiometricMode) => {
    switch (mode) {
      case 'co':
      case 'has_biometric':
        return 'Đã có sinh trắc';
      case 'chua':
      case 'no_biometric':
      case 'auto':
        return 'Chưa có sinh trắc';
      case 'loi':
      case 'error':
        return 'Lỗi kết nối';
    }
  };

  // 1. Cán bộ xác nhận lịch hẹn (Mục 4)
  const handleOfficerConfirmAppointment = () => {
    if (!currentCitizenId) {
      onShowToast('Vui lòng đăng nhập để thử nghiệm giả lập lịch hẹn.', 'danger');
      return;
    }

    const latest = getLatestAppointment(currentCitizenId);
    if (!latest) {
      onShowToast('Bạn chưa có lịch hẹn nào để cán bộ xác nhận.', 'info');
      return;
    }

    const updated = updateBiometricAppointment(latest.id, {
      trangThai: 'Đã xác nhận',
    });
    if (updated) {
      const timeStr = latest.khungGio ? `${latest.khungGio} ` : '';
      const agencyStr = latest.coQuan ? ` tại ${latest.coQuan}` : '';
      const msg = `Lịch hẹn thu nhận sinh trắc của bạn vào ${timeStr}ngày ${formatDateVN(latest.ngay)}${agencyStr} đã được xác nhận. Vui lòng đến đúng giờ.`;
      onShowToast(msg, 'success');
      addCitizenNotification({
        taiKhoan: currentCitizenId,
        maHoSo: latest.maHoSo,
        title: 'Lịch hẹn sinh trắc đã được xác nhận',
        content: msg,
        type: 'appointment',
      });
      window.dispatchEvent(new CustomEvent('eb_biometric_appointments_updated'));
      onRefreshData?.();
    }
  };

  // 2. Cán bộ từ chối hồ sơ (không đến theo hẹn) (Mục 4)
  const handleOfficerRejectAppNoShow = () => {
    if (!currentCitizenId) {
      onShowToast('Vui lòng đăng nhập để thử nghiệm.', 'danger');
      return;
    }

    const latestApp = getLatestAppointment(currentCitizenId);
    let targetMaHoSo = selectedAppCode;
    if (!targetMaHoSo && latestApp?.maHoSo) {
      targetMaHoSo = latestApp.maHoSo;
    }
    if (!targetMaHoSo && userApps.length > 0) {
      targetMaHoSo = userApps[0].maHoSo;
    }

    if (!targetMaHoSo && !latestApp) {
      onShowToast('Chưa có hồ sơ hoặc lịch hẹn nào để từ chối.', 'info');
      return;
    }

    const rejectReason = 'Công dân không đến theo hẹn thu nhận sinh trắc';

    // 1. Cập nhật hồ sơ -> "Từ chối tiếp nhận"
    if (targetMaHoSo) {
      updateApplicationStatusByOfficer(targetMaHoSo, 'Từ chối tiếp nhận');
    }

    // 2. Lịch hẹn gắn với hồ sơ tự động -> "Đã hủy"
    let appToCancel = latestApp;
    if (targetMaHoSo) {
      const allAppointments = getBiometricAppointments(currentCitizenId);
      const matched = allAppointments.find((a) => a.maHoSo === targetMaHoSo);
      if (matched) {
        appToCancel = matched;
      }
    }

    if (appToCancel) {
      updateBiometricAppointment(appToCancel.id, {
        trangThai: 'Đã hủy',
        lyDo: rejectReason,
      });
    }

    // 3. Gửi thông báo cho công dân
    const timeStr = appToCancel?.khungGio ? `${appToCancel.khungGio} ` : '';
    const dateStr = appToCancel?.ngay ? formatDateVN(appToCancel.ngay) : 'ngày hẹn';
    const msg = `Lịch hẹn thu nhận sinh trắc của bạn vào ${timeStr}ngày ${dateStr} đã được hủy vì hồ sơ ${targetMaHoSo || (appToCancel?.maHoSo || '')} bị từ chối. Lý do: ${rejectReason}.`;

    onShowToast(msg, 'danger');
    addCitizenNotification({
      taiKhoan: currentCitizenId,
      maHoSo: targetMaHoSo || appToCancel?.maHoSo,
      title: 'Hồ sơ bị từ chối tiếp nhận',
      content: msg,
      type: 'appointment',
    });

    window.dispatchEvent(new CustomEvent('eb_applications_updated'));
    window.dispatchEvent(new CustomEvent('eb_biometric_appointments_updated'));
    refreshUserApps();
    onRefreshData?.();
  };

  // Giả lập hệ thống cấp sổ báo thiếu sinh trắc (xóa khỏi eb_biometric_done)
  const handleSimulateMissingBiometric = () => {
    if (!currentCitizenId) {
      onShowToast('Vui lòng đăng nhập để thử nghiệm.', 'info');
      return;
    }
    removeBiometricCompletedForCitizen(currentCitizenId);
    clearBiometricSessionPassed(currentCitizenId);
    onShowToast(
      'Hệ thống cấp sổ ghi nhận bạn chưa có dữ liệu sinh trắc. Vui lòng kiểm tra lại',
      'danger'
    );
    onRefreshData?.();
  };

  // Xóa trạng thái đã kiểm tra sinh trắc
  const handleResetCheckedStatus = () => {
    if (currentCitizenId) {
      removeBiometricCompletedForCitizen(currentCitizenId);
      clearBiometricSessionPassed(currentCitizenId);
    } else {
      clearAllBiometricDone();
    }
    onShowToast('Đã xóa trạng thái đã kiểm tra sinh trắc.', 'info');
    onRefreshData?.();
  };

  // Giả lập cán bộ cập nhật trạng thái hồ sơ (Mục 8)
  const handleOfficerUpdateStatus = () => {
    if (!selectedAppCode) {
      onShowToast('Vui lòng chọn hồ sơ cần cập nhật trạng thái', 'danger');
      return;
    }
    const yeuCauData =
      selectedStatus === 'Yêu cầu bổ sung'
        ? {
            ngayYeuCau: new Date().toLocaleDateString('vi-VN'),
            donViYeuCau: 'Phòng Quản lý xuất nhập cảnh',
            noiDung: noiDungBoSung.trim() || 'Vui lòng bổ sung bản sao giấy khai sinh của trẻ em đi kèm',
            giayToThieu: selectedGiayToThieu,
          }
        : undefined;

    const ok = updateApplicationStatusByOfficer(selectedAppCode, selectedStatus, yeuCauData);
    if (ok) {
      onShowToast(`Đã cập nhật trạng thái hồ sơ ${selectedAppCode} sang "${selectedStatus}"`, 'success');
      refreshUserApps();
      onRefreshData?.();
    } else {
      onShowToast('Không tìm thấy hồ sơ để cập nhật', 'danger');
    }
  };

  // Cán bộ tiếp nhận hồ sơ hợp lệ (kèm thông báo thu lệ phí hoặc miễn phí)
  const handleOfficerAcceptApplication = () => {
    if (!selectedAppCode) return;
    const res = officerAcceptApplication(selectedAppCode, { zeroFee: isZeroFee });
    if (res.success) {
      onShowToast(
        isZeroFee
          ? `Cán bộ đã tiếp nhận hồ sơ ${selectedAppCode} (Miễn lệ phí)`
          : `Cán bộ đã tiếp nhận hồ sơ ${selectedAppCode} kèm thông báo nộp lệ phí!`,
        'success'
      );
      refreshUserApps();
      onRefreshData?.();
    } else {
      onShowToast(res.error || 'Lỗi khi tiếp nhận hồ sơ', 'danger');
    }
  };

  // Đối soát giao dịch treo (Thành công / Thất bại)
  const handleOfficerReconcilePayment = (outcome: 'success' | 'failed') => {
    if (!selectedAppCode) return;
    const res = officerReconcilePendingPayment(selectedAppCode, outcome);
    if (res.success) {
      onShowToast(
        outcome === 'success'
          ? `Đối soát thành công giao dịch hồ sơ ${selectedAppCode}!`
          : `Đối soát thất bại giao dịch hồ sơ ${selectedAppCode}!`,
        'success'
      );
      refreshUserApps();
      onRefreshData?.();
    } else {
      onShowToast(res.error || 'Lỗi khi đối soát giao dịch', 'danger');
    }
  };

  // Tạo nhanh 6 hồ sơ mẫu cho tài khoản đang đăng nhập
  const handleCreateMockSeedApplications = () => {
    if (!currentCitizenId) {
      onShowToast('Vui lòng đăng nhập để tạo hồ sơ mẫu', 'danger');
      return;
    }
    createMockSeedApplications(currentCitizenId);
    onShowToast(`Đã tạo nhanh 6 hồ sơ mẫu cho tài khoản ${currentCitizenId}!`, 'success');
    refreshUserApps();
    onRefreshData?.();
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 select-none">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-white/95 backdrop-blur-xs border border-[#006B3F] text-[#006B3F] hover:bg-[#E8F3EE] px-3 py-1.5 rounded-full shadow-md text-[12px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105"
          title="Mở bảng điều khiển kiểm thử nghiệp vụ sinh trắc"
        >
          <Settings className="w-3.5 h-3.5 animate-spin-slow text-[#006B3F]" />
          <span>Chế độ demo sinh trắc</span>
        </button>
      ) : (
        <div className="bg-white border border-[#D9DFDC] rounded-xl shadow-2xl p-4 w-[340px] sm:w-[380px] space-y-3.5 animate-fadeIn text-[13px] text-[#1A2421]">
          {/* Header Panel */}
          <div className="flex items-center justify-between border-b border-[#E5E9E7] pb-2">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#006B3F]" />
              <span className="font-bold text-[#1A2421] text-[14px]">
                Bảng điều khiển Demo
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#6B7280] hover:text-[#1A2421] p-1 rounded hover:bg-[#F3F4F6] cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* 1. Chọn kết quả kiểm tra giả lập */}
          <div className="space-y-1.5">
            <label className="font-semibold text-[#1A2421] block text-[12px]">
              Kết quả kiểm tra giả lập:
            </label>
            <select
              value={demoMode === 'has_biometric' ? 'co' : demoMode === 'no_biometric' || demoMode === 'auto' ? 'chua' : demoMode === 'error' ? 'loi' : demoMode}
              onChange={(e) => handleModeChange(e.target.value as DemoBiometricMode)}
              className="w-full h-[36px] px-2.5 text-[13px] bg-white border border-[#D9DFDC] rounded-lg outline-none focus:border-[#006B3F] cursor-pointer"
            >
              <option value="co">Đã có sinh trắc</option>
              <option value="chua">Chưa có sinh trắc</option>
              <option value="loi">Lỗi kết nối</option>
            </select>
            <p className="text-[11px] text-[#5F6B66] italic">
              * Khi chọn &quot;Đã có sinh trắc&quot;, hệ thống lưu vào eb_biometric_done và lần nộp sau sẽ vào thẳng form.
            </p>
            {isSpecialTestAccount(currentCitizenId) && (
              <div className="p-2 bg-[#E8F3EE] border border-[#A5D6A7] rounded-lg text-[11px] text-[#006B3F] leading-snug flex items-start gap-1.5">
                <UserCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <div>
                  Đang đăng nhập <strong>tài khoản test ({currentCitizenId.replace(/\D/g, '')})</strong>. Theo quy tắc <strong>Mục 4</strong>, tài khoản này luôn dùng trạng thái thực tế, không bị ghi đè bởi chế độ demo.
                </div>
              </div>
            )}
            {currentCitizenId.replace(/\D/g, '') === '1234567891234' && (
              <div className="p-2 bg-[#FFF8E7] border border-[#F4E29D] rounded-lg text-[11px] text-[#B26A00] leading-snug">
                Tài khoản <strong>1234567891234</strong>: Được cấu hình luôn luôn kiểm tra sinh trắc khi nộp hồ sơ và mặc định &quot;Chưa có sinh trắc&quot; để chạy riêng luồng đặt lịch hẹn.
              </div>
            )}
          </div>

          {/* 2. Giả lập cán bộ xử lý lịch hẹn (Mục 4) */}
          <div className="space-y-1.5 pt-2 border-t border-[#E5E9E7]">
            <label className="font-semibold text-[#1A2421] block text-[12px]">
              Giả lập cán bộ xử lý lịch hẹn:
            </label>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={handleOfficerConfirmAppointment}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#A5D6A7] bg-[#E8F3EE] hover:bg-[#D5EADB] text-[#006B3F] text-[12px] font-medium transition-colors cursor-pointer text-center"
              >
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Cán bộ xác nhận lịch hẹn</span>
              </button>

              <button
                type="button"
                onClick={handleOfficerRejectAppNoShow}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#FCA5A5] bg-[#FFF5F5] hover:bg-[#FEECEC] text-[#C62828] text-[12px] font-medium transition-colors cursor-pointer text-center"
              >
                <XCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Cán bộ từ chối hồ sơ (không đến theo hẹn)</span>
              </button>
            </div>
          </div>

          {/* 3. Giả lập cán bộ xử lý (Mục 8) */}
          <div className="space-y-2 pt-2 border-t border-[#E5E9E7]">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-[#1A2421] block text-[12px] flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#006B3F]" />
                <span>Giả lập cán bộ xử lý:</span>
              </label>
              <button
                type="button"
                onClick={handleCreateMockSeedApplications}
                className="text-[11px] font-semibold text-[#006B3F] hover:underline flex items-center gap-1 cursor-pointer bg-[#E8F3EE] px-2 py-0.5 rounded"
                title="Tạo nhanh 6 hồ sơ mẫu với các trạng thái khác nhau"
              >
                <PlusCircle className="w-3 h-3" />
                <span>Tạo hồ sơ mẫu</span>
              </button>
            </div>

            {userApps.length === 0 ? (
              <div className="p-2 rounded bg-[#F9FAFB] border border-[#E5E9E7] text-[11px] text-[#6B7280]">
                Chưa có hồ sơ đã gửi nào. Bấm <strong className="text-[#006B3F]">&quot;Tạo hồ sơ mẫu&quot;</strong> ở trên để sinh nhanh 6 hồ sơ kiểm thử.
              </div>
            ) : (
              <div className="space-y-2 bg-[#F9FAFB] p-2.5 rounded-lg border border-[#E5E9E7]">
                <div>
                  <label className="text-[11px] text-[#6B7280] block mb-0.5">Chọn hồ sơ:</label>
                  <select
                    value={selectedAppCode}
                    onChange={(e) => setSelectedAppCode(e.target.value)}
                    className="w-full text-[12px] bg-white border border-[#D9DFDC] rounded px-2 py-1 outline-none font-mono"
                  >
                    {userApps.map((app) => (
                      <option key={app.maHoSo} value={app.maHoSo}>
                        {app.maHoSo} - {app.thuTuc === 'tam-thoi' ? 'Tạm thời' : 'Cấp sổ'} ({app.trangThai} | Thu: {app.paymentStatus || '-'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3a. Nút Cán bộ tiếp nhận hồ sơ hợp lệ kèm thông báo thu lệ phí */}
                <div className="p-2 bg-blue-50/70 border border-blue-200 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-900">
                      Tiếp nhận hồ sơ & Phát sinh lệ phí:
                    </span>
                    <label className="flex items-center gap-1 text-[11px] text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isZeroFee}
                        onChange={(e) => setIsZeroFee(e.target.checked)}
                        className="w-3.5 h-3.5 text-blue-600 rounded"
                      />
                      <span className="text-[10.5px]">Lệ phí = 0</span>
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={handleOfficerAcceptApplication}
                    className="w-full py-1.5 px-3 rounded bg-blue-600 hover:bg-blue-700 text-white text-[11.5px] font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Cán bộ tiếp nhận hồ sơ hợp lệ</span>
                  </button>
                </div>

                {/* 3b. Đối soát giao dịch treo nếu hồ sơ đang ở trạng thái 'Đang xử lý giao dịch' hoặc bất kỳ hồ sơ nào */}
                {(() => {
                  const targetApp = userApps.find((a) => a.maHoSo === selectedAppCode);
                  const isPendingTxn = targetApp?.paymentStatus === 'Đang xử lý giao dịch';
                  return (
                    <div className={`p-2 rounded-lg border space-y-1.5 ${isPendingTxn ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800">
                          Đối soát giao dịch treo (Finlink):
                        </span>
                        {isPendingTxn && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-bold text-[10px] animate-pulse">
                            Đang treo
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOfficerReconcilePayment('success')}
                          className="py-1 px-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium transition-colors text-center"
                        >
                          Đối soát: Thành công
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOfficerReconcilePayment('failed')}
                          className="py-1 px-2 rounded bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-medium transition-colors text-center"
                        >
                          Đối soát: Thất bại
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* 3c. Đổi sang trạng thái tùy chọn */}
                <div>
                  <label className="text-[11px] text-[#6B7280] block mb-0.5">Đổi sang trạng thái khác:</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as ApplicationStatus)}
                    className="w-full text-[12px] bg-white border border-[#D9DFDC] rounded px-2 py-1 outline-none font-medium"
                  >
                    {ALL_APPLICATION_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedStatus === 'Yêu cầu bổ sung' && (
                  <div className="space-y-2 pt-1 border-t border-[#E5E9E7] text-[11px]">
                    <div>
                      <label className="text-[#6B7280] block mb-0.5">Nội dung yêu cầu bổ sung:</label>
                      <textarea
                        rows={2}
                        value={noiDungBoSung}
                        onChange={(e) => setNoiDungBoSung(e.target.value)}
                        className="w-full text-[11px] bg-white border border-[#D9DFDC] rounded p-1.5 outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[#6B7280] block mb-1">Giấy tờ thiếu (Checklist):</label>
                      <div className="space-y-1 bg-white p-1.5 rounded border border-[#D9DFDC]">
                        {[
                          'Bản sao Căn cước/CMND',
                          'Bản sao Sổ hộ khẩu',
                          'Bản sao Giấy khai sinh của trẻ em đi kèm',
                          'Giấy cho phép của người giám hộ',
                        ].map((doc) => {
                          const isChecked = selectedGiayToThieu.includes(doc);
                          return (
                            <label key={doc} className="flex items-center gap-1.5 text-[11px] text-[#1F2937] cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedGiayToThieu((prev) => [...prev, doc]);
                                  } else {
                                    setSelectedGiayToThieu((prev) => prev.filter((d) => d !== doc));
                                  }
                                }}
                                className="w-3.5 h-3.5 text-[#006B3F] rounded"
                              />
                              <span>{doc}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleOfficerUpdateStatus}
                  className="w-full py-1.5 px-3 rounded bg-[#006B3F] hover:bg-[#005733] text-white text-[12px] font-semibold transition-colors cursor-pointer"
                >
                  Cập nhật trạng thái
                </button>
              </div>
            )}
          </div>

          {/* 4. Nút giả lập thiếu sinh trắc & nút xóa trạng thái đã kiểm tra */}
          <div className="space-y-2 pt-2 border-t border-[#E5E9E7]">
            <button
              type="button"
              onClick={handleSimulateMissingBiometric}
              className="w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg border border-[#FCA5A5] bg-[#FFF5F5] hover:bg-[#FEECEC] text-[#C62828] text-[12px] font-medium transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Giả lập: Hệ thống cấp sổ báo thiếu sinh trắc</span>
            </button>

            <button
              type="button"
              onClick={handleResetCheckedStatus}
              className="w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#D9DFDC] bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[#4B5563] text-[12px] font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa trạng thái đã kiểm tra</span>
            </button>
          </div>

          {/* 4. Nút Đặt lại 3 tài khoản test (Mục 6) */}
          <div className="pt-2 border-t border-[#E5E9E7] space-y-1">
            <button
              type="button"
              onClick={handleResetThreeTestAccounts}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[#006B3F] bg-[#006B3F] hover:bg-[#005733] text-white text-[12.5px] font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.99]"
              title="Đưa 3 tài khoản Lan, Huân, Vũ về đúng trạng thái ban đầu ở mục 2 và đăng xuất"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại 3 tài khoản test</span>
            </button>
            <p className="text-[11px] text-[#5F6B66] text-center leading-tight">
              (Xóa lịch mới của Lan, khôi phục LH-0001 của Huân, xóa hồ sơ nháp, giữ sinh trắc của Vũ và đăng xuất)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
