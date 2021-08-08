<template>
  <my-window
    :title="title"
    :modal="modal"
    :wrapper-closable="true"
    :modal-append-to-body="modalAppendToBody"
    :visible.sync="visible"
    destroy-on-close
    embed
    drawer
    size="100%"
    drawer-body-style="padding:0px;height: calc(100% - 61px);"
    :before-close="onCancel"
    @opened="onSearch"
  >
    <my-container v-loading="pageLoading" style="height: 100%;">
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
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </template>

      <!--列表-->
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="tree"
        row-key="id"
        :default-expand-all="true"
        highlight-current-row
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        height="'100%'"
        style="width: 100%;height:100%;"
        @current-change="onCurrentChange"
        @row-dblclick="onSure"
        @select-all="onSelectAll"
        @select="onSelect"
      >
        <el-table-column v-if="multiple" type="selection" width="50" />
        <el-table-column prop="name" label="部门名称" width />
        <el-table-column prop="code" label="部门编码" width />
      </el-table>
    </my-container>
    <template #footer>
      <el-button @click.native="onCancel">取消</el-button>
      <el-button type="primary" @click="onSure">确定</el-button>
    </template>
  </my-window>
</template>

<script>
import { formatTime, treeToList, listToTree } from '@/utils'
import { getList } from '@/api/personnel/organization'
import MyContainer from '@/components/my-container'
import MyWindow from '@/components/my-window'

export default {
  name: 'MySelectPosition',
  components: { MyContainer, MyWindow },
  props: {
    title: {
      type: String,
      default: '选择岗位'
    },
    visible: {
      type: Boolean,
      default: false
    },
    form: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: false
    },
    modalAppendToBody: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      filter: {
        name: ''
      },
      tree: [],
      listLoading: false,
      pageLoading: false,
      currentRow: null,
      sels: []
    }
  },
  methods: {
    // 取消
    onCancel() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    // 确定
    onSure() {
      this.$emit('click', this.form, this.multiple ? this.sels : this.currentRow)
    },
    onSearch() {
      this.getData()
    },
    onCurrentChange(row) {
      this.currentRow = row
    },
    onSelectionChange(sels) {
      this.sels = sels
    },
    formatCreatedTime: function(row, column, time) {
      return formatTime(time, 'YYYY-MM-DD HH:mm')
    },
    // 获取数据
    async getData() {
      const para = {
        key: this.filter.name
      }
      this.listLoading = true
      const res = await getList(para)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      this.tree = listToTree(res.data)
    },
    onSelectAll: function(selection) {
      const selections = treeToList(selection)
      const rows = treeToList(this.tree)
      const checked = selections.length === rows.length
      rows.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row, checked)
      })

      this.sels = this.$refs.multipleTable.selection
    },
    onSelect: function(selection, row) {
      const checked = selection.some(s => s.id === row.id)
      if (row.children && row.children.length > 0) {
        const rows = treeToList(row.children)
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, checked)
        })
      }

      this.sels = this.$refs.multipleTable.selection
    }
  }
}
</script>
