import React, { useEffect, useRef, useState } from 'react';

// 다크 격투 아레나 배경 (CSS Gradient - 외부 이미지 의존 제거)
const ARENA_BACKGROUND = 'linear-gradient(to bottom, #0a0015 0%, #1a0030 20%, #0d1b2a 45%, #1b2838 70%, #0f172a 100%)';

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

      // 2. KOF 98 전체 8종 캐릭터 고화질 도트 픽셀 렌더링
      const p1X = 220;
      const p2X = 580;
      const groundY = 275;

      // P1 Fighter
      drawDetailedFighterSprite(ctx, p1X, groundY, playerChar, playerAction, false, tick, combo);

      // P2 Enemy Fighter
      drawDetailedFighterSprite(ctx, p2X, groundY, enemyChar, enemyAction, true, tick, 0);

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

      // 4. 5콤보 달성 시 KOF 98 초필살기 암전
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
      style={{ backgroundImage: ARENA_BACKGROUND }}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={360}
        className="w-full h-auto block bg-transparent"
      />

      {/* 🥊 KOF 98 오리지널 HUD UI 🥊 */}
      <div className="absolute top-2 left-3 right-3 pointer-events-none flex justify-between items-start">
        {/* Player 1 KOF 98 Bar */}
        <div className="w-[340px]">
          <div className="flex items-center justify-between mb-0.5 px-1">
            <span className="text-[11px] font-black italic tracking-widest text-cyan-300 drop-shadow-[0_0_5px_#06b6d4]">
              CHALLENGER!
            </span>
            <span className="text-xs font-black italic text-yellow-300 tracking-wider">
              {playerChar.name}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div 
              className="w-11 h-11 border-2 border-white rounded bg-slate-900 overflow-hidden shrink-0 shadow-[0_0_10px_#ffffff]"
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
                <span>MATURO</span>
                <span>VISE</span>
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

// 🥊 전체 8종 캐릭터 고화질 16-bit 픽셀 디테일 스프라이트 렌더러 🥊
function drawDetailedFighterSprite(ctx, x, y, char, action, isFlip, tick, combo) {
  ctx.save();
  ctx.translate(x, y);
  if (isFlip) ctx.scale(-1, 1);

  const idleY = Math.sin(tick * 0.16) * 4;
  const charId = char.id || 'kyo';

  // 0. 샌드백
  if (charId === 'sandbag') {
    ctx.fillStyle = '#64748b';
    ctx.beginPath(); ctx.roundRect(-22, -90 + idleY, 44, 75, 12); ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(0, -65 + idleY, 12, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    return;
  }

  // 1. 쿠사나리 큐 (KYU KUSANARI / GOD KYU)
  if (charId === 'kyo' || charId === 'god_kyo') {
    // 무술화
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-22, -10 + idleY, 14, 10);
    ctx.fillRect(8, -10 + idleY, 14, 10);
    // 바지
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-20, -48 + idleY, 16, 40);
    ctx.fillRect(6, -48 + idleY, 16, 40);
    // 흰 T셔츠 & 검은 가죽 자켓
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-16, -90 + idleY, 32, 45);
    ctx.fillStyle = charId === 'god_kyo' ? '#ea580c' : '#1e293b';
    ctx.fillRect(-24, -95 + idleY, 12, 48);
    ctx.fillRect(12, -95 + idleY, 12, 48);
    // 얼굴 & 헤어 band
    ctx.fillStyle = '#fde047';
    ctx.beginPath(); ctx.arc(0, -112 + idleY, 16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(0, -118 + idleY, 18, Math.PI, 0); ctx.fill();
    ctx.fillStyle = charId === 'god_kyo' ? '#facc15' : '#ffffff'; // 머리띠
    ctx.fillRect(-17, -116 + idleY, 34, 6);

    // 공격 화염 기술 이펙트 (황물기/독물기/대사격)
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
  // 2. 야가리 이오리 (IORI YAGARI / OROCHI IORIN)
  else if (charId === 'iori' || charId === 'orochi_iori') {
    // 붉은 바지 & 가죽 끈
    ctx.fillStyle = charId === 'orochi_iori' ? '#e11d48' : '#dc2626';
    ctx.fillRect(-22, -48 + idleY, 18, 40);
    ctx.fillRect(4, -48 + idleY, 18, 40);

    ctx.strokeStyle = '#450a0a';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-10, -30 + idleY); ctx.lineTo(10, -30 + idleY); ctx.stroke();

    // 네이비 셔츠 & 흰 깃
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(-24, -95 + idleY, 48, 50);
    ctx.fillStyle = charId === 'orochi_iori' ? '#881337' : '#ffffff';
    ctx.beginPath(); ctx.moveTo(-15, -95 + idleY); ctx.lineTo(0, -70 + idleY); ctx.lineTo(15, -95 + idleY); ctx.fill();

    // 얼굴 & 붉은 롱헤어
    ctx.fillStyle = charId === 'orochi_iori' ? '#ffe4e6' : '#fef08a';
    ctx.beginPath(); ctx.arc(0, -110 + idleY, 16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath(); ctx.arc(-2, -115 + idleY, 20, Math.PI * 0.8, Math.PI * 2.2); ctx.fill();
    ctx.fillRect(2, -120 + idleY, 12, 24);

    // 어둠쫓기/팔지녀 자색 화염 & 클로 공격
    if (action === 'punch' || action === 'fireball' || action === 'kick') {
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(8, -92 + idleY, 50, 14);

      ctx.save();
      ctx.fillStyle = charId === 'orochi_iori' ? '#f43f5e' : '#a855f7';
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
  } 
  // 3. 백열각 춘리 (CHUN-RI)
  else if (charId === 'chunli') {
    // 파란 부츠
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(-20, -12 + idleY, 14, 12);
    ctx.fillRect(6, -12 + idleY, 14, 12);
    // 허벅지 & 살구색 피부
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(-18, -48 + idleY, 14, 38);
    ctx.fillRect(4, -48 + idleY, 14, 38);
    // 청색 치파오 & 금빛 테두리
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(-22, -92 + idleY, 44, 46);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-20, -92 + idleY, 40, 6);

    // 머리 만두 덤블린 & 살구색 얼굴
    ctx.fillStyle = '#1c1917';
    ctx.beginPath(); ctx.arc(-16, -118 + idleY, 8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(16, -118 + idleY, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff'; // 만두 띠
    ctx.fillRect(-18, -120 + idleY, 6, 6);
    ctx.fillRect(12, -120 + idleY, 6, 6);
    ctx.fillStyle = '#fde68a';
    ctx.beginPath(); ctx.arc(0, -110 + idleY, 14, 0, Math.PI * 2); ctx.fill();

    // 백열각 (Lightning Leg Kick) 폭풍 잔상 이펙트
    if (action === 'punch' || action === 'kick' || action === 'fireball') {
      ctx.fillStyle = '#3b82f6';
      ctx.shadowColor = '#60a5fa';
      ctx.shadowBlur = 20;
      ctx.fillRect(10, -50 + idleY, 55, 18);
      ctx.fillRect(14, -70 + idleY, 50, 16);
      ctx.fillRect(18, -30 + idleY, 45, 16);
    }
  }
  // 4. 테리 보가로 (TERRY BOGARO)
  else if (charId === 'terry') {
    // 빨간 운동화
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-22, -10 + idleY, 16, 10);
    ctx.fillRect(6, -10 + idleY, 16, 10);
    // 파란 청바지
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(-20, -48 + idleY, 16, 40);
    ctx.fillRect(4, -48 + idleY, 16, 40);
    // 흰 T셔츠 & 빨간 가죽 베스트 자켓
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-18, -90 + idleY, 36, 44);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-24, -92 + idleY, 12, 46);
    ctx.fillRect(12, -92 + idleY, 12, 46);

    // 얼굴 & 금발 & 빨간 FATAL 모자
    ctx.fillStyle = '#fde68a';
    ctx.beginPath(); ctx.arc(0, -108 + idleY, 15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fbbf24'; // 금발
    ctx.fillRect(-14, -114 + idleY, 28, 8);
    ctx.fillStyle = '#dc2626'; // 빨간 모자
    ctx.fillRect(-18, -122 + idleY, 36, 10);
    ctx.fillRect(-22, -114 + idleY, 44, 4);

    // 파워 가이져 (Power Geyser) 지면 폭발 이펙트
    if (action === 'punch' || action === 'kick' || action === 'fireball') {
      ctx.save();
      ctx.fillStyle = '#f97316';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 30;
      ctx.beginPath(); ctx.moveTo(20, 0); ctx.lineTo(60, -90); ctx.lineTo(80, 0); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
  }
  // 5. 그림자 닌자 류 (SHADOW NINJA)
  else if (charId === 'shadow_ninja') {
    // 닌자 부츠
    ctx.fillStyle = '#374151';
    ctx.fillRect(-20, -10 + idleY, 14, 10);
    ctx.fillRect(6, -10 + idleY, 14, 10);
    // 보라 닌자 복장 & 띠
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(-18, -90 + idleY, 36, 80);
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(-18, -50 + idleY, 36, 6);

    // 복면 Head & 안광 Glowing Eyes
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath(); ctx.arc(0, -110 + idleY, 15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#c084fc'; // 안대
    ctx.fillRect(-14, -112 + idleY, 28, 6);
    ctx.fillStyle = '#ffffff'; // 안광
    ctx.beginPath(); ctx.arc(-5, -109 + idleY, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(5, -109 + idleY, 2.5, 0, Math.PI * 2); ctx.fill();

    // 등 뒤의 카타나 장검
    ctx.strokeStyle = '#c0c0c0';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-10, -115 + idleY); ctx.lineTo(-26, -45 + idleY); ctx.stroke();

    // 환영 베기 잔상 이펙트
    if (action === 'punch' || action === 'kick' || action === 'fireball') {
      ctx.save();
      ctx.strokeStyle = '#c084fc';
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 25;
      ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(35, -75 + idleY, 45, -Math.PI * 0.4, Math.PI * 0.4); ctx.stroke();
      ctx.restore();
    }
  }
  // 6. 사이보그 킹 (CYBER MECHA)
  else if (charId === 'cyber_mecha') {
    // 제트 부츠
    ctx.fillStyle = '#334155';
    ctx.fillRect(-22, -12 + idleY, 16, 12);
    ctx.fillRect(6, -12 + idleY, 16, 12);
    ctx.fillStyle = '#f97316'; // 분사구
    ctx.fillRect(-18, -4 + idleY, 8, 4);
    ctx.fillRect(10, -4 + idleY, 8, 4);

    // 메카 장갑 체형
    ctx.fillStyle = '#475569';
    ctx.fillRect(-24, -92 + idleY, 48, 80);
    // 가슴 플라즈마 코어
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath(); ctx.arc(0, -65 + idleY, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, -65 + idleY, 4, 0, Math.PI * 2); ctx.fill();

    // 메카 투구 & 바이저 안광
    ctx.fillStyle = '#334155';
    ctx.fillRect(-18, -122 + idleY, 36, 28);
    ctx.fillStyle = '#22d3ee'; // 바이저
    ctx.fillRect(-14, -114 + idleY, 28, 8);

    // 플라즈마 로켓 / 미사일 이펙트
    if (action === 'punch' || action === 'kick' || action === 'fireball') {
      ctx.save();
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 30;
      ctx.fillRect(20, -75 + idleY, 50, 14);
      ctx.fillRect(24, -95 + idleY, 45, 12);
      ctx.fillRect(24, -55 + idleY, 45, 12);
      ctx.restore();
    }
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

  ctx.fillText(`🔥 MAX ${combo} COMBO SUPER SPECIAL! 🔥`, w / 2, bannerY + 60);

  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText(`[${char.name}] 108식 대사격 / 팔지녀 초필살기 폭발!`, w / 2, bannerY + 98);

  ctx.restore();
}
