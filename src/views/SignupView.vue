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

const authStore = useAuthStore()
const router = useRouter()

const handleSignupSubmit = async () => {
  try {
    await authStore.signup(email.value, password.value, nickname.value)
    alert('회원가입이 완료되었습니다! 로그인해 주세요.')
    router.push('/login')
  } catch (error) {
    alert(error)
  }
}
</script>