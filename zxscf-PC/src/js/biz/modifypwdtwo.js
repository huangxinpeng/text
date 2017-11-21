/*
 * @Author: chengdan 
 * @Date: 2017-08-18 10:27:42 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-08-30 09:48:35
 */
define([
    'jquery',
    'json',
    'bootstrap',
    'MD5',
    'bootstrapValidator',
    'global',
    'router',
    'routerConfig',
    'config',
    'regular',
    'ajax',
    'common',
    'constant',
    'modifyPwdThree',
    'text!tpls/modifyPwdTwo.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, MD5, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, modifyPwdThree, modifyPwdTwoTpl, footer) {
    return function() {
        var $modifyPwdTwoTpl = $(modifyPwdTwoTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($modifyPwdTwoTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //图标样式
            $("#two").addClass("twoStep");

            //页面btn提交
            $("#threeToFourBtn").on("click", function() {
                var password = $("#password").val();
                var passwordC = hex_md5($("#passwordC").val());
                var passwordO = hex_md5($("#passwordO").val());
                var smsCode = $("#mobileValid").val();
                var data = { "oldPassWord": passwordO, "passWord": passwordC, smsCode: smsCode };                // if (validInput(passwordO, password, passwordC)) {
                //     modifyPwdThree();
                var bootstrapValidator = $("#grxxform").data('bootstrapValidator');
                bootstrapValidator.validate();
                if (!bootstrapValidator.isValid()) {
                    return;
                }
                $(window).IFSAjax({
                    code: "0010_120004",
                    method: "POST",
                    data: data,
                    lock: "threeToFourBtn",
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            modifyPwdThree();
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
                // }
            });
            //短信验证码获取
            $("#sendValid").click(function() {
                var _this = $(this);
                getSMSCode(_this, "0010_110005", {
                    bussType: 'MM01'
                })
            });
            //校验
            $('#grxxform').bootstrapValidator({
                message: 'This value is not valid',
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    passwordO: {
                        validators: {
                            notEmpty: {
                                message: '旧密码不能为空'
                            },
                            length: {
                                max: 20,
                                min: 6
                            },
                            regexp: {
                                regexp: /^(((?=.*[0-9])(?=.*[a-zA-Z])|(?=.*[0-9])(?=.*[^\s0-9a-zA-Z])|(?=.*[a-zA-Z])(?=.*[^\s0-9a-zA-Z]))[^\s]+)$/,
                                message: '旧密码由6-20位数字、字母和特殊字符中的至少两种组成'
                            }
                        }
                    },
                    password: {
                        validators: {
                            notEmpty: {
                                message: '新密码不能为空'
                            },
                            different: {
                                field: 'passwordO',
                                message: '新密码不能和旧密码相同'
                            },

                            length: {
                                max: 20,
                                min: 6
                            },
                            regexp: {
                                regexp: /^(((?=.*[0-9])(?=.*[a-zA-Z])|(?=.*[0-9])(?=.*[^\s0-9a-zA-Z])|(?=.*[a-zA-Z])(?=.*[^\s0-9a-zA-Z]))[^\s]+)$/,
                                message: '新密码由6-20位数字、字母和特殊字符中的至少两种组成'
                            }
                        }
                    },
                    passwordC: {
                        validators: {
                            notEmpty: {
                                message: '确认密码不能为空'
                            },
                            identical: {
                                field: 'password',
                                message: '确认密码和新密码不一致'
                            }
                        }
                    },
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
                        }
                    },
                }
            });

        });
    }
});