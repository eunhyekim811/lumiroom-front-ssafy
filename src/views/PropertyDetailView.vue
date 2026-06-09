<template>
  <div class="max-w-7xl mx-auto px-6 py-10 bg-brand-bg min-h-screen text-gray-900">
    <button @click="$router.back()" class="text-gray-300 hover:text-brand-point font-bold text-sm mb-6 flex items-center gap-2 transition-colors">
      ← 이전 리스트로 돌아가기
    </button>

    <div class="flex flex-col lg:flex-row gap-6">
      <div class="flex-grow bg-white border border-gray-200 rounded-3xl p-6 md:p-8 space-y-8 shadow-xl">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <span class="text-xs bg-yellow-100 text-brand-point px-3 py-1 rounded-lg font-black tracking-wide shadow-sm">
              LumiRoom 안심 1등급 매물
            </span>
            <h1 class="text-4xl font-black text-gray-900 mt-3 leading-tight">원룸 월세 1000 / 55</h1>
            <p class="text-gray-400 text-sm mt-2 font-medium leading-relaxed">서울시 관악구 신림동 1432-1 · 3층</p>
          </div>
          <div class="bg-gray-50 border border-gray-200 p-4 rounded-xl text-center sm:min-w-[150px] shadow-sm">
            <span class="text-xs text-gray-400 font-bold block mb-1">인프라 매칭 안전도</span>
            <span class="text-3xl font-black text-brand-point drop-shadow-[0_0_4px_rgba(250,204,21,0.3)]">98점</span>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
            <span class="w-1.5 h-3 bg-brand-point rounded-sm"></span>매물 기본 구조 정보
          </h3>
          <table class="w-full text-sm text-left border-collapse border border-gray-100 shadow-sm rounded-xl overflow-hidden">
            <tbody>
              <tr class="border-b border-gray-100">
                <td class="p-3 bg-gray-50 font-bold text-gray-500 w-1/4">방 구조</td>
                <td class="p-3 text-gray-700 w-1/4">분리형 원룸</td>
                <td class="p-3 bg-gray-50 font-bold text-gray-500 w-1/4">전용 면적</td>
                <td class="p-3 text-gray-700 w-1/4">23.1㎡ (7평)</td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="p-3 bg-gray-50 font-bold text-gray-500">해당층 / 건물층</td>
                <td class="p-3 text-gray-700">3층 / 5층</td>
                <td class="p-3 bg-gray-50 font-bold text-gray-500">엘리베이터</td>
                <td class="p-3 text-gray-700">있음</td>
              </tr>
              <tr>
                <td class="p-3 bg-gray-50 font-bold text-gray-500">관리비</td>
                <td class="p-3 text-gray-700">7만원 (수도, 인터넷 포함)</td>
                <td class="p-3 bg-gray-50 font-bold text-gray-500">주차 여부</td>
                <td class="p-3 text-gray-700">가능 (월 3만원)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 class="text-xl font-black text-gray-900 mb-2 flex items-center gap-2">
            <span class="w-2 h-4 bg-brand-point rounded-sm"></span>LumiRoom 안심 인프라 정밀 분석 리포트
          </h3>
          <p class="text-gray-400 text-xs font-medium mb-6 leading-relaxed">
            행정안전부 및 경찰청 실시간 개방 API 데이터를 스프링 배치 파이프라인으로 매일 동기화하여 분석해낸 반경 50미터 내 공간 인덱싱 요약 지표입니다.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
              <span class="text-xs text-gray-400 font-bold">방범용 고화질 CCTV</span>
              <span class="block text-2xl font-black text-gray-800 mt-1">4 대 운용</span>
            </div>
            <div class="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
              <span class="text-xs text-gray-400 font-bold">지자체 스마트 가로등</span>
              <span class="block text-2xl font-black text-gray-800 mt-1">6 개 배치</span>
            </div>
            <div class="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
              <span class="text-xs text-gray-400 font-bold">야간 안심 보안등</span>
              <span class="block text-2xl font-black text-gray-800 mt-1">3 개 작동</span>
            </div>
          </div>
        </div>

        <button class="w-full bg-brand-point hover:bg-yellow-500 text-gray-950 py-4 rounded-xl font-black transition-all shadow-lg transform active:scale-95 text-base">
          이 방 안전하게 바로 문의하기
        </button>
      </div>

      <div class="w-full lg:w-[400px] bg-brand-card border border-gray-700 rounded-3xl p-4 shadow-xl flex flex-col h-[400px] lg:h-auto">
        <h3 class="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-brand-point" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          매물 위치 및 주변 인프라 지도
        </h3>
        <div id="mini-map" class="w-full flex-grow bg-gray-950 rounded-2xl relative overflow-hidden">
          <div class="absolute inset-0 flex items-center justify-center text-gray-400 text-xs font-bold p-4 text-center">
            카카오 지도 API<br/>(매물 중심 좌표 마킹 렌더링 영역)
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 카카오 지도 API 인스턴스 구성 및 단독 마킹 처리
  if (window.kakao && window.kakao.maps) {
    const container = document.getElementById('mini-map')
    const options = {
      center: new window.kakao.maps.LatLng(37.4812, 126.9296), // 가상 신림동 매물 좌표
      level: 2
    }
    const map = new window.kakao.maps.Map(container, options)

    // 매물 고유 위치 마커 추가 표시
    const markerPosition = new window.kakao.maps.LatLng(37.4812, 126.9296)
    const marker = new window.kakao.maps.Marker({
      position: markerPosition
    })
    marker.setMap(map)
  }
})
</script>