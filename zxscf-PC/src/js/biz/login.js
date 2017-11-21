/*
 * @Author: chengdan 
 * @Date: 2017-08-16 10:58:46 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-09-13 08:56:26
 */
(function($w) {
    $(document).ready(function() {
        //input变蓝效果
        $("#userLogin input").focus(function(){
            $(this).closest(".form-group").find("i").css("color","#2fa5ff");
        }).blur(function(){
            $(this).val($(this).val().replace(/(^\s*)|(\s*$)/g, ""));
            $(this).closest(".form-group").find("i").css("color","#999999");
        });
        /**重置图片验证码*/
        $("#imgCode").on("click", function(e) {
            getPicCode($(this));
            e.preventDefault();
        }).trigger("click");
        //校验
        $("#username").blur(function(){
            if(!IFSRegular.regular(IFSRegularExp.phoneNum,$(this).val())){
                $(".usrTip").show().html("用户名由手机号组成");
            }else{
                $(".usrTip").hide();
            }
        });
        $("#username").change(function(){
            
        });
        $("#checkNum").blur(function(){
            if(!IFSRegular.regular(IFSRegularExp.viewCode,$(this).val())){
                $(".checkTip").show().html("图形验证码由大小写字母和数字组合");
            }else{
                $(".checkTip").hide();
            }
        });
        $("#pwd").blur(function(){
            if(!IFSRegular.regular(IFSRegularExp.password,$(this).val()) ||$(this).val().length<6 || $(this).val().length > 20){
                $(".pswTip").show().html("密码由6-20位数字和字母组合、符号等组成");
            }else{
                $(".pswTip").hide();
            }
        });
        $("#checkSms").blur(function(){
            if(!IFSRegular.regular(IFSRegularExp.kMsgCode,$(this).val())){
                $(".SMSTip").show().html("短信验证码由6位数字组成");
            }else{
                $(".SMSTip").hide()
            }
        });

        $("#login").on("click", function() {
            var userName = $("#username").val();
            var password = $("#pwd").val();
            var picCode = $("#checkNum").val();
            var smsCode = $("#checkSms").val();
            //测试账号原因，暂时注释掉
            if(!(IFSRegular.regular(IFSRegularExp.phoneNum,userName)
                &&IFSRegular.regular(IFSRegularExp.password,password)
                &&IFSCommonMethod.isNotBlank(picCode))){
                $("input").trigger("blur");
                return;
            }
            var data = {
                usrCd: userName,
                password: password,
                rand: picCode,
                vertityCode:smsCode
            };
            data.password = hex_md5(data.password);
            $(window).IFSAjax({
                code: "0010_120001",
                method: "POST",
                data: data,
                lock: "login",
                complete: function(result) {
                    if (result.code == IFSConfig.resultCode) {
                        window.location.href = "views/index.html?v=APP_VER";
                    } else {
                            getPicCode($("#imgCode"));
                            if(result.code == "190013"){
                                $("#login").attr("disabled","disabled").css("background","gray");
                                $(".loginCheckTip").show();
                                $(".SMSCheckTip").hide();
                                $("#SMSGroup").show();
                                return;
                            }else
                            if(result.code == "160011"){ //密码输错三次需短信验证
                                $(".SMSCheckTip").show();
                                $("#SMSGroup").show();
                                return;
                            }else
                            //验证码输错三次，锁定账号。需要重新找回密码
                            
                            {
                                pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                            }

                    }
                },
                error: function(status, XMLHttpRequest) {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                }
            });
        });
        //密码输错验证短信
        $("#sendSms").click(function(){
            var _this = $(this);
            getSMSCode(_this,"0010_110002",{
                bussType:'DL01',
                mobileNo:$("#username").val()
            })
        });
    });
 })(window);