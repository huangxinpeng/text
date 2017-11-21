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
    './draftTxnBookDtl',
    'text!tpls/draftTxnBook.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, datepicker, datepicker_zh, draftTxnBookDtl, draftTxnBookTpl, footer) {
    return function() {
        var $draftTxnBookTpl = $(draftTxnBookTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($draftTxnBookTpl);
        $('.content').append($footer);
        $(document).ready(function() {

            //初始化日期插件
            dataPiker();
            //加载数据字典
            IFSCommonMethod.ifsRequestDic("txnStat", "150", "1");
            IFSCommonMethod.ifsRequestDic("isDelay", "170", "1");

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
                    code: "0010_200002",
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
                setTotalPage(data.lists.total, obj.pageNum, obj.pageSize); //设置分页
                var colors = { "01": "orange", "02": "blue", "03": "gray", "04": "orange", "05": "gray", "10": "orange", "11": "blue", "12": "red" };

                if (IFSCommonMethod.isNotBlank(data.lists), IFSCommonMethod.isNotBlank(data.lists.list)) {
                    var list = data.lists.list;
                    var html = [];
                    for (var i = 0; i < 　list.length; i++) {
                        html.push('<tr data-stat="'+list[i].txnStat+'" data-id="' + list[i].id + '">\
                        <td>' + IFSCommonMethod.str2Date(list[i].txnDt) + '</td>\
                        <td>' + list[i].srcDrftNo + '</td>\
                        <td>' + IFSCommonMethod.formatMoney(list[i].txnAmt) + '</td>\
                        <td>' + list[i].rcvCustNm + '</td>\
                        <td>' + list[i].isDelay + '</td>\
                        <td>' + list[i].delayDays + '</td>\
                        <td>' + list[i].bouns + '</td>\
                        <td class="' + colors[list[i].txnStat] + '">' + list[i].txnStat + '</td>\
                    </tr>')
                    }
                    $("#transferTable tbody").empty().append(html.join(""));
                    renderDataDic();
                    $("#noDataTip").css("display", "none");
                } else {
                    $("#noDataTip").css("display", "block");
                    $("#transferTable tbody").empty();
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
                if($(this).attr("data-stat") == "11"){
                    draftTxnBookDtl($(this).attr("data-id"));
                }else{
                    draftTxnBookDtl($(this).attr("data-id"),"hidden");
                }
            })

            //数据字典
            renderDataDic();
        });
    }
});