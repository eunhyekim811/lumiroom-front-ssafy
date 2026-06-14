import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchInfraItems } from '@/api/infra'

export const useInfraStore = defineStore('infra', () => {
  // 1. 인프라 활성화 상태 리스트
  const filters = ref({
    cctv: true,
    securityLight: true,
    streetLight: false,
    police: true
  })

  // 2. 사용자의 현재 위치 정보 및 지도 중심 좌표 관리
  const mapCenter = ref({
    lat: 37.4812, // 기본값: 신림역
    lng: 126.9296
  })

  // 3. 네비게이션 바 및 지도 탭에서 공유할 통합 검색 키워드
  const searchKeyword = ref('')

  // 4. 지도 인프라 API 조회 상태
  const radius = ref(500)
  const infraItems = ref([])
  const isLoading = ref(false)
  const errorMessage = ref('')
  let abortController = null

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

  const selectedTypes = () => {
    return Object.entries(filters.value)
      .filter(([, enabled]) => enabled)
      .map(([type]) => type)
  }

  const clearInfraItems = () => {
    infraItems.value = []
    errorMessage.value = ''
  }

  const updateRadius = (nextRadius) => {
    radius.value = Number(nextRadius)
  }

  const loadInfraItems = async () => {
    const types = selectedTypes()

    if (types.length === 0) {
      if (abortController) abortController.abort()
      isLoading.value = false
      clearInfraItems()
      return
    }

    if (abortController) abortController.abort()
    const controller = new AbortController()
    abortController = controller
    isLoading.value = true
    errorMessage.value = ''

    try {
      infraItems.value = await fetchInfraItems({
        lat: mapCenter.value.lat,
        lng: mapCenter.value.lng,
        radius: radius.value,
        types,
        signal: controller.signal
      })
    } catch (error) {
      if (error.name === 'AbortError') return
      infraItems.value = []
      errorMessage.value = error.message || '치안 인프라를 불러오지 못했습니다.'
    } finally {
      if (abortController === controller) {
        isLoading.value = false
      }
    }
  }

  return {
    filters,
    mapCenter,
    searchKeyword,
    radius,
    infraItems,
    isLoading,
    errorMessage,
    toggleFilter,
    updateCenter,
    setKeyword,
    updateRadius,
    clearInfraItems,
    loadInfraItems
  }
})
