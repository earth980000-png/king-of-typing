import React, { useState } from 'react';
import { CHARACTERS, GACHA_RATES } from '../data/characters';
import { soundEngine } from '../audio/soundEngine';
import confetti from 'canvas-confetti';

export const GachaModal = ({ isOpen, onClose, gold, onDeductGold, ownedCharIds, onUnlockCharacter, equippedCharId, onEquipCharacter }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [revealedChar, setRevealedChar] = useState(null);

  if (!isOpen) return null;

  const handleDraw = () => {
    if (gold < 100) {
      alert("골드가 부족합니다! (1회 뽑기 = 100 Gold)");
      return;
    }

    onDeductGold(100);
    setIsSpinning(true);
    setRevealedChar(null);

    const rand = Math.random();
    let selectedGrade = 'Common';
    if (rand < GACHA_RATES.Legendary) {
      selectedGrade = 'Legendary';
    } else if (rand < GACHA_RATES.Legendary + GACHA_RATES.Hidden) {
      selectedGrade = 'Hidden';
    } else if (rand < GACHA_RATES.Legendary + GACHA_RATES.Hidden + GACHA_RATES.Rare) {
      selectedGrade = 'Rare';
    }

    const gradeChars = CHARACTERS.filter(c => c.grade === selectedGrade);
    const chosen = gradeChars[Math.floor(Math.random() * gradeChars.length)];

    setTimeout(() => {
      setIsSpinning(false);
      setRevealedChar(chosen);
      onUnlockCharacter(chosen.id);
      soundEngine.playGachaReveal(chosen.grade);

      if (chosen.grade === 'Legendary' || chosen.grade === 'Hidden') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-4 border-amber-500/80 rounded-2xl w-full max-w-2xl p-6 text-white shadow-[0_0_35px_rgba(245,158,11,0.5)]">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6 border-b border-amber-500/40 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎁</span>
            <div>
              <h2 className="text-2xl font-black italic text-amber-400">KOF / 철권 캐릭터 상점</h2>
              <p className="text-xs text-gray-400">골드를 모아 전설과 히든 격투가를 뽑고 장착하세요!</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-amber-950 border border-amber-500 text-amber-300 px-3 py-1 rounded-full text-sm font-bold">
              💰 {gold} GOLD
            </span>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white font-bold text-xl px-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 메인 뽑기 영역 */}
        <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 mb-6 text-center relative overflow-hidden">
          {isSpinning ? (
            <div className="py-12 flex flex-col items-center justify-center animate-pulse">
              <div className="w-20 h-20 border-8 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-lg font-bold text-amber-300">캡슐 뽑는 중... 전설 전사가 나올까요?!</p>
            </div>
          ) : revealedChar ? (
            <div className="py-4 flex flex-col items-center animate-bounce">
              <div 
                className="w-24 h-24 rounded-full overflow-hidden border-4 mb-3 shadow-lg bg-slate-900"
                style={{ borderColor: revealedChar.color }}
                dangerouslySetInnerHTML={{ __html: revealedChar.avatarSvg || '' }}
              />
              <span className={`text-xs font-bold px-3 py-1 rounded-full mb-1 ${
                revealedChar.grade === 'Legendary' ? 'bg-rose-600 text-white animate-pulse' :
                revealedChar.grade === 'Hidden' ? 'bg-purple-600 text-white' :
                revealedChar.grade === 'Rare' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
              }`}>
                {revealedChar.grade}
              </span>
              <h3 className="text-2xl font-black text-white">{revealedChar.name}</h3>
              <p className="text-xs text-amber-300 font-bold mt-0.5">{revealedChar.title}</p>
              <p className="text-xs text-gray-400 font-semibold mt-1">{revealedChar.effectDesc}</p>
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center">
              <div className="text-6xl mb-4 animate-bounce">🎰</div>
              <p className="text-gray-300 font-bold mb-2">1회 뽑기 비용: <span className="text-amber-400 font-black">100 GOLD</span></p>
              <button
                onClick={handleDraw}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-lg px-8 py-3 rounded-xl shadow-[0_0_20px_#f59e0b] border-2 border-yellow-300 transition-all transform hover:scale-105"
              >
                격투가 뽑기! 🎁
              </button>
            </div>
          )}
        </div>

        {/* 보유 캐릭터 도감 및 장착 바 */}
        <h4 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
          <span>🎮 보유 격투가 도감 & 장착</span>
          <span className="text-xs text-amber-400">({ownedCharIds.length} / {CHARACTERS.length} 수집)</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-52 overflow-y-auto pr-1">
          {CHARACTERS.map((char) => {
            const isOwned = ownedCharIds.includes(char.id);
            const isEquipped = equippedCharId === char.id;

            return (
              <div 
                key={char.id}
                className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                  isEquipped ? 'bg-amber-950/80 border-amber-400 shadow-[0_0_12px_#f59e0b]' :
                  isOwned ? 'bg-slate-800 border-slate-700 hover:border-slate-500' : 'bg-slate-950/60 border-slate-900 opacity-40'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-black/60 text-gray-300">
                      {char.grade}
                    </span>
                    {isEquipped && <span className="text-[10px] font-black text-amber-400">EQUIPPED</span>}
                  </div>
                  
                  {/* Avatar SVG Portrait */}
                  <div className="w-12 h-12 rounded-full overflow-hidden mx-auto mb-2 border border-slate-700 bg-slate-900">
                    <div dangerouslySetInnerHTML={{ __html: char.avatarSvg || '' }} className="w-full h-full" />
                  </div>

                  <div className="font-bold text-xs truncate text-center text-white mb-0.5">{char.name}</div>
                  <div className="text-[10px] text-amber-400 text-center font-semibold mb-1">{char.title}</div>
                  <div className="text-[9px] text-gray-400 text-center line-clamp-2">{char.effectDesc}</div>
                </div>

                {isOwned ? (
                  <button
                    disabled={isEquipped}
                    onClick={() => onEquipCharacter(char.id)}
                    className={`mt-2 py-1 px-2 text-xs font-bold rounded transition-all ${
                      isEquipped ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 hover:bg-amber-600 hover:text-white text-gray-200'
                    }`}
                  >
                    {isEquipped ? '장착 중' : '장착하기'}
                  </button>
                ) : (
                  <div className="mt-2 py-1 text-[10px] text-center font-bold text-gray-600 bg-slate-900 rounded">
                    미보유
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
