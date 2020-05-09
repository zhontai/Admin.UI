<template>
  <section style="padding:20px 80px 0px 8px;">
    <el-timeline>
      <el-timeline-item timestamp="版本 1.2.0" placement="top">
        <el-card>
          <h4>修复 文档管理-刷新文档不清除当前选中行</h4>
          <h4>修复 文档管理-上传图片后无法预览和删除</h4>
          <h4>修复 切换用户登录头像为空不刷新</h4>
          <h4>修复 用户配置无首页时，登录后显示页面不存在</h4>
          <h4>优化 文档管理自动保存</h4>
          <h4>优化 后台实体接口使用TKey类型约束</h4>
          <h4>调整 将实体层基类移动到通用层BaseModel文件夹</h4>
          <h4>调整 删除Img接口，将上传头像移动到用户接口</h4>
          <h4>调整 UtilConvert命名空间由Admin.Core更改为Admin.Core.Common.Helpers</h4>
          <p>小雪转中雪 提交于 2020-5-9</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="版本 1.1.2" placement="top">
        <el-card>
          <h4>新增 文档管理 图片删除和预览功能</h4>
          <h4>新增 文档管理 支持代码块vs高亮</h4>
          <h4>优化 文档管理 文档和图片选项卡切换后还原滚动位置</h4>
          <h4>优化 文档管理 上传图片增加上传提示</h4>
          <h4>优化 文档管理 图片管理图片等比例显示</h4>
          <h4>修复 文档管理 切换页面回来直接插入图片错乱问题</h4>
          <h4>修复 文档管理 本地上传图片使用雪花Id生成文件名出现重复的问题</h4>
          <p>小雪转中雪 提交于 2020-5-6</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="版本 1.1.1" placement="top">
        <el-card>
          <h4>新增 文档管理-文档图片上传功能，支持多图上传和懒加载</h4>
          <h4>新增 Markdown编辑器支持图片选择插入功能</h4>
          <h4>修复 Centos部署后无法读取Data.json的问题</h4>
          <h4>修复 启用事物Sqlite修改用户锁库的问题</h4>
          <h4>调整 将实体层输入输出文件夹移动到通用层</h4>
          <h4>优化 文档管理自动保存，支持Html保存</h4>
          <h4>优化 验证码静态操作变更为单例操作，appconfig增加验证码字体配置</h4>
          <p>小雪转中雪 提交于 2020-5-1</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="版本 1.1.0" placement="top">
        <el-card>
          <h4>升级 element-ui到 2.13.1 版本</h4>
          <h4>新增 文档管理界面，所见即所得编辑，支持自动保存</h4>
          <h4>新增 个人设置 - 头像上传，支持登录验证，上传配置支持热更新</h4>
          <h4>新增 首页选项卡支持卡片模式</h4>
          <!-- <h4>新增 登录日志和操作日志展开详情</h4> -->
          <!-- <h4>新增 分页组件、容器组件、MarkDown组件、布局-选项卡组件</h4> -->
          <h4>新增 分页组件、容器组件、Markdown组件</h4>
          <h4>优化 布局样式全局修改为范围，导航菜单折叠后菜单项高度和图标间距不协调的问题</h4>
          <h4>优化 去除 slot="name" slot-scope="scope"语法，统一使用 v-slot:name="scope" 或 #name="{scope}"</h4>
          <h4>调整 所有分页界面使用容器组件布局，用户管理角色查询优化</h4>
          <h4>调整 移除布局视图滚动组件，实现容器组件表格满屏显示</h4>
          <h4>调整 将Element分页控件替换为Admin分页控件，小屏自动显示极简分页</h4>
          <p>小雪转中雪 提交于 2020-4-25</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="版本 1.0.1" placement="top">
        <el-card>
          <h4>新增 日志管理-登录日志和操作日志</h4>
          <h4>优化 数据同步使用事物，数据同步SqlServer自增长处理。更新NuGet包到最新版本。</h4>
          <p>小雪转中雪 提交于 2020-3-28</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="版本 1.0.0" placement="top">
        <el-card>
          <h4>新增 更新日志</h4>
          <h4>新增 缓存管理，手动清除缓存</h4>
          <h4>修复 接口管理-同步Api异常问题</h4>
          <p>小雪转中雪 提交于 2020-3-24</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <el-backtop target=".container .main" :visibility-height="200" />
  </section>
</template>

<script>
export default {
  name: 'Welcome',
  data() {
    return {

    }
  }
}
</script>

<style scoped>
h2,h3,h4,h5 {
    font-weight: 400;
    color: #1f2f3d;
    margin-top: 0px;
    margin-bottom: 10px;
}
p {
    font-size: 14px;
    color: #5e6d82;
    line-height: 1.5em;
    margin-bottom: 0px;
}
.el-timeline{
  padding-left: 15px;
}
</style>
