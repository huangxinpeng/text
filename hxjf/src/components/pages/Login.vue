a  <!-- 会员首页 页面-->
<template>
  <div class="Login userhome-bg" >
    <div class=" " style="margin-bottom:20px;">
      <div class="row ">
        <div class="col-md-4 col-md-offset-7" >
          <div class="col-md-12 border-b">
            <form role="form" >
              <div class="col-md-12">
                <div class="col-md-5 col-md-offset-3 text-left" >
                  <a href="#" class="h4">企业用户登录</a>
            </div>
            <!-- <div class="col-md-7 text-center">
                  <router-link to="/register" class="h4">企业用户注册</router-link>
            </div> -->
      </div>
      <br>
<div class="col-md-12 from-group mtb-15 ">
    <label class="col-md-5 h4">企业登录帐号</label>
    <div class="col-md-7 input-group">
      <input type="text" class="form-control" placeholder="请输入用户名..." v-model="login.userName"  />
</div>
</div>
<div class="col-md-12 from-group mtb-15 ">
    <label class="col-md-5 h4">企业登录密码</label>
    <div class="col-md-7 input-group">
      <input type="password" class="form-control" placeholder="请输入密码..." v-model="login.passWord"  />
</div>
</div>

<div class="col-md-12 from-group mtb-15  ">
    <label class="col-md-5 h4">验证码</label>
    <div class="col-md-7 pd">
      <div class="col-md-6 mlr pd">
        <div class="col-md-12  input-group pd ">
          <input type="text"  class="form-control"  v-model="login.loginValiNo"  />
        </div>
      </div>
      <div class="col-md-5 pd mlr input-group"
        style="display: inline-block; margin-left: 8.33%;">
        <!-- <img src="../../img/u16.jpg" alt=""  width="100%"  style="display: inline-block;cursor:pointer"  @click="gets" /> -->
        <!-- <span class="verifyCode"
          @click="gets"
          style="cursor: pointer"
          >{{verifyCode ? verifyCode : '验证码'}}
        </span> -->
        <verify-code/>
      </div>
  </div>
</div>
<div class="col-md-12 text-center mtb-20 ">
    <button type="submit" class="col-md-8 col-md-offset-2 btnlg"
      @click="getLogin">立即登陆
    </button>
    <br>
</div>
<router-link to="/register"
  class="col-md-6 col-md-offset-3"
  style="margin-top: 10px; color: #58a;"
  >没有账号?马上注册一个
</router-link>
</form>
</div>
</div>
</div>
</div>
</div>
</template>
<script>
import URL from "@/http/url.js";
import { setCookie, getCookie } from "@/http/sos.js";
// ---------------------------------------------------------------------------
import verifyCode from '@/components/global/verify-code'
export default {
  name: "Login",
  components: {
    verifyCode
  },
  computed: {
    header () { return this.$store.state.header }
  },
  data() {
    return {
      url: "",
      login: {
        userName: "", //账号
        passWord: "", //密码
        pageType: 0, //0 供应商   1 核心企业
        loginValiNo: "" //验证码
      },
      // ----------------------------------------------------------------------------
      verifyCode: ''
    };
  },
  methods: {
    getLogin: function() {
      var loginUrl = URL.pageLogin.login;
      this.url = loginUrl;
      this.$http.post(this.url, this.login, { emulateJSON: true }).then(
        function(respone) {
          console.log(respone.body.code);
          if (respone.body.code == "1002") {
            console.log(respone);
            sessionStorage.setItem("token", respone.body.message);
            console.log(respone.body.obj);
            sessionStorage.setItem(
              "sessionData",
              JSON.stringify(respone.body.obj)
            );
            setCookie("user", this.login.userName, 1000 * 60);
            this.isyes = false;
            this.$router.push("/homepage");
            // --------------------------------------------
            this.$store.commit('isLogin', true)
          } else {
            alert("登录失败！用户名或者密码不正确");
          }
        },
        function(error) {
          alert('服务器出错');
        }
      );
    },
    /*//发送验证码
    gets: function() {
      var getsUrl = URL.external.sessionVali;
       this.$http.post(getsUrl).then(function(respone) {
        this.login.loginValiNo = respone.body;
      });
      this.$http.post(getsUrl)
        .then(res => this.verifyCode = res.bodyText
        , res => alert('出错了'))
    }*/
  }
};
</script>

<style scoped>
.Login {
  width: 100%;
  overflow: hidden;
}
.pd {
  padding-left: 0;
  padding-right: 0;
}
.userhome-bg {
  height: 450px;
  background: url("../../img/banner2.png") 0 0 no-repeat;
  background-size: 100% 100%;
  background-position: 100% 100%;
}
.border-b {
  padding: 30px;
  margin-top: 80px;
  border: 1px solid #666;
  background-color: #fff;
  padding: 15px;
}
a {
  text-decoration: none;
  color: #000;
  font-weight: bold;
}
.mtb-15 {
  margin-top: 15px;
}
.mlr {
  margin-left: 0;
  margin-right: 0;
}
.btnlg {
  background-color: #f0ad4e;
  color: #fff;
  padding-top: 7px;
  padding-bottom: 7px;
  font-size: 18px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  font-weight: bold;
}
.mtb-20 {
  margin-top: 20px;
}
</style>
