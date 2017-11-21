/*
 * @Author: chengdan 
 * @Date: 2017-09-12 17:49:46 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-20 15:53:45
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
    'myDraftTxnTurnOneTwo',
    'myDraftTxnTurnMoreTwo',
    'text!tpls/myDraftTxnTurnOne.html',
    'text!tpls/footer.html',
], function($, bootstrap, datepicker, datepicker_zh, json, bootstrapValidator,
    global, router, routerConfig, config, regular, ajax, common, constant,
    myDraftTxnTurnOneTwo, myDraftTxnTurnMoreTwo, myDraftTxnTurnOneTpl, footer) {
    return function(type, drftInfo, pageNum) {
        var $myDraftTxnTurnOneTpl = $(myDraftTxnTurnOneTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($myDraftTxnTurnOneTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            $("#one").addClass("oneStep1");

            //初始化转让类型
            if (type == 1) {
                $("#txnType").text("宝券一转一");
                $("#three i").text("转让信息");
            } else if (type == 2) {
                $("#txnType").text("宝券一转多");
                $("#three i").text("宝券拆分");
                $("#three").addClass("threeStepOrg2");
            }

            //初始化日期插件
            dataPiker();

            //初始化查询content
            initQueryContent();

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
                        code: "0010_310007",
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
                    for (var i = 0; i < data.lists.list.length; i++) {
                        var info = data.lists.list[i];
                        var amt = IFSCommonMethod.formatCMoney(info.validAmt);
                        objStr += "<tr><td class='txnRadio'><input type ='radio' name ='txnRadio'>" +
                            "<div class='user-defined'><span class='circle'></span></div></td>" +
                            "<td hidden>" + info.id + "</td>" +
                            "<td>" + info.drftNo + "</td>" +
                            "<td hidden>" + info.validAmt + "</td > " +
                            "<td class='bqjetd'><span>" + amt[0] + "</span><span> 万 </span><span>" + amt[1] + "</span></td>" +
                            "<td>" + (info.dueDt == null ? "" : IFSCommonMethod.formatDate(info.dueDt, "yyyy-MM-dd")) + "</td>" +
                            "<td>" + IFSCommonMethod.formatReturnNullData(info.dueDays) + "</td>" +
                            "</tr>";
                    }
                    $(".contentMain table tbody").html(objStr);
                    $("#noDataTip").css("display", "none");
                } else {
                    $(".contentMain table tbody").empty();
                    $("#noDataTip").css("display", "block");
                }
                var id;
                if (IFSCommonMethod.isNotBlank(drftInfo)) {
                    id = drftInfo[0][0];
                }
                drftInfo = null;
                ininRadioComponent(id, null);
            }

            $("#queryTxn").on("click", function() {
                //获取查询条件
                obj = $.extend(obj, $("#query").getData());
                obj.startDate = IFSCommonMethod.formatStartDate(obj.startDate);
                obj.endDate = IFSCommonMethod.formatEndDate(obj.endDate);
                obj.pageNum = 1; //查询条件变化时，pageNum强制变更为1
                $("#pageIndex").text(1);
                loadData();
            });

            //下一步
            $("#nextStep").on("click", function() {
                var pageNum = $("#pageIndex").text();
                if (!isRadioChecked()) {
                    pluginObj.alert("请先选择一条宝券!");
                } else {
                    if (type == 1) {
                        myDraftTxnTurnOneTwo(getRadioInfo(), null, pageNum);

                    } else if (type == 2) {
                        myDraftTxnTurnMoreTwo(getRadioInfo(), null, pageNum);
                    }
                }
            });
        });
    }
});