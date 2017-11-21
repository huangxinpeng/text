/* Created by Administrator on 2017/10/15.*/
  var isCheck=true;//设置复选框状态
  $(document).ready(function(){
  //点击图形验证码时重置图片验证码
    $("#graphicVerCodePic").on("click",function(e){
      getPicCode($(this));
      e.preventDefault();
    }).trigger("click");
    //校验
    //短信验证码
    $("#getSmsVerCode").on("click",function(){
      var iphoneNum=$("#iphone").val();
      var data={mobileNo:iphoneNum,bussType:'BD01'};
      var iphoneValid=IFSRegular.regular(IFSRegularExp.phoneNum,iphoneNum);//验证手机号码
      var picCode=!IFSRegular.regular(IFSRegularExp.viewCode,$(this).val());
      if(iphoneNum=="" || iphoneValid==false){
        pluginObj.alert("提示请输入签约时的有效手机！");
      }else{
        getSMSCode($(this),"0040_600002",data);
      }
    });
    //确认操作
    $("#setBtn").on("touchend",function(){
      var mobile=$("#iphone").val();//获取手机号
      var password=$("#pwd").val();//获取登录密码
      var rand=$("#getGraphicVerCode").val();//获取图形验证码
      var smsCode=$("#smsVerCode").val();//获取短信验证码
      //if(mobile=='' || password=='' || rand=='' || smsCode==''){pluginObj.alert("请输入正确的信息");return;}
      var data={
        mobile:mobile,
        password:md5(password),
        rand:rand,
        smsCode:smsCode,
        openId:openId,
      };

      if(!IFSRegular.regular(IFSRegularExp.phoneNum,mobile) || mobile==""){
        pluginObj.alert("请输入签约时的有效手机");
        $("#graphicVerCodePic").trigger("click");
        return;
      }
      if(!IFSRegular.regular(IFSRegularExp.password,password)||password.length<6 || password.length > 20){
        pluginObj.alert("密码由6-20位数字和字母、符号等组成");
        $("#graphicVerCodePic").trigger("click");
        return;
      }
      if(!IFSCommonMethod.isNotBlank(rand)){
        pluginObj.alert("请输入正确的图形验证码");
        $("#graphicVerCodePic").trigger("click");
        return;
      }
      if(!IFSRegular.regular(IFSRegularExp.kMsgCode,smsCode) || smsCode==""){//kMsgCode: /^[0-9]{6}$/,
        pluginObj.alert("短信验证码由6位数字组成!");
        $("#graphicVerCodePic").trigger("click");
        return;
      }
      $(window).IFSAjax({
        code:"0040_600003",
        method:"POST",
        data:data,
        async:true,
        complete:function(result){
          console.log(result);
          if(result.code=="用户名不存在"){
            pluginObj.alert("用户名不存在");
          }
          else if(result.code==IFSConfig.resultCode){
            alert("签约成功");
            location.href='../../view/myFinanceList.html';
          }else{
            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
          }
        },
        error:function(status,XMLHttpRequest){}
      });
    });
    //设置复选框状态
    $("#check").on("click",function(){
      if(isCheck){
        $("#setBtn").attr("disabled",false).css("background","#1094f5");
        isCheck=false;
      }else{
        $("#setBtn").attr("disabled",true).css("background","#999");
        isCheck=true;
      }
    });
    //点击安全提示跳转到对应页面
    $("#myTips").on("touchend",function(){
      location.href="secrityTip.html";
    });
  });






