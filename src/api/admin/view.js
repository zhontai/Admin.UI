import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/view/`

// 接口管理
export const getView = (params, config = {}) => {
  return request.get(apiPrefix + 'get', { params: params, ...config })
}
export const getViewList = (params, config = {}) => {
  return request.get(apiPrefix + 'getlist', { params: params, ...config })
}
export const removeView = (params, config = {}) => {
  return request.delete(apiPrefix + 'softdelete', { params: params, ...config })
}
export const batchRemoveView = (params, config = {}) => {
  return request.put(apiPrefix + 'BatchsoftDelete', params, config)
}
export const editView = (params, config = {}) => {
  return request.put(apiPrefix + 'update', params, config)
}
export const addView = (params, config = {}) => {
  return request.post(apiPrefix + 'add', params, config)
}
/**
 * 同步api
 */
export const syncView = (params, config = {}) => {
  return request.post(apiPrefix + 'sync', params, config)
}
