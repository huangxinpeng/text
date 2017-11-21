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
    'require',
    'draftDisctBookDtl',
    'myDraftDisctDtl',
    'text!tpls/draftDisctCertDtl.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, require, draftDisctBookDtl, myDraftDisctDtl, draftDisctCertDtlTpl, footer) {
    return function(ticketId, objP, src, type) {
        var $draftDisctCertDtlTpl = $(draftDisctCertDtlTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($draftDisctCertDtlTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //公用页面设置标题
            initPage();

            function initPage() {
                if (src == "acc") {
                    $("#title").html('<span class="spanTitle">业务台账>宝券融资台账>融资信息>\
                    <a href="javascript:;" alt="">宝券融资凭证</a></span>\
                <span class="spanNote">您在此页面可查看宝券融资台账的融资凭证信息且可以下载融资凭证</span>');
                } else if (src == "task") {
                    $("#title").html('<span class="spanTitle">我的宝券>宝券融资>融资信息>\
                    <a href="javascript:;" alt="">宝券融资凭证</a></span>\
                <span class="spanNote">您在此页面可查看宝券融资的融资凭证信息且可以下载融资凭证</span>');
                }
            }
            var obj = {};
            loadData();

            function loadData() {
                $(window).IFSAjax({
                    code: "0010_370006",
                    method: "POST",
                    timeout: 3000,
                    data: { appNo: objP.appNo } || {},
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            showTransferInfo(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }
            //渲染转让信息
            function showTransferInfo(data) {
                if (data) {
                    $("span[name],div[name]").each(function() {
                        var nm = $(this).attr("name");
                        if ($(this).attr('data-type') == "date") {
                            $(this).html(IFSCommonMethod.str2Date(data[nm]));
                        } else if ($(this).attr('data-type') == "currency-C") {
                            $(this).html("(大写)" + data[nm]);
                        } else if ($(this).attr('data-type') == "currency") {
                            $(this).html(IFSCommonMethod.formatMoney(data[nm]));
                        } else if ($(this).attr('data-type') == "currency-S") {
                            $(this).html("(小写)" + IFSCommonMethod.formatMoney(data[nm]));
                        } else if ($(this).attr('data-type') == "rate") {
                            $(this).html(data[nm] + "%");
                        } else {
                            $(this).html(data[nm]);
                        }
                    })
                }
                renderDataDic();
            }
            $(".goUp .btn").click(function() {
                if (src == "acc") {
                    require('draftDisctBookDtl')(ticketId);
                } else if (src == "task") {
                    require('myDraftDisctDtl')(type, ticketId);
                }
            });
            //xiazai
            $("#ldBtn").click(function() {
                $.get("/esif-webapp/certificates/fileDownload?appNo=" + objP.appNo + "&fileType=" + objP.fileType + "&bussType=" + objP.bussType + "&tnCode=2", function() {
                    window.location.href = "/esif-webapp/certificates/fileDownload?appNo=" + objP.appNo + "&fileType=" + objP.fileType + "&bussType=" + objP.bussType + "&tnCode=2";
                });
            });


        });
    }
});