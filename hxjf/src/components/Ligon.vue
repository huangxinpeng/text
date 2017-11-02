<template>
  <div class="Ligon" >
   <div class="navbar">
       <div class="row ">
            <div class="nav">
                   <p><div class="pull-right  w24">
                    <a href="#"><img src="../img/ligon-1.png" alt="" /></a>
                   </div>
                    <div class="pull-right w24">
                    <a href=""><img src="../img/ligon-2.png" alt="" /></a>
                    </div>
                    <span class="pull-right  "><a href="#" class="a">陈云</a>&nbsp;&nbsp;客户，您好！欢迎登陆华夏金服保理在线服务平台</span>
                   </p>
              </div>
      </div>
      <div class="row bb-4">
        <div class="col-md-1"></div>
        <div class="col-md-10 col-md-offset-1">
            <div class="col-md-9 text-left">
            <img src="../img/logo.png" alt="" />&nbsp;&nbsp;华夏金服保理业务在线服务平台
            </div>
            <div class="col-md-3 list">
                <div class="col-md-4 "><a href="index.html" class="a-active">首页</a></div>
                <div class="col-md-4">
                      <router-link to="/contactUS">
                        联系我们
                      </router-link>
                </div>
                <div class="col-md-4">
                  <router-link to="/homepage">
                      会员中心
                  </router-link>
                </div>
            </div>
        </div>
        <div class="col-md-1"></div>
      </div>
      </div>
  </div>
</template>

<script>
// import jquery from '../js/jquery.js'
export default {
  name: 'Ligon',
  data () {
    return {
  
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
*{margin:0;padding: 0;font-family: "微软雅黑"}
.nav{background-color: #f6f6f6; height: 50px; width: 100%;padding-right: 30px;}
.pull-right {display: inline-block;height: 50px;line-height: 50px;color: #555555;margin-right: 25px;}
.pull-right .a{color: #fca91d}
.w24{width: 39px;height: 33px;margin-top: -8px;}

</style>
