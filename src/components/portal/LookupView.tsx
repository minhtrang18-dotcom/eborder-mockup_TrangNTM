import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  FileText,
  AlertTriangle,
  RefreshCw,
  Printer,
  X,
  Eye,
  Edit3,
  FilePlus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  CreditCard,
  Receipt,
  Clock,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  getStoredApplications,
  getStoredApplicationByCode,
  deleteStoredApplication,
  validateStoredApplicationForPrint,
  StoredApplication,
  ApplicationStatus,
  PaymentStatus,
  ALL_APPLICATION_STATUSES,
} from '../../utils/submissionStorage';
import {
  getBiometricAppointments,
  formatDateVN,
  BiometricAppointment,
} from '../../utils/biometricStorage';
import { PrintableApplicationForm, PrintableFormData } from './PrintableApplicationForm';
import { PaymentReceiptModal } from './PaymentReceiptModal';

interface LookupViewProps {
  userIdentifier: string; // Số định danh công dân hoặc userId
  onViewDetail: (maHoSo: string) => void;
  onContinueEditing: (maHoSo: string, thuTuc: 'cap-so' | 'tam-thoi') => void;
  onSupplementApplication: (maHoSo: string, thuTuc: 'cap-so' | 'tam-thoi') => void;
  onNavigateToPayment?: (maHoSo: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'danger' | 'info') => void;
}

export const LookupView: React.FC<LookupViewProps> = ({
  userIdentifier,
  onViewDetail,
  onContinueEditing,
  onSupplementApplication,
  onNavigateToPayment,
  onShowToast,
}) => {
  // Bộ lọc tìm kiếm
  const [inputMaHoSo, setInputMaHoSo] = useState('');
  const [selectedThuTuc, setSelectedThuTuc] = useState<'all' | 'cap-so' | 'tam-thoi'>('all');
  const [selectedTrangThai, setSelectedTrangThai] = useState<'all' | ApplicationStatus>('all');

  // Bộ lọc đã kích hoạt (chỉ áp dụng khi bấm Tìm kiếm hoặc Xóa lọc)
  const [activeFilters, setActiveFilters] = useState<{
    maHoSo: string;
    thuTuc: 'all' | 'cap-so' | 'tam-thoi';
    trangThai: 'all' | ApplicationStatus;
  }>({
    maHoSo: '',
    thuTuc: 'all',
    trangThai: 'all',
  });

  const [records, setRecords] = useState<StoredApplication[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // State cho In phiếu
  const [printingData, setPrintingData] = useState<{
    data: PrintableFormData;
    procedure: 'cap-so' | 'tam-thoi';
  } | null>(null);

  // State cho Modal Xóa hồ sơ
  const [deletingApp, setDeletingApp] = useState<StoredApplication | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State cho Biên lai điện tử
  const [receiptApp, setReceiptApp] = useState<StoredApplication | null>(null);

  // Danh sách lịch hẹn thu nhận sinh trắc
  const [appointments, setAppointments] = useState<BiometricAppointment[]>([]);

  const loadAppointments = useCallback(() => {
    const list = getBiometricAppointments(userIdentifier);
    setAppointments(list);
  }, [userIdentifier]);

  // Nạp danh sách hồ sơ của công dân
  const loadRecords = useCallback(() => {
    const list = getStoredApplications(userIdentifier);
    // Sắp xếp mới nhất lên đầu
    list.sort((a, b) => {
      const timeA = a.ngayLuu || a.ngayGui || a.ngayTao || '';
      const timeB = b.ngayLuu || b.ngayGui || b.ngayTao || '';
      return timeB.localeCompare(timeA);
    });
    setRecords(list);
  }, [userIdentifier]);

  useEffect(() => {
    loadRecords();
    loadAppointments();
    const handleUpdate = () => {
      loadRecords();
      loadAppointments();
    };
    window.addEventListener('eb_applications_updated', handleUpdate);
    window.addEventListener('eb_biometric_appointments_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('eb_applications_updated', handleUpdate);
      window.removeEventListener('eb_biometric_appointments_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [loadRecords, loadAppointments]);

  // Bấm Tìm kiếm
  const handleApplyFilter = () => {
    setActiveFilters({
      maHoSo: inputMaHoSo.trim(),
      thuTuc: selectedThuTuc,
      trangThai: selectedTrangThai,
    });
    setCurrentPage(1);
  };

  // Bấm Xóa lọc
  const handleResetFilter = () => {
    setInputMaHoSo('');
    setSelectedThuTuc('all');
    setSelectedTrangThai('all');
    setActiveFilters({
      maHoSo: '',
      thuTuc: 'all',
      trangThai: 'all',
    });
    setCurrentPage(1);
    loadRecords();
  };

  // Danh sách sau khi lọc
  const filteredRecords = useMemo(() => {
    return records.filter((app) => {
      // Lọc theo mã hồ sơ
      if (activeFilters.maHoSo) {
        const q = activeFilters.maHoSo.toLowerCase();
        if (!app.maHoSo.toLowerCase().includes(q)) return false;
      }
      // Lọc theo thủ tục
      if (activeFilters.thuTuc !== 'all') {
        const proc = app.thuTuc || app.procedure || (app.loaiThuTuc?.includes('tạm thời') ? 'tam-thoi' : 'cap-so');
        if (proc !== activeFilters.thuTuc) return false;
      }
      // Lọc theo trạng thái
      if (activeFilters.trangThai !== 'all') {
        if (app.trangThai !== activeFilters.trangThai) return false;
      }
      return true;
    });
  }, [records, activeFilters]);

  // Phân trang
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage]);

  // Badge trạng thái theo đúng quy định mục 1
  const renderStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Hồ sơ chưa gửi':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium bg-gray-100 text-gray-700 border border-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5" />
            Hồ sơ chưa gửi
          </span>
        );
      case 'Đã gửi':
      case 'Đã tiếp nhận':
      case 'Đang thẩm định':
      case 'Chờ phê duyệt cấp':
      case 'Chờ phê duyệt từ chối':
      case 'Đã phê duyệt':
      case 'Đang in':
      case 'Chờ trả kết quả':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5" />
            {status}
          </span>
        );
      case 'Yêu cầu bổ sung':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold bg-amber-50 text-amber-700 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            Yêu cầu bổ sung
          </span>
        );
      case 'Từ chối tiếp nhận':
      case 'Đã rút':
      case 'Đã từ chối cấp':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium bg-rose-50 text-rose-700 border border-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5" />
            {status}
          </span>
        );
      case 'Hoàn tất':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            Hoàn tất
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium bg-gray-100 text-gray-700 border border-gray-300">
            {status}
          </span>
        );
    }
  };

  // Badge trạng thái thanh toán (Quy tắc hiển thị lệ phí)
  const renderPaymentStatusBadge = (status?: PaymentStatus) => {
    switch (status) {
      case 'Chờ thanh toán':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            Chờ thanh toán
          </span>
        );
      case 'Đang xử lý giao dịch':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium bg-sky-50 text-sky-800 border border-sky-300 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mr-1.5 animate-pulse" />
            Đang xử lý giao dịch
          </span>
        );
      case 'Thanh toán lỗi':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5" />
            Thanh toán lỗi
          </span>
        );
      case 'Đã thanh toán':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            Đã thanh toán
          </span>
        );
      case 'Không phát sinh lệ phí':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium bg-slate-100 text-slate-600 border border-slate-300">
            Không phát sinh lệ phí
          </span>
        );
      default:
        return <span className="text-slate-400 font-medium">-</span>;
    }
  };

  // ==========================================
  // XỬ LÝ CÁC THAO TÁC CỘT THAO TÁC (MỤC 3, 4, 5, 6, 7)
  // ==========================================

  // Xử lý nút "Thanh toán": kiểm tra đồng thời
  const handlePayment = (app: StoredApplication) => {
    const fresh = getStoredApplicationByCode(app.maHoSo);
    if (!fresh) {
      onShowToast('Hồ sơ không tồn tại hoặc đã bị xóa.', 'danger');
      loadRecords();
      return;
    }

    if (fresh.paymentStatus === 'Đã thanh toán') {
      onShowToast(`Hồ sơ ${app.maHoSo} đã được thanh toán lệ phí`, 'info');
      loadRecords();
      return;
    }

    if (fresh.paymentStatus === 'Đang xử lý giao dịch') {
      onShowToast(`Hồ sơ ${app.maHoSo} đang được xử lý giao dịch. Vui lòng kiểm tra lại sau ít phút`, 'info');
      return;
    }

    if (onNavigateToPayment) {
      onNavigateToPayment(app.maHoSo);
    } else {
      window.location.hash = `#/thanh-toan/${app.maHoSo}`;
    }
  };

  // Xử lý nút "Xem biên lai"
  const handleOpenReceipt = (app: StoredApplication) => {
    const fresh = getStoredApplicationByCode(app.maHoSo);
    setReceiptApp(fresh || app);
  };

  // 1. Xem: Mọi trạng thái
  const handleView = (maHoSo: string) => {
    // Đọc lại trạng thái hiện tại
    const fresh = getStoredApplicationByCode(maHoSo);
    if (!fresh) {
      onShowToast('Hồ sơ không tồn tại hoặc đã bị xóa.', 'danger');
      loadRecords();
      return;
    }
    onViewDetail(maHoSo);
  };

  // 2. Tiếp tục chỉnh sửa: CHỈ "Hồ sơ chưa gửi" (Mục 4)
  const handleContinueEditing = (app: StoredApplication) => {
    // Đọc lại eb_applications ngay lúc bấm
    const fresh = getStoredApplicationByCode(app.maHoSo);
    if (!fresh || fresh.trangThai !== 'Hồ sơ chưa gửi') {
      onShowToast(
        `Hồ sơ ${app.maHoSo} đã được gửi hoặc đã thay đổi trạng thái nên không thể chỉnh sửa`,
        'danger'
      );
      loadRecords();
      return;
    }
    const proc = fresh.thuTuc || fresh.procedure || (fresh.loaiThuTuc?.includes('tạm thời') ? 'tam-thoi' : 'cap-so');
    onContinueEditing(fresh.maHoSo, proc);
  };

  // 3. Bổ sung hồ sơ: CHỈ "Yêu cầu bổ sung" (Mục 5)
  const handleSupplement = (app: StoredApplication) => {
    // Đọc lại eb_applications ngay lúc bấm
    const fresh = getStoredApplicationByCode(app.maHoSo);
    if (!fresh || fresh.trangThai !== 'Yêu cầu bổ sung') {
      onShowToast(
        `Hồ sơ ${app.maHoSo} hiện không có yêu cầu bổ sung nên không thể gửi bổ sung`,
        'danger'
      );
      loadRecords();
      return;
    }
    const proc = fresh.thuTuc || fresh.procedure || (fresh.loaiThuTuc?.includes('tạm thời') ? 'tam-thoi' : 'cap-so');
    onSupplementApplication(fresh.maHoSo, proc);
  };

  // 4. Xóa hồ sơ: CHỈ "Hồ sơ chưa gửi" (Mục 6)
  const handleOpenDeleteModal = (app: StoredApplication) => {
    const fresh = getStoredApplicationByCode(app.maHoSo);
    if (!fresh || fresh.trangThai !== 'Hồ sơ chưa gửi') {
      onShowToast(
        `Hồ sơ ${app.maHoSo} đã được gửi hoặc đã thay đổi trạng thái nên không thể xóa`,
        'danger'
      );
      loadRecords();
      return;
    }
    setDeletingApp(fresh);
  };

  const handleConfirmDelete = () => {
    if (!deletingApp) return;
    setIsDeleting(true);

    setTimeout(() => {
      const res = deleteStoredApplication(deletingApp.maHoSo, userIdentifier);
      setIsDeleting(false);

      if (!res.success) {
        onShowToast(
          res.error || `Hồ sơ ${deletingApp.maHoSo} đã được gửi hoặc đã thay đổi trạng thái nên không thể xóa`,
          'danger'
        );
      } else {
        onShowToast(`Đã xóa hồ sơ ${deletingApp.maHoSo}`, 'success');
      }

      setDeletingApp(null);
      loadRecords();
    }, 200);
  };

  // 5. In phiếu: Mọi trạng thái (Mục 7)
  const handlePrint = (app: StoredApplication) => {
    // Đọc lại eb_applications ngay lúc bấm
    const fresh = getStoredApplicationByCode(app.maHoSo);
    if (!fresh) {
      onShowToast('Không thể mở bản in. Vui lòng thử lại sau', 'danger');
      return;
    }

    // Nếu là hồ sơ nháp: chạy kiểm tra toàn bộ 3 phần trên dữ liệu đã lưu
    if (fresh.trangThai === 'Hồ sơ chưa gửi') {
      const checkResult = validateStoredApplicationForPrint(fresh);
      if (!checkResult.isValid) {
        onShowToast(
          'Hồ sơ chưa kê khai đầy đủ nên chưa thể in phiếu. Vui lòng chọn "Tiếp tục chỉnh sửa" để hoàn thành hồ sơ',
          'danger'
        );
        return;
      }
    }

    // Chuẩn bị dữ liệu in
    const d = fresh.duLieu || fresh.formData || {};
    const proc = fresh.thuTuc || fresh.procedure || (fresh.loaiThuTuc?.includes('tạm thời') ? 'tam-thoi' : 'cap-so');

    const printableData: PrintableFormData = {
      maHoSo: fresh.maHoSo,
      loaiThuTuc: proc === 'tam-thoi' ? 'TAM_THOI' : 'CAP_SO',
      procedure: proc,
      fullName: fresh.hoTenNguoiNop || d.fullNameLao || 'Somchai Khamvongsa',
      fullNameLatin: d.fullNameLatin || '',
      dob: d.dob || '',
      gender: d.gender || '',
      ethnicity: d.ethnicity || '',
      religion: d.religion || '',
      nationality: d.nationality || 'Lào',
      occupation: fresh.ngheNghiep || d.occupation || '',
      ngheNghiep: fresh.ngheNghiep || d.occupation || '',
      ngheNghiepKhac: fresh.ngheNghiepKhac || d.ngheNghiepKhac || '',
      hairColor: fresh.mauToc || d.hairColor || '',
      mauToc: fresh.mauToc || d.hairColor || '',
      mauTocKhac: fresh.mauTocKhac || d.mauTocKhac || '',
      eyeColor: fresh.mauMat || d.eyeColor || '',
      mauMat: fresh.mauMat || d.eyeColor || '',
      mauMatKhac: fresh.mauMatKhac || d.mauMatKhac || '',
      birthProvince: d.birthProvince || '',
      birthDistrict: d.birthDistrict || '',
      birthVillage: d.birthVillage || '',
      resProvince: d.resProvince || '',
      resDistrict: d.resDistrict || '',
      resVillage: d.resVillage || '',
      resUnit: d.resUnit || '',
      nationalId: d.nationalId || fresh.cccd || fresh.taiKhoan || '',
      idIssueDate: d.idIssueDate || '',
      idIssuePlace: d.idIssuePlace || '',
      householdBookNo: d.householdBookNo || '',
      householdIssueDate: d.householdIssueDate || '',
      householdIssuePlace: d.householdIssuePlace || '',
      heightCm: d.heightCm || '',
      scars: d.scars || '',
      scarsLocation: d.scarsLocation || '',
      portraitImgUrl: d.portraitImgUrl || '',
      tripPurpose: d.tripPurpose || '',
      tripPurposeDetail: d.tripPurposeDetail || '',
      validityStartDate: d.validityStartDate || '',
      validityEndDate: d.validityEndDate || '',
      children: Array.isArray(d.children)
        ? d.children.map((c: any) => ({
            fullName: c.fullNameLao || c.fullName || '',
            fullNameLatin: c.fullNameLatin || '',
            citizenId: c.citizenId || '',
            dob: c.dob || '',
            gender: c.gender || '',
          }))
        : [],
      createdDate: fresh.ngayGui || fresh.ngayLuu || fresh.ngayTao || '',
      donViTiepNhan: fresh.donViTiepNhan || d.donViTiepNhan || '',
      truongHopDeNghi: fresh.truongHopDeNghi || d.truongHopDeNghi || '',
      lyDoCuThe: fresh.lyDoCuThe || d.lyDoCuThe || '',
    };

    setPrintingData({
      data: printableData,
      procedure: proc,
    });
  };

  // Đóng modal khi bấm Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (deletingApp) setDeletingApp(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deletingApp]);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto animate-fadeIn pb-12">
      {/* Tiêu đề trang */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#D9DFDC] pb-4">
        <div>
          <h2 className="text-[22px] sm:text-[24px] font-bold text-[#1A2421] leading-tight">
            Tra cứu hồ sơ
          </h2>
          <p className="text-[13px] text-[#5F6B66] mt-1">
            Theo dõi danh sách và tình trạng xử lý các hồ sơ thông hành của tài khoản
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={loadRecords}
          icon={<RefreshCw className="w-4 h-4 text-[#006B3F]" />}
        >
          Làm mới
        </Button>
      </div>

      {/* Bộ lọc: Mã hồ sơ, Thủ tục, Trạng thái, Tìm kiếm, Xóa lọc */}
      <div className="bg-white p-4 sm:p-5 border border-[#D9DFDC] rounded-xl shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* 1. Ô tìm kiếm Mã hồ sơ */}
          <div>
            <label className="block text-[12px] font-semibold text-[#1A2421] mb-1">
              Mã hồ sơ:
            </label>
            <Input
              placeholder="Nhập mã hồ sơ (ví dụ: HS-2026...)"
              value={inputMaHoSo}
              onChange={(e) => setInputMaHoSo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleApplyFilter();
              }}
              leftIcon={<Search className="w-4 h-4 text-[#5F6B66]" />}
            />
          </div>

          {/* 2. Select Thủ tục */}
          <div>
            <label className="block text-[12px] font-semibold text-[#1A2421] mb-1">
              Thủ tục:
            </label>
            <select
              value={selectedThuTuc}
              onChange={(e) => setSelectedThuTuc(e.target.value as any)}
              className="w-full h-[40px] px-3 text-[13px] bg-white border border-[#D9DFDC] rounded-lg outline-none focus:border-[#006B3F] text-[#1A2421] cursor-pointer"
            >
              <option value="all">Tất cả thủ tục</option>
              <option value="cap-so">Cấp sổ thông hành</option>
              <option value="tam-thoi">Cấp giấy thông hành tạm thời</option>
            </select>
          </div>

          {/* 3. Select Trạng thái */}
          <div>
            <label className="block text-[12px] font-semibold text-[#1A2421] mb-1">
              Trạng thái hồ sơ:
            </label>
            <select
              value={selectedTrangThai}
              onChange={(e) => setSelectedTrangThai(e.target.value as any)}
              className="w-full h-[40px] px-3 text-[13px] bg-white border border-[#D9DFDC] rounded-lg outline-none focus:border-[#006B3F] text-[#1A2421] cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              {ALL_APPLICATION_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Nút hành động bộ lọc */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E5E9E7]">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilter}
            className="text-[13px]"
          >
            Xóa lọc
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleApplyFilter}
            icon={<Filter className="w-3.5 h-3.5" />}
            className="text-[13px]"
          >
            Tìm kiếm
          </Button>
        </div>
      </div>

      {/* Bảng danh sách hồ sơ */}
      <div className="bg-white border border-[#D9DFDC] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#F5F7F6] border-b border-[#D9DFDC] text-[#1A2421] font-semibold">
                <th className="py-3.5 px-3 w-12 text-center">STT</th>
                <th className="py-3.5 px-4 min-w-[150px]">Mã hồ sơ</th>
                <th className="py-3.5 px-4 min-w-[180px]">Thủ tục</th>
                <th className="py-3.5 px-4 min-w-[150px]">Ngày lưu / gửi gần nhất</th>
                <th className="py-3.5 px-4 min-w-[140px] text-center">Trạng thái</th>
                <th className="py-3.5 px-4 min-w-[140px] text-center">Thanh toán</th>
                <th className="py-3.5 px-4 min-w-[240px] text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DFDC] text-[#1A2421]">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((item, index) => {
                  const stt = (currentPage - 1) * pageSize + index + 1;
                  const procKey = item.thuTuc || item.procedure || (item.loaiThuTuc?.includes('tạm thời') ? 'tam-thoi' : 'cap-so');
                  const procLabel = procKey === 'tam-thoi' ? 'Cấp giấy thông hành tạm thời' : 'Cấp sổ thông hành';
                  const displayDate = item.ngayLuu || item.ngayGui || item.ngayTao || '';
                  const linkedApp = appointments.find((a) => {
                    if (a.maHoSo && a.maHoSo === item.maHoSo) {
                      return a.trangThai === 'Chờ cơ quan xác nhận' || a.trangThai === 'Đã xác nhận';
                    }
                    return false;
                  });

                  return (
                    <tr key={item.maHoSo} className="hover:bg-[#F5F7F6]/60 transition-colors">
                      {/* STT */}
                      <td className="py-3.5 px-3 text-center text-[#5F6B66] font-medium">
                        {stt}
                      </td>

                      {/* Mã hồ sơ */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[#006B3F] bg-[#E8F3EE] px-2 py-0.5 rounded text-[13px]">
                          {item.maHoSo}
                        </span>
                        {item.soLanBoSung > 0 && (
                          <span className="block text-[11px] text-[#5F6B66] mt-0.5">
                            (Bổ sung lần {item.soLanBoSung})
                          </span>
                        )}
                      </td>

                      {/* Thủ tục */}
                      <td className="py-3.5 px-4 font-medium text-[#1A2421]">
                        {procLabel}
                      </td>

                      {/* Ngày lưu/gửi gần nhất */}
                      <td className="py-3.5 px-4 text-[#5F6B66]">
                        {displayDate}
                      </td>

                      {/* Trạng thái (Badge) */}
                      <td className="py-3.5 px-4 text-center">
                        {renderStatusBadge(item.trangThai)}
                      </td>

                      {/* Trạng thái thanh toán (Badge) */}
                      <td className="py-3.5 px-4 text-center">
                        {renderPaymentStatusBadge(item.paymentStatus)}
                      </td>

                      {/* Thao tác (Mục 3: Nút không áp dụng thì ẨN) */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {/* 1. Nút "Xem": MỌI trạng thái */}
                          <button
                            type="button"
                            onClick={() => handleView(item.maHoSo)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[#D9DFDC] bg-white hover:bg-[#F5F7F6] text-[#1A2421] hover:text-[#006B3F] text-[12px] font-medium transition-colors cursor-pointer shadow-2xs"
                            title="Xem chi tiết hồ sơ (chỉ đọc)"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#006B3F]" />
                            <span>Xem</span>
                          </button>

                          {/* 2. Nút "Thanh toán": CHỈ "Chờ thanh toán" hoặc "Thanh toán lỗi" */}
                          {(item.paymentStatus === 'Chờ thanh toán' || item.paymentStatus === 'Thanh toán lỗi') && (
                            <button
                              type="button"
                              onClick={() => handlePayment(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-blue-500 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-semibold transition-colors cursor-pointer shadow-2xs"
                              title="Thanh toán lệ phí trực tuyến"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Thanh toán</span>
                            </button>
                          )}

                          {/* 3. Nút "Xem biên lai": CHỈ "Đã thanh toán" */}
                          {item.paymentStatus === 'Đã thanh toán' && (
                            <button
                              type="button"
                              onClick={() => handleOpenReceipt(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[12px] font-semibold transition-colors cursor-pointer shadow-2xs"
                              title="Xem biên lai điện tử"
                            >
                              <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Xem biên lai</span>
                            </button>
                          )}

                          {/* 4. Nút "Tiếp tục chỉnh sửa": CHỈ "Hồ sơ chưa gửi" */}
                          {item.trangThai === 'Hồ sơ chưa gửi' && (
                            <button
                              type="button"
                              onClick={() => handleContinueEditing(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[#A5D6A7] bg-[#E8F3EE] hover:bg-[#D5EADB] text-[#006B3F] text-[12px] font-semibold transition-colors cursor-pointer shadow-2xs"
                              title="Tiếp tục chỉnh sửa hồ sơ nháp"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Tiếp tục chỉnh sửa</span>
                            </button>
                          )}

                          {/* 5. Nút "Bổ sung hồ sơ": CHỈ "Yêu cầu bổ sung" */}
                          {item.trangThai === 'Yêu cầu bổ sung' && (
                            <button
                              type="button"
                              onClick={() => handleSupplement(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[#FCD34D] bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#B45309] text-[12px] font-semibold transition-colors cursor-pointer shadow-2xs"
                              title="Bổ sung hồ sơ theo yêu cầu"
                            >
                              <FilePlus className="w-3.5 h-3.5" />
                              <span>Bổ sung hồ sơ</span>
                            </button>
                          )}

                          {/* 6. Nút "Xóa" (chữ đỏ): CHỈ "Hồ sơ chưa gửi" */}
                          {item.trangThai === 'Hồ sơ chưa gửi' && (
                            <button
                              type="button"
                              onClick={() => handleOpenDeleteModal(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 text-[12px] font-medium transition-colors cursor-pointer shadow-2xs"
                              title="Xóa hồ sơ nháp này"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                              <span>Xóa</span>
                            </button>
                          )}

                          {/* 7. Nút "In phiếu": MỌI trạng thái */}
                          <button
                            type="button"
                            onClick={() => handlePrint(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[#D9DFDC] bg-white hover:bg-[#F5F7F6] text-[#1A2421] hover:text-[#006B3F] text-[12px] font-medium transition-colors cursor-pointer shadow-2xs"
                            title="In phiếu đơn đề nghị / Giấy thông hành"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#5F6B66]" />
                            <span>In phiếu</span>
                          </button>
                        </div>

                        {/* Hiển thị ngày giờ hẹn nếu hồ sơ có lịch hẹn còn hiệu lực (không thêm nút mới) */}
                        {linkedApp && (
                          <div className="mt-1.5 flex justify-center">
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-[#006B3F] bg-[#E8F3EE] border border-[#A5D6A7]/70"
                              title={`Cơ quan tiếp nhận: ${linkedApp.coQuan}`}
                            >
                              <Clock className="w-3 h-3 text-[#006B3F] shrink-0" />
                              <span>Hẹn: {linkedApp.khungGio ? `${linkedApp.khungGio} ` : ''}{formatDateVN(linkedApp.ngay)}</span>
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#5F6B66]">
                    <AlertTriangle className="w-8 h-8 text-[#D97706] mx-auto mb-2 opacity-80" />
                    <p className="text-[14px] font-semibold text-[#1A2421]">
                      {records.length === 0 ? 'Bạn chưa có hồ sơ nào' : 'Không tìm thấy hồ sơ phù hợp'}
                    </p>
                    <p className="text-[12px] text-[#5F6B66] mt-1">
                      {records.length === 0
                        ? 'Nhấn "Nộp hồ sơ" trên thanh điều hướng để bắt đầu kê khai hồ sơ mới.'
                        : 'Vui lòng thay đổi từ khóa mã hồ sơ hoặc điều kiện lọc trạng thái.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang 10 dòng/trang */}
        {filteredRecords.length > 0 && (
          <div className="px-4 py-3 border-t border-[#D9DFDC] bg-[#F5F7F6]/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#5F6B66]">
            <div>
              Hiển thị{' '}
              <strong className="text-[#1A2421]">
                {(currentPage - 1) * pageSize + 1}
              </strong>{' '}
              -{' '}
              <strong className="text-[#1A2421]">
                {Math.min(currentPage * pageSize, filteredRecords.length)}
              </strong>{' '}
              trong tổng số{' '}
              <strong className="text-[#1A2421]">{filteredRecords.length}</strong> hồ sơ
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded border border-[#D9DFDC] bg-white text-[#1A2421] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F5F7F6] cursor-pointer"
                title="Trang trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 font-semibold text-[#1A2421]">
                Trang {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded border border-[#D9DFDC] bg-white text-[#1A2421] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F5F7F6] cursor-pointer"
                title="Trang sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==========================================
          HỘP THOẠI XÁC NHẬN XÓA HỒ SƠ NHÁP (MỤC 6)
          ========================================== */}
      {deletingApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn"
          onClick={() => {
            if (!isDeleting) setDeletingApp(null);
          }}
        >
          <div
            className="bg-white border border-[#D9DFDC] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp text-[13px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-full bg-rose-50 text-rose-600 shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-[16px] font-bold text-[#1A2421]">
                  Xác nhận xóa hồ sơ nháp
                </h3>
                <p className="text-[#5F6B66] leading-relaxed">
                  Bạn có chắc chắn muốn xóa hồ sơ{' '}
                  <strong className="text-rose-600 font-mono">
                    {deletingApp.maHoSo}
                  </strong>
                  ? Hồ sơ đã xóa không thể khôi phục.
                </p>
              </div>
            </div>

            {/* Thông tin hồ sơ cần xóa */}
            <div className="bg-[#F9FAFB] border border-[#E5E9E7] rounded-lg p-3 space-y-1.5 text-[12px]">
              <div className="flex justify-between">
                <span className="text-[#5F6B66]">Thủ tục:</span>
                <span className="font-semibold text-[#1A2421]">
                  {deletingApp.thuTuc === 'tam-thoi' ? 'Cấp giấy thông hành tạm thời' : 'Cấp sổ thông hành'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6B66]">Thời điểm lưu gần nhất:</span>
                <span className="text-[#1A2421]">{deletingApp.ngayLuu}</span>
              </div>
            </div>

            {/* Các nút hành động */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={isDeleting}
                onClick={() => setDeletingApp(null)}
              >
                Hủy
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
              >
                {isDeleting ? 'Đang xóa...' : 'Xóa'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL XEM TRƯỚC BẢN IN (MỤC 7)
          ========================================== */}
      {printingData && (
        <PrintableApplicationForm
          data={printingData.data}
          procedure={printingData.procedure}
          onClose={() => setPrintingData(null)}
          autoPrint={false}
        />
      )}

      {/* ==========================================
          MODAL XEM BIÊN LAI THU LỆ PHÍ ĐIỆN TỬ
          ========================================== */}
      {receiptApp && (
        <PaymentReceiptModal
          application={receiptApp}
          onClose={() => setReceiptApp(null)}
        />
      )}
    </div>
  );
};
