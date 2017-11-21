/*
 * @Author: chengdan
 * @Date: 2017-08-09 10:52:03 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-20 15:30:27
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
    'myDraftDisctHis',
    'myDraftOnDisct',
    'myDraftDisctApplyOne',
    'text!tpls/myDraftDisct.html',
    'text!tpls/footer.html',
], function($, bootstrap, datepicker, datepicker_zh, json, bootstrapValidator,
    global, router, routerConfig, config, regular, ajax, common, constant, myDraftDisctHis,
    myDraftOnDisct, myDraftDisctApplyOne, myDraftDisctTpl, footer) {
    return function(drftInfo, pageNum) {
        var $myDraftDisctTpl = $(myDraftDisctTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($myDraftDisctTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //初始化日期插件
            dataPiker();

            //初始化查询content
            initQueryContent();

            //查看融资历史
            $("#queryDisctHis").on("click", function() {
                myDraftDisctHis();
            });

            //融资中的宝券
            $("#queryOnDisct").on("click", function() {
                myDraftOnDisct();
            });

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
                        code: "0010_320001",
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
            };

            loadData();

            function successFun(data) {
                $("#disctAmt").text(IFSCommonMethod.formatMoney(data.sum));
                setTotalPage(data.lists.total, obj.pageNum, obj.pageSize);
                var objStr = "";
                if (IFSCommonMethod.isNotBlank(data.lists.list)) {
                    for (var i = 0; i < data.lists.list.length; i++) {
                        var info = data.lists.list[i];
                        var amt = IFSCommonMethod.formatCMoney(info.validAmt);
                        objStr += "<tr><td><span><input type='checkbox' id='" + i +
                            "'><label for='" + i + "'></label></span></td>" +
                            "<td hidden>" + info.id + "</td>" +
                            "<td>" + info.drftNo + "</td>" +
                            "<td hidden>" + info.validAmt + "</td > " +
                            "<td class='bqjetd'><span>" + amt[0] + "</span><span> 万 </span><span>" + amt[1] + "</span></td> " +
                            "<td>" + IFSCommonMethod.formatDate(info.dueDt, "yyyy-MM-dd") + "</td>" +
                            "<td>" + info.dueDays + "</td>" +
                            "<td hidden>" + info.finTyp + "</td>" +
                            "<td hidden>" + info.rateDisct + "</td>" +
                            "</tr>";
                    }
                    $(".contentMain table tbody").html(objStr);
                    $("#noDataTip").css("display", "none");
                } else {
                    $(".contentMain table tbody").empty();
                    $("#noDataTip").css("display", "block");
                }
                $("#checkedAmt").text("0.00");
                var ids;
                if (IFSCommonMethod.isNotBlank(drftInfo)) {
                    for (var i = 0; i < drftInfo.length; i++) {
                        ids += drftInfo[i][0] + ",";
                    }
                    ids = ids.substring(0, ids.length - 1);
                }
                drftInfo = null;
                initCheckBoxComponent(ids, 4, null);
            }

            $("#queryBtn").on("click", function() {
                //获取查询条件
                obj = $.extend(obj, $("#query").getData());
                obj.startDate = IFSCommonMethod.formatStartDate(obj.startDate);
                obj.endDate = IFSCommonMethod.formatEndDate(obj.endDate);
                obj.pageNum = 1; //查询条件变化时，pageNum强制变更为1
                $("#pageIndex").text(1)
                loadData();
            })

            //我要融资
            $("#disctBtn").on("click", function() {
                var pageNum = $("#pageIndex").text();
                if (!isChecked()) {
                    pluginObj.alert("请先选择一条宝券!");
                } else {
                    require("myDraftDisctApplyOne")(getCheckedInfo(), null, pageNum);
                }
            });
        });

    }
});