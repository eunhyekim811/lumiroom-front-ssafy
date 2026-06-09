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
            </div>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col h-full bg-white text-gray-900">
        <div class="p-4 border-b border-gray-200 bg-white/95 sticky top-0 flex items-center gap-3 z-20">
          <button @click="propertyStore.clearSelection()" class="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors">
            ← 뒤로
          </button>
          <h2 class="text-base font-bold text-gray-900">매물 정보 상세보기</h2>
        </div>

        <div class="flex-grow overflow-y-auto p-5 space-y-6">
          <div>
            <span class="text-xs font-bold bg-yellow-100 text-brand-point px-2 py-0.5 rounded shadow-sm">안전 보장 스코어 {{ propertyStore.selectedProperty.score }}점</span>
            <h2 class="text-2xl font-black text-gray-900 mt-2">{{ propertyStore.selectedProperty.type }} {{ propertyStore.selectedProperty.price }}</h2>
            <p class="text-sm text-gray-400 mt-1 leading-relaxed">{{ propertyStore.selectedProperty.address }}</p>
          </div>
          </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useInfraStore } from '@/stores/infra'
import { usePropertyStore } from '@/stores/properties'

const infraStore = useInfraStore()
const propertyStore = usePropertyStore()

let mapInstance = null

const getInfraLabel = (infra) => {
  const labels = { cctv: 'CCTV', securityLight: '보안등', streetLight: '가로등', police: '치안안전시설' }
  return labels[infra]
}
const getInfraColorClass = (infra) => {
  const classes = { cctv: 'bg-red-500', securityLight: 'bg-orange-500', streetLight: 'bg-yellow-400', police: 'bg-blue-400' }
  return classes[infra]
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
      
      // 스토어 검색어가 홈으로부터 주입되어 존재할 시 마운트 즉시 연쇄 검색 수행
      if (infraStore.searchKeyword) searchPlace()
    })
  }
})
</script>