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
    'draftTxnHis',
    'text!tpls/draftTxnHisDtl.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, require, draftTxnHis, draftTxnHisDtlTpl, footer) {
    return function(id) {
        var $draftTxnHisDtlTpl = $(draftTxnHisDtlTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($draftTxnHisDtlTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //  返回上一级页面
            $("#returnPre").on("click", function() {
                require("draftTxnHis")();
            });

            function loadData() {
                $(window).IFSAjax({
                    code: "0010_310003",
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
                $("#srcDrftNo").text(data.srcDrftNo);
                $("#txnDt").text(IFSCommonMethod.formatDate(data.txnDt, "yyyy-MM-dd"));
                $("#rcvCustNm").text(data.rcvCustNm);
                $("#dueDays").text(data.dueDays == null ? "0" : data.dueDays);
                $("#drwrNm").text(data.drwrNm);
                $("#txnStat").text(data.txnStat);
                $("#txnAmt").text(IFSCommonMethod.formatMoney(data.txnAmt));
                //数据字典
                renderDataDic();
            }
        });
    }
});