import React from 'react';
import {
  MapPin,
  Home,
  FileCheck,
  Paperclip,
  Eye,
  Trash2,
  Plus,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { AdminUnitCombobox } from '../AdminUnitCombobox';
import {
  LAO_PROVINCES,
  LAO_BORDER_PROVINCES,
  LAO_UNITS_SAMPLE,
} from '../laoAdminData';

export interface AttachmentRow {
  id: string;
  name: string;
  isCustom: boolean;
  required: boolean;
  docType: 'Bản sao' | 'Bản gốc';
  file?: {
    name: string;
    size: string;
    url?: string;
  };
  quantity: number | string;
  note: string;
}

interface Step2AddressDocsProps {
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

  attachments: AttachmentRow[];
  onUploadFile: (rowId: string, file: File) => void;
  onRemoveFile: (rowId: string) => void;
  onAddCustomRow: () => void;
  onRemoveCustomRow: (rowId: string) => void;
  onUpdateRowField: (rowId: string, field: keyof AttachmentRow, val: any) => void;
  fileInputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  onPreviewDoc: (doc: { title: string; fileName: string }) => void;

  errors: Record<string, string>;
  clearError: (id: string) => void;
}

export const Step2AddressDocs: React.FC<Step2AddressDocsProps> = ({
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
  attachments,
  onUploadFile,
  onRemoveFile,
  onAddCustomRow,
  onRemoveCustomRow,
  onUpdateRowField,
  fileInputRefs,
  onPreviewDoc,
  errors,
  clearError,
}) => {
  return (
    <div className="space-y-8">
      {/* Tiêu đề bước & dòng hướng dẫn ngắn */}
      <div>
        <h2 className="text-2xl font-bold text-[#1F2937]">
          Bước 2: Địa chỉ và hồ sơ đính kèm
        </h2>
        <p className="text-[16px] text-[#4B5563] mt-1">
          Hãy chọn nơi thường trú tại tỉnh biên giới và tải lên bản chụp giấy tờ cần thiết.
        </p>
        <p className="text-[14px] text-[#D71920] font-medium mt-1">
          * Các trường có dấu sao là bắt buộc
        </p>
      </div>

      {/* THẺ 1: NƠI ĐĂNG KÝ KHAI SINH */}
      <Card>
        <div className="space-y-6">
          <div className="text-[15px] font-bold text-[#006B3F] uppercase tracking-wide flex items-center gap-2 border-b border-[#D9E1DC] pb-3">
            <MapPin className="w-5 h-5 text-[#006B3F]" />
            <span>Nơi đăng ký khai sinh</span>
          </div>

          <div className="space-y-5">
            {/* Hàng 1: Tỉnh thành & Quận huyện */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div id="field-birthProvince">
                <AdminUnitCombobox
                  label="Tỉnh / Thành phố"
                  value={birthProvince}
                  onChange={(val) => {
                    setBirthProvince(val);
                    clearError('field-birthProvince');
                  }}
                  options={LAO_PROVINCES}
                  placeholder="Chọn hoặc nhập tỉnh..."
                  required
                  error={errors['field-birthProvince']}
                />
              </div>

              <div id="field-birthDistrict">
                <AdminUnitCombobox
                  label="Quận / Huyện"
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
            </div>

            {/* Hàng 2: Bản & Đơn vị dưới bản */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div id="field-birthVillage">
                <AdminUnitCombobox
                  label="Bản"
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
                  label="Đơn vị dưới bản"
                  value={birthUnit}
                  onChange={(val) => setBirthUnit(val)}
                  options={LAO_UNITS_SAMPLE}
                  placeholder="Chọn hoặc nhập đơn vị..."
                />
              </div>
            </div>

            {/* Hàng 3: Địa chỉ chi tiết */}
            <div id="field-birthAddressDetail">
              <Input
                label="Địa chỉ chi tiết (nếu có)"
                placeholder="Số nhà, ngõ, đường..."
                value={birthAddressDetail}
                onChange={(e) => setBirthAddressDetail(e.target.value)}
                className="text-[16px] py-2.5"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* THẺ 2: NƠI THƯỜNG TRÚ */}
      <Card>
        <div className="space-y-6">
          <div className="text-[15px] font-bold text-[#006B3F] uppercase tracking-wide flex items-center justify-between border-b border-[#D9E1DC] pb-3">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-[#006B3F]" />
              <span>Nơi thường trú</span>
            </div>
          </div>

          <div className="p-3 bg-[#E6F5EE] border border-[#B0DFCA] rounded-lg text-[13px] text-[#006B3F] leading-relaxed">
            <strong>Quy định địa bàn:</strong> Dịch vụ chỉ áp dụng cho công dân có hộ khẩu thường trú tại các tỉnh biên giới có trong danh sách.
          </div>

          <div className="space-y-5">
            {/* Hàng 1: Tỉnh thành & Quận huyện */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div id="field-resProvince">
                <AdminUnitCombobox
                  label="Tỉnh / Thành phố thường trú"
                  value={resProvince}
                  onChange={(val) => {
                    setResProvince(val);
                    clearError('field-resProvince');
                  }}
                  options={LAO_BORDER_PROVINCES}
                  placeholder="Chọn hoặc nhập tỉnh biên giới..."
                  required
                  error={errors['field-resProvince']}
                />
              </div>

              <div id="field-resDistrict">
                <AdminUnitCombobox
                  label="Quận / Huyện"
                  value={resDistrict}
                  onChange={(val) => {
                    setResDistrict(val);
                    clearError('field-resDistrict');
                  }}
                  options={resDistrictOptions}
                  placeholder="Chọn hoặc nhập quận/huyện..."
                  required
                  error={errors['field-resDistrict']}
                />
              </div>
            </div>

            {/* Hàng 2: Bản & Đơn vị dưới bản */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div id="field-resVillage">
                <AdminUnitCombobox
                  label="Bản"
                  value={resVillage}
                  onChange={(val) => {
                    setResVillage(val);
                    clearError('field-resVillage');
                  }}
                  options={resVillageOptions}
                  placeholder="Chọn hoặc nhập bản..."
                  required
                  error={errors['field-resVillage']}
                />
              </div>

              <div id="field-resUnit">
                <AdminUnitCombobox
                  label="Đơn vị dưới bản"
                  value={resUnit}
                  onChange={(val) => setResUnit(val)}
                  options={LAO_UNITS_SAMPLE}
                  placeholder="Chọn hoặc nhập đơn vị..."
                />
              </div>
            </div>

            {/* Hàng 3: Địa chỉ chi tiết */}
            <div id="field-resAddressDetail">
              <Input
                label="Địa chỉ chi tiết (nếu có)"
                placeholder="Số nhà, ngõ, đường..."
                value={resAddressDetail}
                onChange={(e) => setResAddressDetail(e.target.value)}
                className="text-[16px] py-2.5"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* THẺ 3: GIẤY TỜ ĐÍNH KÈM */}
      <Card>
        <div className="space-y-6">
          <div className="text-[15px] font-bold text-[#006B3F] uppercase tracking-wide flex items-center justify-between border-b border-[#D9E1DC] pb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#006B3F]" />
              <span>Giấy tờ đính kèm</span>
            </div>
          </div>

          <p className="text-[14px] text-[#4B5563]">
            Đính kèm bản scan/chụp rõ nét của Căn cước/CMND và Sổ hộ khẩu để đối chiếu.
          </p>

          {/* DẠNG BẢNG TRÊN MÁY TÍNH (hidden md:block) */}
          <div className="hidden md:block overflow-x-auto border border-[#D9E1DC] rounded-lg bg-white">
            <table className="w-full text-left border-collapse text-[14px]">
              <thead>
                <tr className="bg-[#F5F7F6] border-b border-[#D9E1DC] text-[#1F2937] font-semibold">
                  <th className="py-3 px-3 w-12 text-center">STT</th>
                  <th className="py-3 px-3 min-w-[200px]">Tên giấy tờ</th>
                  <th className="py-3 px-3 w-32">Loại giấy tờ</th>
                  <th className="py-3 px-3 min-w-[240px]">Đính kèm</th>
                  <th className="py-3 px-3 w-24 text-center">Số lượng</th>
                  <th className="py-3 px-3 min-w-[160px]">Ghi chú</th>
                  <th className="py-3 px-3 w-28 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E1DC] text-[#1F2937]">
                {attachments.map((row, idx) => (
                  <tr
                    key={row.id}
                    id={row.id}
                    className={`hover:bg-[#F5F7F6]/60 transition-colors ${
                      errors[row.id] ? 'bg-[#FFF5F5]' : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-center text-[#6B7280] font-medium">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-3">
                      {row.isCustom ? (
                        <div>
                          <input
                            type="text"
                            placeholder="Nhập tên giấy tờ bổ sung..."
                            value={row.name}
                            onChange={(e) =>
                              onUpdateRowField(row.id, 'name', e.target.value)
                            }
                            className={`w-full text-[14px] text-[#1F2937] bg-white border rounded px-3 py-1.5 outline-none focus:border-[#006B3F] ${
                              errors[`name-${row.id}`]
                                ? 'border-[#D71920]'
                                : 'border-[#D9E1DC]'
                            }`}
                          />
                          {errors[`name-${row.id}`] && (
                            <span className="text-[12px] text-[#D71920] block mt-1">
                              {errors[`name-${row.id}`]}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="font-semibold text-[#1F2937] flex items-center">
                          <span>{row.name}</span>
                          {row.required && (
                            <span className="text-[#D71920] ml-1 font-bold">*</span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <select
                        value={row.docType}
                        onChange={(e) =>
                          onUpdateRowField(row.id, 'docType', e.target.value)
                        }
                        className="w-full text-[14px] text-[#1F2937] bg-white border border-[#D9E1DC] rounded px-2.5 py-1.5 outline-none focus:border-[#006B3F] cursor-pointer"
                      >
                        <option value="Bản sao">Bản sao</option>
                        <option value="Bản gốc">Bản gốc</option>
                      </select>
                    </td>

                    <td className="py-3 px-3">
                      {row.file ? (
                        <div className="flex items-center gap-2 p-2 bg-[#F5F7F6] border border-[#D9E1DC] rounded">
                          <FileText className="w-4 h-4 text-[#006B3F] shrink-0" />
                          <span
                            className="text-[13px] font-medium text-[#1F2937] truncate max-w-[160px]"
                            title={row.file.name}
                          >
                            {row.file.name}
                          </span>
                          <span className="text-[11px] text-[#6B7280] shrink-0">
                            ({row.file.size})
                          </span>
                        </div>
                      ) : (
                        <div id={`file-${row.id}`}>
                          <button
                            type="button"
                            onClick={() => fileInputRefs.current[row.id]?.click()}
                            className={`inline-flex items-center gap-1.5 text-[14px] font-semibold hover:underline cursor-pointer py-1 ${
                              errors[row.id] ? 'text-[#D71920]' : 'text-[#006B3F]'
                            }`}
                          >
                            <Paperclip className="w-4 h-4" />
                            <span>Tải lên</span>
                          </button>
                          <input
                            type="file"
                            ref={(el) => {
                              fileInputRefs.current[row.id] = el;
                            }}
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                onUploadFile(row.id, e.target.files[0]);
                              }
                            }}
                          />
                          {errors[row.id] && (
                            <div className="text-[12px] text-[#D71920] font-medium mt-0.5">
                              {errors[row.id]}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={row.quantity}
                        onChange={(e) =>
                          onUpdateRowField(row.id, 'quantity', e.target.value)
                        }
                        className="w-16 text-center text-[14px] text-[#1F2937] bg-white border border-[#D9E1DC] rounded px-2 py-1.5 outline-none focus:border-[#006B3F]"
                      />
                    </td>

                    <td className="py-3 px-3">
                      <input
                        type="text"
                        placeholder="Ghi chú thêm..."
                        value={row.note}
                        onChange={(e) =>
                          onUpdateRowField(row.id, 'note', e.target.value)
                        }
                        className="w-full text-[14px] text-[#1F2937] bg-white border border-[#D9E1DC] rounded px-2.5 py-1.5 outline-none focus:border-[#006B3F]"
                      />
                    </td>

                    {/* Cột thao tác: biểu tượng Xem (Eye), Xóa (Trash) chuyển xuống đây khi đính kèm */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {row.file && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                onPreviewDoc({
                                  title: row.name,
                                  fileName: row.file?.name || 'Tài liệu',
                                })
                              }
                              className="p-1.5 text-[#006B3F] hover:bg-[#E8F3EE] rounded transition-colors inline-flex items-center justify-center cursor-pointer"
                              title="Xem lại tệp tin"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => onRemoveFile(row.id)}
                              className="p-1.5 text-[#D71920] hover:bg-[#FEECEC] rounded transition-colors inline-flex items-center justify-center cursor-pointer"
                              title="Xóa tệp đính kèm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {row.isCustom && (
                          <button
                            type="button"
                            onClick={() => onRemoveCustomRow(row.id)}
                            className="p-1.5 text-[#6B7280] hover:text-[#D71920] hover:bg-[#FEECEC] rounded transition-colors inline-flex items-center justify-center cursor-pointer"
                            title="Xóa dòng này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* DẠNG THẺ DỌC TRÊN ĐIỆN THOẠI (md:hidden) */}
          <div className="md:hidden space-y-4">
            {attachments.map((row, idx) => (
              <div
                key={row.id}
                id={`mobile-${row.id}`}
                className={`p-4 border rounded-xl bg-white space-y-3.5 shadow-xs ${
                  errors[row.id] ? 'border-[#D71920] bg-[#FFF5F5]' : 'border-[#D9E1DC]'
                }`}
              >
                <div className="flex items-center justify-between border-b border-[#D9E1DC] pb-2.5">
                  <span className="text-[13px] font-bold text-[#006B3F]">
                    Giấy tờ #{idx + 1}
                  </span>
                  {row.required && (
                    <span className="text-[12px] bg-[#FEECEC] text-[#D71920] px-2 py-0.5 rounded font-bold">
                      Bắt buộc
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-[14px] font-semibold text-[#1F2937] block mb-1">
                    Tên giấy tờ:
                  </label>
                  {row.isCustom ? (
                    <input
                      type="text"
                      placeholder="Nhập tên giấy tờ..."
                      value={row.name}
                      onChange={(e) =>
                        onUpdateRowField(row.id, 'name', e.target.value)
                      }
                      className="w-full text-[15px] p-2.5 border border-[#D9E1DC] rounded-lg outline-none focus:border-[#006B3F]"
                    />
                  ) : (
                    <div className="text-[15px] font-bold text-[#1F2937]">{row.name}</div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[13px] font-medium text-[#6B7280] block mb-1">
                      Loại giấy tờ
                    </label>
                    <select
                      value={row.docType}
                      onChange={(e) =>
                        onUpdateRowField(row.id, 'docType', e.target.value)
                      }
                      className="w-full text-[14px] p-2 border border-[#D9E1DC] rounded-lg bg-white"
                    >
                      <option value="Bản sao">Bản sao</option>
                      <option value="Bản gốc">Bản gốc</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-[#6B7280] block mb-1">
                      Số lượng
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={row.quantity}
                      onChange={(e) =>
                        onUpdateRowField(row.id, 'quantity', e.target.value)
                      }
                      className="w-full text-[14px] p-2 border border-[#D9E1DC] rounded-lg text-center"
                    />
                  </div>
                </div>

                {/* Vùng đính kèm trên mobile */}
                <div>
                  <label className="text-[13px] font-medium text-[#6B7280] block mb-1">
                    Tệp đính kèm
                  </label>
                  {row.file ? (
                    <div className="p-3 bg-[#F5F7F6] border border-[#D9E1DC] rounded-lg flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-5 h-5 text-[#006B3F] shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[13px] font-semibold truncate block">
                            {row.file.name}
                          </span>
                          <span className="text-[11px] text-[#6B7280]">
                            {row.file.size}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            onPreviewDoc({
                              title: row.name,
                              fileName: row.file?.name || 'Tài liệu',
                            })
                          }
                          className="p-1.5 text-[#006B3F] hover:bg-[#E8F3EE] rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveFile(row.id)}
                          className="p-1.5 text-[#D71920] hover:bg-[#FEECEC] rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[row.id]?.click()}
                        className={`w-full py-2.5 px-3 border border-dashed rounded-lg text-center flex items-center justify-center gap-2 font-semibold text-[14px] ${
                          errors[row.id]
                            ? 'border-[#D71920] text-[#D71920]'
                            : 'border-[#006B3F] text-[#006B3F] bg-[#E6F5EE]/40'
                        }`}
                      >
                        <Paperclip className="w-4 h-4" />
                        <span>Bấm để tải tệp lên</span>
                      </button>
                      <input
                        type="file"
                        ref={(el) => {
                          fileInputRefs.current[row.id] = el;
                        }}
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            onUploadFile(row.id, e.target.files[0]);
                          }
                        }}
                      />
                      {errors[row.id] && (
                        <div className="text-[12px] text-[#D71920] font-medium mt-1">
                          {errors[row.id]}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Ghi chú thêm..."
                    value={row.note}
                    onChange={(e) => onUpdateRowField(row.id, 'note', e.target.value)}
                    className="w-full text-[13px] p-2 border border-[#D9E1DC] rounded-lg"
                  />
                </div>

                {row.isCustom && (
                  <button
                    type="button"
                    onClick={() => onRemoveCustomRow(row.id)}
                    className="w-full py-1.5 text-[13px] text-[#D71920] hover:bg-[#FEECEC] rounded font-medium"
                  >
                    Xóa mục giấy tờ này
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Nút thêm dòng giấy tờ mới */}
          <div className="pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onAddCustomRow}
              className="min-h-[42px] text-[14px] font-semibold"
              icon={<Plus className="w-4 h-4 text-[#006B3F]" />}
            >
              Thêm giấy tờ khác
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
