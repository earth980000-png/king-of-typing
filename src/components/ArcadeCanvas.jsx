import React, { useEffect, useRef, useState } from 'react';

// KOF 실사풍 고화질 무대 배경 (Photographic Stage Data)
const STAGE_BACKGROUNDS = {
  1: 'linear-gradient(rgba(15, 23, 42, 0.6), rgba(2, 6, 23, 0.8)), url("https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop")', // 아시안 한옥 밤 배경
  3: 'linear-gradient(rgba(15, 23, 42, 0.5), rgba(2, 6, 23, 0.7)), url("https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop")', // 네온 서버펑크 도장
  5: 'linear-gradient(rgba(15, 23, 42, 0.5), rgba(2, 6, 23, 0.8)), url("https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop")', // 아케이드 스타디움
  7: 'linear-gradient(rgba(69, 10, 10, 0.6), rgba(15, 23, 42, 0.9)), url("https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop")'  // 보스 붉은 화열 성채
};

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

      // 1. KOF 98 실사풍 무대 링 바닥 & 그림자 렌더링
      drawRealisticStageFloor(ctx, canvas.width, canvas.height, stage);

      // 2. 실사화 격투가 스프라이트 & GIF 모션 렌더링
      const p1X = 220;
      const p2X = 580;
      const groundY = 275;

      // P1 Fighter
      drawRealisticFighterSprite(ctx, p1X, groundY, playerChar, playerAction, false, tick, combo);

      // P2 Enemy Fighter
      drawRealisticFighterSprite(ctx, p2X, groundY, enemyChar, enemyAction, true, tick, 0);

      // 3. 타격 파티클 & 힛스파크
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

  const bgStyle = STAGE_BACKGROUNDS[stage] || STAGE_BACKGROUNDS[1];

  return (
    <div 
      className="relative w-full overflow-hidden rounded-xl border-4 border-amber-500/90 shadow-[0_0_40px_rgba(245,158,11,0.6)] bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage: bgStyle }}
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

// 바닥 반사 그림자 & 무대 링
function drawRealisticStageFloor(ctx, w, h, stage) {
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(0, 260, w, h - 260);

  ctx.strokeStyle = stage === 7 ? '#f43f5e' : '#f59e0b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 260);
  ctx.lineTo(w, 260);
  ctx.stroke();

  // 바닥 그림자
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.ellipse(220, 275, 45, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.ellipse(580, 275, 45, 10, 0, 0, Math.PI * 2);
  ctx.fill();
}

// 실사화 격투가 GIF 애니메이션 스프라이트 렌더링 (Real Fighter Rendering Engine)
function drawRealisticFighterSprite(ctx, x, y, char, action, isFlip, tick, combo) {
  ctx.save();
  ctx.translate(x, y);
  if (isFlip) ctx.scale(-1, 1);

  // 대기 시 GIF처럼 들썩이는 애니메이션 (Idle Swaying Animation)
  const idleY = Math.sin(tick * 0.16) * 4;
  const idleRotate = Math.sin(tick * 0.1) * 0.03;
  ctx.rotate(idleRotate);

  const charId = char.id || 'kyo';

  // 1. 샌드백 로봇
  if (charId === 'sandbag') {
    ctx.fillStyle = '#64748b';
    ctx.beginPath(); ctx.roundRect(-22, -90 + idleY, 44, 75, 12); ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(0, -65 + idleY, 12, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    return;
  }

  // 2. 실사풍 쿄 / 이오리 / 격투가 인물 렌더링
  let bodyColor = char.color || '#f59e0b';
  let pantsColor = char.secondaryColor || '#1e293b';

  if (charId === 'iori' || charId === 'orochi_iori') {
    bodyColor = '#881337';
    pantsColor = '#dc2626';
  } else if (charId === 'chunli') {
    bodyColor = '#2563eb';
    pantsColor = '#1d4ed8';
  } else if (charId === 'terry') {
    bodyColor = '#dc2626';
    pantsColor = '#1e3a8a';
  }

  // 실사 다리 & 부츠
  if (action === 'kick') {
    ctx.fillStyle = pantsColor;
    ctx.beginPath(); ctx.roundRect(-16, -45 + idleY, 18, 45, 4); ctx.fill();
    ctx.beginPath(); ctx.roundRect(-5, -65 + idleY, 70, 20, 6); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.roundRect(60, -67 + idleY, 20, 24, 4); ctx.fill();

    // 발차기 이펙트
    ctx.strokeStyle = bodyColor;
    ctx.lineWidth = 8;
    ctx.beginPath(); ctx.arc(40, -52 + idleY, 45, -0.4, 0.4); ctx.stroke();
  } else {
    ctx.fillStyle = pantsColor;
    ctx.beginPath(); ctx.roundRect(-22, -45 + idleY, 18, 45, 4); ctx.fill();
    ctx.beginPath(); ctx.roundRect(4, -45 + idleY, 18, 45, 4); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-20, -48 + idleY, 40, 5);
  }

  // 실사 상체 & 재킷
  ctx.fillStyle = bodyColor;
  ctx.beginPath(); ctx.roundRect(-26, -98 + idleY, 52, 54, 8); ctx.fill();

  // 음영 디테일
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(-20, -85 + idleY, 10, 40);

  // 실사 얼굴 & 헤어
  ctx.fillStyle = '#fde047'; // skin
  ctx.beginPath(); ctx.arc(0, -114 + idleY, 16, 0, Math.PI * 2); ctx.fill();

  // 머리칼 (쿄: 가르마 / 이오리: 붉은 앞머리)
  ctx.fillStyle = charId === 'iori' || charId === 'orochi_iori' ? '#dc2626' : '#0f172a';
  ctx.beginPath(); ctx.arc(0, -120 + idleY, 19, Math.PI, 0); ctx.fill();

  if (charId === 'kyo' || charId === 'god_kyo') {
    // 쿄 머리띠
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-18, -118 + idleY, 36, 6);
  }

  // 눈
  ctx.fillStyle = '#000000';
  ctx.fillRect(4, -114 + idleY, 4, 3);

  // 팔 & 콤보 연출
  if (action === 'punch' || action === 'fireball' || action === 'kick') {
    ctx.fillStyle = '#fde047';
    ctx.beginPath(); ctx.roundRect(8, -92 + idleY, 55, 16, 5); ctx.fill();

    // 콤보 화염 이펙트 (KOF 98 대사치 / 황물기)
    ctx.save();
    ctx.fillStyle = charId === 'iori' ? '#a855f7' : '#ea580c';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(68, -84 + idleY, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(68, -84 + idleY, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else {
    ctx.fillStyle = '#fde047';
    ctx.beginPath(); ctx.roundRect(8, -90 + idleY, 20, 32, 5); ctx.fill();
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
