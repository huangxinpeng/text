/**
 * Created by baikaili on 2017/8/29.
 */

define([
    'jquery',
    'json',
    'bootstrap',
    'bootstrapValidator',
    'upload',
    'global',
    'router',
    'routerConfig',
    'config',
    'regular',
    'ajax',
    'common',
    'constant',
    'text!tpls/userAdd.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, upload, global, router, routerConfig, config,
    regular, ajax, common, constant, userAddTpl, footer) {
    return function() {
        var $userAddTpl = $(userAddTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($userAddTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            var fileFlag = [false, false, false];
            //证件照片上传
            $("#frontImg").click(function() {
                $("#frontUpload").trigger("click");
            });
            $("#frontUpload").on('change', function() {
                fileFlag[0] = checkImgFile($("#frontUpload"), $("#errorMsg0"));
            });

            $("#backImg").click(function() {
                $("#backUpload").trigger("click");
            });
            $("#backUpload").on('change', function() {
                fileFlag[1] = checkImgFile($("#backUpload"), $("#errorMsg1"));
            });
            $("#auth").click(function() {
                $("#authFile").trigger("click");
            });
            $("#authFile").on('change', function() {
                fileFlag[2] = checkImgFile($("#authFile"), $("#errorMsg2"));
            });
            //短信验证码获取
            $("#checkCodeGet").click(function() {
                var _this = $(this);
                getSMSCode(_this, "0010_110005", {
                    bussType: 'YH01'
                })
            });
            //页面btn提交
            $("#sbtUsr").on("click", function() {
                //手动触发验证
                var bootstrapValidator = $("#usrInfo").data('bootstrapValidator');
                bootstrapValidator.validate();
                if (!bootstrapValidator.isValid() || !fileFlag[0] || !fileFlag[1] || !fileFlag[2]) {
                    $("#errorMsg").show();
                    return;
                }
                //获取页面数据
                var obj = $("#usrInfo").serializeArray();
                var corpRoleIdList = [];
                $("input[name=role]:checked").each(function() {
                    corpRoleIdList.push($(this).val());
                });
                obj.push({ name: "corpRoleIdList", value: corpRoleIdList });
                obj.push({ name: "idTyp", value: "0" });
                obj.push({ name: "sysCode", value: "20" });
                obj.push({ name: "address", value: "20" });
                //校验数据

                var fileInfo = [{ "name": "attachDivFront", "id": "frontUpload" },
                    { "name": "attachDivBack", "id": "backUpload" },
                    { "name": "attachDivPoa", "id": "authFile" }
                ];
                fileUpload('0010_180005', fileInfo, obj, successFun);

            }).blur(function() {
                $("#errorMsg").hide();
            });

            function successFun() {
                pluginObj.alert("增加成功，待管理员审核");
                setTimeout(function() {
                    $("#userMgt").trigger("click");
                }, 500);
            }
            //校验
            $('#usrInfo').bootstrapValidator({
                message: 'This value is not valid',
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    usrNm: {
                        message: '用户名不能为空',
                        validators: {
                            notEmpty: {
                                message: '用户名不能为空'
                            }
                        }
                    },
                    role: {
                        message: '至少选择一个角色',
                        validators: {
                            notEmpty: {
                                message: '至少选择一个角色'
                            },
                            callback: { /*自定义*/
                                message: '管理员、操作员、复核员三种角色不能同时拥有',
                                callback: function(value, validator, $field) {
                                    var roles = [];
                                    $("[name=role]:checked").each(function() {
                                        roles.push($(this).val());
                                    });
                                    if (IFSCommonMethod.isContains(roles, "100") && IFSCommonMethod.isContains(roles, "200") && IFSCommonMethod.isContains(roles, "300")) {
                                        return false;
                                    } else {
                                        return true;
                                    }
                                }
                            }
                        }
                    },
                    mobile: {
                        message: '手机号码不合法',
                        validators: {
                            notEmpty: {
                                message: '手机号码不能为空'
                            },
                            regexp: {
                                regexp: /^(1)[0-9]{10}$/,
                                message: '身份证格式不对'
                            }
                        }
                    },
                    idNo: {
                        message: '身份证号码不合法',
                        validators: {
                            notEmpty: {
                                message: '身份证号码不能为空'
                            },
                            regexp: {
                                regexp: /^([1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3})|([1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X))$/,
                                message: '身份证格式不合法'
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

            $("#goBack").click(function() {
                $("#userMgt").trigger("click");
            });

        });
    }
});