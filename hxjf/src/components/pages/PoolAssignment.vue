      <!--应收账款转让申请-->
      <template>
        <div class="PoolAssignment" >
          <div class="" style="margin-bottom:20px;">
            <div class="row">
              <div class="col-md-10 col-md-offset-1">
                <div class="col-md-12 textHeight">
                  <div class="col-md-12">
                    <span class="h4">池保理>应收账款转让申请</span>
                    <button class="btn btn-default pull-right margint btn-sm" @click="Return">返回</button>
                  </div>
                </div>
                <div class="col-md-10 col-md-offset-1 borx">
                  <form role="form" class="col-md-0">
                    <div class="col-md-12 ">
                      <div class="form-group col-md-6 ">
                        <label  class="col-md-4"><h5>申请流水号</h5></label>
                        <div class="col-md-8 input-group">
                          <input type="text" class="form-control"  />
                        </div>
                      </div>
                      <div class="form-group col-md-6 ">
                        <label  class="col-md-4"><h5>转让总金额</h5></label>
                        <div class="col-md-8 input-group">
                          <input type="text" :value="sum"  disabled="disabled" class="form-control" name="" />
                        </div>
                      </div>
                    </div>

                    <div class="col-md-12 ">
                      <div class="form-group col-md-6">
                        <label  class="col-md-4"><h5>转让总份数</h5> </label>
                        <div class="col-md-8 input-group">
                          <input type="text"   :value="jsonData.debjson.length"   id="sum" disabled="disabled"  class="form-control" onkeyup="this.value=this.value.replace(/[^0-9.]+/,'');"  min="0"   />
                        </div>
                      </div>
                    </div>

                  </form>
                </div>
              </div>

              <div class="col-md-10  col-md-offset-1">
                <hr class="bgc" />
                <div class="mb" >
                  <button type="button"  data-target="#updateModal "  data-toggle="modal"   class="btn btn-primary btn-md"  @click="Imports" >导入</button>
                  <button type="button" class="btn btn-primary btn-md" @click="updataApply">提交申请</button>
                </div>
                <div class="col-md-12">
                  <!-- 插件 -->
                  <table class="table table-bordered" >
                <thead class="text-center">
                      <tr   class="">
                        <!-- <th class="text-center"></th> -->
                        <th class="text-center">发票号码</th>
                        <th class="text-center">凭证类型</th>
                        <th class="text-center">买方名称</th>
                        <th class="text-center">发票日期</th>
                        <th class="text-center">发票金额</th>
                        <th class="text-center">预付款金额</th>
                        <th class="text-center">已付金额</th>
                        <th class="text-center">佣金及折让金额</th>
                        <th class="text-center">应收账款有效金额</th>
                        <th class="text-center">预计回款日</th>
                        <th class="text-center">审批中</th>
                        <th class="text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="text-center" v-for="(item,index) in jsonData.debjson">
                        <!-- <td>{{index+1}}</td> -->
                        <td>{{item.billsNo}}</td>
                        <td>{{item.billsType}}</td>
                        <td>{{item.custcdBuyer}}</td>
                        <td>{{item.prepayAmt}}</td>
                        <td>{{item.paidAmt}}</td>
                        <td>{{item.damageAmt}}</td>
                        <td>{{item.billsAmountView}}</td>
                        <td>{{item.billsAmount}}</td>
                        <td>{{item.beginDate}}</td>
                        <td>{{item.beginDate}}</td>
                        <td>{{item.endDate}}</td>
                        <td>   <button class="btn btn-sm"  title="删除" style="  margin-top:-8px; width: 22px;height:28px;background: url(./static/img/u37.png)"  @click="del(item.id)" ></button></td>
                      </tr>

                      <tr  class="text-center" v-if="jsonData.debjson.length==0" >
                        <td colspan="13">
                         <h4 class="text-primary">暂无数据...</h4>
                       </td>
                     </tr>
                   </tbody>
                 </table>
                 <!-- 插件 -->


           <!--       <div class="text-right">
                  <div class="page-bar  pull-right  w500">
                    <ul>
                      <li v-if="cur>1"><a v-on:click="cur--,pageClick()">上一页</a></li>
                      <li v-if="cur==1"><a class="banclick">上一页</a></li>
                      <li v-for="index in indexs" v-bind:class="{ 'active': cur == index}">
                        <a v-on:click="btnClick(index)">{{ index }}</a>
                      </li>
                      <li v-if="cur!=all"><a v-on:click="cur++,pageClick()">下一页</a></li>
                      <li v-if="cur == all"><a class="banclick">下一页</a></li>
                      <li><a>共<i>{{all}}</i>页</a></li>
                    </ul>
                  </div>
                </div> -->

                <!-- 修改模态框（Modal） -->
                <div class="modal fade " id="updateModal" tabindex="-1" role="dialog"
                aria-labelledby="myModalLabel" aria-hidden="true" style="z-index: 9999999">
                <div class="modal-dialog ">
                  <div class="modal-content col-md-12 pb">
                    <div class="modal-header col-md-12  bg-primary">
                     <button type="button" class="close" data-dismiss="modal"
                     aria-hidden="true">×</button>
                     <h3 class="modal-title text-center " id="myModalLabel">应收款信息列表</h3>
                   </div>
                   <div class="modal-body col-md-12 pb">
                     <form id="formUpdate" class="form-horizontal col-sm-12 "  >
                      <div class="col-md-12 pb">
                        <label class=" col-md-3 text-right h4">买方名称</label>
                        <div  class="col-md-3">
                          <div class=" input-group">
                            <input type="text"   v-model="selects.custcdBuyer"  class="form-control" />
                          </div>
                        </div>
                        <label class=" col-md-3 text-right h4">发票号码</label>
                        <div class="col-md-3 ">
                          <div class="input-group">
                            <input type="text"  v-model="selects.billsNo"  class="form-control" />
                          </div>
                        </div>
                      </div>
                      <div class="col-md-12 pb">
                        <label class=" col-md-3 text-right h4">应收账款有效金额</label>
                        <div  class="col-md-3" style="position: relative">
                          <div class=" input-group">
                            <input type="text"  class="form-control"  v-model="selects.billsAmountN" />
                          </div>
                          <div style="position: absolute;left:100% ;top: 0;width: 12px;height:100px;line-height:2.5;text-align:center;margin-left:-15px;">
                            ~
                          </div>
                        </div>
                        <div class="col-md-3">
                          <div class="input-group">
                            <input type="text"  class="form-control" v-model="selects.billsAmountM"  />
                          </div>
                        </div>
                      </div>
                      <br>
                      <div class="col-md-12 text-center">
                        <button type="button" class="btn btn-primary" @click="quers" >立即查询</button>
                      </div>
                    </form>

                    <div class="col-md-12 mt">
                      <table class="table table-bordered table-hover">
                        <thead class="">
                          <tr>
                            <th class="text-center"><input type="checkbox"    @click="checkedAll" /></th>
                            <th class="text-center">发票号码</th>
                            <th class="text-center">凭证类型</th>
                            <th class="text-center">买方名称</th>
                            <th class="text-center">发票日期</th>
                            <th class="text-center">应收账款有效金额</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr class="text-center" v-for="(item,index) in debData">
                            <td><input type="checkbox"  :value="item.id"  v-model="dataArr " /></td>
                            <td>{{item.billsNo}}</td>
                            <td>{{item.billsType}}</td>
                            <td>{{item.custcdBuyer}}</td>
                            <td>{{item.beginDate}}</td>
                            <td>{{item.billsAmount}}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="text-right">
                     <div class="page-bar  pull-right  w500">
                       <ul>
                         <li v-if="cur>1"><a v-on:click="cur--,pageClick1()">上一页</a></li>
                         <li v-if="cur==1"><a class="banclick">上一页</a></li>
                         <li v-for="index in indexs" v-bind:class="{ 'active': cur == index}">
                           <a v-on:click="btnClick1(index)">{{ index }}</a>
                         </li>
                         <li v-if="cur!=all"><a v-on:click="cur++,pageClick1()">下一页</a></li>
                         <li v-if="cur == all"><a class="banclick">下一页</a></li>
                         <li><a>共<i>{{all}}</i>页</a></li>
                       </ul>
                     </div>
                   </div>
                 </div>

                 <div class="modal-footer">
                   <button type="button" class="btn btn-success" data-dismiss="modal">关闭</button>
                   <button type="button"   data-dismiss="modal" class="btn btn-primary" id="update"
                   @click="updata ">提交</button>
                 </div>
               </div>
               <!-- /.modal-content -->
             </div>
             <!-- /.modal -->
           </div>
           <!-- 模态框（Modal）  修改 end -->

         </div>

       </div>
     </div>

   </div>
 </div>
</template>
<script>

import URL from '@/http/url.js'

export default {
  name: 'PoolAssignment',
  components:{
  },
  data(){
    return {
      sum:0,
              appliTlro:'',//登录账号
              product:1230040,
              amt:'',//可融资金额
              selects:{
                            billsNo:'',//发票号码
                            custcdBuyer:'',//买方名称
                            pageSize:5,
                            pageNumber:1,
                            product:1230040,
                            billsAmountM:'',           //左边应收账款有效金额
                            billsAmountN:'' ,        //左边应收账款有效金额
                            flog:'YSZKZRSQ' // 应收账款转让申请
                          },
                all: '5', //总页数
                cur: 1,//当前页码
                url:'',  // 地址
                checked:false,//全选判断
                product:1230040,
                dataArr:[],//导入时的input勾选
                astring :'', //删除时保存的数组和提交的对比
                debjson:[],//分页显示的数据
                debData:[], //定保理转让申请接口数据
                jsonData:{
                  product:1230040,
                  certCode: JSON.parse(sessionStorage.getItem('sessionData')).certNo,
                  username:JSON.parse(sessionStorage.getItem('sessionData')).userId,//管理员
                    debjson:[],//分页显示的数据

             }
           }
         },
         created:function(){
         } , 
         methods:{
              //提交申请
              updataApply:function(){
                if(this.jsonData.debjson==0){
                  alert("请先导入数据")
                }else{

                var ApplyUrl=URL.usermng.appliTransferDebt.application
                this.url=ApplyUrl
                this.$http.post(this.url,JSON.stringify(this.jsonData),{ headers:URL.headers },{emulateJSON:true}).then(function(response){
                  if(response.body.retcode==200){
                    alert("操作成功")
                    this.$router.push('/success')
                  }
                })
                }

              },
              //查询
              quers:function(){
                var selectsURL=URL.usermng.debtbase.limit
                this.url=selectsURL
                this.$http.post(this.url,JSON.stringify({pageSize:5,pageNumber:1,billsNo:this.selects.billsNo,custcdBuyer:this.selects.custcdBuyer,product:this.selects.product,billsAmountN:this.selects.billsAmountN,billsAmountM:this.selects.billsAmountM}), { headers:URL.headers },{emulateJSON:true})
                .then(function(response){
                 this.debData = response.data.rows
                 this.all=Math.ceil(response.data.total/5)
               })
              },
              //多选
              checkedAll:function(){
                this.checked!=this.checked
                var _this=this
                console.log(_this.dataArr)
                if(this.checked){
                  _this.dataArr=[]
                }else{
                // _this.dataArr = [];
                _this.debData.forEach(function(item) {
                  _this.dataArr.push(item.id);
                });
              }
            },
              //导入
              Imports:function(){
                var urls=URL.usermng.debtbase.limit
                this.url=urls
                var aJson=JSON.stringify({pageSize:5,pageNumber:1,billsNo:this.selects.billsNo,custcdBuyer:this.selects.custcdBuyer,product:this.selects.product,billsAmountN:this.selects.billsAmountN,billsAmountM:this.selects.billsAmountM,flog:this.selects.flog})
                this.$http.post( this.url, aJson, { headers:URL.headers },{emulateJSON:true})
                .then(function(response){
                  console.log(response)
                  this.debData = response.data.rows

                  this.all=Math.ceil(response.data.total/5)

                }
                ,function(erro) {
                  alert("加载错误")
                }
                )
              },
//页码
    btnClick: function(data){//页码点击事件
      if(data != this.cur){
        this.cur = data 
        this.$http.post(this.url,JSON.stringify({pageSize:10,pageNumber:this.cur,product:this.product}), { headers:URL.headers },{emulateJSON:true}).then(function(response){

        // alert(this.cur)
        this.aJson = response.data.rows
        console.log(this.aJsons )
        this.all=Math.ceil(response.data.total/10)
      })
      }
    },
//上一页下一页
pageClick: function(){ 
 this.$http.post(this.url,JSON.stringify({pageSize:10,pageNumber:this.cur,product:this.product}), { headers:URL.headers },{emulateJSON:true}).then(function(response){
  this.aJson = response.data.rows
  this.all=Math.ceil(response.data.total/10)
})
 console.log('现在在'+this.cur+'页');
},
//页码
    btnClick1: function(data){//页码点击事件
      if(data != this.cur){
        this.cur = data 
        this.$http.post(this.url,JSON.stringify({pageSize:5,pageNumber:this.cur,billsNo:this.selects.billsNo,custcdBuyer:this.selects.custcdBuyer,product:this.selects.product,billsAmountN:this.selects.billsAmountN,billsAmountM:this.selects.billsAmountM,flog:this.selects.flog}), { headers:URL.headers },{emulateJSON:true}).then(function(response){

        // alert(this.cur)
        this.debData = response.data.rows
        console.log(this.debData )
        this.all=Math.ceil(response.data.total/5)
      })

      }
    },
//上一页下一页
pageClick1: function(){ 
 this.$http.post(this.url,JSON.stringify({pageSize:5,pageNumber:this.cur,billsNo:this.selects.billsNo,custcdBuyer:this.selects.custcdBuyer,product:this.selects.product,billsAmountN:this.selects.billsAmountN,billsAmountM:this.selects.billsAmountM,flog:this.selects.flog}),{ headers:URL.headers },{emulateJSON:true}).then(function(response){
  this.debData = response.data.rows
  this.all=Math.ceil(response.data.total/5)
})
 console.log('现在在'+this.cur+'页');
},

//返回上一部
Return:function(){
  window.history.go(-1)
},
del :function(useid){
  var delurl=URL.usermng.debtbase.array
  var aconfirm= confirm("确认删除吗?");
  if(aconfirm){
   console.log(this.astring)
   var us=useid+','
   this.astring  =this.astring.replace(us,'')
      // console.log(str)
      this.$http.post(delurl,this.astring, { headers:URL.headers },{emulateJSON:true}).then(function(response){
        console.log(response.body.retcode)
        if(response.body.retcode==200){
          this.jsonData.debjson=response.body.rows
      // this._jsonData.debjson=this._jsonData.debjson
      console.log(this.jsonData.debjson)
      // alert(this.jsonData.debjson.length)
      this.sum=0
      for(var i=0;i<this.jsonData.debjson.length;i++){
        this.sum+=parseFloat(this.jsonData.debjson[i].billsAmount)
      }
    }
  })
  }else{
                //取消删除
                alert("取消删除")
              }
            },
            updata:function(){
              var ArrUrl=URL.usermng.debtbase.array
  // var a= "0pzcq6vjihaxmkwmun9,haxmkwmun9,haxmkwmun9"
  this.$http.post(ArrUrl,this.dataArr.toString(), { headers:URL.headers },{emulateJSON:true}).then(function(response){
    console.log(response.body.retcode)
    if(response.body.retcode==200){
      this.jsonData.debjson=response.body.rows
      // this._jsonData.debjson=this._jsonData.debjson
      // console.log(this.jsonData.debjson)
      // alert(this.jsonData.debjson.length)
      this.astring= this.dataArr.toString()
      $("#updata").attr("data-dismiss","modal")
      this.sum=0
      for(var i=0;i<this.jsonData.debjson.length;i++){
        this.sum+=parseFloat(this.jsonData.debjson[i].billsAmount)
      }
    }

  })
}
},
updated(){
},
watch: {//深度 watcher
  'dataArr': {
    handler: function (val, oldVal) { 
      if (this.dataArr.length === this.debData.length) {
        this.checked=true;
      }else{
        this.checked=false;
      }
    },
    deep: true
  }
},
computed: {

// jsonData.debjson[0].billsAmount

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
.PoolAssignment{width: 100%;overflow:  hidden}
.textHeight{margin-top: 20px;margin-bottom: 15px; padding-bottom:15px;border-bottom: 4px solid #f0ad4e; padding-left: 0;font-weight: bold}
.bgc{background-color: #f0ad4e; height: 4px;overflow: hidden;}
select,input{width: 200px;height: 30px; line-height:35px;padding-right: 0}
.buttons{width: 100px;;border:none;padding: 5px 5px; box-shadow: 2px 2px 2px #999;margin-right: 15px;margin-left: 15px;}
.mb{margin-bottom: 15px;}
.mb .btn{margin-left: 15px;}
.pb{padding-left: 0;padding-right: 0}
.buttonl{ text-align: center;padding: 5px 15px;border: none;;margin-bottom: 10px;box-shadow: 2px 2px 2px #666 }
.w500{width: 500px;}
.mt{margin-top: 15px;}
.modal-dialog{width: 1000px;}
input[type="checkbox"]{
  width: 15px;height: 15px;
}
</style>
