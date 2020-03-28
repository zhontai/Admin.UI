import request from '@/utils/request'

// 操作日志
export const getOprationLogPage = params => {
  params = params || {}
  return request.post('/api/admin/oprationlog/getpage', params)
}
