      <!--保理合同签订下载-->
      <template>
        <div class="ContDownload" >
          <div class="" style="margin-bottom:20px;">
            <div class="row">
              <div class="col-md-10 col-md-offset-1">
                <div class="col-md-12 textHeight">
                  <div class="col-md-12">
                    <span class="h4">定保理>合同管理</span>
                    <router-link class="btn btn-default pull-right margint btn-sm" to='/homepage' >返回</router-link>
                  </div>
                </div>
                <div class="col-md-10 col-md-offset-1 borx">
                  <form role="form" class="col-md-0">
                    <div class="col-md-12 ">
                      <div class="form-group col-md-6 ">
                        <label  class="col-md-4 text-right"><h5>合同金额</h5></label>
                        <div class="col-md-8 input-group">
                          <input v-model="contract.value.contAmount"
                          type="text"  class="form-control"  />
                        </div>
                      </div>
                      <div class="form-group col-md-6 ">
                        <label  class="col-md-4 text-right"><h5>合同状态</h5></label>
                        <div class="col-md-8 input-group">
                          <input v-model="contract.value.contStatus"
                          type="text" name=""  class="form-control" />
                        </div>
                      </div>
                    </div>


                    <div class="col-md-12 text-center">
                     <button type="submit" class="btn btn-warning btn-sm"
                     @click="search">查询 </button>
                   </div>
                 </form>
               </div>
             </div>

             <div class="col-md-10  col-md-offset-1">
              <hr class="bgc" />
              <div class="col-md-12">
                <!-- 插件 -->
                <table class="table table-bordered" >
                  <thead class="text-center">
                    <tr   class="">
                      <th class="text-center">合同号</th>
                      <th class="text-center"><!-- 合同类型 --></th>
                      <th class="text-center">买方客户</th>
                      <th class="text-center">卖方客户</th>
                      <th class="text-center">合同生效时间</th>
                      <th class="text-center">合同结束时间</th>
                      <th class="text-center">合同金额</th>
                      <th class="text-center">合同状态</th>
                      <!-- <th class="text-center">操作</th> -->
                    </tr>
                  </thead>
                  <tbody>
                    <tr  class="text-center"
                    v-if="contract.list"
                    v-for="(item, key) in contract.list"
                    :key="key">
                    <td>{{item.mastContno}}</td>
                    <!-- <td>{{item.contType}}</td> -->
                    <td>{{item.cnameBuyer}}</td>
                    <td>{{item.cnameSeller}}</td>
                    <td>{{item.startDate}}</td>
                    <td>{{item.endDate}}</td>
                    <td>{{item.contAmount}}</td>
                    <td>{{item.contStatus}}</td>
                  </tr>
                  <tr v-else class="text-center" >
                    <td colspan="10" rowspan="" headers="">
                     <h4 class="text-primary">暂无数据...</h4>
                   </td>
                 </tr>
               </tbody>
             </table>
             <!-- 插件 -->
             <pagination :data.sync="contract.list"
             :total="contract.total"
             :url="url.generalQry.contract"
             :value="contract.value"
             table="contract"
             k="contList"
             />
           </div>
         </div>
       </div>

     </div>
   </div>
 </template>
 <script>
 import footder from "../../components/footder.vue";
 import headers from "../../components/header.vue";
 import pagination from '@/components/global/pagination'
 import url from '@/http/url'
 export default {
  name: "ContDownload",
  components: {
    footder,
    headers,
    pagination
  },
  data () { return {
    url: url,
    contract: {
      list: [],
      total: 1,
      value: {
        transCode: "",
        certCode: JSON.parse(sessionStorage.getItem('sessionData')).certNo,
        productId: "1230010",
        contAmount: "",
        contStatus: "",
        pageIndex: 1,
        pageSize: 5
      }
    },
  }},
  methods: {
    search () {
      this.$http.post(url.generalQry.contract, this.contract.value, {
        headers: url.headers
      }).then(res => {
        console.log(res)
        this.contract.list = JSON.parse(res.body.rows)['contList']
      }, res => alert(this.k + '出错了'))
    }
  }
};
</script>
<style scoped>
.ContDownload {
  width: 100;
  overflow: hidden;
}
.textHeight {
  margin-top: 20px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 4px solid #f0ad4e;
  padding-left: 0;
  font-weight: bold;
}
.bgc {
  background-color: #f0ad4e;
  height: 4px;
  overflow: hidden;
}
select,
input {
  width: 200px;
  height: 30px;
  line-height: 35px;
  padding-right: 0;
}
.buttons {
  width: 100px;
  border: none;
  padding: 5px 5px;
  box-shadow: 2px 2px 2px #999;
  margin-right: 15px;
  margin-left: 15px;
}

.buttonl {
  text-align: center;
  padding: 5px 15px;
  border: none;
  margin-bottom: 10px;
  box-shadow: 2px 2px 2px #666;
}
</style>
