/*
 * @Author: chengdan 
 * @Date: 2017-08-09 10:52:03  
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-17 14:41:21
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
    'myDraftTxnHis',
    'myDraftOnTxn',
    'myDraftTxnTurnOne',
    'myDraftTxnMoreTurnOne',
    'text!tpls/myDraftTxn.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, myDraftTxnHis, myDraftOnTxn,
    myDraftTxnTurnOne, myDraftTxnMoreTurnOne, myDraftTxnTpl, footer) {
    return function() {
        var $myDraftTxnTpl = $(myDraftTxnTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($myDraftTxnTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            $(window).IFSAjax({
                code: "0010_310001",
                method: "POST",
                data: {},
                async: false,
                complete: function(result) {
                    if (result.code == IFSConfig.resultCode) {
                        $("#totalTxnAmt").text(IFSCommonMethod.formatMoney(result.data));
                    } else {
                        pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                    }
                },
                error: function(status, XMLHttpRequest) {}
            });

            //转让中的宝券
            $("#queryOnTxn").on("click", function() {
                myDraftOnTxn();
            });

            //查看转让历史
            $("#queryTxnHis").on("click", function() {
                myDraftTxnHis();
            });

            //一转一 type=1
            $("#oneToOneBtn").on("click", function() {
                myDraftTxnTurnOne(1);
            });

            //一转多 type=2
            $("#oneToMoreBtn").on("click", function() {
                myDraftTxnTurnOne(2);
            });

            //多转一 type=3
            $("#moreToOneBtn").on("click", function() {
                myDraftTxnMoreTurnOne();
            });

        });
    }
});