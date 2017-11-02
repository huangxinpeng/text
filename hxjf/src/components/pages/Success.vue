  <!-- 注册成功页面-->
  <template>
    <div class="Success" >
        <div class="container" style="margin-bottom:20px;">
            <div class="row">
                <div class="col-md-10 col-md-offset-1">
                    <div class="col-md-6" >
                        <img src="../../img/u2.png" height="349" width="340" alt="" />
                    </div>
                    <div class="col-md-6 text-left">
                        <div class="box">
                              <h1>恭喜您，操作成功！</h1>
                              <h4 class="text-left">您的申请已提交，请等待审批！</h4>
                              <button class="btn  btn-default">
                                <router-link to="/">返回首页</router-link>
                              </button>
                          </div>
                    </div>
                </div>
            </div>
        </div>
     </div>
  </template>
  <script>
  import footder from '../../components/footder.vue'
  import headers from '../../components/header.vue'
  export default {
    name: 'Success',
    components:{
        footder,headers
    }
  }

  </script>

  <style scoped>
  .Success{width: 100%;overflow: hidden;}
  .contact{margin-top: 30px;}
  .textHeight{margin-top: 20px;margin-bottom: 15px; padding-bottom:15px;border-bottom: 4px solid #f0ad4e;}
  .pdb0{padding-right: 0;padding-left: 0}
  .box{height: 180px;margin-top: 85px;padding-left: 16px;}
    .box h1,.box h4{margin-bottom: 35px;}
    .box button{color: #337ab7;border:1px solid #337ab7;padding-left: 25px;padding-right: 25px;}

  </style>
