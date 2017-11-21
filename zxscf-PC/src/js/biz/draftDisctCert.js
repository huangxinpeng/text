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
    'text!tpls/draftDisctCert.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, datepicker, datepicker_zh, draftDisctCertTpl, footer) {
    return function() {
        var $draftDisctCertTpl = $(draftDisctCertTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($draftDisctCertTpl);
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
                    code: "0010_370004",
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
                        html.push('<tr data-appNo="' + list[i].appNo + '" data-id="' + list[i].id + '"><td>\
                            <b class="definedCheckbox">\
                                <input type="checkbox" id="check' + i + '" value="100" name="rz">\
                                <label for="check' + i + '"></label>\
                            </b>\
                            </td>\
                            <td>' + list[i].srcDrftNo + '</td>\
                            <td>' + IFSCommonMethod.formatMoney(list[i].disctAmt) + '</td>\
                            <td>' + IFSCommonMethod.formatMoney(list[i].payAmt) + '</td>\
                            <td>' + list[i].rcInterest + '</td>\
                            <td>' + IFSCommonMethod.str2Date(list[i].txnDt) + '</td>\
                            <td dic-type="303">' + list[i].txnStat + '</td>\
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
                obj = $.extend(obj, $("#rpQF").getData());
                obj.startDate = IFSCommonMethod.formatStartDate(obj.startDate);
                obj.endDate = IFSCommonMethod.formatEndDate(obj.endDate);
                obj.pageNum = 1; //查询条件变化时，pageNum强制变更为1
                $("#pageIndex").html("1");
                if (checkQuery(obj)) {
                    loadData();
                }
            });

            $(".content").on("click", "[name=rz]", function() {
                if ($(this).prop("checked") == false) {
                    $("#checkall").prop("checked", false);
                } else if ($(this).prop("checked") == true) {
                    if ($("[name=rz]:checked").length == $("[name=rz]").length) {
                        $("#checkall").prop("checked", true);
                    }
                }
            });
            $("#checkall").click(function() {
                if ($(this).prop("checked") == true) {
                    $("[name=rz]").prop("checked", true);
                } else {
                    $("[name=rz]").prop("checked", false);
                }

            });

            $("#rpDload").click(function() {
                var rp = $("[name=rz]:checked");
                if (rp.length < 1) {
                    pluginObj.alert("选中一条再操作");
                } else if (rp.length > 1) {
                    pluginObj.alert("只能选一条");
                } else {
                    for (var i = 0; i < rp.length; i++) {
                        obj.appNo = rp.eq(i).closest("tr").attr("data-appNo");
                    }
                    obj.bussType = "30";
                    obj.fileType = "MB11";
                    $.get("/esif-webapp/certificates/fileDownload?appNo=" + obj.appNo + "&fileType=" + obj.fileType + "&bussType=" + obj.bussType + "&tnCode=2", function() {
                        window.location.href = "/esif-webapp/certificates/fileDownload?appNo=" + obj.appNo + "&fileType=" + obj.fileType + "&bussType=" + obj.bussType + "&tnCode=2"
                    });

                }
            });
        });
    }
});