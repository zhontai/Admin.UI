import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/loginlog/`

// 登录日志
export const getLoginLogPage = (params, config = {}) => {
  params = params || {}
  return request.post(apiPrefix + 'getpage', params, config)
}
