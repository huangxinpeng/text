/**
 * Created by MrHai on 2016/3/23.
 */
angular.module('zxscf.services', [])
  // -- 统一请求方法 --
  .factory('HttpService',function($http,$q,$ionicLoading){
    return {
      post:function(interfacePath,jsonParams){
        var deferred = $q.defer();
        $http({
          method:"post",
          url:interfacePath,
          data:jsonParams,
          //headers:{'Content-Type': 'application/json'}
        }).success(function (data){
          deferred.resolve(data);
        })
          .error(function(data,status){
            //$ionicLoading.hide();
            $ionicLoading.show({template: "网络不太顺畅哦~", noBackdrop: true, duration:3000});
            deferred.reject(data,status);
          });
        return deferred.promise;
      },
      get:function(interfacePath,jsonParams){
        var deferred = $q.defer();
        $http({
          method: 'GET',
          url: interfacePath,
          params: jsonParams
        }).success(function(data){
          deferred.resolve(data);
        }).error(function(data,status){
          $ionicLoading.show({template: "网络不太顺畅哦~", noBackdrop: true, duration:3000});
          deferred.reject(data, status);
        });
        return deferred.promise;
      }
    };
  })
  .factory('ToolService', function () {//改commonjs 为 ToolService
    return {
      //日期格式转化
      initTimer: function (str) {//需要转化的字符串
        //非空
        if (str == "" || str == undefined || str == null || str == NaN) {
          return
        } else {
          var res = str.split('');
          var string = "";
          for (var i = 0; i < res.length; i++) {
            if (i == 3 || i == 5) {
              res[i] += '-';
            }
            if (i == 7){ res[i] += " " }
            if (i == 9){ res[i] += ":" }
            if (i == 12){ return string }
            string += res[i];
          }
          return string;
        }
      },
      //金额格式
      formMoney: function (s, n) {//s为金额，n为小数保留位数
        if(s == "" || s == undefined || s * 1 == null || s * 1 == NaN){
          return 0;
        }else{
          n = n > 0 && n <= 20 ? n : 2;
          s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
          var l = s.split(".")[0].split("").reverse(),
          r = s.split(".")[1];
          t = "";
          for (i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
          }
          return t.split("").reverse().join("") + "." + r;
        }

      },
      //判断是否IOS平台
      isIOS:function(){
        if(navigator.userAgent.indexOf('iPhone') > -1){
          return true;
        }else{
          return false;
        }
      }
    };
  })
  /*修改*/
//修改密码
.factory('ChangePassword', function ($injector, config) {
  var HttpService = $injector.get('HttpService');
  return {
    http: function (oldPassWord,smsCode,passWord,newPwdMakeSure) {
      var sid = JSON.parse(window.localStorage.getItem("user")).sid;
      var promise = HttpService.post(config.envPath + config.HttpInsertApis.changePassWord, {
        "oldPassWord":oldPassWord,
        "smsCode":smsCode,
        "passWord":passWord,
        "newPwdMakeSure":newPwdMakeSure,
        "ip": "11",
        "version": "11",
        "senttime": "11",
        "sendmsgid": "11",
        "chlterminaltype": "11",
        "tn": "11",
        "sid": sid,
        "si": "11"
      });
      return promise;
    }
  }
})

  //数据字典
  .factory('GetDictByNo',function($injector,config){
    var HttpService = $injector.get('HttpService');
    return{
      http:function(typNoS,pageNum,pageSize){
        var promise=HttpService.post(config.envPath+config.HttpInsertApis.getDictByNo,{
          'typNoS':typNoS,
          'pageNum':pageNum,
          'pageSize':pageSize,
          "ip":"22222",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":"09876",
          "si":"12431"
        });
        return promise;
      }
    }
  })
  //获取短信验证码（登录区内）
  .factory('workgetSmsCode',function($injector,config){
    var HttpService = $injector.get('HttpService');
    return{
      getsmsCode:function(bussType){  /*业务类型*/
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var mobileNo = JSON.parse(window.localStorage.getItem("user")).mobile;
        var promise=HttpService.post(config.envPath+config.HttpInsertApis.workSysGetSmsCode,{
          //"P":"",
          //'mac':'',
          'mobileNo':mobileNo,//后面再改
          'bussType':bussType,
          "ip":"22222",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431"
        });
        return promise;
      }
    }
  })
  //获取短信验证码（登录区外）
  .factory('PortalSysGetSmsCode',function($injector,config){
    var HttpService = $injector.get('HttpService');
    return{
      getsmsCode:function(mobileNo,bussType){
        var promise=HttpService.post(config.envPath+config.HttpInsertApis.portalSysGetSmsCode,{
          'mobileNo':mobileNo,
          'bussType':bussType,
          "ip":"22222",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":"09876",
          "si":"12431"
        });
        return promise;
      }
    }
  })

  //登录
  .factory('Login', function($injector,config) {
    var HttpService = $injector.get('HttpService');
    return{
      toLogin: function (accName, password,vertityTyp,vertityCode) { /* config.envPath +*/
        var promise = HttpService.post( config.envPath + config.HttpInsertApis.operatorLogin,{
          "ip":"22222",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":"09876",
          "si":"12431",
          "usrCd":accName,
          "password":password,
          'vertityCode':vertityCode,
          "rand":"wx43",
          "vertityTyp":vertityTyp,
          "registerId":'1'
        });
        return promise;
      }
    }
  })
  //获取验证码
  .factory('moretranCode',function($injector,config){
    var HttpService = $injector.get('HttpService');
    return{
      getCode:function(bussType,mobileNo){  /*业务类型 手机号码*/
        var promise = HttpService.post(config.envPath+config.HttpInsertApis.portalGetSmsCode,{
          "ip":"22222",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":"09876",
          "si":"12431",
          'bussType':bussType,
          'mobileNo':mobileNo
        });
        return promise;
      }
    }
  })
  //忘记密码
  .factory('Forgetpwd', function($injector,config) {
    var HttpService = $injector.get('HttpService');
    return{
      toChange: function (mobileNo,passwd,confirmPasswd,code,usrCd) {
        var promise = HttpService.post(config.envPath + config.HttpInsertApis.portalSysResetPwd,{
          "usrCd": usrCd, //  账户名
          "mobileNo":mobileNo,//手机号
          "passWord": passwd, // 密码
          'confirmPasswd':confirmPasswd, // 确认密码
          "smsCode":code,// 短信验证码
          "ip":"22222",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":"09876",
          "si":"12431"
        });
        return promise;
      }
    }
  })

  //-----融资受理、融资审核、风控审查、风控审批、融资审批、计财审核
  .factory('QueryTask',function($injector,config){
    var HttpService = $injector.get('HttpService');
    return{
      http:function(bussType,pageNum,pageSize){  /*@bussType:业务类型，@pageNum:当前页*/
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise=HttpService.post(config.envPath+config.HttpInsertApis.queryDisctTask,{
          "ip":"22222",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431",
          "bussType":bussType,
          "pageNum":pageNum,
          'pageSize':10
        });
        return promise;
      }
    }
  })
  //-----融资审批操作
  .factory('DrfApprove',function($injector,config){
    var HttpSeervice=$injector.get('HttpService');
    return {           /* 操作类型    短信验证码  审批意见 审批备注  审核列表  融资ID */
      drfApprove:function(operateType,smsCode,appStat,appRmk,approveList){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise=HttpSeervice.post(config.envPath+config.HttpInsertApis.disctApprove,{
          "ip":"22222",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431",
          "operateType":operateType,
          'smsCode':smsCode,
          'appStat':appStat,
          'appRmk':appRmk,
          'approveList':approveList
        });
        return promise;
      }
    }
  })
  //-----融资业务详情
  .factory('DrfDetail',function($injector,config){
    var HttpSeervice=$injector.get('HttpService');
    return {
      http:function(id){   /*@drfid:融资ID*/
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise=HttpSeervice.post(config.envPath + config.HttpInsertApis.disctDisctApplyDetail,{
          "ip":"100",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431",
          "id":id
        });
        return promise;
      }
    }
  })

  //-----融资到期业务
  .factory('PayDrftList',function($injector,config){
    var HttpSeervice=$injector.get('HttpService');
    return {
      http:function(pageNum,pageSize){   /*@drfid:融资ID*/
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise=HttpSeervice.post(config.envPath + config.HttpInsertApis.queryPayDrftList,{
          "ip":"100",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431",
          'pageNum':pageNum,
          "pageSize":pageSize
        });
        return promise;
      }
    }
  })
  //-----融资到期申请
  .factory('ApplyForOwner',function($injector,config){
    var HttpSeervice=$injector.get('HttpService');
    return {
      http:function(smsCode,drftList){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise=HttpSeervice.post(config.envPath + config.HttpInsertApis.applyForOwner,{
          "ip":"100",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431",
          'smsCode':smsCode,
          'drftList':drftList
        });
        return promise;
      }
    }
  })
  //-----查询银行账号列表
  .factory('ListAcct',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      listacct:function(pageNum,pageSize){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.HttpInsertApis.listAcct,{
          'pageNum':pageNum,
          'pageSize':pageSize,
          "ip":"100",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431"
        });
        return promise;
      }
    }
  })
  //-----融资到期申请 单笔详情
  .factory('TxnApproveDetail',function($injector,config){
    var HttpSeervice=$injector.get('HttpService');
    return {
        http:function(appNo){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise=HttpSeervice.post(config.envPath + config.HttpInsertApis.txnApproveDetail,{
          "ip":"100",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431",
            'appNo':appNo
        });
        return promise;
      }
    }
  })

  //-----付款审核
  .factory('PayApproveList',function($injector,config){
    var HttpSeervice=$injector.get('HttpService');
    return {
      http:function(pageNum,pageSize){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise=HttpSeervice.post(config.envPath + config.HttpInsertApis.payApproveList,{
          "ip":"100",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431",
          'pageNum':pageNum,
          'pageSize':pageSize
        });
        return promise;
      }
    }
  })
  //-----付款审核通过、驳回
  .factory('PrsntPayApprove',function($injector,config){
    var HttpSeervice=$injector.get('HttpService');
    return {
      http:function(appStat,smsCode,list,appRmk){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise=HttpSeervice.post(config.envPath + config.HttpInsertApis.prsntPayApprove,{
          "ip":"100",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431",
          'appStat':appStat,
          'smsCode':smsCode,
          'list':list,
          'appRmk':appRmk
        });
        return promise;
      }
    }
  })
  //------付款审核单笔详情 prsntPayqueryDetail
  .factory('PayqueryDetail',function($injector,config){
    var HttpSeervice=$injector.get('HttpService');
    return {
      http:function(appNo){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise=HttpSeervice.post(config.envPath + config.HttpInsertApis.prsntPayqueryDetail,{
          "ip":"100",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431",
          'appNo':appNo
        });
        return promise;
      }
    }
  })

  //-----企业审核
  .factory('CurrentapproveList',function($injector,config){
    var HttpSeervice=$injector.get('HttpService');
    return {
      http:function(pageNum,pageSize){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise=HttpSeervice.post(config.envPath + config.HttpInsertApis.currentapproveList,{
          "ip":"100",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431",
          'pageNum':pageNum,
          'pageSize':pageSize
        });
        return promise;
      }
    }
  })
  //-----企业审核通过、驳回
  .factory('Currentapprove',function($injector,config){
    var HttpSeervice=$injector.get('HttpService');
    return {
      http:function(operateType,msgList,advice){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise=HttpSeervice.post(config.envPath + config.HttpInsertApis.currentapprove,{
          "ip":"100",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431",
          'operateType':operateType,
          'approveList':msgList,
          'advice':advice
        });
        return promise;
      }
    }
  })
  //------企业审核单笔详情
  .factory('CurrentapproveDetail',function($injector,config){
    var HttpSeervice=$injector.get('HttpService');
    return {
      http:function(custNo){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise=HttpSeervice.post(config.envPath + config.HttpInsertApis.currentapproveDetail,{
          "ip":"100",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431",
          'custNo':custNo
        });
        return promise;
      }
    }
  })
  //------图片获取
  .factory('ViewAttach',function($injector,config){
    var HttpSeervice=$injector.get('HttpService');
    return {
      http:function(id){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise=HttpSeervice.get(config.envPath + config.HttpInsertApis.viewAttach,{
          "ip":"100",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431",
          'id':id
        });
        return promise;
      }
    }
  //-----用户审核
  .factory('QueryUserAudit',function($injector,config){
      var HttpSeervice=$injector.get('HttpService');
      return {
        http:function(condition){
          var sid = JSON.parse(window.localStorage.getItem("user")).sid;
          var promise=HttpSeervice.post(config.envPath + config.HttpInsertApis.queryUserAudit,{
            "ip":"100",
            "version":"22222",
            "senttime":"2017818",
            "sendmsgid":"234567",
            "chlterminaltype":"10",
            "tn":"122444",
            "sid":sid,
            "si":"12431",
            'pageNum':condition.pageNum,
            'pageSize':condition.pageSize
          });
          return promise;
        }
      }
    })
  //-----用户审核通过、驳回
  .factory('UserAudit',function($injector,config){
      var HttpSeervice=$injector.get('HttpService');
      return {
        http:function(state,list,smsCode,remark){
          var sid = JSON.parse(window.localStorage.getItem("user")).sid;
          var promise=HttpSeervice.post(config.envPath + config.HttpInsertApis.userAudit,{
            "ip":"100",
            "version":"22222",
            "senttime":"2017818",
            "sendmsgid":"234567",
            "chlterminaltype":"10",
            "tn":"122444",
            "sid":sid,
            "si":"12431",
            'state':state,
            'list':list,
            'smsCode':smsCode,
            'remark':remark
          });
          return promise;
        }
      }
    })
  //------用户审核单笔详情
  .factory('QueryUserAuditDetail',function($injector,config){
      var HttpSeervice=$injector.get('HttpService');
      return {
        http:function(id){
          var sid = JSON.parse(window.localStorage.getItem("user")).sid;
          var promise=HttpSeervice.post(config.envPath + config.HttpInsertApis.queryUserAuditDetail,{
            "ip":"100",
            "version":"22222",
            "senttime":"2017818",
            "sendmsgid":"234567",
            "chlterminaltype":"10",
            "tn":"122444",
            "sid":sid,
            "si":"12431",
            'id':id
          });
          return promise;
        }
      }
    })



  //-----查询消息列表
  .factory('Home',function($injector,config){
    var HttpService=$injector.get('HttpService');
    return{
      getMsgtotal:function(readFlag,pageNum,pageSize){ /*@readFlag:已读标志 当前页 每页显示条数*/
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise=HttpService.post(config.envPath + config.HttpInsertApis.msgQueryMessages,{
          "ip":"100",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431",
          'readFlag':readFlag,
          'pageNum':pageNum,
          'pageSize':pageSize
        });
        return promise;
      }
    }
  })
  //-----消息置为可读
  .factory('ReadOpt',function($injector,config){
    var HttpService=$injector.get('HttpService');
    return {
      readOpt:function(msgList){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise=HttpService.post(config.envPath+config.HttpInsertApis.msgMsgReadOpt,{
          "ip":"100",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431",
          'msgList':msgList
        });
        return promise;
      }
    }
  })
  //-----删除消息
  .factory('Delmessages',function($injector,config){
    var HttpService=$injector.get('HttpService');
    return {
      delMsg:function(msgList){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise=HttpService.post(config.envPath+config.HttpInsertApis.msgDellMessages,{
          "ip":"100",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431",
          'msgList':msgList
        });
        return promise;
      }
    }
  })




  //-----我的

  //-----历史任务 1-6
  .factory('QueryhistoryTask',function($injector,config){
    var HttpService=$injector.get('HttpService');
    return{
      http:function(bussType,condition,pageNum,pageSize){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise=HttpService.post(config.envPath + config.HttpInsertApis.queryhistoryTask,{
          "ip":"100",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431",
          'bussType':bussType,
          'condition':condition,
          'pageNum':pageNum,
          'pageSize':pageSize
        });
        return promise;
      }
    }
  })
  //-----历史任务 付款审核
  .factory('QpayhistoryTask',function($injector,config){
    var HttpService=$injector.get('HttpService');
    return{
      http:function(condition,pageNum,pageSize){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise=HttpService.post(config.envPath + config.HttpInsertApis.qpayhistorylist,{
          "ip":"100",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431",
          'condition':condition,
          'pageNum':pageNum,
          'pageSize':pageSize
        });
        return promise;
      }
    }
  })
  //-----历史任务 用户审核
  .factory('QuserhistoryTask',function($injector,config){
    var HttpService=$injector.get('HttpService');
    return{
      http:function(pageNum,pageSize){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise=HttpService.post(config.envPath + config.HttpInsertApis.quserhistorylist,{
          "ip":"100",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431",
          'pageNum':pageNum,
          'pageSize':pageSize
        });
        return promise;
      }
    }
  })
  //修改新手机号1CURC1006
  .factory('ChangeMobile', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (mobile,smsCode,bussType) {
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpService.post(config.envPath + config.HttpInsertApis.changeStaffMobeil, {
          "mobile":mobile,
          "smsCode":smsCode,
          "bussType":bussType,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid":sid,
          "si": "11"
        });
        return promise;
      }
    }
  })
  //修改手机号2CURC1006
  .factory('CheckMobile', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (mobile,smsCode,bussType) {
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpService.post(config.envPath + config.HttpInsertApis.CURC1005, {
          "mobile":mobile,
          "smsCode":smsCode,
          "bussType":bussType,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid":sid,
          "si": "11"
        });
        return promise;
      }
    }
  })
  .factory('getUserMsg', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function () {
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpService.post(config.envPath + config.HttpInsertApis.CenterGetStaffInfo, {
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid":sid,
          "si": "11"
        });
        return promise;
      }
    }
  })

  /*用户信息*/
  .factory('getUserMsg1', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function () {
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpService.post(config.envPath + config.HttpInsertApis.getUsr, {
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid":sid,
          "si": "11"
        });
        return promise;
      }
    }
  })
  /*退回登录*/
  .factory('LoginOut',function($injector,config){
    var HttpService=$injector.get('HttpService');
    return{
      http:function(){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise=HttpService.post(config.envPath + config.HttpInsertApis.operatorLoinOut,{
          "ip":"100",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431"
        });
        return promise;
      }
    }
  })


  ;


