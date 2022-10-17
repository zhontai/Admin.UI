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
 * 暂停任务
 */
export const pause = (params, config = {}) => {
  return request.post(apiPrefix + 'pause', params, config)
}

/**
 * 启动任务
 */
export const resume = (params, config = {}) => {
  return request.post(apiPrefix + 'resume', params, config)
}

/**
 * 执行任务
 */
export const run = (params, config = {}) => {
  return request.post(apiPrefix + 'run', params, config)
}

/**
 * 删除任务
 */
export const deleteAsync = (params, config = {}) => {
  return request.delete(apiPrefix + 'delete', { params: params, ...config })
}

export default {
  get,
  getPage,
  add,
  update,
  pause,
  resume,
  run,
  deleteAsync
}
