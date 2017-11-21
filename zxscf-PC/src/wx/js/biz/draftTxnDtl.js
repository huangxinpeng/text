/* Created by Administrator on 2017/10/17.*/
//加载数据
//getParams()获取Url参数
  var id = getParams().id;
 //alert(id);
  wxzrloadData(id);
  function wxzrloadData(id){
    $(window).IFSAjax({
      code:"0030_600002",
      method:"POST",
      data:{id:id},
      async:true,
      complete:function(result){
        //console.log(result);
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
    if(IFSCommonMethod.isNotBlank(data.data)){
      var list=data.data;
      //console.log(list);
      var html=[];
      $("#vouchersNum").text(list.srcDrftNo);
      $("#applyForTime").text(IFSCommonMethod.str2Date(list.txnDt));
      $("#transferee").text(list.rcvCustNm);
      $("#agent").text(list.appUsrNm);
      $("#openUnilaterally").text(list.drwrNm);//开立方没找到字段
      $("#dueDates").text(list.dueDays);
      $("#transferAmount").text(IFSCommonMethod.formatMoney(list.txnAmt));//转让金额
      renderDataDic();
    }
  }

