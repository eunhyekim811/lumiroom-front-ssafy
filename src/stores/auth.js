import { defineStore } from 'pinia';
import { ref } from 'vue';
import http from '@/utils/axios';

export const useAuthStore = defineStore('auth', () => {
  // 1. 상태(State) 초기화 - 기본값은 false 및 null로 안전하게 시작
  const isLoggedIn = ref(false);
  const userProfile = ref(null);

  // 2. JWT 토큰 해독 함수 (XSS 및 Null 데이터 철저 방어)
  const decodeToken = (token) => {
    // [관통의 핵심 패치]: 값이 아예 없거나, 문자열이 아니거나, JWT 규격(점 2개)이 아니면 split 자체를 시도 안 함!
    if (!token || typeof token !== 'string' || !token.includes('.')) {
      return null;
    }
    
    try {
      const parts = token.split('.');
      if (parts.length < 3) return null;

      const payload = parts[1];
      // 한글 닉네임 깨짐 방지를 위한 b64 안전 디코딩 디코딩
      const decodedPayload = JSON.parse(decodeURIComponent(atob(payload).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')));
      
      const fallbackName = decodedPayload.sub ? decodedPayload.sub.split('@')[0] : '사용자';
      
      return { 
        name: decodedPayload.nickname || fallbackName,
        role: decodedPayload.role 
      };
    } catch (error) {
      console.error('토큰 파싱 에러 발생:', error);
      return null;
    }
  };

  // 3. [관통의 안전화 구문]: 앱 구동 시 로컬 스토리지 데이터 검증 후 세션 복구
  try {
    const savedToken = localStorage.getItem('accessToken');
    if (savedToken) {
      const decoded = decodeToken(savedToken);
      if (decoded) {
        isLoggedIn.value = true;
        userProfile.value = decoded;
      } else {
        // 이상한 찌꺼기 데이터가 들어가 있으면 강제 청소
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
  } catch (e) {
    console.error('로컬 스토리지 초기화 실패:', e);
  }

  // 4. 회원가입 비즈니스 로직
  const signup = async (email, password, nickname) => {
    try {
      await http.post('/auth/signup', { email, password, nickname });
      return true;
    } catch (error) {
      throw error.response?.data || '회원가입에 실패했습니다.';
    }
  };

  // 5. 로그인 비즈니스 로직
  const login = async (email, password) => {
    try {
      const response = await http.post('/auth/login', { email, password });
      const { accessToken, refreshToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      isLoggedIn.value = true;
      userProfile.value = decodeToken(accessToken); 
      return true;
    } catch (error) {
      throw error.response?.data || '로그인에 실패했습니다.';
    }
  };

  // 6. 로그아웃 비즈니스 로직
  const logout = async () => {
    try {
      await http.post('/auth/logout');
    } catch (error) {
      console.error('서버 로그아웃 연동 실패:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      isLoggedIn.value = false;
      userProfile.value = null;
      window.location.href = '/';
    }
  };

  return { isLoggedIn, userProfile, signup, login, logout };
});