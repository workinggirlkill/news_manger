<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>新闻管理</el-breadcrumb-item>
      <el-breadcrumb-item>新闻列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 间距 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 查询分类 -->
          <!-- 用于后端交互 -->
          <!--  -->
          <el-select
            v-model="search"
            placeholder="请选择"
            @change="searchCate"
            @focus="getCatelistAll"
          >
            <el-option
              v-for="item in searchCateList"
              :key="item.categoryId"
              :label="item.title"
              :value="item.categoryId"
            >
            </el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="cateList" border stripe>
        <!-- 添加索引 -->
        <!-- 添加#有这个会让表格没对齐 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="categoryId" label="分类Id"> </el-table-column>
        <el-table-column prop="title" label="分类名称"> </el-table-column>
        <el-table-column prop="sort" label="分类排名"> </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showCateByid(scope.row.categoryId)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeCatesByid(scope.row.categoryId)"
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
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addFromClose"
    >
      <!-- 主体区域 -->
      <el-form
        :model="addForm"
        ref="addFormRef"
        :rules="addFormRules"
        label-width="80px"
        status-icon
      >
        <el-form-item label="分类标题" prop="title">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="分类排名" prop="sort">
          <el-input v-model="addForm.sort"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCates">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类 -->
    <el-dialog
      title="修改分类"
      :visible.sync="updateDialogVisible"
      width="50%"
      @close="updateFromClose"
    >
      <!-- 主体区域 -->
      <el-form
        :model="updateForm"
        ref="updateFormRef"
        :rules="updateFormRules"
        label-width="80px"
        status-icon
      >
        <el-form-item label="分类标题" prop="title">
          <el-input v-model="updateForm.title"></el-input>
        </el-form-item>
        <el-form-item label="分类排名" prop="sort">
          <el-input v-model="updateForm.sort"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateCates">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 一条数据框 -->
    <el-dialog
      title="搜查数据"
      :visible.sync="searchDialogVisible"
      width="50%"
      @close="searchFromClose"
    >
      <!-- 主体区域 -->
      <el-form
        :model="searchForm"
        ref="searchFormRef"
        :rules="searchFormRules"
        label-width="80px"
        status-icon
      >
        <el-form-item label="分类标题" prop="title">
          <el-input v-model="searchForm.title"></el-input>
        </el-form-item>
        <el-form-item label="分类排名" prop="sort">
          <el-input v-model="searchForm.sort"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="model"
          @click="updateSearchCates"
        >修改</el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="model"
          @click="removeCatesByid(searchForm.categoryId)"
        ></el-button>
        <el-button @click="searchDialogVisible = false">取 消</el-button>
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
      addForm: {
        title: "",
        sort: "",
      },
      updateForm: {
        title: "",
        sort: "",
      },
      searchForm: {
        categoryId:"",
        title: "",
        sort: "",
      },
      addFormRules: {
        title: [
          {
            required: true,
            message: "请输入分类标题",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        sort: [
          {
            required: true,
            message: "请输入分类排名",
            trigger: "blur",
          },
          {
            min: 1,
            max: 3,
            message: "长度在 1到 3个字符",
            trigger: "blur",
          },
        ],
      },
      updateFormRules: {
        title: [
          {
            required: true,
            message: "请输入分类标题",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        sort: [
          {
            required: true,
            message: "请输入分类排名",
            trigger: "blur",
          },
          {
            min: 1,
            max: 3,
            message: "长度在 1到 3个字符",
            trigger: "blur",
          },
        ],
      },
      searchFormRules: {
        title: [
          {
            required: true,
            message: "请输入分类标题",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        sort: [
          {
            required: true,
            message: "请输入分类排名",
            trigger: "blur",
          },
          {
            min: 1,
            max: 3,
            message: "长度在 1到 3个字符",
            trigger: "blur",
          },
        ],
      },
      addDialogVisible: false,
      updateDialogVisible: false,
      searchDialogVisible: false,
      cateList: [],
      search: "",
      searchCateList: [],
    };
  },
  created() {
    // 页面一访问就有分类数据
    this.getCatelist();
  },
  methods: {
    addFromClose() {
      // 给获取的实例对象添加一个重置的方法
      this.$refs.addFormRef.resetFields();
    },
    // 给获取的实例对象添加一个重置的方法
    updateFromClose() {
      this.$refs.updateFormRef.resetFields();
    },
    searchFromClose() {
      this.$refs.searchFormRef.resetFields();
    },
    // 删除提示
    async removeCatesByid(newsId) {
      //  console.log(userid)
      const conformResult = await this.$confirm(
        "此操作将该分类永久删除, 是否继续?",
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
      const { data: res } = await this.$http.delete(`cate/delete/${newsId}`);
      if (res != true) return this.$message.error("删除分类失败");
      this.$message.success("删除分类成功");
      // 将单独数据框消失
      this.searchDialogVisible=false
      // 保留当前页
      this.getCatelist();
    },
    // 监听页面数改变事件
    handleSizeChange(newSize) {
      // 重新获取页面数据
      this.queryIofo.pagesize = newSize;
      // this.search();
      this.getCatelist();
    },
    // 监听页码改变事件
    handleCurrentChange(newPage) {
      this.queryIofo.pagenum = newPage;
      // this.search();
      this.getCatelist();
    },
    async getCatelist() {
      const { data: res } = await this.$http.get(
        `cate/pageList1/${this.queryIofo.pagenum}/${this.queryIofo.pagesize}`
      );
      // console.log(res);
       if(Object.keys(res).length<=0){
         this.$message.error("获取分类失败")
       }
      this.cateList = res.list;
      this.total = res.total;
    },
    async addCates() {
      // console.log(this.addForm)
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("cate/add", this.addForm);
        // console.log(res);
        if (res != true) return this.$message.error("添加分类失败");
        // 添加相同用户，不提示，直接加载后端数据了，应该要失败
        this.$message.success("添加分类成功");
        //  隐藏对话框
        this.addDialogVisible = false;
        this.getCatelist();
      });
    },
    // 1.先展示数据
    async showCateByid(cateId) {
      this.updateDialogVisible = true;
      const { data: res } = await this.$http.get(`cate/check/${cateId}`);
      if (Object.keys(res).length <= 0)
        return this.$message.error("获取用户列表失败");
      this.updateForm = res;
    },
    async updateCates() {
      this.$refs.updateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "cate/update",
          this.updateForm
        );
        // console.log(res);
        if (res !== true) return this.$message.error("修改分类失败");
        this.$message.success("修改分类成功");
        //  隐藏对话框
        this.updateDialogVisible = false;
        this.getCatelist();
      });
    },
    // 获取分类数据
    async getCatelistAll() {
      const { data: res } = await this.$http.get(`cateGery`);
      // console.log(res);
      this.searchCateList = res;
    },
    // 选中了
    async searchCate() {
      // 在调用一次根据id找内容
      // console.log(this.search)
      const { data: res } = await this.$http.get(`cate/check/${this.search}`);
      //  console.log(res)
      if (Object.keys(res).length <= 0)
        return this.$message.error("获取用户列表失败");
      // 上述组件解析的是集合数据，不是一个类的数据
      // 用id查询永远只会有一条数据
      this.searchForm = res;
      this.searchDialogVisible = true;
    },
    async updateSearchCates() {
      // 本来修改也想传参数对应修改,可惜预验证通不过，算了写方法
      this.$refs.searchFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "cate/update",
          this.searchForm
        );
        // console.log(res);
        if (res !== true) return this.$message.error("修改分类失败");
        this.$message.success("修改分类成功");
        //  隐藏对话框
        this.searchDialogVisible = false;
        this.getCatelist();
      });
    },
  },
};
</script>

<style>
</style>