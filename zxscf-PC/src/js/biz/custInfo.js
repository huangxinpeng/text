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
    './custDigitalCert',
    './custSignProt',
    'text!tpls/custInfo.html',
    'text!tpls/footer.html'
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, custDigitalCert, custSignProt, custInfoTpl, footer) {
    return function() {
        var $custInfoTpl = $(custInfoTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($custInfoTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            loadData(); //加载默认数据
            var obj = {};
            $("#custDigitalCert").click(function() {
                custDigitalCert();
            });
            //签用户协议
            $("#custSignProt").click(function() {
                custSignProt(obj);
            });
            //加载默认数据
            function loadData() {
                $(window).IFSAjax({
                    code: "0010_160001",
                    method: "POST",
                    data: {},
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            renderEInfo(result.data);
                            renderDataDic(); //加载页面数据字典
                            obj = result.data;
                        } else if (result.code == "170011") {} else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));;
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function renderEInfo(data) {
                $("#custCnNm").html(data.custCnNm).attr("data-custNo", data.custNo);
                $("#idTyp").html(data.idTyp);
                $("#lglPerNm").html(data.lglPerNm);
                $("#idNo").html(data.idNo);
                $("#regAdr").html(data.regAdr);
                $("#regCity").html(data.regCity);
                $("#isAuth").html(data.isAuth);
                //current/viewAttach?id=
                for (var i = 0; i < data.attachDivList.length; i++) {
                    if (data.attachDivList[i].attachDiv == "QY01") {
                        $("#pospic").attr("src", IFSRouterContext.routerContext + '/current/viewAttach?id=' + data.attachDivList[i].id);
                    } else if (data.attachDivList[i].attachDiv == "QY02") {
                        $("#negpic").attr("src", IFSRouterContext.routerContext + '/current/viewAttach?id=' + data.attachDivList[i].id);
                    }
                }

                if (data.isDefault == "1") {
                    $("[name=defRecNo][value='1']").prop("checked", true);
                } else {
                    $("[name=defRecNo][value='0']").prop("checked", true);
                }
                if (data.isCert == "1") {
                    $("#isCert").html("已申请").removeClass("gray").addClass("blue")
                        .siblings("a").hide();
                }
                if (data.isRegister == "1") {
                    $("#isRegisterCust").html("已申请").removeClass("gray").addClass("blue")
                        .siblings("a").hide();
                }
            }
            //设置当前企业为默认企业
            $(".definedRadio").click(function(e) {
                e.preventDefault();
                if ($(this).find("input").prop("checked") == true) {
                    pluginObj.confirm("设置企业为默认企业", "要设置该企业为默认企业？", function() {
                        setDefEnterPrise();
                    }, function() {});
                }

            });

            function setDefEnterPrise() {
                $(window).IFSAjax({
                    code: "0010_160004",
                    method: "POST",
                    data: { custNo: $("#custCnNm").attr("data-custNo") },
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            pluginObj.alert("当前企业被设置为默认登录企业");
                            loadData();
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

        });
    }
});