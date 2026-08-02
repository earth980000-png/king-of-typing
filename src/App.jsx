import React, { useState, useEffect } from 'react';
import { 
  loginWithGoogle, 
  loginAnonymously, 
  logoutUser, 
  subscribeAuthState,
  saveUserData,
  loadUserData,
  getLeaderboard,
  isFirebaseConfigured,
  checkRedirectResult
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
  const [maxCpm, setMaxCpm] = useState(0);
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

  // 이번 판 타수 및 CPM 기록 통계
  const [matchCpmList, setMatchCpmList] = useState([]);
  const [avgCpm, setAvgCpm] = useState(0);

  const [isGachaOpen, setIsGachaOpen] = useState(false);
  const [isHallOfFameOpen, setIsHallOfFameOpen] = useState(false);
  const [leaderboardList, setLeaderboardList] = useState([]);
  const [isBGMOn, setIsBGMOn] = useState(false);
  const [multiOpponent, setMultiOpponent] = useState(null);

  // 리다이렉트 및 로그인 상태 복원
  useEffect(() => {
    checkRedirectResult();
  }, []);

  useEffect(() => {
    const unsub = subscribeAuthState(async (usr) => {
      setUser(usr);
      if (usr) {
        const profile = await loadUserData(usr.uid);
        if (profile) {
          if (profile.gold !== undefined) setGold(profile.gold);
          if (profile.ownedCharIds && profile.ownedCharIds.length > 0) setOwnedCharIds(profile.ownedCharIds);
          if (profile.equippedCharId) setEquippedCharId(profile.equippedCharId);
          if (profile.maxCpm !== undefined) setMaxCpm(profile.maxCpm);
        }
      }
    });
    return () => unsub();
  }, []);

  // 유저 데이터 변경 시 Firebase 저장 보장
  useEffect(() => {
    if (user) {
      saveUserData(user.uid, {
        gold,
        ownedCharIds,
        equippedCharId,
        maxCpm,
        displayName: user.displayName || '격투가'
      });
    }
  }, [user, gold, ownedCharIds, equippedCharId, maxCpm]);

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

  // 솔로 플레이 AI 난이도
  useEffect(() => {
    if (gameMode !== 'solo' || enemyHp <= 0 || playerHp <= 0) return;

    const intervalMs = Math.max(2200, 4800 - stage * 400);

    const timer = setInterval(() => {
      setEnemyAction('punch');
      soundEngine.playHurt();

      const dmg = Math.round(5 + stage * 1.5);
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
    const eMaxHp = gameMode === 'practice' ? 9999 : 70 + stg * 20;

    setPlayerHp(pMaxHp);
    setMaxPlayerHp(pMaxHp);
    setEnemyHp(eMaxHp);
    setMaxEnemyHp(eMaxHp);

    setCombo(0);
    setMatchCpmList([]);
    setAvgCpm(0);
    setGameOverResult(null);
    setGameMode('solo');
  };

  const startPracticeGame = () => {
    setPlayerHp(100);
    setMaxPlayerHp(100);
    setEnemyHp(9999);
    setMaxEnemyHp(9999);
    setCombo(0);
    setMatchCpmList([]);
    setAvgCpm(0);
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
    setMatchCpmList([]);
    setAvgCpm(0);
    setGameOverResult(null);
    setGameMode('multi');
  };

  const goToMainMenu = () => {
    setGameOverResult(null);
    setGameMode('menu');
  };

  const handleNextStage = () => {
    setGameOverResult(null);
    startSoloGame(stage + 1);
  };

  const handleRetryStage = () => {
    setGameOverResult(null);
    startSoloGame(stage);
  };

  const handlePlayerAttack = ({ type, cpm: attackCpm }) => {
    let actionType = 'punch';
    let baseDamage = 6;

    if (type === 'short') {
      actionType = 'kick';
      baseDamage = 35;
    } else if (type === 'long') {
      actionType = 'fireball';
      baseDamage = 75;
    }

    if (attackCpm > 0) {
      setMatchCpmList(prev => [...prev, attackCpm]);
    }

    const charMultiplier = equippedChar.attackMultiplier || 1.0;
    let finalDamage = Math.round(baseDamage * charMultiplier);

    const nextCombo = combo + 1;
    setCombo(nextCombo);
    soundEngine.playComboChime(nextCombo);

    if (nextCombo % 5 === 0) {
      setIsSuperMoveActive(true);
      soundEngine.playSuperSpecial();
      finalDamage = Math.round(finalDamage * 2.2);
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
    let calculatedAvgCpm = 0;
    if (matchCpmList.length > 0) {
      const sum = matchCpmList.reduce((acc, val) => acc + val, 0);
      calculatedAvgCpm = Math.round(sum / matchCpmList.length);
    } else {
      calculatedAvgCpm = 320;
    }
    setAvgCpm(calculatedAvgCpm);

    if (calculatedAvgCpm > maxCpm) {
      setMaxCpm(calculatedAvgCpm);
    }

    setGameOverResult(result);

    if (result === 'win') {
      soundEngine.playVictory();
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });

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

  const toggleBGM = () => {
    if (isBGMOn) {
      soundEngine.stopBGM();
      setIsBGMOn(false);
    } else {
      soundEngine.startBGM();
      setIsBGMOn(true);
    }
  };

  const openHallOfFame = async () => {
    setIsHallOfFameOpen(true);
    const list = await getLeaderboard();
    setLeaderboardList(list);
  };

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans select-none border-t-4 border-[#f5a623]">
      {/* KOF Style Arcade Header */}
      <header className="bg-[#0a0d14]/95 border-b border-amber-500/40 py-3 px-6 flex justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.8)] backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div 
            onClick={goToMainMenu} 
            className="cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(245,166,35,0.6)] group-hover:scale-110 transition-transform">
              🥊
            </div>
            <div>
              <h1 className="text-xl font-black italic tracking-widest text-white group-hover:text-[#f5a623] transition-colors flex items-center gap-2">
                킹 오브 타이핑 <span className="text-xs font-mono font-extrabold text-[#f5a623] bg-black/60 px-2 py-0.5 rounded border border-amber-500/40">K.O.T</span>
              </h1>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">RETRO ARCADE FIGHTING ENGINE</p>
            </div>
          </div>

          <div className="flex bg-[#05070c] p-1 rounded-md border border-slate-800 text-xs font-mono font-bold ml-2">
            <button 
              onClick={() => setLang('ko')}
              className={`px-2.5 py-1 rounded transition-all ${lang === 'ko' ? 'bg-[#f5a623] text-black font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              KR
            </button>
            <button 
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded transition-all ${lang === 'en' ? 'bg-[#f5a623] text-black font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
          </div>

          <button 
            onClick={toggleBGM}
            className={`border px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
              isBGMOn 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,166,35,0.3)]' 
                : 'bg-[#05070c] text-slate-400 border-slate-800 hover:text-amber-400'
            }`}
          >
            {isBGMOn ? '🔊 BGM ON' : '🔇 BGM OFF'}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openHallOfFame}
            className="bg-[#141923] hover:bg-[#1a2130] text-yellow-400 border border-yellow-500/50 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all hover:scale-105"
          >
            👑 명예의 전당
          </button>

          <div 
            onClick={() => setIsGachaOpen(true)}
            className="cursor-pointer bg-[#141923] border border-amber-500/50 text-amber-300 px-3.5 py-1.5 rounded-lg font-mono font-extrabold text-xs flex items-center gap-2 hover:bg-[#1a2130] transition-all"
          >
            <span>💰</span>
            <span>{gold} GOLD</span>
          </div>

          <button
            onClick={() => setIsGachaOpen(true)}
            className="bg-[#f5a623] hover:bg-amber-400 text-black font-mono font-black text-xs uppercase tracking-wider px-3.5 py-2 rounded-lg shadow-[0_0_15px_rgba(245,166,35,0.3)] transition-transform transform hover:scale-105"
          >
            🎁 상점
          </button>

          {user ? (
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="font-bold text-slate-300">{user.displayName || '선수'}</span>
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-5xl mx-auto w-full">
        {gameMode === 'menu' && (
          <div className="w-full text-center flex flex-col items-center py-4 animate-fadeIn">
            {/* KOF 98 아케이드 스포트라이트 스테이지 */}
            <div 
              className="relative w-full max-w-3xl border-4 border-amber-500 rounded-3xl p-8 mb-8 shadow-[0_0_60px_rgba(245,166,35,0.4)] overflow-hidden bg-cover bg-center"
              style={{ 
                backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(2, 6, 23, 0.85)), url("https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200&auto=format&fit=crop")` 
              }}
            >
              <div className="absolute -top-24 left-1/4 w-48 h-96 bg-amber-400/20 blur-3xl transform -rotate-45 pointer-events-none animate-pulse" />
              <div className="absolute -top-24 right-1/4 w-48 h-96 bg-red-600/20 blur-3xl transform rotate-45 pointer-events-none animate-pulse" />

              <div className="inline-flex items-center gap-2 bg-black/80 border-2 border-amber-400 px-5 py-1.5 rounded-full text-amber-300 text-xs font-mono font-black uppercase tracking-widest mb-6 shadow-[0_0_20px_#f59e0b]">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span>KOF '98 RETRO TYPING CHAMPIONSHIP</span>
              </div>

              <div className="relative mb-6">
                <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-red-500 drop-shadow-[0_6px_15px_rgba(0,0,0,1)]">
                  킹 오브 타이핑
                </h1>
                <div className="text-2xl md:text-3xl font-black italic text-amber-300 tracking-widest font-mono mt-1 drop-shadow-[0_0_10px_#f59e0b] flex items-center justify-center gap-3">
                  <span className="text-red-500">THE KING OF</span>
                  <span className="text-yellow-300">FIGHTERS</span>
                  <span className="text-amber-400">'98</span>
                </div>
              </div>

              <div className="flex justify-center items-center gap-6 mb-6">
                <div className="w-14 h-14 rounded-full border-2 border-amber-400 bg-slate-900/90 overflow-hidden shadow-[0_0_15px_#f59e0b]">
                  <div dangerouslySetInnerHTML={{ __html: CHARACTERS[0].avatarSvg }} className="w-full h-full" />
                </div>
                <div className="font-black italic text-2xl text-red-500 animate-bounce">VS</div>
                <div className="w-14 h-14 rounded-full border-2 border-red-500 bg-slate-900/90 overflow-hidden shadow-[0_0_15px_#ef4444]">
                  <div dangerouslySetInnerHTML={{ __html: CHARACTERS[1].avatarSvg }} className="w-full h-full" />
                </div>
              </div>

              <p className="text-slate-200 text-xs md:text-sm max-w-lg mx-auto font-sans font-semibold leading-relaxed mb-6 bg-black/80 p-3.5 rounded-xl border border-amber-500/40 backdrop-blur-sm">
                숫자 <strong className="text-amber-400 font-mono">[1]약공격(단어)</strong>, <strong className="text-orange-400 font-mono">[2]중공격(짧은문장)</strong>, <strong className="text-rose-400 font-mono">[3]강공격(필살기)</strong> 키를 
                전환하고 타자로 상대 격투가를 KO 시키세요!
              </p>

              <div className="text-yellow-300 font-mono font-black text-sm tracking-widest animate-pulse flex items-center justify-center gap-2 bg-black/70 py-1.5 px-4 rounded-lg border border-yellow-500/40 w-max mx-auto shadow-md">
                <span>INSERT COIN</span>
                <span className="text-slate-400">•</span>
                <span>PRESS BUTTON TO PLAY</span>
              </div>
            </div>

            {/* Mode Select Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
              <button
                onClick={startPracticeGame}
                className="group bg-[#0c1017] hover:bg-[#121824] border border-slate-800 hover:border-amber-400 rounded-xl p-6 text-left transition-all transform hover:-translate-y-1 shadow-lg relative overflow-hidden"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🥊</div>
                <h3 className="text-xl font-bold text-white group-hover:text-[#f5a623] transition-colors">연습실 (PRACTICE)</h3>
                <p className="text-xs font-sans text-slate-400 mt-2 leading-relaxed">샌드백을 타격하며 정확도 및 실시간 CPM 타수를 연습하세요.</p>
              </button>

              <button
                onClick={() => startSoloGame(1)}
                className="group bg-gradient-to-b from-[#171d2b] to-[#0c1017] border border-amber-500/60 hover:border-amber-400 rounded-xl p-6 text-left transition-all transform hover:-translate-y-1 shadow-[0_4px_25px_rgba(245,166,35,0.2)] relative overflow-hidden"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🏆</div>
                <h3 className="text-xl font-black text-[#f5a623]">솔로 챌린지 (STAGES)</h3>
                <p className="text-xs font-sans text-slate-300 mt-2 leading-relaxed">Stage 1부터 최종 7단계 오로치 이오린 보스까지 아케이드 도전!</p>
              </button>

              <button
                onClick={() => setGameMode('multi_match')}
                className="group bg-[#0c1017] hover:bg-[#121824] border border-slate-800 hover:border-orange-400 rounded-xl p-6 text-left transition-all transform hover:-translate-y-1 shadow-lg relative overflow-hidden"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">⚔️</div>
                <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">실시간 1v1 (ONLINE)</h3>
                <p className="text-xs font-sans text-slate-400 mt-2 leading-relaxed">제한 없이 누구와나 실시간 1대1 타자 대결을 펼치세요!</p>
              </button>
            </div>
          </div>
        )}

        {gameMode === 'multi_match' && (
          <MultiplayerLobby 
            user={user}
            onStartMatch={startMultiMatchGame}
            onBack={goToMainMenu}
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

        {/* GameOver Result Window */}
        {gameOverResult && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0c1017] border-2 border-amber-500/80 rounded-2xl max-w-md w-full p-6 text-center shadow-[0_0_50px_rgba(245,166,35,0.4)] animate-bounce">
              <div className="text-6xl mb-2">{gameOverResult === 'win' ? '🏆' : '💀'}</div>
              <h3 className="text-3xl font-black italic text-[#f5a623] mb-1">
                {gameOverResult === 'win' ? 'K.O. VICTORY!' : 'DEFEATED...'}
              </h3>
              <p className="text-xs font-mono text-slate-400 mb-4">
                {gameOverResult === 'win' 
                  ? (stage === 7 ? '🎉 ALL STAGES CLEARED! CHAMPION!' : `STAGE ${stage} CLEAR!`) 
                  : 'TRY AGAIN WITH HIGHER TYPING SPEED!'}
              </p>

              <div className="bg-[#05070c] p-4 rounded-xl border border-slate-800 mb-6 text-left text-xs font-mono space-y-2.5">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400 font-bold">⌨️ 이번 판 평균 타수:</span>
                  <span className="text-base font-black text-amber-300 font-sans">{avgCpm} CPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">최대 콤보:</span>
                  <span className="font-bold text-yellow-400">{combo} COMBO</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">획득 골드:</span>
                  <span className="font-bold text-amber-300">
                    +{gameOverResult === 'win' ? Math.round((150 + stage * 30) * (1 + (equippedChar.goldBonus || 0))) : 30} GOLD
                  </span>
                </div>
              </div>

              {/* 모달 버튼 영역 (버그 수정: 메인 이동 및 다음 스테이지 진행 버튼) */}
              <div className="flex gap-3">
                <button
                  onClick={goToMainMenu}
                  className="flex-1 bg-[#141923] hover:bg-slate-800 text-slate-300 py-3 rounded-lg font-mono font-bold text-xs border border-slate-700 transition-colors"
                >
                  🏠 메인 메뉴
                </button>
                {gameMode === 'solo' && gameOverResult === 'win' && stage < 7 ? (
                  <button
                    onClick={handleNextStage}
                    className="flex-1 bg-[#f5a623] hover:bg-amber-400 text-black py-3 rounded-lg font-mono font-black text-xs uppercase shadow-[0_0_15px_rgba(245,166,35,0.4)] transition-all transform hover:scale-105"
                  >
                    다음 스테이지! ⚔️ (ST.{stage + 1})
                  </button>
                ) : (
                  <button
                    onClick={handleRetryStage}
                    className="flex-1 bg-[#f5a623] hover:bg-amber-400 text-black py-3 rounded-lg font-mono font-black text-xs uppercase shadow-[0_0_15px_rgba(245,166,35,0.4)] transition-all transform hover:scale-105"
                  >
                    다시 도전 🥊
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Gacha Shop Modal */}
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

      {/* Hall of Fame Modal */}
      {isHallOfFameOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c1017] border border-amber-500/40 rounded-2xl w-full max-w-md p-6 text-white shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            <div className="flex justify-between items-center mb-5 border-b border-slate-800 pb-3">
              <h3 className="text-xl font-black text-amber-400 flex items-center gap-2">
                <span>👑</span> 명예의 전당 (TOP TYPERS)
              </h3>
              <button 
                onClick={() => setIsHallOfFameOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-lg px-2"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {leaderboardList.map((item, index) => (
                <div 
                  key={index}
                  className={`flex justify-between items-center p-3 rounded-lg border font-mono text-xs ${
                    index === 0 ? 'bg-amber-950/60 border-amber-400 text-amber-300' :
                    index === 1 ? 'bg-slate-800/80 border-slate-400 text-slate-200' :
                    index === 2 ? 'bg-orange-950/60 border-orange-500 text-orange-300' :
                    'bg-[#141923] border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm w-5 text-center">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                    </span>
                    <span className="font-bold text-white">{item.name}</span>
                  </div>
                  <span className="font-black text-amber-400 font-sans text-sm">{item.maxCpm} CPM</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
