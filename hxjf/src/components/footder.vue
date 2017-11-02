<template>
  <div class="footders">
      <nav class="navbar ">
            <div class="row hs">
                     <div class=" text-center  h6"  >
                        <!-- <a href="http://baolilianmeng.com/news/">新闻资讯</a>
                        <span>|</span>
                        <router-link to="/Opinstructions">操作指引</router-link>
                        <span>|</span>
                        <router-link to="/homepage">业务Q&A</router-link>
                        <span>|</span>
                        <router-link to="/contactUS">联系我们</router-link> -->
                         <br />
                        <h6 class="text-center" style="font-size: 13px;">
                          版权所有  &copy;华氏国际商业保理（深圳）有限公司 
                          <br>
                       Copyright &copy;China Factoring International(shenzhen) Co.,Ltd   All Rights Reserved
                        </h6> 
                     </div>
            </div>
      </nav>
  </div>
</template>
<script>
export default {

  name: 'hello',
  data () {
    return {
    
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footders{width: 100%;height: 100px;background-color: #0e0423;padding-top: 18px;} 
.navbar {color: #fff;  margin-bottom: 0;}
.navbar .row a{color: #fff;font-size: 14px}
.navbar .row  span{display: inline-block;margin-left: 50px;margin-right: 50px;}
.navbar h6{color: #ffffff;line-height: 1.5;font-family: "微软雅黑";}
</style>
