<template>
  <my-container
    :left-aside-width="'45%'"
    :show-left-aside="true"
    :resizable="true"
  >
    <template #left-aside>
      <my-dictionary-type @current-change="onCurrentChange" />
    </template>
    <my-dictionary-data :dictionary-type-id="dictionaryTypeId" />
  </my-container>
</template>

<script>
import MyDictionaryType from './type'
import MyDictionaryData from './data'

/**
 * 数据字典类型
 */
export default {
  name: 'Dictionary',
  _sync: {
    disabled: false,
    title: '数据字典',
    desc: '数据字典',
    cache: true
  },
  components: { MyDictionaryType, MyDictionaryData },
  data() {
    return {
      dictionaryTypeId: null
    }
  },
  mounted() {
  },
  beforeUpdate() {
  },
  methods: {
    onCurrentChange(currentRow, oldCurrentRow) {
      this.dictionaryTypeId = currentRow.id
    }
  }
}
</script>
