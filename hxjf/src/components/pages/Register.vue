  <!-- 企业用户注册 页面-->
  <template>
    <div class="Register" >
      <div class="" style="margin-bottom:20px;">
        <div class="row">
          <div class="col-md-10 col-md-offset-1">
            <div class="col-md-12 textHeight">
             <div class="col-md-5">
              <a href="#"><img src="../../img/u26.png" alt="" /><span class="h4">企业用户注册</span></a>
            </div>
            <div class="col-md-7 text-right" >
              <h4>已是我们会员，请点击 
                <router-link to="/login">登陆</router-link>
              </h4>
            </div>
          </div>
          <div class="row">
            <form  class="col-md-8 col-md-offset-2 " role="form">
              <div class="form-group col-md-12" >
                <label  class="col-md-4 h4 text-right ">企业名称<span class="text-red">*</span></label>
                <div class="col-md-8 input-group" >
                 <input type="text" class="form-control"   placeholder="请输入企业名称..." v-model="regData.costName" />
               </div>
             </div>

             <div class="form-group col-md-12">
              <label  class="col-md-4 h4 text-right ">企业类型<span class="text-red">*</span></label>
              <div class="col-md-8 input-group">
               <select name="select"  class="form-control" v-model="regData.costType">
                <option value="00">供应商</option>
                <option value="01">核心企业</option>
              </select>
            </div>
          </div>

          <div class="form-group col-md-12">
            <label  class="col-md-4 h4 text-right">证件类型<span class="text-red">*</span></label>
            <div class="col-md-8 input-group">
             <select name="select" class="form-control" v-model="regData.certType" >
              <option value="00">组织机构代码</option>
              <option value="01">营业执照</option>
              <option value="02">社会信用代码</option>
            </select>
          </div>
        </div>

        <div class="form-group col-md-12">
          <label  class="col-md-4 h4 text-right">证件号码<span class="text-red">*</span></label>
          <div class="col-md-8 input-group">
            <input type="text" class="form-control"  placeholder="请输入证件号码..." v-model="regData.certNo" />
          </div>
        </div>

        <div class="form-group col-md-12">
          <label  class="col-md-4 h4 text-right">管理员用户名<span class="text-red">*</span></label>
          <div class="col-md-8 input-group relative" >
            <input type="text" class="form-control" placeholder="用户名长度大于2位..."  v-model="regData.userName"  @blur="VFuserName" />
            <div class="next" v-if="name">
              该用户名已存在！请重新输入
            </div>
          </div>
        </div>

        <div class="form-group col-md-12">
          <label  class="col-md-4 h4 text-right  ">登录密码<span class="text-red">*</span></label>
          <div class="col-md-8 input-group relative">
           <input type="password"  @blur="getLength" placeholder="请输入密码，长度大于6小于18..."   class="form-control"  :class="{red:red}"  v-model="regData.passWord" @keyup="Passkeyup1"    />
           <div  class="next"  v-if="lengts">
            密码长度要大于等于6位小于18位
          </div>
        </div>
      </div>

      <div class="form-group col-md-12 ">
        <label  class="col-md-4 h4 text-right ">确认密码<span class="text-red">*</span></label>
        <div class="col-md-8 input-group relative" >
         <input type="password" class="form-control"  :class="{red:red}"   v-model="ispassWord" @blur="passBlur" @keyup="Passkeyup"    />
         <div class="next"  v-if="isBlur" >
           两次输入的密码不对
         </div>
       </div>
     </div>

     <div class="form-group col-md-12">
      <label  class="col-md-4  h4 text-right">手机号<span class="text-red">*</span></label>
      <div class="col-md-8 input-group" style="position: relative">
        <input type="text" class="form-control" placeholder="请输入手机号码" @blur="istel1"  v-model="regData.tel"  />

        <div style="position: absolute;width:100%; height: 100%;font-size:9px; line-height:2.5;color:#f00;text-center;left: 100%;top: 0" v-if="istel">
          x手机格式不正确
        </div>
      </div>
    </div>
    <div class="form-group col-md-12">
      <label  class="col-md-4  h4 text-right ">短信验证码<span class="text-red">*</span></label>
      <div class="col-md-8 input-group">
        <div class="col-md-7 pdb0">
          <input type="text" class="form-control" placeholder="请输入验证码"
            v-model="regData.valiNo" />
        </div> 
        <div class="col-md-5 pdb0 text-center">
          <button
            :disabled="btnSendVerify"
            type="button"
            id="btnSendCode"
            class="btn btn-sm btn-warning "
            @click="getTel"
            >{{ `发送验证码 ${count || ''} ` }}
          </button>
        </div> 
      </div>
    </div>

    <div class="form-group col-md-12">
      <label  class="col-md-4  h4 text-right">验证码<span class="text-red">*</span></label>
      <div class="col-md-8 input-group">
        <div class="col-md-7 pdb0">
          <input type="text"  class="form-control" v-model="regData.loginValiNo" />
        </div> 
        <div class="col-md-offset-1 col-md-3 pdb0 text-center">
          <verify-code/>
        </div> 
      </div>
    </div>

    <div class="col-md-12 text-center">
     <button
       :disabled="btnRegister"
       type="button"
       class="btn btn-warning btn-lg"
       @click="getRegistes"
       >同意以下协议并注册
     </button>
     <br>
     <router-link to="/contDown" class=" h6 text-muted" ><<华夏金服在线服务平台会员服务协议>></router-link >
   </div>
 </form>
</div>
</div>
</div>
</div>
</div>
</template>

<script>
import footder from "../../components/footder.vue";
import headers from "../../components/header.vue";
import URL from "@/http/url.js";
// ----------------------------------------------------------------
import verifyCode from '@/components/global/verify-code'
export default {
  name: "Register",
  components: {
    footder,
    headers,
    // ----------------------------
    verifyCode
  },
  data() {
    return {
      red: false,
      lengts: false,
      isBlur: false,
      name: false,
      istel: false,
      url: "",
      InterTime: {
        InterValObj: "", //timer变量，控制时间
        count: 60, //间隔函数，1秒执行
        curCount: "", //当前剩余秒数
        codeLength: 6 //验证码长度
      },
      ispassWord: "", //确认密码
      //注册接口
      regData: {
        costName: "", //企业名称
        costType: "", //企业类型
        certType: "", //证件类型
        certNo: "", //证件号码
        userName: "", //管理员用户名
        passWord: "", //登录密码
        tel: "", //手机号码
        valiNo: "", //短信验证码
        loginValiNo: "" //验证码
      },
      // -----------------------------------------------------------------------------
      btnSendVerify: true,
      btnRegister: false,
      count: 0,
      verifyCode: '',
    };
  },
  watch: {
    'regData.tel' (val) {
      if (val.length === 11) this.btnSendVerify = false
      else this.btnSendVerify = true
    }
  },
  mounted () {
    this.getValiNo()
  },
  methods: {
    //验证手机
    istel1: function() {
      if (this.regData.tel) {
        var reg = /0?(13|14|15|18)[0-9]{9}/;
        var txt = reg.test(this.regData.tel);
        if (!txt) {
          this.istel = true;
        } else {
          this.istel = false;
        }
      } else {
        this.istel = false;
      }
    },
    //验证用户名
    VFuserName: function() {
      // alert(1)
      if (this.regData.userName.length)
        var vfUrl =
          URL.external.isUserName + "?userName=" + this.regData.userName;
      this.$http.get(vfUrl).then(
        function(respone) {
          if (respone.body.count == 1) {
            this.name = true;
          } else {
            this.name = false;
          }
          console.log(respone.body.count);
          // alert(1)
        },
        function(error) {}
      );
    },
    getRegistes: function() {
      for (const key of Object.keys(this.regData)) {
        if (!this.regData[key]) {
          alert('还有信息未填写完毕')
          return
        }
      }
      //发起认证
      // alert(1)

      if (
        this.lengts == true ||
        this.isBlur == true ||
        this.red == true ||
        this.name == true
      ) {
        alert("您的输入有误！请重新输入");
      } else {
        var regUrl = URL.external.register;
        this.url = regUrl;
        this.$http
          .post(this.url, this.regData, { emulateJSON: true })
          .then(function(respone) {
            if (respone.data.code == "1002") {
              alert("注册成功");
              this.$router.push("/login");
            } else {
              alert("注册失败");
            }
          });
      }
    },
    getTel: function() {
      /*for (const key of Object.keys(this.regData)) {
        if (!this.regData[key]) {
          alert('请先填写完所有信息')
          return
        }
      }*/

      var that = this;
      that.InterTime.curCount = that.InterTime.count;
      //SetRemainTime(item,obj)    curCount      InterValObj
      if (this.istel == true || that.regData.tel == "") {
        alert("手机号码不正确或格式不正确");
        return false;
      }
      //设置button效果，开始计时
      $("#btnSendCode").attr("disabled", "true");
      $("#btnSendCode").html(that.InterTime.curCount + "秒再获取");

      that.InterTime.InterValObj = window.setInterval(function() {
        if (that.InterTime.curCount == 0) {
          $("#btnSendCode").html("重新发送验证码");
          $("#btnSendCode").removeAttr("disabled");
          widow.clearInterval(that.InterTime.InterValObj);
        } else {
          that.InterTime.curCount--;
          $("#btnSendCode").html(that.InterTime.curCount + "秒再获取");
        }
      }, 1000); //启动计时器，1秒执行一次
      //向后台发送处理数据
      var telUrl = URL.external.sessionTel;
      this.$http.post(telUrl, { tel: this.regData.tel }, { emulateJSON: true })
        .then(function(respone) {
          console.log(respone);
        });

      //手机验证
      // alert('发送成功')
      // var telUrl=URL.external.sessionTel
      // this.$http.post(telUrl,{tel:this.regData.tel},{emulateJSON:true}).then(function(respone){
      //   console.log(respone)
      // })
    },
    getValiNo: function() {
      //验证码
      var ValiNoUrl = URL.external.sessionVali;
      this.$http.post(ValiNoUrl).then(function(respone) {
        console.log(respone)
        // console.log(respone.body)
        // alert('认证成功,您的验证码为：'+respone.body)
        this.verifyCode = respone.bodyText;
      });
    },
    passBlur: function() {
      if (this.ispassWord != this.regData.passWord) {
        this.isBlur = true;
      } else {
        this.isBlur = false;
      }
    },
    Passkeyup: function() {
      this.red = false;
    },
    getLength: function() {
      if (
        this.regData.passWord.length < 6 ||
        this.regData.passWord.length > 18
      ) {
        this.lengts = true;
      }
      if (this.ispassWord == this.regData.passWord) {
        this.isBlur = false;
      }
    },
    Passkeyup1: function() {
      this.lengts = false;
    }
  }
};
</script>
 <style scoped>
.Register {
  width: 100%;
  overflow: hidden;
}
.textHeight {
  margin-top: 20px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 4px solid #f0ad4e;
}
.col-md-5 .h4 {
  font-weight: bold;
  color: #000000;
}
.text-right h4 {
  height: 40px;
  line-height: 40px;
}
.form-group {
  margin-bottom: 15px;
  display: block;
}
input,
select {
  width: 80%;
}
.pdb0 {
  padding-right: 0;
  padding-left: 0;
}
.red {
  border: 1px solid #f00;
}
.next {
  width: 100%;
  position: absolute;
  left: 100%;
  top: 0;
  line-height: 2.5;
  color: red;
}
.relative {
  position: relative;
}
.text-red {
  color: red;
}
</style>
