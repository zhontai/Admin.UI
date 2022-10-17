<template>
  <my-container v-loading="pageLoading">
    <!--列表-->
    <el-table
      v-loading="listLoading"
      :data="list"
      highlight-current-row
      height="'100%'"
      style="width: 100%;height:100%;"
    >
      <template #empty>
        <el-empty :image-size="100" />
      </template>
      <el-table-column prop="round" label="当前次数" width="80" />
      <el-table-column prop="success" label="状态" width="80">
        <template #default="{row}">
          <el-tag v-if="!row.success" type="danger" disable-transitions>失败</el-tag>
          <el-tag v-else type="success" disable-transitions>成功</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="elapsedMilliseconds" label="耗时(ms)" width="80" />
      <el-table-column prop="exception" label="异常" min-width="180" />
      <el-table-column prop="Remark" label="备注" min-width="180" />
      <el-table-column prop="createTime" label="创建时间" :formatter="formatCreatedTime" width="160" />
    </el-table>

    <!--分页-->
    <template #footer>
      <my-pagination
        ref="pager"
        :total="total"
        @get-page="getList"
      />
    </template>
  </my-container>
</template>

<script>
import { formatTime } from '@/utils'
import taskLogApi from '@/api/admin/task-log'

export default {
  name: 'TaskLog',
  _sync: {
    disabled: true
  },
  props: {
    taskId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      pageLoading: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    formatCreatedTime: function(row, column, time) {
      return formatTime(time, 'YYYY-MM-DD HH:mm:ss')
    },
    // 获取列表
    async getList() {
      var pager = this.$refs.pager.getPager()
      const params = {
        ...pager,
        filter: { taskId: this.taskId }
      }
      this.listLoading = true
      const res = await taskLogApi.getPage(params)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      this.total = res.data.total
      const data = res.data.list
      this.list = data
    }
  }
}
</script>
