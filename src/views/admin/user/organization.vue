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
import { mapMutations } from 'vuex'

export default {
  name: 'MyPageOrg',
  _sync: {
    disabled: true
  },
  data() {
    return {
      filterText: '',
      tree: [],
      pageLoading: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    console.log('111')
    this.setOrgId(null)
  },
  mounted() {
    console.log('222')
    this.getList()
  },
  methods: {
    ...mapMutations('admin/user', {
      setOrgId: 'setOrgId'
    }),
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
        // this.$nextTick(() => {
        //   document.querySelector('.el-tree-node__content:first-child')?.click()
        // })
        // this.$nextTick(() => {
        //   this.$refs.tree.setCurrentNode(this.tree[0])
        // })
      }
    },
    onCurrentChange(currentNodeData) {
      if (currentNodeData?.id > 0) {
        this.setOrgId(currentNodeData.id)
      }
    }
  }
}
</script>
