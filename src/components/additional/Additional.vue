<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>功能管理</el-breadcrumb-item>
      <el-breadcrumb-item>功能列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-upload
        class="upload-demo"
        drag
        multiple
        :action="uploadURL"
        :on-preview="handlePreview"
        list-type="picture"
        :headers="headersObj"
        :on-success="handSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过2000kb
        </div>
      </el-upload>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 上传图片后台地址本地
      uploadURL: "http://localhost:8001/upload",
      // 服务端
      // 图片上传组件的headers请求头
      headersObj: { Authorization: window.localStorage.getItem("token") },
      // 图片预览路径
      previewPath: "",
      // 图片预览弹出框显示状态
      previewdialogVisible: false,
    };
  },
  methods: {
    // 文件预览效果
    handlePreview(file) {
      this.previewPath = file.response.url;
      this.previewdialogVisible = true;
      window.open(file.response.url);
    },
    // 文件上传成功事件
    handSuccess(response) {
      console.log(response);
      console.log(response.status);
      if (response.status!="OK") {
        return this.$message.error("文件上传失败");
      }
      this.$message.success("文件上传成功");
    },
  },
};
</script>

<style>
</style>