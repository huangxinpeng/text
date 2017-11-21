/*
 * @Author: chengdan 
 * @Date: 2017-10-12 11:37:51 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-20 09:36:03
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
    'text!tpls/draftDisctProt.html',
    'text!tpls/../protocals/factoryingFinancingProtocal.html',
    'text!tpls/../protocals/factoryingFinancingProtocalWithRecourse.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, draftDisctProtTpl, factoryingFinancingProtocal, factoryingFinancingProtocalWithRecourse, footer) {
    return function(type, name, info, pageNum) {
        var $draftDisctProtTpl = $(draftDisctProtTpl)
        var $footer = $(footer);
        var $factoryingFinancingProtocal = $(factoryingFinancingProtocal);
        var $factoryingFinancingProtocalWithRecourse = $(factoryingFinancingProtocalWithRecourse);
        $('.content').empty();
        $('.content').append($draftDisctProtTpl);
        $('.content').append($footer);
        $('#protocolModalNo .scrollbar').append($factoryingFinancingProtocal);
        $('#protocolModalYes .scrollbar').append($factoryingFinancingProtocalWithRecourse);
        $(document).ready(function() {
            loadPro();

            function loadPro() {
                var spanNote;
                var time = IFSCommonMethod.getCurrentTime();
                type == "1" ? $("#txnType").text("融资待复核") : $("#txnType").text("融资撤销待复核");
                IFSCommonMethod.isContains(name, "融资协议") == true ?
                    $("#txnProType").text("融资协议列表") : $("#txnProType").text("融资通知列表");
                type == "1" ? (IFSCommonMethod.isContains(name, "融资协议") == true ?
                        spanNote = "待复核融资的协议列表" : spanNote = "待复核融资的通知列表") :
                    (IFSCommonMethod.isContains(name, "融资协议") == true ?
                        spanNote = "撤销待复核融资的协议列表" : spanNote = "撤销待复核融资的通知列表");
                $(".spanNote").text("您在此页面可查看" + spanNote);
                var obj = $("#protocol").children().eq(0); //隐藏的第一个模板元素
                var objStr = "";
                for (var i = 0; i < info.length; i++) {
                    objStr += "<div class='onePro'>";
                    obj.find(".id").text(info[i][0]);
                    obj.find(".drftNo").text(info[i][1]);
                    obj.find(".proName").text(name.substring(1).substring(0, name.length - 2));
                    obj.find(".time").text(time);
                    objStr += obj.html();
                    objStr += "</div><hr class='form-hr' />";
                }
                $("#protocol").html(objStr);
                initClick();
            }

            function initClick() {
                $(".onePro").on("click", function() {
                    $(window).IFSAjax({
                        code: "0010_320005",
                        data: { "id": $(this).find(".id").text() },
                        async: false,
                        complete: function(result) {
                            if (result.code == IFSConfig.resultCode) {
                                renderProtData(result.data, name);
                            } else {
                                pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                            }
                        },
                        error: function(status, XMLHttpRequest) {}
                    });
                });
            }

            $("#returnPre").on("click", function() {
                $("#draftDisct").attr("type", type);
                $("#draftDisct").attr("pageNum", pageNum);
                $("#draftDisct").attr("info", JSON.stringify(info));
                $('#draftDisct').trigger('click');
                type == "2" ? $("#retract").trigger('click') : $("#appr").trigger('click')
            });
        });
    }
});