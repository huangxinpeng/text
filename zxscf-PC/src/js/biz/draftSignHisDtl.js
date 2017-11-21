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
    'draftTxnCertDtl',
    'draftSignHis',
    'text!tpls/draftSignHisDtl.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, require, draftTxnCertDtl, draftSignHis, draftSignHisDtlTpl, footer) {
    return function(id, orign) {

        var $draftSignHisDtlTpl = $(draftSignHisDtlTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($draftSignHisDtlTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            initPage();

            function initPage() {
                if (orign == "create") {
                    $("[data-type=3]").closest(".download").show().siblings(".download").hide();
                }
            }

            var obj = {};
            obj.bussType = "10";
            //返回上一页
            $("#returnPre").on("click", function() {
                require("draftSignHis")();
            });

            //加载数据
            function loadData() {
                $(window).IFSAjax({
                    code: "0010_800004",
                    method: "POST",
                    data: { id: id } || {},
                    async: false,
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            successFun(result.data);
                        } else {
                            pluginObj.alert(result.message);
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            loadData();

            function successFun(data) {
                $("#srcDrftNo").html(data.srcDrftNo);
                $("#txnDt").html(IFSCommonMethod.str2Date(data.txnDt));
                $("#reqCustNm").html(data.reqCustNm);
                $("#dueDays").html(data.dueDays);
                $("#drwrNm").html(data.drwrNm);
                $("#txnStat").html(data.txnStat);
                $("#txnAmt").html(IFSCommonMethod.formatMoney(data.txnAmt));
                //数据字典
                renderDataDic();
                obj.appNo = data.appNo;
            }


            //模态框名称修改控制
            $(".fr").click(function() {
                $(".modal-title").html($(this).siblings("label").html());
            });

            $("#qsxyxz").on("click", function() {
                obj.fileType = "MB05";
                getCertification();
                $("#transferFir").modal("show");

            });
            //签收债权转让通知下载
            $("#qszqxz").on("click", function() {
                obj.fileType = "MB06";
                getCertification();
                $("#transferSec").modal("show");

            });
            //宝券转让凭证
            $("#bqzrpz").on("click", function() {
                    obj.orign = orign; //页面有效参数
                    draftTxnCertDtl(id, 'taskZ', obj);
                })
                //开具协议
            $("#kjxy").on("click", function() {
                obj.fileType = "MB04";
                getCertification();
                $("#transferSec").modal("show");

            });

            function getCertification() {
                $("iframe").attr("src", "/esif-webapp/certificates/fileDownload?appNo=" + obj.appNo + "&fileType=" + obj.fileType + "&bussType=" + obj.bussType + "&tnCode=1");
            }
        });


    }

});