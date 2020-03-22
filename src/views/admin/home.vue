<template>
  <section>
    <div style="margin-top: 30px;">
      <div style="margin: 20px;">欢迎来到 Admin 后台管理系统!</div>
      <!-- <div style="margin: 20px;">
        <el-input
          v-model="textarea"
          type="textarea"
          :autosize="{ minRows: 6 }"
          placeholder="请输入内容"
          maxlength="30000"
          show-word-limit
        />
      </div> -->
    </div>
  </section>
</template>

<script>
export default {
  name: 'Welcome',
  data() {
    return {
      textarea: ''
    }
  }
}
</script>
