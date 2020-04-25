import Vue from 'vue'
import VueI18n from 'vue-i18n'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN' // element-ui lang
import enLocale from './en'
import zhLocale from './zh'

Vue.use(VueI18n)

const messages = {
  zh: {
    ...zhLocale,
    ...elementZhLocale
  },
  en: {
    ...enLocale,
    ...elementEnLocale
  }
}

const i18n = new VueI18n({
  // set locale
  // options: en | zh | es
  locale: 'zh',
  // set locale messages
  messages
})

// 覆盖Element-UI中文
i18n.mergeLocaleMessage('zh', {
  el: {
    pagination: {
      goto: '',
      pageClassifier: '/ {pageCount} 页'
    }
  }
})

export default i18n
