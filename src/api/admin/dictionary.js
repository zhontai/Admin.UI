import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/dictionary/`

// 数据字典管理
export const getPage = (params, config = {}) => {
  return request.post(apiPrefix + 'getPage', params, config)
}
export const get = (params, config = {}) => {
  return request.get(apiPrefix + 'get', { params: params, ...config })
}
export const add = (params, config = {}) => {
  return request.post(apiPrefix + 'add', params, config)
}
export const update = (params, config = {}) => {
  return request.put(apiPrefix + 'update', params, config)
}
export const softDelete = (params, config = {}) => {
  return request.delete(apiPrefix + 'softDelete', { params: params, ...config })
}
export const batchSoftDelete = (params, config = {}) => {
  return request.delete(apiPrefix + 'batchSoftDelete', { params: params, ...config })
}

