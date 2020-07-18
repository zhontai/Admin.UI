
一个基于Vue开发的权限管理系统，后续会增加更多实用的功能。

### 在线体验
演示地址：https://www.admin.zhontai.net/

文档地址：https://www.zhontai.net/

*********************************************************
### 项目下载后，首先安装依赖包
```
npm install
或
npm install --registry=https://registry.npm.taobao.org
```

### 安装成功后，运行即可
```
npm run serve
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

### 开发过程中检查错误，可执行lint
```
npm run lint
```

### 想要发布，执行bulid打包成dist
```
npm run build
```
