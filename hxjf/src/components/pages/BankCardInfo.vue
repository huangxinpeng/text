  <!--银行卡管理 页面-->
  <template>
    <div class="BankCardInfo" >
        <div class="" style="margin-bottom:20px;">
            <div class="row">
                <div class="col-md-10 col-md-offset-1">
                  <div class="col-md-12 textHeight">
                     <div class="col-md-12">
                        <a href="#"><img src="../../img/u26.png" alt="" />&nbsp;&nbsp;<span class="h4">银行卡管理</span></a>
                        <button class="btn btn-default pull-right margint btn-sm" onclick="window.history.go(-1)">返回</button>
                    </div>
                  </div>
                    <div class="col-md-10 col-md-offset-1">
                         <form  class="" role="form">
                                <div class="form-group col-md-6 pb0">
                                    <label  class="col-md-5 text-right">
                                   <h5>账户类型&nbsp;&nbsp; <span class="text-warning">*</span>&nbsp;&nbsp;</h5></label>
                                    <div class="col-md-7 pb0 input-group">
                                        <select name="user"  v-model="info.accountType" class="form-control" >
                                                    <option value="00">请选择...</option>
                                                    <option value="0">贷款账户</option>
                                                    <option value="1">结算账户</option>
                                                    <option value="2">保证金账户</option>
                                                    <option value="3">回款账户</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="form-group col-md-6 pb0">
                                    <label  class="col-md-5 text-right">
                                    <h5>账户类别&nbsp;&nbsp;<span class="text-warning">*</span>&nbsp;&nbsp;</h5></label>
                                    <div class="col-md-7 pb0  input-group">
                                        <select name="user" v-model="info.accountCategory"  class="form-control"  >
                                                    <option value="00">请选择...</option>
                                                    <option value="0">收款账户</option>
                                                    <option value="1">付款账户</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="form-group col-md-6 pb0">
                                    <label  class="col-md-5 text-right">
                                    <h5>选择银行&nbsp;&nbsp;<span class="text-warning">*</span>&nbsp;&nbsp;</h5></label>
                                    <div class="col-md-7 pb0  input-group">
                                        <select name="user" v-model="info.openBankNo"   class="form-control" >
                                                    <option value="">请选择...</option>
                                                    <option value="static/img/u18.jpg">工商银行</option>
                                                    <option value="static/img/u17.jpg">建设银行</option>
                                                    <option value="static/img/u20.jpg">招商银行</option>
                                                    <option value="static/img/u19.jpg">农业银行</option>
                                                 <!--    <option value="工商银行">工商银行</option>
                                                    <option value="建设银行">建设银行</option>
                                                    <option value="招商银行">招商银行</option>
                                                    <option value="农业银行">农业银行</option> -->
                                        </select>
                                    </div>
                                </div>

                                <div class="form-group col-md-6 pb0">
                                    <label  class="col-md-5 text-right">
                                    <h5>开户名&nbsp;&nbsp;<span class="text-warning">*</span>&nbsp;&nbsp;</h5></label>
                                    <div class="col-md-7 pb0  input-group">
                                            <input type="text"   placeholder="请输入开户名..."   class="form-control" v-model="info.accountName"   />
                                    </div>
                                </div>

                                <div class="form-group col-md-6 pb0">
                                    <label  class="col-md-5 text-right">
                                    <h5>开户行&nbsp;&nbsp;<span class="text-warning">*</span>&nbsp;&nbsp;</h5></label>
                                    <div class="col-md-7 pb0  input-group">
                                        <input type="text"  placeholder="请输入开户行..."   class="form-control" v-model="info.openBrcode"  />
                                    </div>
                                </div>

                                <div class="form-group col-md-6 pb0">
                                    <label  class="col-md-5 text-right">
                                    <h5>账号&nbsp;&nbsp;<span class="text-warning">*</span>&nbsp;&nbsp;</h5></label>
                                    <div class="col-md-7 pb0  input-group">
                                        <input type="text"  placeholder="请输入账号..."   class="form-control"  v-model="info.accountNo"  />
                                    </div>
                                </div>

                                <div class="form-group col-md-6 pb0">
                                    <label  class="col-md-5 text-right">
                                    <h5>开户省份&nbsp;&nbsp;<span class="text-warning">*</span>&nbsp;&nbsp;</h5></label>
                                    <div class="col-md-7 pb0  input-group">
                                        <select name="user"  class="form-control"  v-model="info.openProvince" >
                                                    <option value="0">请选择...</option>
                                                    <option value="1">广东省</option>
                                                    <option value="2">云南省</option>
                                                    <option value="3">北京</option>
                                                    <option value="4">福建省</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="form-group col-md-6 pb0">
                                    <label  class="col-md-5 text-right">
                                    <h5>开户城市&nbsp;&nbsp;<span class="text-warning">*</span>&nbsp;&nbsp;</h5></label>
                                    <div class="col-md-7 pb0  input-group">
                                        <select name="user"  class="form-control"  v-model="info.openCity" >
                                                    <option value="0">请选择...</option>
                                                    <option value="1">广州市</option>
                                                    <option value="2">深圳市</option>
                                                    <option value="3">珠海市</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="col-md-12 text-center">
                                <p>
                                     <button type="button" class="btn btn-warning btn-sm btn-lr" @click="getSubmit">保存</button>    

                                    <button type="button" class="btn   btn-btn-default btn-sm btn-lr"   onclick="window.history.go(-1)">返回</button>             
                                </p>
                                </div>
                         </form>
                    </div>
                </div>
            </div>
        </div>
  </div>
  </template>

  <script>
import URL from '@/http/url.js'
  export default {
    name: 'BankCardInfo',
    components:{
    },
    data(){
        return {
            info:{
                    accountType:'',//账户类型
                     accountCategory:'',//账户类别
                     openBankNo:'',//选择银行
                     accountName:'',//开户名
                     openBrcode:'',//开户行
                     accountNo:'',//账户
                     openProvince:'',//开户省份
                    openCity:''//开户城市
            }
        }
    },
    methods:{
        getSubmit(){
            var getSubmitUrl=URL.usermng.custaccount.insert
            this.$http.post(getSubmitUrl,JSON.stringify(this.info), { headers:URL.headers },{emulateJSON:true}).then(function(res){
                if(res.body.retcode=="200"){
                    alert("添加成功")
                    this.$router.push('/userMng')
                }
         console.log(res)
            })
        }
    }
  }

  </script>

  <style scoped>
.BankCardInfo{width: 100%;overflow: hidden;}
.pb0{padding-right: 0;padding-left: 0}
.textHeight{margin-top: 20px;margin-bottom: 15px; padding-bottom:6px;border-bottom: 4px solid #f0ad4e; }
.margint{margin-top: 15px; border:1px solid #5bc0de; color:#5bc0de;}
.btn-lr{ margin-right: 15px;margin-left: 15px; }
  </style>
