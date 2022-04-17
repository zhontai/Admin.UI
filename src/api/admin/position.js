/**
 *  职位管理
 *  @module @/api/admin/position
 */

import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/position/`

/**
 * 查询职位
 */
export const get = (params, config = {}) => {
  return request.get(apiPrefix + 'Get', { params: params, ...config })
}

/**
 * 查询职位列表
 */
export const getPage = (params, config = {}) => {
  return request.post(apiPrefix + 'GetPage', params, config)
}

/**
 * 新增职位
 */
export const add = (params, config = {}) => {
  return request.post(apiPrefix + 'Add', params, config)
}

/**
 * 修改职位
 */
export const update = (params, config = {}) => {
  return request.put(apiPrefix + 'Update', params, config)
}

/**
 * 删除职位
 */
export const softDelete = (params, config = {}) => {
  return request.delete(apiPrefix + 'SoftDelete', { params: params, ...config })
}

/**
 * 批量删除职位
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
