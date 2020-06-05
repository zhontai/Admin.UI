<template>
  <section style="padding:20px 80px 0px 8px;">
    <el-timeline>
      <el-timeline-item timestamp="版本 1.3.3" placement="top">
        <el-card>
          <h4>新增 token以旧换新</h4>
          <h4>新增 高级查询时间段支持月、日、时和分</h4>
          <h4>新增 高级查询时间段和非时间段切换</h4>
          <h4>优化 高级查询字段为时间类型时输入框宽度优化</h4>
          <h4>优化 el日期控件过大调整为正常比例显示</h4>
          <h4>调整 Ip限流默认关闭</h4>
          <p>小雪转中雪 提交于 2020-6-5</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="版本 1.3.2" placement="top">
        <el-card>
          <h4>新增 查询组件my-search</h4>
          <h4>新增 用户管理使用查询组件查询</h4>
          <h4>新增 高级查询日期数据类型增加时间段</h4>
          <h4>新增 全局混入mixin，混入权限检查方法</h4>
          <h4>新增 界面所有操作受权限控制</h4>
          <h4>新增 权限管理权限点，用于字段粒度控制</h4>
          <h4>优化 高级查询支持字段和操作符默认值，日期时间段查询处理</h4>
          <h4>修复 部分环境npm run serve提示安装分页错误</h4>
          <p>小雪转中雪 提交于 2020-5-31</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="版本 1.3.1" placement="top">
        <el-card>
          <h4>新增 接口、服务和仓储测试</h4>
          <h4>新增 Ip限流，支持内存和Redis缓存</h4>
          <h4>新增 权限管理增加权限编码字段，接口表单增加权限编码保存</h4>
          <h4>新增 权限指令v-permission="'权限编码'" 或 v-permission="{ permission: '权限编码', disabled:true }"</h4>
          <h4>新增 权限检查方法v-if="checkPermission('权限编码')"</h4>
          <h4>修复 高级查询窗口点击关闭按钮，无法再打开高级查询窗口的问题</h4>
          <h4>修复 表格在部分浏览器无法满屏的问题</h4>
          <p>小雪转中雪 提交于 2020-5-28</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="版本 1.3.0" placement="top">
        <el-card>
          <h4>升级 element-ui到 2.13.2 版本</h4>
          <h4>新增 高级查询组件：my-search-filter，高级查询窗口组件：my-search-window</h4>
          <h4>新增 api增加范围scope管理</h4>
          <h4>新增 HtmlHelper帮助类</h4>
          <!-- <h4>新增 用户refresh_token获取新的access_token</h4> -->
          <h4>新增 角色权限-选择菜单或接口反向勾选所属菜单</h4>
          <h4>新增 utils.getListParents增加includeSelf参数返回自身，增加getTreeParentsWithSelf方法。</h4>
          <h4>优化 所有错误消息在响应拦截处理，可手动关闭错误提示</h4>
          <h4>优化 utils.getTreeParents传入不存在id返回空数组</h4>
          <h4>优化 事物拦截，判断逻辑更简单</h4>
          <h4>调整 components组件名称按照my-component命名</h4>
          <p>小雪转中雪 提交于 2020-5-23</p>
        </el-card>
      </el-timeline-item>
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
