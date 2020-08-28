import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui'
import defaultSettings from '@/settings'
import { getToken } from '@/utils/auth'
import Layout from '@/layout'
import store from '@/store'
import { login, logout } from '@/utils/is4'
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
    // name: 'Login',
    component: _import('/account/login'),
    hidden: true,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/callback',
    // name: 'Callback',
    component: _import('/account/login-callback'),
    hidden: true
  },
  {
    path: '/refresh',
    // name: 'Refresh',
    component: _import('/account/refresh-token'),
    hidden: true
  }
]

const createRouter = () =>
  new Router({
    // IIS发布使用默认的hash模式
    // IIS使用history请参考 https://router.vuejs.org/zh/guide/essentials/history-mode.html#internet-information-services-iis
    mode: 'history',
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
          // 如果IIS导入组件还是有问题，可以尝试直接使用 require('@/views' + m.viewPath + '.vue').default 导入
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

  // 修复无首页时不显示404
  routes.children.push({
    path: '',
    hidden: true
  })

  routes.children.push({
    path: '*',
    component: _import('/error/404'),
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

// 登出
export function toLogout() {
  store.dispatch('user/logout')
  if (defaultSettings.is4) {
    logout()
  } else {
    router.push('/login')
  }
}

// 登录
function toLogin(to, next) {
  // 自动登录判断
  // next({ path: '/' })

  if (defaultSettings.is4) {
    if (to.path === '/callback' || to.path === '/refresh') {
      next()
    } else {
      login()
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
}

let first = true
// 路由全局前置守卫
router.beforeEach(async(to, from, next) => {
  document.title = getPageTitle(to.meta.title)
  const token = getToken()

  if (token) {
    if (to.path === '/login') {
      toLogin(to, next)
    } else {
      const hasPermission = store.getters.menus && store.getters.menus.length > 0
      if (hasPermission) {
        next()
      } else {
        // 仅执行一次
        if (first) {
          first = false
          const res = await store.dispatch('user/getLoginInfo')
          if (res && res.success) {
            next({ ...to, replace: true })
          } else {
            toLogin(to, next)
          }
        }
      }
    }
  } else {
    toLogin(to, next)
  }
})

export default router
