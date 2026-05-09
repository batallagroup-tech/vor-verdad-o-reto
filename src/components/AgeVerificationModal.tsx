import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert } from 'lucide-react';

const hapticFeedback = (pattern: number | number[] = 10) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

interface AgeVerificationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function AgeVerificationModal({ onConfirm, onCancel }: AgeVerificationModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-sm bg-[#050505] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50" />
        
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 rounded-full bg-pink-500/10 flex items-center justify-center border-2 border-pink-500/20">
            <ShieldAlert className="w-10 h-10 text-pink-500" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Acceso Restringido</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Este modo contiene retos sugerentes y solo es apto para mayores de 18 años.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 w-full">
            <p className="text-[10px] uppercase font-black tracking-widest text-pink-500 mb-1">Advertencia de Contenido</p>
            <p className="text-[11px] text-slate-500 italic">Al continuar, confirmas legalmente que tienes la edad mínima requerida.</p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => {
                hapticFeedback(30);
                onConfirm();
              }}
              className="w-full py-4 bg-white text-black rounded-full font-black text-lg shadow-xl shadow-white/5 hover:scale-[1.02] active:scale-95 transition-all text-center"
            >
              SOY MAYOR DE EDAD
            </button>
            
            <button
              onClick={() => {
                hapticFeedback(10);
                onCancel();
              }}
              className="w-full py-4 bg-white/5 text-slate-500 rounded-full font-bold text-sm hover:bg-white/10 transition-all uppercase tracking-widest text-center"
            >
              CANCELAR
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
