/*
 * @Author: chengdan 
 * @Date: 2017-09-12 17:49:46 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-07 15:51:12
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
    'require',
    'myDraftTxnMoreTurnOne',
    'myDraftTxnMoreTurnThree',
    'text!tpls/myDraftTxnMoreTurnTwo.html',
    'text!tpls/footer.html',
], function($, bootstrap, datepicker, datepicker_zh, json, bootstrapValidator,
    global, router, routerConfig, config, regular, ajax, common, constant, require,
    myDraftTxnMoreTurnOne, myDraftTxnMoreTurnThree, myDraftTxnMoreTurnTwoTpl, footer) {
    return function(custInfo, drftInfo, pageNum) {
        var $myDraftTxnMoreTurnTwoTpl = $(myDraftTxnMoreTurnTwoTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($myDraftTxnMoreTurnTwoTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            $("#one").addClass("oneStepOrg3");
            $("#two").addClass("oneStep");

            //初始化查询content
            initQueryContent();

            //初始化日期插件
            dataPiker();

            //初始化排序
            initOrderComponent(loadData);

            //初始化分页控件
            initPageComponent(loadData);

            var obj = {};
            obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize });

            function loadData(condition) {
                obj = $.extend(obj, getPageInfo(), { "condition": condition });
                if (IFSCommonMethod.isNotBlank(pageNum)) {
                    obj.pageNum = pageNum;
                    $("#pageIndex").text(pageNum);
                    changePageBtnStatus(pageNum, pageSize)
                    pageNum = null;
                }
                if (checkQuery(obj)) {
                    $(window).IFSAjax({
                        code: "0010_310009",
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
                }
            }
            loadData();

            function successFun(data) {
                setTotalPage(data.lists.total, obj.pageNum, obj.pageSize);
                var objStr = "";
                if (IFSCommonMethod.isNotBlank(data.lists.list)) {
                    var totalAmt = 0;
                    for (var i = 0; i < data.lists.list.length; i++) {
                        var info = data.lists.list[i];
                        var temp = totalAmt;
                        totalAmt += parseFloat(info.validAmt);
                        var amt = parseFloat(custInfo[2]);
                        var validAmt = IFSCommonMethod.formatCMoney(info.validAmt);
                        if (totalAmt <= amt || (temp < amt && totalAmt > amt)) {
                            objStr += "<tr><td><span><input type='checkbox' id='" + i +
                                "'><label for='" + i + "'></label></span></td>" +
                                "<td hidden>" + info.id + "</td>" +
                                "<td><i class='icon iconfont icon-jian'></i>" + info.drftNo + "</td>" +
                                "<td hidden>" + info.validAmt + "</td > " +
                                "<td class='bqjetd'><span>" + validAmt[0] + "</span><span> 万 </span><span>" + validAmt[1] + "</span></td>" +
                                "<td>" + IFSCommonMethod.formatDate(info.dueDt, "yyyy-MM-dd") + "</td>" +
                                "<td>" + info.dueDays + "</td>" +
                                "</tr>";
                        } else {
                            objStr += "<tr><td><span><input type='checkbox' id='" + i +
                                "'><label for='" + i + "'></label></span></td>" +
                                "<td hidden>" + info.id + "</td>" +
                                "<td>" + info.drftNo + "</td>" +
                                "<td hidden>" + info.validAmt + "</td > " +
                                "<td class='bqjetd'><span>" + validAmt[0] + "</span><span> 万 </span><span>" + validAmt[1] + "</span></td>" +
                                "<td>" + IFSCommonMethod.formatDate(info.dueDt, "yyyy-MM-dd") + "</td>" +
                                "<td>" + info.dueDays + "</td>" +
                                "</tr>";
                        }
                    }
                    $(".contentMain table tbody").html(objStr);
                    $("#noDataTip").css("display", "none");
                } else {
                    $(".contentMain table tbody").empty();
                    $("#noDataTip").css("display", "block");
                }
                var ids;
                if (IFSCommonMethod.isNotBlank(drftInfo)) {
                    for (var i = 0; i < drftInfo.length; i++) {
                        ids += drftInfo[i][0] + ",";
                    }
                    ids = ids.substring(0, ids.length - 1);
                }
                drftInfo = null;
                initCheckBoxComponent(ids, null, null);
            }

            $("#queryTxn").on("click", function() {
                //获取查询条件
                obj = $.extend(obj, $("#query").getData());
                obj.startDate = IFSCommonMethod.formatStartDate(obj.startDate);
                obj.endDate = IFSCommonMethod.formatEndDate(obj.endDate);
                obj.pageNum = 1; //查询条件变化时，pageNum强制变更为1
                $("#pageIndex").text()
                loadData();
            });

            //上一步
            $("#preStep").on("click", function() {
                require("myDraftTxnMoreTurnOne")(custInfo);
            });

            //下一步
            $("#nextStep").on("click", function() {
                var pageNum = $("#pageIndex").text();
                if (!isChecked()) {
                    pluginObj.alert("请先选择一条宝券!");
                } else {
                    myDraftTxnMoreTurnThree(custInfo, getCheckedInfo(), pageNum);
                }
            });

        });

    }
});