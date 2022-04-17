/**
 *  组织架构
 *  @module @/api/admin/organization
 */

import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/organization/`

/**
 * 查询组织架构
 */
export const get = (params, config = {}) => {
  return request.get(apiPrefix + 'Get', { params: params, ...config })
}

/**
 * 查询组织架构列表
 */
export const getList = (params, config = {}) => {
  return request.get(apiPrefix + 'GetList', { params: params, ...config })
}

/**
 * 新增组织架构
 */
export const add = (params, config = {}) => {
  return request.post(apiPrefix + 'Add', params, config)
}

/**
 * 修改组织架构
 */
export const update = (params, config = {}) => {
  return request.put(apiPrefix + 'Update', params, config)
}

/**
 * 删除组织架构
 */
export const softDelete = (params, config = {}) => {
  return request.delete(apiPrefix + 'SoftDelete', { params: params, ...config })
}

export default {
  get,
  getList,
  add,
  update,
  softDelete
}
