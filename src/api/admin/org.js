/**
 *  部门服务
 *  @module @/api/admin/org
 */

import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/org/`

/**
 * 查询部门
 */
export const get = (params, config = {}) => {
  return request.get(apiPrefix + 'get', { params: params, ...config })
}

/**
 * 查询列表
 */
export const getList = (params, config = {}) => {
  return request.get(apiPrefix + 'get-list', { params: params, ...config })
}

/**
 * 新增
 */
export const add = (params, config = {}) => {
  return request.post(apiPrefix + 'add', params, config)
}

/**
 * 修改
 */
export const update = (params, config = {}) => {
  return request.put(apiPrefix + 'update', params, config)
}

/**
 * 彻底删除
 */
export const deleteAsync = (params, config = {}) => {
  return request.delete(apiPrefix + 'delete', { params: params, ...config })
}

/**
 * 批量删除
 */
export const softDelete = (params, config = {}) => {
  return request.delete(apiPrefix + 'soft-delete', { params: params, ...config })
}

export default {
  get,
  getList,
  add,
  update,
  deleteAsync,
  softDelete
}
