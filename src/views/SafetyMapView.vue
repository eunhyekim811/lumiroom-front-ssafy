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
          max="5000"
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
              총 {{ propertyStore.totalElements }}개
            </span>
          </div>
          <p class="text-xs text-gray-400 font-medium leading-relaxed">현재 지도 중심과 조회 반경을 기준으로 실거래 매물을 표시합니다.</p>
        </div>

        <div class="flex-grow overflow-y-auto p-4 space-y-4">
          <div v-if="propertyStore.isLoading" class="py-12 text-center text-sm font-bold text-gray-400">
            주변 매물을 조회하고 있습니다.
          </div>
          <div v-else-if="propertyStore.errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-xl text-sm font-bold text-red-600">
            {{ propertyStore.errorMessage }}
          </div>
          <div v-else-if="propertyStore.propertiesList.length === 0" class="py-12 text-center text-sm font-bold text-gray-400">
            현재 범위에서 조회된 매물이 없습니다.
          </div>
          <div 
            v-for="item in propertyStore.propertiesList" :key="item.id"
            @click="handlePropertySelect(item)"
            class="bg-gray-50 border border-gray-200 hover:border-brand-point rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-sm group hover:shadow-md"
          >
            <div class="w-full h-28 bg-gray-200 rounded-lg mb-3 relative overflow-hidden flex items-center justify-center text-xs font-bold text-gray-400">
              매물 이미지 준비 중
              <div v-if="item.score != null" class="absolute top-2 left-2 px-2 py-1 rounded bg-white/90 border border-gray-200 text-[10px] font-bold text-brand-point">
                안전도 {{ item.score }}점
              </div>
            </div>
            <div class="flex items-start justify-between">
              <div class="min-w-0 pr-3">
                <h3 class="font-extrabold text-lg text-gray-900 group-hover:text-brand-point transition-colors truncate">{{ item.title }}</h3>
                <p class="text-sm font-black text-gray-700 mt-1">{{ item.type }} · {{ item.price }}</p>
                <p class="text-xs text-gray-400 font-medium mt-0.5 leading-relaxed">{{ item.address }}</p>
              </div>
              <span v-if="item.grade" class="text-xs px-2 py-1 rounded font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 whitespace-nowrap">
                {{ item.grade }}등급
              </span>
              <span v-else class="text-xs px-2 py-1 rounded font-bold bg-gray-100 text-gray-500 border border-gray-200 whitespace-nowrap">
                안전정보 없음
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
              <span v-if="propertyStore.selectedProperty.grade" class="text-xs bg-yellow-100 text-brand-point px-3 py-1 rounded-lg font-black tracking-wide shadow-sm">
                LumiRoom 안심 {{ propertyStore.selectedProperty.grade }}등급
              </span>
              <h1 class="text-3xl font-black text-gray-900 mt-3 leading-tight">
                {{ propertyStore.selectedProperty.title }}
              </h1>
              <p class="text-gray-700 text-sm mt-1.5 font-black">{{ propertyStore.selectedProperty.type }} · {{ propertyStore.selectedProperty.price }}</p>
              <p class="text-gray-400 text-sm mt-1 font-medium leading-relaxed">{{ propertyStore.selectedProperty.address }}</p>
            </div>
            <div v-if="propertyStore.selectedProperty.score != null" class="bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-center shadow-sm">
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
                  <td class="p-2.5 bg-gray-50 font-bold text-gray-500 w-1/3">거래 유형</td>
                  <td class="p-2.5 text-gray-700">{{ getTransactionLabel(propertyStore.selectedProperty.transactionType) }}</td>
                </tr>
                <tr class="border-b border-gray-100">
                  <td class="p-2.5 bg-gray-50 font-bold text-gray-500">보증금 범위</td>
                  <td class="p-2.5 text-gray-700">{{ formatAmountRange(propertyStore.selectedProperty.minDepositAmount, propertyStore.selectedProperty.maxDepositAmount) }}</td>
                </tr>
                <tr class="border-b border-gray-100">
                  <td class="p-2.5 bg-gray-50 font-bold text-gray-500">월세 범위</td>
                  <td class="p-2.5 text-gray-700">{{ formatAmountRange(propertyStore.selectedProperty.minMonthlyRentAmount, propertyStore.selectedProperty.maxMonthlyRentAmount) }}</td>
                </tr>
                <tr class="border-b border-gray-100">
                  <td class="p-2.5 bg-gray-50 font-bold text-gray-500">매매가 범위</td>
                  <td class="p-2.5 text-gray-700">{{ formatAmountRange(propertyStore.selectedProperty.minTradeAmount, propertyStore.selectedProperty.maxTradeAmount) }}</td>
                </tr>
              </tbody>
            </table>
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
import { computed, ref, onBeforeUnmount, onMounted, watch } from 'vue'
import { useInfraStore } from '@/stores/infra'
import { usePropertyStore } from '@/stores/properties'

const infraStore = useInfraStore()
const propertyStore = usePropertyStore()

let mapInstance = null
let debounceTimer = null
const infraMarkerEntries = []
const propertyMarkerEntries = []
let activeInfraInfoWindow = null

const selectedFilterCount = computed(() => {
  return Object.values(infraStore.filters).filter(Boolean).length
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

const getTransactionLabel = (transactionType) => {
  const labels = {
    SALE: '매매',
    JEONSE: '전세',
    MONTHLY_RENT: '월세',
    MIXED: '혼합',
    UNKNOWN: '거래유형 미상'
  }
  return labels[transactionType] || transactionType || '거래유형 미상'
}

const formatAmountRange = (min, max) => {
  if (min == null && max == null) return '정보 없음'
  if (min == null) return `${max}`
  if (max == null || min === max) return `${min}`
  return `${min} ~ ${max}`
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
  infraMarkerEntries.forEach(({ marker }) => marker.setMap(null))
  infraMarkerEntries.splice(0, infraMarkerEntries.length)
  if (activeInfraInfoWindow) {
    activeInfraInfoWindow.close()
    activeInfraInfoWindow = null
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
      if (activeInfraInfoWindow) activeInfraInfoWindow.close()
      infoWindow.open(mapInstance, marker)
      activeInfraInfoWindow = infoWindow
    })

    infraMarkerEntries.push({ marker, infoWindow, key: `${item.type}-${item.id}` })
  })
}

const createPropertyMarkerImage = () => {
  const svg = `
    <svg width="38" height="46" viewBox="0 0 38 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 45C19 45 35 28.5 35 17C35 8.2 27.8 1 19 1C10.2 1 3 8.2 3 17C3 28.5 19 45 19 45Z" fill="#111827" stroke="#FACC15" stroke-width="3"/>
      <path d="M12 17L19 11L26 17V26H12V17Z" fill="#FACC15"/>
      <path d="M17 26V20H21V26" fill="#111827"/>
    </svg>
  `.trim()
  const src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
  const size = new window.kakao.maps.Size(38, 46)
  const option = { offset: new window.kakao.maps.Point(19, 46) }
  return new window.kakao.maps.MarkerImage(src, size, option)
}

const clearPropertyMarkers = () => {
  propertyMarkerEntries.forEach(({ marker }) => marker.setMap(null))
  propertyMarkerEntries.splice(0, propertyMarkerEntries.length)
}

const handlePropertySelect = (property) => {
  propertyStore.selectProperty(property)
  if (!mapInstance) return
  mapInstance.panTo(new window.kakao.maps.LatLng(property.lat, property.lng))
}

const renderPropertyMarkers = () => {
  if (!mapInstance || !window.kakao?.maps) return

  clearPropertyMarkers()
  const markerImage = createPropertyMarkerImage()

  propertyStore.propertiesList.forEach((property) => {
    if (!Number.isFinite(property.lat) || !Number.isFinite(property.lng)) return

    const marker = new window.kakao.maps.Marker({
      map: mapInstance,
      position: new window.kakao.maps.LatLng(property.lat, property.lng),
      image: markerImage,
      title: property.title
    })

    window.kakao.maps.event.addListener(marker, 'click', () => {
      handlePropertySelect(property)
    })

    propertyMarkerEntries.push({ marker, id: property.id })
  })
}

const loadInfraByCurrentCenter = () => {
  if (!mapInstance) return
  const center = mapInstance.getCenter()
  infraStore.updateCenter(center.getLat(), center.getLng())
  infraStore.loadInfraItems()
}

const loadMapDataByCurrentCenter = () => {
  if (!mapInstance) return
  const center = mapInstance.getCenter()
  const lat = center.getLat()
  const lng = center.getLng()
  infraStore.updateCenter(lat, lng)
  infraStore.loadInfraItems()
  propertyStore.loadProperties({
    lat,
    lng,
    radius: infraStore.radius
  })
}

const debounceLoadInfra = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(loadInfraByCurrentCenter, 450)
}

const debounceLoadMapData = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(loadMapDataByCurrentCenter, 450)
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
      window.kakao.maps.event.addListener(mapInstance, 'idle', debounceLoadMapData)
      loadMapDataByCurrentCenter()
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
  () => propertyStore.propertiesList,
  renderPropertyMarkers,
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
    debounceLoadMapData()
  }
)

onBeforeUnmount(() => {
  clearTimeout(debounceTimer)
  clearInfraMarkers()
  clearPropertyMarkers()
})
</script>
