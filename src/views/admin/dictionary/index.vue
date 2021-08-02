<template>
  <el-container class="container" style="height: 100%;">
    <el-aside v-resizable="resizeOptions" class="aside" style="border-right: 1px solid #e6e6e6;position: relative;overflow:unset;">
      <my-dictionary-type @current-change="onCurrentChange" />
    </el-aside>
    <el-main class="main" style="height:100%;">
      <my-dictionary-data :dictionary-type-id="dictionaryTypeId" />
    </el-main>
  </el-container>
</template>

<script>
import MyDictionaryType from './type'
import MyDictionaryData from './data'
import resizable from '@/directive/resizable'

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
  directives: { resizable },
  data() {
    return {
      dictionaryTypeId: null
    }
  },
  computed: {
    resizeOptions() {
      return {
        handles: 'e',
        onlySize: true,
        minWidth: 201,
        maxWidth: 500
      }
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
