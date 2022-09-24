<template>
  <my-container
    :left-aside-width="'45%'"
    :show-left-aside="true"
    :resizable="true"
  >
    <template #left-aside>
      <my-page-dictionary-type />
    </template>
    <my-page-dictionary-data />
  </my-container>
</template>

<script>
import MyPageDictionaryType from './type'
import MyPageDictionaryData from './data'

/**
 * 数据字典类型
 */
export default {
  name: 'Dictionary',
  _sync: {
    disabled: false,
    title: '数据字典',
    desc: '',
    cache: true
  },
  components: { MyPageDictionaryType, MyPageDictionaryData }
}
</script>
