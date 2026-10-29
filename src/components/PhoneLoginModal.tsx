import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Phone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Lock,
  User,
  KeyRound,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface AuthUser {
  phone: string;
  name: string;
  countryCode: string;
  role: string;
  verifiedAt: string;
}

interface PhoneLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onLoginSuccess: (user: AuthUser) => void;
  onLogout: () => void;
}

export const PhoneLoginModal: React.FC<PhoneLoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
}) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (currentUser) {
      setStep('profile');
    } else {
      setStep('phone');
    }
  }, [currentUser, isOpen]);

  // Resend countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  const countryOptions = [
    { code: '+91', label: '🇮🇳 India (+91)' },
    { code: '+1', label: '🇺🇸 USA (+1)' },
    { code: '+44', label: '🇬🇧 UK (+44)' },
    { code: '+971', label: '🇦🇪 UAE (+971)' },
    { code: '+92', label: '🇵🇰 Pakistan (+92)' },
    { code: '+880', label: '🇧🇩 Bangladesh (+880)' },
    { code: '+61', label: '🇦🇺 Australia (+61)' },
    { code: '+65', label: '🇸🇬 Singapore (+65)' },
  ];

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < 7 || cleaned.length > 15) {
      setErrorMsg('Please enter a valid phone number (minimum 7-10 digits).');
      return;
    }

    setIsLoading(true);
    // Generate a random 6-digit OTP
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockCode);

    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setResendTimer(30);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      // Focus first digit box
      setTimeout(() => otpInputsRef.current[0]?.focus(), 100);
    }, 700);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.slice(0, 6).split('');
      const updated = [...otpDigits];
      pasted.forEach((ch, idx) => {
        if (index + idx < 6) updated[index + idx] = ch;
      });
      setOtpDigits(updated);
      const nextIdx = Math.min(5, index + pasted.length);
      otpInputsRef.current[nextIdx]?.focus();
      return;
    }

    const updated = [...otpDigits];
    updated[index] = value;
    setOtpDigits(updated);

    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    setErrorMsg('');
    const entered = otpDigits.join('');

    if (entered.length < 6) {
      setErrorMsg('Please enter all 6 digits of your OTP.');
      return;
    }

    if (entered !== generatedOtp && entered !== '123456') {
      setErrorMsg(`Incorrect OTP. Use the code from the notification (${generatedOtp}) or 123456.`);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user: AuthUser = {
        phone: `${countryCode} ${phoneNumber}`,
        name: name.trim() || 'Xitres Scholar',
        countryCode,
        role: 'Verified Scholar (PRO)',
        verifiedAt: new Date().toLocaleDateString(),
      };

      onLoginSuccess(user);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setStep('profile');
    }, 600);
  };

  const handleAutoFillOtp = () => {
    setOtpDigits(generatedOtp.split(''));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col relative">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 -left-20 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header with XITRES Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between relative z-10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
          <div className="flex items-center gap-3.5">
            <img
              src="/logo.png"
              alt="XITRES MIND"
              className="w-11 h-11 rounded-2xl object-cover ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/20"
            />
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <span className="gold-gradient-text font-cinzel">XITRES MIND</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  AUTH
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Secure Phone & OTP Verification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 relative z-10">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 animate-in fade-in">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Phone Number Input */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="text-center space-y-1 pb-2">
                <h4 className="text-base font-bold text-white">
                  Enter Your Mobile Number
                </h4>
                <p className="text-xs text-slate-400">
                  We'll send a 6-digit OTP code to verify your XITRES account
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Full Name (Optional)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="e.g. Mohammad / Alex"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-2.5 py-2.5 focus:outline-none focus:border-amber-500 shrink-0"
                  >
                    {countryOptions.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>

                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Sending Code...</span>
                ) : (
                  <>
                    <span>Send Verification OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-500 text-center">
                By signing in, you unlock persistent cloud study data, streak protection, and AI coaching.
              </p>
            </form>
          )}

          {/* STEP 2: 6-Digit OTP Verification */}
          {step === 'otp' && (
            <div className="space-y-4">
              {/* Simulated SMS Toast Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 shadow-md">
                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    SMS Simulated OTP
                  </div>
                  <div className="text-xs text-white font-mono font-bold">
                    Code: <span className="text-amber-300 text-sm tracking-widest">{generatedOtp}</span>
                  </div>
                </div>
                <button
                  onClick={handleAutoFillOtp}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition shrink-0"
                >
                  Auto-fill
                </button>
              </div>

              <div className="text-center space-y-1">
                <h4 className="text-base font-bold text-white">
                  Enter 6-Digit Verification Code
                </h4>
                <p className="text-xs text-slate-400">
                  Sent to <strong className="text-slate-200">{countryCode} {phoneNumber}</strong>
                </p>
              </div>

              {/* 6 Digit Input Boxes */}
              <div className="flex justify-between gap-2 max-w-[320px] mx-auto py-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputsRef.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-13 text-center text-lg font-black text-white bg-slate-950 border border-slate-700/80 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-inner"
                  />
                ))}
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Verifying Code...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify & Continue</span>
                  </>
                )}
              </button>

              {/* Resend & Back options */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setStep('phone')}
                  className="hover:text-slate-200 transition"
                >
                  Change Number
                </button>

                {canResend ? (
                  <button
                    onClick={() => {
                      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
                      setGeneratedOtp(newCode);
                      setResendTimer(30);
                      setCanResend(false);
                    }}
                    className="text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    Resend OTP Code
                  </button>
                ) : (
                  <span className="text-slate-500">
                    Resend in <strong className="text-slate-400">{resendTimer}s</strong>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: User Profile / Logged In State */}
          {step === 'profile' && currentUser && (
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 p-0.5 mx-auto shadow-xl shadow-amber-500/20">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white">
                  {currentUser.name}
                </h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {currentUser.phone}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentUser.role}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Verified On:</span>
                  <strong className="text-white">{currentUser.verifiedAt}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Account Status:</span>
                  <span className="text-emerald-400 font-semibold">Active & Synced</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                >
                  Continue Studying
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setStep('phone');
                  }}
                  className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-red-500/20 hover:text-red-300 text-slate-400 text-xs font-semibold transition border border-slate-700"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
