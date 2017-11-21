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
    'require',
    'draftSignBookDtl',
    'draftTxnBookDtl',
    'draftSignHisDtl',
    'myDraftTxnDtl',
    'text!tpls/draftTxnCertDtl.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, require, draftSignBookDtl, draftSignHisDtl, draftTxnBookDtl, myDraftTxnDtl, draftTxnCertDtlTpl, footer) {
    return function(id, src, obj, type) { //凭证的id，传参来源src，
        var $draftTxnCertDtlTpl = $(draftTxnCertDtlTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($draftTxnCertDtlTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //yemiangongyong
            initPage(src);

            function initPage(src) {
                if (src == "accQ") {
                    $("#title").html('<span class="spanTitle">业务台账&gt;宝券签收台账&gt;宝券信息&gt;<a href="javascript:;" alt="">宝券转让凭证</a></span>\
                        <span class="spanNote">您在此页面可查看企业持有宝券转让凭证信息并下载</span>');
                } else if (src == "accZ") {
                    $("#title").html('<span class="spanTitle">业务台账&gt;宝券转让台账&gt;宝券信息&gt;<a href="javascript:;" alt="">宝券转让凭证</a></span>\
                        <span class="spanNote">您在此页面可查看企业持有宝券转让凭证信息并下载</span>');
                } else if (src == "taskZ") {
                    $("#title").html('<span class="spanTitle">待办任务&gt;宝券转让&gt;宝券信息&gt;<a href="javascript:;" alt="">宝券转让凭证</a></span>\
                        <span class="spanNote">您在此页面可查看企业持有宝券转让凭证信息并下载</span>');
                } else if (src == "bqqsH") {
                    $("#title").html('<span class="spanTitle">我的宝券&gt;宝券转让&gt;转让历史&gt;<a href="javascript:;" alt="">宝券转让凭证</a></span>\
                        <span class="spanNote">您在此页面可查看企业持有宝券转让凭证信息并下载</span>');
                }
            }
            //渲染页面
            loadData();

            function loadData() {
                $(window).IFSAjax({
                    code: "0010_370007",
                    method: "POST",
                    timeout: 3000,
                    data: { appNo: obj.appNo } || {},
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            showTransferInfo(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }
            //渲染转让信息
            function showTransferInfo(data) {
                if (data) {
                    $("span[name]").each(function() {
                        var nm = $(this).attr("name");
                        if ($(this).attr('data-type') == "date") {
                            $(this).html(IFSCommonMethod.str2Date(data[nm]));
                        } else if ($(this).attr('data-type') == "currency-C") {
                            $(this).html("(大写)" + data[nm]);
                        } else if ($(this).attr('data-type') == "currency") {
                            $(this).html(IFSCommonMethod.formatMoney(data[nm]));
                        } else if ($(this).attr('data-type') == "currency-S") {
                            $(this).html("(小写)" + IFSCommonMethod.formatMoney(data[nm]));
                        } else {
                            $(this).html(data[nm]);
                        }
                    })
                    renderDataDic();
                }
            }

            //返回上一级页面
            $("#returnPre").on("click", function() {
                if (src == "accQ") { //台账签收
                    require('draftSignBookDtl')(id, obj.orign);
                } else if (src == "accZ") { //台账转让
                    require('draftTxnBookDtl')(id);
                } else if (src == "taskZ") { //待办任务
                    require('draftSignHisDtl')(id, obj.orign);
                } else if (src == "bqqsH") { //宝券签收历史
                    require('myDraftTxnDtl')(type, id);
                }
            })

            $("#qsrq1").click(function() {
                $.get("/esif-webapp/certificates/txnDownload?tnCode=2&appNo=" + obj.appNo, function() {
                    window.location.href = "/esif-webapp/certificates/txnDownload?tnCode=2&appNo=" + obj.appNo;
                });
            });

        });
    }
});