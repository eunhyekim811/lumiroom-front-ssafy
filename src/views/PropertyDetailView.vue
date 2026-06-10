<template>
  <div class="max-w-7xl mx-auto px-6 py-10 bg-brand-bg min-h-screen text-gray-900">
    <button @click="$router.back()" class="text-gray-300 hover:text-brand-point font-bold text-sm mb-6 flex items-center gap-2 transition-colors">
      ← 이전 리스트로 돌아가기
    </button>

    <div v-if="currentProperty" class="flex flex-col lg:flex-row gap-6">
      <div class="flex-grow bg-white border border-gray-200 rounded-3xl p-6 md:p-8 space-y-8 shadow-xl">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <span class="text-xs bg-yellow-100 text-brand-point px-3 py-1 rounded-lg font-black tracking-wide shadow-sm">
              LumiRoom 안심 {{ currentProperty.grade }}등급 매물
            </span>
            <h1 class="text-4xl font-black text-gray-900 mt-3 leading-tight">
              {{ currentProperty.type }} {{ currentProperty.price }}
            </h1>
            <p class="text-gray-400 text-sm mt-2 font-medium leading-relaxed">{{ currentProperty.address }} · 3층</p>
          </div>
          <div class="bg-gray-50 border border-gray-200 p-4 rounded-xl text-center sm:min-w-[150px] shadow-sm">
            <span class="text-xs text-gray-400 font-bold block mb-1">인프라 매칭 안전도</span>
            <span class="text-3xl font-black text-brand-point drop-shadow-[0_0_4px_rgba(250,204,21,0.3)]">
              {{ currentProperty.score }}점
            </span>
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
            행정안전부 및 경찰청 실시간 개방 데이터를 스프링 배치 파이프라인으로 분석해낸 반경 50미터 내 공간 인덱싱 요약 지표입니다.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
              <span class="text-xs text-gray-400 font-bold">방범용 고화질 CCTV</span>
              <span class="block text-2xl font-black text-red-500 mt-1">{{ currentProperty.cctvCount || 4 }} 대 운용</span>
            </div>
            <div class="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
              <span class="text-xs text-gray-400 font-bold">지자체 스마트 가로등</span>
              <span class="block text-2xl font-black text-gray-800 mt-1">{{ currentProperty.lampCount || 6 }} 개 배치</span>
            </div>
            <div class="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
              <span class="text-xs text-gray-400 font-bold">야간 안심 보안등</span>
              <span class="block text-2xl font-black text-gray-800 mt-1">3 개 작동</span>
            </div>
          </div>
        </div>

        <div class="pt-2 border-t border-gray-200">
          <h3 class="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
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
            <button @click="submitComment" class="bg-yellow-400 hover:bg-yellow-500 text-black border-2 border-yellow-300 px-5 rounded-xl font-black text-xs shadow-md transition-colors whitespace-nowrap">
              등록
            </button>
          </div>

          <div class="space-y-2.5 max-h-60 overflow-y-auto pr-1">
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

      <div class="w-full lg:w-[400px] bg-brand-card border border-gray-700 rounded-3xl p-4 shadow-xl flex flex-col h-[400px] lg:h-auto">
        <h3 class="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-brand-point" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          매물 위치 및 주변 인프라 지도
        </h3>
        <div id="mini-map" class="w-full flex-grow bg-gray-950 rounded-2xl relative overflow-hidden" style="min-height: 300px;"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { usePropertyStore } from '@/stores/properties'

const route = useRoute()
const propertyStore = usePropertyStore()

// ★ 해결책 1: 빈 null이 아니라 스크립트 실행 직후(초기 렌더링)부터 마스터 데이터를 동기 매핑하여 v-if 타이밍 충돌을 예방합니다.
const targetId = parseInt(route.params.id)
const currentProperty = ref(
  propertyStore.propertiesList.find(p => p.id === targetId) || propertyStore.propertiesList[0]
)

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

const initMiniMap = () => {
  if (window.kakao && window.kakao.maps) {
    window.kakao.maps.load(() => {
      const container = document.getElementById('mini-map')
      if (!container) return
      
      const options = {
        center: new window.kakao.maps.LatLng(37.4812, 126.9296),
        level: 2
      }
      const map = new window.kakao.maps.Map(container, options)
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(37.4812, 126.9296)
      })
      marker.setMap(map)
      
      // 레이아웃 보정 함수 호출
      map.relayout()
    })
  }
}

const loadPropertyData = () => {
  const tId = parseInt(route.params.id)
  currentProperty.value = propertyStore.propertiesList.find(p => p.id === tId) 
    || propertyStore.propertiesList[0]
}

// ★ 해결책 2: nextTick을 통해 Vue의 가상 돔 드로잉 스케줄러가 끝난 것을 확인한 뒤 안전하게 지도를 맵핑합니다.
watch(() => route.params.id, async () => {
  loadPropertyData()
  await nextTick()
  initMiniMap()
})

onMounted(async () => {
  await nextTick()
  initMiniMap()
})
</script>