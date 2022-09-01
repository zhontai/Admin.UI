/**
 *  接口服务
 *  @module @/api/admin/api.extend
 */

import request from '@/utils/request'

/**
 *  获得swagger json
 */
export const getSwaggerJson = (params, config = {}) => {
  return request.get('/swagger/admin/swagger.json', { params: params, ...config })
}
