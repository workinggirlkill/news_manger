<template>
  <div>
       <!-- 富文本编辑框 -->
      <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>编辑管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h1>新闻编辑</h1>
    <quill-editor></quill-editor>
    </el-card>
  </div>
</template>

<script>
export default {

}
</script>

<style>
 h1{
     text-align: center;
     padding-bottom:50px ;
}
</style>