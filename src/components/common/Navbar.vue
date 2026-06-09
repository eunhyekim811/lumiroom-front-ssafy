<template>
  <nav class="fixed top-0 left-0 w-full h-16 bg-gray-950/90 backdrop-blur border-b border-gray-800 z-50 flex items-center justify-between px-6">
    <router-link to="/" class="flex items-center gap-2">
      <svg class="w-7 h-7 text-brand-point drop-shadow-[0_0_5px_rgba(250,204,21,0.4)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.32031 11.6835C3.32031 16.6541 7.34975 20.6835 12.3203 20.6835C16.1075 20.6835 19.3483 18.3443 20.6768 15.032C19.6467 15.6631 18.4262 16.0335 17.1203 16.0335C13.2543 16.0335 10.1203 12.8995 10.1203 9.03351C10.1203 7.03126 10.9576 5.22388 12.3023 3.93121C11.6669 3.53507 10.9202 3.30351 10.1203 3.30351C6.36497 3.30351 3.32031 6.34817 3.32031 10.1035V11.6835Z" fill="currentColor"/>
      </svg>
      <span class="text-2xl font-black text-white tracking-tight">Lumi<span class="text-brand-point">Room</span></span>
    </router-link>

    <div class="hidden md:flex space-x-8">
      <router-link to="/map" class="font-semibold transition-colors" :class="$route.path === '/map' ? 'text-brand-point' : 'text-gray-300 hover:text-white'">지도</router-link>
      <router-link to="/properties" class="font-semibold transition-colors" :class="$route.path.startsWith('/properties') && $route.path !== '/map' ? 'text-brand-point' : 'text-gray-300 hover:text-white'">매물 찾기</router-link>
    </div>

    <div class="flex items-center space-x-4">
      <template v-if="authStore.isLoggedIn">
        <span class="text-sm font-bold text-gray-300">
          <span class="text-brand-point font-black">{{ authStore.userProfile?.name }}</span>님 환영합니다
        </span>
        <button @click="authStore.logout()" class="text-xs bg-gray-800 text-gray-300 border border-gray-700 px-3 py-1.5 rounded-lg font-bold hover:text-white transition-colors">
          로그아웃
        </button>
      </template>
      <template v-else>
        <router-link to="/login" class="text-gray-300 hover:text-white font-medium transition-colors">로그인</router-link>
        <router-link to="/signup" class="bg-yellow-400 text-black border-2 border-yellow-300 px-5 py-2.5 rounded-xl font-black shadow-[0_0_15px_rgba(250,204,21,0.5)] transition-all transform active:scale-95 z-50 block">
          회원가입
        </router-link>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>