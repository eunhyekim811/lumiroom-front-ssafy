import axios from '@/utils/axios'

const API_BASE_URL = 'http://localhost:8080/api/infra' // 백엔드 주소로 조율

export const fetchInfraMarkers = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/markers`, { params })
    return response.data
  } catch (error) {
    console.error('인프라 마커를 불러오지 못했습니다.', error)
    return []
  }
}