import React, { useEffect, useRef } from 'react';

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let particles = [];
    let screenShake = 0;

    const addHitParticles = (x, y, color = "#fef08a") => {
      for (let i = 0; i < 28; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 18,
          vy: (Math.random() - 0.5) * 18,
          radius: Math.random() * 7 + 2,
          color,
          alpha: 1,
          life: 32
        });
      }
    };

    if (playerAction === 'punch' || playerAction === 'kick' || playerAction === 'fireball') {
      screenShake = playerAction === 'fireball' ? 16 : 8;
      addHitParticles(560, 210, playerChar.color || '#eab308');
    }
    if (enemyAction === 'punch' || enemyAction === 'kick' || enemyAction === 'fireball') {
      screenShake = 10;
      addHitParticles(240, 210, enemyChar.color || '#ef4444');
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
        screenShake *= 0.85;
        if (screenShake < 0.5) screenShake = 0;
      }

      // 1. KOF / 철권 전용 아케이드 배경 렌더링
      drawKofArenaStage(ctx, canvas.width, canvas.height, stage);

      // 2. 캐릭터별 맞춤형 KOF 레트로 액션 격투가 스프라이트 렌더링
      const p1X = 220;
      const p2X = 580;
      const groundY = 275;

      // Player Fighter (좌측)
      drawCharacterSprite(ctx, p1X, groundY, playerChar, playerAction, false, tick);

      // Enemy / Opponent Fighter (우측 - 반전)
      drawCharacterSprite(ctx, p2X, groundY, enemyChar, enemyAction, true, tick);

      // 3. 타격 파티클 이펙트
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 1 / p.life;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      particles = particles.filter(p => p.alpha > 0);

      // 4. 5콤보 달성 시 KOF 컷인 필살기
      if (isSuperMoveActive) {
        drawSuperCutInOverlay(ctx, canvas.width, canvas.height, playerChar, combo);
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [playerAction, enemyAction, isSuperMoveActive, stage, combo, playerChar.id, enemyChar.id, playerChar, enemyChar]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border-4 border-amber-500/80 shadow-[0_0_40px_rgba(245,158,11,0.6)]">
      <canvas
        ref={canvasRef}
        width={800}
        height={360}
        className="w-full h-auto bg-slate-950 block"
      />

      {/* KOF 스타일 HUD 헤더 */}
      <div className="absolute top-3 left-4 right-4 flex justify-between items-center pointer-events-none">
        {/* P1 Profile & HP */}
        <div className="w-5/12 bg-slate-950/90 p-2.5 rounded-xl border-2 border-amber-400/80 backdrop-blur-md flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-lg overflow-hidden border-2 border-amber-400 shrink-0 bg-slate-900 shadow-[0_0_10px_#f59e0b]"
            dangerouslySetInnerHTML={{ __html: playerChar.avatarSvg || '' }}
          />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1 text-xs font-black text-amber-300">
              <span className="text-sm">{playerChar.name}</span>
              <span>{Math.max(0, Math.round(playerHp))} / {maxPlayerHp}</span>
            </div>
            <div className="w-full h-3.5 bg-gray-950 rounded-full overflow-hidden border border-amber-500/50 p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 rounded-full transition-all duration-300 shadow-[0_0_12px_#f59e0b]"
                style={{ width: `${Math.max(0, (playerHp / maxPlayerHp) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* VS Emblem & Stage */}
        <div className="flex flex-col items-center">
          <span className="text-3xl font-black italic text-yellow-400 drop-shadow-[0_0_18px_#facc15] tracking-wider animate-pulse">
            VS
          </span>
          <span className="text-[10px] font-bold text-amber-300 bg-slate-950/90 px-2.5 py-0.5 rounded border border-amber-500/60">
            {mode === 'solo' ? `STAGE ${stage}` : mode === 'practice' ? 'PRACTICE' : 'TEAM MATCH'}
          </span>
        </div>

        {/* Enemy Profile & HP */}
        <div className="w-5/12 bg-slate-950/90 p-2.5 rounded-xl border-2 border-rose-500/80 backdrop-blur-md flex items-center gap-3 text-right">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1 text-xs font-black text-rose-300">
              <span>{Math.max(0, Math.round(enemyHp))} / {maxEnemyHp}</span>
              <span className="text-sm">{enemyChar.name}</span>
            </div>
            <div className="w-full h-3.5 bg-gray-950 rounded-full overflow-hidden border border-rose-500/50 p-0.5">
              <div 
                className="h-full bg-gradient-to-l from-rose-500 via-red-400 to-pink-500 rounded-full transition-all duration-300 shadow-[0_0_12px_#f43f5e] ml-auto"
                style={{ width: `${Math.max(0, (enemyHp / maxEnemyHp) * 100)}%` }}
              />
            </div>
          </div>
          <div 
            className="w-12 h-12 rounded-lg overflow-hidden border-2 border-rose-500 shrink-0 bg-slate-900 shadow-[0_0_10px_#f43f5e]"
            dangerouslySetInnerHTML={{ __html: enemyChar.avatarSvg || '' }}
          />
        </div>
      </div>

      {/* 콤보 이펙트 */}
      {combo > 1 && (
        <div className="absolute top-20 left-8 pointer-events-none animate-bounce">
          <div className="text-4xl font-black italic text-yellow-300 drop-shadow-[0_0_20px_#facc15]">
            {combo} <span className="text-2xl text-orange-400">COMBO!</span>
          </div>
        </div>
      )}
    </div>
  );
};

// KOF 아케이드 링 배경
function drawKofArenaStage(ctx, w, h, stage) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  if (stage === 7) {
    grad.addColorStop(0, '#450a0a');
    grad.addColorStop(0.6, '#7f1d1d');
    grad.addColorStop(1, '#020617');
  } else {
    grad.addColorStop(0, '#090d16');
    grad.addColorStop(0.6, '#1e1b4b');
    grad.addColorStop(1, '#020617');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // 스포트라이트
  ctx.save();
  ctx.fillStyle = stage === 7 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(234, 179, 8, 0.2)';
  ctx.beginPath();
  ctx.arc(w / 2, 80, 150, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 바닥 링
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 255, w, h - 255);

  ctx.strokeStyle = stage === 7 ? '#f43f5e' : '#f59e0b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 255);
  ctx.lineTo(w, 255);
  ctx.stroke();
}

// 각 캐릭터별 고유 KOF 액션 격투가 스프라이트 개별 렌더링
function drawCharacterSprite(ctx, x, y, char, action, isFlip, tick) {
  ctx.save();
  ctx.translate(x, y);
  if (isFlip) ctx.scale(-1, 1);

  const bounceY = Math.sin(tick * 0.15) * 3;
  const charId = char.id || 'kyo';

  // 1. 샌드백 로봇 전용
  if (charId === 'sandbag') {
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.roundRect(-20, -90 + bounceY, 40, 75, 12);
    ctx.fill();
    ctx.fillStyle = '#334155';
    ctx.fillRect(-6, -15 + bounceY, 12, 15);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, -65 + bounceY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  // 2. 캐릭터별 맞춤형 KOF 디자인
  let jacketColor = char.color || '#eab308';
  let pantsColor = char.secondaryColor || '#1e293b';
  let hairColor = '#0f172a';
  let isFlameFighter = false;
  let isNinja = false;
  let isMecha = false;

  if (charId === 'iori' || charId === 'orochi_iori') {
    hairColor = '#dc2626';
    jacketColor = '#881337';
    pantsColor = '#450a0a';
    isFlameFighter = true;
  } else if (charId === 'chunli') {
    hairColor = '#0f172a';
    jacketColor = '#2563eb';
    pantsColor = '#1d4ed8';
  } else if (charId === 'terry') {
    hairColor = '#facc15';
    jacketColor = '#dc2626';
    pantsColor = '#1e3a8a';
  } else if (charId === 'shadow_ninja') {
    hairColor = '#3b0764';
    jacketColor = '#581c87';
    pantsColor = '#1e1b4b';
    isNinja = true;
  } else if (charId === 'cyber_mecha') {
    jacketColor = '#083344';
    pantsColor = '#334155';
    isMecha = true;
  } else if (charId === 'god_kyo') {
    hairColor = '#0f172a';
    jacketColor = '#ea580c';
    pantsColor = '#7c2d12';
    isFlameFighter = true;
  }

  // 레전더리 / 히든 캐릭터 아우라 효과
  if (char.grade === 'Legendary' || char.grade === 'Hidden') {
    ctx.save();
    ctx.fillStyle = jacketColor;
    ctx.globalAlpha = 0.35 + Math.sin(tick * 0.25) * 0.15;
    ctx.beginPath();
    ctx.arc(0, -60, 75, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 하체 / 바지 & 다리
  if (action === 'kick') {
    ctx.fillStyle = pantsColor;
    ctx.beginPath(); ctx.roundRect(-16, -45 + bounceY, 18, 45, 4); ctx.fill();
    ctx.beginPath(); ctx.roundRect(-5, -62 + bounceY, 65, 18, 6); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.roundRect(55, -64 + bounceY, 18, 22, 4); ctx.fill();

    // 킥 잔상
    ctx.strokeStyle = jacketColor;
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(35, -50 + bounceY, 40, -0.4, 0.4); ctx.stroke();
  } else {
    ctx.fillStyle = pantsColor;
    ctx.beginPath(); ctx.roundRect(-22, -45 + bounceY, 18, 45, 4); ctx.fill();
    ctx.beginPath(); ctx.roundRect(4, -45 + bounceY, 18, 45, 4); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-20, -48 + bounceY, 40, 5);
  }

  // 상체 (도복/가죽자켓)
  ctx.fillStyle = jacketColor;
  ctx.beginPath();
  ctx.roundRect(-24, -95 + bounceY, 48, 52, 6);
  ctx.fill();

  // 머리 & 헤어스타일
  ctx.fillStyle = char.skinTone || '#fde047';
  ctx.beginPath();
  ctx.arc(0, -112 + bounceY, 16, 0, Math.PI * 2);
  ctx.fill();

  // 헤어
  ctx.fillStyle = hairColor;
  ctx.beginPath();
  ctx.arc(0, -118 + bounceY, 18, Math.PI, 0);
  ctx.fill();

  if (charId === 'terry') {
    // 붉은 모자
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-18, -120 + bounceY, 36, 8);
    ctx.fillRect(0, -116 + bounceY, 22, 4);
  } else if (charId === 'chunli') {
    // 춘리 만두머리
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(-16, -118 + bounceY, 8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(16, -118 + bounceY, 8, 0, Math.PI * 2); ctx.fill();
  } else {
    // 머리띠
    ctx.fillStyle = isFlip ? '#ef4444' : '#eab308';
    ctx.fillRect(-17, -116 + bounceY, 34, 5);
  }

  // 눈
  ctx.fillStyle = isMecha ? '#22d3ee' : '#000000';
  ctx.fillRect(4, -112 + bounceY, 4, 3);

  // 팔 & 공격 발동
  if (action === 'punch') {
    ctx.fillStyle = char.skinTone || '#fde047';
    ctx.beginPath(); ctx.roundRect(5, -88 + bounceY, 55, 14, 5); ctx.fill();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath(); ctx.arc(62, -81 + bounceY, 10, 0, Math.PI * 2); ctx.fill();
  } else if (action === 'fireball') {
    ctx.fillStyle = char.skinTone || '#fde047';
    ctx.beginPath(); ctx.roundRect(10, -92 + bounceY, 45, 16, 5); ctx.fill();

    // 장풍 구체
    ctx.save();
    ctx.fillStyle = jacketColor;
    ctx.shadowColor = jacketColor;
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(75 + (tick % 8) * 3, -84 + bounceY, 25, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(75 + (tick % 8) * 3, -84 + bounceY, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else {
    ctx.fillStyle = char.skinTone || '#fde047';
    ctx.beginPath(); ctx.roundRect(10, -88 + bounceY, 20, 30, 5); ctx.fill();
  }

  ctx.restore();
}

// 5콤보 KOF 필살기 오버레이
function drawSuperCutInOverlay(ctx, w, h, char, combo) {
  ctx.save();
  ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
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

  ctx.font = '900 36px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 25;

  ctx.fillText(`🔥 MAX ${combo} COMBO KOF SUPER SPECIAL! 🔥`, w / 2, bannerY + 60);

  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText(`[${char.name}] 초필살기 발동!`, w / 2, bannerY + 98);

  ctx.restore();
}
