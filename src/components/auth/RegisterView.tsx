import React, { useState, useRef, useMemo } from 'react';
import { Eye, EyeOff, CheckCircle2, User, Phone, Mail, MapPin, Lock, ArrowRight } from 'lucide-react';
import { OtpVerificationStep } from './OtpVerificationStep';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { SimulatedOtpNotification } from './SimulatedOtpToast';
import { AdminUnitCombobox } from '../portal/AdminUnitCombobox';
import {
  LAO_PROVINCES,
  LAO_DISTRICTS_BY_PROVINCE,
  LAO_VILLAGES_BY_DISTRICT,
  LAO_UNITS_SAMPLE,
} from '../portal/laoAdminData';
import {
  checkAccountDuplicates,
  registerNewAccount,
  EbAccount,
} from '../../utils/ebAuthStorage';

interface RegisterViewProps {
  onNavigateLogin: (prefilledId?: string) => void;
  onSendSimulatedOtp: (notification: SimulatedOtpNotification) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  onNavigateLogin,
  onSendSimulatedOtp,
}) => {
  // Thanh bước 3 bước
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State - Bước 1
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'' | 'Nam' | 'Nữ'>('');

  // Nơi thường trú (không bắt buộc) - 5 cấp: Tỉnh/Thành phố, Quận/Huyện, Bản, Đơn vị dưới bản, Địa chỉ chi tiết
  const [resProvince, setResProvince] = useState('');
  const [resDistrict, setResDistrict] = useState('');
  const [resVillage, setResVillage] = useState('');
  const [resUnit, setResUnit] = useState('');
  const [resAddressDetail, setResAddressDetail] = useState('');

  // Gợi ý danh mục quận/huyện và bản theo cấp trên
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

  // Kênh nhận OTP
  const [contactChannel, setContactChannel] = useState<'sms' | 'email'>('sms');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Mật khẩu
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Điều khoản
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmittingStep1, setIsSubmittingStep1] = useState(false);

  // Dữ liệu OTP sinh ra
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [maskedDestination, setMaskedDestination] = useState<string>('');

  // Dữ liệu tài khoản vừa tạo thành công (Bước 3)
  const [createdAccount, setCreatedAccount] = useState<EbAccount | null>(null);

  // Refs để cuộn tới ô lỗi đầu tiên
  const fullNameRef = useRef<HTMLInputElement>(null);
  const idNumberRef = useRef<HTMLInputElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);
  const residenceRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);

  // Tạo mã ngẫu nhiên 6 chữ số
  const generateRandomOtpCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Che số điện thoại hoặc email
  const maskPhone = (raw: string) => {
    const clean = raw.trim();
    if (clean.length < 7) return clean;
    return `${clean.slice(0, 3)} ***** ${clean.slice(-3)}`;
  };

  const maskEmail = (raw: string) => {
    const clean = raw.trim();
    const [name, domain] = clean.split('@');
    if (!domain) return clean;
    const maskedName = name.length <= 2 ? `${name}*` : `${name.slice(0, 2)}***`;
    return `${maskedName}@${domain}`;
  };

  // Validate ô đơn lẻ khi blur
  const validateField = (field: string) => {
    const nextErrors = { ...errors };

    if (field === 'fullName') {
      if (!fullName.trim() || fullName.trim().length < 2) {
        nextErrors.fullName = 'Họ và tên bắt buộc (tối thiểu 2 ký tự).';
      } else {
        delete nextErrors.fullName;
      }
    }

    if (field === 'idNumber') {
      const clean = idNumber.replace(/\D/g, '');
      if (!clean) {
        nextErrors.idNumber = 'Số định danh là bắt buộc.';
      } else if (clean.length !== 13) {
        nextErrors.idNumber = 'Số định danh phải gồm đúng 13 chữ số.';
      } else {
        delete nextErrors.idNumber;
      }
    }

    if (field === 'dob') {
      if (!dob) {
        nextErrors.dob = 'Vui lòng chọn ngày, tháng, năm sinh.';
      } else {
        const today = new Date().toISOString().split('T')[0];
        if (dob > today) {
          nextErrors.dob = 'Ngày sinh không được lớn hơn ngày hiện tại.';
        } else {
          delete nextErrors.dob;
        }
      }
    }

    if (field === 'gender') {
      if (!gender) {
        nextErrors.gender = 'Vui lòng chọn giới tính.';
      } else {
        delete nextErrors.gender;
      }
    }

    if (field === 'contact') {
      if (contactChannel === 'sms') {
        const cleanPhone = phone.trim().replace(/\s+/g, '');
        // Cho phép +856 hoặc 0, độ dài 9-11 chữ số
        const phoneRegex = /^(\+?856|0)[0-9]{8,10}$/;
        if (!cleanPhone) {
          nextErrors.phone = 'Vui lòng nhập số điện thoại.';
        } else if (!phoneRegex.test(cleanPhone)) {
          nextErrors.phone = 'Số điện thoại không hợp lệ (9–11 chữ số, tiền tố +856 hoặc 0).';
        } else {
          delete nextErrors.phone;
        }
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
          nextErrors.email = 'Vui lòng nhập địa chỉ email.';
        } else if (!emailRegex.test(email.trim())) {
          nextErrors.email = 'Email không đúng định dạng.';
        } else {
          delete nextErrors.email;
        }
      }
    }

    if (field === 'password') {
      const cleanId = idNumber.replace(/\D/g, '');
      const hasMinLength = password.length >= 8;
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const isDuplicateId = cleanId.length > 0 && password.includes(cleanId);

      if (!password) {
        nextErrors.password = 'Vui lòng nhập mật khẩu.';
      } else if (!hasMinLength || !hasUpper || !hasLower || !hasNumber) {
        nextErrors.password = 'Mật khẩu phải từ 8 ký tự, gồm chữ hoa, chữ thường và chữ số.';
      } else if (isDuplicateId) {
        nextErrors.password = 'Mật khẩu không được trùng hoặc chứa số định danh.';
      } else {
        delete nextErrors.password;
      }
    }

    if (field === 'confirmPassword') {
      if (!confirmPassword) {
        nextErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu.';
      } else if (confirmPassword !== password) {
        nextErrors.confirmPassword = 'Mật khẩu nhập lại không khớp.';
      } else {
        delete nextErrors.confirmPassword;
      }
    }

    setErrors(nextErrors);
  };

  // Xử lý gửi Form Bước 1
  const handleProceedStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingStep1(true);

    const newErrors: Record<string, string> = {};

    // 1. Họ tên
    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = 'Họ và tên bắt buộc (tối thiểu 2 ký tự).';
    }

    // 2. Số định danh
    const cleanId = idNumber.replace(/\D/g, '');
    if (!cleanId) {
      newErrors.idNumber = 'Số định danh là bắt buộc.';
    } else if (cleanId.length !== 13) {
      newErrors.idNumber = 'Số định danh phải gồm đúng 13 chữ số.';
    }

    // Ngày sinh (bắt buộc, date picker dd/mm/yyyy, không được lớn hơn ngày hiện tại)
    if (!dob) {
      newErrors.dob = 'Vui lòng chọn ngày, tháng, năm sinh.';
    } else {
      const today = new Date().toISOString().split('T')[0];
      if (dob > today) {
        newErrors.dob = 'Ngày sinh không được lớn hơn ngày hiện tại.';
      }
    }

    // Giới tính (bắt buộc, lỗi đỏ: "Vui lòng chọn giới tính")
    if (!gender) {
      newErrors.gender = 'Vui lòng chọn giới tính.';
    }

    // 3. Liên hệ nhận mã OTP
    if (contactChannel === 'sms') {
      const cleanPhone = phone.trim().replace(/\s+/g, '');
      const phoneRegex = /^(\+?856|0)[0-9]{8,10}$/;
      if (!cleanPhone) {
        newErrors.phone = 'Vui lòng nhập số điện thoại.';
      } else if (!phoneRegex.test(cleanPhone)) {
        newErrors.phone = 'Số điện thoại không hợp lệ (9–11 chữ số, tiền tố +856 hoặc 0).';
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim()) {
        newErrors.email = 'Vui lòng nhập địa chỉ email.';
      } else if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Email không đúng định dạng.';
      }
    }

    // 4. Mật khẩu
    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isDuplicateId = cleanId.length > 0 && password.includes(cleanId);

    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu.';
    } else if (!hasMinLength || !hasUpper || !hasLower || !hasNumber) {
      newErrors.password = 'Mật khẩu phải từ 8 ký tự, gồm chữ hoa, chữ thường và chữ số.';
    } else if (isDuplicateId) {
      newErrors.password = 'Mật khẩu không được trùng hoặc chứa số định danh.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu.';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Mật khẩu nhập lại không khớp.';
    }

    // 5. Điều khoản
    if (!agreedTerms) {
      newErrors.terms = 'Bạn cần đồng ý với Điều khoản sử dụng và Chính sách bảo mật.';
    }

    // Kiểm tra trùng lặp trong cơ sở dữ liệu localStorage
    if (!newErrors.idNumber || !newErrors.phone || !newErrors.email) {
      const { idDuplicate, contactDuplicate } = checkAccountDuplicates(
        cleanId,
        contactChannel,
        phone,
        email
      );
      if (idDuplicate) {
        newErrors.idNumber = 'Số định danh này đã đăng ký. Đăng nhập hoặc Quên mật khẩu';
      }
      if (contactDuplicate) {
        if (contactChannel === 'sms') {
          newErrors.phone = 'Số điện thoại này đã được sử dụng cho tài khoản khác.';
        } else {
          newErrors.email = 'Email này đã được sử dụng cho tài khoản khác.';
        }
      }
    }

    setErrors(newErrors);
    setIsSubmittingStep1(false);

    // Cuộn tới ô lỗi đầu tiên nếu có
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.fullName) fullNameRef.current?.focus();
      else if (newErrors.idNumber) idNumberRef.current?.focus();
      else if (newErrors.dob) dobRef.current?.focus();
      else if (newErrors.gender) {
        document.getElementById('register-field-gender')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      else if (newErrors.phone) phoneRef.current?.focus();
      else if (newErrors.email) emailRef.current?.focus();
      else if (newErrors.password) passwordRef.current?.focus();
      else if (newErrors.confirmPassword) confirmPasswordRef.current?.focus();
      else if (newErrors.terms) termsRef.current?.focus();
      return;
    }

    // Nếu hợp lệ: Sinh mã OTP và chuyển sang Bước 2
    const code = generateRandomOtpCode();
    setGeneratedOtp(code);

    const dest =
      contactChannel === 'sms' ? maskPhone(phone) : maskEmail(email);
    setMaskedDestination(dest);

    // Bắn thông báo giả lập OTP lên màn hình
    onSendSimulatedOtp({
      id: `otp_${Date.now()}`,
      channel: contactChannel,
      recipient: dest,
      code,
    });

    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xử lý gửi lại OTP từ Bước 2
  const handleResendOtp = (): string => {
    const newCode = generateRandomOtpCode();
    setGeneratedOtp(newCode);

    onSendSimulatedOtp({
      id: `otp_${Date.now()}`,
      channel: contactChannel,
      recipient: maskedDestination,
      code: newCode,
    });

    return newCode;
  };

  // Xử lý khi xác thực OTP thành công ở Bước 2
  const handleOtpVerifiedSuccess = async () => {
    // CHỈ KHI nhập đúng mã OTP mới tạo tài khoản và lưu vào localStorage
    const hasAnyResidence =
      resProvince.trim() ||
      resDistrict.trim() ||
      resVillage.trim() ||
      resUnit.trim() ||
      resAddressDetail.trim();

    const residenceData = hasAnyResidence
      ? {
          province: resProvince.trim(),
          district: resDistrict.trim(),
          village: resVillage.trim(),
          subUnit: resUnit.trim(),
          detail: resAddressDetail.trim(),
        }
      : null;

    const newAcc = await registerNewAccount({
      fullName,
      idNumber,
      dob: dob || undefined,
      dateOfBirth: dob || undefined,
      gender: gender || undefined,
      residence: residenceData,
      contactChannel,
      phone: contactChannel === 'sms' ? phone : undefined,
      email: contactChannel === 'email' ? email : undefined,
      passwordPlain: password,
    });

    setCreatedAccount(newAcc);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-[560px] mx-auto animate-fadeIn">
      {/* Khối Card chính */}
      <div className="bg-white border border-[#D9DFDC] rounded-[12px] p-6 sm:p-8 shadow-sm">
        {/* Thanh bước 3 bước */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {/* Đường nối giữa các bước */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-[#D9DFDC] z-0" />
            <div
              className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-[#006B3F] z-0 transition-all duration-300"
              style={{
                width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
              }}
            />

            {/* Bước 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-colors ${
                  currentStep >= 1
                    ? 'bg-[#006B3F] text-white'
                    : 'bg-[#F5F7F6] text-[#5F6B66] border border-[#D9DFDC]'
                }`}
              >
                1
              </div>
              <span
                className={`text-[12px] mt-1 font-medium ${
                  currentStep === 1 ? 'text-[#006B3F] font-semibold' : 'text-[#5F6B66]'
                }`}
              >
                Thông tin
              </span>
            </div>

            {/* Bước 2 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-colors ${
                  currentStep >= 2
                    ? 'bg-[#006B3F] text-white'
                    : 'bg-[#F5F7F6] text-[#5F6B66] border border-[#D9DFDC]'
                }`}
              >
                2
              </div>
              <span
                className={`text-[12px] mt-1 font-medium ${
                  currentStep === 2 ? 'text-[#006B3F] font-semibold' : 'text-[#5F6B66]'
                }`}
              >
                Xác thực OTP
              </span>
            </div>

            {/* Bước 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-colors ${
                  currentStep === 3
                    ? 'bg-[#006B3F] text-white'
                    : 'bg-[#F5F7F6] text-[#5F6B66] border border-[#D9DFDC]'
                }`}
              >
                3
              </div>
              <span
                className={`text-[12px] mt-1 font-medium ${
                  currentStep === 3 ? 'text-[#006B3F] font-semibold' : 'text-[#5F6B66]'
                }`}
              >
                Hoàn tất
              </span>
            </div>
          </div>
        </div>

        {/* BƯỚC 1 – FORM THÔNG TIN */}
        {currentStep === 1 && (
          <form onSubmit={handleProceedStep1} noValidate className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-[22px] font-bold text-[#1A2421]">Đăng ký tài khoản</h2>
              <p className="text-[13px] text-[#5F6B66]">
                Tạo tài khoản Cổng Dịch vụ công cấp giấy thông hành
              </p>
            </div>

            {/* 1. Khối "Thông tin người đăng ký" */}
            <div className="space-y-4 pt-2">
              <div className="text-[13px] font-bold text-[#006B3F] uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-[#D9DFDC]/60">
                <User className="w-4 h-4 text-[#006B3F]" />
                <span>Thông tin người đăng ký</span>
              </div>

              {/* Họ và tên */}
              <div className="space-y-1">
                <label className="text-[13px] font-medium text-[#1A2421] block">
                  Họ và tên <span className="text-[#C62828] font-bold">*</span>
                </label>
                <input
                  ref={fullNameRef}
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) {
                      const next = { ...errors };
                      delete next.fullName;
                      setErrors(next);
                    }
                  }}
                  onBlur={() => validateField('fullName')}
                  placeholder="Ví dụ: Somchai Keovongsa"
                  className={`w-full h-[44px] px-3.5 text-[14px] text-[#1A2421] bg-white border rounded-[8px] outline-none transition-all
                    ${
                      errors.fullName
                        ? 'border-[#C62828] focus:ring-2 focus:ring-[#C62828]/20'
                        : 'border-[#D9DFDC] focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/15'
                    }
                  `}
                />
                {errors.fullName && (
                  <p className="text-[12px] text-[#C62828] font-medium">{errors.fullName}</p>
                )}
              </div>

              {/* Số định danh */}
              <div className="space-y-1">
                <label className="text-[13px] font-medium text-[#1A2421] block">
                  Số định danh <span className="text-[#C62828] font-bold">*</span>
                </label>
                <input
                  ref={idNumberRef}
                  type="text"
                  value={idNumber}
                  onChange={(e) => {
                    // Chỉ cho nhập chữ số, tự loại bỏ ký tự khác
                    const digitsOnly = e.target.value.replace(/\D/g, '');
                    setIdNumber(digitsOnly);
                    if (errors.idNumber) {
                      const next = { ...errors };
                      delete next.idNumber;
                      setErrors(next);
                    }
                  }}
                  onBlur={() => validateField('idNumber')}
                  placeholder="Nhập đúng 13 chữ số"
                  maxLength={13}
                  className={`w-full h-[44px] px-3.5 text-[14px] text-[#1A2421] font-mono bg-white border rounded-[8px] outline-none transition-all
                    ${
                      errors.idNumber
                        ? 'border-[#C62828] focus:ring-2 focus:ring-[#C62828]/20'
                        : 'border-[#D9DFDC] focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/15'
                    }
                  `}
                />
                <p className="text-[11px] text-[#5F6B66]">Số này dùng làm tên đăng nhập</p>
                {errors.idNumber && (
                  <p className="text-[12px] text-[#C62828] font-medium">{errors.idNumber}</p>
                )}
              </div>

              {/* Ngày, tháng, năm sinh (date picker, bắt buộc, <= today) */}
              <div className="space-y-1">
                <label className="text-[13px] font-medium text-[#1A2421] block">
                  Ngày, tháng, năm sinh <span className="text-[#C62828] font-bold">*</span>
                </label>
                <input
                  ref={dobRef}
                  type="date"
                  value={dob}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    setDob(e.target.value);
                    if (errors.dob) {
                      const next = { ...errors };
                      delete next.dob;
                      setErrors(next);
                    }
                  }}
                  onBlur={() => validateField('dob')}
                  className={`w-full h-[44px] px-3.5 text-[14px] text-[#1A2421] bg-white border rounded-[8px] outline-none transition-all
                    ${
                      errors.dob
                        ? 'border-[#C62828] focus:ring-2 focus:ring-[#C62828]/20'
                        : 'border-[#D9DFDC] focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/15'
                    }
                  `}
                />
                {errors.dob && (
                  <p className="text-[12px] text-[#C62828] font-medium">{errors.dob}</p>
                )}
              </div>

              {/* Giới tính (bắt buộc, đặt ngay dưới Ngày sinh) */}
              <div className="space-y-1.5" id="register-field-gender">
                <label className="text-[13px] font-medium text-[#1A2421] block">
                  Giới tính <span className="text-[#C62828] font-bold">*</span>
                </label>
                <div className="flex items-center gap-6 pt-1">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-[14px] text-[#1A2421]">
                    <input
                      type="radio"
                      name="register_gender"
                      value="Nam"
                      checked={gender === 'Nam'}
                      onChange={() => {
                        setGender('Nam');
                        if (errors.gender) {
                          const next = { ...errors };
                          delete next.gender;
                          setErrors(next);
                        }
                      }}
                      className="w-4 h-4 text-[#006B3F] focus:ring-[#006B3F] border-[#D9DFDC]"
                    />
                    <span>Nam</span>
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer text-[14px] text-[#1A2421]">
                    <input
                      type="radio"
                      name="register_gender"
                      value="Nữ"
                      checked={gender === 'Nữ'}
                      onChange={() => {
                        setGender('Nữ');
                        if (errors.gender) {
                          const next = { ...errors };
                          delete next.gender;
                          setErrors(next);
                        }
                      }}
                      className="w-4 h-4 text-[#006B3F] focus:ring-[#006B3F] border-[#D9DFDC]"
                    />
                    <span>Nữ</span>
                  </label>
                </div>
                {errors.gender && (
                  <p className="text-[12px] text-[#C62828] font-medium">{errors.gender}</p>
                )}
              </div>

              {/* 2. Khối Nơi thường trú - 5 cấp */}
              <div className="pt-2 border-t border-[#D9DFDC]/60 space-y-3">
                <div className="text-[13px] font-bold text-[#006B3F] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#006B3F]" />
                  <span>Nơi thường trú</span>
                </div>

                {/* Hàng 1: Tỉnh thành, Quận huyện */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Cấp 1: Tỉnh / Thành phố */}
                  <div className="space-y-1">
                    <AdminUnitCombobox
                      label="Tỉnh / Thành phố"
                      value={resProvince}
                      onChange={(val) => {
                        setResProvince(val);
                        setResDistrict('');
                        setResVillage('');
                        setResUnit('');
                      }}
                      options={LAO_PROVINCES}
                      placeholder="Chọn hoặc nhập tỉnh/thành..."
                    />
                  </div>

                  {/* Cấp 2: Quận / Huyện */}
                  <div className="space-y-1">
                    <AdminUnitCombobox
                      label="Quận / Huyện"
                      value={resDistrict}
                      onChange={(val) => {
                        setResDistrict(val);
                        setResVillage('');
                        setResUnit('');
                      }}
                      options={resDistrictOptions}
                      placeholder="Chọn hoặc nhập quận/huyện..."
                    />
                  </div>
                </div>

                {/* Hàng 2: Bản, Đơn vị dưới bản */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Cấp 3: Bản */}
                  <div className="space-y-1">
                    <AdminUnitCombobox
                      label="Bản"
                      value={resVillage}
                      onChange={(val) => {
                        setResVillage(val);
                        setResUnit('');
                      }}
                      options={resVillageOptions}
                      placeholder="Chọn hoặc nhập bản..."
                    />
                  </div>

                  {/* Cấp 4: Đơn vị dưới bản */}
                  <div className="space-y-1">
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
                <div className="space-y-1">
                  <label className="text-[13px] font-medium text-[#1A2421] block">
                    Địa chỉ chi tiết
                  </label>
                  <input
                    type="text"
                    value={resAddressDetail}
                    onChange={(e) => setResAddressDetail(e.target.value)}
                    placeholder="Số nhà, ngõ, tên đường..."
                    className="w-full h-[44px] px-3.5 text-[14px] text-[#1A2421] bg-white border border-[#D9DFDC] rounded-[8px] outline-none focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/15"
                  />
                </div>
              </div>
            </div>

            {/* 3. Khối "Xác thực tài khoản bằng mã OTP" */}
            <div className="space-y-4 pt-2">
              <div className="text-[13px] font-bold text-[#006B3F] uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-[#D9DFDC]/60">
                <Phone className="w-4 h-4 text-[#006B3F]" />
                <span>Kênh nhận mã xác thực OTP</span>
              </div>

              {/* Radio chọn ĐÚNG 1 trong 2 kênh */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-[#1A2421]">
                  <input
                    type="radio"
                    name="contactChannel"
                    value="sms"
                    checked={contactChannel === 'sms'}
                    onChange={() => {
                      setContactChannel('sms');
                      const next = { ...errors };
                      delete next.email;
                      setErrors(next);
                    }}
                    className="w-4 h-4 text-[#006B3F] focus:ring-[#006B3F]"
                  />
                  <span>Qua SMS</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-[#1A2421]">
                  <input
                    type="radio"
                    name="contactChannel"
                    value="email"
                    checked={contactChannel === 'email'}
                    onChange={() => {
                      setContactChannel('email');
                      const next = { ...errors };
                      delete next.phone;
                      setErrors(next);
                    }}
                    className="w-4 h-4 text-[#006B3F] focus:ring-[#006B3F]"
                  />
                  <span>Qua Email</span>
                </label>
              </div>

              {/* Ô Số điện thoại nếu chọn SMS */}
              {contactChannel === 'sms' && (
                <div className="space-y-1 animate-fadeIn">
                  <label className="text-[13px] font-medium text-[#1A2421] block">
                    Số điện thoại <span className="text-[#C62828] font-bold">*</span>
                  </label>
                  <input
                    ref={phoneRef}
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) {
                        const next = { ...errors };
                        delete next.phone;
                        setErrors(next);
                      }
                    }}
                    onBlur={() => validateField('contact')}
                    placeholder="Ví dụ: 02055667788 hoặc +8562055667788"
                    className={`w-full h-[44px] px-3.5 text-[14px] text-[#1A2421] bg-white border rounded-[8px] outline-none transition-all
                      ${
                        errors.phone
                          ? 'border-[#C62828] focus:ring-2 focus:ring-[#C62828]/20'
                          : 'border-[#D9DFDC] focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/15'
                      }
                    `}
                  />
                  {errors.phone && (
                    <p className="text-[12px] text-[#C62828] font-medium">{errors.phone}</p>
                  )}
                </div>
              )}

              {/* Ô Email nếu chọn Email */}
              {contactChannel === 'email' && (
                <div className="space-y-1 animate-fadeIn">
                  <label className="text-[13px] font-medium text-[#1A2421] block">
                    Email <span className="text-[#C62828] font-bold">*</span>
                  </label>
                  <input
                    ref={emailRef}
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        const next = { ...errors };
                        delete next.email;
                        setErrors(next);
                      }
                    }}
                    onBlur={() => validateField('contact')}
                    placeholder="Ví dụ: nguoidan@example.com"
                    className={`w-full h-[44px] px-3.5 text-[14px] text-[#1A2421] bg-white border rounded-[8px] outline-none transition-all
                      ${
                        errors.email
                          ? 'border-[#C62828] focus:ring-2 focus:ring-[#C62828]/20'
                          : 'border-[#D9DFDC] focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/15'
                      }
                    `}
                  />
                  {errors.email && (
                    <p className="text-[12px] text-[#C62828] font-medium">{errors.email}</p>
                  )}
                </div>
              )}
            </div>

            {/* 4. Khối "Mật khẩu" */}
            <div className="space-y-4 pt-2">
              <div className="text-[13px] font-bold text-[#006B3F] uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-[#D9DFDC]/60">
                <Lock className="w-4 h-4 text-[#006B3F]" />
                <span>Mật khẩu tài khoản</span>
              </div>

              {/* Mật khẩu */}
              <div className="space-y-1">
                <label className="text-[13px] font-medium text-[#1A2421] block">
                  Mật khẩu <span className="text-[#C62828] font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={passwordRef}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) {
                        const next = { ...errors };
                        delete next.password;
                        setErrors(next);
                      }
                    }}
                    onBlur={() => validateField('password')}
                    placeholder="Tối thiểu 8 ký tự..."
                    className={`w-full h-[44px] pl-3.5 pr-11 text-[14px] text-[#1A2421] bg-white border rounded-[8px] outline-none transition-all
                      ${
                        errors.password
                          ? 'border-[#C62828] focus:ring-2 focus:ring-[#C62828]/20'
                          : 'border-[#D9DFDC] focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/15'
                      }
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5F6B66] hover:text-[#1A2421] p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[12px] text-[#C62828] font-medium">{errors.password}</p>
                )}

                {/* Thanh đo độ mạnh và danh sách tiêu chí */}
                <PasswordStrengthMeter password={password} idNumber={idNumber} />
              </div>

              {/* Nhập lại mật khẩu */}
              <div className="space-y-1">
                <label className="text-[13px] font-medium text-[#1A2421] block">
                  Nhập lại mật khẩu <span className="text-[#C62828] font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={confirmPasswordRef}
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) {
                        const next = { ...errors };
                        delete next.confirmPassword;
                        setErrors(next);
                      }
                    }}
                    onBlur={() => validateField('confirmPassword')}
                    placeholder="Nhập lại chính xác mật khẩu..."
                    className={`w-full h-[44px] pl-3.5 pr-11 text-[14px] text-[#1A2421] bg-white border rounded-[8px] outline-none transition-all
                      ${
                        errors.confirmPassword
                          ? 'border-[#C62828] focus:ring-2 focus:ring-[#C62828]/20'
                          : 'border-[#D9DFDC] focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/15'
                      }
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5F6B66] hover:text-[#1A2421] p-1"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[12px] text-[#C62828] font-medium">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Checkbox điều khoản */}
            <div className="space-y-1 pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-[13px] text-[#1A2421] select-none">
                <input
                  ref={termsRef}
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => {
                    setAgreedTerms(e.target.checked);
                    if (errors.terms) {
                      const next = { ...errors };
                      delete next.terms;
                      setErrors(next);
                    }
                  }}
                  className="mt-0.5 w-4 h-4 text-[#006B3F] rounded border-[#D9DFDC] focus:ring-[#006B3F] cursor-pointer"
                />
                <span className="leading-tight">
                  Tôi đồng ý với{' '}
                  <span className="text-[#006B3F] hover:underline font-medium">
                    Điều khoản sử dụng
                  </span>{' '}
                  và{' '}
                  <span className="text-[#006B3F] hover:underline font-medium">
                    Chính sách bảo mật
                  </span>
                </span>
              </label>
              {errors.terms && (
                <p className="text-[12px] text-[#C62828] font-medium pl-6">{errors.terms}</p>
              )}
            </div>

            {/* Nút Tiếp tục (Primary, full width) */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isSubmittingStep1}
                className="w-full h-[44px] bg-[#006B3F] text-white hover:bg-[#005733] active:bg-[#004729] rounded-[8px] font-semibold text-[14px] flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                {isSubmittingStep1 ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang kiểm tra...</span>
                  </>
                ) : (
                  <>
                    <span>Tiếp tục</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-[13px] text-[#5F6B66]">Đã có tài khoản? </span>
                <button
                  type="button"
                  onClick={() => onNavigateLogin()}
                  className="text-[13px] text-[#006B3F] font-semibold hover:underline cursor-pointer"
                >
                  Đăng nhập
                </button>
              </div>
            </div>
          </form>
        )}

        {/* BƯỚC 2 – XÁC THỰC OTP */}
        {currentStep === 2 && (
          <OtpVerificationStep
            maskedDestination={maskedDestination}
            expectedOtp={generatedOtp}
            onSuccess={handleOtpVerifiedSuccess}
            onBackToStep1={() => setCurrentStep(1)}
            onResendOtp={handleResendOtp}
          />
        )}

        {/* BƯỚC 3 – HOÀN TẤT */}
        {currentStep === 3 && createdAccount && (
          <div className="text-center space-y-6 py-4 animate-scaleUp">
            <div className="w-16 h-16 bg-[#E8F3EE] rounded-full flex items-center justify-center mx-auto text-[#006B3F] ring-8 ring-[#E8F3EE]/50">
              <CheckCircle2 className="w-10 h-10 text-[#006B3F]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-[22px] font-bold text-[#1A2421]">Đăng ký thành công!</h3>
              <p className="text-[14px] text-[#5F6B66] leading-relaxed max-w-sm mx-auto">
                Tài khoản của bạn đã được tạo thành công trên Cổng Dịch vụ công e-Border Pass.
              </p>
            </div>

            <div className="p-4 bg-[#F5F7F6] border border-[#D9DFDC] rounded-xl text-left space-y-2 max-w-sm mx-auto">
              <div className="text-[12px] text-[#5F6B66]">Tên đăng nhập (Số định danh):</div>
              <div className="text-[16px] font-mono font-bold text-[#006B3F]">
                {createdAccount.idNumber}
              </div>
              <div className="text-[12px] text-[#5F6B66] pt-1">Họ và tên chủ tài khoản:</div>
              <div className="text-[14px] font-semibold text-[#1A2421]">
                {createdAccount.fullName}
              </div>
              {createdAccount.gender && (
                <>
                  <div className="text-[12px] text-[#5F6B66] pt-1">Giới tính:</div>
                  <div className="text-[14px] font-medium text-[#1A2421]">
                    {createdAccount.gender}
                  </div>
                </>
              )}
              {(createdAccount.dateOfBirth || createdAccount.dob) && (
                <>
                  <div className="text-[12px] text-[#5F6B66] pt-1">Ngày sinh:</div>
                  <div className="text-[14px] font-medium text-[#1A2421]">
                    {createdAccount.dateOfBirth || createdAccount.dob}
                  </div>
                </>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigateLogin(createdAccount.idNumber)}
                className="w-full h-[44px] bg-[#006B3F] text-white hover:bg-[#005733] active:bg-[#004729] rounded-[8px] font-semibold text-[14px] flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <span>Đăng nhập ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
