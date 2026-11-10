import React, { useState, useEffect } from 'react';
import {
  getCurrentSession,
  clearSession,
  seedDemoAccountIfNeeded,
  EbSession,
} from './utils/ebAuthStorage';
import { AuthAppHeader, AppNavRoute } from './components/auth/AuthAppHeader';
import { AuthAppFooter } from './components/auth/AuthAppFooter';
import { RegisterView } from './components/auth/RegisterView';
import { LoginView } from './components/auth/LoginView';
import { ForgotPasswordView } from './components/auth/ForgotPasswordView';
import { DashboardHomeView } from './components/auth/DashboardHomeView';
import { AccountInfoModal } from './components/auth/AccountInfoModal';
import {
  SimulatedOtpToast,
  SimulatedOtpNotification,
} from './components/auth/SimulatedOtpToast';

// Các màn hình nghiệp vụ dịch vụ công
import { ProcedureLookupView } from './components/portal/ProcedureLookupView';
import { StartSubmissionView, SubmissionProcedureType } from './components/portal/StartSubmissionView';
import { ApplicationFormStep2 } from './components/portal/ApplicationFormStep2';
import { LookupView } from './components/portal/LookupView';
import { PaymentView } from './components/portal/PaymentView';
import { StoredApplication, getStoredApplicationByCode } from './utils/submissionStorage';

// Nghiệp vụ kiểm tra sinh trắc & đặt lịch hẹn
import { MyAppointmentsView } from './components/biometric/MyAppointmentsView';
import { BiometricDemoPanel } from './components/biometric/BiometricDemoPanel';

import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ParsedRoute {
  name: string; // 'dang-ky' | 'dang-nhap' | 'quen-mat-khau' | 'trang-chu' | 'tra-cuu-thu-tuc' | 'nop-ho-so' | 'ke-khai/cap-moi' | 'ke-khai/tam-thoi' | 'tra-cuu-ho-so' | 'sinh-trac/dat-lich' | 'sinh-trac/lich-hen' | 'ho-so' | 'nop-ho-so-form'
  procedure?: 'cap-so' | 'tam-thoi';
  draftId?: string;
  editAppointmentId?: string;
  formMode?: 'create' | 'edit-draft' | 'supplement' | 'view';
}

export default function App() {
  const [session, setSession] = useState<EbSession | null>(null);

  // Lưu URL dự định vào khi chưa đăng nhập (để đăng nhập xong quay lại đúng trang đó)
  const [intendedRoute, setIntendedRoute] = useState<string | null>(null);

  // Tuyến đường hiện tại được bóc tách từ window.location.hash
  const [routeInfo, setRouteInfo] = useState<ParsedRoute>({ name: 'dang-nhap' });

  // Số định danh điền sẵn khi chuyển qua lại giữa các màn hình đăng ký / đăng nhập / quên mật khẩu
  const [prefilledIdNumber, setPrefilledIdNumber] = useState<string>('');

  // Thông báo OTP giả lập
  const [simulatedOtp, setSimulatedOtp] = useState<SimulatedOtpNotification | null>(null);

  // Modal xem thông tin tài khoản từ header
  const [profileModalRequested, setProfileModalRequested] = useState(false);

  // Toast thông báo chung
  const [toast, setToast] = useState<{
    id: number;
    msg: string;
    type: 'success' | 'danger' | 'info';
  } | null>(null);

  const showToast = (msg: string, type: 'success' | 'danger' | 'info' = 'info') => {
    const id = Date.now();
    setToast({ id, msg, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4000); // Tự ẩn sau 4 giây
  };

  // Khởi tạo tài khoản mẫu nếu chưa có
  useEffect(() => {
    seedDemoAccountIfNeeded();
  }, []);

  // Phân tích cú pháp hash routing
  const parseCurrentHash = (): ParsedRoute => {
    const rawWithQuery = window.location.hash.replace(/^#\/?/, '').trim();
    if (!rawWithQuery) {
      return { name: 'dang-nhap' };
    }
    const [rawHash, queryString] = rawWithQuery.split('?');
    const params = new URLSearchParams(queryString || '');
    const editId = params.get('edit') || undefined;
    const procParam = params.get('procedure') === 'tam-thoi' ? 'tam-thoi' : (params.get('procedure') === 'cap-so' ? 'cap-so' : undefined);
    const maParam = params.get('ma') || undefined;
    const modeParam = params.get('mode') === 'supplement' ? 'supplement' : (maParam ? 'edit-draft' : undefined);

    // 1. Tuyến đường Xem chi tiết hồ sơ: #/ho-so/:maHoSo
    if (rawHash.startsWith('ho-so/')) {
      const parts = rawHash.split('/');
      const maHoSo = parts.slice(1).join('/');
      return { name: 'ho-so', draftId: maHoSo || undefined, formMode: 'view' };
    }

    // 1b. Tuyến đường Thanh toán lệ phí Finlink: #/thanh-toan/:maHoSo
    if (rawHash.startsWith('thanh-toan/')) {
      const parts = rawHash.split('/');
      const maHoSo = parts.slice(1).join('/');
      return { name: 'thanh-toan', draftId: maHoSo || undefined };
    }

    // 2. Tuyến đường Nộp hồ sơ / Tiếp tục chỉnh sửa / Bổ sung: #/nop-ho-so/cap-so hoặc #/nop-ho-so/tam-thoi?ma=...&mode=...
    if (rawHash === 'nop-ho-so/cap-so' || rawHash === 'nop-ho-so/tam-thoi') {
      const targetProc: 'cap-so' | 'tam-thoi' = rawHash === 'nop-ho-so/tam-thoi' ? 'tam-thoi' : 'cap-so';
      return {
        name: 'nop-ho-so-form',
        procedure: targetProc,
        draftId: maParam,
        formMode: modeParam || (maParam ? 'edit-draft' : 'create'),
      };
    }

    // 3. Tương thích alias: #/ke-khai/tam-thoi
    if (rawHash.startsWith('ke-khai/tam-thoi/') || rawHash === 'ke-khai/tam-thoi') {
      const parts = rawHash.split('/');
      const draftId = parts[2] || maParam;
      return {
        name: 'nop-ho-so-form',
        procedure: 'tam-thoi',
        draftId: draftId || undefined,
        formMode: modeParam || (draftId ? 'edit-draft' : 'create'),
      };
    }

    // 4. Tương thích alias: #/ke-khai/cap-moi
    if (rawHash.startsWith('ke-khai/cap-moi/') || rawHash === 'ke-khai/cap-moi') {
      const parts = rawHash.split('/');
      const draftId = parts[2] || maParam;
      return {
        name: 'nop-ho-so-form',
        procedure: 'cap-so',
        draftId: draftId || undefined,
        formMode: modeParam || (draftId ? 'edit-draft' : 'create'),
      };
    }

    // Nếu vào đường dẫn màn hình khai hồ sơ nhưng chưa chọn thủ tục hoặc không có mã thủ tục hợp lệ
    if (
      rawHash === 'ke-khai' ||
      rawHash === 'nop-ho-so-form' ||
      rawHash.startsWith('ke-khai/') ||
      rawHash.startsWith('nop-ho-so/')
    ) {
      return { name: 'nop-ho-so' };
    }

    if (rawHash === 'sinh-trac/dat-lich' || rawHash === 'sinh-trac') {
      return { name: 'lich-hen', editAppointmentId: editId, procedure: procParam || 'cap-so' };
    }

    if (rawHash === 'lich-hen' || rawHash === 'sinh-trac/lich-hen') {
      return { name: 'lich-hen', procedure: procParam || 'cap-so' };
    }

    if (
      [
        'dang-ky',
        'dang-nhap',
        'quen-mat-khau',
        'trang-chu',
        'tra-cuu-thu-tuc',
        'nop-ho-so',
        'tra-cuu-ho-so',
        'lich-hen',
      ].includes(rawHash)
    ) {
      return { name: rawHash };
    }

    return { name: 'dang-nhap' };
  };

  // Các route yêu cầu người dùng phải đăng nhập trước khi vào
  const isProtectedAuthRoute = (routeName: string) => {
    return [
      'trang-chu',
      'tra-cuu-thu-tuc',
      'nop-ho-so',
      'nop-ho-so-form',
      'ke-khai/cap-moi',
      'ke-khai/tam-thoi',
      'tra-cuu-ho-so',
      'ho-so',
      'thanh-toan',
      'lich-hen',
      'sinh-trac/dat-lich',
      'sinh-trac/lich-hen',
    ].includes(routeName);
  };

  // Đồng bộ hash URL với state và kiểm tra phiên đăng nhập
  useEffect(() => {
    const syncRouteWithSession = () => {
      const curSession = getCurrentSession();
      setSession(curSession);

      const parsed = parseCurrentHash();

      // Nếu route yêu cầu đăng nhập mà người dùng chưa đăng nhập:
      if (!curSession && isProtectedAuthRoute(parsed.name)) {
        // Lưu lại route đang định vào để đăng nhập xong quay lại đúng trang
        const fullCurrentPath = parsed.draftId
          ? `${parsed.name}/${parsed.draftId}`
          : parsed.name;
        setIntendedRoute(fullCurrentPath);

        window.location.hash = '#/dang-nhap';
        setRouteInfo({ name: 'dang-nhap' });
        return;
      }

      // Nếu truy cập trực tiếp bằng đường dẫn màn hình khai hồ sơ mà chưa chọn thủ tục (state rỗng, không có mã thủ tục hợp lệ)
      if (
        parsed.name === 'nop-ho-so-form' &&
        (!parsed.procedure || (parsed.procedure !== 'cap-so' && parsed.procedure !== 'tam-thoi'))
      ) {
        window.location.hash = '#/nop-ho-so';
        setRouteInfo({ name: 'nop-ho-so' });
        return;
      }

      // Nếu đã đăng nhập mà người dùng cố vào #/dang-nhap hoặc #/dang-ky:
      if (curSession && (parsed.name === 'dang-nhap' || parsed.name === 'dang-ky')) {
        window.location.hash = '#/trang-chu';
        setRouteInfo({ name: 'trang-chu' });
        return;
      }

      setRouteInfo(parsed);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Chạy lần đầu khi mount
    syncRouteWithSession();

    window.addEventListener('hashchange', syncRouteWithSession);
    return () => window.removeEventListener('hashchange', syncRouteWithSession);
  }, []);

  const navigateTo = (path: string, prefilledId?: string) => {
    if (prefilledId !== undefined) {
      setPrefilledIdNumber(prefilledId);
    }
    const cleanPath = path.replace(/^#\/?/, '');
    window.location.hash = `#/${cleanPath}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Điều hướng nộp hồ sơ theo thủ tục: "cap-so" hoặc "tam-thoi" (dẫn thẳng vào màn khai hồ sơ của thủ tục đó)
  const handleProceedToProcedure = async (proc: 'cap-so' | 'tam-thoi' = 'cap-so'): Promise<boolean> => {
    const curSession = session || getCurrentSession();
    if (!curSession) {
      navigateTo('dang-nhap');
      return false;
    }

    navigateTo(`nop-ho-so/${proc}`);
    return true;
  };

  const handleProceedToCapSo = async () => {
    await handleProceedToProcedure('cap-so');
  };

  const handleLoginSuccess = (newSession: EbSession) => {
    setSession(newSession);

    showToast(`Đăng nhập thành công! Chào mừng ${newSession.fullName}`, 'success');

    // Nếu trước đó đang định vào trang nào thì quay lại đúng trang đó
    if (intendedRoute) {
      const target = intendedRoute;
      setIntendedRoute(null);
      navigateTo(target);
    } else {
      navigateTo('trang-chu');
    }
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    setIntendedRoute(null);
    showToast('Đã đăng xuất khỏi tài khoản', 'info');
    navigateTo('dang-nhap');
  };

  const handleDataReset = () => {
    setSession(null);
    setIntendedRoute(null);
    setPrefilledIdNumber('');
    showToast('Đã xóa dữ liệu demo thành công. Bạn có thể thử nghiệm lại.', 'success');
    navigateTo('dang-nhap');
  };

  return (
    <div className="min-h-screen bg-[#F5F7F6] text-[#1A2421] flex flex-col font-['Inter',sans-serif]">
      {/* 1. Header chuẩn Design System dùng chung cho mọi màn hình */}
      <AuthAppHeader
        session={session}
        currentRoute={routeInfo.name}
        onLogout={handleLogout}
        onOpenProfile={() => setProfileModalRequested(true)}
        onNavigateTab={(tab) => {
          navigateTo(tab);
        }}
      />

      {/* 2. Nội dung chính theo Route */}
      <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-start">
        {/* MÀN 1: ĐĂNG KÝ TÀI KHOẢN (#/dang-ky) */}
        {routeInfo.name === 'dang-ky' && (
          <div className="my-auto py-4">
            <RegisterView
              onNavigateLogin={(prefill) => navigateTo('dang-nhap', prefill)}
              onSendSimulatedOtp={(notif) => setSimulatedOtp(notif)}
            />
          </div>
        )}

        {/* MÀN 2: ĐĂNG NHẬP (#/dang-nhap) */}
        {routeInfo.name === 'dang-nhap' && (
          <div className="my-auto py-4">
            <LoginView
              prefilledIdNumber={prefilledIdNumber}
              onLoginSuccess={handleLoginSuccess}
              onNavigateRegister={() => navigateTo('dang-ky')}
              onNavigateForgotPassword={(prefill) => navigateTo('quen-mat-khau', prefill)}
              onShowToast={showToast}
            />
          </div>
        )}

        {/* MÀN 3: QUÊN MẬT KHẨU (#/quen-mat-khau) */}
        {routeInfo.name === 'quen-mat-khau' && (
          <div className="my-auto py-4">
            <ForgotPasswordView
              initialIdNumber={prefilledIdNumber}
              onNavigateLogin={(prefill) => navigateTo('dang-nhap', prefill)}
              onSendSimulatedOtp={(notif) => setSimulatedOtp(notif)}
            />
          </div>
        )}

        {/* MÀN 4: TRANG CHỦ SAU ĐĂNG NHẬP (#/trang-chu) */}
        {routeInfo.name === 'trang-chu' && session && (
          <DashboardHomeView
            session={session}
            onLogout={handleLogout}
            onShowToast={showToast}
            onNavigate={(route) => navigateTo(route)}
            onProceedToCapSo={() => navigateTo('nop-ho-so')}
          />
        )}

        {/* MÀN 5: TRA CỨU THỦ TỤC (#/tra-cuu-thu-tuc) */}
        {routeInfo.name === 'tra-cuu-thu-tuc' && session && (
          <ProcedureLookupView
            onSubmitNewPass={() => handleProceedToProcedure('cap-so')}
            onSubmitProcedure={(proc) => handleProceedToProcedure(proc)}
            onSubmitTamThoi={() => handleProceedToProcedure('tam-thoi')}
            onShowToast={showToast}
          />
        )}

        {/* MÀN 6: CHỌN THỦ TỤC ĐỂ NỘP HỒ SƠ (#/nop-ho-so) */}
        {routeInfo.name === 'nop-ho-so' && session && (
          <StartSubmissionView
            userLoggedIn={true}
            onOpenLogin={() => {}}
            onNavigateHome={() => navigateTo('trang-chu')}
            initialSelectedType={null}
            onProceedToStep2={(selectedProc) => {
              if (selectedProc === 'TAM_THOI') {
                handleProceedToProcedure('tam-thoi');
              } else if (selectedProc === 'CAP_SO') {
                handleProceedToProcedure('cap-so');
              }
            }}
            onShowToast={showToast}
          />
        )}

        {/* MÀN DANH SÁCH LỊCH HẸN CỦA TÔI (#/lich-hen, #/sinh-trac/lich-hen) */}
        {(routeInfo.name === 'lich-hen' || routeInfo.name === 'sinh-trac/lich-hen' || routeInfo.name === 'sinh-trac/dat-lich') && session && (
          <MyAppointmentsView
            session={session}
            onNavigateHome={() => navigateTo('trang-chu')}
            onNavigateViewApplication={(maHoSo) => navigateTo(`ho-so/${encodeURIComponent(maHoSo)}`)}
            onShowToast={showToast}
          />
        )}

        {/* MÀN XEM CHI TIẾT HỒ SƠ (#/ho-so/:maHoSo - Chế độ CHỈ ĐỌC) */}
        {routeInfo.name === 'ho-so' && session && routeInfo.draftId && (() => {
          const loadedApp = getStoredApplicationByCode(routeInfo.draftId);
          const proc = loadedApp?.thuTuc || 'cap-so';
          return (
            <ApplicationFormStep2
              key={`view-${routeInfo.draftId}`}
              procedureType={proc === 'tam-thoi' ? 'TAM_THOI' : 'CAP_SO'}
              procedure={proc}
              currentDraftId={routeInfo.draftId}
              targetMaHoSo={routeInfo.draftId}
              formMode="view"
              readOnly={true}
              session={session}
              onBackToStep1={() => navigateTo('tra-cuu-ho-so')}
              onReturnToList={() => navigateTo('tra-cuu-ho-so')}
            />
          );
        })()}

        {/* MÀN FORM KÊ KHAI / CHỈNH SỬA NHÁP / BỔ SUNG HỒ SƠ */}
        {routeInfo.name === 'nop-ho-so-form' &&
          session && (() => {
            const isTamThoi = routeInfo.procedure === 'tam-thoi';
            const proc = isTamThoi ? 'tam-thoi' : 'cap-so';
            return (
              <ApplicationFormStep2
                key={`${routeInfo.name}-${routeInfo.procedure}-${routeInfo.draftId || 'new'}-${routeInfo.formMode || 'create'}`}
                procedureType={isTamThoi ? 'TAM_THOI' : 'CAP_SO'}
                procedure={proc}
                currentDraftId={routeInfo.draftId}
                targetMaHoSo={routeInfo.draftId}
                formMode={routeInfo.formMode || (routeInfo.draftId ? 'edit-draft' : 'create')}
                session={session}
                onBackToStep1={() => {
                  if (routeInfo.formMode === 'supplement' || routeInfo.formMode === 'edit-draft') {
                    navigateTo('tra-cuu-ho-so');
                  } else {
                    navigateTo('nop-ho-so');
                  }
                }}
                onReturnToList={() => navigateTo('tra-cuu-ho-so')}
                onSaveDraft={(savedApp: StoredApplication) => {
                  showToast(`Đã lưu nháp hồ sơ ${savedApp.maHoSo} thành công!`, 'success');
                  navigateTo('tra-cuu-ho-so');
                }}
                onSubmitSuccess={(maHoSo: string) => {
                  showToast(`Đã nộp hồ sơ ${maHoSo} thành công!`, 'success');
                }}
              />
            );
          })()}

        {/* MÀN 8: TRA CỨU HỒ SƠ ("Hồ sơ của tôi", route #/tra-cuu-ho-so) */}
        {routeInfo.name === 'tra-cuu-ho-so' && session && (
          <LookupView
            userIdentifier={session.idNumber || session.userId}
            onViewDetail={(maHoSo) => {
              navigateTo(`ho-so/${maHoSo}`);
            }}
            onContinueEditing={(maHoSo, thuTuc) => {
              navigateTo(`nop-ho-so/${thuTuc}?ma=${maHoSo}`);
            }}
            onSupplementApplication={(maHoSo, thuTuc) => {
              navigateTo(`nop-ho-so/${thuTuc}?ma=${maHoSo}&mode=supplement`);
            }}
            onNavigateToPayment={(maHoSo) => {
              navigateTo(`thanh-toan/${maHoSo}`);
            }}
            onShowToast={showToast}
          />
        )}

        {/* MÀN 9: THANH TOÁN LỆ PHÍ FINLINK (#/thanh-toan/:maHoSo) */}
        {routeInfo.name === 'thanh-toan' && session && routeInfo.draftId && (
          <PaymentView
            maHoSo={routeInfo.draftId}
            onBack={() => navigateTo('tra-cuu-ho-so')}
            onPaymentSuccess={() => {
              showToast('Thanh toán thành công lệ phí hồ sơ!', 'success');
              navigateTo('tra-cuu-ho-so');
            }}
          />
        )}
      </main>

      {/* 3. Footer một dòng bản quyền & nút Xóa dữ liệu demo */}
      <AuthAppFooter onDataReset={handleDataReset} />

      {/* Modal thông tin tài khoản khi click từ Header */}
      {profileModalRequested && session && (
        <AccountInfoModal
          session={session}
          onClose={() => setProfileModalRequested(false)}
        />
      )}

      {/* Thẻ thông báo OTP giả lập (ở góc phải trên cùng) */}
      <SimulatedOtpToast
        notification={simulatedOtp}
        onClose={() => setSimulatedOtp(null)}
      />

      {/* Bảng điều khiển Chế độ demo nghiệp vụ sinh trắc (góc dưới màn hình) */}
      <BiometricDemoPanel
        currentCitizenId={session?.idNumber || ''}
        onRefreshData={() => {
          // Đồng bộ lại state khi có thay đổi từ demo panel
          setRouteInfo((prev) => ({ ...prev }));
        }}
        onResetTestAccounts={() => {
          handleLogout();
        }}
        onShowToast={showToast}
      />

      {/* Toast thông báo chung tự ẩn sau 4 giây */}
      {toast && (
        <div className="fixed top-5 right-5 z-[9990] animate-slideDown select-none">
          <div
            className={`px-4 py-3 rounded-xl border text-[13px] font-medium shadow-lg flex items-center gap-2.5 max-w-md ${
              toast.type === 'success'
                ? 'bg-[#E8F3EE] border-[#006B3F] text-[#006B3F]'
                : toast.type === 'danger'
                ? 'bg-[#FFF5F5] border-[#C62828] text-[#C62828]'
                : 'bg-white border-[#D9DFDC] text-[#1A2421]'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-[#006B3F]" />}
            {toast.type === 'danger' && <AlertTriangle className="w-4 h-4 shrink-0 text-[#C62828]" />}
            {toast.type === 'info' && <Info className="w-4 h-4 shrink-0 text-[#006B3F]" />}
            <span className="flex-1 leading-snug">{toast.msg}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="p-1 hover:bg-black/5 rounded text-[#5F6B66] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
