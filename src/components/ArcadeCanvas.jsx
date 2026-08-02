import React, { useEffect, useRef, useState } from 'react';

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
      for (let i = 0; i < 35; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 22,
          vy: (Math.random() - 0.5) * 22,
          radius: Math.random() * 8 + 3,
          color,
          alpha: 1,
          life: 35
        });
      }
      hitTexts.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y - 20,
        text: `HIT! +${combo * 10 || 10}`,
        alpha: 1,
        vy: -2
      });
    };

    if (playerAction === 'punch' || playerAction === 'kick' || playerAction === 'fireball') {
      screenShake = playerAction === 'fireball' ? 20 : 10;
      addHitParticles(560, 210, playerChar.color || '#f59e0b');
    }
    if (enemyAction === 'punch' || enemyAction === 'kick' || enemyAction === 'fireball') {
      screenShake = 12;
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
        screenShake *= 0.82;
        if (screenShake < 0.5) screenShake = 0;
      }

      // 1. KOF 98 부산/한국 한옥 도장 스테이지 렌더링
      drawKof98Stage(ctx, canvas.width, canvas.height, stage);

      // 2. KOF 98 오리지널 쿄 & 이오리 레트로 픽셀 스프라이트 렌더링
      const p1X = 220;
      const p2X = 580;
      const groundY = 280;

      // Player 1 Fighter
      drawKof98FighterSprite(ctx, p1X, groundY, playerChar, playerAction, false, tick, combo);

      // Player 2 / AI Enemy Fighter
      drawKof98FighterSprite(ctx, p2X, groundY, enemyChar, enemyAction, true, tick, 0);

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

      // Hit Text Popup
      hitTexts.forEach(ht => {
        ht.y += ht.vy;
        ht.alpha -= 0.03;
        ctx.save();
        ctx.globalAlpha = Math.max(0, ht.alpha);
        ctx.font = '900 24px impact, sans-serif';
        ctx.fillStyle = '#fde047';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeText(ht.text, ht.x, ht.y);
        ctx.fillText(ht.text, ht.x, ht.y);
        ctx.restore();
      });
      hitTexts = hitTexts.filter(ht => ht.alpha > 0);

      // 4. 5콤보 달성 시 KOF 98 대사치 / 초필살기 암전
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
    <div className="relative w-full overflow-hidden rounded-xl border-4 border-amber-500/90 shadow-[0_0_40px_rgba(245,158,11,0.6)] bg-black">
      <canvas
        ref={canvasRef}
        width={800}
        height={360}
        className="w-full h-auto bg-slate-950 block"
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
              className="w-11 h-11 border-2 border-white rounded bg-slate-900 overflow-hidden shrink-0 shadow-[0_0_8px_#ffffff]"
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
              {/* KOF 98 Team Roster Text */}
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
          {/* CHALLENGER! & Name */}
          <div className="flex items-center justify-between mb-0.5 px-1">
            <span className="text-xs font-black italic text-yellow-300 tracking-wider">
              {enemyChar.name}
            </span>
            <span className="text-[11px] font-black italic tracking-widest text-cyan-300 drop-shadow-[0_0_5px_#06b6d4]">
              CHALLENGER!
            </span>
          </div>

          {/* KOF 98 Health Bar */}
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
            {/* Iori Portrait Avatar Box */}
            <div 
              className="w-11 h-11 border-2 border-white rounded bg-slate-900 overflow-hidden shrink-0 shadow-[0_0_8px_#ffffff]"
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

// KOF 98 한국/부산 스테이지 배경 렌더링
function drawKof98Stage(ctx, w, h, stage) {
  // 하늘 그라데이션
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#1e3a8a');
  sky.addColorStop(0.5, '#3b82f6');
  sky.addColorStop(1, '#93c5fd');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // 원경 산 & 기와지붕 한옥 배경
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(0, 180);
  ctx.lineTo(120, 140);
  ctx.lineTo(250, 180);
  ctx.lineTo(400, 130);
  ctx.lineTo(600, 180);
  ctx.lineTo(720, 140);
  ctx.lineTo(w, 180);
  ctx.lineTo(w, 240);
  ctx.lineTo(0, 240);
  ctx.fill();

  // KOF 98 부산 나룻배 & 기와집 상점 간판 렌더링
  ctx.fillStyle = '#b45309';
  ctx.fillRect(80, 160, 100, 40);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(70, 150, 120, 12); // 기와 지붕
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText("맛집", 110, 185);

  // 바다 & 부두 데크 바닥
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, 220, w, 40);

  // KOF 98 부두 무대 바닥 (나무 데크)
  ctx.fillStyle = '#78350f';
  ctx.fillRect(0, 255, w, h - 255);

  // 바닥 텍스처 패널 라인
  ctx.strokeStyle = '#451a03';
  ctx.lineWidth = 3;
  for (let x = 0; x < w; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 255);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
}

// KOF 98 오리지널 쿄(KYO) & 이오리(IORI) 100% 픽셀 아트 복각 스프라이트
function drawKof98FighterSprite(ctx, x, y, char, action, isFlip, tick, combo) {
  ctx.save();
  ctx.translate(x, y);
  if (isFlip) ctx.scale(-1, 1);

  const bounceY = Math.sin(tick * 0.18) * 3;
  const charId = char.id || 'kyo';

  // 1. KOF 98 KYO KUSANAGI (쿠사나기 쿄)
  if (charId === 'kyo' || charId === 'god_kyo') {
    // KOF 98 쿄 고유 대기 포즈 (무릎 굽히고 손 주먹 바깥 향함)
    const stanceShiftX = Math.sin(tick * 0.12) * 2;

    // 신발 / 부츠 (흰색 무술화)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-22 + stanceShiftX, -10 + bounceY, 14, 10);
    ctx.fillRect(8 + stanceShiftX, -10 + bounceY, 14, 10);

    // 바지 (검은 가죽/교복 바지)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-20 + stanceShiftX, -48 + bounceY, 16, 40);
    ctx.fillRect(6 + stanceShiftX, -48 + bounceY, 16, 40);

    // 가죽 자켓 & 흰 티셔츠 (KOF98 쿄 시그니처 상의)
    ctx.fillStyle = '#ffffff'; // 안쪽 흰 티
    ctx.fillRect(-16 + stanceShiftX, -90 + bounceY, 32, 45);

    ctx.fillStyle = '#1e293b'; // 검은 가죽 교복 자켓
    ctx.fillRect(-24 + stanceShiftX, -95 + bounceY, 12, 48);
    ctx.fillRect(12 + stanceShiftX, -95 + bounceY, 12, 48);

    // K의 금색 가문 문양
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-4 + stanceShiftX, -85 + bounceY, 8, 8);

    // 머리 (KOF 98 쿄 - 하얀 머리띠 + 가르마 머리칼)
    ctx.fillStyle = '#fde047'; // 피부
    ctx.beginPath(); ctx.arc(0 + stanceShiftX, -112 + bounceY, 16, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#0f172a'; // 머리칼
    ctx.beginPath(); ctx.arc(0 + stanceShiftX, -118 + bounceY, 18, Math.PI, 0); ctx.fill();

    // 하얀 머리띠 (KOF98 KYO SIGNATURE)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-17 + stanceShiftX, -116 + bounceY, 34, 6);

    // 눈빛
    ctx.fillStyle = '#000000';
    ctx.fillRect(4 + stanceShiftX, -112 + bounceY, 4, 3);

    // 팔 & 연속 콤보 동작 연출
    if (action === 'punch' || action === 'fireball' || action === 'kick') {
      // 콤보 수에 따른 3단 화염 연속기 (108식 황물기 / 독물기 / 귀신태우기)
      if (combo >= 3) {
        // 황물기 3연타 화염 궤적
        ctx.fillStyle = '#fde047';
        ctx.fillRect(8 + stanceShiftX, -90 + bounceY, 50, 14);

        // KOF 화염 이펙트
        ctx.save();
        ctx.fillStyle = '#ea580c';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(65 + stanceShiftX, -83 + bounceY, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(65 + stanceShiftX, -83 + bounceY, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        // 기본 펀치
        ctx.fillStyle = '#fde047';
        ctx.fillRect(8 + stanceShiftX, -88 + bounceY, 45, 12);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(50 + stanceShiftX, -90 + bounceY, 10, 16);
      }
    } else {
      // 대기 자세 팔
      ctx.fillStyle = '#fde047';
      ctx.fillRect(10 + stanceShiftX, -88 + bounceY, 18, 30);
    }
  } 
  // 2. KOF 98 IORI YAGAMI (야가미 이오리)
  else if (charId === 'iori' || charId === 'orochi_iori') {
    // KOF 98 이오리 고유 야성적 대기 포즈 (약간 숙이고 붉은 머리 덮임)
    const stanceShiftX = -Math.sin(tick * 0.15) * 3;

    // 붉은 바지 & 묶여있는 바지 가죽끈 (KOF98 IORI SIGNATURE)
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-22 + stanceShiftX, -48 + bounceY, 18, 40);
    ctx.fillRect(4 + stanceShiftX, -48 + bounceY, 18, 40);

    // 바지 사이 붉은 벨트 가죽끈
    ctx.strokeStyle = '#450a0a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-10 + stanceShiftX, -30 + bounceY);
    ctx.lineTo(10 + stanceShiftX, -30 + bounceY);
    ctx.stroke();

    // 네이비 셔츠 & 흰 깃 (KOF98 이오리 상의)
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(-24 + stanceShiftX, -95 + bounceY, 48, 50);

    ctx.fillStyle = '#ffffff'; // 흰 깃
    ctx.beginPath();
    ctx.moveTo(-15 + stanceShiftX, -95 + bounceY);
    ctx.lineTo(0 + stanceShiftX, -70 + bounceY);
    ctx.lineTo(15 + stanceShiftX, -95 + bounceY);
    ctx.fill();

    // 머리 (KOF 98 이오리 - 야성적인 붉은 롱 헤어)
    ctx.fillStyle = '#fef08a'; // 피부
    ctx.beginPath(); ctx.arc(0 + stanceShiftX, -110 + bounceY, 16, 0, Math.PI * 2); ctx.fill();

    // 붉은 길게 덮인 머리칼
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(-2 + stanceShiftX, -115 + bounceY, 20, Math.PI * 0.8, Math.PI * 2.2);
    ctx.fill();
    ctx.fillRect(2 + stanceShiftX, -120 + bounceY, 12, 24); // 앞으로 쏠린 붉은 앞머리

    // 팔 & 자색 화염 어둠쫓기 콤보 연출
    if (action === 'punch' || action === 'fireball' || action === 'kick') {
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(8 + stanceShiftX, -92 + bounceY, 50, 14);

      // KOF 자색/보라 화염 이펙트 (어둠쫓기 / 팔치녀)
      ctx.save();
      ctx.fillStyle = '#a855f7';
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(65 + stanceShiftX, -85 + bounceY, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(65 + stanceShiftX, -85 + bounceY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(8 + stanceShiftX, -88 + bounceY, 18, 30);
    }
  }
  // 3. 기타 캐릭터 범용 KOF 렌더러
  else {
    ctx.fillStyle = char.color || '#3b82f6';
    ctx.fillRect(-20, -90 + bounceY, 40, 48);
    ctx.fillStyle = char.secondaryColor || '#1e293b';
    ctx.fillRect(-18, -42 + bounceY, 36, 35);
    ctx.fillStyle = '#fde047';
    ctx.beginPath(); ctx.arc(0, -108 + bounceY, 15, 0, Math.PI * 2); ctx.fill();
  }

  ctx.restore();
}

// 5콤보 KOF 98 초필살기 암전
function drawKof98SuperSpecialOverlay(ctx, w, h, char, combo) {
  ctx.save();
  ctx.fillStyle = 'rgba(2, 6, 23, 0.92)';
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
  ctx.shadowBlur = 30;

  ctx.fillText(`🔥 MAX ${combo} COMBO KOF98 SUPER SPECIAL! 🔥`, w / 2, bannerY + 60);

  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText(`[${char.name}] 108식 대사치 / 팔치녀 초필살기 쇄도!`, w / 2, bannerY + 98);

  ctx.restore();
}
