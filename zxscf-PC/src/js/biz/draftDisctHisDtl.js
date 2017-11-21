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
    'draftDisctHis',
    'text!tpls/draftDisctHisDtl.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, require, draftDisctHis, draftDisctHisDtlTpl, footer) {
    return function(id) {
        var $draftDisctHisDtlTpl = $(draftDisctHisDtlTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($draftDisctHisDtlTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //  返回上一级页面
            $("#returnPre").on("click", function() {
                require("draftDisctHis")();
            });

            //加载数据
            function loadData() {
                $(window).IFSAjax({
                    code: "0010_320003",
                    method: "POST",
                    data: { id: id } || {},
                    async: false,
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            successFun(result.data);
                        } else {
                            pluginObj.alert(result.message);
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }
            loadData();

            function successFun(data) {
                $("#drftNo").text(data.srcDrftNo);
                $("#txnDt").text(IFSCommonMethod.formatDate(data.txnDt, "yyyy-MM-dd"));
                $("#orgNm").text(data.orgNm);
                $("#finTyp").text(data.finTyp);
                $("#txnStat").text(data.txnStat);
                $("#intDays").text(data.intDays);
                $("#rateDisct").text(data.rateDisct);
                $("#dcInterest").text(IFSCommonMethod.formatMoney(data.dcInterest));
                $("#intRate").text(data.intRate);
                $("#useBouns").text(IFSCommonMethod.formatMoney(data.useBouns));
                $("#rcInterest").text(IFSCommonMethod.formatMoney(data.rcInterest));
                $("#disctAmt").text(IFSCommonMethod.formatMoney(data.disctAmt));
                $("#payAmt").text(IFSCommonMethod.formatMoney(data.payAmt));
                //数据字典
                renderDataDic();
            }
        });
    }
});