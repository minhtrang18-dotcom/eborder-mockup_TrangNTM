import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Send,
  Edit2,
  FileText,
  Home,
  User,
  Paperclip,
  CheckCircle2,
  Upload,
} from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input, Select } from '../../ui/Input';
import { AdminUnitCombobox } from '../AdminUnitCombobox';
import {
  LAO_BORDER_PROVINCES,
  LAO_PROVINCES,
  LAO_UNITS_SAMPLE,
} from '../laoAdminData';
import { AttachmentRow } from './Step2AddressDocs';

export interface ChildDocumentFile {
  name: string;
  size: string;
  url?: string;
}

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
  birthCertificateFile?: ChildDocumentFile;
  householdBookFile?: ChildDocumentFile;
  guardianPermissionFile?: ChildDocumentFile;
  portraitImgUrl?: string;
  portraitFileName?: string;
  qualityCheckStatus?: {
    checked: boolean;
    passed: boolean;
    message: string;
  } | null;
}

interface Step3ChildrenConfirmProps {
  childrenData: ChildCompanion[];
  onAddChild: () => void;
  onRemoveChild: (id: string) => void;
  onUpdateChild: <K extends keyof ChildCompanion>(
    id: string,
    field: K,
    val: ChildCompanion[K]
  ) => void;
  getChildDistrictOptions: (prov?: string) => string[];
  getChildVillageOptions: (dist?: string) => string[];

  deliveryMethod: 'direct' | 'postal';
  setDeliveryMethod: (val: 'direct' | 'postal') => void;
  postalProvider: string;
  setPostalProvider: (val: string) => void;
  deliveryProvince: string;
  setDeliveryProvince: (val: string) => void;
  deliveryDistrict: string;
  setDeliveryDistrict: (val: string) => void;
  deliveryVillage: string;
  setDeliveryVillage: (val: string) => void;
  deliveryUnit: string;
  setDeliveryUnit: (val: string) => void;
  deliveryAddressDetail: string;
  setDeliveryAddressDetail: (val: string) => void;
  deliveryDistrictOptions: string[];
  deliveryVillageOptions: string[];
  recipientName: string;
  setRecipientName: (val: string) => void;
  recipientPhone: string;
  setRecipientPhone: (val: string) => void;

  // Review Summary Data
  personalInfoSummary: {
    fullName: string;
    fullNameLatin: string;
    dob: string;
    gender: string;
    ethnicity: string;
    nationalId: string;
    householdBookNo: string;
    heightCm: string;
    hasPhoto: boolean;
  };
  addressSummary: {
    birthPlace: string;
    resPlace: string;
  };
  attachmentsSummary: AttachmentRow[];

  onJumpToStep: (step: number) => void;
  errors: Record<string, string>;
  clearError: (id: string) => void;
}

export const Step3ChildrenConfirm: React.FC<Step3ChildrenConfirmProps> = ({
  childrenData,
  onAddChild,
  onRemoveChild,
  onUpdateChild,
  getChildDistrictOptions,
  getChildVillageOptions,
  deliveryMethod,
  setDeliveryMethod,
  postalProvider,
  setPostalProvider,
  deliveryProvince,
  setDeliveryProvince,
  deliveryDistrict,
  setDeliveryDistrict,
  deliveryVillage,
  setDeliveryVillage,
  deliveryUnit,
  setDeliveryUnit,
  deliveryAddressDetail,
  setDeliveryAddressDetail,
  deliveryDistrictOptions,
  deliveryVillageOptions,
  recipientName,
  setRecipientName,
  recipientPhone,
  setRecipientPhone,
  personalInfoSummary,
  addressSummary,
  attachmentsSummary,
  onJumpToStep,
  errors,
  clearError,
}) => {
  // Trạng thái thu gọn từng card trẻ em
  const [collapsedChildren, setCollapsedChildren] = useState<Record<string, boolean>>({});

  // 4 mục tóm tắt ở phần kiểm tra lại thông tin: mặc định đều THU GỌN (false)
  const [openReviews, setOpenReviews] = useState<Record<string, boolean>>({
    personal: false,
    address: false,
    docs: false,
    children: false,
  });

  const toggleReview = (key: string) => {
    setOpenReviews((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleChildCollapse = (id: string) => {
    setCollapsedChildren((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8">
      {/* Tiêu đề bước & dòng hướng dẫn ngắn */}
      <div>
        <h2 className="text-2xl font-bold text-[#1F2937]">
          Bước 3: Trẻ em đi kèm và xác nhận
        </h2>
        <p className="text-[16px] text-[#4B5563] mt-1">
          Khai báo trẻ em đi cùng (nếu có), chọn hình thức nhận kết quả và kiểm tra lại thông tin trước khi nộp.
        </p>
        <p className="text-[14px] text-[#D71920] font-medium mt-1">
          * Các trường có dấu sao là bắt buộc
        </p>
      </div>

      {/* =========================================================================
          PHẦN 1: TRẺ EM ĐI KÈM (KHÔNG BẮT BUỘC)
      ========================================================================= */}
      <Card>
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#D9E1DC] pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#006B3F]" />
              <span className="text-[15px] font-bold text-[#006B3F] uppercase tracking-wide">
                Trẻ em đi kèm
              </span>
              <span className="text-[13px] text-[#6B7280] font-normal lowercase">
                (không bắt buộc)
              </span>
            </div>
            {childrenData.length > 0 && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onAddChild}
                icon={<Plus className="w-4 h-4 text-[#006B3F]" />}
              >
                Thêm trẻ em
              </Button>
            )}
          </div>

          {/* Trạng thái trống khi chưa có trẻ em */}
          {childrenData.length === 0 ? (
            <div className="p-8 border-2 border-dashed border-[#D9E1DC] rounded-xl text-center bg-[#F9FAFB] space-y-3">
              <Users className="w-12 h-12 text-[#9CA3AF] mx-auto" />
              <p className="text-[16px] text-[#4B5563]">
                Chưa có trẻ em đi kèm. Nếu không có, bạn bỏ qua phần này.
              </p>
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={onAddChild}
                className="min-h-[44px] text-[15px] font-semibold"
                icon={<Plus className="w-4 h-4 text-[#006B3F]" />}
              >
                + Thêm trẻ em đi kèm
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {childrenData.map((child, index) => {
                const isCollapsed = !!collapsedChildren[child.id];
                const childTitle =
                  child.fullNameLao || child.fullNameLatin || `Trẻ em #${index + 1}`;

                return (
                  <div
                    key={child.id}
                    className="border border-[#D9E1DC] rounded-xl bg-white overflow-hidden shadow-xs"
                  >
                    {/* Header của thẻ trẻ em: bấm để thu gọn / mở rộng */}
                    <div className="p-4 bg-[#F5F7F6] flex items-center justify-between border-b border-[#D9E1DC]">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-[#006B3F] text-white text-[13px] font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div>
                          <span className="text-[16px] font-bold text-[#1F2937]">
                            {childTitle}
                          </span>
                          <span className="text-[13px] text-[#6B7280] ml-3">
                            {child.dob ? `Sinh ngày: ${child.dob}` : 'Chưa nhập ngày sinh'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleChildCollapse(child.id)}
                          className="px-2.5 py-1 text-[13px] text-[#006B3F] font-semibold hover:bg-white rounded transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {isCollapsed ? (
                            <>
                              <span>Mở rộng</span>
                              <ChevronDown className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              <span>Thu gọn</span>
                              <ChevronUp className="w-4 h-4" />
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveChild(child.id)}
                          className="p-1 text-[#D71920] hover:bg-[#FEECEC] rounded transition-colors cursor-pointer"
                          title="Xóa trẻ này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Thân form trẻ em khi mở rộng */}
                    {!isCollapsed && (
                      <div className="p-5 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div id={`child-fullNameLao-${child.id}`}>
                            <Input
                              label="Họ và tên (chữ Lào)"
                              placeholder="VD: ບຸນມີ ສີສຸລິດ"
                              value={child.fullNameLao}
                              onChange={(e) =>
                                onUpdateChild(child.id, 'fullNameLao', e.target.value)
                              }
                              required
                              error={errors[`child-fullNameLao-${child.id}`]}
                              className="text-[15px]"
                            />
                          </div>

                          <div id={`child-fullNameLatin-${child.id}`}>
                            <Input
                              label="Họ và tên"
                              placeholder="VD: BOUNMY SISOULITH"
                              value={child.fullNameLatin}
                              onChange={(e) =>
                                onUpdateChild(
                                  child.id,
                                  'fullNameLatin',
                                  e.target.value.toUpperCase()
                                )
                              }
                              required
                              error={errors[`child-fullNameLatin-${child.id}`]}
                              className="text-[15px]"
                            />
                          </div>

                          <div id={`child-citizenId-${child.id}`}>
                            <Input
                              label="Số định danh"
                              placeholder="13 chữ số"
                              value={child.citizenId || ''}
                              onChange={(e) =>
                                onUpdateChild(child.id, 'citizenId', e.target.value)
                              }
                              required
                              error={errors[`child-citizenId-${child.id}`]}
                              className="text-[15px]"
                            />
                          </div>

                          <div id={`child-dob-${child.id}`}>
                            <Input
                              label="Ngày sinh (Dưới 12 tuổi)"
                              type="date"
                              value={child.dob}
                              onChange={(e) =>
                                onUpdateChild(child.id, 'dob', e.target.value)
                              }
                              required
                              error={errors[`child-dob-${child.id}`]}
                              className="text-[15px]"
                            />
                          </div>

                          <div id={`child-gender-${child.id}`}>
                            <Select
                              label="Giới tính"
                              value={child.gender}
                              onChange={(e) =>
                                onUpdateChild(child.id, 'gender', e.target.value as any)
                              }
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
                              label="Quan hệ với người đề nghị"
                              value={child.relationship}
                              onChange={(e) =>
                                onUpdateChild(child.id, 'relationship', e.target.value as any)
                              }
                              required
                              error={errors[`child-relationship-${child.id}`]}
                              options={[
                                { value: '', label: 'Chọn mối quan hệ...' },
                                { value: 'Bố', label: 'Bố' },
                                { value: 'Mẹ', label: 'Mẹ' },
                                { value: 'Người giám hộ', label: 'Người giám hộ' },
                              ]}
                            />
                          </div>
                        </div>

                        {/* Checkbox chung hộ khẩu */}
                        <div className="pt-2">
                          <label className="flex items-center gap-2.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={child.inAttachedHouseholdBook}
                              onChange={(e) =>
                                onUpdateChild(
                                  child.id,
                                  'inAttachedHouseholdBook',
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 text-[#006B3F] rounded border-[#D9E1DC] focus:ring-[#006B3F]"
                            />
                            <span className="text-[14px] text-[#1F2937] font-medium">
                              Trẻ này có tên trong Sổ hộ khẩu đã đính kèm ở mục Giấy tờ tùy thân
                            </span>
                          </label>
                        </div>

                        {/* Nếu không chung hộ khẩu: hiển thị nhập địa chỉ trẻ */}
                        {!child.inAttachedHouseholdBook && (
                          <div className="p-4 bg-[#F5F7F6] border border-[#D9E1DC] rounded-lg space-y-4">
                            <span className="text-[14px] font-bold text-[#006B3F] block">
                              Nơi thường trú của trẻ (bắt buộc thuộc tỉnh biên giới):
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <AdminUnitCombobox
                                label="Tỉnh / Thành phố"
                                value={child.resProvince || ''}
                                onChange={(val) =>
                                  onUpdateChild(child.id, 'resProvince', val)
                                }
                                options={LAO_BORDER_PROVINCES}
                                required
                                error={errors[`child-resProvince-${child.id}`]}
                              />
                              <AdminUnitCombobox
                                label="Quận / Huyện"
                                value={child.resDistrict || ''}
                                onChange={(val) =>
                                  onUpdateChild(child.id, 'resDistrict', val)
                                }
                                options={getChildDistrictOptions(child.resProvince)}
                                required
                                error={errors[`child-resDistrict-${child.id}`]}
                              />
                              <AdminUnitCombobox
                                label="Bản"
                                value={child.resVillage || ''}
                                onChange={(val) =>
                                  onUpdateChild(child.id, 'resVillage', val)
                                }
                                options={getChildVillageOptions(child.resDistrict)}
                                required
                                error={errors[`child-resVillage-${child.id}`]}
                              />
                              <Input
                                label="Địa chỉ chi tiết"
                                value={child.resAddressDetail || ''}
                                onChange={(e) =>
                                  onUpdateChild(child.id, 'resAddressDetail', e.target.value)
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={onAddChild}
                  icon={<Plus className="w-4 h-4 text-[#006B3F]" />}
                >
                  + Thêm trẻ em khác
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* =========================================================================
          PHẦN 2: HÌNH THỨC NHẬN KẾT QUẢ
      ========================================================================= */}
      <Card>
        <div className="space-y-6">
          <div className="text-[15px] font-bold text-[#006B3F] uppercase tracking-wide border-b border-[#D9E1DC] pb-3">
            Hình thức nhận kết quả
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label
              className={`p-4 border rounded-xl flex items-start gap-3 cursor-pointer transition-all ${
                deliveryMethod === 'direct'
                  ? 'border-[#006B3F] bg-[#E6F5EE]/40'
                  : 'border-[#D9E1DC] hover:border-[#9CA3AF]'
              }`}
            >
              <input
                type="radio"
                name="deliveryMethod"
                value="direct"
                checked={deliveryMethod === 'direct'}
                onChange={() => setDeliveryMethod('direct')}
                className="mt-1 text-[#006B3F] focus:ring-[#006B3F]"
              />
              <div>
                <span className="font-bold text-[15px] text-[#1F2937] block">
                  Nhận trực tiếp tại cơ quan tiếp nhận
                </span>
                <span className="text-[13px] text-[#6B7280]">
                  Đến Công an Tỉnh Bokeo nhận sổ và đối chiếu hồ sơ gốc.
                </span>
              </div>
            </label>

            <label
              className={`p-4 border rounded-xl flex items-start gap-3 cursor-pointer transition-all ${
                deliveryMethod === 'postal'
                  ? 'border-[#006B3F] bg-[#E6F5EE]/40'
                  : 'border-[#D9E1DC] hover:border-[#9CA3AF]'
              }`}
            >
              <input
                type="radio"
                name="deliveryMethod"
                value="postal"
                checked={deliveryMethod === 'postal'}
                onChange={() => setDeliveryMethod('postal')}
                className="mt-1 text-[#006B3F] focus:ring-[#006B3F]"
              />
              <div>
                <span className="font-bold text-[15px] text-[#1F2937] block">
                  Nhận qua bưu chính (chuyển phát tận nhà)
                </span>
                <span className="text-[13px] text-[#6B7280]">
                  Giao qua bưu điện đến địa chỉ bạn cung cấp.
                </span>
              </div>
            </label>
          </div>

          {deliveryMethod === 'postal' && (
            <div className="p-5 bg-[#F9FAFB] border border-[#D9E1DC] rounded-xl space-y-4">
              <span className="text-[14px] font-bold text-[#006B3F] block">
                Thông tin người nhận và địa chỉ chuyển phát:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Họ và tên người nhận"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  required
                  error={errors['field-recipientName']}
                />
                <Input
                  label="Số điện thoại người nhận"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  required
                  error={errors['field-recipientPhone']}
                />
                <AdminUnitCombobox
                  label="Tỉnh / Thành phố"
                  value={deliveryProvince}
                  onChange={(val) => setDeliveryProvince(val)}
                  options={LAO_PROVINCES}
                  required
                  error={errors['field-deliveryProvince']}
                />
                <AdminUnitCombobox
                  label="Quận / Huyện"
                  value={deliveryDistrict}
                  onChange={(val) => setDeliveryDistrict(val)}
                  options={deliveryDistrictOptions}
                  required
                  error={errors['field-deliveryDistrict']}
                />
                <AdminUnitCombobox
                  label="Bản"
                  value={deliveryVillage}
                  onChange={(val) => setDeliveryVillage(val)}
                  options={deliveryVillageOptions}
                  required
                  error={errors['field-deliveryVillage']}
                />
                <Input
                  label="Địa chỉ chi tiết (số nhà, ngõ)"
                  value={deliveryAddressDetail}
                  onChange={(e) => setDeliveryAddressDetail(e.target.value)}
                  required
                  error={errors['field-deliveryAddressDetail']}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* =========================================================================
          PHẦN 3: KIỂM TRA LẠI THÔNG TIN (MẶC ĐỊNH THU GỌN, BẤM ĐỂ MỞ, CÓ NÚT SỬA)
      ========================================================================= */}
      <Card>
        <div className="space-y-4">
          <div className="border-b border-[#D9E1DC] pb-3">
            <span className="text-[15px] font-bold text-[#006B3F] uppercase tracking-wide">
              Kiểm tra lại thông tin
            </span>
            <p className="text-[13px] text-[#6B7280] mt-0.5">
              Bấm vào từng mục để xem lại thông tin đã kê khai hoặc bấm "Sửa" để quay về bước tương ứng.
            </p>
          </div>

          <div className="space-y-3">
            {/* Mục 1: Thông tin cá nhân */}
            <div className="border border-[#D9E1DC] rounded-lg overflow-hidden">
              <div
                onClick={() => toggleReview('personal')}
                className="p-3.5 bg-[#F5F7F6] flex items-center justify-between cursor-pointer hover:bg-[#EAEAEA] transition-colors"
              >
                <div className="flex items-center gap-2 font-bold text-[15px] text-[#1F2937]">
                  <User className="w-4 h-4 text-[#006B3F]" />
                  <span>1. Thông tin cá nhân & Giấy tờ tùy thân</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onJumpToStep(1);
                    }}
                    className="text-[13px] text-[#006B3F] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Sửa</span>
                  </button>
                  {openReviews.personal ? (
                    <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                  )}
                </div>
              </div>
              {openReviews.personal && (
                <div className="p-4 bg-white text-[14px] space-y-2 border-t border-[#D9E1DC]">
                  <p><strong>Họ và tên:</strong> {personalInfoSummary.fullName}</p>
                  <p><strong>Name (Latin):</strong> {personalInfoSummary.fullNameLatin || '—'}</p>
                  <p><strong>Ngày sinh:</strong> {personalInfoSummary.dob || '—'} · <strong>Giới tính:</strong> {personalInfoSummary.gender || '—'}</p>
                  <p><strong>Số định danh/CMND:</strong> {personalInfoSummary.nationalId || '—'}</p>
                  <p><strong>Số sổ hộ khẩu:</strong> {personalInfoSummary.householdBookNo || '—'}</p>
                  <p><strong>Ảnh chân dung 3x4:</strong> {personalInfoSummary.hasPhoto ? 'Đã tải lên' : 'Chưa có'}</p>
                </div>
              )}
            </div>

            {/* Mục 2: Địa chỉ */}
            <div className="border border-[#D9E1DC] rounded-lg overflow-hidden">
              <div
                onClick={() => toggleReview('address')}
                className="p-3.5 bg-[#F5F7F6] flex items-center justify-between cursor-pointer hover:bg-[#EAEAEA] transition-colors"
              >
                <div className="flex items-center gap-2 font-bold text-[15px] text-[#1F2937]">
                  <Home className="w-4 h-4 text-[#006B3F]" />
                  <span>2. Nơi khai sinh & Nơi thường trú</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onJumpToStep(2);
                    }}
                    className="text-[13px] text-[#006B3F] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Sửa</span>
                  </button>
                  {openReviews.address ? (
                    <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                  )}
                </div>
              </div>
              {openReviews.address && (
                <div className="p-4 bg-white text-[14px] space-y-2 border-t border-[#D9E1DC]">
                  <p><strong>Nơi sinh:</strong> {addressSummary.birthPlace || '—'}</p>
                  <p><strong>Nơi thường trú:</strong> {addressSummary.resPlace || '—'}</p>
                </div>
              )}
            </div>

            {/* Mục 3: Hồ sơ đính kèm */}
            <div className="border border-[#D9E1DC] rounded-lg overflow-hidden">
              <div
                onClick={() => toggleReview('docs')}
                className="p-3.5 bg-[#F5F7F6] flex items-center justify-between cursor-pointer hover:bg-[#EAEAEA] transition-colors"
              >
                <div className="flex items-center gap-2 font-bold text-[15px] text-[#1F2937]">
                  <FileText className="w-4 h-4 text-[#006B3F]" />
                  <span>3. Hồ sơ đính kèm ({attachmentsSummary.filter((a) => !!a.file).length} tệp)</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onJumpToStep(2);
                    }}
                    className="text-[13px] text-[#006B3F] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Sửa</span>
                  </button>
                  {openReviews.docs ? (
                    <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                  )}
                </div>
              </div>
              {openReviews.docs && (
                <div className="p-4 bg-white text-[14px] space-y-1.5 border-t border-[#D9E1DC]">
                  {attachmentsSummary.map((a, i) => (
                    <div key={a.id} className="flex items-center justify-between">
                      <span>• {a.name}:</span>
                      <span className="font-medium text-[#006B3F]">
                        {a.file ? a.file.name : 'Chưa đính kèm'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mục 4: Trẻ em đi kèm */}
            <div className="border border-[#D9E1DC] rounded-lg overflow-hidden">
              <div
                onClick={() => toggleReview('children')}
                className="p-3.5 bg-[#F5F7F6] flex items-center justify-between cursor-pointer hover:bg-[#EAEAEA] transition-colors"
              >
                <div className="flex items-center gap-2 font-bold text-[15px] text-[#1F2937]">
                  <Users className="w-4 h-4 text-[#006B3F]" />
                  <span>4. Trẻ em đi kèm ({childrenData.length} trẻ)</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onJumpToStep(3);
                    }}
                    className="text-[13px] text-[#006B3F] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Sửa</span>
                  </button>
                  {openReviews.children ? (
                    <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                  )}
                </div>
              </div>
              {openReviews.children && (
                <div className="p-4 bg-white text-[14px] space-y-1.5 border-t border-[#D9E1DC]">
                  {childrenData.length === 0 ? (
                    <p className="text-[#6B7280] italic">Không có trẻ em đi kèm.</p>
                  ) : (
                    childrenData.map((c, i) => (
                      <p key={c.id}>
                        • Trẻ {i + 1}: {c.fullNameLao || c.fullNameLatin} ({c.dob || 'Chưa ngày sinh'})
                      </p>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* =========================================================================
          PHẦN 4: KHỐI CẢNH BÁO VÀNG "LƯU Ý QUAN TRỌNG"
      ========================================================================= */}
      <div className="p-5 rounded-xl bg-[#FFF8E7] border-l-4 border-l-[#D6A928] border border-y-[#F4E29D] border-r-[#F4E29D] space-y-2 text-[14px] text-[#1F2937]">
        <div className="flex items-center gap-2 text-[#9A740E] font-bold text-[15px]">
          <AlertTriangle className="w-5 h-5 text-[#D6A928]" />
          <span>Lưu ý quan trọng:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 pl-1 text-[#1F2937] leading-relaxed">
          <li>
            Khi đến đối chiếu hồ sơ gốc, vui lòng mang theo bản gốc Căn cước/CMND và Sổ hộ khẩu.
          </li>
          <li>
            Nếu thông tin kê khai không chính xác hoặc không đầy đủ, hồ sơ có thể không được thụ lý xem xét.
          </li>
        </ul>
      </div>
    </div>
  );
};
