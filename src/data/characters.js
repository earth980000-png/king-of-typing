// KOF & 철권 스타일의 고화질 캐릭터 데이터베이스

export const CHARACTERS = [
  {
    id: "kyo",
    name: "쿠사나기 쿄",
    title: "불꽃의 격투가",
    grade: "Common",
    color: "#eab308",
    secondaryColor: "#1e293b",
    skinTone: "#fde047",
    attackMultiplier: 1.0,
    effectDesc: "표준 불꽃 권법. 안정적인 격투 성능",
    goldBonus: 0,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <circle cx="50" cy="50" r="48" fill="#1e293b" stroke="#eab308" stroke-width="3"/>
        <path d="M 30,25 Q 50,10 70,25 Q 75,55 50,90 Q 25,55 30,25 Z" fill="#fde047"/>
        <path d="M 25,35 Q 50,15 75,35 L 70,20 Q 50,5 30,20 Z" fill="#0f172a"/>
        <rect x="25" y="38" width="50" height="8" fill="#eab308" rx="2"/>
        <circle cx="40" cy="52" r="4" fill="#0f172a"/><circle cx="60" cy="52" r="4" fill="#0f172a"/>
        <path d="M 36,46 L 46,49" stroke="#0f172a" stroke-width="2"/>
        <path d="M 64,46 L 54,49" stroke="#0f172a" stroke-width="2"/>
        <path d="M 42,66 Q 50,72 58,66" stroke="#b45309" stroke-width="3" fill="none"/>
      </svg>
    `
  },
  {
    id: "iori",
    name: "야가미 이오리",
    title: "붉은 월식의 가주",
    grade: "Common",
    color: "#ef4444",
    secondaryColor: "#881337",
    skinTone: "#fef08a",
    attackMultiplier: 1.0,
    effectDesc: "자색 불꽃 맹공. 거친 조톱 타격",
    goldBonus: 0,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <circle cx="50" cy="50" r="48" fill="#450a0a" stroke="#ef4444" stroke-width="3"/>
        <path d="M 20,40 Q 50,5 80,40 Q 75,70 50,92 Q 25,70 20,40 Z" fill="#fef08a"/>
        <path d="M 15,20 C 30,5 70,5 85,35 C 65,45 35,45 15,20 Z" fill="#dc2626"/>
        <circle cx="38" cy="52" r="3.5" fill="#dc2626"/><circle cx="62" cy="52" r="3.5" fill="#dc2626"/>
        <path d="M 34,45 L 45,47" stroke="#450a0a" stroke-width="2.5"/>
        <path d="M 66,45 L 55,47" stroke="#450a0a" stroke-width="2.5"/>
        <path d="M 40,68 Q 50,62 60,68" stroke="#991b1b" stroke-width="3" fill="none"/>
      </svg>
    `
  },
  {
    id: "chunli",
    name: "격투여제 춘리",
    title: "백열각의 챔피언",
    grade: "Rare",
    color: "#3b82f6",
    secondaryColor: "#1d4ed8",
    skinTone: "#fde047",
    attackMultiplier: 1.12,
    effectDesc: "초고속 다리 각법! 데미지 +12%",
    goldBonus: 0.05,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <circle cx="50" cy="50" r="48" fill="#1e3a8a" stroke="#60a5fa" stroke-width="3"/>
        <path d="M 30,30 Q 50,15 70,30 Q 75,60 50,90 Q 25,60 30,30 Z" fill="#fde047"/>
        <circle cx="22" cy="28" r="12" fill="#ffffff" stroke="#3b82f6" stroke-width="2"/>
        <circle cx="78" cy="28" r="12" fill="#ffffff" stroke="#3b82f6" stroke-width="2"/>
        <circle cx="41" cy="50" r="4" fill="#1e3a8a"/><circle cx="59" cy="50" r="4" fill="#1e3a8a"/>
        <path d="M 42,65 Q 50,72 58,65" stroke="#e11d48" stroke-width="3" fill="none"/>
      </svg>
    `
  },
  {
    id: "terry",
    name: "버스터 테리",
    title: "전설의 굶주린 늑대",
    grade: "Rare",
    color: "#f97316",
    secondaryColor: "#c2410c",
    skinTone: "#fde047",
    attackMultiplier: 1.15,
    effectDesc: "파동권 가속! 데미지 +15%",
    goldBonus: 0.08,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <circle cx="50" cy="50" r="48" fill="#7c2d12" stroke="#fb923c" stroke-width="3"/>
        <path d="M 28,30 Q 50,15 72,30 Q 75,60 50,90 Q 25,60 28,30 Z" fill="#fde047"/>
        <path d="M 20,22 L 80,22 L 75,36 L 25,36 Z" fill="#dc2626"/>
        <text x="50" y="32" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">FATAL</text>
        <circle cx="40" cy="52" r="4" fill="#451a03"/><circle cx="60" cy="52" r="4" fill="#451a03"/>
        <path d="M 40,68 Q 50,74 60,68" stroke="#9a3412" stroke-width="3" fill="none"/>
      </svg>
    `
  },
  {
    id: "shadow_ninja",
    name: "그림자 닌자 류",
    title: "어둠의 검신",
    grade: "Hidden",
    color: "#a855f7",
    secondaryColor: "#581c87",
    skinTone: "#e2e8f0",
    attackMultiplier: 1.25,
    effectDesc: "히든 캐릭터! 은신 콤보 & 데미지 +25%",
    goldBonus: 0.15,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <circle cx="50" cy="50" r="48" fill="#3b0764" stroke="#c084fc" stroke-width="3"/>
        <path d="M 25,25 L 75,25 L 80,75 L 20,75 Z" fill="#1e1b4b"/>
        <rect x="25" y="42" width="50" height="16" fill="#c084fc" rx="4"/>
        <ellipse cx="40" cy="50" rx="5" ry="3" fill="#ffffff"/>
        <ellipse cx="60" cy="50" rx="5" ry="3" fill="#ffffff"/>
        <circle cx="40" cy="50" r="2" fill="#000000"/>
        <circle cx="60" cy="50" r="2" fill="#000000"/>
      </svg>
    `
  },
  {
    id: "cyber_mecha",
    name: "사이보그 킹",
    title: "철권 철갑 병기",
    grade: "Hidden",
    color: "#06b6d4",
    secondaryColor: "#164e63",
    skinTone: "#94a3b8",
    attackMultiplier: 1.28,
    effectDesc: "메카 빔 캐논! 데미지 +28%",
    goldBonus: 0.18,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <circle cx="50" cy="50" r="48" fill="#083344" stroke="#22d3ee" stroke-width="3"/>
        <path d="M 25,25 Q 50,10 75,25 L 80,70 L 50,95 L 20,70 Z" fill="#334155"/>
        <rect x="30" y="42" width="40" height="10" fill="#22d3ee" rx="5"/>
        <path d="M 30,47 L 70,47" stroke="#ffffff" stroke-width="2"/>
      </svg>
    `
  },
  {
    id: "god_kyo",
    name: "불꽃의 신 쿄",
    title: "삼신기 신성 권법가",
    grade: "Legendary",
    color: "#f97316",
    secondaryColor: "#7c2d12",
    skinTone: "#fde047",
    attackMultiplier: 1.38,
    effectDesc: "전설의 신성 화염! 데미지 +38% & 골드 +25%",
    goldBonus: 0.25,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <circle cx="50" cy="50" r="48" fill="#451a03" stroke="#f97316" stroke-width="4"/>
        <path d="M 25,30 Q 50,10 75,30 Q 80,60 50,92 Q 20,60 25,30 Z" fill="#fde047"/>
        <path d="M 15,20 C 35,0 65,0 85,20 C 70,35 30,35 15,20 Z" fill="#ea580c"/>
        <rect x="25" y="36" width="50" height="9" fill="#facc15" rx="3"/>
        <circle cx="40" cy="52" r="4" fill="#000000"/><circle cx="60" cy="52" r="4" fill="#000000"/>
        <path d="M 40,68 Q 50,75 60,68" stroke="#c2410c" stroke-width="3.5" fill="none"/>
      </svg>
    `
  },
  {
    id: "orochi_iori",
    name: "폭주 오로치 이오리",
    title: "피의 굴레 마신",
    grade: "Legendary",
    color: "#f43f5e",
    secondaryColor: "#881337",
    skinTone: "#ffe4e6",
    attackMultiplier: 1.45,
    effectDesc: "최종 전설 폭주! 붉은 암전 컷인 & 데미지 +45% & 골드 +30%",
    goldBonus: 0.30,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <circle cx="50" cy="50" r="48" fill="#4c0519" stroke="#f43f5e" stroke-width="4"/>
        <path d="M 20,35 Q 50,5 80,35 Q 85,68 50,95 Q 15,68 20,35 Z" fill="#ffe4e6"/>
        <path d="M 10,15 C 30,-5 70,-5 90,15 C 75,35 25,35 10,15 Z" fill="#e11d48"/>
        <ellipse cx="38" cy="50" rx="5" ry="6" fill="#f43f5e"/>
        <ellipse cx="62" cy="50" rx="5" ry="6" fill="#f43f5e"/>
        <circle cx="38" cy="50" r="2" fill="#ffffff"/>
        <circle cx="62" cy="50" r="2" fill="#ffffff"/>
        <path d="M 35,68 Q 50,58 65,68" stroke="#9f1239" stroke-width="4" fill="none"/>
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
