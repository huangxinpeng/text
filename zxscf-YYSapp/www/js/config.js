/**
 * Created by haibo on 2017/9/2.
 * APP 基本配置
 */
 angular.module('zxscf.config', [])
 .constant('config',{
  appVersion:'0.0.1',
  envPath:"/esif-webapp",
    //envPath:'http://119.23.38.230:28080/esif-webapp',  //测试发布
    //envPath:'http://192.168.0.131',  //测试发布
    //envPath:"http://192.168.0.101:8080/esif-webapp",    //wifi

    HttpInsertApis:{
      // 公共
      CenterGetStaffInfo:'/center/getStaffInfo',
      workSysGetSmsCode:'/sys/work/getSmsCode',      //获取短信验证码（登录区内）
      portalSysGetSmsCode:'/sys/portal/getSmsCode',  //获取短信验证码（登录区外) 15151551151
      getDictByNo:'/common/dict/getDictByNo', //数据字典
      // 登入 忘记密码
      operatorLogin:'/sys/operator/login',   //运营方登录
      //operatorLogin:'/sys/supplier/login',   //运营方登录
      operatorLoinOut:'/sys/operator/loginOut',     //运营方注销
      // portalSysResetPwd:'/portal/sys/resetPwd', //找回密码（登录区外）
      portalSysResetPwd:'/center/resetStaffPassWord', //忘记密码（登录区外） //运营商
      // 消息列表
      msgQueryMessages:'/msg/queryMessages',//查询消息列表
      msgDellMessages:'/msg/delMessages', //删除消息
      msgMsgReadOpt:'/msg/msgReadOpt',      //消息置为可读
         //安全中心
        msgResetPwd:'/center/resetStaffPassWord', //修改密码
        changePassWord:'/center/changeOperaPassWord', //重置密码
      // 任务查询   1-6
      queryDisctTask:'/disct/disctApplyList', //任务查询
      disctApprove:'/disct/approve',  //融资审批接口 1-退回 2-拒绝 3-同意
      disctDisctApplyDetail:'/disct/disctApplyDetail', //融资业务详情
      //融资到期    7
      queryPayDrftList:'/prsntPay/queryPayDrftList', //融资到期
      applyForOwner:'/prsntPay/applyForOwner',  //融资到期解付申请
      listAcct:'/current/listAcct',//查询银行账号列表
      txnApproveDetail:'/prsntPay/queryDetail', //融资到期申请解付单笔
      //付款审核   8
      payApproveList:'/prsntPay/payApproveList',  //付款审核
      prsntPayApprove:'/prsntPay/approve',    //付款签收
      prsntPayqueryDetail:'/prsntPay/approveDetail',  //付款审核详情
      //企业审核   9
      currentapproveList:'/current/approveList',  //
      currentapproveDetail:'/current/approveDetail',    //
      currentapprove:'/current/approve',  //
      viewAttach:'/current/viewAttach',  //图片获取
      //用户审核   10
      queryUserAudit:'/current/queryUserAudit',//用户审核任务查询
      userAudit:'/current/userAudit',  //审核
      queryUserAuditDetail:'/current/queryUserAuditDetail',//详情

      queryhistoryTask:'/task/queryOperaDisctTask',  //融资受理/审查历史任务查询（运营方）
      quserhistorylist:'/current/queryApproveHisList',//用户审核历史
      qpayhistorylist:'/prsntPay/queryApproveHis',//用户审核历史
      /*安全中心*/
      CURC1005:'/center/checkSmsCode',//修改手机号  旧手机
      changeStaffMobeil:'/center/changeStaffMobeil',//修改手机号，新手机
      /*个人中心*/
      getUsr:'/center/getStaffInfo'//个人信息查询

    },
    dictByNo:{

    },
    resCode:{

    },
    smsTime: 30  //短信过期时间

  });
