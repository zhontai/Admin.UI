/**
 *  任务服务
 *  @module @/api/admin/task
 */

import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/task/`

/**
 * 查询任务
 */
export const get = (params, config = {}) => {
  return request.get(apiPrefix + 'get', { params: params, ...config })
}

/**
 * 查询任务列表
 */
export const getPage = (params, config = {}) => {
  return request.post(apiPrefix + 'get-page', params, config)
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
 * 批量彻底删除
 */
export const batchDelete = (params, config = {}) => {
  return request.put(apiPrefix + 'batch-delete', params, config)
}

export default {
  get,
  getPage,
  add,
  update,
  deleteAsync,
  batchDelete
}
