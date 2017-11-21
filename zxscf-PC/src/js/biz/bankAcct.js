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
    './bankAcctAdd',
    './bankAcctVerTwo',
    './bankAcctVerOne',
    'text!tpls/bankAcct.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, bankAcctAdd, bankAcctVerTwo, bankAcctVerOne, bankAcctTpl, footer) {
    return function() {
        var $bankAcctTpl = $(bankAcctTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($bankAcctTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //初始化页面
            loadData();

            //页面点击事件
            $("ul").on('click', "#add", function() {
                bankAcctAdd();
            });
            $("ul").on('click', ".toPayed", function() {
                var id = $(this).closest("li").attr("data-id");
                bankAcctVerTwo(id, "0");
            });
            $("ul").on('click', ".usable", function() {
                var id = $(this).closest("li").attr("data-id");
                bankAcctVerTwo(id, "1");
            });
            $("ul").on('click', ".toVerified", function() {
                var id = $(this).closest("li").attr("data-id");
                bankAcctVerOne(id);
            });
            $("ul").on('click', ".checkFail", function() {
                var id = $(this).closest("li").attr("data-id");
                bankAcctVerOne(id);
            });

            //初始化页面方法
            function loadData() {
                $(window).IFSAjax({
                    code: "0010_170001",
                    data: {},
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            if (result.data.list) {
                                renderAccountList(result.data.list);
                            }

                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));;
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function renderAccountList(data) {
                var html = [];
                for (var i = 0; i < data.length; i++) {
                    html.push('<li data-id="' + data[i].id + '">\
                        <a class="' + getState(data[i].checkStu)[0] + '" href="javascript:void(0);">\
                        <p>' + getBankName(data[i].openBrhNm) + '<span class="' + (data[i].defRecNo == "0" ? "no" : "") + '">默认账户</span></p>\
                        <h4>' + getHiddenAcc(data[i].acctNo) + getState(data[i].checkStu)[1] + '</h4>\
                        </a>\
                        </li>');

                }
                html.push('<li>\
                    <a id="add" href="javascript:void(0);">\
                    <span>+</span>\
                    <p>新增银行账号</p>\
                    </a>\
                </li>');
                $("#accountList").empty().append(html.join(""));
            }

            function getState(state) {
                switch (state) {
                    case '0':
                        return ["toVerified", '<span class="red">待验证</span>'];
                    case '1':
                        return ["toPayed", '<span class="red">已打款待验证</span>'];
                    case '2':
                        return ["usable", '<span class="blue">可用</span>'];
                    case '3':
                        return ["checkFail", '<span class="red">验证失败</span>'];
                }
            }

            function getBankName(bankName) {
                if (IFSCommonMethod.isNotBlank(bankName)) {
                    return bankName.split("银行")[0] + "银行";
                } else {
                    return "";
                }
            }

            function getHiddenAcc(acc) {
                if (IFSCommonMethod.isNotBlank(acc)) {
                    return acc.slice(0, 4) + "************" + acc.slice(acc.length - 3, acc.length);
                }
            }

        });
    }
});