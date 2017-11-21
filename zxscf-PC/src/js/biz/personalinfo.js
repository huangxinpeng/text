/*
 * @Author: chengdan 
 * @Date: 2017-08-25 10:49:20 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-10-09 15:17:40
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
    'uploadify',
    'text!tpls/personalInfo.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, uploadify, personalInfoTpl, footer) {
    return function() {
        var $personalInfoTpl = $(personalInfoTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($personalInfoTpl);
        $('.content').append($footer);
        $(document).ready(function() {

            getUserInfo();

            function getUserInfo() {
                $(window).IFSAjax({
                    code: "0010_150001",
                    method: "POST",
                    data: {},
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            renderUserInfo(result.data);
                            renderDataDic(); //加载页面数据字典
                        } else {}
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function renderUserInfo(data) {
                $(".contentDetailNew [name]").each(function() {
                    var nm = $(this).attr("name");
                    $(this).val(data[nm]);
                    $(this).html(data[nm]);
                });
                //头像

                if (IFSCommonMethod.isNotBlank(data.headImg)) {
                    $("#tx").attr("src", "/esif-webapp/current/viewAttach?id=" + data.headImg);
                }
                if (IFSCommonMethod.isNotBlank(data.idCardImgFont)) {
                    $("#frontImg").attr("src", "/esif-webapp/current/viewAttach?id=" + data.idCardImgFont);
                }
                if (IFSCommonMethod.isNotBlank(data.idCardImgReverse)) {
                    $("#backImg").attr("src", "/esif-webapp/current/viewAttach?id=" + data.idCardImgReverse);
                }
                //角色
                $("#roleList").empty();
                for (var i = 0; i < data.corpRoleIdList.length; i++) {
                    $("#roleList").append('<span dic-type="900001">' + data.corpRoleIdList[i] + '</span>');
                }
                //证件图片
            }

            //修改邮箱和地址
            $(".editinfo").each(function() {
                var _this = $(this);
                $(this).on("click", function() {
                    obj = {};
                    var inputEle = $(this).siblings("input");
                    if ($(this).text() == "编辑") {
                        inputEle.removeAttr("disabled");
                        _this.text("完成");
                        inputEle.trigger("focus");
                    } else {
                        //发送请求修改的接口
                        var nm = inputEle.attr("name");
                        obj[nm] = inputEle.val();
                        updUserInfo(nm);
                    }

                });
            }).siblings("input").blur(function(e) {
                e.preventDefault();
                if ($(this).prop("disabled") == true) {
                    return;
                }
            });

            function updUserInfo(nm) {
                //手动触发验证
                if (nm == "address") {
                    $("#usrInfoForm").bootstrapValidator("removeField", "email");
                } else if (nm == "email") {
                    $("#usrInfoForm").bootstrapValidator("removeField", "address");
                }
                var bootstrapValidator = $("#usrInfoForm").data('bootstrapValidator');
                bootstrapValidator.validate();
                if (!bootstrapValidator.isValid()) {
                    return;
                }
                $(window).IFSAjax({
                    code: "0010_150002",
                    method: "POST",
                    data: $.extend(obj, {}),
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            pluginObj.alert("信息更新成功！");
                            getUserInfo();

                            $(".editinfo").text("编辑").siblings("input").attr("disabled", "disabled").closest(".form-group").removeClass("has-success").removeClass("has-error").removeClass("has-feedback");
                            resetValidator();
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }

                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function resetValidator() {
                // //重新初始化校验
                $("#usrInfoForm").data('bootstrapValidator').resetForm(true);
                $("#usrInfoForm").bootstrapValidator("addField", "email", {
                    validators: {
                        notEmpty: {
                            message: '邮箱号不能为空'
                        },
                        regexp: {
                            regexp: /^([a-zA-Z0-9]+[_\-\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_\-\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
                            message: '邮箱格式不合法'
                        }
                    }
                });
                $("#usrInfoForm").bootstrapValidator("addField", "address", {
                    validators: {
                        notEmpty: {
                            message: '地址不能为空'
                        }
                    }
                });
            }

            $(function() {
                //头像上传
                var fileOption = {
                    attachCls: "YH",
                    attachDiv: "YH01",
                    attachSct: " ",
                    attachNm: '个人头像',
                    isImg: '1',
                    relBusiNo: " ",
                    fileUrl: "cust/"
                };

                function onSuccessFile($file, file, result) {
                    $("#tx").attr("src", "/esif-webapp/current/viewAttach?id=" + file);
                    $("#usrImg").attr("src", "/esif-webapp/current/viewAttach?id=" + file);
                    pluginObj.alert("头像上传成功");
                }
                $("#file").uploadify({
                    fileSizeLimit: "10MB",
                    formData: {},
                    height: 30,
                    width: 30,
                    buttonText: '修改',
                    multi: !!$("#file").attr("multiple"),
                    swf: '../js/uploadify/uploadify.swf',
                    uploader: "/esif-webapp/" + ("current/addAttach" || ""),
                    fileObjName: $("#file").attr("name") || 'file',
                    fileTypeExts: $("#file").attr("file-exts") || '*.jpg; *.png',
                    removeCompleted: false,
                    onUploadStart: function(file) {
                        var d = $.extend({ wjlx: $("#file").attr("file-type") }, fileOption);
                        $("#file").uploadify('settings', 'formData', d);
                    },
                    onUploadSuccess: function(file, result, response) {
                        if (response) {
                            if (result) {
                                var input = $('#' + this.settings.queueID + " #" + file.id).find(".dbid");
                                input.val(result);
                                onSuccessFile && onSuccessFile.call($("#file"), file, result);
                            }
                        }
                    },
                    onUploadError: function(file, errorCode, errorMsg) {
                        if (errorMsg == "413") {
                            $('#' + this.settings.queueID + " #" + file.id).find('.data').html('上传失败 - 文件大于上传大小限制!');
                        } else {
                            $('#' + this.settings.queueID + " #" + file.id).find('.data').html(' - 上传失败');
                        }
                    }
                });
            });

            renderDataDic();
            //校验
            $('#usrInfoForm').bootstrapValidator({
                message: 'This value is not valid',
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    email: {
                        message: '邮箱号码输入不合法',
                        validators: {
                            notEmpty: {
                                message: '邮箱号不能为空'
                            },
                            regexp: {
                                regexp: /^([a-zA-Z0-9]+[_\-\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_\-\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
                                message: '邮箱格式不合法'
                            }
                        }
                    },
                    address: {
                        message: '地址不能为空',
                        validators: {
                            notEmpty: {
                                message: '地址不能为空'
                            }
                        }
                    }
                }
            });
        });
    }
});