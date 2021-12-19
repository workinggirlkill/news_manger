<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>新闻管理</el-breadcrumb-item>
      <el-breadcrumb-item>新闻列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <!-- 间距 -->
      <!-- 用户列表区 -->
      <el-table :data="newsList" border stripe>
        <!-- 添加索引 -->
        <!-- 添加#有这个会让表格没对齐 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="id" label="新闻id"> </el-table-column>
        <el-table-column prop="categoryId" label="分类id"> </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <!-- prop="content" -->
        <el-table-column label="内容" width="140px">
          <!-- 做个弹出框看内容 -->
          <!-- 提示框 -->
          <template slot-scope="scope">
            <el-button
              type="info"
              round
              size="mini"
              @click="show(scope.row.content)"
              >查看内容</el-button
            >
            <!-- 插槽是动态数据，但直接放两个组件在插槽中，也不生效，可以通过动态绑定 -->
            <!-- {{scope.row}} -->
          </template>
        </el-table-column>
        <el-table-column prop="source" label="新闻来源" width="130px">
        </el-table-column>
        <el-table-column prop="publishTime" label="更新时间" width="180px">
          <template v-slot:default="scope">
            <!-- 调用过滤器                                            -->
            {{ scope.row.publishTime | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者"> </el-table-column>
        <el-table-column prop="level" label="热度"> </el-table-column>
        <!-- 后期换成开关 -->
        <el-table-column prop="status" label="状态">
            <el-switch
              v-model="this.flag"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- slot-scope="scope" -->
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="restore(scope.row.id)"
              >移出</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeNewsByid(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryIofo.pagenum"
        :page-sizes="[1, 2, 6, 10]"
        :page-size="queryIofo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 提示框，直接放里面就只能绑定最后的数据 -->
    <el-dialog title="查看内容" :visible.sync="showDialogVisible" width="50%">
      <!-- @close="addFromClose" -->
      <!-- {{scope.row}}两个组件不能互通 -->
      {{ context }}
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="showDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 获取新闻列表参数
      queryIofo: {
        // 当前页码
        pagenum: 1,
        // 页面数据条数
        pagesize: 6,
      },
      total: 0,
      newsList: [],
      showDialogVisible: false,
      context: "",
      // 回收的数据都是0就不用去判断了
      flag:false
    };
  },
  created() {
    // 页面一创建就访问数据
    this.getNewsList();
  },
  methods: {
    async getNewsList() {
      const { data: res } = await this.$http.get(
        `news/recyclingInfo/${this.queryIofo.pagenum}/${this.queryIofo.pagesize}`
      );
      if (res.list.length <= 0) {
        return this.$message.error("获取新闻列表失败");
      }
      // this.$message.success("获取新闻列表成功");
      this.newsList = res.list;
      this.total = res.total;
      // console.log(res)
    },
    // 删除提示
    async removeNewsByid(newsId) {
      //  console.log(userid)
      const conformResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // console.log(conformResult)
      // 如果用户确认删除就是返回字符串confirm
      // 如果用户取消删除返回cancel
      if (conformResult !== "confirm") {
        return this.$message({
          type: "info",
          message: "已取消删除",
        });
      }
      const { data: res } = await this.$http.delete(
        `news/deletePhysical/${newsId}`
      );
      if (res != true) return this.$message.error("删除用户失败");
      this.$message.success("删除用户成功");
      // 保留当前页
      this.getNewsList();
    },
    // 恢复数据
    async restore(newsId) {
      const { data: res } = await this.$http.get(`news/restore/${newsId}`);
      if (res != true) return this.$message.error("恢复新闻失败");
      this.$message.success("恢复新闻成功");
      // 保留当前页
      this.getNewsList();
    },
    show(content) {
      (this.context = content), (this.showDialogVisible = true);
    },
    // 监听页面数改变事件
    handleSizeChange(newSize) {
      // 重新获取页面数据
      this.queryIofo.pagesize = newSize;
      this.getNewsList();
    },
    // 监听页码改变事件
    handleCurrentChange(newPage) {
      this.queryIofo.pagenum = newPage;
      this.getNewsList();
    },
  },
};
</script>

<style>
</style>