import React from 'react';
import {
  Paperclip,
  Plus,
  Eye,
  Trash2,
  FileText,
  AlertTriangle,
  Printer,
  Send,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { AdminUnitCombobox } from './AdminUnitCombobox';
import { ChildCompanion } from './FormPart2';
import {
  LAO_PROVINCES,
  LAO_UNITS_SAMPLE,
} from './laoAdminData';

export interface FormPart3Props {
  attachments: any[];
  childrenList: ChildCompanion[];
  childAttachments: Record<string, { [docKey: string]: any }>;
  onUploadDefaultRow: (rowId: string, file: File) => void;
  onRemoveDefaultFile: (rowId: string) => void;
  onUploadChildDoc: (childId: string, docKey: string, file: File) => void;
  onRemoveChildDoc: (childId: string, docKey: string) => void;
  onAddCustomAttachmentRow: () => void;
  onRemoveCustomRow: (rowId: string) => void;
  onUpdateRowField: (rowId: string, field: string, value: any) => void;
  onPreviewDoc: (doc: { title: string; fileName: string }) => void;
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
  recipientName: string;
  setRecipientName: (val: string) => void;
  recipientPhone: string;
  setRecipientPhone: (val: string) => void;
  deliveryDistrictOptions: string[];
  deliveryVillageOptions: string[];
  onPrint: () => void;
  onSubmit: () => void;
  submitButtonText?: string;
  errors: Record<string, string>;
  clearError: (id: string) => void;
  isLao?: boolean;
  procedure?: 'cap-so' | 'tam-thoi';
  readOnly?: boolean;
  supplementMissingDocNames?: string[];
  disableSubmit?: boolean;
  isSubmitting?: boolean;
}

export const FormPart3: React.FC<FormPart3Props> = ({
  procedure = 'cap-so',
  disableSubmit = false,
  isSubmitting = false,
  attachments,
  childrenList,
  childAttachments,
  onUploadDefaultRow,
  onRemoveDefaultFile,
  onUploadChildDoc,
  onRemoveChildDoc,
  onAddCustomAttachmentRow,
  onRemoveCustomRow,
  onUpdateRowField,
  onPreviewDoc,
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
  recipientName,
  setRecipientName,
  recipientPhone,
  setRecipientPhone,
  deliveryDistrictOptions,
  deliveryVillageOptions,
  onPrint,
  onSubmit,
  submitButtonText,
  errors,
  clearError,
  isLao = false,
  readOnly = false,
  supplementMissingDocNames = [],
}) => {
  const fileInputsRef = React.useRef<Record<string, HTMLInputElement | null>>({});

  const isMissingDoc = (docName: string, hasFile: boolean) => {
    if (hasFile) return false;
    if (!supplementMissingDocNames || supplementMissingDocNames.length === 0) return false;
    const lowerDoc = (docName || '').toLowerCase().trim();
    return supplementMissingDocNames.some((name) => {
      const lowerReq = (name || '').toLowerCase().trim();
      return (
        lowerReq.includes(lowerDoc) ||
        lowerDoc.includes(lowerReq) ||
        (lowerReq.includes('khai sinh') && lowerDoc.includes('khai sinh')) ||
        (lowerReq.includes('hộ khẩu') && lowerDoc.includes('hộ khẩu')) ||
        (lowerReq.includes('căn cước') && lowerDoc.includes('căn cước')) ||
        (lowerReq.includes('cmnd') && lowerDoc.includes('cmnd')) ||
        (lowerReq.includes('giám hộ') && lowerDoc.includes('giám hộ'))
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* THẺ CON 1: GIẤY TỜ ĐÍNH KÈM */}
      <div className="bg-white border border-[#D9E1DC] rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-[#E5E9E7] pb-3">
          <h4 className="text-[17px] font-bold text-[#006B3F] uppercase tracking-wide">
            {isLao ? 'ເອກະສານຄັດຕິດ' : 'Giấy tờ đính kèm'}
          </h4>
          <p className="text-[14px] text-[#4B5563] mt-0.5">
            Đính kèm bản scan/chụp rõ nét của Căn cước/CMND, Sổ hộ khẩu và giấy tờ của trẻ em (nếu có) để đối chiếu.
          </p>
        </div>

        {/* DESKTOP VIEW: Bảng 7 cột đầy đủ */}
        <div className="hidden md:block overflow-x-auto border border-[#D9E1DC] rounded-xl bg-white">
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="bg-[#F5F7F6] border-b border-[#D9E1DC] text-[#1F2937] font-semibold">
                <th className="py-3 px-3 w-12 text-center">STT</th>
                <th className="py-3 px-3 min-w-[220px]">Tên giấy tờ</th>
                <th className="py-3 px-3 w-32">Loại giấy tờ</th>
                <th className="py-3 px-3 min-w-[220px]">Đính kèm</th>
                <th className="py-3 px-3 w-20 text-center">Số lượng</th>
                <th className="py-3 px-3 min-w-[150px]">Ghi chú</th>
                <th className="py-3 px-3 w-24 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9E1DC] text-[#1F2937]">
              {/* 1. Các dòng giấy tờ mặc định (Bản sao CMND/Căn cước, Bản sao Sổ hộ khẩu, và các dòng tự thêm) */}
              {attachments.map((row, idx) => (
                <tr
                  key={row.id}
                  id={row.id}
                  className={`hover:bg-[#F5F7F6]/60 transition-colors ${
                    errors[row.id] ? 'bg-[#FFF5F5]' : ''
                  }`}
                >
                  <td className="py-3 px-3 text-center text-[#6B7280] font-medium">{idx + 1}</td>
                  <td className="py-3 px-3">
                    {row.isCustom ? (
                      <div>
                        <input
                          type="text"
                          id={`name-${row.id}`}
                          placeholder="Nhập tên giấy tờ..."
                          value={row.name}
                          onChange={(e) => onUpdateRowField(row.id, 'name', e.target.value)}
                          className="w-full text-[14px] bg-white border border-[#D9E1DC] rounded px-3 py-1.5 outline-none focus:border-[#006B3F]"
                        />
                        {errors[`name-${row.id}`] && (
                          <span className="text-[12px] text-[#D71920] block mt-1">
                            {errors[`name-${row.id}`]}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="font-semibold text-[#1F2937] flex items-center gap-1.5">
                        <span>{row.name}</span>
                        {row.required && <span className="text-[#D71920] font-bold">*</span>}
                        {isMissingDoc(row.name, !!row.file) && (
                          <span
                            className="inline-block w-2.5 h-2.5 rounded-full bg-[#D71920] animate-pulse shrink-0"
                            title="Cần bổ sung giấy tờ này"
                          />
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={row.docType}
                      onChange={(e) => onUpdateRowField(row.id, 'docType', e.target.value)}
                      className="w-full text-[14px] bg-white border border-[#D9E1DC] rounded px-2.5 py-1.5 outline-none focus:border-[#006B3F]"
                    >
                      <option value="Bản sao">Bản sao</option>
                      <option value="Bản gốc">Bản gốc</option>
                    </select>
                  </td>
                  <td className="py-3 px-3">
                    {row.file ? (
                      <div className="flex items-center gap-2 p-1.5 bg-[#F5F7F6] border border-[#D9E1DC] rounded">
                        <FileText className="w-4 h-4 text-[#006B3F] shrink-0" />
                        <span className="text-[13px] font-medium text-[#1F2937] truncate max-w-[150px]">
                          {row.file.name}
                        </span>
                        <span className="text-[12px] text-[#6B7280]">({row.file.size})</span>
                      </div>
                    ) : (
                      <div id={`file-${row.id}`}>
                        <button
                          type="button"
                          onClick={() => fileInputsRef.current[row.id]?.click()}
                          className={`inline-flex items-center gap-1.5 text-[14px] font-medium hover:underline cursor-pointer ${
                            errors[row.id] ? 'text-[#D71920]' : 'text-[#006B3F]'
                          }`}
                        >
                          <Paperclip className="w-4 h-4" />
                          <span>Tải lên</span>
                        </button>
                        <input
                          type="file"
                          ref={(el) => {
                            fileInputsRef.current[row.id] = el;
                          }}
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              onUploadDefaultRow(row.id, e.target.files[0]);
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
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={row.quantity}
                      onChange={(e) => onUpdateRowField(row.id, 'quantity', e.target.value)}
                      className="w-16 text-center text-[14px] bg-white border border-[#D9E1DC] rounded px-1.5 py-1.5 outline-none focus:border-[#006B3F]"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      placeholder="Ghi chú thêm..."
                      value={row.note}
                      onChange={(e) => onUpdateRowField(row.id, 'note', e.target.value)}
                      className="w-full text-[14px] bg-white border border-[#D9E1DC] rounded px-2.5 py-1.5 outline-none focus:border-[#006B3F]"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="inline-flex items-center justify-center gap-2">
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
                            className="p-1 text-[#006B3F] hover:bg-[#E8F3EE] rounded"
                            title="Xem lại"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemoveDefaultFile(row.id)}
                            className="p-1 text-[#D71920] hover:bg-[#FEECEC] rounded"
                            title="Xóa tệp đính kèm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {row.isCustom && !row.file && (
                        <button
                          type="button"
                          onClick={() => onRemoveCustomRow(row.id)}
                          className="p-1 text-[#D71920] hover:bg-[#FEECEC] rounded"
                          title="Xóa dòng"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      {!row.file && !row.isCustom && (
                        <span className="text-[#9CA3AF] select-none">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {/* 2. Với MỖI trẻ em đã thêm: sinh nhóm dòng có dòng tiêu đề nhóm */}
              {childrenList.map((child, childIdx) => {
                // Xác định các dòng giấy tờ của trẻ này:
                // 1. Giấy khai sinh/Giấy chứng sinh (bắt buộc)
                // 2. Giấy cho phép của người giám hộ (bắt buộc)
                // 3. Bản sao Sổ hộ khẩu (có tên trẻ) - CHỈ hiện khi KHÔNG tick inAttachedHouseholdBook
                const childDocRows = [
                  {
                    key: 'birthCert',
                    name: 'Giấy khai sinh/Giấy chứng sinh',
                    required: true,
                    docType: 'Bản sao',
                  },
                  {
                    key: 'guardianPerm',
                    name: 'Giấy cho phép của người giám hộ',
                    required: true,
                    docType: 'Bản gốc',
                  },
                ];

                if (!child.inAttachedHouseholdBook) {
                  childDocRows.push({
                    key: 'householdBook',
                    name: 'Bản sao Sổ hộ khẩu (có tên trẻ)',
                    required: true,
                    docType: 'Bản sao',
                  });
                }

                const childDisplayName =
                  child.fullNameLatin || child.fullNameLao || `Trẻ em thứ ${childIdx + 1}`;

                return (
                  <React.Fragment key={child.id}>
                    {/* Dòng tiêu đề nhóm giấy tờ của trẻ em */}
                    <tr className="bg-[#E8F3EE]/70 border-t-2 border-b border-[#B0DFCA]">
                      <td colSpan={7} className="py-2.5 px-4 font-bold text-[#006B3F] text-[14px]">
                        Giấy tờ của Trẻ em thứ {childIdx + 1}: {childDisplayName}
                      </td>
                    </tr>

                    {/* Các dòng giấy tờ của trẻ */}
                    {childDocRows.map((doc, docIdx) => {
                      const rowKey = `child-${child.id}-${doc.key}`;
                      const uploadedFile = childAttachments[child.id]?.[doc.key];
                      const rowError = errors[rowKey];

                      // STT liên tục
                      const stt = attachments.length + childIdx * 3 + docIdx + 1;

                      return (
                        <tr
                          key={rowKey}
                          id={rowKey}
                          className={`hover:bg-[#F5F7F6]/60 transition-colors ${
                            rowError ? 'bg-[#FFF5F5]' : ''
                          }`}
                        >
                          <td className="py-3 px-3 text-center text-[#6B7280] font-medium">
                            {stt}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-[#1F2937] flex items-center gap-1.5">
                              <span>{doc.name}</span>
                              <span className="text-[#D71920] font-bold">*</span>
                              {isMissingDoc(doc.name, !!uploadedFile) && (
                                <span
                                  className="inline-block w-2.5 h-2.5 rounded-full bg-[#D71920] animate-pulse shrink-0"
                                  title="Cần bổ sung giấy tờ này"
                                />
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-[13px] bg-[#F3F4F6] px-2 py-1 rounded text-[#4B5563] border border-[#E5E9E7]">
                              {doc.docType}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            {uploadedFile ? (
                              <div className="flex items-center gap-2 p-1.5 bg-[#F5F7F6] border border-[#D9E1DC] rounded">
                                <FileText className="w-4 h-4 text-[#006B3F] shrink-0" />
                                <span className="text-[13px] font-medium text-[#1F2937] truncate max-w-[150px]">
                                  {uploadedFile.name}
                                </span>
                                <span className="text-[12px] text-[#6B7280]">
                                  ({uploadedFile.size})
                                </span>
                              </div>
                            ) : (
                              <div>
                                <button
                                  type="button"
                                  onClick={() => fileInputsRef.current[rowKey]?.click()}
                                  className={`inline-flex items-center gap-1.5 text-[14px] font-medium hover:underline cursor-pointer ${
                                    rowError ? 'text-[#D71920]' : 'text-[#006B3F]'
                                  }`}
                                >
                                  <Paperclip className="w-4 h-4" />
                                  <span>Tải lên</span>
                                </button>
                                <input
                                  type="file"
                                  ref={(el) => {
                                    fileInputsRef.current[rowKey] = el;
                                  }}
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      onUploadChildDoc(child.id, doc.key, e.target.files[0]);
                                    }
                                  }}
                                />
                                {rowError && (
                                  <div className="text-[12px] text-[#D71920] font-medium mt-1">
                                    {rowError}
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="text-[14px] text-[#4B5563]">1</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-[13px] text-[#6B7280] italic">
                              Hồ sơ trẻ {childDisplayName}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            {uploadedFile ? (
                              <div className="inline-flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onPreviewDoc({
                                      title: `${doc.name} - ${childDisplayName}`,
                                      fileName: uploadedFile.name,
                                    })
                                  }
                                  className="p-1 text-[#006B3F] hover:bg-[#E8F3EE] rounded"
                                  title="Xem lại"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onRemoveChildDoc(child.id, doc.key)}
                                  className="p-1 text-[#D71920] hover:bg-[#FEECEC] rounded"
                                  title="Xóa tệp đính kèm"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[#9CA3AF] select-none">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          <div className="p-3 border-t border-[#D9E1DC] bg-white">
            <button
              type="button"
              onClick={onAddCustomAttachmentRow}
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#006B3F] hover:bg-[#E8F3EE] px-3 py-1.5 rounded transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm giấy tờ khác</span>
            </button>
          </div>
        </div>

        {/* MOBILE VIEW: Dạng thẻ dọc (card list) */}
        <div className="md:hidden space-y-4">
          {/* Nhóm giấy tờ người lớn */}
          <div className="space-y-3">
            <h5 className="font-bold text-[#006B3F] text-[15px] border-b pb-1">
              Giấy tờ của người đề nghị
            </h5>
            {attachments.map((row, idx) => (
              <div
                key={row.id}
                id={row.id}
                className={`p-4 rounded-xl border space-y-3 ${
                  errors[row.id] ? 'bg-[#FFF5F5] border-[#FCA5A5]' : 'bg-[#F9FAFB] border-[#E5E9E7]'
                }`}
              >
                <div className="flex items-center justify-between border-b border-[#E5E9E7] pb-2">
                  <span className="text-[14px] font-bold text-[#1F2937] flex items-center gap-1.5">
                    <span>{idx + 1}. {row.isCustom ? row.name || 'Giấy tờ bổ sung' : row.name}</span>
                    {row.required && <span className="text-[#D71920]">*</span>}
                    {isMissingDoc(row.name, !!row.file) && (
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full bg-[#D71920] animate-pulse shrink-0"
                        title="Cần bổ sung giấy tờ này"
                      />
                    )}
                  </span>
                  <span className="text-[12px] bg-white border border-[#D9E1DC] px-2 py-0.5 rounded text-[#4B5563]">
                    {row.docType}
                  </span>
                </div>

                {row.isCustom && (
                  <input
                    type="text"
                    placeholder="Nhập tên giấy tờ..."
                    value={row.name}
                    onChange={(e) => onUpdateRowField(row.id, 'name', e.target.value)}
                    className="w-full text-[14px] bg-white border border-[#D9E1DC] rounded px-3 py-2 outline-none focus:border-[#006B3F]"
                  />
                )}

                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-[#4B5563]">Tệp đính kèm:</label>
                  {row.file ? (
                    <div className="flex items-center justify-between p-2.5 bg-white border border-[#D9E1DC] rounded-lg">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-[#006B3F] shrink-0" />
                        <span className="text-[13px] font-medium truncate">{row.file.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            onPreviewDoc({
                              title: row.name,
                              fileName: row.file?.name || 'Tài liệu',
                            })
                          }
                          className="p-1 text-[#006B3F]"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveDefaultFile(row.id)}
                          className="p-1 text-[#D71920]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputsRef.current[row.id]?.click()}
                        className="w-full py-2 px-3 border border-dashed rounded-lg bg-white flex items-center justify-center gap-2 text-[#006B3F] font-semibold text-[14px]"
                      >
                        <Paperclip className="w-4 h-4" />
                        <span>Chọn tệp tải lên</span>
                      </button>
                      {errors[row.id] && (
                        <p className="text-[12px] text-[#D71920] font-medium mt-1">
                          {errors[row.id]}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[12px] text-[#6B7280] block mb-1">Số lượng:</label>
                    <input
                      type="number"
                      min="1"
                      value={row.quantity}
                      onChange={(e) => onUpdateRowField(row.id, 'quantity', e.target.value)}
                      className="w-full text-[14px] bg-white border border-[#D9E1DC] rounded px-3 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] text-[#6B7280] block mb-1">Ghi chú:</label>
                    <input
                      type="text"
                      placeholder="Ghi chú..."
                      value={row.note}
                      onChange={(e) => onUpdateRowField(row.id, 'note', e.target.value)}
                      className="w-full text-[14px] bg-white border border-[#D9E1DC] rounded px-3 py-1.5"
                    />
                  </div>
                </div>

                {row.isCustom && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onRemoveCustomRow(row.id)}
                      className="text-[13px] text-[#D71920] font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Xóa giấy tờ này</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Nhóm giấy tờ của từng trẻ em */}
          {childrenList.map((child, childIdx) => {
            const childDocRows = [
              {
                key: 'birthCert',
                name: 'Giấy khai sinh/Giấy chứng sinh',
                required: true,
                docType: 'Bản sao',
              },
              {
                key: 'guardianPerm',
                name: 'Giấy cho phép của người giám hộ',
                required: true,
                docType: 'Bản gốc',
              },
            ];

            if (!child.inAttachedHouseholdBook) {
              childDocRows.push({
                key: 'householdBook',
                name: 'Bản sao Sổ hộ khẩu (có tên trẻ)',
                required: true,
                docType: 'Bản sao',
              });
            }

            const childDisplayName =
              child.fullNameLatin || child.fullNameLao || `Trẻ em thứ ${childIdx + 1}`;

            return (
              <div key={child.id} className="space-y-3 pt-2">
                <div className="p-2.5 rounded-lg bg-[#E8F3EE] text-[#006B3F] font-bold text-[14px] border border-[#B0DFCA]">
                  Giấy tờ của Trẻ em thứ {childIdx + 1}: {childDisplayName}
                </div>

                {childDocRows.map((doc, docIdx) => {
                  const rowKey = `child-${child.id}-${doc.key}`;
                  const uploadedFile = childAttachments[child.id]?.[doc.key];
                  const rowError = errors[rowKey];

                  return (
                    <div
                      key={rowKey}
                      id={rowKey}
                      className={`p-4 rounded-xl border space-y-3 ${
                        rowError
                          ? 'bg-[#FFF5F5] border-[#FCA5A5]'
                          : 'bg-[#F9FAFB] border-[#E5E9E7]'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-[#E5E9E7] pb-2">
                        <span className="text-[14px] font-bold text-[#1F2937] flex items-center gap-1.5">
                          <span>{docIdx + 1}. {doc.name}</span>
                          <span className="text-[#D71920]">*</span>
                          {isMissingDoc(doc.name, !!uploadedFile) && (
                            <span
                              className="inline-block w-2.5 h-2.5 rounded-full bg-[#D71920] animate-pulse shrink-0"
                              title="Cần bổ sung giấy tờ này"
                            />
                          )}
                        </span>
                        <span className="text-[12px] bg-white border border-[#D9E1DC] px-2 py-0.5 rounded text-[#4B5563]">
                          {doc.docType}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[13px] font-semibold text-[#4B5563]">
                          Tệp đính kèm:
                        </label>
                        {uploadedFile ? (
                          <div className="flex items-center justify-between p-2.5 bg-white border border-[#D9E1DC] rounded-lg">
                            <div className="flex items-center gap-2 truncate">
                              <FileText className="w-4 h-4 text-[#006B3F] shrink-0" />
                              <span className="text-[13px] font-medium truncate">
                                {uploadedFile.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  onPreviewDoc({
                                    title: `${doc.name} - ${childDisplayName}`,
                                    fileName: uploadedFile.name,
                                  })
                                }
                                className="p-1 text-[#006B3F]"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onRemoveChildDoc(child.id, doc.key)}
                                className="p-1 text-[#D71920]"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <button
                              type="button"
                              onClick={() => fileInputsRef.current[rowKey]?.click()}
                              className="w-full py-2 px-3 border border-dashed rounded-lg bg-white flex items-center justify-center gap-2 text-[#006B3F] font-semibold text-[14px]"
                            >
                              <Paperclip className="w-4 h-4" />
                              <span>Chọn tệp tải lên</span>
                            </button>
                            {rowError && (
                              <p className="text-[12px] text-[#D71920] font-medium mt-1">
                                {rowError}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          <button
            type="button"
            onClick={onAddCustomAttachmentRow}
            className="w-full py-2.5 border border-[#D9E1DC] rounded-xl bg-white text-[#006B3F] font-semibold text-[14px] flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Thêm giấy tờ khác</span>
          </button>
        </div>
      </div>

      {/* THẺ CON 2: HÌNH THỨC NHẬN KẾT QUẢ */}
      <div className="bg-white border border-[#D9E1DC] rounded-xl p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="border-b border-[#E5E9E7] pb-3">
          <h4 className="text-[17px] font-bold text-[#006B3F] uppercase tracking-wide">
            {isLao ? 'ຮູບແບບການຮັບຜົນ' : 'Hình thức nhận kết quả'}
          </h4>
          <p className="text-[14px] text-[#6B7280] mt-0.5">
            Lựa chọn nhận trực tiếp tại cơ quan tiếp nhận hoặc chuyển phát qua bưu chính
          </p>
        </div>

        {/* Lựa chọn Radio */}
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2.5 cursor-pointer text-[15px] text-[#1F2937] font-semibold">
            <input
              type="radio"
              name="deliveryMethod"
              value="direct"
              checked={deliveryMethod === 'direct'}
              onChange={() => setDeliveryMethod('direct')}
              className="w-4 h-4 text-[#006B3F] focus:ring-[#006B3F] cursor-pointer"
            />
            <span>{procedure === 'tam-thoi' ? 'Trực tiếp tại đơn vị tiếp nhận' : 'Trực tiếp'}</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-[15px] text-[#1F2937] font-semibold">
            <input
              type="radio"
              name="deliveryMethod"
              value="postal"
              checked={deliveryMethod === 'postal'}
              onChange={() => setDeliveryMethod('postal')}
              className="w-4 h-4 text-[#006B3F] focus:ring-[#006B3F] cursor-pointer"
            />
            <span>Qua bưu chính</span>
          </label>
        </div>

        {/* Khi chọn bưu chính: hiện các trường nhận hàng */}
        {deliveryMethod === 'postal' && (
          <div className="pt-4 border-t border-[#E5E9E7] space-y-4 animate-fadeIn">
            <div className="max-w-md">
              <Select
                label="Đơn vị bưu chính"
                value={postalProvider}
                onChange={(e) => setPostalProvider(e.target.value)}
                options={[
                  { value: 'Nhận trực tiếp', label: 'Nhận trực tiếp' },
                  { value: 'Chuyển phát thường', label: 'Chuyển phát thường' },
                  { value: 'Chuyển phát nhanh', label: 'Chuyển phát nhanh' },
                ]}
              />
            </div>

            <div className="space-y-4">
              <h5 className="text-[15px] font-bold text-[#1F2937]">Địa chỉ nhận kết quả</h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div id="field-deliveryProvince">
                  <AdminUnitCombobox
                    label="Tỉnh/Thành phố"
                    value={deliveryProvince}
                    onChange={(val) => {
                      setDeliveryProvince(val);
                      clearError('field-deliveryProvince');
                    }}
                    options={LAO_PROVINCES}
                    placeholder="Chọn tỉnh/thành..."
                    required
                    error={errors['field-deliveryProvince']}
                  />
                </div>

                <div id="field-deliveryDistrict">
                  <AdminUnitCombobox
                    label="Quận/Huyện"
                    value={deliveryDistrict}
                    onChange={(val) => {
                      setDeliveryDistrict(val);
                      clearError('field-deliveryDistrict');
                    }}
                    options={deliveryDistrictOptions}
                    placeholder="Chọn quận/huyện..."
                    required
                    error={errors['field-deliveryDistrict']}
                  />
                </div>

                <div id="field-deliveryVillage">
                  <AdminUnitCombobox
                    label="Bản"
                    value={deliveryVillage}
                    onChange={(val) => {
                      setDeliveryVillage(val);
                      clearError('field-deliveryVillage');
                    }}
                    options={deliveryVillageOptions}
                    placeholder="Chọn bản..."
                    required
                    error={errors['field-deliveryVillage']}
                  />
                </div>

                <div id="field-deliveryUnit">
                  <AdminUnitCombobox
                    label="Đơn vị dưới bản"
                    value={deliveryUnit}
                    onChange={(val) => setDeliveryUnit(val)}
                    options={LAO_UNITS_SAMPLE}
                    placeholder="Chọn đơn vị..."
                  />
                </div>
              </div>

              <div id="field-deliveryAddressDetail">
                <Input
                  label="Địa chỉ chi tiết"
                  placeholder="Nhập thông tin số nhà, ngõ..."
                  value={deliveryAddressDetail}
                  onChange={(e) => {
                    setDeliveryAddressDetail(e.target.value);
                    clearError('field-deliveryAddressDetail');
                  }}
                  required
                  error={errors['field-deliveryAddressDetail']}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div id="field-recipientName">
                  <Input
                    label="Họ và tên người nhận kết quả"
                    placeholder="Nhập họ và tên..."
                    value={recipientName}
                    onChange={(e) => {
                      setRecipientName(e.target.value);
                      clearError('field-recipientName');
                    }}
                    required
                    error={errors['field-recipientName']}
                  />
                </div>

                <div id="field-recipientPhone">
                  <Input
                    label="Số điện thoại người nhận kết quả"
                    placeholder="Nhập số điện thoại..."
                    value={recipientPhone}
                    onChange={(e) => {
                      setRecipientPhone(e.target.value);
                      clearError('field-recipientPhone');
                    }}
                    required
                    error={errors['field-recipientPhone']}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* THẺ CON 3: KHỐI CẢNH BÁO VÀNG "LƯU Ý QUAN TRỌNG" */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#FFF8E7] border-l-4 border-l-[#D6A928] border border-[#F4E29D] space-y-2 text-[14px] text-[#1F2937]">
        <div className="flex items-center gap-2 text-[#9A740E] font-bold text-[15px]">
          <AlertTriangle className="w-5 h-5 text-[#D6A928]" />
          <span>{isLao ? 'ຂໍ້ສັງເກດສຳຄັນ:' : 'Lưu ý quan trọng:'}</span>
        </div>
        <ul className="list-disc list-inside space-y-1.5 pl-1 leading-relaxed">
          <li>
            Khi đến đối chiếu hồ sơ gốc, vui lòng mang theo bản gốc Chứng minh nhân dân/Căn cước và Sổ hộ khẩu.
          </li>
          <li>
            Nếu thông tin kê khai không chính xác hoặc không đầy đủ, hồ sơ có thể không được thụ lý xem xét.
          </li>
        </ul>
      </div>

      {/* HAI NÚT CUỐI PHẦN 3: "IN PHIẾU" VÀ "NỘP HỒ SƠ" / "GỬI BỔ SUNG" */}
      <div className="pt-6 border-t border-[#E5E9E7] flex flex-wrap items-center justify-center gap-4">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={onPrint}
          className="min-h-[48px] px-6 text-[16px] font-semibold cursor-pointer"
          icon={<Printer className="w-4 h-4 text-[#1F2937]" />}
        >
          {isLao ? 'ພິມໃບສະເໜີ' : 'In phiếu'}
        </Button>

        {!readOnly && (
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onSubmit}
            disabled={disableSubmit || isSubmitting}
            className={`min-h-[48px] px-8 text-[16px] font-semibold cursor-pointer ${
              disableSubmit || isSubmitting ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
            }`}
            icon={
              isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )
            }
            iconPosition="right"
          >
            {isSubmitting
              ? 'Đang xử lý...'
              : submitButtonText || (isLao ? 'ສົ່ງເອກະສານ' : 'Nộp hồ sơ')}
          </Button>
        )}
      </div>
    </div>
  );
};
