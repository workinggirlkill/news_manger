# news前端控制页面

### 1使用方法

1.下载  https://gitee.com/gong-jirong/news-manger.git

2.安装依赖

```js
npm install或者cnpm install
```

3.启动项目

```js
npm run dev 
控制台输入vue ui进入可视化面板运行项目
```

### 2项目概述

1.登录方面

前端采用了拦截守卫，并且把token值传给给window.localStorage，

再通过axios.interceptors识别然后传给请求头，发送给后端，让后端进行授权认证

2.功能页面大致完成

### 3环境配置

只需要安装了node，导入数据库 ，将后端跑起来，就可以运行

客服端预览： news.gjrong.cn

后台代码： 

我把后台接口文档写好了，不需要会后端，只需要按照接口，添加参数即可

Vue

插槽的使用

```js
 *<!-- (v-slot:default="scope")==(slot-scope="scope") -->*
```

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

背景图,用的远程的，加载慢的话，自己换成本地

希望给个星星



