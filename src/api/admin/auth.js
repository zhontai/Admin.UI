/**
 *  认证授权服务
 *  @module @/api/admin/auth
 */

import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/auth/`

/**
 * 查询密钥
 */
export const getPasswordEncryptKey = (params, config = {}) => {
  return request.get(apiPrefix + 'get-password-encrypt-key', { params: params, ...config })
}

/**
 * 查询用户信息
 */
export const getUserInfo = (params, config = {}) => {
  return request.get(apiPrefix + 'get-user-info', { params: params, ...config })
}

/**
 * 登录
 */
export const login = (params, config = {}) => {
  return request.post(apiPrefix + 'login', params, config)
}

/**
 * 刷新Token
以旧换新
 */
export const refresh = (params, config = {}) => {
  return request.get(apiPrefix + 'refresh', { params: params, ...config })
}

/**
 * 获取验证数据
 */
export const getCaptcha = (params, config = {}) => {
  return request.get(apiPrefix + 'get-captcha', { params: params, ...config })
}

/**
 * 检查验证数据
 */
export const checkCaptcha = (params, config = {}) => {
  return request.get(apiPrefix + 'check-captcha', { params: params, ...config })
}

export default {
  getPasswordEncryptKey,
  getUserInfo,
  login,
  refresh,
  getCaptcha,
  checkCaptcha
}
