import http from '@/utils/axios'

export const fetchProperties = async ({
  lat,
  lng,
  radius,
  page = 0,
  size = 100,
  signal
}) => {
  const response = await http.get('/properties', {
    params: {
      lat,
      lng,
      radius,
      page,
      size
    },
    signal
  })

  return response.data
}