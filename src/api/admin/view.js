import request from '@/utils/request'

// 接口管理
export const getView = params => {
  return request.get('/api/admin/view/get', { params: params })
}
export const getViewList = params => {
  return request.get('/api/admin/view/getlist', { params: params })
}
export const removeView = params => {
  return request.delete('/api/admin/view/softdelete', { params: params })
}
export const batchRemoveView = params => {
  return request.put('/api/admin/view/BatchsoftDelete', params)
}
export const editView = params => {
  return request.put('/api/admin/view/update', params)
}
export const addView = params => {
  return request.post('/api/admin/view/add', params)
}
/**
 * 同步api
 */
export const syncView = params => {
  return request.post('/api/admin/view/sync', params)
}
