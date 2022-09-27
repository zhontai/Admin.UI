<template>
  <my-container v-loading="pageLoading">
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
        label: 'name',
      }"
      :data="tree"
      node-key="id"
      :current-node-key="currentNodeKey"
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

/**
 * 用户部门
 */
export default {
  name: 'MyUserOrg',
  _sync: {
    disabled: true
  },
  data() {
    return {
      filterText: '',
      tree: [],
      pageLoading: false,
      currentNodeKey: 0
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
      this.pageLoading = true
      const res = await orgApi.getList()
      this.pageLoading = false

      if (!res?.success) {
        return
      }

      const list = _.cloneDeep(res.data)
      list.forEach(d => {
        d._loading = false
      })
      this.tree = listToTree(list)
      if (this.tree?.length > 0) {
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.tree[0].id)
          this.onCurrentChange(this.tree[0])
        })
      }
    },
    onCurrentChange(currentNodeData) {
      this.$emit('change', _.cloneDeep(currentNodeData))
    }
  }
}
</script>
