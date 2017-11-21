/*
 * @Author: chengdan 
 * @Date: 2017-08-17 14:57:40 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-08-29 15:23:32
 */
(function($w) {
    $(document).ready(function() {
        //手机号
        $("#mobileNo").on("blur", function() {
            if (IFSCommonMethod.isNotBlank($(this).val().replace(/(^\s*)|(\s*$)/g, ""))) {
                hiddenErrorClass(IFSConfig.entType);
                validMobileNo($("#mobileNo").val());
            } else {
                showErrorClass(IFSConfig.entType);
                $("#errorMsg").text("请输入手机号码");
            }
        });

        //登录新密码
        $("#pwdMsg").css("display", "none");
        $("#password").on("focus", function() {
            $("#pwdMsg").css("display", "block");
        });
        $("#password").on("blur", function() {
            $("#pwdMsg").css("display", "none");
            if (IFSCommonMethod.isNotBlank($(this).val())) {
                hiddenErrorClass(IFSConfig.entType);
                if (validPassword($("#password").val()) && IFSCommonMethod.isNotBlank($("#passwordC").val())) {
                    validEqual($("#password").val(), $("#passwordC").val());
                }
            } else {
                showErrorClass(IFSConfig.entType);
                $("#errorMsg").text("请输入登录新密码");
            }
        });

        //安全程度根据密码显示
        $("#password").on("keyup", function() {
            var val = $(this).val();
            var num = checkStrong(val);
            switch (num) {
                case 0:
                    initProgress();
                    break;
                case 1:
                    initProgress();
                    $(".safeLevelProBar").addClass("progress-bar progress-bar-danger").css('width', '30%');
                    break;
                case 2:
                    initProgress();
                    $(".safeLevelProBar").addClass("progress-bar progress-bar-warning").css('width', '60%');
                    break;
                case 3:
                    break;
                case 4:
                    initProgress();
                    $(".safeLevelProBar").addClass("progress-bar progress-bar-success").css('width', '100%');
                    break;
                default:
                    initProgress();
                    break;
            }
        });

        //确认新密码
        $("#pwdCMsg").css("display", "none");
        $("#passwordC").on("focus", function() {
            $("#pwdCMsg").css("display", "block");
        });

        $("#passwordC").on("blur", function() {
            $("#pwdCMsg").css("display", "none");
            if (IFSCommonMethod.isNotBlank($(this).val())) {
                hiddenErrorClass(IFSConfig.entType);
                if (validPassword($("#passwordC").val()) && IFSCommonMethod.isNotBlank($("#password").val())) {
                    validEqual($("#password").val(), $("#passwordC").val());
                }
            } else {
                showErrorClass(IFSConfig.entType);
                $("#errorMsg").text("请输入确认新密码");
            }
        });

        //重置图片验证码
        $(".change").on("click", function() {
            getPicCode($("#imgCode"));
        }).trigger("click");

        $("#validCode").on("blur", function() {
            if (IFSCommonMethod.isNotBlank($(this).val())) {
                hiddenErrorClass(IFSConfig.entType);
            } else {
                showErrorClass(IFSConfig.entType);
                $("#errorMsg").text("请输入图片验证码");
            }
        });

        //短信验证码
        $("#mobileValid").on("blur", function() {
            if (IFSCommonMethod.isNotBlank($(this).val())) {
                hiddenErrorClass(IFSConfig.entType);
            } else {
                showErrorClass(IFSConfig.entType);
                $("#errorMsg").text("请输入短信验证码");
            }
        });

        //发送验证码
        $("#sendValid").on("click", function() {
            //如果手机号没有输入正确，请先输入手机号
            if (!IFSCommonMethod.isNotBlank($("#mobileNo").val())) {
                showErrorClass(IFSConfig.entType);
                $("#errorMsg").text("请输入手机号码");
                $("#mobileNo").focus();
            } else if (validMobileNo($("#mobileNo").val())) {
                getSMSCode($("#sendValid"),"0010_110002",{
                    bussType:"MM03",
                    mobileNo:$("#mobileNo").val()
                });//发送短信验证码
            }
        });

        //返回
        $("#backBtn").on("click", function() {
            $w.location.href = "/";
        });

        //重置密码
        $("#resetPwdBtn").on("click", function() {
            var mobileNo = $("#mobileNo").val();
            var password = $("#password").val();
            var passwordC = $("#passwordC").val();
            var validCode = $("#validCode").val();
            var mobileValid = $("#mobileValid").val();

            var data = { 
                "usrCd": mobileNo, 
                "passWord": passwordC,
                "smsCode": mobileValid,
                "code": validCode};
            if (validInput(mobileNo, password, passwordC, validCode, mobileValid)) {
                data.passWord = hex_md5(data.passWord);
                $(window).IFSAjax({
                    code: "0010_110006",
                    method: "POST",
                    data: $.extend(data,{}),
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode){
                            pluginObj.alert("重置密码成功");
                            setTimeout(function(){
                               location.href = "/";
                            }, 1000);
                        } else {
                            getPicCode($("#imgCode"));
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    },
                    error: function(status, XMLHttpRequest) {
                            getPicCode($("#imgCode"));
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                    }
                });
            }
        });

        var validInput = function(mobileNo, password, passwordC, validCode, mobileValid) {
            if (!IFSCommonMethod.isNotBlank(mobileNo)) {
                showErrorClass(IFSConfig.entType);
                $("#errorMsg").text("请输入手机号码");
                return false;
            } else {
                if (!validMobileNo(mobileNo)) {
                    return false;
                }
            }

            if (!IFSCommonMethod.isNotBlank(password)) {
                showErrorClass(IFSConfig.entType);
                $("#errorMsg").text("请输入登录新密码");
                return false;
            } else {
                if (!validPassword(password)) {
                    return false;
                }
            }

            if (!IFSCommonMethod.isNotBlank(passwordC)) {
                showErrorClass(IFSConfig.entType);
                $("#errorMsg").text("请输入确认新密码");
                return false;
            } else {
                if (!validPassword(password)) {
                    return false;
                }
            }

            if (IFSCommonMethod.isNotBlank(password) && IFSCommonMethod.isNotBlank(passwordC)) {
                if (!validEqual(password, passwordC)) {
                    return false;
                }
            }

            if (!IFSCommonMethod.isNotBlank(validCode)) {
                showErrorClass(IFSConfig.entType);
                $("#errorMsg").text("请输入图片验证码");
                return false;
            }

            if (!IFSCommonMethod.isNotBlank(mobileValid)) {
                showErrorClass(IFSConfig.entType);
                $("#errorMsg").text("请输入短信验证码");
                return false;
            }


            return true;
        };


        //手机号码
        var validMobileNo = function(val) {
            if (!IFSRegular.regular(IFSRegularExp.phoneNum, val)) {
                showErrorClass(IFSConfig.entType);
                $("#errorMsg").text("您输入的手机号码不符合规则");
                return false;
            }
            return true;
        };

        //密码
        var validPassword = function(val) {
            if (!IFSRegular.regular(IFSRegularExp.password, val)) {
                showErrorClass(IFSConfig.entType);
                $("#errorMsg").text("您输入的密码不符合规则");
                return false;
            }
            return true;
        };

        var validEqual = function(val1, val2) {
            if (!IFSCommonMethod.isEquals(val1, val2)) {
                showErrorClass(IFSConfig.entType);
                $("#errorMsg").text("密码必须和确认密码一致");
                return false;
            }
            return true;
        };

        //检查密码强度
        var checkStrong = function(val) {
            var modes = 0;
            if (val.length == 0) return 0;
            if (val.length < 6) return 1;
            if (/\d/.test(val)) modes++; //数字
            if (/[a-z]/.test(val)) modes++; //小写
            if (/[A-Z]/.test(val)) modes++; //大写  
            if (/\W/.test(val)) modes++; //特殊字符
            if (val.length > 12) return 4;
            return modes;
        };

        //初始化进度条
        var initProgress = function() {
            $(".safeLevelProBar").removeClass("progress-bar progress-bar-danger");
            $(".safeLevelProBar").removeClass("progress-bar progress-bar-warning");
            $(".safeLevelProBar").removeClass("progress-bar progress-bar-success");
            $(".safeLevelProBar").css('width', '0%');
        };
    });
}(window));