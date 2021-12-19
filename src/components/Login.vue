<template>
  <div id="body" style="height: 100%">
    <!-- 只给登录用,长度100% -->
    <div id="login_box">
      <h2>lOGIN</h2>
      <!-- :action="url" -->
      <form method="post">
        <div id="form">
          <div id="input_box">
            <i class="fa fa-user" aria-hidden="true"></i>
            <input
              class="in"
              type="text"
              v-model="queryUser.account"
              placeholder="Username"
            />
          </div>
          <div id="input_box">
            <i class="fa fa-key" aria-hidden="true"></i>
            <input
              class="in"
              type="password"
              placeholder="Password"
              v-model="queryUser.password"
            />
          </div>
        </div>
        <el-button @click="getLogin">Sign in</el-button>
        <!-- 提交按钮 -->
        <!-- type="submit"两次提交了 -->
        <!-- 普通按钮一直重置 -->
        <!-- <button  @click="getUrl">Sign in</button><br /> -->
        <div id="Sign">
          <a @click="emailDialogVisible=true">忘记密码?</a>
        </div>
        <el-dialog
          title="邮箱账号"
          :visible.sync="emailDialogVisible"
          width="30%"
          @close="emailFromClose"
        >
          <!-- 主体区域 -->
          <el-form
            :model="emailForm"
            ref="emailFormRef"
            :rules="emailFormRules"
            label-width="80px"
            status-icon
          >
            <el-form-item label="账号" prop="account">
              <el-input v-model="emailForm.account"></el-input>
            </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="emailDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="emailUsers">确 定</el-button>
          </span>
        </el-dialog>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    // getLogin();
  },
  data() {
    // 自定义验证邮箱
    var checkEmail = (rule, value, callback) => {
      // 正则表达式
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    return {
      url: "",
      queryUser: {
        account: "admin",
        password: "123456",
      },
      emailDialogVisible:false,
      emailForm: { account: "" },
      emailFormRules: {
        account: [
          {
            required: true,
            message: "请输入qq邮箱账号",
            trigger: "blur",
          },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async getLogin() {
      const { data: res } = await this.$http.post(
        `login/${this.queryUser.account}/${this.queryUser.password}`
      );
      // 后端这里可以把没有数据做个异常抛出来，前端接受然后处理
      // 我这里直接是没有数据据就不经去了
      if (res.token == null) {
        // 登录这里从后台没有,这里限制没写好
        this.$message.error("登陆失败");
        return this.$router.push("/login");
      }
      window.localStorage.setItem("token", res.token);
      //通过编程式导航跳转到后台首页，路由地址是 /home
      this.$router.push("/home");
      this.$message.success("登录成功");
      // this.queryUser=res
      console.log(res);
      // console.log(res.size);
      // 失败登陆页面
    },
    emailFromClose(){
          this.$refs.emailFormRef.resetFields();
    },
  async  emailUsers(){
      //  调用邮箱接口
       const { data: res } = await this.$http.post(`email/${this.emailForm.account}`);
       if(res==null){
         this.$message.error("邮箱发送失败")
       }
       this.$message.success(res)
       this.emailDialogVisible=false
    },
  },
};
</script>

<style>
</style>