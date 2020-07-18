<template>
  <el-container class="container" style="height: 100%;">
    <el-aside class="aside" :class="collapsedClass" width>
      <div class="logo collapsedLogo" :class="isCollapse ? 'logo-collapse' : ''">
        <router-link to="/" tag="div" class="logo-text" style="font-size: 22px;">
          {{ isCollapse ? projectNameShort : projectName }}
        </router-link>
      </div>
      <el-scrollbar class="page-component__scroll" style="border-right: solid 1px #e6e6e6;">
        <el-menu
          :default-active="$route.path"
          :default-openeds="openeds"
          :collapse.sync="isCollapse"
          :unique-opened="false"
          :collapse-transition="false"
          class="aside-menu-vertical"
          @select="onSelectMenu"
        >
          <my-menu-item v-for="menu in menuTree" :key="menu.id" :item="menu" />
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header class="header" height="auto">
        <el-row class="navbar">
          <el-col :span="10" class="left-menu">
            <div class="left-menu-item fold-btn" :title="isCollapse ? '展开':'收起'" @click="onCollapse">
              <i :class="isCollapse ? 'fa el-icon-s-unfold' : 'fa el-icon-s-fold'" />
            </div>
            <el-breadcrumb
              separator-class="el-icon-arrow-right"
              class="breadcrumb-inner breadcrumb-container"
            >
              <template v-for="(title, index) in menueTitles">
                <el-breadcrumb-item
                  v-if="title"
                  :key="index"
                >{{ title }}</el-breadcrumb-item>
              </template>
            </el-breadcrumb>
          </el-col>
          <el-col :span="4" class="right-menu">
            <el-dropdown trigger="click">
              <div class="right-menu-item">
                <el-image class="user-avatar el-avatar el-avatar--circle" :src="avatar" style="height:36px;width:36px;line-height: 36px;">
                  <template #error>
                    <img :src="avatarDefault">
                  </template>
                </el-image>
                <span>{{ userName }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu
                  :visible-arrow="false"
                  style="margin-top: 2px;width:160px;"
                >
                  <el-dropdown-item icon="el-icon-setting" @click.native="Setting">个人设置</el-dropdown-item>
                  <el-dropdown-item divided icon="el-icon-switch-button" @click.native="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-col>
        </el-row>
        <div v-if="tabPosition === 'top'" style="padding:0px 0px;">
          <el-tabs
            v-if="showTabs"
            ref="tabs"
            :value="tabName"
            :type="tabType"
            @tab-click="onTabClick"
            @tab-remove="onRemoveTab"
            @contextmenu.prevent.native="onOpenRightMenu($event)"
          >
            <el-tab-pane
              v-for="tab in tabsList"
              :key="tab.path"
              :name="tab.path"
              :label="tab.meta.title"
              :closable="tab.meta.closable"
            >
              <template #label>
                <span>
                  <i :class="tab.meta.icon" />
                  {{ tab.meta.title }}
                </span>
              </template>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-header>
      <el-main class="main" style="height:100%;">
        <keep-alive :include="cachedViews">
          <router-view :key="key" />
        </keep-alive>
      </el-main>
      <el-footer v-if="tabPosition === 'bottom'" class="footer" height>
        <el-tabs
          v-if="showTabs"
          ref="tabs"
          :value="tabName"
          :type="tabType"
          :tab-position="tabPosition"
          @tab-click="onTabClick"
          @tab-remove="onRemoveTab"
          @contextmenu.prevent.native="onOpenRightMenu"
        >
          <el-tab-pane
            v-for="tab in tabsList"
            :key="tab.path"
            :name="tab.path"
            :label="tab.meta.title"
            :closable="tab.meta.closable"
          >
            <template #label>
              <span>
                <i :class="tab.meta.icon" />
                {{ tab.meta.title }}
              </span>
            </template>
          </el-tab-pane>
        </el-tabs>
      </el-footer>
      <ul
        v-if="tabPosition === 'top'"
        v-show="rightMenu.visible"
        ref="rightMenu"
        :style="{ left: rightMenu.left + 'px', top: rightMenu.top + 'px' }"
        class="contextmenu"
      >
        <li @click="refreshCurrentTab">
          <i class="el-icon-refresh-right" />刷新
        </li>
        <el-divider
          v-if="canClose || canCloseOthers || canCloseRight || canCloseLeft || canCloseAll"
        />
        <li v-if="canClose" @click="closecurrentTab">
          <span>关闭</span>
        </li>
        <li v-if="canCloseOthers" @click="closeOthersTabs">
          <i class="el-icon-more" />关闭其它
        </li>
        <li v-if="canCloseRight" @click="closeRightTabs">
          <i class="el-icon-right" />关闭到右侧
        </li>
        <li v-if="canCloseLeft" @click="closeLeftTabs">
          <i class="el-icon-back" />关闭到左侧
        </li>
        <li v-if="canCloseAll" @click="closeAllTabs">
          <span>关闭所有</span>
        </li>
      </ul>
      <ul
        v-if="tabPosition === 'bottom'"
        v-show="rightMenu.visible"
        ref="rightMenu"
        :style="{ left: rightMenu.left + 'px', top: rightMenu.top + 'px' }"
        class="contextmenu"
      >
        <li v-if="canCloseAll" @click="closeAllTabs">
          <span>关闭所有</span>
        </li>
        <li v-if="canCloseLeft" @click="closeLeftTabs">
          <i class="el-icon-back" />关闭到左侧
        </li>
        <li v-if="canCloseRight" @click="closeRightTabs">
          <i class="el-icon-right" />关闭到右侧
        </li>
        <li v-if="canCloseOthers" @click="closeOthersTabs">
          <i class="el-icon-more" />关闭其它
        </li>
        <li v-if="canClose" @click="closecurrentTab">
          <span>关闭</span>
        </li>
        <el-divider
          v-if="canClose || canCloseOthers || canCloseRight || canCloseLeft || canCloseAll"
        />
        <li @click="refreshCurrentTab">
          <i class="el-icon-refresh-right" />刷新
        </li>
      </ul>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import MyMenuItem from './components/my-menu-item'
import { listToTree, getTreeParents } from '@/utils'
import Sortable from 'sortablejs'
import { isExternalLink } from '@/utils/validate'
import { toLogout } from '@/router'

export default {
  name: 'AppMain',
  components: {
    MyMenuItem
  },
  data() {
    return {
      openeds: [],
      menuTree: [],
      projectName: 'Admin',
      projectNameShort: 'AD',
      avatarDefault: require('@/assets/avatar.png'),
      collapsedClass: 'menu-expanded',
      isCollapse: false,
      isPc: false,
      tabsList: [],
      rightMenu: {
        top: 0,
        left: 0,
        visible: false,
        selectedTab: {}
      },
      tabPosition: 'top', // top | bottom
      tabType: 'border-card' // '' | border-card | card
    }
  },
  computed: {
    ...mapGetters([
      'menus',
      'userName',
      'avatar'
    ]),
    menueTitles() {
      let parentTitles = []
      const fullPath = this.$route.fullPath
      const menu = this.menus.find(m => m.path === fullPath)
      if (menu && menu.id > 0) {
        const parents = getTreeParents(this.menuTree, menu.id)
        parentTitles = parents.map(p => p.label)
        parentTitles.push(menu.label)
      }
      return parentTitles
    },
    cachedViews() {
      return this.$store.getters.cachedViews
    },
    key() {
      const tabs = this.$store.getters.tabsList
      const fullPath = this.$route.fullPath
      const tab = tabs && tabs.find(t => t.fullPath === fullPath)
      const k = tab && tab._k ? tab._k : ''

      return this.$route.fullPath + k
    },
    showTabs() {
      return this.tabsList.length > 0
    },
    tabName() {
      return this.$route.path
    },
    canClose() {
      return (
        this.rightMenu.selectedTab.meta &&
        this.rightMenu.selectedTab.meta.closable
      )
    },
    canCloseOthers() {
      const tabIndex = this.tabsList.findIndex(
        t => t.fullPath === this.rightMenu.selectedTab.fullPath
      )
      return (
        (tabIndex === 0 && this.tabsList.length > 1) ||
        (tabIndex > 0 && this.tabsList.length > 2)
      )
    },
    canCloseRight() {
      const tabIndex = this.tabsList.findIndex(
        t => t.fullPath === this.rightMenu.selectedTab.fullPath
      )
      return this.tabsList.length - 1 > tabIndex
    },
    canCloseLeft() {
      const hasHome = this.tabsList.findIndex(t => t.fullPath === '/') >= 0
      const tabIndex = this.tabsList.findIndex(t => t.fullPath === this.rightMenu.selectedTab.fullPath)
      return tabIndex > (hasHome ? 1 : 0)
    },
    canCloseAll() {
      return this.tabsList.length > 1
    }
  },
  watch: {
    $route() {
      this.addTab()
    },
    'rightMenu.visible'(value) {
      if (value) {
        document.body.addEventListener('click', this.closeRightMenu)
      } else {
        document.body.removeEventListener('click', this.closeRightMenu)
      }
    },
    tabsList() {
      const views = this.tabsList.map(t => t.name)
      this.$store.commit('tabsView/set_cached_view', views)
      this.$store.commit('app/saveTabsData', JSON.stringify(this.tabsList))
    }
  },
  async created() {
    this.isPc = window.innerWidth >= 768
    this.collapsedClass = 'menu-expanded'

    // 还原会话tabs
    let sessionStorageTabs = sessionStorage.getItem('tabs')
    sessionStorageTabs = sessionStorageTabs ? JSON.parse(sessionStorageTabs) : []
    if (sessionStorageTabs && sessionStorageTabs.length > 0) {
      this.tabsList = sessionStorageTabs
    }

    if (this.menus && this.menus.length > 0) {
      const cloneMenus = _.cloneDeep(this.menus)
      // 检查外链
      cloneMenus.forEach(m => {
        if (!m.newWindow) {
          m.newWindow = isExternalLink(m.path)
        }
      })
      this.menuTree = listToTree(cloneMenus)
      this.openeds = this.menus.filter(l => l.opened).map(l => l.id + '')
    }

    this.addTab()
  },
  updated() {
    this.setSort()
  },
  methods: {
    // 点击选项卡
    onTabClick(tab) {
      if (tab.name && tab.name !== this.tabName) {
        this.$router.push(tab.name)
      }
    },
    // 添加标签
    addTab() {
      const route = this.$route
      if (!route.meta.title || route.meta.noTab) {
        return
      }

      const exists = this.tabsList.some(item => item.path === route.fullPath)
      if (exists) {
        return
      }

      // 获取视图缓存名
      const matchedIndex = route.matched && route.matched.length - 1
      let name = matchedIndex >= 0 && route.matched[matchedIndex].components.default.name
      name = name || route.name

      const tab = {
        name: name,
        path: route.path,
        fullPath: route.fullPath,
        meta: { ...route.meta }
      }

      if (tab.path === '/') {
        this.tabsList.unshift(tab)
      } else {
        this.tabsList.push(tab)
      }
    },
    // 关闭选项卡
    onRemoveTab(targetPath) {
      this.rightMenu.visible = false
      const index = this.tabsList.findIndex(tab => tab.path === targetPath)
      this.tabsList.splice(index, 1)[0]
      const toTab = this.tabsList[index] ? this.tabsList[index] : this.tabsList[index - 1]
      if (toTab) {
        targetPath === this.$route.fullPath && this.$router.push(toTab.path)
      } else {
        this.$router.push('/')
      }
    },
    // 退出登录
    logout: function() {
      this.$confirm('确认退出吗?', '提示').then(() => {
        toLogout()
      }).catch(() => {})
    },
    // 设置
    Setting: function() {
      this.$router.push('/account/settings')
    },
    // 移动端选择菜单
    onSelectMenu: function() {
      if (!this.isPc && !this.isCollapse) {
        this.isCollapse = true
        // this.collapsedClass = 'menu-collapsed'
      }
    },
    // 折叠导航栏
    onCollapse: function() {
      this.isCollapse = !this.isCollapse
      // this.collapsedClass = this.isCollapse ? 'menu-collapsed':'menu-expanded';
    },
    // tab打开右键菜单
    onOpenRightMenu(e) {
      const $tab = e.target.closest('.el-tabs__item')
      if ($tab) {
        const id = $tab.getAttribute('id')
        const path = id.replace(/^tab-/, '')
        this.rightMenu.selectedTab = this.tabsList.find(
          t => t.fullPath === path
        )

        this.rightMenu.visible = true
        this.rightMenu.left = e.x
        this.$nextTick(() => {
          if (this.tabPosition === 'bottom') {
            this.rightMenu.top = e.y - this.$refs.rightMenu.offsetHeight
          } else if (this.tabPosition === 'top') {
            this.rightMenu.top = e.y
          }
        })
      }
    },
    // tab拖拽排序
    setSort() {
      const _this = this
      if (!this.$refs.tabs) {
        return
      }
      const el = this.$refs.tabs.$el.querySelector('[role="tablist"]')
      Sortable.create(el, {
        ghostClass: '', // Class name for the drop placeholder,
        draggable: '[role="tab"]:not([id="tab-/"])', // Specifies which items inside the element should be draggable
        // animation: 150,
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          if (this.tabType === 'border-card') {
            const targetTab = _this.tabsList.splice(evt.oldIndex, 1)[0]
            _this.tabsList.splice(evt.newIndex, 0, targetTab)
          } else {
            const targetTab = _this.tabsList.splice(evt.oldIndex - 1, 1)[0]
            _this.tabsList.splice(evt.newIndex - 1, 0, targetTab)
          }
        }
      })
    },
    // 关闭tab右键菜单
    closeRightMenu() {
      this.rightMenu.visible = false
    },
    refreshCurrentTab() {
      const tab = this.tabsList.find(
        t => t.fullPath === this.rightMenu.selectedTab.fullPath
      )
      tab._k = tab._k ? ++tab._k : 1
      this.$store.commit('app/saveTabsData', JSON.stringify(this.tabsList))
    },
    closecurrentTab() {
      this.rightMenu.selectedTab &&
      this.onRemoveTab(this.rightMenu.selectedTab.fullPath)
    },
    closeOthersTabs() {
      const tab = this.rightMenu.selectedTab
      const tabIndex = this.tabsList.findIndex(
        t => t.fullPath === tab.fullPath
      )
      if (tabIndex === 0) {
        this.tabsList = [tab]
      } else {
        this.tabsList = [this.tabsList[0], tab]
      }
      this.$router.push(tab.fullPath)
    },
    closeAllTabs() {
      const tab = this.tabsList.find(t => t.fullPath === '/')
      this.tabsList = tab ? [tab] : []
      this.$router.push('/')
    },
    closeRightTabs() {
      const selectedPath = this.rightMenu.selectedTab.fullPath
      const tabIndex = this.tabsList.findIndex(
        t => t.fullPath === selectedPath
      )
      this.tabsList = this.tabsList.slice(0, tabIndex + 1)
      const toTab = this.tabsList[this.tabsList.length - 1]
      if (toTab) {
        selectedPath !== this.$route.fullPath && this.$router.push(toTab.path)
      } else {
        this.$router.push('/')
      }
    },
    closeLeftTabs() {
      const selectedPath = this.rightMenu.selectedTab.fullPath
      const tabIndex = this.tabsList.findIndex(
        t => t.fullPath === selectedPath
      )
      const tab = this.tabsList.find(t => t.fullPath === '/')
      this.tabsList = tab ? [tab, ...this.tabsList.slice(tabIndex)] : [...this.tabsList.slice(tabIndex)]
      const toTab = this.tabsList[this.tabsList.length - 1]
      if (toTab) {
        selectedPath !== this.$route.fullPath && this.$router.push(toTab.path)
      } else {
        this.$router.push('/')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container ::v-deep .el-tabs__item:focus.is-active.is-focus:not(:active) {
  -webkit-box-shadow: none;
  box-shadow: none;
  border-radius: unset;
}

.header {
  z-index: 1;
}

.footer {
  padding: 0px;
  overflow: hidden;
}

.el-breadcrumb {
  line-height: 50px !important;
}

.navbar ::v-deep {
  .el-breadcrumb__inner,.el-breadcrumb__separator{
    color: #f4f4f5;
  }
  .el-breadcrumb__item:last-child .el-breadcrumb__inner,
  .el-breadcrumb__item:last-child .el-breadcrumb__inner a,
  .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover,
  .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
    color: #fff;
  }
  .el-dropdown {
    color: #fff;
  }
}
</style>

<style lang="scss" scoped>
.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
  min-width: 130px;

  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;

    &:hover {
      background: #eee;
    }
    i {
      margin-right: 8px;
      font-size: 14px;
      vertical-align: -1px;
    }
    span {
      margin-left: 22px;
    }
  }
  .el-divider--horizontal {
    margin: 5px 0px;
  }
}
.user-avatar{
  margin: 7px 8px 7px 0;
  vertical-align: top;
  background-color: transparent;
}
</style>

<style>
@media screen and (max-width: 680px) {
  .collapsedLogo {
    display: none;
  }

  .el-dialog {
    width: 90% !important;
  }

  .content-expanded {
    max-width: 100% !important;
    max-height: calc(100% - 80px);
  }

  .el-menu--collapse {
    width: 100% !important;
  }

  .el-date-editor.el-input,
  .el-date-editor.el-input__inner,
  .el-cascader.el-cascader--medium {
    width: 100% !important;
  }

  .el-message-box {
    width: 80%;
  }
}
</style>
