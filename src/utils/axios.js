import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:8080/api', // 백엔드 서버 주소 (환경에 맞게 수정)
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. 요청(Request) 인터셉터: API를 쏘기 전에 토큰을 가로채서 넣음
http.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. 응답(Response) 인터셉터: 토큰 만료(401) 시 자동 로그아웃 처리
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      alert('세션이 만료되었습니다. 다시 로그인해 주세요.');
      window.location.href = '/login'; // 로그인 페이지로 강제 이동
    }
    return Promise.reject(error);
  }
);

export default http;