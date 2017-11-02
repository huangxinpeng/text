  <!--应收账款转让管理页面-->
  <template>
    <div class="PoolLoanInfo" >
        <div class="" style="margin-bottom:20px;">
            <div class="row">
                <div class="col-md-10 col-md-offset-1">
                  <div class="col-md-12 textHeight">
                     <div class="col-md-12">
                     <span class="h4">池保理>应收账款转让</span>
                        </div>
                  </div>
                  <div class="col-md-10 col-md-offset-1">
                        <form role="form" class="col-md-0">
                                <div class="col-md-12 ">
                                      <div class="form-group col-md-6 ">
                                                <label  class="col-md-4"><h5>借据号</h5></label>
                                                <div class="col-md-8">
                                                        <input type="text" />
                                                </div>
                                      </div>
                                      <div class="form-group col-md-6 ">
                                                <label  class="col-md-4"><h5>保理合同</h5></label>
                                                <div class="col-md-8">
                                                       <select > 
                                                            <option value="">请选择</option>
                                                            <option value="12123123">12123123</option>
                                                            <option value="HT123456">HT123456</option>
                                                       </select>
                                                </div>
                                      </div>
                                </div>

                                <div class="col-md-12 ">
                                        <div class="form-group col-md-6">
                                            <label  class="col-md-4"><h5>买方客户</h5> </label>
                                            <div class="col-md-8">
                                                    <input type="text" />
                                            </div>
                                        </div>
                                </div>
                            <div class="col-md-12 text-center">
                                        <button type="button" class="buttonl pd30">查询</button>  
                                         <button type="reset" class="buttonl pd30">重置</button>
                            </div>
                               
                        </form>
                  </div>
              </div>
              <div class="col-md-10  col-md-offset-1">
                    <hr class="bgc" />
                    <div class="col-md-12">
                    <div class="col-md-12" style="padding:0">
                               <button type="button" class="buttonl pd30">放款申请</button>
                           
                    </div>
                      <!-- 插件 -->
                            <table class="table table-bordered" data-toggle="table" :data-url="url" data-height="246" data-pagination="true">
                           <thead class="text-center">
                           <tr  >
                               <th  data-field="g" data-align="center" >编号</th>
                               <th data-field="a" data-align="center"  >借据号</th>
                               <th data-field="b" data-align="center">保理合同号</th>
                               <th data-field="c" data-align="center" >买方客户</th>
                               <th data-field="d" data-align="center">申请放款金额</th>
                               <th data-field="e" data-align="center"  >实际放款金额</th>
                               <th data-field="f" data-align="center">申请日期</th>
                               <th data-field="j" data-align="center">放款日期</th>
                               <th data-field="h" data-align="center">申请状态</th>
                               <th data-field="i" data-align="center">操作</th>
                           </tr>
                           </thead>

                       </table>
                     
                  <!-- 插件 -->

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
    name: 'PoolLoanInfo',
    components:{
        footder,headers
    },
    data(){
        return {
          // todos:''
           // url:'static/data3.json',
           url:''
      }
    },
    created:function(){
       var urls="http://119.23.220.239:8083/static/userMng/custIntentionQry";
       this.url=urls
        this.$http.post(urls).then((response)=>{
          console.log(response)
              var datas=response.data
                for(var key in datas){
                    console.log(datas[key])
                }
                  
                // alert(response.a)
                // this.todos= response 
              }
        )
       

    }


  }
  </script>
  <style scoped>
  .PoolLoanInfo{width: 100%;overflow: hidden;}
  .textHeight{margin-top: 20px;margin-bottom: 15px; padding-bottom:15px;border-bottom: 4px solid #f0ad4e; padding-left: 0;font-weight: bold}
  .bgc{background-color: #f0ad4e; height: 4px;overflow: hidden;}
  select,input{width: 200px;height: 30px; line-height:35px;padding-right: 0}
.buttons{width: 100px;;border:none;padding: 5px 5px; box-shadow: 2px 2px 2px #999;margin-right: 15px;margin-left: 15px;}

.buttonl{ text-align: center;padding: 5px 15px;border: none;;margin-bottom: 10px;box-shadow: 2px 2px 2px #666 ;margin-right: 15px;}
.col-md-0 .col-md-4{padding: 0}
.pagination-info {margin: 5px 10px 5px 0}
.pd30{padding-left: 30px;padding-right: 30px;}

  </style>
