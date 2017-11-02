      <!--企业账户管理页面-->
      <template>
            <div class="userDetails" >
                  <div class="row pd15">
                        <div class="b3">
                              <div class="pull-left"> 用户详情 </div>
                              <button type="tutton" class="btn btn-md btn-default pull-right" @click="Return">返回</button>
                        </div>
                        <div  class="post">
                         <p ><span></span>职务</p>
                         <div class="checkbox">
                               <label>
                                     <input type="radio" name="post" value="业务岗" v-model="tblUserInfo.duty" />业务岗
                               </label>
                               <label>
                                     <input type="radio" name="post" value="财务总监" v-model="tblUserInfo.duty" />财务总监
                               </label>
                               <label>
                                     <input type="radio" name="post" value="业务总监" v-model="tblUserInfo.duty" />业务总监
                               </label>
                         </div>
                         <p><span></span>用户信息</p>
                   </div>
                   <br />
                   <div class="col-md-8 col-md-offset-2 mb" >
                        <form role="form">
                              <div class="col-md-12 mb">
                                    <div class="col-md-6">
                                          <label class="col-md-4 text-right h5">用户昵称<span class="text-red">*</span></label>
                                          <div class="col-md-8 input-group">
                                                <input type="text" placeholder="请输入昵称"   name=""  class="form-control" v-model="tblUserInfo.nickName"  />
                                          </div>
                                    </div>
                                    <div class="col-md-6">
                                          <label class="col-md-4 text-right h5">登录账号<span class="text-red">*</span></label>
                                          <div class="col-md-8 input-group">
                                                <input type="text"  placeholder="请输入账号"   name=""  class="form-control"  v-model="tblUserInfo.userId"  />
                                          </div>
                                    </div>
                              </div>
                              <div class="col-md-12 mb">
                                    <div class="col-md-6">
                                          <label class="col-md-4 text-right h5">联系电话<span class="text-red">*</span></label>
                                          <div class="col-md-8 input-group" style="position: relative">
                                                <input type="text"  name="" placeholder="请输入..."   class="form-control"  v-model="tblUserInfo.tel" @blur="istel1"  />
                                                <div style="position: absolute;width:100%; height: 100%;font-size:14px; vertical-align: middle;color:#f00;text-center;left: 100%;top: 0" v-if="istel">
                                                      x手机格式不正确
                                                </div>
                                          </div>
                                    </div>
                                    <div class="col-md-6">
                                          <label class="col-md-4 text-right h5">Email邮箱<span class="text-red">*</span></label>
                                          <div class="col-md-8 input-group" style="position: relative">
                                                <input type="email" placeholder="请输入邮箱地址"  @blur="email"  name=""  class="form-control"  v-model="tblUserInfo.email"  />
                                                <div style="position: absolute; text-align:center; width:100%;height:100%;font-size: 9px;color:#f00;text-center;left: 0;top: 100%" v-if="isemail">
                                                      x邮箱格式不正确
                                                </div>
                                          </div>
                                    </div>
                              </div>
                              <div class="col-md-12 mb" >
                                    <div class="col-md-6">
                                          <label class="col-md-4  text-right h5">是否启用</span></label>
                                          <div class="col-md-8 input-group">
                                                <select class="form-control" value="01"   v-model="tblUserInfo.isUsed"  >
                                                      <option value="00">否</option>
                                                      <option value="01">是</option>
                                                </select>
                                          </div>
                                    </div>
                              </div>
                              <div class="text-center">
                                   <button type="button" class="btn btn-md btn-warning" @click="addUser">保存</button>
                                   <button type="button" class="btn btn-md btn-default">取消</button>
                             </div>
                       </form>
                 </div>
           </div>
     </div>
</template>
<script>
import URL from '@/http/url.js'
export default {
      name: 'userDetails',
      components:{
      },
      data(){
            return {
                  isemail:false,
                  istel:false,
                              tblUserInfo:{
                               duty:"业务岗",  //职务    
                              userId:'',//登录账号
                              nickName:'',//用户昵称
                              tel:'',//联系电话
                              email:'',//Email邮箱
                              isUsed:'01'//是否启用
                        } 
                  }
            },
            methods:{
                  //验证手机
                  istel1:function(){
                              if(this.tblUserInfo.tel!=""){
                                    var reg=/0?(13|14|15|18)[0-9]{9}/
                                    var txt=reg.test(this.tblUserInfo.tel)
                                          if(!txt){
                                               this.istel=true
                                    }else{
                                          this.istel=false
                                    }
                              }else{
                                          this.istel=false
                              }
                  },
                  //验证邮箱
                  email:function(){
                        if(this.tblUserInfo.email!=""){
                              var reg= /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
                              var num=reg.test(this.tblUserInfo.email)
                                          if(!num){
                                                this.isemail=true
                                          }else{
                                                this.isemail=false
                                          }
                                        }else{
                                          this.isemail=false
                                        }
                  },
                  addUser:function(){
                        console.log(this.tblUserInfo)
                        var url=URL.usermng.userinfomng.insert
                        if(this.isemail==true||this.istel==true){
                              alert("请填写信息")
                        }else{
                             this.$http.post(url,JSON.stringify(this.tblUserInfo),{ headers:URL.headers },{emulateJSON:true}).then(function(response){
                            console.log(response.body.retcode)
                            if(response.body.retcode==="200"){
                              alert("添加成功")
                               this.$router.push("/countMng")
                            }
                        })
                        }
                        
                  },
                  Return:function(){
                  window.history.go(-1)
                  }
            }
      }
      </script>
      <style scoped>
      .userDetails{width: 100%;overflow: hidden;}
      .pd15{padding-left: 35px;padding-right: 35px;}
      .b3{border-bottom: 3px solid #ccc;height: 65px;margin-top: 20px;margin-bottom: 16px;}
      .b3 .pull-left{width: 100px;text-align: center; font-size: 20px;height: 65px;line-height: 65px; border-bottom: 3px solid #f0ad4e}
      .b3 .btn{margin-top:15px;}
      .text-red{color: red}
      .post p{border-bottom:1px dashed #999;}
      .post span{display: inline-block; width: 10px;height: 10px;border-radius: 5px;background-color: #f0ad4e;margin-right: 10px;}
      .post .checkbox{margin-top: 15px;margin-bottom: 15px}
      .mb{margin-bottom: 20px;}
      </style>
