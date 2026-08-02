import React, { useEffect, useRef, useState } from 'react';

const ARENA_BACKGROUND = 'linear-gradient(to bottom, #070014 0%, #15002b 25%, #0b1526 50%, #172338 75%, #0d1322 100%)';

export const ArcadeCanvas = ({ 
  playerChar, enemyChar, playerHp, maxPlayerHp, enemyHp, maxEnemyHp, 
  playerAction, enemyAction, combo, isSuperMoveActive, stage = 1, mode = "solo"
}) => {
  const canvasRef = useRef(null);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => (t > 0 ? t - 1 : 60)), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];
    let hitTexts = [];
    let screenShake = 0;

    const addHitParticles = (x, y, color) => {
      for (let i = 0; i < 55; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 18 + 4;
        particles.push({
          x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          radius: Math.random() * 7 + 2, color,
          alpha: 1, life: 30 + Math.random() * 15,
          type: Math.random() > 0.6 ? 'spark' : 'circle'
        });
      }
      hitTexts.push({ x: x + (Math.random() - 0.5) * 30, y: y - 40,
        text: combo > 3 ? `${combo} HIT COMBO!` : `HIT!`, alpha: 1, vy: -3.2, scale: combo > 3 ? 1.4 : 1 });
    };

    if (playerAction !== 'idle') {
      screenShake = playerAction === 'fireball' ? 22 : 12;
      addHitParticles(540, 180, playerChar.color || '#f59e0b');
    }
    if (enemyAction !== 'idle') {
      screenShake = 14;
      addHitParticles(260, 180, enemyChar.color || '#ef4444');
    }

    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, 800, 400);
      ctx.save();
      if (screenShake > 0) {
        ctx.translate((Math.random() - 0.5) * screenShake, (Math.random() - 0.5) * screenShake);
        screenShake *= 0.82;
        if (screenShake < 0.4) screenShake = 0;
      }

      drawBackground(ctx, 800, 400, tick);
      drawStageFloor(ctx, 800, 400);

      // 캐릭터 그림자
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.beginPath(); ctx.ellipse(220, 318, 50, 10, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(580, 318, 50, 10, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      drawFighter8Head(ctx, 220, 320, playerChar, playerAction, false, tick);
      drawFighter8Head(ctx, 580, 320, enemyChar, enemyAction, true, tick);

      // 파티클
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.3;
        p.alpha -= 1 / p.life; p.vx *= 0.97;
        if (p.alpha <= 0) return;
        ctx.save(); ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.shadowColor = p.color; ctx.shadowBlur = 16;
        if (p.type === 'spark') {
          ctx.strokeStyle = p.color; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3); ctx.stroke();
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      });
      particles = particles.filter(p => p.alpha > 0);

      hitTexts.forEach(ht => {
        ht.y += ht.vy; ht.alpha -= 0.025;
        ctx.save(); ctx.globalAlpha = Math.max(0, ht.alpha);
        ctx.font = `900 ${Math.round(26 * ht.scale)}px "Impact", sans-serif`;
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000'; ctx.lineWidth = 5;
        ctx.strokeText(ht.text, ht.x, ht.y);
        ctx.fillStyle = '#fde047'; ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 20;
        ctx.fillText(ht.text, ht.x, ht.y);
        ctx.restore();
      });
      hitTexts = hitTexts.filter(ht => ht.alpha > 0);

      if (isSuperMoveActive) drawSuperOverlay(ctx, 800, 400, playerChar, combo, tick);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, [playerAction, enemyAction, isSuperMoveActive, stage, combo, playerChar, enemyChar]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border-4 border-amber-500/90 shadow-[0_0_50px_rgba(245,158,11,0.5)]"
      style={{ backgroundImage: ARENA_BACKGROUND }}>
      <canvas ref={canvasRef} width={800} height={400} className="w-full h-auto block bg-transparent" />

      {/* HUD */}
      <div className="absolute top-2.5 left-4 right-4 pointer-events-none flex justify-between items-start">
        <div className="w-[340px]">
          <div className="flex items-center justify-between mb-0.5 px-1">
            <span className="text-[11px] font-black italic tracking-widest text-cyan-300 drop-shadow-[0_0_8px_#06b6d4]">P1</span>
            <span className="text-xs font-black italic text-yellow-300 tracking-wider">{playerChar.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 border-2 border-amber-400 rounded-lg bg-slate-900 overflow-hidden shrink-0 shadow-[0_0_15px_rgba(245,166,35,0.6)]"
              dangerouslySetInnerHTML={{ __html: playerChar.avatarSvg || '' }} />
            <div className="flex-1">
              <div className="w-full h-5 bg-black border-2 border-white rounded-sm overflow-hidden p-0.5 shadow-inner">
                <div className="h-full bg-gradient-to-r from-emerald-400 via-yellow-300 to-green-500 transition-all duration-200 border-r-2 border-white shadow-[0_0_10px_#10b981]"
                  style={{ width: `${Math.max(0, (playerHp / maxPlayerHp) * 100)}%` }} />
              </div>
              <div className="flex gap-2 text-[9px] font-bold text-amber-400 tracking-tighter mt-0.5">
                <span>BENIMARO</span><span>DAIMOU</span>
              </div>
            </div>
          </div>
        </div>

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

        <div className="w-[340px] text-right">
          <div className="flex items-center justify-between mb-0.5 px-1">
            <span className="text-xs font-black italic text-yellow-300 tracking-wider">{enemyChar.name}</span>
            <span className="text-[11px] font-black italic tracking-widest text-cyan-300 drop-shadow-[0_0_8px_#06b6d4]">P2</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="w-full h-5 bg-black border-2 border-white rounded-sm overflow-hidden p-0.5 shadow-inner">
                <div className="h-full bg-gradient-to-l from-yellow-300 via-emerald-400 to-green-500 transition-all duration-200 border-l-2 border-white shadow-[0_0_10px_#10b981] ml-auto"
                  style={{ width: `${Math.max(0, (enemyHp / maxEnemyHp) * 100)}%` }} />
              </div>
              <div className="flex justify-end gap-2 text-[9px] font-bold text-rose-400 tracking-tighter mt-0.5">
                <span>MATURO</span><span>VISE</span>
              </div>
            </div>
            <div className="w-12 h-12 border-2 border-red-500 rounded-lg bg-slate-900 overflow-hidden shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.6)]"
              dangerouslySetInnerHTML={{ __html: enemyChar.avatarSvg || '' }} />
          </div>
        </div>
      </div>

      {/* Bottom Gauges */}
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

// ============ BACKGROUND ============
function drawBackground(ctx, w, h, tick) {
  // 건물 실루엣
  const buildings = [
    { x: 20, w: 80, h: 150 }, { x: 120, w: 100, h: 200 },
    { x: 250, w: 70, h: 130 }, { x: 340, w: 90, h: 170 },
    { x: 460, w: 110, h: 210 }, { x: 590, w: 85, h: 160 }, { x: 700, w: 100, h: 185 }
  ];
  buildings.forEach(b => {
    ctx.fillStyle = '#060c18';
    ctx.fillRect(b.x, 310 - b.h, b.w, b.h);
    // 창문들
    ctx.fillStyle = '#fef08a';
    for (let r = 0; r < Math.floor(b.h / 28); r++) {
      for (let c = 0; c < Math.floor(b.w / 20); c++) {
        if ((r + c + Math.floor(tick / 120)) % 3 !== 0) {
          ctx.globalAlpha = 0.4 + Math.sin(tick * 0.01 + r + c) * 0.3;
          ctx.fillRect(b.x + 8 + c * 18, 310 - b.h + 12 + r * 26, 8, 14);
        }
      }
    }
    ctx.globalAlpha = 1;
  });

  // 서치라이트 빔
  const a1 = Math.sin(tick * 0.018) * 0.5;
  const a2 = Math.cos(tick * 0.022) * 0.5;
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath(); ctx.moveTo(120, 310); ctx.lineTo(120 + Math.sin(a1) * 250 - 50, 0); ctx.lineTo(120 + Math.sin(a1) * 250 + 50, 0); ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.beginPath(); ctx.moveTo(680, 310); ctx.lineTo(680 + Math.sin(a2) * 250 - 50, 0); ctx.lineTo(680 + Math.sin(a2) * 250 + 50, 0); ctx.fill();
  ctx.restore();
}

function drawStageFloor(ctx, w, h) {
  // 그라데이션 바닥
  const floorGrad = ctx.createLinearGradient(0, 310, 0, h);
  floorGrad.addColorStop(0, '#1a1a2e');
  floorGrad.addColorStop(1, '#0a0a15');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, 310, w, h - 310);

  // 타일 라인
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
  ctx.lineWidth = 1;
  for (let i = 0; i < w; i += 60) {
    ctx.beginPath(); ctx.moveTo(i, 310); ctx.lineTo(i - 30, h); ctx.stroke();
  }

  // 금색 스테이지 엣지 라인
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.moveTo(0, 310); ctx.lineTo(w, 310); ctx.stroke();
  ctx.shadowBlur = 0;
}

// ============ 8등신 격투가 (Full anatomical proportional fighter) ============
function drawFighter8Head(ctx, x, groundY, char, action, flip, tick) {
  ctx.save();
  ctx.translate(x, groundY);
  if (flip) ctx.scale(-1, 1);

  const charId = char.id || 'default';
  const breathe = Math.sin(tick * 0.12) * 2;
  const isAttacking = action !== 'idle';

  // 샌드백
  if (charId === 'sandbag') {
    drawSandbag(ctx, breathe);
    ctx.restore();
    return;
  }

  // 캐릭터별 색상 팔레트
  const palette = getCharPalette(charId, char);

  if (isAttacking) {
    drawFighterAttackPose(ctx, palette, action, tick, charId);
  } else {
    drawFighterIdlePose(ctx, palette, breathe, tick, charId);
  }

  ctx.restore();
}

function getCharPalette(charId, char) {
  const palettes = {
    kyo:          { skin: '#F5D6A8', hair: '#2C1810', hairH: '#1a0e08', top: '#FFFFFF', topH: '#e0e0e0', jacket: '#1E293B', jacketH: '#0f172a', pants: '#1a1a2e', pantsH: '#0d0d1a', shoes: '#FFFFFF', shoesH: '#ccc', headband: '#FFFFFF', energy: '#F59E0B', energyH: '#EA580C' },
    god_kyo:      { skin: '#F5D6A8', hair: '#2C1810', hairH: '#1a0e08', top: '#FFFFFF', topH: '#e0e0e0', jacket: '#EA580C', jacketH: '#C2410C', pants: '#1a1a2e', pantsH: '#0d0d1a', shoes: '#EA580C', shoesH: '#C2410C', headband: '#FACC15', energy: '#F97316', energyH: '#EF4444' },
    iori:         { skin: '#F9E4C8', hair: '#DC2626', hairH: '#991B1B', top: '#1E1B4B', topH: '#15133a', jacket: '#1E1B4B', jacketH: '#15133a', pants: '#DC2626', pantsH: '#991B1B', shoes: '#1C1917', shoesH: '#111', headband: null, energy: '#A855F7', energyH: '#7C3AED', collar: '#FFFFFF' },
    orochi_iori:  { skin: '#FFE4E6', hair: '#E11D48', hairH: '#9F1239', top: '#1E1B4B', topH: '#15133a', jacket: '#1E1B4B', jacketH: '#15133a', pants: '#E11D48', pantsH: '#9F1239', shoes: '#1C1917', shoesH: '#111', headband: null, energy: '#F43F5E', energyH: '#E11D48', collar: '#881337' },
    chunli:       { skin: '#F5D6A8', hair: '#1C1917', hairH: '#0a0a0a', top: '#3B82F6', topH: '#2563EB', jacket: '#3B82F6', jacketH: '#2563EB', pants: '#3B82F6', pantsH: '#1D4ED8', shoes: '#FFFFFF', shoesH: '#e0e0e0', headband: null, energy: '#60A5FA', energyH: '#3B82F6', buns: true, sash: '#FDE047' },
    terry:        { skin: '#F5D6A8', hair: '#FDE047', hairH: '#D4A017', top: '#FFFFFF', topH: '#e0e0e0', jacket: '#DC2626', jacketH: '#991B1B', pants: '#2563EB', pantsH: '#1D4ED8', shoes: '#DC2626', shoesH: '#991B1B', headband: null, energy: '#F97316', energyH: '#EA580C', cap: '#DC2626', capText: 'FATAL' },
    mai:          { skin: '#F5D6A8', hair: '#1C1917', hairH: '#0a0a0a', top: '#E11D48', topH: '#9F1239', jacket: '#E11D48', jacketH: '#9F1239', pants: '#E11D48', pantsH: '#9F1239', shoes: '#E11D48', shoesH: '#BE123C', headband: null, energy: '#FDE047', energyH: '#F59E0B', fan: true },
    kyoji:        { skin: '#F5D6A8', hair: '#10B981', hairH: '#047857', top: '#047857', topH: '#065F46', jacket: '#047857', jacketH: '#065F46', pants: '#0F172A', pantsH: '#060b14', shoes: '#10B981', shoesH: '#059669', headband: '#10B981', energy: '#34D399', energyH: '#10B981' },
    shadow_ninja: { skin: '#1E1B4B', hair: '#4C1D95', hairH: '#3B0764', top: '#1E1B4B', topH: '#15133a', jacket: '#1E1B4B', jacketH: '#15133a', pants: '#1E1B4B', pantsH: '#15133a', shoes: '#374151', shoesH: '#1F2937', headband: null, energy: '#A855F7', energyH: '#7C3AED', mask: '#C084FC', scarf: '#7C3AED', sword: true },
    cyber_mecha:  { skin: '#475569', hair: '#22D3EE', hairH: '#06B6D4', top: '#334155', topH: '#1E293B', jacket: '#475569', jacketH: '#334155', pants: '#64748B', pantsH: '#475569', shoes: '#334155', shoesH: '#1E293B', headband: null, energy: '#22D3EE', energyH: '#06B6D4', visor: '#22D3EE', armor: true },
    kura:         { skin: '#F9E4C8', hair: '#38BDF8', hairH: '#0EA5E9', top: '#0284C7', topH: '#0369A1', jacket: '#0284C7', jacketH: '#0369A1', pants: '#38BDF8', pantsH: '#0EA5E9', shoes: '#E0F2FE', shoesH: '#BAE6FD', headband: null, energy: '#38BDF8', energyH: '#0EA5E9' },
    rugar:        { skin: '#F5D6A8', hair: '#EAB308', hairH: '#A16207', top: '#854D0E', topH: '#713F12', jacket: '#854D0E', jacketH: '#713F12', pants: '#1C1917', pantsH: '#0a0a0a', shoes: '#EAB308', shoesH: '#CA8A04', headband: null, energy: '#EAB308', energyH: '#D97706', eyepatch: true },
  };
  return palettes[charId] || {
    skin: '#F5D6A8', hair: char.color || '#3B82F6', hairH: char.secondaryColor || '#1E293B',
    top: char.color || '#3B82F6', topH: char.secondaryColor || '#1E293B',
    jacket: char.color || '#3B82F6', jacketH: char.secondaryColor || '#1E293B',
    pants: char.secondaryColor || '#1E293B', pantsH: '#0f172a',
    shoes: '#333', shoesH: '#222', headband: null, energy: char.color || '#F59E0B', energyH: '#EA580C'
  };
}

// ============ 8등신 아이들 포즈 ============
function drawFighterIdlePose(ctx, p, breathe, tick, charId) {
  // 총 높이 ~190px (head ~24px 기준 x 8 ≈ 192)
  const HEAD_R = 12;
  const headY = -178 + breathe;
  const neckY = headY + HEAD_R + 2;
  const shoulderY = neckY + 8;
  const chestY = shoulderY;
  const waistY = shoulderY + 45;
  const hipY = waistY + 8;
  const kneeY = hipY + 48;
  const footY = kneeY + 44;

  // 다리 (뒤)
  const legSpread = 14;

  // === 뒷다리 (왼쪽) ===
  drawLimb(ctx, -legSpread, hipY, -legSpread - 4, kneeY, 11, p.pants, p.pantsH);
  drawLimb(ctx, -legSpread - 4, kneeY, -legSpread - 2, footY, 10, p.pants, p.pantsH);
  drawShoe(ctx, -legSpread - 2, footY, 13, 7, p.shoes, p.shoesH, false);

  // === 몸통 ===
  // 상체
  drawTorso(ctx, 0, chestY, waistY, p, charId, breathe);

  // === 뒷팔 (왼쪽) ===
  const backElbowX = -22, backElbowY = shoulderY + 28 + breathe;
  const backHandX = -16, backHandY = backElbowY + 28;
  drawLimb(ctx, -18, shoulderY + breathe, backElbowX, backElbowY, 9, p.jacket, p.jacketH);
  drawLimb(ctx, backElbowX, backElbowY, backHandX, backHandY, 8, p.jacket, p.jacketH);
  drawHand(ctx, backHandX, backHandY, 6, p.skin);

  // === 앞다리 (오른쪽) ===
  drawLimb(ctx, legSpread, hipY, legSpread + 6, kneeY, 12, p.pants, p.pantsH);
  drawLimb(ctx, legSpread + 6, kneeY, legSpread + 3, footY, 11, p.pants, p.pantsH);
  drawShoe(ctx, legSpread + 3, footY, 14, 7, p.shoes, p.shoesH, true);

  // === 앞팔 (오른쪽 - 격투 자세로 들어올림) ===
  const frontElbowX = 20, frontElbowY = shoulderY + 18 + breathe;
  const frontHandX = 16, frontHandY = shoulderY + 5 + breathe;
  drawLimb(ctx, 16, shoulderY + breathe, frontElbowX, frontElbowY, 9, p.jacket, p.jacketH);
  drawLimb(ctx, frontElbowX, frontElbowY, frontHandX, frontHandY, 8, p.skin, p.skin);
  drawFist(ctx, frontHandX, frontHandY, 7, p.skin);

  // === 벨트 ===
  ctx.fillStyle = '#333';
  ctx.fillRect(-14, waistY - 3, 28, 5);
  ctx.fillStyle = '#F59E0B';
  ctx.fillRect(-4, waistY - 3, 8, 5);

  // === 목 ===
  ctx.fillStyle = p.skin;
  ctx.fillRect(-4, neckY, 8, 8);

  // === 머리 ===
  drawHead(ctx, 0, headY, HEAD_R, p, charId, tick);
}

// ============ 8등신 어택 포즈 ============
function drawFighterAttackPose(ctx, p, action, tick, charId) {
  const HEAD_R = 12;
  const headY = -178;
  const neckY = headY + HEAD_R + 2;
  const shoulderY = neckY + 8;
  const waistY = shoulderY + 45;
  const hipY = waistY + 8;
  const kneeY = hipY + 48;
  const footY = kneeY + 44;
  const legSpread = 14;

  if (action === 'kick') {
    // 앞발차기: 뒷다리 구부리고 앞다리 쭉 뻗음
    drawLimb(ctx, -legSpread, hipY, -legSpread - 10, kneeY + 10, 11, p.pants, p.pantsH);
    drawLimb(ctx, -legSpread - 10, kneeY + 10, -legSpread - 5, footY, 10, p.pants, p.pantsH);
    drawShoe(ctx, -legSpread - 5, footY, 13, 7, p.shoes, p.shoesH, false);

    drawTorso(ctx, 0, shoulderY, waistY, p, charId, 0);

    // 킥 다리 (수평으로 쭉)
    drawLimb(ctx, legSpread, hipY, legSpread + 40, hipY - 10, 12, p.pants, p.pantsH);
    drawLimb(ctx, legSpread + 40, hipY - 10, legSpread + 80, hipY - 15, 11, p.pants, p.pantsH);
    drawShoe(ctx, legSpread + 80, hipY - 15, 15, 8, p.shoes, p.shoesH, true);

    // 킥 잔상 이펙트
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = p.energy; ctx.lineWidth = 3; ctx.shadowColor = p.energy; ctx.shadowBlur = 15;
    for (let i = 0; i < 4; i++) {
      const offset = i * 12;
      ctx.beginPath();
      ctx.arc(legSpread + 50 + offset, hipY - 12, 18 - i * 3, -0.5, 0.5);
      ctx.stroke();
    }
    ctx.restore();

    // 양팔 방어 자세
    drawLimb(ctx, -18, shoulderY, -26, shoulderY + 25, 9, p.jacket, p.jacketH);
    drawLimb(ctx, -26, shoulderY + 25, -20, shoulderY + 10, 8, p.skin, p.skin);
    drawFist(ctx, -20, shoulderY + 10, 6, p.skin);

    drawLimb(ctx, 16, shoulderY, 22, shoulderY + 20, 9, p.jacket, p.jacketH);
    drawLimb(ctx, 22, shoulderY + 20, 18, shoulderY + 5, 8, p.skin, p.skin);
    drawFist(ctx, 18, shoulderY + 5, 6, p.skin);

  } else if (action === 'fireball') {
    // 파이어볼: 양손 모으고 에너지 방출
    drawLimb(ctx, -legSpread, hipY, -legSpread - 6, kneeY, 11, p.pants, p.pantsH);
    drawLimb(ctx, -legSpread - 6, kneeY, -legSpread - 3, footY, 10, p.pants, p.pantsH);
    drawShoe(ctx, -legSpread - 3, footY, 13, 7, p.shoes, p.shoesH, false);

    drawTorso(ctx, 0, shoulderY, waistY, p, charId, 0);

    drawLimb(ctx, legSpread, hipY, legSpread + 8, kneeY, 12, p.pants, p.pantsH);
    drawLimb(ctx, legSpread + 8, kneeY, legSpread + 5, footY, 11, p.pants, p.pantsH);
    drawShoe(ctx, legSpread + 5, footY, 14, 7, p.shoes, p.shoesH, true);

    // 양팔 에너지 방출 포즈
    const aimX = 60, aimY = shoulderY + 15;
    drawLimb(ctx, -18, shoulderY, 10, shoulderY + 15, 9, p.jacket, p.jacketH);
    drawLimb(ctx, 10, shoulderY + 15, aimX - 15, aimY, 8, p.skin, p.skin);
    drawLimb(ctx, 16, shoulderY, 30, shoulderY + 10, 9, p.jacket, p.jacketH);
    drawLimb(ctx, 30, shoulderY + 10, aimX - 15, aimY, 8, p.skin, p.skin);
    drawFist(ctx, aimX - 15, aimY, 7, p.skin);

    // 에너지 구체
    const pulse = Math.sin(tick * 0.5) * 8;
    ctx.save();
    ctx.shadowColor = p.energy; ctx.shadowBlur = 40;
    ctx.fillStyle = p.energyH; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.arc(aimX + 25, aimY, 30 + pulse, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = p.energy; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.arc(aimX + 25, aimY, 20 + pulse * 0.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.arc(aimX + 25, aimY, 8, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

  } else {
    // 펀치: 팔 쭉 뻗기
    drawLimb(ctx, -legSpread, hipY, -legSpread - 4, kneeY, 11, p.pants, p.pantsH);
    drawLimb(ctx, -legSpread - 4, kneeY, -legSpread - 2, footY, 10, p.pants, p.pantsH);
    drawShoe(ctx, -legSpread - 2, footY, 13, 7, p.shoes, p.shoesH, false);

    drawTorso(ctx, 0, shoulderY, waistY, p, charId, 0);

    drawLimb(ctx, legSpread + 2, hipY, legSpread + 10, kneeY, 12, p.pants, p.pantsH);
    drawLimb(ctx, legSpread + 10, kneeY, legSpread + 7, footY, 11, p.pants, p.pantsH);
    drawShoe(ctx, legSpread + 7, footY, 14, 7, p.shoes, p.shoesH, true);

    // 뒷팔 (방어)
    drawLimb(ctx, -18, shoulderY, -24, shoulderY + 28, 9, p.jacket, p.jacketH);
    drawLimb(ctx, -24, shoulderY + 28, -18, shoulderY + 12, 8, p.skin, p.skin);
    drawFist(ctx, -18, shoulderY + 12, 6, p.skin);

    // 앞팔 (스트레이트 펀치)
    drawLimb(ctx, 16, shoulderY, 45, shoulderY - 5, 10, p.jacket, p.jacketH);
    drawLimb(ctx, 45, shoulderY - 5, 85, shoulderY - 8, 9, p.skin, p.skin);
    drawFist(ctx, 85, shoulderY - 8, 8, p.skin);

    // 펀치 임팩트 라인
    ctx.save();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.globalAlpha = 0.6;
    for (let i = 0; i < 6; i++) {
      const ang = (Math.random() - 0.5) * 1.5;
      const len = 15 + Math.random() * 20;
      ctx.beginPath();
      ctx.moveTo(90 + Math.cos(ang) * 5, shoulderY - 8 + Math.sin(ang) * 5);
      ctx.lineTo(90 + Math.cos(ang) * len, shoulderY - 8 + Math.sin(ang) * len);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 벨트
  ctx.fillStyle = '#333';
  ctx.fillRect(-14, waistY - 3, 28, 5);
  ctx.fillStyle = '#F59E0B';
  ctx.fillRect(-4, waistY - 3, 8, 5);

  // 목
  ctx.fillStyle = p.skin;
  ctx.fillRect(-4, neckY, 8, 8);

  // 머리
  drawHead(ctx, 0, headY, HEAD_R, p, charId, tick);
}

// ============ 세부 렌더링 함수들 ============

function drawLimb(ctx, x1, y1, x2, y2, width, color, shadowColor) {
  ctx.save();
  ctx.lineCap = 'round';
  // 그림자/볼륨
  if (shadowColor) {
    ctx.strokeStyle = shadowColor; ctx.lineWidth = width + 2;
    ctx.beginPath(); ctx.moveTo(x1 + 1, y1 + 1); ctx.lineTo(x2 + 1, y2 + 1); ctx.stroke();
  }
  ctx.strokeStyle = color; ctx.lineWidth = width;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  // 관절 하이라이트
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x1, y1, width / 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x2, y2, width / 2, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawTorso(ctx, cx, topY, bottomY, p, charId, breathe) {
  const w = 30, topW = 34;
  ctx.save();

  // 몸통 메인 (어깨 넓고 허리 좁은 사다리꼴)
  ctx.fillStyle = p.top;
  ctx.beginPath();
  ctx.moveTo(-topW / 2, topY + breathe);
  ctx.lineTo(topW / 2, topY + breathe);
  ctx.lineTo(w / 2, bottomY);
  ctx.lineTo(-w / 2, bottomY);
  ctx.closePath();
  ctx.fill();

  // 어깨 볼륨
  ctx.fillStyle = p.jacket;
  ctx.beginPath();
  ctx.ellipse(-topW / 2 + 2, topY + 4 + breathe, 8, 10, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(topW / 2 - 2, topY + 4 + breathe, 8, 10, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // 재킷/윗옷 디테일
  ctx.strokeStyle = p.jacketH || '#111';
  ctx.lineWidth = 1.5;
  // 세로 가운데 라인 (옷 앞섶)
  ctx.beginPath();
  ctx.moveTo(0, topY + 5 + breathe);
  ctx.lineTo(0, bottomY - 2);
  ctx.stroke();

  // 칼라
  if (p.collar) {
    ctx.fillStyle = p.collar;
    ctx.beginPath();
    ctx.moveTo(-8, topY + breathe);
    ctx.lineTo(0, topY + 12 + breathe);
    ctx.lineTo(8, topY + breathe);
    ctx.closePath();
    ctx.fill();
  }

  // 가슴 근육 라인
  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(-8, topY + 18 + breathe, 10, -0.8, 0.8);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(8, topY + 18 + breathe, 10, Math.PI - 0.8, Math.PI + 0.8);
  ctx.stroke();

  ctx.restore();
}

function drawHead(ctx, cx, cy, r, p, charId, tick) {
  ctx.save();

  // 머리카락 뒷부분 (더 큰 볼륨)
  ctx.fillStyle = p.hairH;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 2, r + 4, r + 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 얼굴
  ctx.fillStyle = p.skin;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 1, r - 1, r, 0, 0, Math.PI * 2);
  ctx.fill();

  // 머리카락 앞부분
  ctx.fillStyle = p.hair;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 4, r + 2, r + 1, 0, Math.PI, 0);
  ctx.fill();

  // 캐릭터별 헤어스타일
  if (charId === 'iori' || charId === 'orochi_iori') {
    // 이오리 긴 앞머리
    ctx.fillStyle = p.hair;
    ctx.beginPath();
    ctx.moveTo(cx - 2, cy - r);
    ctx.quadraticCurveTo(cx + 6, cy + 5, cx + 3, cy + r + 12);
    ctx.lineTo(cx - 4, cy + 5);
    ctx.closePath();
    ctx.fill();
    // 뒷머리 날림
    ctx.beginPath();
    ctx.moveTo(cx - r, cy - 4);
    ctx.quadraticCurveTo(cx - r - 10, cy + 5, cx - r - 6, cy + r + 8);
    ctx.lineTo(cx - r + 3, cy + 4);
    ctx.closePath();
    ctx.fill();
  } else if (charId === 'terry') {
    // 테리 캡모자
    ctx.fillStyle = p.cap;
    ctx.beginPath();
    ctx.ellipse(cx, cy - 5, r + 5, r - 2, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(cx - r - 6, cy - 6, r * 2 + 12, 5);
    // FATAL 글씨
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 6px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FATAL', cx, cy - 6);
  } else if (p.buns) {
    // 춘리 쌍상투
    ctx.fillStyle = p.hair;
    ctx.beginPath(); ctx.arc(cx - r - 3, cy - 4, 7, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + r + 3, cy - 4, 7, 0, Math.PI * 2); ctx.fill();
    // 상투 리본
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - r - 6, cy - 6, 6, 3);
    ctx.fillRect(cx + r, cy - 6, 6, 3);
  } else if (charId === 'shadow_ninja') {
    // 닌자 마스크
    ctx.fillStyle = p.mask;
    ctx.fillRect(cx - r, cy - 2, r * 2, 6);
    // 스카프
    ctx.fillStyle = p.scarf;
    ctx.beginPath();
    ctx.moveTo(cx - r, cy + 4);
    ctx.quadraticCurveTo(cx - r - 15, cy + 20, cx - r - 8, cy + 30);
    ctx.lineTo(cx - r, cy + 8);
    ctx.closePath();
    ctx.fill();
  } else if (charId === 'cyber_mecha') {
    // 사이버 바이저
    ctx.fillStyle = p.visor;
    ctx.shadowColor = p.visor; ctx.shadowBlur = 8;
    ctx.fillRect(cx - r + 1, cy - 2, r * 2 - 2, 5);
    ctx.shadowBlur = 0;
  }

  // 헤드밴드
  if (p.headband) {
    ctx.fillStyle = p.headband;
    ctx.fillRect(cx - r - 1, cy - 3, r * 2 + 2, 4);
    // 끈 날림
    ctx.beginPath();
    ctx.moveTo(cx - r - 1, cy - 2);
    ctx.quadraticCurveTo(cx - r - 12, cy + 4 + Math.sin(tick * 0.15) * 3, cx - r - 8, cy + 14);
    ctx.strokeStyle = p.headband; ctx.lineWidth = 2.5; ctx.stroke();
  }

  // 눈
  if (charId !== 'shadow_ninja' && charId !== 'cyber_mecha') {
    const eyeY = cy + 1;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath(); ctx.ellipse(cx - 4, eyeY, 3.5, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 4, eyeY, 3.5, 3, 0, 0, Math.PI * 2); ctx.fill();

    // 동공
    const pupilColor = (charId === 'orochi_iori') ? '#EF4444' : (charId === 'iori') ? '#7C3AED' : '#1C1917';
    ctx.fillStyle = pupilColor;
    ctx.beginPath(); ctx.arc(cx - 3, eyeY, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 5, eyeY, 2, 0, Math.PI * 2); ctx.fill();

    // 하이라이트
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath(); ctx.arc(cx - 2.5, eyeY - 1, 0.8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 5.5, eyeY - 1, 0.8, 0, Math.PI * 2); ctx.fill();
  } else if (charId === 'shadow_ninja') {
    // 닌자 눈 (빛나는)
    ctx.fillStyle = '#ffffff'; ctx.shadowColor = '#A855F7'; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.ellipse(cx - 4, cy, 3, 2.5, -0.1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 4, cy, 3, 2.5, 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
  }

  // 입
  if (charId !== 'shadow_ninja' && charId !== 'cyber_mecha') {
    ctx.strokeStyle = '#B45309';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx - 3, cy + 6);
    ctx.quadraticCurveTo(cx, cy + 8, cx + 3, cy + 6);
    ctx.stroke();
  }

  // 안대
  if (p.eyepatch) {
    ctx.fillStyle = '#1C1917';
    ctx.beginPath(); ctx.arc(cx + 4, cy + 1, 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1C1917'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx + 8, cy - 1); ctx.lineTo(cx + r, cy - 5); ctx.stroke();
  }

  ctx.restore();
}

function drawHand(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}

function drawFist(ctx, x, y, r, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  // 손가락 주먹 마디
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath(); ctx.arc(x + 2, y - 2, r * 0.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x - 2, y - 2, r * 0.5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawShoe(ctx, x, y, w, h, color, shadow, isRight) {
  ctx.save();
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.roundRect(x - w / 2 + 1, y - h / 2 + 1, w + (isRight ? 5 : 0), h, [2, isRight ? 4 : 2, isRight ? 4 : 2, 2]);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x - w / 2, y - h / 2, w + (isRight ? 5 : 0), h, [2, isRight ? 4 : 2, isRight ? 4 : 2, 2]);
  ctx.fill();
  // 하이라이트
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(x - w / 2 + 2, y - h / 2 + 1, w - 4, 2);
  ctx.restore();
}

function drawSandbag(ctx, breathe) {
  // 체인
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, -200); ctx.lineTo(0, -160 + breathe); ctx.stroke();
  // 본체
  const grad = ctx.createLinearGradient(-28, -160, 28, -160);
  grad.addColorStop(0, '#7f1d1d'); grad.addColorStop(0.5, '#dc2626'); grad.addColorStop(1, '#991b1b');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.roundRect(-28, -160 + breathe, 56, 130, 14); ctx.fill();
  // 타격 마크
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath(); ctx.arc(0, -110 + breathe, 15, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(-8, -80 + breathe, 10, 0, Math.PI * 2); ctx.fill();
  // 스티칭
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, -155 + breathe); ctx.lineTo(0, -35 + breathe); ctx.stroke();
}

// ============ 초필살기 오버레이 ============
function drawSuperOverlay(ctx, w, h, char, combo, tick) {
  ctx.save();
  ctx.fillStyle = 'rgba(2, 6, 23, 0.93)';
  ctx.fillRect(0, 0, w, h);

  // 스피드 라인
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  for (let i = 0; i < 30; i++) {
    const ang = (i / 30) * Math.PI * 2 + tick * 0.05;
    const r1 = 80;
    const r2 = 400;
    ctx.beginPath();
    ctx.moveTo(w / 2 + Math.cos(ang) * r1, h / 2 + Math.sin(ang) * r1);
    ctx.lineTo(w / 2 + Math.cos(ang) * r2, h / 2 + Math.sin(ang) * r2);
    ctx.stroke();
  }
  ctx.restore();

  const bY = 120, bH = 140;
  const grad = ctx.createLinearGradient(0, bY, w, bY + bH);
  grad.addColorStop(0, '#dc2626'); grad.addColorStop(0.5, '#f59e0b'); grad.addColorStop(1, '#7f1d1d');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, bY); ctx.lineTo(w, bY - 18); ctx.lineTo(w, bY + bH); ctx.lineTo(0, bY + bH + 18);
  ctx.closePath(); ctx.fill();

  ctx.textAlign = 'center';
  ctx.font = '900 40px "Impact", sans-serif';
  ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 40;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`🔥 MAX ${combo} COMBO SUPER SPECIAL! 🔥`, w / 2, bY + 65);

  ctx.font = 'bold 24px sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText(`[${char.name}] 초필살기 폭발!`, w / 2, bY + 110);

  ctx.restore();
}
