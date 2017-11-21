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
    'draftSignHisDtl',
    'text!tpls/draftSignHis.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, draftSignHisDtl, draftSignHisTpl, footer) {
    return function() {
        var $draftSignHisTpl = $(draftSignHisTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($draftSignHisTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //初始化分页控件
            initPageComponent(loadData);

            var obj = {}; //查询条件
            obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize });
            loadData(); //默认加载全部数据
            //加载数据方法
            function loadData() {
                //获取page数据
                obj = $.extend(obj, getPageInfo());
                $(window).IFSAjax({
                    code: "0010_800001",
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
                setTotalPage(data.total, obj.pageNum, obj.pageSize); //设置分页
                if (IFSCommonMethod.isNotBlank(data.list)) {
                    var list = data.list;
                    var html = [];
                    //var stat = { "12": "red", "11": "blue" };
                    var stat = { "1": "blue", "2": "red", "3": "red" };
                    for (var i = 0; i < 　list.length; i++) {
                        if (list[i].appNo) {
                            var orign = (list[i].appNo.substring(0, 2) == "10" ? "create" : "transfer");
                        }
                        html.push('<tr data-orign="' + orign + '" data-id="' + list[i].id + '">\
                            <td>' + list[i].srcDrftNo + '</td>\
                            <td>' + IFSCommonMethod.formatMoney(list[i].txnAmt) + '</td>\
                            <td>' + list[i].reqCustNm + '</td>\
                            <td>' + IFSCommonMethod.str2Date(list[i].txnDt) + '</td>\
                            <td>' + IFSCommonMethod.formatReturnNullData(list[i].dueDays) + '</td>\
                            <td class="' + stat[list[i].appStat] + '">' + (IFSCommonMethod.isNotBlank(list[i].appStat) ? list[i].appStat : "") + '</td>\
                            </tr > ');
                    }

                    $(".table tbody").empty().append(html.join(""));
                    $("#noDataTip").css("display", "none");
                } else {
                    $(".table tbody").empty()
                    $("#noDataTip").css("display", "block");
                }

                initClick();
                //数据字典
                renderDataDic();
            }

            //点击列表跳转到详情
            function initClick() {
                $(".table tbody tr").css("cursor", "pointer");
                $(".table tbody").on("click", "tr", function() {
                    draftSignHisDtl($(this).attr("data-id"), $(this).attr("data-orign"));
                });
            }

            //返回上一级页面
            $("#returnPre").on("click", function() {
                $("#draftSign").trigger("click");
            });

        });
    }
});