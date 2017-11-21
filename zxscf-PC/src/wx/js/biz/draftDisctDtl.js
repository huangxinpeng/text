/* Created by Administrator on 2017/10/17.*/
//console.log(getParams());
//加载数据
//getParams()获取Url参数
  var id = getParams().id;
  //alert(id);
  wxrzloadData(id);
  function wxrzloadData(id){
    $(window).IFSAjax({
      code:"0020_600002",
      method:"POST",
      data:{id:id},
      async:true,
      complete:function(result){
        console.log(result);
        if(result.code==IFSConfig.resultCode){
          successFun(result);
          //console.log(result);
        }else{
          pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
        }
      },
      error:function(status,XMLHttpRequest){}
    });
  }
//成功回调函数
  function successFun(data){
    if(IFSCommonMethod.isNotBlank(data.data)){
      var list=data.data;
      var html=[];
      $("#financeAmount ").text(IFSCommonMethod.formatMoney(list.disctAmt));
      $("#openUnilaterally").text(list.orgNm);
      $("#vouchersNum").text(list.srcDrftNo);
      $("#financeType").text(list.finTyp);
      $("#ApplyForTime").text(IFSCommonMethod.str2Date(list.txnDt));

      $("#days").text(list.intDays);
      $("#rates").text((list.intRate*100)+"%");
      $("#discount").text((list.rateDisct*100)+"%");
      $("#goldDiscount").text(IFSCommonMethod.formatMoney(list.useBouns*100)+"%");
      $("#interestPayable").text(IFSCommonMethod.formatMoney(list.dcInterest));
      $("#realInterest").text(IFSCommonMethod.formatMoney(list.rcInterest));
      $("#amount").text(IFSCommonMethod.formatMoney(list.payAmt));
      renderDataDic();
    }
  }
