import React from 'react';
import { User, Upload, ScanFace, CheckCircle2, AlertTriangle, Info, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { AdminUnitCombobox } from './AdminUnitCombobox';
import { SectionContinueButton } from './SectionContinueButton';
import {
  LAO_PROVINCES,
  LAO_BORDER_PROVINCES,
  LAO_UNITS_SAMPLE,
} from './laoAdminData';

export interface ChildCompanion {
  id: string;
  fullNameLao: string;
  fullNameLatin: string;
  citizenId?: string;
  dob: string;
  gender: '' | 'Nam' | 'Nữ';
  relationship: '' | 'Bố' | 'Mẹ' | 'Người giám hộ';
  inAttachedHouseholdBook: boolean;
  resProvince?: string;
  resDistrict?: string;
  resVillage?: string;
  resUnit?: string;
  resAddressDetail?: string;
  portraitImgUrl?: string;
  portraitFileName?: string;
  qualityCheckStatus?: any;
}

export interface FormPart2Props {
  birthProvince: string;
  setBirthProvince: (val: string) => void;
  birthDistrict: string;
  setBirthDistrict: (val: string) => void;
  birthVillage: string;
  setBirthVillage: (val: string) => void;
  birthUnit: string;
  setBirthUnit: (val: string) => void;
  birthAddressDetail: string;
  setBirthAddressDetail: (val: string) => void;
  birthDistrictOptions: string[];
  birthVillageOptions: string[];
  resProvince: string;
  setResProvince: (val: string) => void;
  resDistrict: string;
  setResDistrict: (val: string) => void;
  resVillage: string;
  setResVillage: (val: string) => void;
  resUnit: string;
  setResUnit: (val: string) => void;
  resAddressDetail: string;
  setResAddressDetail: (val: string) => void;
  resDistrictOptions: string[];
  resVillageOptions: string[];
  childrenList: ChildCompanion[];
  onAddChild: () => void;
  onRemoveChild: (id: string) => void;
  onUpdateChild: (id: string, field: any, val: any) => void;
  onChildPhotoChange: (childId: string, file: File) => void;
  onCheckChildPhotoQuality: (childId: string) => void;
  getChildDistrictOptions: (prov?: string) => string[];
  getChildVillageOptions: (dist?: string) => string[];
  calculateAge: (dob: string) => number;
  isCompleted: boolean;
  onContinue: () => void;
  errors: Record<string, string>;
  clearError: (id: string) => void;
  isLao?: boolean;
  procedure?: 'cap-so' | 'tam-thoi';
  isMissingResidence?: boolean;
  receivingAgency?: string;
}

export const FormPart2: React.FC<FormPart2Props> = ({
  procedure = 'cap-so',
  isMissingResidence = false,
  receivingAgency,
  birthProvince,
  setBirthProvince,
  birthDistrict,
  setBirthDistrict,
  birthVillage,
  setBirthVillage,
  birthUnit,
  setBirthUnit,
  birthAddressDetail,
  setBirthAddressDetail,
  birthDistrictOptions,
  birthVillageOptions,
  resProvince,
  setResProvince,
  resDistrict,
  setResDistrict,
  resVillage,
  setResVillage,
  resUnit,
  setResUnit,
  resAddressDetail,
  setResAddressDetail,
  resDistrictOptions,
  resVillageOptions,
  childrenList,
  onAddChild,
  onRemoveChild,
  onUpdateChild,
  onChildPhotoChange,
  onCheckChildPhotoQuality,
  getChildDistrictOptions,
  getChildVillageOptions,
  calculateAge,
  isCompleted,
  onContinue,
  errors,
  clearError,
  isLao = false,
}) => {
  return (
    <div className="space-y-6">
      {/* THẺ CON 1: NƠI ĐĂNG KÝ KHAI SINH */}
      <div className="bg-white border border-[#D9E1DC] rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-[#E5E9E7] pb-3">
          <h4 className="text-[17px] font-bold text-[#006B3F] uppercase tracking-wide">
            {isLao ? 'ສະຖານທີ່ແຈ້ງເກີດ' : 'Nơi đăng ký khai sinh'}
          </h4>
          <p className="text-[14px] text-[#6B7280] mt-0.5">
            Địa bàn nơi công dân làm thủ tục đăng ký khai sinh
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div id="field-birthProvince">
              <AdminUnitCombobox
                label={isLao ? 'ແຂວງ / ນະຄອນຫຼວງ' : 'Tỉnh/Thành phố'}
                value={birthProvince}
                onChange={(val) => {
                  setBirthProvince(val);
                  clearError('field-birthProvince');
                }}
                options={LAO_PROVINCES}
                placeholder="Chọn hoặc nhập tỉnh/thành..."
                required
                error={errors['field-birthProvince']}
              />
            </div>

            <div id="field-birthDistrict">
              <AdminUnitCombobox
                label={isLao ? 'ເມືອງ / ເຂດ' : 'Quận/Huyện'}
                value={birthDistrict}
                onChange={(val) => {
                  setBirthDistrict(val);
                  clearError('field-birthDistrict');
                }}
                options={birthDistrictOptions}
                placeholder="Chọn hoặc nhập quận/huyện..."
                required
                error={errors['field-birthDistrict']}
              />
            </div>

            <div id="field-birthVillage">
              <AdminUnitCombobox
                label={isLao ? 'ບ້ານ' : 'Bản'}
                value={birthVillage}
                onChange={(val) => {
                  setBirthVillage(val);
                  clearError('field-birthVillage');
                }}
                options={birthVillageOptions}
                placeholder="Chọn hoặc nhập bản..."
                required
                error={errors['field-birthVillage']}
              />
            </div>

            <div id="field-birthUnit">
              <AdminUnitCombobox
                label={isLao ? 'ໜ່ວຍ' : 'Đơn vị dưới bản'}
                value={birthUnit}
                onChange={(val) => setBirthUnit(val)}
                options={LAO_UNITS_SAMPLE}
                placeholder="Chọn hoặc nhập đơn vị..."
              />
            </div>
          </div>

          <div id="field-birthAddressDetail">
            <Input
              label={isLao ? 'ທີ່ຢູ່ລະອຽດ (ຖ້າມີ)' : 'Địa chỉ chi tiết (nếu có)'}
              placeholder="Số nhà, ngõ, mô tả thêm..."
              value={birthAddressDetail}
              onChange={(e) => setBirthAddressDetail(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* THẺ CON 2: NƠI THƯỜNG TRÚ */}
      <div className="bg-white border border-[#D9E1DC] rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-[#E5E9E7] pb-3 flex items-center justify-between">
          <h4 className="text-[17px] font-bold text-[#006B3F] uppercase tracking-wide">
            {isLao ? 'ທີ່ຢູ່ຖາວອນ' : 'Nơi thường trú'}
          </h4>
          <span className="text-[12px] font-medium text-[#6B7280] bg-[#F5F7F6] px-2.5 py-0.5 rounded border border-[#D9E1DC]">
            Tự động theo tài khoản (Chỉ đọc)
          </span>
        </div>

        {/* Lỗi đỏ nếu tài khoản thiếu thông tin nơi thường trú */}
        {isMissingResidence && (
          <div className="p-3.5 bg-[#FFF5F5] border border-[#FCA5A5] border-l-4 border-l-[#D71920] rounded-lg flex items-center gap-2.5 text-[14px] text-[#D71920] font-semibold animate-shake">
            <AlertTriangle className="w-5 h-5 text-[#D71920] shrink-0" />
            <span>Tài khoản chưa có thông tin nơi thường trú. Vui lòng cập nhật thông tin tài khoản</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div id="field-resProvince">
              <Input
                label={isLao ? 'ແຂວງ / ນະຄອນຫຼວງ' : 'Tỉnh/Thành phố'}
                value={resProvince}
                placeholder="Chưa có dữ liệu"
                readOnly
                disabled
                className="bg-[#F5F7F6] text-[#1F2937] border-[#D9E1DC] cursor-not-allowed font-medium"
              />
            </div>

            <div id="field-resDistrict">
              <Input
                label={isLao ? 'ເມືອງ / ເຂດ' : 'Quận/Huyện'}
                value={resDistrict}
                placeholder="Chưa có dữ liệu"
                readOnly
                disabled
                className="bg-[#F5F7F6] text-[#1F2937] border-[#D9E1DC] cursor-not-allowed font-medium"
              />
            </div>

            <div id="field-resVillage">
              <Input
                label={isLao ? 'ບ້ານ' : 'Phường/Xã (Bản)'}
                value={resVillage}
                placeholder="Chưa có dữ liệu"
                readOnly
                disabled
                className="bg-[#F5F7F6] text-[#1F2937] border-[#D9E1DC] cursor-not-allowed font-medium"
              />
            </div>

            <div id="field-resUnit">
              <Input
                label={isLao ? 'ໜ່ວຍ' : 'Thôn/Bản/Đơn vị'}
                value={resUnit}
                placeholder="Chưa có dữ liệu"
                readOnly
                disabled
                className="bg-[#F5F7F6] text-[#1F2937] border-[#D9E1DC] cursor-not-allowed font-medium"
              />
            </div>
          </div>

          <div id="field-resAddressDetail">
            <Input
              label={isLao ? 'ທີ່ຢູ່ລະອຽດ' : 'Số nhà/Chi tiết'}
              placeholder="Chưa có dữ liệu địa chỉ chi tiết"
              value={resAddressDetail}
              readOnly
              disabled
              className="bg-[#F5F7F6] text-[#1F2937] border-[#D9E1DC] cursor-not-allowed font-medium"
            />
          </div>

          {/* Cơ quan tiếp nhận hồ sơ: CHỈ DÀNH CHO THỦ TỤC CẤP SỔ THÔNG HÀNH (cap-so) */}
          {procedure === 'cap-so' && (
            <div id="field-receivingAgency" className="pt-1">
              <Input
                label={isLao ? 'ອົງການຮັບຄຳຮ້ອງ' : 'Cơ quan tiếp nhận hồ sơ'}
                value={
                  receivingAgency ||
                  (resProvince
                    ? `Phòng Xuất nhập cảnh – Công an tỉnh ${resProvince}`
                    : 'Phòng Xuất nhập cảnh – Công an tỉnh')
                }
                readOnly
                disabled
                className="bg-[#F5F7F6] text-[#1F2937] border-[#D9E1DC] cursor-not-allowed font-semibold"
                helperText="Tự động xác định = Phòng Xuất nhập cảnh – Công an tỉnh [tên tỉnh thường trú]"
              />
            </div>
          )}
        </div>
      </div>

      {/* THẺ CON 3: TRẺ EM ĐI KÈM */}
      <div className="bg-white border border-[#D9E1DC] rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-[#E5E9E7] pb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-[17px] font-bold text-[#006B3F] uppercase tracking-wide">
                {procedure === 'tam-thoi'
                  ? 'Trẻ em đi kèm (dưới 12 tuổi, không bắt buộc, tối đa 4 trẻ)'
                  : isLao
                  ? 'ເດັກນ້ອຍຕິດຕາມ (ຕ່ຳກວ່າ 12 ປີ)'
                  : 'Trẻ em đi kèm'}
              </h4>
              {procedure !== 'tam-thoi' && (
                <span className="text-[13px] font-medium text-[#6B7280] bg-[#F3F4F6] px-2.5 py-0.5 rounded border border-[#E5E9E7]">
                  Không bắt buộc
                </span>
              )}
            </div>
            <p className="text-[14px] text-[#6B7280] mt-0.5">
              Danh sách trẻ em dưới 12 tuổi đi cùng người đề nghị (nếu có)
            </p>
          </div>
        </div>

        {/* Khi chưa thêm trẻ nào: hiện thông điệp và nút bấm */}
        {childrenList.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-[#D9E1DC] rounded-xl bg-[#F9FAFB] space-y-3">
            <p className="text-[15px] text-[#4B5563]">
              Chưa có trẻ em đi kèm. Nếu không có, bạn bỏ qua mục này.
            </p>
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onAddChild}
              icon={<Plus className="w-4 h-4 text-[#006B3F]" />}
            >
              + Thêm trẻ em đi kèm
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            {childrenList.map((child, index) => {
              return (
                <div
                  key={child.id}
                  id={`child-${child.id}`}
                  className="bg-white border border-[#D9E1DC] rounded-xl p-4 sm:p-5 space-y-4 shadow-xs"
                >
                  {/* Header card trẻ em */}
                  <div className="flex items-center justify-between border-b border-[#E5E9E7] pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-full bg-[#006B3F] text-white text-[13px] font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-[16px] font-bold text-[#1F2937]">
                        Trẻ em thứ {index + 1}
                      </span>
                      {(child.fullNameLatin || child.fullNameLao) && (
                        <span className="text-[14px] text-[#6B7280] hidden sm:inline">
                          — {child.fullNameLatin || child.fullNameLao}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveChild(child.id)}
                      className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#D71920] hover:bg-[#FEECEC] px-2.5 py-1 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Xóa</span>
                    </button>
                  </div>

                  {/* Layout thông tin của trẻ: Tương tự phần người lớn, có ảnh chân dung của trẻ */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    {/* Cột ảnh của trẻ */}
                    <div className="lg:col-span-4 border border-[#D9E1DC] rounded-xl p-3.5 bg-[#F9FAFB] space-y-3">
                      <label className="text-[14px] font-semibold text-[#1F2937] block">
                        {isLao ? 'ຮູບຖ່າຍ 3x4 ຊັງຕີແມັດ' : 'Ảnh chân dung 3x4 cm'}
                      </label>
                      <div className="flex flex-col items-center gap-2.5">
                        <div className="w-28 h-36 rounded-lg bg-white border border-[#D9E1DC] overflow-hidden flex flex-col items-center justify-center relative shadow-xs">
                          {child.portraitImgUrl ? (
                            <img
                              src={child.portraitImgUrl}
                              alt="Ảnh của trẻ"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center p-2 text-center text-[#9CA3AF]">
                              <User className="w-8 h-8 mb-1" />
                              <span className="text-[11px] font-medium">Chưa chọn ảnh</span>
                            </div>
                          )}
                          {child.portraitImgUrl && (
                            <span className="absolute bottom-1 right-1 bg-[#008A4B] text-white p-0.5 rounded-full shadow-xs">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>

                        <label className="w-full border-2 border-dashed border-[#D9E1DC] hover:border-[#006B3F] rounded-lg p-2.5 text-center bg-white transition-colors cursor-pointer group flex flex-col items-center justify-center">
                          <Upload className="w-4 h-4 text-[#006B3F] mb-1 group-hover:scale-110 transition-transform" />
                          <div className="text-[12px] font-semibold text-[#1F2937]">
                            <span className="text-[#006B3F] underline">Chọn ảnh</span> hoặc kéo thả
                          </div>
                          <div className="text-[11px] text-[#6B7280]">JPG, PNG, WEBP (tối đa 5MB)</div>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                onChildPhotoChange(child.id, e.target.files[0]);
                              }
                            }}
                          />
                        </label>

                        {child.qualityCheckStatus && (
                          <div
                            className={`p-2.5 rounded-lg text-[12px] flex items-start gap-2 w-full animate-fadeIn ${
                              child.qualityCheckStatus.passed
                                ? 'bg-[#E6F5EE] border border-[#B0DFCA] text-[#008A4B]'
                                : 'bg-[#FFF5F5] border border-[#FCA5A5] text-[#D71920]'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#008A4B] shrink-0 mt-0.5" />
                            <div className="leading-tight">{child.qualityCheckStatus.message}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cột các trường thông tin cơ bản của trẻ */}
                    <div className="lg:col-span-8 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div id={`child-fullNameLao-${child.id}`}>
                          <Input
                            label="Họ và tên"
                            placeholder="Nhập tên chữ Lào..."
                            value={child.fullNameLao}
                            onChange={(e) => {
                              onUpdateChild(child.id, 'fullNameLao', e.target.value);
                              clearError(`child-fullNameLao-${child.id}`);
                            }}
                            required
                            error={errors[`child-fullNameLao-${child.id}`]}
                          />
                        </div>

                        <div id={`child-fullNameLatin-${child.id}`}>
                          <Input
                            label="Họ và tên"
                            placeholder="Nhập tên Latin..."
                            value={child.fullNameLatin}
                            onChange={(e) => {
                              onUpdateChild(child.id, 'fullNameLatin', e.target.value.toUpperCase());
                              clearError(`child-fullNameLatin-${child.id}`);
                            }}
                            required
                            error={errors[`child-fullNameLatin-${child.id}`]}
                          />
                        </div>

                        <div id={`child-citizenId-${child.id}`}>
                          <Input
                            label="Số định danh"
                            placeholder="13 chữ số"
                            value={child.citizenId || ''}
                            onChange={(e) => {
                              onUpdateChild(child.id, 'citizenId', e.target.value);
                              clearError(`child-citizenId-${child.id}`);
                            }}
                            required
                            error={errors[`child-citizenId-${child.id}`]}
                          />
                        </div>

                        <div id={`child-dob-${child.id}`}>
                          <Input
                            label="Ngày, tháng, năm sinh"
                            type="date"
                            value={child.dob}
                            onChange={(e) => {
                              const val = e.target.value;
                              onUpdateChild(child.id, 'dob', val);
                              clearError(`child-dob-${child.id}`);
                            }}
                            required
                            error={errors[`child-dob-${child.id}`]}
                            helperText="Trẻ em phải dưới 12 tuổi"
                          />
                        </div>

                        <div id={`child-gender-${child.id}`}>
                          <Select
                            label="Giới tính"
                            value={child.gender}
                            onChange={(e) => {
                              onUpdateChild(child.id, 'gender', e.target.value as any);
                              clearError(`child-gender-${child.id}`);
                            }}
                            required
                            error={errors[`child-gender-${child.id}`]}
                            options={[
                              { value: '', label: 'Chọn giới tính...' },
                              { value: 'Nam', label: 'Nam' },
                              { value: 'Nữ', label: 'Nữ' },
                            ]}
                          />
                        </div>

                        <div id={`child-relationship-${child.id}`}>
                          <Select
                            label="Quan hệ của người đề nghị với trẻ"
                            value={child.relationship}
                            onChange={(e) => {
                              onUpdateChild(child.id, 'relationship', e.target.value as any);
                              clearError(`child-relationship-${child.id}`);
                            }}
                            required
                            error={errors[`child-relationship-${child.id}`]}
                            options={[
                              { value: '', label: 'Chọn quan hệ...' },
                              { value: 'Bố', label: 'Bố' },
                              { value: 'Mẹ', label: 'Mẹ' },
                              { value: 'Người giám hộ', label: 'Người giám hộ' },
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Khối Thường trú của trẻ & Checkbox */}
                  <div className="p-4 bg-[#F9FAFB] rounded-xl border border-[#D9E1DC] space-y-3">
                    <div className="text-[14px] font-bold text-[#006B3F] uppercase">
                      Nơi thường trú của trẻ
                    </div>

                    <label className="flex items-start gap-2.5 cursor-pointer select-none text-[14px] text-[#1F2937]">
                      <input
                        type="checkbox"
                        checked={child.inAttachedHouseholdBook}
                        onChange={(e) => {
                          onUpdateChild(child.id, 'inAttachedHouseholdBook', e.target.checked);
                          if (e.target.checked) {
                            clearError(`child-householdBook-${child.id}`);
                            clearError(`child-resProvince-${child.id}`);
                            clearError(`child-resDistrict-${child.id}`);
                            clearError(`child-resVillage-${child.id}`);
                          }
                        }}
                        className="mt-0.5 w-4 h-4 text-[#006B3F] rounded border-[#D9E1DC] focus:ring-[#006B3F] cursor-pointer"
                      />
                      <span className="font-semibold leading-snug">
                        Trẻ này có tên trong Sổ hộ khẩu đã đính kèm ở mục Giấy tờ đính kèm
                      </span>
                    </label>

                    {/* Nếu không tick checkbox: hiện các trường chọn địa chỉ thường trú cho trẻ */}
                    {!child.inAttachedHouseholdBook && (
                      <div className="space-y-3 pt-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          <div id={`child-resProvince-${child.id}`}>
                            <AdminUnitCombobox
                              label="Tỉnh/Thành phố"
                              value={child.resProvince || ''}
                              onChange={(val) => {
                                onUpdateChild(child.id, 'resProvince', val);
                                clearError(`child-resProvince-${child.id}`);
                              }}
                              options={LAO_BORDER_PROVINCES}
                              placeholder="Chọn tỉnh/thành..."
                              required
                              error={errors[`child-resProvince-${child.id}`]}
                            />
                          </div>

                          <div id={`child-resDistrict-${child.id}`}>
                            <AdminUnitCombobox
                              label="Quận/Huyện"
                              value={child.resDistrict || ''}
                              onChange={(val) => {
                                onUpdateChild(child.id, 'resDistrict', val);
                                clearError(`child-resDistrict-${child.id}`);
                              }}
                              options={getChildDistrictOptions(child.resProvince)}
                              placeholder="Chọn quận/huyện..."
                              required
                              error={errors[`child-resDistrict-${child.id}`]}
                            />
                          </div>

                          <div id={`child-resVillage-${child.id}`}>
                            <AdminUnitCombobox
                              label="Bản"
                              value={child.resVillage || ''}
                              onChange={(val) => {
                                onUpdateChild(child.id, 'resVillage', val);
                                clearError(`child-resVillage-${child.id}`);
                              }}
                              options={getChildVillageOptions(child.resDistrict)}
                              placeholder="Chọn bản..."
                              required
                              error={errors[`child-resVillage-${child.id}`]}
                            />
                          </div>

                          <div id={`child-resUnit-${child.id}`}>
                            <AdminUnitCombobox
                              label="Đơn vị dưới bản"
                              value={child.resUnit || ''}
                              onChange={(val) => onUpdateChild(child.id, 'resUnit', val)}
                              options={LAO_UNITS_SAMPLE}
                              placeholder="Chọn đơn vị..."
                            />
                          </div>
                        </div>

                        <Input
                          label="Địa chỉ chi tiết (nếu có)"
                          placeholder="Số nhà, ngõ..."
                          value={child.resAddressDetail || ''}
                          onChange={(e) =>
                            onUpdateChild(child.id, 'resAddressDetail', e.target.value)
                          }
                        />
                      </div>
                    )}
                  </div>

                  {/* Dòng ghi chú nhỏ thông báo giấy tờ của trẻ sẽ đính kèm ở Phần 3 */}
                  <div className="p-3 bg-[#E8F3EE] rounded-lg border border-[#B0DFCA] text-[13px] text-[#006B3F] font-medium flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0 text-[#006B3F]" />
                    <span>
                      Giấy khai sinh, giấy cho phép của người giám hộ và sổ hộ khẩu (nếu cần) của trẻ sẽ được đính kèm ở Phần 3.
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Nút thêm trẻ em đi kèm đặt dưới mỗi phần thông tin trẻ đã nhập */}
            <div className="pt-2 flex flex-col items-start gap-1">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={onAddChild}
                disabled={procedure === 'tam-thoi' && childrenList.length >= 4}
                icon={<Plus className="w-4 h-4 text-[#006B3F]" />}
                className={`w-full sm:w-auto font-semibold border-[#006B3F] text-[#006B3F] hover:bg-[#E8F3EE] ${
                  procedure === 'tam-thoi' && childrenList.length >= 4
                    ? 'opacity-50 cursor-not-allowed hover:bg-transparent pointer-events-none'
                    : ''
                }`}
              >
                + {isLao ? 'ເພີ່ມເດັກນ້ອຍມານຳ' : 'Thêm trẻ em đi kèm'}
              </Button>
              {procedure === 'tam-thoi' && childrenList.length >= 4 && (
                <p className="text-[13px] text-[#5F6B66] font-medium mt-1">
                  Mỗi hồ sơ chỉ được khai tối đa 4 trẻ em đi kèm
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* NÚT TIẾP TỤC Ở CUỐI PHẦN 2 */}
      <SectionContinueButton
        nextPartName="Phần 3: Giấy tờ đính kèm và nhận kết quả"
        isCompleted={isCompleted}
        onContinue={onContinue}
        isLao={isLao}
      />
    </div>
  );
};
