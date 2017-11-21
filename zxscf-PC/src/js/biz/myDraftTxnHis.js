/*
 * @Author: chengdan 
 * @Date: 2017-09-12 14:45:52 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-20 15:53:53
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
    'myDraftTxnDtl',
    'text!tpls/myDraftTxnHis.html',
    'text!tpls/footer.html',
], function($, bootstrap, datepicker, datepicker_zh, json, bootstrapValidator,
    global, router, routerConfig, config, regular, ajax, common, constant,
    myDraftTxnDtl, myDraftTxnHisTpl, footer) {
    return function() {
        var $myDraftTxnHisTpl = $(myDraftTxnHisTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($myDraftTxnHisTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //初始化分页控件
            initPageComponent(loadData);

            var obj = {};
            obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize });

            function loadData() {
                obj = $.extend(obj, getPageInfo());
                $(window).IFSAjax({
                    code: "0010_310002",
                    method: "POST",
                    data: $.extend(obj, {}),
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
            };
            loadData();

            function successFun(data) {
                $("#totalTxnAmt").text(IFSCommonMethod.formatMoney(data.sum));
                setTotalPage(data.lists.total, obj.pageNum, obj.pageSize);
                var objStr = "";
                if (IFSCommonMethod.isNotBlank(data.lists.list)) {
                    var stat = { "03": "grey", "05": "grey", "11": "blue", "12": "red" };
                    for (var i = 0; i < data.lists.list.length; i++) {
                        var drftInfo = data.lists.list[i];
                        objStr += "<tr data-stat='"+drftInfo.txnStat+"'><td hidden>" + drftInfo.id + "</td>" +
                            "<td>" + IFSCommonMethod.formatDate(drftInfo.txnDt, "yyyy-MM-dd") + "</td>" +
                            "<td>" + drftInfo.srcDrftNo + "</td>" +
                            "<td>" + IFSCommonMethod.formatMoney(drftInfo.txnAmt) + "</td>" +
                            "<td>" + drftInfo.rcvCustNm + "</td>" +
                            "<td class='" + stat[drftInfo.txnStat] + "'>" + drftInfo.txnStat + "</td>" +
                            "</tr>";
                    }
                    $(".contentMain table tbody").html(objStr);
                    $("#noDataTip").css("display", "none");
                } else {
                    $(".contentMain table tbody").empty();
                    $("#noDataTip").css("display", "block");
                }
                initClick();
                //数据字典
                renderDataDic();
            }

            //初始化行点击
            function initClick() {
                $("table tbody tr").each(function() {
                    $(this).css("cursor", "pointer");
                    $(this).on("click", function() {
                        if($(this).attr("data-stat") == "11"){
                            require("myDraftTxnDtl")(4, $(this).children().eq(0).text());
                        }else{
                            require("myDraftTxnDtl")(4, $(this).children().eq(0).text(),"hidden");
                        }
                        
                    });
                });
            }

            $("#returnBtn").on("click", function() {
                $("#myDraftTxn").trigger("click");
            });
        });
    }
});