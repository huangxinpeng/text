/**
 * Created by lhr on 16/11/28.
 */
 //小数最多只能两位
jQuery.validator.addMethod("isFloatless2", function (value, element) {
    if(value&&value.instanceof(".")>=0){
        var tmp = value.split(".")[1];
        if(tmp.length > 2){
            return true;
        }else{
            return true;
        }
    }else{
        return true;
    }
}, "小数最多只能两位");
jQuery.validator.addMethod("isZipCode", function (value, element) {
    if(value==""){return true}
    var tel = /^[0-9]{6}$/;
    return this.optional(element) || (tel.test(value));
}, "邮政编码为6位数字");
jQuery.validator.addMethod("isEnglish", function (value, element) {
    var tel = /^[a-zA-Z]+$/;
    return this.optional(element) || (tel.test(value));
}, "请输入英文字符");
jQuery.validator.addMethod("checkOthOrganization", function (sCertID, element) {
    if(sCertID==""){return true}
    var s_tmp = "";
    //客户组织机构代码应由为大写字母，数字或者符号\"-\"构成！
    if (sCertID.length > 10) {
        return false;
    }
    for (var i = 0; i <= sCertID.length - 1; i++) {
        s_tmp = sCertID.substring(i, i + 1);
        if (!((s_tmp <= "Z" && s_tmp >= "A") || (s_tmp <= "9" && s_tmp >= "0") || s_tmp == "-")) {//alert("客户组织机构代码应由为大写字母，数字或者符号\"-\"构成！");
            //document.all("CertID").focus();
            return false;
        }
    }
    var flag =true;//校验位合法性校验
    (function(sCertID) {
        var financecode = new Array();
        if (sCertID == "00000000-0")
            flag = false;
        for (i = 0; i < sCertID.length; i++) {
            financecode[i] = sCertID.charCodeAt(i);
        }
        var w_i = new Array(8);
        var c_i = new Array(8);
        s = 0, c = 0;
        w_i[0] = 3;
        w_i[1] = 7;
        w_i[2] = 9;
        w_i[3] = 10;
        w_i[4] = 5;
        w_i[5] = 8;
        w_i[6] = 4;
        w_i[7] = 2;

        if (financecode[8] != 45)
            flag = false;

        for (i = 0; i < 10; i++) {
            c = financecode[i];
            if (c <= 122 && c >= 97)
                flag = false;
        }

        fir_value = financecode[0];
        sec_value = financecode[1];
        if (fir_value >= 65 && fir_value <= 90)
            c_i[0] = (fir_value + 32) - 87;
        else if (fir_value >= 48 && fir_value <= 57)
            c_i[0] = fir_value - 48;
        else
            flag = false;
        s += w_i[0] * c_i[0];
        if (sec_value >= 65 && sec_value <= 90)
            c_i[1] = (sec_value - 65) + 10;
        else if (sec_value >= 48 && sec_value <= 57)
            c_i[1] = sec_value - 48;
        else
            flag = false;
        s += w_i[1] * c_i[1];
        for (j = 2; j < 8; j++) {
            if (financecode[j] < 48 || financecode[j] > 57)
                flag = false;
            c_i[j] = financecode[j] - 48;
            s += w_i[j] * c_i[j];
        }

        c = 11 - s % 11;
        flag =  financecode[9] == 88 && c == 10 || c == 11 && financecode[9] == 48 || c == financecode[9] - 48;
    })(sCertID);
    if(!flag){
        //$.validator.messages.checkOthenOrganization = ("组织机构代码不合规！");
        return false;
    }
    return true;
}, "由10位的大写字母，数字或者符号\"-\"构成！");
jQuery.validator.addMethod("checkCredit", function (sCertID, element) {
   if(sCertID!=""){
       if (sCertID.length > 18) {
           return false;
       }
       var pattern1 = /^[0-9]{8}$/;//前八位是数字
       if (!pattern1.test(sCertID.slice(0, 8))) {
           return false;
       }
       var pattern2 = /^([0-9A-Z\-]){10}$/;
       if (!pattern2.test(sCertID.slice(8, 18))) {
           return false;
       }
   }
    return true;
}, "客户统一社会信用代码证由18位数字和大写字母组成！");
jQuery.validator.addMethod("checkBusLicense", function (sCertID, element) {
    if(sCertID!=""){
        var pattern1 = /^[0-9]{15}$/;//前八位是数字
        if (!pattern1.test(sCertID)) {
            return false;
        }
    }
    return true;
}, "客户营业执照由15位数字组成！");
jQuery.validator.addMethod("isMobile", function (value, element) {
    if(value == ""){return true;}
    var tel = /^[1]([0-9]{10})$/;
    //return this.optional(element) || (tel.test(value));
    return tel.test(value)
}, "请输入合法的11位手机号码");

jQuery.validator.addMethod("cellPhone", function (value, element) {
    if(value == ""){return true;}
    //var phone = /^((0\d{2,3}-\d{6,8})|(1[0-9]\d{9}))$/;
    var phone = /^((0\d{2,3}-[1-9]\d{6,7})|(1[3584]\d{9}))$/;
    return this.optional(element) || (phone.test(value));
}, "请输入合法的电话号码");

jQuery.validator.addMethod("isIdCardNo", function (value, element) {
    if(value == ""){return true;}
    var CardNo = value;
    function checkNo(CardNo) {
        for(var i=0;i<CardNo.length;i++){
            if(CardNo.charAt(i)<'0'||CardNo.charAt(i)>'9'){
                return false;
            }
        }
        return true;
    }

    function f(CardNo){
        if ((CardNo == "") || (!(checkNo(CardNo)) && (CardNo.length == 15)) || (!(checkNo(CardNo.substr(0, 17))) && (CardNo.length == 18)) || ((CardNo.length != 15) && (CardNo.length != 18))) {
            $.validator.messages.isIdCardNo = ("请输入15位或18位身份证号!");//alert("您的身份证号码输入有误，必需是15数字或18位,请重新检查并输入!");
            return false;
        }
        else if (CardNo.length == 15) {
            if (CardNo.substr(8, 2) > 12 || CardNo.substr(8, 2) < 1) {
                $.validator.messages.isIdCardNo = ("身份证的出生“月”输入有误!");//alert("您身份证的出生“月”输入有误,请重新检查并输入!");
                return false;
            }
            if (CardNo.substr(10, 2) > 31 || CardNo.substr(10, 2) < 1) {
                $.validator.messages.isIdCardNo = ("身份证的出生“日”输入有误!");//alert("您身份证的出生“日”输入有误,请重新检查并输入!");
                return false;
            }
            return true;
        }
        else if (CardNo.length == 18) {
            if (CardNo.substr(6, 4) < 1900 || CardNo.substr(6, 4) > 2100) {
                $.validator.messages.isIdCardNo = ("身份证的出生“年”输入有误!");//alert("您身份证的出生“年”输入有误,请重新检查并输入!");
                return false;
            }
            if (CardNo.substr(10, 2) > 12 || CardNo.substr(10, 2) < 1) {
                $.validator.messages.isIdCardNo = ("身份证的出生“月”输入有误!");//alert("您身份证的出生“月”输入有误,请重新检查并输入!");
                return false;
            }
            if (CardNo.substr(12, 2) > 31 || CardNo.substr(12, 2) < 1) {
                $.validator.messages.isIdCardNo = ("身份证的出生“日”输入有误!");//alert("您身份证的出生“日”输入有误,请重新检查并输入!");
                return false;
            }


            var Wi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
            var Ai = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');

            if (CardNo.charAt(17) == 'x') {
                CardNo = CardNo.replace("x", "X");
            }

            var checkDigit = CardNo.charAt(17);
            var cardNoSum = 0;

            for (var i = 0; i < CardNo.length - 1; i++) {
                cardNoSum = cardNoSum + CardNo.charAt(i) * Wi[i];
            }

            var seq = cardNoSum % 11;
            var getCheckDigit = Ai[seq];

            if (checkDigit != getCheckDigit) {
                $.validator.messages.isIdCardNo = ("请输入正确的身份证号码");//alert("您的身份证号码校验失败，请重新检查并输入!");
                return false;
            }
            return true;
        }
        else {
            return true;
        }
    };
    return f(CardNo);
    //var idCard = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
    //return this.optional(element) || (idCard.test(value));
}, "请输入正确的身份证号码");

jQuery.validator.addMethod("isDate", function (value, element) {
    //var reg = /^([2-9]\d{3}((0[1-9]|1[012])(0[1-9]|1\d|2[0-8])|(0[13456789]|1[012])(29|30)|(0[13578]|1[02])31)|(([2-9]\d)(0[48]|[2468][048]|[13579][26])|(([2468][048]|[3579][26])00))0229)$/;
    //return this.optional(element) || (reg.test(value));
    return this.optional(element) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
}, "日期格式为yyyy-MM-dd");

jQuery.validator.addMethod("isBankCard", function (value, element) {
    var isBankCard = /^(\d{16}|\d{19})$/;
    var v = value.replace(/\s+/g, "");//银行卡四位数字后面加了一个空格
    return (isBankCard.test(v));
}, "请输入正确的银行卡号");
jQuery.validator.addMethod("isPassword", function (val, element) {
    if (val < 6) {
        return false;
    }
    var lv = 0;
    if (val.match(/[a-z]/g)) {
        lv++;
    }
    if (val.match(/[A-Z]/g)) {
        lv++;
    }
    if (val.match(/[0-9]/g)) {
        lv++;
    }
    if (val.match(/(.[^a-zA-Z0-9])/g)) {
        lv++;
    }
    return lv > 1;
    // 最少6位，包含至少1个特殊字符，2个数字，2个大写字母和一些小写字母。
    //(?=^.{6,16}$)(?=(?:.*?\d))(?=.*[a-z])(?=(?:.*?[A-Z]){2})(?=(?:.*?[!@#$%*()_+^&}{:;?.]){1})(?!.*\s)[0-9a-zA-Z!@#$%*()_+^&]*$
    //var reg = /(?=^.{6,16}$)/;
    // return (reg.test(value));
}, "密码由至少6位数字、字母或特殊字符组成");
jQuery.validator.addMethod("compareDate", function (value, element) {
    var assigntime = $(".startTime").val();
    var deadlinetime = $(".endTime").val();
    var reg = new RegExp('-', 'g');
    assigntime = assigntime.replace(reg, '/');//正则替换
    deadlinetime = deadlinetime.replace(reg, '/');
    assigntime = new Date(parseInt(Date.parse(assigntime), 10));
    deadlinetime = new Date(parseInt(Date.parse(deadlinetime), 10));
    if (assigntime > deadlinetime) {
        return false;
    } else {
        return true;
    }
}, "结束日期不小于开始日期");
jQuery.validator.addMethod("compareDate2", function (value, element) {
    var assigntime = $(".startTime2").val();
    var deadlinetime = $(".endTime2").val();
    var reg = new RegExp('-', 'g');
    assigntime = assigntime.replace(reg, '/');//正则替换
    deadlinetime = deadlinetime.replace(reg, '/');
    assigntime = new Date(parseInt(Date.parse(assigntime), 10));
    deadlinetime = new Date(parseInt(Date.parse(deadlinetime), 10));
    if (assigntime > deadlinetime) {
        return false;
    } else {
        return true;
    }
}, "结束日期必须大于开始日期");
jQuery.validator.addMethod("rzjeYszk", function (value, element) {
    var rzje = $(".rzje").val();
    var yszk = $(".yszk").val();
    var rzbl = $(".rzbl").val();
    var rzjeNum = parseFloat(rzje);
    var yszkNum = parseFloat(yszk);
    var rzblNum = parseFloat(rzbl);
    if (!rzblNum) {
        rzblNum = 0;
    }
    if (!rzjeNum) {
        rzjeNum = 0;
    }
    if (!yszkNum) {
        yszkNum = 0;
    }
    if (rzje > yszkNum * rzbl / 100) {
        return false;
    } else {
        return true;
    }
}, "融资金额不能大于应收账款转让净额*融资比例");
jQuery.validator.addMethod("isFactNum", function (value, element) {
    var p = /^[0-9a-zA-Z_]{4,20}$/;
    return p.test(value);
}, "由4-20个字母(区分大小写)、数字或下划线组成");
//4-10个中文或英文字符组成  管理员登录用户名
jQuery.validator.addMethod("isUsrCd", function (value, element) {
    var p = /^[0-9a-zA-Z]{4,20}$/;
    return p.test(value);
}, "由4-20个字母和数字组成");
jQuery.validator.addMethod("larger", function (value, element, params) {
    if (parseFloat(value.split("-").join("")) < parseFloat($(params).val().split("-").join(""))) {
        return false;
    } else {
        return true;
    }
}, "值必须不小于前一个值");

jQuery.validator.addMethod("idNoByType", function (value, element, refSelector) {
    var typ = $(refSelector);
    var qyzjlx = typ.val();
    var qyzjhm = value;
    var rs = true;
    if (qyzjlx == '0') {
        var s_tmp = "";
        for (var i = 0; i <= qyzjhm.length - 1; i++) {
            s_tmp = qyzjhm.substring(i, i + 1);
            if (!((s_tmp <= "Z" && s_tmp >= "A") || (s_tmp <= "9" && s_tmp >= "0") || s_tmp == "-") || qyzjhm.length != 10) {
                $.validator.messages.idNoByType = ("由10位的大写字母，数字或者符号\"-\"构成！");
                rs = false;
            }
            //企业客户代码第九位应该'-'！
            s_tmp = qyzjhm.substring(8, 9);
            if (s_tmp != "-") {
                $.validator.messages.idNoByType = ("组织机构代码第九位应该为'-'！");
                rs = false;
            }
        }
        var flag =true;//校验位合法性校验
        (function(CorpID) {
            var financecode = new Array();
            if (CorpID == "00000000-0")
                flag = false;
            for (i = 0; i < CorpID.length; i++) {
                financecode[i] = CorpID.charCodeAt(i);
            }
            var w_i = new Array(8);
            var c_i = new Array(8);
            s = 0, c = 0;
            w_i[0] = 3;
            w_i[1] = 7;
            w_i[2] = 9;
            w_i[3] = 10;
            w_i[4] = 5;
            w_i[5] = 8;
            w_i[6] = 4;
            w_i[7] = 2;

            if (financecode[8] != 45)
                flag = false;

            for (i = 0; i < 10; i++) {
                c = financecode[i];
                if (c <= 122 && c >= 97)
                    flag = false;
            }

            fir_value = financecode[0];
            sec_value = financecode[1];
            if (fir_value >= 65 && fir_value <= 90)
                c_i[0] = (fir_value + 32) - 87;
            else if (fir_value >= 48 && fir_value <= 57)
                c_i[0] = fir_value - 48;
            else
                flag = false;
            s += w_i[0] * c_i[0];
            if (sec_value >= 65 && sec_value <= 90)
                c_i[1] = (sec_value - 65) + 10;
            else if (sec_value >= 48 && sec_value <= 57)
                c_i[1] = sec_value - 48;
            else
                flag = false;
            s += w_i[1] * c_i[1];
            for (j = 2; j < 8; j++) {
                if (financecode[j] < 48 || financecode[j] > 57)
                    flag = false;
                c_i[j] = financecode[j] - 48;
                s += w_i[j] * c_i[j];
            }

            c = 11 - s % 11;
            flag =  financecode[9] == 88 && c == 10 || c == 11 && financecode[9] == 48 || c == financecode[9] - 48;
        })(qyzjhm);
        if(!flag){
            $.validator.messages.idNoByType = ("由10位的大写字母，数字或者符号\"-\"构成！");
            rs = false;
        }
    }
    if (qyzjlx == '1') {
        var y_tmp = "";
        for (var i = 0; i <= qyzjhm.length - 1; i++) {
            y_tmp = qyzjhm.substring(i, i + 1);
            if (qyzjhm.length != 15 || isNaN(qyzjhm)) {
                $.validator.messages.idNoByType = ("由15位数字构成！");
                rs = false;
            }
        }
    }
    if (qyzjlx == '4') {
        var t_tmp = "";
        for (var i = 0; i <= qyzjhm.length - 1; i++) {
            t_tmp = qyzjhm.substring(i, i + 1);
            if (qyzjhm.length != 18 || !((t_tmp <= "Z" && t_tmp >= "A") || (t_tmp <= "9" && t_tmp >= "0"))) {
                $.validator.messages.idNoByType = ("由18位数字和大写字母构成！");
                rs = false;
            }
        }
    }
    return rs;
}, "企业证件号码格式不正确");
//正整数
jQuery.validator.addMethod("isPositiveDigit", function (value, element) {
    var p = /^[1-9]\d*$/;
    return p.test(value);
}, "请输入正整数");

jQuery.extend(jQuery.validator.messages, {
    required: "必输字段",
    remote: "请修正该字段",
    email: "请输入正确格式的电子邮件",
    url: "请输入合法的网址",
    date: "请输入合法的日期",
    dateISO: "请输入合法的日期 (ISO).",
    number: "请输入合法的数字",
    digits: "只能输入整数",
    creditcard: "请输入合法的信用卡号",
    equalTo: "请再次输入相同的值",
    accept: "请输入拥有合法后缀名的字符串",
    maxlength: jQuery.validator.format("请输入不超过 {0} 个字符"),
    minlength: jQuery.validator.format("请输入至少 {0} 个字符"),
    rangelength: jQuery.validator.format("请输入 {0} 到 {1} 个字符"),
    range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
    max: jQuery.validator.format("请输入一个最大为 {0} 的值"),
    min: jQuery.validator.format("请输入一个最小为 {0} 的值")
});

//组织机构代码校验
