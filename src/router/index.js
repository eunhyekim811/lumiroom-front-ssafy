import { createRouter, createWebHistory } from 'vue-router'

// [핵심 해결] Pinia 인증 스토어를 가져오는 코드를 맨 위에 반드시 선언합니다.
import { useAuthStore } from '@/stores/auth'

// 라우트(화면 경로) 정의
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // 메인 홈 화면 (프로젝트에 HomeView.vue가 있다면 연결, 없다면 환경에 맞게 수정하세요)
      component: () => import('@/views/HomeView.vue') 
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/SignupView.vue')
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('@/views/SafetyMapView.vue'),
      // meta.requiresAuth = true: 이 페이지는 로그인한 사람만 볼 수 있다는 표식
      meta: { requiresAuth: true } 
    },
    {
      path: '/properties',
      name: 'properties',
      component: () => import('@/views/PropertiesView.vue'), 
      meta: { requiresAuth: true } 
    },
    {
      path: '/properties/:id',
      name: 'property-detail',
      component: () => import('@/views/PropertyDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: () => import('@/views/MyPageView.vue'),
      meta: { requiresAuth: true } 
    }
  ]
})

// 전역 네비게이션 가드 (화면을 이동하기 직전에 항상 실행되는 검문소)
router.beforeEach(async (to, from, next) => {
  // 스토어는 반드시 라우터 가드(beforeEach) "내부"에서 선언해야 에러가 나지 않습니다.
  const authStore = useAuthStore()

  // 가고자 하는 목적지(to)가 로그인을 요구하는데, 현재 로그인 상태가 아니라면?
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    alert('로그인이 필요한 서비스입니다.')
    next('/login') // 목적지로 안 보내고 로그인 페이지로 강제 연행
  } else {
    if (authStore.isLoggedIn && !authStore.userProfile?.name) {
      try {
        // 💡 중요: 라우팅 완료(next) 전에 유저 데이터를 무조건 확보하므로 상단바 유저명이 절대 사라지지 않습니다!
        await authStore.fetchMyProfile() 
      } catch (error) {
        console.error('라우터 검문소 내 프로필 선제 수신 실패:', error)
      }
    }
    next()
  }
})

export default router