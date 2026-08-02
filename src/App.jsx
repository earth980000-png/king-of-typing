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

  // 솔로 플레이 AI 난이도 하향 (공격 딜레이 넉넉하게, 공격력 낮춤)
  useEffect(() => {
    if (gameMode !== 'solo' || enemyHp <= 0 || playerHp <= 0) return;

    const intervalMs = Math.max(2200, 4800 - stage * 400);

    const timer = setInterval(() => {
      setEnemyAction('punch');
      soundEngine.playKick();

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

  // 데미지 밸런스 조정: 단어 너프(6), 짧은 문장 버프(35), 긴 문장 대폭 버프(75)
  const handlePlayerAttack = ({ type, cpm: attackCpm }) => {
    let actionType = 'punch';
    let baseDamage = 6; // 단어 기본 데미지 너프

    if (type === 'short') {
      actionType = 'kick';
      baseDamage = 35; // 짧은 문장 버프
    } else if (type === 'long') {
      actionType = 'fireball';
      baseDamage = 75; // 긴 문장 대폭 버프!
    }

    // 이번 판 CPM 기록 누적
    if (attackCpm > 0) {
      setMatchCpmList(prev => [...prev, attackCpm]);
    }

    const charMultiplier = equippedChar.attackMultiplier || 1.0;
    let finalDamage = Math.round(baseDamage * charMultiplier);

    const nextCombo = combo + 1;
    setCombo(nextCombo);
    soundEngine.playComboChime(nextCombo);

    // 5콤보 이상 시 대사격/팔지녀 초필살기 폭발 & 데미지 보정
    if (nextCombo % 5 === 0) {
      setIsSuperMoveActive(true);
      soundEngine.playSuperSpecial();
      finalDamage = Math.round(finalDamage * 2.2); // 5콤보 폭발력 강화
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
    // 이번 판 평균 CPM 계산
    let calculatedAvgCpm = 0;
    if (matchCpmList.length > 0) {
      const sum = matchCpmList.reduce((acc, val) => acc + val, 0);
      calculatedAvgCpm = Math.round(sum / matchCpmList.length);
    } else {
      calculatedAvgCpm = 320;
    }
    setAvgCpm(calculatedAvgCpm);

    // 최고 CPM 기록 갱신 시 업데이트
    if (calculatedAvgCpm > maxCpm) {
      setMaxCpm(calculatedAvgCpm);
    }

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
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans select-none border-t-2 border-[#f5a623]">
      {/* Modal Style Header */}
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
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">RETRO ACTION TYPING ENGINE</p>
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
            className="bg-[#05070c] border border-slate-800 px-3 py-1.5 rounded-md text-xs font-mono font-bold text-slate-400 hover:text-amber-400 transition-colors"
          >
            {isBGMOn ? '🔊 BGM ON' : '🔇 BGM OFF'}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openHallOfFame}
            className="bg-[#141923] hover:bg-[#1a2130] text-yellow-400 border border-yellow-500/50 px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5"
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
            className="bg-[#f5a623] hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider px-3 py-2 rounded-lg shadow-sm transition-transform transform hover:scale-105"
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

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-5xl mx-auto w-full">
        {gameMode === 'menu' && (
          <div className="w-full text-center flex flex-col items-center py-8 animate-fadeIn">
            <div className="mb-8">
              <div className="inline-block bg-[#141923] border border-amber-500/40 px-3.5 py-1 rounded-full text-amber-400 text-xs font-mono font-bold uppercase tracking-widest mb-4">
                🔥 KOF STYLE HIGH-SPEED TYPING ACTION ENGINE
              </div>
              <h2 className="text-5xl md:text-6xl font-black italic tracking-tight text-white mb-3">
                타자 킹 <span className="text-[#f5a623] font-mono">: K.O.T</span>
              </h2>
              <p className="text-slate-400 text-sm max-w-lg mx-auto font-sans leading-relaxed">
                숫자 <strong className="text-amber-400 font-mono">[1]번(단어)</strong>, <strong className="text-orange-400 font-mono">[2]번(짧은 문장)</strong>, <strong className="text-rose-400 font-mono">[3]번(긴 문장)</strong> 키로 
                공격을 전환하며 상대 AI를 KO 시키세요!
              </p>
            </div>

            {/* Mode Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-8">
              <button
                onClick={startPracticeGame}
                className="group bg-[#0c1017] hover:bg-[#121824] border border-slate-800 hover:border-amber-400 rounded-xl p-6 text-left transition-all transform hover:-translate-y-1 shadow-lg"
              >
                <div className="text-3xl mb-3">🥊</div>
                <h3 className="text-xl font-bold text-white group-hover:text-[#f5a623] transition-colors">연습실</h3>
                <p className="text-xs font-sans text-slate-500 mt-2">샌드백을 치며 자유롭게 타자 속도(CPM)와 정확도를 측정해보세요.</p>
              </button>

              <button
                onClick={() => startSoloGame(1)}
                className="group bg-gradient-to-b from-[#141923] to-[#0c1017] border border-amber-500/50 hover:border-amber-400 rounded-xl p-6 text-left transition-all transform hover:-translate-y-1 shadow-[0_4px_20px_rgba(245,166,35,0.15)]"
              >
                <div className="text-3xl mb-3">🏆</div>
                <h3 className="text-xl font-bold text-[#f5a623]">솔로 플레이</h3>
                <p className="text-xs font-sans text-slate-400 mt-2">1단계부터 7단계(보스)까지 단계별 컴퓨터 AI와 1v1 대결!</p>
              </button>

              <button
                onClick={() => setGameMode('multi_match')}
                className="group bg-[#0c1017] hover:bg-[#121824] border border-slate-800 hover:border-orange-400 rounded-xl p-6 text-left transition-all transform hover:-translate-y-1 shadow-lg"
              >
                <div className="text-3xl mb-3">⚔️</div>
                <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">멀티 플레이</h3>
                <p className="text-xs font-sans text-slate-500 mt-2">제한 없이 누구와나 실시간 1v1 랜덤 대결을 즐기세요!</p>
              </button>
            </div>
          </div>
        )}

        {gameMode === 'multi_match' && (
          <MultiplayerLobby 
            user={user}
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

        {/* 게임 종료 결과 창 (타자 평균 속도 CPM 표시 연출) */}
        {gameOverResult && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0c1017] border-2 border-amber-500/80 rounded-2xl max-w-md w-full p-6 text-center shadow-[0_0_50px_rgba(245,166,35,0.4)] animate-bounce">
              <div className="text-6xl mb-2">{gameOverResult === 'win' ? '🏆' : '💀'}</div>
              <h3 className="text-3xl font-black italic text-[#f5a623] mb-1">
                {gameOverResult === 'win' ? 'K.O. VICTORY!' : 'DEFEATED...'}
              </h3>
              <p className="text-xs font-mono text-slate-400 mb-4">
                {gameOverResult === 'win' 
                  ? `STAGE ${stage} CLEAR!` 
                  : 'TRY AGAIN WITH HIGHER TYPING SPEED!'}
              </p>

              {/* 타자 평균 속도 및 결과 보상 통계 */}
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

      {/* 명예의 전당 모달 (Hall of Fame) */}
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
