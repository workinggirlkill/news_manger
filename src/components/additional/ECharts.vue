<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <div style="display: flex">
        <div id="main" style="width: 80%; height: 400px"></div>
        <div id="main1" style="width: 70%; height: 400px"></div>
      </div>
      <!-- 2为 ECharts 准备一个具备大小（宽高）的 DOM  -->
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
// 导入假数据，没必要从数据库拿，但是有用的数据
import Source from "../news/soruce.js";
export default {
  // 渲染完
  mounted() {
    this.barGraph();
    this.pieChart();
  },
  data() {
    return {
      Source,
      cateList: [],
    };
  },
  methods: {
    async pieChart() {
      var myChart = echarts.init(document.getElementById("main1"));
      // 声明一个储存饼状图得数组，他需要啥就用户数组添加啥
      let pieChartData = [];
      const { data: res } = await this.$http.get(`cateGery`);
      this.cateList = res;
      // 去根据分类拿数据长度
      for (var i in this.cateList) {
        // 循环几次几次数据
        const { data: res1 } = await this.$http.get(
          `news/count1/${this.cateList[i].title}`
        );
        pieChartData.push({
          value: res1,
          name: this.cateList[i].title,
        });
      }
      // console.log(nameDatas);
      // console.log(pieChartData);
      myChart.setOption({
        title: {
          text: "分类占比",
          subtext: "数据",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: "50%",
            data: pieChartData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    },
    async barGraph() {
      // 初始化图标
      var myChart = echarts.init(document.getElementById("main"));
      //柱状图动态获取数据
      //先声明一个空数组来存放获取到的柱状条的数据
      let seriesData = [];
      //还需声明一个空数组来存放与柱状条数据对应的名称
      let nameDatas = [];
      //获取到的数据需要转换成Json字符串,这里我也不是很明白，在控制台调试的时候，获取到的数据都是[object,Object]这样的格式，所以我只能转换一下
      // let outdata = JSON.stringify(res);
      //这里还需eval来处理一下字符串转为json对象，如此就能获取到数据了
      // let xqo = eval("(" + outdata + ")");
      //根据返回的数据，循环遍历出你要展示的数据
      for (var i in this.Source) {
        const { data: res } = await this.$http.get(
          `news/count/${this.Source[i].source}`
        );
        if (res == null) {
          return this.$message.error("来源数量获取失败");
        }
        //这里我展示的是后台返回的每条数据里面的bookname和num
        nameDatas.push(this.Source[i].source);
        seriesData.push(res);
      }
      myChart.setOption({
        title: {
          text: "新闻热度",
        },
        tooltip: {},
        legend: {
          data: ["热度"],
        },
        xAxis: {
          data: nameDatas,
        },
        yAxis: {},
        series: [
          {
            name: "热度",
            type: "bar",
            data: seriesData,
            itemStyle: {
                color: function (params) {
                  //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                  var colorList = [
                    "#c23531",
                    "#2f4554",
                    "#61a0a8",
                    "#d48265",
                    "#91c7ae",
                    "#749f83",
                    "#ca8622",
                    "#c23531",
                    "#2f4554",
                    "#61a0a8",
                  ];
                  if (params.dataIndex >= colorList.length) {
                    //给大于颜色数量的柱体添加循环颜色的判断
                    i = params.dataIndex - colorList.length;
                  }
                  return colorList[params.dataIndex];
                },
            },
          },
        ],
      });
    },
  },
};
</script>

<style>
</style>