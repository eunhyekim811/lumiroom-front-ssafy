# 🌙 LumiRoom (루미룸) - Frontend Application

공공 빅데이터 공간 인덱싱 및 Spring AI를 융합하여 데이터로 검증하고 AI로 요약하는 **안전 특화 주거 매물 탐색 서비스 클라이언트**

- [LumiRoom Backend Repo 바로가기](https://github.com/eunhyekim811/lumiroom-back-ssafy.git)

[<img src="https://img.shields.io/badge/Framework-Vue%203-4fc08d?style=flat&logo=vue.js&logoColor=white" />]() 
[<img src="https://img.shields.io/badge/Build%20Tool-Vite-646CFF?style=flat&logo=vite&logoColor=white" />]() 
[<img src="https://img.shields.io/badge/State-Pinia-yellow?style=flat&logo=vitest&logoColor=black" />]() 
[<img src="https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white" />]()

---

## 📝 프로젝트 개요

기존의 대형 부동산 플랫폼들은 매물의 평수, 보증금, 월세 가격 등 주로 '경제적·물리적 조건'의 데이터 제공에만 몰두해 왔습니다. 하지만 현대의 1인 가구, 여성, 야간 통행자 등 실주거층이 거주지를 선택할 때 결코 간과할 수 없는 본질적인 지표는 **"내가 이 동네에서 밤에 안심하고 걸어 다닐 수 있는가?"**라는 치안과 안전의 문제입니다.

**LumiRoom(루미룸)** 프론트엔드는 백엔드 인프라가 구축한 100만 건 규모의 치안 인프라(CCTV, 가로등, 보안등, 경찰서) 및 MySQL Spatial Extensions 연산 데이터를 매끄럽고 직관적으로 시각화합니다. 복잡한 통계 수치나 원천 텍스트 대신 **카카오 지도 API Custom 레이어링**과 **Split View UI 구조**를 활용해 매물 정보와 주변 안전 지표를 한눈에 대조할 수 있도록 돕습니다. 또한 **Spring AI 기반 자연어 안심 브리핑 리포트**를 프론트엔드 단에서 모던하고 구조화된 대시보드 뷰로 렌더링하여 사용자에게 혁신적이고 스마트한 안전 특화 주거 탐색 경험을 선사합니다.

---

## ✨ 핵심 기능 명세

### 1. 지도 기반 치안 인프라 및 안전도 조회 (Split View)
* **안전 특화 레이어 토글:** 일반 지도의 복잡한 상권 정보를 숨기고, `infra` 스토어를 통해 **CCTV 위치 클러스터링, 가로등 밀집 구역, 보안등 위치, 치안안전시설(경찰서/지구대)** 등 치안 인프라 유닛만 커스텀 필터링하여 지도 위에 오버레이합니다.
* **상시 고시인성 버튼 시스템:** 어두운 야간 테마 배경이나 지도 레이어 위에서도 제어 필터 유닛이 흐려지지 않도록 **평상시 고대비 순백색(White), 활성화 시 네온 옐로우(Neon Yellow) 포인트 컬러** 체계를 상시 유지합니다.
* **우측 스플릿 패널 레이아웃:** 매물 탐색 시 별도의 화면 전환(라우팅) 스트레스 없이, 클릭 한 번으로 리스트 브라우징 모드에서 해당 매물의 정밀 인프라 분석 스펙 데이터 뷰로 실시간 상태 분기(`v-if` / Toggle) 처리가 수행됩니다.

### 2. 알고리즘 기반 안전 지수 및 정렬
* **다각도 데이터 연산 정렬:** 백엔드에서 공간 인덱스를 통해 고속 연산된 '안전 등급'을 지원하여 유저가 안전도 기준 매물 비교를 손쉽게 수행합니다.
* **안심 리포트 테이블:** 가공된 공공 데이터 수치를 직관적인 하이라이트 지표(**A, B, C, D 등급 배지**) 및 스펙 테이블 템플릿으로 포맷팅하여 화면에 제공합니다.

### 3. AI 분석 및 자연어 안심 브리핑
* **Structured Output 렌더링:** 백엔드의 선제 수집형 Standard RAG 파이프라인이 리턴하는 불변 자바 Record 기반 고정 JSON 객체(`StructuredBriefing`)를 실시간 파싱하여 **[종합 위험도 자연어 요약, 안심 요인, 주의 구역 안내]** 대시보드를 깨짐 없이 정밀하게 바인딩합니다.

### 4. 사용자 참여 및 개인화 기능 
* **관심 매물 하트 토글 (찜하기):** `properties` 스토어를 통해 실시간 토글 이벤트를 동기화합니다. 리스트 카드 내 하트 클릭 시 상세 조회로 넘어가지 않도록 `@click.stop` 버블링 차단 수식어를 정교하게 제어하며, 마이페이지와 즉각적인 동적 UI 반응(Push/Filter)이 일어납니다.
* **체감 치안 리뷰 소통:** 실제 거주자나 유저들이 체감한 골목길 상태, 야간 분위기를 별점 및 텍스트 리뷰로 실시간 등록/조회할 수 있는 비동기 컴포넌트 레이어를 제공합니다.
* **Auth Core 동적 렌더링:** 전역 `auth` 스토어를 통해 유저의 토큰 및 세션 유무를 실시간 감지하여, 공공 네비게이션 바(`Navbar.vue`)의 UI가 **[로그인/회원가입] ↔ [유저 프로필명/로그아웃]** 체제로 완전 자동 조건부 렌더링(`v-if`)됩니다.

---

## 💻 Tech Stack (기술 스택)

### Frontend Core
* **Framework:** Vue 3 (Composition API, `<script setup>` 패턴 구조 선호)
* **Build Tool:** Vite (고속 핫 리로딩 및 패키지 묶음 최적화)
* **State Management:** Pinia (중앙 집중식 및 컴포넌트 간 무상태성 유저 정보 영속화 전역 스토어)
* **Styling:** Tailwind CSS (PostCSS 기반 유틸리티 퍼스트 프레임워크), 프리텐다드(Pretendard) 고가독성 폰트 라이브러리
* **HTTP Client:** Axios (투트랙 독립 인터셉터 아키텍처 반영)

### Libraries & Integrations
* **Map Engine:** Kakao Maps SDK (Services 장소 검색, Clusterer 마커 군집화 멀티 레이어 적용)
* **Routing:** Vue Router (정적/동적 가드 인터셉트 지원)

---

## 🤔 기술적 이슈와 해결 과정 (Troubleshooting)

### 1. Axios 인증 인터셉터 무한 루프 및 Security 순환 참조 동기화 교정
* **문제 상황:** 백엔드 배포 및 클라이언트(Vue 3) 통합 연동 단계에서, 로그인이 불필요한 회원가입/로그인 프리패스 구간에서도 공공 Axios 인터셉터가 가로채 토큰 갱신(`Reissue`) 및 무한 리다이렉트 에러 레이스를 발생시키는 현상이 식별되었습니다.
  
* **교정 내용:** 백엔드의 보안 계층 분리에 발맞추어, 프론트엔드 단에서도 인증 토큰 주입이 강제되는 **'비즈니스 전용 Axios 객체'**와 공공 오픈 엔드포인트 통신용 **'프리패스 전용 Axios 객체'를 투트랙(Two-Track)으로 완전 독립 분리**하여 클라이언트 단의 인증 인터셉터 무한 루프 무덤 현상을 원천적으로 해결했습니다.

### 2. 지도 Split View 컴포넌트 이벤트 버블링으로 인한 화면 오작동 제어
* **문제 상황:** 매물 찾기 리스트 뷰 내부 카드 컴포넌트에서 유저가 관심 매물 등록/해제를 위해 하트(찜) 단추를 누를 때, 부모 엘리먼트의 상세 조회 라우팅 이벤트가 동시에 트리거되어 화면이 원치 않는 상세 페이지로 강제 리다이렉트되는 사용성 결함이 있었습니다.
  
* **교정 내용:** 관심 매물 토글 트리거에 Vue 3의 이벤트 수식어인 **`@click.stop` (stopPropagation 우회)**을 명시적으로 선언하여 하트 찜 클릭 이벤트가 상위 돔 레이어로 전파되지 않도록 차단했습니다. 이를 통해 화면 깜빡임이나 불필요한 API 요청 없이 클라이언트 단의 `favoritePropertyIds` 배열 스왑만으로 반응형 인터페이스를 부드럽게 고도화했습니다.

---

## 🚀 실행 및 빌드 방법 (Project Setup)

본 프로젝트는 의존성 관리 및 빌드 속도 최적화를 위해 **`pnpm`** 패키지 매니저 사용을 지향합니다.

### 1. 의존성 라이브러리 설치 (Install)
```sh
pnpm install
```

### 2. 환경 변수(Environment Variables) 설정 (★ 필수)

지도의 정상적인 렌더링 및 카카오맵 앱키의 Git 보안 유출 방지를 위해, 프로젝트 최상위(루트) 디렉터리에 **`.env`** 파일을 생성하고 아래와 같이 환경 변수를 입력해 주십시오.
*(Vite 명세에 따라 접두사 `VITE_`가 포함되어야 HTML 및 스크립트 단으로 정상 주입됩니다.)*

```text
# .env
VITE_KAKAO_MAP_API_KEY=발급받으신_카카오_JavaScript_키를_여기에_입력하세요
VITE_API_BASE_URL=http://localhost:8080
```

> ⚠️ **보안 주의:** 환경 변수 파일은 민감한 자격 증명을 포함하므로 절대 원격 Git 저장소에 푸시(Push)하지 마십시오. (`.gitignore` 파일에 기본 등록 완료)

### 3. 개발 서버 구동 (Compile and Hot-Reload)

환경 변수 추가 또는 변경 후에는 **반드시 기존 개발 서버를 완전히 종료(Ctrl + C)한 후 재시작**해야 컴파일러가 키를 정상적으로 인식합니다.

```sh
pnpm dev
```

* 서버 실행 후 터미널에 명시되는 로컬 주소(예: `http://localhost:5173`)로 접속하여 맵 및 UI를 테스트합니다.

### 4. 프로덕션 빌드 (Compile and Minify for Production)

```sh
# pnpm 실행(dist/ 폴더 생성)
pnpm build

# docker container
# (백엔드 레포와 같은 서버에서 실행시 같은 네트워크 공유하도록 nginx 설정)
docker compose up --build -d
```

* 배포용 최적화 컴파일이 완료되면 루트에 배포 전용 정적 자산인 `dist/` 폴더가 생성됩니다.

---

## 📂 프로젝트 파일 구조

```text
lumiroom-front-ssafy/
├── .env                        # 카카오 지도 API 키 및 백엔드 베이스 URL 보안 관리 파일
├── .gitignore                  # Git 추적 제외 설정 파일
├── index.html                  # 최상위 진입 HTML (카카오맵 스크립트 주입 타겟)
├── package.json                # 프로젝트 의존성 라이브러리 및 스크립트 관리
├── vite.config.js              # Vite 빌드 시스템 설정
├── tailwind.config.js          # Pure Dark Black 베이스 & 네온 옐로우 포인트 테마 커스텀 설정
├── postcss.config.js           # Tailwind 유틸리티 컴파일을 위한 PostCSS 설정
└── src/
    ├── main.js                 # Vue 앱 인스턴스 생성, Pinia 및 라우터 플러그인 결합
    ├── style.css               # 전역 스타일 제어 및 스크롤바 네온 커스텀 스타일링
    ├── App.vue                 # 최상위 루트 레이아웃 (공통 Navbar + 라우터 뷰 렌더링)
    ├── router/
    │   └── index.js            # 라우팅 테이블 설정 및 네비게이션 가드 제어
    ├── stores/                 # Pinia 전역 상태 관리 스토어 디렉터리(.js)
    ├── components/
    │   └── common/
    │       └── Navbar.vue      # 상단 공통 바 (로고 아이콘, 세션별 조건부 렌더링 UI)
    └── views/                  # 라우터 경로 매핑 독립 페이지 뷰
```
---

## 💁‍♂️ 프로젝트 팀원

| **손예림** | **김은혜** |
| --- | --- |
|  |  |
| [GitHub Profile](https://github.com/sonyerim) | [GitHub Profile](https://github.com/eunhyekim811) |
| Backend & Frontend | Backend & Frontend |
| Kakao Map API 기반 인프라 레이어 렌더링, Split View UI 대시보드 컴포넌트 아키텍처 수립, 공공 API 연동 데이터 매핑 | Pinia 기반 전역 상태 관리 설계, 하트 토글 버블링 예외 교정, Axios 투트랙 모듈화 및 세션 분기 네비게이션 가드 제어 |
