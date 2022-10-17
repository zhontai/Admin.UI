<template>
  <my-container v-loading="pageLoading">
    <!--查询-->
    <template #header>
      <el-form class="ad-form-query" :inline="true" :model="filter" @submit.native.prevent>
        <el-form-item>
          <el-input
            v-model="filter.topic"
            placeholder="任务名称"
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
      :data="tasks"
      highlight-current-row
      height="'100%'"
      style="width: 100%;height:100%;"
    >
      <template #empty>
        <el-empty :image-size="100" />
      </template>
      <el-table-column prop="id" label="任务编号" width="120" />
      <el-table-column prop="topic" label="任务名称" min-width="120" />
      <el-table-column prop="status" label="任务状态" width="80">
        <template #default="{row}">
          <el-tag v-if="row.status === 0 || row.status === 'Running'" disable-transitions>运行中</el-tag>
          <el-tag v-if="row.status === 1 || row.status === 'Paused'" type="info" disable-transitions>暂停</el-tag>
          <el-tag v-if="row.status === 2 || row.status === 'Completed'" type="success" disable-transitions>完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="round" label="运行次数" width="80" />
      <el-table-column prop="currentRound" label="当前次数" width="80" />
      <el-table-column prop="body" label="任务数据" min-width="180" />
      <el-table-column prop="interval" label="定时类型" width="100" :formatter="formatInterval" />
      <el-table-column prop="intervalArgument" label="定时参数" min-width="180" />
      <el-table-column prop="errorTimes" label="失败次数" width="80" />
      <el-table-column prop="createdTime" label="创建时间" :formatter="formatCreatedTime" width="100" />
      <el-table-column prop="lastRunTime" label="最后运行时间" :formatter="formatCreatedTime" width="100" />
      <el-table-column
        fixed="right"
        label="操作"
        width="180"
      >
        <template #default="{ row }">
          <el-button v-if="checkPermission(['api:admin:task-log:get-page'])" type="text" size="small" icon="el-icon-tickets" @click="onLog(row)">日志</el-button>
          <my-confirm-button
            v-if="checkPermission(['api:admin:task:resume']) && (row.status === 1 || row.status === 'Paused')"
            type="text"
            icon="el-icon-caret-right"
            placement="bottom-end"
            :loading="row._loadingStart"
            @valid.stop
            @click="onStart(row)"
          >
            <template #default>启动</template>
            <template #content>
              <p>确定要启动吗？</p>
            </template>
          </my-confirm-button>
          <my-confirm-button
            v-if="checkPermission(['api:admin:task:pause']) && (row.status === 0 || row.status === 'Running')"
            type="text"
            icon="el-icon-video-pause"
            placement="bottom-end"
            :loading="row._loadingPause"
            @valid.stop
            @click="onPause(row)"
          >
            <template #default>暂停</template>
            <template #content>
              <p>确定要暂停吗？</p>
            </template>
          </my-confirm-button>
          <my-confirm-button
            v-if="checkPermission(['api:admin:task:run'])"
            type="text"
            icon="el-icon-s-promotion"
            placement="bottom-end"
            :loading="row._loadingRun"
            @valid.stop
            @click="onRun(row)"
          >
            <template #default>执行</template>
            <template #content>
              <p>确定要执行吗？</p>
            </template>
          </my-confirm-button>
          <my-confirm-button
            v-if="checkPermission(['api:admin:task:delete'])"
            type="text"
            icon="el-icon-delete"
            placement="bottom-end"
            :loading="row._loading"
            @valid.stop
            @click="onDelete(row)"
          >
            <template #default>删除</template>
            <template #content>
              <p>确定要删除吗？</p>
            </template>
          </my-confirm-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <template #footer>
      <my-pagination
        ref="pager"
        :total="total"
        @get-page="getTasks"
      />
    </template>

    <my-window
      v-if="checkPermission(['api:admin:task-log:get-page'])"
      :title="`${currentRow.topic}${currentRow.id}运行日志`"
      embed
      drawer
      direction="ltr"
      :visible.sync="logVisible"
      :wrapper-closable="true"
      @close="logVisible = false"
    >
      <task-log :task-id="currentRow.id" />
      <template #footer>
        <el-button @click.native="logVisible = false">取消</el-button>
      </template>
    </my-window>
  </my-container>
</template>

<script>
import { formatTime } from '@/utils'
import taskApi from '@/api/admin/task'
import MyWindow from '@/components/my-window'
import TaskLog from './log'
import MyConfirmButton from '@/components/my-confirm-button'

export default {
  name: 'Task',
  _sync: {
    disabled: false,
    title: '任务管理',
    desc: '',
    cache: true
  },
  components: {
    MyWindow,
    TaskLog,
    MyConfirmButton
  },
  data() {
    return {
      filter: {
        topic: ''
      },
      tasks: [],
      total: 0,
      listLoading: false,
      pageLoading: false,
      logVisible: false,
      currentRow: {},
      config: {
        'headers': {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    }
  },
  mounted() {
    this.getTasks()
  },
  methods: {
    formatInterval: function(row, column, value) {
      let label = ''
      switch (value) {
        case 1:
        case 'SEC':
          label = '按秒触发'
          break
        case 11:
        case 'RunOnDay':
          label = '每天'
          break
        case 12:
        case 'RunOnWeek':
          label = '每星期几'
          break
        case 13:
        case 'RunOnMonth':
          label = '每月第几天'
          break
        case 21:
        case 'Custom':
          label = '自定义'
          break
      }
      return label
    },
    formatCreatedTime: function(row, column, time) {
      return formatTime(time, 'YYYY-MM-DD HH:mm:ss')
    },
    onSearch() {
      this.$refs.pager.setPage(1)
      this.getTasks()
    },
    // 获取任务列表
    async getTasks() {
      var pager = this.$refs.pager.getPager()
      const params = {
        ...pager,
        filter: this.filter
      }
      this.listLoading = true
      const res = await taskApi.getPage(params)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      this.total = res.data.total
      const data = res.data.list
      data.forEach(d => {
        d._loading = false
        d._loadingStart = false
        d._loadingPause = false
        d._loadingRun = false
      })
      this.tasks = data
    },
    // 查看日志
    onLog(row) {
      this.currentRow = row
      this.logVisible = true
    },
    // 启动
    async onStart(row) {
      row._loadingStart = true
      var data = new FormData()
      data.append('id', row.id)
      const res = await taskApi.resume(data, this.config)
      row._loadingStart = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: '启动成功',
        type: 'success'
      })
      this.getTasks()
    },
    // 暂停
    async onPause(row) {
      row._loadingPause = true
      var data = new FormData()
      data.append('id', row.id)
      const res = await taskApi.pause(data, this.config)
      row._loadingPause = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: '暂停成功',
        type: 'success'
      })
      this.getTasks()
    },
    // 运行
    async onRun(row) {
      row._loadingRun = true
      var data = new FormData()
      data.append('id', row.id)
      const res = await taskApi.run(data, this.config)
      row._loadingRun = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: '运行成功',
        type: 'success'
      })
      this.getTasks()
    },
    // 删除
    async onDelete(row) {
      row._loading = true
      const para = { id: row.id }
      const res = await taskApi.deleteAsync(para)
      row._loading = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: this.$t('admin.deleteOk'),
        type: 'success'
      })
      this.getTasks()
    }
  }
}
</script>
