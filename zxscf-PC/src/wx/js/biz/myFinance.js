//获取openId
var scrNum=1;//第一页
var total;//总条数
var sort=01;
//默认加载数据
finListLoadData(1,10*scrNum,sort);//1第一页 10条数据 01交易日期正序
var loadFlag = true;
var oi = 0;
var mySwiper = new Swiper('.swiper-container',{
  direction: 'vertical',
  scrollbar: '.swiper-scrollbar',
  slidesPerView: 'auto',
  mousewheelControl: true,
  freeMode: true,
  onTouchMove: function(swiper){    //手动滑动中触发
    var _viewHeight = document.getElementsByClassName('swiper-wrapper')[0].offsetHeight;
    var _contentHeight = document.getElementsByClassName('swiper-slide')[0].offsetHeight;
    if(mySwiper.translate < 50 && mySwiper.translate > 0) {
      $(".init-loading").html('下拉刷新...').show();
      console.log(mySwiper.translate);
    }else if(mySwiper.translate > 50 ){
      $(".init-loading").html('释放刷新...').show();
    }
  },
  onTouchEnd: function(swiper) {
    var _viewHeight = document.getElementsByClassName('swiper-wrapper')[0].offsetHeight;
    var _contentHeight = document.getElementsByClassName('swiper-slide')[0].offsetHeight;
    // 上拉加载
    if(mySwiper.translate <= _viewHeight - _contentHeight - 50 && mySwiper.translate < 0) {
      if(loadFlag){
        $(".loadtip").html('正在加载...');
      }else{
        $(".loadtip").html('没有更多啦！');
      }
      setTimeout(function() {
        /*------------------*/
        if(Math.ceil(total/10) >= scrNum){
          scrNum++;
          finListLoadData(1,scrNum*10,sort);
        }else{
          $(".loadtip").html("没有更多啦！");
          setTimeout(function(){
            $(".loadtip").hide();
          },500);
        }
        //console.log(scrNum);
        /*---------------------------*/
        $(".loadtip").html('上拉加载更多...');
        mySwiper.update(); // 重新计算高度;
      }, 800);
    }
    // 下拉刷新
    if(mySwiper.translate >= 50) {
      $(".init-loading").html('正在刷新...').show();
      $(".loadtip").html('上拉加载更多');
      loadFlag = true;
      setTimeout(function() {
        $(".refreshtip").show(0);
        $(".init-loading").html('刷新成功！');
        setTimeout(function(){
          $(".init-loading").html('').hide();
        },800);
        $(".loadtip").show(0);
        finListLoadData(1,scrNum*10,sort);
        //刷新操作
        mySwiper.update(); // 重新计算高度;
      }, 1000);
    }else if(mySwiper.translate >= 0 && mySwiper.translate < 50){
      $(".init-loading").html('').hide();
    }
    return false;
  }
});
function finListLoadData(pageNum,pageSize,condition){
  $(window).IFSAjax({
    code:"0020_600001",
    method:"POST",
    data:{openId:openId,pageNum:pageNum,pageSize:pageSize,condition:condition},
    async:true,
    complete:function(result){
      total=result.data.lists.total;
      if(total==0){
        $(".noDataTip").show();
        $(".refreshtip").hide();
        $(".loadtip").hide();
      }else{
        $(".noDataTip").hide();
      }
      if(result.code==IFSConfig.resultCode){
        successFun(result.data);
      }else{
        pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
      }
    },
    error:function(status,XMLHttpRequest){}
  });
}
//跳转到进度详情
function progressData(li){
  var progressId=$(li).attr("data-id");
  var progressStat=$(li).attr("data-name");
  location.href='myFinanceSuccess.html?id='+progressId;
}
//排序
$(".sort").on("touchend",function(){
  sort=$(this).attr("data-sort");
  finListLoadData(1,scrNum*10,sort);
});
//成功回调
function successFun(data){
  if(IFSCommonMethod.isNotBlank(data.lists)){
    var list=data.lists.list;
    var html=[];
    var type="";
    $("#finAmount").text(IFSCommonMethod.formatMoney(data.sum));
    $("#finTotal").text(data.lists.total+'笔');
    for(var i=0;i<list.length;i++){
      if(list[i].txnStat=="03"){
        type=' class="pull-right">已取消';
      }else if (list[i].txnStat=="05"){
        type=' class="pull-right">已撤回';
      }else if(list[i].txnStat=="12"){
        type='class="pull-right ">已驳回';
      }else if(list[i].txnStat=="14"){
        type='class="pull-right">已拒绝';
      }else if(list[i].txnStat=="15"){
        type='class="pull-right">已放款';
      }
      html.push('<li  class="item" data-id="'+list[i].id+'" data-name="'+list[i].approveStat+'" onclick="progressData(this)">\
        <div class="list-data-item clearfix"><span class="pull-left">'+list[i].custMgrStfNo+'</span><span class="pull-right ">'+IFSCommonMethod.formatMoney(list[i].disctAmt)+'</span></div>\
        <div class="list-data-time clearfix"><span class="pull-left">'+IFSCommonMethod.str2Date(list[i].txnDt)+'</span><span class="pull-right ">应付利息&nbsp;&nbsp;<i class="text-red">'+IFSCommonMethod.formatMoney(list[i].rcInterest)+'</i></span></div>\
        <div class="list-data-data clearfix"><span dic-type="approveStat" class="pull-left">'+list[i].intDays+'天</span><span '+type+'</span></div>\
        </li>');
    }
    $("ul").empty().append(html.join(""));
    renderDataDic();//数据字典
  }
}
//点击排序，排序按钮变色
$(".traDate .glyphicon").on("click",function(){
  $(this).addClass('active').siblings().removeClass('active');
});
$(".moneyBe .glyphicon").on("click",function(){
  $(this).addClass('active').siblings().removeClass('active');
});