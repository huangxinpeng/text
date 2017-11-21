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
    'text!tpls/partner.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, partnerTpl, footer) {
    return function() {
        var $partnerTpl = $(partnerTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($partnerTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //初始化分页控件
            initPageComponent(loadData);
            var obj = {};
            obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize });
            loadData();
            //加载默认数据
            function loadData() {
                //获取page数据
                obj = $.extend(obj, getPageInfo());
                $(window).IFSAjax({
                    code: "0010_190001",
                    data: $.extend(obj, {}),
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            initOpponentList(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));;
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function initOpponentList(data) {
                setTotalPage(data.total, obj.pageNum, obj.pageSize); //设置分页
                if (data.list) {
                    var list = data.list;
                    var html = [];
                    for (var i = 0; i < list.length; i++) {
                        html.push('<tr data-custNo="' + list[i].custNo + '">' +
                            '<td>' + list[i].custNo + '</td>\
                        <td>' + list[i].custCnNm + '</td>\
                        <td>' + list[i].idTyp + '</td>\
                        <td>' + list[i].idNo + '</td>\
                        <td>\
                        <a class="red delete" href="#">删除</a>\
                        </td></tr>');
                    }
                    $("#opponentTab tbody").empty().append(html.join(""));
                    renderDataDic(); //加载页面数据字典
                    $("#noDataTip").css("display", "none");
                } else {
                    $("#opponentTab tbody").empty();
                    $("#noDataTip").css("display", "block");
                }
            }

            //新增用户
            $("#add").click(function() {
                $("#addOpponent").modal("show");
            });
            //查询企业
            $("#search").click(function() {
                //手动触发验证
                var bootstrapValidator = $("#opponentForm").data('bootstrapValidator');
                bootstrapValidator.validate();
                if (!bootstrapValidator.isValid()) {
                    return;
                }
                obj = $.extend(obj, $("#opponentForm").getData());
                $(window).IFSAjax({
                    code: "0010_190002",
                    data: $.extend({}, obj),
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            //pluginObj.alert("新增成功！");
                            renderEnInfo(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            });
            //新增企业
            $("#srchResult").on("click", ".radiusAddBtn", function() {
                obj.custNo = $(this).closest("li").attr("data-id");
                $(window).IFSAjax({
                    code: "0010_190003",
                    data: $.extend({}, obj),
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            $("#addOpponent").modal("hide");
                            pluginObj.alert("新增交易对手成功");
                            loadData();
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            });
            //删除用户
            $(".table").on("click", ".delete", function() {
                obj.custNo = $(this).closest("tr").attr("data-custno");
                //    请求数据
                pluginObj.confirm("删除交易对手", "确认要删除该交易对手？", function() {
                    //发请求
                    delOpponent(obj)
                }, function() {
                    //pluginObj.alert("已取消删除操作");
                })
            })

            function delOpponent(obj) {
                $(window).IFSAjax({
                    code: "0010_190004",
                    data: $.extend({}, searchObj, obj),
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            loadData();
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));;
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function renderEnInfo(data) {
                var html = [];
                var list = data.list;
                if (list && list.length > 0) {
                    $("#emptyPop").hide();
                    for (var i = 0; i < list.length; i++) {
                        html.push('<li data-id="' + list[i].custNo + '">' + list[i].custCnNm + '<span class="radiusAddBtn">+</span></li>');
                    }
                    $("#srchResult").empty().append(html.join(""));
                } else {
                    $("#srchResult").empty();
                    $("#emptyPop").show();
                }
            }
            $("#checkCode").focus(function() {
                if ($(this).val() == "") {
                    $("#emptyPop").hide();
                }
            });
            $("#addOpponent").on('hidden.bs.modal', function() {
                $("input[name=role]").prop("checked", false);
                $("input[type=text]").val("");
                $("#srchResult").empty();
                $("#opponentForm").data('bootstrapValidator').destroy();
                //校验
                $('#opponentForm').bootstrapValidator({
                    message: 'This value is not valid',
                    feedbackIcons: {
                        valid: 'glyphicon glyphicon-ok',
                        invalid: 'glyphicon glyphicon-remove',
                        validating: 'glyphicon glyphicon-refresh'
                    },
                    fields: {
                        custName: {
                            message: '查询企业名称不能为空',
                            validators: {
                                notEmpty: {
                                    message: '查询企业名称不能为空'
                                }
                            }
                        }
                    }
                });
            })

            //校验
            $('#opponentForm').bootstrapValidator({
                message: 'This value is not valid',
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    custName: {
                        message: '查询企业名称不能为空',
                        validators: {
                            notEmpty: {
                                message: '查询企业名称不能为空'
                            }
                        }
                    }
                }
            });

        });
    }
});