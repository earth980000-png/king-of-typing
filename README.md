# 🥊 타자 킹 (King of Typing)

> **초등학교 6학년 대상 타자 액션 격투 게임**
> 한컴 타자연습의 타수/정확도 측정 매커니즘과 '킹 오브 파이터즈(KOF)' 아케이드 액션 격투를 결합한 웹 어플리케이션 프로젝트입니다.

---

## 🌟 주요 특징 (Key Features)

### 🥊 1. 타자 연동 격투 시스템
- **`1`번 키 (단어)**: 약공격 (Light Attack) - 빠른 콤보 연결
- **`2`번 키 (짧은 문장)**: 중공격 (Medium Attack) - 주력 딜링
- **`3`번 키 (긴 문장)**: 강공격 (Heavy Attack) - 강력한 장풍 및 대량 데미지
- **콤보 & 초필살기 연출**: 오타 없이 연속 성공 시 **5 COMBO KOF 화면 암전 & 컷인 초필살기** 발동!
- **실시간 속도/정확도 측정**: 타수(WPM/CPM) 및 정확도(%) 실시간 한컴 타자연습 스타일 표시.

### 📚 2. 초등 6학년 맞춤형 문장 콘텐츠
- **국어/영어 선택 기능**
- **명작 소설 및 건전 명곡 수록**: 황순원의 『소나기』, 생텍쥐페리의 『어린 왕자』, 윤동주의 『별 헤는 밤』/『서시』, 백석 시, 건전한 명곡 가사 및 영어 명언.

### 🎮 3. 3가지 게임 모드
1. **연습실**: 샌드백 로봇을 상대로 타자 속도 및 정확도 측정 연습
2. **솔로 플레이**: 1단계(100타 초보)부터 7단계(500타+ KOF 최종 보스)까지 단계별 컴퓨터 AI 대결
3. **멀티 플레이**: 소속 팀(불꽃 팀, 용랑 팀 등) 선택 후 **동일 팀 멤버끼리 실시간 1v1 랜덤 매칭 대결**

### 💰 4. 골드 보상 및 캐릭터 가챠 (Gacha) 상점
- 승리 시 많은 골드(150G+), 패배 시 약간의 골드(30G) 지급
- **캐릭터 등급**: Common, Rare (+10% 데미지), Hidden (+20% 데미지), Legendary (+35% 데미지, 불꽃 이펙트, 골드 +25% 버프)

---

## 🛠️ 사용된 기술 스택 (Tech Stack)

- **Frontend**: React 19, Vite, TailwindCSS
- **Canvas Engine**: HTML5 Canvas 2D Fighter Particle & Animation Renderer
- **Audio Engine**: Web Audio API Retro Arcade Synthesizer
- **Backend & Auth**: Firebase Auth (Google Login, Anonymous Login) & Realtime Database
- **Deployment**: Vercel Ready (`vercel.json`)

---

## 🚀 로컬 실행 방법 (Local Development)

```bash
# 1. 패키지 설치
npm install

# 2. 로컬 개발 서버 실행
cmd /c npm run dev
```

---

## 🔑 Firebase 설정 안내 (Firebase Setup)

1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트를 생성합니다.
2. **Authentication**에서 `Google` 및 `익명(Anonymous)` 로그인을 활성화합니다.
3. **Realtime Database**를 생성하고 읽기/쓰기 규칙을 설정합니다.
4. `.env.example` 파일을 복사하여 `.env` 파일로 만들고 발급받은 Firebase API Key를 입력합니다:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project
```

---

## 🌐 GitHub & Vercel 배포 방법 (GitHub & Vercel Deployment)

### 1. GitHub 업로드
```bash
git init
git add .
git commit -m "Initial commit: King of Typing App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/king-of-typing.git
git push -u origin main
```

### 2. Vercel 배포
1. [Vercel](https://vercel.com/) 접속 후 `Import Project` 선택
2. GitHub 저장소(`king-of-typing`) 연동
3. Environment Variables에 Firebase Key 입력 후 `Deploy` 클릭!
