<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-aside
      :width="isCollapse ? '56px' : '200px'"
      :transform="isCollapse ? 'all 1s' : 'all 0s'"
    >
      <div class="toggle-button" @click="toggleCollapse">|||</div>
      <!-- 左侧菜单 -->
      <el-menu
        background-color="#333744"
        text-color="#fff"
        active-text-color="#ffd04b"
        unique-opened
        :collapse="isCollapse"
        :collapse-transition="false"
        :router="true"
        :default-active="activePath"
        style="border-right: none"
      >
        <el-submenu index="1">
          <template slot="title"
            ><i :class="iconObj[102]" id="right"></i>新闻编辑</template
          >
          <el-menu-item
            index="/news/newsList"
            @click="saveNveStatus('/news/newsList')"
          >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>新闻列表</span>
              <!-- 这里进行增删改查""路由/不要忘" -->
            </template>
          </el-menu-item>
          <el-menu-item
            index="/news/recyclingList"
            @click="saveNveStatus('/news/recyclingList')"
          >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>新闻测试</span>
            </template>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"
            ><i :class="iconObj[125]" id="right"></i>用户操作</template
          >
          <el-menu-item
            index="/user/usersList"
            @click="saveNveStatus('/user/usersList')"
          >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>用户列表</span>
              <!-- 这里进行增删改查""路由/不要忘" -->
            </template>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title"
            ><i :class="iconObj[101]" id="right"></i>分类操作</template
          >
          <el-menu-item
            index="/cate/catesList"
            @click="saveNveStatus('/cate/catesList')"
          >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>分类列表</span>
              <!-- 这里进行增删改查""路由/不要忘" -->
            </template>
          </el-menu-item>
        </el-submenu>
         <el-submenu index="4">
          <template slot="title"
            ><i class="el-icon-s-promotion" id="right"></i>其他操作</template
          >
          <el-menu-item
            index="/additional/worker"
            @click="saveNveStatus('/additional/worker')"
          >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>文件上传</span>
            </template>
          </el-menu-item>
           <el-menu-item
            index="/additional/ECharts"
            @click="saveNveStatus('/additional/ECharts')"
          >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>ECharts</span>
            </template>
          </el-menu-item>
           <el-menu-item
            index="/additional/quill"
            @click="saveNveStatus('/additional/quill')"
          >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>富文本框</span>
            </template>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title"
            ><i class="el-icon-circle-plus" id="right"></i>补充操作</template
          >
          <el-menu-item
            index="/additional/add"
            @click="saveNveStatus('/additional/add')"
          >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>展示动图</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <!-- 左侧图标区 -->
        <div class="left-img">
          <img src="../assets/asd.jpg" alt="" class="img1" />
          <span style="margin-left: 15px">新闻管理系统</span>
        </div>
        <!-- @click='loginOut'后面做 -->
        <el-button type="info" @click="loginOut">退出</el-button>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
.el-aside {
  background-color: #333744;
  color: #ffffff;
  /* text-align: center; */
}
.toggle-button {
  text-align: center;
  background-color: #999999;
  font-size: 10px;
  line-height: 24px;
  font-weight: 600;
  /* 字符串间距 */
  letter-spacing: 0.3em;
  /* 变成小手鼠标 */
  cursor: pointer;
}
.img1 {
  width: 80px;
  height: 60px;
  border-radius: 50%;
}
.el-header {
  background-color: #666666;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #ffffff;
  line-height: 60px;
  font-size: 20px;
}
/* 让内部嵌套居中 */
.left-img {
  display: flex;
  align-items: center;
}
/* 我套不进去,这里没有用换成行内式 */
.el-menu {
  border-right: none;
}
#right {
  margin-right: 20px;
}
</style>

<script>
export default {
  data() {
    return {
      // 默认不折叠
      isCollapse: false,
      // 被激活的链接
      activePath: "",
      iconObj: {
        125: "iconfont icon-yonghuquanxian",
        101: "iconfont icon-shangpinguanli",
        102: "iconfont icon-dingdanguanli",
      },
    };
  },
  // 生命周期
  created() {
    // 获取高亮的值用get
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    loginOut() {
      // // 将获取的token清空,session
      // window.sessionStorage.clear()
      window.localStorage.clear();
      // 通过编程式导航跳转到登录页面
      this.$router.push("/login");
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    }, // 保存链接的激活状态
    saveNveStatus(activePath) {
      // 将值变化用set
      window.sessionStorage.setItem("activePath", activePath);
      // 获取生命周期函数一开始的值上传到data再到页面
      this.activePath = activePath;
    },
  },
};
</script>