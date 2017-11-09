/**
 * Created by haibo on 2017/9/2.
 * APP 基本配置
 */
angular.module('zxscf.config', [])
  .constant('config',{
    appVersion:'0.0.1',
    envPath:'/esif-webapp',   //本地环境
    //envPath:"http://119.23.38.230:28080/esif-webapp",  //测试发布
    //envPath:"http://192.168.43.169:8080/esif-webapp",    //YYG
    //envPath:"http://192.168.0.101:8080/esif-webapp",    //JP
    //envPath:"http:/192.168.0.131:8080/esif-webapp",    //YYG

    httpInsertApi:{
          //TEXT:'/reg/checkEnterpriseInfo',
          TEXT:'/users/fileupload',
          //公共CM1001
          CM1001: '/sys/portal/getSmsCode',//登录区外短信验证码
          CM1002: '/sys/work/getSmsCode',//登录区内短信验证码
          CM1003: '/sys/portal/resetPwd',//找回密码（登录区外）
          CM1004: '/common/getArea', //城市列表查询

          CM1005:'/common/fee/query',//手续费率查询
          CM1006:'/common/confirming/list',//加保机构查询
          CM1007:'/certificates/fileDownload',//PDF文件下载预览
          CM1009:'/certificates/authLetterDownload',//注册(管理员)PDF文件下载预览

          CM1008: '/common/dict/getDictByNo', //数据字典查询

          //注册ZC1001
          ZC1001: '/reg/checkEnterpriseInfo',//工商信息填写
          ZC1002: '/reg/insertCorpInfo',//法人信息填写
          ZC1003: '/reg/checkUserInfo',//注册（第三步）
          ZC1004: '/reg/checkuser',  //新旧管理员确认
          //登录LG1001
          LG1001: '/sys/supplier/login',//供应商登录
          LG1002:'/sys/supplier/loginOut',//供应商注销
          //消息列表NW1001
          NW1001:'/msg/queryMessages',//查询消息列表
          NW1002:'/msg/delMessages',//删除消息
          NW1003:'/msg/msgReadOpt',//消息置为已读
          //金币查询
          COI1001:'/bonus/queryBonus',//金币金额查询
          COI1002:'/bonus/queryGenBonus',//金币收益明细查询
          COI1003:'/bonus/queryUsedBonus',//金币使用明细查询
          COI1004:'/bonus/queryinBonus',//金币收支统计
          //企业信息管理
          CMG1001:'/current/getCust',//查询当前登录企业信息
          CMG1002:'/current/applyCert',//数字证书申请
          CMG1003:'/current/signAgr',//用户协议签署
          CMG1004:'/current/approveList',//企业审核列表查询
          CMG1005:'/current/approveDetail',//企业审核信息详情查询
          CMG1006:'/current/approve',//企业审核接口
          CMG1007:'/current/setLoginCorp',//设置默认登录企业
          CMG1008:'/current/updCustInf',//企业信息完善
          CMG1009:'/current/setDefaultCust',//默认企业设置
          CMG1010:'/current/viewAttach',//获取营业执照正反 - get方式
          CMG1011:'/current/addAttach',//上传图像等
          //银行账号管理
          BAM1001:'/current/listAcct',//查询银行账号列表
          BAM1002:'/current/getAcctNoInfo',//查询银行账号详情
          BAM1003:'/current/addAcct',//添加银行账号
          BAM1004:'/current/delAcct',//删除银行账号
          BAM1005:'/current/updAcct',//修改银行账号
          BAM1006:'/current/pay',//银行账号打款
          BAM1007:'/current/payCheck',//银行账号打款验证
          BAM1008:'/current/setDefAcc',//设置默认银行账号
          //用户信息管理
          UMM1001:'/current/listUsr',//用户列表查询
          UMM1002:'/current/listUsrXq',//用户详情
          UMM1003:'/current/updSt',//解锁/锁定
          UMM1004:'/current/addUsr',//用户添加
          UMM1005:'/current/delUsr',//用户删除
          UMM1006:'/current/updUsr',//用户修改
          UMM1007:'/current/updpwd',//重置密码
          //常用交易对手
          CPL1001:'/counterparty/listCorp',//企业信息查询
          CPL1002:'/counterparty/listPartner',//查询常用交易对手
          CPL1003:'/counterparty/addPartner',//添加交易对手
          CPL1004:'/counterparty/mailAdmin',//通知管理员
          //任务查询
          QT1001:'/task/querySignTask',//待签收任务总数查询（供应商）
          QT1002:'/task/queryTxnTask',//待转让复核任务数查询（供应商）
          QT1003:'/task/queryDisctTask',//待融资复核任务数查询（供应商）
          QT1004:'/task/querySignHisTask',//签收历史任务查询（供应商）
          QT1005:'/task/queryTxnHisTask',//转让复核历史任务查询（供应商）
          QT1006:'/task/queryDisctHisTask',//融资复核历史任务查询（供应商）
          QT1007:'/task/queryDisctTask',//融资受理/审查历史任务查询（运营方）
          //交易量查询
          TVQ1000:'/task/txnVolume/query',//交易量查询
          //宝券查询
          QDL1001:'/commDrft/queryDrftList',//宝券明细查询
          QDL1002:'/commDrft/queryDrftDetail',//宝券详情查询
          QDL1003:'/confirm/confirmListApply',//加保申请
          //宝券融资
          DQDL1001:'/disct/queryDisctHisList',//融资历史明细查询
          DQDL1002:'/disct/queryDisctList',//融资中明细查询
          DQDL1003:'/disct/queryDisctDetail',//融资详情
          DQDL1004:'/disct/queryDisctDrftList',//可融资宝券查询
          DQDL1005:'/disct/disctApplyList',//融资业务列表查询
          DQDL1006:'/disct/disctApplyDetail',//融资业务详情
          DQDL1007:'/disct/disctApply',//融资申请
          DQDL1008:'/disct/disctCancel',//融资取消
          DQDL1009:'/disct/disctRetract',//融资撤回
          DQDL2001:'/disct/approveForCorp',//融资审批接口（供应商）917363861623009280
          DQDL2002:'/disct/approve',//融资审批接口（运营方）
          //宝券签收
          BQS1001:'/buss/querySignHisList',//签收历史明细查询
          BQS1002:'/buss/querySignList',//待签收明细查询
          BQS1003:'/buss/querySignDetail',//签收详情
          BQS1004:'/buss/sign',//签收确认
          BQS1005:'/buss/queryWaitSignDetail',
          //宝券转让
          BZR1000:'/buss/queryTxnSum',//可转让总金额
          BZR1001:'/buss/queryTxnList',//转让中明细查询
          BZR1002:'/buss/queryTxnDetail',//转让详情
          BZR1003:'/buss/queryTxnHisList',//转让历史查询
          BZR1YZY:'/buss/txnApply',//转让申请（转让申请一转一入口调用）
          BZR1YZD:'/buss/txnApply',//转让申请（转让申请一转多入口调用）
          BZR1DZY:'/buss/txnApply',//转让申请（转让申请多转一入口调用）
          BZR1005:'/buss/queryTxnDrftList',//可转让宝券查询
          BZR1006:'/buss/txnApproveList',//转让审核列表查询
          BZR1007:'/buss/txnApproveDetail',//转让审核详情
          BZR1008:'/buss/txnCancle',//转让取消
          BZR1009:'/buss/txnRetract',//转让撤回//
          BZR1010:'/buss/txnApprove',//转让复核
          BZR1011:'/buss/queryTxnDrftLists',//多转一（按距到期日排序）
          //企业到期解付
          CPF1001:'/prsntPay/queryHisList',//已解付明细查询
          CPF1002:'/prsntPay/queryDetail',//解付详情查询
          CPF1003:'/prsntPay/queryPayDrftList',//可解付宝券查询
          CPF1004:'/prsntPay/applyForCorp',//企业解付申请
          CPF1005:'/prsntPay/payApproveList',//解付审核明细查询
          CPF1006:'/prsntPay/payApproveDetail',//解付审核详情
          CPF1007:'/prsntPay/approve',//解付审核
          CPF1008:'/prsntPay/queryAllList',//到期解付台账
          CPF1009:'/prsntPay/applyForOwner',//我司持票到期付款申请
          //个人中心
          CURC1001:'/center/getUsr',//个人信息查询
          CURC1002:'/center/updateUsr',//个人信息修改
          CURC1003:'/center/changeCorp',//切换企业
          CURC1004:'/center/corpList',//查询用户归属企业列表
          CURC1005:'/center/changeMobile',//修改手机号
          CURC1006:'/center/checkSmsCode',//校验验证码

          CURC1007:'/center/changePassWord',//重置密码

          //凭证下载
          PDL1003:'/certificates/queryTranCert',//查询可打印转让凭证的流水信息
          PDL1001:'/certificates/txnDownload',//转让凭证下载
          PDL1002:'/certificates/disctDownload',//融资凭证下载
          //意见管理
          ADM1001:'/center/queryOpFeedback',//意见查询
          ADM1002:'/center/addOpFeedback',//增加意见
          //帮助信息查询
          HMQ1000:'/helpCenter/query',//帮助信息查询
          HMQ1001:'/center/queryHelpList',//帮助信息查询
          //产品版本管理
          VERQ1000:'/version/query',//版本列表查询
    }
  });
