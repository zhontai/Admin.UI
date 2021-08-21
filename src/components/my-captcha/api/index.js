import { getCaptcha, checkCaptcha } from '@/api/admin/auth'

// 获取验证图片  以及token
export function reqGet(data) {
  return getCaptcha(data)
}

// 滑动或者点选验证
export function reqCheck(data) {
  return checkCaptcha(data)
}
