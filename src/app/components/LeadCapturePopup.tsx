import React, { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

type Step = 'form' | 'verify' | 'success';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s+\-().]{7,20}$/;

function validateForm(form: { firstName: string; lastName: string; email: string; phone: string }) {
  if (!form.firstName.trim() || form.firstName.trim().length < 2)
    return 'Numele trebuie să aibă cel puțin 2 caractere.';
  if (!form.lastName.trim() || form.lastName.trim().length < 2)
    return 'Prenumele trebuie să aibă cel puțin 2 caractere.';
  if (!form.email.trim() || !EMAIL_REGEX.test(form.email.trim()))
    return 'Te rog introdu o adresă de email validă.';
  if (!form.phone.trim() || !PHONE_REGEX.test(form.phone.trim()))
    return 'Te rog introdu un număr de telefon valid.';
  return null;
}

export function LeadCapturePopup() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const alreadySubmitted = localStorage.getItem('vandy_lead_submitted');
    if (alreadySubmitted) return;
    const timer = setTimeout(() => setOpen(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSendCode = async () => {
    const validationError = validateForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim(), firstName: form.firstName.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep('verify');
        setOtpDigits(['', '', '', '', '', '']);
        setResendTimer(60);
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      } else {
        setError(data.error || 'Eroare la trimiterea codului.');
      }
    } catch {
      setError('Eroare de conexiune. Încearcă din nou.');
    }

    setLoading(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otpDigits];
      digits.forEach((d, i) => {
        if (index + i < 6) newOtp[index + i] = d;
      });
      setOtpDigits(newOtp);
      const nextIdx = Math.min(index + digits.length, 5);
      otpRefs.current[nextIdx]?.focus();
      if (error) setError('');
      return;
    }

    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);
    if (error) setError('');

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyAndSubmit = async () => {
    const code = otpDigits.join('');
    if (code.length !== 6) {
      setError('Introdu codul complet de 6 cifre.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, verificationCode: code }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('vandy_lead_submitted', 'true');
        setStep('success');
      } else {
        setError(data.error || 'Cod invalid sau expirat.');
      }
    } catch {
      setError('Eroare de conexiune. Încearcă din nou.');
    }

    setLoading(false);
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim(), firstName: form.firstName.trim() }),
      });

      if (res.ok) {
        setOtpDigits(['', '', '', '', '', '']);
        setResendTimer(60);
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      } else {
        const data = await res.json();
        setError(data.error || 'Eroare la retrimitere.');
      }
    } catch {
      setError('Eroare de conexiune.');
    }

    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
    if (step === 'success') {
      window.open('https://t.me/VANDY_001_Official', '_blank');
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-black/95 border-neutral-800 text-white max-w-[calc(100%-3rem)] sm:max-w-sm rounded-2xl p-7 sm:p-8 overflow-y-auto max-h-[90vh]">
        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader className="space-y-4 text-center">
                <p className="inline-flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-400">
                  <span className="h-[1px] w-4 bg-emerald-400/60" />
                  Free Community
                  <span className="h-[1px] w-4 bg-emerald-400/60" />
                </p>
                <DialogTitle className="text-xl sm:text-2xl font-bold leading-snug text-center">
                  Intră în <span className="text-emerald-400">COMUNITATEA</span>
                  <br />
                  mea 100% <span className="text-emerald-400">GRATUITĂ</span>
                </DialogTitle>
                <p className="text-neutral-300 text-sm leading-relaxed text-center">
                  și poți afla cele mai tari{' '}
                  <span className="text-white font-semibold">OPORTUNITĂȚI</span> ale momentului.
                </p>
              </DialogHeader>

              <div className="mt-4 text-xs text-neutral-400 leading-relaxed text-center px-2">
                De la <span className="text-white font-medium">Memecoin Trading</span>,{' '}
                <span className="text-white font-medium">Investiții</span> pe termen mediu și lung,{' '}
                <span className="text-white font-medium">Tehnologie</span> și cum să faci{' '}
                <span className="text-white font-medium">bani</span> și să îți asiguri{' '}
                <span className="text-white font-medium">viitorul</span> și{' '}
                <span className="text-white font-medium">libertatea</span> într-o lume tot mai incertă.
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSendCode(); }} className="mt-6 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" name="firstName" placeholder="Nume" value={form.firstName} onChange={handleChange} className={inputClass} />
                  <input type="text" name="lastName" placeholder="Prenume" value={form.lastName} onChange={handleChange} className={inputClass} />
                </div>
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className={inputClass} />
                <input type="tel" name="phone" placeholder="Telefon (ex: +40 7XX XXX XXX)" value={form.phone} onChange={handleChange} className={inputClass} />

                {error && <p className="text-red-400 text-xs text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-5 py-3 text-sm font-semibold tracking-wide hover:bg-neutral-200 transition-colors duration-200 shadow-[0_0_20px_rgba(255,255,255,0.15)] animate-[pulse-glow_2s_ease-in-out_infinite] disabled:opacity-60 disabled:animate-none mt-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {loading ? 'Se trimite...' : 'Vreau acces gratuit'}
                </button>
              </form>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-3 text-xs text-neutral-500 hover:text-neutral-300 transition-colors w-full text-center"
              >
                Nu acum, mai târziu
              </button>
            </motion.div>
          )}

          {step === 'verify' && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center"
            >
              <button
                type="button"
                onClick={() => { setStep('form'); setError(''); }}
                className="self-start flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-300 transition-colors mb-4"
              >
                <ArrowLeft size={14} />
                Înapoi
              </button>

              <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                <ShieldCheck size={28} className="text-emerald-400" />
              </div>

              <DialogHeader className="space-y-2 text-center">
                <DialogTitle className="text-lg sm:text-xl font-bold text-center">
                  Verifică-ți email-ul
                </DialogTitle>
              </DialogHeader>

              <p className="text-neutral-400 text-sm mt-2 mb-1">
                Am trimis un cod de 6 cifre la:
              </p>
              <p className="text-white text-sm font-medium mb-6">
                {form.email}
              </p>

              <div className="flex gap-2 justify-center mb-4">
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    onFocus={(e) => e.target.select()}
                    className="w-11 h-13 text-center text-xl font-bold rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                ))}
              </div>

              {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

              <button
                type="button"
                onClick={handleVerifyAndSubmit}
                disabled={loading || otpDigits.join('').length !== 6}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-5 py-3 text-sm font-semibold tracking-wide hover:bg-neutral-200 transition-colors duration-200 shadow-[0_0_20px_rgba(255,255,255,0.15)] disabled:opacity-60 mt-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                {loading ? 'Se verifică...' : 'Confirmă și intră în comunitate'}
              </button>

              <div className="mt-4 text-xs text-neutral-500">
                Nu ai primit codul?{' '}
                {resendTimer > 0 ? (
                  <span className="text-neutral-600">Retrimite în {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={loading}
                    className="text-emerald-400 hover:text-emerald-300 transition-colors underline"
                  >
                    Retrimite codul
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center py-4 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle size={32} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold">Bine ai venit!</h3>
              <p className="text-neutral-300 text-sm leading-relaxed max-w-xs">
                Email-ul tău a fost verificat cu succes. Intră acum în comunitatea de Telegram.
              </p>
              <a
                href="https://t.me/VANDY_001_Official"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-semibold tracking-wide hover:bg-neutral-200 transition-colors duration-200 shadow-[0_0_20px_rgba(255,255,255,0.15)] animate-[pulse-glow_2s_ease-in-out_infinite]"
              >
                <Send size={16} />
                Intră pe Telegram
              </a>
              <button
                type="button"
                onClick={handleClose}
                className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                Închide
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
