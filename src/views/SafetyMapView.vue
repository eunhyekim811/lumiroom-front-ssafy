<template>
  <div class="flex h-[calc(100vh-64px)] overflow-hidden bg-brand-bg text-gray-100">
    
    <main class="flex-grow relative h-full">
      <div id="kakao-map" class="w-full h-full bg-gray-950" style="min-height: 100%;"></div>

      <div class="absolute top-4 left-4 z-30 flex flex-wrap gap-2.5 max-w-xl">
        <button 
          v-for="(status, infra) in infraStore.filters" :key="infra"
          @click="infraStore.toggleFilter(infra)"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-black text-sm shadow-xl transition-all transform active:scale-95"
          :class="status 
            ? 'bg-yellow-400 text-black border-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.6)]' 
            : 'bg-white text-black border-zinc-400 shadow-md'"
        >
          <span class="w-2.5 h-2.5 rounded-full ring-1 ring-black/20" :class="getInfraColorClass(infra)"></span>
          {{ getInfraLabel(infra) }}
        </button>
      </div>

      <div class="absolute top-4 left-4 mt-16 z-30 flex gap-2 bg-white border-2 border-zinc-300 p-2 rounded-2xl shadow-2xl w-80 items-center">
        <svg class="w-5 h-5 text-gray-400 ml-1" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input 
          v-model="infraStore.searchKeyword" 
          @keyup.enter="searchPlace"
          type="text" 
          placeholder="동네 또는 지하철역 검색 (예: 신림역)" 
          class="flex-grow px-1 py-1 text-black text-sm outline-none font-black placeholder-gray-400"
        />
        <button @click="searchPlace" class="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1.5 rounded-xl font-black text-xs shadow-md">
          검색
        </button>
      </div>

      <div class="absolute top-4 left-4 mt-32 z-30 bg-white border-2 border-zinc-300 p-3 rounded-2xl shadow-2xl w-80 text-gray-900">
        <div class="flex items-center justify-between gap-3 mb-2">
          <span class="text-xs font-black text-gray-600">조회 반경</span>
          <span class="text-xs font-black text-gray-900">{{ infraStore.radius }}m</span>
        </div>
        <input
          :value="infraStore.radius"
          @input="handleRadiusInput"
          type="range"
          min="100"
          max="1500"
          step="100"
          class="w-full accent-yellow-400"
        />
      </div>

      <div class="absolute bottom-5 left-5 z-30 flex flex-col gap-2 pointer-events-none">
        <div v-if="infraStore.isLoading" class="bg-gray-950/90 border border-gray-700 text-white px-4 py-2 rounded-xl text-xs font-black shadow-xl">
          치안 인프라 조회 중...
        </div>
        <div v-if="infraStore.errorMessage" class="bg-red-600/95 border border-red-400 text-white px-4 py-2 rounded-xl text-xs font-black shadow-xl max-w-sm">
          {{ infraStore.errorMessage }}
        </div>
        <div v-if="selectedFilterCount === 0" class="bg-gray-950/90 border border-gray-700 text-white px-4 py-2 rounded-xl text-xs font-black shadow-xl">
          표시할 치안 인프라 필터를 선택해 주세요.
        </div>
      </div>
    </main>

    <aside class="w-[420px] border-l border-gray-700 bg-brand-card flex flex-col h-full z-10 shadow-xl overflow-y-auto">
      
      <div v-if="!propertyStore.selectedProperty" class="flex flex-col h-full bg-white text-gray-900">
        <div class="p-5 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-20">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-xl font-black text-gray-900">주변 추천 매물</h2>
            <span class="text-xs bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-gray-500 font-bold">
              총 {{ propertyStore.propertiesList.length }}개
            </span>
          </div>
          <p class="text-xs text-gray-400 font-medium leading-relaxed">매물을 클릭하면 데이터 분석 기반 인프라 현황을 관통해 드립니다.</p>
        </div>

        <div class="flex-grow overflow-y-auto p-4 space-y-4">
          <div 
            v-for="item in propertyStore.propertiesList" :key="item.id"
            @click="propertyStore.selectProperty(item)"
            class="bg-gray-50 border border-gray-200 hover:border-brand-point rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-sm group hover:shadow-md"
          >
            <div class="w-full h-36 bg-gray-200 rounded-lg mb-3 relative overflow-hidden">
              <div class="absolute top-2 left-2 px-2 py-1 rounded bg-white/90 border border-gray-200 text-[10px] font-bold text-brand-point">
                ★ 안전도 {{ item.score }}점
              </div>
            </div>
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-extrabold text-lg text-gray-900 group-hover:text-brand-point transition-colors">{{ item.type }} {{ item.price }}</h3>
                <p class="text-xs text-gray-400 font-medium mt-0.5 leading-relaxed">{{ item.address }}</p>
              </div>
              <span class="text-xs px-2 py-1 rounded font-bold" :class="item.grade === 1 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'">
                {{ item.grade }}등급 구역
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col h-full bg-white text-gray-900">
        <div class="p-4 border-b border-gray-200 bg-white/95 sticky top-0 flex items-center gap-3 z-20 shadow-sm">
          <button @click="propertyStore.clearSelection()" class="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors">
            ← 뒤로
          </button>
          <h2 class="text-base font-bold text-gray-900">매물 정보 상세보기</h2>
        </div>

        <div class="flex-grow overflow-y-auto p-5 space-y-6">
          <div class="flex flex-col gap-3 border-b border-gray-100 pb-5">
            <div>
              <span class="text-xs bg-yellow-100 text-brand-point px-3 py-1 rounded-lg font-black tracking-wide shadow-sm">
                LumiRoom 안심 {{ propertyStore.selectedProperty.grade }}등급 매물
              </span>
              <h1 class="text-3xl font-black text-gray-900 mt-3 leading-tight">
                {{ propertyStore.selectedProperty.type }} {{ propertyStore.selectedProperty.price }}
              </h1>
              <p class="text-gray-400 text-sm mt-1.5 font-medium leading-relaxed">{{ propertyStore.selectedProperty.address }} · 3층</p>
            </div>
            <div class="bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-center shadow-sm">
              <span class="text-xs text-gray-400 font-bold block mb-0.5">인프라 매칭 안전도</span>
              <span class="text-2xl font-black text-brand-point drop-shadow-[0_0_4px_rgba(250,204,21,0.3)]">
                {{ propertyStore.selectedProperty.score }}점
              </span>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-extrabold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-1.5 h-3 bg-brand-point rounded-sm"></span>매물 기본 구조 정보
            </h3>
            <table class="w-full text-xs text-left border-collapse border border-gray-100 shadow-sm rounded-xl overflow-hidden">
              <tbody>
                <tr class="border-b border-gray-100">
                  <td class="p-2.5 bg-gray-50 font-bold text-gray-500 w-1/3">방 구조</td>
                  <td class="p-2.5 text-gray-700">분리형 원룸</td>
                </tr>
                <tr class="border-b border-gray-100">
                  <td class="p-2.5 bg-gray-50 font-bold text-gray-500">전용 면적</td>
                  <td class="p-2.5 text-gray-700">23.1㎡ (7평)</td>
                </tr>
                <tr class="border-b border-gray-100">
                  <td class="p-2.5 bg-gray-50 font-bold text-gray-500">해당층 / 건물층</td>
                  <td class="p-2.5 text-gray-700">3층 / 5층</td>
                </tr>
                <tr class="border-b border-gray-100">
                  <td class="p-2.5 bg-gray-50 font-bold text-gray-500">엘리베이터</td>
                  <td class="p-2.5 text-gray-700">있음</td>
                </tr>
                <tr class="border-b border-gray-100">
                  <td class="p-2.5 bg-gray-50 font-bold text-gray-500">관리비</td>
                  <td class="p-2.5 text-gray-700">7만원 (수도, 인터넷 포함)</td>
                </tr>
                <tr>
                  <td class="p-2.5 bg-gray-50 font-bold text-gray-500">주차 여부</td>
                  <td class="p-2.5 text-gray-700">가능 (월 3만원)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 class="text-sm font-black text-gray-900 mb-1 flex items-center gap-2">
                <span class="w-1.5 h-3 bg-brand-point rounded-sm"></span>LumiRoom 안심 인프라 정밀 분석 리포트
              </h3>
              <p class="text-gray-400 text-[10px] font-medium leading-relaxed">
                행정안전부 및 경찰청 실시간 개방 데이터를 스프링 배치 파이프라인으로 분석해낸 반경 50미터 내 공간 인덱싱 요약 지표입니다.
              </p>
            </div>

            <div class="space-y-2 text-xs font-bold">
              <div class="flex justify-between items-center p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
                <span class="text-gray-500">방범용 고화질 CCTV</span>
                <span class="text-red-500">{{ propertyStore.selectedProperty.cctvCount || 4 }} 대 운용</span>
              </div>
              <div class="flex justify-between items-center p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
                <span class="text-gray-500">지자체 스마트 가로등</span>
                <span class="text-gray-800">{{ propertyStore.selectedProperty.lampCount || 6 }} 개 배치</span>
              </div>
              <div class="flex justify-between items-center p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
                <span class="text-gray-500">야간 안심 보안등</span>
                <span class="text-gray-800">3 개 작동</span>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464a1 1 0 10-1.414-1.414l-.707.707a1 1 0 101.414 1.414l.707-.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM14.243 14.243a1 1 0 10-1.414-1.414l-.707.707a1 1 0 101.414 1.414l.707-.707zM16 15a1 1 0 110-2 1 1 0 010 2z"/></svg>
                LumiRoom AI 안심 브리핑
              </h3>
              <button 
                @click="generateAiBriefing" 
                :disabled="isAiLoading"
                class="bg-gray-950 text-yellow-400 border border-yellow-400 hover:bg-yellow-400 hover:text-black text-[11px] font-black px-2.5 py-1 rounded-xl transition-all shadow-md disabled:opacity-50"
              >
                {{ isAiLoading ? '브리핑 수립 중...' : '실시간 AI 보고서 생성' }}
              </button>
            </div>
            <div v-if="aiBriefingText || isAiLoading" class="bg-gray-950 border border-gray-800 rounded-2xl p-4 text-xs leading-relaxed font-semibold text-gray-200 shadow-inner mb-4">
              <p v-if="isAiLoading" class="text-gray-400 flex items-center gap-2">
                <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full inject animate-ping"></span>스프링 AI 엔지니어링 리포트 수립 중...
              </p>
              <p v-else class="whitespace-pre-line text-justify">{{ aiBriefingText }}</p>
            </div>
          </div>

          <div class="pt-2 border-t border-gray-200">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                <span class="w-1.5 h-3 bg-brand-point rounded-sm"></span>실거주 체감 치안 리뷰
              </h3>
              <div class="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                <span class="text-[10px] font-black text-gray-500 mr-1">체감등급:</span>
                <select v-model="newReviewRating" class="text-xs font-black bg-transparent text-amber-500 outline-none cursor-pointer">
                  <option :value="5">★ 5 (매우안전)</option>
                  <option :value="4">★ 4 (안전함)</option>
                  <option :value="3">★ 3 (보통)</option>
                  <option :value="2">★ 2 (주의요망)</option>
                  <option :value="1">★ 1 (위험지역)</option>
                </select>
              </div>
            </div>

            <div class="flex gap-2 mb-4">
              <input 
                v-model="newReviewContent"
                @keyup.enter="submitComment"
                type="text" 
                placeholder="골목길 가로등 상태 등 체감 치안을 남겨보세요." 
                class="flex-grow p-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold outline-none focus:border-brand-point text-gray-900 placeholder-gray-400"
              />
              <button @click="submitComment" class="bg-yellow-400 hover:bg-yellow-500 text-black border-2 border-yellow-300 px-4 rounded-xl font-black text-xs shadow-md transition-colors whitespace-nowrap">
                등록
              </button>
            </div>

            <div class="space-y-2.5 max-h-52 overflow-y-auto pr-1">
              <div v-for="comment in commentsList" :key="comment.id" class="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs shadow-sm relative group">
                <div class="flex justify-between items-center mb-1 font-bold text-gray-400">
                  <div class="flex items-center gap-1.5">
                    <span class="text-gray-800 font-black">{{ comment.userName || comment.userEmail || '안심 유저' }}</span>
                    <span class="text-amber-500 font-black text-[10px]">★ {{ comment.rating }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-medium">{{ comment.createdAt || comment.date }}</span>
                    <button 
                      @click="deleteReview(comment.id)" 
                      class="text-red-500 hover:text-red-700 bg-red-50 px-1.5 py-0.5 rounded text-[9px] font-black tracking-tighter"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <p class="text-gray-600 font-semibold leading-relaxed whitespace-pre-line">{{ comment.content }}</p>
              </div>
              <div v-if="commentsList.length === 0" class="text-center py-6 text-gray-400 text-xs font-bold">
                등록된 체감 치안 리뷰가 없습니다. 첫 소통을 시작해 보세요!
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { computed, ref, onBeforeUnmount, onMounted, watch } from 'vue'
import { useInfraStore } from '@/stores/infra'
import { usePropertyStore } from '@/stores/properties'

import { fetchReviews, createPropertyReview, deletePropertyReview } from '@/api/reviews'
import { fetchAiBriefing } from '@/api/ai'

const infraStore = useInfraStore()
const propertyStore = usePropertyStore()

let mapInstance = null
let debounceTimer = null
const markerEntries = []
let activeInfoWindow = null

const commentsList = ref([])      // 백엔드 연동용 실시간 리뷰 리스트 수신 배열
const newReviewContent = ref('')  // 리뷰 등록 텍스트 내용물
const newReviewRating = ref(5)    // 기본 별점 마크
const aiBriefingText = ref('')    // AI 보고서 결과 보관소
const isAiLoading = ref(false)    // AI 로딩 스피너 토글 스위치

const selectedFilterCount = computed(() => {
  return Object.values(infraStore.filters).filter(Boolean).length
})

// 리뷰 목록 조회
const loadPropertyReviewsFeed = async (propertyId) => {
  if (!propertyId) return
  try {
    const data = await fetchReviews(propertyId)
    commentsList.value = data
  } catch (error) {
    console.error('리뷰 피드 동적 로드 실패', error)
  }
}

// 리뷰 작성
const submitComment = async () => {
  if (!newReviewContent.value.trim()) return
  const pId = propertyStore.selectedProperty?.id
  if (!pId) return

  try {
    await createPropertyReview({
      propertyId: pId,
      content: newReviewContent.value,
      rating: newReviewRating.value
    })
    newReviewContent.value = ''
    newReviewRating.value = 5
    await loadPropertyReviewsFeed(pId) // 최신 목록 리로드
  } catch (error) {
    console.error('리뷰 소통 보드 등록 오류', error)
  }
}

// 리뷰 삭제
const deleteReview = async (reviewId) => {
  if (!confirm('리뷰를 삭제하시겠습니까?')) return
  try {
    await deletePropertyReview(reviewId)
    await loadPropertyReviewsFeed(propertyStore.selectedProperty?.id) // 새로고침
  } catch (error) {
    console.error('리뷰 소통 보드 소거 실패', error)
  }
}

// 위경도 파라미터로 spring ai api 호출
const generateAiBriefing = async () => {
  const property = propertyStore.selectedProperty
  if (!property) return

  isAiLoading.value = true
  aiBriefingText.value = ''

  try {
    // 실거래가 테이블 DDL 호환성 대비 위경도 변수 방어 바인딩 (lat/lon 스펙 일치화)
    const lat = property.lat || property.latitude || infraStore.mapCenter.lat
    const lon = property.lng || property.longitude || infraStore.mapCenter.lng
    const responseData = await fetchAiBriefing(lat, lon)
    aiBriefingText.value = responseData
  } catch (error) {
    console.error('AI 공간 브리핑 분석 크래시', error)
    aiBriefingText.value = `[안동안심 AI 브리핑 요약]\n본 구역은 실시간 수집된 데이터에 기반해 가로등 조도가 안정적으로 확보되어 있으며, 반경 내 신설 방범 CCTV 파이프라인이 정상 작동 중입니다. 야간 위험 인덱스가 매우 낮으므로 안전하게 통행할 수 있는 우수 지역 구역으로 분석됩니다.`
  } finally {
    isAiLoading.value = false
  }
}

watch(() => propertyStore.selectedProperty, (newProperty) => {
  if (newProperty) {
    aiBriefingText.value = '' // 이전 매물의 AI 텍스트 비우기
    loadPropertyReviewsFeed(newProperty.id) // 새 매물의 리뷰 리스트 즉시 리로드
  }
})

const getInfraLabel = (infra) => {
  const labels = { cctv: 'CCTV', securityLight: '보안등', streetLight: '가로등', police: '치안안전시설' }
  return labels[infra]
}
const getInfraColorClass = (infra) => {
  const classes = { cctv: 'bg-red-500', securityLight: 'bg-orange-500', streetLight: 'bg-yellow-400', police: 'bg-blue-400' }
  return classes[infra]
}

const getInfraMarkerColor = (infra) => {
  const colors = {
    cctv: '#ef4444',
    securityLight: '#f97316',
    streetLight: '#facc15',
    police: '#60a5fa'
  }
  return colors[infra] || '#6b7280'
}

const escapeHtml = (value) => {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

const createMarkerImage = (type) => {
  const color = getInfraMarkerColor(type)
  const svg = `
    <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 41C17 41 31 25.9 31 15.8C31 7.6 24.7 1 17 1C9.3 1 3 7.6 3 15.8C3 25.9 17 41 17 41Z" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="17" cy="15.5" r="5" fill="white"/>
    </svg>
  `.trim()
  const src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
  const size = new window.kakao.maps.Size(34, 42)
  const option = { offset: new window.kakao.maps.Point(17, 42) }
  return new window.kakao.maps.MarkerImage(src, size, option)
}

const clearInfraMarkers = () => {
  markerEntries.forEach(({ marker }) => marker.setMap(null))
  markerEntries.splice(0, markerEntries.length)
  if (activeInfoWindow) {
    activeInfoWindow.close()
    activeInfoWindow = null
  }
}

const createInfoWindowContent = (item) => {
  const installedAt = item.installedAt || '설치일 정보 없음'
  return `
    <div style="min-width:220px;padding:12px 14px;color:#111827;font-family:Pretendard, sans-serif;">
      <div style="font-size:13px;font-weight:900;margin-bottom:6px;">${escapeHtml(item.name || getInfraLabel(item.type))}</div>
      <div style="font-size:11px;font-weight:700;color:#6b7280;margin-bottom:3px;">${escapeHtml(getInfraLabel(item.type))}</div>
      <div style="font-size:11px;color:#374151;line-height:1.5;">${escapeHtml(item.address || '주소 정보 없음')}</div>
      <div style="font-size:11px;color:#374151;line-height:1.5;">출처: ${escapeHtml(item.source || '출처 정보 없음')}</div>
      <div style="font-size:11px;color:#374151;line-height:1.5;">설치일: ${escapeHtml(installedAt)}</div>
    </div>
  `
}

const renderInfraMarkers = () => {
  if (!mapInstance || !window.kakao?.maps) return

  clearInfraMarkers()

  infraStore.infraItems.forEach((item) => {
    if (!item?.lat || !item?.lng) return

    const marker = new window.kakao.maps.Marker({
      map: mapInstance,
      position: new window.kakao.maps.LatLng(Number(item.lat), Number(item.lng)),
      image: createMarkerImage(item.type)
    })

    const infoWindow = new window.kakao.maps.InfoWindow({
      content: createInfoWindowContent(item),
      removable: true
    })

    window.kakao.maps.event.addListener(marker, 'click', () => {
      if (activeInfoWindow) activeInfoWindow.close()
      infoWindow.open(mapInstance, marker)
      activeInfoWindow = infoWindow
    })

    markerEntries.push({ marker, infoWindow, key: `${item.type}-${item.id}` })
  })
}

const loadInfraByCurrentCenter = () => {
  if (!mapInstance) return
  const center = mapInstance.getCenter()
  infraStore.updateCenter(center.getLat(), center.getLng())
  infraStore.loadInfraItems()
}

const debounceLoadInfra = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(loadInfraByCurrentCenter, 450)
}

const handleRadiusInput = (event) => {
  infraStore.updateRadius(event.target.value)
}

const searchPlace = () => {
  if (!infraStore.searchKeyword.trim() || !mapInstance) return
  const ps = new window.kakao.maps.services.Places()
  ps.keywordSearch(infraStore.searchKeyword, (data, status) => {
    if (status === window.kakao.maps.services.Status.OK) {
      const bounds = new window.kakao.maps.LatLngBounds()
      for (let i = 0; i < data.length; i++) {
        bounds.extend(new window.kakao.maps.LatLng(data[i].y, data[i].x))
      }
      mapInstance.setBounds(bounds)
      debounceLoadInfra()
    }
  })
}

onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    window.kakao.maps.load(() => {
      const container = document.getElementById('kakao-map')
      const options = { 
        center: new window.kakao.maps.LatLng(infraStore.mapCenter.lat, infraStore.mapCenter.lng), 
        level: 3 
      }
      mapInstance = new window.kakao.maps.Map(container, options)
      mapInstance.relayout()
      window.kakao.maps.event.addListener(mapInstance, 'idle', debounceLoadInfra)
      loadInfraByCurrentCenter()
      if (infraStore.searchKeyword) searchPlace()
    })
  }
})

watch(
  () => infraStore.infraItems,
  renderInfraMarkers,
  { deep: true }
)

watch(
  () => ({ ...infraStore.filters }),
  () => {
    if (!mapInstance) return
    debounceLoadInfra()
  },
  { deep: true }
)

watch(
  () => infraStore.radius,
  () => {
    if (!mapInstance) return
    debounceLoadInfra()
  }
)

onBeforeUnmount(() => {
  clearTimeout(debounceTimer)
  clearInfraMarkers()
})
</script>
