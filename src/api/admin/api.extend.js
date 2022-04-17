/**
 *  接口服务
 *  @module @/api/admin/api.extend
 */

import request from '@/utils/request'

/**
 *  获得swagger json
 */
export const getV2SwaggerJson = (params, config = {}) => {
  return request.get('/swagger/V2/swagger.json', { params: params, ...config })
}
