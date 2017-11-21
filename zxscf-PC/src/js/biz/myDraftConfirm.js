/*
 * @Author: chengdan 
 * @Date: 2017-09-01 15:34:07 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-17 14:41:32
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
    'myDraftConfirmApply',
    'text!tpls/myDraftConfirm.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, myDraftConfirmApply, myDraftConfirmTpl, footer) {
    return function() {
        var $myDraftConfirmTpl = $(myDraftConfirmTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($myDraftConfirmTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //初始化分页控件
            initPageComponent(loadData);

            var obj = {};
            obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize });

            function loadData() {
                obj = $.extend(obj, getPageInfo());
                $(window).IFSAjax({
                    code: "0010_340001",
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
            loadData();

            function successFun(data) {
                setTotalPage(data.total, obj.pageNum, obj.pageSize);
                var objStr = "";
                if (IFSCommonMethod.isNotBlank(data.list)) {
                    for (var i = 0; i < data.list.length; i++) {
                        var drftInfo = data.list[i];
                        var amt = IFSCommonMethod.formatCMoney(drftInfo.isseAmt);
                        objStr += "<tr><td><span><input type='checkbox' id='" + i +
                            "'><label for='" + i + "'></label></span></td>" +
                            "<td hidden>" + drftInfo.id + "</td>" +
                            "<td>" + drftInfo.drftNo + "</td>" +
                            "<td>" + IFSCommonMethod.formatDate(drftInfo.isseDt, "yyyy-MM-dd") + "</td>" +
                            "<td hidden>" + drftInfo.isseAmt + "</td > " +
                            "<td class='bqjetd'><span>" + amt[0] + "</span><span> 万 </span><span>" + amt[1] + "</span></td> " +
                            "<td>" + drftInfo.prevOwnerNm + "</td>" +
                            "<td>" + IFSCommonMethod.formatDate(drftInfo.dueDt, "yyyy-MM-dd") + "</td>" +
                            "<td hidden>" + drftInfo.dueDays + "</td>" +
                            "</tr>";
                    }
                    $(".contentMain table tbody").html(objStr);
                    $("#noDataTip").css("display", "none");
                } else {
                    $(".contentMain table tbody").empty();
                    $("#noDataTip").css("display", "block");
                }
                //初始化checkbox
                var info = $("#myDraftConfirm").attr("info");
                $('#myDraftConfirm').removeAttr('info');
                var ids;
                if (IFSCommonMethod.isNotBlank(info)) {
                    info = JSON.parse(info);
                    for (var i = 0; i < info.length; i++) {
                        ids += info[i][0] + ",";
                    }
                    ids = ids.substring(0, ids.length - 1);
                }
                initCheckBoxComponent(ids, 1, myDraftConfirmApply);
            }

            //申请加保
            $("#applyConfirm").on("click", function() {
                if (!isChecked()) {
                    pluginObj.alert("请先选择一条宝券!");
                } else {
                    myDraftConfirmApply(getCheckedInfo());
                }
            });

        });

    }
});