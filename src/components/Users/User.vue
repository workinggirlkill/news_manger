<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <!-- 间距 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 查询用户 -->
          <el-input
            placeholder="请输入姓名"
            v-model="searchIfon"
            clearable
            @clear="getUsersList()"
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
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="userList" border stripe>
        <!-- 添加索引 -->
        <!-- 添加#有这个会让表格没对齐 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="userId" label="用户Id" width="180">
        </el-table-column>
        <el-table-column prop="nickname" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="account" label="账号" width="180">
        </el-table-column>
        <el-table-column prop="password" label="密码"> </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showUserByid(scope.row.userId)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserByid(scope.row.userId)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="添加用户"
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
        <el-form-item label="用户名" prop="nickname">
          <el-input v-model="addForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="addForm.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog
      title="修改用户"
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
        <el-form-item label="用户名" prop="nickname">
          <el-input v-model="updateForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="updateForm.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="updateForm.password"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUsers">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userList: [],
      addForm: {
        nickname: "",
        account: "",
        password: "",
      },
      updateForm: {
        userId: "",
        nickname: "",
        account: "",
        password: "",
      },
      addFormRules: {
        // 验证用户名
        nickname: [
          {
            required: true,
            message: "请输入用户姓名",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        account: [
          {
            required: true,
            message: "请输入用户账号",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        // 验证密码是否合法
        password: [
          {
            required: true,
            message: "请输入登录密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 20,
            message: "长度在 6到 20 个字符",
            trigger: "blur",
          },
        ],
      },
      updateFormRules: {
        // 验证用户名
        nickname: [
          {
            required: true,
            message: "请输入用户姓名",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        account: [
          {
            required: true,
            message: "请输入用户账号",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        // 验证密码是否合法
        password: [
          {
            required: true,
            message: "请输入登录密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 20,
            message: "长度在 6到 20 个字符",
            trigger: "blur",
          },
        ],
      },
      addDialogVisible: false,
      updateDialogVisible: false,
      searchIfon: "",
    };
  },
  created() {
    // 页面一创建就访问数据
    this.getUsersList();
  },
  methods: {
    async getUsersList() {
      const { data: res } = await this.$http.get("user/list");
      if (res[1].status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.$message.success("获取用户列表成功");
      this.userList = res[0];
      // console.log(res);
    },
    addFromClose() {
      // 给获取的实例对象添加一个重置的方法
      this.$refs.addFormRef.resetFields();
    },
    updateFromClose() {
      this.$refs.updateFormRef.resetFields();
    },
    async removeUserByid(userId) {
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
      const { data: res } = await this.$http.delete(`user/delete/${userId}`);
      if (res !== true) return this.$message.error("删除用户失败");
      this.$message.success("删除用户成功");
      // 保留当前页
      this.getUsersList();
    },
    async addUsers() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("user/add", this.addForm);
        // console.log(res);
        if (res != true) return this.$message.error("添加用户失败,账号不能相同");
        // 添加相同用户，不提示，直接加载后端数据了，应该要失败
        this.$message.success("添加用户成功");
        //  隐藏对话框
        this.addDialogVisible = false;
        this.getUsersList();
      });
    },
    // 修改数据
    // 1.先展示数据
    async showUserByid(userId) {
      this.updateDialogVisible = true;
      const { data: res } = await this.$http.get(`user/One/${userId}`);
      if (Object.keys(res).length <= 0)
        return this.$message.error("获取用户列表失败");
      this.updateForm = res;
    },
    async updateUsers() {
      this.$refs.updateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "user/update",
          this.updateForm
        );
        // console.log(res);
        if (res !== true) return this.$message.error("修改用户失败");
        this.$message.success("修改用户成功");
        //  隐藏对话框
        this.updateDialogVisible = false;
        this.getUsersList();
      });
    },
    async search() {
      if(this.searchIfon==""){
        // 要结束就直接return
        return this.$message.error("不要发送空消息")
      }
      const { data: res } = await this.$http.get(`userLike/${this.searchIfon}`);
      if (Object.keys(res).length <= 0)
        return this.$message.error("搜索用户失败");
        console.log(res)
      this.userList = res;
    },
  },
};
</script>

<style>
</style>