import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInfraStore = defineStore('infra', () => {
  // 1. 인프라 활성화 상태 리스트
  const filters = ref({
    cctv: false,
    securityLight: false,
    streetLight: false,
    police: false
  })

  // 2. 사용자의 현재 위치 정보 및 지도 중심 좌표 관리
  const mapCenter = ref({
    lat: 37.4812, // 기본값: 신림역
    lng: 126.9296
  })

  // 3. 네비게이션 바 및 지도 탭에서 공유할 통합 검색 키워드
  const searchKeyword = ref('')

  // Actions: 필터 토글
  const toggleFilter = (infra) => {
    if (filters.value[infra] !== undefined) {
      filters.value[infra] = !filters.value[infra]
    }
  }

  // Actions: 지도 중심점 변경
  const updateCenter = (lat, lng) => {
    mapCenter.value = { lat, lng }
  }

  // Actions: 검색어 동기화
  const setKeyword = (keyword) => {
    searchKeyword.value = keyword
  }

  return {
    filters,
    mapCenter,
    searchKeyword,
    toggleFilter,
    updateCenter,
    setKeyword
  }
})