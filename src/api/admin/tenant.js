import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/tenant/`

// 租户管理
export const getTenant = (params, config = {}) => {
  return request.get(apiPrefix + 'get', { params: params, ...config })
}
export const getTenantListPage = (params, config = {}) => {
  params = params || {}
  return request.post(apiPrefix + 'getpage', params, config)
}
export const addTenant = (params, config = {}) => {
  return request.post(apiPrefix + 'add', params, config)
}
export const editTenant = (params, config = {}) => {
  return request.put(apiPrefix + 'update', params, config)
}
export const removeTenant = (params, config = {}) => {
  return request.delete(apiPrefix + 'softdelete', { params: params, ...config })
}
export const batchRemoveTenant = (params, config = {}) => {
  return request.put(apiPrefix + 'BatchsoftDelete', params, config)
}
