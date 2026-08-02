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
  // 사용자 & 프로필 상태
  const [user, setUser] = useState(null);
  const [gold, setGold] = useState(300); // 기본 골드 300
  const [ownedCharIds, setOwnedCharIds] = useState(['kyo', 'iori']);
  const [equippedCharId, setEquippedCharId] = useState('kyo');
  const [userTeam, setUserTeam] = useState('flame');
  const [lang, setLang] = useState('ko'); // 'ko' 또는 'en'

  // 게임 모드 & 스테이지 상태 ('menu', 'practice', 'solo', 'multi', 'multi_match')
  const [gameMode, setGameMode] = useState('menu');
  const [stage, setStage] = useState(1);

  // 대결 체력 & 전투 상태
  const [playerHp, setPlayerHp] = useState(100);
  const [maxPlayerHp, setMaxPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [maxEnemyHp, setMaxEnemyHp] = useState(100);

  const [playerAction, setPlayerAction] = useState('idle');
  const [enemyAction, setEnemyAction] = useState('idle');

  const [selectedSkill, setSelectedSkill] = useState('word');
  const [combo, setCombo] = useState(0);
  const [isSuperMoveActive, setIsSuperMoveActive] = useState(false);
  const [gameOverResult, setGameOverResult] = useState(null); // 'win' 또는 'lose'

  // 가챠 모달 상태
  const [isGachaOpen, setIsGachaOpen] = useState(false);

  // 멀티플레이 상대 정보
  const [multiOpponent, setMultiOpponent] = useState(null);

  // 인증 감지 및 데이터 로딩
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

  // 유저 데이터 자동 저장 (Firebase)
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

  // 장착 중인 캐릭터 정보
  const equippedChar = CHARACTERS.find(c => c.id === equippedCharId) || CHARACTERS[0];

  // 스테이지별 AI 정보 (Stage 1 ~ 7)
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

  // 솔로 플레이 AI 자동 타자 타이머
  useEffect(() => {
    if (gameMode !== 'solo' || enemyHp <= 0 || playerHp <= 0) return;

    // Stage 1: 3.5초 간격 ~ Stage 7: 1.2초 간격 (초고속 타자)
    const intervalMs = Math.max(1200, 3800 - stage * 400);

    const timer = setInterval(() => {
      // AI 공격
      setEnemyAction('punch');
      soundEngine.playKick();

      // 유저 체력 감소 (장착 캐릭터 방어/체력 반영)
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

  // 게임 시작 (솔로 / 연습)
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

  // 플레이어 타자 공격 처리
  const handlePlayerAttack = ({ type, cpm }) => {
    // 1. 공격 종류에 따른 액션 및 데미지
    let actionType = 'punch';
    let baseDamage = 12;

    if (type === 'short') {
      actionType = 'kick';
      baseDamage = 24;
    } else if (type === 'long') {
      actionType = 'fireball';
      baseDamage = 45;
    }

    // 캐릭터 등급 배율 적용
    const charMultiplier = equippedChar.attackMultiplier || 1.0;
    let finalDamage = Math.round(baseDamage * charMultiplier);

    // 2. 콤보 계산 및 5콤보 초필살기 발동
    const nextCombo = combo + 1;
    setCombo(nextCombo);
    soundEngine.playComboChime(nextCombo);

    if (nextCombo % 5 === 0) {
      // 5콤보 달성 시 KOF 컷인 & 대량 데미지
      setIsSuperMoveActive(true);
      soundEngine.playSuperSpecial();
      finalDamage = Math.round(finalDamage * 1.8);
      setTimeout(() => setIsSuperMoveActive(false), 1400);
    }

    // 3. 사운드 연출
    if (actionType === 'punch') soundEngine.playPunch();
    else if (actionType === 'kick') soundEngine.playKick();
    else soundEngine.playFireball();

    setPlayerAction(actionType);
    setTimeout(() => setPlayerAction('idle'), 500);

    // 4. 적 HP 감소
    setEnemyHp(prev => {
      const next = prev - finalDamage;
      if (next <= 0 && gameMode !== 'practice') {
        handleGameOver('win');
      }
      return Math.max(0, next);
    });
  };

  // 게임 종료 (승리/패배) 및 골드 지급
  const handleGameOver = (result) => {
    setGameOverResult(result);
    if (result === 'win') {
      soundEngine.playVictory();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });

      // 승리 골드 (기본 150G + 스테이지 보너스 + 레전더리 골드 버프)
      const baseGold = 150 + stage * 30;
      const goldBonusMult = 1 + (equippedChar.goldBonus || 0);
      const earnedGold = Math.round(baseGold * goldBonusMult);

      setGold(g => g + earnedGold);
    } else {
      // 패배 시 약간의 골드 (30G)
      setGold(g => g + 30);
    }
  };

  // 캐릭터 장착 변경 핸들러 (실시간 동기화)
  const handleEquipCharacter = (charId) => {
    setEquippedCharId(charId);
    const selectedChar = CHARACTERS.find(c => c.id === charId) || CHARACTERS[0];
    const newMaxHp = Math.round(100 * (selectedChar.attackMultiplier || 1.0));
    setMaxPlayerHp(newMaxHp);
    setPlayerHp(newMaxHp);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* 상단 네온 아케이드 헤더 */}
      <header className="bg-slate-900/90 border-b border-amber-500/40 py-3 px-6 flex justify-between items-center shadow-lg backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div 
            onClick={() => setGameMode('menu')} 
            className="cursor-pointer flex items-center gap-2 group"
          >
            <span className="text-3xl animate-bounce">🥊</span>
            <div>
              <h1 className="text-2xl font-black italic tracking-wider text-amber-400 group-hover:text-amber-300 transition-colors drop-shadow-[0_0_10px_#f59e0b]">
                타자 킹 <span className="text-sm font-normal text-gray-300 text-slate-300">KING OF TYPING</span>
              </h1>
              <p className="text-[10px] text-gray-400">초등 6학년 타자 액션 격투 게임</p>
            </div>
          </div>

          {/* 언어 선택 토글 */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-bold ml-4">
            <button 
              onClick={() => setLang('ko')}
              className={`px-3 py-1 rounded transition-all ${lang === 'ko' ? 'bg-amber-500 text-slate-950' : 'text-gray-400 hover:text-white'}`}
            >
              🇰🇷 국어
            </button>
            <button 
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded transition-all ${lang === 'en' ? 'bg-amber-500 text-slate-950' : 'text-gray-400 hover:text-white'}`}
            >
              🔤 영어
            </button>
          </div>
        </div>

        {/* 유저 상태 / 골드 / 로그인 / 상점 */}
        <div className="flex items-center gap-4">
          {/* 장착 캐릭터 정보 */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-amber-500/40">
            <span className="text-xs text-gray-400">장착 중:</span>
            <span className="text-xs font-bold text-amber-300">{equippedChar.name}</span>
          </div>

          {/* 골드 표시 */}
          <div 
            onClick={() => setIsGachaOpen(true)}
            className="cursor-pointer bg-amber-950/80 border border-amber-500/80 text-amber-300 px-3 py-1.5 rounded-lg font-extrabold text-sm flex items-center gap-2 hover:bg-amber-900 transition-all shadow-[0_0_10px_rgba(245,158,11,0.3)]"
          >
            <span>💰</span>
            <span>{gold} GOLD</span>
          </div>

          {/* 뽑기 상점 버튼 */}
          <button
            onClick={() => setIsGachaOpen(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs px-3 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            🎁 캐릭터 상점
          </button>

          {/* Firebase 구글 / 익명 인증 */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-300">{user.displayName || '선수'}</span>
              <button 
                onClick={logoutUser}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-gray-400 px-2 py-1 rounded border border-slate-700"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex gap-1.5">
              <button
                onClick={loginWithGoogle}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1.5 rounded border border-amber-500/40 font-bold"
              >
                구글 로그인
              </button>
              <button
                onClick={loginAnonymously}
                className="text-xs bg-slate-900 hover:bg-slate-800 text-gray-300 px-2 py-1.5 rounded border border-slate-700"
              >
                익명 참가
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 메인 콘텐트 뷰 */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-5xl mx-auto w-full">
        {gameMode === 'menu' && (
          <div className="w-full text-center flex flex-col items-center py-8 animate-fadeIn">
            {/* 메인 로고 및 비주얼 */}
            <div className="mb-8">
              <div className="inline-block bg-amber-500/10 border border-amber-500/30 px-4 py-1 rounded-full text-amber-300 text-xs font-bold mb-3">
                🔥 킹 오브 파이터즈 × 한컴 타자연습의 완벽 융합!
              </div>
              <h2 className="text-5xl md:text-6xl font-black italic tracking-tight text-white mb-2 drop-shadow-[0_0_25px_rgba(245,158,11,0.6)]">
                타자 킹 <span className="text-amber-400">: K.O.T</span>
              </h2>
              <p className="text-gray-400 text-sm max-w-lg mx-auto">
                숫자 <strong className="text-amber-300">1번(단어/약공격)</strong>, <strong className="text-orange-400">2번(단문/중공격)</strong>, <strong className="text-rose-400">3번(장문/강공격)</strong>을 눌러 
                타자를 정확히 치고 상대 AI 및 친구를 KO 시키세요!
              </p>
            </div>

            {/* 메인 모드 선택 버튼 3종 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-8">
              {/* 1. 연습실 */}
              <button
                onClick={startPracticeGame}
                className="group relative bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 hover:border-amber-400 rounded-2xl p-6 text-left transition-all transform hover:-translate-y-1 shadow-xl overflow-hidden"
              >
                <div className="text-4xl mb-3">🥊</div>
                <h3 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">연습실</h3>
                <p className="text-xs text-gray-400 mt-2">샌드백을 치며 자유롭게 타자 속도(WPM)와 정확도를 측정해보세요.</p>
              </button>

              {/* 2. 솔로 플레이 */}
              <button
                onClick={() => startSoloGame(1)}
                className="group relative bg-gradient-to-br from-amber-950/60 to-slate-900 hover:from-amber-900/80 border-2 border-amber-500/60 hover:border-amber-400 rounded-2xl p-6 text-left transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(245,158,11,0.2)] overflow-hidden"
              >
                <div className="text-4xl mb-3">🏆</div>
                <h3 className="text-2xl font-black text-amber-400">솔로 플레이</h3>
                <p className="text-xs text-gray-300 mt-2">1단계부터 7단계(KOF 최종 보스)까지 단계별 컴퓨터 AI와 1v1 대결!</p>
              </button>

              {/* 3. 멀티 플레이 */}
              <button
                onClick={() => setGameMode('multi_match')}
                className="group relative bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 hover:border-orange-400 rounded-2xl p-6 text-left transition-all transform hover:-translate-y-1 shadow-xl overflow-hidden"
              >
                <div className="text-4xl mb-3">⚔️</div>
                <h3 className="text-2xl font-black text-white group-hover:text-orange-400 transition-colors">멀티 플레이</h3>
                <p className="text-xs text-gray-400 mt-2">같은 팀 소속 친구와 각자의 컴퓨터에서 실시간 1v1 랜덤 매칭 대결!</p>
              </button>
            </div>
          </div>
        )}

        {/* 멀티플레이 로비 대기실 */}
        {gameMode === 'multi_match' && (
          <MultiplayerLobby 
            user={user}
            userTeam={userTeam}
            onSelectTeam={setUserTeam}
            onStartMatch={startMultiMatchGame}
            onBack={() => setGameMode('menu')}
          />
        )}

        {/* 실제 대결 게임 화면 (연습, 솔로 1~7, 멀티) */}
        {(gameMode === 'solo' || gameMode === 'practice' || gameMode === 'multi') && (
          <div className="w-full flex flex-col gap-4 animate-fadeIn">
            {/* 상단 캔버스 격투 엔진 */}
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

            {/* 하단 타자 컨트롤 패널 */}
            <TypingPanel 
              lang={lang}
              onAttack={handlePlayerAttack}
              onSkillSelect={setSelectedSkill}
              selectedSkill={selectedSkill}
              disabled={gameOverResult !== null}
            />
          </div>
        )}

        {/* 승리 / 패배 결과 팝업 모달 */}
        {gameOverResult && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border-4 border-amber-500 rounded-2xl max-w-md w-full p-6 text-center shadow-[0_0_40px_#f59e0b] animate-bounce">
              <div className="text-6xl mb-2">{gameOverResult === 'win' ? '🏆' : '💀'}</div>
              <h3 className="text-3xl font-black italic text-amber-400 mb-1">
                {gameOverResult === 'win' ? 'K.O. 승리!' : '패배...'}
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                {gameOverResult === 'win' 
                  ? `축하합니다! 상대방을 타자로 제압했습니다.` 
                  : '더 빠른 타자 속도로 다시 도전해보세요!'}
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">획득 골드:</span>
                  <span className="font-bold text-amber-300">
                    +{gameOverResult === 'win' ? Math.round((150 + stage * 30) * (1 + (equippedChar.goldBonus || 0))) : 30} GOLD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">달성 콤보:</span>
                  <span className="font-bold text-yellow-400">{combo} COMBO</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setGameMode('menu')}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-gray-200 py-3 rounded-xl font-bold text-sm border border-slate-700"
                >
                  메인 메뉴로
                </button>
                {gameMode === 'solo' && gameOverResult === 'win' && stage < 7 ? (
                  <button
                    onClick={() => startSoloGame(stage + 1)}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 py-3 rounded-xl font-black text-sm shadow-[0_0_15px_#f59e0b]"
                  >
                    다음 Stage {stage + 1}!
                  </button>
                ) : (
                  <button
                    onClick={() => startSoloGame(stage)}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 py-3 rounded-xl font-black text-sm shadow-[0_0_15px_#f59e0b]"
                  >
                    다시 대결! 🥊
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 가챠 상점 모달 */}
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


