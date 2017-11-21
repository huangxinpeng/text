/*
 * @Author: chengdan 
 * @Date: 2017-08-17 17:43:48 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-20 15:49:00
 */

/**图片验证码添加时间限制，防止不停点击向后台发送请求*/
var getPicCode = function(el) {
    if (window.getAuthCodeTimeout) {
        clearTimeout(window.getAuthCodeTimeout);
    }
    window.getAuthCodeTimeout = setTimeout(function() {
        //el.attr("src", "http://10.2.36.174:8080/esif-webapp/sys/code");
        el.attr("src", "/esif-webapp/sys/portal/getVertityCode" + "?t=" + new Date().getTime());
    }, 500);
};
//短信验证码
var getSMSCode = function(thisBtn, code, data) {
    data = data || {};
    window.clock = '';
    var nums = 120,
        btn;
    btn = thisBtn;

    function doLoop() {
        nums--;
        if (nums > 0) {
            btn.val(nums + '秒后可重新获取');
        } else {
            clearInterval(clock); //清除js定时器
            btn.prop("disabled", false).val('获取验证码').css("background", "#157df2");
            nums = 120; //重置时间
        }
    }

    $(window).IFSAjax({
        code: code,
        data: data,
        method: "POST",
        complete: function(result) {
            if (result.code == IFSConfig.resultCode) {
                btn.prop('disabled', true).val(nums + '秒后可重新获取').css("background", "gray"); //按钮设置为不可点
                clock = setInterval(doLoop, 1000); //一秒执行一次
            } else {
                pluginObj.alert("获取短信码失败");
            }
        },
        error: function(status, XMLHttpRequest) {
            pluginObj.alert("获取短信码失败");
        }
    });
};

var resetSMSBtn = function(btn) {
    if (window.clock) {
        clearInterval(window.clock);
        btn.prop("disabled", false).val('获取验证码').css("background", "#157df2");
        nums = 120; //重置时间
    }
};

//渲染下拉列表
(function($) {
    $.fn.renderSelStr = function(jsonArr, val, t, plrText) {
        var list = jsonArr,
            html = [];
        if (!(list || list.length)) return;
        if (IFSCommonMethod.isNotBlank(plrText)) {
            html.push('<option value="">' + plrText + '</option>');
        }
        for (var i = 0, len = list.length; i < len; i++) {
            if ($(this).attr("data-value") == list[i][val]) {
                var text = '<option selected value="' + list[i][val] + '">' + list[i][t] + '</option>';
            } else {
                var text = '<option value="' + list[i][val] + '">' + list[i][t] + '</option>';
            }
            html.push(text);
        }
        this.empty().append(html.join(""));
    };
})($);
//查询渲染下拉信息
(function($) {
    $.fn.getSelInfo = function(code, data, val, t, plrText) {
        var _this = this;
        $(window).IFSAjax({
            code: code,
            data: $.extend(data, {}),
            method: "POST",
            async: false,
            complete: function(result) {
                if (result.code == IFSConfig.resultCode) {
                    if (result.data.list && result.data.list.length > 0) {
                        _this.renderSelStr(result.data.list, val, t, plrText);
                    } else {
                        _this.empty().append('<option value="">' + plrText + '</option>' +
                            '<option value="">-----</option>');
                    }
                } else {
                    pluginObj.alert("获取信息失败");
                }
            },
            error: function(status, XMLHttpRequest) {

            }
        })
    }
})($);
//文件表单同时上传
/** * 说明：docOBj:[{"name":后台定义的存储名称，“id”：上传文件input ID}]
 * dataObj：向后台传输的有效数据* */
var fileUpload = function(code, docObj, dataObj, successFun, failFun) {
    var fileEl = new Array();
    for (var i = 0; i < docObj.length; i++) {
        var _docObj = $("#" + docObj[i]['id']);
        _docObj.attr("name", docObj[i]['name']);
        fileEl[i] = _docObj;
    }
    var senttime = new Date().getTime();
    $.ajaxFileUpload({
        code: code,
        fileElement: fileEl,
        loadId: 'loading',
        //交易码
        transcode: 'FILEUPLOAD',
        //渠道码
        channel: 'FILEUPLOAD',
        //是否传递会话token
        token: true,
        //验证码
        vc: '123456',
        type: "POST",
        timeout: 60000,
        dataType: "Document",
        data: dataObj.concat([{ name: "ip", value: "0000" },
            { name: "sendmsgid", value: "P" + senttime },
            { name: "tn", value: "0" },
            { name: "sid", value: "0" },
            { name: "si", value: "0" },
            { name: "vertityTyp", value: "0" },
            { name: "userid", value: "0" },
            { name: "chlterminaltype", value: "20" },
            { name: "senttime", value: senttime },
        ]),
        msgShow: '#profileShow',
        callBackFn: function(msg) {
            if (msg.code == IFSConfig.resultCode) {
                successFun && successFun();
            } else {
                pluginObj.alert(IFSCommonMethod.getErrorMsg(msg.message));
            }
        }
    });
    //uploadPreview(docObj, preview, width, height);//图片预览在上传时实现
};

//图片上传校验方法
function checkImgFile($ele, $error, msg) {
    var rightFileType = new Array('jpg', 'png', 'jpeg');
    var fileType = $ele.val().substring($ele.eq(0).val().lastIndexOf('.') + 1);
    if (rightFileType.indexOf(fileType.toLowerCase()) < 0) {
        if (msg) {
            $error.show().find(".fileErr").html(msg + "只支持图片文件上传！");
        } else {
            $error.show().find(".fileErr").html("证件只支持图片文件上传！");
        }
        $ele.on('change', function() {
            checkImgFile($ele, $error, msg);
        });
        return false;
    }
    var file_size = 0;
    if ($.support.msie && !$ele[0].files) {
        var file_path = $ele[0].value;
        var file_system = new ActiveXObject("Scripting.FileSystemObject");
        var file = file_system.GetFile(file_path);
        file_size = file.Size;
    } else {
        file_size = $ele[0].files[0].size;
    }
    var size = file_size / 1024 / 1024;
    if (size > 5) {
        if (msg) {
            $error.show().find(".fileErr").html(msg + "上传的文件大小不能超过5M！");
        } else {
            $error.show().find(".fileErr").html("证件上传的文件大小不能超过5M！");
        }
        $ele.on('change', function() {
            checkImgFile($ele, $error, msg);
        });
        return false;
    }
    $ele.on('change', function() {
        checkImgFile($ele, $error, msg);
    });
    $error.hide();
    return true;
}
//获取表单数据
(function($) {
    //serializeObject将表单元素值包装成对象形式
    $.fn.getData = function(param) {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(decodeURIComponent(this.value));
            } else {
                o[this.name] = decodeURIComponent(this.value);
            }
        });
        return $.extend(o, param);
    }
})($);
//获取URL参数
var getParams = function() {
    var hrefStr = window.location.href;
    var paramObj = {};
    if (hrefStr.indexOf("?") > -1) {
        var paramArr = decodeURI(decodeURI(hrefStr.split("?")[1])).split("&");
        for (var i = 0; i < paramArr.length; i++) {
            paramObj[paramArr[i].split("=")[0]] = paramArr[i].split("=")[1];
        }
    }
    return paramObj;
};

//加载数据字典
var renderDataDic = function() {
    var ddicMap = {};
    var ddicArray = {};
    var DDIC_KEY = "dic-type",
        DDIC_DEF_KEY = "dic-selected",
        DDIC_EVENT_READY = "dic-ready",
        DDIC_PLACEHODER_KEY = "dic-blank";

    function renderSelect() {
        $("select[" + DDIC_KEY + "]").each(function() {
            var selectUI = $(this);
            selectUI.empty();
            var dt = selectUI.attr(DDIC_KEY);
            var data = ddicArray[dt] || [];
            var optionHTML = [];
            //var placeHlr = selectUI.attr(DDIC_PLACEHODER_KEY);
            //if (placeHlr) {
            optionHTML.push("<option value=''>" + "请选择" + "</option>");
            //}
            for (var i = 0; i < data.length; i++) {
                optionHTML.push("<option value='" + data[i].dataNo + "' " + (selectUI.attr(DDIC_DEF_KEY) == data[i].dataNo ? "selected" : "") + ">" + data[i].dataName + "</option>");
            }
            selectUI.append(optionHTML.join(''));
            selectUI.removeAttr(DDIC_KEY);
        });
    }

    function renderSelectDiv() {
        $("div[" + DDIC_KEY + "]").each(function(i) {
            var t = $(this);
            var dt = t.attr(DDIC_KEY);
            var $data = $._data(this);
            if ($data.events && $data.events[DDIC_EVENT_READY]) {
                var data = ddicArray[dt];
                t.trigger(DDIC_EVENT_READY, [t, dt, data]);
            }
        });
    }

    function renderTable() {
        var tables = $("table");
        tables.each(function() {
            if ($(this).find("th[" + DDIC_KEY + "]").length > 0) {
                var table = $(this);
                table.find("th").each(function(i) {
                    var th = $(this);
                    var dt = th.attr(DDIC_KEY);
                    if (dt && ddicMap[dt]) {
                        table.find("td:nth-child(" + (i + 1) + ")").each(function() {
                            var val = this.innerText.trim();
                            var text = ddicMap[dt][val] || val;
                            this.innerText = text;
                        });
                    }
                });
            }

        });

    }

    function renderTableDiv() {
        $("div[" + DDIC_KEY + "]").each(function(i) {
            var t = $(this);
            var dt = t.attr(DDIC_KEY);
            var $data = $._data(this);
            if ($data.events && $data.events[DDIC_EVENT_READY]) {

            } else if (dt && ddicMap[dt]) {
                var val = t.text().trim();
                var text = ddicMap[dt][val] || val;
                t.text(text);
            }
        });
    };

    function renderInput() {
        $("input[" + DDIC_KEY + "]").each(function(i) {
            var t = $(this);
            var dt = t.attr(DDIC_KEY);
            var $data = $._data(this);
            if ($data.events && $data.events[DDIC_EVENT_READY]) {

            } else if (dt && ddicMap[dt]) {
                var val = t.val().trim();
                var text = ddicMap[dt][val] || val;
                t.val(text);
            }
        });
        $("span[" + DDIC_KEY + "]").each(function(i) {
            var s_tagName = this.tagName;
            var t = $(this);
            var dt = t.attr(DDIC_KEY);
            var $data = $._data(this);
            if ($data.events && $data.events[DDIC_EVENT_READY]) {

            } else if (dt && ddicMap[dt]) {
                var val = t.text().trim();
                var text = ddicMap[dt][val] || val;
                t.text(text);
            }
        });

    };


    /* 渲染指定的UI，加载数据字典 */
    function renderUIByDataDic() {
        var dictype = [];
        $("[" + DDIC_KEY + "]").each(function() {
            var $this = $(this);
            var dt = $this.attr(DDIC_KEY);
            if ($.inArray(dt, dictype) == "-1") {
                dictype.push(dt);
                // ddicMap[dt] = {};
                // ddicArray[dt] = [];
            }
        });
        if (dictype.length > 0) {
            loadDataDic(dictype.join(","), function() {
                //renderSelect();
                //renderSelectDiv();
                renderTable();
                //renderTableDiv();
                renderInput()
            });
        }
    }

    function loadDataDic(dicType, fn) {
        $(window).IFSAjax({
            code: "0010_110003",
            method: "POST",
            data: {
                "typNoS": dicType,
                "pageNum": 1,
                "pageSize": 20
            },
            async: false,
            complete: function(result) {
                if (result.code == IFSConfig.resultCode && result.data.list != null && result.data.list.length > 0) {
                    var list = result.data.list;
                    for (var j = 0; j < list.length; j++) {
                        var dicTyp = list[j].dataTypeNo;

                        ddicMap[dicTyp] = ddicMap[dicTyp] || {};
                        ddicArray[dicTyp] = ddicArray[dicTyp] || [];

                        var data = list[j];
                        ddicMap[dicTyp][data.dataNo] = data.dataName;
                        ddicArray[dicTyp].push({ dataNo: data.dataNo, dataName: data.dataName });
                    }
                    // 请求成功处理逻辑
                    fn && fn();
                }
            }
        });

    }

    $(renderUIByDataDic);
    window.renderTableByDataDic = renderTable;
    window.renderTableDivByDataDic = renderTableDiv;
    window.renderInput = renderInput;
};
//kkpager插件
var searchObj = {
    totalPage: 1, // 总页码
    recordsTotal: 1, // 总记录数目
    pageNum: IFSConfig.pageNum, // 当前页
    pageSize: IFSConfig.pageSize // 每页数目
};
var initPager = function(code, param, successFun, pagerid) {
    // 初始化分页
    kkpager.generPageHtml({
        pagerid: pagerid || "kkpager",
        isShowFirstPageBtn: true,
        isShowLastPageBtn: true,
        isGoPage: false,
        pno: searchObj.pageNum,
        mode: 'click', // 设置为click模式
        // 总页码
        total: searchObj.totalPage,
        // 总数据条数
        totalRecords: searchObj.recordsTotal,
        // 点击页码、页码输入框跳转、以及首页、下一页等按钮都会调用click
        click: function(n) {
            // 处理完后可以手动条用selectPage进行页码选中切换
            searchObj.pageNum = param.pageNum = n; //切换页码
            this.selectPage(n);
            $(window).IFSAjax({
                code: code,
                data: $.extend({}, param, searchObj),
                complete: function(result) {
                    if (result.code == IFSConfig.resultCode) {
                        if (result.data.list) {
                            successFun & successFun();
                        }

                    } else {
                        pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                    }
                },
                error: function(status, XMLHttpRequest) {}
            });
        }
    }, true);
};


//给予dateTimePicker的日期插件

// 日期插件
var dataPiker = function(options) {
    $('.form-date').datetimepicker($.extend({
        format: 'yyyy-mm',
        linkFormat: 'yyyymm',
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        forceParse: 0,
        pickerPosition: "bottom-left",
        startView: 3,
        minView: 3
    }, options));
};

//datapicker清空操作
$("body").on("blur", ".date input", function() {
    if ($(this).val() == "") {
        var id = $(this).parent().attr("data-link-field");
        $("#" + id).val("");
    }
});

/**
 * 页面校验显示隐藏错误提示
 */
var showErrorClass = function(v) {
    if (IFSConfig.entType === v) {
        $("#errorMsgIcon").removeClass("error_hidden").addClass("error_show");
    }
    if (IFSConfig.perType === v) {
        $("#perrorMsgIcon").removeClass("error_hidden").addClass("error_show");
    }

};
var hiddenErrorClass = function(v) {
    if (IFSConfig.entType === v) {
        $("#errorMsgIcon").removeClass("error_show").addClass("error_hidden");
    }
    if (IFSConfig.perType === v) {
        $("#perrorMsgIcon").removeClass("error_show").addClass("error_hidden");
    }
};

//初始化分页
var initPageComponent = function(callback) {
    $("#pageIndex").text(1);
    $("#firstPage").attr("disabled", "disabled");
    $("#prePage").attr("disabled", "disabled");

    $("li>button").each(function() {
        $(this).off("click").on("click", function() {
            switch ($(this).attr("id")) {
                case "firstPage": //首页
                    $("#pageIndex").text(1);
                    break;
                case "prePage": //上一页
                    $("#pageIndex").text(parseInt($("#pageIndex").text()) - 1);
                    break;
                case "nextPage": //下一页
                    $("#pageIndex").text(parseInt($("#pageIndex").text()) + 1);
                    break;
                case "lastPage": //尾页
                    $("#pageIndex").text($("#totalPage").text());
                    break;
            }
            callback();
            $("#checkAll").prop("checked", false);
            uncheck($("#checkAll"));
            pageIndex = $("#pageIndex").text();
            totalPage = $("#totalPage").text();
            changePageBtnStatus(pageIndex, totalPage);
        });
    });

    $("#pageSize").on("change", function() {
        $("#pageIndex").text(1);
        callback();
        pageIndex = $("#pageIndex").text();
        totalPage = $("#totalPage").text();
        changePageBtnStatus(pageIndex, totalPage);

    });
}

//更新分页按钮状态
function changePageBtnStatus(pageIndex, totalPage) {
    if (pageIndex == "1") {
        $("#prePage").attr("disabled", "disabled");
        $("#firstPage").attr("disabled", "disabled");
    } else {
        $("#prePage").removeAttr("disabled");
        $("#firstPage").removeAttr("disabled");
    }
    if (pageIndex == totalPage) {
        $("#nextPage").attr("disabled", "disabled");
        $("#lastPage").attr("disabled", "disabled");
    } else {
        $("#nextPage").removeAttr("disabled");
        $("#lastPage").removeAttr("disabled");
    }
}

var setTotalPage = function(total, pageNum, pageSize) {
    if (IFSCommonMethod.isNotBlank(total)) {
        if (total % pageSize > 0) {
            $("#totalPage").text(Math.ceil(total / pageSize));
        } else if (total / pageSize > 0) {
            $("#totalPage").text(total / pageSize);
        } else {
            $("#totalPage").text(1);
        }
        if (pageNum == $("#totalPage").text()) {
            $("#nextPage").attr("disabled", "disabled");
            $("#lastPage").attr("disabled", "disabled");
        } else {
            $("#nextPage").removeAttr("disabled");
            $("#lastPage").removeAttr("disabled");
        }
    }
    if (total == "0") {
        $("#checkAll").attr("disabled", "disabled");
    } else {
        $("#checkAll").removeAttr("disabled");
    }
}

var getPageInfo = function() {
    var obj = {};
    obj.pageNum = $("#pageIndex").text();
    obj.pageSize = $("#pageSize").find("option:selected").text();
    return obj;
}

//初始化checkbox  根据type类型绑定单元的事件  
//type=0--宝券编号变色+绑定事件  
//type=1--绑定事件 
//type=2--一转多显示选择企业 
//type=3--待办任务tab跳转
//type=4--宝券融资勾选总金额
var initCheckBoxComponent = function(ids, type, callback) {
    //checkbox 
    $("input:checkbox").on("click", function() {
        if ($(this).attr("id") != "checkAll") {
            if ($(this).is(':checked') == true) {
                check(this);
            } else {
                uncheck(this);
                switch (type) {
                    case 0:
                        $(this).parents("tr").children().eq(1).css("color", "");
                    case 1:
                        $(this).parents("td").siblings().css("cursor", "");
                        $(this).parents("td").siblings().unbind("click");
                        break;
                }
            }
            checkEvent(type);
        }
    });

    //全部选中
    $("#checkAll").on("click", function() {
        if ($("#checkAll").is(':checked') == true) {
            $("input:checkbox").each(function() {
                $(this).prop('checked', true);
                check(this);
            });
        } else {
            $("input:checkbox").each(function() {
                $(this).prop('checked', false);
                uncheck(this);

            });
        }
        checkEvent(type);
    });

    //初始化选中的数据
    if (IFSCommonMethod.isNotBlank(ids)) {
        $("input:checkbox").each(function() {
            if ($(this).attr("id") != "checkAll") {
                var id;
                if (IFSCommonMethod.isNotBlank($(this).parents("tr").attr("data-id"))) {
                    id = $(this).parents("tr").attr("data-id");
                } else {
                    id = $(this).parents("td").next().text();
                }
                if (ids.indexOf(id) > -1) {
                    $(this).prop('checked', true);
                    check(this);
                }
                checkEvent(type);
            }
        });
    }

    function checkEvent(type) {
        //一转多显示选择企业
        if (type == 2) {
            showCustName();
        }

        //宝券融资勾选总金额
        if (type == 4) {
            $("#checkedAmt").text(getCheckedDrftAmt());
        }

        //只有一条数据被选中时才绑定行事件
        if (getCheckedNum() == 1) {
            $("input:checkbox").each(function() {
                if ($(this).attr("id") != "checkAll") {
                    if ($(this).is(':checked') == true) {
                        switch (type) {
                            case 0:
                                $(this).parents("tr").children().eq(1).css("color", "#1093f4");
                                $(this).parents("td").siblings().css("cursor", "pointer");
                                $(this).parents("td").siblings().on("click", function() {
                                    callback($(this).parents("tr").attr("data-id"));
                                });
                                break;
                            case 1:
                                $(this).parents("td").siblings().css("cursor", "pointer");
                                $(this).parents("td").siblings().on("click", function() {
                                    callback(getCheckedInfo());
                                });
                                break;
                            case 3:
                                $(this).parents("tr").children().eq(1).css("color", "#1093f4");
                                $(this).parents("td").siblings().css("cursor", "pointer");
                                $(this).parents("td").siblings().on("click", function() {
                                    $(this).parents("tr").children().eq(1).css("color", "#1093f4");
                                    callback($(this).parents("tr").attr("data-id"), $(".btnActive").attr("id"));
                                });
                                break;
                        }
                        return false;
                    }
                }
            });
        } else {
            $("input:checkbox").each(function() {
                $(this).parents("tr").children().eq(1).css("color", "");
                $(this).parents("tr").children().eq(0).css("color", "#333333");
                $(this).parents("td").siblings().css("cursor", "");
                $(this).parents("td").siblings().unbind("click");
            });
        }

        //没有全选时，去除checkall勾选
        if (getUncheckedNum() > 0) {
            $("#checkAll").prop("checked", false);
            uncheck($("#checkAll"));
        }

        //全部选中时
        if (getUncheckedNum() == 0) {
            $("#checkAll").prop("checked", true);
            check($("#checkAll"));
        }
    }
}



//选中
function check(obj) {
    $(obj).css("background-color", "#1094f5");
    $(obj).css("border", "none");
    $(obj).siblings("label").css("background-color", "#1094f5");
    $(obj).siblings("label").css("border", "none");
}

//未选中
function uncheck(obj) {
    $(obj).css("background-color", "");
    $(obj).css("border", "2px solid #999999");
    $(obj).siblings("label").css("background-color", "");
    $(obj).siblings("label").css("border", "2px solid #999999");
}

//获取选中数目
function getCheckedNum() {
    var flag = 0;
    $("input:checkbox").each(function() {
        if ($(this).attr("id") != "checkAll") {
            if ($(this).is(':checked') == true) {
                flag++;
            }
        }
    });
    return flag;
}

//获取没有选中数目
function getUncheckedNum() {
    var flag = 0;
    $("input:checkbox").each(function() {
        if ($(this).attr("id") != "checkAll") {
            if ($(this).is(':checked') == false) {
                flag++;
            }
        }
    });
    return flag;
}

//一转多显示选择企业
function showCustName() {
    var objStr = "";
    $("input:checkbox").each(function() {
        if ($(this).attr("id") != "checkAll") {
            if ($(this).is(':checked') == true) {
                var custNo = $(this).parents("tr").children().eq(1).text();
                var custName = $(this).parents("tr").children().eq(2).text();
                objStr += "<span><i hidden>" + custNo + ",</i>" + custName + "</span>";
            }
        }
    });
    $(".selectCustName").html(objStr);
    if (objStr != "") {
        $(".selectCust").css("display", "block");
    } else {
        $(".selectCust").css("display", "none");
    }
}


//是否选择了一条数据
var isChecked = function() {
    var flag = false;
    $("input:checkbox").each(function() {
        if ($(this).attr("id") != "checkAll") {
            if ($(this).is(':checked') == true) {
                flag = true;
                return false;
            }
        }
    });
    return flag;
}

//获取选中的宝券编号
var getCheckedDrftNo = function() {
    var drftNo = "";
    $("input:checkbox").each(function() {
        if ($(this).attr("id") != "checkAll") {
            if ($(this).is(':checked') == true) {
                drftNo += $(this).parents("td").next().text() + ","
            }
        }
    });
    if (drftNo != "") {
        drftNo = drftNo.substring(0, drftNo.length - 1);
    }
    return drftNo;
}

//获取选中的宝券金额
var getCheckedDrftAmt = function() {
    var amts = 0;
    $("input:checkbox").each(function() {
        if ($(this).attr("id") != "checkAll") {
            if ($(this).is(':checked') == true) {
                var num;
                if (IFSCommonMethod.isNotBlank($(this).parents("tr").attr("data-id"))) {
                    num = IFSCommonMethod.unFormatMoney($(this).parents("tr").children().eq(2).text());
                } else {
                    num = IFSCommonMethod.unFormatMoney($(this).parents("tr").children().eq(3).text());
                }
                amts += parseFloat(num);
            }
        }
    });
    return IFSCommonMethod.formatMoney(amts);
}

var getCheckedInfo = function() {
    var info = [];
    $("input:checkbox").each(function() {
        if ($(this).attr("id") != "checkAll") {
            if ($(this).is(':checked') == true) {
                var list = {};
                var i = 0;
                if (IFSCommonMethod.isNotBlank($(this).parents("tr").attr("data-id"))) {
                    list[i] = $(this).parents("tr").attr("data-id");
                    i++;
                }
                $(this).parents("td").siblings().each(function() {
                    list[i] = $(this).text();
                    i++;
                });
                info.push(list);
            }
        }
    });

    return info;
}

var initOrderComponent = function(callback) {
    $(".glyphicon-triangle-top").css("color", "#cccccc");
    $(".glyphicon-triangle-bottom").css("color", "#1094f5");
    var condition;
    $(".order").each(function() {
        $(this).on("click", function() {
            if ($(this).children().eq(0).css("color").colorHex() == "#1094f5") {
                $(this).children().eq(0).css("color", "#cccccc");
                $(this).children().eq(1).css("color", "#1094f5");
            } else {
                $(this).children().eq(0).css("color", "#1094f5");
                $(this).children().eq(1).css("color", "#cccccc");
            }
            condition = $(this).attr("id") == "amt" ? ($(this).children().eq(0).css("color").colorHex() == "#1094f5" ? "03" : "04") :
                ($(this).children().eq(0).css("color").colorHex() == "#1094f5" ? "01" : "02");
            callback(condition);
        });
    });
}

var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*RGB颜色转换为16进制*/
String.prototype.colorHex = function() {
    var that = this;
    if (/^(rgb|RGB)/.test(that)) {
        var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        var strHex = "#";
        for (var i = 0; i < aColor.length; i++) {
            var hex = Number(aColor[i]).toString(16);
            if (hex === "0") {
                hex += hex;
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = that;
        }
        return strHex;
    } else if (reg.test(that)) {
        var aNum = that.replace(/#/, "").split("");
        if (aNum.length === 6) {
            return that;
        } else if (aNum.length === 3) {
            var numHex = "#";
            for (var i = 0; i < aNum.length; i += 1) {
                numHex += (aNum[i] + aNum[i]);
            }
            return numHex;
        }
    } else {
        return that;
    }
};


//模态框radio
var initModalRadioComponent = function() {
    $("#read").click(function() {
        if ($(this).siblings("div").children("span").hasClass("active")) {
            $(this).siblings("div").children("span").removeClass("active");
        } else {
            $(this).siblings("div").children("span").addClass("active");
        }
    });
}

//初始化单选按钮
var ininRadioComponent = function(drftId, custNo) {
    $("input[name=txnRadio]").click(function() {
        $(this).siblings("div").children("span").addClass("active");
        $(this).parents("tr").siblings("tr").find("span").removeClass("active");
    });

    if (IFSCommonMethod.isNotBlank(drftId)) {
        $("input[name=txnRadio]").each(function() {
            if ($(this).parents("td").next().text() == drftId) {
                $(this).attr('checked', true);
                $(this).siblings("div").children("span").addClass("active");
            }
        });
    }

    if (IFSCommonMethod.isNotBlank(custNo)) {
        $("input[name=txnRadio]").each(function() {
            if ($(this).parents("td").next().text() == custNo) {
                $(this).attr('checked', true);
                $(this).siblings("div").children("span").addClass("active");
            }
        });
    }
}

//单选是否选中数据
var isRadioChecked = function() {
    var flag = false;
    $("input[name=txnRadio]").each(function() {
        if ($(this).is(':checked') == true) {
            flag = true;
            return false;
        }
    });
    return flag;
}

var getRadioInfo = function() {
    var info = [];
    $("input[name=txnRadio]").each(function() {
        if ($(this).is(':checked') == true) {
            var list = {};
            var i = 0;
            $(this).parents("td").siblings().each(function() {
                list[i] = $(this).text();
                i++;
            });
            info.push(list);
            return false;
        }
    });
    return info;
}

//延期加减
var initAddAndSubtract = function(type) {
    $(".subtract").on("click", function() {
        var n = $(this).next().text();
        var num = parseInt(n) - 1;
        if (num == -1) { return }
        $(this).next().text(num);
        var m = $(this).parents("span").prev().find(".dueDaysNew").text();
        var num1 = parseInt(m) - 1;
        $(this).parents("span").prev().find(".dueDaysNew").text(num1);
        var txnAmt = IFSCommonMethod.unFormatMoney($(this).parents(".oneItem").prev().find(".txnAmt").val());
        $(this).parents(".oneItem").next().find(".bouns").text(new Number(num * txnAmt * 4.35 / 36000).toFixed(2));
    });

    $(".add").click(function() {
        var n = $(this).prev().text();
        var num = parseInt(n) + 1;
        if (num == 0) { return; }
        $(this).prev().text(num);
        var m = $(this).parents("span").prev().find(".dueDaysNew").text();
        var num1 = parseInt(m) + 1;
        $(this).parents("span").prev().find(".dueDaysNew").text(num1);
        var txnAmt = IFSCommonMethod.unFormatMoney($(this).parents(".oneItem").prev().find(".txnAmt").val());
        $(this).parents(".oneItem").next().find(".bouns").text(new Number(num * txnAmt * 4.35 / 36000).toFixed(2));
    });

    $(".txnAmt").on("blur", function() {
        //计算余额
        var txnAmtSum = IFSCommonMethod.unFormatMoney($("#txnAmtSum").text());
        var txnAmt = IFSCommonMethod.unFormatMoney($(this).val());
        if (!IFSCommonMethod.isNotBlank(txnAmt)) {
            pluginObj.alert("请输入转让金额");
            return;
        }
        //校验格式
        if (!IFSRegular.regular(IFSRegularExp.appAmt, txnAmt)) {
            pluginObj.alert("转让金额格式不正确，请重新输入");
            return;
        }
        var total = 0;
        $(".txnAmt").each(function() {
            var num = parseFloat(IFSCommonMethod.unFormatMoney($(this).val()));
            total += num;
        })
        total = IFSCommonMethod.unFormatMoney(IFSCommonMethod.formatMoney(total));
        if (type == "3") {
            var validAmt = IFSCommonMethod.unFormatMoney($(this).parents(".oneItem").prev().find(".validAmt").text());
            if (IFSCommonMethod.compareMoney(validAmt, txnAmt) == 0) {
                pluginObj.alert("转让金额不能大于可用金额！");
                return;
            }
        } else {
            if (IFSCommonMethod.compareMoney(txnAmtSum, total) == 0) {
                pluginObj.alert("转让金额不能大于可用金额！");
                return;
            }
            $("#remainSum").text(IFSCommonMethod.formatMoney(txnAmtSum - total));
        }
        $(this).val(IFSCommonMethod.formatMoney($(this).val()));

        //计算金币
        var isDelay = $(this).parents(".oneItem").next().find(".isDelay").text();
        $(this).parents(".oneItem").next().next().find(".bouns").text(new Number(isDelay * txnAmt * 4.35 / 36000).toFixed(2));
    });
}

//校验查询数据
function checkQuery(obj) {
    if (IFSCommonMethod.isNotBlank(obj.startAmt)) {
        if (!IFSRegular.regular(IFSRegularExp.appAmt, obj.startAmt)) {
            pluginObj.alert("起始金额格式不正确，请重新输入");
            return false;
        }
    }
    if (IFSCommonMethod.isNotBlank(obj.endAmt)) {
        if (!IFSRegular.regular(IFSRegularExp.appAmt, obj.endAmt)) {
            pluginObj.alert("终止金额格式不正确，请重新输入");
            return false;
        }
    }

    if (IFSCommonMethod.isNotBlank(obj.startAmt) && IFSCommonMethod.isNotBlank(obj.endAmt)) {
        if (IFSCommonMethod.compareMoney(obj.startAmt, obj.endAmt) == 2) {
            pluginObj.alert("起始金额必须小于终止金额，请重新输入");
            return false;
        }
    }

    if (IFSCommonMethod.isNotBlank(obj.startDate) && IFSCommonMethod.isNotBlank(obj.endDate)) {
        startDate = IFSCommonMethod.formatDate(obj.startDate);
        endDate = IFSCommonMethod.formatDate(obj.endDate);
        if (!IFSCommonMethod.compareDate(startDate, endDate)) {
            pluginObj.alert("起始日期必须小于终止日期，请重新输入");
            return false;
        }
    }
    return true;
}

//初始化查询弹框
var initQueryContent = function() {
    $(".condQueryContent").css("display", "none");
    $(".conditionQuery").on("click", function() {
        if ($(".condQueryContent").css("display") == "none") {
            $(".condQueryContent").css("display", "block");
            $(".condQueryContent").css("margin-bottom", "20px");
            $(".conditionQuery").children().eq(2).css("transform", "rotate(180deg)");
        } else {
            $(".condQueryContent").css("display", "none");
            $(".conditionQuery").children().eq(2).css("transform", "rotate(0deg)");
        }
    });
}

//页面加载初始化数据
//type=1--btn
//type=2-query
var initPage = function(type) {
    $("#main").css("display", "block");
    $("#success").css("display", "none");
    if (type == 1) {
        $("#btn").css("display", "block");
    } else if (type == 2) {
        $("#query").css("display", "block");
    }
}

//操作成功后页面初始化
//$modal 模态框
//type 1--btn type=2-query type=3-转让
//drftNo 宝券编号
//amt 转让金额
//appr 1-转让，2-转让撤销，3-融资，4-融资撤销
//task 任务数
var initSuccPage = function($modal, type, drftNo, amt, appr, task) {
    $modal.modal("hide");
    $("#main").css("display", "none");
    $("#success").css("display", "block");
    var $drft = $("#drftNoSucc");
    var $amt = $("#amtSucc");
    if (IFSCommonMethod.isNotBlank(appr)) {
        var tipSucc = "";
        var show = true;
        appr == 1 ? (tipSucc = "转让复核成功！", $drft = null, $amt = $("#amtSuccOne")) :
            (appr == 2 ? (tipSucc = "转让撤销复核成功！", show = false) :
                (appr == 3 ? (tipSucc = "融资复核成功！", $drft = $("#drftNoSuccOne"), $amt = $("#amtSuccOne")) :
                    (tipSucc = "融资撤销复核成功！", show = false)));
        $("#tipSucc").text(tipSucc);
        $("#contentSuccOne").css("display", show ? "block" : "none");
        $("#contentSuccTwo").css("display", show ? "none" : "block");
    }
    if (IFSCommonMethod.isNotBlank(task)) {
        task == 1 ? renderTask(1) : (task == 2 ? renderTask(2) : (task == 3 ? renderTask(3) : ""));
    }
    IFSCommonMethod.isNotBlank(drftNo) && $drft ? $drft.text(drftNo) : "";
    IFSCommonMethod.isNotBlank(amt) ? $amt.text(amt) : "";
    if (type == 1) {
        $("#btn").css("display", "none");
    } else if (type == 2) {
        $("#query").css("display", "none");
    } else if (type == 3) {
        $("#success").find("img").before($(".procedureTxn"));
        $("#three").removeClass("threeStep1");
        $("#four").addClass("fourStep1");
        $(".spanTitle a").text("转让成功");
    }
}

//驳回成功后操作-待办
//$modal 模态框
//$obj 提示框
//$page 跳转主页面
//task 任务数
//$childPage 跳转子页面
var initCanlPage = function($modal, $obj, $page, task, $childPage) {
    $modal.modal("hide");
    $obj.css("display", "block");
    setTimeout(function() {
        $obj.css("display", "none");
        $page.trigger("click");
        if (IFSCommonMethod.isNotBlank($childPage)) {
            $childPage.trigger("click");
        }
    }, 1000);
    task == 1 ? renderTask(1) : (task == 2 ? renderTask(2) : (task == 3 ? renderTask(3) : ""));
}


//一转多和多转一总金额计算
var amtSum = function() {
    var total = 0;
    $(".txnAmt").each(function() {
        var num = parseFloat(IFSCommonMethod.unFormatMoney($(this).val()));
        total += num;
    })
    return IFSCommonMethod.formatMoney(total);
}

//申请金额校验
//type=3 多转一
var checkAmt = function(totalAmt, amt, type) {
    var txnAmtSum = IFSCommonMethod.unFormatMoney(totalAmt);
    var txnAmt = IFSCommonMethod.unFormatMoney(amt);
    if (!IFSCommonMethod.isNotBlank(txnAmt)) {
        pluginObj.alert("请输入转让金额");
    } else if (!IFSRegular.regular(IFSRegularExp.appAmt, txnAmt)) {
        pluginObj.alert("转让金额格式不正确，请重新输入");
        return false;
    } else if (type == 3) {
        var flag = true;
        $(".txnAmt").each(function() {
            var validAmt = IFSCommonMethod.unFormatMoney($(this).parents(".txnInfo").find(".validAmt").text());
            var txnAmtOne = IFSCommonMethod.unFormatMoney($(this).val());
            if (IFSCommonMethod.compareMoney(validAmt, txnAmtOne) == 0) {
                pluginObj.alert("转让金额不能大于可用金额！");
                flag = false;
            }
        });
        if (flag) {
            if (txnAmt == "0.00") {
                pluginObj.alert("转让金额总和应该大于0！");
                flag = false;
            } else if (!(IFSCommonMethod.compareMoney(txnAmtSum, txnAmt) == 1)) {
                pluginObj.alert("转让金额总和应该等于应转让总额！");
                flag = false;
            }
        }
        return flag;
    } else {
        var temp = true;
        if (txnAmt == "0.00") {
            pluginObj.alert("转让金额应该大于0！");
            temp = false;
        } else if (IFSCommonMethod.compareMoney(txnAmtSum, txnAmt) == 0) {
            pluginObj.alert("转让金额不能大于可用金额！");
            temp = false;
        }
        return temp;
    }
}


//代办任务设置小红点
var setRedPoint = function(type, total, apprSum) {
    if (type == 1) {
        if (IFSCommonMethod.isNotBlank(total) && parseInt(total) > apprSum) {
            $(".btnDefault span").css("display", "inline-block");
        } else {
            $(".btnDefault span").css("display", "none");
        }
    }
}

//填充协议数据
var renderProtData = function(data, name) {
    if (IFSCommonMethod.isContains(name, Constant.protType["PT3"])) { //转让协议
        $("#reqCustCnNmProt").text(data.reqInfo.custCnNm);
        $("#reqAddrProt").text(data.reqInfo.regAdrProv + data.reqInfo.regAdrCity + data.reqInfo.regAdr);
        $("#reqLglPersNmProt").text(data.reqInfo.lglPersNm);
        $("#rcvCustCnNmProt").text(data.rcvInfo.custCnNm);
        $("#rcvAddrProt").text(data.rcvInfo.regAdrProv + data.rcvInfo.regAdrCity + data.rcvInfo.regAdr);
        $("#rcvLglPersNmProt").text(data.rcvInfo.lglPersNm);
        $("#srcDrftNoProt").text(data.srcDrftNo);
        $("#drwrNmProt").text(data.drwrNm);
        $("#reqCustNmProt").text(data.reqCustNm);
        $("#isseAmtProt").text(IFSCommonMethod.formatMoney(data.isseAmt));
        $("#txnDtProt").text(IFSCommonMethod.formatDate(data.txnDt));
        $("#srcDueDtProt").text(IFSCommonMethod.formatDate(data.srcDueDt));
        $("#txnAmtProt").text(IFSCommonMethod.formatMoney(data.txnAmt));
        $("#protocolModal").modal("show");
    } else if (IFSCommonMethod.isContains(name, Constant.protType["PT4"])) { //开具协议
        $("#srcDrftNoDrwr").text(data.srcDrftNo);
        $("#drwrNmDrwr").text(data.drwrNm);
        $("#reqCustNmDrwr").text(data.reqCustNm);
        $("#isseAmtDrwr").text(IFSCommonMethod.formatMoney(data.isseAmt));
        $("#txnDtDrwr").text(IFSCommonMethod.formatDate(data.txnDt));
        $("#srcDueDtDrwr").text(IFSCommonMethod.formatDate(data.srcDueDt));
        $("#drawProtocolModal").modal("show");

    } else if (IFSCommonMethod.isContains(name, Constant.protType["PT2"])) { //转让通知
        $("#drftNoNotice").text(data.srcDrftNo);
        if (IFSCommonMethod.isNotBlank(data.finTyp)) {
            $(".txnAmtCnNotice").text(IFSCommonMethod.currency(data.disctAmt));
            $(".txnAmtNotice").text(IFSCommonMethod.formatMoney(data.disctAmt));
            $(".rcvCustNmNotice").text(data.ifsOrg.drname);
            $("#reqCustNmNotice").text(data.disctInfo.custCnNm);
        } else {
            $(".txnAmtCnNotice").text(IFSCommonMethod.currency(data.txnAmt));
            $(".txnAmtNotice").text(IFSCommonMethod.formatMoney(data.txnAmt));
            $(".rcvCustNmNotice").text(data.rcvInfo.custCnNm);
            $("#reqCustNmNotice").text(data.reqInfo.custCnNm);
        }
        $("#txnDtNotice").text(IFSCommonMethod.formatProtDate(data.txnDt));
        $("#noticeModal").modal("show");
    } else if (IFSCommonMethod.isContains(name, Constant.protType["PT1"])) { //融资协议
        $(".disctCustCnNmProt").text(data.disctInfo.custCnNm);
        $(".disctAddrProt").text(data.disctInfo.regAdrProv + data.disctInfo.regAdrCity + data.disctInfo.regAdr);
        $(".disctLglPersNmProt").text(data.disctInfo.lglPersNm);
        if (data.finTyp == "1") {
            $("#protocolModalNo").modal("show");
        } else if (data.finTyp == "0") {
            $("#protocolModalYes").modal("show");
        }
    }

}

//即时更新代办任务数
//签收1+转让2+融资3
var renderTask = function(type) {
    switch (type) {
        case 1:
            querySignTask();
            break;
        case 2:
            queryTxnTask();
            break;
        case 3:
            queryDisctTask();
            break;
        default:
            querySignTask();
            queryTxnTask();
            queryDisctTask();
            break;
    }

    //查询签收任务数
    function querySignTask() {
        $(window).IFSAjax({
            code: "0010_800006",
            method: "POST",
            data: {},
            async: false,
            complete: function(result) {
                if (result.code == IFSConfig.resultCode) {
                    if (IFSCommonMethod.isNotBlank(result.data.taskTotal)) {
                        result.data.taskTotal > 0 ? $("#draftSign").find(".badge").show().html(result.data.taskTotal) : "";
                    }
                } else {
                    pluginObj.alert(result.message);
                }
            },
            error: function(status, XMLHttpRequest) {}
        });
    }

    //查询转让任务数
    function queryTxnTask() {
        $(window).IFSAjax({
            code: "0010_810004",
            method: "POST",
            data: {},
            async: false,
            complete: function(result) {
                if (result.code == IFSConfig.resultCode) {
                    if (IFSCommonMethod.isNotBlank(result.data.taskTotal)) {
                        result.data.taskTotal > 0 ? $("#draftTxn").find(".badge").show().html(result.data.taskTotal) : "";
                    }
                } else {
                    pluginObj.alert(result.message);
                }
            },
            error: function(status, XMLHttpRequest) {}
        });
    }

    //查询融资任务数
    function queryDisctTask() {
        $(window).IFSAjax({
            code: "0010_820004",
            method: "POST",
            data: {},
            async: false,
            complete: function(result) {
                if (result.code == IFSConfig.resultCode) {
                    if (IFSCommonMethod.isNotBlank(result.data.taskTotal)) {
                        result.data.taskTotal > 0 ? $("#draftDisct").find(".badge").show().html(result.data.taskTotal) : "";
                    }
                } else {
                    pluginObj.alert(result.message);
                }
            },
            error: function(status, XMLHttpRequest) {}
        });
    }
};

//协议列表点击事件
//type 1-待办列表 2-待办详情
//data 协议数据
//callback 跳转方法
//bussType 业务类型 待复核+撤销待复核
//pageNum 当前页数
var protLinkClickEvent = function(type, data, callback, bussType, pageNum) {
    $(".read-agree a").each(function() {
        $(this).off("click").on("click", function() {
            var name = $(this).text();
            if (type == 1) {
                $(".mytaskModalA").modal("hide");
                setTimeout(function() {
                    IFSCommonMethod.isNotBlank(bussType) ?
                        callback(bussType, name, getCheckedInfo(), pageNum) :
                        callback(name, getCheckedInfo(), pageNum)
                }, 500);
            } else if (type == 2) {
                setTimeout(function() {
                    renderProtData(data, name);
                }, 500);
            }

        });
    });
}
//初始化驳回单选
var initRejectRadioComponent = function($obj, code) {
    $("#info").prev().text(Constant.rejectReason[code]);
    $("#other").prev().text(Constant.rejectReason["RR1"]);
    $("#info").siblings("div").children("span").addClass("active");
    $obj.attr("back", Constant.rejectReason[code]);
    $("input[name=back]").click(function() {
        $(this).siblings("div").children("span").addClass("active");
        $(this).parents("div").siblings("div").find("span").removeClass("active");
        switch ($(this).attr("id")) {
            case "info":
                $obj.removeAttr("back").attr("back", Constant.rejectReason[code]);
                break;
            case "other":
                $obj.removeAttr("back").attr("back", Constant.rejectReason["RR1"]);
                break;
        }
    });
}
///退出代码
function logout() {
	$(window).IFSAjax({
        code: "0010_120002",
        method: "POST",
        data: {},
        complete: function(result) {
            if (result.code == IFSConfig.resultCode) {
                pluginObj.alert("退出成功！");
                setTimeout(function() {
                    window.location.href = "/";
                }, 2000);
            } else {
                pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
            }
        },
        error: function(status, XMLHttpRequest) {}
    });
}