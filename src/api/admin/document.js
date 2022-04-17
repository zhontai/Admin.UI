/**
 *  文档服务
 *  @module @/api/admin/document
 */

import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/document/`

/**
 * 查询文档
 */
export const get = (params, config = {}) => {
  return request.get(apiPrefix + 'get', { params: params, ...config })
}

/**
 * 查询分组
 */
export const getGroup = (params, config = {}) => {
  return request.get(apiPrefix + 'get-group', { params: params, ...config })
}

/**
 * 查询菜单
 */
export const getMenu = (params, config = {}) => {
  return request.get(apiPrefix + 'get-menu', { params: params, ...config })
}

/**
 * 查询文档内容
 */
export const getContent = (params, config = {}) => {
  return request.get(apiPrefix + 'get-content', { params: params, ...config })
}

/**
 * 查询文档列表
 */
export const getList = (params, config = {}) => {
  return request.get(apiPrefix + 'get-list', { params: params, ...config })
}

/**
 * 查询图片列表
 */
export const getImageList = (params, config = {}) => {
  return request.get(apiPrefix + 'get-image-list', { params: params, ...config })
}

/**
 * 新增分组
 */
export const addGroup = (params, config = {}) => {
  return request.post(apiPrefix + 'add-group', params, config)
}

/**
 * 新增菜单
 */
export const addMenu = (params, config = {}) => {
  return request.post(apiPrefix + 'add-menu', params, config)
}

/**
 * 新增图片
 */
export const addImage = (params, config = {}) => {
  return request.post(apiPrefix + 'add-image', params, config)
}

/**
 * 修改分组
 */
export const updateGroup = (params, config = {}) => {
  return request.put(apiPrefix + 'update-group', params, config)
}

/**
 * 修改菜单
 */
export const updateMenu = (params, config = {}) => {
  return request.put(apiPrefix + 'update-menu', params, config)
}

/**
 * 修改文档内容
 */
export const updateContent = (params, config = {}) => {
  return request.put(apiPrefix + 'update-content', params, config)
}

/**
 * 彻底删除文档
 */
export const deleteAsync = (params, config = {}) => {
  return request.delete(apiPrefix + 'delete', { params: params, ...config })
}

/**
 * 彻底删除图片
 */
export const deleteImage = (params, config = {}) => {
  return request.delete(apiPrefix + 'delete-image', { params: params, ...config })
}

/**
 * 删除文档
 */
export const softDelete = (params, config = {}) => {
  return request.delete(apiPrefix + 'soft-delete', { params: params, ...config })
}

/**
 * 查询精简文档列表
 */
export const getPlainList = (params, config = {}) => {
  return request.get(apiPrefix + 'get-plain-list', { params: params, ...config })
}

/**
 * 上传文档图片
 */
export const uploadImage = (params, config = {}) => {
  return request.post(apiPrefix + 'upload-image', params, config)
}

export default {
  get,
  getGroup,
  getMenu,
  getContent,
  getList,
  getImageList,
  addGroup,
  addMenu,
  addImage,
  updateGroup,
  updateMenu,
  updateContent,
  deleteAsync,
  deleteImage,
  softDelete,
  getPlainList,
  uploadImage
}
