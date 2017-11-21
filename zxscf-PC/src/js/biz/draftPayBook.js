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
    'text!tpls/draftPayBook.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, datepicker, datepicker_zh, draftPayBookTpl, footer) {
    return function() {
        var $draftPayBookTpl = $(draftPayBookTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($draftPayBookTpl);
        $('.content').append($footer);
        $(document).ready(function() {

            //初始化日期插件
            dataPiker();

            IFSCommonMethod.ifsRequestDic("txnStat", "129", "1");

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
                    code: "0010_200004",
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
                var colors = { "00": "orange", "02": "blue" };
                if (IFSCommonMethod.isNotBlank(data.list)) {
                    var list = data.list;
                    var html = [];
                    for (var i = 0; i < 　list.length; i++) {
                        html.push('<tr data-id="' + list[i].id + '">\
                           <td>' + IFSCommonMethod.str2Date(list[i].txnDt) + '</td>\
                           <td>' + list[i].drftNo + '</td>\
                           <td>' + IFSCommonMethod.formatMoney(list[i].payAmt) + '</td>\
                           <td>' + list[i].pyeeBankNm + '</td>\
                           <td>' + list[i].pyeeAcct + '</td>\
                           <td>' + IFSCommonMethod.str2Date(list[i].payDt) + '</td>\
                           <td class="' + colors[list[i].appStat] + '">' + list[i].appStat + '</td>\
                           </tr>')
                    }
                    $("#daoqiTab tbody").empty().append(html.join(""));
                    renderDataDic();
                    $("#noDataTip").css("display", "none");
                } else {
                    $("#noDataTip").css("display", "block");
                    $("#daoqiTab tbody").empty();
                }
            }
            //发起条件查询
            $("#fukuanSrch").click(function() {
                //获取查询条件
                obj = $.extend(obj, $("#fukuanQF").getData());
                obj.startDate = IFSCommonMethod.formatStartDate(obj.startDate);
                obj.endDate = IFSCommonMethod.formatEndDate(obj.endDate);
                obj.startTxnDt = IFSCommonMethod.formatStartDate(obj.startTxnDt);
                obj.endTxnDt = IFSCommonMethod.formatEndDate(obj.endTxnDt);
                if (checkQuery(obj)) {
                    loadData();
                    obj.pageNum = 1; //查询条件变化时，pageNum强制变更为1
                    $("#pageIndex").html("1");
                }
            });
        });
    }
});