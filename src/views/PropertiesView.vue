<template>
  <div class="max-w-7xl mx-auto px-6 py-10 bg-brand-bg min-h-screen">
    <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-700 pb-6">
      <div>
        <h1 class="text-3xl font-black text-white">지역별 안심 매물 찾기</h1>
        <p class="text-sm text-gray-400 mt-1 font-medium leading-relaxed">지역별 종합 인프라 안전도 스코어 등급이 결합된 공식 리스트입니다.</p>
      </div>
      
      <div class="flex gap-2">
        <select class="bg-brand-card border border-gray-700 text-gray-100 px-4 py-2 rounded-xl text-sm font-bold focus:outline-none focus:border-brand-point">
          <option>서울 관악구 신림동</option>
        </select>
        <select class="bg-brand-card border border-gray-700 text-brand-point px-4 py-2 rounded-xl text-sm font-bold focus:outline-none focus:border-brand-point">
          <option>안전지수 높은 순</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="item in mockProperties" :key="item.id"
        @click="navigateToDetail(item.id)"
        class="bg-white border border-gray-200 hover:border-brand-point rounded-2xl p-5 cursor-pointer transition-all duration-300 group shadow-sm hover:glow-yellow"
      >
        <div class="h-48 bg-gray-100 rounded-xl mb-4 relative overflow-hidden">
          <div class="absolute top-3 left-3 bg-yellow-100 border border-amber-200 backdrop-blur text-xs font-black text-brand-point px-3 py-1 rounded-lg shadow-sm">
            안전 종합지수 {{ item.score }}점
          </div>
        </div>

        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-2xl font-black text-gray-900 group-hover:text-brand-point transition-colors leading-tight">{{ item.type }} {{ item.price }}</h3>
            <p class="text-sm text-gray-400 mt-1 font-medium leading-relaxed">{{ item.address }}</p>
          </div>
          <div class="text-right">
            <span class="inline-block text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded-lg">
              안전 {{ item.grade }}등급
            </span>
          </div>
        </div>

        <div class="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-400">
          <span>CCTV {{ item.cctvCount }}대</span>
          <span>보안등 {{ item.lampCount }}개</span>
          <span class="text-brand-point">안심 귀가선 내 존재</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const mockProperties = [
  { id: 1, type: '원룸 월세', price: '1000 / 55', address: '관악구 신림동 1432-1', score: 98, grade: 1, cctvCount: 4, lampCount: 6 },
  { id: 2, type: '투룸 전세', price: '1억 8000', address: '관악구 신림동 412-5', score: 85, grade: 2, cctvCount: 2, lampCount: 4 },
  { id: 3, type: '오피스텔 월세', price: '2000 / 70', address: '관악구 신림동 92-11', score: 92, grade: 1, cctvCount: 5, lampCount: 3 }
]
const navigateToDetail = (id) => { router.push(`/properties/${id}`) }
</script>