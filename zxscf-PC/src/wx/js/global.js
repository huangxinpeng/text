// 防劫持
(function() {
    var href = window.self.location.href;
    if (window.frameElement) {
        (window.top || window.parent).location.href = href;
        return;
    }
})();
/**
 * 定义全局变量
 */
Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};
Array.prototype.max = function() {
    return Math.max.apply({}, this)
};
Array.prototype.min = function() {
    return Math.min.apply({}, this)
};
(function($w) {
    'use strict';
    //满天金域名
    var local = "http://localhost:8088";
    var localTxn = local + "/src";
    var localIndexPage = "/view/index.html";

    // var sit = "";
    // var sitTxn = sit + "/PC";
    // var sitIndexPage = "/PC/views/index.html";

    // var uat = "http://103.36.135.236";
    // var uatTxn = uat + "/PC";
    // var uatIndexPage = "/index.php";


    // var production = "";
    // var productionTxn = "";

    $w.MtjDomainName = localTxn; //交易平台
    // //$w.MtjDomainNameCMS = local; //CMS
    $w.MtjDomainIndexPage = localIndexPage;
    // $w.MtjUserLevel = {};
    // $w.IFSCryptoJS = {};
    // $w.IFSSafe = {};
    // $w.MtjUserInfo = {};
    //交易后端应用上下文
    $w.IFSRouterContext = {
        routerContext: "/esif-webapp"
    };
    var _compareMoney = function(num1) {
        var num1Split = num1.split(".");
        var baseNum1 = Number(num1Split[0]);
        if (isNaN(baseNum1)) {
            return 0;
        }
        var back = baseNum1 * 100;
        if (num1Split[1] != undefined) {
            var baseNum1Dec = Number(num1Split[1]);
            if (isNaN(baseNum1Dec)) {
                return 0;
            }
            var n = 0;
            if (num1Split[1].length > 2) {
                n = baseNum1Dec * 0.01;
            } else {
                n = baseNum1Dec;
            }
            back += n;
        }
        return back;
    };
    //公用基础方法
    $w.IFSCommonMethod = {
        ifsRequestDic: function(selectId, dicCode, flag) {
            $(window).IFSAjax({
                code: "0010_110003",
                method: "POST",
                data: {
                    "typNoS": dicCode,
                    pageNum: IFSConfig.pageNum,
                    pageSize: 20
                },
                complete: function(result) {
                    if (result.code == IFSConfig.resultCode) {
                        $("#" + selectId).empty();
                        if (flag) {
                            $("#" + selectId).append($('<option>', { value: '', text: '请选择' }));
                        }
                        if (result.data.list != null && result.data.list.length > 0) {
                            for (var i = 0; i < result.data.list.length; i++) {
                                $("#" + selectId).append($('<option>', {
                                    value: result.data.list[i].dataNo,
                                    text: result.data.list[i].dataName
                                }));
                            }
                        }
                    }
                }
            });
        },
        //ok
        isNotBlank: function(val) {
            if (val === undefined) {
                return false;
            }
            if (val === null) {
                return false;
            }
            val = val + "";
            var _val = val.replace(/(^\s*)|(\s*$)/g, "");
            if (_val !== null && _val !== undefined && _val !== "") {
                return true;
            }
            return false;
        },
        //ok
        isEquals: function(val1, val2) {
            if (val1 == val2) {
                return true;
            }
            return false;
        },
        compareDate: function(val1, val2) {
            var d1 = new Date(val1.replace(/\-/g, "\/"));
            var d2 = new Date(val2.replace(/\-/g, "\/"));
            if (d1 > d2) {
                return false;
            }
            return true;
        },
        subtractDate: function(days) {
            // 参数表示在当前日期下要增加的天数
            var now = new Date();
            // + 1 代表日期加，- 1代表日期减
            now.setDate((now.getDate() + 1) - 1 * days);
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var day = now.getDate();
            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            }
            return year + '-' + month + '-' + day;
        },
        getCurrentDate: function() {
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var day = now.getDate();
            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            }
            return year + '-' + month + '-' + day;
        },
        getCurrentTime: function() {
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var day = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();
            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            }
            if (hour < 10) {
                hour = '0' + hour;
            }
            if (minute < 10) {
                minute = '0' + minute;
            }
            return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
        },
        getUrlParam: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); //匹配目标参数
            if (r != null) return unescape(r[2]);
            return null; //返回参数值
        },
        checkBrowserVer: function() {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
            var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器
            var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
            var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
            var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器
            if (isIE) {
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp["$1"]);
                if (fIEVersion == 7) { return "IE7"; } else if (fIEVersion == 8) { return "IE8"; } else if (fIEVersion == 9) { return "IE9"; } else if (fIEVersion == 10) { return "IE10"; } else if (fIEVersion == 11) { return "IE11"; } else { return "0" } //IE版本过低
            } //isIE end
            if (isFF) { return "FF"; }
            if (isOpera) { return "Opera"; }
            if (isSafari) { return "Safari"; }
            if (isChrome) { return "Chrome"; }
            if (isEdge) { return "Edge"; }
        },
        checkBrowserIeIt8: function() {
            var ver = this.checkBrowserVer();
            if (ver == "IE7" || ver == "IE8" || ver == "IE9") {
                return true;
            } else {
                return false;
            }
        },
        getUrlPathName: function(pathname) {
            if (!this.isNotBlank(pathname)) {
                return "";
            }
            var lastIndex = pathname.lastIndexOf("/");
            var path = pathname.substring(lastIndex + 1);
            return path;
        },
        uuid: function() {
            return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        isContains: function(str, substr) {
            return str.indexOf(substr) >= 0;
        },
        formatDate: function(date, pattern) {
            if (date == undefined) {
                date = new Date();
            }
            if (pattern == undefined) {
                pattern = "yyyy-MM-dd";
            }
            date = date.substring(0, 4) + "/" + date.substring(4, 6) + "/" + date.substring(6);
            date = new Date(date);
            return date.format(pattern);
        },
        formatStartDate: function(date) {
            if (date == undefined) {
                return "";
            }
            date = date.replace(/-/g, "");
            if (date.length == 6) {
                date += "01";
            }
            return date;
        },
        formatEndDate: function(date) {
            if (date == undefined) {
                return "";
            }
            date = date.replace(/-/g, "");
            if (date.length == 6) {
                date += this.maxDayOfDate(this.formatDate(date + "01"));
            }
            return date;
        },
        maxDayOfDate: function(date) {
            date = new Date(date);
            date.setDate(1);
            date.setMonth(date.getMonth() + 1);
            var time = date.getTime() - 24 * 60 * 60 * 1000;
            var newDate = new Date(time);
            return newDate.getDate();
        },
        num2Rate: function(num) {
            if (this.isNotBlank(num)) {
                if (isNaN(Number(num))) {
                    return "";
                } else {
                    return (num * 100).toFixed(2) + "%";
                }
            } else {
                return "";
            }
        },
        compareMoney: function(num1, num2) {
            if (!this.isNotBlank(num1) || !this.isNotBlank(num2)) {
                return 0;
            }
            var baseNum1 = _compareMoney(num1);
            var baseNum2 = _compareMoney(num2);
            if (baseNum1 === 0) { return 0 }
            if (baseNum2 === 0) { return 0 }
            if (baseNum1 < baseNum2) {
                return 0;
            }
            if (baseNum1 === baseNum2) {
                return 1;
            }
            if (baseNum1 > baseNum2) {
                return 2;
            }
        },
        formatCMoney: function(s, n) {
            if (n === undefined) {
                n = 2;
            } else {
                n = n > 0 && n <= 20 ? n : 2;
            }
            s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
            var l = s.split(".")[0]
                //,r = s.split(".")[1] === undefined ? "00" : s.split(".")[1];
            var t = "";

            if (l.length < 5) {
                t = "0万" + l;
            } else {
                t = l.substring(0, l.length - 4) + "万" + l.substring(l.length - 4);
            }
            return t.split("万");
        },
        unFormatCMoney: function(sVal) {
            if (sVal) {
                var fTmp = sVal.replace('万', '');
                if (fTmp.substring(0, 1) == "0") {
                    fTmp = fTmp.substring(1, fTmp.length - 1);
                }
                return fTmp;
            } else {
                return 0;
            }
        },
        formatMoney: function(s, n) {
            if (!IFSCommonMethod.isNotBlank(s)) {
                return '0.00';
            }
            if (n === undefined) {
                n = 2;
            } else {
                n = n > 0 && n <= 20 ? n : 2;
            }
            s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
            var l = s.split(".")[0].split("").reverse(),
                r = s.split(".")[1] === undefined ? "00" : s.split(".")[1];
            var t = "";
            for (var i = 0; i < l.length; i++) {
                t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
            }
            return t.split("").reverse().join("") + "." + r;
        },
        unFormatMoney: function(sVal) {
            if (sVal) {
                var fTmp = sVal.replace(/,/g, '');
                return fTmp;
            } else {
                return 0;
            }
        },
        null2Empty: function(val) {
            if (val === undefined || val === null || val === "null") {
                return "";
            }
        },
        subString: function(val, len, space) {
            if (!this.isNotBlank(val)) {
                return "";
            }
            if (!this.isNotBlank(len)) {
                return val;
            }
            if (!this.isNotBlank(space)) {
                space = "...";
            }
            return val.substring(0, len) + space;

        },
        keyCodeEvent: function(id, callback) {

            $('#' + id).keydown(function(e) {
                if (e.keyCode == 13) {
                    callback;
                }
            });
        },
        keyCodeEventGlobal: function(callback) {
            document.onkeydown = function(e) {
                var ev = document.all ? window.event : e;
                if (ev.keyCode == 13) {
                    callback;
                }
            };
        },
        convertStringToDate: function(dateStr) {
            return new Date(dateStr + " 00:00:00");
        },
        stringToMoney: function(monerStr) {
            return (_compareMoney(monerStr) * 0.01).toFixed(2);
        },
        str2Date: function(data) {
            var value = data || '';
            if (value.length == 8) {
                value = value.substring(0, 4) + "-" + value.substring(4, 6) + "-" + value.substring(6, 8);
            } else if (value.length == 14) {
                value = value.substring(0, 4) + "-" + value.substring(4, 6) + "-" + value.substring(6, 8) + " " + value.substring(8, 10) + ":" + value.substring(10, 12) + ":" + value.substring(12, 14);
            }
            return value;
        },
        getUrlArg: function(s, name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = s.match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        getErrorMsg: function(msg) { //E[150001]M[企业名称不能为空]
            var n_first_index = msg.indexOf("M[");
            if (n_first_index != -1) {
                n_first_index += 2;
                var s_M_text = msg.substring(n_first_index); //获取m中的信息
                return /[\u4e00-\u9fa5]{1,}.*(?=])/.exec(s_M_text);
            } else {
                return msg;
            }
        }
    };
    $w.pluginObj = {
        // alert插件，传入错误码，错误信息
        alert: function(alertText) {
            var gAlertModal = top.$("#gAlertModal");
            if (!gAlertModal[0]) {
                gAlertModal = top.$('<div class="modal" id="gAlertModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" style="display:none;">\
				  <div class="modal-dialog modal-sm">\
                      <div class="modal-content clearfix" >\
                          <div class="modal-body" >\
                            ' + alertText + '\
                          </div>\
                        </div>\
				  </div>\
				</div>').appendTo("body");
            }
            setTimeout(function() {
                gAlertModal.find(".modal-body").html(alertText);
                gAlertModal.modal && gAlertModal.modal("show");
                $(".modal-backdrop").css("opacity", "0");
                setTimeout(function() {
                    gAlertModal.modal("hide");
                    $(".modal-backdrop").css("opacity", ".5");
                }, 2000);
            }, 500); //防止两个模态框关闭时冲突，设置倒计时
        },
        // 确认框插件
        confirm: function(confirmTitle, confirmText, okFun, cancelFn) {
            var gConfirmModal = top.$("#gConfirmModal");
            if (!gConfirmModal[0]) {
                gConfirmModal = top.$('<div class="modal fade" id="gConfirmModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
				  <div class="modal-dialog modal-sm">\
				    <div class="modal-content">\
                      <div class="modal-header">\
                        <h4>' + confirmTitle + '</h4>\
                      </div>\
				      <div class="modal-body">\
                          <div class="tip-logo"></div>\
                          <p>' + confirmText + '</p>\
				      </div>\
				      <div class="modal-footer">\
				        <button type="button" class="ok btn btn-primary" data-dismiss="modal">确定</button>\
						<button type="button" class="cancel btn btn-default" data-dismiss="modal">取消</button>\
				      </div>\
				    </div>\
				  </div>\
				</div>').appendTo("body");
            }
            gConfirmModal.find(".modal-header h4").html(confirmTitle);
            gConfirmModal.find(".modal-body p").html(confirmText);
            gConfirmModal.off(".jsy").on("click.jsy", ".btn", function(e) {
                if ($(this).hasClass("ok")) {
                    okFun && okFun();
                } else {
                    cancelFn && cancelFn();
                }
            });
            gConfirmModal.modal && gConfirmModal.modal("show");
        }
    };
}(window));
//$(function(){ $('input, textarea').placeholder(); });
window.console = window.console || (function() {
    var c = {};
    c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function() {};
    return c;
})();