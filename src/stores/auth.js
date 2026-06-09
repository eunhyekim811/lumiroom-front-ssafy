import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const userProfile = ref(null)

  // Actions: 로그인 처리 프로세스
  const login = (email) => {
    isLoggedIn.value = true
    userProfile.value = {
      email: email,
      name: '홍길동',
      role: 'USER'
    }
  }

  // Actions: 로그아웃 처리 및 리셋
  const logout = () => {
    isLoggedIn.value = false
    userProfile.value = null
  }

  return {
    isLoggedIn,
    userProfile,
    login,
    logout
  }
})