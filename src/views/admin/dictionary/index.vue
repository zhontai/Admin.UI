<template>
  <el-container class="container" style="height: 100%;">
    <el-aside class="aside">
      <dictionary-type />
    </el-aside>
    <el-main class="main" style="height:100%;">
      <dictionary-data />
    </el-main>
  </el-container>
</template>

<script>
import DictionaryType from './dictionary-type'
import DictionaryData from './dictionary'

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
  components: { DictionaryType, DictionaryData },
  data() {
    return {

    }
  },
  computed: {
  },
  mounted() {
  },
  beforeUpdate() {
  },
  methods: {

  }
}
</script>
