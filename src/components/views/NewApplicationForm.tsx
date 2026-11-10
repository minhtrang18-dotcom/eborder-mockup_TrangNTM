import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  User,
  Car,
} from 'lucide-react';
import { BorderPassApplication, PassType } from '../../types/borderPass';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input, Select } from '../ui/Input';

interface NewApplicationFormProps {
  onSubmit: (app: BorderPassApplication) => void;
  onCancel: () => void;
}

export const NewApplicationForm: React.FC<NewApplicationFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [dob, setDob] = useState('1990-01-01');
  const [phone, setPhone] = useState('');
  const [residence, setResidence] = useState('');
  const [checkpoint, setCheckpoint] = useState('Cửa khẩu Quốc tế Hữu Nghị');
  const [passType, setPassType] = useState<PassType>('THUONG_TRU');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Vui lòng nhập họ và tên';
    if (!nationalId.trim() || nationalId.length < 9) {
      errs.nationalId = 'Số CCCD / Hộ chiếu phải từ 9-12 ký tự hợp lệ';
    }
    if (!phone.trim()) errs.phone = 'Vui lòng nhập số điện thoại liên hệ';
    if (!residence.trim()) errs.residence = 'Vui lòng nhập địa chỉ thường trú vùng biên giới';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newApp: BorderPassApplication = {
      id: `BP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      applicantName: fullName,
      nationalId,
      gender,
      dob: dob.split('-').reverse().join('/'),
      phoneNumber: phone,
      residenceAddress: residence,
      checkpoint,
      passType,
      submissionDate: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      expiryDate: 'Chờ cấp',
      vehiclePlate: vehiclePlate.trim() || undefined,
      status: 'PENDING',
      statusNote: 'Hồ sơ mới tiếp nhận trực tuyến, đang chờ cán bộ trạm phân công kiểm tra',
      officerInCharge: 'Đ/c Đại úy Nguyễn Minh Tuấn',
      avatarUrl:
        gender === 'Nam'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      qrCodeToken: `EBP-NEW-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    onSubmit(newApp);
    setSubmittedSuccess(true);
  };

  if (submittedSuccess) {
    return (
      <Card className="max-w-2xl mx-auto my-8 p-8 text-center bg-white border border-[#D9E1DC]">
        <div className="w-16 h-16 rounded-full bg-[#E8F3EE] text-[#006B3F] mx-auto flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-[#008A4B]" />
        </div>
        <h3 className="text-[20px] font-bold text-[#1F2937] mt-4">
          Nộp hồ sơ cấp giấy phép thông hành thành công!
        </h3>
        <p className="text-[14px] text-[#6B7280] mt-2 max-w-md mx-auto">
          Hồ sơ đã được gửi đến Đồn Biên phòng cửa khẩu để kiểm tra thông tin nhân thân và đối soát
          Cơ sở dữ liệu dân cư.
        </p>

        <div className="mt-6 p-4 bg-[#F5F7F6] rounded border border-[#D9E1DC] max-w-md mx-auto text-left text-[13px] space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Đương đơn:</span>
            <span className="font-semibold text-[#1F2937]">{fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7280]">CCCD:</span>
            <span className="font-mono text-[#1F2937]">{nationalId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Cửa khẩu:</span>
            <span className="text-[#1F2937]">{checkpoint}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Trạng thái:</span>
            <span className="text-[#9A740E] font-medium">Chờ phê duyệt</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Về danh sách hồ sơ
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setSubmittedSuccess(false);
              setFullName('');
              setNationalId('');
              setPhone('');
              setResidence('');
              setVehiclePlate('');
            }}
          >
            Đăng ký hồ sơ khác
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-[22px] font-bold text-[#1F2937]">
          Đăng ký cấp Giấy phép Thông hành Biên giới
        </h2>
        <p className="text-[14px] text-[#6B7280] mt-1">
          Áp dụng cho công dân Việt Nam thường trú hoặc hoạt động kinh tế, vận tải tại khu vực biên giới.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nhóm 1: Thông tin cá nhân */}
        <Card
          title="1. Thông tin đương đơn xin cấp giấy phép"
          subtitle="Dữ liệu được tích hợp đối soát tự động cùng Hệ thống Căn cước công dân"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Họ và tên công dân"
              placeholder="VD: NGUYỄN VĂN AN"
              value={fullName}
              onChange={(e) => setFullName(e.target.value.toUpperCase())}
              error={errors.fullName}
              required
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Số Căn cước (CCCD) / Hộ chiếu"
              placeholder="Nhập 12 số CCCD"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              error={errors.nationalId}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Giới tính"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Nam' | 'Nữ')}
                options={[
                  { value: 'Nam', label: 'Nam' },
                  { value: 'Nữ', label: 'Nữ' },
                ]}
              />

              <Input
                label="Ngày tháng năm sinh"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>

            <Input
              label="Số điện thoại di động"
              placeholder="VD: 0912 345 678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
              required
            />

            <div className="md:col-span-2">
              <Input
                label="Địa chỉ thường trú tại xã/phường khu vực biên giới"
                placeholder="VD: Xã Đồng Đăng, Huyện Cao Lộc, Tỉnh Lạng Sơn"
                value={residence}
                onChange={(e) => setResidence(e.target.value)}
                error={errors.residence}
                helperText="Công dân cần có hộ khẩu thường trú hoặc đăng ký tạm trú hợp lệ tại địa bàn giáp ranh"
                required
              />
            </div>
          </div>
        </Card>

        {/* Nhóm 2: Cửa khẩu & Phương tiện */}
        <Card
          title="2. Mục đích qua lại, Cửa khẩu & Phương tiện"
          subtitle="Thông tin phục vụ phân luồng e-Gate và kiểm tra trọng tải liên vận"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Cửa khẩu đăng ký thường xuyên qua lại"
              value={checkpoint}
              onChange={(e) => setCheckpoint(e.target.value)}
              options={[
                { value: 'Cửa khẩu Quốc tế Hữu Nghị', label: 'Cửa khẩu Quốc tế Hữu Nghị (Lạng Sơn)' },
                { value: 'Cửa khẩu Quốc tế Móng Cái', label: 'Cửa khẩu Quốc tế Móng Cái (Quảng Ninh)' },
                { value: 'Cửa khẩu Quốc tế Lào Cai', label: 'Cửa khẩu Quốc tế Lào Cai' },
                { value: 'Cửa khẩu Quốc tế Mộc Bài', label: 'Cửa khẩu Quốc tế Mộc Bài (Tây Ninh)' },
                { value: 'Cửa khẩu Tân Thanh', label: 'Cửa khẩu Tân Thanh (Lạng Sơn)' },
              ]}
              required
            />

            <Select
              label="Diện đề nghị cấp phép"
              value={passType}
              onChange={(e) => setPassType(e.target.value as PassType)}
              options={[
                { value: 'THUONG_TRU', label: 'Cư dân biên giới thường trú' },
                { value: 'KINH_DOANH', label: 'Thương nhân buôn bán / Trao đổi hàng hóa' },
                { value: 'VAN_TAI', label: 'Lái xe vận tải hàng hóa liên vận' },
                { value: 'THAM_THAN', label: 'Thăm thân nhân / Việc riêng hợp pháp' },
              ]}
              required
            />

            <div className="md:col-span-2">
              <Input
                label="Biển số kiểm soát phương tiện (Nếu có)"
                placeholder="VD: 12C-123.45 hoặc để trống nếu đi bộ qua luồng cư dân"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                helperText="Phương tiện vận tải qua lại biên giới phải có Giấy phép liên vận hợp lệ"
                leftIcon={<Car className="w-4 h-4" />}
              />
            </div>
          </div>
        </Card>

        {/* Nhóm 3: Giấy tờ đính kèm */}
        <Card
          title="3. Hồ sơ và tài liệu điện tử đính kèm"
          subtitle="Tải lên ảnh 3x4 tiêu chuẩn quốc tế và ảnh chụp CCCD"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-[#D9E1DC] rounded p-5 text-center bg-[#F5F7F6] hover:bg-[#FFFFFF] transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-[#006B3F] mx-auto mb-2" />
              <div className="text-[13px] font-semibold text-[#1F2937]">
                Ảnh chân dung 3x4 (Nền trắng)
              </div>
              <div className="text-[12px] text-[#6B7280] mt-1">
                Định dạng JPG, PNG không quá 5MB
              </div>
              <span className="inline-block mt-3 text-[12px] font-medium text-[#006B3F] bg-[#E8F3EE] px-2.5 py-1 rounded">
                Chọn tệp từ máy
              </span>
            </div>

            <div className="border-2 border-dashed border-[#D9E1DC] rounded p-5 text-center bg-[#F5F7F6] hover:bg-[#FFFFFF] transition-colors cursor-pointer">
              <FileText className="w-8 h-8 text-[#006B3F] mx-auto mb-2" />
              <div className="text-[13px] font-semibold text-[#1F2937]">
                Bản chụp Căn cước công dân (2 mặt)
              </div>
              <div className="text-[12px] text-[#6B7280] mt-1">
                Rõ nét, không bị lóa hoặc mất góc
              </div>
              <span className="inline-block mt-3 text-[12px] font-medium text-[#006B3F] bg-[#E8F3EE] px-2.5 py-1 rounded">
                Chọn tệp từ máy
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-[#E8F3EE] rounded border border-[#D9E1DC] flex items-center gap-2.5 text-[13px] text-[#1F2937]">
            <ShieldCheck className="w-5 h-5 text-[#008A4B] shrink-0" />
            <span>
              Tôi cam đoan các thông tin kê khai trên là hoàn toàn chính xác và chịu mọi trách nhiệm
              trước pháp luật về Quy chế khu vực biên giới đất liền.
            </span>
          </div>
        </Card>

        {/* Nút hành động */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onCancel}>
            Hủy thao tác
          </Button>
          <Button
            variant="primary"
            type="submit"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Gửi thẩm định hồ sơ
          </Button>
        </div>
      </form>
    </div>
  );
};
