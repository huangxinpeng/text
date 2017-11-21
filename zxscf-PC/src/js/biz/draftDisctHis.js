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
    'draftDisctHisDtl',
    'text!tpls/draftDisctHis.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, draftDisctHisDtl, draftDisctHisTpl, footer) {
    return function() {
        var $draftDisctHisTpl = $(draftDisctHisTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($draftDisctHisTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //初始化日期插件
            dataPiker();

            $("#disctAppr").addClass("btnActive");
            $("#disctRetrAppr").addClass("btnDefault");
            //页面切换
            $("#disctAppr").on("click", function() {
                $("#disctAppr").addClass("btnActive");
                $("#disctAppr").removeClass("btnDefault");
                $("#disctRetrAppr").addClass("btnDefault");
                $("#disctRetrAppr").removeClass("btnActive");
                //宝券转让表格切换0906pmmodify
                $("#disctRetrApprBtn").hide();
                $("#disctApprBtn").show();
                //切换tab之后重新加载数据
                obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize, bussType: "01" });
                //初始化分页控件
                initPageComponent(loadData);
                loadData();
            });
            $("#disctRetrAppr").on("click", function() {
                $("#disctAppr").addClass("btnDefault");
                $("#disctAppr").removeClass("btnActive");
                $("#disctRetrAppr").addClass("btnActive");
                $("#disctRetrAppr").removeClass("btnDefault");
                //宝券转让表格切换0906pmhssmodify
                $("#disctApprBtn").hide();
                $("#disctRetrApprBtn").show();
                //切换tab之后重新加载数据
                obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize, bussType: "02" });
                //初始化分页控件
                initPageComponent(loadData);
                loadData();
            });

            //初始化分页控件
            initPageComponent(loadData);

            var obj = {}; //查询条件
            obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize, bussType: "01" });
            loadData(); //默认加载全部数据
            //加载数据方法
            function loadData() {
                //获取page数据
                obj = $.extend(obj, getPageInfo());
                $(window).IFSAjax({
                    code: "0010_820003",
                    data: $.extend({}, obj),
                    async: false,
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            successFun(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }
            //成功回调
            function successFun(data) {
                setTotalPage(data.total, obj.pageNum, obj.pageSize);
                if (IFSCommonMethod.isNotBlank(data.list)) {
                    var list = data.list;
                    var html = [];
                    var stat = { "1": "blue", "2": "red", "3": "red" };
                    //var stat = { "03": "grey", "05": "grey", "12": "red", "14": "red", "02": "blue", "04": "blue" };
                    for (var i = 0; i < 　list.length; i++) {
                        html.push('<tr data-id="' + list[i].id + '">\
                            <td>' + list[i].srcDrftNo + '</td>\
                            <td>' + IFSCommonMethod.formatMoney(list[i].disctAmt) + '</td>\
                            <td>' + IFSCommonMethod.formatMoney(list[i].disctAmt) + '</td>\
                            <td>' + IFSCommonMethod.formatMoney(list[i].rcInterest) + '</td>\
                            <td class="' + stat[list[i].appStat] + '">' + list[i].appStat + '</td>\
                            </tr>')
                    }
                    $(".table tbody").empty().append(html.join(""));
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
                        draftDisctHisDtl($(this).attr("data-id"));
                    });
                });
            }

            //  返回上一级页面
            $("#returnPre").on("click", function() {
                $("#draftDisct").trigger("click");
            });
        });
    }
});