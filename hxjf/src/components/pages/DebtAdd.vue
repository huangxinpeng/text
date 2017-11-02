        <!--单保理应收账款新增页面页面-->
        <template>
            <div class="DebtAdd" >
                <div class="" style="margin-bottom:20px;">
                    <div class="row">
                      <div class="col-md-10 col-md-offset-1">
                        <div class="col-md-12 textHeight">
                         <div class="col-md-12">
                           <span class="h4">定保理>应收账款新增</span>
                       </div>
                   </div>
                   <div class="col-md-12 ">
                    <form role="form" class="col-md-0">
                      <div class="col-md-12 ">
                        <div class="form-group col-md-6 ">
                          <label  class="col-md-4 text-right h5">客户名称</label>
                          <div class="col-md-8 input-group">
                            <input type="text"  name="custcdSeller" class="form-control" placeholder="请输入名称..." v-model="formArr.custcdSeller"/>
                        </div>
                    </div>
                    <div class="form-group col-md-6 ">
                      <label  class="col-md-4 text-right h5">买方名称</label>
                      <div class="col-md-8  input-group">
                      <input type="text" name=""  class="form-control" placeholder="请输入名称..."  v-model="formArr.custcdBuyer" >
                </div>
            </div>
        </div>
        <div class="col-md-12 ">
            <div class="form-group col-md-6">
                <label  class="col-md-4  text-right h5">凭证类型 </label>
                <div class="col-md-8  input-group">
                  <select name="billsType"  v-model="formArr.billsType"   class="form-control" >
                        <option value="001">请选择</option>
                        <option value="01">发票</option>
                        <option value="02">结算单</option>
                        <option value="03">虚拟结算单</option>
                        <option value="04">收据</option>
                        <option value="05">其他</option>
                </select>
            </div>
        </div>
        <div class="form-group col-md-6 ">
            <label  class="col-md-4  text-right h5">发票号码</label>
            <div class="col-md-8  input-group">
                <input type="text"    class="form-control" name="billsNo" v-model="formArr.billsNo" />
            </div>
        </div>
    </div>

    <div class="col-md-12 ">
        <div class="form-group col-md-6 ">
            <label  class="col-md-4  text-right h5">发票日期</label>
            <div class="col-md-8  input-group">
                <input type="date"    class="form-control" onkeyup="this.value=this.value.replace(/[^0-9.]+/,'');"   min="0" name="paidAmt"  v-model="formArr.beginDate"   />
            </div>
        </div>
        <div class="form-group col-md-6 ">
            <label  class="col-md-4  text-right h5">发票金额</label>
            <div class="col-md-8  input-group">
                <input type="text"    class="form-control" onkeyup="this.value=this.value.replace(/[^0-9.]+/,'');"   min="0" name="paidAmt"  v-model="formArr.billsAmountView"   />
            </div>
        </div>
    </div>
    <div class="col-md-12 ">
        <div class="form-group col-md-6">
            <label  class="col-md-4  text-right h5">已付账款金额</label>
            <div class="col-md-8  input-group">
                <input type="text" placeholder="请输入金额..."    class="form-control" onkeyup="this.value=this.value.replace(/[^0-9.]+/,'');"   min="0" name="damageAmt"  v-model="formArr.paidAmt" />
            </div>
        </div>

        <div class="form-group col-md-6">
            <label  class="col-md-4  text-right h5">佣金及折让金额</label>
            <div class="col-md-8  input-group">
                <input type="text" placeholder="请输入金额..."    class="form-control" onkeyup="this.value=this.value.replace(/[^0-9.]+/,'');"   min="0" name="damageAmt"  v-model="formArr.damageAmt" />
            </div>
        </div>
    </div>

    <div class="col-md-12 ">
        <div class="form-group col-md-6 ">
            <label  class="col-md-4  text-right h5">应收账款有效金额</label>
            <div class="col-md-8  input-group">
                <input type="text" placeholder="请输入金额..."    class="form-control" name="billsAmount" onkeyup="this.value=this.value.replace(/[^0-9.]+/,'');"   min="0"  v-model="formArr.billsAmount" />
            </div>
        </div>
        <div class="form-group col-md-6">
            <label  class="col-md-4  text-right h5">预计回款日 </label>
            <div class="col-md-8  input-group">
                <input type="date"    class="form-control" name="endDate"  v-model="formArr.endDate"  />
            </div>
        </div>
    </div>



    <div class="col-md-12 ">
        <div class="form-group col-md-6">
            <label  class="col-md-4  text-right h5">预付款金额 </label>
            <div class="col-md-8  input-group">
                <input type='text'   placeholder="请输入金额..."  class="form-control" onkeyup="this.value=this.value.replace(/[^0-9.]+/,'');"   min="0" name="prepayAmt"  v-model="formArr.prepayAmt" />
            </div>
        </div>
    </div>


    <div class="col-md-12 text-center"> 
       <!--  <router-link  to =" /Collection1" class="btn btn-warning "  @click="set">保存</router-link> -->
     <button type="button" class="btn btn-default "  @click="set"  id="button">保存</button>
     <button type="button" class="btn btn-default " @click="getgo">返回</button>
 </div>
</form>
</div>
</div>

</div>

</div>
</div>
</template>
<script>
    import URL from '@/http/url.js'
    import axios from 'axios'
    export default {
        name: 'DebtAdd',
        components:{
        },
        data(){
            return {
                // url:"http://192.168.1.187:8083/usermng/debtbase/insert",
                url:URL.usermng.debtbase.insert,
                formArr:{
                billsNo:'',                     //发票号码    
               billsType:'',                   //凭证类型
               custcdSeller:'',                //客户名称
                custcdBuyer:'',             //买方名称
                prepayAmt:'',               //预付款金额
                paidAmt:'',                 //  已付款金额
                damageAmt:'',          //佣金及折让金额
                billsAmountView:'',   //应收账款金额
                beginDate:'',             //发票日期
                billsAmount:'',           //应收账款有效金额
                endDate:'' ,           //预计回款日
                product:'1230010'   //产品类型(1230010-单保理；1230040-保理池)
            }
        } 
    },
    methods : {
        set : function(){
                 this.$http.post(this.url,JSON.stringify(this.formArr), { headers:URL.headers },{
                emulateJSON:true
            }).then(function(res){
                if(res.body.retcode==200){
                alert(" 保存成功")
                this.$router.push('/poolDebtMng')
                }
            },function(res){
                alert("保存失败数据错误");
            });
        },
         getgo:function(){
        window.history.go(-1)
    }
    }

}
</script>
<style scoped>
.DebtAdd{width: 100%;overflow: hidden;}
    .textHeight{margin-top: 20px;margin-bottom: 15px; padding-bottom:15px;border-bottom: 4px solid #f0ad4e; padding-left: 0;font-weight: bold}
    .bgc{background-color: #f0ad4e; height: 4px;overflow: hidden;}
    .buttons{width: 100px;;border:none;padding: 5px 5px; box-shadow: 2px 2px 2px #999;margin-right: 15px;margin-left: 15px;}
    .buttonl{ text-align: center;padding: 5px 15px;border: none;;margin-bottom: 10px;box-shadow: 2px 2px 2px #666 ;margin-right: 15px;}
    .col-md-0 h4{padding-right: 15px}
    .pagination-info {margin: 5px 10px 5px 0}
    .pd30{padding-left: 30px;padding-right: 30px;}


</style>
