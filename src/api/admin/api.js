import request from '@/utils/request'

// 接口管理
export const getApi = params => {
  return request.get('/api/admin/api/get', { params: params })
}
export const getApiList = params => {
  return request.get('/api/admin/api/getlist', { params: params })
}
export const removeApi = params => {
  return request.delete('/api/admin/api/softdelete', { params: params })
}
export const batchRemoveApi = params => {
  return request.put('/api/admin/api/BatchsoftDelete', params)
}
export const editApi = params => {
  return request.put('/api/admin/api/update', params)
}
export const addApi = params => {
  return request.post('/api/admin/api/add', params)
}
/**
 * 同步api
 */
export const syncApi = params => {
  return request.post('/api/admin/api/sync', params)
}
export const getV2SwaggerJson = params => {
  return request.get('/swagger/V2/swagger.json', { params: params })
}
