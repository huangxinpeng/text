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
    './bankAcctVerSucOne',
    'text!tpls/bankAcctVerOne.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, bankAcctVerSucOne, bankAcctVerOneTpl, footer) {
    return function(id) {
        var $bankAcctVerOneTpl = $(bankAcctVerOneTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($bankAcctVerOneTpl);
        $('.content').append($footer);

        $(document).ready(function() {
            var obj = {}; //查询参数
            obj.id = id;
            //获取银行账号信息
            getBankAccountInfo();

            function getBankAccountInfo() {

                $(window).IFSAjax({
                    code: "0010_170003",
                    method: "POST",
                    data: $.extend({}, obj),
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            initAccountInfo(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));;
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function initAccountInfo(data) {
                $("#verifySbt").attr("data-id", data.id);
                $("#dltAccount").attr("data-id", data.id);
                $("#openAcctNm").val(data.openAcctNm);
                $("#acctNo").val(data.acctNo);
                $("#openBrhNm").val(data.openBrhNm);
                $("#bankProvince").attr("data-value", data.bankProvince);
                $("#bankCity").attr("data-value", data.bankCity);
                $("#openBrhCd").val(data.openBrhCd);
                //省市下拉
                $("#bankProvince").getSelInfo('0010_110004', {
                    parentId: "",
                    areaType: "1"
                }, "areaId", "areaName", "请选择省");
                $("#bankProvince").change(function() {
                    $("#bankCity").getSelInfo('0010_110004', {
                        parentId: $("#bankProvince").val(),
                        areaType: "2"
                    }, "areaId", "areaName", "请选择市");
                }).trigger("change");
            }
            $("#bankProvince").change(function() {
                $("#bankCity").getSelInfo('0010_110004', {
                    parentId: $("#bankProvince").val(),
                    areaType: "2"
                }, "areaId", "areaName", "请选择市")
            });

            //删除银行账户
            $("#dltAccount").click(function() {
                var id = $(this).attr("data-id");
                pluginObj.confirm("删除账户", "您确认要删除账户？", function() {
                    //    发请求
                    delAcct(id);
                }, function() {})
            });

            function delAcct(id) {
                $(window).IFSAjax({
                    code: "0010_170006",
                    data: { id: id },
                    method: "POST",
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            pluginObj.alert("删除成功！");
                            setTimeout(function() {
                                $("#bankAcct").trigger("click");
                            }, 500);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));;
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            //获取验证码
            $("#checkCodeGet").click(function() {
                getSMSCode($(this), "0010_110005", {
                    bussType: "ZH02"
                })
            });

            //银行账号打款
            $("#verifySbt").click(function() {
                //手动触发验证
                var bootstrapValidator = $("#remitForm").data('bootstrapValidator');
                bootstrapValidator.validate();
                if (!bootstrapValidator.isValid()) {
                    $("#errorMsg").show();
                    return;
                }
                if (bootstrapValidator.isValid()) {
                    //表单提交的方法、比如ajax提交
                    $(window).IFSAjax({
                        code: "0010_170005",
                        data: $.extend($("#remitForm").getData(), { id: $(this).attr("data-id") }),
                        complete: function(result) {
                            if (result.code == IFSConfig.resultCode) {
                                pluginObj.alert("打款成功！");
                                setTimeout(function() {
                                    bankAcctVerSucOne();
                                }, 500);
                            } else {
                                pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));;
                            }
                        },
                        error: function(status, XMLHttpRequest) {}
                    });
                }

            });

            //校验
            $('#remitForm').bootstrapValidator({
                message: 'This value is not valid',
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    smsCode: {
                        message: '短信验证码不合法',
                        validators: {
                            notEmpty: {
                                message: '短信验证码不能为空'
                            },
                            stringLength: {
                                min: 6,
                                max: 6,
                                message: '短信验证码是6位数字'
                            },
                            regexp: {
                                regexp: /^\d{6}$/,
                                message: '验证码格式不合法'
                            }
                        }
                    }
                }
            });


        });
    }
});