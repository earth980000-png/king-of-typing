import React, { useEffect, useRef, useState } from 'react';

const ARENA_BG = 'linear-gradient(to bottom, #070014 0%, #15002b 25%, #0b1526 50%, #172338 75%, #0d1322 100%)';
const PX = 3; // 도트 1픽셀 크기

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

    const addHitFx = (x, y, color) => {
      for (let i = 0; i < 40; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = Math.random() * 16 + 3;
        particles.push({ x, y, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp,
          r: Math.random()*6+2, color, alpha: 1, life: 25+Math.random()*12,
          type: Math.random()>0.5?'spark':'dot' });
      }
      hitTexts.push({ x: x+(Math.random()-0.5)*30, y: y-30,
        text: combo>3 ? `${combo} COMBO!` : 'HIT!', alpha:1, vy:-2.8, sc: combo>3?1.3:1 });
    };

    if (playerAction !== 'idle') { screenShake = playerAction==='fireball'?20:10; addHitFx(540,185,playerChar.color||'#f59e0b'); }
    if (enemyAction !== 'idle') { screenShake = 12; addHitFx(260,185,enemyChar.color||'#ef4444'); }

    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0,0,800,400);
      ctx.save();
      if (screenShake > 0) {
        ctx.translate((Math.random()-.5)*screenShake,(Math.random()-.5)*screenShake);
        screenShake *= .82; if (screenShake<.4) screenShake=0;
      }

      drawBg(ctx,800,400,tick);
      drawFloor(ctx,800,400);

      // 그림자
      ctx.fillStyle='rgba(0,0,0,0.4)';
      ctx.beginPath(); ctx.ellipse(220,318,36,8,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(580,318,36,8,0,0,Math.PI*2); ctx.fill();

      drawChibiFighter(ctx, 220, 315, playerChar, playerAction, false, tick);
      drawChibiFighter(ctx, 580, 315, enemyChar, enemyAction, true, tick);

      // 파티클
      particles.forEach(p => {
        p.x+=p.vx; p.y+=p.vy; p.vy+=.25; p.alpha-=1/p.life; p.vx*=.97;
        if(p.alpha<=0) return;
        ctx.save(); ctx.globalAlpha=Math.max(0,p.alpha);
        ctx.shadowColor=p.color; ctx.shadowBlur=12;
        if(p.type==='spark'){
          ctx.strokeStyle=p.color; ctx.lineWidth=2;
          ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p.x-p.vx*2.5,p.y-p.vy*2.5); ctx.stroke();
        } else {
          ctx.fillStyle=p.color;
          ctx.fillRect(p.x-p.r/2,p.y-p.r/2,p.r,p.r); // 도트 파티클
        }
        ctx.restore();
      });
      particles = particles.filter(p => p.alpha>0);

      hitTexts.forEach(ht => {
        ht.y+=ht.vy; ht.alpha-=.025;
        ctx.save(); ctx.globalAlpha=Math.max(0,ht.alpha);
        ctx.font=`900 ${Math.round(24*ht.sc)}px "Impact",sans-serif`;
        ctx.textAlign='center';
        ctx.strokeStyle='#000'; ctx.lineWidth=5; ctx.strokeText(ht.text,ht.x,ht.y);
        ctx.fillStyle='#fde047'; ctx.shadowColor='#f59e0b'; ctx.shadowBlur=16;
        ctx.fillText(ht.text,ht.x,ht.y);
        ctx.restore();
      });
      hitTexts = hitTexts.filter(ht => ht.alpha>0);

      if (isSuperMoveActive) drawSuperOverlay(ctx,800,400,playerChar,combo,tick);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, [playerAction, enemyAction, isSuperMoveActive, stage, combo, playerChar, enemyChar]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border-4 border-amber-500/90 shadow-[0_0_50px_rgba(245,158,11,0.5)]"
      style={{ backgroundImage: ARENA_BG }}>
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
                  style={{ width: `${Math.max(0,(playerHp/maxPlayerHp)*100)}%` }} />
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
                  style={{ width: `${Math.max(0,(enemyHp/maxEnemyHp)*100)}%` }} />
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

// ===== 배경 =====
function drawBg(ctx, w, h, tick) {
  const blds = [{x:20,bw:80,bh:150},{x:130,bw:95,bh:195},{x:260,bw:65,bh:125},{x:350,bw:85,bh:165},{x:465,bw:105,bh:205},{x:600,bw:80,bh:155},{x:710,bw:90,bh:180}];
  blds.forEach(b => {
    ctx.fillStyle='#060c18';
    ctx.fillRect(b.x,310-b.bh,b.bw,b.bh);
    ctx.fillStyle='#fef08a';
    for (let r=0;r<Math.floor(b.bh/26);r++) for(let c=0;c<Math.floor(b.bw/18);c++) {
      if ((r+c+Math.floor(tick/100))%3!==0) {
        ctx.globalAlpha=.35+Math.sin(tick*.008+r+c)*.25;
        ctx.fillRect(b.x+6+c*16, 310-b.bh+10+r*24, 7, 12);
      }
    }
    ctx.globalAlpha=1;
  });
  // 서치라이트
  ctx.save(); ctx.globalAlpha=.055;
  const a1=Math.sin(tick*.018)*.5, a2=Math.cos(tick*.022)*.5;
  ctx.fillStyle='#f59e0b';
  ctx.beginPath(); ctx.moveTo(120,310); ctx.lineTo(120+Math.sin(a1)*250-50,0); ctx.lineTo(120+Math.sin(a1)*250+50,0); ctx.fill();
  ctx.fillStyle='#ef4444';
  ctx.beginPath(); ctx.moveTo(680,310); ctx.lineTo(680+Math.sin(a2)*250-50,0); ctx.lineTo(680+Math.sin(a2)*250+50,0); ctx.fill();
  ctx.restore();
}

function drawFloor(ctx, w, h) {
  const g = ctx.createLinearGradient(0,310,0,h);
  g.addColorStop(0,'#1a1a2e'); g.addColorStop(1,'#0a0a15');
  ctx.fillStyle=g; ctx.fillRect(0,310,w,h-310);
  ctx.strokeStyle='rgba(245,158,11,.3)'; ctx.lineWidth=1;
  for(let i=0;i<w;i+=55){ctx.beginPath();ctx.moveTo(i,310);ctx.lineTo(i-25,h);ctx.stroke();}
  ctx.strokeStyle='#f59e0b'; ctx.lineWidth=3;
  ctx.shadowColor='#f59e0b'; ctx.shadowBlur=10;
  ctx.beginPath(); ctx.moveTo(0,310); ctx.lineTo(w,310); ctx.stroke();
  ctx.shadowBlur=0;
}

// ===== 도트 유틸 =====
function px(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * PX, y * PX, PX, PX);
}

function pxRow(ctx, startX, y, colors) {
  colors.forEach((c, i) => { if (c) px(ctx, startX + i, y, c); });
}

// ===== 2.5등신 도트 캐릭터 렌더러 =====
function drawChibiFighter(ctx, cx, groundY, char, action, flip, tick) {
  ctx.save();
  ctx.translate(cx, groundY);
  if (flip) ctx.scale(-1, 1);

  const bob = Math.sin(tick * .15) * 2;
  const charId = char.id || 'default';
  const isAttack = action !== 'idle';

  if (charId === 'sandbag') {
    drawSandbag(ctx, bob);
    ctx.restore(); return;
  }

  const pal = getChibiPalette(charId, char);

  ctx.save();
  ctx.translate(-12 * PX, (-40 * PX) + bob);

  if (isAttack) {
    drawChibiAttack(ctx, pal, action, tick, charId);
  } else {
    drawChibiIdle(ctx, pal, tick, charId);
  }

  ctx.restore();
  ctx.restore();
}

function getChibiPalette(id, char) {
  const P = {
    kyo:     { skin:'#F5D6A8',skinS:'#D4A574', hair:'#292524',hairH:'#1c1917', eye:'#1c1917', top:'#FFFFFF',topS:'#e0e0e0', jacket:'#1E293B',jacketS:'#0f172a', pants:'#0f172a',pantsS:'#060b14', shoe:'#FFFFFF',shoeS:'#ccc', band:'#FFFFFF',bandS:'#ddd', energy:'#F59E0B',energyH:'#EA580C' },
    god_kyo: { skin:'#F5D6A8',skinS:'#D4A574', hair:'#292524',hairH:'#1c1917', eye:'#F59E0B', top:'#FFFFFF',topS:'#e0e0e0', jacket:'#EA580C',jacketS:'#C2410C', pants:'#0f172a',pantsS:'#060b14', shoe:'#EA580C',shoeS:'#C2410C', band:'#FACC15',bandS:'#D4A017', energy:'#F97316',energyH:'#EF4444' },
    iori:    { skin:'#F9E4C8',skinS:'#D4A574', hair:'#DC2626',hairH:'#991B1B', eye:'#7C3AED', top:'#1E1B4B',topS:'#15133a', jacket:'#1E1B4B',jacketS:'#15133a', pants:'#DC2626',pantsS:'#991B1B', shoe:'#1C1917',shoeS:'#111', band:null, energy:'#A855F7',energyH:'#7C3AED', collar:'#FFFFFF' },
    orochi_iori: { skin:'#FFE4E6',skinS:'#E8B4B8', hair:'#E11D48',hairH:'#9F1239', eye:'#EF4444', top:'#1E1B4B',topS:'#15133a', jacket:'#1E1B4B',jacketS:'#15133a', pants:'#E11D48',pantsS:'#9F1239', shoe:'#1C1917',shoeS:'#111', band:null, energy:'#F43F5E',energyH:'#E11D48', collar:'#881337' },
    chunli:  { skin:'#F5D6A8',skinS:'#D4A574', hair:'#1C1917',hairH:'#0a0a0a', eye:'#1c1917', top:'#3B82F6',topS:'#2563EB', jacket:'#3B82F6',jacketS:'#2563EB', pants:'#3B82F6',pantsS:'#1D4ED8', shoe:'#FFFFFF',shoeS:'#ddd', band:null, energy:'#60A5FA',energyH:'#3B82F6', sash:'#FDE047',bun:true },
    terry:   { skin:'#F5D6A8',skinS:'#D4A574', hair:'#FDE047',hairH:'#D4A017', eye:'#1c1917', top:'#FFFFFF',topS:'#e0e0e0', jacket:'#DC2626',jacketS:'#991B1B', pants:'#2563EB',pantsS:'#1D4ED8', shoe:'#DC2626',shoeS:'#991B1B', band:null, energy:'#F97316',energyH:'#EA580C', cap:'#DC2626' },
    mai:     { skin:'#F5D6A8',skinS:'#D4A574', hair:'#1C1917',hairH:'#0a0a0a', eye:'#9F1239', top:'#E11D48',topS:'#9F1239', jacket:'#E11D48',jacketS:'#9F1239', pants:'#E11D48',pantsS:'#BE123C', shoe:'#E11D48',shoeS:'#9F1239', band:null, energy:'#FDE047',energyH:'#F59E0B' },
    kyoji:   { skin:'#F5D6A8',skinS:'#D4A574', hair:'#10B981',hairH:'#047857', eye:'#047857', top:'#047857',topS:'#065F46', jacket:'#047857',jacketS:'#065F46', pants:'#0F172A',pantsS:'#060b14', shoe:'#10B981',shoeS:'#059669', band:'#10B981',bandS:'#059669', energy:'#34D399',energyH:'#10B981' },
    shadow_ninja: { skin:'#1E1B4B',skinS:'#15133a', hair:'#4C1D95',hairH:'#3B0764', eye:'#FFFFFF', top:'#1E1B4B',topS:'#15133a', jacket:'#1E1B4B',jacketS:'#15133a', pants:'#1E1B4B',pantsS:'#15133a', shoe:'#374151',shoeS:'#1F2937', band:null, energy:'#A855F7',energyH:'#7C3AED', mask:'#C084FC',scarf:'#7C3AED' },
    cyber_mecha: { skin:'#475569',skinS:'#334155', hair:'#22D3EE',hairH:'#06B6D4', eye:'#22D3EE', top:'#334155',topS:'#1E293B', jacket:'#475569',jacketS:'#334155', pants:'#64748B',pantsS:'#475569', shoe:'#334155',shoeS:'#1E293B', band:null, energy:'#22D3EE',energyH:'#06B6D4', visor:'#22D3EE' },
    kura:    { skin:'#F9E4C8',skinS:'#D4A574', hair:'#38BDF8',hairH:'#0EA5E9', eye:'#0284C7', top:'#0284C7',topS:'#0369A1', jacket:'#0284C7',jacketS:'#0369A1', pants:'#38BDF8',pantsS:'#0EA5E9', shoe:'#E0F2FE',shoeS:'#BAE6FD', band:null, energy:'#38BDF8',energyH:'#0EA5E9' },
    rugar:   { skin:'#F5D6A8',skinS:'#D4A574', hair:'#EAB308',hairH:'#A16207', eye:'#854D0E', top:'#854D0E',topS:'#713F12', jacket:'#854D0E',jacketS:'#713F12', pants:'#1C1917',pantsS:'#0a0a0a', shoe:'#EAB308',shoeS:'#CA8A04', band:null, energy:'#EAB308',energyH:'#D97706' },
  };
  return P[id] || { skin:'#F5D6A8',skinS:'#D4A574', hair:char.color||'#3B82F6',hairH:char.secondaryColor||'#1E293B', eye:'#1c1917', top:char.color||'#3B82F6',topS:char.secondaryColor||'#1E293B', jacket:char.color||'#3B82F6',jacketS:char.secondaryColor||'#1E293B', pants:char.secondaryColor||'#1E293B',pantsS:'#0f172a', shoe:'#333',shoeS:'#222', band:null, energy:char.color||'#F59E0B',energyH:'#EA580C' };
}

// ===== 아이들 포즈 =====
function drawChibiIdle(ctx, p, tick, charId) {
  const _ = null;
  const S = p.skin, Ss = p.skinS, H = p.hair, Hh = p.hairH, E = p.eye;
  const T = p.top, Ts = p.topS, J = p.jacket, Js = p.jacketS;
  const Pa = p.pants, Ps = p.pantsS, Sh = p.shoe, Shs = p.shoeS;

  // === 머리 (10x10 도트) ===
  // 머리카락 윗부분
  pxRow(ctx, 3, 0, [_,_,H,H,H,H]);
  pxRow(ctx, 2, 1, [_,H,H,Hh,H,H,H]);
  pxRow(ctx, 1, 2, [H,H,Hh,H,H,H,H,H]);

  // 이마 + 얼굴
  pxRow(ctx, 1, 3, [H,H,S,S,S,S,S,H]);
  pxRow(ctx, 1, 4, [H,S,S,S,S,S,S,H]);

  // 눈
  if (charId === 'shadow_ninja') {
    pxRow(ctx, 1, 5, [H,p.mask,E,p.mask,p.mask,E,p.mask,H]);
  } else if (charId === 'cyber_mecha') {
    pxRow(ctx, 1, 5, [H,S,p.visor,p.visor,p.visor,p.visor,S,H]);
  } else {
    pxRow(ctx, 1, 5, [H,S,E,S,S,E,S,H]);
  }

  // 볼 + 입
  pxRow(ctx, 1, 6, [_,S,S,S,S,S,S]);
  pxRow(ctx, 2, 7, [S,S,Ss,Ss,S,S]);

  // 헤드밴드
  if (p.band) {
    pxRow(ctx, 1, 4, [p.band,p.band,p.band,p.band,p.band,p.band,p.band,p.band]);
    // 끈 날림
    px(ctx, 0, 5, p.band); px(ctx, -1, 6, p.bandS);
  }

  // 캡 (테리)
  if (p.cap) {
    pxRow(ctx, 2, 0, [_,p.cap,p.cap,p.cap,p.cap]);
    pxRow(ctx, 1, 1, [p.cap,p.cap,p.cap,p.cap,p.cap,p.cap,p.cap]);
    pxRow(ctx, 0, 2, [p.cap,p.cap,p.cap,p.cap,p.cap,p.cap,p.cap,p.cap,p.cap]);
  }

  // 쌍상투 (춘리)
  if (p.bun) {
    px(ctx, 0, 1, H); px(ctx, -1, 0, H); px(ctx, -1, 1, H);
    px(ctx, 9, 1, H); px(ctx, 10, 0, H); px(ctx, 10, 1, H);
    px(ctx, 0, 0, '#fff'); px(ctx, 9, 0, '#fff');
  }

  // 이오리 긴 앞머리
  if (charId === 'iori' || charId === 'orochi_iori') {
    px(ctx, 8, 3, H); px(ctx, 9, 4, H); px(ctx, 9, 5, H); px(ctx, 10, 6, Hh);
    px(ctx, 0, 4, H); px(ctx, -1, 5, Hh);
  }

  // === 몸통 (6x6 도트) ===
  // 목
  pxRow(ctx, 3, 8, [S,S,S,S]);

  // 어깨 + 상체
  if (p.collar) {
    pxRow(ctx, 1, 9, [J,J,p.collar,T,T,p.collar,J,J]);
  } else {
    pxRow(ctx, 1, 9, [J,J,T,T,T,T,J,J]);
  }
  pxRow(ctx, 1, 10, [J,J,T,T,T,T,J,J]);
  pxRow(ctx, 2, 11, [Js,T,Ts,Ts,T,Js]);
  pxRow(ctx, 2, 12, [Js,T,Ts,Ts,T,Js]);

  // 벨트
  pxRow(ctx, 2, 13, [Pa,'#333','#F59E0B','#F59E0B','#333',Pa]);

  // 팔 (아이들 = 주먹 올림 격투 자세)
  // 뒷팔 (왼쪽)
  px(ctx, 0, 10, Js); px(ctx, -1, 11, S); px(ctx, -1, 10, S);
  // 앞팔 (오른쪽 - 올림)
  px(ctx, 9, 10, Js); px(ctx, 10, 9, S); px(ctx, 10, 10, S);

  // === 다리 (4x5 도트) ===
  pxRow(ctx, 2, 14, [Pa,Pa,_,_,Pa,Pa]);
  pxRow(ctx, 2, 15, [Pa,Ps,_,_,Ps,Pa]);
  pxRow(ctx, 2, 16, [Pa,Ps,_,_,Ps,Pa]);
  // 신발
  pxRow(ctx, 1, 17, [Sh,Sh,Shs,_,Sh,Sh,Shs]);
  pxRow(ctx, 1, 18, [Sh,Sh,Sh,_,Sh,Sh,Sh]);
}

// ===== 어택 포즈 =====
function drawChibiAttack(ctx, p, action, tick, charId) {
  const _ = null;
  const S = p.skin, Ss = p.skinS, H = p.hair, Hh = p.hairH, E = p.eye;
  const T = p.top, Ts = p.topS, J = p.jacket, Js = p.jacketS;
  const Pa = p.pants, Ps = p.pantsS, Sh = p.shoe, Shs = p.shoeS;

  // 머리 (아이들과 동일)
  pxRow(ctx, 3, 0, [_,_,H,H,H,H]);
  pxRow(ctx, 2, 1, [_,H,H,Hh,H,H,H]);
  pxRow(ctx, 1, 2, [H,H,Hh,H,H,H,H,H]);
  pxRow(ctx, 1, 3, [H,H,S,S,S,S,S,H]);
  pxRow(ctx, 1, 4, [H,S,S,S,S,S,S,H]);

  if (charId === 'shadow_ninja') {
    pxRow(ctx, 1, 5, [H,p.mask,E,p.mask,p.mask,E,p.mask,H]);
  } else if (charId === 'cyber_mecha') {
    pxRow(ctx, 1, 5, [H,S,p.visor,p.visor,p.visor,p.visor,S,H]);
  } else {
    pxRow(ctx, 1, 5, [H,S,E,S,S,E,S,H]);
  }
  pxRow(ctx, 1, 6, [_,S,S,S,S,S,S]);
  pxRow(ctx, 2, 7, [S,Ss,'#c0392b',Ss,S,S]); // 입 벌림 (기합!)

  if (p.band) {
    pxRow(ctx, 1, 4, [p.band,p.band,p.band,p.band,p.band,p.band,p.band,p.band]);
    px(ctx, 0, 5, p.band); px(ctx, -1, 6, p.bandS); px(ctx, -2, 7, p.bandS);
  }
  if (p.cap) {
    pxRow(ctx, 2, 0, [_,p.cap,p.cap,p.cap,p.cap]);
    pxRow(ctx, 1, 1, [p.cap,p.cap,p.cap,p.cap,p.cap,p.cap,p.cap]);
    pxRow(ctx, 0, 2, [p.cap,p.cap,p.cap,p.cap,p.cap,p.cap,p.cap,p.cap,p.cap]);
  }
  if (p.bun) {
    px(ctx, 0, 1, H); px(ctx, -1, 0, H); px(ctx, -1, 1, H);
    px(ctx, 9, 1, H); px(ctx, 10, 0, H); px(ctx, 10, 1, H);
    px(ctx, 0, 0, '#fff'); px(ctx, 9, 0, '#fff');
  }
  if (charId === 'iori' || charId === 'orochi_iori') {
    px(ctx, 8, 3, H); px(ctx, 9, 4, H); px(ctx, 9, 5, H); px(ctx, 10, 6, Hh);
    px(ctx, 0, 4, H); px(ctx, -1, 5, Hh);
  }

  // 목
  pxRow(ctx, 3, 8, [S,S,S,S]);

  // 몸통 (약간 기울임)
  if (p.collar) {
    pxRow(ctx, 1, 9, [J,J,p.collar,T,T,p.collar,J,J]);
  } else {
    pxRow(ctx, 1, 9, [J,J,T,T,T,T,J,J]);
  }
  pxRow(ctx, 1, 10, [J,J,T,T,T,T,J,J]);
  pxRow(ctx, 2, 11, [Js,T,Ts,Ts,T,Js]);
  pxRow(ctx, 2, 12, [Js,T,Ts,Ts,T,Js]);
  pxRow(ctx, 2, 13, [Pa,'#333','#F59E0B','#F59E0B','#333',Pa]);

  if (action === 'punch') {
    // 펀치: 오른팔 쭉 뻗음
    px(ctx, 0, 10, Js); px(ctx, -1, 11, S);
    px(ctx, 9, 10, J); px(ctx, 10, 10, J); px(ctx, 11, 10, J);
    px(ctx, 12, 10, S); px(ctx, 13, 10, S); px(ctx, 14, 10, S);
    // 주먹 임팩트
    ctx.save();
    ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.7;
    ctx.fillRect(15*PX, 9*PX, PX*2, PX*3);
    ctx.fillStyle = p.energy; ctx.globalAlpha = 0.5; ctx.shadowColor = p.energy; ctx.shadowBlur = 15;
    ctx.fillRect(16*PX, 8*PX, PX*3, PX*5);
    ctx.restore();

    // 다리 (약간 벌림)
    pxRow(ctx, 2, 14, [Pa,Pa,_,_,Pa,Pa]);
    pxRow(ctx, 1, 15, [Pa,Ps,_,_,_,Ps,Pa]);
    pxRow(ctx, 1, 16, [Pa,Ps,_,_,_,Ps,Pa]);
    pxRow(ctx, 0, 17, [Sh,Sh,Shs,_,_,Sh,Sh,Shs]);
    pxRow(ctx, 0, 18, [Sh,Sh,Sh,_,_,Sh,Sh,Sh]);

  } else if (action === 'kick') {
    // 킥: 앞발 수평 차기
    px(ctx, 0, 10, Js); px(ctx, -1, 11, S);
    px(ctx, 9, 9, Js); px(ctx, 10, 9, S);

    // 뒷다리
    pxRow(ctx, 2, 14, [Pa,Pa]);
    pxRow(ctx, 1, 15, [Pa,Ps]);
    pxRow(ctx, 1, 16, [Pa,Ps]);
    pxRow(ctx, 0, 17, [Sh,Sh,Shs]);
    pxRow(ctx, 0, 18, [Sh,Sh,Sh]);

    // 킥 다리 (수평)
    pxRow(ctx, 6, 14, [Pa,Pa,Pa,Pa,Pa,Pa,Pa,Pa]);
    pxRow(ctx, 13, 13, [Sh,Sh,Sh]);
    pxRow(ctx, 13, 14, [Shs,Sh,Sh]);

    // 킥 잔상
    ctx.save(); ctx.globalAlpha = 0.3;
    ctx.strokeStyle = p.energy; ctx.lineWidth = 2; ctx.shadowColor = p.energy; ctx.shadowBlur = 10;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo((9+i*3)*PX, 14*PX); ctx.lineTo((14+i*2)*PX, (13-i)*PX);
      ctx.stroke();
    }
    ctx.restore();

  } else if (action === 'fireball') {
    // 파이어볼: 양손 모아 에너지 발사
    px(ctx, 0, 10, Js); px(ctx, -1, 10, S);
    px(ctx, 9, 10, J); px(ctx, 10, 11, J);
    px(ctx, 10, 12, S); px(ctx, 11, 12, S);

    // 에너지 구체
    const pulse = Math.sin(tick * .5) * 2;
    ctx.save();
    ctx.shadowColor = p.energy; ctx.shadowBlur = 30;
    // 외곽 글로우
    ctx.fillStyle = p.energyH; ctx.globalAlpha = .5;
    ctx.beginPath(); ctx.arc(14*PX, 12*PX, (4+pulse)*PX, 0, Math.PI*2); ctx.fill();
    // 내부 에너지
    ctx.fillStyle = p.energy; ctx.globalAlpha = .8;
    ctx.beginPath(); ctx.arc(14*PX, 12*PX, (2.5+pulse*.5)*PX, 0, Math.PI*2); ctx.fill();
    // 코어
    ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.arc(14*PX, 12*PX, 1.2*PX, 0, Math.PI*2); ctx.fill();
    ctx.restore();

    // 다리
    pxRow(ctx, 2, 14, [Pa,Pa,_,_,Pa,Pa]);
    pxRow(ctx, 1, 15, [Pa,Ps,_,_,_,Ps,Pa]);
    pxRow(ctx, 1, 16, [Pa,Ps,_,_,_,Ps,Pa]);
    pxRow(ctx, 0, 17, [Sh,Sh,Shs,_,_,Sh,Sh,Shs]);
    pxRow(ctx, 0, 18, [Sh,Sh,Sh,_,_,Sh,Sh,Sh]);
  }
}

// ===== 샌드백 =====
function drawSandbag(ctx, bob) {
  ctx.save();
  ctx.translate(-8*PX, -38*PX + bob);
  // 체인
  const ch = '#94a3b8';
  px(ctx, 4, 0, ch); px(ctx, 4, 1, ch); px(ctx, 4, 2, ch);
  // 본체
  const R = '#dc2626', Rd = '#991b1b', Y = '#fbbf24';
  for (let row = 3; row < 18; row++) {
    pxRow(ctx, 1, row, [_,Rd,R,R,R,R,Rd]);
  }
  // 스티칭
  for (let row = 3; row < 18; row++) px(ctx, 4, row, Y);
  // 타격 마크
  px(ctx, 3, 8, Rd); px(ctx, 5, 8, Rd);
  px(ctx, 3, 12, Rd); px(ctx, 5, 12, Rd);
  ctx.restore();
}

// ===== 초필살기 오버레이 =====
function drawSuperOverlay(ctx, w, h, char, combo, tick) {
  ctx.save();
  ctx.fillStyle = 'rgba(2,6,23,0.93)'; ctx.fillRect(0,0,w,h);

  // 집중선
  ctx.save(); ctx.globalAlpha=.12; ctx.strokeStyle='#f59e0b'; ctx.lineWidth=2;
  for(let i=0;i<25;i++){
    const a=(i/25)*Math.PI*2+tick*.04;
    ctx.beginPath(); ctx.moveTo(w/2+Math.cos(a)*70,h/2+Math.sin(a)*70);
    ctx.lineTo(w/2+Math.cos(a)*420,h/2+Math.sin(a)*420); ctx.stroke();
  }
  ctx.restore();

  const bY=120, bH=140;
  const g = ctx.createLinearGradient(0,bY,w,bY+bH);
  g.addColorStop(0,'#dc2626'); g.addColorStop(.5,'#f59e0b'); g.addColorStop(1,'#7f1d1d');
  ctx.fillStyle=g;
  ctx.beginPath(); ctx.moveTo(0,bY); ctx.lineTo(w,bY-18); ctx.lineTo(w,bY+bH); ctx.lineTo(0,bY+bH+18); ctx.closePath(); ctx.fill();

  ctx.textAlign='center';
  ctx.font='900 40px "Impact",sans-serif'; ctx.shadowColor='#f59e0b'; ctx.shadowBlur=35;
  ctx.fillStyle='#fff';
  ctx.fillText(`🔥 MAX ${combo} COMBO SUPER SPECIAL! 🔥`, w/2, bY+65);
  ctx.font='bold 24px sans-serif'; ctx.fillStyle='#fef08a';
  ctx.fillText(`[${char.name}] 초필살기 폭발!`, w/2, bY+110);
  ctx.restore();
}
