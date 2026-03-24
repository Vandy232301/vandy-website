import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { supabase } from '../../lib/supabase';

export function LeadCapturePopup() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('Te rog completează toate câmpurile.');
      return;
    }

    setLoading(true);
    setError('');

    const { error: dbError } = await supabase.from('leads').insert({
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    });

    setLoading(false);

    if (dbError) {
      setError('A apărut o eroare. Încearcă din nou.');
      return;
    }

    localStorage.setItem('vandy_lead_submitted', 'true');
    setSubmitted(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (submitted) {
      window.open('https://t.me/VANDY_001_Official', '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-black/95 border-neutral-800 text-white max-w-[calc(100%-3rem)] sm:max-w-sm rounded-2xl p-7 sm:p-8 overflow-y-auto max-h-[90vh]">
        <AnimatePresence mode="wait">
          {!submitted ? (
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
                  Intră în{' '}
                  <span className="text-emerald-400">COMUNITATEA</span> mea{' '}
                  <span className="text-emerald-400">GRATUITĂ</span>
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

              <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Nume"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Prenume"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Telefon"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
                />

                {error && (
                  <p className="text-red-400 text-xs text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-5 py-3 text-sm font-semibold tracking-wide hover:bg-neutral-200 transition-colors duration-200 shadow-[0_0_20px_rgba(255,255,255,0.15)] animate-[pulse-glow_2s_ease-in-out_infinite] disabled:opacity-60 disabled:animate-none mt-2"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
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
          ) : (
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
                Datele tale au fost înregistrate cu succes. Intră acum în comunitatea de Telegram.
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
