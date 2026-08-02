// KOF 98 오리지널 감성 100% 복각 캐릭터 데이터베이스

export const CHARACTERS = [
  {
    id: "kyo",
    name: "KYO KUSANAGI",
    koreanName: "쿠사나기 쿄",
    title: "KOF98 삼신기 오리지널",
    grade: "Common",
    color: "#f59e0b",
    secondaryColor: "#1e293b",
    attackMultiplier: 1.0,
    effectDesc: "황물기·독물기·대사치 화염 연속기",
    goldBonus: 0,
    portraitBg: "#1e3a8a",
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <rect width="100" height="100" fill="#0f172a"/>
        <path d="M 20,25 Q 50,5 80,25 Q 85,60 50,95 Q 15,60 20,25 Z" fill="#fde047"/>
        <path d="M 15,20 C 35,0 65,0 85,20 C 70,35 30,35 15,20 Z" fill="#1e1b4b"/>
        <rect x="18" y="32" width="64" height="10" fill="#ffffff" rx="2"/>
        <circle cx="38" cy="52" r="4.5" fill="#000000"/><circle cx="62" cy="52" r="4.5" fill="#000000"/>
        <path d="M 32,45 L 45,47" stroke="#000" stroke-width="3"/>
        <path d="M 68,45 L 55,47" stroke="#000" stroke-width="3"/>
        <path d="M 40,68 Q 50,76 60,68" stroke="#b45309" stroke-width="3.5" fill="none"/>
      </svg>
    `
  },
  {
    id: "iori",
    name: "IORI YAGAMI",
    koreanName: "야가미 이오리",
    title: "KOF98 자색 월식 격투가",
    grade: "Common",
    color: "#ef4444",
    secondaryColor: "#881337",
    attackMultiplier: 1.0,
    effectDesc: "어둠쫓기·아오이하나·팔치녀 연속 클로",
    goldBonus: 0,
    portraitBg: "#881337",
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <rect width="100" height="100" fill="#450a0a"/>
        <path d="M 15,35 Q 50,5 85,35 Q 85,70 50,95 Q 15,70 15,35 Z" fill="#fef08a"/>
        <path d="M 10,15 C 30,-5 70,-5 90,15 C 75,40 25,40 10,15 Z" fill="#dc2626"/>
        <circle cx="38" cy="52" r="4.5" fill="#dc2626"/><circle cx="62" cy="52" r="4.5" fill="#dc2626"/>
        <path d="M 32,44 L 45,46" stroke="#450a0a" stroke-width="3"/>
        <path d="M 68,44 L 55,46" stroke="#450a0a" stroke-width="3"/>
        <path d="M 38,70 Q 50,62 62,70" stroke="#991b1b" stroke-width="3.5" fill="none"/>
      </svg>
    `
  },
  {
    id: "chunli",
    name: "CHUN-LI",
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
        <path d="M 25,30 Q 50,15 75,30 Q 75,65 50,92 Q 25,65 25,30 Z" fill="#fde047"/>
        <circle cx="18" cy="26" r="14" fill="#ffffff" stroke="#3b82f6" stroke-width="3"/>
        <circle cx="82" cy="26" r="14" fill="#ffffff" stroke="#3b82f6" stroke-width="3"/>
        <circle cx="40" cy="50" r="4" fill="#1e3a8a"/><circle cx="60" cy="50" r="4" fill="#1e3a8a"/>
        <path d="M 40,68 Q 50,75 60,68" stroke="#e11d48" stroke-width="3.5" fill="none"/>
      </svg>
    `
  },
  {
    id: "terry",
    name: "TERRY BOGARD",
    koreanName: "버스터 테리",
    title: "아랑전설 전설의 늑대",
    grade: "Rare",
    color: "#f97316",
    secondaryColor: "#c2410c",
    attackMultiplier: 1.15,
    effectDesc: "파워 가이저 3단 지면 불꽃 explosion",
    goldBonus: 0.08,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <rect width="100" height="100" fill="#7c2d12"/>
        <path d="M 25,30 Q 50,15 75,30 Q 75,65 50,92 Q 25,65 25,30 Z" fill="#fde047"/>
        <path d="M 15,20 L 85,20 L 80,36 L 20,36 Z" fill="#dc2626"/>
        <text x="50" y="32" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle">FATAL</text>
        <circle cx="40" cy="52" r="4.5" fill="#451a03"/><circle cx="60" cy="52" r="4.5" fill="#451a03"/>
        <path d="M 40,70 Q 50,76 60,70" stroke="#9a3412" stroke-width="3.5" fill="none"/>
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
        <path d="M 20,25 L 80,25 L 85,75 L 15,75 Z" fill="#1e1b4b"/>
        <rect x="20" y="42" width="60" height="16" fill="#c084fc" rx="4"/>
        <ellipse cx="40" cy="50" rx="5" ry="3" fill="#ffffff"/>
        <ellipse cx="60" cy="50" rx="5" ry="3" fill="#ffffff"/>
        <circle cx="40" cy="50" r="2" fill="#000"/>
        <circle cx="60" cy="50" r="2" fill="#000"/>
      </svg>
    `
  },
  {
    id: "cyber_mecha",
    name: "CYBER MECHA",
    koreanName: "사이보그 킹",
    title: "철권 메카 중장갑",
    grade: "Hidden",
    color: "#06b6d4",
    secondaryColor: "#164e63",
    attackMultiplier: 1.28,
    effectDesc: "플라즈마 로켓 3연속 발사",
    goldBonus: 0.18,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <rect width="100" height="100" fill="#083344"/>
        <path d="M 22,25 Q 50,10 78,25 L 82,70 L 50,95 L 18,70 Z" fill="#334155"/>
        <rect x="25" y="42" width="50" height="12" fill="#22d3ee" rx="6"/>
        <path d="M 25,48 L 75,48" stroke="#ffffff" stroke-width="2.5"/>
      </svg>
    `
  },
  {
    id: "god_kyo",
    name: "GOD KYO",
    koreanName: "불꽃의 신 쿄",
    title: "KOF98 신성 대사치",
    grade: "Legendary",
    color: "#f97316",
    secondaryColor: "#7c2d12",
    attackMultiplier: 1.38,
    effectDesc: "삼신기 금월양 최종 초필살기",
    goldBonus: 0.25,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <rect width="100" height="100" fill="#451a03"/>
        <path d="M 20,30 Q 50,10 80,30 Q 85,65 50,95 Q 15,65 20,30 Z" fill="#fde047"/>
        <path d="M 10,15 C 30,-5 70,-5 90,15 C 75,35 25,35 10,15 Z" fill="#ea580c"/>
        <rect x="20" y="36" width="60" height="9" fill="#facc15" rx="3"/>
        <circle cx="40" cy="52" r="4.5" fill="#000000"/><circle cx="60" cy="52" r="4.5" fill="#000000"/>
        <path d="M 40,70 Q 50,78 60,70" stroke="#c2410c" stroke-width="4" fill="none"/>
      </svg>
    `
  },
  {
    id: "orochi_iori",
    name: "OROCHI IORI",
    koreanName: "폭주 오로치 이오리",
    title: "KOF98 피의 폭주 마신",
    grade: "Legendary",
    color: "#f43f5e",
    secondaryColor: "#881337",
    attackMultiplier: 1.45,
    effectDesc: "리 108식 팔치녀 붉은 암전 찢기 5연타",
    goldBonus: 0.30,
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <rect width="100" height="100" fill="#4c0519"/>
        <path d="M 15,35 Q 50,5 85,35 Q 88,70 50,95 Q 12,70 15,35 Z" fill="#ffe4e6"/>
        <path d="M 5,12 C 25,-8 75,-8 95,12 C 80,35 20,35 5,12 Z" fill="#e11d48"/>
        <ellipse cx="38" cy="50" rx="5" ry="6" fill="#f43f5e"/>
        <ellipse cx="62" cy="50" rx="5" ry="6" fill="#f43f5e"/>
        <circle cx="38" cy="50" r="2" fill="#ffffff"/>
        <circle cx="62" cy="50" r="2" fill="#ffffff"/>
        <path d="M 35,70 Q 50,58 65,70" stroke="#9f1239" stroke-width="4.5" fill="none"/>
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
