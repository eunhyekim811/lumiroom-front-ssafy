<template>
  <div class="flex h-[calc(100vh-64px)] overflow-hidden bg-brand-bg text-gray-100">
    
    <main class="flex-grow relative h-full">
      <div id="kakao-map" class="w-full h-full bg-gray-950" style="min-height: 100%;"></div>

      <div v-if="isZoomTooFar" class="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-20 flex items-center justify-center pointer-events-none animate-fade-in">
        <div class="bg-gray-900/95 border-2 border-yellow-400 text-white px-6 py-4 rounded-2xl shadow-2xl flex flex-col items-center gap-2 pointer-events-auto">
          <svg class="w-8 h-8 text-yellow-400 animate-bounce" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <p class="font-black text-sm text-center浏览 leading-relaxed">
            지도가 너무 멀리 감지되었습니다.<br/>
            <span class="text-yellow-400">안심 인프라 조회를 위해 지도를 더 확대해 주세요.</span>
          </p>
        </div>
      </div>

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

          <div class="pt-2 border-t border-gray-200">
            <h3 class="text-sm font-extrabold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-1.5 h-3 bg-brand-point rounded-sm"></span>실거주 체감 치안 리뷰
            </h3>

            <div class="flex gap-2 mb-4">
              <input 
                v-model="newComment"
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
              <div v-for="comment in comments" :key="comment.id" class="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs shadow-sm">
                <div class="flex justify-between items-center mb-1 font-bold text-gray-400">
                  <span class="text-gray-800 font-black">{{ comment.userName }}</span>
                  <span class="text-[10px] font-medium">{{ comment.date }}</span>
                </div>
                <p class="text-gray-600 font-semibold leading-relaxed">{{ comment.content }}</p>
              </div>
              <div v-if="comments.length === 0" class="text-center py-6 text-gray-400 text-xs font-bold">
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
import { ref, onMounted, watch, nextTick } from 'vue'
import { useInfraStore } from '@/stores/infra'
import { usePropertyStore } from '@/stores/properties'
import { fetchInfraMarkers } from '@/api/infra'

const infraStore = useInfraStore()
const propertyStore = usePropertyStore()

let mapInstance = null

// 지도가 너무 축소되었는지 제어할 반응형 토글 변수 수립
const isZoomTooFar = ref(false)

// 카카오 커스텀 오버레이 원형 점 인스턴스 배열 구조 백업 저장소
const mapMarkers = ref({
  cctv: [],
  securityLight: [],
  streetLight: [],
  police: []
})

const newComment = ref('')
const comments = ref([
  { id: 1, userName: '안심방랑자', date: '2026-06-09', content: '여기 저녁에 직접 가봤는데 대로변에서 골목 진입하자마자 고광도 보안등이 켜져 있어서 되게 밝아요.' },
  { id: 2, userName: '신림원주민', date: '2026-06-08', content: '반경 내에 지구대가 가깝다 보니 경찰 순찰차가 수시로 돌아서 안심하고 거주할 수 있습니다.' }
])

const submitComment = () => {
  if (!newComment.value.trim()) return
  comments.value.unshift({
    id: Date.now(),
    userName: '익명의 탐색자',
    date: new Date().toISOString().split('T')[0],
    content: newComment.value
  })
  newComment.value = ''
}

const getInfraLabel = (infra) => {
  const labels = { cctv: 'CCTV', securityLight: '보안등', streetLight: '가로등', police: '치안시설' }
  return labels[infra]
}
const getInfraColorClass = (infra) => {
  const classes = { cctv: 'bg-red-500', securityLight: 'bg-orange-500', streetLight: 'bg-yellow-400', police: 'bg-blue-400' }
  return classes[infra]
}

// 지도가 너무 멀어지면 마커 소거 및 차단 가드 훅 추가
const clearAllOverlaysOnMap = () => {
  Object.keys(mapMarkers.value).forEach(type => {
    mapMarkers.value[type].forEach(overlay => overlay.setMap(null))
    mapMarkers.value[type] = []
  })
}

const updateInfraMarkers = async (infraType) => {
  if (!mapInstance) return

  // 안전 장치: 레벨 5 이상(숫자가 클수록 멀어짐)인 경우 백엔드 통신 차단 및 조기 반환(Guard Clause)
  if (mapInstance.getLevel() > 4) return

  mapMarkers.value[infraType].forEach(overlay => overlay.setMap(null))
  mapMarkers.value[infraType] = []

  if (!infraStore.filters[infraType]) return

  const bounds = mapInstance.getBounds()
  const sw = bounds.getSouthWest()
  const ne = bounds.getNorthEast()

  const params = {
    type: infraType,
    swLat: sw.getLat(),
    swLng: sw.getLng(),
    neLat: ne.getLat(),
    neLng: ne.getLng()
  }

  const markerData = await fetchInfraMarkers(params)

  markerData.forEach(item => {
    const markerPosition = new window.kakao.maps.LatLng(item.latitude, item.longitude)
    const contentHTML = `<div class="infra-dot ${infraType}-dot" title="${getInfraLabel(infraType)}"></div>`

    const overlay = new window.kakao.maps.CustomOverlay({
      position: markerPosition,
      content: contentHTML,
      yAnchor: 0.5
    })

    overlay.setMap(mapInstance)
    mapMarkers.value[infraType].push(overlay)
  })
}

const reloadAllActiveFilters = () => {
  if (!mapInstance || mapInstance.getLevel() > 4) return
  Object.keys(infraStore.filters).forEach(type => {
    updateInfraMarkers(type)
  })
}

// 필터 변경 추적 Watch
watch(() => infraStore.filters, (newFilters) => {
  if (!mapInstance || mapInstance.getLevel() > 4) return
  Object.keys(newFilters).forEach(type => {
    updateInfraMarkers(type)
  })
}, { deep: true })

const searchPlace = () => {
  if (!infraStore.searchKeyword.trim() || !mapInstance) return

  // 장소 검색 시 필터는 일단 리셋 꺼짐 처리
  infraStore.filters.cctv = false
  infraStore.filters.securityLight = false
  infraStore.filters.streetLight = false
  infraStore.filters.police = false

  const ps = new window.kakao.maps.services.Places()
  ps.keywordSearch(infraStore.searchKeyword, (data, status) => {
    if (status === window.kakao.maps.services.Status.OK) {
      const bounds = new window.kakao.maps.LatLngBounds()
      for (let i = 0; i < data.length; i++) {
        bounds.extend(new window.kakao.maps.LatLng(data[i].y, data[i].x))
      }
      mapInstance.setBounds(bounds)
    } else {
      alert('검색 결과가 존재하지 않습니다.')
    }
  })
}

onMounted(async () => {
  await nextTick()
  if (window.kakao && window.kakao.maps) {
    window.kakao.maps.load(() => {
      const container = document.getElementById('kakao-map')
      const options = { 
        center: new window.kakao.maps.LatLng(infraStore.mapCenter.lat, infraStore.mapCenter.lng), 
        level: 3 
      }
      mapInstance = new window.kakao.maps.Map(container, options)
      mapInstance.relayout()

      // 마우스 휠 스크롤 즉시 감지하여 차단 여부를 토글하는 실시간 스캔 이벤트 연동
      window.kakao.maps.event.addListener(mapInstance, 'zoom_changed', () => {
        const currentLevel = mapInstance.getLevel()
        if (currentLevel > 5) {
          isZoomTooFar.value = true
          clearAllOverlaysOnMap() // 레벨 초과 시 지도 위 모든 인프라 마커를 물리적 소거
        } else {
          isZoomTooFar.value = false
        }
      })

      // 지도 드래그 및 움직임 종료 이벤트 바인딩
      window.kakao.maps.event.addListener(mapInstance, 'idle', () => {
        const currentLevel = mapInstance.getLevel()
        if (currentLevel > 4) {
          isZoomTooFar.value = true
          clearAllOverlaysOnMap()
          return
        }
        
        isZoomTooFar.value = false
        const center = mapInstance.getCenter()
        infraStore.updateCenter(center.getLat(), center.getLat())
        reloadAllActiveFilters() // 허용 레벨일 때만 정상 로드
      })

      // 최초 마운트 시 축척 유효성 검사 검사
      if (mapInstance.getLevel() > 4) {
        isZoomTooFar.value = true
      }

      if (infraStore.searchKeyword) searchPlace()
      else reloadAllActiveFilters()
    })
  }
})
</script>

<style scoped>
/* 커스텀 마킹 원형 점 디자인 명세 */
:deep(.infra-dot) {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  transition: transform 0.1s ease;
  cursor: pointer;
}

:deep(.infra-dot:hover) {
  transform: scale(1.4);
  z-index: 100;
}

:deep(.cctv-dot) { background-color: #EF4444; }
:deep(.securityLight-dot) { background-color: #F97316; }
:deep(.streetLight-dot) { background-color: #FACC15; border-color: rgba(0, 0, 0, 0.3); }
:deep(.police-dot) { background-color: #60A5FA; }

/* 레이어 페이드인 페이드인 효과 */
.animate-fade-in {
  animation: fadeIn 0.25s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>