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

const authStore = useAuthStore()
const router = useRouter()

const handleLoginSubmit = async () => {
  if (!email.value.trim() || !password.value.trim()) {
    alert('이메일과 비밀번호를 모두 입력해 주세요.')
    return
  }
  
  try {
    // 스토어의 실제 비즈니스 로직 호출 (이메일과 비밀번호 전달)
    await authStore.login(email.value, password.value)
    
    // 로그인 성공 시 안전 지도로 리다이렉트
    router.push('/map')
  } catch (error) {
    alert(error) // 백엔드에서 보낸 에러 메시지(예: 비밀번호 불일치) 출력
  }
}
</script>