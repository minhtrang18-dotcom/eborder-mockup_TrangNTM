import React from 'react';
import {
  Check,
  Shield,
  Layers,
  Palette,
  Type,
  MousePointer,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { Card } from '../ui/Card';
import { Input, Select } from '../ui/Input';

export const DesignSystemShowcase: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-[22px] font-bold text-[#1F2937] flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-[#006B3F]" />
            Bảng Đối Soát Quy Chuẩn Giao Diện "e-Border Pass"
          </h2>
          <p className="text-[14px] text-[#6B7280] mt-1">
            Xác nhận và minh chứng việc tuân thủ 100% token, màu sắc, font chữ và các thành phần giao diện
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#E8F3EE] border border-[#006B3F]/30 text-[#006B3F] text-[13px] font-semibold">
          <CheckCircle2 className="w-4 h-4 text-[#008A4B]" />
          Đã kiểm định đúng chuẩn Design System
        </div>
      </div>

      {/* 1. BẢNG MÀU CHỦ ĐẠO & HỆ THỐNG TOKEN */}
      <Card
        title="1. Hệ thống Màu sắc (Color Tokens)"
        subtitle="Màu chữ, Màu chủ đạo, Nền, Border và Trạng thái theo đúng mã Hex"
      >
        <div className="space-y-6">
          {/* Màu chủ đạo */}
          <div>
            <h4 className="text-[14px] font-semibold text-[#1F2937] mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#006B3F]" />
              Màu chủ đạo & Hệ thống giao diện:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {[
                { name: 'Xanh lá chính', hex: '#006B3F', text: '#FFFFFF', desc: 'Primary brand' },
                { name: 'Xanh đậm / Hover', hex: '#004D2C', text: '#FFFFFF', desc: 'Hover state' },
                { name: 'Xanh nhạt / Active', hex: '#E8F3EE', text: '#006B3F', desc: 'Active bg' },
                { name: 'Vàng nhấn', hex: '#D6A928', text: '#1F2937', desc: 'Accent gold' },
                { name: 'Đỏ cảnh báo/từ chối', hex: '#D71920', text: '#FFFFFF', desc: 'Danger/Alert' },
                { name: 'Nền tổng thể', hex: '#F5F7F6', text: '#1F2937', desc: 'Page background' },
                { name: 'Nền Card/Form', hex: '#FFFFFF', text: '#1F2937', desc: 'Card background' },
                { name: 'Border', hex: '#D9E1DC', text: '#1F2937', desc: 'Standard border' },
              ].map((c) => (
                <div key={c.hex} className="border border-[#D9E1DC] rounded overflow-hidden text-center bg-white">
                  <div
                    className="h-14 flex items-center justify-center font-mono text-[12px] font-bold"
                    style={{ backgroundColor: c.hex, color: c.text }}
                  >
                    {c.hex}
                  </div>
                  <div className="p-2 text-[12px]">
                    <div className="font-semibold text-[#1F2937] truncate">{c.name}</div>
                    <div className="text-[#6B7280] text-[11px] truncate">{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Màu chữ quy chuẩn */}
          <div>
            <h4 className="text-[14px] font-semibold text-[#1F2937] mb-3">
              Màu chữ (Typography Colors):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#FFFFFF] border border-[#D9E1DC] rounded">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#1F2937] text-[13px]">Chữ chính</span>
                  <span className="font-mono text-xs text-[#1F2937] bg-[#F5F7F6] px-1.5 py-0.5 rounded">
                    #1F2937
                  </span>
                </div>
                <p className="text-[14px] text-[#1F2937]">
                  Mặc định cho MỌI văn bản trong toàn bộ hệ thống
                </p>
              </div>

              <div className="p-3 bg-[#FFFFFF] border border-[#D9E1DC] rounded">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#6B7280] text-[13px]">Chữ phụ</span>
                  <span className="font-mono text-xs text-[#6B7280] bg-[#F5F7F6] px-1.5 py-0.5 rounded">
                    #6B7280
                  </span>
                </div>
                <p className="text-[14px] text-[#6B7280]">
                  Dùng cho mô tả, ghi chú hướng dẫn, placeholder
                </p>
              </div>

              <div className="p-3 bg-[#FFFFFF] border border-[#D9E1DC] rounded">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#9CA3AF] text-[13px]">Chữ disabled</span>
                  <span className="font-mono text-xs text-[#9CA3AF] bg-[#F5F7F6] px-1.5 py-0.5 rounded">
                    #9CA3AF
                  </span>
                </div>
                <p className="text-[14px] text-[#9CA3AF]">
                  Dùng cho trạng thái vô hiệu hóa, không khả dụng
                </p>
              </div>
            </div>
          </div>

          {/* Màu trạng thái Badge */}
          <div>
            <h4 className="text-[14px] font-semibold text-[#1F2937] mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#006B3F]" />
              Màu trạng thái (Badge hồ sơ):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div className="p-3 bg-white border border-[#D9E1DC] rounded space-y-2">
                <div className="text-[12px] font-semibold text-[#6B7280]">Thành công / Hoàn tất</div>
                <StatusBadge status="APPROVED" />
                <div className="font-mono text-[11px] text-[#6B7280]">#008A4B</div>
              </div>

              <div className="p-3 bg-white border border-[#D9E1DC] rounded space-y-2">
                <div className="text-[12px] font-semibold text-[#6B7280]">Đang xử lý / Thông tin</div>
                <StatusBadge status="PROCESSING" />
                <div className="font-mono text-[11px] text-[#6B7280]">#2563EB</div>
              </div>

              <div className="p-3 bg-white border border-[#D9E1DC] rounded space-y-2">
                <div className="text-[12px] font-semibold text-[#6B7280]">Chờ xử lý / Phê duyệt</div>
                <StatusBadge status="PENDING" />
                <div className="font-mono text-[11px] text-[#6B7280]">#D6A928</div>
              </div>

              <div className="p-3 bg-white border border-[#D9E1DC] rounded space-y-2">
                <div className="text-[12px] font-semibold text-[#6B7280]">Cảnh báo</div>
                <StatusBadge status="WARNING" />
                <div className="font-mono text-[11px] text-[#6B7280]">#D97706</div>
              </div>

              <div className="p-3 bg-white border border-[#D9E1DC] rounded space-y-2">
                <div className="text-[12px] font-semibold text-[#6B7280]">Lỗi / Từ chối / Blacklist</div>
                <StatusBadge status="REJECTED" />
                <div className="font-mono text-[11px] text-[#6B7280]">#D71920</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. TYPOGRAPHY SCALE */}
      <Card
        title="2. Thang cỡ chữ (Typography Scale - Inter)"
        subtitle="Áp dụng chuẩn theo cấu trúc phân cấp thông tin hành chính"
      >
        <div className="divide-y divide-[#D9E1DC]">
          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-[13px] font-medium text-[#6B7280] w-48 shrink-0">
              Tiêu đề trang (20–24px, SemiBold/Bold):
            </span>
            <div className="text-[22px] font-bold text-[#1F2937]">
              Hệ Thống Cấp Phép Thông Hành Biên Giới Điện Tử
            </div>
          </div>

          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-[13px] font-medium text-[#6B7280] w-48 shrink-0">
              Tiêu đề nhóm/section (16–18px, SemiBold):
            </span>
            <div className="text-[17px] font-semibold text-[#1F2937]">
              Thông tin nhân thân & Xác thực Căn cước công dân
            </div>
          </div>

          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-[13px] font-medium text-[#6B7280] w-48 shrink-0">
              Nội dung thông thường (14px, Regular):
            </span>
            <div className="text-[14px] text-[#1F2937]">
              Công dân xuất trình mã QR e-Pass tại đầu đọc e-Gate để hệ thống mở barie tự động.
            </div>
          </div>

          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-[13px] font-medium text-[#6B7280] w-48 shrink-0">
              Nội dung trong bảng (13–14px):
            </span>
            <div className="text-[13px] text-[#1F2937] font-mono">
              BP-2026-0018 · Hoàng Văn Toàn · CCCD: 020088001923 · BKS: 12C-098.45
            </div>
          </div>

          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-[13px] font-medium text-[#6B7280] w-48 shrink-0">
              Label trường form (13–14px, Medium):
            </span>
            <div className="text-[13px] font-medium text-[#1F2937]">
              Số Căn cước công dân (CCCD) / Hộ chiếu hợp lệ *
            </div>
          </div>

          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-[13px] font-medium text-[#6B7280] w-48 shrink-0">
              Chữ trong button (14px, Medium/SemiBold):
            </span>
            <div className="flex gap-2">
              <Button size="sm">Button Nhỏ 13px</Button>
              <Button size="md">Button Tiêu Chuẩn 14px</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. BUTTONS & MENU STATES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Buttons */}
        <Card
          title="3. Quy chuẩn Nút bấm (Button Variants)"
          subtitle="Đầy đủ 4 biến thể theo thông số thiết kế"
        >
          <div className="space-y-4">
            <div className="p-3 bg-[#F5F7F6] rounded border border-[#D9E1DC] flex items-center justify-between">
              <div>
                <div className="text-[13px] font-semibold text-[#1F2937]">Primary</div>
                <div className="text-[12px] text-[#6B7280]">nền #006B3F, chữ #FFFFFF; hover #004D2C</div>
              </div>
              <Button variant="primary">Phê duyệt cấp thẻ</Button>
            </div>

            <div className="p-3 bg-[#F5F7F6] rounded border border-[#D9E1DC] flex items-center justify-between">
              <div>
                <div className="text-[13px] font-semibold text-[#1F2937]">Secondary</div>
                <div className="text-[12px] text-[#6B7280]">nền #FFFFFF, border #9CA3AF, chữ #1F2937</div>
              </div>
              <Button variant="secondary">Yêu cầu bổ sung</Button>
            </div>

            <div className="p-3 bg-[#F5F7F6] rounded border border-[#D9E1DC] flex items-center justify-between">
              <div>
                <div className="text-[13px] font-semibold text-[#1F2937]">Danger</div>
                <div className="text-[12px] text-[#6B7280]">nền #D71920, chữ #FFFFFF</div>
              </div>
              <Button variant="danger">Từ chối / Khóa thẻ</Button>
            </div>

            <div className="p-3 bg-[#F5F7F6] rounded border border-[#D9E1DC] flex items-center justify-between">
              <div>
                <div className="text-[13px] font-semibold text-[#1F2937]">Ghost</div>
                <div className="text-[12px] text-[#6B7280]">nền trong suốt, chữ #006B3F</div>
              </div>
              <Button variant="ghost">Xem chi tiết</Button>
            </div>
          </div>
        </Card>

        {/* Menu States */}
        <Card
          title="4. Quy chuẩn Menu Điều hướng (Menu States)"
          subtitle="3 trạng thái: Bình thường, Hover và Đang chọn (Active)"
        >
          <div className="space-y-3">
            <div className="space-y-1">
              <span className="text-[12px] font-semibold text-[#6B7280]">
                Trạng thái 1: Bình thường (nền trắng, chữ #1F2937)
              </span>
              <div className="w-full text-left px-5 py-3 bg-[#FFFFFF] text-[#1F2937] font-medium border border-[#D9E1DC] rounded">
                Danh sách hồ sơ cấp phép
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[12px] font-semibold text-[#6B7280]">
                Trạng thái 2: Hover (nền #E8F3EE, chữ #006B3F)
              </span>
              <div className="w-full text-left px-5 py-3 bg-[#E8F3EE] text-[#006B3F] font-medium border border-[#D9E1DC] rounded">
                Danh sách hồ sơ cấp phép
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[12px] font-semibold text-[#6B7280]">
                Trạng thái 3: Đang chọn - Active (nền #E8F3EE, chữ #006B3F, thanh dọc trái #006B3F)
              </span>
              <div className="w-full text-left px-5 py-3 bg-[#E8F3EE] text-[#006B3F] font-semibold border-l-4 border-l-[#006B3F] border border-y-[#D9E1DC] border-r-[#D9E1DC] rounded">
                Danh sách hồ sơ cấp phép
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 5. NGUYÊN TẮC THIẾT KẾ CỐT LÕI */}
      <Card title="5. Cam kết Thực thi Bộ Nguyên Tắc Chung">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
          <div className="p-3 bg-[#F5F7F6] border border-[#D9E1DC] rounded flex items-start gap-2.5">
            <Check className="w-4 h-4 text-[#008A4B] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#1F2937] block">Chữ mặc định LUÔN là đen/xám đậm (#1F2937)</strong>
              <span className="text-[#6B7280]">Không dùng màu xanh lá cho toàn bộ văn bản nội dung.</span>
            </div>
          </div>

          <div className="p-3 bg-[#F5F7F6] border border-[#D9E1DC] rounded flex items-start gap-2.5">
            <Check className="w-4 h-4 text-[#008A4B] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#1F2937] block">Xanh lá (#006B3F) chỉ dùng để highlight</strong>
              <span className="text-[#6B7280]">Chỉ xuất hiện tại: Active, Selected, Focus, Primary action.</span>
            </div>
          </div>

          <div className="p-3 bg-[#F5F7F6] border border-[#D9E1DC] rounded flex items-start gap-2.5">
            <Check className="w-4 h-4 text-[#008A4B] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#1F2937] block">Đỏ (#D71920) sử dụng có chủ đích</strong>
              <span className="text-[#6B7280]">Chỉ áp dụng cho lỗi nhập liệu, từ chối, xóa, cảnh báo an ninh/blacklist.</span>
            </div>
          </div>

          <div className="p-3 bg-[#F5F7F6] border border-[#D9E1DC] rounded flex items-start gap-2.5">
            <Check className="w-4 h-4 text-[#008A4B] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#1F2937] block">Giao diện ít màu, nền sáng, nhiều khoảng trắng</strong>
              <span className="text-[#6B7280]">Nền tổng thể #F5F7F6, Card/Form #FFFFFF, hạn chế gradient & shadow nặng.</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
