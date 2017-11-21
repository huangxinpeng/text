/**
 * Created by lei_bo on 2017/6/14.
 * 正则表达式
 */
(function($w) {

    var regExpression = {
        userName: /^([\u4e00-\u9fa5]|[a-zA-Z0-9()（）]){1,60}$/,
        password: /^(((?=.*[0-9])(?=.*[a-zA-Z])|(?=.*[0-9])(?=.*[^\s0-9a-zA-Z])|(?=.*[a-zA-Z])(?=.*[^\s0-9a-zA-Z]))[^\s]+)$/,
        cmpnNm: /^([\u4e00-\u9fa5]|[a-zA-Z0-9()（）]){1,50}$/,
        rgAdr: /^([\u4e00-\u9fa5-]|[a-zA-Z0-9-]){1,200}$/,
        idCard: /^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\d{4}(((19|20)\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/,
        passport: /^[a-zA-Z0-9]{5,17}$/,
        hkmakao: /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/,
        lealPerson: /^([\u4e00-\u9fa5]|[a-zA-Z]){1,20}$/,
        phoneNum: /^(13|14|15|18|17)[0-9]{9}$/, //ok
        appAmt: /^(?=.*[1-9])\d+(\.\d+)?$/,

        loginName: /^(?!.*?_$)[a-zA-Z][a-zA-Z0-9_]*$/,
        pidCard: /^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\d{4}(((19|20)\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/,
        phone: /^(1)[0-9]{10}$/,
        //password: /^((?=.*[0-9].*)(?=.*[A-Z].*)|(?=.*[0-9].*)(?=.*[a-z].*)|(?=.*[A-Z].*)(?=.*[a-z].*)).*$/,
        containsSpace: /^\s+|\s+$|\s/g,
        postId: /^\d{6}$/,
        kMsgCode: /^[0-9]{6}$/,
        viewCode: /[0-9a-zA-Z]{4}/,
        licNo: /^(\d{15}|\d{18})$/,
        cupShp: /^\d{15}$/,
        managementYear: /^[1-9]\d{0,1}$/,
        oprtnPrd: /^[1-9]\d{0,2}$/,

        msgNumber: /^\d{6}$/,
        qq: /\d{5,13}/,
        wechat: /^[a-zA-Z]{1}[a-zA-Z\d_-]{5,19}$/,
        //email:/^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        email: /^([a-zA-Z0-9]+[_\-\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_\-\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
        nickNm: /^[a-zA-Z][0-9a-zA-Z]{5,19}$/,
        hmAdr: /^([\u4e00-\u9fa5]|[a-zA-Z0-9]){1,100}$/,
        fixedPhone: /^\d{3,4}-\d{7,8}$/,
        money: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^[0-9]\.[0-9]([0-9])?$)/, //(^(0){1}$)
        payPwd: /^[0-9]+$/,
        days: /(^[1-9]([0-9]+)?$)/,
        lPwd: /^([0-9]|[a-z]|[A-Z]){1,18}$/,
        mPwd: /^((?=.*[0-9].*)(?=.*[A-Z].*)|(?=.*[0-9].*)(?=.*[a-z].*)|(?=.*[A-Z].*)(?=.*[a-z].*)){1,18}.*}$/,
        hPwd: /^((?=.*[0-9].*)(?=.*[a-z].*)(?=.*[A-Z].*)){1,18}.*}$/,
        orgCode: /^[A-Z0-9\d]{8}\-[A-Z0-9\d]{1}$/, //组织机构代码
        orgCode1: /^[0-9\d]{8}[A-Z0-9\d]{10}$/, //统一社会信用证
        businessCode: /^\d{15}$/, //营业执照
        bankCode: /^(\d{5,21})$/,
        perBankCode: /^(\d{16,19})$/,
        bankNum: /^(\d{1,14})$/, //机构开户行行号
        bankName: /^[\u4e00-\u9fa5()（）]{1,200}$/, //机构开户行名称
        name: /^[\u4e00-\u9fa5]{1,20}$/
    };

    var regExpressionTip = {
        loginName: "必须由字母、数字或下划线组成,必须以字母开头,不能以下划线结尾"
    };

    var reg = {
        regular: function(reg, value) {
            var regExp = reg;
            if (regExp.test(value)) {
                return true;
            }
            return false;
        },
        checkPidCard: function(value) {
            var id = value;
            var baseX = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            var resRule = {
                '0': '1',
                '1': '0',
                '2': 'X',
                '3': '9',
                '4': '8',
                '5': '7',
                '6': '6',
                '7': '5',
                '8': '4',
                '9': '3',
                '10': '2'
            };
            var sum = 0;
            if (!id || id.length != 18) {
                return false;
            }
            var s = id.split('');
            for (var i = 0; i < 17; i++) {
                sum += parseInt(s[i]) * baseX[i];
            }
            var resNum = resRule[sum % 11 + ""];
            if (resNum == (id.substring(17) + "").toUpperCase()) {
                return true;
            } else {
                return false;
            }
        }
    };
    $w.IFSRegular = reg;
    $w.IFSRegularExp = regExpression;
    $w.IFSRegularExpTip = regExpressionTip;
}(window));