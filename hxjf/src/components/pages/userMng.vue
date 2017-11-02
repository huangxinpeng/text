      <!--企业账户管理页面-->
      <template>
        <div class="userMng" >
          <div class="" style="margin-bottom:20px;">
            <div class="row">
              <div class="col-md-10 col-md-offset-1">
                <div class="col-md-12 textHeight">
                 <div class="col-md-12 mb-20">
                  <a href="#">
                    <!-- <img src="../../img/u26.png" alt="" /> -->
                    <span class="h4">银行卡管理</span>
                  </a>
                  <router-link class="btn btn-default pull-right margint btn-sm" to='/homepage' style="margin-top:15px;">返回</router-link>
                </div>
              </div>

              <div class="col-md-10 col-md-offset-1">
                <div class="col-md-6" v-for="item in  JsonArr">
                  <div class="panel panel-default">
                    <div class="panel-body">
                      <div class="img"><img    :src="item.openBankNo"  alt="" /></div>
                    <!--   <div class="img"><img   :src="imgurl[item.openBankNo]"  alt="" /></div> -->
                      <div class=" h3 text-danger">{{ item.accountNo}}</div>
                      <div class="h5">{{item.accountName}}</div>
                    </div>
                    <div class="panel-footer  ">
                      <a  href="javascript:void(0)"  data-target="#updateModal "  data-toggle="modal" class=" text-info text-center h4"  @click="modify(item.id)"  ><span class="glyphicon glyphicon-pencil " ></span>&nbsp;&nbsp;修改</a>
                      <a href="javascript:void(0)"    @click.stop="del(item.id)" class="  text-info text-center h4"><span class="glyphicon glyphicon-trash"></span>&nbsp;&nbsp;删除</a> 
                    </div>
                  </div> 
                </div>

                <div class="col-md-6 cursor" @click="addBank">
                  <div class="panel panel-default">
                    <div class="panel-body">
                      <div class="text-center h1 text-info">
                       <span class="glyphicon glyphicon-plus-sign font "></span>
                     </div>
                     <h2 class="text-center">添加银行卡</h2>
                   </div>
                   <!-- <div class="panel-footer">Panel footer</div> -->
                 </div>
               </div>
               <!-- 修改模态框（Modal） -->
               <div class="modal fade" id="updateModal" tabindex="-1" role="dialog"
               aria-labelledby="myModalLabel" aria-hidden="true">
               <div class="modal-dialog" style="width:1200px;">
                <div class="modal-content" >
                  <div class="modal-header">
                   <button type="button" class="close" data-dismiss="modal"
                   aria-hidden="true">×</button>
                   <h4 class="modal-title text-center" id="myModalLabel">修改信息</h4>
                 </div>
                 <div class="modal-body" >
                   <form  class="" role="form" v-for="item in aJsons">
                    <div class="col-md-12">

                      <div class="form-group col-md-6 pb0">
                        <label  class="col-md-5 text-right">
                         <h5>账户类型&nbsp;&nbsp; <span class="text-warning">*</span>&nbsp;&nbsp;</h5></label>
                         <div class="col-md-7 pb0 input-group">
                          <select name="user"  class="form-control" v-model="item.accountType" >
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
                            <select name="user"  class="form-control"   v-model="item.accountCategory" >
                              <option value="00">请选择...</option>
                              <option value="0">收款账户</option>
                              <option value="1">付款账户</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div class="col-md-12">

                        <div class="form-group col-md-6 pb0">
                          <label  class="col-md-5 text-right">
                            <h5>选择银行&nbsp;&nbsp;<span class="text-warning">*</span>&nbsp;&nbsp;</h5></label>
                            <div class="col-md-7 pb0  input-group">
                              <select name="user" class="form-control"  v-model="item.openBankNo"  >
                                <option value="">请选择...</option>
                               <option value="static/img/u18.jpg">工商银行</option>
                                                    <option value="static/img/u17.jpg">建设银行</option>
                                                    <option value="static/img/u20.jpg">招商银行</option>
                                                    <option value="static/img/u19.jpg">农业银行</option>
                              </select>
                            </div>
                          </div>

                          <div class="form-group col-md-6 pb0">
                            <label  class="col-md-5 text-right">
                              <h5>开户名&nbsp;&nbsp;<span class="text-warning">*</span>&nbsp;&nbsp;</h5></label>
                              <div class="col-md-7 pb0  input-group">
                                <input type="text"   class="form-control"  v-model="item.accountName" />
                              </div>
                            </div>
                          </div>

                          <div class="col-md-12">

                            <div class="form-group col-md-6 pb0">
                              <label  class="col-md-5 text-right">
                                <h5>开户行&nbsp;&nbsp;<span class="text-warning">*</span>&nbsp;&nbsp;</h5></label>
                                <div class="col-md-7 pb0  input-group">
                                  <input type="text"  class="form-control"   v-model="item.openBrcode" />
                                </div>
                              </div>

                              <div class="form-group col-md-6 pb0">
                                <label  class="col-md-5 text-right">
                                  <h5>账号&nbsp;&nbsp;<span class="text-warning">*</span>&nbsp;&nbsp;</h5></label>
                                  <div class="col-md-7 pb0  input-group">
                                    <input type="text"  class="form-control" v-model="item.accountNo"  />
                                  </div>
                                </div>
                              </div>

                              <div class="col-md-12">

                                <div class="form-group col-md-6 pb0">
                                  <label  class="col-md-5 text-right">
                                    <h5>开户省份&nbsp;&nbsp;<span class="text-warning">*</span>&nbsp;&nbsp;</h5></label>
                                    <div class="col-md-7 pb0  input-group">
                                      <select name="user"  class="form-control"  v-model="item.openProvince"   >
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
                                        <select name="user"  class="form-control" v-model="item.openCity"   >
                                          <option value="0">请选择...</option>
                                          <option value="1">广州市</option>
                                          <option value="2">深圳市</option>
                                          <option value="3">珠海市</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>

                                </form>
                              </div>
                              <div class="modal-footer">
                               <button type="button" class="btn btn-success" data-dismiss="modal">关闭</button>
                               <button type="button" class="btn btn-primary" id="update"
                               @click="updata() " >提交</button>
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
            name: 'userMng',
            components:{
            },
            data(){
              return {
              aJsons:[],// 修改的接口
                url:'',
                bankJson:{},
            JsonArr:[],//这个是数据
            img:'',
            imgurl:{
             ' 招商银行':'static/img/u20.jpg', //招商银行
              '农业银行':'static/img/u19.jpg', // 农业银行
              '工商银行':'static/img/u18.jpg',//工商银行
              '建设银行':'static/img/u17.jpg'  //建设银行
            }
          }
        },
        created(){
          var urls=URL.usermng.custaccount.select
          this.url=urls
      // alert(this.url)
      this.$http.get(this.url,{ headers:URL.headers },{emulateJSON:true}).then(function(respone){
           // console.log(respone.data)
           this.bankJson=respone.data
           this.JsonArr=respone.data.rows
           console.log(this.JsonArr)
         },function(){
          alert('出错')
        })
    },
    methods:{
      addBank:function(){
        this.$router.push('/bankCardInfo')
      },
      del:function(delId){

        var delurl=URL.usermng.custaccount.del+"?id="+delId
        var con=confirm("确认删除吗？");
        if(con){
          this.$http.post(delurl, { headers:URL.headers },{ headers:URL.headers },{emulateJSON:true}).then(function(){
            window.location.reload()
          })
        }else{
          return false
        }
      },
      //修改
   modify:function(ids){
              var modifyurl=URL.usermng.custaccount.query+"?queryId="+ids
              // alert(modifyurl)
              this.$http.get(modifyurl, { headers:URL.headers },{emulateJSON:true}).then(function(response){
                this.aJsons=response.body.rows

                // this.formArr=this.aJsons[0]

                console.log(this.aJsons)
              })
            },

          //修改保存
updata:function(){
  var   formArr={
                    id:'',
                    accountType:'',//账户类型
                     accountCategory:'',//账户类别
                     openBankNo:'',//选择银行
                     accountName:'',//开户名
                     openBrcode:'',//开户行
                     accountNo:'',//账户
                     openProvince:'',//开户省份
                    openCity:''//开户城市
            }
              for(var key in formArr){
                formArr[key]=this.aJsons[0][key]
              }
     // this.formArr=this.aJsons[0]
     console.log(this.formArr)
     var updataurl=URL.usermng.custaccount.edit
        // var this.formarr
        this.$http.post( updataurl,JSON.stringify(formArr), { headers:URL.headers },{emulateJSON:true}).then(function(response){
          $("#updata").attr(" data-dismiss","modal")
          window.location.reload();
        })
      },
        }

      }

      </script>

      <style scoped>
      .userMng{width: 100%;overflow: hidden;}
      .mb-20{margin-bottom: 20px;}
      .textHeight{margin-top: 20px;margin-bottom: 15px; padding-bottom:15px;border-bottom: 4px solid #f0ad4e;}
      .pdb0{padding-right: 0;padding-left: 0}
      .panel-footer  a{ display: inline-block;width: 45%;}
      .font{font-size: 60px;}
      .cursor{cursor: pointer;}
      .img{width: 100%;overflow: hidden;}
      .img img{height: 48px;}
      a:hover{text-decoration: none;cursor:pointer;}

      </style>
