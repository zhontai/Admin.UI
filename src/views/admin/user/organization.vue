<template>
  <my-container>
    <template #header>
      <el-input
        v-model="filterText"
        placeholder="筛选部门"
        clearable
      />
    </template>
    <el-tree
      ref="tree"
      :props="{
        label: 'name'
      }"
      :data="tree"
      node-key="id"
      default-expand-all
      highlight-current
      :expand-on-click-node="false"
      :indent="16"
      :filter-node-method="filterNode"
      @current-change="onCurrentChange"
    />
  </my-container>
</template>

<script>
import { listToTree } from '@/utils/tree'
import orgApi from '@/api/admin/organization'

export default {
  name: 'MyOrg',
  _sync: {
    disabled: false,
    title: '部门管理',
    desc: '',
    cache: true
  },
  data() {
    return {
      filterText: '',
      tree: [],
      listLoading: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 获取列表
    async getList() {
      this.listLoading = true
      const res = await orgApi.getList()
      this.listLoading = false

      if (!res?.success) {
        return
      }

      const list = _.cloneDeep(res.data)
      list.forEach(d => {
        d._loading = false
      })
      this.tree = listToTree(list)
    },
    onCurrentChange(currentNodeData) {
      this.$emit('current-change', currentNodeData)
    }
  }
}
</script>
