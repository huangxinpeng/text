<!-- 定保理应收账款管理页面-->
<template>
  <div class="PoolDebtMng" >
    <div class="" style="margin-bottom:20px;">
      <div class="row">
        <div class="col-md-10 col-md-offset-1">
          <div class="col-md-12 textHeight">
            <div class="col-md-12">
              <span class="h4">定保理>应收账款管理</span>
              <router-link class="btn btn-default pull-right margint btn-sm" to='/homepage' >返回</router-link>

          </div>
      </div>
      <div class="col-md-10 col-md-offset-1">
        <form role="form" class="">
          <div class="col-md-12 ">
            <div class="form-group col-md-6 ">
              <label  class="col-md-4"><h5>买方名称</h5></label>
              <div class="col-md-8 input-group">
                <input type="text" name=""  class="form-control" v-model="querys.custcdBuyer">
            </div>
        </div>
        <div class="form-group col-md-6 ">
          <label  class="col-md-4"><h5>凭证编号</h5></label>
          <div class="col-md-8 input-group ">
            <input type="text"   class="form-control" v-model="querys.billsNo" />
        </div>
    </div>
</div>

<div class="col-md-12 ">
    <div class="form-group col-md-6">
      <label  class="col-md-4"><h5>应收账款日期</h5> </label>
      <div class="col-md-8 input-group">
        <input type="date"  class="form-control" v-model="querys.beginDate" />
    </div>
</div>
</div>

<div class="col-md-12 text-center">
    <button type="button"  class=" btn btn-warning "  @click="query" >查询</button>
</div>
</form>
</div>
</div>
<div class="col-md-10  col-md-offset-1">
  <hr class="bgc" />
  <div class="col-md-12">
    <div class="col-md-12">
      <router-link to="/debtAdd" class="buttonl btn btn-warning">新增</router-link>
      <button type="button"
        class="buttonl btn btn-warning"
        @click="downloadFile"
        ><a :href="downloadURL"
          style="color: #fff;"
          >模板下载
        </a>
      </button>
      <button type="button"
        class="buttonl btn btn-warning"
        @click="uploadButton"
        >账款导入
      </button>
      <form :action="uploadURL"
        target="iframe"
        enctype="multipart/form-data"
        method="post"
        style="display: none;">
        <input
          ref="uploadInput"
          class="upload-file"
          name="filename"
          type="file"
          accept=".xls"
          @change="uploadFile($event)">
        <button type="submit" ref="uploadSubmit"></button>
      </form>
      <iframe ref="iframe" src="" frameborder="0" name="iframe"
        style="height: 30px;"></iframe>
  </div>
  <!-- ---- -->
  <table class="table table-bordered">
      <thead class="text-center">
        <tr  >
          <th  class="text-center" >选择</th>
          <th  class="text-center" >发票号码</th>
          <th  class="text-center" >凭证类型</th>
          <th  class="text-center" >买方名称</th>
          <th  class="text-center" >发票日期</th>
          <th  class="text-center" >发票金额</th>
          <th  class="text-center" >预付款金额</th>
          <th  class="text-center" >已付金额</th>
          <th  class="text-center" >佣金及折让金额</th>
          <th  class="text-center" >应收账款有效金额</th>
          <th  class="text-center" >预计回款日</th>
          <th  class="text-center" >操作</th>
      </tr>
  </thead>
  <tbody>
    <tr  v-for="(item,index) in aJson" class="text-center">
      <td class="text-center">{{ ( cur -1)*10+index+1}}</td>
      <td>{{ item.billsNo }}</td>
      <td>{{ item.billsType }}</td>
      <td>{{ item.custcdBuyer }}</td>
      <td>{{ item.beginDate }}</td>
      <td>{{ item.billsAmountView }}</td>
      <td>{{ item.prepayAmt }}</td>
      <td>{{ item.paidAmt }}</td>
      <td>{{ item.damageAmt }}</td>
      <td>{{ item.billsAmount }}</td>
      <td>{{ item.endDate }}</td>
      <td>
        <button class="btn btn-sm"   title=" 修改" data-target="#updateModal "  data-toggle="modal"  @click="modify(item.id)"   style="  margin-top:-8px; width: 22px;  height:28px; background: url(./static/img/u36.png)"></button>
        <button class="btn btn-sm"  title="删除" style="  margin-top:-8px; width: 22px;height:28px;background: url(./static/img/u37.png)"  @click="del(item.id)" ></button>
    </td>
    <!--     <td><a href=" Javascript: void(0)" @click="modify(item.id)"      data-target="#updateModal "  data-toggle="modal" class="model" >修改</a><a href=" Javascript: void(0)" @click="del(item.id)">删除</a></td> -->

</tr>
<tr   v-if="aJson.length==0">
  <td colspan="12  " class="text-center">暂无数据</td> 
</tr>
</tbody>
</table>
<!-- --- -->
</div>
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
<!-- 修改模态框（Modal） -->
<div class="modal fade" id="updateModal" tabindex="-1" role="dialog"
aria-labelledby="myModalLabel" aria-hidden="true" style="z-index: 9999999">
<div class="modal-dialog">
  <div class="modal-content">
    <div class="modal-header">
       <button type="button" class="close" data-dismiss="modal"
       aria-hidden="true">×</button>
       <h4 class="modal-title text-center" id="myModalLabel">修改信息</h4>
   </div>
   <div class="modal-body">
       <form id="formUpdate" class="form-horizontal col-sm-12"  v-for="item in aJsons"  >
          <div class="form-group col-sm-6 pb " style="margin-right:15px;">
            <label  class="col-sm-5   h5 ">客户名称</label>
            <div class="col-sm-7  pb" >
               <!-- 根据主健id修改数据库对于的一行数据： -->
               <input class="form-control" v-model="item.custcdSeller"   />
           </div>
       </div>
       <!-- placeholder="该输入框禁止输入..." -->
       <div class="form-group  col-sm-6 pb" style="margin-right:15px;" >
         <label class="col-sm-5  h5 ">买方名称</label>
         <div  class="col-sm-7 pb">
            <input type="text"   v-model="item.custcdBuyer"  >
        </div>
    </div>

    <div class="form-group col-sm-6 pb" style="margin-right:15px;">
       <label class="col-sm-5  h5 ">凭证类型</label>
       <div  class="col-sm-7 pb">
          <select name="billsType"  v-model="item.billsType"  >
            <option value="001">请选择</option>
            <option value="01">发票</option>
            <option value="02">结算单</option>
            <option value="03">虚拟结算单</option>
            <option value="04">收据</option>
            <option value="05">其他</option>
        </select>
    </div>
</div>

<div class="form-group col-sm-6 pb" style="margin-right:15px;">
 <label class="col-sm-5  h5  ">凭证编号</label>
 <div  class="col-sm-7 pb">
   <input type="text" class="form-control"  v-model="item.billsNo"  />
</div>
</div>
<!-- ========================= -->
<div class="form-group col-sm-6 pb" style="margin-right:15px;">
 <label class="col-sm-5  h5 ">预付款金额</label>
 <div  class="col-sm-7 pb">
   <input type="text" class="form-control"   v-model="item.prepayAmt" onkeyup="this.value=this.value.replace(/[^0-9.]+/,'');"   min="0"  />
</div>
</div>

<div class="form-group col-sm-6 pb" style="margin-right:15px;">
 <label class="col-sm-5  h5  ">已付款金额</label>
 <div class="col-sm-7 pb" >
   <input type="text" class="form-control" v-model="item.paidAmt" onkeyup="this.value=this.value.replace(/[^0-9.]+/,'');"   min="0"  />
</div>
</div>

<div class="form-group col-sm-6 pb" style="margin-right:15px;" >
 <label class="col-sm-5  h5 "> 佣金及折让金额 </label>
 <div  class="col-sm-7 pb">
   <input type="text" class="form-control" v-model="item.damageAmt" onkeyup="this.value=this.value.replace(/[^0-9.]+/,'');"   min="0"   />
</div>
</div>

<div class="form-group col-sm-6 pb" style="margin-right:15px;">
 <label class="col-sm-5  h5 ">应收账款金额</label>
 <div  class="col-sm-7 pb">
   <input type="text" class="form-control"  v-model="item.billsAmountView"    onkeyup="this.value=this.value.replace(/[^0-9.]+/,'');"   min="0"  />
</div>
</div>
<!-- ========================= -->

<div class="form-group col-sm-6 pb" style="margin-right:15px;">
 <label class="col-sm-5  h5 ">应收账款有效金额</label>
 <div  class="col-sm-7 pb">
   <input type="text" class="form-control"  v-model="item.billsAmount"  onkeyup="this.value=this.value.replace(/[^0-9.]+/,'');"   min="0" />
</div>
</div>

<div class="form-group col-sm-6 pb" style="margin-right:15px;">
 <label class="col-sm-5  h5 ">应收账款日期</label>
 <div  class="col-sm-7 pb">
   <input   type="date"  v-model="item.beginDate"  />
</div>
</div>

<div class="form-group col-sm-6 pb" style="margin-right:15px;">
 <label class="col-sm-5 h5 ">付款到期日</label>
 <div class="col-sm-7 pb" >
   <input  type="date"  v-model="item.endDate"   />
</div>
</div>

<p style="display: none">{{ item.id}}</p><!-- 隐藏的id -->
</form>
</div>
<div class="modal-footer">
 <button type="button" class="btn btn-success" data-dismiss="modal">关闭</button>
 <button type="button" class="btn btn-primary" id="update"
 @click="updata ">提交</button>
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
import URL from "@/http/url.js";
// import axios from '@/cooike/index.js'
// console.log(URL)
export default {
  name: "PoolDebtMng",
  components: {},
  data() {
    return {
      all: "", //总页数
      cur: 1, //当前页码
      downloadURL: '', // 下载模板
      uploadURL: '', // 导入的url
      url: '', // 地址
      product: "1230010", //产品类型(1230010-单保理；1230040-保理池)
      stotal: "", //后台总数
      aJson: [], //接口的数据
      aJsons: [], // 修改的接口
      querys: {
        billsNo: "",
        custcdBuyer: "",
        beginDate: "",
        product: "1230010", //产品类型(1230010-单保理；1230040-保理池)
        pageSize: 10,
        pageNumber: 1
      }
    };
  },

  created: function() {
    this.downloadURL = URL.poolDebet.download
    this.uploadURL = URL.poolDebet.upload
    // console.log(this.headers)
    var urls = URL.usermng.debtbase.limit;
    this.url = urls;
    this.$http
      .post(
        this.url,
        JSON.stringify({ pageSize: 10, pageNumber: 1, product: this.product }),
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
  },
  watch: {
    cur: function(oldValue, newValue) {
      console.log(arguments);
    }
  },
  methods: {
    //删除
    del: function(useid) {
      var delurl = URL.usermng.debtbase.del + "?id=" + useid;
      var aconfirm = confirm("确认删除吗?");
      if (aconfirm) {
        // window.location.reload();//刷新
        if (this.aJson != 0) {
          this.$http
            .get(delurl, { headers: URL.headers }, { emulateJSON: true })
            .then(
              function(res) {
                window.location.reload(); //刷新
                this.$http
                  .post(
                    this.url,
                    JSON.stringify({
                      pageSize: 10,
                      pageNumber: 1,
                      product: this.product
                    }),
                    { headers: URL.headers }
                  )
                  .then(function(response) {
                    this.aJson = response.data;
                    if (this.aJson.retcodes == 201) {
                      this.aJson = "";
                    }
                  });
                //跳转
              },
              function(error) {
                return false;
              }
            );
        }
      } else {
        //取消删除
        alert("取消删除");
      }
    },
    //修改
    modify: function(ids) {
      var modifyurl = URL.usermng.debtbase.query + "?queryId=" + ids;
      this.$http
        .get(modifyurl, { headers: URL.headers }, { emulateJSON: true })
        .then(function(response) {
          this.aJsons = response.data.rows;

          this.formArr = this.aJsons[0];

          console.log(this.formArr);
        });
    },

    //页码
    btnClick: function(data) {
      //页码点击事件
      if (data != this.cur) {
        this.cur = data;
        this.$http
          .post(
            this.url,
            JSON.stringify({
              pageSize: 10,
              pageNumber: this.cur,
              product: this.querys.product,
              billsNo: this.querys.billsNo,
              custcdBuyer: this.querys.custcdBuyer,
              beginDate: this.querys.beginDate
            }),
            { headers: URL.headers },
            { emulateJSON: true }
          )
          .then(function(response) {
            // alert(this.cur)
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
          JSON.stringify({
            pageSize: 10,
            pageNumber: this.cur,
            product: this.querys.product,
            billsNo: this.querys.billsNo,
            custcdBuyer: this.querys.custcdBuyer,
            beginDate: this.querys.beginDate
          }),
          { headers: URL.headers },
          { emulateJSON: true }
        )
        .then(function(response) {
          this.aJson = response.data.rows;
          this.all = Math.ceil(response.data.total / 10);
        });
      console.log("现在在" + this.cur + "页");
    },
    //修改保存
    updata: function() {
      var formArr = {
        id: "",
        billsNo: "", //凭证编号
        billsType: "", //凭证类型
        custcdSeller: "", //客户名称
        custcdBuyer: "", //买方名称
        prepayAmt: "", //预付款金额
        paidAmt: "", //  已付款金额
        damageAmt: "", //佣金及折让金额
        billsAmountView: "", //应收账款金额
        beginDate: "", //应收账款日期
        billsAmount: "", //应收账款有效金额
        endDate: "" //付款到期日
      };
      for (var key in formArr) {
        formArr[key] = this.aJsons[0][key];
      }
      // this.formArr=this.aJsons[0]
      console.log(this.formArr);
      var updataurl = URL.usermng.debtbase.edit;
      // var this.formarr
      this.$http
        .post(
          updataurl,
          JSON.stringify(formArr),
          { headers: URL.headers },
          { emulateJSON: true }
        )
        .then(function(response) {
          $("#updata").attr("data-dismiss", "modal");
          window.location.reload();
        });
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
    },
    // ---------------------------------------------------------------------
    downloadFile () {
      this.$http.get(URL.poolDebet.download)
        .then(res => console.log(res)
          ,res => console.log(res))
    },
    uploadButton () {
      this.$refs.uploadInput.click()
    },
    uploadFile () {
      this.$refs.uploadSubmit.click()
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
.PoolDebtMng {
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
.buttons {
  width: 100px;
  border: none;
  padding: 5px 5px;
  box-shadow: 2px 2px 2px #999;
  margin-right: 15px;
  margin-left: 15px;
}
select,
input {
  width: 200px;
  height: 30px;
  line-height: 35px;
  padding-right: 0;
}
.buttonl {
  margin-right: 25px;
  width: 100px;
  text-align: center;
  padding: 5px;
  border: none;
  margin-left: -15px;
  margin-top: -5px;
  margin-bottom: 10px;
}
.w500 {
  width: 500px;
}
.pb {
  padding-left: 0;
  padding-right: 0;
}
#updateModal input,
#updateModal select {
  width: 100%;
}

/*---------------------------------------------------------------------------*/
.upload-button {
  border: none;
}
.upload-file {
  background: #000;
  width: 100%;
  height: 100%;
}
</style>
