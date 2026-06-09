import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePropertyStore = defineStore('property', () => {
  // 1. 선택된 특정 매물 데이터 (null 이면 리스트 모드, 객체가 있으면 상세 모드)
  const selectedProperty = ref(null)

  // 2. 가상의 글로벌 매물 마스터 데이터 백업목록
  const propertiesList = ref([
    { id: 101, type: '원룸 월세', price: '1000 / 55', address: '관악구 신림동 1432-1', score: 98, grade: 1, cctvCount: 4, lampCount: 6 },
    { id: 102, type: '투룸 전세', price: '1억 8000', address: '관악구 신림동 412-5', score: 85, grade: 2, cctvCount: 2, lampCount: 4 },
    { id: 103, type: '오피스텔 월세', price: '2000 / 70', address: '관악구 신림동 92-11', score: 92, grade: 1, cctvCount: 5, lampCount: 3 }
  ])

  // Actions: 특정 매물 선택 (지도 탭 우측 패널 전환용)
  const selectProperty = (property) => {
    selectedProperty.value = property
  }

  // Actions: 선택 해제 (다시 목록형태 브라우징으로 백업)
  const clearSelection = () => {
    selectedProperty.value = null
  }

  return {
    selectedProperty,
    propertiesList,
    selectProperty,
    clearSelection
  }
})