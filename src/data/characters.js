// 킹 오브 타이핑 - 캐릭터 데이터베이스 (총 12종 픽셀 캐릭터)

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
        <rect x="30" y="8" width="40" height="6" fill="#1c1917" rx="2"/>
        <rect x="28" y="12" width="10" height="10" fill="#1c1917"/>
        <rect x="62" y="12" width="10" height="10" fill="#1c1917"/>
        <rect x="32" y="10" width="36" height="12" fill="#292524"/>
        <rect x="28" y="22" width="44" height="5" fill="#ffffff" rx="1"/>
        <rect x="32" y="27" width="36" height="22" fill="#fde68a" rx="3"/>
        <rect x="38" y="33" width="4" height="4" fill="#1c1917" rx="1"/>
        <rect x="56" y="33" width="4" height="4" fill="#1c1917" rx="1"/>
        <rect x="44" y="42" width="12" height="3" fill="#b45309" rx="1"/>
        <rect x="30" y="50" width="40" height="20" fill="#ffffff" rx="2"/>
        <rect x="22" y="50" width="12" height="22" fill="#1e293b" rx="1"/>
        <rect x="66" y="50" width="12" height="22" fill="#1e293b" rx="1"/>
        <rect x="18" y="54" width="8" height="16" fill="#fde68a" rx="2"/>
        <rect x="74" y="54" width="8" height="16" fill="#fde68a" rx="2"/>
        <rect x="16" y="68" width="10" height="6" fill="#fde68a" rx="2"/>
        <rect x="74" y="68" width="10" height="6" fill="#fde68a" rx="2"/>
        <rect x="32" y="72" width="14" height="18" fill="#0f172a" rx="1"/>
        <rect x="54" y="72" width="14" height="18" fill="#0f172a" rx="1"/>
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
        <rect x="26" y="6" width="48" height="8" fill="#dc2626"/>
        <rect x="24" y="10" width="14" height="30" fill="#dc2626"/>
        <rect x="62" y="10" width="16" height="28" fill="#dc2626"/>
        <rect x="30" y="8" width="40" height="14" fill="#b91c1c"/>
        <rect x="32" y="22" width="36" height="22" fill="#fef9c3" rx="3"/>
        <rect x="38" y="28" width="5" height="5" fill="#dc2626" rx="1"/>
        <rect x="56" y="28" width="5" height="5" fill="#dc2626" rx="1"/>
        <rect x="39" y="29" width="2" height="2" fill="#000"/>
        <rect x="57" y="29" width="2" height="2" fill="#000"/>
        <rect x="42" y="38" width="16" height="3" fill="#991b1b" rx="1"/>
        <rect x="28" y="46" width="44" height="24" fill="#1e1b4b" rx="2"/>
        <polygon points="40,46 50,58 60,46" fill="#ffffff"/>
        <rect x="18" y="48" width="12" height="18" fill="#1e1b4b" rx="1"/>
        <rect x="70" y="48" width="12" height="18" fill="#1e1b4b" rx="1"/>
        <rect x="16" y="64" width="12" height="8" fill="#fef9c3" rx="2"/>
        <rect x="72" y="64" width="12" height="8" fill="#fef9c3" rx="2"/>
        <rect x="30" y="72" width="16" height="18" fill="#dc2626" rx="1"/>
        <rect x="54" y="72" width="16" height="18" fill="#dc2626" rx="1"/>
        <rect x="28" y="72" width="44" height="4" fill="#450a0a"/>
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
        <circle cx="30" cy="16" r="10" fill="#1c1917"/>
        <circle cx="70" cy="16" r="10" fill="#1c1917"/>
        <rect x="28" y="14" width="4" height="4" fill="#ffffff"/>
        <rect x="68" y="14" width="4" height="4" fill="#ffffff"/>
        <rect x="34" y="8" width="32" height="14" fill="#1c1917"/>
        <rect x="34" y="22" width="32" height="20" fill="#fde68a" rx="3"/>
        <rect x="40" y="28" width="4" height="4" fill="#1e3a8a" rx="1"/>
        <rect x="56" y="28" width="4" height="4" fill="#1e3a8a" rx="1"/>
        <rect x="44" y="36" width="12" height="3" fill="#e11d48" rx="1"/>
        <rect x="30" y="44" width="40" height="22" fill="#3b82f6" rx="2"/>
        <rect x="36" y="44" width="28" height="4" fill="#fde047"/>
        <rect x="20" y="46" width="12" height="16" fill="#fde68a" rx="2"/>
        <rect x="68" y="46" width="12" height="16" fill="#fde68a" rx="2"/>
        <rect x="20" y="60" width="12" height="4" fill="#fde047"/>
        <rect x="68" y="60" width="12" height="4" fill="#fde047"/>
        <rect x="32" y="68" width="16" height="22" fill="#fde68a" rx="2"/>
        <rect x="52" y="68" width="16" height="22" fill="#fde68a" rx="2"/>
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
        <rect x="28" y="6" width="44" height="10" fill="#dc2626" rx="3"/>
        <rect x="24" y="14" width="52" height="6" fill="#dc2626"/>
        <text x="50" y="12" font-size="7" font-weight="900" fill="#ffffff" text-anchor="middle">FATAL</text>
        <rect x="30" y="18" width="40" height="6" fill="#fbbf24"/>
        <rect x="32" y="22" width="36" height="22" fill="#fde68a" rx="3"/>
        <rect x="38" y="30" width="4" height="4" fill="#451a03" rx="1"/>
        <rect x="58" y="30" width="4" height="4" fill="#451a03" rx="1"/>
        <rect x="42" y="38" width="16" height="3" fill="#9a3412" rx="1"/>
        <rect x="28" y="46" width="44" height="22" fill="#dc2626" rx="2"/>
        <rect x="44" y="52" width="12" height="12" fill="#ffffff" rx="1"/>
        <rect x="18" y="46" width="14" height="20" fill="#fde68a" rx="2"/>
        <rect x="68" y="46" width="14" height="20" fill="#fde68a" rx="2"/>
        <rect x="16" y="64" width="14" height="8" fill="#dc2626" rx="2"/>
        <rect x="70" y="64" width="14" height="8" fill="#dc2626" rx="2"/>
        <rect x="32" y="70" width="14" height="20" fill="#2563eb" rx="1"/>
        <rect x="54" y="70" width="14" height="20" fill="#2563eb" rx="1"/>
        <rect x="30" y="90" width="16" height="6" fill="#ef4444" rx="2"/>
        <rect x="54" y="90" width="16" height="6" fill="#ef4444" rx="2"/>
      </svg>
    `
  },
  {
    id: "mai",
    name: "MAI SHIRANO",
    koreanName: "시라누 마이",
    title: "화염 부채 여닌자",
    grade: "Rare",
    color: "#e11d48",
    secondaryColor: "#9f1239",
    attackMultiplier: 1.18,
    effectDesc: "초필살인봉 화염 부채 연속 타격",
    goldBonus: 0.10,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <rect width="100" height="100" fill="#881337"/>
        <rect x="24" y="6" width="52" height="14" fill="#1c1917" rx="3"/>
        <rect x="32" y="20" width="36" height="22" fill="#fde68a" rx="3"/>
        <circle cx="40" cy="30" r="2.5" fill="#9f1239"/>
        <circle cx="60" cy="30" r="2.5" fill="#9f1239"/>
        <rect x="44" y="36" width="12" height="3" fill="#e11d48" rx="1"/>
        <rect x="28" y="44" width="44" height="24" fill="#e11d48" rx="2"/>
        <rect x="42" y="44" width="16" height="24" fill="#ffffff"/>
        <path d="M 72,48 L 92,30 L 82,60 Z" fill="#fde047"/>
        <rect x="32" y="68" width="16" height="22" fill="#fde68a" rx="2"/>
        <rect x="52" y="68" width="16" height="22" fill="#fde68a" rx="2"/>
        <rect x="30" y="88" width="18" height="8" fill="#e11d48" rx="2"/>
        <rect x="52" y="88" width="18" height="8" fill="#e11d48" rx="2"/>
      </svg>
    `
  },
  {
    id: "kyoji",
    name: "KYOJI",
    koreanName: "질풍의 쿄지",
    title: "바람의 난무 권법가",
    grade: "Rare",
    color: "#10b981",
    secondaryColor: "#047857",
    attackMultiplier: 1.16,
    effectDesc: "질풍연타 소용돌이 권법 난무",
    goldBonus: 0.09,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <rect width="100" height="100" fill="#064e3b"/>
        <rect x="26" y="8" width="48" height="10" fill="#10b981" rx="2"/>
        <rect x="32" y="20" width="36" height="22" fill="#fde68a" rx="3"/>
        <rect x="38" y="28" width="4" height="4" fill="#047857" rx="1"/>
        <rect x="58" y="28" width="4" height="4" fill="#047857" rx="1"/>
        <rect x="28" y="44" width="44" height="24" fill="#047857" rx="2"/>
        <rect x="18" y="46" width="12" height="18" fill="#fde68a" rx="2"/>
        <rect x="70" y="46" width="12" height="18" fill="#fde68a" rx="2"/>
        <rect x="32" y="68" width="14" height="22" fill="#0f172a" rx="1"/>
        <rect x="54" y="68" width="14" height="22" fill="#0f172a" rx="1"/>
        <rect x="30" y="88" width="16" height="8" fill="#10b981" rx="2"/>
        <rect x="54" y="88" width="16" height="8" fill="#10b981" rx="2"/>
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
        <rect x="28" y="6" width="44" height="20" fill="#1e1b4b" rx="3"/>
        <rect x="30" y="22" width="40" height="16" fill="#1e1b4b" rx="2"/>
        <rect x="28" y="28" width="44" height="8" fill="#c084fc" rx="2"/>
        <ellipse cx="40" cy="32" rx="4" ry="3" fill="#ffffff"/>
        <ellipse cx="60" cy="32" rx="4" ry="3" fill="#ffffff"/>
        <circle cx="40" cy="32" r="2" fill="#a855f7"/>
        <circle cx="60" cy="32" r="2" fill="#a855f7"/>
        <rect x="28" y="40" width="44" height="26" fill="#1e1b4b" rx="2"/>
        <rect x="26" y="56" width="48" height="5" fill="#7c3aed"/>
        <rect x="16" y="42" width="14" height="16" fill="#1e1b4b" rx="1"/>
        <rect x="70" y="42" width="14" height="16" fill="#1e1b4b" rx="1"/>
        <rect x="82" y="30" width="3" height="36" fill="#c0c0c0" rx="1"/>
        <rect x="81" y="64" width="5" height="4" fill="#fbbf24"/>
        <rect x="30" y="68" width="16" height="20" fill="#1e1b4b" rx="1"/>
        <rect x="54" y="68" width="16" height="20" fill="#1e1b4b" rx="1"/>
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
        <rect x="26" y="6" width="48" height="22" fill="#334155" rx="4"/>
        <rect x="30" y="10" width="40" height="6" fill="#22d3ee" rx="2"/>
        <rect x="28" y="24" width="44" height="14" fill="#334155" rx="2"/>
        <rect x="32" y="26" width="36" height="10" fill="#22d3ee" rx="2"/>
        <line x1="50" y1="26" x2="50" y2="36" stroke="#083344" stroke-width="2"/>
        <rect x="24" y="40" width="52" height="28" fill="#475569" rx="3"/>
        <rect x="34" y="42" width="32" height="8" fill="#22d3ee" rx="2"/>
        <circle cx="50" cy="56" r="6" fill="#06b6d4"/>
        <circle cx="50" cy="56" r="3" fill="#ffffff"/>
        <rect x="14" y="42" width="14" height="22" fill="#64748b" rx="2"/>
        <rect x="72" y="42" width="14" height="22" fill="#64748b" rx="2"/>
        <rect x="12" y="62" width="16" height="8" fill="#334155" rx="2"/>
        <rect x="72" y="62" width="16" height="8" fill="#334155" rx="2"/>
        <rect x="28" y="70" width="18" height="20" fill="#64748b" rx="2"/>
        <rect x="54" y="70" width="18" height="20" fill="#64748b" rx="2"/>
        <rect x="26" y="90" width="20" height="8" fill="#334155" rx="3"/>
        <rect x="54" y="90" width="20" height="8" fill="#334155" rx="3"/>
        <rect x="30" y="94" width="12" height="4" fill="#f97316" rx="1"/>
        <rect x="58" y="94" width="12" height="4" fill="#f97316" rx="1"/>
      </svg>
    `
  },
  {
    id: "kura",
    name: "KURA",
    koreanName: "빙설의 쿨라",
    title: "다이아몬드 얼음 여왕",
    grade: "Hidden",
    color: "#38bdf8",
    secondaryColor: "#0284c7",
    attackMultiplier: 1.30,
    effectDesc: "다이아몬드 에지 빙설 얼음 폭풍",
    goldBonus: 0.20,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <rect width="100" height="100" fill="#0c4a6e"/>
        <rect x="22" y="4" width="56" height="24" fill="#38bdf8" rx="4"/>
        <rect x="32" y="22" width="36" height="20" fill="#fde68a" rx="3"/>
        <circle cx="40" cy="30" r="3" fill="#0284c7"/>
        <circle cx="60" cy="30" r="3" fill="#0284c7"/>
        <rect x="28" y="44" width="44" height="24" fill="#0284c7" rx="2"/>
        <rect x="36" y="44" width="28" height="8" fill="#e0f2fe"/>
        <rect x="30" y="68" width="16" height="20" fill="#38bdf8" rx="1"/>
        <rect x="54" y="68" width="16" height="20" fill="#38bdf8" rx="1"/>
        <rect x="28" y="88" width="18" height="8" fill="#e0f2fe" rx="2"/>
        <rect x="54" y="88" width="18" height="8" fill="#e0f2fe" rx="2"/>
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
        <ellipse cx="50" cy="50" rx="42" ry="46" fill="#7c2d12" opacity="0.5"/>
        <rect x="26" y="4" width="48" height="8" fill="#ea580c" rx="2"/>
        <rect x="24" y="8" width="12" height="12" fill="#f97316"/>
        <rect x="64" y="8" width="12" height="12" fill="#f97316"/>
        <rect x="30" y="6" width="40" height="14" fill="#ea580c"/>
        <rect x="26" y="20" width="48" height="6" fill="#facc15" rx="1"/>
        <rect x="44" y="18" width="12" height="4" fill="#fbbf24"/>
        <rect x="32" y="26" width="36" height="22" fill="#fde68a" rx="3"/>
        <rect x="38" y="32" width="5" height="5" fill="#f97316" rx="1"/>
        <rect x="56" y="32" width="5" height="5" fill="#f97316" rx="1"/>
        <rect x="39" y="33" width="2" height="2" fill="#000"/>
        <rect x="57" y="33" width="2" height="2" fill="#000"/>
        <rect x="42" y="42" width="16" height="4" fill="#c2410c" rx="1"/>
        <rect x="30" y="50" width="40" height="20" fill="#ffffff" rx="2"/>
        <rect x="22" y="50" width="12" height="22" fill="#ea580c" rx="1"/>
        <rect x="66" y="50" width="12" height="22" fill="#ea580c" rx="1"/>
        <rect x="14" y="54" width="10" height="16" fill="#fde68a" rx="2"/>
        <rect x="76" y="54" width="10" height="16" fill="#fde68a" rx="2"/>
        <rect x="12" y="68" width="12" height="8" fill="#f97316" rx="2"/>
        <rect x="76" y="68" width="12" height="8" fill="#f97316" rx="2"/>
        <rect x="32" y="72" width="14" height="18" fill="#1c1917" rx="1"/>
        <rect x="54" y="72" width="14" height="18" fill="#1c1917" rx="1"/>
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
        <ellipse cx="50" cy="50" rx="42" ry="46" fill="#881337" opacity="0.5"/>
        <rect x="20" y="4" width="60" height="10" fill="#e11d48"/>
        <rect x="18" y="8" width="16" height="34" fill="#e11d48"/>
        <rect x="66" y="8" width="18" height="32" fill="#e11d48"/>
        <rect x="28" y="6" width="44" height="16" fill="#f43f5e"/>
        <rect x="32" y="22" width="36" height="22" fill="#ffe4e6" rx="3"/>
        <rect x="36" y="28" width="6" height="6" fill="#f43f5e" rx="1"/>
        <rect x="58" y="28" width="6" height="6" fill="#f43f5e" rx="1"/>
        <circle cx="39" cy="31" r="2" fill="#ffffff"/>
        <circle cx="61" cy="31" r="2" fill="#ffffff"/>
        <rect x="40" y="38" width="20" height="5" fill="#9f1239" rx="1"/>
        <rect x="42" y="41" width="4" height="4" fill="#ffffff"/>
        <rect x="54" y="41" width="4" height="4" fill="#ffffff"/>
        <rect x="26" y="46" width="48" height="24" fill="#1e1b4b" rx="2"/>
        <polygon points="38,46 50,60 62,46" fill="#881337"/>
        <rect x="14" y="48" width="14" height="20" fill="#1e1b4b" rx="1"/>
        <rect x="72" y="48" width="14" height="20" fill="#1e1b4b" rx="1"/>
        <rect x="10" y="66" width="16" height="10" fill="#ffe4e6" rx="2"/>
        <rect x="74" y="66" width="16" height="10" fill="#ffe4e6" rx="2"/>
        <rect x="28" y="72" width="18" height="18" fill="#e11d48" rx="1"/>
        <rect x="54" y="72" width="18" height="18" fill="#e11d48" rx="1"/>
        <rect x="26" y="72" width="48" height="5" fill="#4c0519"/>
        <rect x="26" y="90" width="20" height="8" fill="#1c1917" rx="2"/>
        <rect x="54" y="90" width="20" height="8" fill="#1c1917" rx="2"/>
      </svg>
    `
  },
  {
    id: "rugar",
    name: "RUGAR",
    koreanName: "패왕 루갈",
    title: "카이저 제왕 엠페러",
    grade: "Legendary",
    color: "#eab308",
    secondaryColor: "#854d0e",
    attackMultiplier: 1.50,
    effectDesc: "제노사이드 커터 & 카이저 웨이브 충격파",
    goldBonus: 0.35,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <rect width="100" height="100" fill="#422006"/>
        <rect x="24" y="6" width="52" height="12" fill="#eab308" rx="2"/>
        <rect x="32" y="20" width="36" height="22" fill="#fde68a" rx="3"/>
        <circle cx="40" cy="30" r="3" fill="#854d0e"/>
        <circle cx="60" cy="30" r="3" fill="#854d0e"/>
        <rect x="28" y="44" width="44" height="24" fill="#854d0e" rx="2"/>
        <rect x="38" y="44" width="24" height="6" fill="#eab308"/>
        <rect x="30" y="68" width="16" height="20" fill="#1c1917" rx="1"/>
        <rect x="54" y="68" width="16" height="20" fill="#1c1917" rx="1"/>
        <rect x="28" y="88" width="18" height="8" fill="#eab308" rx="2"/>
        <rect x="54" y="88" width="18" height="8" fill="#eab308" rx="2"/>
      </svg>
    `
  }
];

// 요청하신 뽑기 확률: 레전더리 5%, 레어 20%, 히든 15%, 커먼 60%
export const GACHA_RATES = {
  Legendary: 0.05,
  Rare: 0.20,
  Hidden: 0.15,
  Common: 0.60
};
