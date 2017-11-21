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
    './draftDisctBookDtl',
    'text!tpls/draftDisctBook.html',
    'text!tpls/footer.html'
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, datepicker, datepicker_zh, draftDisctBookDtl, draftDisctBookTpl,
    footer) {
    return function() {
        var $draftDisctBookTpl = $(draftDisctBookTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($draftDisctBookTpl);
        $('.content').append($footer);
        $(document).ready(function() {

            //初始化日期插件
            dataPiker();

            IFSCommonMethod.ifsRequestDic("txnStat", "160", "1");

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
                    code: "0010_200003",
                    data: $.extend({}, obj),
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            successFun(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));;
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }
            //成功回调
            function successFun(data) {
                setTotalPage(data.lists.total, obj.pageNum, obj.pageSize);
                var colors = { "12": "orange", "15": "blue", "03": "gray", "05": "gray", "14": "red" };
                if (IFSCommonMethod.isNotBlank(data.lists.list)) {
                    var list = data.lists.list;
                    var html = [];
                    for (var i = 0; i < 　list.length; i++) {
                        html.push('<tr data-stat="'+list[i].stat+'" data-id="' + list[i].id + '">\
                            <td>' + IFSCommonMethod.str2Date(list[i].txnDt) + '</td>\
                            <td>' + list[i].srcDrftNo + '</td>\
                            <td>' + IFSCommonMethod.formatMoney(list[i].disctAmt) + '</td>\
                            <td>' + IFSCommonMethod.formatMoney(list[i].dcInterest) + '</td>\
                            <td>' + IFSCommonMethod.formatMoney(list[i].rcInterest) + '</td>\
                            <td>' + IFSCommonMethod.formatMoney(list[i].useBouns) + '</td>\
                            <td>' + IFSCommonMethod.formatMoney(list[i].payAmt) + '</td>\
                            <td class="' + colors[list[i].txnStat] + '">' + list[i].txnStat + '</td>\
                        </tr>');
                    }
                    $("#financeTable tbody").empty().append(html.join(""));
                    renderDataDic();
                    $("#noDataTip").css("display", "none");
                } else {
                    $("#noDataTip").css("display", "block");
                    $("#financeTable tbody").empty();
                }
            }
            //发起条件查询
            $("#search").click(function() {
                //获取查询条件
                obj = $.extend(obj, $("#query").getData());
                obj.startDate = IFSCommonMethod.formatStartDate(obj.startDate);
                obj.endDate = IFSCommonMethod.formatEndDate(obj.endDate);
                obj.pageNum = 1; //查询条件变化时，pageNum强制变更为1
                $("#pageIndex").html("1");
                if (checkQuery(obj)) {
                    loadData();
                }
            });

            //点击列表跳转到详情
            $(".table").on("click", "tr", function() {
                if($(this).attr("data-stat") == "15"){
                    draftDisctBookDtl($(this).attr("data-id"));
                }else{
                    draftDisctBookDtl($(this).attr("data-id"),"hidden");
                }
            })

        });
    }
});