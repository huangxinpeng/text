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
    'select2',
    'common',
    'constant',
    'text!tpls/bankAcctAdd.html',
    'text!tpls/footer.html'
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, select2, common, constant, bankAcctAddTpl, footer) {
    return function() {
        var $bankAcctAddTpl = $(bankAcctAddTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($bankAcctAddTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            var defaults = {
                language: 'zh-CN',
                // minimumInputLength : 1,
                allowClear: true,
                placeholder: "请选择"
            };
            var options = $.extend(defaults, options);
            var url = "/esif-webapp/" + options.url;

            $("#openBrhCd").select2({
                allowClear: options.allowClear,
                placeholder: options.placeholder,
                ajax: {
                    method: 'post',
                    url: "/esif-webapp/current/qryBankInfo",
                    dataType: 'json',
                    delay: 500,
                    contentType: "application/json",
                    data: function(params) {
                        var p = $.extend({}, {
                            name: params.term, // search term
                            pageNum: IFSConfig.pageNum,
                            pageSize: 20,
                            "ip": "0000",
                            "sendmsgid": "0",
                            "tn": "0",
                            "sid": "0",
                            "si": "0",
                            "vertityTyp": "0",
                            "chlterminaltype": "20",
                            "senttime": new Date().getTime(),
                            "version": "1.0.0",
                            adr: ["110000", "120000", "310000", "500000", "710000", "810000", "820000"].indexOf($('[name=bankProvince]').val()) >= 0 ? $('[name=bankProvince]').find("option:selected").html() : $('[name=bankCity]').find("option:selected").html()
                        }, {});
                        return JSON.stringify(p);
                    },
                    processResults: function(result, params) {
                        var data = [];
                        if (result.data && result.data.length > 0) {
                            for (var i = 0; i < result.data.length; i++) {
                                data.push({ id: result.data[i]["bkNo"], text: result.data[i]["bkNm"] });
                            }
                        }
                        return {
                            results: data,
                        };
                    },
                    cache: true
                }
            });

            $("#addAccountBtn").click(function() {
                //手动触发验证
                var bootstrapValidator = $("#addAccount").data('bootstrapValidator');
                bootstrapValidator.validate();
                if (!bootstrapValidator.isValid()) {
                    $("#errorMsg").show();
                    return;
                }
                if (bootstrapValidator.isValid()) {
                    //表单提交的方法、比如ajax提交

                    $(window).IFSAjax({
                        code: "0010_170002",
                        method: 'POST', //是否默认银行账号新增时候都是否
                        data: $.extend($("#addAccount").getData(), { defRecNo: "0" }),
                        complete: function(result) {
                            if (result.code == IFSConfig.resultCode) {
                                pluginObj.alert("新增成功！");
                                setTimeout(function() {
                                    $("#bankAcct").trigger("click");
                                }, 500);
                            } else {
                                pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                            }
                        },
                        error: function(status, XMLHttpRequest) {}
                    });
                }
            });
            $("#addAccountBtn").blur(function() {
                $("#errorMsg").hide();
            });
            //省市下拉
            $("#sheng").getSelInfo('0010_110004', {
                parentId: "",
                areaType: "1"
            }, "areaId", "areaName", "请选择省");
            $("#sheng").change(function() {
                $("#shi").getSelInfo('0010_110004', {
                    parentId: $("#sheng").val(),
                    areaType: "2"
                }, "areaId", "areaName", "请选择市")
            });
            //校验
            $('#addAccount').bootstrapValidator({
                message: 'This value is not valid',
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    openAcctNm: {
                        message: '开户名称不能为空',
                        validators: {
                            notEmpty: {
                                message: '开户名称不能为空'
                            },
                            stringLength: {
                                max: 50,
                                message: '开户名称长度不能长于50位'
                            }
                        }
                    },
                    acctNo: {
                        message: '账号由16-19位合法银行账号组成',
                        validators: {
                            notEmpty: {
                                message: '银行账号不能为空'
                            },
                            regexp: {
                                regexp: /^(\d{16,19})$/,
                                message: '银行账号格式不合法'
                            }
                        }
                    },
                    openBrhNm: {
                        message: '开户行输入不合法',
                        validators: {
                            notEmpty: {
                                message: '开户行不能为空'
                            },
                            regexp: {
                                regexp: /^[\u4e00-\u9fa5]+银行$/,
                                message: '开户行名称不合法'
                            }
                        }
                    },
                    bankProvince: {
                        message: '开户行所在省不能为空',
                        validators: {
                            notEmpty: {
                                message: '开户行所在省不能为空'
                            }
                        }
                    },
                    bankCity: {
                        message: '开户行所在城市不能为空',
                        validators: {
                            notEmpty: {
                                message: '开户行所在城市不能为空'
                            }
                        }
                    },
                    openBrhCd: {
                        message: '开户支行不能为空',
                        validators: {
                            notEmpty: {
                                message: '开户支行不能为空'
                            }
                        }
                    },
                }
            });

        });
    }
});