import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePropertyStore = defineStore('property', () => {
  // 1. 선택된 특정 매물 데이터 (null 이면 리스트 모드, 객체가 있으면 상세 모드)
  const selectedProperty = ref(null)

  // 2. 가상의 글로벌 매물 마스터 데이터 백업목록
  // const propertiesList = ref([
  //   { id: 1, type: '원룸 월세', price: '1000 / 55', address: '관악구 신림동 1432-1', score: 98, grade: 1, cctvCount: 4, lampCount: 6 },
  //   { id: 102, type: '투룸 전세', price: '1억 8000', address: '관악구 신림동 412-5', score: 85, grade: 2, cctvCount: 2, lampCount: 4 },
  //   { id: 103, type: '오피스텔 월세', price: '2000 / 70', address: '관악구 신림동 92-11', score: 92, grade: 1, cctvCount: 5, lampCount: 3 }
  // ])
  // 2. 가상의 글로벌 매물 마스터 데이터 백업목록
  const propertiesList = ref([
    {
      id: 1,
      property_identity_hash: 'c8e7ec1137d9591e2ebbab4345534ee1d82a12fd15e59354c471f50d70e163c7',
      region_code: '1168010300',
      region_name: '서울특별시 강남구 개포동',
      sigungu: '서울특별시 강남구 개포동',
      property_name: '중앙클래식하우스7차',
      property_type: '연립다세대',
      lot_number: '1171-2',
      main_number: '1171',
      sub_number: '0002',
      road_name: '논현로6길 18-8',
      built_year: 2017,
      min_exclusive_area: 26.1700,
      max_exclusive_area: 26.1700,
      min_contract_area: null,
      max_contract_area: null,
      min_deposit_amount: 2000,
      max_deposit_amount: 2000,
      min_monthly_rent_amount: 115,
      max_monthly_rent_amount: 115,
      min_trade_amount: null,
      max_trade_amount: null,
      first_contract_date: '2026-06-04',
      latest_contract_date: '2026-06-04',
      trade_count: 1,
      created_at: '2026-06-17 07:25:27',
      updated_at: '2026-06-17 12:34:15',
      latitude: 37.4732522,
      longitude: 127.0512579,
      location: null
    },
    {
      id: 2,
      property_identity_hash: 'c590a2f28e9269caf1c7a5dafa4bb05b4b777481241f7038bcefbf4d40b5b29e',
      region_code: '2826010600',
      region_name: '인천광역시 서구 연희동',
      sigungu: '인천광역시 서구 연희동',
      property_name: '라인빌라1동',
      property_type: '연립다세대',
      lot_number: '704-7',
      main_number: '0704',
      sub_number: '0007',
      road_name: '간촌로 29',
      built_year: 2002,
      min_exclusive_area: 59.5600,
      max_exclusive_area: 59.5600,
      min_contract_area: null,
      max_contract_area: null,
      min_deposit_amount: 1600,
      max_deposit_amount: 1600,
      min_monthly_rent_amount: 30,
      max_monthly_rent_amount: 30,
      min_trade_amount: null,
      max_trade_amount: null,
      first_contract_date: '2026-06-04',
      latest_contract_date: '2026-06-04',
      trade_count: 1,
      created_at: '2026-06-17 07:25:27',
      updated_at: '2026-06-17 12:34:15',
      latitude: 37.5492287,
      longitude: 126.6802489,
      location: null
    },
    {
      id: 3,
      property_identity_hash: 'dda430b75b6f2604c743da011fbc219c55e6ec1fd25c54429d0ee9a7d8f233bf',
      region_code: '1150010300',
      region_name: '서울특별시 강서구 화곡동',
      sigungu: '서울특별시 강서구 화곡동',
      property_name: '진주',
      property_type: '연립다세대',
      lot_number: '105-101',
      main_number: '0105',
      sub_number: '0101',
      road_name: '까치산로4나길 32',
      built_year: 2010,
      min_exclusive_area: 42.1200,
      max_exclusive_area: 42.1200,
      min_contract_area: null,
      max_contract_area: null,
      min_deposit_amount: 13860,
      max_deposit_amount: 13860,
      min_monthly_rent_amount: 0,
      max_monthly_rent_amount: 0,
      min_trade_amount: null,
      max_trade_amount: null,
      first_contract_date: '2026-06-04',
      latest_contract_date: '2026-06-04',
      trade_count: 1,
      created_at: '2026-06-17 07:25:27',
      updated_at: '2026-06-17 12:34:15',
      latitude: 37.5408652,
      longitude: 126.8431645,
      location: null
    }
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