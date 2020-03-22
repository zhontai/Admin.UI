const getters = {
  language: state => state.app.language,
  tabsList: state => state.app.tabsList,
  cachedViews: state => state.tabsView.cachedViews,
  token: state => state.user.token,
  tokenExpire: state => state.app.tokenExpire,
  menus: state => state.user.menus,
  userName: state => state.user.name,
  avatar: state => state.user.avatar
}
export default getters
