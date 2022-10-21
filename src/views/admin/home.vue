<template>
  <section class="wrap">
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item title="2022年" name="2022">
        <el-timeline>
          <el-timeline-item timestamp="版本 2.2.1" placement="top">
            <el-card>
              <h4>后端：</h4>
              <h4>新增 appconfig新增validate权限验证配置，支持匿名、登录、授权访问设置</h4>
              <h4>新增 dbconfig新增assemblyNames程序集配置</h4>
              <h4>修复 租户登录后设置角色菜单，菜单未正确显示的问题</h4>
              <h4>优化 dbconfig多数据库配置</h4>
              <h4>后端项目模板：</h4>
              <h4>升级 项目模板ZhonTai.Template升至2.2.1</h4>
              <h4>新增 支持权限数据库admindb和模块项目数据库appdb分离</h4>
              <h4>新增 生成项目参数-md | --merge-db true 合并数据库，-ms | --micro-service true 设置项目为微服务项目，支持匿名访问api</h4>
              <h4>修复 设置无新版接口文档时，没有使用swagger文档显示的问题</h4>
              <p>小雪转中雪 提交于 2022-10-20</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="版本 2.2.0" placement="top">
            <el-card>
              <h4>后端：</h4>
              <h4>新增 角色数据权限，实体数据权限接口IData</h4>
              <h4>新增 本人过滤器FilterNames.Self，本人或部门过滤器FilterNames.Data</h4>
              <h4>新增 支持分布式事务TCC/Saga</h4>
              <h4>新增 任务调度服务，支持任务删除、暂停、启动、立即运行、查看日志功能</h4>
              <h4>新增 用户服务根据部门查询用户，新增用户支持多部门和主属部门设置</h4>
              <h4>新增 角色服务新增角色分组，根据角色查询员工、批量添加员工和移除员工功能</h4>
              <h4>新增 租户服务数据库键名配置，支持共享主库或其它独立数据库</h4>
              <h4>新增 appconfig.json新增默认密码配置</h4>
              <h4>新增 dbconfig.json新增读写分离从库列表、指定程序集、分布式事务唯一标识配置</h4>
              <h4>新增 支持tidb数据库方法services.AddTiDb</h4>
              <h4>修改 dbconfig.json多数库使用模式</h4>
              <h4>更新 Freesql Orm至3.2.682，其它nuget包到最新版本</h4>
              <h4>优化 支持只生成模块表数据库</h4>
              <h4>优化 用户、部门、角色cud数据时增加数据验证</h4>
              <h4>升级 项目模板ZhonTai.Template升级为v2.2.0</h4>
              <h4>修复 密码加密使用Encrypt32丢失0的问题</h4>
              <h4>前端：</h4>
              <h4>新增 任务管理，支持任务查询、暂停、启动、立即运行、删除、查看日志功能</h4>
              <h4>新增 新增树形列表工具tree.json</h4>
              <h4>新增 规则校验test.js</h4>
              <h4>新增 my-container容器支持左侧和右侧布局</h4>
              <h4>新增 my-select-window下新增员工user、部门org、角色role窗口选择组件</h4>
              <h4>新增 角色管理新增角色分组、设置数据权限、角色用户列表、添加员工、移除员工功能</h4>
              <h4>新增 租户新增数据库注册键名，删除空闲时间设置</h4>
              <h4>修改 权限表格树组件更改成树形组件，支持任意级横向显示</h4>
              <h4>移除 移除员工管理、职位管理界面</h4>
              <p>小雪转中雪 提交于 2022-10-18</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="版本 2.1.1 - 2.1.3" placement="top">
            <el-card>
              <h4>新增 Configs目录新增createdbsql.txt文件用于创建数据库脚本单独配置</h4>
              <h4>修复 滑块验证码未加过期时间的问题</h4>
              <h4>修改 IdleScheduler任务调度组件改名为FreeScheduler</h4>
              <h4>更新 nuget包到最新版本</h4>
              <h4>新增 Api支持按项目分组</h4>
              <p>小雪转中雪 提交于 2022-07-23 - 2022-07-27</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="版本 2.1.0" placement="top">
            <el-card>
              <h4>新增 任务调度TaskScheduler功能</h4>
              <h4>调整 HostApp移除自带新版ApiUI功能，通过配置中间件方法自行引用</h4>
              <h4>调整 ZhonTai.Admin包移除Freesql数据库引用，项目模板按需引入</h4>
              <h4>调整 HostAppOptions.ConfigureEntity更改为ConfigureFreeSql</h4>
              <h4>调整 CacheKey更改为CacheKeys并移动到Core/Consts目录</h4>
              <h4>修复 命令台实时Sql显示重复的问题</h4>
              <h4>修复 缓存管理无法读取App项目缓存键的问题，App项目CacheKeys类上添加扫描特性[ScanCacheKeys]可被自动扫描</h4>
              <p>小雪转中雪 提交于 2022-07-22</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="版本 2.0.1 - 2.0.10" placement="top">
            <el-card>
              <h4>新增 HostApp动态Api和雪花漂移算法配置</h4>
              <h4>新增 用户刷新Token方法新增验签处理</h4>
              <h4>新增 启动服务支持配置实体映射优先级和实体配置</h4>
              <h4>新增 中间件注入</h4>
              <h4>新增 启动服务配置，支持前、中、后服务注入</h4>
              <h4>新增 AppConfig支持应用程序类型配置，默认纯WebApi应用程序</h4>
              <h4>新增 ZhonTai.Host站点项目</h4>
              <h4>新增 动态WebApi，api命名支持camelCase、PascalCase、snake_case、kebab-case和extension.case</h4>
              <h4>新增 新版Api UI项目ZhonTai.ApiUI，内嵌前端Api代码生成</h4>
              <h4>新增 除员工、职位、部门服务外，全部服务为动态WebApi</h4>
              <p>小雪转中雪 提交于 2022-06-02 - 2022-07-18</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="版本 2.0.0" placement="top">
            <el-card>
              <h4>后端：</h4>
              <h4>升级 Admin为.Net 6.0项目，FreeSql到3.2.500，其它包更新到最新版本</h4>
              <h4>新增 ZhonTai.Host站点项目</h4>
              <h4>新增 动态WebApi，api命名支持camelCase、PascalCase、snake_case、kebab-case和extension.case</h4>
              <h4>新增 新版Api UI项目ZhonTai.ApiUI，内嵌前端Api代码生成</h4>
              <h4>新增 除员工、职位、部门服务外，全部服务为动态WebApi</h4>
              <h4>新增 支持.Net6.0版本启动和集成测试</h4>
              <h4>新增 SwaggerUI支持性能分析</h4>
              <h4>优化 实体、仓储、服务和工具项目合并为ZhonTai.Admin项目</h4>
              <h4>优化 租户和非租户导入、导出数据，将一个数据文件拆分为多个模块数据文件</h4>
              <h4>优化 ZhonTai.Common项目部分功能迁移到ZhonTai.Admin.Core中</h4>
              <h4>前端：</h4>
              <h4>新增 所有api使用新版Api UI项目生成，新增api自定义module.extend.js</h4>
              <h4>修复 vue版滑块验证组件导致界面文本不能选择的问题，修复拖拽事件触发不合理问题</h4>
              <h4>认证端：</h4>
              <h4>升级 IdentityServer为.Net 6.0项目，Freesql到3.2.500，其它包更新到最新版本</h4>
              <h4>新增 2.0版本滑块获取和检查接口</h4>
              <h4>修复 登录失败有可能无法再登录的问题</h4>
              <h4>修复 jquery版滑块验证组件导致界面文本不能选择的问题，修复拖拽事件触发不合理问题</h4>
              <p>小雪转中雪 提交于 2022-04-17</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-collapse-item>
      <el-collapse-item title="2021年" name="2021">
        <el-timeline>
          <el-timeline-item timestamp="版本 1.7.1" placement="top">
            <el-card>
              <h4>前端：</h4>
              <h4>升级 element-ui到2.15.6</h4>
              <h4>新增 滑块验证组件，支持浮动式、嵌入式、弹出式，同时兼容移动端体验</h4>
              <h4>新增 登录使用滑块验证登录</h4>
              <h4>修复 使用my-window组件点击关闭按钮关闭后无法再次打开的问题</h4>
              <h4>后端：</h4>
              <h4>升级 Freesql到2.6.100，更新其它nuget包到最新版本</h4>
              <h4>新增 Admin.Tools工具库，滑块验证功能，支持干扰图生成，随机6套滑块拼图模型生成</h4>
              <h4>新增 IFreeSql拓展方法GetRepositoryBase返回自定义拓展仓库基础类</h4>
              <h4>新增 测试接口GetResult、PostResult、PutResult、DeleteResult便捷方法</h4>
              <h4>新增 登录使用滑块验证作为安全验证</h4>
              <h4>新增 允许任何源访问Api策略，暴露验证接口</h4>
              <h4>新增 测试库使用滑块验证登录</h4>
              <h4>修复 path同步时做大小写处理，导致组件无法加载的问题</h4>
              <h4>修复 没有配置跨域异常的问题</h4>
              <h4>优化 DictionaryExtensions拓展方法</h4>
              <h4>优化 权限管理更新权限点或者删除权限都将清除权限下关联的用户权限缓存</h4>
              <p>小雪转中雪 提交于 2021-09-04</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="版本 1.3.0" placement="top">
            <el-card>
              <h4>认证端：</h4>
              <h4>升级 Freesql到2.6.100，更新其它nuget包到最新版本</h4>
              <h4>新增 Js版滑块验证插件，支持浮动式、嵌入式、弹出式，同时兼容移动端体验</h4>
              <h4>新增 登录接口使用滑块验证作为安全验证</h4>
              <h4>新增 切换租户登录演示</h4>
              <h4>新增 appsettings.json增加滑块验证检查地址配置</h4>
              <p>小雪转中雪 提交于 2021-09-04</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="版本 1.7.0" placement="top">
            <el-card>
              <h4>前端：</h4>
              <h4>升级 element-ui到2.15.5，更新部分npm包到最新版本</h4>
              <h4>新增 人事管理板块-员工管理、岗位管理和部门管理</h4>
              <h4>新增 数据字典管理：包含字典类型和字典数据视图</h4>
              <h4>新增 拖拽指令v-draggable和更改尺寸指令v-resizable，更改尺寸指令增加触发窗口change事件，触发组件重新布局</h4>
              <h4>新增 my-window窗口组件，支持dialog对话框和drawer抽屉自由切换。窗口支持页眉、页脚、代理窗口拖拽。更改尺寸支持8个方向拖拽。窗口拖拽边界和更改尺寸边界自动计算。抽屉窗口支持自动全屏展示。抽屉窗口支持上下左右4个方向拖拽更改尺寸。</h4>
              <h4>新增 岗位和部门选择组件</h4>
              <h4>新增 角色权限角色列表分页功能</h4>
              <h4>新增 视图同步信息_sync对象</h4>
              <h4>新增 视图同步功能，优化视图路径和视图命名</h4>
              <h4>新增 npm安装脚本</h4>
              <h4>新增 首页导航栏更改尺寸，文档管理分栏支持拖拽更改尺寸</h4>
              <h4>新增 个人设置已适应全屏展示，表单数据支持独立滚动</h4>
              <h4>调整 用户新增和修改下拉数据将从select数据中绑定，select数据直接同表单数据一并返回</h4>
              <h4>调整 将个性化分页和对话框组件移动到element-ui文件夹</h4>
              <h4>修改 my-markdown-editor组件使其支持@toast-ui/editor最新版本</h4>
              <h4>修改 所有界面弹出框统一使用my-window组件</h4>
              <h4>修改 权限管理删除接口操作，新增权限点可关联多接口</h4>
              <h4>修改 视图命名</h4>
              <h4>修改 空闲时间（分）最小值为0</h4>
              <h4>修复 请求路径使用query参数访问不断新增选项卡的问题</h4>
              <h4>修复 窗口表单下拉弹出层被遮挡的问题</h4>
              <h4>修复 分页禁用鼠标悬浮还高亮的问题</h4>
              <h4>删除 表格行索引</h4>
              <h4>优化 租户权限保存，设置权限保存时增加等待效果</h4>
              <h4>后端：</h4>
              <h4>更新 Nuget包到最新版本</h4>
              <h4>更新 数据包data.json</h4>
              <h4>新增 租户权限和字典类型模块</h4>
              <h4>新增 人事板块-员工、部门和岗位模块</h4>
              <h4>新增 租户权限、字典类型、员工、岗位和部门数据的导入和导出</h4>
              <h4>新增 基础仓储IRepositoryBase泛型注入，递归删除和递归软删除方法</h4>
              <h4>新增 租户管理设置权限功能，设置权限后同时删除租户关联的角色权限</h4>
              <h4>新增 权限点支持关联多接口功能</h4>
              <h4>新增 同步视图功能，优化视图路径和视图命名</h4>
              <h4>新增 基础服务BaseService通过属性懒加载获取获取实例的方法</h4>
              <h4>修改 数据字典重做，调整为数据字典类型和字典数据管理</h4>
              <h4>修改 IdleBus单例空闲时间回收设置逻辑</h4>
              <h4>修改 缓存键格式</h4>
              <h4>修复 token以旧换新异常的问题</h4>
              <h4>修复 非租户模式下导出数据包异常的问题</h4>
              <h4>修复 IpRateLimit更新最新版本异常的问题</h4>
              <h4>移除 角色权限仓储和用户角色仓储</h4>
              <h4>优化 租户设置权限限定租户权限范围，防止租户非法授权</h4>
              <h4>优化 雪花漂移算法新增是否启用判断</h4>
              <h4>优化 swagger api输入输出类同名无法加载的问题</h4>
              <p>小雪转中雪 提交于 2021-08-08</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="版本 1.6.2" placement="top">
            <el-card>
              <h4>后端：</h4>
              <h4>更新 nuget包到最新版本</h4>
              <h4>新增 租户共享数据包data-share.json</h4>
              <h4>新增 租户数据隔离，支持独立数据库和共享数据库</h4>
              <h4>新增 缓存接口获取并设置缓存方法</h4>
              <h4>新增 用户信息缓存，用户登录缓存用户信息</h4>
              <h4>新增 租户彻底删除接口</h4>
              <h4>新增 更新用户基本信息，清除用户缓存</h4>
              <h4>新增 字符串拓展格式化对象功能</h4>
              <h4>新增 基础服务BaseService缓存和日志懒加载服务</h4>
              <h4>新增 数据库实例空闲回收设置，设置为0则不回收</h4>
              <h4>修复 接口和文档获取单条数据接口异常的问题</h4>
              <h4>修复 非租户模式下没有权限的问题</h4>
              <h4>修复 刷新token异常</h4>
              <h4>调整 租户共享全局过滤器，必须携带租户Id查询</h4>
              <h4>清理 项目所有代码，删除没有使用的命名空间引用和空行，命名空间排序</h4>
              <h4>优化 服务继承BaseService，减少映射、用户、缓存和日志接口的注入</h4>
              <h4>优化 用户权限信息查询</h4>
              <h4>优化 api测试</h4>
              <h4>前端：</h4>
              <h4>升级 vue/cli到4.5.13</h4>
              <h4>升级 element-ui到2.15.2</h4>
              <h4>新增 多租户数据隔离，支持独立和共享数据库</h4>
              <h4>新增 租户彻底删除</h4>
              <h4>新增 国际化操作失败信息</h4>
              <h4>修复 权限选择框引发的脚本错误</h4>
              <h4>调整 删除导入视图组件脚本，新增路由懒加载方法</h4>
              <h4>优化 权限选择框关闭后清空之前绑定的权限</h4>
              <h4>优化 表格行更多操作的权限控制</h4>
              <p>小雪转中雪 提交于 2021-06-12</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="版本 1.6.1" placement="top">
            <el-card>
              <h4>更新 所有相关Nuget包到最新版本</h4>
              <h4>更新 数据包data.json到最新数据</h4>
              <h4>新增 租户管理，实现多租户共享数据库</h4>
              <h4>新增 ListExtensions列表拓展类支持列表转树形功能</h4>
              <h4>新增 用户删除后真删用户角色数据</h4>
              <h4>新增 角色删除后真删角色权限数据</h4>
              <h4>新增 角色唯一编码</h4>
              <h4>新增 输入模型验证异常日志</h4>
              <h4>新增 角色管理设置权限功能</h4>
              <h4>新增 基础服务BaseService提供用户信息和映射功能</h4>
              <h4>新增 租户类型用于权限控制</h4>
              <h4>调整 数据包data.json数据主键为雪花漂移Id，扁平化数据调整为树形结构数据。</h4>
              <h4>调整 角色权限列表权限范围，平台不限制，租户限制权限范围。</h4>
              <h4>修复 个人信息上传头像失败无错误提示的问题</h4>
              <h4>修复 事物同步执行，友好返回异常事物没有回滚的问题</h4>
              <h4>修复 设置权限窗口没有显示全部权限的问题</h4>
              <h4>修复 用户登录显示菜单过多的问题</h4>
              <h4>修复 数据包data.json遗漏租户类型数据的问题</h4>
              <h4>优化 角色权限界面保存逻辑更改为允许空权限保存，刷新权限禁止保存</h4>
              <h4>优化 角色权限刷新角色列表时同时刷权限列表</h4>
              <h4>优化 布局容器，标题区和操作区控制是否显示</h4>
              <h4>优化 所有菜单目录默认展开</h4>
              <h4>优化 设置权限窗口点击确定没有再次确定提示的问题</h4>
              <h4>优化 记录输入模型验证异常日志</h4>
              <p>小雪转中雪 提交于 2021-05-24</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="版本 1.5.1" placement="top">
            <el-card>
              <h4>后端：</h4>
              <h4>升级 FreeSql到2.3.106，其它Nuget包升级到最新版本。</h4>
              <h4>新增 api认证授权支持IdentityServer4 V4版本</h4>
              <h4>新增 数据库实例空闲时间（分）设置</h4>
              <h4>修改 跨域地址默认配置</h4>
              <h4>修改 NLog配置调试和警告日志将不再生成</h4>
              <h4>修复 角色权限-权限列表没有查询权限点的问题</h4>
              <h4>前端：</h4>
              <h4>升级 前端脚手架vue-cli到4.5.11，element-ui到2.15.1，其它npm包升级到最新版本。</h4>
              <h4>调整 使用dayjs替换moment日期处理库</h4>
              <h4>修复 页面生命周期钩子activated未正确执行的问题</h4>
              <h4>修复 选项卡右键菜单打开会被部分控件遮挡的问题</h4>
              <h4>优化 更新日志移动端展示效果</h4>
              <h4>优化 抽屉点击空白区域有边框显现的问题</h4>
              <p>小雪转中雪 提交于 2021-03-04</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-collapse-item>
      <el-collapse-item title="2020年" name="2020">
        <el-timeline>
          <el-timeline-item timestamp="版本 1.5.0" placement="top">
            <el-card>
              <h4>升级 后端目标框架到.Net 5.0，FreeSql到1.10.3，其它Nuget包到当前最新版本。</h4>
              <h4>升级 前端脚手架vue-cli到4.5.8，vue到2.6.12，element-ui到2.14.1，其它npm包到当前最新版本。</h4>
              <h4>新增 租户管理界面</h4>
              <h4>新增 支持多数据库操作</h4>
              <h4>新增 对话框及其遮罩支持内嵌界面</h4>
              <h4>新增 抽屉窗口及其遮罩支持内嵌界面</h4>
              <h4>更新 admin数据包data.json更新并增加租户演示数据</h4>
              <h4>优化 表索引命名自动读取表名称</h4>
              <h4>优化 后端Api权限验证增加HttpMethod校验</h4>
              <h4>修复 使用动态路径（path/:id），菜单标题组无法显示的问题</h4>
              <h4>修复 用户登录成功后获取登录信息为空无提示的问题</h4>
              <h4>修复 axios get请求通过config配置无法生效的问题</h4>
              <h4>修复 用户权限缓存数据获取失败后，无法正常访问的问题</h4>
              <h4>调整 处理请求和响应的配置统一使用config:{api:{}}</h4>
              <p>小雪转中雪 提交于 2020-11-23</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="版本 1.4.1" placement="top">
            <el-card>
              <h4>升级 Nuget包到最新版本</h4>
              <h4>升级 vue cli到4.5.3版本</h4>
              <h4>修复 在ie11下无法访问界面，get请求使用缓存导致无法登录的问题</h4>
              <h4>修复 在ie11下文档管理界面无法加载</h4>
              <h4>修复 在ie11下tabs右键菜单无法打开的问题</h4>
              <h4>修复 在ie11下前端时间格式化显示错误</h4>
              <h4>调整 将node-sass更改为sass，穿透组件样式统一使用::v-deep</h4>
              <h4>调整 测试项目用户数据，测试时用户能够成功登录</h4>
              <h4>优化 将分页组件加入到全局组件中，界面无需再导入分页组件</h4>
              <p>小雪转中雪 提交于 2020-8-14</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="版本 1.4.0" placement="top">
            <el-card>
              <h4>新增 支持JWT和IS4认证切换</h4>
              <h4>新增 集成统一认证授权项目Admin.IdentityServer</h4>
              <h4>更新 后端nuget包</h4>
              <h4>调整 data.json用户数据</h4>
              <h4>修复 分页根据条件查询后没有从第一页开始的问题</h4>
              <h4>修复 执行db方法显示启动端口不按顺序执行的问题</h4>
              <h4>修复 swagger api加权小锁弹出无输入框的问题</h4>
              <h4>修复 刷新token执行成功，请求重试执行失败会循环执行的问题</h4>
              <h4>修复 token以旧换新刷新时间不精确的问题</h4>
              <h4>修复 ip带端口验证ip不通过返回本地ip的问题</h4>
              <p>小雪转中雪 提交于 2020-7-14</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="版本 1.3.4" placement="top">
            <el-card>
              <h4>升级 vue cli到4.4.4版本，升级eslint相关插件</h4>
              <h4>新增 支持api和跨域地址多地址配置</h4>
              <h4>新增 ip帮助类增加获得mac地址方法</h4>
              <h4>优化 增加前后端iis发布部分代码注释说明</h4>
              <h4>修复 权限管理输入更改Dto编码问题</h4>
              <p>小雪转中雪 提交于 2020-6-18</p>
            </el-card>
          </el-timeline-item>
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
      </el-collapse-item>
    </el-collapse>
    <el-backtop target=".container .main" :visibility-height="200" class="backtop" />
  </section>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      activeNames: ['2022']
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-collapse) {
    border-top-width: 0px;
    border-bottom-width: 0px;
    .el-collapse-item__wrap{
      border-bottom-width: 0px;
    }
    .el-collapse-item__content{
      padding-bottom: 5px;
      line-height: unset;
    }
    .el-collapse-item__header{
      height: 38px;
      line-height: 38px;
    }
}

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

.wrap{
  padding:20px 80px 0px 25px;
}

@media screen and (max-width: 680px) {
  .wrap{
    padding:20px 8px 0px 8px;
  }

  .backtop {
    right: 5px !important;
    bottom: 5px !important;
  }
}
</style>
