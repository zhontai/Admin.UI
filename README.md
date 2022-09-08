一个基于Vue开发的权限管理系统，后续会增加更多实用的功能。

### 在线体验
演示地址：https://www.admin.zhontai.net/

文档地址：https://www.zhontai.net/

*********************************************************
### 项目下载后，首先安装依赖包
```
npm install --legacy-peer-deps
或
npm install --registry=https://registry.npm.taobao.org --legacy-peer-deps
```

### 安装成功后，运行即可
```
npm run dev
```

#### Tips：
```
如果你想换端口，可以直接修改根目录下的 vue.config.js 文件

  devServer: {
    port: 9000, // 当前 admin 项目的端口号

    proxy: {
      // 配置代理
      "/api": {
        target: "http://localhost:8000",//改成后端api地址

```

### 想要发布生产环境，执行build:prod打包成dist
```
npm run build:prod
```

### 想要发布测试环境，执行build:stage打包成dist
```
npm run build:stage
```

### 开发过程中检查错误，可执行lint
```
npm run lint
```