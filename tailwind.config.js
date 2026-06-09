/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#111827',        /* gray-900 (너무 검지 않은 기본 배경테마) */
          card: '#1f2937',      /* gray-800 (컨텐츠 영역 배경) */
          cardLight: '#f9fafb', /* gray-50 (밝은 요소 필요 시 사용) */
          point: '#facc15',     /* yellow-400 (메인 포인트 노랑) */
          pointHover: '#f97316' /* amber-500 */
        }
      },
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
      },
    },
  },
  plugins: [],
}