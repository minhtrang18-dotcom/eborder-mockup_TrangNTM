import React, { useState } from 'react';
import {
  Radio,
  CheckCircle,
  AlertTriangle,
  QrCode,
  ScanLine,
  Truck,
  Users,
  ShieldAlert,
} from 'lucide-react';
import { INITIAL_CHECKPOINTS } from '../../data/mockData';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const CheckpointMonitor: React.FC = () => {
  const [selectedGate, setSelectedGate] = useState('CK-HN');
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    status: 'VALID' | 'INVALID' | 'WARN';
    message: string;
    details?: string;
  } | null>(null);

  const currentGate =
    INITIAL_CHECKPOINTS.find((c) => c.id === selectedGate) || INITIAL_CHECKPOINTS[0];

  const handleSimulateScan = (token: string) => {
    if (!token) return;
    if (token.includes('REJECTED') || token.includes('0024')) {
      setScanResult({
        status: 'INVALID',
        message: 'CẢNH BÁO AN NINH: TỪ CHỐI THÔNG QUAN - ĐỐI TƯỢNG BLACKLIST',
        details: 'Khóa barie tự động. Đã thông báo lực lượng Trực ban Đồn Biên phòng.',
      });
    } else if (token.includes('WARN') || token.includes('0023')) {
      setScanResult({
        status: 'WARN',
        message: 'CẢNH BÁO: CHUYỂN LUỒNG KIỂM TRA TRỰC TIẾP TẠI TRẠM',
        details: 'Phương tiện hoặc giấy tờ có lưu ý cần đối soát bổ sung.',
      });
    } else {
      setScanResult({
        status: 'VALID',
        message: 'XÁC THỰC THÀNH CÔNG: GIẤY PHÉP HỢP LỆ - MỞ BARIE e-GATE',
        details: 'Hệ thống đã ghi nhận thời điểm xuất/nhập cảnh vào Cơ sở dữ liệu.',
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-[22px] font-bold text-[#1F2937] flex items-center gap-2">
            <Radio className="w-6 h-6 text-[#006B3F] animate-pulse" />
            Giám sát luồng thông quan e-Gate tại các Cửa khẩu
          </h2>
          <p className="text-[14px] text-[#6B7280] mt-1">
            Kiểm soát tự động hóa qua hệ thống Barie thông minh và nhận diện mã QR e-Pass
          </p>
        </div>

        <div className="flex items-center gap-2 text-[13px] bg-white px-3 py-1.5 rounded border border-[#D9E1DC]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#008A4B]" />
          <span className="text-[#1F2937] font-medium">Hệ thống Sensor e-Gate: Hoạt động tốt</span>
        </div>
      </div>

      {/* Checkpoint selector tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {INITIAL_CHECKPOINTS.map((gate) => {
          const isSelected = selectedGate === gate.id;
          return (
            <button
              key={gate.id}
              type="button"
              onClick={() => {
                setSelectedGate(gate.id);
                setScanResult(null);
              }}
              className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#E8F3EE] border-[#006B3F] text-[#006B3F]'
                  : 'bg-[#FFFFFF] border-[#D9E1DC] text-[#1F2937] hover:bg-[#F5F7F6]'
              }`}
            >
              <div className="text-[14px] font-semibold truncate leading-tight">{gate.name}</div>
              <div className="text-[12px] text-[#6B7280] mt-1">{gate.province}</div>
              <div className="mt-2 text-[11px] font-medium flex items-center justify-between">
                <span>Hôm nay:</span>
                <span className="font-bold text-[#1F2937]">{gate.todayCount} lượt</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Monitoring Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Cổng kiểm soát Barie Lanes */}
        <div className="lg:col-span-7 space-y-4">
          <Card
            title={`Các luồng Barie e-Gate - ${currentGate.name}`}
            subtitle="Tự động nhận diện biển số & đối soát thẻ e-Pass"
          >
            <div className="space-y-3">
              {/* Lane 1 */}
              <div className="p-3.5 bg-[#F5F7F6] border border-[#D9E1DC] rounded flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#E8F3EE] text-[#006B3F] flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#1F2937]">
                      Luồng 01: Xe Vận tải & Container xuất nhập khẩu
                    </div>
                    <div className="text-[12px] text-[#6B7280]">
                      Camera nhận diện BKS: 12C-098.45 · Trọng tải: Đạt chuẩn
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 text-[12px] font-medium bg-[#E6F5EE] text-[#008A4B] border border-[#B0DFCA] rounded">
                    Mở Barie (Đã duyệt)
                  </span>
                  <div className="text-[11px] text-[#6B7280] mt-1">Tốc độ qua: 8 giây/xe</div>
                </div>
              </div>

              {/* Lane 2 */}
              <div className="p-3.5 bg-[#F5F7F6] border border-[#D9E1DC] rounded flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#1F2937]">
                      Luồng 02: Xe con & Phương tiện thương nhân
                    </div>
                    <div className="text-[12px] text-[#6B7280]">
                      Đang xử lý quét QR tại trụ kiểm soát Kiosk #02
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 text-[12px] font-medium bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] rounded">
                    Đang quét QR
                  </span>
                  <div className="text-[11px] text-[#6B7280] mt-1">Đang chờ quét...</div>
                </div>
              </div>

              {/* Lane 3 */}
              <div className="p-3.5 bg-[#F5F7F6] border border-[#D9E1DC] rounded flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#FEF9E7] text-[#9A740E] flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#1F2937]">
                      Luồng 03: Cư dân biên giới đi bộ qua lại
                    </div>
                    <div className="text-[12px] text-[#6B7280]">
                      Luồng cửa xoay Turnstile nhận diện vân tay & FaceID
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 text-[12px] font-medium bg-[#E6F5EE] text-[#008A4B] border border-[#B0DFCA] rounded">
                    Thông suốt
                  </span>
                  <div className="text-[11px] text-[#6B7280] mt-1">214 lượt/giờ</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Trình mô phỏng quét mã e-Pass */}
        <div className="lg:col-span-5 space-y-4">
          <Card
            title="Đầu đọc e-Pass tại Barie (Kiosk Scanner)"
            subtitle="Mô phỏng quét mã QR kiểm tra quyền qua lại biên giới"
          >
            <div className="space-y-4">
              <div className="p-4 bg-[#F5F7F6] border border-[#D9E1DC] rounded text-center">
                <ScanLine className="w-8 h-8 text-[#006B3F] mx-auto animate-bounce" />
                <div className="text-[13px] font-semibold text-[#1F2937] mt-1">
                  Đặt mã QR trước máy quét
                </div>
                <div className="text-[12px] text-[#6B7280]">
                  Hệ thống kiểm tra trực tuyến với cơ sở dữ liệu Bộ Tư lệnh Biên phòng
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-[#1F2937] block">
                  Nhập hoặc chọn mã quét thử nghiệm:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    placeholder="VD: EBP-VN-HN-0018-VALID"
                    className="flex-1 text-[13px] font-mono text-[#1F2937] placeholder:text-[#6B7280] bg-white border border-[#D9E1DC] rounded px-3 py-2 outline-none focus:border-[#006B3F]"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSimulateScan(scanInput)}
                    icon={<QrCode className="w-4 h-4" />}
                  >
                    Quét
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setScanInput('EBP-VN-HN-0018-VALID');
                      handleSimulateScan('EBP-VN-HN-0018-VALID');
                    }}
                    className="text-[12px] bg-[#E8F3EE] text-[#006B3F] px-2 py-1 rounded border border-[#D9E1DC] hover:bg-[#006B3F] hover:text-white transition-colors"
                  >
                    ✓ Thử thẻ Hợp Lệ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setScanInput('EBP-VN-MC-0023-WARN');
                      handleSimulateScan('EBP-VN-MC-0023-WARN');
                    }}
                    className="text-[12px] bg-[#FEF9E7] text-[#9A740E] px-2 py-1 rounded border border-[#F4E29D] hover:bg-[#D6A928] hover:text-white transition-colors"
                  >
                    ⚠ Thử thẻ Cảnh Báo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setScanInput('EBP-VN-LC-0024-REJECTED');
                      handleSimulateScan('EBP-VN-LC-0024-REJECTED');
                    }}
                    className="text-[12px] bg-[#FEECEC] text-[#D71920] px-2 py-1 rounded border border-[#FCA5A5] hover:bg-[#D71920] hover:text-white transition-colors"
                  >
                    ✕ Thử Blacklist
                  </button>
                </div>
              </div>

              {/* Scan result display */}
              {scanResult && (
                <div
                  className={`p-4 rounded border text-[13px] ${
                    scanResult.status === 'VALID'
                      ? 'bg-[#E6F5EE] border-[#B0DFCA] text-[#008A4B]'
                      : scanResult.status === 'WARN'
                      ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#D97706]'
                      : 'bg-[#FEECEC] border-[#FCA5A5] text-[#D71920]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {scanResult.status === 'VALID' && (
                      <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#008A4B]" />
                    )}
                    {scanResult.status === 'WARN' && (
                      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-[#D97706]" />
                    )}
                    {scanResult.status === 'INVALID' && (
                      <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-[#D71920]" />
                    )}
                    <div>
                      <strong className="block font-semibold text-[14px]">
                        {scanResult.message}
                      </strong>
                      <p className="mt-1 text-[#1F2937]">{scanResult.details}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
