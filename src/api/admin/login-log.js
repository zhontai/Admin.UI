import request from '@/utils/request'

// 登录日志
export const getLoginLogPage = params => {
  params = params || {}
  return request.post('/api/admin/loginlog/getpage', params)
}
