import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Sparkles, ChevronDown, Check } from 'lucide-react';
import { StoredChallenge } from '../services/challengeService';
import { GAME_MODES } from '../constants';
import { soundService } from '../services/soundService';

const hapticFeedback = (pattern: number | number[] = 10) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern);
};

interface CustomChallengesModalProps {
  onClose: () => void;
  onChallengesUpdated?: () => void;
  t: (key: string) => string;
}

export function CustomChallengesModal({ onClose, onChallengesUpdated, t }: CustomChallengesModalProps) {
  const [customList, setCustomList] = useState<StoredChallenge[]>([]);
  const [text, setText] = useState('');
  const [type, setType] = useState<'truth' | 'dare'>('truth');
  const [targetModeId, setTargetModeId] = useState<string>('all');
  const [priority, setPriority] = useState<'high' | 'normal' | 'climax'>('normal');
  const [playerGender, setPlayerGender] = useState<'any' | 'male' | 'female'>('any');
  const [showModePicker, setShowModePicker] = useState<boolean>(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('vor_custom_challenges');
      if (raw) setCustomList(JSON.parse(raw));
    } catch (_) {}
  }, []);

  const saveList = (newList: StoredChallenge[]) => {
    setCustomList(newList);
    try {
      localStorage.setItem('vor_custom_challenges', JSON.stringify(newList));
      if (onChallengesUpdated) onChallengesUpdated();
    } catch (_) {}
  };

  const handleAdd = () => {
    if (!text.trim()) return;
    hapticFeedback(20);
    soundService.playSuccessSound();
    const item: StoredChallenge = {
      modeId: targetModeId,
      type,
      intensity: 3, // Disponible en cualquier nivel
      audience: 'any',
      playerGender,
      priority,
      text: text.trim(),
      timer: 0
    };
    const updated = [item, ...customList];
    saveList(updated);
    setText('');
  };

  const handleRemove = (index: number) => {
    hapticFeedback(15);
    soundService.playForfeitSound();
    const updated = customList.filter((_, idx) => idx !== index);
    saveList(updated);
  };

  const getModeLabel = (modeId: string) => {
    if (!modeId || modeId === 'all' || modeId === 'custom') return '🌟 Todos los modos (General)';
    const found = GAME_MODES.find(m => m.id === modeId);
    return found ? `${found.icon} ${found.name}` : modeId;
  };

  const familyModes = [
    { id: 'all', name: 'Todos los modos (General)', icon: '🌟' },
    ...GAME_MODES.filter(m => m.category === 'family')
  ];
  const adultModes = GAME_MODES.filter(m => m.category === 'adult');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-sm bg-white/5 border border-white/10 rounded-[2.5rem] p-5 space-y-4 my-auto max-h-[92vh] flex flex-col relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Retos Personalizados</h2>
              <span className="text-[9px] text-pink-400 font-bold uppercase tracking-widest">Tus propias preguntas</span>
            </div>
          </div>
          <button
            onClick={() => { hapticFeedback(10); onClose(); }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form to add new */}
        <div className="space-y-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
          {/* Tipo: Verdad / Reto */}
          <div className="flex gap-2">
            <button
              onClick={() => { hapticFeedback(10); soundService.playTruthSound(); setType('truth'); }}
              className={`flex-1 py-1.5 rounded-xl font-black text-xs transition-all ${
                type === 'truth' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-slate-400'
              }`}
            >
              VERDAD
            </button>
            <button
              onClick={() => { hapticFeedback(10); soundService.playDareSound(); setType('dare'); }}
              className={`flex-1 py-1.5 rounded-xl font-black text-xs transition-all ${
                type === 'dare' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'bg-white/5 text-slate-400'
              }`}
            >
              RETO
            </button>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe aquí tu pregunta o reto secreto..."
            rows={2}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-pink-500 transition-colors resize-none"
          />

          {/* Custom Mode Selector Button (100% In-App Themed UI) */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
              🎮 Modo de juego asignado:
            </label>
            <button
              type="button"
              onClick={() => { hapticFeedback(10); soundService.playCardFlipSound(); setShowModePicker(true); }}
              className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white flex items-center justify-between hover:border-pink-500 transition-colors shadow-inner"
            >
              <span className="font-bold flex items-center gap-2 truncate">
                {getModeLabel(targetModeId)}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-pink-400 shrink-0" />
            </button>
          </div>

          {/* Priority / Frequency Selector */}
          <div className="space-y-1 pt-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
              ⚡ Frecuencia de aparición:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => { hapticFeedback(10); setPriority('high'); }}
                className={`py-1.5 px-1 rounded-xl text-[10px] font-bold transition-all flex flex-col items-center justify-center ${
                  priority === 'high' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-500/20' : 'bg-white/5 text-slate-400 border border-transparent'
                }`}
              >
                <span>⚡ Frecuente</span>
              </button>
              <button
                type="button"
                onClick={() => { hapticFeedback(10); setPriority('normal'); }}
                className={`py-1.5 px-1 rounded-xl text-[10px] font-bold transition-all flex flex-col items-center justify-center ${
                  priority === 'normal' ? 'bg-white/20 text-white border border-white/40 shadow-md' : 'bg-white/5 text-slate-400 border border-transparent'
                }`}
              >
                <span>🎲 Normal</span>
              </button>
              <button
                type="button"
                onClick={() => { hapticFeedback(10); setPriority('climax'); }}
                className={`py-1.5 px-1 rounded-xl text-[10px] font-bold transition-all flex flex-col items-center justify-center ${
                  priority === 'climax' ? 'bg-red-500/30 text-red-300 border border-red-500/50 shadow-md shadow-red-500/20' : 'bg-white/5 text-slate-400 border border-transparent'
                }`}
              >
                <span>🔥 Para el final</span>
              </button>
            </div>
          </div>

          {/* Gender selection & Add button */}
          <div className="flex gap-2 items-center justify-between pt-1">
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => { hapticFeedback(10); setPlayerGender('any'); }}
                className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${
                  playerGender === 'any' ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-500'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => { hapticFeedback(10); setPlayerGender('male'); }}
                className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${
                  playerGender === 'male' ? 'bg-blue-500/30 text-blue-300 border border-blue-500/30' : 'bg-white/5 text-slate-500'
                }`}
              >
                👨 Él
              </button>
              <button
                type="button"
                onClick={() => { hapticFeedback(10); setPlayerGender('female'); }}
                className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${
                  playerGender === 'female' ? 'bg-pink-500/30 text-pink-300 border border-pink-500/30' : 'bg-white/5 text-slate-500'
                }`}
              >
                👩 Ella
              </button>
            </div>

            <button
              disabled={!text.trim()}
              onClick={handleAdd}
              className="px-4 py-2 bg-pink-500 text-white rounded-xl font-black text-xs shadow-lg shadow-pink-500/20 disabled:opacity-30 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar
            </button>
          </div>
        </div>

        {/* Existing Custom Challenges List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar min-h-[100px] max-h-[190px]">
          {customList.length === 0 ? (
            <p className="text-center text-slate-600 text-xs py-4 font-medium">No tienes retos personalizados aún. ¡Escribe el primero arriba!</p>
          ) : (
            customList.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 text-left"
              >
                <div className="flex flex-col gap-0.5 overflow-hidden">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        item.type === 'truth' ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400'
                      }`}
                    >
                      {item.type === 'truth' ? 'Verdad' : 'Reto'}
                    </span>
                    <span className="text-[8px] font-bold text-pink-400/80 bg-pink-500/10 px-1.5 py-0.5 rounded">
                      {getModeLabel(item.modeId)}
                    </span>
                    {item.priority === 'high' && (
                      <span className="text-[8px] font-bold text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded">
                        ⚡ Frecuente
                      </span>
                    )}
                    {item.priority === 'climax' && (
                      <span className="text-[8px] font-bold text-red-400 bg-red-500/10 px-1 py-0.5 rounded">
                        🔥 Para el final
                      </span>
                    )}
                    {item.playerGender && item.playerGender !== 'any' && (
                      <span className="text-[8px] font-bold text-slate-400">
                        {item.playerGender === 'male' ? '👨 Para él' : '👩 Para ella'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-white truncate">{item.text}</p>
                </div>
                <button
                  onClick={() => handleRemove(idx)}
                  className="text-slate-500 hover:text-red-400 p-1 transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => { hapticFeedback(10); onClose(); }}
          className="w-full py-3 bg-white text-black rounded-full font-bold text-xs text-center hover:bg-slate-200 transition-colors"
        >
          {t('close')}
        </button>

        {/* 100% IN-APP THEMED MODE PICKER MODAL */}
        <AnimatePresence>
          {showModePicker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/95 backdrop-blur-2xl rounded-[2.5rem] p-4 flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-sm font-black text-white">Selecciona el Modo</h3>
                  <p className="text-[9px] text-slate-400">Elige dónde quieres que aparezca este reto</p>
                </div>
                <button
                  onClick={() => { hapticFeedback(10); setShowModePicker(false); }}
                  className="p-1.5 rounded-full bg-white/10 text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 py-2 pr-1 custom-scrollbar">
                {/* 1. MODOS FAMILIARES Y GENERALES (FIRST) */}
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest px-1">
                    👨‍👩‍👧‍👦 Modos Familiares y Generales
                  </span>
                  <div className="space-y-1">
                    {familyModes.map((m) => {
                      const isSelected = targetModeId === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            hapticFeedback(15);
                            setTargetModeId(m.id);
                            setShowModePicker(false);
                          }}
                          className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                            isSelected
                              ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                              : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{m.icon}</span>
                            <span className="text-xs">{m.name}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. MODOS ADULTOS (+18) (SECOND) */}
                <div className="space-y-1 pt-2 border-t border-white/10">
                  <span className="text-[9px] font-black text-pink-400 uppercase tracking-widest px-1 flex items-center gap-1">
                    🔥 Modos Adultos (+18)
                  </span>
                  <div className="space-y-1">
                    {adultModes.map((m) => {
                      const isSelected = targetModeId === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            hapticFeedback(15);
                            setTargetModeId(m.id);
                            setShowModePicker(false);
                          }}
                          className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                            isSelected
                              ? 'bg-pink-500/20 border-pink-500 text-white font-bold'
                              : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{m.icon}</span>
                            <span className="text-xs">{m.name}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-pink-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
