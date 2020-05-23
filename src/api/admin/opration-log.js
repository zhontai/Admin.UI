import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/oprationlog/`

// 操作日志
export const getOprationLogPage = (params, config = {}) => {
  params = params || {}
  return request.post(apiPrefix + 'getpage', params, config)
}
