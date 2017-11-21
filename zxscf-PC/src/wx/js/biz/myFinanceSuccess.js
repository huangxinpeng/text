/* Created by Administrator on 2017/10/23.*/
  //var id=null;
  var id=getParams().id;
  //var openId='008';
  //alert(id);
//融资成功
  finSuccLoad(id);
  function finSuccLoad(id){
    $(window).IFSAjax({
      code:"0020_600002",
      method:"POST",
      data:{id:id},
      async:true,
      complete:function(result){
        if(result.code==IFSConfig.resultCode){
          successFun(result);
        }else{
          pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
        }
      },
      error:function(status,XMLHttpRequest){}
    });
  }
  //成功回调函数
  function successFun(data){
    if(IFSCommonMethod.isNotBlank(data)){
      var list=data.data;
      var progressArr=data.data.appList;
      var html=[];
      $("#financeAmount").html(IFSCommonMethod.formatMoney(list.payAmt));
      $("#openUnilaterally").html(list.orgNm);
      $("#vouchersNum").html(list.srcDrftNo);
      $("#financeType").html(list.finTyp);
      $("#ApplyForTime").html(IFSCommonMethod.str2Date(list.txnDt));
      $("#states").html(list.txnStat);
      //进度

      //详情
      $("#days").html(list.intDays);
      $("#rates").html((list.intRate)*100+"%");
      $("#discount").html((list.rateDisct)*100+"%");
      $("#goldDiscount").html(IFSCommonMethod.formatMoney((list.useBouns)*100+"%"));
      $("#interestPayable").html(IFSCommonMethod.formatMoney(list.dcInterest));
      $("#realInterest").html(IFSCommonMethod.formatMoney(list.rcInterest));
      $("#amount").html(IFSCommonMethod.formatMoney(list.payAmt));
      //渲染进度条
      for(var i=0;i<progressArr.length;i++){
        $(".img"+i).attr("src","../img/ico-02.png");
        var strDate=IFSCommonMethod.str2Date(progressArr[i].acptTs);
        var datas=strDate.substring(0,10);
        var time=strDate.substring(10,20);
        $(".FinanceData"+(i+1)).html(datas);
        $(".FinanceTime"+(i+1)).html(time);
      }
      renderDataDic();
    }
  }
