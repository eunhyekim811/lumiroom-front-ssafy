<template>
  <div class="min-h-[calc(100vh-64px)] bg-gray-950 p-6 md:p-12 font-sans text-gray-100">
    <div class="max-w-5xl mx-auto space-y-8">
      
      <div class="border-b border-gray-800 pb-4">
        <h1 class="text-2xl font-black tracking-wide text-white">마이페이지</h1>
        <p class="text-xs text-gray-400 mt-1 font-medium">기본 계정 정보와 찜해두신 안심 매물을 실시간 관리합니다.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div class="flex flex-col items-center text-center pb-4 border-b border-gray-800">
            <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-400 flex items-center justify-center text-gray-950 font-black text-xl shadow-lg mb-3">
              {{ authStore.userProfile?.name ? authStore.userProfile.name.substring(0, 1) : 'U' }}
            </div>
            
            <h2 class="text-lg font-black text-white">{{ authStore.userProfile?.name || '조회 중...' }}</h2>
            
            <span class="text-[10px] bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-md font-bold mt-1.5 uppercase">
              {{ authStore.userProfile?.role || 'USER' }} MEMBER
            </span>
          </div>

          <div class="space-y-4 text-xs font-bold">
            <div>
              <span class="text-gray-400 block mb-1">로그인 이메일 계정</span>
              <span class="text-gray-200 block bg-gray-950 px-3 py-2.5 rounded-xl border border-gray-850 select-all font-mono">
                {{ authStore.userProfile?.email || '조회 중...' }}
              </span>
            </div>
            <div>
              <span class="text-gray-400 block mb-1">계정 생성 일자 (가입일)</span>
              <span class="text-gray-300 block bg-gray-950 px-3 py-2.5 rounded-xl border border-gray-850 font-medium">
                {{ formatDateTime(authStore.userProfile?.createdAt) }}
              </span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-4">
          <h3 class="text-base font-black text-white flex items-center gap-2">
            <svg class="w-5 h-5 text-red-500 fill-current" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/></svg>
            내가 찜한 안심 매물 목록
            <span class="text-xs font-black bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full ml-1">
              {{ favoritesList.length }}개
            </span>
          </h3>

          <div v-if="isLoading" class="text-center py-20 text-xs font-bold text-gray-400">
            데이터베이스 관심 거래 내역 리스트 수신 중...
          </div>

          <div v-else-if="favoritesList.length === 0" class="bg-gray-900 border border-dashed border-gray-800 rounded-2xl py-20 flex flex-col items-center justify-center gap-3 text-center">
            <svg class="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <p class="text-xs text-gray-400 font-extrabold leading-relaxed">등록된 관심 매물이 비어있습니다.</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="item in favoritesList" :key="item.id"
              @click="goToPropertyDetail(item.propertyId)"
              class="bg-gray-900 border border-gray-850 hover:border-yellow-400/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-xl group cursor-pointer transform hover:-translate-y-0.5"
            >
              <div class="space-y-3">
                <div class="flex items-start justify-between gap-2">
                  <span class="text-[10px] px-2 py-0.5 rounded font-black tracking-wide bg-yellow-400/10 border border-yellow-400/20 text-yellow-400">
                    {{ getRentTypeLabel(item) }}
                  </span>
                  <button @click.stop="handleRemoveFavorite(item.propertyId)" class="text-gray-500 hover:text-red-400 p-1 rounded-lg hover:bg-gray-850 transition-colors" title="관심 매물 해제">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                  </button>
                </div>
                <div>
                  <h4 class="font-black text-base text-white group-hover:text-yellow-400 transition-colors truncate">{{ item.title || '이름 없는 매물' }}</h4>
                  <p class="text-sm font-black text-yellow-400 mt-1">{{ formatPrice(item) }}</p>
                  <p class="text-[11px] text-gray-400 font-bold mt-1.5 tracking-tight">
                    <span class="block text-gray-300">{{ item.sigungu }}</span>
                    <span class="block text-gray-500 text-[10px] mt-0.5">도로명: {{ item.road }}</span>
                  </p>
                </div>
              </div>
              
              <div class="border-t border-gray-850 mt-4 pt-3 flex items-center justify-between text-[10px] font-bold text-gray-500">
                <span>등록일: {{ formatDateString(item.createdAt) }}</span>
                
                <button @click.stop="goToPropertyDetail(item.propertyId)" class="text-yellow-400 group-hover:text-yellow-300 hover:underline cursor-pointer font-black">
                  매물 상세보기 →
                </button>
                
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePropertyStore } from '@/stores/properties'
import { useAuthStore } from '@/stores/auth'
import { fetchMyFavorites, deleteFavorite } from '@/api/favorites'

const router = useRouter()
const propertyStore = usePropertyStore()
const authStore = useAuthStore()

const favoritesList = ref([])
const isLoading = ref(false)

const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '조회 중...'
  const date = new Date(dateTimeStr)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 가입`
}

const getRentTypeLabel = (item) => {
  if (item.minTradeAmount && item.minTradeAmount > 0) return '매매'
  if (item.minMonthlyRentAmount && item.minMonthlyRentAmount > 0) return '월세'
  return '전세'
}

const formatPrice = (item) => {
  if (item.minTradeAmount && item.minTradeAmount > 0) {
    return `매매 ${item.minTradeAmount.toLocaleString()}만원`
  }
  if (item.minMonthlyRentAmount && item.minMonthlyRentAmount > 0) {
    return `월세 ${item.minDepositAmount.toLocaleString()} / ${item.minMonthlyRentAmount.toLocaleString()}만원`
  }
  return `전세 ${item.minDepositAmount.toLocaleString()}만원`
}

const formatDateString = (dateStr) => {
  if (!dateStr) return '-'
  return dateStr.split('T')[0]
}

const loadUserFavorites = async () => {
  isLoading.value = true
  try {
    const data = await fetchMyFavorites()
    favoritesList.value = data
  } catch (error) {
    console.error('관심 매물 목록 수신 실패', error)
  } finally {
    isLoading.value = false
  }
}

const handleRemoveFavorite = async (propertyId) => {
  if (!propertyId) return
  if (!confirm('해당 매물을 관심 목록에서 제외하시겠습니까?')) return
  try {
    await deleteFavorite(propertyId)
    await loadUserFavorites() 
  } catch (error) {
    console.error('관심 매물 해제 실패', error)
  }
}

const goToPropertyDetail = (propertyId) => {
  if (!propertyId) return
  
  const targetItem = favoritesList.value.find(f => f.propertyId === propertyId)
  if (targetItem) {
    propertyStore.selectProperty({
      id: targetItem.propertyId,
      title: targetItem.title,
      sigungu: targetItem.sigungu,
      road: targetItem.road
    })
  }

  router.push(`/properties/${propertyId}`)
}

onMounted(async () => {
  if (localStorage.getItem('accessToken')) {
    try {
      await authStore.fetchMyProfile()
    } catch (err) {
      console.error('유저 프로필 리로드 크래시:', err)
    }
    loadUserFavorites()
  } else {
    alert('로그인이 필요한 페이지입니다.')
    router.push('/login')
  }
})
</script>