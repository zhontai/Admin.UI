// 生产环境导入组件
// NGINX 发布模式
module.exports = file => () => import('@/views' + file + '.vue')
