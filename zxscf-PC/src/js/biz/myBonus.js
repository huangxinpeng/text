/*
 * @Author: chengdan 
 * @Date: 2017-08-31 16:53:04 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-17 14:42:48
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
    'text!tpls/myBonus.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, myCoinsTpl, footer) {
    return function() {
        var $myCoinsTpl = $(myCoinsTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($myCoinsTpl);
        $('.content').append($footer);

        $(document).ready(function() {
            //初始化日期插件
            dataPiker();

            //初始化分页控件
            initPageComponent(loadData);

            var obj = {}; //查询条件
            obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: 5, stat: "2" });

            loadData(); //默认加载全部数据
            //加载数据方法
            function loadData() {
                //获取page数据
                obj = $.extend(obj, getPageInfo());
                $(window).IFSAjax({
                    code: "0010_900003",
                    method: "POST",
                    data: $.extend({}, obj),
                    complete: function(result) {
                        if (result.code = IFSConfig.resultCode) {
                            successFun(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }
            //成功回调函数
            function successFun(data) {
                setTotalPage(data.total, obj.pageNum, obj.pageSize);
                if (IFSCommonMethod.isNotBlank(data.list)) {
                    var list = data.list;
                    var html = [];
                    for (var i = 0; i < list.length; i++) {
                        html.push('<tr data-id="' + list[i].id + '">\
                        <td>' + IFSCommonMethod.str2Date(list[i].txnDt) + '\
                        <td>' + list[i].draftNo + '</td>\
                        <td>' + IFSCommonMethod.formatMoney(list[i].txnAmt) + '</td>\
                        <td>' + list[i].txnScene + '</td>\
                        <td>' + IFSCommonMethod.formatMoney(list[i].bonus) + '</td>\
                        </tr>');
                    }
                    $("table tbody").empty().append(html.join(""));
                    renderDataDic();
                    $("#noDataTip").css("display", "none");
                } else {
                    $("table tbody").empty();
                    $("#noDataTip").css("display", "block");
                }
            }

            //金币数量
            getBonusCount();

            function getBonusCount() {
                $(window).IFSAjax({
                    code: "0010_400001",
                    method: "POST",
                    data: {},
                    complete: function(result) {
                        if (result.code = IFSConfig.resultCode) {
                            renderBonusCount(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function renderBonusCount(data) {
                $("#totalBonus").html(IFSCommonMethod.formatMoney(data.totalBonus));
                $("#usbBonus").html(IFSCommonMethod.formatMoney(data.validBonus));
                $("#frzBonus").html(IFSCommonMethod.formatMoney(data.lockBonus));
            }
            //queryEarning
            queryEarning();

            function queryEarning() {
                $(window).IFSAjax({
                    code: "0010_400002",
                    method: "POST",
                    data: {},
                    complete: function(result) {
                        if (result.code = IFSConfig.resultCode) {
                            renderEarningCount(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function renderEarningCount(data) {
                $("#earned").html("收益总额：" + IFSCommonMethod.formatMoney(data.inBonus));
                $("#earning").html("未入账总额：" + IFSCommonMethod.formatMoney(data.outBonus));
            }


            $("#sy").addClass("btnActive");
            $("#wrz").addClass("btnDefault");
            //页面切换
            $("#sy").on("click", function() {
                $("#sy").addClass("btnActive");
                $("#sy").removeClass("btnDefault");
                $("#wrz").addClass("btnDefault");
                $("#wrz").removeClass("btnActive");
                //切换tab之后重新加载数据
                obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: 5, stat: "2" });
                //初始化话分页控件
                initPageComponent(loadData);
                loadData();
            });

            $("#wrz").on("click", function() {
                $("#sy").addClass("btnDefault");
                $("#sy").removeClass("btnActive");
                $("#wrz").addClass("btnActive");
                $("#wrz").removeClass("btnDefault");
                //切换tab之后重新加载数据
                obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: 5, stat: "1" });
                //初始化分页控件
                initPageComponent(loadData);
                loadData();
            });

            //切换收益、未入账时对应的金额的变化
            $(".jbsy button").click(function() {
                $(".jbsy span").toggle();
            });

        });
    }
});