/*
 * @Author: chengdan 
 * @Date: 2017-09-06 16:15:41 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-20 15:50:49
 */

define([
    'jquery',
    'bootstrap',
    'datepicker',
    'datepicker_zh',
    'json',
    'bootstrapValidator',
    'global',
    'router',
    'routerConfig',
    'config',
    'regular',
    'ajax',
    'common',
    'constant',
    'text!tpls/myDraftQueryDtl.html',
    'text!tpls/../protocals/applicantNotice.html',
    'text!tpls/footer.html',
], function($, bootstrap, datepicker, datepicker_zh, json, bootstrapValidator,
    global, router, routerConfig, config, regular, ajax, common, constant,
    myDraftQueryDtlTpl, applicantNotice, footer) {
    return function(drftId) {
        var $myDraftQueryDtlTpl = $(myDraftQueryDtlTpl);
        var $applicantNotice = $(applicantNotice);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($myDraftQueryDtlTpl);
        $('.content').append($footer);
        $('.scrollbar').append($applicantNotice);
        $(document).ready(function() {
            function loadData() {
                $(window).IFSAjax({
                    code: "0010_300002",
                    method: "POST",
                    data: { "id": drftId },
                    async: false,
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            successFun(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));;
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }
            loadData();

            function successFun(data) {
                $("#drwrNm").text(data.drwrNm);
                $("#dueDt").text(IFSCommonMethod.formatDate(data.dueDt, "yyyy-MM-dd"));
                $("#dueDays").text(data.dueDays);
                $("#drftNo").text(data.drftNo);
                $("#isseDt").text(IFSCommonMethod.formatDate(data.isseDt, "yyyy-MM-dd"));
                $("#prevOwnerNm").text(data.prevOwnerNm);
                $("#drftStat").text(data.drftStat);
                $("#validAmt").text(IFSCommonMethod.formatMoney(data.validAmt == null ? 0 : data.validAmt));
                setStatus(data);
                //数据字典
                renderDataDic();
            }

            //设置加保属性
            function setStatus(data) {
                $("#drftStat").css("color", (data.drftStat == "90" ? "#e71e1e" : "#1093f4"));
                if (data.isConfirmed == "1") { //已加保
                    $("#confirmingCustNm").text(data.confirmingCustNm);
                    $("#applyConfirm").css("display", "none");
                } else if (data.isConfirmed == "0") { //未加保
                    $("#confirmingCustNm").text("未担保").css("color", "#e71e1e");
                    $("#download").css("display", "none");
                    $("#applyConfirm").on("click", function() {
                        $("#myDraftConfirm").trigger("click");
                    });
                }
            }

            //返回上级页页
            $("#returnPrePage").on("click", function() {
                $("#myDraftQuery").trigger("click");
            });
        });

    }
});