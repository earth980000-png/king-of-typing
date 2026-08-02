import React, { useState, useEffect } from 'react';
import { 
  loginWithGoogle, 
  loginAnonymously, 
  logoutUser, 
  subscribeAuthState,
  saveUserData,
  loadUserData,
  isFirebaseConfigured
} from './firebase';
import { ArcadeCanvas } from './components/ArcadeCanvas';
import { TypingPanel } from './components/TypingPanel';
import { GachaModal } from './components/GachaModal';
import { MultiplayerLobby } from './components/MultiplayerLobby';
import { CHARACTERS } from './data/characters';
import { soundEngine } from './audio/soundEngine';
import confetti from 'canvas-confetti';

export function App() {
  const [user, setUser] = useState(null);
  const [gold, setGold] = useState(300);
  const [ownedCharIds, setOwnedCharIds] = useState(['kyo', 'iori']);
  const [equippedCharId, setEquippedCharId] = useState('kyo');
  const [userTeam, setUserTeam] = useState('flame');
  const [lang, setLang] = useState('ko');

  const [gameMode, setGameMode] = useState('menu');
  const [stage, setStage] = useState(1);

  const [playerHp, setPlayerHp] = useState(100);
  const [maxPlayerHp, setMaxPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [maxEnemyHp, setMaxEnemyHp] = useState(100);

  const [playerAction, setPlayerAction] = useState('idle');
  const [enemyAction, setEnemyAction] = useState('idle');

  const [selectedSkill, setSelectedSkill] = useState('word');
  const [combo, setCombo] = useState(0);
  const [isSuperMoveActive, setIsSuperMoveActive] = useState(false);
  const [gameOverResult, setGameOverResult] = useState(null);

  const [isGachaOpen, setIsGachaOpen] = useState(false);
  const [multiOpponent, setMultiOpponent] = useState(null);

  useEffect(() => {
    const unsub = subscribeAuthState(async (usr) => {
      setUser(usr);
      if (usr) {
        const profile = await loadUserData(usr.uid);
        if (profile) {
          if (profile.gold !== undefined) setGold(profile.gold);
          if (profile.ownedCharIds) setOwnedCharIds(profile.ownedCharIds);
          if (profile.equippedCharId) setEquippedCharId(profile.equippedCharId);
          if (profile.userTeam) setUserTeam(profile.userTeam);
        }
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (user) {
      saveUserData(user.uid, {
        gold,
        ownedCharIds,
        equippedCharId,
        userTeam,
        displayName: user.displayName || '선수'
      });
    }
  }, [user, gold, ownedCharIds, equippedCharId, userTeam]);

  const equippedChar = CHARACTERS.find(c => c.id === equippedCharId) || CHARACTERS[0];

  const getEnemyCharForStage = (stg) => {
    if (stg === 7) return CHARACTERS.find(c => c.id === 'orochi_iori') || CHARACTERS[1];
    if (stg >= 5) return CHARACTERS.find(c => c.id === 'cyber_mecha') || CHARACTERS[5];
    if (stg >= 3) return CHARACTERS.find(c => c.id === 'chunli') || CHARACTERS[2];
    return CHARACTERS[1];
  };

  const enemyChar = gameMode === 'multi' && multiOpponent
    ? CHARACTERS.find(c => c.id === multiOpponent.opponentCharId) || CHARACTERS[1]
    : gameMode === 'practice'
    ? { id: 'sandbag', name: '연습용 샌드백', color: '#94a3b8', grade: 'Common', attackMultiplier: 0 }
    : getEnemyCharForStage(stage);

  useEffect(() => {
    if (gameMode !== 'solo' || enemyHp <= 0 || playerHp <= 0) return;

    const intervalMs = Math.max(1200, 3800 - stage * 400);

    const timer = setInterval(() => {
      setEnemyAction('punch');
      soundEngine.playKick();

      const dmg = 8 + stage * 2;
      setPlayerHp(prev => {
        const next = prev - dmg;
        if (next <= 0) {
          handleGameOver('lose');
        }
        return Math.max(0, next);
      });

      setTimeout(() => setEnemyAction('idle'), 400);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [gameMode, stage, enemyHp, playerHp]);

  const startSoloGame = (stg = 1) => {
    setStage(stg);
    const pMaxHp = Math.round(100 * (equippedChar.attackMultiplier || 1));
    const eMaxHp = gameMode === 'practice' ? 9999 : 80 + stg * 25;

    setPlayerHp(pMaxHp);
    setMaxPlayerHp(pMaxHp);
    setEnemyHp(eMaxHp);
    setMaxEnemyHp(eMaxHp);

    setCombo(0);
    setGameOverResult(null);
    setGameMode('solo');
  };

  const startPracticeGame = () => {
    setPlayerHp(100);
    setMaxPlayerHp(100);
    setEnemyHp(9999);
    setMaxEnemyHp(9999);
    setCombo(0);
    setGameOverResult(null);
    setGameMode('practice');
  };

  const startMultiMatchGame = (opponentInfo) => {
    setMultiOpponent(opponentInfo);
    setPlayerHp(100);
    setMaxPlayerHp(100);
    setEnemyHp(100);
    setMaxEnemyHp(100);
    setCombo(0);
    setGameOverResult(null);
    setGameMode('multi');
  };

  const handlePlayerAttack = ({ type, cpm }) => {
    let actionType = 'punch';
    let baseDamage = 12;

    if (type === 'short') {
      actionType = 'kick';
      baseDamage = 24;
    } else if (type === 'long') {
      actionType = 'fireball';
      baseDamage = 45;
    }

    const charMultiplier = equippedChar.attackMultiplier || 1.0;
    let finalDamage = Math.round(baseDamage * charMultiplier);

    const nextCombo = combo + 1;
    setCombo(nextCombo);
    soundEngine.playComboChime(nextCombo);

    if (nextCombo % 5 === 0) {
      setIsSuperMoveActive(true);
      soundEngine.playSuperSpecial();
      finalDamage = Math.round(finalDamage * 1.8);
      setTimeout(() => setIsSuperMoveActive(false), 1400);
    }

    if (actionType === 'punch') soundEngine.playPunch();
    else if (actionType === 'kick') soundEngine.playKick();
    else soundEngine.playFireball();

    setPlayerAction(actionType);
    setTimeout(() => setPlayerAction('idle'), 500);

    setEnemyHp(prev => {
      const next = prev - finalDamage;
      if (next <= 0 && gameMode !== 'practice') {
        handleGameOver('win');
      }
      return Math.max(0, next);
    });
  };

  const handleGameOver = (result) => {
    setGameOverResult(result);
    if (result === 'win') {
      soundEngine.playVictory();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });

      const baseGold = 150 + stage * 30;
      const goldBonusMult = 1 + (equippedChar.goldBonus || 0);
      const earnedGold = Math.round(baseGold * goldBonusMult);

      setGold(g => g + earnedGold);
    } else {
      setGold(g => g + 30);
    }
  };

  const handleEquipCharacter = (charId) => {
    setEquippedCharId(charId);
    const selectedChar = CHARACTERS.find(c => c.id === charId) || CHARACTERS[0];
    const newMaxHp = Math.round(100 * (selectedChar.attackMultiplier || 1.0));
    setMaxPlayerHp(newMaxHp);
    setPlayerHp(newMaxHp);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans select-none border-t-2 border-[#f5a623]">
      {/* Modal Style Dark Header */}
      <header className="bg-[#0b0e14]/90 border-b border-slate-800/80 py-3 px-6 flex justify-between items-center shadow-lg backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div 
            onClick={() => setGameMode('menu')} 
            className="cursor-pointer flex items-center gap-2.5 group"
          >
            <span className="text-2xl">🥊</span>
            <div>
              <h1 className="text-xl font-black italic tracking-widest text-white group-hover:text-[#f5a623] transition-colors">
                타자 킹 <span className="text-xs font-mono font-normal text-[#f5a623]">KING OF TYPING</span>
              </h1>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">MODAL-STYLE DESIGN SYSTEM</p>
            </div>
          </div>

          <div className="flex bg-[#05070c] p-1 rounded-md border border-slate-800 text-xs font-mono font-bold ml-4">
            <button 
              onClick={() => setLang('ko')}
              className={`px-3 py-1 rounded transition-all ${lang === 'ko' ? 'bg-[#f5a623] text-black font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              KR
            </button>
            <button 
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded transition-all ${lang === 'en' ? 'bg-[#f5a623] text-black font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-[#05070c] px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-[11px] font-mono text-slate-500 uppercase">EQUIPPED:</span>
            <span className="text-xs font-mono font-bold text-amber-400">{equippedChar.name}</span>
          </div>

          <div 
            onClick={() => setIsGachaOpen(true)}
            className="cursor-pointer bg-[#141923] border border-amber-500/50 text-amber-300 px-3.5 py-1.5 rounded-lg font-mono font-extrabold text-xs flex items-center gap-2 hover:bg-[#1a2130] transition-all shadow-[0_0_12px_rgba(245,166,35,0.2)]"
          >
            <span>💰</span>
            <span>{gold} GOLD</span>
          </div>

          <button
            onClick={() => setIsGachaOpen(true)}
            className="bg-[#f5a623] hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider px-3.5 py-2 rounded-lg shadow-sm transition-transform transform hover:scale-105"
          >
            🎁 CHARACTER SHOP
          </button>

          {user ? (
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="font-bold text-slate-300">{user.displayName || 'PLAYER'}</span>
              <button 
                onClick={logoutUser}
                className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-800"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <div className="flex gap-2 font-mono">
              <button
                onClick={loginWithGoogle}
                className="text-xs bg-[#141923] hover:bg-[#1a2130] text-amber-300 px-3 py-1.5 rounded-md border border-amber-500/40 font-bold"
              >
                GOOGLE LOGIN
              </button>
              <button
                onClick={loginAnonymously}
                className="text-xs bg-[#090c12] hover:bg-slate-900 text-slate-400 px-2.5 py-1.5 rounded-md border border-slate-800"
              >
                GUEST
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-5xl mx-auto w-full">
        {gameMode === 'menu' && (
          <div className="w-full text-center flex flex-col items-center py-8 animate-fadeIn">
            <div className="mb-8">
              <div className="inline-block bg-[#141923] border border-amber-500/40 px-3.5 py-1 rounded-full text-amber-400 text-xs font-mono font-bold uppercase tracking-widest mb-4">
                🔥 KOF 98 × HIGH-SPEED TYPING ACTION ENGINE
              </div>
              <h2 className="text-5xl md:text-6xl font-black italic tracking-tight text-white mb-3">
                타자 킹 <span className="text-[#f5a623] font-mono">: K.O.T</span>
              </h2>
              <p className="text-slate-400 text-sm max-w-lg mx-auto font-sans leading-relaxed">
                숫자 <strong className="text-amber-400 font-mono">[1]번(단어)</strong>, <strong className="text-orange-400 font-mono">[2]번(짧은 문장)</strong>, <strong className="text-rose-400 font-mono">[3]번(긴 문장)</strong> 키를 눌러 
                빠르고 정확하게 타자를 치고 상대 AI 및 친구를 KO 시키세요!
              </p>
            </div>

            {/* Mode Cards (Modal-style Dark Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-8">
              <button
                onClick={startPracticeGame}
                className="group bg-[#0c1017] hover:bg-[#121824] border border-slate-800 hover:border-amber-400 rounded-xl p-6 text-left transition-all transform hover:-translate-y-1 shadow-lg"
              >
                <div className="text-3xl mb-3">🥊</div>
                <h3 className="text-xl font-bold text-white group-hover:text-[#f5a623] transition-colors">연습실</h3>
                <p className="text-xs font-sans text-slate-500 mt-2">샌드백을 치며 자유롭게 타자 속도(WPM)와 정확도를 측정해보세요.</p>
              </button>

              <button
                onClick={() => startSoloGame(1)}
                className="group bg-gradient-to-b from-[#141923] to-[#0c1017] border border-amber-500/50 hover:border-amber-400 rounded-xl p-6 text-left transition-all transform hover:-translate-y-1 shadow-[0_4px_20px_rgba(245,166,35,0.15)]"
              >
                <div className="text-3xl mb-3">🏆</div>
                <h3 className="text-xl font-bold text-[#f5a623]">솔로 플레이</h3>
                <p className="text-xs font-sans text-slate-400 mt-2">1단계부터 7단계(KOF 최종 보스)까지 단계별 컴퓨터 AI와 1v1 대결!</p>
              </button>

              <button
                onClick={() => setGameMode('multi_match')}
                className="group bg-[#0c1017] hover:bg-[#121824] border border-slate-800 hover:border-orange-400 rounded-xl p-6 text-left transition-all transform hover:-translate-y-1 shadow-lg"
              >
                <div className="text-3xl mb-3">⚔️</div>
                <h3 className="text-2xl font-bold text-white group-hover:text-orange-400 transition-colors">멀티 플레이</h3>
                <p className="text-xs font-sans text-slate-500 mt-2">같은 팀 소속 친구와 각자의 컴퓨터에서 실시간 1v1 랜덤 매칭 대결!</p>
              </button>
            </div>
          </div>
        )}

        {gameMode === 'multi_match' && (
          <MultiplayerLobby 
            user={user}
            userTeam={userTeam}
            onSelectTeam={setUserTeam}
            onStartMatch={startMultiMatchGame}
            onBack={() => setGameMode('menu')}
          />
        )}

        {(gameMode === 'solo' || gameMode === 'practice' || gameMode === 'multi') && (
          <div className="w-full flex flex-col gap-4 animate-fadeIn">
            <ArcadeCanvas 
              playerChar={equippedChar}
              enemyChar={enemyChar}
              playerHp={playerHp}
              maxPlayerHp={maxPlayerHp}
              enemyHp={enemyHp}
              maxEnemyHp={maxEnemyHp}
              playerAction={playerAction}
              enemyAction={enemyAction}
              combo={combo}
              isSuperMoveActive={isSuperMoveActive}
              stage={stage}
              mode={gameMode}
            />

            <TypingPanel 
              lang={lang}
              onAttack={handlePlayerAttack}
              onSkillSelect={setSelectedSkill}
              selectedSkill={selectedSkill}
              disabled={gameOverResult !== null}
            />
          </div>
        )}

        {gameOverResult && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0c1017] border-2 border-amber-500/80 rounded-2xl max-w-md w-full p-6 text-center shadow-[0_0_50px_rgba(245,166,35,0.4)] animate-bounce">
              <div className="text-6xl mb-2">{gameOverResult === 'win' ? '🏆' : '💀'}</div>
              <h3 className="text-3xl font-black italic text-[#f5a623] mb-1">
                {gameOverResult === 'win' ? 'K.O. VICTORY!' : 'DEFEATED...'}
              </h3>
              <p className="text-xs font-mono text-slate-400 mb-4">
                {gameOverResult === 'win' 
                  ? `CONGRATULATIONS! OPPONENT DEFEATED.` 
                  : 'TRY AGAIN WITH HIGHER TYPING SPEED!'}
              </p>

              <div className="bg-[#05070c] p-4 rounded-xl border border-slate-800 mb-6 text-left text-xs font-mono space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">GOLD EARNED:</span>
                  <span className="font-bold text-amber-300">
                    +{gameOverResult === 'win' ? Math.round((150 + stage * 30) * (1 + (equippedChar.goldBonus || 0))) : 30} GOLD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">MAX COMBO:</span>
                  <span className="font-bold text-yellow-400">{combo} COMBO</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setGameMode('menu')}
                  className="flex-1 bg-[#141923] hover:bg-slate-800 text-slate-300 py-3 rounded-lg font-mono font-bold text-xs border border-slate-700"
                >
                  MAIN MENU
                </button>
                {gameMode === 'solo' && gameOverResult === 'win' && stage < 7 ? (
                  <button
                    onClick={() => startSoloGame(stage + 1)}
                    className="flex-1 bg-[#f5a623] hover:bg-amber-400 text-black py-3 rounded-lg font-mono font-black text-xs uppercase shadow-[0_0_15px_rgba(245,166,35,0.4)]"
                  >
                    STAGE {stage + 1}!
                  </button>
                ) : (
                  <button
                    onClick={() => startSoloGame(stage)}
                    className="flex-1 bg-[#f5a623] hover:bg-amber-400 text-black py-3 rounded-lg font-mono font-black text-xs uppercase shadow-[0_0_15px_rgba(245,166,35,0.4)]"
                  >
                    RETRY 🥊
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <GachaModal 
        isOpen={isGachaOpen}
        onClose={() => setIsGachaOpen(false)}
        gold={gold}
        onDeductGold={(amt) => setGold(g => g - amt)}
        ownedCharIds={ownedCharIds}
        onUnlockCharacter={(id) => setOwnedCharIds(prev => prev.includes(id) ? prev : [...prev, id])}
        equippedCharId={equippedCharId}
        onEquipCharacter={handleEquipCharacter}
      />
    </div>
  );
}

export default App;
