      <!--综合查询-->
      <template>
            <div class="LoanApply" >
                <div class="row" style="margin-bottom:20px;">
                  <!-- <div class="row">
                    <div class="col-md-10 col-md-offset-1">
                        <div class="col-md-12 textHeight">
                           <div class="col-md-12">
                              <a href="javascript:vovi(0)"><img src="../../img/u26.png" alt="" /><span class="h2">融资意向申请</span></a>
                        </div>
                  </div> -->
                  <div class="banner ">
                    <div class="container-fluid">
                      <div class="row-fluid">
                        <div class="span12">
                          <div class="carousel slide bannerimg" id="carousel-ad" data-ride="carousel" data-interval="2000">
                            <ol class="carousel-indicators">
                              <li data-slide-to="0" data-target="#carousel-ad">
                              </li>
                              <li data-slide-to="1" data-target="#carousel-ad" class="active">
                              </li>
                              <!-- <li data-slide-to="2" data-target="#carousel-ad">
                              </li> -->
                            </ol>
                            <div class="carousel-inner">
                              <div class="item" style="background: url(./static/img/banner1.png) no-repeat 100% 100%;background-size: 100% 100%">
                                <!-- <img alt="" src="../img/banner1.png" /> -->
                              </div>
                              <div class="item active"  style="background: url(./static/img/banner2.png) no-repeat 100% 100%;background-size: 100% 100%">
                                <!-- <img alt="" src="../img/banner2.png" /> -->
                              </div>
                              <!-- <div class="item" style="background: url(./static/img/banner3.png)  0 0 no-repeat;;background-size: 100% 100% "> -->
                                <!-- <img alt="" src="../img/banner3.png" /> -->
                              <!-- </div> -->
                            </div> <a data-slide="prev" href="#carousel-ad" class="left carousel-control">‹</a> <a data-slide="next" href="#carousel-ad" class="right carousel-control">›</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-10 col-md-offset-1 ">
                        <div class="col-md-8 col-md-offset-2">
                              <div class="col-md-12 " style="padding-bottom:20px;padding-top:20px;">
                                    <form role="form ">
                                          <div class="form-group col-md-12 ">
                                                <label class="col-md-3 text-right h5">意向贷款金额<span class="text-red">*</span></label>
                                                <div class=" col-md-6 input-group">
                                                      <input type="text" class="form-control"  placeholder="请输入贷款金额.." v-model="ApplyData.loanAmt" onkeyup="this.value=this.value.replace(/[^0-9.]+/,'');" />
                                                      <div class="input-group-addon">元</div>
                                                </div>
                                          </div>

                                          <div class="form-group col-md-12 ">
                                                <label class="col-md-3 text-right h5">联系人<span class="text-red">*</span></label>
                                                <div class=" col-md-6 input-group">
                                                      <input type="text" class="form-control"  placeholder="请输入联系人..." v-model="ApplyData.linkman" />
                                                </div>
                                          </div>

                                          <div class="form-group col-md-12 ">
                                                <label class=" text-right h5 col-md-3">手机号码<span class="text-red">*</span></label>
                                                <div class=" col-md-6 input-group" style="position: relative">
                                                      <input type="text" class="form-control"  placeholder="请输入手机号码..." v-model="ApplyData.linktel"  @blur="istel1" />
                                                      <div style="position: absolute;width:100%; height: 100%;font-size:9px; line-height:2.5;color:#f00;text-center;left: 100%;top: 0" v-if="istel">
                                                        x手机格式不正确
                                                  </div>
                                            </div>
                                      </div>


                                      <div class="form-group col-md-12 ">
                                          <label class="col-md-3 text-right h5">输入验证码<span class="text-red">*</span></label>
                                          <div class="col-md-6 pdb0">
                                                <div class="input-group  col-md-12">
                                                      <input type="text" class="form-control"  placeholder="请输入验证码..." v-model="ApplyData.valiNo" />
                                                </div>
                                          </div>
                                          <div class="col-md-3 ">
                                                <button
                                                  :disabled="codeBtn"
                                                  type="button"
                                                  @click="getTels"
                                                  class=" btn btn-success btn-sm"
                                                  id="btnSendCode1"
                                                  >发送验证码
                                                </button>
                                          </div>
                                    </div>
                              </form>
                              <div class="text-center mg">
                                    <button
                                      type="submit"
                                      class="btn btn-md btn-warning"
                                      @click="getApply"
                                      >立即申请
                                    </button>
                                    <span v-if="applyTip">带<code>*</code>的为必输项<code>!!!</code></span>
                              </div>
                        </div>
                  </div>
            </div>
      </div>
</div>
</div>
</div>
</template>
<script>
import URL from "@/http/url.js";

export default {
  name: "LoanApply",
  components: {},
  data() {
    return {
      applyTip: false,
      codeBtn: true,
      url: "",
      istel: false,
      InterTime: {
        InterValObj: "", //timer变量，控制时间
        count: 60, //间隔函数，1秒执行
        curCount: "", //当前剩余秒数
        codeLength: 6 //验证码长度
      },
      ApplyData: {
        loanAmt: "", //融资金额
        linkman: "", //联系人
        linktel: "", //linktel联系人手机
        valiNo: "" //短信验证
      }
    };
  },
  watch: {
    'ApplyData.linktel' (val) {
      if (val.length === 11) {
        if (/0?(13|14|15|18)[0-9]{9}/.test(val)) {
          this.codeBtn = false
        } else {
          this.codeBtn = true
        }
      }
    }
  },
  methods: {
    istel1: function() {
      if (this.ApplyData.linktel) {
        var reg = /0?(13|14|15|18)[0-9]{9}/;
        var txt = reg.test(this.ApplyData.linktel);
        if (!txt) {
          this.istel = true;
        } else {
          this.istel = false;
        }
      } else {
        this.istel = false;
      }
    },
    getApply: function() {
      for (const key of Object.keys(this.ApplyData)) {
        if (!this.ApplyData[key]) {
          this.applyTip = true
          return
        }
      }
      var ApplyUrl = URL.usermng.financingmng.insert;
      this.url = ApplyUrl;
      this.$http
        .post(this.url, JSON.stringify(this.ApplyData))
        .then(function(res) {
          console.log(res);
          if (res.body.retcode == 200) {
            alert("申请成功");
            this.$router.push("/success");
          } else {
            alert('服务器响应错误');
          }
        });
    },
    getTels: function() {
      var that = this;
      that.InterTime.curCount = that.InterTime.count;
      // alert("发送成功...")
      if (that.istel == true || that.ApplyData.linktel == "") {
        return false;
      }
      $("#btnSendCode1").attr("disabled", "true");
      $("#btnSendCode1").html(that.InterTime.curCount + "秒再获取");

      that.InterTime.InterValObj = window.setInterval(function() {
        if (that.InterTime.curCount == 0) {
          $("#btnSendCode1").html("重新发送验证码");
          $("#btnSendCode1").removeAttr("disabled");
          widow.clearInterval(that.InterTime.InterValObj);
        } else {
          that.InterTime.curCount--;
          $("#btnSendCode1").html(that.InterTime.curCount + "秒再获取");
        }
      }, 1000); //启动计时器，1秒执行一次
      //向后台发送处理数据
      var telurl = URL.external.sessionTel;
      this.$http
        .post(telurl, { tel: this.ApplyData.linktel }, { emulateJSON: true })
        .then(function(respone) {
          console.log(respone);
        });
    }
  }
};
</script>
<style scoped>
.LoanApply {
  width: 100%;
  overflow: hidden;
}
.textHeight {
  margin-top: 20px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 4px solid #f0ad4e;
}
.col-md-8 h4 {
  margin-bottom: 15px;
}
.border {
  border: 1px solid #999;
  padding: 20px 15px 35px;
  margin-top: 15px;
  margin-bottom: 30px;
}
.col-md-5 .h4 {
  font-weight: bold;
  color: #000000;
}
.text-right h4 {
  height: 40px;
  line-height: 40px;
}
.pdb0 {
  padding-right: 0;
  padding-left: 0;
}
.mg {
  margin: 15px auto;
}
.text-red {
  color: red;
}

.container-fluid {
 padding-right: 0px; 
 padding-left: 0px; 
}
.banner{
  padding: 0;
  width: 100%;
  margin: 0;
}
.carousel-control {
  line-height: 450px;
  text-align: center;
  font-size: 100px;
}
.img-block{
  display: inline-block;
  margin: 0 auto
}
.item{
  height: 450px;
}
</style>
