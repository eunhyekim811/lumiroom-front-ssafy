import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchProperties } from '@/api/properties'

export const usePropertyStore = defineStore('property', () => {
  const selectedProperty = ref(null)
  const propertiesList = ref([])
  const isLoading = ref(false)
  const errorMessage = ref('')
  const page = ref(0)
  const size = ref(100)
  const totalElements = ref(0)
  const totalPages = ref(0)
  let abortController = null

  const amountRange = (min, max) => {
    if (min == null && max == null) return null
    if (min == null) return String(max)
    if (max == null || min === max) return String(min)
    return `${min}~${max}`
  }

  const normalizeProperty = (item) => {
    const transactionType = item.transactionType
      || (['SALE', 'JEONSE', 'MONTHLY_RENT', 'MIXED', 'UNKNOWN'].includes(item.rentType) ? item.rentType : 'UNKNOWN')
    const propertyType = ['SALE', 'JEONSE', 'MONTHLY_RENT', 'MIXED', 'UNKNOWN'].includes(item.rentType)
      ? '매물'
      : item.rentType || '매물'

    const deposit = amountRange(item.minDepositAmount, item.maxDepositAmount)
    const monthlyRent = amountRange(item.minMonthlyRentAmount, item.maxMonthlyRentAmount)
    const trade = amountRange(item.minTradeAmount, item.maxTradeAmount)

    let price = '가격 정보 없음'
    if (transactionType === 'SALE') price = trade ? `${trade} 매매` : price
    if (transactionType === 'JEONSE') price = deposit ? `${deposit} 전세` : price
    if (transactionType === 'MONTHLY_RENT') {
      price = deposit || monthlyRent ? `${deposit || 0} / ${monthlyRent || 0}` : price
    }
    if (transactionType === 'MIXED') {
      price = deposit || monthlyRent ? `${deposit || 0} / ${monthlyRent || 0}` : trade || price
    }

    return {
      ...item,
      title: item.propertyName || '이름 없는 매물',
      type: propertyType,
      transactionType,
      price,
      score: item.safetyScore,
      grade: item.safetyGrade,
      lat: Number(item.latitude),
      lng: Number(item.longitude)
    }
  }

  const selectProperty = (property) => {
    selectedProperty.value = property
  }

  const clearSelection = () => {
    selectedProperty.value = null
  }

  const loadProperties = async ({ lat, lng, radius, nextPage = 0 }) => {
    if (abortController) abortController.abort()
    const controller = new AbortController()
    abortController = controller
    isLoading.value = true
    errorMessage.value = ''

    try {
      const response = await fetchProperties({
        lat,
        lng,
        radius,
        page: nextPage,
        size: size.value,
        signal: controller.signal
      })

      const items = response.properties || response.data || []
      propertiesList.value = items.map(normalizeProperty)
      page.value = response.page ?? nextPage
      totalElements.value = response.totalElements ?? propertiesList.value.length
      totalPages.value = response.totalPages ?? 0

      if (
        selectedProperty.value
        && !propertiesList.value.some((item) => item.id === selectedProperty.value.id)
      ) {
        clearSelection()
      }
    } catch (error) {
      if (error.name === 'AbortError') return
      propertiesList.value = []
      totalElements.value = 0
      totalPages.value = 0
      errorMessage.value = error.message || '매물 목록을 불러오지 못했습니다.'
    } finally {
      if (abortController === controller) {
        isLoading.value = false
      }
    }
  }

  return {
    selectedProperty,
    propertiesList,
    isLoading,
    errorMessage,
    page,
    size,
    totalElements,
    totalPages,
    selectProperty,
    clearSelection,
    loadProperties
  }
})
