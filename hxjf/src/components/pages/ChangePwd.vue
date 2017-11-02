  <!-- 修改密码页面-->
  <template>
    <div class="ChangePwd" >
        <div class="container" style="margin-bottom:20px;">
               
              <div class="row">
                  <div class="col-md-6 col-md-offset-3 border">
                          <form   role="form ">
                                <div class="form-group col-md-12">
                                      <label class="col-md-4 h4">企业管理帐号</label>
                                      <div class="col-md-8 input-group">
                                            <input type="text" class="form-control" />
                                      </div>
                                </div>

                                <div class="form-group  col-md-12">
                                         <label class="col-md-4 h4">原密码</label>
                                         <div class="col-md-8 input-group">
                                               <input type="password" class="form-control" />
                                         </div>
                                </div>

                                <div class="form-group  col-md-12">
                                        <label class="col-md-4 h4 ">新密码</label>
                                        <div class="col-md-8 input-group">
                                              <input type="password" class="form-control" />
                                        </div>
                                </div>

                                <div class="form-group  col-md-12">
                                         <label class="col-md-4 h4 ">确认密码</label>
                                        <div class="col-md-8 input-group">
                                            <input type="password" class="form-control" />
                                      </div>
                                </div>

                                <div class="form-group  col-md-12">
                                        <label class="col-md-4 h4">短信验证码</label>
                                        <div class="col-md-8 input-group ">
                                            <div class="col-md-6 pd0 ">
                                               <input type="text" class="form-control" />
                                            </div>
                                            <div class="col-md-6 pd0" style="padding-left:15px;">
                                            <button type="button" class="btn btn-success  w100">发送验证码</button>
                                            </div>
                                      </div>
                                </div>

                                <div class="form-group col-md-6 col-md-offset-3">
                                        <div class="col-md-6 text-center">
                                                <button type="button" class="btn btn-warning">修改密码</button>
                                        </div>
                                        <div class="col-md-6 text-center">
                                                <button type="button" class="btn btn-warning" @click="returns">返回</button>
                                        </div>
                                </div>
                          </form>
                  </div>
              </div>
        </div>
     </div>
  </template>
  <script>
  import footder from '../../components/footder.vue'
  import headers from '../../components/header.vue'
  export default {
    name: 'ChangePwd',
    components:{
        footder,headers
    },
    methods:{
      returns(){
        window.history.go(-1)
      }
    }
  }

  </script>

  <style scoped>
  .ChangePwd{width: 100%;overflow: hidden;}
  .w100{width: 100%;}
  .pd0{padding-left: 0;padding-right: 0}
  .border{display: block;padding: 18px 8px; border-radius:8px;padding-top: 25px;margin-top: 30px;}
  </style>
