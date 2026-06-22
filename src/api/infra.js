import http from '@/utils/axios';

export const fetchInfraItems = async ({ lat, lng, radius, types, signal }) => {
  try {
    // 1. URL 쿼리 스트링(Request Parameter)으로 보낼 객체 조립
    const params = {
      lat: String(lat),
      lng: String(lng),
      radius: String(radius)
    };

    // 2. 인프라 타입 배열이 존재하면 콤마(,) 기준의 문자열로 변환하여 주입
    if (types?.length) {
      params.types = types.join(',');
    }

    // 3. http 인터셉터를 사용해 요청 전송!
    // headers에 Authorization을 수동으로 넣을 필요가 전혀 없습니다. (인터셉터가 알아서 탑재)
    // 401 만료 에러가 나도 인터셉터가 자연스럽게 알아서 재발급 후 갱신(Retry)해 줍니다.
    const response = await http.get('/infra', { 
      params, 
      signal 
    });

    // 4. axios는 백엔드의 JSON 응답 데이터를 객체화하여 .data에 담아주므로 바로 반환합니다.
    return response.data;

  } catch (error) {
    // 세션 만료로 인한 튕김 외의 일반적인 네트워크/400 에러 핸들링
    console.error('인프라 호출 중 에러 발생:', error);
    throw new Error(error.response?.data?.message || `치안 인프라 조회 실패 (${error.message})`);
  }
}