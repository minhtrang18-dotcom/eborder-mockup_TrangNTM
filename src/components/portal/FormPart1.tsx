import React from 'react';
import { User, Upload, ScanFace, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { SectionContinueButton } from './SectionContinueButton';
import { AdminUnitCombobox } from './AdminUnitCombobox';
import {
  LAO_ETHNIC_GROUPS,
  LAO_BORDER_PROVINCES,
  SAMPLE_BORDER_CHECKPOINTS,
  TEMPORARY_PASS_CASES,
  IMMIGRATION_OFFICE_OPTIONS,
  matchImmigrationOfficeOption,
} from './laoAdminData';

export const OCCUPATION_OPTIONS = [
  { value: '', label: 'Chọn nghề nghiệp...' },
  { value: 'Nông dân', label: 'Nông dân' },
  { value: 'Công nhân', label: 'Công nhân' },
  { value: 'Buôn bán/Kinh doanh', label: 'Buôn bán/Kinh doanh' },
  { value: 'Cán bộ/Công chức/Viên chức', label: 'Cán bộ/Công chức/Viên chức' },
  { value: 'Giáo viên', label: 'Giáo viên' },
  { value: 'Học sinh/Sinh viên', label: 'Học sinh/Sinh viên' },
  { value: 'Nội trợ', label: 'Nội trợ' },
  { value: 'Lao động tự do', label: 'Lao động tự do' },
  { value: 'Hưu trí', label: 'Hưu trí' },
  { value: 'Khác', label: 'Khác' },
];

export const HAIR_COLOR_OPTIONS = [
  { value: '', label: 'Chọn màu tóc...' },
  { value: 'Đen', label: 'Đen' },
  { value: 'Nâu', label: 'Nâu' },
  { value: 'Vàng', label: 'Vàng' },
  { value: 'Bạc/Trắng', label: 'Bạc/Trắng' },
  { value: 'Khác', label: 'Khác' },
];

export const EYE_COLOR_OPTIONS = [
  { value: '', label: 'Chọn màu mắt...' },
  { value: 'Đen', label: 'Đen' },
  { value: 'Nâu', label: 'Nâu' },
  { value: 'Xanh', label: 'Xanh' },
  { value: 'Khác', label: 'Khác' },
];

export const TRIP_PURPOSE_OPTIONS = [
  { value: '', label: 'Chọn mục đích chuyến đi...' },
  { value: 'Thăm thân', label: 'Thăm thân' },
  { value: 'Du lịch', label: 'Du lịch' },
  { value: 'Công tác', label: 'Công tác' },
  { value: 'Chữa bệnh', label: 'Chữa bệnh' },
  { value: 'Học tập', label: 'Học tập' },
  { value: 'Khác', label: 'Khác' },
];

export interface FormPart1Props {
  procedure?: 'cap-so' | 'tam-thoi';
  donViTiepNhan?: '' | 'Cửa khẩu' | 'Phòng Xuất nhập cảnh';
  setDonViTiepNhan?: (val: '' | 'Cửa khẩu' | 'Phòng Xuất nhập cảnh') => void;
  cuaKhau?: string;
  setCuaKhau?: (val: string) => void;
  phongXNC?: string;
  setPhongXNC?: (val: string) => void;
  truongHopDeNghi?: string;
  setTruongHopDeNghi?: (val: string) => void;
  lyDoCuThe?: string;
  setLyDoCuThe?: (val: string) => void;
  userResidentProvince?: string;
  userAccountName: string;
  userCitizenId: string;
  fullNameLatin: string;
  setFullNameLatin: (val: string) => void;
  dob: string;
  setDob: (val: string) => void;
  onDobChange?: (val: string) => void;
  onDobBlur?: () => void;
  gender: '' | 'Nam' | 'Nữ' | 'Chưa có thông tin';
  setGender: (val: '' | 'Nam' | 'Nữ' | 'Chưa có thông tin') => void;
  ethnicity: string;
  setEthnicity: (val: string) => void;
  religion: string;
  setReligion: (val: string) => void;
  portraitImgUrl: string;
  qualityCheckStatus: { checked: boolean; passed: boolean; message: string } | null;
  onPortraitFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckPhotoQuality: () => void;
  portraitInputRef: React.RefObject<HTMLInputElement | null>;
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
  nationality?: string;
  setNationality?: (val: string) => void;
  occupation?: string;
  setOccupation?: (val: string) => void;
  occupationDetail?: string;
  setOccupationDetail?: (val: string) => void;
  hairColor?: string;
  setHairColor?: (val: string) => void;
  hairColorDetail?: string;
  setHairColorDetail?: (val: string) => void;
  eyeColor?: string;
  setEyeColor?: (val: string) => void;
  eyeColorDetail?: string;
  setEyeColorDetail?: (val: string) => void;
  tripPurpose?: string;
  setTripPurpose?: (val: string) => void;
  tripPurposeDetail?: string;
  setTripPurposeDetail?: (val: string) => void;
  validityStartDate?: string;
  setValidityStartDate?: (val: string) => void;
  validityEndDate?: string;
  setValidityEndDate?: (val: string) => void;
  isCompleted: boolean;
  onContinue: () => void;
  errors: Record<string, string>;
  clearError: (id: string) => void;
  ReadOnlyField: React.FC<{ label: string; value: string; required?: boolean }>;
  isLao?: boolean;
}

export const FormPart1: React.FC<FormPart1Props> = ({
  procedure = 'cap-so',
  donViTiepNhan = '',
  setDonViTiepNhan,
  cuaKhau = '',
  setCuaKhau,
  phongXNC = '',
  setPhongXNC,
  truongHopDeNghi = '',
  setTruongHopDeNghi,
  lyDoCuThe = '',
  setLyDoCuThe,
  userResidentProvince,
  userAccountName,
  userCitizenId,
  fullNameLatin,
  setFullNameLatin,
  dob,
  setDob,
  onDobChange,
  onDobBlur,
  gender,
  setGender,
  ethnicity,
  setEthnicity,
  religion,
  setReligion,
  nationality = 'Lào',
  setNationality,
  occupation = '',
  setOccupation,
  occupationDetail = '',
  setOccupationDetail,
  hairColor = '',
  setHairColor,
  hairColorDetail = '',
  setHairColorDetail,
  eyeColor = '',
  setEyeColor,
  eyeColorDetail = '',
  setEyeColorDetail,
  tripPurpose = '',
  setTripPurpose,
  tripPurposeDetail = '',
  setTripPurposeDetail,
  validityStartDate = '',
  setValidityStartDate,
  validityEndDate = '',
  portraitImgUrl,
  qualityCheckStatus,
  onPortraitFileChange,
  onCheckPhotoQuality,
  portraitInputRef,
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
  isCompleted,
  onContinue,
  errors,
  clearError,
  ReadOnlyField,
  isLao = false,
}) => {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxStartDateStr = `${maxDate.getFullYear()}-${String(maxDate.getMonth() + 1).padStart(2, '0')}-${String(maxDate.getDate()).padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      {/* KHỐI ĐƠN VỊ TIẾP NHẬN HỒ SƠ: CHỈ DÀNH CHO THỦ TỤC CẤP GIẤY THÔNG HÀNH TẠM THỜI (tam-thoi) */}
      {procedure === 'tam-thoi' && (
      <div className="bg-white border border-[#D9E1DC] rounded-xl p-5 sm:p-6 shadow-2xs space-y-5 animate-fadeIn">
        <div className="border-b border-[#E5E9E7] pb-3">
          <h4 className="text-[17px] font-bold text-[#006B3F] uppercase tracking-wide">
            Thông tin đề nghị cấp giấy
          </h4>
          <p className="text-[13px] text-[#6B7280] mt-0.5">
            Lựa chọn Phòng Xuất nhập cảnh Công an tỉnh hoặc Cửa khẩu để nộp và xử lý hồ sơ
          </p>
        </div>

        <div className="space-y-4">
          {/* Đơn vị tiếp nhận hồ sơ * */}
          <div id="field-donViTiepNhan" className="space-y-1.5">
            <label className="text-[14px] font-semibold text-[#1F2937] flex items-center">
              <span>Đơn vị tiếp nhận hồ sơ</span>
              <span className="text-[#D71920] ml-1 font-bold">*</span>
            </label>

            <div className="flex flex-wrap items-center gap-6 pt-0.5">
              <label
                onClick={() => {
                  setDonViTiepNhan?.('Phòng Xuất nhập cảnh');
                  setCuaKhau?.('');
                  if (!phongXNC && userResidentProvince) {
                    setPhongXNC?.(matchImmigrationOfficeOption(userResidentProvince));
                  }
                  clearError('field-donViTiepNhan');
                  clearError('field-cuaKhau');
                }}
                className="flex items-center gap-2.5 cursor-pointer text-[14px] text-[#1F2937] font-medium select-none"
              >
                <input
                  type="radio"
                  name="donViTiepNhan"
                  value="Phòng Xuất nhập cảnh"
                  checked={donViTiepNhan === 'Phòng Xuất nhập cảnh' || (!donViTiepNhan && procedure !== 'tam-thoi')}
                  onChange={() => {
                    setDonViTiepNhan?.('Phòng Xuất nhập cảnh');
                    setCuaKhau?.('');
                    if (!phongXNC && userResidentProvince) {
                      setPhongXNC?.(matchImmigrationOfficeOption(userResidentProvince));
                    }
                    clearError('field-donViTiepNhan');
                    clearError('field-cuaKhau');
                  }}
                  className="w-4 h-4 text-[#006B3F] focus:ring-[#006B3F] cursor-pointer"
                />
                <span>Phòng Xuất nhập cảnh</span>
              </label>

              <label
                onClick={() => {
                  setDonViTiepNhan?.('Cửa khẩu');
                  setPhongXNC?.('');
                  clearError('field-donViTiepNhan');
                  clearError('field-phongXNC');
                }}
                className="flex items-center gap-2.5 cursor-pointer text-[14px] text-[#1F2937] font-medium select-none"
              >
                <input
                  type="radio"
                  name="donViTiepNhan"
                  value="Cửa khẩu"
                  checked={donViTiepNhan === 'Cửa khẩu'}
                  onChange={() => {
                    setDonViTiepNhan?.('Cửa khẩu');
                    setPhongXNC?.('');
                    clearError('field-donViTiepNhan');
                    clearError('field-phongXNC');
                  }}
                  className="w-4 h-4 text-[#006B3F] focus:ring-[#006B3F] cursor-pointer"
                />
                <span>Cửa khẩu</span>
              </label>
            </div>

            {errors['field-donViTiepNhan'] && (
              <p className="text-[12px] text-[#D71920] font-medium mt-1">
                {errors['field-donViTiepNhan']}
              </p>
            )}
          </div>

          {/* Ô Phòng Xuất nhập cảnh – Công an tỉnh (chỉ đọc, tự điền theo tỉnh thường trú, không có dropdown combobox) */}
          {donViTiepNhan === 'Phòng Xuất nhập cảnh' && (
            <div id="field-phongXNC" className="space-y-1.5 animate-fadeIn">
              <Input
                id="input-phongXNC"
                label="Phòng Xuất nhập cảnh – Công an tỉnh"
                value={
                  phongXNC ||
                  (userResidentProvince
                    ? matchImmigrationOfficeOption(userResidentProvince)
                    : 'Phòng Xuất nhập cảnh – Công an tỉnh')
                }
                readOnly
                disabled
                className="bg-[#F5F7F6] text-[#1F2937] border-[#D9E1DC] cursor-not-allowed font-medium"
                helperText="Tự động xác định theo tỉnh/thành phố thường trú của công dân"
              />
            </div>
          )}

          {/* Combobox Cửa khẩu tiếp nhận hồ sơ * (nếu chọn Cửa khẩu) */}
          {donViTiepNhan === 'Cửa khẩu' && (
            <div id="field-cuaKhau" className="space-y-1.5 animate-fadeIn">
              <AdminUnitCombobox
                id="combobox-cuaKhau"
                label="Cửa khẩu tiếp nhận hồ sơ"
                value={cuaKhau || ''}
                onChange={(val) => {
                  setCuaKhau?.(val);
                  clearError('field-cuaKhau');
                }}
                options={SAMPLE_BORDER_CHECKPOINTS}
                placeholder="-- Chọn hoặc tìm kiếm Cửa khẩu --"
                required
                error={errors['field-cuaKhau']}
                emptyMessage="Không tìm thấy Cửa khẩu phù hợp"
              />
            </div>
          )}

          {/* Trường hợp đề nghị cấp giấy * (dành cho thủ tục tạm thời) */}
          {procedure === 'tam-thoi' && (
            <>
            <div id="field-truongHopDeNghi" className="space-y-1.5">
              <label className="text-[14px] font-semibold text-[#1F2937] flex items-center">
                <span>Trường hợp đề nghị cấp giấy</span>
                <span className="text-[#D71920] ml-1 font-bold">*</span>
              </label>
              <select
                value={truongHopDeNghi || ''}
                onChange={(e) => {
                  setTruongHopDeNghi?.(e.target.value);
                  clearError('field-truongHopDeNghi');
                }}
                className={`w-full h-[42px] px-3.5 text-[14px] text-[#1F2937] bg-white border rounded-lg outline-none transition-all cursor-pointer ${
                  errors['field-truongHopDeNghi']
                    ? 'border-[#D71920] focus:ring-2 focus:ring-[#D71920]/20'
                    : 'border-[#D9E1DC] focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/15'
                }`}
              >
                <option value="">-- Chọn trường hợp đề nghị cấp giấy thông hành tạm thời --</option>
                {TEMPORARY_PASS_CASES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors['field-truongHopDeNghi'] && (
                <p className="text-[12px] text-[#D71920] font-medium mt-1">
                  {errors['field-truongHopDeNghi']}
                </p>
              )}
            </div>

            {/* Lý do cụ thể (textarea tối đa 255 ký tự có bộ đếm) */}
            <div id="field-lyDoCuThe" className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[14px] font-semibold text-[#1F2937] flex items-center">
                  <span>Lý do cụ thể</span>
                  {truongHopDeNghi === 'Trường hợp khác' && (
                    <span className="text-[#D71920] ml-1 font-bold">*</span>
                  )}
                </label>
                <span className="text-[12px] text-[#6B7280]">
                  {(lyDoCuThe || '').length}/255 ký tự
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={255}
                placeholder="Nhập lý do cụ thể đề nghị cấp giấy thông hành..."
                value={lyDoCuThe || ''}
                onChange={(e) => {
                  setLyDoCuThe?.(e.target.value);
                  clearError('field-lyDoCuThe');
                }}
                className={`w-full p-3 text-[14px] text-[#1F2937] bg-white border rounded-lg outline-none resize-none transition-all ${
                  errors['field-lyDoCuThe']
                    ? 'border-[#D71920] focus:ring-2 focus:ring-[#D71920]/20'
                    : 'border-[#D9E1DC] focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/15'
                }`}
              />
              {errors['field-lyDoCuThe'] && (
                <p className="text-[12px] text-[#D71920] font-medium mt-1">
                  {errors['field-lyDoCuThe']}
                </p>
              )}
            </div>
            </>
          )}
        </div>
      </div>
      )}

      {/* THẺ CON 1: THÔNG TIN CÁ NHÂN */}
      <div className="bg-white border border-[#D9E1DC] rounded-xl p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="border-b border-[#E5E9E7] pb-3">
          <h4 className="text-[17px] font-bold text-[#006B3F] uppercase tracking-wide">
            {isLao ? 'ຂໍ້ມູນສ່ວນຕົວ' : 'Thông tin cá nhân'}
          </h4>
        </div>

        {/* Layout: Cột trái là ảnh chân dung (5 cột trên lg, trên cùng trên mobile), Cột phải là các trường thông tin cá nhân (7 cột trên lg) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Cột trái (Máy tính: lg:col-span-5, Mobile: trên cùng): Khối ảnh chân dung người đề nghị */}
          <div className="lg:col-span-5 border border-[#D9E1DC] rounded-xl p-4 bg-[#F9FAFB] space-y-3">
            <div id="field-portrait" className="space-y-3">
              <label className="text-[15px] font-semibold text-[#1F2937] flex items-center justify-between">
                <span>{isLao ? 'ຮູບຖ່າຍ 3x4 cm' : 'Ảnh chân dung 3x4 cm'}</span>
                <span className="text-[#D71920] font-bold text-base">*</span>
              </label>

              <div className="flex flex-col items-center gap-3">
                {/* Khung xem trước 3x4 */}
                <div
                  className={`w-36 h-48 rounded-lg bg-white border-2 overflow-hidden flex flex-col items-center justify-center relative shadow-xs ${
                    errors['field-portrait'] ? 'border-[#D71920] bg-[#FFF5F5]' : 'border-[#D9E1DC]'
                  }`}
                >
                  {portraitImgUrl ? (
                    <img
                      src={portraitImgUrl}
                      alt="Ảnh thẻ chân dung"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-3 text-center text-[#9CA3AF]">
                      <User className="w-12 h-12 mb-1.5" />
                      <span className="text-[13px] leading-tight font-medium">Chưa chọn ảnh</span>
                    </div>
                  )}
                  {portraitImgUrl && (
                    <span className="absolute bottom-1.5 right-1.5 bg-[#008A4B] text-white p-1 rounded-full shadow-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  )}
                </div>

                {/* Vùng chọn ảnh và kéo thả */}
                <div className="w-full space-y-2.5">
                  <div
                    onClick={() => portraitInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-3.5 text-center bg-white transition-colors cursor-pointer group ${
                      errors['field-portrait']
                        ? 'border-[#D71920] bg-[#FFF5F5]'
                        : 'border-[#D9E1DC] hover:border-[#006B3F]'
                    }`}
                  >
                    <Upload className="w-6 h-6 text-[#006B3F] mx-auto mb-1 group-hover:scale-110 transition-transform" />
                    <div className="text-[14px] font-semibold text-[#1F2937]">
                      <span className="text-[#006B3F] underline">Chọn ảnh từ thiết bị</span> hoặc kéo thả vào đây
                    </div>
                    <div className="text-[12px] text-[#6B7280] mt-0.5">JPG, PNG, WEBP (tối đa 5MB)</div>

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
                <p className="text-[13px] text-[#D71920] font-medium flex items-center gap-1">
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

              <div className="p-2.5 bg-[#F5F7F6] border border-[#E5E9E7] rounded text-[12px] text-[#4B5563] leading-relaxed">
                <strong>Quy cách ảnh:</strong> Cỡ 3x4, chụp không quá 6 tháng, nền sáng màu, chụp thẳng mặt, đầu để trần, không đeo kính râm.
              </div>
            </div>
          </div>

          {/* Cột phải: Các trường thông tin cá nhân (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Họ và tên (readonly) lên đầu cạnh trường số định danh */}
              <ReadOnlyField
                label={isLao ? 'ຊື່ ແລະ ນາມສະກຸນ' : 'Họ và tên'}
                value={userAccountName}
                required
              />

              {/* Số định danh (readonly) */}
              <ReadOnlyField
                label={isLao ? 'ເລກປະຈຳຕົວ' : 'Số định danh'}
                value={userCitizenId}
                required
              />

              {/* Họ và tên (Latin) chuyển xuống dưới, cho phép nhập, placeholder: Nhập họ và tên (Latin) */}
              <div id="field-fullNameLatin" className="sm:col-span-2">
                <Input
                  label={isLao ? 'ຊື່ ແລະ ນາມສະກຸນ (Latin)' : 'Họ và tên (Latin)'}
                  placeholder={isLao ? 'ປ້ອນຊື່ ແລະ ນາມສະກຸນ (Latin)...' : 'Nhập họ và tên (Latin)'}
                  value={fullNameLatin}
                  onChange={(e) => {
                    setFullNameLatin(e.target.value.toUpperCase());
                    clearError('field-fullNameLatin');
                  }}
                  required
                  error={errors['field-fullNameLatin']}
                />
              </div>

              <div id="field-dob" className="space-y-1">
                <Input
                  label={isLao ? 'ວັນ, ເດືອນ, ປີເກີດ' : 'Ngày sinh'}
                  type="date"
                  value={dob}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDob(val);
                    if (onDobChange) {
                      onDobChange(val);
                    } else {
                      clearError('field-dob');
                    }
                  }}
                  onBlur={() => {
                    if (onDobBlur) onDobBlur();
                  }}
                  required
                  error={errors['field-dob']}
                />
                <p className="text-[12px] text-[#6B7280]">
                  {isLao
                    ? 'ຜູ້ຍື່ນຄຳຮ້ອງຕ້ອງມີອາຍຸແຕ່ 12 ປີຂຶ້ນໄປ.'
                    : 'Người đề nghị phải từ đủ 12 tuổi trở lên.'}
                </p>
              </div>

              <div id="field-gender">
                <Select
                  label={isLao ? 'ເພດ' : 'Giới tính'}
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
                />
              </div>

              <div id="field-ethnicity">
                <Select
                  label={isLao ? 'ຊົນເຜົ່າ' : 'Dân tộc'}
                  value={ethnicity}
                  onChange={(e) => {
                    setEthnicity(e.target.value);
                    clearError('field-ethnicity');
                  }}
                  required
                  error={errors['field-ethnicity']}
                  options={[
                    { value: '', label: 'Chọn dân tộc...' },
                    ...LAO_ETHNIC_GROUPS.map((eth) => ({ value: eth, label: eth })),
                  ]}
                />
              </div>

              <div id="field-religion">
                <Select
                  label={isLao ? 'ສາສະໜາ' : 'Tôn giáo'}
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                  options={[
                    { value: '', label: 'Chọn tôn giáo...' },
                    { value: 'Phật giáo', label: 'Phật giáo' },
                    { value: 'Kitô giáo', label: 'Kitô giáo' },
                    { value: 'Hồi giáo', label: 'Hồi giáo' },
                    { value: 'Baháʼí giáo', label: 'Baháʼí giáo' },
                    { value: 'Không', label: 'Không' },
                  ]}
                />
              </div>

              {/* Quốc tịch & Nghề nghiệp: CHỈ DÀNH CHO THỦ TỤC CẤP GIẤY THÔNG HÀNH TẠM THỜI (tam-thoi) */}
              {procedure === 'tam-thoi' && (
                <>
                  {/* Quốc tịch: textbox chỉ đọc, mặc định "Lào" */}
                  <div id="field-nationality">
                    <Input
                      label={isLao ? 'ສັນຊາດ' : 'Quốc tịch'}
                      value={nationality || 'Lào'}
                      readOnly
                      required
                      error={errors['field-nationality']}
                      className="bg-[#F5F7F6] cursor-not-allowed font-medium text-[#1F2937]"
                    />
                  </div>

                  {/* Nghề nghiệp: đổi từ textbox thành select (bắt buộc) */}
                  <div id="field-occupation" className="space-y-2">
                    <Select
                      label={isLao ? 'ອາຊີບ' : 'Nghề nghiệp'}
                      value={occupation}
                      onChange={(e) => {
                        const val = e.target.value;
                        setOccupation?.(val);
                        clearError('field-occupation');
                        if (val !== 'Khác') {
                          setOccupationDetail?.('');
                          clearError('field-occupationDetail');
                        }
                      }}
                      required
                      error={errors['field-occupation']}
                      options={OCCUPATION_OPTIONS}
                    />

                    {/* Khi chọn "Khác": Hiện ngay bên dưới ô select một textbox cho phép nhập tay */}
                    {occupation === 'Khác' && (
                      <div id="field-occupationDetail" className="animate-fadeIn">
                        <Input
                          label={isLao ? 'ອາຊີບລະອຽດ' : 'Nghề nghiệp cụ thể'}
                          placeholder={isLao ? 'ປ້ອນອາຊີບລະອຽດ...' : 'Nhập nghề nghiệp cụ thể'}
                          value={occupationDetail}
                          maxLength={100}
                          onChange={(e) => {
                            setOccupationDetail?.(e.target.value);
                            clearError('field-occupationDetail');
                          }}
                          required
                          error={errors['field-occupationDetail']}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* THẺ CON 2: GIẤY TỜ TÙY THÂN */}
      <div className="bg-white border border-[#D9E1DC] rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-[#E5E9E7] pb-3">
          <h4 className="text-[17px] font-bold text-[#006B3F] uppercase tracking-wide">
            {isLao ? 'ເອກະສານຢັ້ງຢືນຕົວຕົນ' : 'Giấy tờ tùy thân'}
          </h4>
          <p className="text-[14px] text-[#6B7280] mt-0.5">
            Số định danh, thẻ Căn cước/CMND và thông tin Sổ hộ khẩu
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div id="field-nationalId">
            <Input
              label={isLao ? 'ເລກປະຈຳຕົວ' : 'Số định danh'}
              placeholder="Nhập 13 chữ số"
              value={nationalId}
              onChange={(e) => {
                setNationalId(e.target.value);
                clearError('field-nationalId');
              }}
              required
              error={errors['field-nationalId']}
            />
          </div>

          <div id="field-idIssueDate">
            <Input
              label={isLao ? 'ວັນອອກບັດ' : 'Ngày cấp CCCD/CMND'}
              type="date"
              value={idIssueDate}
              onChange={(e) => setIdIssueDate(e.target.value)}
            />
          </div>

          <div id="field-idIssuePlace">
            <Input
              label={isLao ? 'ບ່ອນອອກບັດ' : 'Nơi cấp'}
              placeholder="Nhập cơ quan cấp..."
              value={idIssuePlace}
              onChange={(e) => setIdIssuePlace(e.target.value)}
            />
          </div>

          <div id="field-householdBookNo">
            <Input
              label={isLao ? 'ເລກສຳມະໂນຄົວ' : 'Số sổ hộ khẩu'}
              placeholder="Nhập số sổ hộ khẩu..."
              value={householdBookNo}
              onChange={(e) => {
                setHouseholdBookNo(e.target.value);
                clearError('field-householdBookNo');
              }}
              required
              error={errors['field-householdBookNo']}
            />
          </div>

          <div id="field-householdIssueDate">
            <Input
              label={isLao ? 'ວັນອອກສຳມະໂນ' : 'Ngày cấp'}
              type="date"
              value={householdIssueDate}
              onChange={(e) => setHouseholdIssueDate(e.target.value)}
            />
          </div>

          <div id="field-householdIssuePlace">
            <Input
              label={isLao ? 'ບ່ອນອອກສຳມະໂນ' : 'Nơi cấp'}
              placeholder="Nhập nơi cấp sổ hộ khẩu..."
              value={householdIssuePlace}
              onChange={(e) => setHouseholdIssuePlace(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* THẺ CON 3: ĐẶC ĐIỂM NHẬN DẠNG */}
      <div className="bg-white border border-[#D9E1DC] rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-[#E5E9E7] pb-3">
          <h4 className="text-[17px] font-bold text-[#006B3F] uppercase tracking-wide">
            {isLao ? 'ຮູບພັນສັນຖານ' : 'Đặc điểm nhận dạng'}
          </h4>
          <p className="text-[14px] text-[#6B7280] mt-0.5">
            Chiều cao và các dấu vết nhận diện riêng
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div id="field-height">
            <Input
              label={isLao ? 'ລວງສູງ (cm)' : 'Chiều cao'}
              type="number"
              placeholder="Ví dụ: 165"
              value={heightCm}
              onChange={(e) => {
                setHeightCm(e.target.value);
                clearError('field-height');
              }}
              rightIcon={<span className="text-[14px] font-semibold text-[#6B7280]">cm</span>}
              required
              error={errors['field-height']}
              helperText="Đo chiều cao theo tư thế đứng thẳng, không đi giày"
            />
          </div>

          {/* Màu tóc & Màu mắt: CHỈ DÀNH CHO THỦ TỤC CẤP GIẤY THÔNG HÀNH TẠM THỜI (tam-thoi) */}
          {procedure === 'tam-thoi' && (
            <>
              {/* Màu tóc: select (Đen, Nâu, Vàng, Bạc/Trắng, Khác) */}
              <div id="field-hairColor" className="space-y-2">
                <Select
                  label={isLao ? 'ສີຜົມ' : 'Màu tóc'}
                  value={hairColor}
                  onChange={(e) => {
                    const val = e.target.value;
                    setHairColor?.(val);
                    clearError('field-hairColor');
                    if (val !== 'Khác') {
                      setHairColorDetail?.('');
                      clearError('field-hairColorDetail');
                    }
                  }}
                  required
                  error={errors['field-hairColor']}
                  options={HAIR_COLOR_OPTIONS}
                />

                {/* Khi chọn "Khác": Hiện ngay bên dưới ô select một textbox cho phép nhập tay */}
                {hairColor === 'Khác' && (
                  <div id="field-hairColorDetail" className="animate-fadeIn">
                    <Input
                      label={isLao ? 'ສີຜົມລະອຽດ' : 'Màu tóc cụ thể'}
                      placeholder={isLao ? 'ປ້ອນສີຜົມລະອຽດ...' : 'Nhập màu tóc cụ thể'}
                      value={hairColorDetail}
                      maxLength={100}
                      onChange={(e) => {
                        setHairColorDetail?.(e.target.value);
                        clearError('field-hairColorDetail');
                      }}
                      required
                      error={errors['field-hairColorDetail']}
                    />
                  </div>
                )}
              </div>

              {/* Màu mắt: select (Đen, Nâu, Xanh, Khác) */}
              <div id="field-eyeColor" className="space-y-2">
                <Select
                  label={isLao ? 'ສີຕາ' : 'Màu mắt'}
                  value={eyeColor}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEyeColor?.(val);
                    clearError('field-eyeColor');
                    if (val !== 'Khác') {
                      setEyeColorDetail?.('');
                      clearError('field-eyeColorDetail');
                    }
                  }}
                  required
                  error={errors['field-eyeColor']}
                  options={EYE_COLOR_OPTIONS}
                />

                {/* Khi chọn "Khác": Hiện ngay bên dưới ô select một textbox cho phép nhập tay */}
                {eyeColor === 'Khác' && (
                  <div id="field-eyeColorDetail" className="animate-fadeIn">
                    <Input
                      label={isLao ? 'ສີຕາລະອຽດ' : 'Màu mắt cụ thể'}
                      placeholder={isLao ? 'ປ້ອນສີຕາລະອຽດ...' : 'Nhập màu mắt cụ thể'}
                      value={eyeColorDetail}
                      maxLength={100}
                      onChange={(e) => {
                        setEyeColorDetail?.(e.target.value);
                        clearError('field-eyeColorDetail');
                      }}
                      required
                      error={errors['field-eyeColorDetail']}
                    />
                  </div>
                )}
              </div>
            </>
          )}

          <Input
            label={isLao ? 'ຮອຍແປວ' : 'Vết sẹo'}
            placeholder="Ví dụ: Sẹo dài 3cm..."
            value={scars}
            onChange={(e) => setScars(e.target.value)}
          />

          <Input
            label={isLao ? 'ຕຳແໜ່ງຮອຍແປວ' : 'Vị trí vết sẹo'}
            placeholder="Ví dụ: Dưới đuôi lông mày phải..."
            value={scarsLocation}
            onChange={(e) => setScarsLocation(e.target.value)}
          />
        </div>
      </div>

      {/* THẺ CON 4: MỤC ĐÍCH CHUYẾN ĐI VÀ THỜI HẠN SỬ DỤNG - CHỈ DÀNH CHO tam-thoi */}
      {procedure === 'tam-thoi' && (
      <div className="bg-white border border-[#D9E1DC] rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-[#E5E9E7] pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-[17px] font-bold text-[#006B3F] uppercase tracking-wide">
              {isLao ? 'ຈຸດປະສົງການເດີນທາງ ແລະ ໄລຍະເວລານຳໃຊ້' : 'Mục đích chuyến đi và Thời hạn sử dụng'}
            </h4>
            <span className="text-[12px] font-semibold text-[#006B3F] bg-[#E8F3EE] border border-[#B0DFCA] px-2.5 py-0.5 rounded-full">
              Thời hạn 03 ngày
            </span>
          </div>
          <p className="text-[14px] text-[#6B7280] mt-0.5">
            Kê khai lý do xuất cảnh và thời hạn có giá trị của giấy thông hành biên giới
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Mục đích chuyến đi: select (mock: Thăm thân, Du lịch, Công tác, Chữa bệnh, Học tập, Khác) */}
          <div id="field-tripPurpose" className={tripPurpose === 'Khác' ? 'sm:col-span-1' : 'sm:col-span-2 lg:col-span-1'}>
            <Select
              label={isLao ? 'ຈຸດປະສົງການເດີນທາງ' : 'Mục đích chuyến đi'}
              value={tripPurpose}
              onChange={(e) => {
                setTripPurpose?.(e.target.value);
                clearError('field-tripPurpose');
              }}
              required
              error={errors['field-tripPurpose']}
              options={TRIP_PURPOSE_OPTIONS}
            />
          </div>

          {/* Chọn "Khác" -> hiện textbox "Nội dung cụ thể" (bắt buộc, tối đa 255 ký tự) */}
          {tripPurpose === 'Khác' && (
            <div id="field-tripPurposeDetail" className="sm:col-span-2 lg:col-span-2 animate-fadeIn">
              <Input
                label={isLao ? 'ເນື້ອໃນລະອຽດ' : 'Nội dung cụ thể'}
                placeholder="Nhập cụ thể lý do hoặc mục đích chuyến đi (tối đa 255 ký tự)..."
                value={tripPurposeDetail}
                maxLength={255}
                onChange={(e) => {
                  setTripPurposeDetail?.(e.target.value);
                  clearError('field-tripPurposeDetail');
                }}
                required
                error={errors['field-tripPurposeDetail']}
              />
            </div>
          )}

          {/* Thời hạn sử dụng: "Ngày bắt đầu" (date picker, bắt buộc, không được trước hôm nay, không quá 30 ngày kể từ ngày nộp) */}
          <div id="field-validityStartDate">
            <Input
              label={isLao ? 'ວັນທີເລີ່ມຕົ້ນ' : 'Thời hạn sử dụng: Ngày bắt đầu'}
              type="date"
              min={todayStr}
              max={maxStartDateStr}
              value={validityStartDate}
              onChange={(e) => {
                setValidityStartDate?.(e.target.value);
                clearError('field-validityStartDate');
              }}
              required
              error={errors['field-validityStartDate']}
              helperText="Từ hôm nay đến không quá 30 ngày"
            />
          </div>

          {/* "Ngày kết thúc" (readonly, tự tính = Ngày bắt đầu + 2 ngày, hiển thị cạnh dòng "Thời hạn 03 ngày") */}
          <div id="field-validityEndDate">
            <label className="text-[14px] font-semibold text-[#1F2937] flex items-center justify-between mb-1.5">
              <span className="flex items-center">
                <span>{isLao ? 'ວັນທີສິ້ນສຸດ' : 'Ngày kết thúc'}</span>
                <span className="text-[12px] font-normal text-[#6B7280] ml-1.5">(tự tính)</span>
              </span>
              <span className="text-[12px] font-semibold text-[#006B3F] bg-[#E8F3EE] px-2 py-0.5 rounded border border-[#B0DFCA]">
                Thời hạn 03 ngày
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={
                  validityEndDate
                    ? `${validityEndDate.split('-').reverse().join('/')} (Thời hạn 03 ngày)`
                    : 'Tự tính theo Ngày bắt đầu'
                }
                className="w-full bg-[#F5F7F6] border border-[#D9E1DC] rounded-lg px-3.5 py-2.5 text-[14px] text-[#1F2937] font-medium cursor-not-allowed outline-none select-none"
              />
            </div>
            <p className="text-[12px] text-[#6B7280] mt-1">
              Thời hạn 03 ngày kể từ ngày bắt đầu
            </p>
          </div>
        </div>
      </div>
      )}

      {/* NÚT TIẾP TỤC Ở CUỐI PHẦN 1 */}
      <SectionContinueButton
        nextPartName="Phần 2: Địa chỉ và trẻ em đi kèm"
        isCompleted={isCompleted}
        onContinue={onContinue}
        isLao={isLao}
      />
    </div>
  );
};
