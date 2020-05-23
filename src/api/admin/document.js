import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/document/`

// 文档管理
export const getDocuments = (params, config = {}) => {
  return request.get(apiPrefix + 'getlist', { params: params }, config)
}
export const getDocumentImages = (params, config = {}) => {
  return request.get(apiPrefix + 'getimagelist', { params: params }, config)
}
export const getGroup = (params, config = {}) => {
  return request.get(apiPrefix + 'getGroup', { params: params }, config)
}
export const getMenu = (params, config = {}) => {
  return request.get(apiPrefix + 'getMenu', { params: params }, config)
}
export const getContent = (params, config = {}) => {
  return request.get(apiPrefix + 'getContent', { params: params }, config)
}
export const addGroup = (params, config = {}) => {
  return request.post(apiPrefix + 'addGroup', params, config)
}
export const addMenu = (params, config = {}) => {
  return request.post(apiPrefix + 'addMenu', params, config)
}
export const updateGroup = (params, config = {}) => {
  return request.put(apiPrefix + 'updateGroup', params, config)
}
export const updateMenu = (params, config = {}) => {
  return request.put(apiPrefix + 'updateMenu', params, config)
}
export const updateContent = (params, config = {}) => {
  return request.put(apiPrefix + 'updateContent', params, config)
}
export const removeDocument = (params, config = {}) => {
  return request.delete(apiPrefix + 'softdelete', { params: params }, config)
}
export const deleteImage = (params, config = {}) => {
  return request.delete(apiPrefix + 'deleteimage', { params: params }, config)
}
