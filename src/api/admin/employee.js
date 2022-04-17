/**
 *  员工管理
 *  @module @/api/admin/employee
 */

import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/employee/`

/**
 * 查询员工
 */
export const get = (params, config = {}) => {
  return request.get(apiPrefix + 'Get', { params: params, ...config })
}

/**
 * 查询员工列表
 */
export const getPage = (params, config = {}) => {
  return request.post(apiPrefix + 'GetPage', params, config)
}

/**
 * 新增员工
 */
export const add = (params, config = {}) => {
  return request.post(apiPrefix + 'Add', params, config)
}

/**
 * 修改员工
 */
export const update = (params, config = {}) => {
  return request.put(apiPrefix + 'Update', params, config)
}

/**
 * 删除员工
 */
export const softDelete = (params, config = {}) => {
  return request.delete(apiPrefix + 'SoftDelete', { params: params, ...config })
}

/**
 * 批量删除员工
 */
export const batchSoftDelete = (params, config = {}) => {
  return request.put(apiPrefix + 'BatchSoftDelete', params, config)
}

export default {
  get,
  getPage,
  add,
  update,
  softDelete,
  batchSoftDelete
}
