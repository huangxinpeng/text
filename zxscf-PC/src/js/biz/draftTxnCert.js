/**
 * Created by baikaili on 2017/8/29.
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
    'datepicker',
    'datepicker_zh',
    'text!tpls/draftTxnCert.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, datepicker, datepicker_zh, draftTxnCertTpl, footer) {
    return function() {
        var $draftTxnCertTpl = $(draftTxnCertTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($draftTxnCertTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //初始化日期插件
            dataPiker();

            //初始化分页控件
            initPageComponent(loadData);

            var obj = {}; //查询条件
            obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize });
            //获取列表信息
            loadData();

            function loadData() {
                //获取page数据
                obj = $.extend(obj, getPageInfo());
                $(window).IFSAjax({
                    code: "0010_370003",
                    method: "POST",
                    data: $.extend({}, obj),
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            renderList(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function renderList(data) {
                setTotalPage(data.total, obj.pageNum, obj.pageSize);
                if (IFSCommonMethod.isNotBlank(data.list)) {
                    $("#checkall").prop("disabled", false);
                    var list = data.list;
                    var html = [];
                    for (var i = 0; i < 　list.length; i++) {
                        html.push('<tr data-id="' + list[i].appNo + '"><td>\
                            <b class="definedCheckbox">\
                                <input type="checkbox" id="check' + i + '" value="100" name="zr">\
                                <label for="check' + i + '"></label>\
                            </b>\
                            </td>\
                            <td>' + list[i].srcDrftNo + '</td>\
                            <td>' + list[i].rcvCustName + '</td>\
                            <td>' + IFSCommonMethod.formatMoney(list[i].txnAmt) + '</td>\
                            <td>' + IFSCommonMethod.str2Date(list[i].dueDt) + '</td>\
                            <td>' + list[i].dueDays + '</td>\
                            <td>' + list[i].txnStat + '</td>\
                        </tr>');
                    }
                    $(".table tbody").empty().append(html.join(""));
                    renderDataDic();
                    $("#noDataTip").css("display", "none");
                } else {
                    $("#noDataTip").css("display", "block");
                    $(".table tbody").empty();
                    $("#checkall").prop("disabled", true);
                }
            }
            //发起条件查询
            $("#rpSrch").click(function() {
                //获取查询条件
                obj = $.extend(obj, $("#zrQF").getData());
                obj.startDate = IFSCommonMethod.formatStartDate(obj.startDate);
                obj.endDate = IFSCommonMethod.formatEndDate(obj.endDate);
                obj.pageNum = 1; //查询条件变化时，pageNum强制变更为1
                $("#pageIndex").html("1");
                loadData();
            });
            $(".content").on("click", "[name=zr]", function() {
                if ($(this).prop("checked") == false) {
                    $("#checkall").prop("checked", false);
                } else if ($(this).prop("checked") == true) {
                    if ($("[name=zr]:checked").length == $("[name=zr]").length) {
                        $("#checkall").prop("checked", true);
                    }
                }
            });
            $("#checkall").click(function() {
                if ($(this).prop("checked") == true) {
                    $("[name=zr]").prop("checked", true);
                } else {
                    $("[name=zr]").prop("checked", false);
                }
            });

            $("#rpDload").click(function() {
                var rp = $("[name=zr]:checked");
                if (rp.length < 1) {
                    pluginObj.alert("选中一条再操作");
                } else if (rp.length > 1) {
                    pluginObj.alert("只能选一条");
                } else {
                    for (var i = 0; i < rp.length; i++) {
                        obj.appNo = rp.eq(i).closest("tr").attr("data-id");
                    }
                    $.get("/esif-webapp/certificates/txnDownload?appNo=" + obj.appNo, function() {
                        window.location.href = "/esif-webapp/certificates/txnDownload?tnCode=2&appNo=" + obj.appNo;
                    });
                }
            });
        });
    }
});