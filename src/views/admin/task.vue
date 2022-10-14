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
      <el-table-column prop="topic" label="任务名称" width />
      <el-table-column prop="round" label="次数" width />
      <el-table-column prop="currentRound" label="当前次数" width />
      <el-table-column prop="errorTimes" label="失败次数" width />
      <el-table-column prop="status" label="任务状态" width="200">
        <template #default="{row}">
          <el-tag v-if="row.status === 0 || row.status === 'Running'" disable-transitions>运行中</el-tag>
          <el-tag v-if="row.status === 1 || row.status === 'Paused'" type="info" disable-transitions>暂停</el-tag>
          <el-tag v-if="row.status === 2 || row.status === 'Completed'" type="success" disable-transitions>完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdTime" label="创建时间" :formatter="formatCreatedTime" width />
      <el-table-column prop="lastRunTime" label="最后运行时间" :formatter="formatCreatedTime" width />
    </el-table>

    <!--分页-->
    <template #footer>
      <my-pagination
        ref="pager"
        :total="total"
        @get-page="getTasks"
      />
    </template>
  </my-container>
</template>

<script>
import { formatTime } from '@/utils'
import taskApi from '@/api/admin/task'

export default {
  name: 'Task',
  _sync: {
    disabled: false,
    title: '任务管理',
    desc: '',
    cache: true
  },
  data() {
    return {
      filter: {
        topic: ''
      },
      tasks: [],
      total: 0,
      listLoading: false,
      pageLoading: false
    }
  },
  mounted() {
    this.getTasks()
  },
  methods: {
    formatCreatedTime: function(row, column, time) {
      return formatTime(time, 'YYYY-MM-DD HH:mm')
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
      })
      this.tasks = data
    }
  }
}
</script>
