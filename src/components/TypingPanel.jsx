import React, { useState, useEffect, useRef } from 'react';
import { TYPING_DATA } from '../data/texts';

export const TypingPanel = ({ 
  lang = 'ko', 
  onAttack, 
  onSkillSelect, 
  selectedSkill = 'word', 
  disabled = false 
}) => {
  const [targetText, setTargetText] = useState('');
  const [inputText, setInputText] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [cpm, setCpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef(null);

  useEffect(() => {
    loadNewText(selectedSkill);
  }, [lang, selectedSkill]);

  // 숫자 1, 2, 3 키 입력 시 스킬 변경 & 입력창에 1, 2, 3 누적 방지!
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (disabled) return;
      if (e.key === '1') {
        e.preventDefault();
        onSkillSelect('word');
      } else if (e.key === '2') {
        e.preventDefault();
        onSkillSelect('short');
      } else if (e.key === '3') {
        e.preventDefault();
        onSkillSelect('long');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, onSkillSelect]);

  const loadNewText = (type) => {
    const list = TYPING_DATA[lang][type] || TYPING_DATA['ko']['word'];
    const randomIndex = Math.floor(Math.random() * list.length);
    setTargetText(list[randomIndex]);
    setInputText('');
    setStartTime(null);
    setCpm(0);
    setAccuracy(100);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e) => {
    if (disabled) return;
    let value = e.target.value;
    
    // 혹시라도 숫자 1, 2, 3이 들어간 경우 제거
    if (value.endsWith('1') || value.endsWith('2') || value.endsWith('3')) {
      const lastChar = value.slice(-1);
      if (['1', '2', '3'].includes(lastChar)) {
        value = value.slice(0, -1);
      }
    }

    const now = Date.now();

    if (!startTime && value.length > 0) {
      setStartTime(now);
    }

    setInputText(value);

    if (startTime && value.length > 0) {
      const elapsedSec = (now - startTime) / 1000;
      if (elapsedSec > 0) {
        const calculatedCpm = Math.round((value.length / elapsedSec) * 60);
        setCpm(calculatedCpm);
      }

      let correctChars = 0;
      for (let i = 0; i < value.length; i++) {
        if (value[i] === targetText[i]) correctChars++;
      }
      const acc = Math.round((correctChars / value.length) * 100);
      setAccuracy(isNaN(acc) ? 100 : acc);
    }

    if (value === targetText) {
      const finalCpm = cpm || 280;
      onAttack({
        type: selectedSkill,
        cpm: finalCpm,
        accuracy: 100,
        text: targetText
      });
      loadNewText(selectedSkill);
    }
  };

  return (
    <div className="w-full bg-[#0c1017] border border-amber-500/30 rounded-xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      {/* Modal Style Skill Selector Bar */}
      <div className="flex gap-3 mb-4">
        <button
          type="button"
          onClick={() => onSkillSelect('word')}
          className={`flex-1 py-2.5 px-4 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
            selectedSkill === 'word'
              ? 'bg-[#f5a623] text-black border-[#facc15] shadow-[0_0_15px_rgba(245,166,35,0.4)]'
              : 'bg-[#141923] text-amber-400 border-slate-800 hover:bg-[#1a2130]'
          }`}
        >
          <span className="bg-black/40 text-amber-300 px-1.5 py-0.5 rounded font-mono text-[11px]">[1]</span>
          <span className="uppercase tracking-wider">단어 (약공격)</span>
        </button>

        <button
          type="button"
          onClick={() => onSkillSelect('short')}
          className={`flex-1 py-2.5 px-4 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
            selectedSkill === 'short'
              ? 'bg-[#f97316] text-black border-[#fdba74] shadow-[0_0_15px_rgba(249,115,22,0.4)]'
              : 'bg-[#141923] text-orange-400 border-slate-800 hover:bg-[#1a2130]'
          }`}
        >
          <span className="bg-black/40 text-orange-300 px-1.5 py-0.5 rounded font-mono text-[11px]">[2]</span>
          <span className="uppercase tracking-wider">짧은 문장 (중공격 ↑)</span>
        </button>

        <button
          type="button"
          onClick={() => onSkillSelect('long')}
          className={`flex-1 py-2.5 px-4 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
            selectedSkill === 'long'
              ? 'bg-[#f43f5e] text-white border-[#fda4af] shadow-[0_0_15px_rgba(244,63,94,0.4)]'
              : 'bg-[#141923] text-rose-400 border-slate-800 hover:bg-[#1a2130]'
          }`}
        >
          <span className="bg-black/40 text-rose-300 px-1.5 py-0.5 rounded font-mono text-[11px]">[3]</span>
          <span className="uppercase tracking-wider">긴 문장 (강공격 ★대폭버프)</span>
        </button>
      </div>

      {/* Target Text Card (Modal-style Crisp Box) */}
      <div className="bg-[#05070c] rounded-lg p-4 mb-4 border border-slate-800 min-h-[75px] flex items-center justify-center text-center">
        <div className="text-xl md:text-2xl font-bold tracking-wide select-none font-sans">
          {targetText.split('').map((char, index) => {
            let colorClass = 'text-slate-500';
            if (index < inputText.length) {
              colorClass = inputText[index] === char ? 'text-emerald-400 font-extrabold' : 'text-rose-400 bg-rose-950/80 px-0.5 rounded';
            } else if (index === inputText.length) {
              colorClass = 'text-amber-300 underline underline-offset-4 font-black animate-pulse';
            }
            return (
              <span key={index} className={colorClass}>
                {char}
              </span>
            );
          })}
        </div>
      </div>

      {/* Input Box */}
      <div className="relative mb-3">
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder={disabled ? "대결 준비 중..." : "위 문장을 정확히 입력하세요! (숫자 1, 2, 3 키로 공격 변경)"}
          className="w-full bg-[#131a26] text-white text-lg font-semibold px-4 py-3 rounded-lg border border-amber-500/40 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-slate-600 font-sans"
          autoFocus
        />
      </div>

      {/* Stats Bar */}
      <div className="flex justify-between items-center px-2 text-xs font-mono font-bold text-slate-400">
        <div className="flex gap-5">
          <span className="text-amber-400">SPEED: <strong className="text-sm text-white font-sans">{cpm}</strong> CPM</span>
          <span className="text-emerald-400">ACCURACY: <strong className="text-sm text-white font-sans">{accuracy}%</strong></span>
        </div>
        <span className="text-slate-500 text-[11px] uppercase tracking-wider">
          NUM KEYS CHOOSE ATTACK MODE
        </span>
      </div>
    </div>
  );
};
