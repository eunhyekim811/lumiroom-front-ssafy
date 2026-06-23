<template>
  <div class="max-w-7xl mx-auto px-6 py-10 bg-brand-bg min-h-screen text-gray-900">
    <button @click="$router.back()" class="text-gray-300 hover:text-brand-point font-bold text-sm mb-6 flex items-center gap-2 transition-colors">
      ← 이전 리스트로 돌아가기
    </button>

    <div v-if="currentProperty" class="flex flex-col lg:flex-row gap-6">
      <div class="flex-grow bg-white border border-gray-200 rounded-3xl p-6 md:p-8 space-y-8 shadow-xl">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <span
              v-if="currentProperty.grade"
              :class="getSafetyGradeClass(currentProperty.grade)"
              class="text-xs border px-3 py-1 rounded-lg font-black tracking-wide shadow-sm"
            >
              LumiRoom 안심 {{ currentProperty.grade }}등급 매물
            </span>
            
            <div class="flex flex-wrap items-center gap-4 mt-3">
              <h1 class="text-4xl font-black text-gray-900 leading-tight">
                {{ currentProperty.title }}
              </h1>
              
              <button 
                @click="toggleFavoriteStatus(currentProperty.id)"
                class="p-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-black text-xs transition-all active:scale-95 shadow-sm whitespace-nowrap h-11 mt-1"
                :class="favoritePropertyIds.includes(currentProperty.id) 
                  ? 'bg-red-50 border-red-200 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.15)]' 
                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-900'"
              >
                <svg class="w-4 h-4" :class="{'fill-current': favoritePropertyIds.includes(currentProperty.id)}" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                {{ favoritePropertyIds.includes(currentProperty.id) ? '찜 해제' : '관심 등록' }}
              </button>
            </div>

            <p class="text-gray-700 text-base mt-2.5 font-black">{{ currentProperty.type }} · {{ currentProperty.price }}</p>
            <p class="text-gray-400 text-sm mt-1 font-medium leading-relaxed">{{ currentProperty.address }}</p>
          </div>
          
          <div v-if="currentProperty.score != null" class="bg-gray-50 border border-gray-200 p-4 rounded-xl text-center sm:min-w-[150px] shadow-sm">
            <span class="text-xs text-gray-400 font-bold block mb-1">인프라 매칭 안전도</span>
            <span class="text-3xl font-black text-brand-point drop-shadow-[0_0_4px_rgba(250,204,21,0.3)]">
              {{ currentProperty.score }}점
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
                <td class="p-2.5 text-gray-770">{{ getTransactionLabel(currentProperty.transactionType) }}</td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="p-2.5 bg-gray-50 font-bold text-gray-500">보증금 범위</td>
                <td class="p-2.5 text-gray-700">{{ formatAmountRange(currentProperty.minDepositAmount, currentProperty.maxDepositAmount) }}</td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="p-2.5 bg-gray-50 font-bold text-gray-500">월세 범위</td>
                <td class="p-2.5 text-gray-700">{{ formatAmountRange(currentProperty.minMonthlyRentAmount, currentProperty.maxMonthlyRentAmount) }}</td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="p-2.5 bg-gray-50 font-bold text-gray-500">매매가 범위</td>
                <td class="p-2.5 text-gray-700">{{ formatAmountRange(currentProperty.minTradeAmount, currentProperty.maxTradeAmount) }}</td>
              </tr>
              <tr>
                <td class="p-2.5 bg-gray-50 font-bold text-gray-500">건축연도</td>
                <td class="p-2.5 text-gray-700">{{ formatBuiltYear(currentProperty) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 class="text-lg font-black text-gray-900 mb-2 flex items-center gap-2">
            <span class="w-2 h-4 bg-brand-point rounded-sm"></span>LumiRoom 안심 인프라 정밀 분석 리포트
          </h3>
          <p class="text-gray-400 text-xs font-medium mb-6 leading-relaxed">
            행정안전부 및 경찰청 실시간 개방 데이터를 스프링 배치 파이프라인으로 분석해낸 반경 내 공간 인덱싱 요약 지표입니다.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
              <span class="text-xs text-gray-400 font-bold">방범용 고화질 CCTV</span>
              <span class="block text-2xl font-black text-red-500 mt-1">{{ currentProperty.cctvCount ?? 0 }} 대 운용</span>
            </div>
            <div class="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
              <span class="text-xs text-gray-400 font-bold">지자체 스마트 가로등</span>
              <span class="block text-2xl font-black text-yellow-600 mt-1">{{ currentProperty.lampCount ?? 0 }} 개 배치</span>
            </div>
            <div class="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
              <span class="text-xs text-gray-400 font-bold">야간 안심 보안등</span>
              <span class="block text-2xl font-black text-orange-500 mt-1">{{ currentProperty.securityLightCount ?? 0 }} 개 작동</span>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-gray-200">
          <h3 class="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
            <span class="w-1.5 h-4 bg-blue-500 rounded-sm"></span>LumiRoom AI 지능형 안전 리포트
          </h3>

          <div v-if="!aiBriefing && !isBriefingLoading" class="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center shadow-sm">
            <p class="text-sm text-blue-900 font-semibold mb-4 leading-relaxed">
              매물 반경 1,000m 이내 수집된 공공 CCTV, 가로등, 안심보안등 및 치안안전시설 분포 데이터를 기반으로 지능형 종합 치안 리포트를 생성합니다.
            </p>
            <button 
              @click="loadAiBriefing" 
              class="w-full sm:w-auto mx-auto py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-black shadow-md transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              AI 안심 브리핑 분석서 생성
            </button>
          </div>

          <div v-else-if="isBriefingLoading" class="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-4 animate-pulse">
            <div class="flex justify-between items-center">
              <div class="h-5 bg-gray-300 rounded w-1/3"></div>
              <div class="h-8 bg-gray-300 rounded-full w-20"></div>
            </div>
            <div class="h-12 bg-gray-200 rounded w-full"></div>
            <div class="space-y-3">
              <div class="h-4 bg-gray-200 rounded w-5/6"></div>
              <div class="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
            <p class="text-sm text-center font-bold text-blue-500 animate-bounce mt-4">
              치안인프라 공간 데이터 수집 및 안심 리포트 작성 중...
            </p>
          </div>

          <div class="p-6 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600 font-bold text-center" v-else-if="briefingError">
            <p class="mb-3">⚠️ {{ briefingError }}</p>
            <button @click="loadAiBriefing" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">재시도</button>
          </div>

          <div class="bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border border-blue-200/80 rounded-3xl p-6 shadow-sm space-y-5" v-else-if="aiBriefing">
            <div class="flex justify-between items-center border-b border-blue-100 pb-4">
              <div class="flex flex-col">
                <span class="text-xs text-blue-500 font-black uppercase tracking-wider mb-1">LumiRoom Safety Report</span>
                <span class="text-lg font-black text-gray-900">종합 공간 치안 분석</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-3xl font-black text-blue-600">{{ aiBriefing.safetyScore }}점</span>
                <span
                  :class="getSafetyGradeClass(aiBriefing.safetyGrade)"
                  class="px-3 py-1.5 text-sm font-black rounded-lg border"
                >
                  등급 {{ aiBriefing.safetyGrade }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-blue-100/50 shadow-inner">
              <div class="text-center">
                <span class="text-xs text-gray-400 font-bold block">CCTV</span>
                <span class="text-lg font-black text-red-500">{{ aiBriefing.cctvCount }}대</span>
              </div>
              <div class="text-center">
                <span class="text-xs text-gray-400 font-bold block">가로등</span>
                <span class="text-lg font-black text-yellow-500">{{ aiBriefing.streetLightCount }}개</span>
              </div>
              <div class="text-center">
                <span class="text-xs text-gray-400 font-bold block">보안등</span>
                <span class="text-lg font-black text-orange-500">{{ aiBriefing.securityLightCount }}개</span>
              </div>
              <div class="text-center">
                <span class="text-xs text-gray-400 font-bold block">치안시설</span>
                <span class="text-lg font-black text-blue-500">{{ aiBriefing.policeStationCount }}개</span>
              </div>
            </div>

            <div class="bg-blue-500 text-white rounded-2xl p-4 shadow-md">
              <p class="text-sm font-bold leading-relaxed">
                📢 {{ aiBriefing.oneLineSummary }}
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-if="aiBriefing.positivePoints && aiBriefing.positivePoints.length > 0">
                <h4 class="text-sm font-extrabold text-emerald-700 flex items-center gap-1.5 mb-2">
                  <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>안심 안전 우수 요인
                </h4>
                <ul class="space-y-1.5 pl-1">
                  <li v-for="(point, idx) in aiBriefing.positivePoints" :key="'pos-'+idx" class="text-sm text-gray-700 font-semibold leading-relaxed flex items-start gap-1.5">
                    <span class="text-emerald-500 text-sm mt-0.5">✓</span>
                    <span>{{ point }}</span>
                  </li>
                </ul>
              </div>

              <div v-if="aiBriefing.warningPoints && aiBriefing.warningPoints.length > 0">
                <h4 class="text-sm font-extrabold text-red-600 flex items-center gap-1.5 mb-2">
                  <span class="w-1.5 h-1.5 bg-red-500 rounded-full"></span>야간 보행 주의 요인
                </h4>
                <ul class="space-y-1.5 pl-1">
                  <li v-for="(point, idx) in aiBriefing.warningPoints" :key="'warn-'+idx" class="text-sm text-gray-700 font-semibold leading-relaxed flex items-start gap-1.5">
                    <span class="text-red-500 text-sm mt-0.5">⚠</span>
                    <span>{{ point }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="bg-amber-50 border border-amber-100 rounded-2xl p-4 mt-2">
              <h5 class="text-sm font-extrabold text-yellow-800 mb-1.5 flex items-center gap-1">
                🌙 심야 시간대 안심 도보 조언
              </h5>
              <p class="text-sm text-gray-700 leading-relaxed font-semibold">
                {{ aiBriefing.nightWalkingAdvice }}
              </p>
            </div>

            <div class="text-sm text-gray-600 font-medium leading-relaxed bg-white border border-blue-50 p-4 rounded-2xl">
              <span class="font-black text-gray-800 block mb-1">🔍 정밀 안전 진단 총평:</span>
              {{ aiBriefing.totalReview }}
            </div>
          </div>
        </div>

        <div class="pt-2 border-t border-gray-200">
          <h3 class="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
            <span class="w-1.5 h-4 bg-brand-point rounded-sm"></span>실거주 체감 치안 리뷰
          </h3>

          <div class="flex items-center gap-3 mb-3 px-1">
            <span class="text-sm font-bold text-gray-600">별점 평가</span>
            <div class="flex gap-1">
              <button 
                v-for="star in 5" :key="'input-'+star"
                @click="newRating = star"
                class="text-2xl focus:outline-none hover:scale-110 transition-transform"
                :class="star <= newRating ? 'text-yellow-400 drop-shadow-[0_0_2px_rgba(250,204,21,0.5)]' : 'text-gray-200'"
              >
                ★
              </button>
            </div>
          </div>

          <div class="flex gap-2 mb-6">
            <input 
              v-model="newComment"
              @keyup.enter="submitComment"
              type="text" 
              placeholder="골목길 가로등 상태 등 체감 치안을 남겨보세요." 
              class="flex-grow p-4 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold outline-none focus:border-brand-point text-gray-900 placeholder-gray-400"
            />
            <button @click="submitComment" class="bg-yellow-400 hover:bg-yellow-500 text-black border-2 border-yellow-300 px-6 rounded-xl font-black text-sm shadow-md transition-colors whitespace-nowrap">
              등록
            </button>
          </div>

          <div class="space-y-3 max-h-80 overflow-y-auto pr-2">
            <div v-if="isReviewLoading" class="text-center py-10 text-gray-400 text-sm font-bold">
              리뷰를 불러오는 중입니다...
            </div>
            <template v-else>
              <div v-for="comment in comments" :key="comment.id" class="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm shadow-sm group">
                <div class="flex justify-between items-start mb-2">
                  <div class="flex flex-col gap-1">
                    <span class="text-gray-800 font-black">{{ comment.userName }}</span>
                    <div class="flex gap-0.5 mt-0.5">
                      <span 
                        v-for="star in 5" :key="'view-'+comment.id+'-'+star" 
                        class="text-sm" 
                        :class="star <= comment.rating ? 'text-yellow-400' : 'text-gray-200'"
                      >
                        ★
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 text-gray-400">
                    <span class="text-xs font-medium">{{ comment.createdAt?.substring(0, 10) }}</span>
                    
                    <button 
                      v-if="authStore.userProfile?.id === comment.userId"
                      @click="deleteComment(comment.id)"
                      class="text-red-500 hover:text-red-700 text-xs font-black transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <p class="text-gray-600 font-semibold leading-relaxed whitespace-pre-line mt-1">{{ comment.content }}</p>
              </div>
              
              <div v-if="comments.length === 0" class="text-center py-10 text-gray-400 text-sm font-bold bg-gray-50 rounded-xl border border-gray-100">
                등록된 체감 치안 리뷰가 없습니다. 첫 소통을 시작해 보세요!
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="w-full lg:w-[400px] xl:w-[450px] bg-brand-card border border-gray-700 rounded-3xl p-4 shadow-xl flex flex-col h-[450px] lg:h-auto lg:sticky lg:top-6">
        <h3 class="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-brand-point" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          매물 위치 및 주변 인프라 지도
        </h3>
        <div id="mini-map" class="w-full flex-grow bg-gray-950 rounded-2xl relative overflow-hidden"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { usePropertyStore } from '@/stores/properties'
import { useAuthStore } from '@/stores/auth'
import { fetchReviews, createPropertyReview, deletePropertyReview } from '@/api/reviews'
import { fetchAiBriefing } from '@/api/ai'
import { getSafetyGradeClass } from '@/utils/safetyGrade'

// 1. 분리 전담 모듈 api/favorites.js 기능 함수 일괄 바인딩 유도
import { fetchMyFavorites, addFavorite, deleteFavorite } from '@/api/favorites'

const route = useRoute()
const propertyStore = usePropertyStore()
const authStore = useAuthStore()

const targetId = parseInt(route.params.id)
const currentProperty = ref(
  propertyStore.propertiesList.find(p => p.id === targetId) || propertyStore.propertiesList[0]
)

// 2. 유저가 찜해놓은 관심매물 고유 Id 상태 배열 정의
const favoritePropertyIds = ref([])

// 3. 백엔드 관심 매물 목록 리스트 소환 및 보관 함수 연동
const loadUserFavorites = async () => {
  if (!authStore.isLoggedIn) return
  try {
    const favorites = await fetchMyFavorites()
    favoritePropertyIds.value = favorites.map(f => f.propertyId)
  } catch (error) {
    console.error('마이 리스트 관심 갱신 실패:', error)
  }
}

// 4. 관심등록 스왑 토글 액션 핸들러 빌드 (POST/DELETE 분기 통합 완결)
const toggleFavoriteStatus = async (propertyId) => {
  if (!authStore.isLoggedIn) {
    alert('로그인 후 관심 매물 기능을 이용하실 수 있습니다.')
    return
  }
  
  const isFavorited = favoritePropertyIds.value.includes(propertyId)
  try {
    if (isFavorited) {
      await deleteFavorite(propertyId)
      favoritePropertyIds.value = favoritePropertyIds.value.filter(id => id !== propertyId)
    } else {
      await addFavorite(propertyId)
      favoritePropertyIds.value.push(propertyId)
    }
  } catch (error) {
    console.error('상세화면 관심 매물 토글 오류:', error)
    alert('관심 매물 처리 도중 오류가 발생했습니다.')
  }
}

// ==========================================
// 리뷰 로직 통합
// ==========================================
const newComment = ref('')
const newRating = ref(5) 
const comments = ref([])
const isReviewLoading = ref(false)

const loadReviews = async (propertyId) => {
  if (!propertyId) return
  isReviewLoading.value = true
  try {
    comments.value = await fetchReviews(propertyId)
  } catch (error) {
    console.error('리뷰 목록 조회 실패:', error)
  } finally {
    isReviewLoading.value = false
  }
}

const submitComment = async () => {
  if (!newComment.value.trim()) return
  
  if (!authStore.isLoggedIn) {
    alert('로그인 후 이용할 수 있습니다.')
    return
  }

  const propertyId = currentProperty.value?.id
  if (!propertyId) return

  try {
    await createPropertyReview({
      propertyId: propertyId,
      content: newComment.value,
      rating: newRating.value 
    })
    newComment.value = '' 
    newRating.value = 5   
    await loadReviews(propertyId)
  } catch (error) {
    console.error('리뷰 등록 실패:', error)
    alert('리뷰 등록에 실패했습니다.')
  }
}

const deleteComment = async (reviewId) => {
  if (!confirm('이 리뷰를 삭제하시겠습니까?')) return
  
  try {
    await deletePropertyReview(reviewId)
    await loadReviews(currentProperty.value.id)
  } catch (error) {
    console.error('리뷰 삭제 실패:', error)
    alert('본인이 작성한 리뷰만 삭제할 수 있습니다.')
  }
}

// ==========================================
// 3. AI 브리핑 로직 통합
// ==========================================
const aiBriefing = ref(null)
const isBriefingLoading = ref(false)
const briefingError = ref(null)

const loadAiBriefing = async () => {
  const property = currentProperty.value
  if (!property || !property.lat || !property.lng) return

  isBriefingLoading.value = true
  briefingError.value = null
  
  try {
    const data = await fetchAiBriefing(property.lat, property.lng)
    aiBriefing.value = data
  } catch (error) {
    console.error('LumiRoom AI 안심 브리핑 연동 실패:', error)
    briefingError.value = '안심 안전 브리핑 분석서 추출 중 예외가 발생했습니다.'
  } finally {
    isBriefingLoading.value = false
  }
}

// ==========================================
// 포맷터 라벨용 헬퍼 함수 통합
// ==========================================
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

const formatBuiltYear = (property) => {
  const builtYear = property?.builtYear ?? property?.buildYear ?? property?.constructionYear
  return builtYear ? `${builtYear}년` : '정보 없음'
}

// ==========================================
// 4. 지도 및 생명주기 로직
// ==========================================
const initMiniMap = () => {
  if (window.kakao && window.kakao.maps && currentProperty.value) {
    window.kakao.maps.load(() => {
      const container = document.getElementById('mini-map')
      if (!container) return
      
      const lat = currentProperty.value.lat || 37.4812
      const lng = currentProperty.value.lng || 126.9296
      
      const options = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: 3
      }
      const map = new window.kakao.maps.Map(container, options)
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(lat, lng)
      })
      marker.setMap(map)
      map.relayout()
    })
  }
}

const loadPropertyData = () => {
  const tId = parseInt(route.params.id)
  currentProperty.value = propertyStore.propertiesList.find(p => p.id === tId) 
    || propertyStore.propertiesList[0]

  newComment.value = ''
  newRating.value = 5
  aiBriefing.value = null
  briefingError.value = null

  if (currentProperty.value && currentProperty.value.id) {
    loadReviews(currentProperty.value.id)
  } else {
    comments.value = []
  }
}

watch(() => route.params.id, async () => {
  loadPropertyData()
  await nextTick()
  initMiniMap()
  
  // 5. 패스 아이디 라우트 갱신 시 관심 배열 리로드 가이드
  loadUserFavorites()
})

onMounted(async () => {
  loadPropertyData() 
  await nextTick()
  initMiniMap()
  
  // 6. 마운트 수명 주기 발동 즉시 회원 관심 매물 동적 대조용 로드 기동
  loadUserFavorites()
})
</script>
