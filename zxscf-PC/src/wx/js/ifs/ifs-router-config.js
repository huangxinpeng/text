(function($w) {
    'use strict';
    var routerContext = IFSRouterContext.routerContext;
    var routerCode = {
        '0010_110001': routerContext + '/sys/portal/getVertityCode', //登录区外获取图形验证码
        '0040_600002': routerContext + '/sys/portal/getSmsCode', //登录区外获取短信验证码
        '0010_110003': routerContext + '/common/dict/getDictByNo', //数据字典
        '0010_110004': routerContext + '/common/getArea', //地区查询
        '0010_110005': routerContext + '/sys/work/getSmsCode', //登录区内获取短信验证码
        '0010_110006': routerContext + "/sys/portal/resetPwd", //找回密码

        //微信-我的任务-宝券签收
        '0010_600001': routerContext + '/wx/querySignList',//我的任务-签收列表
        '0010_600002': routerContext + '/wx/queryWaitSignDetail',//签收详情
        //微信-我的任务-融资审核
        '0020_600001': routerContext + '/wx/queryWXDisctList', //我的任务-融资进度列表
        '0020_600002': routerContext + '/wx/queryDisctDetail', //融资审核详情，融资进度详情
        '0020_600003': routerContext + '/wx/queryWXApproveDisctList',//我的任务-融资审核列表
        //微信-我的任务-转让审核
        '0030_600001': routerContext + '/wx/queryAttornApproveList', //我的任务-转让审核
        '0030_600002': routerContext + '/wx/txnApproveDetail',    //转让详情

        //绑定签约-用户绑定
        //'0040_600002': routerContext + '/sys/portal/getSmsCode',//短信验证码
        '0040_600003': routerContext + '/wx/usrBind',//确定接口

        //本地测试数据
        //'0050_600001': 'localhost:8080' + '../signforList.json',
        //'0060_600001': 'localhost:8080' + '../transferList.json',
        //'0070_600001': 'localhost:8080' + '/wx/financeList.json',


    };
    $w.IFSRouterCode = routerCode;
}(window));