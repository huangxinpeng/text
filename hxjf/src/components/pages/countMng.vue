      <!--企业账户管理页面-->
      <template>
       <div class="countMng" >
        <div class="row" style="margin-bottom:20px;">
          <div class="row">
            <div class="col-md-10 col-md-offset-1">
             <div class="col-md-12 textHeight">
              <div class="col-md-12">
                <!-- <img src="../../img/u26.png" alt="" /> -->
                <span class="h3">企业用户管理</span>
                <router-link class="btn btn-default pull-right margint btn-sm" to='/homepage' style="margin-top:15px;">返回</router-link>
              </div>
            </div>
            <div class="col-md-12  mg20">
              <router-link to="/userDetails" type="button" class="btn btn-default btns ">新增企业管理用户</router-link>
            </div>
            <div class="col-md-12">
              <table class="table table-bordered table-hover">
               <thead>
                <tr class="">
                 <th class="text-center">编号</th>
                 <th class="text-center">登录账号</th>
                 <th class="text-center">用户昵称</th>
                 <th class="text-center">是否启用</th>
                 <th class="text-center">联系电话</th>
                 <th class="text-center">职务</th>
                 <th class="text-center">操作</th>
               </tr>
             </thead>
             <tbody>
              <tr class="text-center" v-for="(item,index) in userData">
               <td>{{index+1}}</td>
               <td>{{item.userId}}</td>
               <td>{{item.nickName}}</td>
               <td>{{item.isUsed}}</td>
               <td>{{item.tel}}</td>
               <td>{{item.duty}}</td>
               <td>
                <button class="btn btn-sm"  data-target="#modifyUser "  title=" 修改" data-toggle="modal" @click="modify(item.id)"   style="  margin-top:-8px; width: 22px;  height:28px; background: url(./static/img/u36.png)"></button>
                <button class="btn btn-sm"  title="删除" style="  margin-top:-8px; width: 22px;height:28px;background: url(./static/img/u37.png)"  @click="del(item.id)" ></button>
              </td>
            </tr>

            <tr v-if="userData.length==0" class="text-center">
             <td colspan="7" style="font-size: .75em;">暂无数据.......</td>
           </tr>
         </tbody>
       </table>

       <div class="text-right">
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
       </div>
     </div>
   </div>

   <!-- 修改模态框（Modal） -->
   <div class="modal fade" id="modifyUser" tabindex="-1" role="dialog"
   aria-labelledby="myModalLabel" aria-hidden="true">
   <div class="modal-dialog">
     <div class="modal-content">
       <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"
        aria-hidden="true">×</button>
        <h4 class="modal-title text-center" id="myModalLabel">修改信息</h4>
      </div>
      <div class="modal-body">
        <form id="formUpdate" class="form-horizontal col-sm-12"   v-for="item in userDatas">
         <br /><br />
         <div class="form-group col-sm-12 pb " style="margin-right:15px;">
          <label  class="col-sm-5   h4 text-center  ">登录账号</label>
          <div class="col-sm-7  pb input-group "   >
           <!-- 根据主健id修改数据库对于的一行数据： -->
           <input class="form-control"  type="text"   v-model="item.userId" />
         </div>
       </div>
       <!-- placeholder="该输入框禁止输入..." -->
       <div class="form-group  col-sm-12 pb" style="margin-right:15px;" >
        <label class="col-sm-5  h4 text-center ">用户昵称</label>
        <div  class="col-sm-7 pb input-group">
         <input type="text"  class="form-control"  v-model="item.nickName" />
       </div>
     </div>

     <div class="form-group  col-sm-12 pb" style="margin-right:15px;" >
       <label class="col-sm-5  h4  text-center ">是否启用</label>
       <div  class="col-sm-7 pb input-group">
         <select class="form-control" value="01"  v-model="item.isUsed"  >
          <option value="00">否</option>
          <option value="01">是</option>
        </select>
      </div>
    </div>


    <div class="form-group  col-sm-12 pb" style="margin-right:15px;" >
      <label class="col-sm-5  h4 text-center ">联系电话</label>
      <div  class="col-sm-7 pb input-group">
       <input type="text"  class="form-control" v-model="item.tel"  />
     </div>
   </div>


   <div class="form-group  col-sm-12 pb" style="margin-right:15px;" >
     <label class="col-sm-5  h4 text-center  ">职务</label>
     <div  class="col-sm-7 pb input-group">
       <div class="checkbox">
         <label>
           <input type="radio" name="post" value="业务岗" v-model="item.duty"  />业务岗
         </label>
         <label>
           <input type="radio" name="post" value="财务总监"v-model="item.duty"  />财务总监
         </label>
         <label>
           <input type="radio" name="post" value="业务总监" v-model="item.duty"  />业务总监
         </label>
       </div>
       
       <!-- <input type="text"  class="form-control" v-model="item.duty" /> -->
     </div>
   </div>
   <p style="display: none">{{item.id}}</p><!-- 隐藏的id -->
 </form>
</div>
<br /><br />
<div class="modal-footer ">
 <button type="button" class="btn btn-success" data-dismiss="modal">关闭</button>
 <button type="button" class="btn btn-primary" id="update"
 @click="updata()">保存</button>
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
</template>
<script>
import URL from '@/http/url.js'

export default {
 name: 'countMng',
 components:{
 },
 data(){
  return{
         all: '', //总页数
         cur: 1,//当前页码
         url:'',
         userData:[],//接口的数据
         userDatas:[] //修改的接口
       }
     },
     created:function(){
      var dataUrl=URL.usermng.userinfomng.limit
      this.url=dataUrl
      this.$http.post(this.url,JSON.stringify({pageSize:5,pageNumber:1}), { headers:URL.headers },{emulateJSON:true}).then(function(response){
       this.userData=response.data.rows
       console.log(this.userData )
       this.all=Math.ceil(response.data.total/5)

     })
    },
    methods:{
    //删除
    del :function(useid){
        // alert(URL.usermng.userinfomng.del)
        var delurl=URL.usermng.userinfomng.del+"?id="+useid
        // alert(delurl)
        var aconfirm= confirm("确认删除吗?");
        if(aconfirm){
                    // window.location.reload();//刷新
                    if(this.userData!=0){
                      this.$http.get(delurl,{ headers:URL.headers },{
                        emulateJSON:true
                      }).then(function(res){
                    window.location.reload();//刷新
                    this.$http.post(this.url,JSON.stringify({pageSize:5,pageNumber:1}),{ headers:URL.headers }).then(function(response){
                     this.userData = response.data
                     if( this.retcodes==201){
                       this.userData=''
                     }
                   })
                          //跳转
                        },function(error){
                          return false
                        })
                    }


                  }else{
                //取消删除
                alert("取消删除")
              }
            },
          // 修改
          modify:function(ids){
           var modifyurl=URL.usermng.userinfomng.query+"?queryId="+ids
           this.$http.get(modifyurl, { headers:URL.headers },{emulateJSON:true}).then(function(response){
            this.userDatas=response.data.rows

            console.log(this.userDatas)
          })
         },


//页码
    btnClick: function(data){//页码点击事件
      if(data != this.cur){
       this.cur = data 
       this.$http.post(this.url,JSON.stringify({pageSize:5,pageNumber:this.cur}), { headers:URL.headers },{emulateJSON:true}).then(function(response){
         this.userData=response.data.rows

        // alert(this.cur)
        console.log(this.userData )
        this.all=Math.ceil(response.data.total/5)
      })

     }
   },

         //上一页下一页
         pageClick: function(){  
          this.$http.post(this.url,JSON.stringify({pageSize:5,pageNumber:this.cur}), { headers:URL.headers },{emulateJSON:true}).then(function(response){
            this.userData=response.data.rows
            this.all=Math.ceil(response.data.total/5)
          })
          console.log('现在在'+this.cur+'页');
        },
        updata:function(){
          var  formArr={
           id:'',
                  duty:"",  //职务    
                  userId:'',//登录账号
                  nickName:'',//用户昵称
                   tel:'',//联系电话
                   email:'',//Email邮箱
                  isUsed:''//是否启用
                };
                for(var key in formArr){
                  formArr[key]=this.userDatas[0][key]
                }
                console.log(this.formArr)
                var updataurl=URL.usermng.userinfomng.edit
                this.$http.post( updataurl,JSON.stringify(formArr), { headers:URL.headers },{emulateJSON:true}).then(function(response){
                 $("#updata").attr("data-dismiss","modal")
                 window.location.reload();
               })
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
      .btns{color: #f0ad4e;border: 1px solid #f0ad4e}
      .countMng{width: 100%; overflow: hidden;}
      .textHeight{margin-top: 20px;margin-bottom: 15px; padding-bottom:15px;border-bottom: 2px solid #f0ad4e; padding-left: 0;font-weight: bold}
      .mg20{margin-top: 20px;margin-bottom: 12px;}
      .w500{width: 500px;}
      .bg-6ff{background: #f0ad4e;color: #fff;}
      </style>
