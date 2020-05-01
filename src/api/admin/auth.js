import request from '@/utils/request'

// 授权

/**
 * 登录
 */
export const login = params => {
  return request.post('/api/admin/auth/login', params)
}
export const getVerifyCode = params => {
  return request.get('/api/admin/auth/getverifycode', { params: params })
}
export const getPassWordEncryptKey = params => {
  return request.get('/api/admin/auth/getPassWordEncryptKey', { params: params })
}
export const getLoginInfo = params => {
  return request.get('/api/admin/auth/getUserInfo', { params: params })
}
