import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  AlertTriangle,
  Clock,
  Printer,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { BorderPassApplication, PassStatus, PassType } from '../../types/borderPass';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface ApplicationListProps {
  applications: BorderPassApplication[];
  onSelectApplication: (app: BorderPassApplication) => void;
  onQuickApprove: (id: string) => void;
  onQuickReject: (id: string) => void;
  onOpenCreateNew: () => void;
}

const PASS_TYPE_LABELS: Record<PassType, string> = {
  THUONG_TRU: 'Cư dân thường trú',
  KINH_DOANH: 'Thương nhân tiểu ngạch',
  VAN_TAI: 'Lái xe vận tải liên vận',
  THAM_THAN: 'Thăm thân / Việc riêng',
};

export const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
  onSelectApplication,
  onQuickApprove,
  onQuickReject,
  onOpenCreateNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchSearch =
        searchTerm === '' ||
        app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.nationalId.includes(searchTerm) ||
        (app.vehiclePlate && app.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = selectedStatus === 'ALL' || app.status === selectedStatus;
      const matchCheckpoint =
        selectedCheckpoint === 'ALL' || app.checkpoint === selectedCheckpoint;
      const matchType = selectedType === 'ALL' || app.passType === selectedType;

      return matchSearch && matchStatus && matchCheckpoint && matchType;
    });
  }, [applications, searchTerm, selectedStatus, selectedCheckpoint, selectedType]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredApps.length / itemsPerPage));
  const currentItems = filteredApps.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics calculation
  const stats = useMemo(() => {
    return {
      total: applications.length,
      approved: applications.filter((a) => a.status === 'APPROVED').length,
      processing: applications.filter((a) => a.status === 'PROCESSING').length,
      pending: applications.filter((a) => a.status === 'PENDING').length,
      warningOrRejected: applications.filter(
        (a) => a.status === 'WARNING' || a.status === 'REJECTED'
      ).length,
    };
  }, [applications]);

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-[22px] font-bold text-[#1F2937] leading-tight">
            Quản lý hồ sơ cấp giấy phép thông hành
          </h2>
          <p className="text-[14px] text-[#6B7280] mt-1">
            Tiếp nhận, kiểm tra dữ liệu cư dân, xác thực an ninh và cấp mã e-Border Pass
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="md"
            icon={<FileSpreadsheet className="w-4 h-4 text-[#1F2937]" />}
          >
            Xuất báo cáo Excel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onOpenCreateNew}
            icon={<CheckCircle className="w-4 h-4" />}
          >
            Đăng ký hồ sơ mới
          </Button>
        </div>
      </div>

      {/* KPI Stats Row (Clean, flat, high contrast) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-[#FFFFFF] border border-[#D9E1DC] rounded-lg p-4">
          <div className="text-[13px] font-medium text-[#6B7280]">Tổng tiếp nhận</div>
          <div className="text-[24px] font-bold text-[#1F2937] mt-1">{stats.total}</div>
          <div className="text-[12px] text-[#6B7280] mt-0.5">Toàn bộ hồ sơ</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D9E1DC] rounded-lg p-4 border-l-4 border-l-[#008A4B]">
          <div className="text-[13px] font-medium text-[#6B7280] flex items-center justify-between">
            <span>Đã cấp phép</span>
            <CheckCircle className="w-4 h-4 text-[#008A4B]" />
          </div>
          <div className="text-[24px] font-bold text-[#008A4B] mt-1">{stats.approved}</div>
          <div className="text-[12px] text-[#6B7280] mt-0.5">Mã e-Pass hiệu lực</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D9E1DC] rounded-lg p-4 border-l-4 border-l-[#2563EB]">
          <div className="text-[13px] font-medium text-[#6B7280] flex items-center justify-between">
            <span>Đang đối soát</span>
            <Clock className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-[24px] font-bold text-[#2563EB] mt-1">{stats.processing}</div>
          <div className="text-[12px] text-[#6B7280] mt-0.5">Liên thông cơ sở DL</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D9E1DC] rounded-lg p-4 border-l-4 border-l-[#D6A928]">
          <div className="text-[13px] font-medium text-[#6B7280] flex items-center justify-between">
            <span>Chờ phê duyệt</span>
            <AlertTriangle className="w-4 h-4 text-[#D6A928]" />
          </div>
          <div className="text-[24px] font-bold text-[#9A740E] mt-1">{stats.pending}</div>
          <div className="text-[12px] text-[#6B7280] mt-0.5">Cần thẩm định trực tiếp</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D9E1DC] rounded-lg p-4 border-l-4 border-l-[#D71920]">
          <div className="text-[13px] font-medium text-[#6B7280] flex items-center justify-between">
            <span>Cảnh báo / Từ chối</span>
            <XCircle className="w-4 h-4 text-[#D71920]" />
          </div>
          <div className="text-[24px] font-bold text-[#D71920] mt-1">{stats.warningOrRejected}</div>
          <div className="text-[12px] text-[#6B7280] mt-0.5">Blacklist an ninh / lỗi</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card noPadding className="shadow-none">
        <div className="p-4 border-b border-[#D9E1DC] bg-[#FFFFFF] flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm theo Mã hồ sơ, Họ tên, CCCD/Hộ chiếu, Biển số..."
              className="w-full text-[14px] text-[#1F2937] placeholder:text-[#6B7280] bg-[#FFFFFF] border border-[#D9E1DC] rounded px-3 py-2 pl-9 focus:border-[#006B3F] focus:ring-1 focus:ring-[#006B3F] outline-none"
            />
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Checkpoint Filter */}
          <div className="w-48">
            <select
              value={selectedCheckpoint}
              onChange={(e) => {
                setSelectedCheckpoint(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-[13px] text-[#1F2937] bg-[#FFFFFF] border border-[#D9E1DC] rounded px-3 py-2 focus:border-[#006B3F] outline-none cursor-pointer"
            >
              <option value="ALL">Tất cả cửa khẩu</option>
              <option value="Cửa khẩu Quốc tế Hữu Nghị">CKQT Hữu Nghị (Lạng Sơn)</option>
              <option value="Cửa khẩu Quốc tế Móng Cái">CKQT Móng Cái (Quảng Ninh)</option>
              <option value="Cửa khẩu Quốc tế Lào Cai">CKQT Lào Cai</option>
              <option value="Cửa khẩu Quốc tế Mộc Bài">CKQT Mộc Bài (Tây Ninh)</option>
              <option value="Cửa khẩu Tân Thanh">Cửa khẩu Tân Thanh</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-44">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-[13px] text-[#1F2937] bg-[#FFFFFF] border border-[#D9E1DC] rounded px-3 py-2 focus:border-[#006B3F] outline-none cursor-pointer"
            >
              <option value="ALL">Mọi trạng thái</option>
              <option value="APPROVED">Đã phê duyệt / Hợp lệ</option>
              <option value="PROCESSING">Đang xử lý / Thông tin</option>
              <option value="PENDING">Chờ phê duyệt</option>
              <option value="WARNING">Cảnh báo kiểm tra</option>
              <option value="REJECTED">Từ chối / Blacklist</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="w-44">
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-[13px] text-[#1F2937] bg-[#FFFFFF] border border-[#D9E1DC] rounded px-3 py-2 focus:border-[#006B3F] outline-none cursor-pointer"
            >
              <option value="ALL">Mọi diện đối tượng</option>
              <option value="THUONG_TRU">Cư dân thường trú</option>
              <option value="KINH_DOANH">Thương nhân tiểu ngạch</option>
              <option value="VAN_TAI">Lái xe vận tải</option>
              <option value="THAM_THAN">Thăm thân nhân</option>
            </select>
          </div>

          {(searchTerm ||
            selectedStatus !== 'ALL' ||
            selectedCheckpoint !== 'ALL' ||
            selectedType !== 'ALL') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('ALL');
                setSelectedCheckpoint('ALL');
                setSelectedType('ALL');
                setCurrentPage(1);
              }}
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F7F6] border-b border-[#D9E1DC] text-[13px] font-semibold text-[#1F2937]">
                <th className="py-3 px-4 w-12 text-center">STT</th>
                <th className="py-3 px-4">Mã hồ sơ</th>
                <th className="py-3 px-4">Công dân / Đương đơn</th>
                <th className="py-3 px-4">Số CCCD / Hộ chiếu</th>
                <th className="py-3 px-4">Cửa khẩu đăng ký</th>
                <th className="py-3 px-4">Diện giấy phép</th>
                <th className="py-3 px-4">Biển kiểm soát</th>
                <th className="py-3 px-4">Thời gian nộp</th>
                <th className="py-3 px-4">Trạng thái duyệt</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9E1DC] text-[13px] text-[#1F2937]">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-[#6B7280]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Filter className="w-8 h-8 text-[#9CA3AF]" />
                      <p className="text-[14px] font-medium text-[#1F2937]">
                        Không tìm thấy hồ sơ nào khớp với bộ lọc
                      </p>
                      <p className="text-[13px] text-[#6B7280]">
                        Vui lòng kiểm tra lại từ khóa tìm kiếm hoặc đặt lại bộ lọc.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((app, index) => {
                  const itemIndex = (currentPage - 1) * itemsPerPage + index + 1;
                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-[#F5F7F6] transition-colors group cursor-pointer"
                      onClick={() => onSelectApplication(app)}
                    >
                      <td className="py-3 px-4 text-center text-[#6B7280] font-medium">
                        {itemIndex}
                      </td>

                      {/* Mã hồ sơ */}
                      <td className="py-3 px-4 font-mono font-semibold text-[#006B3F] whitespace-nowrap">
                        {app.id}
                      </td>

                      {/* Công dân */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={app.avatarUrl}
                            alt={app.applicantName}
                            className="w-7 h-7 rounded-full object-cover border border-[#D9E1DC]"
                          />
                          <div>
                            <span className="font-medium text-[#1F2937] block leading-tight">
                              {app.applicantName}
                            </span>
                            <span className="text-[11px] text-[#6B7280]">
                              {app.gender}, {app.dob}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* CCCD */}
                      <td className="py-3 px-4 font-mono text-[#1F2937]">
                        {app.nationalId}
                      </td>

                      {/* Cửa khẩu */}
                      <td className="py-3 px-4">
                        <span className="text-[#1F2937] leading-tight block">
                          {app.checkpoint}
                        </span>
                      </td>

                      {/* Diện giấy phép */}
                      <td className="py-3 px-4">
                        <span className="text-[#1F2937]">
                          {PASS_TYPE_LABELS[app.passType]}
                        </span>
                      </td>

                      {/* Biển kiểm soát */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {app.vehiclePlate ? (
                          <span className="px-2 py-0.5 font-mono text-[12px] bg-[#F5F7F6] border border-[#D9E1DC] rounded font-medium text-[#1F2937]">
                            {app.vehiclePlate}
                          </span>
                        ) : (
                          <span className="text-[#9CA3AF] italic text-[12px]">Đi bộ</span>
                        )}
                      </td>

                      {/* Thời gian nộp */}
                      <td className="py-3 px-4 text-[#6B7280] whitespace-nowrap">
                        {app.submissionDate}
                      </td>

                      {/* Trạng thái */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusBadge status={app.status} />
                      </td>

                      {/* Thao tác */}
                      <td
                        className="py-3 px-4 text-center whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onSelectApplication(app)}
                            className="p-1.5 text-[#006B3F] hover:bg-[#E8F3EE] rounded transition-colors"
                            title="Xem chi tiết & thẩm định"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {app.status === 'PENDING' && (
                            <>
                              <button
                                type="button"
                                onClick={() => onQuickApprove(app.id)}
                                className="p-1.5 text-[#008A4B] hover:bg-[#E6F5EE] rounded transition-colors"
                                title="Phê duyệt nhanh"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onQuickReject(app.id)}
                                className="p-1.5 text-[#D71920] hover:bg-[#FEECEC] rounded transition-colors"
                                title="Từ chối hồ sơ"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {app.status === 'APPROVED' && (
                            <button
                              type="button"
                              onClick={() => onSelectApplication(app)}
                              className="p-1.5 text-[#1F2937] hover:bg-[#F5F7F6] rounded transition-colors"
                              title="In giấy phép / Mã QR"
                            >
                              <Printer className="w-4 h-4 text-[#6B7280]" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Status Footer */}
        <div className="px-5 py-3 border-t border-[#D9E1DC] bg-[#FFFFFF] flex flex-wrap items-center justify-between gap-3 text-[13px] text-[#6B7280]">
          <div>
            Hiển thị{' '}
            <strong className="text-[#1F2937] font-semibold">
              {filteredApps.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} -{' '}
              {Math.min(currentPage * itemsPerPage, filteredApps.length)}
            </strong>{' '}
            trong tổng số{' '}
            <strong className="text-[#1F2937] font-semibold">{filteredApps.length}</strong> hồ sơ
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              icon={<ChevronLeft className="w-4 h-4" />}
            >
              Trang trước
            </Button>

            <span className="px-3 text-[#1F2937] font-medium text-[13px]">
              Trang {currentPage} / {totalPages}
            </span>

            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              icon={<ChevronRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Trang sau
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
