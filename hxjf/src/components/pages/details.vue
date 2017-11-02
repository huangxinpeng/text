      <!--借据详情-->
      <template>
          <div class="Details" >
              <div class="" style="margin-bottom:20px;">
                  <div class="row">
                      <div class="col-md-10 col-md-offset-1">
                          <div class="col-md-12 textHeight">
                              <div class="col-md-12">
                                  <span class="h4">业务处理>综合查询>借据详情</span>
                                  <button class="btn btn-default pull-right margint btn-sm" @click="Return">返回</button>
                            </div>
                      </div>
                      <div class="col-md-12">
                            <div  class="text-info border-b">
                                借据详情信息
                          </div>
                          <br>
                          <div class="col-md-12">
                              <ul class="col-md-10 col-md-offset-1">
                                  <li class="col-md-12 mg">
                                          <ul class="col-md-12">
                                                <li class="col-md-2 text-right">借据号</li>
                                                <li class="col-md-4 text-center">{{ debetDetail.debetNo }}</li>
                                                <li class="col-md-2 text-right">借据金额</li>
                                                <li class="col-md-4 text-center">{{ debetDetail.lnciAmt }}</li>
                                          </ul>
                                  </li>
                                  <li class="col-md-12 mg">
                                          <ul class="col-md-12">
                                                <li class="col-md-2 text-right">借据余额</li>
                                                <li class="col-md-4 text-center">{{ debetDetail.lnciBal }}</li>
                                                <li class="col-md-2 text-right">放款日期</li>
                                                <li class="col-md-4 text-center">{{ debetDetail.loanDate }}</li>
                                          </ul>
                                  </li>
                                  <li class="col-md-12 mg">
                                          <ul class="col-md-12">
                                                <li class="col-md-2 text-right">到期日</li>
                                                <li class="col-md-4 text-center">{{ debetDetail.payEndDate }}</li>
                                                <li class="col-md-2 text-right">最迟还款日</li>
                                                <li class="col-md-4 text-center">{{ debetDetail.loanEndDate }}</li>
                                          </ul>
                                  </li>
                                  <li class="col-md-12 mg">
                                          <ul class="col-md-12">
                                                <li class="col-md-2 text-right">已还账户管理费</li>
                                                <li class="col-md-4 text-center">{{ debetDetail.actualAccountCost }}</li>
                                                <li class="col-md-2 text-right">已还担保服务费</li>
                                                <li class="col-md-4 text-center">{{ debetDetail.actualGuaranteeCost }}</li>
                                          </ul>
                                  </li>
                                  <li class="col-md-12 mg">
                                          <ul class="col-md-12">
                                                <!-- <li class="col-md-2 text-right">利率（%）</li>
                                                <li class="col-md-4 text-center">{{ debetDetail.debetNo }}</li> -->
                                                <li class="col-md-2 text-right">已还利息金额</li>
                                                <li class="col-md-4 text-center">{{ debetDetail.totalAmt }}</li>
                                          </ul>
                                  </li>
                                  <!-- <li class="col-md-12 mg">
                                          <ul class="col-md-12">
                                                <li class="col-md-2 text-right">已还保理服务费</li>
                                                <li class="col-md-4 text-center"></li>
                                          </ul>
                                  </li> -->
                            </ul>
                      </div>
                      <br>
                      <div  class="text-info border-b">
                          还款记录
                    </div>
                    <table class="col-md-12 table table-hover table-bordered table-striped">
                         <thead>
                               <tr class="">
                                     <!-- <th class="text-center"></th> -->
                                     <th  class="text-center h5">还款日期</th>
                                     <th  class="text-center h5">还款金额</th>
                                     <th  class="text-center h5">还本金金额</th>
                                     <th  class="text-center h5">还利息金额</th>
                                     <th  class="text-center h5">还宽限期利息金额</th>
                                     <th  class="text-center h5">还逾期利息金额</th>
                                     <th  class="text-center h5">还账户管理费金额</th>
                                     <th  class="text-center h5">还担保服务费金额</th>
                               </tr>
                         </thead>
                         <tbody>
                               <tr  class="text-center"
                                v-for="(item, key) in repay.list"
                                :key="key">
                                     <!-- <td></td> -->
                                     <td>{{ item.repayDate }}</td>
                                     <td>{{ item.repayAmount }}</td>
                                     <td>{{ item.repayCapital }}</td>
                                     <td>{{ item.repayInterest }}</td>
                                     <td>{{ item.repayGraceAmt }}</td>
                                     <td>{{ item.repayOverdueAmt }}</td>
                                     <td>{{ item.repayAccountCost }}</td>
                                     <td>{{ item.repayAssureCost }}</td>
                               </tr>
                         </tbody>
                   </table>
                   <pagination :data.sync="repay.list"
                    :total="repay.total"
                    :url="url.generalQry.repayRecord"
                    :value="repay.value"
                    table="repay"
                    k="b009List"/>
             </div>
       </div>
 </div>

</div>
</div>
</template>
<script>
import footder from "../../components/footder.vue";
import headers from "../../components/header.vue";
import url from '@/http/url'
import pagination from '@/components/global/pagination'
export default {
  name: "Details",
  http: {
    headers: url.headers
  },
  components: {
    footder,
    headers,
    pagination
  },
  computed: {
    debetDetail () { return JSON.parse(sessionStorage.getItem('debetDetail')) },
    sessionData () { return JSON.parse(sessionStorage.getItem('sessionData')) }
  },
  data() {
    return {
      all: "5", //总页数
      cur: 1, //当前页码
      url: url, // 地址
      debData: [], //定保理转让申请接口数据,
      repay: {
        list: [],
        total: 1,
        value: {
          transCode: "",
          certCode: JSON.parse(sessionStorage.getItem('sessionData')).certNo,
          debetNo: JSON.parse(sessionStorage.getItem('debetDetail')).debetNo,
          pageIndex: 1,
          pageSize: 5
        }
      },
      info: {}
    };
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    //返回上一部
    Return: function() {
      window.history.go(-1);
    },
    getInfo () {
      this.$http.post(url.generalQry.debet, {
        debetNo: this.debetDetail.debetNo,
        transCode: this.debetDetail.transCode,
        certCode: this.sessionData.certNo,
        pageIndex: 1,
        pageSize: 5
      }).then(res => {
        // console.log(res)
        this.info = JSON.parse(res.body.rows)['repayPlanList'][0]
      })
    },
    getData () {}
  }
};
</script>
<style scoped>
.Details {
  width: 100%;
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
.border-b {
  border-bottom: 1px dashed #ccc;
  padding-bottom: 5px;
}
.mg {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
