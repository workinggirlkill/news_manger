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
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 查询用户 -->
          <el-input
            placeholder="请输入作者"
            v-model="newsLikePage.author"
            clearable
            @clear="getNewsList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加新闻</el-button
          >
        </el-col>
      </el-row>
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
              @click="showOneNews(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeNewsByid(scope.row.id)"
            ></el-button>
            <!-- @click="removeUserByid(scope.row.id)" -->
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
        :hidden="showPage1"
        background
      >
      </el-pagination>
      <!-- 搜索分页区为了隔离分页事件 -->
      <el-pagination
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
        :current-page="newsLikePage.likePageNum"
        :page-sizes="[1, 2, 6, 10]"
        :page-size="newsLikePage.likePageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total1"
        :hidden="showPage2"
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
    <el-dialog
      title="添加新闻"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addFromClose"
    >
      <!-- 主体区域 -->
      <el-form :model="addForm" ref="addFormRef" label-width="80px" status-icon>
        <el-form-item label="分类id">
          <!-- 只读属性 -->
          <el-input
            v-model="addForm.categoryId"
            readonly="readonly"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类标题">
          <el-select
            v-model="addForm.title"
            placeholder="请选择"
            @change="getcategoryId(addForm.title)"
          >
            <el-option
              v-for="item in cateList"
              :key="item.categoryId"
              :label="item.title"
              :value="item.title"
            >
            </el-option>
          </el-select>
          <!-- <el-input v-model="addForm.title"></el-input> -->
        </el-form-item>
        <el-form-item label="新闻内容">
          <el-input type="textarea" v-model="addForm.content"></el-input>
        </el-form-item>
        <el-form-item label="来源">
          <el-select v-model="addForm.source" placeholder="请选择">
            <el-option
              v-for="item in Source"
              :key="item.sourceId"
              :label="item.source"
              :value="item.source"
            >
            </el-option>
          </el-select>
          <!-- <el-input v-model="addForm.source" ></el-input> -->
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="addForm.author" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="热度">
          <el-select v-model="addForm.level" placeholder="请选择">
            <el-option
              v-for="item in Source"
              :key="item.sourceId"
              :label="item.level"
              :value="item.level"
            >
            </el-option>
          </el-select>
          <!-- <el-input v-model="addForm.level" style="width:200px"></el-input> -->
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNews">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改新闻 -->
    <el-dialog
      title="修改新闻"
      :visible.sync="updateDialogVisible"
      width="50%"
      @close="updateFromClose"
    >
      <!-- 主体区域 -->
      <el-form
        :model="updateForm"
        ref="updateFormRef"
        label-width="80px"
        status-icon
      >
        <el-form-item label="分类id">
          <!-- 只读属性 -->
          <el-input
            v-model="updateForm.categoryId"
            readonly="readonly"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类标题">
          <el-select
            v-model="updateForm.title"
            placeholder="请选择"
            @change="getcategoryId(updateForm.title)"
          >
            <el-option
              v-for="item in cateList"
              :key="item.categoryId"
              :label="item.title"
              :value="item.title"
            >
            </el-option>
          </el-select>
          <!-- <el-input v-model="addForm.title"></el-input> -->
        </el-form-item>
        <el-form-item label="新闻内容">
          <el-input type="textarea" v-model="updateForm.content"></el-input>
        </el-form-item>
        <el-form-item label="来源">
          <el-select v-model="updateForm.source" placeholder="请选择">
            <el-option
              v-for="item in Source"
              :key="item.sourceId"
              :label="item.source"
              :value="item.source"
            >
            </el-option>
          </el-select>
          <!-- <el-input v-model="addForm.source" ></el-input> -->
        </el-form-item>
        <el-form-item label="新闻时间">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="updateForm.publishTime"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">--------</el-col>
          <el-col :span="11">
            <el-time-picker
              placeholder="选择时间"
              v-model="updateForm.publishTime"
              style="width: 100%"
            ></el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="updateForm.author" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="热度">
          <el-select v-model="updateForm.level" placeholder="请选择">
            <el-option
              v-for="item in Source"
              :key="item.sourceId"
              :label="item.level"
              :value="item.level"
            >
            </el-option>
          </el-select>
          <!-- <el-input v-model="addForm.level" style="width:200px"></el-input> -->
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateNews">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入假数据，没必要从数据库拿，但是有用的数据
import Source from "./soruce.js";
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
      addDialogVisible: false,
      updateDialogVisible: false,
      // 添加用户表单数据
      // categoryId只需要展示，更具级联选择框选择的title查出id
      addForm: {
        categoryId: "",
        title: "",
        content: "",
        source: "",
        author: "",
        level: "",
      },
      context: "",
      cateList: [],
      // 直接导入就好
      Source,
      newsLikePage: {
        // 这里注意是否是字符串，看报错
        likePageNum: 1,
        likePageSize: 6,
        author: "",
      },
      // 修改
      // 时间不需要分两块，自动识别
      //  {
      //     // 年月日
      //     time1:"",
      //     // 十分秒
      //     time2:""
      //   }
      updateForm: {
        categoryId: "",
        title: "",
        content: "",
        source: "",
        publishTime: "",
        author: "",
        level: "",
        // 根据id修改数据
        id: "",
      },
      showPage1:false,
      showPage2:true,
      total1:0,
      flag:true
    };
  },
  created() {
    // 页面一创建就访问列表数据
    this.getNewsList();
    // 页面一访问就有分类数据
    this.getCatelist();
  },
  methods: {
    async getNewsList() {
      // 全部数据
      // const { data: res } = await this.$http.get("news/newsList");
      // if (res[1].status !== 200) {
      //   return this.$message.error("获取新闻列表失败");
      // }
      // this.$message.success("获取新闻列表成功");
      // this.newsList = res[0];
      // 分页数据
      const { data: res } = await this.$http.get(
        `news/listInfo/${this.queryIofo.pagenum}/${this.queryIofo.pagesize}`
      );
      if (res.list.length <= 0) {
        return this.$message.error("获取新闻列表失败");
      }
      // this.$message.success("获取新闻列表成功");提示过于频繁
      this.newsList = res.list;
      this.total = res.total;
      this.showPage1=false;
      this.showPage2=true;
      // console.log(res)数组的长度用length前端没有size
    },
    addFromClose() {
      // 给获取的实例对象添加一个重置的方法
      this.$refs.addFormRef.resetFields();
    },
    // 给获取的实例对象添加一个重置的方法
    updateFromClose() {
      this.$refs.updateFormRef.resetFields();
    },
    // 删除提示
    async removeNewsByid(newsId) {
      //  console.log(userid)
      const conformResult = await this.$confirm(
        "此操作将该用户移入回收站, 是否继续?",
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
      const { data: res } = await this.$http.get(`news/delete/${newsId}`);
      if (res != true) return this.$message.error("删除用户失败");
      this.$message.success("删除用户成功");
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
      // this.search();
      this.getNewsList();
    },
    // 监听页码改变事件
    handleCurrentChange(newPage) {
      this.queryIofo.pagenum = newPage;
      // this.search();
      this.getNewsList();
    },
    // 监听页面数改变事件
    handleSizeChange1(newSize) {
      // 重新获取页面数据
      this.newsLikePage.likePageSize = newSize;
      this.search();
    },
    // 监听页码改变事件
    handleCurrentChange1(newPage) {
      this.newsLikePage.likePageNum = newPage;
      this.search();
    },
    async addNews() {
      // 传过去的参数
      const { data: res } = await this.$http.post("news/add", this.addForm);
      // post请求才能解析element-ui的数据
      if (res != true) {
        return this.$message.error("添加新闻失败,请填写内容");
      }
      this.$message.success("添加新闻成功");
      this.addDialogVisible = false;
    },
    // 修改
    // 1.展示数据
    async showOneNews(newsId) {
      const { data: res } = await this.$http.get("news/one/" + newsId);
      if (Object.keys(res).length <= 0) {
        return this.$message.error("获取新闻数据失败");
      }
      this.$message.success("获取新闻数据成功");
      this.updateForm = res;
      this.updateDialogVisible = true;
    },
    // 2.修改数据
    async updateNews() {
      const { data: res } = await this.$http.post(
        "news/update",
        this.updateForm
      );
      if (res != true) {
        return this.$message.error("修改失败");
      }
      this.$message.success("修改成功");
      this.updateDialogVisible = false;
      this.getNewsList();
    },
    async getCatelist() {
      const { data: res } = await this.$http.get("cateGery");
      if (Object.keys(res).length <= 0) {
        return this.$message.error("获取分类列表失败");
      }
      this.cateList = res;
      // console.log(res)
      // console.log(this.Source)
    },
    async getcategoryId(cateGeryName) {
      const { data: res } = await this.$http.get("cateGery/" + cateGeryName);
      this.addForm.categoryId = res;
      this.updateForm.categoryId = res;
    },
    async search() {
      if (this.newsLikePage.author == "") {
        // 要结束就直接return
        return this.$message.error("不要发送空消息");
      }
      // 无论如何都乱码醉了
      // const { data: res } = await this.$http.get(
      //   `newsLike/${this.newsLikePage.author}`
      // );
      const { data: res } = await this.$http.get(
        `newsLike1/${this.newsLikePage.author}/${this.newsLikePage.likePageNum}/${this.newsLikePage.likePageSize}`
      );
      if (Object.keys(res).length <= 0)
        return this.$message.error("搜索新闻失败");
      // console.log(this.newsLikePage);
      // console.log(res);
      this.newsList = res.list;
      this.total1=res.total;
      this.showPage1=true;
      this.showPage2=false;
    },
  },
};
</script>

<style>
</style>