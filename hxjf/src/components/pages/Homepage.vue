  <!-- 用户操作 页面-->
  <template>
    <div class="Homepage " >
      <div class="useroperation-bg rows">
        <div class="containers " >
          <div class="row opeation-bg">
           <div class="col-md-12 padding30">
            <div class="col-md-4  ">
              <div class="col-md-5 " >
                <img src="../../img/user-0.png"  width="100" alt="" class="img-circle" />
              </div>
              <div class="col-md-7">
                <h4>{{user.costName}}</h4>
                <h4>管理员:{{user.userId}}</h4>
                <h5 class="data">{{user.createDate}}</h5>
              </div>
            </div>
            <div class="col-md-4   ">
              <h4>安全认证</h4>
              <div class="imgs">
                <a href="javascript:void(0)">
                  <img
                    :src="sessionData.tel ? require('../../img/user-1.png') : require('../../img/user-1-gray.png')"
                    height="25"
                    width="31"
                    alt=""
                  />
                </a> 
                <a href="javascript:void(0)">
                  <img
                    :src="sessionData.creditCard ? require('../../img/user-2.png') : require('../../img/user-2-gray.png')"
                    height="25"
                    width="31"
                    alt=""
                  />
                </a>  
                <a href="javascript:void(0)">
                  <img
                    :src="sessionData.email ? require('../../img/user-3.png') : require('../../img/user-3-gray.png')"
                    height="25"
                    width="31"
                    alt=""
                  />
                </a> 
              </div>
              <div class="row"  style="height:24px;margin-top:5px;">
                <div class="col-md-4 "  >
                 <span class="h4">账户安全</span> 
               </div>
               <div class="col-md-8 "  >
                <div class="col-md-5 ">
                  <div class="progress  "   >
                    <div class="progress-bar progress-bar-warning h15" role="progressbar"
                    :aria-valuenow="sessionData.progressBar || 0" aria-valuemin="0" aria-valuemax="100"
                    :style="{width: `${sessionData.progressBar || 100}%`}">
                    <span
                      style="color: #333;"
                      >{{ sessionData.progressBar ? `${sessionData.progressBar}%` : '计算中' }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-md-7">
               <p>
                 <mark class="label label-warning"
                  style="color: #333;">{{ safeLevel }}
                 </mark>&nbsp;<a href="#" style="">提升</a>
               </p>
             </div>
           </div>
         </div>
       </div>
       <div class="col-md-4 pdlr">
        <div class="col-md-12">
          <div class="box" style="height: 100px;">
            <div class="col-md-3 text-right">
              <span class="label label-info">公告</span>
            </div>
            <div class="col-md-9">
              <div class="myscroll">
                <ul>
                  <li>习近平同普京向北理莫斯科大学典礼致辞</li>
                  <li>李克强听取国务院第四次大督查情况等汇报</li>
                  <li>童趣卡通圣诞老人矢量素材(EPS)</li>
                  <li>印媒：中国军人仍在洞朗巡逻 在山脊修掩体</li>
                  <li>印媒称印度军队也未远离洞朗地区 引发两国再次对峙的担忧</li>
                  <li>乐天：仅出售在华超市 其他业务不退出中国</li>
                  <li>韩媒:乐天玛特出售由高盛负责 有中企欲收购</li>
                  <li>目前全国年产能超过100亿立方米 页岩气勘探技术国际领先</li>
                  <li>中央将精确打击公务员这80类行为 千万别踩红线</li>
                  <li>落马“大老虎”忏悔录：写什么怎么写都有“规矩”</li>
                  <li>用FlexSlider制作支付宝2013版幻灯片</li>
                  <li>美称中国正打造4款太空战武器系统 能摧毁500颗卫星</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
<div class="row rows">
 <div class="row rows ">
  <div class="col-md-12 pd0 ">
    <h4 class="border-b">业务处理</h4>
  </div>
  <div class="col-md-4">
   <div class="panel panel-default">
    <div class="panel-heading">
     <h4 class=" text-center">用户/基础/查询统计</h4>  
   </div>
   <div class="col-md-12 pd0 bborder">
     <div class="panel-body text-center col-md-3  pb15" @click="getPush('/enterpriseInfo')">
      <div class="col-md-12  bg-primary mg15">
        <h5>
          企业信息管理
        </h5>
      </div>
    </div>

    <div class="panel-body text-center col-md-3  pb15" @click="getPush('/countMng')" >
      <div class="col-md-12  bg-primary mg15">
        <h5>
          企业操作用户管理
        </h5>
      </div>
    </div>

    <div class="panel-body text-center col-md-3  pb15"  @click="getPush('/userMng')" >
      <div class="col-md-12 bg-primary mg15">
        <h5>企业账户管理
       </h5>
     </div>
   </div>

   <div class="panel-body text-center col-md-3  pb15" @click="getPush('/generalQry')" >
    <div class="col-md-12  bg-primary mg15">
      <h5>综合查询
      </h5>
    </div>
  </div>

  <h5 class="text-right rows" >&nbsp;</h5>

</div>

</div>      
</div>


<div class="col-md-4">
 <div class="panel panel-default">
  <div class="panel-heading">
   <h4 class=" text-center">定保理业务管理</h4>  
 </div>
 <div class="col-md-12 pd0 bborder">
   <div class="panel-body text-center col-md-3  pb15" @click="getPush('/poolDebtMng')"  >
    <div class="col-md-12  bg-primary mg15">
     <h5>应收账款录入
     </h5>        
   </div>
 </div>

 <div class="panel-body text-center col-md-3  pb15"  @click="getPush('/debtAssignment')" >
  <div class="col-md-12 bg-primary mg15">
    <h5>应收账款转让申请
    </h5>
  </div>
</div>

<div class="panel-body text-center col-md-3  pb15" @click="getPush('/contDownload')" >
  <div class="col-md-12  bg-primary mg15">
    <h5>
        保理合同
    </h5>
  </div>
</div>

<div class="panel-body text-center col-md-3  pb15"   @click="getPush('/debloanApply')">
  <div class="col-md-12 bg-primary mg15">
    <h5>
        融资申请
    </h5>
  </div>
</div>
<div class="col-md-12">
  <p  class="text-right rows cousor" @click="getPush('/Opinstructions')"  >&gt;&gt;线上业务办理指引</p>    
</div>
</div>

</div>      
</div>

<div class="col-md-4">
 <div class=" panel panel-default">
  <div class="panel-heading">
   <h4 class=" text-center">池保理业务管理</h4>  
 </div>
 <div class="col-md-12 pd0 bborder">
   <div class="panel-body text-center col-md-3  pb15"  @click="getPush('/PoolContMng')">
    <div class="col-md-12  bg-primary mg15">
     <h5>池保理合同
     </h5>        
   </div>
 </div>

 <div class="panel-body text-center col-md-3  pb15" @click="getPush('/receivableMng')" >
  <div class="col-md-12 bg-primary mg15">
    <h5>
        应收账款管理
    </h5>
  </div>
</div>

<div class="panel-body text-center col-md-3  pb15" @click="getPush('/PoolAssignment')" >
  <div class="col-md-12  bg-primary mg15">
    <h5>
      应收账款转让申请
    </h5>
  </div>
</div>

<div class="panel-body text-center col-md-3  pb15"  @click="getPush('/LoanApplyMng')" >
  <div class="col-md-12 bg-primary mg15">
    <h5>
 融资申请
    </h5>
  </div>
</div>
<p  class="text-right rows cousor" @click="getPush('/Opinstructions')" >&gt;&gt;线上业务办理指引</p>    
</div>

</div>      
</div>
</div>
<div class="row rows">
  <div class="col-md-12 pd0 ">
    <h4 class="border-b rows">业务统计</h4>
    <div class="col-md-12 pd0">
      <div class="col-md-5">
        <div class="panel panel-default">
          <div class="panel-heading">
           <h4 class="text-muted  ">2017年应收账款业务概括</h4>  
         </div>
         <div class="panel-body text-center">
          面板内容
        </div>
      </div>
    </div>
    <div class="col-md-7">
      <div class="panel panel-default">
        <div class="panel-heading">
         <h4 class="text-muted">2017年应收账款融资趋势</h4>  
       </div>
       <div class="panel-body text-center">
        面板内容
      </div>
    </div>              
  </div>
</div>
</div>
</div>
</div>
</div>
</template>
<script>
export default {
  name: 'Homepage',
  computed: {
    sessionData () { return JSON.parse(sessionStorage.getItem('sessionData')) },
    // ------------------------------------------------------------------------------
    safeLevel () {
      const level = this.sessionData.progressBar
      if (level > 90) return '高'
      else if (level > 60) return '中'
      else if (level > 30) return '低'
      else if (level > 0) return '差'
      else return '...'
    }
  },
  data(){
      return{
        user:{
          userId:JSON.parse(sessionStorage.getItem('sessionData')).userId,//管理员
          costName:JSON.parse(sessionStorage.getItem('sessionData')).costName,//企业名称
          createDate:JSON.parse(sessionStorage.getItem('sessionData')).createDate,//登录时间
        }
      }
  },
  created () {
    // window.location.reload()
  },
  methods:{
    getPush:function(url){
      this.$router.push(url)
    }
  },

  mounted(){
    $(function(){
    // window.location.reload()

      $('.myscroll').myScroll({
        speed: 40, //数值越大，速度越慢
        rowHeight: 20 //li的高度
      });
    })
  }
}
</script>

<style scoped>
.Homepage{width: 100%;overflow: hidden;}
.rows{padding-left: 20px;padding-right: 20px;}
.pd0{padding:  0}
.pdlr{padding-left: 20px;padding-right: 20px;}
.useroperation-bg{background-color: #358EEA;padding: 30px;}
.padding30{padding: 30px;background-color: #ffffff;border-radius:4px;}
.box{color:#76A6CF;}
.border-b{border-bottom: 1px solid #999;padding: 12px 0}
.mg15{margin-top: 15px;margin-bottom: 15px;padding-top: 15px; padding-bottom: 15px; height: 110px;}
.bborder{border:1px solid #ccc; border-radius: 0 0 5px 5px;}
.bborder .pb15{cursor:pointer;}
h5.data{color: #000}
.col-md-2-5{width: 20%;padding-left: 4px;  padding-right: 4px;}  
h5{color: #ffffff}
a,router-link{color:#fff;}
a,router-link:hover{text-decoration: none;}
.cousor{cursor: pointer}
.cousor:hover{text-decoration: underline;}
</style>
