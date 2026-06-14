
# 🌙 LumiRoom Frontend

> **데이터로 검증하고 AI로 요약하는 안전 특화 부동산 정보 서비스**
> 
> 본 저장소는 LumiRoom 서비스의 프론트엔드 애플리케이션 코드를 포함하고 있습니다. 카카오 지도 API와 Pinia 전역 상태 관리를 통해 실시간 치안 인프라 및 안심 리포트를 시각화합니다.

---

## 🔗 프로젝트 관련 자료
* **Notion:** [Lumi Room 노션 작업 공간 바로가기](https://www.notion.so/SSAFY-3611a2d143c180aab1c6e1717918170a?source=copy_link)

* **LumiRoom 백엔드:** [Lumi Room 백엔드 레포 바로가기](https://lab.ssafy.com/eunhyekim811/lumipath_final_gwangju_02_yerimson_eunhyekim.git)

---

## 📌 프로젝트 개요

LumiRoom은 거주지를 선택할 때 겪는 치안 불안 요소를 해결하기 위해 기획되었습니다. 경찰청 강력 범죄 통계, 지자체 개방 데이터, 실시간 사고 정보 등을 백엔드에서 크롤링하여 자체적인 안전 등급을 산출합니다. 더불어 **LLM(대형 언어 모델) 기반의 맞춤형 안전 브리핑**을 자연어로 제공하여 혁신적인 거주지 탐색 경험을 선사합니다.

---

## 💻 Tech Stack (기술 스택)

* **Framework:** Vue 3 (Composition API)
* **Build Tool:** Vite
* **State Management:** Pinia (중앙 집중식 전역 상태 관리)
* **Styling:** Tailwind CSS (PostCSS), 프리텐다드(Pretendard) 폰트 라이브러리
* **Map API:** Kakao Maps SDK (Services, Clusterer)

---

## ✨ 핵심 기능 명세

### 1. 지도 기반 치안 인프라 및 안전도 조회 (Split View)
* **안전 특화 레이어 토글:** 일반 지도에서 보이는 복잡한 상권 정보를 숨기고, **CCTV 위치, 가로등 밀집 구역, 보안등 위치, 치안안전시설(경찰서/지구대)** 등 치안 인프라만 필터링하여 지도 위에 시각화합니다.
* **상시 고시인성 버튼 시스템:** 지도 레이어나 어두운 배경 위에서도 필터 조작 유닛이 직관적으로 드러나도록 **평상시 고대비 순백색(White), 활성화 시 네온 옐로우(Neon Yellow) 컬러**가 상시 유지되도록 설계되었습니다.
* **우측 스플릿 패널 전환:** 매물 탐색 시 별도의 화면 이동 없이, 클릭 한 번으로 리스트 브라우징 모드에서 해당 주택의 정밀 인프라 분석 스펙 데이터 뷰로 실시간 상태 분기(Toggle) 처리가 수행됩니다.

### 2. 알고리즘 기반 안전 지수 및 정렬
* **다각도 데이터 연산 지표:** 시스템 알고리즘이 산출한 '안전 등급이 높은 순(safety_score DESC)' 정렬 기능을 제공하여 안전도별 매물 비교가 가능합니다.
* **안심 리포트 테이블:** 행안부 및 경찰청 공공 데이터 수치를 직관적인 하이라이트 지표(S~D 등급 및 점수)로 포맷팅하여 제공합니다.

### 3. 사용자 세션 동기화 (Auth Core)
* `auth` 스토어를 통해 로그인 상태 유무를 실시간 감지합니다.
* 상태에 따라 상단 공통 네비게이션 바(`Navbar.vue`)의 UI 구성이 **[로그인/회원가입] ↔ [유저 프로필명/로그아웃]** 체제로 완전 자동 전환(Conditional Rendering)됩니다.

---

## 🛠️ Recommended Development Setup

최적의 Vue 3 및 Vite 개발 환경 구축을 위해 아래 설정을 권장합니다.

### Recommended IDE Setup
* [VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 확장을 설치하고 기존의 **Vetur 확장은 반드시 비활성화**해 주세요.

### Recommended Browser Setup
* **Chromium 기반 브라우저 (Chrome, Edge, Brave 등):**
  * [Vue.js devtools Extension](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 설치
  * Chrome 개발자 도구(DevTools) 설정에서 **[Turn on Custom Object Formatter]** 옵션 활성화 ([참고 링크](http://bit.ly/object-formatters))
* **Firefox:**
  * [Vue.js devtools Add-on](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/) 설치
  * Firefox 개발자 도구 설정에서 **[Turn on Custom Object Formatter]** 옵션 활성화 ([참고 링크](https://fxdx.dev/firefox-devtools-custom-object-formatters/))

---

## 🚀 실행 및 빌드 방법 (Project Setup)

본 프로젝트는 의존성 관리 및 빌드 속도 최적화를 위해 **`pnpm`** 패키지 매니저 사용을 지향합니다.

### 1. 의존성 라이브러리 설치 (Install)
```sh
pnpm install

```

### 2. 환경 변수(Environment Variables) 설정 (★ 필수)

지도의 정상적인 렌더링 및 카카오맵 앱키의 Git 보안 유출 방지를 위해, `.env.example`을 참고해 프로젝트 최상위(루트) 디렉터리에 **`.env`** 파일을 생성하고 아래와 같이 환경 변수를 입력해 주십시오.
*(Vite 명세에 따라 접두사 `VITE_`가 포함되어야 HTML 및 스크립트 단으로 정상 주입됩니다.)*

```text
# .env
VITE_KAKAO_MAP_API_KEY=발급받으신_카카오_JavaScript_키를_여기에_입력하세요

```

> ⚠️ **보안 주의:** `.env.local` 파일은 로컬 개발 전용이므로 절대 Git 저장소에 푸시(Push)하지 마십시오. (`.gitignore` 파일에 기본 등록 완료)

### 3. 개발 서버 구동 (Compile and Hot-Reload for Development)

환경 변수 추가 또는 변경 후에는 **반드시 기존 개발 서버를 완전히 종료(Ctrl + C)한 후 재시작**해야 컴파일러가 키를 정상적으로 인식합니다.

```sh
pnpm dev

```

* 서버 실행 후 터미널에 명시되는 로컬 주소(예: `http://localhost:5173`)로 접속하여 맵 및 UI를 테스트합니다.

### 4. 프로덕션 빌드 (Compile and Minify for Production)

```sh
pnpm build

```

* 배포용 최적화 컴파일이 완료되면 루트에 배포 전용 `dist/` 폴더가 생성됩니다.

---

## 📂 프로젝트 파일 구조

```text
lumipath/
├── .env.local                  # 카카오 지도 API 키 보안 관리 파일
├── .gitignore                  # Git 추적 제외 설정 파일
├── index.html                  # 최상위 진입 HTML
├── package.json                # 프로젝트 의존성 라이브러리 및 스크립트 관리
├── vite.config.js              # Vite 빌드 시스템 설정
├── tailwind.config.js          # 다크그레이 베이스 & 네온 옐로우 포인트 테마 설정
├── postcss.config.js           # Tailwind 유틸리티 컴파일을 위한 PostCSS 설정
└── src/
    ├── main.js                 # Vue 앱 인스턴스 생성, Pinia 및 라우터 플러그인 결합
    ├── style.css               # 전역 스타일 제어 및 스크롤바 옐로우 커스텀
    ├── App.vue                 # 최상위 루트 레이아웃 (공통 Navbar + 라우터 뷰 렌더링)
    ├── router/
    │   └── index.js            # 라우팅 테이블
    ├── stores/                 # Pinia 전역 상태 관리 스토어 디렉터리
    │   ├── auth.js             # 로그인 상태 및 유저 세션 영속화 제어
    │   ├── infra.js            # 지도 필터 상태, 연쇄 검색어, 현재 위치 공유
    │   └── properties.js       # 매물 마스터 리스트 및 연동 상세 타겟 제어
    ├── components/
    │   └── common/
    │       └── Navbar.vue      # 상단 공통 바 (로고 아이콘, 세션별 분기 UI)
    └── views/                  # 개별 라우터 경로 매핑 페이지 뷰
        ├── HomeView.vue        # 메인 홈 화면 (Pinia 동기화 검색바 내장)
        ├── SafetyMapView.vue   # 안전지도 화면 (현재 위치 추적 및 키워드 장소 검색 기능)
        ├── PropertiesView.vue  # 매물 찾기 화면
        ├── PropertyDetailView.vue # 매물 상세 및 미니 지도 화면
        ├── LoginView.vue       # 로그인 인증 폼 화면
        └── SignupView.vue      # 회원가입 폼 화면

```

---

## 🗂 Git & Commit Conventions

* `[feat]` : 새로운 UI 또는 핵심 기능 구현
* `[chore]` : 환경 설정, 라이브러리 추가, 패키지 구조 변경 등의 빌드 작업
* `[refactor]` : 기능 변경 없는 순수 코드 구조 개선
* `[fix]` : 버그 및 런타임 컴파일 오류 해결
* `[docs]` : 문서 작성 및 수정 (`README.md` 최신화 등)

### 커밋 메시지 규칙 예시

* `[Feat]/#30: SafetyMapView 내 카카오맵 연동 및 Geolocation 내위치 추적 구현`
* `[Chore]/#2: pnpm 환경변수 파싱을 위한 .env.local 세팅 및 index.html 주입`
