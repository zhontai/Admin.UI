import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/dictionarytype/`

// 数据字典类型管理
export const getDictionaryType = (params, config = {}) => {
  return request.get(apiPrefix + 'get', { params: params, ...config })
}
export const getDictionaryTypeListPage = (params, config = {}) => {
  return request.post(apiPrefix + 'getpage', params, config)
}
export const removeDictionaryType = (params, config = {}) => {
  return request.delete(apiPrefix + 'softdelete', { params: params, ...config })
}
export const editDictionaryType = (params, config = {}) => {
  return request.put(apiPrefix + 'update', params, config)
}
export const addDictionaryType = (params, config = {}) => {
  return request.post(apiPrefix + 'add', params, config)
}
