import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/dictionary/`

// 数据字典管理
export const getDictionary = (params, config = {}) => {
  return request.get(apiPrefix + 'get', { params: params, ...config })
}
export const getDictionaryListPage = (params, config = {}) => {
  return request.post(apiPrefix + 'getpage', params, config)
}
export const removeDictionary = (params, config = {}) => {
  return request.delete(apiPrefix + 'softdelete', { params: params, ...config })
}
export const editDictionary = (params, config = {}) => {
  return request.put(apiPrefix + 'update', params, config)
}
export const addDictionary = (params, config = {}) => {
  return request.post(apiPrefix + 'add', params, config)
}
