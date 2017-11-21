(function($w) {
    'use strict';
    var routerContext = IFSRouterContext.routerContext;
    var routerCode = {

        '0010_110002': routerContext + '/sys/portal/getSmsCode', //登录区外获取短信验证码
        '0010_110003': routerContext + '/common/dict/getDictByNo', //数据字典
        '0010_110004': routerContext + '/common/getArea', //地区查询
        '0010_110005': routerContext + '/sys/work/getSmsCode', //登录区内获取短信验证码
        '0010_110006': routerContext + "/sys/portal/resetPwd", //找回密码

        '0010_120001': routerContext + '/sys/supplier/login', //登录
        '0010_120002': routerContext + '/sys/supplier/loginOut', //登出
        '0010_120004': routerContext + '/center/changePassWord', //修改密码step2
        '0010_120003': routerContext + '/center/checkSmsCode', //修改手机step1,修改密码step1
        '0010_120006': routerContext + '/center/changeMobile', //修改手机step2

        '0010_130001': routerContext + '/reg/checkEnterpriseInfo', //注册第一步
        '0010_130002': routerContext + '/reg/insertCorpInfo', //注册第二步
        '0010_130003': routerContext + '/reg/checkUserInfo', //注册第三步
        '0010_130004': routerContext + '/reg/checkuser', //查询管理员是否存在
        '0010_130005': routerContext + '/certificates/authLetterDownload', //生成授权委托书

        '0010_150000': routerContext + '/common/usr/menuList', //动态获取菜单

        //用户管理
        '0010_150001': routerContext + '/center/getUsr', //获取用户信息
        '0010_150002': routerContext + '/center/updateUsr', //更新用户信息

        //企业信息
        '0010_160001': routerContext + '/current/getCust', //查询当前登录企业信息
        '0010_160002': routerContext + "/current/signAgr", //签署用户协议
        '0010_160003': routerContext + '/current/applyCert', //数字证书认证
        '0010_160004': routerContext + '/current/setDefaultCust', //设置默认登录企业


        //银行账号
        '0010_170001': routerContext + '/current/listAcct', //查询银行账号列表
        '0010_170002': routerContext + '/current/addAcct', //新增银行账号
        '0010_170003': routerContext + '/current/getAcctNoInfo', //查询银行账号详情
        '0010_170004': routerContext + '/current/payCheck', //银行账号打款验证
        '0010_170005': routerContext + '/current/pay', //银行账号打款
        '0010_170006': routerContext + '/current/delAcct', //银行账号删除
        '0010_170007': routerContext + '/current/setDefaultBank', //设置默认银行账号

        //用户列表管理
        '0010_180001': routerContext + '/current/listUsr', //用户列表获取
        '0010_180002': routerContext + '/current/updSt', //锁定
        '0010_180003': routerContext + '/current/delUsr', //删除
        '0010_180004': routerContext + '/current/updpwd', //重置密码
        '0010_180005': routerContext + '/current/addUser', //用户新增
        '0010_180006': routerContext + '/current/listUsrXq', //用户详情获取
        '0010_180007': routerContext + '/current/uptUser', //用户修改        

        //常用交易对手
        '0010_190001': routerContext + '/counterparty/listPartner', //常用交易对手查询
        '0010_190002': routerContext + '/counterparty/listCorp', //企业信息查询
        '0010_190003': routerContext + '/counterparty/addPartner', //添加交易对手
        '0010_190004': routerContext + '/counterparty/deletePartner', //删除交易对手

        //我的宝券 begin
        //查询
        '0010_300001': routerContext + '/commDrft/queryDrftList', //宝券查询
        '0010_300002': routerContext + '/commDrft/queryDrftDetail', //宝券详情查询

        //转让
        '0010_310001': routerContext + '/buss/queryTxnSum', //查询可转让宝券总额
        '0010_310002': routerContext + '/buss/queryTxnHisList', //转让历史明细查询
        '0010_310003': routerContext + '/buss/queryTxnDetail', //转让历史详情
        '0010_310004': routerContext + '/buss/queryTxnList', //转让中明细查询
        '0010_310005': routerContext + '/buss/txnCancle', //转让取消
        '0010_310006': routerContext + '/buss/txnRetract', //转让撤回
        '0010_310007': routerContext + '/buss/queryTxnDrftList', //可转让宝券查询
        '0010_310008': routerContext + '/buss/txnApply', //转让申请
        '0010_310009': routerContext + '/buss/queryTxnDrftLists', //多转一可转让宝券查询
        '0010_310010': routerContext + '/buss/txnApproveDetail', //转让中详情

        //融资
        '0010_320001': routerContext + '/disct/queryDisctDrftList', //可融资宝券查询
        '0010_320002': routerContext + '/disct/queryDisctHisList', //融资历史明细查询
        '0010_320003': routerContext + '/disct/queryDisctDetail', //融资历史详情
        '0010_320004': routerContext + '/disct/queryDisctList', //融资中明细查询
        '0010_320005': routerContext + '/disct/disctApplyDetail', //融资业务详情
        '0010_320006': routerContext + '/disct/disctCancel', //融资取消接口
        '0010_320007': routerContext + '/disct/disctRetract', //融资撤回接口
        '0010_320008': routerContext + '/disct/disctApply', //融资申请
        '0010_320009': routerContext + '/common/rate/query', //融资利率查询

        //到期
        '0010_330001': routerContext + '/prsntPay/queryPayDrftList', //可解付宝券查询
        '0010_330002': routerContext + '/prsntPay/applyForCorp', //企业解付申请

        //加保
        '0010_340001': routerContext + '/confirm/queryConfirmList', //可加保宝券查询
        '0010_340002': routerContext + '/common/confirming/list', //加保机构查询接口
        '0010_340003': routerContext + '/common/fee/query', //手续费利率查询
        '0010_340004': routerContext + '/confirm/confirmListApply', //加保申请
        //我的宝券 end

        //代办任务 start
        //宝券签收
        '0010_800001': routerContext + '/task/querySignHisTask', //宝券签收历史列表
        '0010_800002': routerContext + '/buss/querySignList', //宝券签收列表
        '0010_800003': routerContext + '/buss/queryWaitSignDetail', //待签收详情
        '0010_800004': routerContext + '/buss/querySignDetail', //签收历史详情明细
        '0010_800005': routerContext + '/buss/sign', //签收确认
        '0010_800006': routerContext + '/task/querySignTask', //待签收任务总数查询
        //宝券转让
        '0010_810001': routerContext + '/buss/txnApproveList', //宝券转让列表
        '0010_810002': routerContext + '/buss/txnApprove', //转让审批接口
        '0010_810003': routerContext + '/task/queryTxnHisTask', //转让复核历史任务查询
        '0010_810004': routerContext + '/task/queryTxnTask', //待转让复核任务数查询
        //宝券融资
        '0010_820001': routerContext + '/disct/disctApplyList', //融资列表
        '0010_820002': routerContext + '/disct/approveForCorp', //融资审批接口
        '0010_820003': routerContext + '/task/queryDisctHisTask', //融资复核历史任务查询
        '0010_820004': routerContext + '/task/queryDisctTask', //待融资复核任务数查询
        //代办任务end

        //我的金币
        '0010_900003': routerContext + '/bonus/queryGenBonus', //我的金币
        '0010_400001': routerContext + '/bonus/queryBonus', //金币金额查询
        '0010_400002': routerContext + '/bonus/queryinBonus', //金币收益查询

        //业务台账
        '0010_200001': routerContext + '/buss/querySignHisList', //签收台账查询
        '0010_200002': routerContext + '/buss/queryTxnHisList', //转让台账查询
        '0010_200003': routerContext + '/disct/queryDisctHisList', //融资台账查询
        '0010_200006': routerContext + '/buss/querySignDetail', //签收详情查询
        '0010_200007': routerContext + '/buss/queryTxnDetail', //转让详情查询
        '0010_200008': routerContext + '/disct/queryDisctDetail', //融资详情查询
        '0010_200004': routerContext + '/prsntPay/queryPayHisList', //期付款台账
        '0010_900002': routerContext + '/bonus/queryUsedBonus', //我的金币台账

        //凭证
        '0010_370001': routerContext + '/certificates/txnDownload', //转让凭证
        '0010_370002': routerContext + '/certificates/finanDownload', //融资凭证
        '0010_370003': routerContext + '/certificates/queryTranCert', //转让信息
        '0010_370004': routerContext + '/certificates/queryFinanceCert', //融资信息

        '0010_370007': routerContext + '/certificates/queryTranCertDetail', //查询转让凭证
        '0010_370006': routerContext + '/certificates/queryFinanceCertDetail', //查询融资凭证

        //协议下载
        '0010_370005': routerContext + '/certificates/fileDownload', //查询
        //个人中心
        '0010_210001': routerContext + "/center/corpList", //查询用户归属企业列表
        '0010_210002': routerContext + '/center/changeCorp', //切换企业

        //消息
        '0010_220001': routerContext + '/msg/queryMessages', //消息列表
        '0010_220002': routerContext + '/msg/msgReadOpt', //置为可读
        '0010_220003': routerContext + '/msg/delMessages', //删除消息

        //意见
        '0010_230001': routerContext + '/center/queryOpFeedback', //查询
        '0010_230002': routerContext + '/center/addOpFeedback', //新增
        //帮助
        '0010_240001': routerContext + '/center/queryHelpList', //查询


    };
    $w.IFSRouterCode = routerCode;
}(window));