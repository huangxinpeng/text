  <!-- 操作指引 页面-->
  <template>
    <div class="Opinstructions" >
        <div class="" style="margin-bottom:20px;">
            <div class="row">
                <div class="col-md-10 col-md-offset-1">
                  <div class="col-md-12 textHeight">
                     <div class="col-md-12">
                        <a href="#"><img src="../../img/u26.png" alt="" /><span class="h4">操作指引</span></a>
                        </div>
                  </div>
                    <div class="col-md-10 col-md-offset-1">
                      <ul class="col-md-10  col-md-offset-1  ">
                            <li  class="col-md-12"  style="margin-bottom:18px"  v-for="(item,index) in openData"  ><span  class="col-md-3"  style=" display: inline-block; background: url(static/img/list-5.png) 0 0 no-repeat;height:65px;width:65px; text-align: center;line-height:65px; font-size: 26px; margin-right: 40px; ">{{index+1}}</span><span  class="col-md-8 text-center" style="display:inline-block; padding-left:18px;font-size:16px; border:1px solid #999;height:65px;line-height:65px;" >{{item.opins}}</span></li>
                      </ul>
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
    name: 'ContactUS',
    components:{
        footder,headers
    },
    data(){
      return{
        img:"",
        openData:[
              {opins:"注册并提交审核材料"},
              {opins:"电话联系客户经理审核"},
              {opins:"导入应收账款"},
              {opins:"发起应收账款转让申请，核心企业进行应收账款确认"},
              {opins:"签订保理合同"},
              {opins:"放款申请"}
        ]
      }
    }
  }

  </script>

  <style scoped>
  .Opinstructions{width: 100%;overflow: hidden;}
  .textHeight{margin-top: 20px;margin-bottom: 15px; padding-bottom:15px;border-bottom: 4px solid #f0ad4e;}
  .col-md-8 h4{margin-bottom: 15px;}
  .col-md-5 .h4{font-weight: bold;color:#000000;}
  .text-right h4{height: 40px;line-height: 40px;}
  .pdb0{padding-right: 0;padding-left: 0}
  </style>
