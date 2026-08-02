import React, { useEffect, useRef, useState } from 'react';

// 인물이 전혀 없는 웅장한 도시 야경 배경 (Urban City Night Skyline Background)
const URBAN_CITY_BACKGROUND = 'linear-gradient(rgba(15, 23, 42, 0.35), rgba(2, 6, 23, 0.75)), url("https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200&auto=format&fit=crop")';

export const ArcadeCanvas = ({ 
  playerChar, 
  enemyChar, 
  playerHp, 
  maxPlayerHp, 
  enemyHp, 
  maxEnemyHp, 
  playerAction, 
  enemyAction, 
  combo, 
  isSuperMoveActive,
  stage = 1,
  mode = "solo"
}) => {
  const canvasRef = useRef(null);
  const [timer, setTimer] = useState(60);

  // KOF 98 타이머 카운트다운
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => (t > 0 ? t - 1 : 60));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let particles = [];
    let hitTexts = [];
    let screenShake = 0;

    const addHitParticles = (x, y, color = "#fef08a") => {
      for (let i = 0; i < 40; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 24,
          vy: (Math.random() - 0.5) * 24,
          radius: Math.random() * 8 + 3,
          color,
          alpha: 1,
          life: 35
        });
      }
      hitTexts.push({
        x: x + (Math.random() - 0.5) * 50,
        y: y - 30,
        text: `HIT! +${combo * 15 || 15}`,
        alpha: 1,
        vy: -2.5
      });
    };

    if (playerAction === 'punch' || playerAction === 'kick' || playerAction === 'fireball') {
      screenShake = playerAction === 'fireball' ? 22 : 12;
      addHitParticles(560, 200, playerChar.color || '#f59e0b');
    }
    if (enemyAction === 'punch' || enemyAction === 'kick' || enemyAction === 'fireball') {
      screenShake = 14;
      addHitParticles(240, 200, enemyChar.color || '#ef4444');
    }

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      if (screenShake > 0) {
        const dx = (Math.random() - 0.5) * screenShake;
        const dy = (Math.random() - 0.5) * screenShake;
        ctx.translate(dx, dy);
        screenShake *= 0.82;
        if (screenShake < 0.5) screenShake = 0;
      }

      // 1. KOF 98 바닥 무대 & 링 렌더링
      drawKofStageFloor(ctx, canvas.width, canvas.height);

      // 2. KOF 98 시안 A 복각 캐릭터 스프라이트 렌더링
      const p1X = 220;
      const p2X = 580;
      const groundY = 275;

      // P1 Fighter
      drawKofFighterSpriteA(ctx, p1X, groundY, playerChar, playerAction, false, tick, combo);

      // P2 Enemy Fighter
      drawKofFighterSpriteA(ctx, p2X, groundY, enemyChar, enemyAction, true, tick, 0);

      // 3. 힛스파크 파티클 & 타격 데미지 팝업
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 1 / p.life;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      particles = particles.filter(p => p.alpha > 0);

      // Hit Text Popups
      hitTexts.forEach(ht => {
        ht.y += ht.vy;
        ht.alpha -= 0.03;
        ctx.save();
        ctx.globalAlpha = Math.max(0, ht.alpha);
        ctx.font = '900 26px impact, sans-serif';
        ctx.fillStyle = '#fde047';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 5;
        ctx.strokeText(ht.text, ht.x, ht.y);
        ctx.fillText(ht.text, ht.x, ht.y);
        ctx.restore();
      });
      hitTexts = hitTexts.filter(ht => ht.alpha > 0);

      // 4. 5콤보 달성 시 KOF 98 대사치 초필살기 암전
      if (isSuperMoveActive) {
        drawKof98SuperSpecialOverlay(ctx, canvas.width, canvas.height, playerChar, combo);
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [playerAction, enemyAction, isSuperMoveActive, stage, combo, playerChar.id, enemyChar.id, playerChar, enemyChar]);

  return (
    <div 
      className="relative w-full overflow-hidden rounded-xl border-4 border-amber-500/90 shadow-[0_0_40px_rgba(245,158,11,0.6)] bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage: URBAN_CITY_BACKGROUND }}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={360}
        className="w-full h-auto block bg-transparent"
      />

      {/* 🥊 KOF 98 오리지널 100% 복각 HUD UI 🥊 */}
      <div className="absolute top-2 left-3 right-3 pointer-events-none flex justify-between items-start">
        {/* Player 1 KOF 98 Bar */}
        <div className="w-[340px]">
          {/* CHALLENGER! & Name */}
          <div className="flex items-center justify-between mb-0.5 px-1">
            <span className="text-[11px] font-black italic tracking-widest text-cyan-300 drop-shadow-[0_0_5px_#06b6d4]">
              CHALLENGER!
            </span>
            <span className="text-xs font-black italic text-yellow-300 tracking-wider">
              {playerChar.name}
            </span>
          </div>

          {/* KOF 98 Angular Health Bar Container */}
          <div className="flex items-center gap-1.5">
            {/* Kyo Portrait Avatar Box */}
            <div 
              className="w-11 h-11 border-2 border-white rounded bg-slate-900 overflow-hidden shrink-0 shadow-[0_0_10px_#ffffff]"
              dangerouslySetInnerHTML={{ __html: playerChar.avatarSvg || '' }}
            />
            {/* Green / Yellow KOF 98 Bar */}
            <div className="flex-1">
              <div className="w-full h-5 bg-black border-2 border-white rounded-sm overflow-hidden p-0.5 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 via-yellow-300 to-green-500 transition-all duration-200 border-r-2 border-white shadow-[0_0_10px_#10b981]"
                  style={{ width: `${Math.max(0, (playerHp / maxPlayerHp) * 100)}%` }}
                />
              </div>
              <div className="flex gap-2 text-[9px] font-bold text-amber-400 tracking-tighter mt-0.5">
                <span>BENIMARU</span>
                <span>DAIMON</span>
              </div>
            </div>
          </div>
        </div>

        {/* KOF 98 Central Big Timer (60) */}
        <div className="flex flex-col items-center">
          <div className="bg-black border-2 border-yellow-400 px-3 py-1 rounded shadow-[0_0_15px_#f59e0b] -mt-1">
            <span className="text-3xl font-black italic text-yellow-300 font-mono tracking-tighter drop-shadow-[0_0_10px_#f59e0b]">
              {timer < 10 ? `0${timer}` : timer}
            </span>
          </div>
          <span className="text-[10px] font-bold text-yellow-400 bg-black/80 px-2 py-0.5 rounded border border-yellow-500/50 mt-1">
            {mode === 'solo' ? `STAGE ${stage}` : 'VS MATCH'}
          </span>
        </div>

        {/* Player 2 / Enemy KOF 98 Bar */}
        <div className="w-[340px] text-right">
          <div className="flex items-center justify-between mb-0.5 px-1">
            <span className="text-xs font-black italic text-yellow-300 tracking-wider">
              {enemyChar.name}
            </span>
            <span className="text-[11px] font-black italic tracking-widest text-cyan-300 drop-shadow-[0_0_5px_#06b6d4]">
              CHALLENGER!
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex-1">
              <div className="w-full h-5 bg-black border-2 border-white rounded-sm overflow-hidden p-0.5 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-l from-yellow-300 via-emerald-400 to-green-500 transition-all duration-200 border-l-2 border-white shadow-[0_0_10px_#10b981] ml-auto"
                  style={{ width: `${Math.max(0, (enemyHp / maxEnemyHp) * 100)}%` }}
                />
              </div>
              <div className="flex justify-end gap-2 text-[9px] font-bold text-rose-400 tracking-tighter mt-0.5">
                <span>MATURE</span>
                <span>VICE</span>
              </div>
            </div>
            <div 
              className="w-11 h-11 border-2 border-white rounded bg-slate-900 overflow-hidden shrink-0 shadow-[0_0_10px_#ffffff]"
              dangerouslySetInnerHTML={{ __html: enemyChar.avatarSvg || '' }}
            />
          </div>
        </div>
      </div>

      {/* KOF 98 하단 ADV / EX Stock Gauges */}
      <div className="absolute bottom-2 left-4 right-4 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-2 bg-black/80 border border-white/60 px-2 py-1 rounded">
          <span className="bg-blue-600 text-white font-black px-1.5 py-0.5 rounded text-xs">1</span>
          <span className="text-xs font-black italic text-cyan-300">ADV</span>
          <div className="w-20 h-2 bg-slate-800 border border-cyan-400 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 w-full animate-pulse" />
          </div>
        </div>

        <div className="flex items-center gap-2 bg-black/80 border border-white/60 px-2 py-1 rounded">
          <div className="w-20 h-2 bg-slate-800 border border-emerald-400 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 w-full animate-pulse" />
          </div>
          <span className="text-xs font-black italic text-emerald-300">EX</span>
          <span className="bg-green-600 text-white font-black px-1.5 py-0.5 rounded text-xs">1</span>
        </div>
      </div>
    </div>
  );
};

// 바닥 무대 & 그림자
function drawKofStageFloor(ctx, w, h) {
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(0, 260, w, h - 260);

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 260);
  ctx.lineTo(w, 260);
  ctx.stroke();

  // 그림자
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.ellipse(220, 275, 45, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.ellipse(580, 275, 45, 10, 0, 0, Math.PI * 2); ctx.fill();
}

// 시안 A KOF 98 오리지널 쿄 & 이오리 픽셀 정통 체형 렌더러
function drawKofFighterSpriteA(ctx, x, y, char, action, isFlip, tick, combo) {
  ctx.save();
  ctx.translate(x, y);
  if (isFlip) ctx.scale(-1, 1);

  const idleY = Math.sin(tick * 0.16) * 4;
  const charId = char.id || 'kyo';

  if (charId === 'sandbag') {
    ctx.fillStyle = '#64748b';
    ctx.beginPath(); ctx.roundRect(-22, -90 + idleY, 44, 75, 12); ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(0, -65 + idleY, 12, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    return;
  }

  // 1. KOF 98 KYO (쿠사나기 쿄 - 시안 A)
  if (charId === 'kyo' || charId === 'god_kyo') {
    // 바지 & 신발
    ctx.fillStyle = '#ffffff'; // 무술화
    ctx.fillRect(-22, -10 + idleY, 14, 10);
    ctx.fillRect(8, -10 + idleY, 14, 10);

    ctx.fillStyle = '#0f172a'; // 교복 바지
    ctx.fillRect(-20, -48 + idleY, 16, 40);
    ctx.fillRect(6, -48 + idleY, 16, 40);

    // 티셔츠 & 가죽 자켓
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-16, -90 + idleY, 32, 45);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-24, -95 + idleY, 12, 48);
    ctx.fillRect(12, -95 + idleY, 12, 48);

    // 얼굴 & 하얀 머리띠
    ctx.fillStyle = '#fde047';
    ctx.beginPath(); ctx.arc(0, -112 + idleY, 16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(0, -118 + idleY, 18, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#ffffff'; // 머리띠
    ctx.fillRect(-17, -116 + idleY, 34, 6);

    // 콤보 화염 연출
    if (action === 'punch' || action === 'fireball' || action === 'kick') {
      ctx.fillStyle = '#fde047';
      ctx.fillRect(8, -90 + idleY, 50, 14);

      ctx.save();
      ctx.fillStyle = '#ea580c';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 25;
      ctx.beginPath(); ctx.arc(65, -83 + idleY, 28, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(65, -83 + idleY, 14, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else {
      ctx.fillStyle = '#fde047';
      ctx.fillRect(10, -88 + idleY, 18, 30);
    }
  } 
  // 2. KOF 98 IORI (야가미 이오리 - 시안 A)
  else if (charId === 'iori' || charId === 'orochi_iori') {
    // 붉은 바지 & 가죽 끈
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-22, -48 + idleY, 18, 40);
    ctx.fillRect(4, -48 + idleY, 18, 40);

    ctx.strokeStyle = '#450a0a';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-10, -30 + idleY); ctx.lineTo(10, -30 + idleY); ctx.stroke();

    // 네이비 셔츠 & 흰 깃
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(-24, -95 + idleY, 48, 50);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.moveTo(-15, -95 + idleY); ctx.lineTo(0, -70 + idleY); ctx.lineTo(15, -95 + idleY); ctx.fill();

    // 얼굴 & 붉은 롱헤어
    ctx.fillStyle = '#fef08a';
    ctx.beginPath(); ctx.arc(0, -110 + idleY, 16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath(); ctx.arc(-2, -115 + idleY, 20, Math.PI * 0.8, Math.PI * 2.2); ctx.fill();
    ctx.fillRect(2, -120 + idleY, 12, 24);

    if (action === 'punch' || action === 'fireball' || action === 'kick') {
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(8, -92 + idleY, 50, 14);

      ctx.save();
      ctx.fillStyle = '#a855f7';
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 30;
      ctx.beginPath(); ctx.arc(65, -85 + idleY, 26, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(65, -85 + idleY, 12, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else {
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(8, -88 + idleY, 18, 30);
    }
  } else {
    ctx.fillStyle = char.color || '#3b82f6';
    ctx.fillRect(-20, -90 + idleY, 40, 48);
    ctx.fillStyle = char.secondaryColor || '#1e293b';
    ctx.fillRect(-18, -42 + idleY, 36, 35);
    ctx.fillStyle = '#fde047';
    ctx.beginPath(); ctx.arc(0, -108 + idleY, 15, 0, Math.PI * 2); ctx.fill();
  }

  ctx.restore();
}

// 5콤보 KOF 98 초필살기 암전
function drawKof98SuperSpecialOverlay(ctx, w, h, char, combo) {
  ctx.save();
  ctx.fillStyle = 'rgba(2, 6, 23, 0.94)';
  ctx.fillRect(0, 0, w, h);

  const bannerY = 110;
  const bannerH = 130;

  const grad = ctx.createLinearGradient(0, bannerY, w, bannerY + bannerH);
  grad.addColorStop(0, '#dc2626');
  grad.addColorStop(0.5, '#f59e0b');
  grad.addColorStop(1, '#7f1d1d');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, bannerY);
  ctx.lineTo(w, bannerY - 15);
  ctx.lineTo(w, bannerY + bannerH);
  ctx.lineTo(0, bannerY + bannerH + 15);
  ctx.closePath();
  ctx.fill();

  ctx.font = '900 36px impact, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 35;

  ctx.fillText(`🔥 MAX ${combo} COMBO KOF98 SUPER SPECIAL! 🔥`, w / 2, bannerY + 60);

  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText(`[${char.name}] 108식 대사치 / 팔치녀 초필살기 폭발!`, w / 2, bannerY + 98);

  ctx.restore();
}
