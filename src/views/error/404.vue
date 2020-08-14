<template>
  <div class="result">
    <div class="result-title">404</div>
    <div class="result-subtitle">抱歉，你访问的页面不存在。</div>
    <div class="result-extra">
      <router-link to="/">
        <el-button type="primary">返回首页</el-button>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .result{
    padding-top:48px;
  }
  .result-title{
    color: rgba(0,0,0,.85);
    font-size: 24px;
    line-height: 1.8;
    text-align: center;
  }
  .result-subtitle {
    color: rgba(0,0,0,.45);
    font-size: 14px;
    line-height: 1.6;
    text-align: center;
  }
  .result-extra {
    margin-top: 32px;
    text-align: center;
  }
</style>
