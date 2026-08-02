// 초등 6학년 맞춤형 타자 데이터베이스 (국어 & 영어)
// 명작 소설 (황순원 소나기, 어린 왕자, 윤동주 시 등) 및 건전한 명곡/동요 텍스트 포함

export const TYPING_DATA = {
  ko: {
    // 1번 키: 단어 (약공격)
    word: [
      "지혜", "용기", "우정", "성장", "도전", "열정", "창의력", "융합", "화합", "자율",
      "희망", "인내", "미래", "영웅", "전설", "약속", "배려", "감사", "평화", "기쁨",
      "믿음", "진실", "슬기", "도약", "아름다움", "별빛", "바다", "하늘", "햇살", "은하수"
    ],
    // 2번 키: 짧은 문장 (중공격)
    short: [
      "소년은 개울가에서 소녀를 보자 윤초시 네 증손녀딸이라는 걸 알았다.",
      "네 장미꽃이 그토록 소중한 것은 네가 그것을 위해 소비한 시간 때문이야.",
      "별 하나에 추억과 별 하나에 사랑과 별 하나에 쓸쓸함과",
      "죽는 날까지 하늘을 우러러 한 점 부끄럼이 없기를",
      "나 하늘로 돌아가리라 아름다운 이 세상 소풍 끝내는 날",
      "가장 중요한 것은 눈에 보이지 않고 마음으로 보아야 잘 보여.",
      "마음속에 꿈을 간직한 사람은 언제나 빛나는 길을 걷는다.",
      "서로를 존중하고 배려할 때 교실은 웃음으로 가득 찬다.",
      "푸른 잔디밭 위로 바람이 불어오면 우리의 꿈도 함께 춤춘다.",
      "오늘의 조그만 노력이 내일의 위대한 결실을 맺는다."
    ],
    // 3번 키: 긴 문장 (강공격 / 필살기)
    long: [
      "넓은 벌 동쪽으로 옛이야기 지껄이는 실개천이 휘돌아 나가고 얼룩배기 황소가 해설피 금빛 게으른 울음을 울어대는 곳 그곳이 차마 꿈엔들 잊힐 리야.",
      "동해 물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려 동산 대한 사람 대한으로 길이 보전하세.",
      "너의 작은 한마디도 너의 작은 웃음도 내게는 커다란 의미가 되어 너의 모든 순간이 나에게 오면 난 널 향해 미소 짓는다.",
      "파란 하늘 은하수 한 배에 담아 구름 따라 흘러가는 별들의 고향 찾아 우리 모두 돛을 달고 힘차게 노를 저어 가자.",
      "어둠 속에 빛나는 작은 별처럼 우리 모두 각자의 자리에서 자신만의 아름다운 빛을 내며 세상에 온기를 더한다."
    ]
  },
  en: {
    // 1번 키: 단어 (약공격)
    word: [
      "Bravery", "Victory", "Champion", "Freedom", "Harmony", "Passion", "Journey",
      "Heroic", "Wisdom", "Friendship", "Courage", "Future", "Promise", "Starry",
      "Sunlight", "Miracle", "Glow", "Energy", "Dreamer", "Justice"
    ],
    // 2번 키: 짧은 문장 (중공격)
    short: [
      "The most beautiful things in the world cannot be seen.",
      "You are braver than you believe and stronger than you seem.",
      "It is the time you have wasted for your rose that makes it so important.",
      "Count your age by friends not years. Count your life by smiles not tears.",
      "Every cloud has a silver lining when you look at the sky.",
      "A journey of a thousand miles begins with a single step forward.",
      "Kindness is a language which the deaf can hear and the blind can see.",
      "Believe you can and you are already halfway there to your goal."
    ],
    // 3번 키: 긴 문장 (강공격 / 필살기)
    long: [
      "Happiness can be found even in the darkest of times if one only remembers to turn on the light and stay hopeful.",
      "Life is a wonderful journey that must be traveled with confidence no matter how challenging the road ahead may seem.",
      "The future belongs to those who believe in the beauty of their dreams and work hard every day with a smiling face."
    ]
  }
};
