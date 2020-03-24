import request from '@/utils/request'

// 缓存管理

/**
 * 获得缓存列表
 */
export const getCacheList = params => {
  return request.get('/api/admin/cache/list', { params: params })
}
/**
 * 清除缓存
 */
export const clearCache = params => {
  return request.delete('/api/admin/cache/clear', { params: params })
}
