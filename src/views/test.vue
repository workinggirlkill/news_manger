<template>
<div>
  <!-- 本地可以直接访问测试，服务端可以，但我把console关了的 -->
  {{this.test}}
  <br>
  {{this.test1}}
</div>
</template>

<script>
export default {
  data() {
    return {
      newsLikePage: {
        pageNum: 1,
        pageSize: 6,
        author: "冰冰",
      },
      test:[],
      test1:[]
    };
  },
  created() {
    this.search();
  },
  methods: {
    async search() {
      // 无论如何都乱码醉了
      console.log(this.newsLikePage);
      // const { data: res } = await this.$http.get(
      //   `newsLike1/${this.newsLikePage.author}/${this.newsLikePage.likePageNum}/${this.newsLikePage.likePageSize}`
      // );
      // 每个接口都自己的方法，不懂去对应的文档找
      // 这个要字段对应
      const { data: res } = await this.$http.get(`newsLike`, {
        params: this.newsLikePage,
      });
// 这个拼接也要字段对应
      const { data: res1 } = await this.$http.get(
        `newsLike?author=`+this.newsLikePage.author+`&pageNum=`+this.newsLikePage.pageNum+`&pageSize=`+this.newsLikePage.pageSize
      );
      if (Object.keys(res).length <= 0)
        return this.$message.error("搜索新闻失败");
      console.log(res);
      this.test=res.list
      console.log(res1);
      this.test1=res1.list
    },
  },
};
</script>

<style>
</style>