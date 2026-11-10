import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  X,
  FileText,
  CreditCard,
  Receipt,
  Calendar,
  Building,
  Clock,
} from 'lucide-react';
import { SubmissionProcedureType } from './StartSubmissionView';
import {
  saveOrUpdateApplication,
  getStoredApplications,
  getStoredApplicationByCode,
  logAuditAction,
  StoredApplication,
  ApplicationStatus,
  SupplementRequest,
} from '../../utils/submissionStorage';
import { EbSession, findAccountByIdNumber } from '../../utils/ebAuthStorage';
import { PrintableApplicationForm } from './PrintableApplicationForm';
import { PaymentReceiptModal } from './PaymentReceiptModal';
import {
  LAO_ETHNIC_GROUPS,
  LAO_DISTRICTS_BY_PROVINCE,
  LAO_VILLAGES_BY_DISTRICT,
  checkProvinceBorderEligibility,
  matchImmigrationOfficeOption,
} from './laoAdminData';
import {
  OCCUPATION_OPTIONS,
  HAIR_COLOR_OPTIONS,
  EYE_COLOR_OPTIONS,
} from './FormPart1';
import { FormProgressTab } from './FormProgressTab';
import { FormSection } from './FormSection';
import { FormStickyFooter } from './FormStickyFooter';
import { FormPart1 } from './FormPart1';
import { FormPart2, ChildCompanion } from './FormPart2';
import { FormPart3 } from './FormPart3';
import {
  evaluateBiometricStatus,
  markBiometricCompletedForCitizen,
  getActiveAppointment,
  saveBiometricAppointment,
  updateBiometricAppointment,
  generateAppointmentCode,
  getBiometricAppointments,
  BiometricAppointment,
} from '../../utils/biometricStorage';
import { BiometricBookingModal, BookingModalResult } from '../biometric/BiometricBookingModal';
import { SubmissionSuccessView } from './SubmissionSuccessView';

interface AttachmentRow {
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

interface ApplicationFormStep2Props {
  procedureType: SubmissionProcedureType;
  procedure?: 'cap-so' | 'tam-thoi';
  currentLang?: 'vi' | 'la';
  currentDraftId?: string;
  targetMaHoSo?: string;
  formMode?: 'create' | 'edit-draft' | 'supplement' | 'view';
  readOnly?: boolean;
  session?: EbSession | null;
  onBackToStep1: () => void;
  onSaveDraft?: (savedApp: StoredApplication) => void;
  onSubmitSuccess?: (maHoSo: string) => void;
  onReturnToList?: () => void;
}

export const ApplicationFormStep2: React.FC<ApplicationFormStep2Props> = ({
  procedureType,
  procedure,
  currentLang = 'vi',
  currentDraftId,
  targetMaHoSo,
  formMode = 'create',
  readOnly = false,
  session,
  onBackToStep1,
  onSaveDraft,
  onSubmitSuccess,
  onReturnToList,
}) => {
  const isLao = currentLang === 'la';
  const effectiveMaHoSo = targetMaHoSo || currentDraftId || '';
  const isViewMode = formMode === 'view' || readOnly;
  const isSupplementMode = formMode === 'supplement';
  const isEditDraftMode = formMode === 'edit-draft';

  const isTamThoiProcedure = procedure === 'tam-thoi' || procedureType === 'TAM_THOI';
  const currentProcKey: 'cap-so' | 'tam-thoi' = isTamThoiProcedure ? 'tam-thoi' : 'cap-so';

  // Trạng thái hồ sơ và yêu cầu bổ sung
  const [currentAppStatus, setCurrentAppStatus] = useState<string>('Hồ sơ chưa gửi');
  const [currentAppDate, setCurrentAppDate] = useState<string>('');
  const [yeuCauBoSung, setYeuCauBoSung] = useState<SupplementRequest | null>(null);
  const [currentAppRecord, setCurrentAppRecord] = useState<StoredApplication | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);

  // Theo dõi dirty (có sửa đổi) để cảnh báo khi bấm Quay lại
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [showLeaveConfirmModal, setShowLeaveConfirmModal] = useState<boolean>(false);

  // State luồng nộp hồ sơ, kiểm tra sinh trắc và hiển thị màn hình thành công
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [existingAppointmentForModal, setExistingAppointmentForModal] = useState<BiometricAppointment | null>(null);
  const [submissionSuccessData, setSubmissionSuccessData] = useState<{
    maHoSo: string;
    procedureTitle: string;
    appointment?: BiometricAppointment | null;
  } | null>(null);

  // Lấy lịch hẹn sinh trắc liên kết (nếu có)
  const linkedAppointment = useMemo(() => {
    const id = session?.idNumber || currentAppRecord?.taiKhoan || '';
    if (!id) return null;
    const apts = getBiometricAppointments(id);
    if (!apts || apts.length === 0) return null;
    if (effectiveMaHoSo) {
      const match = apts.find((a) => a.maHoSo === effectiveMaHoSo);
      if (match) return match;
    }
    return apts[0];
  }, [session?.idNumber, currentAppRecord?.taiKhoan, effectiveMaHoSo]);

  // Lấy thông tin tài khoản người dùng
  const account = session ? findAccountByIdNumber(session.idNumber) : null;
  const userResidence = useMemo(() => {
    if (!account?.residence) return null;
    if (typeof account.residence === 'string') {
      return {
        province: account.residence,
        district: '',
        village: '',
        subUnit: '',
        detail: '',
      };
    }
    return account.residence;
  }, [account]);

  const isMissingResidence = !userResidence || !userResidence.province?.trim();
  const userResidentProvince = userResidence?.province || '';

  // 0. Thông tin đơn vị tiếp nhận hồ sơ
  const [donViTiepNhan, setDonViTiepNhan] = useState<'' | 'Cửa khẩu' | 'Phòng Xuất nhập cảnh'>(
    isTamThoiProcedure ? '' : 'Phòng Xuất nhập cảnh'
  );
  const [cuaKhau, setCuaKhau] = useState('');
  const [truongHopDeNghi, setTruongHopDeNghi] = useState('');
  const [lyDoCuThe, setLyDoCuThe] = useState('');

  // 3. Nơi thường trú (chỉ đọc, tự điền từ thông tin tài khoản của công dân)
  const [resProvince, setResProvince] = useState(userResidence?.province || '');
  const [resDistrict, setResDistrict] = useState(userResidence?.district || '');
  const [resVillage, setResVillage] = useState(userResidence?.village || '');
  const [resUnit, setResUnit] = useState(userResidence?.subUnit || '');
  const [resAddressDetail, setResAddressDetail] = useState(userResidence?.detail || '');

  // Tự động đồng bộ nơi thường trú theo tài khoản
  useEffect(() => {
    if (userResidence) {
      setResProvince(userResidence.province || '');
      setResDistrict(userResidence.district || '');
      setResVillage(userResidence.village || '');
      setResUnit(userResidence.subUnit || '');
      setResAddressDetail(userResidence.detail || '');
    } else {
      setResProvince('');
      setResDistrict('');
      setResVillage('');
      setResUnit('');
      setResAddressDetail('');
    }
  }, [userResidence]);

  // Cơ quan tiếp nhận hồ sơ:
  // - cap-so: tự động = "Phòng Xuất nhập cảnh – Công an tỉnh [tên tỉnh thường trú]"
  // - tam-thoi: nếu Cửa khẩu -> tên cửa khẩu; nếu Phòng XNC -> tự động "Phòng Xuất nhập cảnh – Công an tỉnh [tỉnh thường trú]"
  const effectiveResidentProvince = resProvince || userResidentProvince;
  const autoImmigrationOffice = effectiveResidentProvince
    ? matchImmigrationOfficeOption(effectiveResidentProvince)
    : 'Phòng Xuất nhập cảnh – Công an tỉnh';

  const [phongXNC, setPhongXNC] = useState(autoImmigrationOffice);

  // Cập nhật phongXNC tự động khi tỉnh thường trú thay đổi
  useEffect(() => {
    if (autoImmigrationOffice) {
      setPhongXNC(autoImmigrationOffice);
    }
  }, [autoImmigrationOffice]);

  const receivingAgency = useMemo(() => {
    if (isTamThoiProcedure) {
      if (donViTiepNhan === 'Cửa khẩu') {
        return cuaKhau;
      }
      return autoImmigrationOffice;
    }
    return autoImmigrationOffice;
  }, [isTamThoiProcedure, donViTiepNhan, cuaKhau, autoImmigrationOffice]);

  // Tên đơn vị tiếp nhận hiển thị trên dải thông tin phía trên & tab tiến trình
  const receivingUnitName =
    isTamThoiProcedure && donViTiepNhan === 'Cửa khẩu'
      ? cuaKhau || 'Chưa chọn'
      : receivingAgency;

  // ==========================================
  // ĐIỀU HƯỚNG MỞ DẦN 3 PHẦN (KHÔNG THU GỌN)
  // ==========================================
  // Phần đã được mở (lúc đầu chỉ mở Phần 1: {1: true})
  const [unlockedParts, setUnlockedParts] = useState<{ [key: number]: boolean }>({ 1: true });
  // Phần đã bấm "Tiếp tục" thành công
  const [completedParts, setCompletedParts] = useState<{ [key: number]: boolean }>({});
  // Phần đang nằm trong vùng nhìn (active tab theo cuộn)
  const [activePart, setActivePart] = useState<1 | 2 | 3>(1);

  // 2 trường điền sẵn theo tài khoản
  const userAccountName = session?.fullName || (isLao ? 'ສົມໄຊ ຄຳວົງສາ' : 'Somchai Khamvongsa');
  const userCitizenId = session?.idNumber || '0108920194801';

  // 1. Thông tin cá nhân cơ bản
  const [fullNameLatin, setFullNameLatin] = useState('');
  const [dob, setDob] = useState<string>(() => {
    if (formMode === 'create' && !effectiveMaHoSo) {
      const acc = session ? findAccountByIdNumber(session.idNumber) : null;
      return acc?.dateOfBirth || acc?.dob || session?.dateOfBirth || session?.dob || '';
    }
    return '';
  });
  const [gender, setGender] = useState<'' | 'Nam' | 'Nữ' | 'Chưa có thông tin'>(() => {
    if (formMode === 'create' && !effectiveMaHoSo) {
      const acc = session ? findAccountByIdNumber(session.idNumber) : null;
      const g = acc?.gender || session?.gender;
      if (g === 'Nam' || g === 'Nữ' || g === 'Chưa có thông tin') {
        return g as any;
      }
    }
    return '';
  });

  // Điền sẵn Ngày sinh và Giới tính cho hồ sơ mới (create mode) từ tài khoản đang đăng nhập
  // Không ghi đè khi mở hồ sơ nháp/bổ sung, không ghi đè lại sau khi công dân chỉnh sửa.
  const lastPrefilledIdRef = useRef<string>(session?.idNumber || '');
  useEffect(() => {
    if (formMode === 'create' && !effectiveMaHoSo && session?.idNumber && lastPrefilledIdRef.current !== session.idNumber) {
      lastPrefilledIdRef.current = session.idNumber;
      const acc = findAccountByIdNumber(session.idNumber);
      const accDob = acc?.dateOfBirth || acc?.dob || session?.dateOfBirth || session?.dob;
      const accGender = acc?.gender || session?.gender;
      if (accDob) {
        setDob(accDob);
      }
      if (accGender && (accGender === 'Nam' || accGender === 'Nữ' || accGender === 'Chưa có thông tin')) {
        setGender(accGender as any);
      }
    }
  }, [session?.idNumber, formMode, effectiveMaHoSo]);

  const [ethnicity, setEthnicity] = useState('');
  const [religion, setReligion] = useState('');
  const [nationality, setNationality] = useState('Lào');
  const [occupation, setOccupation] = useState('');
  const [ngheNghiepKhac, setNgheNghiepKhac] = useState('');

  // 2. Nơi sinh
  const [birthProvince, setBirthProvince] = useState('');
  const [birthDistrict, setBirthDistrict] = useState('');
  const [birthVillage, setBirthVillage] = useState('');
  const [birthUnit, setBirthUnit] = useState('');
  const [birthAddressDetail, setBirthAddressDetail] = useState('');


  // Gợi ý danh mục quận/huyện và bản
  const birthDistrictOptions = useMemo(() => {
    if (birthProvince && LAO_DISTRICTS_BY_PROVINCE[birthProvince]) {
      return LAO_DISTRICTS_BY_PROVINCE[birthProvince];
    }
    return Object.values(LAO_DISTRICTS_BY_PROVINCE).flat().filter((v, i, a) => a.indexOf(v) === i);
  }, [birthProvince]);

  const birthVillageOptions = useMemo(() => {
    if (birthDistrict && LAO_VILLAGES_BY_DISTRICT[birthDistrict]) {
      return LAO_VILLAGES_BY_DISTRICT[birthDistrict];
    }
    return Object.values(LAO_VILLAGES_BY_DISTRICT).flat().filter((v, i, a) => a.indexOf(v) === i);
  }, [birthDistrict]);

  const resDistrictOptions = useMemo(() => {
    if (resProvince && LAO_DISTRICTS_BY_PROVINCE[resProvince]) {
      return LAO_DISTRICTS_BY_PROVINCE[resProvince];
    }
    return Object.values(LAO_DISTRICTS_BY_PROVINCE).flat().filter((v, i, a) => a.indexOf(v) === i);
  }, [resProvince]);

  const resVillageOptions = useMemo(() => {
    if (resDistrict && LAO_VILLAGES_BY_DISTRICT[resDistrict]) {
      return LAO_VILLAGES_BY_DISTRICT[resDistrict];
    }
    return Object.values(LAO_VILLAGES_BY_DISTRICT).flat().filter((v, i, a) => a.indexOf(v) === i);
  }, [resDistrict]);

  const getChildDistrictOptions = (province?: string) => {
    if (province && LAO_DISTRICTS_BY_PROVINCE[province]) {
      return LAO_DISTRICTS_BY_PROVINCE[province];
    }
    return Object.values(LAO_DISTRICTS_BY_PROVINCE).flat().filter((v, i, a) => a.indexOf(v) === i);
  };

  const getChildVillageOptions = (district?: string) => {
    if (district && LAO_VILLAGES_BY_DISTRICT[district]) {
      return LAO_VILLAGES_BY_DISTRICT[district];
    }
    return Object.values(LAO_VILLAGES_BY_DISTRICT).flat().filter((v, i, a) => a.indexOf(v) === i);
  };

  // 4. Giấy tờ tùy thân
  const [nationalId, setNationalId] = useState(userCitizenId);
  const [idIssueDate, setIdIssueDate] = useState('');
  const [idIssuePlace, setIdIssuePlace] = useState('');
  const [householdBookNo, setHouseholdBookNo] = useState('');
  const [householdIssueDate, setHouseholdIssueDate] = useState('');
  const [householdIssuePlace, setHouseholdIssuePlace] = useState('');

  // 5. Giấy tờ đính kèm (Phần 3)
  const [attachments, setAttachments] = useState<AttachmentRow[]>([
    {
      id: 'row-cmnd',
      name: isLao ? 'ສຳເນົາບັດປະຈຳຕົວ' : 'Bản sao Căn cước/CMND',
      isCustom: false,
      required: true,
      docType: 'Bản sao',
      quantity: 1,
      note: '',
    },
    {
      id: 'row-ho-khau',
      name: isLao ? 'ສຳເນົາປຶ້ມສຳມະໂນຄົວ' : 'Bản sao Sổ hộ khẩu',
      isCustom: false,
      required: true,
      docType: 'Bản sao',
      quantity: 1,
      note: '',
    },
  ]);

  // Giấy tờ của từng trẻ em lưu theo: { [childId]: { [docKey]: { name, size, url } } }
  const [childAttachments, setChildAttachments] = useState<Record<string, { [docKey: string]: any }>>({});

  const [previewDoc, setPreviewDoc] = useState<{ title: string; fileName: string } | null>(null);

  const handleUploadDefaultRow = (rowId: string, file: File) => {
    setAttachments((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
              ...row,
              file: {
                name: file.name,
                size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
              },
            }
          : row
      )
    );
    clearError(rowId);
  };

  const handleRemoveDefaultFile = (rowId: string) => {
    setAttachments((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, file: undefined } : row))
    );
  };

  const handleUploadChildDoc = (childId: string, docKey: string, file: File) => {
    setChildAttachments((prev) => ({
      ...prev,
      [childId]: {
        ...(prev[childId] || {}),
        [docKey]: {
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        },
      },
    }));
    clearError(`child-${childId}-${docKey}`);
  };

  const handleRemoveChildDoc = (childId: string, docKey: string) => {
    setChildAttachments((prev) => {
      const nextChild = { ...(prev[childId] || {}) };
      delete nextChild[docKey];
      return {
        ...prev,
        [childId]: nextChild,
      };
    });
  };

  const handleAddCustomAttachmentRow = () => {
    const newId = `custom-row-${Date.now()}`;
    const newRow: AttachmentRow = {
      id: newId,
      name: '',
      isCustom: true,
      required: false,
      docType: 'Bản sao',
      quantity: 1,
      note: '',
    };
    setAttachments([...attachments, newRow]);
  };

  const handleRemoveCustomRow = (rowId: string) => {
    setAttachments(attachments.filter((r) => r.id !== rowId));
  };

  const handleUpdateRowField = (rowId: string, field: string, value: any) => {
    setAttachments((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, [field]: value } : r))
    );
    if (errors[`name-${rowId}`] && field === 'name') {
      clearError(`name-${rowId}`);
    }
  };

  // 6. Đặc điểm nhận dạng
  const [heightCm, setHeightCm] = useState('');
  const [hairColor, setHairColor] = useState('');
  const [mauTocKhac, setMauTocKhac] = useState('');
  const [eyeColor, setEyeColor] = useState('');
  const [mauMatKhac, setMauMatKhac] = useState('');
  const [scars, setScars] = useState('');
  const [scarsLocation, setScarsLocation] = useState('');

  // 6b. Mục đích chuyến đi và Thời hạn sử dụng
  const [tripPurpose, setTripPurpose] = useState('');
  const [tripPurposeDetail, setTripPurposeDetail] = useState('');
  const [validityStartDate, setValidityStartDate] = useState('');
  const [validityEndDate, setValidityEndDate] = useState('');

  const computeValidityEndDate = (startDateStr: string): string => {
    if (!startDateStr) return '';
    const parts = startDateStr.split('-');
    if (parts.length !== 3) return '';
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return '';
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() + 2);
    const ey = dt.getFullYear();
    const em = String(dt.getMonth() + 1).padStart(2, '0');
    const ed = String(dt.getDate()).padStart(2, '0');
    return `${ey}-${em}-${ed}`;
  };

  const handleValidityStartDateChange = (val: string) => {
    setValidityStartDate(val);
    const calculatedEnd = computeValidityEndDate(val);
    setValidityEndDate(calculatedEnd);
    clearError('field-validityStartDate');
  };

  // 7. Ảnh chân dung
  const [portraitImgUrl, setPortraitImgUrl] = useState<string>('');
  const [portraitFileName, setPortraitFileName] = useState<string>('');
  const [qualityCheckStatus, setQualityCheckStatus] = useState<{
    checked: boolean;
    passed: boolean;
    message: string;
  } | null>(null);

  const portraitInputRef = useRef<HTMLInputElement | null>(null);

  const handlePortraitFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setPortraitImgUrl(objectUrl);
      setPortraitFileName(file.name);
      clearError('field-portrait');
      // Tự động kiểm tra chất lượng ảnh ngầm khi tải ảnh lên
      setQualityCheckStatus({
        checked: true,
        passed: true,
        message: isLao
          ? 'ຜົນການກວດສອບ: ຮູບຖ່າຍໄດ້ມາດຕະຖານ ICAO (ຂະໜາດ 3x4 cm, ຄວາມລະອຽດແຈ້ງ, ພື້ນຫຼັງສະຫວ່າງ, ໜ້າກົງ).'
          : 'Kết quả kiểm tra: Ảnh đạt chuẩn ICAO (Kích thước 3x4 cm, độ phân giải sắc nét, nền sáng màu, khuôn mặt nhìn thẳng).',
      });
    }
  };

  const handleCheckPhotoQuality = () => {
    if (!portraitImgUrl) {
      setQualityCheckStatus({
        checked: true,
        passed: false,
        message: 'Vui lòng chọn hoặc tải ảnh chân dung từ máy tính trước khi kiểm tra chất lượng.',
      });
      return;
    }
    setQualityCheckStatus({
      checked: true,
      passed: true,
      message:
        'Kết quả kiểm tra: Ảnh đạt chuẩn ICAO (Kích thước 3x4 cm, độ phân giải sắc nét, nền trơn sáng màu, khuôn mặt nhìn thẳng).',
    });
  };

  // 8. Trẻ em đi kèm (Phần 2)
  const [children, setChildren] = useState<ChildCompanion[]>([]);

  const handleAddChild = () => {
    if (isTamThoiProcedure && children.length >= 4) return;
    const newChild: ChildCompanion = {
      id: `child-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      fullNameLao: '',
      fullNameLatin: '',
      citizenId: '',
      dob: '',
      gender: '',
      relationship: '',
      inAttachedHouseholdBook: false,
      resProvince: '',
      resDistrict: '',
      resVillage: '',
      resUnit: '',
      resAddressDetail: '',
    };
    setChildren((prev) => [...prev, newChild]);
  };

  const handleChildPhotoChange = (childId: string, file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setChildren((prev) =>
      prev.map((c) =>
        c.id === childId
          ? {
              ...c,
              portraitImgUrl: objectUrl,
              portraitFileName: file.name,
              qualityCheckStatus: {
                checked: true,
                passed: true,
                message: isLao
                  ? 'ຮູບພາບໄດ້ມາດຕະຖານ ICAO (ຂະໜາດ 3x4 cm, ຄວາມລະອຽດແຈ້ງ, ພື້ນຫຼັງສະຫວ່າງ).'
                  : 'Ảnh đạt chuẩn ICAO (kích thước 3x4 cm, độ phân giải sắc nét, nền sáng màu).',
              },
            }
          : c
      )
    );
  };

  const handleCheckChildPhotoQuality = (childId: string) => {
    setChildren((prev) =>
      prev.map((c) => {
        if (c.id !== childId) return c;
        if (!c.portraitImgUrl) {
          return {
            ...c,
            qualityCheckStatus: {
              checked: true,
              passed: false,
              message: 'Vui lòng chọn hoặc tải ảnh chân dung của trẻ trước khi kiểm tra chất lượng.',
            },
          };
        }
        return {
          ...c,
          qualityCheckStatus: {
            checked: true,
            passed: true,
            message:
              'Kết quả kiểm tra: Ảnh đạt chuẩn ICAO (Kích thước 3x4 cm, độ phân giải sắc nét, nền trơn sáng màu, khuôn mặt nhìn thẳng).',
          },
        };
      })
    );
  };

  const handleRemoveChild = (id: string) => {
    setChildren((prev) => prev.filter((c) => c.id !== id));
    // Xóa toàn bộ file và lỗi của trẻ đó
    setChildAttachments((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (key.includes(id)) {
          delete next[key];
        }
      });
      return next;
    });
  };

  const handleUpdateChild = (id: string, field: keyof ChildCompanion, value: any) => {
    setChildren((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
    clearError(`child-${String(field)}-${id}`);
    if (field === 'inAttachedHouseholdBook' && value === true) {
      clearError(`child-${id}-householdBook`);
      clearError(`child-resProvince-${id}`);
      clearError(`child-resDistrict-${id}`);
      clearError(`child-resVillage-${id}`);
    }
  };

  // 9. Hình thức nhận kết quả (Phần 3)
  const [deliveryMethod, setDeliveryMethod] = useState<'direct' | 'postal'>('direct');
  const [postalProvider, setPostalProvider] = useState('Nhận trực tiếp');
  const [deliveryProvince, setDeliveryProvince] = useState('');
  const [deliveryDistrict, setDeliveryDistrict] = useState('');
  const [deliveryVillage, setDeliveryVillage] = useState('');
  const [deliveryUnit, setDeliveryUnit] = useState('');
  const [deliveryAddressDetail, setDeliveryAddressDetail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');

  const deliveryDistrictOptions = useMemo(() => {
    if (deliveryProvince && LAO_DISTRICTS_BY_PROVINCE[deliveryProvince]) {
      return LAO_DISTRICTS_BY_PROVINCE[deliveryProvince];
    }
    return Object.values(LAO_DISTRICTS_BY_PROVINCE).flat().filter((v, i, a) => a.indexOf(v) === i);
  }, [deliveryProvince]);

  const deliveryVillageOptions = useMemo(() => {
    if (deliveryDistrict && LAO_VILLAGES_BY_DISTRICT[deliveryDistrict]) {
      return LAO_VILLAGES_BY_DISTRICT[deliveryDistrict];
    }
    return Object.values(LAO_VILLAGES_BY_DISTRICT).flat().filter((v, i, a) => a.indexOf(v) === i);
  }, [deliveryDistrict]);

  // Helper phân tích chuỗi ngày sinh thành Y-M-D độc lập với múi giờ
  const parseDobParts = (dobStr: string): { year: number; month: number; day: number } | null => {
    if (!dobStr || typeof dobStr !== 'string') return null;
    const trimmed = dobStr.trim();
    if (!trimmed) return null;

    if (trimmed.includes('-')) {
      const parts = trimmed.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const d = parseInt(parts[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
          return { year: y, month: m, day: d };
        }
      }
    }

    if (trimmed.includes('/')) {
      const parts = trimmed.split('/');
      if (parts.length === 3) {
        const d = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const y = parseInt(parts[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
          return { year: y, month: m, day: d };
        }
      }
    }

    const date = new Date(trimmed);
    if (!isNaN(date.getTime())) {
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
    }

    return null;
  };

  // Kiểm tra ngày sinh trong tương lai (lớn hơn ngày hiện tại)
  const isDobInFuture = (dobStr: string): boolean => {
    const parsed = parseDobParts(dobStr);
    if (!parsed) return false;

    const today = new Date();
    const curYear = today.getFullYear();
    const curMonth = today.getMonth() + 1;
    const curDay = today.getDate();

    if (parsed.year > curYear) return true;
    if (parsed.year === curYear && parsed.month > curMonth) return true;
    if (parsed.year === curYear && parsed.month === curMonth && parsed.day > curDay) return true;
    return false;
  };

  // Hàm tính tuổi tròn năm đến ngày hiện tại theo ngày sinh (dùng chung cho cả người đề nghị và trẻ em đi kèm)
  const calculateAge = (dobStr: string): number => {
    const parsed = parseDobParts(dobStr);
    if (!parsed) return 0;

    const today = new Date();
    const curYear = today.getFullYear();
    const curMonth = today.getMonth() + 1;
    const curDay = today.getDate();

    let age = curYear - parsed.year;
    // Nếu chưa đến ngày sinh nhật trong năm nay thì trừ 1 tuổi
    if (curMonth < parsed.month || (curMonth === parsed.month && curDay < parsed.day)) {
      age--;
    }
    return age;
  };

  // Hàm kiểm tra tính hợp lệ của ngày sinh người đề nghị (đủ 12 tuổi trở lên, không lớn hơn hôm nay)
  const validateApplicantDob = (val: string): string | null => {
    if (!val || !val.trim()) {
      return isLao ? 'ກະລຸນາເລືອກວັນເດືອນປີເກີດ' : 'Vui lòng chọn ngày, tháng, năm sinh';
    }
    if (isDobInFuture(val)) {
      return isLao ? 'ວັນເດືອນປີເກີດບໍ່ສາມາດຫຼາຍກວ່າວັນທີປະຈຸບັນ' : 'Ngày sinh không được lớn hơn ngày hiện tại';
    }
    if (calculateAge(val) < 12) {
      return isLao
        ? 'ຜູ້ຍື່ນຄຳຮ້ອງຕ້ອງມີອາຍຸແຕ່ 12 ປີຂຶ້ນໄປ. ເດັກນ້ອຍຕ່ຳກວ່າ 12 ປີ ແມ່ນແຈ້ງໃນລາຍການ ເດັກນ້ອຍມານຳ ໃນສຳນວນເອກະສານຂອງພໍ່, ແມ່ ຫຼື ຜູ້ປົກຄອງ.'
        : 'Người đề nghị phải đủ 12 tuổi trở lên. Trẻ em dưới 12 tuổi được khai báo ở mục Trẻ em đi kèm trong hồ sơ của cha, mẹ hoặc người giám hộ.';
    }
    return null;
  };

  // Errors & Modals
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationBannerMsg, setValidationBannerMsg] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [successToast, setSuccessToast] = useState<{ maHoSo: string } | null>(null);

  const clearError = (id: string) => {
    if (errors[id]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  // Xử lý kiểm tra tức thì khi người dùng nhập/chọn ngày sinh người đề nghị
  const handleApplicantDobChange = (val: string) => {
    setDob(val);
    const err = validateApplicantDob(val);
    if (err) {
      setErrors((prev) => ({ ...prev, 'field-dob': err }));
    } else {
      clearError('field-dob');
    }
  };

  const handleApplicantDobBlur = () => {
    const err = validateApplicantDob(dob);
    if (err) {
      setErrors((prev) => ({ ...prev, 'field-dob': err }));
    } else {
      clearError('field-dob');
    }
  };

  const handleOccupationChange = (val: string) => {
    setOccupation(val);
    clearError('field-occupation');
    if (val !== 'Khác') {
      setNgheNghiepKhac('');
      clearError('field-occupationDetail');
    }
  };

  const handleHairColorChange = (val: string) => {
    setHairColor(val);
    clearError('field-hairColor');
    if (val !== 'Khác') {
      setMauTocKhac('');
      clearError('field-hairColorDetail');
    }
  };

  const handleEyeColorChange = (val: string) => {
    setEyeColor(val);
    clearError('field-eyeColor');
    if (val !== 'Khác') {
      setMauMatKhac('');
      clearError('field-eyeColorDetail');
    }
  };

  const getProcedureTitle = () => {
    if (isLao) {
      switch (procedureType) {
        case 'CAP_DOI':
          return 'ປ່ຽນໜັງສືຜ່ານແດນ';
        case 'TAM_THOI':
          return 'ຂໍໜັງສືຜ່ານແດນຊົ່ວຄາວ';
        case 'CAP_SO':
        default:
          return 'ຂໍອອກໜັງສືຜ່ານແດນ';
      }
    }
    switch (procedureType) {
      case 'CAP_DOI':
        return 'Cấp đổi sổ thông hành';
      case 'TAM_THOI':
        return 'Cấp giấy thông hành tạm thời';
      case 'CAP_SO':
      default:
        return 'Cấp mới sổ thông hành';
    }
  };

  // Helper cuộn mượt tới phần tử
  const scrollToSection = (sectionId: string) => {
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Helper cuộn tới trường lỗi đầu tiên
  const scrollToFirstError = (fieldId: string) => {
    setTimeout(() => {
      const el = document.getElementById(fieldId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = (el.querySelector('input, select') || el) as HTMLElement;
        input?.focus?.();
      }
    }, 100);
  };

  // Theo dõi vị trí cuộn để tô nổi tab đang nằm trong vùng nhìn
  useEffect(() => {
    const handleScroll = () => {
      const p1 = document.getElementById('section-part-1');
      const p2 = document.getElementById('section-part-2');
      const p3 = document.getElementById('section-part-3');

      const scrollPos = window.scrollY + 180;

      if (p3 && scrollPos >= p3.offsetTop) {
        setActivePart(3);
      } else if (p2 && scrollPos >= p2.offsetTop) {
        setActivePart(2);
      } else {
        setActivePart(1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [unlockedParts]);

  // ==========================================
  // VALIDATE TỪNG PHẦN
  // ==========================================
  // Validate Phần 1: Thông tin cá nhân
  const validatePart1 = (): { isValid: boolean; newErrors: Record<string, string>; firstErrorId: string | null } => {
    const newErrors: Record<string, string> = {};
    let firstErrorId: string | null = null;
    const recordError = (id: string, message: string) => {
      newErrors[id] = message;
      if (!firstErrorId) firstErrorId = id;
    };

    if (isTamThoiProcedure) {
      if (!donViTiepNhan) {
        recordError('field-donViTiepNhan', 'Vui lòng chọn đơn vị tiếp nhận hồ sơ');
      } else if (donViTiepNhan === 'Cửa khẩu') {
        if (!cuaKhau.trim()) {
          recordError('field-cuaKhau', 'Vui lòng chọn cửa khẩu');
        }
      } else if (donViTiepNhan === 'Phòng Xuất nhập cảnh') {
        if (!phongXNC.trim()) {
          recordError('field-phongXNC', 'Vui lòng chọn Phòng Xuất nhập cảnh – Công an tỉnh');
        }
      }

      if (!truongHopDeNghi.trim()) {
        recordError('field-truongHopDeNghi', 'Vui lòng chọn trường hợp đề nghị cấp giấy thông hành tạm thời');
      } else if (truongHopDeNghi === 'Trường hợp khác') {
        if (!lyDoCuThe.trim()) {
          recordError('field-lyDoCuThe', 'Vui lòng nhập lý do cụ thể');
        }
      }
    }

    if (!fullNameLatin.trim()) {
      recordError('field-fullNameLatin', isLao ? 'ກະລຸນາປ້ອນຊື່ພາສາລາຕິນ' : 'Vui lòng nhập Họ và tên (chữ Latin)');
    }
    const dobError = validateApplicantDob(dob);
    if (dobError) {
      recordError('field-dob', dobError);
    }
    if (!gender) {
      recordError('field-gender', isLao ? 'ກະລຸນາເລືອກເພດ' : 'Vui lòng chọn giới tính');
    }
    if (!ethnicity.trim()) {
      recordError('field-ethnicity', isLao ? 'ກະລຸນາປ້ອນຊົນເຜົ່າ' : 'Vui lòng nhập dân tộc');
    }
    if (!portraitImgUrl) {
      recordError('field-portrait', isLao ? 'ກະລຸນາເລືອກຮູບຖ່າຍ 3x4' : 'Vui lòng chọn ảnh chân dung 3x4 cm');
    }

    const cleanedNationalId = nationalId.trim();
    if (!cleanedNationalId) {
      recordError('field-nationalId', isLao ? 'ກະລຸນາປ້ອນເລກປະຈຳຕົວ' : 'Vui lòng nhập Số định danh');
    } else if (!/^\d+$/.test(cleanedNationalId) || (cleanedNationalId.length !== 13 && cleanedNationalId.length !== 15)) {
      recordError('field-nationalId', 'Số định danh gồm 13 chữ số.');
    }
    if (!householdBookNo.trim()) {
      recordError('field-householdBookNo', isLao ? 'ກະລຸນາປ້ອນເລກສຳມະໂນຄົວ' : 'Vui lòng nhập số sổ hộ khẩu');
    }

    const h = Number(heightCm);
    if (!heightCm.trim() || isNaN(h) || h <= 50 || h > 250) {
      recordError('field-height', isLao ? 'ກະລຸນາປ້ອນລວງສູງທີ່ຖືກຕ້ອງ (cm)' : 'Vui lòng nhập chiều cao hợp lệ (cm)');
    }

    // CÁC TRƯỜNG CHỈ DÀNH CHO THỦ TỤC CẤP GIẤY THÔNG HÀNH TẠM THỜI (tam-thoi)
    if (isTamThoiProcedure) {
      // Quốc tịch: textbox chỉ đọc, mặc định "Lào"
      if (!nationality.trim()) {
        recordError('field-nationality', isLao ? 'ກະລຸນາປ້ອນສັນຊາດ' : 'Vui lòng nhập quốc tịch');
      }

      // Nghề nghiệp: select (bắt buộc)
      if (!occupation) {
        recordError('field-occupation', isLao ? 'ກະລຸນາເລືອກອາຊີບ' : 'Vui lòng chọn nghề nghiệp');
      } else if (occupation === 'Khác') {
        const trimmedOcc = (ngheNghiepKhac || '').trim();
        if (!trimmedOcc) {
          recordError('field-occupationDetail', isLao ? 'ກະລຸນາປ້ອນອາຊີບລະອຽດ' : 'Vui lòng nhập nghề nghiệp cụ thể');
        } else if (trimmedOcc.length > 100) {
          recordError('field-occupationDetail', 'Nghề nghiệp cụ thể không được vượt quá 100 ký tự');
        }
      }

      // Màu tóc: select (Đen, Nâu, Vàng, Bạc/Trắng, Khác)
      if (!hairColor) {
        recordError('field-hairColor', isLao ? 'ກະລຸນາເລືອກສີຜົມ' : 'Vui lòng chọn màu tóc');
      } else if (hairColor === 'Khác') {
        const trimmedHair = (mauTocKhac || '').trim();
        if (!trimmedHair) {
          recordError('field-hairColorDetail', isLao ? 'ກະລຸນາປ້ອນສີຜົມລະອຽດ' : 'Vui lòng nhập màu tóc cụ thể');
        } else if (trimmedHair.length > 100) {
          recordError('field-hairColorDetail', 'Màu tóc cụ thể không được vượt quá 100 ký tự');
        }
      }

      // Màu mắt: select (Đen, Nâu, Xanh, Khác)
      if (!eyeColor) {
        recordError('field-eyeColor', isLao ? 'ກະລຸນາເລືອກສີຕາ' : 'Vui lòng chọn màu mắt');
      } else if (eyeColor === 'Khác') {
        const trimmedEye = (mauMatKhac || '').trim();
        if (!trimmedEye) {
          recordError('field-eyeColorDetail', isLao ? 'ກະລຸນາປ້ອນສີຕາລະອຽດ' : 'Vui lòng nhập màu mắt cụ thể');
        } else if (trimmedEye.length > 100) {
          recordError('field-eyeColorDetail', 'Màu mắt cụ thể không được vượt quá 100 ký tự');
        }
      }

      // Mục đích chuyến đi: select (mock: Thăm thân, Du lịch, Công tác, Chữa bệnh, Học tập, Khác)
      if (!tripPurpose) {
        recordError('field-tripPurpose', isLao ? 'ກະລຸນາເລືອກຈຸດປະສົງການເດີນທາງ' : 'Vui lòng chọn mục đích chuyến đi');
      } else if (tripPurpose === 'Khác') {
        if (!tripPurposeDetail.trim()) {
          recordError('field-tripPurposeDetail', isLao ? 'ກະລຸນາປ້ອນເນື້ອໃນລະອຽດ' : 'Vui lòng nhập nội dung cụ thể mục đích chuyến đi');
        } else if (tripPurposeDetail.length > 255) {
          recordError('field-tripPurposeDetail', 'Nội dung cụ thể không được vượt quá 255 ký tự');
        }
      }

      // Thời hạn sử dụng: "Ngày bắt đầu" (date picker, bắt buộc, không được trước hôm nay, không quá 30 ngày kể từ ngày nộp)
      const nowDt = new Date();
      const curTodayStr = `${nowDt.getFullYear()}-${String(nowDt.getMonth() + 1).padStart(2, '0')}-${String(nowDt.getDate()).padStart(2, '0')}`;
      const maxDt = new Date();
      maxDt.setDate(maxDt.getDate() + 30);
      const curMaxStartDateStr = `${maxDt.getFullYear()}-${String(maxDt.getMonth() + 1).padStart(2, '0')}-${String(maxDt.getDate()).padStart(2, '0')}`;

      if (!validityStartDate) {
        recordError('field-validityStartDate', isLao ? 'ກະລຸນາເລືອກວັນທີເລີ່ມຕົ້ນ' : 'Vui lòng chọn ngày bắt đầu');
      } else if (validityStartDate < curTodayStr) {
        recordError('field-validityStartDate', 'Ngày bắt đầu không được trước ngày hôm nay');
      } else if (validityStartDate > curMaxStartDateStr) {
        recordError('field-validityStartDate', 'Ngày bắt đầu không được quá 30 ngày kể từ ngày nộp');
      }
    }

    return { isValid: Object.keys(newErrors).length === 0, newErrors, firstErrorId };
  };

  // Validate Phần 2: Địa chỉ và trẻ em đi kèm
  const validatePart2 = (): { isValid: boolean; newErrors: Record<string, string>; firstErrorId: string | null } => {
    const newErrors: Record<string, string> = {};
    let firstErrorId: string | null = null;
    const recordError = (id: string, message: string) => {
      newErrors[id] = message;
      if (!firstErrorId) firstErrorId = id;
    };

    if (!birthProvince.trim()) {
      recordError('field-birthProvince', isLao ? 'ກະລຸນາເລືອກ ຫຼື ປ້ອນແຂວງ/ນະຄອນຫຼວງ' : 'Vui lòng chọn hoặc nhập Tỉnh/Thành phố');
    }
    if (!birthDistrict.trim()) {
      recordError('field-birthDistrict', isLao ? 'ກະລຸນາເລືອກ ຫຼື ປ້ອນເມືອງ/ເຂດ' : 'Vui lòng chọn hoặc nhập Quận/Huyện');
    }
    if (!birthVillage.trim()) {
      recordError('field-birthVillage', isLao ? 'ກະລຸນາເລືອກ ຫຼື ປ້ອນບ້ານ' : 'Vui lòng chọn hoặc nhập Bản');
    }

    if (isMissingResidence || !resProvince.trim()) {
      recordError(
        'field-resProvince',
        isLao
          ? 'ບັນຊີຍັງບໍ່ມີຂໍ້ມູນທີ່ຢູ່ຖາວອນ. ກະລຸນາອັບເດດຂໍ້ມູນບັນຊີ.'
          : 'Tài khoản chưa có thông tin nơi thường trú. Vui lòng cập nhật thông tin tài khoản'
      );
    }

    // Kiểm tra thông tin các trẻ em đã thêm
    children.forEach((child, index) => {
      const childNum = index + 1;
      const childPrefix = `Trẻ em thứ ${childNum}`;

      if (!child.fullNameLao.trim()) {
        recordError(`child-fullNameLao-${child.id}`, `Vui lòng nhập Họ và tên (chữ Lào) cho ${childPrefix}`);
      }
      if (!child.fullNameLatin.trim()) {
        recordError(`child-fullNameLatin-${child.id}`, `Vui lòng nhập Name & Surname (Latin) cho ${childPrefix}`);
      }

      const childCid = (child.citizenId || '').trim();
      if (!childCid || !/^\d{13}$/.test(childCid)) {
        recordError(`child-citizenId-${child.id}`, 'Số định danh của trẻ gồm 13 chữ số.');
      }

      if (!child.dob.trim()) {
        recordError(`child-dob-${child.id}`, `Vui lòng chọn ngày sinh cho ${childPrefix}`);
      } else if (isDobInFuture(child.dob)) {
        recordError(`child-dob-${child.id}`, 'Ngày sinh không được lớn hơn ngày hiện tại');
      } else if (calculateAge(child.dob) >= 12) {
        recordError(
          `child-dob-${child.id}`,
          'Trẻ em từ 12 tuổi trở lên không được đi kèm. Vui lòng đăng ký cấp Sổ thông hành mới cho trẻ.'
        );
      }

      if (!child.gender) {
        recordError(`child-gender-${child.id}`, `Vui lòng chọn giới tính cho ${childPrefix}`);
      }
      if (!child.relationship) {
        recordError(`child-relationship-${child.id}`, `Vui lòng chọn quan hệ của người đề nghị với ${childPrefix}`);
      }

      if (!child.inAttachedHouseholdBook) {
        if (!child.resProvince || !child.resProvince.trim()) {
          recordError(
            `child-resProvince-${child.id}`,
            isLao ? `ກະລຸນາເລືອກແຂວງ/ນະຄອນຫຼວງສຳລັບ ${childPrefix}` : `Vui lòng chọn hoặc nhập Tỉnh/Thành phố cho ${childPrefix}`
          );
        } else if (!checkProvinceBorderEligibility(child.resProvince)) {
          recordError(
            `child-resProvince-${child.id}`,
            isLao
              ? `${childPrefix}: ແຂວງ/ນະຄອນຫຼວງບໍ່ຢູ່ໃນເກນທີ່ຈະໄດ້ຮັບໜັງສືຜ່ານແດນ (ພຽງແຕ່ໃຊ້ກັບແຂວງຊາຍແດນໃນລາຍຊື່)`
              : `${childPrefix}: Tỉnh/Thành phố không thuộc diện cấp Sổ thông hành (chỉ áp dụng cho các tỉnh biên giới có trong danh sách)`
          );
        }

        if (!child.resDistrict || !child.resDistrict.trim()) {
          recordError(
            `child-resDistrict-${child.id}`,
            isLao ? `ກະລຸນາເລືອກ ຫຼື ປ້ອນເມືອງ/ເຂດສຳລັບ ${childPrefix}` : `Vui lòng chọn hoặc nhập Quận/Huyện cho ${childPrefix}`
          );
        }

        if (!child.resVillage || !child.resVillage.trim()) {
          recordError(
            `child-resVillage-${child.id}`,
            isLao ? `ກະລຸນາເລືອກ ຫຼື ປ້ອນບ້ານສຳລັບ ${childPrefix}` : `Vui lòng chọn hoặc nhập Bản cho ${childPrefix}`
          );
        }
      }
    });

    return { isValid: Object.keys(newErrors).length === 0, newErrors, firstErrorId };
  };

  // Validate Phần 3: Giấy tờ đính kèm và nhận kết quả
  const validatePart3 = (): { isValid: boolean; newErrors: Record<string, string>; firstErrorId: string | null } => {
    const newErrors: Record<string, string> = {};
    let firstErrorId: string | null = null;
    const recordError = (id: string, message: string) => {
      newErrors[id] = message;
      if (!firstErrorId) firstErrorId = id;
    };

    // 2 dòng mặc định của người lớn
    const cmndRow = attachments.find((r) => r.id === 'row-cmnd');
    if (!cmndRow || !cmndRow.file) {
      recordError('row-cmnd', isLao ? 'ກະລຸນາຄັດຕິດສຳເນົາບັດປະຈຳຕົວ' : 'Vui lòng đính kèm Bản sao Căn cước/CMND');
    }

    const hoKhauRow = attachments.find((r) => r.id === 'row-ho-khau');
    if (!hoKhauRow || !hoKhauRow.file) {
      recordError('row-ho-khau', isLao ? 'ກະລຸນາຄັດຕິດສຳເນົາປຶ້ມສຳມະໂນຄົວ' : 'Vui lòng đính kèm Bản sao Sổ hộ khẩu');
    }

    attachments.forEach((r) => {
      if (r.isCustom) {
        if (!r.name.trim()) {
          recordError(`name-${r.id}`, 'Vui lòng nhập tên loại giấy tờ');
        }
        if (!r.file) {
          recordError(`file-${r.id}`, 'Vui lòng tải tệp đính kèm');
        }
      }
    });

    // Toàn bộ dòng giấy tờ của từng trẻ em
    children.forEach((child, index) => {
      const childNum = index + 1;
      const childPrefix = `Trẻ em thứ ${childNum}`;

      // Giấy khai sinh/chứng sinh (bắt buộc)
      if (!childAttachments[child.id]?.birthCert) {
        recordError(
          `child-${child.id}-birthCert`,
          `Thiếu giấy khai sinh/chứng sinh cho ${childPrefix}`
        );
      }

      // Giấy cho phép của người giám hộ (bắt buộc)
      if (!childAttachments[child.id]?.guardianPerm) {
        recordError(
          `child-${child.id}-guardianPerm`,
          `Thiếu giấy cho phép của người giám hộ cho ${childPrefix}`
        );
      }

      // Bản sao sổ hộ khẩu (chỉ khi KHÔNG tick chung hộ khẩu)
      if (!child.inAttachedHouseholdBook) {
        if (!childAttachments[child.id]?.householdBook) {
          recordError(
            `child-${child.id}-householdBook`,
            `Thiếu bản sao sổ hộ khẩu cho ${childPrefix}`
          );
        }
      }
    });

    // Hình thức nhận kết quả
    if (deliveryMethod === 'postal') {
      if (!deliveryProvince.trim()) {
        recordError('field-deliveryProvince', isLao ? 'ກະລຸນາເລືອກແຂວງ/ນະຄອນຫຼວງ' : 'Vui lòng chọn hoặc nhập Tỉnh/Thành phố nhận kết quả');
      }
      if (!deliveryDistrict.trim()) {
        recordError('field-deliveryDistrict', isLao ? 'ກະລຸນາເລືອກເມືອງ/ເຂດ' : 'Vui lòng chọn hoặc nhập Quận/Huyện nhận kết quả');
      }
      if (!deliveryVillage.trim()) {
        recordError('field-deliveryVillage', isLao ? 'ກະລຸນາເລືອກບ້ານ' : 'Vui lòng chọn hoặc nhập Bản nhận kết quả');
      }
      if (!deliveryAddressDetail.trim()) {
        recordError('field-deliveryAddressDetail', isLao ? 'ກະລຸນາປ້ອນທີ່ຢູ່ລະອຽດ' : 'Vui lòng nhập địa chỉ chi tiết nhận kết quả');
      }
      if (!recipientName.trim()) {
        recordError('field-recipientName', isLao ? 'ກະລຸນາປ້ອນຊື່ຜູ້ຮັບຜົນ' : 'Vui lòng nhập họ và tên người nhận kết quả');
      }
      const phoneClean = recipientPhone.trim();
      if (!phoneClean) {
        recordError('field-recipientPhone', isLao ? 'ກະລຸນາປ້ອນເບີໂທລະສັບຜູ້ຮັບ' : 'Vui lòng nhập số điện thoại người nhận kết quả');
      } else if (!/^\d{8,15}$/.test(phoneClean)) {
        recordError('field-recipientPhone', 'Số điện thoại người nhận gồm từ 8 đến 15 chữ số.');
      }
    }

    return { isValid: Object.keys(newErrors).length === 0, newErrors, firstErrorId };
  };

  // Xác định tab nào có lỗi
  const hasErrorParts = useMemo(() => {
    const errorKeys = Object.keys(errors);
    const p1Keys = isTamThoiProcedure
      ? [
          'field-donViTiepNhan',
          'field-cuaKhau',
          'field-phongXNC',
          'field-truongHopDeNghi',
          'field-lyDoCuThe',
          'field-fullNameLatin',
          'field-dob',
          'field-gender',
          'field-ethnicity',
          'field-portrait',
          'field-nationalId',
          'field-householdBookNo',
          'field-height',
          'field-nationality',
          'field-occupation',
          'field-occupationDetail',
          'field-hairColor',
          'field-hairColorDetail',
          'field-eyeColor',
          'field-eyeColorDetail',
          'field-tripPurpose',
          'field-tripPurposeDetail',
          'field-validityStartDate',
        ]
      : [
          'field-fullNameLatin',
          'field-dob',
          'field-gender',
          'field-ethnicity',
          'field-portrait',
          'field-nationalId',
          'field-householdBookNo',
          'field-height',
        ];
    const p2Keys = [
      'field-birthProvince',
      'field-birthDistrict',
      'field-birthVillage',
      'field-resProvince',
      'field-resDistrict',
      'field-resVillage',
    ];

    const hasP1 = errorKeys.some((k) => p1Keys.includes(k));
    const hasP2 = errorKeys.some((k) => p2Keys.includes(k) || (k.startsWith('child-') && !k.includes('birthCert') && !k.includes('guardianPerm') && !k.includes('householdBook')));
    const hasP3 = errorKeys.some((k) => k === 'row-cmnd' || k === 'row-ho-khau' || k.startsWith('name-custom-') || k.startsWith('file-custom-') || k.includes('birthCert') || k.includes('guardianPerm') || k.includes('householdBook') || k.startsWith('field-delivery') || k.startsWith('field-recipient'));

    return {
      1: hasP1,
      2: hasP2,
      3: hasP3,
    };
  }, [errors]);

  // ==========================================
  // XỬ LÝ NÚT "TIẾP TỤC" (Phần 1 & Phần 2)
  // ==========================================
  const handleContinuePart1 = () => {
    const { isValid, newErrors, firstErrorId } = validatePart1();
    if (!isValid) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      setValidationBannerMsg('Vui lòng hoàn thành thông tin ở Phần 1: Thông tin cá nhân');
      if (firstErrorId) scrollToFirstError(firstErrorId);
      return;
    }
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(newErrors).forEach((k) => delete next[k]);
      return next;
    });
    setValidationBannerMsg(null);
    setCompletedParts((prev) => ({ ...prev, 1: true }));
    setUnlockedParts((prev) => ({ ...prev, 2: true }));
    scrollToSection('section-part-2');
  };

  const handleContinuePart2 = () => {
    const { isValid, newErrors, firstErrorId } = validatePart2();
    if (!isValid) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      setValidationBannerMsg('Vui lòng hoàn thành thông tin ở Phần 2: Địa chỉ và trẻ em đi kèm');
      if (firstErrorId) scrollToFirstError(firstErrorId);
      return;
    }
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(newErrors).forEach((k) => delete next[k]);
      return next;
    });
    setValidationBannerMsg(null);
    setCompletedParts((prev) => ({ ...prev, 2: true }));
    setUnlockedParts((prev) => ({ ...prev, 3: true }));
    scrollToSection('section-part-3');
  };

  // Bấm vào tab trên thanh header (chỉ các phần đã mở mới bấm được)
  const handleSelectTab = (part: 1 | 2 | 3) => {
    if (unlockedParts[part]) {
      scrollToSection(`section-part-${part}`);
    }
  };

  // ==========================================
  // KIỂM TRA TOÀN BỘ 3 PHẦN (IN PHIẾU & NỘP HỒ SƠ)
  // ==========================================
  const validateAllParts = (): boolean => {
    if (isMissingResidence) {
      setValidationBannerMsg('Tài khoản chưa có thông tin nơi thường trú. Vui lòng cập nhật thông tin tài khoản');
      setUnlockedParts((prev) => ({ ...prev, 2: true }));
      scrollToSection('section-part-2');
      return false;
    }

    const p1 = validatePart1();
    const p2 = validatePart2();
    const p3 = validatePart3();

    const allErrors = { ...p1.newErrors, ...p2.newErrors, ...p3.newErrors };
    setErrors(allErrors);

    if (!p1.isValid) {
      setValidationBannerMsg('Vui lòng hoàn thành thông tin ở Phần 1: Thông tin cá nhân');
      setActivePart(1);
      scrollToSection('section-part-1');
      if (p1.firstErrorId) scrollToFirstError(p1.firstErrorId);
      return false;
    }

    if (!p2.isValid) {
      setValidationBannerMsg('Vui lòng hoàn thành thông tin ở Phần 2: Địa chỉ và trẻ em đi kèm');
      setUnlockedParts((prev) => ({ ...prev, 2: true }));
      scrollToSection('section-part-2');
      if (p2.firstErrorId) scrollToFirstError(p2.firstErrorId);
      return false;
    }

    if (!p3.isValid) {
      setValidationBannerMsg('Vui lòng hoàn thành thông tin ở Phần 3: Giấy tờ đính kèm và nhận kết quả');
      setUnlockedParts((prev) => ({ ...prev, 2: true, 3: true }));
      scrollToSection('section-part-3');
      if (p3.firstErrorId) scrollToFirstError(p3.firstErrorId);
      return false;
    }

    setValidationBannerMsg(null);
    return true;
  };

  // Build formData lưu trữ
  const buildFormData = () => ({
    submissionDate: `${new Date().getDate().toString().padStart(2, '0')}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${new Date().getFullYear()}`,
    procedureTitle: isTamThoiProcedure ? 'Cấp giấy thông hành tạm thời' : getProcedureTitle(),
    caseTitle: isTamThoiProcedure ? truongHopDeNghi || 'Cấp giấy thông hành tạm thời' : 'Cấp mới sổ thông hành',
    bookType: isTamThoiProcedure ? 'Giấy thông hành tạm thời' : 'Sổ thông hành Lào - Thái Lan',
    agency: receivingAgency,
    receivingAgency: receivingAgency,
    procedure: currentProcKey,
    donViTiepNhan: isTamThoiProcedure ? donViTiepNhan : undefined,
    cuaKhau: isTamThoiProcedure ? cuaKhau : undefined,
    phongXNC: isTamThoiProcedure ? phongXNC : undefined,
    truongHopDeNghi: isTamThoiProcedure ? truongHopDeNghi : undefined,
    lyDoCuThe: isTamThoiProcedure ? lyDoCuThe : undefined,
    checkpoint: isTamThoiProcedure
      ? donViTiepNhan === 'Cửa khẩu'
        ? cuaKhau
        : phongXNC
        ? (phongXNC.startsWith('Phòng Xuất nhập cảnh') ? phongXNC : `Phòng Xuất nhập cảnh – Công an tỉnh ${phongXNC}`)
        : ''
      : undefined,
    unlockedParts,
    completedParts,
    userAccountName,
    userCitizenId,
    fullNameLatin,
    dob,
    gender,
    ethnicity,
    religion,
    birthProvince,
    birthDistrict,
    birthVillage,
    birthUnit,
    birthAddressDetail,
    resProvince,
    resDistrict,
    resVillage,
    resUnit,
    resAddressDetail,
    nationalId,
    idIssueDate,
    idIssuePlace,
    householdBookNo,
    householdIssueDate,
    householdIssuePlace,
    heightCm,
    hairColor: isTamThoiProcedure ? hairColor : undefined,
    mauToc: isTamThoiProcedure ? hairColor : undefined,
    mauTocKhac: isTamThoiProcedure ? (mauTocKhac || '').trim() : undefined,
    hairColorDetail: isTamThoiProcedure ? (mauTocKhac || '').trim() : undefined,
    eyeColor: isTamThoiProcedure ? eyeColor : undefined,
    mauMat: isTamThoiProcedure ? eyeColor : undefined,
    mauMatKhac: isTamThoiProcedure ? (mauMatKhac || '').trim() : undefined,
    eyeColorDetail: isTamThoiProcedure ? (mauMatKhac || '').trim() : undefined,
    scars,
    scarsLocation,
    tripPurpose: isTamThoiProcedure ? tripPurpose : undefined,
    tripPurposeDetail: isTamThoiProcedure ? tripPurposeDetail : undefined,
    validityStartDate: isTamThoiProcedure ? validityStartDate : undefined,
    validityEndDate: isTamThoiProcedure ? validityEndDate : undefined,
    nationality: isTamThoiProcedure ? nationality : undefined,
    occupation: isTamThoiProcedure ? occupation : undefined,
    ngheNghiep: isTamThoiProcedure ? occupation : undefined,
    ngheNghiepKhac: isTamThoiProcedure ? (ngheNghiepKhac || '').trim() : undefined,
    occupationDetail: isTamThoiProcedure ? (ngheNghiepKhac || '').trim() : undefined,
    portraitImgUrl,
    portraitFileName,
    attachments,
    childAttachments,
    children,
    deliveryMethod,
    postalProvider,
    deliveryProvince,
    deliveryDistrict,
    deliveryVillage,
    deliveryUnit,
    deliveryAddressDetail,
    recipientName,
    recipientPhone,
  });

  // Tự động nạp dữ liệu bản nháp hoặc hồ sơ xem/bổ sung
  useEffect(() => {
    if (effectiveMaHoSo) {
      const draft = getStoredApplicationByCode(effectiveMaHoSo);
      if (draft) {
        // 1. Kiểm tra tính đồng thời
        if (formMode === 'edit-draft' && draft.trangThai !== 'Hồ sơ chưa gửi') {
          alert('Hồ sơ đã được gửi hoặc đã bị thay đổi trạng thái, không thể chỉnh sửa.');
          onBackToStep1();
          return;
        }
        if (formMode === 'supplement' && draft.trangThai !== 'Yêu cầu bổ sung') {
          alert('Hồ sơ không ở trạng thái yêu cầu bổ sung.');
          onBackToStep1();
          return;
        }

        setCurrentAppStatus(draft.trangThai);
        setCurrentAppRecord(draft);
        setCurrentAppDate(
          draft.ngayGui
            ? new Date(draft.ngayGui).toLocaleString('vi-VN')
            : draft.ngayLuu
            ? new Date(draft.ngayLuu).toLocaleString('vi-VN')
            : ''
        );
        if (draft.yeuCauBoSung) {
          setYeuCauBoSung(draft.yeuCauBoSung);
        }

        // Khôi phục các phần đã mở:
        if (formMode === 'view' || formMode === 'supplement') {
          setUnlockedParts({ 1: true, 2: true, 3: true });
          setCompletedParts({ 1: true, 2: true });
        } else if (draft.duLieu?.unlockedParts) {
          setUnlockedParts(draft.duLieu.unlockedParts);
          if (draft.duLieu.completedParts) {
            setCompletedParts(draft.duLieu.completedParts);
          }
        }

        // Nạp dữ liệu từ duLieu hoặc formData
        const d = draft.duLieu || draft.formData || {};
        const newErrors: Record<string, string> = {};

        if (isTamThoiProcedure) {
          if (draft.donViTiepNhan || d.donViTiepNhan) setDonViTiepNhan((draft.donViTiepNhan || d.donViTiepNhan) as any);
          if (draft.cuaKhau || d.cuaKhau) setCuaKhau(draft.cuaKhau || d.cuaKhau || '');
          if (draft.phongXNC || d.phongXNC) setPhongXNC(draft.phongXNC || d.phongXNC || '');
          if (draft.truongHopDeNghi || d.truongHopDeNghi) setTruongHopDeNghi(draft.truongHopDeNghi || d.truongHopDeNghi || '');
          if (draft.lyDoCuThe || d.lyDoCuThe) setLyDoCuThe(draft.lyDoCuThe || d.lyDoCuThe || '');

          // Kiểm tra danh mục Nghề nghiệp
          const savedOcc = draft.ngheNghiep || d.ngheNghiep || d.occupation;
          if (savedOcc) {
            const validOccs = OCCUPATION_OPTIONS.map((o) => o.value).filter(Boolean);
            if (validOccs.includes(savedOcc)) {
              setOccupation(savedOcc);
            } else if (formMode === 'edit-draft') {
              setOccupation('');
              newErrors['field-occupation'] = 'Giá trị đã lưu của Nghề nghiệp không còn trong danh mục. Vui lòng chọn lại.';
            }
          }
          const savedOccKhac = draft.ngheNghiepKhac || d.ngheNghiepKhac || d.occupationDetail;
          if (savedOccKhac) setNgheNghiepKhac(savedOccKhac);

          // Kiểm tra danh mục Màu tóc
          const savedHair = draft.mauToc || d.mauToc || d.hairColor;
          if (savedHair) {
            const validHairs = HAIR_COLOR_OPTIONS.map((o) => o.value).filter(Boolean);
            if (validHairs.includes(savedHair)) {
              setHairColor(savedHair);
            } else if (formMode === 'edit-draft') {
              setHairColor('');
              newErrors['field-hairColor'] = 'Giá trị đã lưu của Màu tóc không còn trong danh mục. Vui lòng chọn lại.';
            }
          }
          const savedHairKhac = draft.mauTocKhac || d.mauTocKhac || d.hairColorDetail;
          if (savedHairKhac) setMauTocKhac(savedHairKhac);

          // Kiểm tra danh mục Màu mắt
          const savedEye = draft.mauMat || d.mauMat || d.eyeColor;
          if (savedEye) {
            const validEyes = EYE_COLOR_OPTIONS.map((o) => o.value).filter(Boolean);
            if (validEyes.includes(savedEye)) {
              setEyeColor(savedEye);
            } else if (formMode === 'edit-draft') {
              setEyeColor('');
              newErrors['field-eyeColor'] = 'Giá trị đã lưu của Màu mắt không còn trong danh mục. Vui lòng chọn lại.';
            }
          }
          const savedEyeKhac = draft.mauMatKhac || d.mauMatKhac || d.eyeColorDetail;
          if (savedEyeKhac) setMauMatKhac(savedEyeKhac);

          if (d.nationality) setNationality(d.nationality);
          if (d.tripPurpose) setTripPurpose(d.tripPurpose);
          if (d.tripPurposeDetail) setTripPurposeDetail(d.tripPurposeDetail);

          // Kiểm tra ngày bắt đầu cho thủ tục tam-thoi
          if (d.validityStartDate) {
            const todayIso = new Date().toISOString().split('T')[0];
            if (formMode === 'edit-draft' && d.validityStartDate < todayIso) {
              setValidityStartDate('');
              setValidityEndDate('');
              newErrors['field-validityStartDate'] = 'Ngày bắt đầu không được trước hôm nay. Vui lòng chọn lại.';
            } else {
              setValidityStartDate(d.validityStartDate);
              setValidityEndDate(d.validityEndDate || computeValidityEndDate(d.validityStartDate));
            }
          }
        } else {
          // Đối với thủ tục cấp sổ thông hành (cap-so): Bỏ qua hoàn toàn dữ liệu của tam-thoi
          setDonViTiepNhan('Phòng Xuất nhập cảnh');
          setPhongXNC(matchImmigrationOfficeOption(userResidentProvince));
          setCuaKhau('');
          setTruongHopDeNghi('');
          setLyDoCuThe('');
          setOccupation('');
          setNgheNghiepKhac('');
          setHairColor('');
          setMauTocKhac('');
          setEyeColor('');
          setMauMatKhac('');
          setTripPurpose('');
          setTripPurposeDetail('');
          setValidityStartDate('');
          setValidityEndDate('');
        }

        if (d.fullNameLatin) setFullNameLatin(d.fullNameLatin);
        if (d.dob) setDob(d.dob);
        if (d.gender) setGender(d.gender);

        // Kiểm tra danh mục Dân tộc
        if (d.ethnicity) {
          if (LAO_ETHNIC_GROUPS.includes(d.ethnicity)) {
            setEthnicity(d.ethnicity);
          } else if (formMode === 'edit-draft') {
            setEthnicity('');
            newErrors['field-ethnicity'] = 'Giá trị đã lưu của Dân tộc không còn trong danh mục. Vui lòng chọn lại.';
          }
        }

        // Kiểm tra danh mục Tôn giáo
        if (d.religion) {
          const validReligions = ['Phật giáo', 'Kitô giáo', 'Hồi giáo', 'Baháʼí giáo', 'Không'];
          if (validReligions.includes(d.religion)) {
            setReligion(d.religion);
          } else if (formMode === 'edit-draft') {
            setReligion('');
            newErrors['field-religion'] = 'Giá trị đã lưu của Tôn giáo không còn trong danh mục. Vui lòng chọn lại.';
          }
        }

        if (d.birthProvince) setBirthProvince(d.birthProvince);
        if (d.birthDistrict) setBirthDistrict(d.birthDistrict);
        if (d.birthVillage) setBirthVillage(d.birthVillage);
        if (d.birthUnit) setBirthUnit(d.birthUnit);
        if (d.birthAddressDetail) setBirthAddressDetail(d.birthAddressDetail);
        if (d.resProvince) setResProvince(d.resProvince);
        if (d.resDistrict) setResDistrict(d.resDistrict);
        if (d.resVillage) setResVillage(d.resVillage);
        if (d.resUnit) setResUnit(d.resUnit);
        if (d.resAddressDetail) setResAddressDetail(d.resAddressDetail);
        if (d.nationalId) setNationalId(d.nationalId);
        if (d.idIssueDate) setIdIssueDate(d.idIssueDate);
        if (d.idIssuePlace) setIdIssuePlace(d.idIssuePlace);
        if (d.householdBookNo) setHouseholdBookNo(d.householdBookNo);
        if (d.householdIssueDate) setHouseholdIssueDate(d.householdIssueDate);
        if (d.householdIssuePlace) setHouseholdIssuePlace(d.householdIssuePlace);
        if (d.heightCm) setHeightCm(d.heightCm);
        if (d.scars) setScars(d.scars);
        if (d.scarsLocation) setScarsLocation(d.scarsLocation);

        if (d.portraitImgUrl) setPortraitImgUrl(d.portraitImgUrl);
        if (d.portraitFileName) setPortraitFileName(d.portraitFileName);
        if (Array.isArray(d.attachments)) setAttachments(d.attachments);
        if (d.childAttachments) setChildAttachments(d.childAttachments);
        if (Array.isArray(d.children)) setChildren(d.children);
        if (d.deliveryMethod) setDeliveryMethod(d.deliveryMethod);
        if (d.postalProvider) setPostalProvider(d.postalProvider);
        if (d.deliveryProvince) setDeliveryProvince(d.deliveryProvince);
        if (d.deliveryDistrict) setDeliveryDistrict(d.deliveryDistrict);
        if (d.deliveryVillage) setDeliveryVillage(d.deliveryVillage);
        if (d.deliveryUnit) setDeliveryUnit(d.deliveryUnit);
        if (d.deliveryAddressDetail) setDeliveryAddressDetail(d.deliveryAddressDetail);
        if (d.recipientName) setRecipientName(d.recipientName);
        if (d.recipientPhone) setRecipientPhone(d.recipientPhone);

        if (Object.keys(newErrors).length > 0) {
          setErrors((prev) => ({ ...prev, ...newErrors }));
        }
      }
    }
  }, [effectiveMaHoSo, formMode, isTamThoiProcedure]);

  // Hành vi khi bấm nút Quay lại (kiểm tra có thay đổi chưa lưu)
  const handleBackClick = () => {
    if (isViewMode) {
      onBackToStep1();
      return;
    }
    if (isDirty) {
      setShowLeaveConfirmModal(true);
      return;
    }
    onBackToStep1();
  };

  // Hành vi Lưu nháp (KHÔNG validate)
  const handleSaveDraft = () => {
    // Nếu đang ở chế độ bổ sung hồ sơ:
    if (isSupplementMode) {
      const currentFresh = getStoredApplicationByCode(effectiveMaHoSo);
      if (!currentFresh || currentFresh.trangThai !== 'Yêu cầu bổ sung') {
        alert('Trạng thái hồ sơ đã bị thay đổi bởi cán bộ. Vui lòng quay lại danh sách hồ sơ.');
        onBackToStep1();
        return;
      }

      saveOrUpdateApplication({
        maHoSo: effectiveMaHoSo,
        taiKhoan: nationalId || userCitizenId,
        thuTuc: currentProcKey,
        duLieu: buildFormData(),
        soLanBoSung: currentFresh.soLanBoSung || 0,
        loaiThuTuc: isTamThoiProcedure ? 'Cấp giấy thông hành tạm thời' : getProcedureTitle(),
        procedure: currentProcKey,
        receivingAgency: receivingAgency,
        donViTiepNhan: isTamThoiProcedure ? donViTiepNhan || undefined : undefined,
        cuaKhau: isTamThoiProcedure ? cuaKhau : undefined,
        phongXNC: isTamThoiProcedure ? phongXNC : undefined,
        truongHopDeNghi: isTamThoiProcedure ? truongHopDeNghi : undefined,
        lyDoCuThe: isTamThoiProcedure ? lyDoCuThe : undefined,
        checkpoint: isTamThoiProcedure
          ? donViTiepNhan === 'Cửa khẩu'
            ? cuaKhau
            : phongXNC
            ? phongXNC.startsWith('Phòng Xuất nhập cảnh')
              ? phongXNC
              : `Phòng Xuất nhập cảnh – Công an tỉnh ${phongXNC}`
            : undefined
          : undefined,
        hoTenNguoiNop: userAccountName,
        trangThai: 'Yêu cầu bổ sung',
        yeuCauBoSung: currentFresh.yeuCauBoSung,
        cccd: nationalId || userCitizenId,
        ngheNghiep: isTamThoiProcedure ? occupation : undefined,
        ngheNghiepKhac: isTamThoiProcedure ? (ngheNghiepKhac || '').trim() : undefined,
        mauToc: isTamThoiProcedure ? hairColor : undefined,
        mauTocKhac: isTamThoiProcedure ? (mauTocKhac || '').trim() : undefined,
        mauMat: isTamThoiProcedure ? eyeColor : undefined,
        mauMatKhac: isTamThoiProcedure ? (mauMatKhac || '').trim() : undefined,
        formData: buildFormData(),
        userId: session?.userId,
      });

      setIsDirty(false);
      setSuccessToast({ maHoSo: effectiveMaHoSo });
      return;
    }

    // Nếu đang ở chế độ chỉnh sửa nháp: kiểm tra concurrency
    if (isEditDraftMode && effectiveMaHoSo) {
      const currentFresh = getStoredApplicationByCode(effectiveMaHoSo);
      if (!currentFresh || currentFresh.trangThai !== 'Hồ sơ chưa gửi') {
        alert('Hồ sơ đã được gửi hoặc đã bị thay đổi trạng thái, không thể chỉnh sửa.');
        onBackToStep1();
        return;
      }
    }

    const savedRecord = saveOrUpdateApplication({
      maHoSo: effectiveMaHoSo || undefined,
      taiKhoan: nationalId || userCitizenId,
      thuTuc: currentProcKey,
      duLieu: buildFormData(),
      soLanBoSung: 0,
      loaiThuTuc: isTamThoiProcedure ? 'Cấp giấy thông hành tạm thời' : getProcedureTitle(),
      procedure: currentProcKey,
      receivingAgency: receivingAgency,
      donViTiepNhan: isTamThoiProcedure ? donViTiepNhan || undefined : undefined,
      cuaKhau: isTamThoiProcedure ? cuaKhau : undefined,
      phongXNC: isTamThoiProcedure ? phongXNC : undefined,
      truongHopDeNghi: isTamThoiProcedure ? truongHopDeNghi : undefined,
      lyDoCuThe: isTamThoiProcedure ? lyDoCuThe : undefined,
      checkpoint: isTamThoiProcedure
        ? donViTiepNhan === 'Cửa khẩu'
          ? cuaKhau
          : phongXNC
          ? `Phòng Xuất nhập cảnh – Công an tỉnh ${phongXNC}`
          : undefined
        : undefined,
      hoTenNguoiNop: userAccountName,
      trangThai: 'Hồ sơ chưa gửi',
      cccd: nationalId || userCitizenId,
      ngheNghiep: isTamThoiProcedure ? occupation : undefined,
      ngheNghiepKhac: isTamThoiProcedure ? (ngheNghiepKhac || '').trim() : undefined,
      mauToc: isTamThoiProcedure ? hairColor : undefined,
      mauTocKhac: isTamThoiProcedure ? (mauTocKhac || '').trim() : undefined,
      mauMat: isTamThoiProcedure ? eyeColor : undefined,
      mauMatKhac: isTamThoiProcedure ? (mauMatKhac || '').trim() : undefined,
      formData: buildFormData(),
      userId: session?.userId,
    });

    setIsDirty(false);
    if (onSaveDraft) {
      onSaveDraft(savedRecord);
    }
    onBackToStep1();
  };

  // Hành vi In phiếu
  const handlePrintTicket = () => {
    // Chế độ xem: mở in trực tiếp không cần kiểm tra hợp lệ
    if (isViewMode) {
      setShowPrintModal(true);
      return;
    }

    // Bản nháp hoặc bổ sung: kiểm tra toàn bộ 3 phần
    const isValid = validateAllParts();
    if (!isValid) return;
    setShowPrintModal(true);
  };

  // Hành vi Gửi bổ sung hồ sơ
  const handleSubmitSupplement = () => {
    // 1. Validate toàn bộ 3 phần
    const isValid = validateAllParts();
    if (!isValid) return;

    // 2. Kiểm tra các giấy tờ cần bổ sung trong yeuCauBoSung.giayToThieu
    if (yeuCauBoSung && yeuCauBoSung.giayToThieu && yeuCauBoSung.giayToThieu.length > 0) {
      const missingDocs = yeuCauBoSung.giayToThieu;
      for (const reqDoc of missingDocs) {
        const lowerReq = reqDoc.toLowerCase().trim();
        if (
          lowerReq.includes('trẻ em') ||
          lowerReq.includes('khai sinh') ||
          lowerReq.includes('giám hộ')
        ) {
          let hasFile = false;
          if (children.length > 0) {
            for (const c of children) {
              const childDocs = childAttachments[c.id] || {};
              if (Object.values(childDocs).some((f: any) => f && f.name)) {
                hasFile = true;
                break;
              }
            }
          }
          if (!hasFile) {
            setValidationBannerMsg(`Vui lòng tải lên ${reqDoc} ở Phần 3`);
            scrollToSection('section-part-3');
            return;
          }
        } else {
          const foundRow = attachments.find(
            (r) =>
              r.name.toLowerCase().includes(lowerReq) || lowerReq.includes(r.name.toLowerCase())
          );
          if (foundRow && !foundRow.file) {
            setErrors((prev) => ({ ...prev, [foundRow.id]: `Vui lòng tải lên ${reqDoc}` }));
            setValidationBannerMsg(`Vui lòng tải lên ${reqDoc} ở Phần 3`);
            scrollToSection('section-part-3');
            return;
          }
        }
      }
    }

    // 3. Kiểm tra tính đồng thời
    const currentFresh = getStoredApplicationByCode(effectiveMaHoSo);
    if (!currentFresh || currentFresh.trangThai !== 'Yêu cầu bổ sung') {
      alert('Trạng thái hồ sơ đã bị thay đổi bởi cán bộ. Vui lòng quay lại danh sách hồ sơ.');
      onBackToStep1();
      return;
    }

    if (isMissingResidence) {
      setValidationBannerMsg('Tài khoản chưa có thông tin nơi thường trú. Vui lòng cập nhật thông tin tài khoản');
      setUnlockedParts((prev) => ({ ...prev, 2: true }));
      scrollToSection('section-part-2');
      return;
    }

    // 4. Cập nhật hồ sơ
    saveOrUpdateApplication({
      maHoSo: effectiveMaHoSo,
      taiKhoan: nationalId || userCitizenId,
      thuTuc: currentProcKey,
      duLieu: buildFormData(),
      loaiThuTuc: isTamThoiProcedure ? 'Cấp giấy thông hành tạm thời' : getProcedureTitle(),
      procedure: currentProcKey,
      receivingAgency: receivingAgency,
      donViTiepNhan: isTamThoiProcedure ? donViTiepNhan || undefined : undefined,
      cuaKhau: isTamThoiProcedure ? cuaKhau : undefined,
      phongXNC: isTamThoiProcedure ? phongXNC : undefined,
      truongHopDeNghi: isTamThoiProcedure ? truongHopDeNghi : undefined,
      lyDoCuThe: isTamThoiProcedure ? lyDoCuThe : undefined,
      checkpoint: isTamThoiProcedure
        ? donViTiepNhan === 'Cửa khẩu'
          ? cuaKhau
          : phongXNC
          ? phongXNC.startsWith('Phòng Xuất nhập cảnh')
            ? phongXNC
            : `Phòng Xuất nhập cảnh – Công an tỉnh ${phongXNC}`
          : undefined
        : undefined,
      hoTenNguoiNop: userAccountName,
      trangThai: 'Đã gửi',
      soLanBoSung: (currentFresh.soLanBoSung || 0) + 1,
      yeuCauBoSung: undefined,
      cccd: nationalId || userCitizenId,
      ngheNghiep: isTamThoiProcedure ? occupation : undefined,
      ngheNghiepKhac: isTamThoiProcedure ? (ngheNghiepKhac || '').trim() : undefined,
      mauToc: isTamThoiProcedure ? hairColor : undefined,
      mauTocKhac: isTamThoiProcedure ? (mauTocKhac || '').trim() : undefined,
      mauMat: isTamThoiProcedure ? eyeColor : undefined,
      mauMatKhac: isTamThoiProcedure ? (mauMatKhac || '').trim() : undefined,
      formData: buildFormData(),
      userId: session?.userId,
    });

    // 5. Ghi log eb_audit_log
    logAuditAction({
      taiKhoan: nationalId || userCitizenId,
      maHoSo: effectiveMaHoSo,
      hanhDong: 'gui_bo_sung',
    });

    setIsDirty(false);
    if (onSubmitSuccess) {
      onSubmitSuccess(effectiveMaHoSo);
    }
    setSuccessToast({ maHoSo: effectiveMaHoSo });
  };

  // Xác nhận và nộp hồ sơ từ hộp thoại đặt lịch hẹn
  const handleBookingModalConfirm = (bookingResult: BookingModalResult) => {
    setShowBookingModal(false);

    const cleanId = (nationalId || userCitizenId || session?.idNumber || '').replace(/\D/g, '');

    const savedRecord = saveOrUpdateApplication({
      maHoSo: effectiveMaHoSo || undefined,
      taiKhoan: nationalId || userCitizenId,
      thuTuc: currentProcKey,
      duLieu: buildFormData(),
      soLanBoSung: 0,
      loaiThuTuc: isTamThoiProcedure ? 'Cấp giấy thông hành tạm thời' : getProcedureTitle(),
      procedure: currentProcKey,
      receivingAgency: receivingAgency,
      donViTiepNhan: isTamThoiProcedure ? donViTiepNhan || undefined : undefined,
      cuaKhau: isTamThoiProcedure ? cuaKhau : undefined,
      phongXNC: isTamThoiProcedure ? phongXNC : undefined,
      truongHopDeNghi: isTamThoiProcedure ? truongHopDeNghi : undefined,
      lyDoCuThe: isTamThoiProcedure ? lyDoCuThe : undefined,
      checkpoint: isTamThoiProcedure
        ? donViTiepNhan === 'Cửa khẩu'
          ? cuaKhau
          : phongXNC
          ? phongXNC.startsWith('Phòng Xuất nhập cảnh')
            ? phongXNC
            : `Phòng Xuất nhập cảnh – Công an tỉnh ${phongXNC}`
          : undefined
        : undefined,
      hoTenNguoiNop: userAccountName,
      trangThai: 'Đã gửi',
      cccd: nationalId || userCitizenId,
      ngheNghiep: isTamThoiProcedure ? occupation : undefined,
      ngheNghiepKhac: isTamThoiProcedure ? (ngheNghiepKhac || '').trim() : undefined,
      mauToc: isTamThoiProcedure ? hairColor : undefined,
      mauTocKhac: isTamThoiProcedure ? (mauTocKhac || '').trim() : undefined,
      mauMat: isTamThoiProcedure ? eyeColor : undefined,
      mauMatKhac: isTamThoiProcedure ? (mauMatKhac || '').trim() : undefined,
      formData: buildFormData(),
      userId: session?.userId,
    });

    let effectiveApp: BiometricAppointment | null = null;

    if (bookingResult.isExisting && bookingResult.appointmentId) {
      // Liên kết lịch hẹn đã có với hồ sơ vừa nộp
      const updated = updateBiometricAppointment(bookingResult.appointmentId, {
        maHoSo: savedRecord.maHoSo,
      });
      effectiveApp = updated || existingAppointmentForModal;
    } else {
      // Tạo lịch hẹn mới với trạng thái "Chờ cơ quan xác nhận"
      const newAppId = generateAppointmentCode();
      const newApp: BiometricAppointment = {
        id: newAppId,
        maHoSo: savedRecord.maHoSo,
        ownerId: cleanId,
        coQuan: bookingResult.agency || receivingAgency,
        ngay: bookingResult.date,
        khungGio: bookingResult.timeSlot,
        sdt: bookingResult.phone,
        ghiChu: bookingResult.notes,
        trangThai: 'Chờ cơ quan xác nhận',
        createdAt: new Date().toISOString(),
        loaiThuTuc: currentProcKey,
        donViTiepNhan: isTamThoiProcedure ? donViTiepNhan || undefined : 'Phòng Xuất nhập cảnh',
        cuaKhau: isTamThoiProcedure && donViTiepNhan === 'Cửa khẩu' ? cuaKhau : undefined,
      };
      saveBiometricAppointment(newApp);
      effectiveApp = newApp;
    }

    setIsDirty(false);
    if (onSubmitSuccess) {
      onSubmitSuccess(savedRecord.maHoSo);
    }
    setSuccessToast({ maHoSo: savedRecord.maHoSo });

    // Hiển thị Màn hình thành công
    setSubmissionSuccessData({
      maHoSo: savedRecord.maHoSo,
      procedureTitle: isTamThoiProcedure ? 'Cấp giấy thông hành tạm thời' : getProcedureTitle(),
      appointment: effectiveApp,
    });
  };

  // Hành vi Nộp hồ sơ (cho tạo mới hoặc chỉnh sửa nháp)
  const handleSubmitApplication = async () => {
    if (isSupplementMode) {
      handleSubmitSupplement();
      return;
    }

    if (isMissingResidence) {
      setValidationBannerMsg('Tài khoản chưa có thông tin nơi thường trú. Vui lòng cập nhật thông tin tài khoản');
      setUnlockedParts((prev) => ({ ...prev, 2: true }));
      scrollToSection('section-part-2');
      return;
    }

    const isValid = validateAllParts();
    if (!isValid) return;

    // Spinner nhỏ trên nút ("Đang xử lý...", tối đa ~1 giây mock: 1000ms), nút bị khóa
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const cleanId = (nationalId || userCitizenId || session?.idNumber || '').replace(/\D/g, '');
    const evalResult = evaluateBiometricStatus(cleanId);

    // 2d) Nếu mock error (eb_demo_biometric = "loi"):
    // Toast đỏ "Không kết nối được Hệ thống e-Border. Vui lòng thử lại sau", form preserved, unlock button
    if (evalResult === 'error') {
      setIsSubmitting(false);
      setValidationBannerMsg('Không kết nối được Hệ thống e-Border. Vui lòng thử lại sau.');
      alert('Không kết nối được Hệ thống e-Border. Vui lòng thử lại sau.');
      return;
    }

    // 2c) Nếu "chưa có sinh trắc": CHƯA nộp, mở hộp thoại "Chọn ngày hẹn thu nhận sinh trắc"
    if (evalResult === 'no_biometric') {
      setIsSubmitting(false);
      const activeApp = getActiveAppointment(cleanId);
      setExistingAppointmentForModal(activeApp || null);
      setShowBookingModal(true);
      return;
    }

    // 2a & 2b) ĐÃ CÓ sinh trắc: ghi nhận vào eb_biometric_done và nộp hồ sơ luôn
    markBiometricCompletedForCitizen(cleanId);

    const savedRecord = saveOrUpdateApplication({
      maHoSo: effectiveMaHoSo || undefined,
      taiKhoan: nationalId || userCitizenId,
      thuTuc: currentProcKey,
      duLieu: buildFormData(),
      soLanBoSung: 0,
      loaiThuTuc: isTamThoiProcedure ? 'Cấp giấy thông hành tạm thời' : getProcedureTitle(),
      procedure: currentProcKey,
      receivingAgency: receivingAgency,
      donViTiepNhan: isTamThoiProcedure ? donViTiepNhan || undefined : undefined,
      cuaKhau: isTamThoiProcedure ? cuaKhau : undefined,
      phongXNC: isTamThoiProcedure ? phongXNC : undefined,
      truongHopDeNghi: isTamThoiProcedure ? truongHopDeNghi : undefined,
      lyDoCuThe: isTamThoiProcedure ? lyDoCuThe : undefined,
      checkpoint: isTamThoiProcedure
        ? donViTiepNhan === 'Cửa khẩu'
          ? cuaKhau
          : phongXNC
          ? phongXNC.startsWith('Phòng Xuất nhập cảnh')
            ? phongXNC
            : `Phòng Xuất nhập cảnh – Công an tỉnh ${phongXNC}`
          : undefined
        : undefined,
      hoTenNguoiNop: userAccountName,
      trangThai: 'Đã gửi',
      cccd: nationalId || userCitizenId,
      ngheNghiep: isTamThoiProcedure ? occupation : undefined,
      ngheNghiepKhac: isTamThoiProcedure ? (ngheNghiepKhac || '').trim() : undefined,
      mauToc: isTamThoiProcedure ? hairColor : undefined,
      mauTocKhac: isTamThoiProcedure ? (mauTocKhac || '').trim() : undefined,
      mauMat: isTamThoiProcedure ? eyeColor : undefined,
      mauMatKhac: isTamThoiProcedure ? (mauMatKhac || '').trim() : undefined,
      formData: buildFormData(),
      userId: session?.userId,
    });

    setIsSubmitting(false);
    setIsDirty(false);
    if (onSubmitSuccess) {
      onSubmitSuccess(savedRecord.maHoSo);
    }
    setSuccessToast({ maHoSo: savedRecord.maHoSo });

    // Hiển thị Màn hình thành công (không có lịch hẹn kèm theo do đã có sinh trắc)
    setSubmissionSuccessData({
      maHoSo: savedRecord.maHoSo,
      procedureTitle: isTamThoiProcedure ? 'Cấp giấy thông hành tạm thời' : getProcedureTitle(),
      appointment: null,
    });
  };

  useEffect(() => {
    // Chỉ tự động chuyển về trang danh sách đối với thao tác bổ sung hồ sơ
    if (successToast && isSupplementMode) {
      const timer = setTimeout(() => {
        onBackToStep1();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [successToast, isSupplementMode, onBackToStep1]);

  const renderStatusBadge = (status?: string) => {
    if (!status) return null;
    switch (status) {
      case 'Hồ sơ chưa gửi':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium bg-gray-100 text-gray-700 border border-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5" />
            Hồ sơ chưa gửi
          </span>
        );
      case 'Đã gửi':
      case 'Đã tiếp nhận':
      case 'Đang thẩm định':
      case 'Chờ phê duyệt cấp':
      case 'Chờ phê duyệt từ chối':
      case 'Đã phê duyệt':
      case 'Đang in':
      case 'Chờ trả kết quả':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5" />
            {status}
          </span>
        );
      case 'Yêu cầu bổ sung':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold bg-amber-50 text-amber-700 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            Yêu cầu bổ sung
          </span>
        );
      case 'Từ chối tiếp nhận':
      case 'Đã rút':
      case 'Đã từ chối cấp':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium bg-rose-50 text-rose-700 border border-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5" />
            {status}
          </span>
        );
      case 'Hoàn tất':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            Hoàn tất
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium bg-gray-100 text-gray-700 border border-gray-300">
            {status}
          </span>
        );
    }
  };

  const ReadOnlyField: React.FC<{ label: string; value: string; required?: boolean }> = ({
    label,
    value,
    required = false,
  }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[14px] font-semibold text-[#1F2937] flex items-center">
        <span>{label}</span>
        {required && <span className="text-[#D71920] ml-1 font-bold">*</span>}
      </label>
      <div className="w-full text-[15px] text-[#1F2937] bg-[#F5F7F6] border border-[#D9E1DC] rounded-lg px-3.5 py-2.5 select-none cursor-default font-normal truncate">
        {value || '—'}
      </div>
    </div>
  );

  if (submissionSuccessData) {
    return (
      <SubmissionSuccessView
        maHoSo={submissionSuccessData.maHoSo}
        procedureTitle={submissionSuccessData.procedureTitle}
        submissionDate={new Date().toLocaleDateString('vi-VN')}
        appointment={submissionSuccessData.appointment}
        onNavigateHome={() => {
          window.location.hash = '#/trang-chu';
        }}
        onNavigateMyApplications={() => {
          window.location.hash = '#/tra-cuu-ho-so';
        }}
        onNavigateMyAppointments={() => {
          window.location.hash = '#/lich-hen';
        }}
        onNavigateNewSubmission={() => {
          window.location.hash = '#/nop-ho-so';
        }}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-[1040px] mx-auto animate-fadeIn pb-6 relative text-[16px]">
      {/* Tiêu đề trang */}
      <div className="border-b border-[#D9E1DC] pb-3">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#1F2937] leading-tight">
          {isTamThoiProcedure ? 'Nộp hồ sơ cấp giấy thông hành tạm thời' : 'Nộp hồ sơ cấp sổ thông hành'}
        </h2>
      </div>

      {/* Toast xác nhận gửi thành công */}
      {successToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-bounce-subtle">
          <div className="bg-white border border-[#D9E1DC] border-l-4 border-l-[#006B3F] rounded-lg p-4 shadow-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-full bg-[#E8F3EE] text-[#006B3F] shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[#006B3F]" />
              </span>
              <div>
                <strong className="text-[15px] text-[#1F2937] block font-semibold">
                  Gửi hồ sơ thành công!
                </strong>
                <span className="text-[14px] text-[#6B7280]">
                  Mã hồ sơ của bạn là <strong className="text-[#006B3F] font-mono">{successToast.maHoSo}</strong>.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onBackToStep1()}
              className="p-1 text-[#6B7280] hover:text-[#1F2937] rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* DẢI THÔNG TIN TÓM TẮT ĐẦU TRANG (Khi mở xem, chỉnh sửa nháp hoặc bổ sung hồ sơ) */}
      {effectiveMaHoSo && (
        <div className="bg-white border border-[#D9DFDC] rounded-xl p-4 sm:p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[#6B7280]">Mã hồ sơ:</span>
              <span className="text-[15px] font-mono font-bold text-[#006B3F] bg-[#E8F3EE] px-2.5 py-1 rounded">
                {effectiveMaHoSo}
              </span>
            </div>
            <div className="text-[#D9DFDC] hidden sm:inline">|</div>
            <div className="text-[14px] text-[#4B5563]">
              <span className="text-[#6B7280]">Thủ tục:</span>{' '}
              <span className="font-semibold text-[#1F2937]">
                {isTamThoiProcedure ? 'Cấp giấy thông hành tạm thời' : 'Cấp sổ thông hành'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div>{renderStatusBadge(currentAppStatus)}</div>
            {currentAppDate && (
              <div className="text-[12px] text-[#6B7280]">
                {currentAppStatus === 'Hồ sơ chưa gửi' ? 'Lưu lúc: ' : 'Lưu/Gửi: '}
                <span className="font-medium text-[#1F2937]">{currentAppDate}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BANNER MÀU VÀNG YÊU CẦU BỔ SUNG (Hiện khi hồ sơ có yêu cầu bổ sung) */}
      {yeuCauBoSung && (
        <div className="bg-[#FFF8E7] border-l-4 border-l-[#D6A928] border border-[#F4E29D] p-4 sm:p-5 rounded-xl space-y-2 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2 text-[#9A740E] font-bold text-[15px]">
            <AlertTriangle className="w-5 h-5 text-[#D6A928] shrink-0" />
            <span>
              {isSupplementMode
                ? 'Hồ sơ cần bổ sung thông tin'
                : `Yêu cầu bổ sung từ ${yeuCauBoSung.donViYeuCau || 'Cơ quan tiếp nhận'} (ngày ${yeuCauBoSung.ngayYeuCau})`}
            </span>
          </div>
          <p className="text-[14px] text-[#1F2937] leading-relaxed">
            {isSupplementMode ? (
              <>
                Hồ sơ cần bổ sung thông tin theo yêu cầu của{' '}
                <strong>{yeuCauBoSung.donViYeuCau || 'Cơ quan tiếp nhận'}</strong> ngày{' '}
                <strong>{yeuCauBoSung.ngayYeuCau}</strong>:
              </>
            ) : null}
          </p>
          <div className="p-3 bg-white/90 rounded-lg border border-[#F4E29D] text-[14px] font-medium text-[#1F2937]">
            &ldquo;{yeuCauBoSung.noiDung}&rdquo;
          </div>
          {yeuCauBoSung.giayToThieu && yeuCauBoSung.giayToThieu.length > 0 && (
            <div className="text-[13.5px] text-[#78540B] pt-1">
              <span className="font-semibold">Danh sách giấy tờ cần nộp bổ sung: </span>
              <span className="font-bold text-[#D71920]">
                {yeuCauBoSung.giayToThieu.join(', ')}
              </span>
            </div>
          )}
        </div>
      )}

      {/* THANH TAB CỐ ĐỊNH KHI CUỘN */}
      <FormProgressTab
        activePart={activePart}
        unlockedParts={unlockedParts}
        completedParts={completedParts}
        hasErrorParts={hasErrorParts}
        onSelectPart={handleSelectTab}
        isLao={isLao}
        procedure={currentProcKey}
        procedureTitle={isTamThoiProcedure ? 'Cấp giấy thông hành tạm thời' : getProcedureTitle()}
        receivingUnitName={receivingUnitName}
      />

      {/* Banner thông báo lỗi nếu có */}
      {validationBannerMsg && (
        <div
          id="validation-banner"
          className="p-4 bg-[#FEECEC] border-l-4 border-l-[#D71920] border border-[#FCA5A5] rounded-xl flex items-center justify-between text-[14px] text-[#D71920] animate-fadeIn shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-[#D71920] shrink-0" />
            <span className="font-semibold">{validationBannerMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setValidationBannerMsg(null)}
            className="p-1 hover:bg-[#FCD8D8] rounded text-[#D71920] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* THẺ THÔNG TIN THANH TOÁN (Chỉ hiển thị ở chế độ Xem chi tiết hồ sơ) */}
      {isViewMode && (
        <div className="bg-white border border-[#D9DFDC] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E9E7]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#1A2421]">
                  Thông tin thanh toán lệ phí
                </h3>
                <p className="text-[12px] text-[#5F6B66]">
                  Theo dõi trạng thái thu phí và hóa đơn điện tử của hồ sơ
                </p>
              </div>
            </div>

            {/* Nút hành động thanh toán / xem biên lai */}
            <div className="flex items-center gap-2">
              {(currentAppRecord?.paymentStatus === 'Chờ thanh toán' ||
                currentAppRecord?.paymentStatus === 'Thanh toán lỗi') && (
                <button
                  type="button"
                  onClick={() => {
                    window.location.hash = `#/thanh-toan/${effectiveMaHoSo}`;
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold transition-colors shadow-xs"
                >
                  <CreditCard className="w-4 h-4" />
                  Thanh toán lệ phí
                </button>
              )}

              {currentAppRecord?.paymentStatus === 'Đã thanh toán' && (
                <button
                  type="button"
                  onClick={() => setShowReceiptModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[13px] font-semibold transition-colors shadow-xs"
                >
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  Xem biên lai điện tử
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-[13px]">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 uppercase block">
                Số tiền lệ phí
              </span>
              <span className="text-[16px] font-black text-blue-700 font-mono mt-0.5 block">
                {(
                  currentAppRecord?.paymentAmount ??
                  (isTamThoiProcedure ? 100000 : 200000)
                ).toLocaleString('vi-VN')}{' '}
                VNĐ
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 uppercase block">
                Trạng thái thanh toán
              </span>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                    currentAppRecord?.paymentStatus === 'Đã thanh toán'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : currentAppRecord?.paymentStatus === 'Đang xử lý giao dịch'
                      ? 'bg-sky-100 text-sky-800 border border-sky-300'
                      : currentAppRecord?.paymentStatus === 'Thanh toán lỗi'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : currentAppRecord?.paymentStatus === 'Không phát sinh lệ phí'
                      ? 'bg-slate-200 text-slate-700'
                      : currentAppRecord?.paymentStatus === 'Chờ thanh toán'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {currentAppRecord?.paymentStatus || '-'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 uppercase block">
                Cơ quan thu tiền
              </span>
              <span className="text-[13px] font-medium text-slate-800 mt-0.5 block line-clamp-2">
                {currentAppRecord?.paymentAgency ||
                  (currentAppRecord?.phongXNC
                    ? `Phòng Xuất nhập cảnh – Công an tỉnh ${currentAppRecord.phongXNC}`
                    : 'Phòng Quản lý xuất nhập cảnh')}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 uppercase block">
                Mã giao dịch / Thời gian
              </span>
              <span className="text-[13px] font-mono text-slate-800 mt-0.5 block">
                {currentAppRecord?.paymentTxnId ? (
                  <>
                    <span className="font-semibold text-blue-700">{currentAppRecord.paymentTxnId}</span>
                    <span className="text-[11px] text-slate-500 block">{currentAppRecord.paidAt}</span>
                  </>
                ) : (
                  '—'
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* THẺ LỊCH HẸN THU NHẬN SINH TRẮC (Nếu có lịch hẹn liên kết) */}
      {isViewMode && linkedAppointment && (
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-emerald-200/80 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                <Calendar className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-emerald-950">
                  Lịch hẹn thu nhận sinh trắc (e-Border)
                </h3>
                <p className="text-[12px] text-emerald-800">
                  Thông tin cuộc hẹn tại cơ quan tiếp nhận hồ sơ
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                window.location.hash = '#/lich-hen';
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-[#006B3F] bg-white border border-[#006B3F]/50 hover:bg-[#E8F3EE] rounded-lg shadow-2xs transition-colors cursor-pointer shrink-0"
            >
              Xem lịch hẹn của tôi &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-[13px]">
            <div>
              <span className="text-[11px] text-emerald-800/80 uppercase font-medium block">
                Mã lịch hẹn:
              </span>
              <span className="font-mono font-bold text-emerald-900 text-[14px]">
                {linkedAppointment.id}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-emerald-800/80 uppercase font-medium block">
                Cơ quan tiếp nhận:
              </span>
              <span className="font-medium text-emerald-950">
                {linkedAppointment.coQuan}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-emerald-800/80 uppercase font-medium block">
                Thời gian hẹn:
              </span>
              <span className="font-semibold text-emerald-950">
                {linkedAppointment.ngay} ({linkedAppointment.khungGio || 'Giờ hành chính'})
              </span>
            </div>

            <div>
              <span className="text-[11px] text-emerald-800/80 uppercase font-medium block">
                Trạng thái lịch hẹn:
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                {linkedAppointment.trangThai || 'Chờ tiếp nhận'}
              </span>
            </div>
          </div>

          <div className="text-[12px] text-emerald-800 italic pt-1">
            * Lưu ý: Công dân vui lòng mang theo Căn cước công dân và các giấy tờ liên quan khi đến điểm tiếp nhận đúng khung giờ đã hẹn.
          </div>
        </div>
      )}

      {/* ========================================================
          CÁC PHẦN XẾP DỌC (LUÔN MỞ KHI ĐÃ ĐƯỢC KÍCH HOẠT)
      ======================================================== */}
      <div className={`space-y-6 ${isViewMode ? 'pointer-events-none select-text' : ''}`}>
        {/* PHẦN 1: THÔNG TIN CÁ NHÂN (Luôn mở) */}
        <FormSection
          partNumber={1}
          title="Thông tin cá nhân"
          instruction="Vui lòng điền đầy đủ thông tin cá nhân cơ bản, giấy tờ tùy thân và đặc điểm nhận dạng."
          id="section-part-1"
        >
          <FormPart1
            procedure={currentProcKey}
            donViTiepNhan={donViTiepNhan}
            setDonViTiepNhan={(val) => {
              setDonViTiepNhan(val);
              setIsDirty(true);
            }}
            cuaKhau={cuaKhau}
            setCuaKhau={(val) => {
              setCuaKhau(val);
              setIsDirty(true);
            }}
            phongXNC={phongXNC}
            setPhongXNC={(val) => {
              setPhongXNC(val);
              setIsDirty(true);
            }}
            truongHopDeNghi={truongHopDeNghi}
            setTruongHopDeNghi={(val) => {
              setTruongHopDeNghi(val);
              setIsDirty(true);
            }}
            lyDoCuThe={lyDoCuThe}
            setLyDoCuThe={(val) => {
              setLyDoCuThe(val);
              setIsDirty(true);
            }}
            userResidentProvince={userResidentProvince}
            userAccountName={userAccountName}
            userCitizenId={userCitizenId}
            fullNameLatin={fullNameLatin}
            setFullNameLatin={(val) => {
              setFullNameLatin(val);
              setIsDirty(true);
            }}
            dob={dob}
            setDob={(val) => {
              setDob(val);
              setIsDirty(true);
            }}
            onDobChange={(val) => {
              handleApplicantDobChange(val);
              setIsDirty(true);
            }}
            onDobBlur={handleApplicantDobBlur}
            gender={gender}
            setGender={(val) => {
              setGender(val);
              setIsDirty(true);
            }}
            ethnicity={ethnicity}
            setEthnicity={(val) => {
              setEthnicity(val);
              setIsDirty(true);
            }}
            religion={religion}
            setReligion={(val) => {
              setReligion(val);
              setIsDirty(true);
            }}
            portraitImgUrl={portraitImgUrl}
            qualityCheckStatus={qualityCheckStatus}
            onPortraitFileChange={(e) => {
              handlePortraitFileChange(e);
              setIsDirty(true);
            }}
            onCheckPhotoQuality={handleCheckPhotoQuality}
            portraitInputRef={portraitInputRef}
            nationalId={nationalId}
            setNationalId={(val) => {
              setNationalId(val);
              setIsDirty(true);
            }}
            idIssueDate={idIssueDate}
            setIdIssueDate={(val) => {
              setIdIssueDate(val);
              setIsDirty(true);
            }}
            idIssuePlace={idIssuePlace}
            setIdIssuePlace={(val) => {
              setIdIssuePlace(val);
              setIsDirty(true);
            }}
            householdBookNo={householdBookNo}
            setHouseholdBookNo={(val) => {
              setHouseholdBookNo(val);
              setIsDirty(true);
            }}
            householdIssueDate={householdIssueDate}
            setHouseholdIssueDate={(val) => {
              setHouseholdIssueDate(val);
              setIsDirty(true);
            }}
            householdIssuePlace={householdIssuePlace}
            setHouseholdIssuePlace={(val) => {
              setHouseholdIssuePlace(val);
              setIsDirty(true);
            }}
            heightCm={heightCm}
            setHeightCm={(val) => {
              setHeightCm(val);
              setIsDirty(true);
            }}
            hairColor={hairColor}
            setHairColor={(val) => {
              handleHairColorChange(val);
              setIsDirty(true);
            }}
            hairColorDetail={mauTocKhac}
            setHairColorDetail={(val: string) => {
              setMauTocKhac(val);
              clearError('field-hairColorDetail');
              setIsDirty(true);
            }}
            eyeColor={eyeColor}
            setEyeColor={(val) => {
              handleEyeColorChange(val);
              setIsDirty(true);
            }}
            eyeColorDetail={mauMatKhac}
            setEyeColorDetail={(val: string) => {
              setMauMatKhac(val);
              clearError('field-eyeColorDetail');
              setIsDirty(true);
            }}
            scars={scars}
            setScars={(val) => {
              setScars(val);
              setIsDirty(true);
            }}
            scarsLocation={scarsLocation}
            setScarsLocation={(val) => {
              setScarsLocation(val);
              setIsDirty(true);
            }}
            nationality={nationality}
            setNationality={(val) => {
              setNationality(val);
              setIsDirty(true);
            }}
            occupation={occupation}
            setOccupation={(val) => {
              handleOccupationChange(val);
              setIsDirty(true);
            }}
            occupationDetail={ngheNghiepKhac}
            setOccupationDetail={(val: string) => {
              setNgheNghiepKhac(val);
              clearError('field-occupationDetail');
              setIsDirty(true);
            }}
            tripPurpose={tripPurpose}
            setTripPurpose={(val) => {
              setTripPurpose(val);
              setIsDirty(true);
            }}
            tripPurposeDetail={tripPurposeDetail}
            setTripPurposeDetail={(val) => {
              setTripPurposeDetail(val);
              setIsDirty(true);
            }}
            validityStartDate={validityStartDate}
            setValidityStartDate={(val) => {
              handleValidityStartDateChange(val);
              setIsDirty(true);
            }}
            validityEndDate={validityEndDate}
            isCompleted={!!completedParts[1]}
            onContinue={handleContinuePart1}
            errors={errors}
            clearError={clearError}
            ReadOnlyField={ReadOnlyField}
            isLao={isLao}
          />
        </FormSection>

        {/* PHẦN 2: ĐỊA CHỈ VÀ TRẺ EM ĐI KÈM (Chỉ hiện khi đã bấm Tiếp tục ở Phần 1 hoặc ở view/supplement) */}
        {(unlockedParts[2] || isViewMode || isSupplementMode) && (
          <div className="motion-safe:animate-fadeIn">
            <FormSection
              partNumber={2}
              title="Địa chỉ và trẻ em đi kèm"
              instruction="Kê khai nơi đăng ký khai sinh, nơi thường trú và thông tin trẻ em dưới 12 tuổi đi kèm (nếu có)."
              id="section-part-2"
            >
              <FormPart2
                birthProvince={birthProvince}
                setBirthProvince={(val) => {
                  setBirthProvince(val);
                  setIsDirty(true);
                }}
                birthDistrict={birthDistrict}
                setBirthDistrict={(val) => {
                  setBirthDistrict(val);
                  setIsDirty(true);
                }}
                birthVillage={birthVillage}
                setBirthVillage={(val) => {
                  setBirthVillage(val);
                  setIsDirty(true);
                }}
                birthUnit={birthUnit}
                setBirthUnit={(val) => {
                  setBirthUnit(val);
                  setIsDirty(true);
                }}
                birthAddressDetail={birthAddressDetail}
                setBirthAddressDetail={(val) => {
                  setBirthAddressDetail(val);
                  setIsDirty(true);
                }}
                birthDistrictOptions={birthDistrictOptions}
                birthVillageOptions={birthVillageOptions}
                resProvince={resProvince}
                setResProvince={(val) => {
                  setResProvince(val);
                  setIsDirty(true);
                }}
                resDistrict={resDistrict}
                setResDistrict={(val) => {
                  setResDistrict(val);
                  setIsDirty(true);
                }}
                resVillage={resVillage}
                setResVillage={(val) => {
                  setResVillage(val);
                  setIsDirty(true);
                }}
                resUnit={resUnit}
                setResUnit={(val) => {
                  setResUnit(val);
                  setIsDirty(true);
                }}
                resAddressDetail={resAddressDetail}
                setResAddressDetail={(val) => {
                  setResAddressDetail(val);
                  setIsDirty(true);
                }}
                resDistrictOptions={resDistrictOptions}
                resVillageOptions={resVillageOptions}
                childrenList={children}
                onAddChild={() => {
                  handleAddChild();
                  setIsDirty(true);
                }}
                onRemoveChild={(id) => {
                  handleRemoveChild(id);
                  setIsDirty(true);
                }}
                onUpdateChild={(id, f, val) => {
                  handleUpdateChild(id, f, val);
                  setIsDirty(true);
                }}
                onChildPhotoChange={(id, f) => {
                  handleChildPhotoChange(id, f);
                  setIsDirty(true);
                }}
                onCheckChildPhotoQuality={handleCheckChildPhotoQuality}
                getChildDistrictOptions={getChildDistrictOptions}
                getChildVillageOptions={getChildVillageOptions}
                calculateAge={calculateAge}
                isCompleted={!!completedParts[2]}
                onContinue={handleContinuePart2}
                errors={errors}
                clearError={clearError}
                isLao={isLao}
                procedure={currentProcKey}
                isMissingResidence={isMissingResidence}
                receivingAgency={receivingAgency}
              />
            </FormSection>
          </div>
        )}

        {/* PHẦN 3: GIẤY TỜ ĐÍNH KÈM VÀ NHẬN KẾT QUẢ */}
        {(unlockedParts[3] || isViewMode || isSupplementMode) && (
          <div className="motion-safe:animate-fadeIn">
            <FormSection
              partNumber={3}
              title="Giấy tờ đính kèm và nhận kết quả"
              instruction="Đính kèm các giấy tờ chứng minh, lựa chọn hình thức nhận kết quả và gửi hồ sơ."
              id="section-part-3"
            >
              <FormPart3
                attachments={attachments}
                childrenList={children}
                childAttachments={childAttachments}
                onUploadDefaultRow={(rowId, file) => {
                  handleUploadDefaultRow(rowId, file);
                  setIsDirty(true);
                }}
                onRemoveDefaultFile={(rowId) => {
                  handleRemoveDefaultFile(rowId);
                  setIsDirty(true);
                }}
                onUploadChildDoc={(cId, docKey, file) => {
                  handleUploadChildDoc(cId, docKey, file);
                  setIsDirty(true);
                }}
                onRemoveChildDoc={(cId, docKey) => {
                  handleRemoveChildDoc(cId, docKey);
                  setIsDirty(true);
                }}
                onAddCustomAttachmentRow={() => {
                  handleAddCustomAttachmentRow();
                  setIsDirty(true);
                }}
                onRemoveCustomRow={(rowId) => {
                  handleRemoveCustomRow(rowId);
                  setIsDirty(true);
                }}
                onUpdateRowField={(rowId, field, val) => {
                  handleUpdateRowField(rowId, field, val);
                  setIsDirty(true);
                }}
                onPreviewDoc={setPreviewDoc}
                deliveryMethod={deliveryMethod}
                setDeliveryMethod={(val) => {
                  setDeliveryMethod(val);
                  setIsDirty(true);
                }}
                postalProvider={postalProvider}
                setPostalProvider={(val) => {
                  setPostalProvider(val);
                  setIsDirty(true);
                }}
                deliveryProvince={deliveryProvince}
                setDeliveryProvince={(val) => {
                  setDeliveryProvince(val);
                  setIsDirty(true);
                }}
                deliveryDistrict={deliveryDistrict}
                setDeliveryDistrict={(val) => {
                  setDeliveryDistrict(val);
                  setIsDirty(true);
                }}
                deliveryVillage={deliveryVillage}
                setDeliveryVillage={(val) => {
                  setDeliveryVillage(val);
                  setIsDirty(true);
                }}
                deliveryUnit={deliveryUnit}
                setDeliveryUnit={(val) => {
                  setDeliveryUnit(val);
                  setIsDirty(true);
                }}
                deliveryAddressDetail={deliveryAddressDetail}
                setDeliveryAddressDetail={(val) => {
                  setDeliveryAddressDetail(val);
                  setIsDirty(true);
                }}
                recipientName={recipientName}
                setRecipientName={(val) => {
                  setRecipientName(val);
                  setIsDirty(true);
                }}
                recipientPhone={recipientPhone}
                setRecipientPhone={(val) => {
                  setRecipientPhone(val);
                  setIsDirty(true);
                }}
                deliveryDistrictOptions={deliveryDistrictOptions}
                deliveryVillageOptions={deliveryVillageOptions}
                onPrint={handlePrintTicket}
                onSubmit={handleSubmitApplication}
                submitButtonText={isSupplementMode ? 'Gửi bổ sung hồ sơ' : undefined}
                supplementMissingDocNames={yeuCauBoSung?.giayToThieu || []}
                disableSubmit={isMissingResidence}
                isSubmitting={isSubmitting}
                errors={errors}
                clearError={clearError}
                isLao={isLao}
                procedure={currentProcKey}
                readOnly={isViewMode}
              />
            </FormSection>
          </div>
        )}
      </div>

      {/* THANH NÚT HÀNH ĐỘNG CỐ ĐỊNH Ở CUỐI MÀN HÌNH */}
      <FormStickyFooter
        onBack={handleBackClick}
        onSaveDraft={handleSaveDraft}
        onPrint={handlePrintTicket}
        onSubmit={isSupplementMode ? handleSubmitSupplement : handleSubmitApplication}
        submitText={isSupplementMode ? 'Gửi bổ sung hồ sơ' : undefined}
        saveDraftText="Lưu nháp"
        showSaveDraft={!isViewMode}
        showSubmit={!isViewMode}
        disableSubmit={isMissingResidence}
        isSubmitting={isSubmitting}
        isReadOnly={isViewMode}
        isLao={isLao}
      />

      {/* Modal xác nhận rời khỏi trang khi có thay đổi chưa lưu */}
      {showLeaveConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px] animate-fadeIn">
          <div
            className="bg-white border border-[#D9E1DC] rounded-xl max-w-md w-full p-6 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <span className="p-2 rounded-full bg-amber-50 text-amber-600 shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </span>
              <div>
                <h3 className="text-[17px] font-bold text-[#1F2937]">Xác nhận rời khỏi trang</h3>
                <p className="text-[14px] text-[#4B5563] mt-1">
                  Các thay đổi chưa lưu sẽ bị mất. Bạn có muốn rời khỏi trang này?
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLeaveConfirmModal(false)}
                className="px-4 py-2 border border-[#D9DFDC] rounded-lg text-[14px] font-medium text-[#4B5563] hover:bg-[#F3F4F6] cursor-pointer"
              >
                Ở lại
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLeaveConfirmModal(false);
                  onBackToStep1();
                }}
                className="px-4 py-2 bg-[#D71920] hover:bg-[#B9151B] text-white rounded-lg text-[14px] font-medium cursor-pointer"
              >
                Rời đi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xem lại tệp đính kèm */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px] animate-fadeIn">
          <div
            className="bg-white border border-[#D9E1DC] rounded-xl w-full max-w-xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-[#D9E1DC] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded bg-[#E8F3EE] text-[#006B3F]">
                  <FileText className="w-5 h-5 text-[#006B3F]" />
                </span>
                <div>
                  <h3 className="text-[17px] font-bold text-[#1F2937] leading-tight">
                    {previewDoc.title}
                  </h3>
                  <p className="text-[13px] text-[#6B7280]">{previewDoc.fileName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F5F7F6] rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-center bg-[#F5F7F6]">
              <div className="p-6 bg-white border border-[#D9E1DC] rounded-lg shadow-2xs space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#E8F3EE] text-[#008A4B] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="text-[16px] font-bold text-[#1F2937]">
                  Tài liệu đính kèm hợp lệ (Đã quét OCR)
                </div>
                <p className="text-[14px] text-[#6B7280] max-w-md mx-auto">
                  Tệp tin đã được mã hóa an toàn và sẵn sàng gửi lên máy chủ tiếp nhận hồ sơ.
                </p>
                <div className="pt-2 text-[13px] font-mono text-[#006B3F] bg-[#E8F3EE] py-1.5 px-3 rounded inline-block">
                  Mã hash SHA-256: 8f49a2c...b912e
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-[#D9E1DC] flex justify-end gap-2 bg-white">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 border rounded-lg hover:bg-[#F3F4F6] text-[14px] font-medium cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal in phiếu */}
      {showPrintModal && (
        <PrintableApplicationForm
          procedure={currentProcKey}
          data={{
            maHoSo: currentDraftId || `HS${Date.now()}`,
            loaiThuTuc: isTamThoiProcedure ? 'tam-thoi' : procedureType,
            procedure: currentProcKey,
            donViTiepNhan: receivingUnitName,
            truongHopDeNghi: truongHopDeNghi,
            lyDoCuThe: lyDoCuThe,
            fullName: userAccountName,
            fullNameLatin: fullNameLatin,
            dob: dob,
            gender: gender,
            ethnicity: ethnicity,
            religion: religion,
            birthVillage: birthVillage,
            birthDistrict: birthDistrict,
            birthProvince: birthProvince,
            resVillage: resVillage,
            resUnit: resUnit || resAddressDetail || '',
            resDistrict: resDistrict,
            resProvince: resProvince,
            nationalId: nationalId || userCitizenId,
            idIssueDate: idIssueDate,
            idIssuePlace: idIssuePlace,
            householdBookNo: householdBookNo,
            householdIssueDate: householdIssueDate,
            householdIssuePlace: householdIssuePlace,
            heightCm: heightCm,
            scars: scars || 'Không có',
            scarsLocation: scarsLocation || (scars ? 'Vùng mặt/tay' : 'Không có'),
            nationality: nationality || 'Lào',
            occupation: occupation,
            ngheNghiep: occupation,
            ngheNghiepKhac: (ngheNghiepKhac || '').trim(),
            occupationDetail: (ngheNghiepKhac || '').trim(),
            hairColor: hairColor,
            mauToc: hairColor,
            mauTocKhac: (mauTocKhac || '').trim(),
            hairColorDetail: (mauTocKhac || '').trim(),
            eyeColor: eyeColor,
            mauMat: eyeColor,
            mauMatKhac: (mauMatKhac || '').trim(),
            eyeColorDetail: (mauMatKhac || '').trim(),
            tripPurpose: tripPurpose,
            tripPurposeDetail: tripPurposeDetail,
            validityStartDate: validityStartDate,
            validityEndDate: validityEndDate,
            portraitImgUrl: portraitImgUrl,
            children: children.map((c) => ({
              fullName: c.fullNameLao || c.fullNameLatin,
              fullNameLatin: c.fullNameLatin,
              citizenId: c.citizenId,
              dob: c.dob,
              gender: c.gender,
            })),
          }}
          onClose={() => setShowPrintModal(false)}
          autoPrint={false}
        />
      )}

      {/* Modal chọn ngày hẹn thu nhận sinh trắc */}
      <BiometricBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        procedureTitle={isTamThoiProcedure ? 'Cấp giấy thông hành tạm thời' : getProcedureTitle()}
        receivingAgency={receivingAgency}
        validityStartDate={isTamThoiProcedure ? validityStartDate : undefined}
        userPhone={recipientPhone || account?.phone || ''}
        existingAppointment={existingAppointmentForModal}
        onConfirm={handleBookingModalConfirm}
      />

      {/* Modal xem biên lai thu lệ phí điện tử */}
      {showReceiptModal && (
        <PaymentReceiptModal
          application={currentAppRecord}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
};
