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

  // 언어 및 선택된 스킬 변경 시 새로운 문제 출제
  useEffect(() => {
    loadNewText(selectedSkill);
  }, [lang, selectedSkill]);

  // 키보드 1, 2, 3 누를 시 스킬 전환 및 텍스트 자동 로딩
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (disabled) return;
      if (e.key === '1') {
        onSkillSelect('word');
      } else if (e.key === '2') {
        onSkillSelect('short');
      } else if (e.key === '3') {
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
    const value = e.target.value;
    const now = Date.now();

    if (!startTime && value.length > 0) {
      setStartTime(now);
    }

    setInputText(value);

    // 타수(CPM) & 정확도 계산
    if (startTime && value.length > 0) {
      const elapsedSec = (now - startTime) / 1000;
      if (elapsedSec > 0) {
        const calculatedCpm = Math.round((value.length / elapsedSec) * 60);
        setCpm(calculatedCpm);
      }

      // 정확도 산출
      let correctChars = 0;
      for (let i = 0; i < value.length; i++) {
        if (value[i] === targetText[i]) correctChars++;
      }
      const acc = Math.round((correctChars / value.length) * 100);
      setAccuracy(isNaN(acc) ? 100 : acc);
    }

    // 완전히 정확하게 문장/단어를 완성했을 때 즉시 공격 발동!
    if (value === targetText) {
      const finalCpm = cpm || 250;
      onAttack({
        type: selectedSkill, // 'word' (약), 'short' (중), 'long' (강)
        cpm: finalCpm,
        accuracy: 100,
        text: targetText
      });
      // 공격 후 다음 문장 자동 출제
      loadNewText(selectedSkill);
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border-2 border-amber-500/60 rounded-xl p-4 shadow-xl backdrop-blur-md">
      {/* 1번 / 2번 / 3번 스킬 선택버튼 Bar */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => onSkillSelect('word')}
          className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 border ${
            selectedSkill === 'word'
              ? 'bg-amber-500 text-slate-950 border-yellow-300 shadow-[0_0_12px_#f59e0b]'
              : 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <span className="bg-slate-950 text-amber-300 px-2 py-0.5 rounded text-xs">1번</span>
          <span>단어 (약공격)</span>
        </button>

        <button
          type="button"
          onClick={() => onSkillSelect('short')}
          className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 border ${
            selectedSkill === 'short'
              ? 'bg-orange-500 text-slate-950 border-orange-300 shadow-[0_0_12px_#f97316]'
              : 'bg-slate-800 text-orange-400 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <span className="bg-slate-950 text-orange-300 px-2 py-0.5 rounded text-xs">2번</span>
          <span>짧은 문장 (중공격)</span>
        </button>

        <button
          type="button"
          onClick={() => onSkillSelect('long')}
          className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 border ${
            selectedSkill === 'long'
              ? 'bg-rose-600 text-white border-rose-400 shadow-[0_0_12px_#f43f5e]'
              : 'bg-slate-800 text-rose-400 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <span className="bg-slate-950 text-rose-300 px-2 py-0.5 rounded text-xs">3번</span>
          <span>긴 문장 (강공격)</span>
        </button>
      </div>

      {/* 타자 대상 문장 표시 (한컴 타자연습 스타일) */}
      <div className="bg-slate-950 rounded-lg p-4 mb-3 border border-slate-800 min-h-[70px] flex items-center justify-center text-center">
        <div className="text-xl md:text-2xl font-bold tracking-wide select-none">
          {targetText.split('').map((char, index) => {
            let colorClass = 'text-gray-400';
            if (index < inputText.length) {
              colorClass = inputText[index] === char ? 'text-emerald-400 font-extrabold' : 'text-rose-500 bg-rose-950/60 px-0.5 rounded';
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

      {/* 입력 창 */}
      <div className="relative mb-3">
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder={disabled ? "대결 준비 중..." : "위 문장을 정확히 입력하세요! (숫자 1, 2, 3 키로 공격 변경)"}
          className="w-full bg-slate-800/90 text-white text-lg font-semibold px-4 py-3 rounded-lg border border-amber-500/40 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30 transition-all placeholder:text-gray-500"
          autoFocus
        />
      </div>

      {/* 하단 타자 속도 (WPM/CPM) 및 정확도 현황판 */}
      <div className="flex justify-between items-center px-2 text-xs font-bold text-gray-300">
        <div className="flex gap-4">
          <span className="text-amber-400">⚡ 타수: <strong className="text-base text-white">{cpm}</strong> 타/분</span>
          <span className="text-emerald-400">🎯 정확도: <strong className="text-base text-white">{accuracy}%</strong></span>
        </div>
        <span className="text-gray-400 text-[11px]">
          입력 즉시 공격 발동! (빠른 타자 = 강력한 연타)
        </span>
      </div>
    </div>
  );
};
