import React, { useState, useEffect } from 'react';
import { X, Search, AlertTriangle, RefreshCw, Printer, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { getStoredApplications, StoredApplication } from '../../utils/submissionStorage';
import { PrintableApplicationForm } from './PrintableApplicationForm';

interface LookupModalProps {
  onClose: () => void;
  onResumeDraft?: (app: StoredApplication) => void;
}

export const LookupModal: React.FC<LookupModalProps> = ({
  onClose,
  onResumeDraft,
}) => {
  const [query, setQuery] = useState('');
  const [records, setRecords] = useState<StoredApplication[]>([]);
  const [printingRecord, setPrintingRecord] = useState<StoredApplication | null>(null);

  useEffect(() => {
    setRecords(getStoredApplications());
  }, []);

  const handleRefresh = () => {
    setRecords(getStoredApplications());
  };

  // Lọc theo Mã hồ sơ hoặc Họ tên người nộp
  const filteredRecords = records.filter((app) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      app.maHoSo.toLowerCase().includes(q) ||
      app.hoTenNguoiNop.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px] animate-fadeIn">
      <div
        className="bg-[#FFFFFF] border border-[#D9E1DC] rounded-xl w-full max-w-4xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#D9E1DC] flex items-center justify-between bg-[#FFFFFF] shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded bg-[#E8F3EE] text-[#006B3F]">
              <Search className="w-5 h-5 text-[#006B3F]" />
            </span>
            <div>
              <h3 className="text-[17px] font-bold text-[#1F2937]">
                Tra cứu hồ sơ trực tuyến
              </h3>
              <p className="text-[12px] text-[#6B7280]">
                Danh sách hồ sơ đã lưu nháp hoặc đã gửi trên Cổng dịch vụ công
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F5F7F6] rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="p-5 border-b border-[#D9E1DC] bg-[#FFFFFF] shrink-0">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm theo Mã hồ sơ hoặc Họ tên người nộp..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-[#6B7280]" />}
                autoFocus
              />
            </div>
            {query && (
              <Button
                variant="ghost"
                size="md"
                onClick={() => setQuery('')}
              >
                Xóa
              </Button>
            )}
            <Button
              variant="secondary"
              size="md"
              onClick={handleRefresh}
              icon={<RefreshCw className="w-4 h-4 text-[#006B3F]" />}
            >
              Làm mới
            </Button>
          </div>
        </div>

        {/* Danh sách / Bảng hồ sơ */}
        <div className="overflow-y-auto flex-1 p-5">
          <div className="border border-[#D9E1DC] rounded-lg overflow-hidden bg-white">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="bg-[#F5F7F6] border-b border-[#D9E1DC] text-[#1F2937] font-semibold">
                  <th className="py-3 px-3 w-10 text-center">STT</th>
                  <th className="py-3 px-3 min-w-[130px]">Mã hồ sơ</th>
                  <th className="py-3 px-3 min-w-[150px]">Họ tên người nộp</th>
                  <th className="py-3 px-3 min-w-[160px]">Loại thủ tục</th>
                  <th className="py-3 px-3 min-w-[130px]">Ngày tạo</th>
                  <th className="py-3 px-3 min-w-[140px] text-center">Trạng thái</th>
                  <th className="py-3 px-3 min-w-[160px] text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E1DC] text-[#1F2937]">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((item, index) => (
                    <tr key={item.maHoSo} className="hover:bg-[#F5F7F6]/60 transition-colors">
                      <td className="py-3 px-3 text-center text-[#6B7280]">
                        {index + 1}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-semibold text-[#006B3F] bg-[#E8F3EE] px-2 py-0.5 rounded text-[12px]">
                          {item.maHoSo}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#1F2937]">
                        {item.hoTenNguoiNop}
                      </td>
                      <td className="py-3 px-3 text-[#1F2937]">
                        {item.loaiThuTuc}
                      </td>
                      <td className="py-3 px-3 text-[#6B7280]">
                        {item.ngayTao}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {item.trangThai === 'Hồ sơ chưa gửi' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#F3F4F6] text-[#6B7280] border border-[#D9E1DC]">
                            Hồ sơ chưa gửi
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#FEF3C7] text-[#D6A928] border border-[#FCD34D]">
                            Hồ sơ đang xử lý
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Nút In phiếu (Secondary style) */}
                          <button
                            type="button"
                            onClick={() => setPrintingRecord(item)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded border border-[#D9E1DC] bg-[#FFFFFF] hover:bg-[#F5F7F6] text-[#1F2937] hover:text-[#006B3F] text-[11px] font-medium cursor-pointer transition-colors shadow-2xs"
                            title="In phiếu đơn đề nghị"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#006B3F]" />
                            <span>In phiếu</span>
                          </button>

                          {item.trangThai === 'Hồ sơ chưa gửi' && onResumeDraft ? (
                            <button
                              type="button"
                              onClick={() => {
                                onResumeDraft(item);
                                onClose();
                              }}
                              className="text-[#006B3F] font-semibold hover:underline cursor-pointer text-[12px]"
                            >
                              Khai tiếp
                            </button>
                          ) : (
                            <span className="text-[#6B7280] text-[11px]">Đã ghi nhận</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[#6B7280]">
                      <AlertTriangle className="w-6 h-6 text-[#D6A928] mx-auto mb-1.5" />
                      <p className="text-[13px] font-medium text-[#1F2937]">
                        Không tìm thấy hồ sơ phù hợp
                      </p>
                      <p className="text-[12px] mt-0.5">
                        Kiểm tra lại từ khóa Mã hồ sơ hoặc Họ tên người nộp.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#D9E1DC] bg-[#FFFFFF] flex justify-end shrink-0">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>

      {/* CỬA SỔ IN PHIẾU ĐƠN ĐỀ NGHỊ GỐC */}
      {printingRecord && (
        <PrintableApplicationForm
          data={{
            maHoSo: printingRecord.maHoSo,
            loaiThuTuc: printingRecord.loaiThuTuc,
            fullName: printingRecord.hoTenNguoiNop,
            fullNameLatin: 'SOMCHAI KHAMVONGSA',
            dob: '18/05/1992',
            gender: 'Nam',
            ethnicity: 'Lào Lùm',
            religion: 'Phật giáo',
            birthVillage: 'Bản Thongkhankham',
            birthDistrict: 'Huyện Chanthabuly',
            birthProvince: 'Thủ đô Viêng Chăn',
            resVillage: 'Bản Phonxay',
            resUnit: 'Đơn vị 12',
            resDistrict: 'Huyện Sisattanak',
            resProvince: 'Thủ đô Viêng Chăn',
            nationalId: printingRecord.cccd || '01-089201948',
            idIssueDate: '15/08/2021',
            idIssuePlace: 'Công an Thủ đô Viêng Chăn',
            householdBookNo: 'VTN-882910',
            householdIssueDate: '20/11/2019',
            householdIssuePlace: 'Công an Huyện Sisattanak',
            heightCm: '172',
            scars: 'Không có',
            scarsLocation: 'Không có',
            children: [
              {
                fullName: 'Manee Khamvongsa',
                fullNameLatin: 'MANEE KHAMVONGSA',
                dob: '12/09/2018',
                gender: 'Nữ',
              },
            ],
          }}
          onClose={() => setPrintingRecord(null)}
          autoPrint={true}
        />
      )}
    </div>
  );
};
