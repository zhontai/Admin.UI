<template>
  <my-container>
    <!--查询-->
    <template #header>
      <el-form class="ad-form-query" :inline="true" :model="filter" @submit.native.prevent>
        <el-form-item>
          <el-input
            v-model="filter.name"
            placeholder="部门名称"
            clearable
            @keyup.enter.native="onSearch"
          >
            <template #prefix>
              <i class="el-input__icon el-icon-search" />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </template>

    <!--列表-->
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="organizationTree"
      row-key="id"
      :show-header="false"
      :default-expand-all="true"
      highlight-current-row
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      height="'100%'"
      style="width: 100%;height:100%;"
      @select-all="onSelectAll"
      @select="onSelect"
    >
      <template #empty>
        <el-empty :image-size="100" />
      </template>
      <el-table-column prop="name" label="部门名称" width="180" />
    </el-table>
  </my-container>
</template>

<script>
import { listToTree, treeToListWithChildren } from '@/utils/tree'
import orgApi from '@/api/admin/organization'

export default {
  name: 'MyOrganization',
  _sync: {
    disabled: false,
    title: '部门管理',
    desc: '',
    cache: true
  },
  data() {
    return {
      filter: {
        name: ''
      },
      organizationTree: [],
      organizations: [],
      listLoading: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 获取列表
    async getList() {
      const para = {
        key: this.filter.name
      }
      this.listLoading = true
      const res = await orgApi.getList(para)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      const list = _.cloneDeep(res.data)

      this.organizations = {
        id: 0,
        parentId: 0,
        name: '顶级',
        children: listToTree(_.cloneDeep(list))
      }

      list.forEach(d => {
        d._loading = false
      })
      const tree = listToTree(list)
      this.organizationTree = tree
    },
    onSelectAll: function(selection) {
      const selections = treeToListWithChildren(selection)
      const rows = treeToListWithChildren(this.organizationTree)
      const checked = selections.length === rows.length
      rows.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row, checked)
      })

      this.sels = this.$refs.multipleTable.selection
    },
    onSelect: function(selection, row) {
      const checked = selection.some(s => s.id === row.id)
      if (row.children && row.children.length > 0) {
        const rows = treeToListWithChildren(row.children)
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, checked)
        })
      }

      this.sels = this.$refs.multipleTable.selection
    }
  }
}
</script>
