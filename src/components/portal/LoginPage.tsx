import React, { useState } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  QrCode,
  BookOpen,
  X,
  CheckCircle2,
  Shield,
  HelpCircle,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface LoginPageProps {
  onSuccess: () => void;
  onBack: () => void;
  onGoToRegister?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onBack,
  onGoToRegister,
}) => {
  const [authType, setAuthType] = useState<'laeid' | 'portal'>('laeid');
  const [citizenId, setCitizenId] = useState('01-089201948');
  const [password, setPassword] = useState('Matkhau@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mô phỏng lưu đăng nhập thành công vào localStorage
    setTimeout(() => {
      localStorage.setItem('daDangNhap', 'true');
      localStorage.setItem('hoTenCongDan', 'Somchai Keovongsa');
      setLoading(false);
      onSuccess();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#004D2C] relative flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-x-hidden font-sans">
      {/* Họa tiết hoa văn mờ trang trọng phía sau (SVG Pattern) */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#FFFFFF 1px, transparent 1px), radial-gradient(#FFFFFF 1px, #004D2C 1px)`,
          backgroundSize: '36px 36px',
          backgroundPosition: '0 0, 18px 18px',
        }}
      />

      {/* Vòng hào quang ánh sáng mờ nhẹ ở trung tâm */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#006B3F] opacity-30 rounded-full blur-[100px] pointer-events-none" />

      {/* Header nút quay lại góc trên */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-white/90 hover:text-white text-[13px] sm:text-[14px] font-medium py-1.5 px-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Cổng dịch vụ công</span>
        </button>

        <span className="text-[12px] text-white/60 hidden sm:inline">
          Cổng Dịch vụ công cấp Giấy thông hành Lào - Việt Nam
        </span>
      </div>

      {/* KHỐI NỘI DUNG CHÍNH Ở TRUNG TÂM */}
      <div className="relative z-10 w-full max-w-4xl mx-auto my-auto py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fadeIn">
        {/* 2. Khối thương hiệu ở giữa, phía trên (căn giữa theo chiều ngang) */}
        <div className="text-center space-y-2">
          {/* Huy hiệu dạng ngôi sao / quốc huy viền vàng #D6A928 với chữ LAeID */}
          <div className="w-18 h-18 sm:w-20 sm:h-20 mx-auto rounded-full bg-[#003B22] border-2 border-[#D6A928] p-1 flex items-center justify-center shadow-lg relative group">
            <div className="w-full h-full rounded-full border border-[#D6A928]/60 flex flex-col items-center justify-center bg-gradient-to-b from-[#005532] to-[#003920]">
              <Shield className="w-6 h-6 text-[#D6A928] mb-0.5" />
              <span className="text-[10px] font-extrabold tracking-wider text-[#D6A928] uppercase">
                LAeID
              </span>
            </div>
          </div>

          {/* Dòng chữ lớn, in đậm, màu vàng #D6A928 */}
          <h1 className="text-[20px] sm:text-[24px] font-extrabold text-[#D6A928] uppercase tracking-wider">
            SỞ CẢNH SÁT XUẤT NHẬP CẢNH
          </h1>

          {/* Dòng phụ bên dưới, màu trắng / vàng nhạt */}
          <p className="text-[13px] sm:text-[14px] text-white/90 font-medium">
            Hệ thống định danh điện tử quốc gia (LAeID)
          </p>
        </div>

        {/* 3. Khối trắng ở giữa trang, chia 2 cột */}
        <div className="bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#D9E1DC] overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* CỘT TRÁI (Form đăng nhập, ~60% chiều rộng) */}
          <div className="md:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-5">
            <div>
              <h2 className="text-[20px] sm:text-[22px] font-bold text-[#1F2937] leading-tight">
                {authType === 'laeid' ? 'Đăng nhập LAeID' : 'Đăng nhập bằng tài khoản Cổng'}
              </h2>
              <p className="text-[13px] text-[#6B7280] mt-1">
                {authType === 'laeid'
                  ? 'Nhập số định danh cá nhân và mật khẩu tài khoản LAeID của bạn'
                  : 'Sử dụng tài khoản công dân đã đăng ký trực tiếp trên Cổng'}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Input "Số định danh cá nhân" */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[#1F2937] block">
                  {authType === 'laeid' ? 'Số định danh cá nhân' : 'Tên đăng nhập / Số CMND'}
                  <span className="text-[#D71920] ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={citizenId}
                    onChange={(e) => setCitizenId(e.target.value)}
                    placeholder="01-089201948"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#D9E1DC] rounded-lg text-[14px] text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#006B3F] focus:ring-1 focus:ring-[#006B3F] transition-colors"
                  />
                </div>
              </div>

              {/* Input "Mật khẩu" */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-medium text-[#1F2937] block">
                    Mật khẩu
                    <span className="text-[#D71920] ml-1">*</span>
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="w-full pl-9 pr-10 py-2.5 bg-white border border-[#D9E1DC] rounded-lg text-[14px] text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#006B3F] focus:ring-1 focus:ring-[#006B3F] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6B7280] hover:text-[#1F2937] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Dòng nhỏ bên dưới 2 ô input, căn phải: link "Quên mật khẩu?" màu xanh lá #006B3F */}
                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    onClick={() => setShowGuideModal(true)}
                    className="text-[12px] font-medium text-[#006B3F] hover:underline cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              </div>

              {/* Nút "Đăng nhập" — full-width, style Primary (nền #006B3F, chữ trắng, bo góc) */}
              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={loading}
                className="w-full py-3 text-[15px] font-semibold bg-[#006B3F] hover:bg-[#005532] text-white rounded-lg shadow-sm"
              >
                {loading ? 'Đang xác thực...' : 'Đăng nhập'}
              </Button>
            </form>

            <div className="space-y-4 pt-2">
              {/* Dòng chữ nhỏ bên dưới nút */}
              <p className="text-[12px] text-[#6B7280] text-center">
                Trường hợp không đăng nhập được, vui lòng{' '}
                <button
                  type="button"
                  onClick={() => setShowGuideModal(true)}
                  className="text-[#006B3F] underline font-medium hover:text-[#005532] cursor-pointer"
                >
                  xem hướng dẫn
                </button>
              </p>

              {/* Dòng phân cách "Hoặc" */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#D9E1DC]"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-[#9CA3AF] font-medium">Hoặc</span>
                </div>
              </div>

              {/* Nút Ghost: Chuyển đổi giữa LAeID và tài khoản Cổng */}
              <button
                type="button"
                onClick={() => setAuthType(authType === 'laeid' ? 'portal' : 'laeid')}
                className="w-full py-2.5 px-4 rounded-lg border border-[#D9E1DC] bg-white hover:bg-[#F5F7F6] text-[#006B3F] text-[13px] font-semibold transition-colors cursor-pointer text-center"
              >
                {authType === 'laeid'
                  ? 'Đăng nhập bằng tài khoản Cổng'
                  : 'Đăng nhập bằng tài khoản LAeID'}
              </button>

              {/* Cuối cùng: Dòng "Chưa có tài khoản? Đăng ký ngay" */}
              <p className="text-[13px] text-[#1F2937] text-center">
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={onGoToRegister || (() => setShowGuideModal(true))}
                  className="text-[#006B3F] font-semibold hover:underline cursor-pointer"
                >
                  Đăng ký ngay
                </button>
              </p>
            </div>
          </div>

          {/* CỘT PHẢI (~40% chiều rộng khối, có đường phân cách dọc màu #D9E1DC) */}
          <div className="md:col-span-5 p-6 sm:p-8 lg:p-10 border-t md:border-t-0 md:border-l border-[#D9E1DC] bg-[#FAFDFB] flex flex-col items-center justify-center text-center space-y-4">
            {/* Mã QR hình ảnh placeholder sắc nét, viền mỏng bo góc */}
            <div className="p-3 bg-white border border-[#D9E1DC] rounded-2xl shadow-sm relative group">
              <div className="w-48 h-48 sm:w-52 sm:h-52 bg-white flex flex-col items-center justify-center relative overflow-hidden rounded-xl border border-gray-100">
                {/* SVG QR Code minh họa chuẩn xác */}
                <svg
                  className="w-full h-full p-2"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Góc trên trái */}
                  <rect x="5" y="5" width="26" height="26" rx="3" stroke="#004D2C" strokeWidth="4" />
                  <rect x="12" y="12" width="12" height="12" rx="1" fill="#004D2C" />

                  {/* Góc trên phải */}
                  <rect x="69" y="5" width="26" height="26" rx="3" stroke="#004D2C" strokeWidth="4" />
                  <rect x="76" y="12" width="12" height="12" rx="1" fill="#004D2C" />

                  {/* Góc dưới trái */}
                  <rect x="5" y="69" width="26" height="26" rx="3" stroke="#004D2C" strokeWidth="4" />
                  <rect x="12" y="76" width="12" height="12" rx="1" fill="#004D2C" />

                  {/* Các khối dữ liệu QR ngẫu nhiên chân thực */}
                  <rect x="36" y="8" width="6" height="6" fill="#1F2937" />
                  <rect x="46" y="16" width="6" height="6" fill="#1F2937" />
                  <rect x="56" y="8" width="6" height="6" fill="#1F2937" />
                  <rect x="36" y="24" width="6" height="6" fill="#1F2937" />
                  <rect x="8" y="36" width="6" height="6" fill="#1F2937" />
                  <rect x="18" y="46" width="6" height="6" fill="#1F2937" />
                  <rect x="28" y="36" width="6" height="6" fill="#1F2937" />
                  <rect x="8" y="56" width="6" height="6" fill="#1F2937" />

                  <rect x="68" y="38" width="6" height="6" fill="#1F2937" />
                  <rect x="78" y="48" width="6" height="6" fill="#1F2937" />
                  <rect x="88" y="38" width="6" height="6" fill="#1F2937" />
                  <rect x="68" y="58" width="6" height="6" fill="#1F2937" />

                  <rect x="38" y="68" width="6" height="6" fill="#1F2937" />
                  <rect x="48" y="78" width="6" height="6" fill="#1F2937" />
                  <rect x="58" y="68" width="6" height="6" fill="#1F2937" />
                  <rect x="38" y="88" width="6" height="6" fill="#1F2937" />
                  <rect x="78" y="78" width="6" height="6" fill="#1F2937" />
                  <rect x="88" y="88" width="6" height="6" fill="#1F2937" />

                  {/* Logo LAeID ở tâm QR */}
                  <circle cx="50" cy="50" r="14" fill="#FFFFFF" stroke="#D6A928" strokeWidth="2" />
                  <text
                    x="50"
                    y="53.5"
                    fill="#006B3F"
                    fontSize="7"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    LAeID
                  </text>
                </svg>

                {/* Nút bấm mô phỏng quét QR ngay trên giao diện */}
                <button
                  type="button"
                  onClick={handleLogin}
                  className="absolute inset-0 bg-[#006B3F]/90 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl cursor-pointer p-3 space-y-1"
                >
                  <Smartphone className="w-8 h-8 text-[#D6A928]" />
                  <span className="text-[12px] font-bold">Bấm để quét QR mô phỏng</span>
                  <span className="text-[10px] text-white/80">Xác thực tức thì bằng LAeID</span>
                </button>
              </div>
            </div>

            {/* Dòng chữ bên dưới, căn giữa */}
            <div className="space-y-1 max-w-[240px]">
              <p className="text-[13px] font-semibold text-[#1F2937]">
                Hoặc quét mã QR bằng ứng dụng LAeID để đăng nhập.
              </p>
              <p className="text-[11px] text-[#6B7280]">
                Mở ứng dụng LAeID trên điện thoại, chọn mục "Quét mã QR" để đăng nhập nhanh chóng và bảo mật.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Nút tròn nổi (Floating Action Button) ở góc dưới bên phải màn hình */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setShowGuideModal(true)}
          className="w-13 h-13 rounded-full bg-white border-2 border-[#006B3F] text-[#006B3F] hover:bg-[#E8F3EE] shadow-xl flex items-center justify-center transition-all hover:scale-105 cursor-pointer group"
          title="Hướng dẫn đăng nhập nhanh"
        >
          <BookOpen className="w-6 h-6 text-[#006B3F] group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Footer nhỏ bảo mật ở đáy trang */}
      <div className="relative z-10 text-center py-2 text-[12px] text-white/60">
        Bản quyền © 2026 Sở Cảnh sát Xuất nhập cảnh. Hệ thống được bảo vệ bởi công nghệ mã hóa an toàn quốc gia.
      </div>

      {/* POPUP HƯỚNG DẪN NHANH (KHI CLICK FAB HOẶC LINK "XEM HƯỚNG DẪN") */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-2xl border border-[#D9E1DC] max-w-lg w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-[#D9E1DC] flex items-center justify-between bg-[#F5F7F6]">
              <div className="flex items-center gap-2 text-[#006B3F]">
                <BookOpen className="w-5 h-5 text-[#006B3F]" />
                <h3 className="text-[16px] font-bold text-[#1F2937]">
                  Hướng dẫn đăng nhập tài khoản LAeID
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 text-[#6B7280] hover:text-[#1F2937] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-[13px] text-[#1F2937] leading-relaxed max-h-[70vh] overflow-y-auto">
              <div className="p-3 bg-[#E8F3EE] border border-[#B0DFCA] rounded-lg text-[#006B3F] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#006B3F] shrink-0 mt-0.5" />
                <span>
                  Hệ thống LAeID hỗ trợ đăng nhập 2 phương thức: Nhập số định danh hoặc Quét mã QR trên điện thoại.
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-[14px] text-[#1F2937]">
                  1. Đăng nhập bằng Số định danh cá nhân & Mật khẩu:
                </h4>
                <ul className="list-disc list-inside space-y-1 pl-2 text-[#6B7280]">
                  <li>Số định danh cá nhân: Số CMND/Căn cước do Công an Lào cấp.</li>
                  <li>Mật khẩu: Mật khẩu đã thiết lập khi kích hoạt ứng dụng LAeID mức độ 2.</li>
                  <li>Nếu quên mật khẩu: Sử dụng chức năng "Quên mật khẩu" trên ứng dụng di động để tạo lại.</li>
                </ul>

                <h4 className="font-bold text-[14px] text-[#1F2937] pt-2">
                  2. Đăng nhập bằng cách Quét mã QR:
                </h4>
                <ul className="list-disc list-inside space-y-1 pl-2 text-[#6B7280]">
                  <li>Mở ứng dụng <strong>LAeID</strong> trên điện thoại thông minh (iOS/Android).</li>
                  <li>Tại góc trên bên phải màn hình chính, chọn biểu tượng <strong>Quét mã QR</strong>.</li>
                  <li>Hướng camera vào mã QR hiển thị ở cột bên phải màn hình để hoàn tất đăng nhập.</li>
                </ul>

                <h4 className="font-bold text-[14px] text-[#1F2937] pt-2">
                  3. Tổng đài hỗ trợ kỹ thuật:
                </h4>
                <p className="text-[#6B7280]">
                  Nếu cần trợ giúp, vui lòng liên hệ Bộ phận Hỗ trợ công dân: <strong>1900 8829</strong> (Hỗ trợ 24/7).
                </p>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-[#D9E1DC] bg-white flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowGuideModal(false)}
              >
                Đã hiểu
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
