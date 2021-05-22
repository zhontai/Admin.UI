<template>
  <el-drawer
    title="选择租户"
    :modal="modal"
    :wrapper-closable="true"
    :modal-append-to-body="modalAppendToBody"
    :visible.sync="visible"
    destroy-on-close
    direction="btt"
    size="100%"
    class="el-drawer__wrapper"
    style="position:absolute;"
    :before-close="onCancel"
    @opened="onSearch"
  >
    <my-container v-loading="pageLoading" style="height: calc(100% - 61px);">
      <!--查询-->
      <template #header>
        <el-form class="ad-form-query" :inline="true" :model="filter" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model="filter.name"
              placeholder="租户名"
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
        :data="tenants"
        highlight-current-row
        height="'100%'"
        style="width: 100%;height:100%;"
        @current-change="onCurrentChange"
        @row-dblclick="onSure"
      >
        <el-table-column type="index" width="80" label="#" />
        <el-table-column prop="name" label="租户名" width />
        <el-table-column prop="code" label="编码" width />
        <el-table-column prop="dbTypeName" label="数据库" width="120" />
        <el-table-column prop="idleTime" label="空闲时间（分）" width="120" />
        <el-table-column prop="createdTime" label="创建时间" :formatter="formatCreatedTime" width />
        <el-table-column prop="enabled" label="状态" width="80">
          <template #default="{row}">
            <el-tag
              :type="row.enabled ? 'success' : 'danger'"
              disable-transitions
            >{{ row.enabled ? '正常' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <template #footer>
        <my-pagination
          ref="pager"
          :total="total"
          @get-page="getTenants"
        />
      </template>
    </my-container>
    <div class="drawer-footer">
      <el-button @click.native="onCancel">取消</el-button>
      <el-button type="primary" @click="onSure">确定</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { formatTime } from '@/utils'
import { getTenantListPage } from '@/api/admin/tenant'
import MyContainer from '@/components/my-container'

export default {
  name: 'MySelectTenant',
  components: { MyContainer },
  props: {
    visible: {
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
      tenants: [],
      total: 0,
      listLoading: false,
      pageLoading: false,
      currentRow: null
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
      this.$emit('click', this.currentRow)
    },
    onSearch() {
      this.$refs.pager.setPage(1)
      this.getTenants()
    },
    onCurrentChange(row) {
      this.currentRow = row
    },
    formatCreatedTime: function(row, column, time) {
      return formatTime(time, 'YYYY-MM-DD HH:mm')
    },
    // 获取租户列表
    async getTenants() {
      var pager = this.$refs.pager.getPager()
      const params = {
        ...pager,
        filter: this.filter
      }
      this.listLoading = true
      const res = await getTenantListPage(params)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      this.total = res.data.total
      const data = res.data.list
      data.forEach(d => {
        d._loading = false
      })
      this.tenants = data
    }
  }
}
</script>
