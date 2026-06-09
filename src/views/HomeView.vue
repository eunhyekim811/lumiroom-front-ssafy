<template>
  <div class="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-brand-bg px-4 text-center">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.08)_0%,transparent_70%)] pointer-events-none"></div>

    <span class="bg-brand-card text-brand-point border border-gray-700 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 shadow-md z-10">
      빅데이터 기반 안심 주거 플랫폼
    </span>
    <h1 class="text-5xl md:text-6xl font-black text-white mb-6 leading-tight z-10">
      어두운 귀갓길을 밝히는<br/> 가장 안전한 방, <span class="text-brand-point relative">LumiRoom</span>
    </h1>
    <p class="text-gray-300 text-base md:text-lg mb-10 max-w-2xl font-light z-10">
      스프링 배치를 통해 분석 가공된 실시간 가로등·CCTV·보안등 위치를 대조하여 당신의 동선 구조상 가장 안심할 수 있는 주거지를 찾아냅니다.
    </p>
    
    <div class="w-full max-w-2xl bg-brand-card border border-gray-700 p-2 rounded-2xl shadow-2xl flex items-center gap-3 focus-within:border-brand-point transition-colors z-10 glow-yellow">
      <input 
        v-model="infraStore.searchKeyword" 
        @keyup.enter="$router.push('/map')"
        type="text" 
        placeholder="지역, 지하철역, 대학교명을 입력하세요 (예: 신림역 원룸)" 
        class="flex-grow p-3 bg-transparent text-white placeholder-gray-500 focus:outline-none font-medium ml-2"
      />
      <router-link 
        to="/map" 
        class="bg-yellow-400 text-black border border-yellow-300 px-8 py-3 rounded-xl font-black shadow-[0_0_15px_rgba(250,204,21,0.4)]"
      >
        안전한 방 찾기
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useInfraStore } from '@/stores/infra'

const infraStore = useInfraStore()
</script>