      <!--综合查询-->
      <template>
        <div class="GeneralQry" >
          <div class="" style="margin-bottom:20px;">
            <div class="row">
              <div class="col-md-10 col-md-offset-1">
                <div class="col-md-12 textHeight">
                  <div class="col-md-12">
                    <span class="h4">业务处理>综合查询</span>
                    <button class="btn btn-default pull-right margint btn-sm" @click="Return"  >返回</button>
              </div>
        </div>
        <!-- <div class="col-md-12"> -->

              <div  class="text-info border-b">
                合同信息
          </div>
          <!-- <br> -->
          <table class="col-md-12 table table-hover table-bordered table-striped">
           <thead>
                 <tr class="">
                       <!-- <th class="text-center"></th> -->
                       <th  class="text-center">业务品种</th>
                       <th  class="text-center">合同号</th>
                       <th  class="text-center">合同金额</th>
                       <th  class="text-center">生效日期</th>
                       <th  class="text-center">到期日</th>
                 </tr>
           </thead>
           <tbody>
                 <tr  class="text-center"
                  v-if="contract.list"
                  v-for="(item, key) in contract.list"
                  :key="key">
                       <td>{{item.productid}}</td>
                       <td>{{item.mastContno}}</td>
                       <td>{{item.contAmount}}</td>
                       <td>{{item.startDate}}</td>
                       <td>{{item.endDate}}</td>
                 </tr>
                 <tr  v-else class="text-center" >
                  <td colspan="8" rowspan="" headers="" >
                   <p class="text-primary">暂无数据...</p>
                 </td>
               </tr>
           </tbody>
     </table>
     <pagination :data.sync="contract.list"
      :total="contract.total"
      :url="url.generalQry.contract"
      :value="contract.value"
      table="contract"
      k="contList"
      />

     <div  class="text-info border-b" style="margin-top: 300px;">
          借据信息
    </div>
    <!-- <button type="button" class="btn btn-primary mg">筛选</button> -->
    <table class="col-md-12 table table-hover table-bordered table-striped">
     <thead>
           <tr class="">
                 <!-- <th class="text-center"></th> -->
                 <th  class="text-center">借据号</th>
                 <th  class="text-center">借据金额</th>
                 <th  class="text-center">放款日</th>
                 <th  class="text-center">到期日</th>
                 <th  class="text-center">最迟还款日</th>
                 <th  class="text-center">操作</th>
           </tr>
     </thead>
     <tbody>
           <tr  class="text-center"
            v-if="debet.list"
            v-for="(item, key) in debet.list"
            :key="key">
                 <td>{{item.debetNo}}</td>
                 <td>{{item.lnciAmt}}</td>
                 <td>{{item.loanDate}}</td>
                 <td>{{item.payEndDate}}</td>
                 <td>{{item.loanEndDate}}</td>
                 <td>
                  <!-- <router-link  to="/Details">查看</router-link> -->
                  <a href="javascript:;" 
                    @click="debetDetail(item)"
                    >查看
                  </a>
                 </td>
           </tr>
           <tr  v-else class="text-center" >
              <td colspan="8" rowspan="" headers="" >
               <p class="text-primary">暂无数据...</p>
             </td>
           </tr>
     </tbody>
  </table>
  <pagination :data.sync="debet.list"
    :total="debet.total"
    :url="url.generalQry.debet"
    :value="debet.value"
    table="debet"
    k="repayPlanList"
    />

     <div  class="text-info border-b" style="margin-top: 300px;">
          已转让账款信息
    </div>
    <!-- <button type="button" class="btn btn-primary mg">筛选</button> -->
    <table class="col-md-12 table table-hover table-bordered table-striped">
     <thead>
           <tr class="">
                 <!-- <th class="text-center"></th> -->
                 <th  class="text-center">合同号</th>
                 <th  class="text-center">买方名称</th>
                 <th  class="text-center">证类型</th>
                 <th  class="text-center">凭证编号</th>
                 <th  class="text-center">凭证日期</th>
                 <th  class="text-center">付款到期日</th>
                 <th  class="text-center">最迟付款日</th>
                 <th  class="text-center">账款有效金额</th>
           </tr>
     </thead>
     <tbody>
           <tr  class="text-center"
            v-if="transfer.list"
            v-for="(item, key) in transfer.list"
            :key="key">
                 <td>{{item.debtContName}}</td>
                 <td>{{item.cnameBuyer}}</td>
                 <td>{{item.billsType}}</td>
                 <td>{{item.billsNo}}</td>
                 <td>{{item.billsDate}}</td>
                 <td>{{item.debtEnd}}</td>
                 <td>{{item.deadline}}</td>
                 <td>{{item.billsAmountview}}</td>
           </tr>
           <tr  v-else class="text-center" >
              <td colspan="8" rowspan="" headers="" >
               <p class="text-primary">暂无数据...</p>
             </td>
           </tr>
     </tbody>
  </table>
  <pagination :data.sync="transfer.list"
    :total="transfer.total"
    :url="url.generalQry.transfer"
    :value="transfer.value"
    table="transfer"
    k="debtBase"
    />
<!-- </div> -->
</div>
</div>

</div>
</div>
</template>
<script>
import footder from "../../components/footder.vue";
import headers from "../../components/header.vue";
// -------------------------------------------------------------------
import url from "@/http/url";
import pagination from '@/components/global/pagination'

export default {
  name: "GeneralQry",
  http: {
    headers: url.headers
  },
  components: {
    footder,
    headers,
    pagination
  },
  computed: {
    sessionData() {
      return JSON.parse(sessionStorage.getItem("sessionData"));
    }
  },
  data() {
    return {
      all: 5, //总页数
      cur: 1, //当前页码
      url: url, // 地址
      debData: [], //定保理转让申请接口数据
      // -------------------------------------------------------------
      contract: {
        list: [],
        total: 1,
        value: {
          transCode: "",
          certCode: JSON.parse(sessionStorage.getItem('sessionData')).certNo,
          productId: "",
          contAmount: "",
          contStatus: "",
          pageIndex: 1,
          pageSize: 5
        }
      },
      debet: {
        list: [],
        total: 1,
        value: {
          transCode: "",
          certCode: JSON.parse(sessionStorage.getItem('sessionData')).certNo,
          pageIndex: 1,
          pageSize: 5
        }
      },
      transfer: {
        list: [],
        total: 1,
        value: {
          transCode: "",
          certCode: JSON.parse(sessionStorage.getItem('sessionData')).certNo,
          status: "",
          pageIndex: 1,
          pageSize: 5
        }
      }
    };
  },
  mounted() {
    // this.dataContract()
    // this.dataDebet()
    // this.dataTransfer()
    // Promise.all([this.dataContract(), this.dataDebet(), this.dataTransfer()])
  },
  methods: {
    //返回上一部
    Return: function() {
      window.history.go(-1);
    },
    // ---------------------------------------------------------------
    dataContract() {
      this.getData(
        url.generalQry.contract,
        this.contract.value,
        "contract",
        "contList"
      );
    },
    dataDebet() {
      this.getData(
        url.generalQry.debet,
        this.debet.value,
        "debet",
        "repayPlanList"
      );
    },
    dataTransfer() {
      this.getData(
        url.generalQry.transfer,
        this.transfer.value,
        "transfer",
        "debtBase"
      );
    },
    getData(url, value, table, key) {
      this.$http
        .post(url, value, {
          headers: url.headers
        })
        .then(
          res => {
            console.log(res)
            this[table].list = JSON.parse(res.body.rows)[key];
            this[table].total = res.body.total
          },
          res => console.log("出错了")
        );
    },
    debetDetail(item) {
      // 借据详情
      sessionStorage.setItem("debetDetail", JSON.stringify(item));
      this.$router.push("/Details");
    }
  }
};
</script>
<style scoped>
.RtransferApply {
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
.table {
  margin-bottom: 10px;
}
</style>
