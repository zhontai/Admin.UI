import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/cache/`

// 缓存管理

/**
 * 获得缓存列表
 */
export const getCacheList = (params, config = {}) => {
  return request.get(apiPrefix + 'list', { params: params, ...config })
}
/**
 * 清除缓存
 */
export const clearCache = (params, config = {}) => {
  return request.delete(apiPrefix + 'clear', { params: params, ...config })
}
