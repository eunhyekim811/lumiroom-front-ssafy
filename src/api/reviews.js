import http from '@/utils/axios'

/**
 * 특정 실거래 매물에 등록된 실거주 치안 리뷰 목록을 가져옵니다.
 */
export const fetchReviews = async (propertyId) => {
  const response = await http.get(`/reviews/${propertyId}`)
  return response.data
}

/**
 * 선택된 매물에 새로운 실거주 체감 치안 평점과 리뷰를 등록합니다.
 */
export const createPropertyReview = async (reviewData) => {
  const response = await http.post('/reviews', reviewData)
  return response.data
}

/**
 * 본인이 작성한 체감 치안 리뷰를 영구 삭제합니다.
 */
export const deletePropertyReview = async (reviewId) => {
  const response = await http.delete(`/reviews/${reviewId}`)
  return response.data
}