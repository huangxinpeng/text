      <!--保理合同签订下载-->
      <template>
            <div class="PoolContMng" >
                  <div class="" style="margin-bottom:20px;">
                        <div class="row">
                              <div class="col-md-10 col-md-offset-1">
                                    <div class="col-md-12 textHeight">
                                          <div class="col-md-12">
                                                <span class="h4">池保理>合同管理</span>
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
                                                      <!-- <th class="text-center"></th> -->
                                                      <th class="text-center">合同号</th>
                                                      <!-- <th class="text-center">合同类型</th> -->
                                                      <!-- <th class="text-center">买方客户</th> -->
                                                      <th class="text-center">卖方客户</th>
                                                      <th class="text-center">合同生效时间</th>
                                                      <th class="text-center">合同结束时间</th>
                                                      <th class="text-center">合同金额</th>
                                                      <th class="text-center">合同状态</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                <tr v-if="contract.list" class="text-center" v-for="(item,index) in contract.list">  
                                                      <!-- <td>{{index +1}}</td> -->
                                                      <td>{{item.mastContno}}</td>
                                                      <!-- <td>{{item.contType}}</td> -->
                                                      <!-- <td>{{item.contAmount}}</td> -->
                                                      <td>{{item.cnameSeller}}</td>
                                                      <td>{{item.startDate}}</td>
                                                      <td>{{item.endDate}}</td>
                                                      <td>{{item.contAmount}}</td>
                                                      <td>{{item.contStatus}}</td>
                                                </tr>
                                                <tr v-else class="text-center" >
                                                      <td colspan="9" rowspan="" headers="">
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
import URL from "@/http/url.js";
import pagination from '@/components/global/pagination'
export default {
  name: "PoolContMng",
  components: {
    pagination
  },
  data() {
    return {
      all: "5", //总页数
      cur: 1, //当前页码
      url: URL, // 地址
      aJson: [], //数据
      cont: {
        productId: "1230010", //产品类型(1230010-单保理；1230040-保理池)
        transCode: "B005", // 交易码B005
        contAmount: "", // 合同金额,
        contStatus: "", // 合同状态
        // pageIndex: 1,
        pageSize: 5, //每页多少条数据
        pageNumber: "", //请求第几页
        certCode: JSON.parse(sessionStorage.getItem("sessionData")).certNo // 卖方客户证件号
      },
      // ------------------------------
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
      }
    };
  },

  created: function() {
    return
    // console.log(this.headers)
    var urls = URL.usermng.contract.limit;
    this.url = urls;
    this.cont.pageNumber = 1;
    this.cont.pageSize = 10;
    this.$http
      .post(
        this.url,
        JSON.stringify(this.cont),
        { headers: URL.headers },
        { emulateJSON: true }
      )
      .then(
        function(response) {
          this.aJson = response.data.rows;
          this.all = Math.ceil(response.data.total / 10);
        },
        function(erro) {
          alert("加载错误");
        }
      );
  },
  watch: {
    cur: function(oldValue, newValue) {
      console.log(arguments);
    }
  },
  methods: {
    search () {
      this.$http.post(URL.generalQry.contract, this.contract.value, {
        headers: URL.headers
      }).then(res => {
        console.log(res)
        this.contract.list = JSON.parse(res.body.rows)['contList']
      }, res => alert(this.k + '出错了'))
    },
    //页码
    btnClick: function(data) {
      //页码点击事件
      if (data != this.cur) {
        this.cur = data;
        this.$http
          .post(
            this.url,
            JSON.stringify({ pageSize: 10, pageNumber: this.cur }),
            { headers: URL.headers },
            { emulateJSON: true }
          )
          .then(function(response) {
            this.aJson = response.data.rows;
            console.log(this.aJsons);
            this.all = Math.ceil(response.data.total / 10);
          });
      }
    },
    //上一页下一页
    pageClick: function() {
      this.$http
        .post(
          this.url,
          JSON.stringify({ pageSize: 10, pageNumber: this.cur }),
          { headers: URL.headers },
          { emulateJSON: true }
        )
        .then(function(response) {
          this.aJson = response.data.rows;
          this.all = Math.ceil(response.data.total / 10);
        });
      console.log("现在在" + this.cur + "页");
    },
    //条件查询
    query: function() {
      var _this = this;
      var queryUirl = URL.usermng.debtbase.limit;
      this.url = queryUirl;
      _this.querys.pageNumber = 1;
      this.$http
        .post(
          this.url,
          JSON.stringify(this.querys),
          { headers: URL.headers },
          { emulateJSON: true }
        )
        .then(
          function(response) {
            console.log(response.url);
            if (response.body.retcode === "202") {
              var urls = URL.usermng.debtbase.limit;

              this.url = urls;
              this.$http
                .post(
                  this.url,
                  { pageSize: 10, pageNumber: 1, product: this.product },
                  { headers: URL.headers },
                  { emulateJSON: true }
                )
                .then(
                  function(response) {
                    this.aJson = response.data.rows;
                    this.all = Math.ceil(response.data.total / 10);
                    // alert(1)
                  },
                  function(erro) {
                    alert("加载错误");
                  }
                );
            } else if (response.body.retcode === "201") {
              this.aJson = "";
              this.aJson.length = 0;
            } else {
              this.aJson = response.data.rows;
              this.all = Math.ceil(response.data.total / 10);
            }
          },
          function(res) {
            alert("字段名为空");
          }
        );
    }
  },
  computed: {
    id: function() {
      this.formArr.id = this.aJson.id;
    },
    indexs: function() {
      var left = 1;
      var right = this.all;
      var ar = [];
      if (this.all >= 5) {
        if (this.cur > 3 && this.cur < this.all - 2) {
          left = this.cur - 2;
          right = this.cur + 2;
        } else {
          if (this.cur <= 3) {
            left = 1;
            right = 5;
          } else {
            right = this.all;
            left = this.all - 4;
          }
        }
      }
      while (left <= right) {
        ar.push(left);
        left++;
      }
      return ar;
    }
  }
};
</script>
<style scoped>
.PoolContMng {
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
.w500 {
  width: 500px;
}
</style>
