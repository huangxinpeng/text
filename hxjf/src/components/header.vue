<template>
  <div class="headers" >
   <div class="navbar">
     <div class="row ">
      <div class="nav">
       <!-- <p> -->
        <template v-if="header.isLogin">
         <h4
          class=" pull-right userLogin text-right"
          style="color:#fff;padding-top:15px;padding-right:25px;">
           <!-- <a href="javasript:void(0)" style="color:#fff" id="users">{{userId}}</a> -->
           <span  style="color:#F0A040">欢迎登录华氏国际商业保理在线服务平台</span>
           &nbsp;&nbsp;&nbsp;&nbsp;
           <span class="btn " @click="outLogin">退出</span>
         </h4>
       </template>  
      <template v-else>
        <div class="pull-right  w24">
          <router-link  class="userBox"  to="/register">
            <img src="../img/u0.png" alt="" />
            <span>注册</span>
          </router-link>
        </div>
        <div class="pull-right w24">
          <router-link class="userBox"   to="/login">
            <img src="../img/u1.png" alt="" />
            <span>登陆</span>
          </router-link>
        </div>
        <router-link  to="/LoanApply"  class="btn btn-warning  pull-right navBtn">意向融资</router-link>
      </template>
  <!-- </p> -->
</div>
</div>
<div class="row col-md-12 bb-4">
  <div class="col-md-1"></div>
  <div class="col-md-10 ">
    <div class="col-md-7 text-left">
      <img src="../img/logo.png" alt="" />
      <b style="font-size: x-large; vertical-align: middle;">华氏国际商业保理在线服务平台</b>
    </div>
    <div class="col-md-5 list">
      <router-link  class="margin-15" to="/">首页</router-link>
      <router-link  class="margin-15" to="/product">产品介绍</router-link>
      <router-link  class="margin-15" to="/contactUS">联系我们</router-link>
      <div style="display:inline-block;position: relative;z-index: 50">
        <a  href="javasript:vovi(0)"  @click="getRef" >
          会员中心
          &nbsp;
        </a>
        <button  @click="isshow"  style="background-color:#fff;border:none" data-toggle="dropdown" class="btn dropdown-toggle "><span class="caret" ></span></button>
        <ul  style="position: absolute;width:100%; left: 0;top:100%;background: #fff" v-if="show" >
          <li class="text-center" @click="hide">  <router-link to="/changePwd">修改密码</router-link></li>
          <li  class="text-center" @click="hide"> <router-link to="/countMng">用户信息</router-link></li>
          <li  class="text-center"  @click="hide"> <router-link to="/enterpriseInfo">企业信息</router-link></li>
          <li  class="text-center"  @click="hide"> <router-link to="/userMng">账号信息</router-link></li>
        </ul>
      </div>

    </div>
  </div>
  <div class="col-md-1"></div>
</div>
</div>
</div>
</template>

<script>
import cookie from "@/cooike/api.js";
import { delCookie, getCookie } from "@/http/sos.js";
import url from '@/http/url'
export default {
  name: "headers",
  http: {
    headers: url.headers
  },
  computed: {
    userNames: function() {
      return (this.userName = $.cookie("user"));
    },
    userId () {
      const json = JSON.parse(sessionStorage.getItem('sessionData'))
      if (json) return json.userId
      else return ''
    },
    // ---------------------------------------------------------
    header () { return this.$store.state.header }
  },
  data() {
    return {
      show: false,
      // userName:getCookie('user'),
      isLogin: sessionStorage.getItem('sessionData'),
      userName: "",
      atoken: ""
    };
  },
  created () {
    if (sessionStorage.getItem('sessionData')) {
      this.$store.commit('isLogin', true)
    }
  },
  methods: {
    isshow: function() {
      var that = this;
      var as = sessionStorage.getItem("token");
      if (!as) {
        that.show = true;
      } else {
        that.show = !that.show;
      }
    },
    hide: function() {
      this.show = false;
    },
    getRef: function() {
      if (sessionStorage.getItem("token") != null) {
        this.$router.push("/homepage");
        // window.location.reload(); //刷新当前页面
      } else {
        alert("请先登录");
        this.$router.push("/login");
        return false;
      }
      // window.location.reload(); //刷新当前页面
    },
    outLogin: function() {
      if (confirm("是否退出")) {
        delCookie("user");
        sessionStorage.clear();
        this.$http.get(url.logout, {
          headers: url.headers
        })
        this.$router.push("/login");
        // ------------------------------------------------------------
        this.$store.commit('isLogin', false)
      } else {
        return false;
      }
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  font-family: "微软雅黑";
}
/*.headers{width: 100%;overflow: hidden;}*/
.headers {
  width: 100%;
}
.nav {
  height: 50px;
  background-color: #0e0423;
  width: 100%;
  padding-right: 30px;
}
.navBtn {
  border-radius: 10px;
  width: 106px;
  height: 30px;
  line-height: 30px;
  margin-top: 10px;
  margin-right: 40px;
}
.w24 {
  padding: 5px;
}
.w24 .userBox {
  display: block;
  width: 40px;
  text-align: center;
}
.w24 .userBox img {
  display: block;
  margin-left: 10px;
}
.w24 .userBox span {
  display: inline-block;
  text-align: center;
  color: #ffffff;
}
/*.w24 img{width: 18px;display: inline-block;margin: 5px auto 0}*/
/*.w24{width: 46px;height: 50px; margin-right: 30px;}*/
/*.w24 a{display: inline-block;width: 26px;font-size: 10px; text-align: center; text-decoration: none;color: #fff}*/
.bb-4 {
  border-bottom: 4px solid #f0ad4e;
  padding-top: 15px;
  padding-bottom: 15px;
}
.list a {
  color: #333;
  display: inline-block;
  height: 39px;
  line-height: 39px;
  font-size: 18px;
}
a {
  cursor: pointer;
}
.list a:hover {
  text-decoration: none;
}
.a-active {
  color: #fca91d;
}
.margin-15 {
  margin-left: 15px;
  margin-right: 15px;
}
</style>
