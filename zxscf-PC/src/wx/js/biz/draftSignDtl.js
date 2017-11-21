//签收详情
var id=getParams().id;
//alert(id);
signforDetails(id);
function signforDetails(id){
  $(window).IFSAjax({
    code:"0010_600002",
    method:"POST",
    data:{id:id},
    async:true,
    complete:function(result){
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
//成功回调
function successFun(data){
  if(IFSCommonMethod.isNotBlank(data)){
    var list=data.data;
    console.log(list);
    var html=[];
    $("#rollOut").html(list.reqCustNm);
    $("#transferAmount").html(IFSCommonMethod.formatMoney(list.txnAmt));
    $("#maturityDate").html(IFSCommonMethod.str2Date(list.srcDueDt));
    $("#dueDates").html(list.delayDays);
    $("#openUnilaterally").html(list.drwrNm);
    $("#rollOutDate").html(IFSCommonMethod.str2Date(list.txnDt));
    $("#vouchersNum").html(list.srcDrftNo);
    renderDataDic();
  }
}