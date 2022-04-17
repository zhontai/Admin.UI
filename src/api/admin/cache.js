/**
 *  缓存服务
 *  @module @/api/admin/cache
 */

import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/cache/`

/**
 * 查询列表
 */
export const getList = (params, config = {}) => {
  return request.get(apiPrefix + 'get-list', { params: params, ...config })
}

/**
 * 清除缓存
 */
export const clear = (params, config = {}) => {
  return request.delete(apiPrefix + 'clear', { params: params, ...config })
}

export default {
  getList,
  clear
}
