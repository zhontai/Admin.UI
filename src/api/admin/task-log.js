/**
 *  任务日志服务
 *  @module @/api/admin/task-log
 */

import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/task-log/`

/**
 * 查询任务日志列表
 */
export const getPage = (params, config = {}) => {
  return request.post(apiPrefix + 'get-page', params, config)
}

export default {
  getPage
}
