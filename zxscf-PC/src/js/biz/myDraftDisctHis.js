/*
 * @Author: chengdan 
 * @Date: 2017-09-06 14:38:09 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-06 16:36:12
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
    'myDraftDisctDtl',
    'text!tpls/myDraftDisctHis.html',
    'text!tpls/footer.html',
], function($, bootstrap, datepicker, datepicker_zh, json, bootstrapValidator,
    global, router, routerConfig, config, regular, ajax, common, constant,
    myDraftDisctDtl, myDraftDisctHisTpl, footer) {
    return function() {
        var $myDraftDisctHisTpl = $(myDraftDisctHisTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($myDraftDisctHisTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //初始化分页控件
            initPageComponent(loadData);

            var obj = {};
            obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize });

            //查询方法
            function loadData() {
                obj = $.extend(obj, getPageInfo());
                $(window).IFSAjax({
                    code: "0010_320002",
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
                $("#sum").text(IFSCommonMethod.formatMoney(data.sum));
                $("#rateSum").text(IFSCommonMethod.formatMoney(data.rateSum));
                setTotalPage(data.lists.total, obj.pageNum, obj.pageSize);
                var objStr = "";
                if (IFSCommonMethod.isNotBlank(data.lists.list)) {
                    var stat = { "03": "grey", "05": "red", "12": "yellow", "14": "grey", "15": "blue" };
                    for (var i = 0; i < data.lists.list.length; i++) {
                        var bqinfo = data.lists.list[i];
                        objStr += "<tr data-stat='"+bqinfo.txnStat+"'><td hidden>" + bqinfo.id + "</td>" +
                            "<td>" + IFSCommonMethod.formatDate(bqinfo.txnDt, "yyyy-MM-dd") + "</td>" +
                            "<td>" + bqinfo.srcDrftNo + "</td>" +
                            "<td>" + IFSCommonMethod.formatMoney(bqinfo.disctAmt) + "</td>" +
                            "<td>" + IFSCommonMethod.formatMoney(bqinfo.rcInterest) + "</td>" +
                            "<td>" + IFSCommonMethod.formatMoney(bqinfo.payAmt) + "</td>" +
                            "<td class='" + stat[bqinfo.txnStat] + "'>" + bqinfo.txnStat + "</td>" +
                            "</tr>";
                    }
                    $(".table tbody").empty().html(objStr);
                    $("#noDataTip").css("display", "none");
                } else {
                    $(".table tbody").empty();
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
                        if($(this).attr("data-stat") == "15"){
                            require("myDraftDisctDtl")(2, $(this).children().eq(0).text());
                        }else{
                            require("myDraftDisctDtl")(2, $(this).children().eq(0).text(),"hidden");
                        }
                    });
                });
            }

            $("#returnBtn").on("click", function() {
                $("#myDraftDisct").trigger("click");
            });
        });

    }
});