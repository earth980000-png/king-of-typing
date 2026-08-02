import React, { useEffect, useRef, useState } from 'react';

// 킹오파 98 오락실 스타일 다크 도심 아레나 (CSS Gradient & Neon Lighting)
const ARENA_BACKGROUND = 'linear-gradient(to bottom, #070014 0%, #15002b 25%, #0b1526 50%, #172338 75%, #0d1322 100%)';

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
      for (let i = 0; i < 45; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 26,
          vy: (Math.random() - 0.5) * 26,
          radius: Math.random() * 9 + 3,
          color,
          alpha: 1,
          life: 38
        });
      }
      hitTexts.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y - 35,
        text: `HIT! +${combo * 20 || 20}`,
        alpha: 1,
        vy: -2.8
      });
    };

    if (playerAction === 'punch' || playerAction === 'kick' || playerAction === 'fireball') {
      screenShake = playerAction === 'fireball' ? 24 : 14;
      addHitParticles(560, 190, playerChar.color || '#f59e0b');
    }
    if (enemyAction === 'punch' || enemyAction === 'kick' || enemyAction === 'fireball') {
      screenShake = 16;
      addHitParticles(240, 190, enemyChar.color || '#ef4444');
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
        screenShake *= 0.80;
        if (screenShake < 0.5) screenShake = 0;
      }

      // 1. KOF 98 도심 건물 픽셀 Silhouette & 스포트라이트 배경
      drawKofCitySkyline(ctx, canvas.width, canvas.height, tick);

      // 2. 바닥 링 스테이지 렌더링
      drawKofStageFloor(ctx, canvas.width, canvas.height);

      // 3. 8종 디테일 픽셀 격투가 스프라이트
      const p1X = 220;
      const p2X = 580;
      const groundY = 275;

      drawDetailedFighterSprite(ctx, p1X, groundY, playerChar, playerAction, false, tick, combo);
      drawDetailedFighterSprite(ctx, p2X, groundY, enemyChar, enemyAction, true, tick, 0);

      // 4. 네온 힛스파크 파티클 & HIT 팝업
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 1 / p.life;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      particles = particles.filter(p => p.alpha > 0);

      hitTexts.forEach(ht => {
        ht.y += ht.vy;
        ht.alpha -= 0.028;
        ctx.save();
        ctx.globalAlpha = Math.max(0, ht.alpha);
        ctx.font = '900 28px impact, sans-serif';
        ctx.fillStyle = '#fde047';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 6;
        ctx.strokeText(ht.text, ht.x, ht.y);
        ctx.fillText(ht.text, ht.x, ht.y);
        ctx.restore();
      });
      hitTexts = hitTexts.filter(ht => ht.alpha > 0);

      // 5. 5콤보 달성 KOF 초필살기 암전
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
      className="relative w-full overflow-hidden rounded-2xl border-4 border-amber-500/90 shadow-[0_0_50px_rgba(245,158,11,0.5)] bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage: ARENA_BACKGROUND }}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={360}
        className="w-full h-auto block bg-transparent"
      />

      {/* 🥊 KOF 98 100% 복각 HUD 🥊 */}
      <div className="absolute top-2.5 left-4 right-4 pointer-events-none flex justify-between items-start">
        {/* P1 Bar */}
        <div className="w-[340px]">
          <div className="flex items-center justify-between mb-0.5 px-1">
            <span className="text-[11px] font-black italic tracking-widest text-cyan-300 drop-shadow-[0_0_8px_#06b6d4]">
              CHALLENGER!
            </span>
            <span className="text-xs font-black italic text-yellow-300 tracking-wider">
              {playerChar.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div 
              className="w-12 h-12 border-2 border-amber-400 rounded-lg bg-slate-900 overflow-hidden shrink-0 shadow-[0_0_15px_rgba(245,166,35,0.6)]"
              dangerouslySetInnerHTML={{ __html: playerChar.avatarSvg || '' }}
            />
            <div className="flex-1">
              <div className="w-full h-5 bg-black border-2 border-white rounded-sm overflow-hidden p-0.5 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 via-yellow-300 to-green-500 transition-all duration-200 border-r-2 border-white shadow-[0_0_10px_#10b981]"
                  style={{ width: `${Math.max(0, (playerHp / maxPlayerHp) * 100)}%` }}
                />
              </div>
              <div className="flex gap-2 text-[9px] font-bold text-amber-400 tracking-tighter mt-0.5">
                <span>BENIMARO</span>
                <span>DAIMOU</span>
              </div>
            </div>
          </div>
        </div>

        {/* Big Timer */}
        <div className="flex flex-col items-center">
          <div className="bg-black border-2 border-yellow-400 px-3.5 py-1 rounded shadow-[0_0_20px_#f59e0b] -mt-1">
            <span className="text-3xl font-black italic text-yellow-300 font-mono tracking-tighter drop-shadow-[0_0_10px_#f59e0b]">
              {timer < 10 ? `0${timer}` : timer}
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-yellow-300 bg-black/80 px-2 py-0.5 rounded border border-yellow-500/50 mt-1">
            {mode === 'solo' ? `STAGE ${stage}` : 'VS MATCH'}
          </span>
        </div>

        {/* P2 Bar */}
        <div className="w-[340px] text-right">
          <div className="flex items-center justify-between mb-0.5 px-1">
            <span className="text-xs font-black italic text-yellow-300 tracking-wider">
              {enemyChar.name}
            </span>
            <span className="text-[11px] font-black italic tracking-widest text-cyan-300 drop-shadow-[0_0_8px_#06b6d4]">
              CHALLENGER!
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="w-full h-5 bg-black border-2 border-white rounded-sm overflow-hidden p-0.5 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-l from-yellow-300 via-emerald-400 to-green-500 transition-all duration-200 border-l-2 border-white shadow-[0_0_10px_#10b981] ml-auto"
                  style={{ width: `${Math.max(0, (enemyHp / maxEnemyHp) * 100)}%` }}
                />
              </div>
              <div className="flex justify-end gap-2 text-[9px] font-bold text-rose-400 tracking-tighter mt-0.5">
                <span>MATURO</span>
                <span>VISE</span>
              </div>
            </div>
            <div 
              className="w-12 h-12 border-2 border-red-500 rounded-lg bg-slate-900 overflow-hidden shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.6)]"
              dangerouslySetInnerHTML={{ __html: enemyChar.avatarSvg || '' }}
            />
          </div>
        </div>
      </div>

      {/* ADV / EX Stock Gauges */}
      <div className="absolute bottom-2 left-4 right-4 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-2 bg-black/85 border border-amber-500/60 px-2.5 py-1 rounded-md shadow-md">
          <span className="bg-blue-600 text-white font-black px-1.5 py-0.5 rounded text-xs">1</span>
          <span className="text-xs font-black italic text-cyan-300">ADV</span>
          <div className="w-20 h-2 bg-slate-800 border border-cyan-400 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 w-full animate-pulse" />
          </div>
        </div>

        <div className="flex items-center gap-2 bg-black/85 border border-amber-500/60 px-2.5 py-1 rounded-md shadow-md">
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

// 도심 야경 Skyline & 스포트라이트 조명 렌더러
function drawKofCitySkyline(ctx, w, h, tick) {
  // 빌딩 silhouette
  ctx.fillStyle = '#050a14';
  ctx.fillRect(40, 140, 70, 120);
  ctx.fillRect(150, 100, 90, 160);
  ctx.fillRect(280, 160, 60, 100);
  ctx.fillRect(450, 110, 85, 150);
  ctx.fillRect(600, 130, 110, 130);

  // 빌딩 창문 창 노란 불빛
  ctx.fillStyle = '#fef08a';
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 5; j++) {
      if ((i + j) % 2 === 0) {
        ctx.fillRect(165 + i * 18, 120 + j * 24, 8, 12);
        ctx.fillRect(465 + i * 18, 130 + j * 22, 8, 10);
      }
    }
  }

  // 회전하는 스포트라이트 빔
  ctx.save();
  const angle1 = Math.sin(tick * 0.02) * 0.4;
  const angle2 = Math.cos(tick * 0.025) * 0.4;

  ctx.fillStyle = 'rgba(245, 166, 35, 0.08)';
  ctx.beginPath();
  ctx.moveTo(150, 260);
  ctx.lineTo(150 + Math.sin(angle1) * 300 - 60, 0);
  ctx.lineTo(150 + Math.sin(angle1) * 300 + 60, 0);
  ctx.fill();

  ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
  ctx.beginPath();
  ctx.moveTo(650, 260);
  ctx.lineTo(650 + Math.sin(angle2) * 300 - 60, 0);
  ctx.lineTo(650 + Math.sin(angle2) * 300 + 60, 0);
  ctx.fill();
  ctx.restore();
}

// 링 무대 바닥
function drawKofStageFloor(ctx, w, h) {
  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  ctx.fillRect(0, 260, w, h - 260);

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(0, 260);
  ctx.lineTo(w, 260);
  ctx.stroke();

  // 그림자
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.ellipse(220, 275, 48, 11, 0, 0, Math.PI * 2); ctx.fill();
  ctx.ellipse(580, 275, 48, 11, 0, 0, Math.PI * 2); ctx.fill();
}

// 8종 디테일 픽셀 격투가 스프라이트 렌더러
function drawDetailedFighterSprite(ctx, x, y, char, action, isFlip, tick, combo) {
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

  // 1. 큐 (KYU KUSANARI / GOD KYU)
  if (charId === 'kyo' || charId === 'god_kyo') {
    ctx.fillStyle = '#ffffff'; ctx.fillRect(-22, -10 + idleY, 14, 10); ctx.fillRect(8, -10 + idleY, 14, 10);
    ctx.fillStyle = '#0f172a'; ctx.fillRect(-20, -48 + idleY, 16, 40); ctx.fillRect(6, -48 + idleY, 16, 40);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(-16, -90 + idleY, 32, 45);
    ctx.fillStyle = charId === 'god_kyo' ? '#ea580c' : '#1e293b';
    ctx.fillRect(-24, -95 + idleY, 12, 48); ctx.fillRect(12, -95 + idleY, 12, 48);
    ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc(0, -112 + idleY, 16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(0, -118 + idleY, 18, Math.PI, 0); ctx.fill();
    ctx.fillStyle = charId === 'god_kyo' ? '#facc15' : '#ffffff'; ctx.fillRect(-17, -116 + idleY, 34, 6);

    if (action === 'punch' || action === 'fireball' || action === 'kick') {
      ctx.fillStyle = '#fde047'; ctx.fillRect(8, -90 + idleY, 50, 14);
      ctx.save();
      ctx.fillStyle = '#ea580c'; ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 25;
      ctx.beginPath(); ctx.arc(65, -83 + idleY, 28, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(65, -83 + idleY, 14, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else {
      ctx.fillStyle = '#fde047'; ctx.fillRect(10, -88 + idleY, 18, 30);
    }
  } 
  // 2. 이오리 (IORI YAGARI / OROCHI IORIN)
  else if (charId === 'iori' || charId === 'orochi_iori') {
    ctx.fillStyle = charId === 'orochi_iori' ? '#e11d48' : '#dc2626';
    ctx.fillRect(-22, -48 + idleY, 18, 40); ctx.fillRect(4, -48 + idleY, 18, 40);
    ctx.strokeStyle = '#450a0a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-10, -30 + idleY); ctx.lineTo(10, -30 + idleY); ctx.stroke();
    ctx.fillStyle = '#1e1b4b'; ctx.fillRect(-24, -95 + idleY, 48, 50);
    ctx.fillStyle = charId === 'orochi_iori' ? '#881337' : '#ffffff';
    ctx.beginPath(); ctx.moveTo(-15, -95 + idleY); ctx.lineTo(0, -70 + idleY); ctx.lineTo(15, -95 + idleY); ctx.fill();
    ctx.fillStyle = charId === 'orochi_iori' ? '#ffe4e6' : '#fef08a';
    ctx.beginPath(); ctx.arc(0, -110 + idleY, 16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#dc2626'; ctx.beginPath(); ctx.arc(-2, -115 + idleY, 20, Math.PI * 0.8, Math.PI * 2.2); ctx.fill(); ctx.fillRect(2, -120 + idleY, 12, 24);

    if (action === 'punch' || action === 'fireball' || action === 'kick') {
      ctx.fillStyle = '#fef08a'; ctx.fillRect(8, -92 + idleY, 50, 14);
      ctx.save();
      ctx.fillStyle = charId === 'orochi_iori' ? '#f43f5e' : '#a855f7';
      ctx.shadowColor = '#c084fc'; ctx.shadowBlur = 30;
      ctx.beginPath(); ctx.arc(65, -85 + idleY, 26, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(65, -85 + idleY, 12, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else {
      ctx.fillStyle = '#fef08a'; ctx.fillRect(8, -88 + idleY, 18, 30);
    }
  } 
  // 3. 춘리 (CHUN-RI)
  else if (charId === 'chunli') {
    ctx.fillStyle = '#1d4ed8'; ctx.fillRect(-20, -12 + idleY, 14, 12); ctx.fillRect(6, -12 + idleY, 14, 12);
    ctx.fillStyle = '#fde68a'; ctx.fillRect(-18, -48 + idleY, 14, 38); ctx.fillRect(4, -48 + idleY, 14, 38);
    ctx.fillStyle = '#3b82f6'; ctx.fillRect(-22, -92 + idleY, 44, 46); ctx.fillStyle = '#fde047'; ctx.fillRect(-20, -92 + idleY, 40, 6);
    ctx.fillStyle = '#1c1917'; ctx.beginPath(); ctx.arc(-16, -118 + idleY, 8, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(16, -118 + idleY, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.fillRect(-18, -120 + idleY, 6, 6); ctx.fillRect(12, -120 + idleY, 6, 6);
    ctx.fillStyle = '#fde68a'; ctx.beginPath(); ctx.arc(0, -110 + idleY, 14, 0, Math.PI * 2); ctx.fill();

    if (action === 'punch' || action === 'kick' || action === 'fireball') {
      ctx.fillStyle = '#3b82f6'; ctx.shadowColor = '#60a5fa'; ctx.shadowBlur = 20;
      ctx.fillRect(10, -50 + idleY, 55, 18); ctx.fillRect(14, -70 + idleY, 50, 16); ctx.fillRect(18, -30 + idleY, 45, 16);
    }
  }
  // 4. 테리 (TERRY BOGARO)
  else if (charId === 'terry') {
    ctx.fillStyle = '#ef4444'; ctx.fillRect(-22, -10 + idleY, 16, 10); ctx.fillRect(6, -10 + idleY, 16, 10);
    ctx.fillStyle = '#2563eb'; ctx.fillRect(-20, -48 + idleY, 16, 40); ctx.fillRect(4, -48 + idleY, 16, 40);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(-18, -90 + idleY, 36, 44); ctx.fillStyle = '#dc2626'; ctx.fillRect(-24, -92 + idleY, 12, 46); ctx.fillRect(12, -92 + idleY, 12, 46);
    ctx.fillStyle = '#fde68a'; ctx.beginPath(); ctx.arc(0, -108 + idleY, 15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fbbf24'; ctx.fillRect(-14, -114 + idleY, 28, 8);
    ctx.fillStyle = '#dc2626'; ctx.fillRect(-18, -122 + idleY, 36, 10); ctx.fillRect(-22, -114 + idleY, 44, 4);

    if (action === 'punch' || action === 'kick' || action === 'fireball') {
      ctx.save(); ctx.fillStyle = '#f97316'; ctx.shadowColor = '#facc15'; ctx.shadowBlur = 30;
      ctx.beginPath(); ctx.moveTo(20, 0); ctx.lineTo(60, -90); ctx.lineTo(80, 0); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
  }
  // 5. 기타 캐릭터 Fallback
  else {
    ctx.fillStyle = char.color || '#3b82f6'; ctx.fillRect(-20, -90 + idleY, 40, 48);
    ctx.fillStyle = char.secondaryColor || '#1e293b'; ctx.fillRect(-18, -42 + idleY, 36, 35);
    ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc(0, -108 + idleY, 15, 0, Math.PI * 2); ctx.fill();
  }

  ctx.restore();
}

// 5콤보 KOF 98 초필살기 암전
function drawKof98SuperSpecialOverlay(ctx, w, h, char, combo) {
  ctx.save();
  ctx.fillStyle = 'rgba(2, 6, 23, 0.95)';
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

  ctx.fillText(`🔥 MAX ${combo} COMBO SUPER SPECIAL! 🔥`, w / 2, bannerY + 60);

  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText(`[${char.name}] 108식 대사격 / 팔지녀 초필살기 폭발!`, w / 2, bannerY + 98);

  ctx.restore();
}
