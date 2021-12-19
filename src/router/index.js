import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../components/Home.vue'
// import Wlecome from "../components/Wlecome.vue"
// import NewsList from "../components/news/NwesList.vue"
// import Login from "../components/Login.vue"
// import UserList from "../components/Users/User.vue"
// import CateList from "../components/Cate/CateGery.vue"
// import RecyclingList from "../components/news/recyclingList.vue"
// import Additional from '@/components/additional/Additional'
// import ECharts from '@/components/additional/ECharts'
// import Quill from '@/components/additional/Quill'
// import MoreECharts from '@/components/additional/MoreECharts'
// 测试页面
// import Test from "../views/test.vue"
// 路由懒加载
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Home.vue')
const Wlecome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Wlecome.vue')

const  NewsList = () => import(/* webpackChunkName: "NewsList_RecyclingList" */ '../components/news/NwesList.vue')
const RecyclingList = () => import(/* webpackChunkName: "NewsList_RecyclingList" */ '../components/news/recyclingList.vue')

const  UserList = () => import(/* webpackChunkName: "UserList_CateList" */ '../components/Users/User.vue')
const  CateList = () => import(/* webpackChunkName: "UserList_CateList" */ '../components/Cate/CateGery.vue')

const Additional = () => import(/* webpackChunkName: "Additional" */ '@/components/additional/Additional')
const ECharts = () => import(/* webpackChunkName: "Additional" */ '@/components/additional/ECharts')
const  Quill = () => import(/* webpackChunkName: "Additional" */ '@/components/additional/Quill')
const  MoreECharts = () => import(/* webpackChunkName: "Additional" */ '@/components/additional/MoreECharts')

const Test = () => import(/* webpackChunkName: "Test" */ '../views/test.vue')
// 路由重复报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const routes = [{
    path: '/home',
    component: Home,
    // 重定位
    redirect: '/welcome',
    // 子路由,对应home的路由占位符
    children: [{
        path: '/welcome',
        component: Wlecome
      },
      {
        path: '/news/newsList',
        name: "新闻列表",
        component: NewsList
      },
      {
        path: "/news/recyclingList",
        name: "回收站数据",
        component: RecyclingList
      },
      {
        path: "/user/usersList",
        name: "用户列表",
        component: UserList
      }, {
        path: "/cate/catesList",
        name: "分页列表",
        component: CateList
      },{
        path:"/additional/worker",
        name:"额外功能",
        component:Additional
      },{
        path:"/additional/ECharts",
        component:ECharts
      },
      {
        path:"/additional/quill",
        component:Quill
      },{
        path:"/additional/add",
        // 路由用超链接访问不到，必用路由
        component:MoreECharts
      }
    ]
  }, {
    path: "/",
    name: "登录",
    redirect: "/login"
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/test',
    component: Test
  },
]

const router = new VueRouter({
  // 这个会取消路由中的#,但打包后访问不到项目
  // 打包后一刷新就没有数据
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})
// 拆分挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转
  if (to.path === '/login') return next()
  // 获取token
  // const tokenStr = window.sessionStorage.getItem('token')
  const tokenStr = window.localStorage.getItem('token')
  // 没有token直接进入登录页面
  if (!tokenStr) return next('/login')
  // 成功后放行
  next()
})
export default router