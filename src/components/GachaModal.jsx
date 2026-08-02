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
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0c1017] border border-amber-500/40 rounded-2xl w-full max-w-2xl p-6 text-white shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎁</span>
            <div>
              <h2 className="text-2xl font-black italic text-[#f5a623] tracking-wide">KOF / 철권 캐릭터 상점</h2>
              <p className="text-xs font-mono text-slate-400">CHARACTER GACHA & INVENTORY SYSTEM</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-[#141923] border border-amber-500/50 text-amber-300 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold">
              💰 {gold} GOLD
            </span>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white font-bold text-xl px-2 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Draw Box */}
        <div className="bg-[#05070c] rounded-xl p-6 border border-slate-800 mb-6 text-center relative overflow-hidden">
          {isSpinning ? (
            <div className="py-12 flex flex-col items-center justify-center animate-pulse">
              <div className="w-16 h-16 border-4 border-[#f5a623] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm font-mono font-bold text-amber-300 uppercase tracking-widest">SPINNING CAPSULE...</p>
            </div>
          ) : revealedChar ? (
            <div className="py-2 flex flex-col items-center">
              <div 
                className="w-20 h-20 rounded-full overflow-hidden border-4 mb-2 shadow-lg bg-slate-900"
                style={{ borderColor: revealedChar.color }}
                dangerouslySetInnerHTML={{ __html: revealedChar.avatarSvg || '' }}
              />
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md mb-1 ${
                revealedChar.grade === 'Legendary' ? 'bg-rose-600 text-white animate-pulse' :
                revealedChar.grade === 'Hidden' ? 'bg-purple-600 text-white' :
                revealedChar.grade === 'Rare' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
              }`}>
                {revealedChar.grade}
              </span>
              <h3 className="text-xl font-black text-white">{revealedChar.name}</h3>
              <p className="text-xs text-amber-300 font-bold mt-0.5">{revealedChar.title}</p>
              
              {/* 연속 뽑기 버튼 */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleDraw}
                  className="bg-[#f5a623] hover:bg-amber-400 text-black font-black text-xs uppercase tracking-widest px-6 py-2.5 rounded-lg shadow-[0_0_15px_rgba(245,166,35,0.4)] border border-yellow-200 transition-all transform hover:scale-105"
                >
                  한 번 더 뽑기! 🎁 (100G)
                </button>
                {equippedCharId !== revealedChar.id && (
                  <button
                    onClick={() => onEquipCharacter(revealedChar.id)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-all"
                  >
                    바로 장착 ⚔️
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center">
              <div className="text-6xl mb-4 animate-bounce">🎰</div>
              <p className="text-slate-300 font-mono text-xs mb-3">GACHA PRICE: <span className="text-[#f5a623] font-bold">100 GOLD</span></p>
              <button
                onClick={handleDraw}
                className="bg-[#f5a623] hover:bg-amber-400 text-black font-black text-sm uppercase tracking-widest px-8 py-3 rounded-lg shadow-[0_0_20px_rgba(245,166,35,0.4)] border border-yellow-200 transition-all transform hover:scale-105"
              >
                격투가 뽑기! 🎁
              </button>
            </div>
          )}
        </div>

        {/* Inventory Cards */}
        <h4 className="text-xs font-mono font-bold text-slate-400 mb-3 flex items-center justify-between uppercase tracking-wider">
          <span>CHARACTER COLLECTION</span>
          <span className="text-amber-400">({ownedCharIds.length} / {CHARACTERS.length} OWNED)</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto pr-1">
          {CHARACTERS.map((char) => {
            const isOwned = ownedCharIds.includes(char.id);
            const isEquipped = equippedCharId === char.id;

            return (
              <div 
                key={char.id}
                className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                  isEquipped ? 'bg-[#1a2130] border-[#f5a623] shadow-[0_0_12px_rgba(245,166,35,0.4)]' :
                  isOwned ? 'bg-[#141923] border-slate-800 hover:border-slate-700' : 'bg-[#080b10] border-slate-900 opacity-40'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-black/80 text-slate-300 uppercase">
                      {char.grade}
                    </span>
                    {isEquipped && <span className="text-[9px] font-mono font-black text-[#f5a623]">EQUIPPED</span>}
                  </div>
                  
                  <div className="w-10 h-10 rounded-full overflow-hidden mx-auto mb-1 border border-slate-800 bg-slate-950">
                    <div dangerouslySetInnerHTML={{ __html: char.avatarSvg || '' }} className="w-full h-full" />
                  </div>

                  <div className="font-bold text-[11px] truncate text-center text-white">{char.name}</div>
                  <div className="text-[9px] text-amber-400 text-center font-semibold">{char.title}</div>
                </div>

                {isOwned ? (
                  <button
                    disabled={isEquipped}
                    onClick={() => onEquipCharacter(char.id)}
                    className={`mt-2 py-1 px-2 text-[10px] font-mono font-bold rounded transition-all ${
                      isEquipped ? 'bg-[#f5a623] text-black' : 'bg-slate-800 hover:bg-amber-600 hover:text-white text-slate-200'
                    }`}
                  >
                    {isEquipped ? 'EQUIPPED' : 'EQUIP'}
                  </button>
                ) : (
                  <div className="mt-2 py-1 text-[9px] text-center font-mono font-bold text-slate-600 bg-slate-950 rounded">
                    LOCKED
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
