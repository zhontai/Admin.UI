import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui'
import defaultSettings from '@/settings'
import { getToken } from '@/utils/auth'
import Layout from '@/layout'
import store from '@/store'
const _import = require('./_import_' + process.env.NODE_ENV) // 获取组件的方法

/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

Vue.use(Router)

const constantRoutes = [
  {
    path: '/login',
    component: _import('/account/login'),
    hidden: true,
    meta: {
      title: '登录'
    }
  }
]

const createRouter = () =>
  new Router({
    mode: 'history', // require service support
    // scrollBehavior: () => ({ y: 100 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

// 生成路由
function generateRoutes(menus = []) {
  const routes = {
    path: '/',
    component: Layout,
    children: [],
    name: '',
    meta: {}
  }

  menus.forEach(m => {
    if (m.viewPath) {
      try {
        const route = {
          name: m.path,
          path: m.path,
          component: _import(m.viewPath),
          meta: {
            title: m.label,
            icon: m.icon,
            closable: m.closable
          }
        }

        routes.children.push(route)
      } catch (error) {
        Message.error(`导入组件${m.viewPath}.vue失败`)
      }
    }
  })

  routes.children.push({
    path: '',
    // component: _import('/admin/404'),
    hidden: true
  })

  routes.children.push({
    path: '*',
    component: _import('/admin/404'),
    hidden: true
  })

  return [routes]
}

// 添加路由
export function addRoutes(menus = []) {
  // 生成动态路由
  if (menus && menus.length > 0) {
    const dynamicRoutes = generateRoutes(menus)
    resetRouter()
    router.addRoutes(dynamicRoutes)
  }
}

const title = defaultSettings.title || '中台Admin后台管理系统'
// 获取页面标题
function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return title
}

let count = 0
// 路由全局前置守卫
router.beforeEach(async(to, from, next) => {
  document.title = getPageTitle(to.meta.title)
  const token = getToken()

  if (token) {
    if (to.path === '/login') {
      // 自动登录判断
      // next({ path: '/' })
      next()
    } else {
      const hasPermission = store.getters.menus && store.getters.menus.length > 0
      if (hasPermission) {
        next()
      } else {
        // 仅执行一次
        if (count === 0) {
          count = 1
          const res = await store.dispatch('user/getLoginInfo', null, { root: true })
          if (res && res.success) {
            next({ ...to, replace: true })
          } else {
            next(`/login?redirect=${to.path}`)
          }
        }
      }
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

export default router
