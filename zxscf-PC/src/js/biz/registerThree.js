/*
 * @Author: chengdan 
 * @Date: 2017-08-23 09:06:26 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-10-12 16:06:32
 */
(function($w) {
    $(document).ready(function() {
        var newUser = false;
        //url赋值
        var URLPara = getParams();
        initSelData();

        function initSelData() {
            $("#threeToTwoBtn").click(function(){
                window.location.href = "../../views/register/register-secondStep.html?"+encodeURI(encodeURI("v=APP_VER&legalIdTyp="+URLPara.legalIdTyp+"idTyp="+URLPara.idTyp+"&prov="+URLPara.prov+"&city="+URLPara.city+"&addr="+URLPara.adr+"&idNo="+URLPara.idNo+"&custCnNm="+URLPara.custCnNm));
            });
        }
        //用户协议
        $("#custSignProt").on("click", function() {
            $("#transferFir").modal("show");
            $("#protocolContent").attr("src", "../../views/protocals/rgstrUsrP.html");
        });

        $("#protocolContent").load(function() {
            $(this).contents().find("#usernamep").html(URLPara.custCnNm);
            $(this).contents().find("#legalp").html(URLPara.legal);
            $(this).contents().find("#addrp").html(URLPara.addr);
            $(this).contents().find("#contactorp").html($("#adminName").val());
            $(this).contents().find("#phonenump").html($("[name=mobileNo]").val());
            $(this).contents().find("#emailp").html($("[name=email]").val());
        });
        //生成委托书
        $("#authPDFBtn").click(function(){
            var tnCode = "1"; // 1-文件预览，2-文件下载
            var bussType = "0"; // 业务类型
            var username = getParams().legal; // 法人姓名
            var idType = getParams().legalIdTyp; // 法人证件类型
            var cardNo = getParams().legalIdNo; // 法人证件号码
            var mobile = getParams().legalMobile; // 法人电话号码
            var rUsername = $("#adminName").val(); // 被授权人姓名
            var rCardNo = $("#adminIdCard").val(); // 被授权人证件号码
            var rMobile = $("[name=mobileNo]").val(); // 被授权人电话号码
            var rAddress = $("[name=rAddress]").val(); // 被授权人地址

            $("#authPDF").modal("show");
            var link = "/esif-webapp/certificates/authLetterDownload?"+encodeURI(encodeURI("username="+username+"&idType="+idType+"&bussType="+bussType+"&tnCode="+tnCode+"&cardNo="+cardNo+"&rUsername="+rUsername+"&rCardNo="+rCardNo+"&rMobile="+rMobile+"&mobile="+mobile+"&rAddress="+rAddress));
            $("#authPDF iframe").attr("src",link);
        });

        $(".newneed").css("display", "block");

        //管理员姓名
        $("#adminNameMsg").css("display", "none");
        $("#adminNameErrMsg").css("display", "none");
        $("#adminName").on("focus", function() {
            $("#adminNameErrMsg").css("display", "none");
            $("#adminNameMsg").css("display", "block");
        });
        $("#adminName").on("blur", function() {
            $("#adminNameMsg").css("display", "none");
            if (IFSCommonMethod.isNotBlank($(this).val())) {
                $("#adminNameMsg").css("display", "none");
                $("#adminNameErrMsg").css("display", "none");
                if (validAdminName($("#adminName").val()) && IFSCommonMethod.isNotBlank($("#adminIdCard").val())) {
                    //请求后台是否存在该用户
                    changeShow($("#adminName").val(), $("#adminIdCard").val());
                }
            } else {
                $("#adminNameMsg").css("display", "none");
                $("#adminNameErrMsg").css("display", "block");
                $("#adminNameErr").text("请输入管理员姓名");
            }
        });

        //电子邮箱
        $("#emailErrMsg").css("display", "none");
        $("#email").on("blur", function() {
            if (IFSCommonMethod.isNotBlank($(this).val())) {
                $("#emailErrMsg").css("display", "none");
                validEmail($("#email").val())
            } else {
                $("#emailErrMsg").css("display", "block");
                $("#emailErr").text("请输入电子邮箱");
            }
        }).change(function(){
            $("[name=email]").val($(this).val());
        });

        //管理员身份证
        $("#adminIdCardErrMsg").css("display", "none");
        $("#adminIdCard").on("blur", function() {
            if (IFSCommonMethod.isNotBlank($(this).val())) {
                $("#adminIdCardErrMsg").css("display", "none");
                validAdminIdCard($("#adminIdCard").val())
                if (validAdminIdCard($("#adminIdCard").val()) && IFSCommonMethod.isNotBlank($("#adminName").val())) {
                    //请求后台是否存在该用户
                    //请求后台是否存在该用户
                    changeShow($("#adminName").val(), $("#adminIdCard").val());
                }
            } else {
                $("#adminIdCardErrMsg").css("display", "block");
                $("#adminIdCardErr").text("请输入管理员身份证号");
            }
        });
        //详细地址
        $("#addressMsg").css("display", "none");
        $("#addressErrMsg").css("display", "none");
        $("#address").on("focus", function() {
            $("#addressErrMsg").css("display", "none");
            $("#addressMsg").css("display", "block");
        });

        $("#address").on("blur", function() {
            $("#addressMsg").css("display", "none");
            if (IFSCommonMethod.isNotBlank($(this).val())) {
                $("#addressMsg").css("display", "none");
                $("#addressErrMsg").css("display", "none");
                validAddress($("#address").val());

            } else {
                $("#addressMsg").css("display", "none");
                $("#addressErrMsg").css("display", "block");
                $("#addressErr").text("请输入详细地址");
            }
        }).change(function(){
            $("[name=rAddress]").val($(this).val());
        });
        //文件上传
        $("#frontImg").click(function() {
            $("#frontUpload").trigger("click");
        });
        $("#backImg").click(function() {
            $("#backUpload").trigger("click");
        });
        $("#Img").click(function() {
            $("#poa").trigger("click");
        });

         //文件校验
       
        var fileFlag =[false,false,false];
        $("#frontUpload").on('change',function(){
            uploadPreview(this,'frontImg','135','90');
            fileFlag[0] =  checkImgFile($("#frontUpload"),$("#fileErrMsg"),"证件正面");
        });
       
        $("#backUpload").on('change',function(){
            uploadPreview(this,'backImg','135','90');
            fileFlag[1] =  checkImgFile($("#backUpload"),$("#fileErrMsg2"),"证件反面");
        });
       
        $("#poa").on('change',function(){
            uploadPreview(this,'Img','135','90');
            fileFlag[2] =  checkImgFile($("#poa"),$("#fileErrMsg4"),"授权书");
        });
        //手机号码
        $("#phoneNumErrMsg").css("display", "none");
        $("#phoneNum").on("blur", function() {
            if ($(this).prop("disabled") == true) {
                $("#phoneNumErrMsg").css("display", "none");
                return;
            }
            if (IFSCommonMethod.isNotBlank($(this).val())) {
                $("#phoneNumErrMsg").css("display", "none");
                validPhoneNum($("#phoneNum").val())
            } else {
                $("#phoneNumErrMsg").css("display", "block");
                $("#phoneNumErr").text("请输入手机号码");
            }
        });

        //发送验证码
        $("#sendValid").on("click", function() {
            //如果手机号没有输入正确，请先输入手机号
            if (!IFSCommonMethod.isNotBlank($("#hiddenNum").val())) {
                $("#phoneNumErrMsg").css("display", "block");
                $("#phoneNumErr").text("请输入手机号码");
                $("#phoneNum").focus();
            } else if (!validPhoneNum($("#hiddenNum").val())) {
                $("#phoneNum").focus();
            } else {
                $(".reload").css("-webkit-animation-name", "rotateThis");
                setTimeout("$('.reload').css('-webkit-animation-name','')", 1000);
                // $(".messageTip").show();
                // $(".messageTip").animate({
                //     opacity: "hide"
                // }, 2000);            
            }
        });

        //验证码
        $("#validNoErrMsg").css("display", "none");
        $("#validNo").on("blur", function() {
            if (IFSRegular.regular(IFSRegularExp.checkCode, $(this).val())) {
                $("#validNoErrMsg").css("display", "none");
            } else if (!IFSCommonMethod.isNotBlank($(this).val())) {
                $("#validNoErrMsg").css("display", "block");
                $("#validNoErr").text("请输入验证码");
            } else {
                $("#validNoErrMsg").css("display", "block");
                $("#validNoErr").text("验证码格式不对");
            }
        });
        $("#sendValid").click(function() {
            var telNo = $("#hiddenNum").val();
            if (!IFSCommonMethod.isNotBlank(telNo) || !IFSRegular.regular(IFSRegularExp.phone, telNo)) { return; }
            var _this = $(this);
            getSMSCode(_this, "0010_110002", {
                bussType: 'ZC01',
                mobileNo: telNo
            })
        });

        //密码
        $("#pwdMsg").css("display", "none");
        $("#pwdErrMsg").css("display", "none");
        $("#pwd").on("focus", function() {
            $("#pwdErrMsg").css("display", "none");
            $("#pwdMsg").css("display", "block");
        });
        $("#pwd").on("blur", function() {
            $("#pwdMsg").css("display", "none");
            $("#pwdCErrMsg").css("display", "none");
            if (IFSCommonMethod.isNotBlank($(this).val())) {
                $("#pwdMsg").css("display", "none");
                $("#pwdErrMsg").css("display", "none");
                if (!validPwd($("#pwd").val())) {
                    $("#pwdErrMsg").css("display", "block");
                    $("#pwdErr").text("您输入的密码不符合规则");
                } else if (IFSCommonMethod.isNotBlank($("#pwdC").val()) && !validEqual($("#pwd").val(), $("#pwdC").val())) {
                    $("#pwdCErrMsg").css("display", "block");
                    $("#pwdCErr").text("密码必须和确认密码一致");
                }
            } else {
                $("#pwdMsg").css("display", "none");
                $("#pwdErrMsg").css("display", "block");
                $("#pwdErr").text("请输入密码");
            }
        });

        //确认密码
        $("#pwdCMsg").css("display", "none");
        $("#pwdCErrMsg").css("display", "none");
        $("#pwdC").on("focus", function() {
            $("#pwdCErrMsg").css("display", "none");
            $("#pwdCMsg").css("display", "block");
        });
        $("#pwdC").on("blur", function() {
            $("#pwdCMsg").css("display", "none");
            if (IFSCommonMethod.isNotBlank($(this).val())) {
                $("#pwdCMsg").css("display", "none");
                $("#pwdCErrMsg").css("display", "none");
                if (!validPwd($("#pwdC").val())) {
                    $("#pwdCErrMsg").css("display", "block");
                    $("#pwdCErr").text("您输入的确认密码不符合规则");
                } else if (IFSCommonMethod.isNotBlank($("#pwd").val()) && !validEqual($("#pwd").val(), $("#pwdC").val())) {
                    $("#pwdCErrMsg").css("display", "block");
                    $("#pwdCErr").text("密码必须和确认密码一致");
                }
            } else {
                $("#pwdCMsg").css("display", "none");
                $("#pwdCErrMsg").css("display", "block");
                $("#pwdCErr").text("请输入确认密码");
            }
        });
        //详细地址
        var validAddress = function(val) {
            if (!IFSRegular.regular(IFSRegularExp.rgAdr, val)) {
                $("#addressMsg").css("display", "none");
                $("#addressErrMsg").css("display", "block");
                $("#addressErr").text("只能由中文,字母,数字或-组成，1-200位！");
                return false;
            }
            return true;
        };
        //radio按钮选择
        $("#threeToFourBtn").attr("disabled", "disabled");
        $("#read").click(function() {
            if ($(this).siblings("div").children("span").hasClass("active")) {
                $(this).siblings("div").children("span").removeClass("active");
                $("#threeToFourBtn").attr("disabled", "disabled");
            } else {
                $(this).siblings("div").children("span").addClass("active");
                $("#threeToFourBtn").removeAttr("disabled");
            }
        });

        //页面btn提交
        $("#threeToFourBtn").on("click", function() {
            var obj = $("#adminConfirmInfo").serializeArray();
            var obj1 = $("#adminConfirmInfo").getData();
            obj1.passwd = $("#pwd").val();
            obj1.confirmPasswd = $("#pwdC").val();
            //证件类型默认为身份证,添加类型时，去掉默认数据
 			obj = obj.concat([{ name: "agree", value: "Y" }, { name: "userIdTyp", value: "0" },{ name: "isRepeat", value: !newUser?"Y":"N" }]);
            obj = obj.concat([{name:'idTyp',value:getParams().idTyp},{name:'idNo',value:getParams().idNo}])

            var fileInfo = [{ "name": "attachDivFront", "id": "frontUpload" },
                { "name": "attachDivBack", "id": "backUpload" },
                { "name": "attachDivPoa", "id": "poa" }
            ];
            if (isSubmit(obj1) && fileFlag[0] && fileFlag[1]) {
                var psw  = hex_md5($("#pwd").val());
                var pswC = hex_md5($("#pwdC").val()); 
                obj = obj.concat([{ name: "passwd", value: psw }, { name: "confirmPasswd", value: pswC }]);
                fileUpload('0010_130003', fileInfo, obj, successFun);
            } else if (!fileFlag[0] || !fileFlag[1]) {
                showErrorClass(IFSConfig.entType);
                $("#errorMsg").text("文件上传不全或有误，请确认后再提交");
            }
        });

        var successFun = function() {
            $w.location.href = "register-fourStep.html?v=APP_VER";
        };


        $("#twoToThreeBtn").on("blur", function() {
            hiddenErrorClass(IFSConfig.entType);
        });


        var isSubmit = function(data) {
            var flag = false;
            var isInputNull = false; //输入框是否为空
            var isErrNull = true; //错误提示是否为空
            var adminName = data["usrNm"];
            var email = data["email"];
            var adminIdCard = data["userIdNo"];
            var phoneNum = data["mobileNo"];
            var validNo = data["vertityCode"];
            var pwd = data["passwd"];
            var pwdC = data["confirmPasswd"];
            if (newUser) {
                if (IFSCommonMethod.isNotBlank(adminName) && IFSCommonMethod.isNotBlank(email) && IFSCommonMethod.isNotBlank(adminIdCard) &&
                    IFSCommonMethod.isNotBlank(phoneNum) && IFSCommonMethod.isNotBlank(validNo) && IFSCommonMethod.isNotBlank(pwd) &&
                    IFSCommonMethod.isNotBlank(pwdC)) {
                    isInputNull = true;
                }
            } else {
                if (IFSCommonMethod.isNotBlank(adminName) && IFSCommonMethod.isNotBlank(adminIdCard) && IFSCommonMethod.isNotBlank(phoneNum) && IFSCommonMethod.isNotBlank(validNo)) {
                    isInputNull = true;
                }
            }

            $(".ruleErr").each(function() {
                var tempFlag = false;
                if ($(this).css("display") == "none") {
                    tempFlag = true;
                }
                isErrNull = isErrNull && tempFlag;
            });
            flag = isInputNull && isErrNull;
            if (!flag) {
                showErrorClass(IFSConfig.entType);
                $("#errorMsg").text("管理员信息填写不全或有误，请确认后再提交");
            }
            return flag;
        }

        //管理员姓名
        var validAdminName = function(val) {
            if (!IFSRegular.regular(IFSRegularExp.lealPerson, val)) {
                $("#adminNameMsg").css("display", "none");
                $("#adminNameErrMsg").css("display", "block");
                $("#adminNameErr").text("您输入的管理员姓名不符合规则");
                return false;
            }
            return true;
        }

        //电子邮箱
        var validEmail = function(val) {
            if (!IFSRegular.regular(IFSRegularExp.email, val)) {
                $("#emailErrMsg").css("display", "block");
                $("#emailErr").text("您输入的电子邮箱不符合规则");
                return false;
            }
            return true;
        }

        //管理员身份证号
        var validAdminIdCard = function(val) {
            if (!IFSRegular.regular(IFSRegularExp.idCard, val)) {
                $("#adminIdCardErrMsg").css("display", "block");
                $("#adminIdCardErr").text("您输入的身份证号不符合规则");
                return false;
            }
            return true;
        }

        //手机号码
        var validPhoneNum = function(val) {
            if (!IFSRegular.regular(IFSRegularExp.phoneNum, val)) {
                $("#phoneNumErrMsg").css("display", "block");
                $("#phoneNumErr").text("您输入的手机号码不符合规则");
                return false;
            }
            return true;
        }

        //密码
        var validPwd = function(val) {
            if (!IFSRegular.regular(IFSRegularExp.password, val)) {
                return false;
            }
            return true;
        };

        var validPwdC = function(val) {
            if (!IFSRegular.regular(IFSRegularExp.password, val)) {
                return false;
            }
            return true;
        };

        var validEqual = function(val1, val2) {
            if (!IFSCommonMethod.isEquals(val1, val2)) {
                return false;
            }
            return true;
        };

        function changeShow(name, idNo) {
            $(window).IFSAjax({
                code: "0010_130004",
                method: "POST",
                data: { "name": name, "idNo": idNo },
                complete: function(result) {
                    if (result.code == IFSConfig.resultCode) {
                        var mobileNo = result.data.mobileNo;
                        if (!IFSCommonMethod.isNotBlank(mobileNo)) {
                            newUser = true;
                            $(".newneed").css("display", "block").find("input").removeAttr("disabled");
                            $("#phoneNum").removeAttr("disabled");
                            $("#phoneNum").val("");
                        } else {
                            newUser = false;
                            $(".newneed").css("display", "none").find("input").attr("disabled", "disabled");
                            $("#phoneNum").attr("disabled", "disabled");
                            $("#phoneNum").val(mobileNo.substring(0, 3) + "****" + mobileNo.substring(8));
                            $("#hiddenNum").val(mobileNo);
                            $("[name=email]").val(result.data.eMail);
                            $("[name=rAddress]").val(result.data.address);
                        }
                    } else {
                        pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                    }
                },
                error: function(status, XMLHttpRequest) {
                    pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                }
            });
        }
        $("#phoneNum").blur(function(){
            if($(this).prop("disabled") != "disabled"){
                $("#hiddenNum").val($(this).val());
            }
        }).change(function(){
            resetSMSBtn($("#sendValid"));
        });
    });
}(window));