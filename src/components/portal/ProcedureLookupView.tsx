import React, { useState } from 'react';
import { FileText, Search, Clock, ArrowRight, ShieldCheck, Info, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ProcedureDetailModal } from './ProcedureDetailModal';

export interface ProcedureInfo {
  id: string;
  code: string;
  name: string;
  description: string;
  processingDays: string;
  fee: string;
  level: string;
  target: string;
}

export const PROCEDURES_LIST: ProcedureInfo[] = [
  {
    id: 'TTHC-01',
    code: 'BCA-XNC-001',
    name: 'Cấp mới sổ thông hành',
    description:
      'Áp dụng cho công dân làm thủ tục cấp mới sổ thông hành biên giới lần đầu tiên, có hộ khẩu thường trú tại các tỉnh biên giới.',
    processingDays: '03 ngày làm việc',
    fee: '50.000 VNĐ / sổ',
    level: 'Toàn trình (Mức 4)',
    target: 'Cư dân thường trú tỉnh biên giới',
  },
  {
    id: 'TTHC-02',
    code: 'BCA-XNC-002',
    name: 'Cấp đổi, cấp lại sổ thông hành',
    description:
      'Thực hiện khi sổ thông hành còn thời hạn nhưng bị rách, hư hỏng, hết trang thị thực hoặc bị thất lạc.',
    processingDays: '03 ngày làm việc',
    fee: '50.000 VNĐ / sổ',
    level: 'Toàn trình (Mức 4)',
    target: 'Công dân đã có sổ thông hành',
  },
  {
    id: 'TTHC-03',
    code: 'BCA-XNC-003',
    name: 'Cấp giấy thông hành tạm thời',
    description:
      'Giải quyết cho trường hợp công dân qua lại biên giới vì lý do khẩn cấp, thăm thân nhân hoặc việc gia đình đột xuất.',
    processingDays: '01 ngày làm việc (24h)',
    fee: '20.000 VNĐ / giấy',
    level: 'Một phần (Mức 3)',
    target: 'Công dân và thân nhân',
  },
];

interface ProcedureLookupViewProps {
  onSubmitNewPass: () => void | Promise<any>;
  onSubmitTamThoi?: () => void | Promise<any>;
  onSubmitProcedure?: (procedure: 'cap-so' | 'tam-thoi') => void | Promise<any>;
  onShowToast: (msg: string, type?: 'success' | 'danger' | 'info') => void;
}

export const ProcedureLookupView: React.FC<ProcedureLookupViewProps> = ({
  onSubmitNewPass,
  onSubmitTamThoi,
  onSubmitProcedure,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModalProc, setSelectedModalProc] = useState<ProcedureInfo | null>(null);
  const [loadingProcId, setLoadingProcId] = useState<string | null>(null);

  const filteredProcedures = PROCEDURES_LIST.filter((proc) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      proc.name.toLowerCase().includes(q) ||
      proc.code.toLowerCase().includes(q) ||
      proc.description.toLowerCase().includes(q)
    );
  });

  const handleApplyProcedure = async (proc: ProcedureInfo) => {
    let targetProc: 'cap-so' | 'tam-thoi' | null = null;
    if (proc.id === 'TTHC-01') targetProc = 'cap-so';
    else if (proc.id === 'TTHC-03') targetProc = 'tam-thoi';

    if (!targetProc) {
      onShowToast('Thủ tục này sẽ được mở ở giai đoạn sau', 'info');
      return;
    }

    setLoadingProcId(proc.id);
    try {
      if (onSubmitProcedure) {
        await onSubmitProcedure(targetProc);
      } else if (targetProc === 'tam-thoi' && onSubmitTamThoi) {
        await onSubmitTamThoi();
      } else {
        await onSubmitNewPass();
      }
    } finally {
      setLoadingProcId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto animate-fadeIn">
      {/* Tiêu đề trang */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-[22px] sm:text-[24px] font-bold text-[#1F2937] leading-tight">
            Tra cứu thủ tục hành chính
          </h2>
          <p className="text-[14px] text-[#6B7280] mt-1">
            Danh mục thủ tục cấp giấy, sổ thông hành biên giới trực tuyến theo quy định
          </p>
        </div>
      </div>

      {/* Ô tìm kiếm lọc theo Tên hoặc Mã thủ tục */}
      <div className="bg-white p-4 border border-[#D9E1DC] rounded-xl flex items-center gap-3 shadow-2xs">
        <div className="flex-1">
          <Input
            placeholder="Tìm kiếm theo Tên thủ tục, Mã thủ tục hoặc từ khóa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-[#6B7280]" />}
          />
        </div>
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm('')}
          >
            Xóa tìm kiếm
          </Button>
        )}
      </div>

      {/* Danh sách 3 thủ tục */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredProcedures.map((item) => (
          <div
            key={item.id}
            className="bg-[#FFFFFF] border border-[#D9E1DC] rounded-xl p-5 flex flex-col justify-between hover:border-[#006B3F] hover:shadow-sm transition-all group"
          >
            <div>
              {/* Badge mức độ & mã */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-mono text-[#6B7280] bg-[#F5F7F6] px-2 py-0.5 rounded border border-[#D9E1DC]">
                  {item.code}
                </span>
                <span className="text-[11px] font-medium text-[#008A4B] bg-[#E6F5EE] px-2 py-0.5 rounded border border-[#B0DFCA]">
                  {item.level}
                </span>
              </div>

              {/* Tên thủ tục */}
              <h4 className="text-[16px] font-bold text-[#1F2937] group-hover:text-[#006B3F] transition-colors leading-snug min-h-[44px]">
                {item.name}
              </h4>

              {/* Mô tả ngắn */}
              <p className="text-[13px] text-[#6B7280] mt-2 leading-relaxed min-h-[50px]">
                {item.description}
              </p>

              {/* Thông tin phụ: Thời gian & Lệ phí */}
              <div className="mt-4 pt-3 border-t border-[#D9E1DC] space-y-1.5 text-[12px]">
                <div className="flex items-center justify-between text-[#6B7280]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Thời hạn:
                  </span>
                  <span className="font-medium text-[#1F2937]">{item.processingDays}</span>
                </div>
                <div className="flex items-center justify-between text-[#6B7280]">
                  <span>Lệ phí nhà nước:</span>
                  <span className="font-semibold text-[#006B3F]">{item.fee}</span>
                </div>
              </div>
            </div>

            {/* Thao tác: Xem chi tiết & Nút nộp */}
            <div className="mt-5 pt-3 border-t border-[#D9E1DC] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedModalProc(item)}
                className="text-[13px] font-medium text-[#006B3F] hover:underline cursor-pointer"
              >
                Xem chi tiết
              </button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => handleApplyProcedure(item)}
                disabled={loadingProcId !== null}
              >
                {loadingProcId === item.id ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang xử lý...</span>
                  </span>
                ) : (
                  <span>Nộp hồ sơ</span>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredProcedures.length === 0 && (
        <div className="bg-white border border-[#D9E1DC] rounded-xl p-8 text-center text-[#6B7280]">
          <Info className="w-8 h-8 text-[#5F6B66] mx-auto mb-2" />
          <p className="text-[14px] font-semibold text-[#1A2421]">Không tìm thấy thủ tục phù hợp</p>
          <p className="text-[12px] mt-1">Vui lòng thử lại với từ khóa tìm kiếm khác.</p>
        </div>
      )}

      {/* Modal chi tiết thủ tục nếu chọn xem */}
      {selectedModalProc && (
        <ProcedureDetailModal
          procedure={selectedModalProc}
          onClose={() => setSelectedModalProc(null)}
          onSubmit={(proc) => handleApplyProcedure(proc as ProcedureInfo)}
        />
      )}
    </div>
  );
};
