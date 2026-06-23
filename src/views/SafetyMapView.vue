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
            class="bg-gray-50 border border-gray-200 hover:border-brand-point rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-sm group hover:shadow-md relative"
          >
            <button 
              @click.stop="toggleFavoriteStatus(item.id)"
              class="absolute top-6 right-6 z-30 p-2 rounded-full bg-white/95 shadow-md border border-gray-150 text-gray-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all"
              title="관심 매물 토글"
            >
              <svg class="w-4 h-4" :class="{'text-red-500 fill-current': favoritePropertyIds.includes(item.id)}" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>

            <div class="w-full h-44 bg-gray-200 rounded-lg mb-3 relative overflow-hidden">
              <img :src="getPropertyImage(item.type)" :alt="`${item.type} 매물 이미지`" class="w-full h-full object-cover">
              <div v-if="item.score != null" class="absolute top-2 left-2 px-2 py-1 rounded bg-white/90 border border-gray-200 text-[10px] font-bold text-brand-point">
                ★ 안전도 {{ item.score }}점
              </div>
            </div>
            <div class="flex items-start justify-between">
              <div class="min-w-0 pr-3">
                <h3 class="font-extrabold text-lg text-gray-900 group-hover:text-brand-point transition-colors truncate">{{ item.title }}</h3>
                <p class="text-sm font-black text-gray-700 mt-1">{{ item.type }} · {{ item.price }}</p>
                <p class="text-xs text-gray-400 font-medium mt-0.5 leading-relaxed truncate">{{ item.address }}</p>
              </div>
              <span
                v-if="item.grade"
                :class="getSafetyGradeClass(item.grade)"
                class="text-xs px-2 py-1 rounded font-bold border whitespace-nowrap"
              >
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
              <span
                v-if="propertyStore.selectedProperty.grade"
                :class="getSafetyGradeClass(propertyStore.selectedProperty.grade)"
                class="text-xs border px-3 py-1 rounded-lg font-black tracking-wide shadow-sm"
              >
                LumiRoom 안심 {{ propertyStore.selectedProperty.grade }}등급
              </span>
              
              <div class="flex justify-between items-start gap-4">
                <h1 class="text-2xl font-black text-gray-900 mt-3 leading-tight flex-grow">
                  {{ propertyStore.selectedProperty.title }}
                </h1>
                
                <button 
                  @click="toggleFavoriteStatus(propertyStore.selectedProperty.id)"
                  class="mt-3 p-2 rounded-xl border flex items-center justify-center gap-1.5 font-black text-xs transition-all active:scale-95 shadow-sm whitespace-nowrap"
                  :class="favoritePropertyIds.includes(propertyStore.selectedProperty.id) 
                    ? 'bg-red-50 border-red-200 text-red-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-900'"
                >
                  <svg class="w-4 h-4" :class="{'fill-current': favoritePropertyIds.includes(propertyStore.selectedProperty.id)}" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  {{ favoritePropertyIds.includes(propertyStore.selectedProperty.id) ? '찜 해제' : '관심 등록' }}
                </button>
              </div>

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
                <tr>
                  <td class="p-2.5 bg-gray-50 font-bold text-gray-500">건축연도</td>
                  <td class="p-2.5 text-gray-700">{{ formatBuiltYear(propertyStore.selectedProperty) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="pt-4 border-t border-gray-200">
            <h3 class="text-sm font-extrabold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-1.5 h-3 bg-blue-500 rounded-sm"></span>LumiRoom AI 지능형 안전 리포트
            </h3>

            <div v-if="!aiBriefing && !isBriefingLoading" class="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center shadow-sm">
              <p class="text-xs text-blue-900 font-semibold mb-3 leading-relaxed">
                매물 반경 1,000m 이내 수집된 공공 CCTV, 가로등, 안심보안등 및 치안안전시설 분포 데이터를 기반으로 지능형 종합 치안 리포트를 생성합니다.
              </p>
              <button 
                @click="loadAiBriefing" 
                class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md transition transform active:scale-95 flex items-center justify-center gap-2"
              >
                AI 안심 브리핑 분석서 생성
              </button>
            </div>

            <div v-else-if="isBriefingLoading" class="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4 animate-pulse">
              <div class="flex justify-between items-center">
                <div class="h-4 bg-gray-300 rounded w-1/3"></div>
                <div class="h-6 bg-gray-300 rounded-full w-16"></div>
              </div>
              <div class="h-10 bg-gray-200 rounded w-full"></div>
              <div class="space-y-2">
                <div class="h-3 bg-gray-200 rounded w-5/6"></div>
                <div class="h-3 bg-gray-200 rounded w-4/5"></div>
              </div>
              <p class="text-[11px] text-center font-bold text-blue-500 animate-bounce">
                치안인프라 공간 데이터 수집 및 안심 리포트 작성 중...
              </p>
            </div>

            <div v-else-if="briefingError" class="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-bold">
              <p class="mb-2">⚠️ {{ briefingError }}</p>
              <button @click="loadAiBriefing" class="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">재시도</button>
            </div>

            <div v-else-if="aiBriefing" class="bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border border-blue-200/80 rounded-2xl p-5 shadow-sm space-y-4">
              <div class="flex justify-between items-center border-b border-blue-100 pb-3">
                <div class="flex flex-col">
                  <span class="text-[10px] text-blue-500 font-black uppercase tracking-wider">LumiRoom Safety Report</span>
                  <span class="text-sm font-black text-gray-900">종합 공간 치안 분석</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-2xl font-black text-blue-600">{{ aiBriefing.safetyScore }}점</span>
                  <span
                    :class="getSafetyGradeClass(aiBriefing.safetyGrade)"
                    class="px-2.5 py-1 text-xs font-black rounded-lg border"
                  >
                    등급 {{ aiBriefing.safetyGrade }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-4 gap-1.5 bg-white p-3 rounded-xl border border-blue-100/50 shadow-inner">
                <div class="text-center">
                  <span class="text-[9px] text-gray-400 font-bold block">CCTV</span>
                  <span class="text-xs font-black text-red-500">{{ aiBriefing.cctvCount }}대</span>
                </div>
                <div class="text-center">
                  <span class="text-[9px] text-gray-400 font-bold block">가로등</span>
                  <span class="text-xs font-black text-yellow-500">{{ aiBriefing.streetLightCount }}개</span>
                </div>
                <div class="text-center">
                  <span class="text-[9px] text-gray-400 font-bold block">보안등</span>
                  <span class="text-xs font-black text-orange-500">{{ aiBriefing.securityLightCount }}개</span>
                </div>
                <div class="text-center">
                  <span class="text-[9px] text-gray-400 font-bold block">치안시설</span>
                  <span class="text-xs font-black text-blue-500">{{ aiBriefing.policeStationCount }}개</span>
                </div>
              </div>

              <div class="bg-blue-500 text-white rounded-xl p-3 shadow-md relative">
                <p class="text-xs font-bold leading-relaxed">
                  📢 {{ aiBriefing.oneLineSummary }}
                </p>
              </div>

              <div v-if="aiBriefing.positivePoints && aiBriefing.positivePoints.length > 0">
                <h4 class="text-xs font-extrabold text-emerald-700 flex items-center gap-1.5 mb-1.5">
                  <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>안심 안전 우수 요인
                </h4>
                <ul class="space-y-1 pl-1">
                  <li 
                    v-for="(point, idx) in aiBriefing.positivePoints" :key="'pos-'+idx"
                    class="text-xs text-gray-700 font-semibold leading-relaxed flex items-start gap-1.5"
                  >
                    <span class="text-emerald-500 text-xs">✓</span>
                    <span>{{ point }}</span>
                  </li>
                </ul>
              </div>

              <div v-if="aiBriefing.warningPoints && aiBriefing.warningPoints.length > 0">
                <h4 class="text-xs font-extrabold text-red-600 flex items-center gap-1.5 mb-1.5">
                  <span class="w-1.5 h-1.5 bg-red-500 rounded-full"></span>야간 보행 주의 요인
                </h4>
                <ul class="space-y-1 pl-1">
                  <li 
                    v-for="(point, idx) in aiBriefing.warningPoints" :key="'warn-'+idx"
                    class="text-xs text-gray-700 font-semibold leading-relaxed flex items-start gap-1.5"
                  >
                    <span class="text-red-500 text-xs">⚠</span>
                    <span>{{ point }}</span>
                  </li>
                </ul>
              </div>

              <div class="bg-amber-50 border border-amber-100 rounded-xl p-3">
                <h5 class="text-xs font-extrabold text-yellow-800 mb-1 flex items-center gap-1">
                  🌙 심야 시간대 안심 도보 조언
                </h5>
                <p class="text-xs text-gray-600 leading-relaxed font-semibold">
                  {{ aiBriefing.nightWalkingAdvice }}
                </p>
              </div>

              <div class="text-nav-bg text-xs font-medium leading-relaxed bg-white border border-blue-50 p-3 rounded-xl">
                <span class="font-black text-gray-700 block mb-1">🔍 정밀 안전 진단 총평:</span>
                {{ aiBriefing.totalReview }}
              </div>
            </div>
          </div>

          <div class="pt-2 border-t border-gray-200">
            <h3 class="text-sm font-extrabold text-gray-900 mb-3 flex items-center gap-2">
              <span class="w-1.5 h-3 bg-brand-point rounded-sm"></span>실거주 체감 치안 리뷰
            </h3>

            <div class="flex items-center gap-2 mb-2 px-1">
              <span class="text-xs font-bold text-gray-600">별점 평가</span>
              <div class="flex gap-1">
                <button 
                  v-for="star in 5" :key="'input-'+star"
                  @click="newRating = star"
                  class="text-xl focus:outline-none hover:scale-110 transition-transform"
                  :class="star <= newRating ? 'text-yellow-400 drop-shadow-[0_0_2px_rgba(250,204,21,0.5)]' : 'text-gray-200'"
                >
                  ★
                </button>
              </div>
            </div>

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
              <div v-if="isReviewLoading" class="text-center py-6 text-gray-400 text-xs font-bold">
                리뷰를 불러오는 중입니다...
              </div>
              <template v-else>
                <div v-for="comment in comments" :key="comment.id" class="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs shadow-sm group">
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex flex-col gap-0.5">
                      <span class="text-gray-800 font-black">{{ comment.userName }}</span>
                      <div class="flex gap-0.5 mt-0.5">
                        <span 
                          v-for="star in 5" :key="'view-'+comment.id+'-'+star" 
                          class="text-[12px]" 
                          :class="star <= comment.rating ? 'text-yellow-400' : 'text-gray-200'"
                        >
                          ★
                        </span>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 text-gray-400">
                      <span class="text-[10px] font-medium">{{ comment.createdAt?.substring(0, 10) }}</span>
                      <button 
                        v-if="authStore.userProfile?.id === comment.userId"
                        @click="deleteComment(comment.id)"
                        class="text-red-500 hover:text-red-700 text-[10px] font-black transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <p class="text-gray-600 font-semibold leading-relaxed whitespace-pre-line">{{ comment.content }}</p>
                </div>
                <div v-if="comments.length === 0" class="text-center py-6 text-gray-400 text-xs font-bold">
                  등록된 체감 치안 리뷰가 없습니다. 첫 소통을 시작해 보세요!
                </div>
              </template>
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
import { useAuthStore } from '@/stores/auth' 
import { fetchReviews, createPropertyReview, deletePropertyReview } from '@/api/reviews'
import { fetchAiBriefing } from '@/api/ai'
import { fetchMyFavorites, addFavorite, deleteFavorite } from '@/api/favorites'
import { getSafetyGradeClass } from '@/utils/safetyGrade'

const infraStore = useInfraStore()
const propertyStore = usePropertyStore()
const authStore = useAuthStore()

let mapInstance = null
let debounceTimer = null
const infraMarkerEntries = []
const propertyMarkerEntries = []
let activeInfraInfoWindow = null

const favoritePropertyIds = ref([])

const loadUserFavoritesFeed = async () => {
  if (!authStore.isLoggedIn) return
  try {
    const favorites = await fetchMyFavorites()
    favoritePropertyIds.value = favorites.map(f => f.propertyId)
  } catch (error) {
    console.error('관심 매물 상태를 갱신하지 못했습니다.', error)
  }
}

const toggleFavoriteStatus = async (propertyId) => {
  if (!authStore.isLoggedIn) {
    alert('로그인 후 관심 매물 기능을 사용하실 수 있습니다.')
    return
  }

  const isAlreadyFavorited = favoritePropertyIds.value.includes(propertyId)

  try {
    if (isAlreadyFavorited) {
      await deleteFavorite(propertyId)
      favoritePropertyIds.value = favoritePropertyIds.value.filter(id => id !== propertyId)
    } else {
      await addFavorite(propertyId)
      favoritePropertyIds.value.push(propertyId)
    }
  } catch (error) {
    console.error('관심 매물 처리 도중 에러 크래시:', error)
    alert('관심 매물 처리 도중 오류가 발생했습니다.')
  }
}

const getPropertyImage = (type) => {
  const images = {
    오피스텔: '/images/officetel.jpg',
    연립다세대: '/images/multi-family-house.jpg',
    단독다가구: '/images/house.jpg'
  }
  return images[type] || '/images/default.jpg'
}

const selectedFilterCount = computed(() => {
  return Object.values(infraStore.filters).filter(Boolean).length
})

// ==========================================
// 리뷰 로직
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

  const propertyId = propertyStore.selectedProperty?.id
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
    await loadReviews(propertyStore.selectedProperty.id)
  } catch (error) {
    console.error('리뷰 삭제 실패:', error)
    alert('본인이 작성한 리뷰만 삭제할 수 있습니다.')
  }
}

// ==========================================
// AI 브리핑 로직
// ==========================================
const aiBriefing = ref(null)
const isBriefingLoading = ref(false)
const briefingError = ref(null)

const loadAiBriefing = async () => {
  const property = propertyStore.selectedProperty
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

watch(
  () => propertyStore.selectedProperty,
  (newProperty) => {
    newComment.value = '' 
    newRating.value = 5   
    
    aiBriefing.value = null 
    briefingError.value = null
    
    if (newProperty && newProperty.id) {
      loadReviews(newProperty.id)
    } else {
      comments.value = []
    }
  }
)

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

const formatBuiltYear = (property) => {
  const builtYear = property?.builtYear ?? property?.buildYear ?? property?.constructionYear
  return builtYear ? `${builtYear}년` : '정보 없음'
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
  propertyStore.clearSelection();

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
      
      loadUserFavoritesFeed()
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
  propertyStore.clearSelection() 
})
</script>
