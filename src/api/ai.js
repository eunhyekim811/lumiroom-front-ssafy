import http from '@/utils/axios'

/**
 * 선택한 매물의 위경도 좌표를 기반으로 LLM 공간 분석 안심 브리핑 텍스트를 수신합니다.
 */
export const fetchAiBriefing = async (lat, lon, propertyId) => {
  const response = await http.get('/ai/briefing', { params: { lat, lon, propertyId } })
  return response.data
}