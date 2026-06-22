import http from '@/utils/axios'

/**
 * 현재 로그인한 사용자의 관심 매물 목록을 조회합니다. (GET /api/favorites)
 */
export const fetchMyFavorites = async () => {
  const response = await http.get('/favorites')
  return response.data
}

/**
 * 특정 매물의 관심 등록을 해제합니다. (DELETE /api/favorites/{propertyId})
 */
export const deleteFavorite = async (propertyId) => {
  const response = await http.delete(`/favorites/${propertyId}`)
  return response.data
}