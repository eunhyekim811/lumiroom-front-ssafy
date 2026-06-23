import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const http = axios.create({
  baseURL: `${baseUrl}/api`, // 백엔드 서버 주소 (환경에 맞게 수정)
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
  async (error) => {
    const originalRequest = error.config;

    if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
      originalRequest._retry=true;

      try{
        const refreshToken=localStorage.getItem('refreshToken');
        if(!refreshToken){
          throw new Error('refresh token 없음');
        }

        const response=await axios.post(`${baseUrl}/api/auth/refresh`, {}, {
          headers: { 'RefreshToken': refreshToken  }
        });

        const { accessToken: newAccessToken, 
          refreshToken: newRefreshToken
        } = response.data;

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers['Authorization']=`Bearer ${newAccessToken}`;
      
        return http(originalRequest);
      } catch(refreshError){
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        alert('세션이 만료되었습니다. 다시 로그인해 주세요.');
        window.location.href = '/login'; // 로그인 페이지로 강제 이동
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default http;