<template>
  <div class="min-h-[calc(100vh-64px)] flex items-center justify-center bg-brand-bg px-4 text-gray-900 mt-16">
    <div class="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-2xl p-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-black text-gray-900">Lumi<span class="text-brand-point">Room</span> 가입</h2>
        <p class="text-gray-400 text-xs font-semibold mt-2">새로운 안전 인프라의 세계로 오세요</p>
      </div>
      
      <form class="space-y-5" @submit.prevent="handleSignupSubmit">
        <div>
          <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase">닉네임</label>
          <input v-model="nickname" type="text" class="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-point focus:border-brand-point outline-none transition" placeholder="홍길동" required />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase">이메일 계정</label>
          <input v-model="email" type="email" class="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-point focus:border-brand-point outline-none transition" placeholder="example@lumiroom.com" required />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase">비밀번호</label>
          <input v-model="password" type="password" class="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-point focus:border-brand-point outline-none transition" placeholder="••••••••" required />
        </div>
        
        <p v-if="errorMessage" class="text-red-500 text-sm font-bold text-center animate-pulse">
          {{ errorMessage }}
        </p>

        <button type="submit" class="w-full bg-yellow-400 text-black border-2 border-yellow-300 font-black py-3.5 px-4 rounded-xl transition shadow-[0_0_15px_rgba(250,204,21,0.4)] transform active:scale-95 mt-4">
          계정 생성하기
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const nickname = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('') // 💡 화면에 띄울 에러 메시지 보관함

const authStore = useAuthStore()
const router = useRouter()

const handleSignupSubmit = async () => {
  // 1. 시도할 때마다 기존 에러 메시지 싹 지워주기
  errorMessage.value = ''

  // 2. 프론트엔드 자체 검열 (서버로 불필요한 쓰레기 데이터가 날아가는 것을 방지)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errorMessage.value = "유효한 이메일 주소 형식이 아닙니다."
    return // 여기서 차단! 서버로 안 넘어감
  }

  if (password.value.length < 8) {
    errorMessage.value = "비밀번호는 최소 8자 이상이어야 합니다."
    return // 여기서 차단!
  }

  // 3. 백엔드로 통신 시작
  try {
    await authStore.signup(email.value, password.value, nickname.value)
    
    // 성공 시에만 alert 띄우고 로그인으로 이동
    alert('회원가입이 완료되었습니다! 로그인해 주세요.')
    router.push('/login')
  } catch (error) {
    errorMessage.value = error
  }
}
</script>