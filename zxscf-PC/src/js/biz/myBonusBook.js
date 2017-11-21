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
    'text!tpls/myBonusBook.html',
    'text!tpls/footer.html',
    'datepicker',
    ''
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, datepicker, datepicker_zh, myBonusBookTpl, footer) {
    return function() {
        var $myBonusBookTpl = $(myBonusBookTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($myBonusBookTpl);
        $('.content').append($footer);
        $(document).ready(function() {

            //初始化日期插件
            dataPiker();

            IFSCommonMethod.ifsRequestDic("txnStat", "134", "1");
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
                    code: "0010_900002",
                    data: $.extend({}, obj),
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
                    for (var i = 0; i < 　list.length; i++) {
                        html.push('<tr data-id="' + list[i].id + '">\
                            <td>' + IFSCommonMethod.str2Date(list[i].useDt) + '</td>\
                            <td>' + IFSCommonMethod.formatMoney(list[i].useBonus) + '</td>\
                            <td>' + list[i].useScene + '</td>\
                            <td>' + list[i].useUsrNm + '</td>\
                            </tr>')
                    }
                    $(".table tbody").empty().append(html.join(""));
                    renderDataDic();
                    $("#noDataTip").css("display", "none");
                } else {
                    $("#noDataTip").css("display", "block");
                    $(".table tbody").empty();
                }
            }
            //发起条件查询
            $("#jinbiSrch").click(function() {
                //获取查询条件
                obj = $.extend(obj, $("#jinbiQF").getData());
                obj.startDate = IFSCommonMethod.formatStartDate(obj.startDate);
                obj.endDate = IFSCommonMethod.formatEndDate(obj.endDate);
                if (checkQuery(obj)) {
                    loadData();
                    obj.pageNum = 1; //查询条件变化时，pageNum强制变更为1
                    $("#pageIndex").html("1");
                }
            });
        });
    }
});