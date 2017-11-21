/**
 * Created by baikaili on 2017/8/29.
 */

define([
    'jquery',
    'json',
    'bootstrap',
    'bootstrapValidator',
    'global',
    'router',
    'routerConfig',
    'config',
    'regular',
    'ajax',
    'common',
    'constant',
    'text!tpls/custSignProt.html',
    'text!tpls/footer.html',
    'text!tpls/../protocals/enterpriseUsrP.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, custSignProtTpl, footer, enterpriseUsrP) {
    return function(obj) {
        var $custSignProtTpl = $(custSignProtTpl);
        var $footer = $(footer);
        var $protocol = $(enterpriseUsrP);
        $('.content').empty();
        $('.content').append($custSignProtTpl);
        $('.content').append($footer);
        $(".scrollbar").append($protocol);
        $(document).ready(function() {

            $("#checkCodeGet").click(function() {
                var _this = $(this);
                getSMSCode(_this, "0010_110005", {
                    bussType: 'AC02'
                })
            });
            initUserProtocalInfo(obj);

            function initUserProtocalInfo(data) {
                $("#usernamep").html($("#curE").html());
                $("#legalp").html(data.lglPerNm);
                $("#addrp").html(data.regCity + data.regAdr);
                $("#contactorp").html(data.manageName);
                $("#phonenump").html(data.manageMobile);
                $("#emailp").html(data.email);
            }
            $("#signBtn").click(function() {
                if ($("input[name=isDefault]").prop("checked") == false) {
                    pluginObj.alert("请勾选同意协议");
                    return;
                }
                if (!IFSRegular.regular(IFSRegularExp.kMsgCode, $("#checkCode").val())) {
                    pluginObj.alert("验证码输入不合法");
                    return;
                }
                $(window).IFSAjax({
                    code: '0010_160002',
                    data: { smsCode: $("#checkCode").val() },
                    method: "POST",
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            getCurrentE();
                            $("#custInfo").trigger("click");
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            });

            function getCurrentE() {
                $(window).IFSAjax({
                    code: "0010_160001",
                    method: "POST",
                    data: {},
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            renderCurrentE(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function renderCurrentE(data) {
                if (data.custCnNm.length > 20) {
                    $("#curE").html(data.custCnNm.substring(0, 20) + "...").closest(".user-name").css("height", "35px");
                } else if (data.custCnNm.length > 10) {
                    $("#curE").html(data.custCnNm.substring(0, 20) + "...").closest(".user-name").css("height", "35px");
                } else {
                    $("#curE").html(data.custCnNm);
                }
                $("#curId").html(data.custNo);
                $("#isRegister").html(data.isRegister);
                //标志位
                data.isAuth == "2" ? $("#biaozhi").css("background", "url('../../images/index/biaozhi.png') no-repeat center").parent().attr("title", "资质审核已通过") : $("#biaozhi").css("background", "url('../../images/index/biaozhi0.png') no-repeat center").parent().attr("title", "资质审核未通过");
                data.isCert == "1" ? $("#zhengshu").css("background", "url('../../images/index/zhengshu.png') no-repeat center").parent().attr("title", "数字证书已认证") : $("#zhengshu").css("background", "url('../../images/index/zhengshu0.png') no-repeat center").parent().attr("title", "数字证书未认证");
                data.isRegister == "1" ? $("#qianyue").css("background", "url('../../images/index/qianyueshenqing.png') no-repeat center").parent().attr("title", "用户协议已签约") : $("#qianyue").css("background", "url('../../images/index/qianyueshenqing0.png') no-repeat center").parent().attr("title", "用户协议未签约");
                myTask(); //待办任务初始化,根据企业是否签约显示  
            }


            $("#goBack").click(function() {
                $("#custInfo").trigger("click");
            });
        });
    }
});