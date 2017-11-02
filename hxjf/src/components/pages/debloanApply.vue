   <!--定保理融资申请页面-->
      <template>
        <div class="debloanApply" >
          <div class="" style="margin-bottom:20px;">
            <div class="row">
              <div class="col-md-10 col-md-offset-1">
                <div class="col-md-12 textHeight">
                  <div class="col-md-12">
                    <span class="h4">定保理>融资申请</span>
                    <router-link class="btn btn-default pull-right margint btn-sm" to='/homepage' >返回</router-link>
                  </div>
                </div>
                <div class="col-md-10 col-md-offset-1 borx">
                  <form role="form" class="col-md-0">

                    <div class="col-md-12 ">
                      <div class="form-group col-md-6">
                        <label  class="col-md-4"><h5>可融资金额</h5> </label>
                        <div class="col-md-8 input-group">
                          <input type="text" class="form-control"  placeholder="请输入金额.." onkeyup="this.value=this.value.replace(/[^0-9.]+/,'');"  min="0"    v-model="loanArr.sureAmt" />
                        </div>
                      </div>
                      <div class="form-group col-md-6 ">
                        <label  class="col-md-4"><h5>申请融资金额</h5></label>
                        <div class="col-md-8 input-group">
                         <input type="text"  class="form-control"  placeholder="请输入金额..." onkeyup="this.value=this.value.replace(/[^0-9.]+/,'');"  min="0"    v-model="loanArr.amt" />
                       </div>
                     </div>
                   </div>

                   <div class="col-md-12 ">
                    <div class="form-group col-md-6">
                      <label  class="col-md-4"><h5>融资用途</h5> </label>
                      <div class="col-md-8 input-group">
                        <input type="text"  class="form-control"  placeholder="请输入融资用途.."   v-model="loanArr.loanUseage"  />
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12 text-center">
                   <button type="submit" class="btn btn-warning btn-sm" @click="getApply">提交申请 </button>
                 </div>
               </form>
             </div>
           </div>

           <div class="col-md-10  col-md-offset-1">
            <hr class="bgc" />
            <div class="col-md-12">
              <!-- 插件 -->
              <table class="table table-bordered table-hover" >
                <thead class="text-center">
                  <tr   class="">
                    <!-- <th class="text-center"></th> -->
                    <th class="text-center">申请编号</th>
                    <th class="text-center">申请放款金额</th>
                    <th class="text-center">实际放款金额</th>
                    <th class="text-center">申请日期</th>
                    <th class="text-center">放款日期</th>
                    <th class="text-center">审批状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="text-center" v-for="(item,index) in applyData"
                    :key="index">
                    <!-- <td>{{index+1}}</td> -->
                    <td>{{item.appno}}</td>
                    <td>{{item.appliAmt}}</td>
                    <td>{{item.sureAmt}}</td>
                    <td>{{item.createDate}}</td>
                    <td>{{item.appliStartDate}}</td>
                    <td>{{item.status}}</td>
                  </tr>
                  <tr  class="text-center" >
                    <!-- <td colspan="7" rowspan="" headers="" v-if="applyData.length==0"> -->
                    <td colspan="7" rowspan="" headers="" v-if="!applyData">
                     <h4 class="text-primary">暂无数据...</h4>
                    </td>
                 </tr>
               </tbody>
             </table>
             <!-- 插件 -->

           </div>

           <div class="text-right">
            <div class="page-bar  pull-right  w500">
              <ul>
                <li v-if="cur>1"><a v-on:click="cur--,pageClick()">上一页</a></li>
                <li v-if="cur==1"><a class="banclick">上一页</a></li>
                <li v-for="(index, key) in indexs" v-bind:class="{ 'active': cur == index}"
                  :key="key">
                  <a v-on:click="btnClick(index)">{{ index }}</a>
                </li>
                <li v-if="cur!=all"><a v-on:click="cur++,pageClick()">下一页</a></li>
                <li v-if="cur == all"><a class="banclick">下一页</a></li>
                <li><a>共<i>{{all || 0}}</i>页</a></li>
              </ul>
            </div>
          </div>
        </div>


      </div>

    </div>
  </div>
</template>
<script>
import URL from '@/http/url.js'
import {tokenchangge} from '@/cooike/api.js'
export default {
  name: 'debloanApply',
  data(){
    return{
        all: '', //总页数
        cur: '1',//当前页码
        url:'',  // 地址
        loanArr:{
          product:'1230010',//产品类型(1230010-单保理；1230040-保理池)
          appliTlro:'',//登录账户
          amt:'',//申请融资金额
          sureAmt:'',//可融资金额
          loanUseage:'',//融资用途
          certCode: JSON.parse(sessionStorage.getItem('sessionData')).certNo
        },
        applyData:[],
        querys:{
          product:'1230010' ,//产品类型(1230010-单保理；1230040-保理池)
          pageSize:10,
          pageNumber:1
        },
        // ----------------------------------------------------
        sessionData: JSON.parse(sessionStorage.getItem('sessionData'))
      }
    },
          created(){
            var redayUrl=URL.usermng.appliLoan.limit
            this.url=redayUrl
            this.$http.post(redayUrl,JSON.stringify(this.querys),{
              headers:URL.headers
            }).then(function(response){
              console.log(response)
              this.applyData=response.body.rows
              this.all=Math.ceil(response.data.total/10)
            })
            // --------------------------------------------------------
            this.$http.post(URL.userMoney, {
              certCode: JSON.parse(sessionStorage.getItem('sessionData')).certNo,
              productId: '1230010'
            }).then(res => {
              console.log(res)
              this.loanArr.sureAmt = res.body
            }, res => alert('出错了'))
          },
          methods:{
//提交申请
getApply:function(){
  console.log(this.loanArr)
  // return
      // tokenchangge()
      var a=$.cookie("user") //获取cookie   user 
      this.loanArr.appliTlro=a
      var applyUrl=URL.usermng.appliLoan.insert
      // this.url=applyUrl
      this.$http.post(applyUrl,JSON.stringify(this.loanArr), {headers:URL.headers })
      .then(function(response){
        window.location.reload()
        /*if(response.body.retcode==200){
          alert("申请成功")
        }else{
          // alert("请输入相关信息")
        }*/
      }, function(error){
           alert("请输入相关信息")
        })
    },
//页码
    btnClick: function(data){//页码点击事件
      if(data != this.cur){
        this.cur = data 
        this.$http.post(this.url,JSON.stringify({pageSize:10,pageNumber:this.cur,product:this.querys.product}), { headers:URL.headers },{emulateJSON:true}).then(function(response){

        // alert(this.cur)
        this.applyData = response.data.rows
        console.log(this.applyData )
        this.all=Math.ceil(response.data.total/10)
      })

      }
    },
//上一页下一页
pageClick: function(){ 
 this.$http.post(this.url,JSON.stringify({pageSize:10,pageNumber:this.cur,product:this.querys.product}), { headers:URL.headers },{emulateJSON:true}).then(function(response){
  this.applyData = response.data.rows
  this.all=Math.ceil(response.data.total/10)
})
 console.log('现在在'+this.cur+'页');
}
},
computed: {
  id:function(){
    this.formArr.id=this.aJson.id
  },
  indexs: function(){
   var left = 1;
   var right = this.all;
   var ar = [];
   if(this.all>= 5){
    if(this.cur > 3 && this.cur < this.all-2){
      left = this.cur - 2
      right = this.cur + 2
    }else{
      if(this.cur<=3){
        left = 1
        right = 5
      }else{
        right = this.all
        left = this.all -4
      }
    }
  }
  while (left <= right){
    ar.push(left)
    left ++
  }
  return ar
}
}
}
</script>
<style scoped>
.debloanApply{width: 100%;overflow: hidden;}
.textHeight{margin-top: 20px;margin-bottom: 15px; padding-bottom:15px;border-bottom: 4px solid #f0ad4e; padding-left: 0;font-weight: bold}
.bgc{background-color: #f0ad4e; height: 4px;overflow: hidden;}
.buttons{width: 100px;;border:none;padding: 5px 5px; box-shadow: 2px 2px 2px #999;margin-right: 15px;margin-left: 15px;}

.buttonl{ text-align: center;padding: 5px 15px;border: none;;margin-bottom: 10px;box-shadow: 2px 2px 2px #666 }
.w500{width: 500px;}
</style>
