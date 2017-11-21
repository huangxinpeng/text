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
    'text!tpls/custDigitalCert.html',
    'text!tpls/footer.html'
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, custDigitalCertTpl, footer) {
    return function() {
        var $custDigitalCertTpl = $(custDigitalCertTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($custDigitalCertTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //加载企业信息
            loadE();

            //获取验证码
            $("#checkCodeGet").click(function() {
                getSMSCode($(this), "0010_110005", {
                    bussType: "AC01"
                })
            });
            //提交数字申请
            $("#apply").click(function() {
                if (!IFSRegular.regular(IFSRegularExp.kMsgCode, $("#checkCode").val())) {
                    pluginObj.alert("验证码输入不合法");
                    return;
                }
                $(window).IFSAjax({
                    code: "0010_160003",
                    method: "POST",
                    data: { smsCode: $("#checkCode").val() },
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            $("#custInfo").trigger("click");
                            getCurrentE();
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

            //返回上一页
            $("#cancel").click(function() {
                $("#custInfo").trigger("click");
            });
            //加载企业信息
            function loadE() {
                $(window).IFSAjax({
                    code: "0010_160001",
                    method: "POST",
                    data: {},
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            renderEInfo(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));;
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function renderEInfo(data) {
                $("#custCnNm").html(data.custCnNm);
                $("#idTyp").html(data.idTyp);
                $("#lglPerNm").html(data.lglPerNm);
                $("#idNo").html(data.idNo);
                $("#regAdr").html(data.regAdr);
                $("#regCity").html(data.regCity);
                $("#isAuth").html(data.isAuth);

                $("#manageName").html(data.manageName);
                $("#manageCertNo").html(data.manageCertNo);
                $("#manageMobile").html(data.manageMobile);
                renderDataDic(); //加载页面数据字典
            }


            $("#cancel").click(function() {
                $("#custInfo").trigger("click");
            });
        });
    }
});