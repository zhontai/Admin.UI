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
              placeholder="岗位名称"
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
        v-loading="listLoading"
        :data="data"
        :highlight-current-row="!multiple"
        height="'100%'"
        style="width: 100%;height:100%;"
        @current-change="onCurrentChange"
        @row-dblclick="onSure"
        @selection-change="onSelectionChange"
      >
        <el-table-column v-if="multiple" type="selection" width="50" />
        <el-table-column prop="name" label="岗位名称" width />
        <el-table-column prop="code" label="编码" width />
      </el-table>

      <!--分页-->
      <template #footer>
        <my-pagination
          ref="pager"
          :total="total"
          @get-page="getData"
        />
      </template>
    </my-container>
    <template #footer>
      <el-button @click.native="onCancel">取消</el-button>
      <el-button type="primary" @click="onSure">确定</el-button>
    </template>
  </my-window>
</template>

<script>
import { formatTime } from '@/utils'
import positionApi from '@/api/admin/position'
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
      data: [],
      total: 0,
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
      this.$refs.pager.setPage(1)
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
      var pager = this.$refs.pager.getPager()
      const params = {
        ...pager,
        filter: this.filter
      }
      this.listLoading = true
      const res = await positionApi.getPage(params)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      this.total = res.data.total
      this.data = res.data.list
    }
  }
}
</script>
