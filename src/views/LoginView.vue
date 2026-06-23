<template>
  <div class="min-h-[calc(100vh-64px)] flex items-center justify-center bg-brand-bg px-4 text-gray-900">
    <div class="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-2xl p-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-black text-gray-900">Lumi<span class="text-brand-point">Room</span> 로그인</h2>
        <p class="text-gray-400 text-xs font-semibold mt-2">빛나는 안전을 확보하기 위한 첫걸음</p>
      </div>
      
      <form class="space-y-5" @submit.prevent="handleLoginSubmit">
        <div>
          <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">이메일 계정</label>
          <input 
            v-model="email" 
            type="email" 
            class="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-point focus:border-brand-point text-gray-900 outline-none transition placeholder-gray-400" 
            placeholder="example@lumiroom.com"
            required
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">비밀번호</label>
          <input 
            v-model="password" 
            type="password" 
            class="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-point focus:border-brand-point text-gray-900 outline-none transition placeholder-gray-400" 
            placeholder="••••••••"
            required
          />
        </div>
        
        <p v-if="errorMessage" class="text-red-500 text-sm font-bold text-center animate-pulse">
          {{ errorMessage }}
        </p>

        <button 
          type="submit" 
          class="w-full bg-yellow-400 text-black border-2 border-yellow-300 font-black py-3.5 px-4 rounded-xl transition shadow-[0_0_15px_rgba(250,204,21,0.4)] transform active:scale-95 mt-4 block text-center"
        >
          인증 및 주거 탐색 시작
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-500">
        계정이 없으신가요?
        <router-link to="/signup" class="text-brand-point font-black hover:underline ml-1">
          무료 회원가입
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const errorMessage = ref('') // 💡 화면에 띄울 에러 메시지 보관함

const authStore = useAuthStore()
const router = useRouter()

const handleLoginSubmit = async () => {
  // 1. 버튼 누를 때마다 기존 에러 초기화
  errorMessage.value = ''

  // 2. 프론트엔드 자체 검열 (서버로 불필요한 요청 방지)
  if (!email.value.trim() || !password.value.trim()) {
    errorMessage.value = '이메일과 비밀번호를 모두 입력해 주세요.'
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errorMessage.value = '유효한 이메일 형식이 아닙니다.'
    return
  }
  
  // 3. 백엔드로 통신 시작
  try {
    // 스토어의 실제 비즈니스 로직 호출
    await authStore.login(email.value, password.value)
    
    // 로그인 성공 시 안전 지도로 리다이렉트 (로그인 성공 시에는 alert 생략하거나 우측 하단 토스트 알림을 쓰는 것이 요즘 트렌드입니다!)
    router.push('/map')
  } catch (error) {
    // 🚨 백엔드에서 보낸 에러 메시지("비밀번호가 일치하지 않습니다." 등)를 화면에 붉은 글씨로 렌더링
    errorMessage.value = error 
  }
}
</script>