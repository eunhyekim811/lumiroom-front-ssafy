import { defineStore } from 'pinia';
import { ref } from 'vue';
import http from '@/utils/axios'; // 인터셉터가 적용된 일반 API용 (자동 갱신용)
import axios from 'axios';        // 인터셉터를 우회하기 위한 순수 axios (로그아웃용)

export const useAuthStore = defineStore('auth', () => {
  // 1. 상태(State) 초기화
  const isLoggedIn = ref(false);
  const userProfile = ref(null);

  // JWT 토큰 만료 여부를 프론트엔드에서 자체 판별하는 함수
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // payload.exp는 초(sec) 단위이므로 1000을 곱해 밀리초 단위의 현재 시간과 비교
      return (payload.exp * 1000) < Date.now();
    } catch (e) {
      return true;
    }
  };

  // 2. JWT 토큰 해독 함수 (XSS 및 Null 방어)
  const decodeToken = (token) => {
    if (!token || typeof token !== 'string' || !token.includes('.')) {
      return null;
    }
    
    try {
      const parts = token.split('.');
      if (parts.length < 3) return null;

      const payload = parts[1];
      const decodedPayload = JSON.parse(decodeURIComponent(atob(payload).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')));
      
      // const fallbackName = decodedPayload.sub ? decodedPayload.sub.split('@')[0] : '사용자';
      
      return { 
        email: decodedPayload.sub, 
        role: decodedPayload.role 
      };
    } catch (error) {
      console.error('토큰 파싱 에러 발생:', error);
      return null;
    }
  };

  // 공통 세션 초기화 함수 (중복 제거)
  const clearSession = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    isLoggedIn.value = false;
    userProfile.value = null;
  };

  // 3. 앱 구동 시 세션 검증 및 자동 갱신
  const restoreSession = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    // // Access Token 만료 전 -> 즉시 세션 복구
    // if (accessToken && !isTokenExpired(accessToken)) {
    //   const decoded = decodeToken(accessToken);
    //   if (decoded) {
    //     isLoggedIn.value = true;
    //     // userProfile.value = decoded;
    //     userProfile.value = { email: decoded.email, role: decoded.role, name: '' };
    //   } else {
    //     clearSession();
    //   }
    // } 
    // // ② Access Token 만료 -> 즉시 갱신 시도!
    // else if (refreshToken) {
    //   try {
    //     // 인터셉터 무한 루프를 피하기 위해 순수 axios로 백엔드 갱신 요청
    //     const response = await axios.post('http://localhost:8080/api/auth/refresh', {}, {
    //       headers: { 'RefreshToken': refreshToken }
    //     });

    //     // 갱신 성공 시 새 토큰 장착
    //     const newAccessToken = response.data.accessToken;
    //     const newRefreshToken = response.data.refreshToken;

    //     localStorage.setItem('accessToken', newAccessToken);
    //     localStorage.setItem('refreshToken', newRefreshToken);

    //     isLoggedIn.value = true;
    //     // userProfile.value = decodeToken(newAccessToken);
    //     const decoded = decodeToken(newAccessToken);
    //     userProfile.value = { email: decoded.email, role: decoded.role, name: '' };
    //   } catch (error) {
    //     // 백엔드에서 거절(RT 만료 등) 시에만 지갑(스토리지) 완전히 비우기
    //     console.error('세션 갱신 실패 (리프레시 토큰 만료됨):', error);
    //     clearSession();
    //   }
    // }

    // 지갑(Storage)에 토큰 쌍이 존재한다면, 만료 여부와 상관없이 일단 세션을 복구합니다.
    if (accessToken && refreshToken) {
      const decoded = decodeToken(accessToken);
      if (decoded) {
        isLoggedIn.value = true;
        // name을 빈 문자열('')로 세팅하여, 라우터(Router)가 이를 보고 fetchMyProfile을 호출하도록 유도합니다.
        userProfile.value = { email: decoded.email, role: decoded.role, name: '' };
      } else {
        clearSession();
      }
    } else {
      clearSession(); // 토큰이 하나라도 없으면 아예 초기화
    }
  };

  // 스토어가 생성될 때 즉시 복구/갱신 시나리오 실행
  restoreSession();

  // 4. 회원가입
  const signup = async (email, password, nickname) => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    try {
      // await http.post('/auth/signup', { email, password, nickname });
      await axios.post('http://localhost:8080/api/auth/signup', { email, password, nickname });
      return true;
    } catch (error) {
      throw error.response?.data || '회원가입에 실패했습니다.';
    }
  };

  // 5. 로그인
  const login = async (email, password) => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    try {
      // const response = await http.post('/auth/login', { email, password });
      const response = await axios.post('http://localhost:8080/api/auth/login', { email, password });
      const { accessToken, refreshToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      isLoggedIn.value = true;
      // userProfile.value = decodeToken(accessToken); 
      await fetchMyProfile();
      return true;
    } catch (error) {
      throw error.response?.data || '로그인에 실패했습니다.';
    }
  };

  // 6. 로그아웃
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const accessToken = localStorage.getItem('accessToken');
      
      const headers = {};
      
      // Access Token이 있고 만료 전 -> 백엔드 블랙리스트 등재용으로 보냄
      if (accessToken && !isTokenExpired(accessToken)) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      // ② Refresh Token은 무조건 보냄 -> 백엔드 Redis에서 원천 파기용
      if (refreshToken) {
        headers['RefreshToken'] = refreshToken;
      }

      // 전송할 토큰이 하나라도 있다면 '순수 axios'로 전송하여 인터셉터(자동 갱신)를 회피!
      if (Object.keys(headers).length > 0) {
        await axios.post('http://localhost:8080/api/auth/logout', {}, { headers });
      }
    } catch (error) {
      console.error('서버 로그아웃 처리 중 예외 (이미 파기되었을 수 있음)', error);
    } finally {
      // API 성공/실패 여부와 관계없이 브라우저 데이터는 완벽히 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      isLoggedIn.value = false;
      userProfile.value = null;
      window.location.href = '/login';
    }
  };

  // 내 프로필 상세 정보 조회 API 연동
  const fetchMyProfile = async () => {
    try {
      // 자동 갱신 인터셉터가 적용된 http 객체를 사용하여 안전하게 호출!
      const response = await http.get('/users/me');
      
      // 유저의 전체 정보(id, email, nickname 등)를 상태에 장착
      userProfile.value = response.data;
      return response.data;
    } catch (error) {
      console.error('내 프로필 로드 실패:', error);
      throw error;
    }
  };

  return { isLoggedIn, userProfile, signup, login, logout, fetchMyProfile };
});