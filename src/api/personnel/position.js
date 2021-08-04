import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/position/`

// 职位管理
export const getPosition = (params, config = {}) => {
  return request.get(apiPrefix + 'get', { params: params, ...config })
}
export const getPositionListPage = (params, config = {}) => {
  params = params || {}
  return request.post(apiPrefix + 'getpage', params, config)
}
export const addPosition = (params, config = {}) => {
  return request.post(apiPrefix + 'add', params, config)
}
export const editPosition = (params, config = {}) => {
  return request.put(apiPrefix + 'update', params, config)
}
export const removePosition = (params, config = {}) => {
  return request.delete(apiPrefix + 'softdelete', { params: params, ...config })
}
export const batchRemovePosition = (params, config = {}) => {
  return request.put(apiPrefix + 'batchsoftdelete', params, config)
}
