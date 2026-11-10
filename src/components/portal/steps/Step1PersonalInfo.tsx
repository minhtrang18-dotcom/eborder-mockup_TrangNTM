import React from 'react';
import {
  User,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ScanFace,
  FileText,
  Fingerprint,
} from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input, Select } from '../../ui/Input';
import { LAO_ETHNIC_GROUPS, RELIGION_OPTIONS } from '../laoAdminData';

interface Step1PersonalInfoProps {
  userAccountName: string;
  fullNameLatin: string;
  setFullNameLatin: (val: string) => void;
  dob: string;
  setDob: (val: string) => void;
  gender: '' | 'Nam' | 'Nữ' | 'Chưa có thông tin';
  setGender: (val: '' | 'Nam' | 'Nữ' | 'Chưa có thông tin') => void;
  ethnicity: string;
  setEthnicity: (val: string) => void;
  religion: string;
  setReligion: (val: string) => void;

  portraitImgUrl: string;
  portraitInputRef: React.RefObject<HTMLInputElement | null>;
  onPortraitFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckPhotoQuality: () => void;
  qualityCheckStatus: {
    checked: boolean;
    passed: boolean;
    message: string;
  } | null;

  nationalId: string;
  setNationalId: (val: string) => void;
  idIssueDate: string;
  setIdIssueDate: (val: string) => void;
  idIssuePlace: string;
  setIdIssuePlace: (val: string) => void;
  householdBookNo: string;
  setHouseholdBookNo: (val: string) => void;
  householdIssueDate: string;
  setHouseholdIssueDate: (val: string) => void;
  householdIssuePlace: string;
  setHouseholdIssuePlace: (val: string) => void;

  heightCm: string;
  setHeightCm: (val: string) => void;
  scars: string;
  setScars: (val: string) => void;
  scarsLocation: string;
  setScarsLocation: (val: string) => void;

  errors: Record<string, string>;
  clearError: (id: string) => void;
}

export const Step1PersonalInfo: React.FC<Step1PersonalInfoProps> = ({
  userAccountName,
  fullNameLatin,
  setFullNameLatin,
  dob,
  setDob,
  gender,
  setGender,
  ethnicity,
  setEthnicity,
  religion,
  setReligion,
  portraitImgUrl,
  portraitInputRef,
  onPortraitFileChange,
  onCheckPhotoQuality,
  qualityCheckStatus,
  nationalId,
  setNationalId,
  idIssueDate,
  setIdIssueDate,
  idIssuePlace,
  setIdIssuePlace,
  householdBookNo,
  setHouseholdBookNo,
  householdIssueDate,
  setHouseholdIssueDate,
  householdIssuePlace,
  setHouseholdIssuePlace,
  heightCm,
  setHeightCm,
  scars,
  setScars,
  scarsLocation,
  setScarsLocation,
  errors,
  clearError,
}) => {
  return (
    <div className="space-y-8">
      {/* Tiêu đề bước & dòng hướng dẫn ngắn */}
      <div>
        <h2 className="text-2xl font-bold text-[#1F2937]">Bước 1: Thông tin cá nhân</h2>
        <p className="text-[16px] text-[#4B5563] mt-1">
          Hãy điền thông tin của bạn như trên giấy tờ tùy thân.
        </p>
        <p className="text-[14px] text-[#D71920] font-medium mt-1">
          * Các trường có dấu sao là bắt buộc
        </p>
      </div>

      {/* THẺ 1: THÔNG TIN CÁ NHÂN */}
      <Card>
        <div className="space-y-6">
          <div className="text-[15px] font-bold text-[#006B3F] uppercase tracking-wide flex items-center gap-2 border-b border-[#D9E1DC] pb-3">
            <User className="w-5 h-5 text-[#006B3F]" />
            <span>Thông tin cá nhân</span>
          </div>

          {/* Bố cục 2 cột trên máy tính: Bên trái là Ảnh chân dung, Bên phải là các trường thông tin */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cột trái (Máy tính: col-span-5, Điện thoại: trên cùng) */}
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[#D9E1DC] pb-6 lg:pb-0 lg:pr-6">
              <div id="field-portrait" className="space-y-4">
                <label className="text-[15px] font-semibold text-[#1F2937] flex items-center justify-between">
                  <span>Ảnh chân dung 3x4 cm</span>
                  <span className="text-[#D71920] font-bold">*</span>
                </label>

                <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-4">
                  {/* Khung xem trước ảnh */}
                  <div
                    className={`w-36 h-48 shrink-0 rounded-lg bg-white border-2 overflow-hidden flex flex-col items-center justify-center relative shadow-sm ${
                      errors['field-portrait']
                        ? 'border-[#D71920] bg-[#FFF5F5]'
                        : 'border-[#D9E1DC]'
                    }`}
                  >
                    {portraitImgUrl ? (
                      <img
                        src={portraitImgUrl}
                        alt="Ảnh chân dung công dân"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-3 text-center text-[#9CA3AF]">
                        <User className="w-12 h-12 mb-1" />
                        <span className="text-[13px] font-medium">Chưa có ảnh</span>
                      </div>
                    )}
                    {portraitImgUrl && (
                      <span className="absolute bottom-2 right-2 bg-[#008A4B] text-white p-1 rounded-full shadow-xs">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  {/* Vùng chọn ảnh và kiểm tra chất lượng */}
                  <div className="w-full space-y-3">
                    <div
                      onClick={() => portraitInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-lg p-4 text-center bg-white transition-colors cursor-pointer hover:border-[#006B3F] group ${
                        errors['field-portrait']
                          ? 'border-[#D71920] bg-[#FFF5F5]'
                          : 'border-[#D9E1DC]'
                      }`}
                    >
                      <Upload className="w-6 h-6 text-[#006B3F] mx-auto mb-1 group-hover:scale-110 transition-transform" />
                      <div className="text-[14px] font-semibold text-[#1F2937]">
                        <span className="text-[#006B3F] underline">Chọn ảnh</span> hoặc kéo thả vào đây
                      </div>
                      <div className="text-[13px] text-[#6B7280]">
                        JPG, PNG, WEBP (tối đa 5MB)
                      </div>
                      <input
                        type="file"
                        ref={portraitInputRef}
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={onPortraitFileChange}
                      />
                    </div>
                  </div>
                </div>

                {errors['field-portrait'] && (
                  <p className="text-[13px] text-[#D71920] font-medium flex items-center gap-1.5 mt-1">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{errors['field-portrait']}</span>
                  </p>
                )}

                {qualityCheckStatus && (
                  <div
                    className={`p-3 border rounded-lg flex items-start gap-2 text-[13px] animate-fadeIn ${
                      qualityCheckStatus.passed
                        ? 'bg-[#E6F5EE] border-[#B0DFCA] text-[#008A4B]'
                        : 'bg-[#FFF5F5] border-[#FCA5A5] text-[#D71920]'
                    }`}
                  >
                    {qualityCheckStatus.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#008A4B] shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5" />
                    )}
                    <div className="leading-snug">{qualityCheckStatus.message}</div>
                  </div>
                )}

                <div className="p-3 bg-[#F5F7F6] border border-[#D9E1DC] rounded-lg text-[13px] text-[#4B5563] leading-relaxed">
                  <strong>Quy cách ảnh:</strong> Cỡ 3x4, chụp không quá 6 tháng, phông nền trắng hoặc sáng màu, mặt nhìn thẳng, đầu để trần, không đeo kính râm.
                </div>
              </div>
            </div>

            {/* Cột phải: Các trường thông tin cá nhân (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Họ và tên (chỉ đọc) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[15px] font-medium text-[#1F2937] flex items-center">
                    <span>Họ và tên</span>
                    <span className="text-[#D71920] ml-1 font-bold">*</span>
                  </label>
                  <div className="w-full text-[16px] text-[#1F2937] bg-[#F5F7F6] border border-[#D9E1DC] rounded-lg px-3.5 py-2.5 font-medium select-none cursor-default truncate">
                    {userAccountName}
                  </div>
                  <span className="text-[12px] text-[#6B7280]">
                    Trường chỉ đọc lấy từ tài khoản đã đăng nhập
                  </span>
                </div>

                {/* Họ và tên (Latin) chuyển xuống dưới, cho phép nhập, placeholder: Nhập họ và tên (Latin) */}
                <div id="field-fullNameLatin" className="md:col-span-2">
                  <Input
                    label="Họ và tên (Latin)"
                    placeholder="Nhập họ và tên (Latin)"
                    value={fullNameLatin}
                    onChange={(e) => {
                      setFullNameLatin(e.target.value.toUpperCase());
                      clearError('field-fullNameLatin');
                    }}
                    required
                    error={errors['field-fullNameLatin']}
                    className="text-[16px] py-2.5"
                  />
                </div>

                {/* Ngày sinh */}
                <div id="field-dob" className="space-y-1">
                  <Input
                    label="Ngày, tháng, năm sinh"
                    type="date"
                    value={dob}
                    onChange={(e) => {
                      setDob(e.target.value);
                      clearError('field-dob');
                    }}
                    required
                    error={errors['field-dob']}
                    className="text-[16px] py-2.5"
                  />
                  <p className="text-[12px] text-[#6B7280]">
                    Người đề nghị phải từ đủ 12 tuổi trở lên.
                  </p>
                </div>

                {/* Giới tính */}
                <div id="field-gender">
                  <Select
                    label="Giới tính"
                    value={gender}
                    onChange={(e) => {
                      setGender(e.target.value as any);
                      clearError('field-gender');
                    }}
                    required
                    error={errors['field-gender']}
                    options={[
                      { value: '', label: 'Chọn giới tính...' },
                      { value: 'Nam', label: 'Nam' },
                      { value: 'Nữ', label: 'Nữ' },
                      { value: 'Chưa có thông tin', label: 'Chưa có thông tin' },
                    ]}
                    className="text-[16px] py-2.5"
                  />
                </div>

                {/* Dân tộc */}
                <div id="field-ethnicity">
                  <Select
                    label="Dân tộc"
                    value={ethnicity}
                    onChange={(e) => {
                      setEthnicity(e.target.value);
                      clearError('field-ethnicity');
                    }}
                    required
                    error={errors['field-ethnicity']}
                    options={[
                      { value: '', label: 'Chọn dân tộc...' },
                      ...LAO_ETHNIC_GROUPS.map((g) => ({ value: g, label: g })),
                    ]}
                    className="text-[16px] py-2.5"
                  />
                </div>

                {/* Tôn giáo */}
                <div id="field-religion">
                  <Select
                    label="Tôn giáo"
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                    options={[
                      { value: '', label: 'Chọn tôn giáo (không bắt buộc)...' },
                      ...RELIGION_OPTIONS.map((r) => ({ value: r, label: r })),
                    ]}
                    className="text-[16px] py-2.5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* THẺ 2: GIẤY TỜ TÙY THÂN */}
      <Card>
        <div className="space-y-6">
          <div className="text-[15px] font-bold text-[#006B3F] uppercase tracking-wide flex items-center gap-2 border-b border-[#D9E1DC] pb-3">
            <FileText className="w-5 h-5 text-[#006B3F]" />
            <span>Giấy tờ tùy thân</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Số định danh (điền sẵn, sửa được) */}
            <div id="field-nationalId">
              <Input
                label="Số định danh"
                placeholder="Nhập 13 chữ số"
                value={nationalId}
                onChange={(e) => {
                  setNationalId(e.target.value);
                  clearError('field-nationalId');
                }}
                required
                error={errors['field-nationalId']}
                className="text-[16px] py-2.5"
                helperText="Điền sẵn từ tài khoản, công dân có thể chỉnh sửa nếu cần"
              />
            </div>

            {/* Ngày cấp căn cước / CMND */}
            <div id="field-idIssueDate">
              <Input
                label="Ngày cấp CCCD/CMND"
                type="date"
                value={idIssueDate}
                onChange={(e) => setIdIssueDate(e.target.value)}
                className="text-[16px] py-2.5"
              />
            </div>

            {/* Nơi cấp căn cước / CMND */}
            <div id="field-idIssuePlace" className="md:col-span-2">
              <Input
                label="Nơi cấp căn cước / CMND"
                placeholder="VD: Cục Cảnh sát QLHC về TTXH"
                value={idIssuePlace}
                onChange={(e) => setIdIssuePlace(e.target.value)}
                className="text-[16px] py-2.5"
              />
            </div>

            {/* Số sổ hộ khẩu */}
            <div id="field-householdBookNo">
              <Input
                label="Số sổ hộ khẩu"
                placeholder="Nhập số sổ hộ khẩu..."
                value={householdBookNo}
                onChange={(e) => {
                  setHouseholdBookNo(e.target.value);
                  clearError('field-householdBookNo');
                }}
                required
                error={errors['field-householdBookNo']}
                className="text-[16px] py-2.5"
              />
            </div>

            {/* Ngày cấp sổ hộ khẩu */}
            <div id="field-householdIssueDate">
              <Input
                label="Ngày cấp sổ hộ khẩu"
                type="date"
                value={householdIssueDate}
                onChange={(e) => setHouseholdIssueDate(e.target.value)}
                className="text-[16px] py-2.5"
              />
            </div>

            {/* Nơi cấp sổ hộ khẩu */}
            <div id="field-householdIssuePlace" className="md:col-span-2">
              <Input
                label="Nơi cấp"
                placeholder="VD: Công an huyện..."
                value={householdIssuePlace}
                onChange={(e) => setHouseholdIssuePlace(e.target.value)}
                className="text-[16px] py-2.5"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* THẺ 3: ĐẶC ĐIỂM NHẬN DẠNG */}
      <Card>
        <div className="space-y-6">
          <div className="text-[15px] font-bold text-[#006B3F] uppercase tracking-wide flex items-center gap-2 border-b border-[#D9E1DC] pb-3">
            <Fingerprint className="w-5 h-5 text-[#006B3F]" />
            <span>Đặc điểm nhận dạng</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Chiều cao */}
            <div id="field-height">
              <Input
                label="Chiều cao (cm)"
                type="number"
                placeholder="VD: 168"
                value={heightCm}
                onChange={(e) => {
                  setHeightCm(e.target.value);
                  clearError('field-height');
                }}
                required
                error={errors['field-height']}
                className="text-[16px] py-2.5"
                helperText="Chiều cao từ 51 đến 250 cm"
              />
            </div>

            {/* Vết sẹo */}
            <div id="field-scars">
              <Input
                label="Vết sẹo / Dị tật đặc biệt (nếu có)"
                placeholder="VD: Sẹo chấm cách đuôi mắt phải 1cm (hoặc để trống)"
                value={scars}
                onChange={(e) => setScars(e.target.value)}
                className="text-[16px] py-2.5"
              />
            </div>

            {/* Vị trí vết sẹo */}
            <div id="field-scarsLocation" className="md:col-span-2">
              <Input
                label="Vị trí vết sẹo"
                placeholder="VD: Đuôi lông mày phải, má trái..."
                value={scarsLocation}
                onChange={(e) => setScarsLocation(e.target.value)}
                className="text-[16px] py-2.5"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
