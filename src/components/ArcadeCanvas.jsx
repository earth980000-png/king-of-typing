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
      for (let i = 0; i < 24; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 16,
          vy: (Math.random() - 0.5) * 16,
          radius: Math.random() * 6 + 2,
          color,
          alpha: 1,
          life: 30
        });
      }
    };

    if (playerAction === 'punch' || playerAction === 'kick' || playerAction === 'fireball') {
      screenShake = playerAction === 'fireball' ? 14 : 7;
      addHitParticles(570, 210, playerChar.color || '#eab308');
    }
    if (enemyAction === 'punch' || enemyAction === 'kick' || enemyAction === 'fireball') {
      screenShake = 8;
      addHitParticles(230, 210, enemyChar.color || '#ef4444');
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
      drawRealisticStageBackground(ctx, canvas.width, canvas.height, stage);

      // 2. KOF 스타일 실제격투가 스프라이트 렌더링
      const p1X = 220;
      const p2X = 580;
      const groundY = 275;

      // P1 Fighter
      drawRealisticKofFighter(ctx, p1X, groundY, playerChar, playerAction, false, tick, combo);

      // P2 / Enemy Fighter
      drawRealisticKofFighter(ctx, p2X, groundY, enemyChar, enemyAction, true, tick, 0);

      // 3. 파티클 이펙트
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 1 / p.life;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      particles = particles.filter(p => p.alpha > 0);

      // 4. 5콤보 달성 시 KOF 컷인 필살기
      if (isSuperMoveActive) {
        drawKofCutInBanner(ctx, canvas.width, canvas.height, playerChar, combo);
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [playerAction, enemyAction, isSuperMoveActive, stage, combo, playerChar, enemyChar]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border-4 border-amber-500/80 shadow-[0_0_35px_rgba(245,158,11,0.5)]">
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
            className="w-10 h-10 rounded-lg overflow-hidden border border-amber-400 shrink-0 bg-slate-900"
            dangerouslySetInnerHTML={{ __html: playerChar.avatarSvg || '' }}
          />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1 text-xs font-black text-amber-300">
              <span>{playerChar.name}</span>
              <span>{Math.max(0, Math.round(playerHp))} / {maxPlayerHp}</span>
            </div>
            <div className="w-full h-3.5 bg-gray-950 rounded-full overflow-hidden border border-amber-500/40 p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 rounded-full transition-all duration-300 shadow-[0_0_12px_#f59e0b]"
                style={{ width: `${Math.max(0, (playerHp / maxPlayerHp) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* VS Emblem & Stage */}
        <div className="flex flex-col items-center">
          <span className="text-3xl font-black italic text-yellow-400 drop-shadow-[0_0_15px_#facc15] tracking-wider animate-pulse">
            VS
          </span>
          <span className="text-[10px] font-bold text-amber-300 bg-slate-950/90 px-2 py-0.5 rounded border border-amber-500/60">
            {mode === 'solo' ? `STAGE ${stage}` : 'TEAM MATCH'}
          </span>
        </div>

        {/* Enemy Profile & HP */}
        <div className="w-5/12 bg-slate-950/90 p-2.5 rounded-xl border-2 border-rose-500/80 backdrop-blur-md flex items-center gap-3 text-right">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1 text-xs font-black text-rose-300">
              <span>{Math.max(0, Math.round(enemyHp))} / {maxEnemyHp}</span>
              <span>{enemyChar.name}</span>
            </div>
            <div className="w-full h-3.5 bg-gray-950 rounded-full overflow-hidden border border-rose-500/40 p-0.5">
              <div 
                className="h-full bg-gradient-to-l from-rose-500 via-red-400 to-pink-500 rounded-full transition-all duration-300 shadow-[0_0_12px_#f43f5e] ml-auto"
                style={{ width: `${Math.max(0, (enemyHp / maxEnemyHp) * 100)}%` }}
              />
            </div>
          </div>
          <div 
            className="w-10 h-10 rounded-lg overflow-hidden border border-rose-500 shrink-0 bg-slate-900"
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

// 고화질 KOF 아케이드 스테이지 배경
function drawRealisticStageBackground(ctx, w, h, stage) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  if (stage === 7) {
    grad.addColorStop(0, '#450a0a');
    grad.addColorStop(0.6, '#7f1d1d');
    grad.addColorStop(1, '#0f172a');
  } else {
    grad.addColorStop(0, '#090d16');
    grad.addColorStop(0.6, '#1e1b4b');
    grad.addColorStop(1, '#020617');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // 네온 달 / 스타디움 인조 조명
  ctx.save();
  ctx.fillStyle = stage === 7 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(234, 179, 8, 0.2)';
  ctx.beginPath();
  ctx.arc(w / 2, 90, 140, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 토너먼트 바닥
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 255, w, h - 255);

  ctx.strokeStyle = stage === 7 ? '#f43f5e' : '#f59e0b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 255);
  ctx.lineTo(w, 255);
  ctx.stroke();
}

// 킹오파 / 철권 스타일 고화질 캐릭터 스프라이트 렌더링
function drawRealisticKofFighter(ctx, x, y, char, action, isFlip, tick, combo) {
  ctx.save();
  ctx.translate(x, y);
  if (isFlip) ctx.scale(-1, 1);

  const mainColor = char.color || '#eab308';
  const secColor = char.secondaryColor || '#1e293b';
  const skinTone = char.skinTone || '#fde047';

  // 아우라 효과
  if (char.grade === 'Legendary' || char.grade === 'Hidden') {
    ctx.save();
    ctx.fillStyle = mainColor;
    ctx.globalAlpha = 0.3 + Math.sin(tick * 0.2) * 0.15;
    ctx.beginPath();
    ctx.arc(0, -60, 75, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const bounceY = Math.sin(tick * 0.15) * 3;

  // 1. 발차기 (Kick) 연출
  if (action === 'kick') {
    // 서있는 하체 & 바지
    ctx.fillStyle = secColor;
    ctx.beginPath();
    ctx.roundRect(-18, -45 + bounceY, 20, 45, 4);
    ctx.fill();

    // 역동적으로 가로로 뻗은 발차기 다리
    ctx.fillStyle = secColor;
    ctx.beginPath();
    ctx.roundRect(-5, -60 + bounceY, 65, 18, 6);
    ctx.fill();

    // 부츠 / 신발
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(55, -62 + bounceY, 18, 22, 4);
    ctx.fill();

    // 발차기 이펙트 (KOF 킥 궤적)
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(35, -50 + bounceY, 40, -0.4, 0.4);
    ctx.stroke();
  } else {
    // 일반 다리 자세
    ctx.fillStyle = secColor;
    ctx.beginPath();
    ctx.roundRect(-22, -45 + bounceY, 18, 45, 4);
    ctx.roundRect(4, -45 + bounceY, 18, 45, 4);
    ctx.fill();

    // 벨트
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-20, -48 + bounceY, 40, 5);
  }

  // 2. 토르소 / 격투 도복 상의 & 근육 셰이딩
  ctx.fillStyle = mainColor;
  ctx.beginPath();
  ctx.roundRect(-24, -95 + bounceY, 48, 52, 6);
  ctx.fill();

  // 복근 & 가슴 근육 디테일 라인
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-10, -85 + bounceY); ctx.lineTo(0, -65 + bounceY); ctx.lineTo(10, -85 + bounceY);
  ctx.stroke();

  // 3. 머리 (Realistic Face & Hair)
  // 얼굴 스킨
  ctx.fillStyle = skinTone;
  ctx.beginPath();
  ctx.arc(0, -112 + bounceY, 16, 0, Math.PI * 2);
  ctx.fill();

  // KOF 스타일 머리카락 & 헤드밴드
  ctx.fillStyle = char.id === 'iori' || char.id === 'orochi_iori' ? '#dc2626' : '#0f172a';
  ctx.beginPath();
  ctx.arc(0, -118 + bounceY, 18, Math.PI, 0);
  ctx.fill();

  // 머리띠
  ctx.fillStyle = isFlip ? '#ef4444' : '#eab308';
  ctx.fillRect(-17, -116 + bounceY, 34, 5);

  // 눈 / 눈빛
  ctx.fillStyle = '#000000';
  ctx.fillRect(4, -112 + bounceY, 4, 3);

  // 4. 팔 & 펀치 / 장풍 연출
  if (action === 'punch') {
    // 뻗은 펀치 팔
    ctx.fillStyle = skinTone;
    ctx.beginPath();
    ctx.roundRect(5, -88 + bounceY, 55, 14, 5);
    ctx.fill();

    // 장갑 / 주먹
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(62, -81 + bounceY, 10, 0, Math.PI * 2);
    ctx.fill();

    // 펀치 잔상 궤적
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(30, -89 + bounceY, 35, 16);
  } else if (action === 'fireball') {
    // 장풍 내지르는 팔 자세
    ctx.fillStyle = skinTone;
    ctx.beginPath();
    ctx.roundRect(10, -92 + bounceY, 45, 16, 5);
    ctx.fill();

    // KOF 화염 불꽃 장풍 구체
    ctx.save();
    ctx.fillStyle = mainColor;
    ctx.shadowColor = mainColor;
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(75 + (tick % 8) * 3, -84 + bounceY, 24, 0, Math.PI * 2);
    ctx.fill();

    // 불꽃 화염 꼬리
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(75 + (tick % 8) * 3, -84 + bounceY, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else {
    // 대기 자세 팔
    ctx.fillStyle = skinTone;
    ctx.beginPath();
    ctx.roundRect(10, -88 + bounceY, 20, 30, 5);
    ctx.fill();
  }

  ctx.restore();
}

// 5콤보 달성 KOF 암전 컷인 배너
function drawKofCutInBanner(ctx, w, h, char, combo) {
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
  ctx.fillText(`[${char.name}] 필살 쇄도 폭발!`, w / 2, bannerY + 98);

  ctx.restore();
}
