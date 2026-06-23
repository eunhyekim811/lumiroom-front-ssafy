<template>
  <div class="max-w-7xl mx-auto px-6 py-10 bg-brand-bg min-h-screen text-gray-900">
    <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-700 pb-6">
      <div>
        <h1 class="text-3xl font-black text-white">지역별 안심 매물 찾기</h1>
        <p class="text-sm text-gray-400 mt-1 font-medium leading-relaxed">지역별 종합 인프라 안전도 스코어 등급이 결합된 공식 리스트입니다.</p>
      </div>
      
      <div class="flex gap-2">
        <!-- <select class="bg-brand-card border border-gray-700 text-white px-4 py-2 rounded-xl text-sm font-bold focus:outline-none focus:border-brand-point">
          <option>안전지수 높은 순</option>
        </select> -->
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="item in propertyStore.propertiesList" :key="item.id"
        @click="navigateToDetail(item.id)"
        class="bg-white border border-gray-200 hover:border-brand-point rounded-2xl p-5 cursor-pointer transition-all duration-300 group shadow-sm hover:shadow-lg hover:scale-[1.01] relative"
      >
        <div class="h-48 bg-gray-100 rounded-xl mb-4 relative overflow-hidden">
          <img
            :src="getPropertyImage(item.type)"
            :alt="`${item.type} 매물 이미지`"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          >

          <div class="absolute top-3 left-3 bg-yellow-100 border border-amber-200 backdrop-blur text-xs font-black text-brand-point px-3 py-1 rounded-lg shadow-sm z-10">
            안전지수 {{ item.score }}점
          </div>

          <button 
            @click.stop="toggleFavoriteStatus(item.id)"
            class="absolute top-3 right-3 z-25 p-2 rounded-full bg-white/95 shadow-md border border-gray-150 text-gray-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title="관심 매물 등록/해제"
          >
            <svg class="w-6 h-6" :class="{'text-red-500 fill-current': favoritePropertyIds.includes(item.id)}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </button>
        </div>

        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-2xl font-black text-gray-900 group-hover:text-brand-point transition-colors leading-tight">{{ item.title }}</h3>
            <p class="text-sm text-gray-600 mt-1 font-medium leading-relaxed">{{ item.type }} {{ item.price }}</p>
            <p class="text-sm text-gray-400 mt-1 font-medium leading-relaxed">{{ item.address }}</p>
          </div>
          <div class="text-right">
            <span
              :class="getSafetyGradeClass(item.grade)"
              class="inline-block text-xs font-bold border px-2.5 py-1 rounded-lg"
            >
              {{ item.grade }}등급
            </span>
          </div>
        </div>

        <div class="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-400">
          <span>📹CCTV {{ item.cctvCount ?? 0 }}대</span>
          <span>💡보안등 {{ item.securityLightCount ?? 0 }}개</span>
          <span>🛡️치안시설 {{ item.securityFacilityCount ?? 0 }}개</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 반응형 상태 선언용 ref 및 컴포넌트 장착 수명 주기인 onMounted 수입
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePropertyStore } from '@/stores/properties'
import { useAuthStore } from '@/stores/auth'
import { getSafetyGradeClass } from '@/utils/safetyGrade'

// 관심매물 추가/해제/목록조회 전담 처리 API 함수 일괄 수집
import { fetchMyFavorites, addFavorite, deleteFavorite } from '@/api/favorites'

const router = useRouter()
const propertyStore = usePropertyStore()
const authStore = useAuthStore()

const getPropertyImage = (type) => {
  const images = {
    오피스텔: '/images/officetel.jpg',
    연립다세대: '/images/multi-family-house.jpg',
    단독다가구: '/images/house.jpg'
  }
  return images[type] || '/images/default.jpg'
}

// 현재 로그인한 회원이 찜해 놓은 매물 아이디 목록 추적 반응형 배열
const favoritePropertyIds = ref([])

// 마운트 직후 회원의 찜 데이터 상태를 백엔드에서 긁어오는 연동 함수
const loadUserFavorites = async () => {
  if (!authStore.isLoggedIn) return
  try {
    const favorites = await fetchMyFavorites()
    // f.propertyId 만 수집하여 토글 감시용 배열에 보관
    favoritePropertyIds.value = favorites.map(f => f.propertyId)
  } catch (error) {
    console.error('리스트 페이지 내 관심 매물 상태 갱신 실패:', error)
  }
}

// 하트 단추 클릭 시 백엔드 1번(추가), 2번(삭제) 엔드포인트와 동기화하는 분기 처리 유닛
const toggleFavoriteStatus = async (propertyId) => {
  if (!authStore.isLoggedIn) {
    alert('로그인 후 관심 매물 등록 기능을 이용할 수 있습니다.')
    return
  }

  const isAlreadyFavorited = favoritePropertyIds.value.includes(propertyId)

  try {
    if (isAlreadyFavorited) {
      // 찜 해제 가드 발동: DELETE /api/favorites/{propertyId} 패스배리어블 날림
      await deleteFavorite(propertyId)
      favoritePropertyIds.value = favoritePropertyIds.value.filter(id => id !== propertyId)
    } else {
      // 찜 등록 가드 발동: POST /api/favorites JSON 바디 요청 보냄
      await addFavorite(propertyId)
      favoritePropertyIds.value.push(propertyId)
    }
  } catch (error) {
    console.error('리스트 화면 관심 매물 처리 오류 발생:', error)
    alert('관심 매물 처리 중 예외가 발생했습니다.')
  }
}

const navigateToDetail = (id) => {
  router.push(`/properties/${id}`)
}

// 화면 렌더링 준비 완료 시 찜 내역을 선제 동기화
onMounted(() => {
  loadUserFavorites()
})
</script>
