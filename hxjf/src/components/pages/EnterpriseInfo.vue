        <!-- 企业信息管理 页面-->
        <template>
          <div class="EnterpriseInfo" >
            <div class="" style="margin-bottom:20px;">
              <div class="row">
                <div class="col-md-10 col-md-offset-1">
                  <div class="col-md-12 textHeight">
                    <div class="col-md-12">
                      <a href="#">
                        <!-- <img src="../../img/u26.png" alt="" /> -->
                        <span class="h4">企业用户注册</span>
                      </a>
                      <!-- <router-link class="btn btn-default pull-right margint btn-sm" to='/homepage' style="margin-top:15px;">返回</router-link> -->
                    </div>
                  </div>
                <div class="row">
                  <form role="form" class="col-md-10 col-md-offset-1">
                    <div class="col-md-12">
                      <div class="from-group col-md-6 ">
                       <label  class="col-md-4"><h4>企业名称</h4></label>
                       <div class="col-md-8  input-group">
                         <input  name="username" placeholder="请输入企业名称..."  :value="info.custName"  disabled="disabled" type="text" class="form-control"    /><!-- v-model="info.custName" -->
                       </div>
                     </div>
                     <div class="from-group col-md-6 ">
                       <label  class="col-md-4"><h4>注册资金</h4></label>
                       <div class="col-md-8  input-group">
                         <input  name="moeny"  placeholder="请输入注册资金..."   type="text" class="form-control" v-model="info.certCapital"  />
                       </div>
                     </div>
                   </div>


                   <div class="col-md-12">
                    <div class="from-group col-md-6 ">
                     <label  class="col-md-4"><h4>证件类型</h4></label>
                     <div class="col-md-8 input-group">
                       <select name="selec1t"   class="form-control"  v-model="info.certType" >
                        <option value="00">组织机构代码</option>
                        <option value="01">营业执照</option>
                        <option value="02">社会信用统一代码</option>
                      </select>
                    </div>
                  </div>
                  <div class="from-group col-md-6 ">
                   <label  class="col-md-4"><h4>证件号码</h4></label>
                   <div class="col-md-8  input-group">
                     <input type="text" v-model="info.certNo" placeholder="请输入证件号码.." class="form-control"   />
                   </div>
                 </div>
               </div>

               <div class="col-md-12  ">
                <div class="from-group col-md-6 ">
                 <label  class="col-md-4"><h4>所属行业</h4></label>
                 <div class="col-md-8 input-group ">
                  <select name="select" class="form-control" v-model="info.industry"   >
                    <option   value="00">请选择....</option>
                    <option   value="01">企业</option>
                    <option   value="02">医疗机构</option>
                  </select>
                </div>
              </div>

              <!-- 选择企业     enterprise-->
              <div class="from-group col-md-6  enterprise" v-if="ok2">
               <label  class="col-md-4"><h4>企业规模</h4></label>
               <div class="col-md-8  input-group " >
                <select name="select"  class="form-control" v-model="info.enterpriseScale"   >
                  <option value="0">请选择....</option>
                  <option value="1">大型</option>
                  <option value="2">中型</option>
                  <option value="3">小型</option>
                  <option value="4">微型</option>
                  <option value="5">其他</option>
                </select>
              </div>
            </div>


            <!-- 选择医疗企业    Medical -->
            <div class="from-group col-md-6  medical " v-if="ok1">
             <label  class="col-md-4"><h4>评级</h4></label>
             <div class="col-md-8  input-group " >
              <select name="select"  class="form-control"   v-model="info.grade"   >
                <option value="0">请选择....</option>
                <option value="1">三级甲等</option>
                <option value="2">三级乙等</option>
                <option value="3">三级丙等</option>
                <option value="4">三级（特）</option>
                <option value="5">二级甲等</option>
                <option value="6">二级等</option>
                <option value="7">二级丙等</option>
              </select>
            </div>
          </div>
        </div>
        <!-- end -->

        <div class="col-md-12 ">
          <div class="from-group col-md-6 ">
           <label  class="col-md-4"><h4>成立时间</h4></label>
           <div class="col-md-8  input-group">
             <input name="letdata" type="date"       v-model="info.regDate"  placeholder="请输入时间..." class="form-control"  />
           </div>
         </div>

         <!-- 选择企业 -->
         <div class="from-group col-md-6 " v-if="ok2">
           <label  class="col-md-4"><h4>是否上市公司</h4></label>
           <div class="col-md-8 input-group ">
            <label class="radio-inline ">
              <input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="0"   v-model="info.isCompany" /> 是
            </label>
            <label class="radio-inline ">
              <input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="1"  v-model="info.isCompany"  /> 否
            </label>
          </div>
        </div>
      </div>
      <!-- end -->
      <div class="col-md-12">
        <div class="from-group col-md-6 ">
         <label  class="col-md-4"><h4>认证状态</h4></label>
         <div class="col-md-8 input-group">
           <input name="state" type="text" class="form-control" :value="info.authStatusName"  disabled="disabled" />
         </div>
       </div>
     </div>


     <div class="col-md-12 form-block">
      <div class="from-group col-md-6 ">
       <label  class="col-md-4"><h4>联系人</h4></label>
       <div class="col-md-8 input-group">
         <input name="contacts" type="text" placeholder="请输入联系人..." class="form-control"   v-model="info.linkman"  />
       </div>
     </div>
     <div class="from-group col-md-6  ">
       <label  class="col-md-4"><h4>联系电话</h4></label>
       <div class="col-md-8 input-group"  >
         <input  name="contactNumber" v-model="info.linktel"  placeholder="请输入电话..." type="text" class="form-control" />
        
      </div>
    </div>
  </div>

  <div class="col-md-12 form-block" >
    <div class="from-group col-md-6 ">
     <label  class="col-md-4"><h4>公司地址</h4></label>
     <div class="col-md-8 input-group">
       <input  name="address" type="text" placeholder="请输入地址..." class="form-control" v-model="info.address"  />
     </div>
   </div>
   <div class="from-group col-md-6 ">
   </div>
 </div>
 <div class="col-md-12 form-block text-center">
  <button type="button"
    @click="Authentication"
    class="   btn btn-warning btn-md w110"
    :disabled="authDisabled"
    >发起认证
  </button> 
  <button type="button" @click="Preservation"   class="   btn btn-warning w110">保存</button>
  <button type="button" class="   btn btn-warning w110" onclick="window.history.go(-1)">返回</button>
</div>
</form>
</div>
</div>
</div>
</div>
</div>
</template>

<script>
import URL from "@/http/url.js";
import { tokenchangge } from "@/cooike/api.js";
export default {
  name: "EnterpriseInfo",
  components: {},
  data() {
    return {
      id: "",
      ok1: false,
      ok2: false,
      istel: false,
      url: "",
      info: {
        data: [], //加载数据
        id: "", //Id     不能为空
        custNo: JSON.parse(sessionStorage.getItem("sessionData")).custNo, //客户号
        custName: "", //企业名称
        certType: "", //证件类型
        certNo: "", //证件号码
        industry: "", //所属行业
        regDate: "", //成立时间
        linkman: "", //联系人
        linktel: "", //联系电话
        address: "", //公司地址
        certCapital: "", //注册资金
        isCompany: "", //是否上市公司
        grade: "", //评级
        authStatus: "", //认证状态
        enterpriseScale: "" //企业规模
      },
      // --------------------------------------------
      authDisabled: false
    };
  },
  watch: {
    "info.industry": function(val) {
      if (val == "00") {
        this.ok1 = false;
        this.ok2 = false;
      }
      if (val == "01") {
        this.ok1 = false;
        this.ok2 = true;
      }
      if (val == "02") {
        this.ok1 = true;
        this.ok2 = false;
      }
    }
  },
  created() {
    var loadurl =
      URL.userQualiation.selUserManage + "?custNo=" + this.info.custNo;
    this.url = loadurl;
    // alert(this.info)
    // console.log(this.info)
    this.$http
      .get(this.url, { headers: URL.headers }, { emulateJSON: true })
      .then(function(response) {
        console.log(response);
        // this.info.data = response.body.obj;
        // console.log(this.info.data);
        // ------------------------------------------------------------
        for (const key in response.body.obj) {
          this.info[key] = response.body.obj[key]
        }
        if (this.info.authStatus === '03'
          || this.info.authStatus === '01') {
          this.authDisabled = true
        }
      });
  },

  methods: {
    //保存
    Preservation: function() {
      var Purl = URL.userQualiation.addUserManage;
      // this.info.custName = this.info.data.custName;
      // this.info.id = this.info.data.id;
      this.url = Purl;
      // alert(this.info)
      console.log(this.info);
      this.$http.post(this.url,JSON.stringify(this.info),
          { headers: URL.headers },
          { emulateJSON: true }
        )
        .then(function(response) {
          if (response.body.code == 1002) {
            alert("保存成功");
          } else {
            alert("保存失败,请填写相关信息");
          }
          console.log(response);
        });
    },
    //认证
    Authentication: function() {
      var _this = this;
      var Aurl = URL.userQualiation.goHttpUserManage;
      // _this.info.authStatus = _this.info.data.authStatus;
      // this.info.custName = this.info.data.custName;
      // this.info.id = this.info.data.id;
      this.url = Aurl;
      this.$http
        .post(
          this.url,
          JSON.stringify(this.info),
          { headers: URL.headers },
          { emulateJSON: true }
        )
        .then(function(response) {
          console.log(response);
          if (response.body.code == 1002) {
            this.$router.push("/success");
          } else if (response.body.code == 1004) {
            alert(response.body.obj);
          }
        });
    }
  }
};
</script>

          <style scoped>
.informationMng {
  width: 100%;
  overflow: hidden;
}
.textHeight {
  margin-top: 20px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 4px solid #f0ad4e;
}
.pdb0 {
  padding-right: 0;
  padding-left: 0;
}
/*input{width: 180px; height: 30px;}
      select{width: 180px;height: 30px;}*/
.w110 {
  width: 110px;
  padding-left: 15px;
  padding-right: 15px;
  margin-left: 5px;
  margin-right: 5px;
}
.radio-inline input {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  margin-right: 15px;
  display: inline-block;
}
.h4 {
  color: #333;
}
</style>
