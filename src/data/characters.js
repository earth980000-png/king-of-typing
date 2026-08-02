// 격투 타자 킹 - 오리지널 캐릭터 데이터베이스 (저작권 회피 네이밍)

export const CHARACTERS = [
  {
    id: "kyo",
    name: "KYU KUSANARI",
    koreanName: "쿠사나리 큐",
    title: "삼신기 화염 격투가",
    grade: "Common",
    color: "#f59e0b",
    secondaryColor: "#1e293b",
    attackMultiplier: 1.0,
    effectDesc: "황물기·독물기·대사격 화염 연속기",
    goldBonus: 0,
    portraitBg: "#1e3a8a",
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <rect width="100" height="100" fill="#0f172a"/>
        <!-- Hair (dark brown, spiky) -->
        <rect x="30" y="8" width="40" height="6" fill="#1c1917" rx="2"/>
        <rect x="28" y="12" width="10" height="10" fill="#1c1917"/>
        <rect x="62" y="12" width="10" height="10" fill="#1c1917"/>
        <rect x="32" y="10" width="36" height="12" fill="#292524"/>
        <!-- White Headband -->
        <rect x="28" y="22" width="44" height="5" fill="#ffffff" rx="1"/>
        <!-- Face -->
        <rect x="32" y="27" width="36" height="22" fill="#fde68a" rx="3"/>
        <!-- Eyes -->
        <rect x="38" y="33" width="4" height="4" fill="#1c1917" rx="1"/>
        <rect x="56" y="33" width="4" height="4" fill="#1c1917" rx="1"/>
        <!-- Mouth -->
        <rect x="44" y="42" width="12" height="3" fill="#b45309" rx="1"/>
        <!-- White T-shirt -->
        <rect x="30" y="50" width="40" height="20" fill="#ffffff" rx="2"/>
        <!-- Dark Jacket (open) -->
        <rect x="22" y="50" width="12" height="22" fill="#1e293b" rx="1"/>
        <rect x="66" y="50" width="12" height="22" fill="#1e293b" rx="1"/>
        <!-- Arms (skin) -->
        <rect x="18" y="54" width="8" height="16" fill="#fde68a" rx="2"/>
        <rect x="74" y="54" width="8" height="16" fill="#fde68a" rx="2"/>
        <!-- Fists -->
        <rect x="16" y="68" width="10" height="6" fill="#fde68a" rx="2"/>
        <rect x="74" y="68" width="10" height="6" fill="#fde68a" rx="2"/>
        <!-- Dark Pants -->
        <rect x="32" y="72" width="14" height="18" fill="#0f172a" rx="1"/>
        <rect x="54" y="72" width="14" height="18" fill="#0f172a" rx="1"/>
        <!-- White Shoes -->
        <rect x="30" y="90" width="16" height="6" fill="#ffffff" rx="2"/>
        <rect x="54" y="90" width="16" height="6" fill="#ffffff" rx="2"/>
      </svg>
    `
  },
  {
    id: "iori",
    name: "IORI YAGARI",
    koreanName: "야가리 이오리",
    title: "자색 월식 격투가",
    grade: "Common",
    color: "#ef4444",
    secondaryColor: "#881337",
    attackMultiplier: 1.0,
    effectDesc: "어둠쫓기·아오이하나·팔지녀 연속 클로",
    goldBonus: 0,
    portraitBg: "#881337",
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <rect width="100" height="100" fill="#450a0a"/>
        <!-- Long Red Hair -->
        <rect x="26" y="6" width="48" height="8" fill="#dc2626"/>
        <rect x="24" y="10" width="14" height="30" fill="#dc2626"/>
        <rect x="62" y="10" width="16" height="28" fill="#dc2626"/>
        <rect x="30" y="8" width="40" height="14" fill="#b91c1c"/>
        <!-- Face -->
        <rect x="32" y="22" width="36" height="22" fill="#fef9c3" rx="3"/>
        <!-- Red Eyes -->
        <rect x="38" y="28" width="5" height="5" fill="#dc2626" rx="1"/>
        <rect x="56" y="28" width="5" height="5" fill="#dc2626" rx="1"/>
        <rect x="39" y="29" width="2" height="2" fill="#000"/>
        <rect x="57" y="29" width="2" height="2" fill="#000"/>
        <!-- Frown -->
        <rect x="42" y="38" width="16" height="3" fill="#991b1b" rx="1"/>
        <!-- Navy Shirt -->
        <rect x="28" y="46" width="44" height="24" fill="#1e1b4b" rx="2"/>
        <!-- White Collar V -->
        <polygon points="40,46 50,58 60,46" fill="#ffffff"/>
        <!-- Arms -->
        <rect x="18" y="48" width="12" height="18" fill="#1e1b4b" rx="1"/>
        <rect x="70" y="48" width="12" height="18" fill="#1e1b4b" rx="1"/>
        <!-- Hands (claws) -->
        <rect x="16" y="64" width="12" height="8" fill="#fef9c3" rx="2"/>
        <rect x="72" y="64" width="12" height="8" fill="#fef9c3" rx="2"/>
        <!-- Red Pants with Belt -->
        <rect x="30" y="72" width="16" height="18" fill="#dc2626" rx="1"/>
        <rect x="54" y="72" width="16" height="18" fill="#dc2626" rx="1"/>
        <rect x="28" y="72" width="44" height="4" fill="#450a0a"/>
        <!-- Dark Shoes -->
        <rect x="28" y="90" width="18" height="6" fill="#1c1917" rx="2"/>
        <rect x="54" y="90" width="18" height="6" fill="#1c1917" rx="2"/>
      </svg>
    `
  },
  {
    id: "chunli",
    name: "CHUN-RI",
    koreanName: "백열각 춘리",
    title: "스트리트 챔피언",
    grade: "Rare",
    color: "#3b82f6",
    secondaryColor: "#1d4ed8",
    attackMultiplier: 1.12,
    effectDesc: "백열각 5연타 폭풍 발차기",
    goldBonus: 0.05,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <rect width="100" height="100" fill="#1e3a8a"/>
        <!-- Hair Buns -->
        <circle cx="30" cy="16" r="10" fill="#1c1917"/>
        <circle cx="70" cy="16" r="10" fill="#1c1917"/>
        <rect x="28" y="14" width="4" height="4" fill="#ffffff"/>
        <rect x="68" y="14" width="4" height="4" fill="#ffffff"/>
        <!-- Hair base -->
        <rect x="34" y="8" width="32" height="14" fill="#1c1917"/>
        <!-- Face -->
        <rect x="34" y="22" width="32" height="20" fill="#fde68a" rx="3"/>
        <!-- Eyes -->
        <rect x="40" y="28" width="4" height="4" fill="#1e3a8a" rx="1"/>
        <rect x="56" y="28" width="4" height="4" fill="#1e3a8a" rx="1"/>
        <!-- Smile -->
        <rect x="44" y="36" width="12" height="3" fill="#e11d48" rx="1"/>
        <!-- Blue Qipao Top -->
        <rect x="30" y="44" width="40" height="22" fill="#3b82f6" rx="2"/>
        <rect x="36" y="44" width="28" height="4" fill="#fde047"/>
        <!-- Arms -->
        <rect x="20" y="46" width="12" height="16" fill="#fde68a" rx="2"/>
        <rect x="68" y="46" width="12" height="16" fill="#fde68a" rx="2"/>
        <!-- Spiked Bracelets -->
        <rect x="20" y="60" width="12" height="4" fill="#fde047"/>
        <rect x="68" y="60" width="12" height="4" fill="#fde047"/>
        <!-- Legs (strong thighs - signature) -->
        <rect x="32" y="68" width="16" height="22" fill="#fde68a" rx="2"/>
        <rect x="52" y="68" width="16" height="22" fill="#fde68a" rx="2"/>
        <!-- Blue Boots -->
        <rect x="30" y="88" width="18" height="8" fill="#1d4ed8" rx="2"/>
        <rect x="52" y="88" width="18" height="8" fill="#1d4ed8" rx="2"/>
      </svg>
    `
  },
  {
    id: "terry",
    name: "TERRY BOGARO",
    koreanName: "테리 보가로",
    title: "전설의 늑대 격투가",
    grade: "Rare",
    color: "#f97316",
    secondaryColor: "#c2410c",
    attackMultiplier: 1.15,
    effectDesc: "파워 가이져 3단 지면 불꽃 폭발",
    goldBonus: 0.08,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <rect width="100" height="100" fill="#7c2d12"/>
        <!-- Red Cap -->
        <rect x="28" y="6" width="44" height="10" fill="#dc2626" rx="3"/>
        <rect x="24" y="14" width="52" height="6" fill="#dc2626"/>
        <text x="50" y="12" font-size="7" font-weight="900" fill="#ffffff" text-anchor="middle">FATAL</text>
        <!-- Blonde Hair (under cap) -->
        <rect x="30" y="18" width="40" height="6" fill="#fbbf24"/>
        <!-- Face -->
        <rect x="32" y="22" width="36" height="22" fill="#fde68a" rx="3"/>
        <!-- Eyes -->
        <rect x="38" y="30" width="4" height="4" fill="#451a03" rx="1"/>
        <rect x="58" y="30" width="4" height="4" fill="#451a03" rx="1"/>
        <!-- Grin -->
        <rect x="42" y="38" width="16" height="3" fill="#9a3412" rx="1"/>
        <!-- Red Vest -->
        <rect x="28" y="46" width="44" height="22" fill="#dc2626" rx="2"/>
        <!-- White Star on back -->
        <rect x="44" y="52" width="12" height="12" fill="#ffffff" rx="1"/>
        <!-- Arms (muscular) -->
        <rect x="18" y="46" width="14" height="20" fill="#fde68a" rx="2"/>
        <rect x="68" y="46" width="14" height="20" fill="#fde68a" rx="2"/>
        <!-- Gloves -->
        <rect x="16" y="64" width="14" height="8" fill="#dc2626" rx="2"/>
        <rect x="70" y="64" width="14" height="8" fill="#dc2626" rx="2"/>
        <!-- Blue Jeans -->
        <rect x="32" y="70" width="14" height="20" fill="#2563eb" rx="1"/>
        <rect x="54" y="70" width="14" height="20" fill="#2563eb" rx="1"/>
        <!-- Red Sneakers -->
        <rect x="30" y="90" width="16" height="6" fill="#ef4444" rx="2"/>
        <rect x="54" y="90" width="16" height="6" fill="#ef4444" rx="2"/>
      </svg>
    `
  },
  {
    id: "shadow_ninja",
    name: "SHADOW NINJA",
    koreanName: "그림자 닌자 류",
    title: "어둠의 검신",
    grade: "Hidden",
    color: "#a855f7",
    secondaryColor: "#581c87",
    attackMultiplier: 1.25,
    effectDesc: "환영 베기 4연타 콤보",
    goldBonus: 0.15,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <rect width="100" height="100" fill="#3b0764"/>
        <!-- Ninja Hood -->
        <rect x="28" y="6" width="44" height="20" fill="#1e1b4b" rx="3"/>
        <!-- Mask (only eyes visible) -->
        <rect x="30" y="22" width="40" height="16" fill="#1e1b4b" rx="2"/>
        <rect x="28" y="28" width="44" height="8" fill="#c084fc" rx="2"/>
        <!-- Glowing Eyes -->
        <ellipse cx="40" cy="32" rx="4" ry="3" fill="#ffffff"/>
        <ellipse cx="60" cy="32" rx="4" ry="3" fill="#ffffff"/>
        <circle cx="40" cy="32" r="2" fill="#a855f7"/>
        <circle cx="60" cy="32" r="2" fill="#a855f7"/>
        <!-- Ninja Body -->
        <rect x="28" y="40" width="44" height="26" fill="#1e1b4b" rx="2"/>
        <!-- Purple Sash -->
        <rect x="26" y="56" width="48" height="5" fill="#7c3aed"/>
        <!-- Arms with blade -->
        <rect x="16" y="42" width="14" height="16" fill="#1e1b4b" rx="1"/>
        <rect x="70" y="42" width="14" height="16" fill="#1e1b4b" rx="1"/>
        <!-- Katana -->
        <rect x="82" y="30" width="3" height="36" fill="#c0c0c0" rx="1"/>
        <rect x="81" y="64" width="5" height="4" fill="#fbbf24"/>
        <!-- Ninja Pants -->
        <rect x="30" y="68" width="16" height="20" fill="#1e1b4b" rx="1"/>
        <rect x="54" y="68" width="16" height="20" fill="#1e1b4b" rx="1"/>
        <!-- Tabi Boots -->
        <rect x="28" y="88" width="18" height="8" fill="#374151" rx="2"/>
        <rect x="54" y="88" width="18" height="8" fill="#374151" rx="2"/>
      </svg>
    `
  },
  {
    id: "cyber_mecha",
    name: "CYBER MECHA",
    koreanName: "사이보그 킹",
    title: "철갑 메카 중장갑",
    grade: "Hidden",
    color: "#06b6d4",
    secondaryColor: "#164e63",
    attackMultiplier: 1.28,
    effectDesc: "플라즈마 로켓 3연속 발사",
    goldBonus: 0.18,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <rect width="100" height="100" fill="#083344"/>
        <!-- Mecha Helmet -->
        <rect x="26" y="6" width="48" height="22" fill="#334155" rx="4"/>
        <rect x="30" y="10" width="40" height="6" fill="#22d3ee" rx="2"/>
        <!-- Visor -->
        <rect x="28" y="24" width="44" height="14" fill="#334155" rx="2"/>
        <rect x="32" y="26" width="36" height="10" fill="#22d3ee" rx="2"/>
        <line x1="50" y1="26" x2="50" y2="36" stroke="#083344" stroke-width="2"/>
        <!-- Body Armor -->
        <rect x="24" y="40" width="52" height="28" fill="#475569" rx="3"/>
        <rect x="34" y="42" width="32" height="8" fill="#22d3ee" rx="2"/>
        <!-- Chest Core -->
        <circle cx="50" cy="56" r="6" fill="#06b6d4"/>
        <circle cx="50" cy="56" r="3" fill="#ffffff"/>
        <!-- Arms (mechanical) -->
        <rect x="14" y="42" width="14" height="22" fill="#64748b" rx="2"/>
        <rect x="72" y="42" width="14" height="22" fill="#64748b" rx="2"/>
        <!-- Mechanical Hands -->
        <rect x="12" y="62" width="16" height="8" fill="#334155" rx="2"/>
        <rect x="72" y="62" width="16" height="8" fill="#334155" rx="2"/>
        <!-- Legs (armored) -->
        <rect x="28" y="70" width="18" height="20" fill="#64748b" rx="2"/>
        <rect x="54" y="70" width="18" height="20" fill="#64748b" rx="2"/>
        <!-- Jet Boots -->
        <rect x="26" y="90" width="20" height="8" fill="#334155" rx="3"/>
        <rect x="54" y="90" width="20" height="8" fill="#334155" rx="3"/>
        <rect x="30" y="94" width="12" height="4" fill="#f97316" rx="1"/>
        <rect x="58" y="94" width="12" height="4" fill="#f97316" rx="1"/>
      </svg>
    `
  },
  {
    id: "god_kyo",
    name: "GOD KYU",
    koreanName: "불꽃의 신 큐",
    title: "신성 대사격 화신",
    grade: "Legendary",
    color: "#f97316",
    secondaryColor: "#7c2d12",
    attackMultiplier: 1.38,
    effectDesc: "삼신기 금월양 최종 초필살기",
    goldBonus: 0.25,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <rect width="100" height="100" fill="#451a03"/>
        <!-- Flaming Aura -->
        <ellipse cx="50" cy="50" rx="42" ry="46" fill="#7c2d12" opacity="0.5"/>
        <!-- Spiky Orange Hair -->
        <rect x="26" y="4" width="48" height="8" fill="#ea580c" rx="2"/>
        <rect x="24" y="8" width="12" height="12" fill="#f97316"/>
        <rect x="64" y="8" width="12" height="12" fill="#f97316"/>
        <rect x="30" y="6" width="40" height="14" fill="#ea580c"/>
        <!-- Golden Headband -->
        <rect x="26" y="20" width="48" height="6" fill="#facc15" rx="1"/>
        <rect x="44" y="18" width="12" height="4" fill="#fbbf24"/>
        <!-- Face -->
        <rect x="32" y="26" width="36" height="22" fill="#fde68a" rx="3"/>
        <!-- Intense Eyes -->
        <rect x="38" y="32" width="5" height="5" fill="#f97316" rx="1"/>
        <rect x="56" y="32" width="5" height="5" fill="#f97316" rx="1"/>
        <rect x="39" y="33" width="2" height="2" fill="#000"/>
        <rect x="57" y="33" width="2" height="2" fill="#000"/>
        <!-- Battle Cry Mouth -->
        <rect x="42" y="42" width="16" height="4" fill="#c2410c" rx="1"/>
        <!-- White Shirt + Flame Jacket -->
        <rect x="30" y="50" width="40" height="20" fill="#ffffff" rx="2"/>
        <rect x="22" y="50" width="12" height="22" fill="#ea580c" rx="1"/>
        <rect x="66" y="50" width="12" height="22" fill="#ea580c" rx="1"/>
        <!-- Arms with flames -->
        <rect x="14" y="54" width="10" height="16" fill="#fde68a" rx="2"/>
        <rect x="76" y="54" width="10" height="16" fill="#fde68a" rx="2"/>
        <!-- Flame fists -->
        <rect x="12" y="68" width="12" height="8" fill="#f97316" rx="2"/>
        <rect x="76" y="68" width="12" height="8" fill="#f97316" rx="2"/>
        <!-- Dark Pants -->
        <rect x="32" y="72" width="14" height="18" fill="#1c1917" rx="1"/>
        <rect x="54" y="72" width="14" height="18" fill="#1c1917" rx="1"/>
        <!-- Flame Shoes -->
        <rect x="30" y="90" width="16" height="6" fill="#ea580c" rx="2"/>
        <rect x="54" y="90" width="16" height="6" fill="#ea580c" rx="2"/>
      </svg>
    `
  },
  {
    id: "orochi_iori",
    name: "OROCHI IORIN",
    koreanName: "폭주 오로치 이오린",
    title: "피의 폭주 마신",
    grade: "Legendary",
    color: "#f43f5e",
    secondaryColor: "#881337",
    attackMultiplier: 1.45,
    effectDesc: "리 108식 팔지녀 붉은 암전 찢기 5연타",
    goldBonus: 0.30,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <rect width="100" height="100" fill="#4c0519"/>
        <!-- Blood Aura -->
        <ellipse cx="50" cy="50" rx="42" ry="46" fill="#881337" opacity="0.5"/>
        <!-- Wild Red Hair (longer, wilder) -->
        <rect x="20" y="4" width="60" height="10" fill="#e11d48"/>
        <rect x="18" y="8" width="16" height="34" fill="#e11d48"/>
        <rect x="66" y="8" width="18" height="32" fill="#e11d48"/>
        <rect x="28" y="6" width="44" height="16" fill="#f43f5e"/>
        <!-- Pale Face -->
        <rect x="32" y="22" width="36" height="22" fill="#ffe4e6" rx="3"/>
        <!-- Orochi Eyes (glowing) -->
        <rect x="36" y="28" width="6" height="6" fill="#f43f5e" rx="1"/>
        <rect x="58" y="28" width="6" height="6" fill="#f43f5e" rx="1"/>
        <circle cx="39" cy="31" r="2" fill="#ffffff"/>
        <circle cx="61" cy="31" r="2" fill="#ffffff"/>
        <!-- Fanged Mouth -->
        <rect x="40" y="38" width="20" height="5" fill="#9f1239" rx="1"/>
        <rect x="42" y="41" width="4" height="4" fill="#ffffff"/>
        <rect x="54" y="41" width="4" height="4" fill="#ffffff"/>
        <!-- Torn Navy Shirt -->
        <rect x="26" y="46" width="48" height="24" fill="#1e1b4b" rx="2"/>
        <polygon points="38,46 50,60 62,46" fill="#881337"/>
        <!-- Clawed Arms -->
        <rect x="14" y="48" width="14" height="20" fill="#1e1b4b" rx="1"/>
        <rect x="72" y="48" width="14" height="20" fill="#1e1b4b" rx="1"/>
        <!-- Bloody Claws -->
        <rect x="10" y="66" width="16" height="10" fill="#ffe4e6" rx="2"/>
        <rect x="74" y="66" width="16" height="10" fill="#ffe4e6" rx="2"/>
        <!-- Red Pants -->
        <rect x="28" y="72" width="18" height="18" fill="#e11d48" rx="1"/>
        <rect x="54" y="72" width="18" height="18" fill="#e11d48" rx="1"/>
        <rect x="26" y="72" width="48" height="5" fill="#4c0519"/>
        <!-- Dark Boots -->
        <rect x="26" y="90" width="20" height="8" fill="#1c1917" rx="2"/>
        <rect x="54" y="90" width="20" height="8" fill="#1c1917" rx="2"/>
      </svg>
    `
  }
];

export const GACHA_RATES = {
  Common: 0.55,
  Rare: 0.30,
  Hidden: 0.11,
  Legendary: 0.04
};
