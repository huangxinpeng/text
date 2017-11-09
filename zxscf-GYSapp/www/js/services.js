/**
 * Created by MrHai on 2016/3/23.
 */
angular.module('zxscf.services', [])
  //统一请求方法
  .factory('HttpService', function ($http, $q, $ionicLoading,$state) {
    var formData = {};
    function transFile(fileAry){
      var promiseAry=fileAry.map(function(item){
        var deferred = $q.defer();
        // 转换为实体文件对象
        window.resolveLocalFileSystemURL(item.filePath, function(fileEntry) {
          fileEntry.file(function (file) {
            var reader = new FileReader();
            reader.onloadend = function(e) {
              var theFile = new Blob([e.target.result ], { type: file.type } );
              formData.append(item.fileKey,theFile,file.name);
              deferred.resolve(item.filePath);
            };
            reader.readAsArrayBuffer(file);
          });
        });
        return deferred.promise;
      });
      return $q.all(promiseAry);
    }
    return {
      post: function (interfacePath, jsonParams) {
        var deferred = $q.defer();
        $http({
          method: 'post',
          url: interfacePath,
          data: jsonParams,
        }).success(function (data) {
          if(data.code == '170003'){
            $state.go('login');
          }
          //if (data.body.returnCode == "000001") {
          //}
          //if(data.body.returnCode == "I29999" || data.body.returnCode == "I599999"){
          //  $ionicLoading.hide();
          //  $ionicLoading.show({template:data.body.returnMsg, noBackdrop: true, duration: 2000});
          //}
          deferred.resolve(data);
        })
          .error(function (data, status) {
            console.log(data, status);
            //console.log(status);//状态码是0表示没有发出ajax请求
            // //错误
            // $ionicLoading.hide();
             $ionicLoading.show({template: "网络不太顺畅哦~", noBackdrop: true, duration:3000});
            deferred.reject(data, status);
          })

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
      },
      formDataPost:function(interfacePath,formData){
        var deferred = $q.defer();
        $http({
          method:'post',
          url:interfacePath,
          data: formData,
          headers: {
            'Content-Type':undefined
          },
          transformRequest: angular.identity
        }).success( function ( response )
          {
            //上传成功的操作
            deferred.resolve(response);
          }).error(function(data,status){
          deferred.reject(data, status);
        });
        return deferred.promise;
      },
      // 批量上传服务 fileForm {fileKey 文件字段name属性,filePath 文件本地路径}
      uploadFile:function(interfacePath,fileForm){
        var deferred = $q.defer();
        formData = new FormData();
       transFile(fileForm.files).then(function(filePathAry){
         if(fileForm.params){
           angular.forEach(fileForm.params, function (value, key) {
             formData.append(key, value);
           });
         }
         $http({
           method:'post',
           url:interfacePath,
           data: formData,
           headers: {
			 'Content-Type':undefined
             //'Content-Type':"multipart/form-data"
           },
           transformRequest: angular.identity
         }).success( function ( response )
         {
           //上传成功的操作
           deferred.resolve(response);
         }).error(function(data,status){
           deferred.reject(data, status);
         });
       });
        return deferred.promise;
      }
    };
  })
  //极光推送
  .factory('Push', function () {
    var push;
    return {
      setBadge: function (badge) {
        if (push) {
          console.log('jpush: set badge', badge);
          plugins.jPushPlugin.setBadge(badge);
        }
      },
      setAlias: function (alias) {
        if (push) {
          console.log('jpush: set alias', alias);
          plugins.jPushPlugin.setAlias(alias);
        }
      },
      check: function () {
        if (window.jpush && push) {
          plugins.jPushPlugin.receiveNotificationIniOSCallback(window.jpush);
          window.jpush = null;
        }
      },
      init: function (notificationCallback) {
        console.log('jpush: start init-----------------------');
        push = window.plugins && window.plugins.jPushPlugin;
        if (push) {
          console.log('jpush: init');
          plugins.jPushPlugin.init();
          plugins.jPushPlugin.setDebugMode(true);
          plugins.jPushPlugin.openNotificationInAndroidCallback = notificationCallback;
          plugins.jPushPlugin.receiveNotificationIniOSCallback = notificationCallback;
        }
      }
    };
  })
  //ToolService
  .factory('ToolService', function () {//改commonjs 为 ToolService
    return {
      //日期格式转化
      initTimer: function (str) {
      //需要转化的字符串
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
      },
      //邮箱正则
      setEmail: function (email) {
        var szReg=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        var res=szReg.test(email);
        return res;
      },
      //银行卡格式
      bankAccNo: function (content) {
        return content ? content.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ") : content;
      },
      //数字人民币转化汉字
      currency:function (money) {
      //汉字的数字
      var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
      //基本单位
      var cnIntRadice = new Array('', '拾', '佰', '仟');
      //对应整数部分扩展单位
      var cnIntUnits = new Array('', '万', '亿', '兆');
      //对应小数部分单位
      var cnDecUnits = new Array('角', '分', '毫', '厘');
      //整数金额时后面跟的字符
      var cnInteger = '整';
      //整型完以后的单位
      var cnIntLast = '元';
      //最大处理的数字
      var maxNum = 999999999999999.9999;
      //金额整数部分
      var integerNum;
      //金额小数部分
      var decimalNum;
      //输出的中文金额字符串
      var chineseStr = '';
      //分离金额后用的数组，预定义
      var parts;
      if (money == '') { return ''; }
      money = parseFloat(money);
      if (money >= maxNum) {
        //超出最大处理数字
        return '';
      }
      if (money == 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger;
        return chineseStr;
      }
      //转换为字符串
      money = money.toString();
      if (money.indexOf('.') == -1) {
        integerNum = money;
        decimalNum = '';
      } else {
        parts = money.split('.');
        integerNum = parts[0];
        decimalNum = parts[1].substr(0, 4);
      }
      //获取整型部分转换
      if (parseInt(integerNum, 10) > 0) {
        var zeroCount = 0;
        var IntLen = integerNum.length;
        for (var i = 0; i < IntLen; i++) {
          var n = integerNum.substr(i, 1);
          var p = IntLen - i - 1;
          var q = p / 4;
          var m = p % 4;
          if (n == '0') {
            zeroCount++;
          } else {
            if (zeroCount > 0) {
              chineseStr += cnNums[0];
            }
            //归零
            zeroCount = 0;
            chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
          }
          if (m == 0 && zeroCount < 4) {
            chineseStr += cnIntUnits[q];
          }
        }
        chineseStr += cnIntLast;
      }
      //小数部分
      if (decimalNum != '') {
        var decLen = decimalNum.length;
        for (var i = 0; i < decLen; i++) {
          var n = decimalNum.substr(i, 1);
          if (n != '0') {
            chineseStr += cnNums[Number(n)] + cnDecUnits[i];
          }
        }
      }
      if (chineseStr == '') {
        chineseStr += cnNums[0] + cnIntLast + cnInteger;
      } else if (decimalNum == '') {
        chineseStr += cnInteger;
      }
      return chineseStr;
    },
      //日期分解成年月日
      splitDat: function () {

      }

    };
  })
  .factory('Login', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      toLogin: function (accName, password, vertityTyp,vertityCode) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.LG1001, {
          "usrCd": accName, //  账户名
          "password": password, // 密码
          'vertityTyp':vertityTyp,
          'vertityCode':vertityCode,
          "ip": "1",
          "version": "1",
          "senttime": "1",
          "sendmsgid": "1",
          "chlterminaltype": "1",
          "tn": "1",
          "sid": "1",//38772920-c284-4c8c-a07e-07c0d3212e47
          "si": "1",
<<<<<<< HEAD
          "registerId":"123"
=======
          //"registerId":window.localStorage.getItem('RegistrationID')
          "registerId":'111'
>>>>>>> 276b1ba8fdedef6126502ae6ceccb5cf25901edc
        });
        return promise;
      }
    }
  })
  //查询企业归属列表
  .factory('tabHomeCorpList', function ($injector,config) {
    var HttpServiece = $injector.get('HttpService');
    return {
      http : function(){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.CURC1004,{
          "ip": "100",
          "version": "22222",
          "senttime": "2017818",
          "sendmsgid": "234567",
          "chlterminaltype": "10",
          "tn": "122444",
          "sid": sid,
          "si": "12431"
        });
        return promise;
      }
    }
  })

  //------ZJL START------
  //-----登录区外 获取短信验证码
  .factory('OtgetSmsCode', function ($injector, config) {
    var HttpServiece = $injector.get('HttpService');
    return {
      getsmscode: function (bussType,mobileNo) {
        //var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.CM1001, {
          'bussType': bussType,
          'mobileNo':mobileNo,
          "ip": "100",
          "version": "22222",
          "senttime": "2017818",
          "sendmsgid": "234567",
          "chlterminaltype": "10",
          "tn": "122444",
          "sid": '123',
          "si": "12431"
        });
        return promise;
      }
    }
  })
  //-----登录区内获取短信验证码
  .factory('getSmsCode', function ($injector, config) {
    var HttpServiece = $injector.get('HttpService');
    return {
      getsmscode: function (bussType) {
        //var sid = window.localStorage.getItem("user");
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.CM1002, {
          'bussType': bussType,
          "ip": "100",
          "version": "22222",
          "senttime": "2017818",
          "sendmsgid": "234567",
          "chlterminaltype": "10",
          "tn": "122444",
          "sid": window.localStorage.getItem('sid'),
          "si": "12431"
        });
        return promise;
      }
    }
  })
  //-----数据字典
    .factory('GetDictByNo', function ($injector, config) {
      var HttpServiece = $injector.get('HttpService');
      return {
        http: function (typNoS,pageNum,pageSize) {
          //var sid = JSON.parse(window.localStorage.getItem("user")).sid;
          var promise = HttpServiece.post( config.envPath + config.httpInsertApi.CM1008, {
            'typNoS': typNoS,
            'pageNum':pageNum,
            'pageSize':pageSize,
            "ip": "100",
            "version": "22222",
            "senttime": "2017818",
            "sendmsgid": "234567",
            "chlterminaltype": "10",
            "tn": "122444",
            "sid": '321',
            "si": "12431"
          });
          return promise;
        }
      }
    })


  //-----忘记密码
  .factory('ResetPwd', function ($injector, config) {
    var HttpServiece = $injector.get('HttpService');
    return {
      resetpwd: function (usrCd,passwd,confirmPasswd,vertityCode) {
        //var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.CM1003, {
          'usrCd': usrCd,
          'passWord':passwd,
          'confirmPasswd':confirmPasswd,
          'code':vertityCode,
          "ip": "100",
          "version": "22222",
          "senttime": "2017818",
          "sendmsgid": "234567",
          "chlterminaltype": "10",
          "tn": "122444",
          "sid": '321',
          "si": "12431"
        });
        return promise;
      }
    }
  })
  //-----企业注册一  企业信息
  .factory('CheckCorInfo',function($injector,config){
    var HttpService = $injector.get('HttpService');
    return {
      regcorInfo: function (fileForm) {
        /* var fd = new FormData();
         angular.forEach(fileForm, function (value, key) {
             fd.append(key, value);
         });
         fd.append('ip', '100');
         fd.append('version', '22222');
         fd.append('senttime', '2017818');
         fd.append('sendmsgid', '234567');
         fd.append('chlterminaltype', '10');
         fd.append('tn', '1223444');
         fd.append('sid', '123');
         fd.append('si', '13231');*/

        fileForm.params.ip='100';
        fileForm.params.version='22222';
        fileForm.params.senttime='2017818';
        fileForm.params.sendmsgid='234567';
        fileForm.params.chlterminaltype='10';
        fileForm.params.tn='1223444';
        fileForm.params.sid='123';
        fileForm.params.si='12321';

       return HttpService.uploadFile(config.envPath + config.httpInsertApi.ZC1001,fileForm);
       // return HttpService.formDataPost(config.envPath + config.httpInsertApi.ZC1001,fd);
      }
    }
  })

  //-----城市查询
  .factory('GetArea',function($injector,config){
    var HttpService = $injector.get('HttpService');
    return {
      http: function (parentID,areaType) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.CM1004, {
          'parentId':parentID,
          'areaType':areaType,
          "ip": "100",
          "version": "22222",
          "senttime": "2017818",
          "sendmsgid": "234567",
          "chlterminaltype": "10",
          "tn": "122444",
          "sid":'123',
          "si": "12431"
        });
        return promise;
      }
    }
  })

  /*  测试！  */
  .factory('AAAAAA',function($injector,config){
    var HttpService = $injector.get('HttpService');
    return {
      regcorInfo: function (attachDivCop) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.TEXT, {
          //'custCnNm':custCnNm,
          'idTyp':'0',
          'idNo':'111111',
          'attachDivCop':attachDivCop,
          'regAdr':'广东深圳',
          'regAdrProv':'深圳',
          'regAdrCity':'广东',
          'userId':'123',
          "ip": "100",
          "version": "22222",
          "senttime": "2017818",
          "sendmsgid": "234567",
          "chlterminaltype": "10",
          "tn": "122444",
          "sid": '123',
          "si": "12431"
        });
        return promise;
      }
    }
  })

  /*  测试！  */
    .factory('AAAAAA',function($injector,config){
      var HttpService = $injector.get('HttpService');
      return {
        regcorInfo: function (attachDivCop) {
          var promise = HttpService.post(config.envPath + config.httpInsertApi.CNM, {
            //'custCnNm':custCnNm,
            'idTyp':'0',
            'idNo':'111111',
            'attachDivCop':attachDivCop,
            'regAdr':'广东深圳',
            'regAdrProv':'深圳',
            'regAdrCity':'广东',
            'userId':'123',
            "ip": "100",
            "version": "22222",
            "senttime": "2017818",
            "sendmsgid": "234567",
            "chlterminaltype": "10",
            "tn": "122444",
            "sid": '123',
            "si": "12431"
          });
          return promise;
        }
      }
    })

  //-----企业注册二 法人信息注册
  .factory('CorpInfo',function($injector,config){
    var HttpService = $injector.get('HttpService');
    return {
      regcorInfo: function (fileForm) {
        fileForm.params.ip='100';
        fileForm.params.version='22222';
        fileForm.params.senttime='2017818';
        fileForm.params.sendmsgid='234567';
        fileForm.params.chlterminaltype='10';
        fileForm.params.tn='1223444';
        fileForm.params.sid='123';
        fileForm.params.si='12321';
        return HttpService.uploadFile(config.envPath + config.httpInsertApi.ZC1002,fileForm);
      }
    }
  })
    //新旧管理员确认
    .factory('RegUser',function($injector,config){
      var HttpService = $injector.get('HttpService');
      return {
        http: function (name,idNo) {
          var promise = HttpService.post(config.envPath + config.httpInsertApi.ZC1004, {
            'name':name,
            'idNo':idNo,
            "ip": "100",
            "version": "22222",
            "senttime": "2017818",
            "sendmsgid": "234567",
            "chlterminaltype": "10",
            "tn": "122444",
            "sid": '12',
            "si": "12431"
          });
          return promise;
        }
      }
    })
  //-----企业注册三 管理员注册
  .factory('UserInfo',function($injector,config){
    var HttpService = $injector.get('HttpService');
    return {
      regcorInfo: function (fileForm) {
        fileForm.params.ip='100';
        fileForm.params.version='22222';
        fileForm.params.senttime='2017818';
        fileForm.params.sendmsgid='234567';
        fileForm.params.chlterminaltype='10';
        fileForm.params.tn='1223444';
        fileForm.params.sid='123';
        fileForm.params.si='12321';
        return HttpService.uploadFile(config.envPath + config.httpInsertApi.ZC1003,fileForm);
      }
    }
  })
  //-----企业切换
  .factory('ChangeCorp',function($injector,config){
    var HttpService = $injector.get('HttpService');
    return {
      http: function (custNo) {
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpService.post(config.envPath + config.httpInsertApi.CURC1003, {
          'custNo':custNo,
          "ip": "100",
          "version": "22222",
          "senttime": "2017818",
          "sendmsgid": "234567",
          "chlterminaltype": "10",
          "tn": "122444",
          "sid": sid,
          "si": "12431"
        });
        return promise;
      }
    }
  })
  //-----消息查询
  .factory('QueryMessages',function($injector,config){
    var HttpService = $injector.get('HttpService');
    return {
      querymessage: function (readFlag,pageNum,pageSize) {
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpService.post(config.envPath + config.httpInsertApi.NW1001, {
          'readFlag':readFlag,
          'pageNum':pageNum,
          'pageSize':pageSize,
          "ip": "100",
          "version": "22222",
          "senttime": "2017818",
          "sendmsgid": "234567",
          "chlterminaltype": "10",
          "tn": "122444",
          "sid": sid,
          "si": "12431"
        });
        return promise;
      }
    }
  })
  //-----消息置为已读
  .factory('MsgReadOpt',function($injector,config){
    var HttpService = $injector.get('HttpService');
    return {
      readopt: function (msgList) {
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpService.post(config.envPath + config.httpInsertApi.NW1003, {
          'msgList':msgList,
          "ip": "100",
          "version": "22222",
          "senttime": "2017818",
          "sendmsgid": "234567",
          "chlterminaltype": "10",
          "tn": "122444",
          "sid": sid,
          "si": "12431"
        });
        return promise;
      }
    }
  })
  //-----消息删除
  .factory('DelMessages',function($injector,config){
    var HttpService = $injector.get('HttpService');
    return {
      delmessages: function (msgList) {
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpService.post(config.envPath + config.httpInsertApi.NW1002, {
          'msgList':msgList,
          "ip": "100",
          "version": "22222",
          "senttime": "2017818",
          "sendmsgid": "234567",
          "chlterminaltype": "10",
          "tn": "122444",
          "sid": sid,
          "si": "12431"
        });
        return promise;
      }
    }
  })
  //-----待签收任务总数查询
  .factory('SignTask', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      signTask: function () {
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpService.post(config.envPath + config.httpInsertApi.QT1001, {
          "ip": "100",
          "version": "22222",
          "senttime": "2017818",
          "sendmsgid": "234567",
          "chlterminaltype": "10",
          "tn": "122444",
          "sid": sid,
          "si": "12431"
        });
        return promise;
      }
    }
  })
  //-----待转让复核任务总数查询
  .factory('TxnTask', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      txnTask: function () {
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpService.post(config.envPath + config.httpInsertApi.QT1002, {
          "ip": "100",
          "version": "22222",
          "senttime": "2017818",
          "sendmsgid": "234567",
          "chlterminaltype": "10",
          "tn": "122444",
          "sid": sid,
          "si": "12431"
        });
        return promise;
      }
    }
  })
  //-----待融资复核任务数查询
  .factory('DisctTask', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      disctTask: function () {
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpService.post(config.envPath + config.httpInsertApi.QT1003, {
          "ip": "100",
          "version": "22222",
          "senttime": "2017818",
          "sendmsgid": "234567",
          "chlterminaltype": "10",
          "tn": "122444",
          "sid": sid,
          "si": "12431"
        });
        return promise;
      }
    }
  })
  //-----待签收任务查询
  .factory('SignList', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      signList: function (pageNum) {
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpService.post(config.envPath + config.httpInsertApi.BQS1002, {
          'pageNum': pageNum,
          "ip": "100",
          "version": "22222",
          "senttime": "2017818",
          "sendmsgid": "234567",
          "chlterminaltype": "10",
          "tn": "122444",
          "sid": sid,
          "si": "12431"
        });
        return promise;
      }
    }
  })
  //-----签收详情查询 单笔 - history
  .factory('SignDetail', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      signdetail: function (id) {
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpService.post(config.envPath + config.httpInsertApi.BQS1003, {
          'id': id,
          "ip": "100",
          "version": "22222",
          "senttime": "2017818",
          "sendmsgid": "234567",
          "chlterminaltype": "10",
          "tn": "122444",
          "sid": sid,
          "si": "12431"
        });
        return promise;
      }
    }
  })
  //-----签收详情查询 单笔
  .factory('SignWaitSignDetail', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      signdetail: function (id) {
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpService.post(config.envPath + config.httpInsertApi.BQS1005, {
          'id': id,
          "ip": "100",
          "version": "22222",
          "senttime": "2017818",
          "sendmsgid": "234567",
          "chlterminaltype": "10",
          "tn": "122444",
          "sid": sid,
          "si": "12431"
        });
        return promise;
      }
    }
  })
  //-----签收确认/驳回
  .factory('Sign', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      sign: function (appStat,signList,smsCode,appRmk) {
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpService.post(config.envPath + config.httpInsertApi.BQS1004, {
          'appStat':appStat,
          'signList': signList,
          'smsCode':smsCode,
          'appRmk':appRmk,
          "ip": "100",
          "version": "22222",
          "senttime": "2017818",
          "sendmsgid": "234567",
          "chlterminaltype": "10",
          "tn": "122444",
          "sid": sid,
          "si": "12431"
        });
        return promise;
      }
    }
  })
  //-----签收历史记录查询
  .factory('QuerySignHisList',function($injector,config){
    var HttpService = $injector.get('HttpService');
    return{
      getsignhislist:function(pageNum){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise=HttpService.post(config.envPath+config.httpInsertApi.QT1004,{
          'pageNum':pageNum,
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
  //-----查询可打印凭证信息
  .factory('QueryTranCert',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      http:function(pageNum,rcvCustName,startDate,endDate,pageSize){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.PDL1003,{
          'pageNum':pageNum,
          //'rcvCustName':rcvCustName,
          //'startDate':startDate,
          //'endDate':endDate,
          //'pageSize':pageSize,
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
  //-----转让凭证下载
  .factory('TxnDownload',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      http:function(appNo){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.get(config.envPath + config.httpInsertApi.PDL1001,{
          "pageNum":1,
          'appNo':appNo,
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
  //-----转让复核
  .factory('TxnApproveList',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      gettxnapprlist:function(bussType,pageNum){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.BZR1006,{
          'bussType':bussType,
          'pageNum':pageNum,
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
  //-----转让复核 单笔详情
  .factory('TxnApproveDetail',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      gettxnapprdetail:function(id){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.BZR1007,{
          'id':id,
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
  //-----转让复核  签收、驳回
  .factory('TxnApprove',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      txnapprove:function(bussType,appStat,smsCode,signList,appRmk){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.BZR1010,{
          'bussType':bussType,  //业务类型
          'appStat':appStat,    //审批意见
          'smsCode':smsCode,    //短信验证码
          'appRmk':appRmk,      //转让审核列表
          'signList':signList,  //appRmk  驳回需要
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
  //-----转让复核历史
  .factory('QueryTxnHisTask',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      gettxnhislist:function(bussType,pageNum){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.QT1005,{
          'bussType':bussType,
          'pageNum':pageNum,
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
  //-----融资复核任务查询
  .factory('QueryDisctList',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      querydisclist:function(bussType,pageNum,pageSize){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.DQDL1005,{
          'bussType':bussType,
          'pageNum':pageNum,
          'pageSize':'10',
          "ip": "100",
          "version": "22222",
          "senttime": "2017818",
          "sendmsgid": "234567",
          "chlterminaltype": "10",
          "tn": "122444",
          "sid": sid,
          "si": "12431"
        });
        return promise;
      }
    }
  })
  //-----融资复核详情 单笔
  .factory('QueryDisctDetail',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      gettxnapprdetail:function(id){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.DQDL1003,{
          'id':id,
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
  //-----融资操作 申请兑付或驳回
  .factory('DisctApproveForCorp',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      txnapprove:function(operateType,smsCode,appStat,approveList,appRmk){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.DQDL2001,{
          'operateType':operateType,  //操作类型
          'smsCode':smsCode,    //短信验证码
          'appStat':appStat,      //审批意见
          'approveList':approveList,//审核列表
          'appRmk':appRmk,  //审批备注  驳回需要
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
  //-----融资复核历史
  .factory('QueryDisctHisLis',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      getdiscthislist:function(bussType,pageNum){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.QT1006,{
          'bussType':bussType,
          'pageNum':pageNum,
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

  //-----到期宝券列表查询
  .factory('QueryPayDrftList',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      querypaydrftList:function(pageNum,pageSize){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.CPF1003,{
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
  //-----查询银行账号列表
  .factory('ListAcct',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      listacct:function(pageNum,pageSize){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.BAM1001,{
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
  //-----申请兑付
  .factory('ApplyForCorp',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      applyforcorp:function(smsCode,drftList){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.CPF1004,{
          'smsCode':smsCode,
          'drftList':drftList,
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
  //-----宝券详情信息查询
  .factory('QueryDrftDetail',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      drftdetail:function(id){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.QDL1002,{
          'id':id,
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

  //-----金币查询
  .factory('QueryBonus',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      querybonus:function(){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.COI1001,{
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
  //-----收支统计查询
  .factory('QueryinBonus',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      queryinbonus:function(){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.COI1004,{
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
  //-----金币收益明细   转让收益和融资收益    未入账
  .factory('QueryGenBonus',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      querygenbonus:function(pageNum,pageSize,txnScene,stat){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.COI1002,{
          'pageNum':pageNum,
          'pageSize':pageSize,
          'txnScene':txnScene,
          'stat':stat,
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
  //-----金币收益明细  使用
  .factory('QueryUsedBonus',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      queryusedBonus:function(pageNum,pageSize){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.COI1003,{
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
  //-----签收历史明细查询
  .factory('QySignHisList',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      signhistory:function(pageNum,pageSize,txnStat,startAmt,endAmt,startDate,endDate){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.BQS1001,{
          'pageNum':pageNum,
          'pageSize':pageSize,
          'txnStat':txnStat,
          'startAmt':startAmt,
          'endAmt':endAmt,
          'startDate':startDate,
          'endDate':endDate,
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
  //-----融资历史明细查询 DisctHisList



  //-----tab-融资
  //-----宝券融资
  .factory('DisctDrftList',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      http:function(pageNum,pageSize){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.DQDL1004,{
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
  //-----融资中宝券查询
  .factory('DrftList',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      getdrflist:function(pageNum,pageSize){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.DQDL1002,{
          'pageNum':pageNum,
          'pageSize':pageSize,
          "ip":"22222",
          "version":"22222",
          "senttime":"20170818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431",
          "txnStat":""
        });
        return promise;
      }
    }
  })
  //-----融资中业务详情
  .factory('RZbusinessDetail',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      http:function(id){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.DQDL1006,{
          "id":id,
          "ip":"22222",
          "version":"22222",
          "senttime":"20170818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431",
          "txnStat":""
        });
        return promise;
      }
    }
  })
  //-----融资申请
  .factory('RZapply', function ($injector,config) {
    var HttpServiece = $injector.get('HttpService');
    return{
      http:function(smsCode,drftApplyList){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.DQDL1007,{
          "ip":"22222",
          "version":"22222",
          "senttime":"20170818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":sid,
          "si":"12431",
          "txnStat":"",
          "smsCode":smsCode,
          "drftApplyList":drftApplyList
        });
        return promise;
      }
    }
  })
  //-----融资撤回
  .factory('RZDetailCheHui', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (idx,smsCode) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.DQDL1009, {
          "id": idx,
          "smsCode":smsCode,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //-----融资取消
  .factory('RZDetailCancel', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (idx,smsCode) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.DQDL1008, {
          "id": idx,
          "smsCode":smsCode,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //-----融资历史查询
  .factory('DisctHisList',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      discthislist:function(pageNum,pageSize,txnStat,startAmt,endAmt,startDate,endDate){
        var sid = JSON.parse(window.localStorage.getItem("user")).sid;
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.DQDL1001,{
          'pageNum':pageNum,
          'pageSize':pageSize,
          'txnStat':txnStat,
          'startAmt':startAmt,
          'endAmt':endAmt,
          'startDate':startDate,
          'endDate':endDate,
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
  //-----我的金币查询
  .factory('MineCoin',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      http:function(){
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.COI1001,{
          "ip":"100",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":window.localStorage.getItem('sid'),
          "si":"12431"
        });
        return promise;
      }
    }
  })
  //----我的银行账号列表
  .factory('RZMineBankList',function($injector,config){
    var HttpServiece = $injector.get('HttpService');
    return{
      http:function(){
        var promise = HttpServiece.post(config.envPath + config.httpInsertApi.BAM1001,{
          "pageNum":1,
          "ip":"100",
          "version":"22222",
          "senttime":"2017818",
          "sendmsgid":"234567",
          "chlterminaltype":"10",
          "tn":"122444",
          "sid":window.localStorage.getItem('sid'),
          "si":"12431"
        });
        return promise;
      }
    }
  })


  //------ZJL END------
  //HHS
  //多转一选择供应商列表
  .factory('DZYChoosebaoquanDetail', function () {
    var DZYdetail = [{
      id: 1,
      time: "20170321",
      comingday: "200",
      acount: '12323',
      showicon: 0
    }, {
      id: 2,
      time: "20170502",
      comingday: "100",
      acount: '1633',
      showicon: 1,
    }, {
      id: 3,
      time: "20171131",
      comingday: "120",
      acount: '333',
      showicon: 1
    }, {
      id: 4,
      time: "20181122",
      comingday: "150",
      acount: '43532',
      showicon: 0
    }, {
      id: 5,
      time: "20181222",
      comingday: "150",
      acount: '576522',
      showicon: 1
    }, {
      id: 6,
      time: "20171123",
      comingday: "150",
      acount: '4533355',
      showicon: 0
    }, {
      id: 7,
      time: "20180122",
      comingday: "150",
      acount: '1234',
      showicon: 1
    }, {
      id: 8,
      time: "30180605",
      comingday: "150",
      acount: '342',
      showicon: 0
    }, {
      id: 9,
      time: "10171109",
      comingday: "150",
      acount: '8765',
      showicon: 1
    }];
    return {
      all: function () {
        return DZYdetail
      }
    }
  })
  .factory('rongzixuanzegongyingshang', function () {
    var rongzixuanzegongyingshangs = [{
      id: 0,
      time: "2017-1-2",
      comingday: "220",
      acount: "10,9999.00",
      GYS: "供应商AAA"
    }, {
      id: 1,
      time: "2018-11-22",
      comingday: "150",
      acount: "100,000.00",
      GYS: "供应商BBB"
    }, {
      id: 2,
      time: "2018-11-22",
      comingday: "150",
      acount: "10,9999.00",
      GYS: "供应商CCC"
    }, {
      id: 3,
      time: "2018-11-22",
      name: "150",
      acount: "10,9999.00",
      GYS: "供应商DDD"
    }, {
      id: 4,
      time: "2018-11-22",
      comingday: "150",
      acount: "10,9999.00",
      GYS: "供应商EEE"
    }, {
      id: 5,
      time: "2018-11-22",
      comingday: "150",
      acount: "10,9999.00",
      GYS: "供应商FFF"
    }, {
      id: 5,
      time: "2018-11-22",
      comingday: "150",
      acount: "10,9999.00",
      GYS: "供应商FFF"
    }, {
      id: 5,
      time: "2018-11-22",
      comingday: "150",
      acount: "10,9999.00",
      GYS: "供应商FFF"
    }];
    return {
      all: function () {
        return rongzixuanzegongyingshangs
      }
    }
  })
  .factory('MineBaoQuan', function () {
    var MineBaoquans = [{
      id: 1,
      bianhao: '20160413-001',
      daoqi: '2018-03-03',
      company: '中兴通讯有限股份有限公司',
      acount: '100,505.01',
      time: '2018-03-03',
      zhuagtai: 1
    }, {
      id: 2,
      bianhao: '20160413-002',
      daoqi: '2018-03-03',
      company: '华为科技有限公司',
      acount: '100,505.01',
      time: '2017-03-03',
      zhuagtai: 0
    }, {
      id: 3,
      bianhao: '20160413-003',
      daoqi: '2018-03-03',
      company: '擎天柱实业股份有份公司',
      acount: '100,505.01',
      time: '2017-03-03',
      zhuagtai: 1
    }]
    return {
      all: function () {
        return MineBaoquans
      }
    }
  })
  .factory('MineBaoQuanDetail', function () {
    var MineBaoQuanDetails = [{
      id: 1,
      company: '中兴通讯股份有限公司',
      acount: '100,505.01',
      daoqi: '2018-03-03',
      zhuanruDay: '2017-03-03',
      zhuanrangfang: '中兴财务股份有限公司',
      danbaofang: '中兴财务股份有限公司',
      bianhao: '20160413-001',
      zhuangtai: 1
    }, {
      id: 2,
      company: '华为科技有限公司',
      acount: '100,505.01',
      daoqi: '2018-03-03',
      zhuanruDay: '2017-03-03',
      zhuanrangfang: '中兴财务股份有限公司',
      danbaofang: '无',
      bianhao: '20160413-002',
      zhuangtai: 0
    }, {
      id: 3,
      company: '擎天柱实业股份有份公司',
      acount: '100,505.01',
      daoqi: '2018-03-03',
      zhuanruDay: '2017-03-03',
      zhuanrangfang: '某个有限公司',
      danbaofang: '某个有限公司',
      bianhao: '20160413-001',
      zhuangtai: 1
    }];
    return {
      all: function () {
        return MineBaoQuanDetails
      }
    }
  })
  .factory('MineBankID', function () {
    var MineBankIDs = [{
      bankname: '招商银行高新园支行',
      place: '深圳',
      number: '8888888888812345',
      isuse: '1',//可用
      icon: 1//是否默认
    }, {
      bankname: '中信银行深大支行',
      place: '深圳',
      number: '5431888888888123',
      isuse: '2',//已打款待验证
      icon: 0
    }, {
      bankname: '农业银行上海支行',
      place: '上海',
      number: '1123888458888878',
      isuse: '3',//待验证
      icon: 0
    }];
    return {
      all: function () {
        return MineBankIDs
      }
    }
  })
  .factory('ListModel', function () {
    var ListModels = [{
      "code": "000000",
      "message": "成功",
      "data": {
        "ID": "001001001",//转让ID
        "sid": "123232",//sessionId
        "usrCd": "22",//登录账号
        "custNo": "",//当前登录企业客户号
        "startDate": "20191201",//开始时间
        "startAmt": "200000.00",//转让金额
        "endDate": "20130512",//结束时间
        "endAmt": "50000.00",
        "isDelay": "0",//延期标志0否1是
        "pageNum": "1",//从第一页开始
        "pageSize": "10",//默认10条
        //上为请求
        //下为响应
        "total": "10",//总条数
        "signList": "10",//每页默认10条
        "appNo": "001001001",//流程任务申请号
        "txnDt": "",//交易日期
        "srcDrftNo": "",//源票据号码
        "srcDueDt": "",//源票面到期日
        "reqCustNo": "",//转出方客户编号
        "reqCustNm": "",//转出方客户名称
        "drwrNm": "",//开单方名称
        "txnAmt": "3000.00",//交易金额
        "delayDays": "",//延期天数
        "bouns": "",//延期收益
        "txnStat": "11",//交易状态03已取消 05已撤回 11已签收 12已驳回

      }
    }];
  })
  .factory('ZrangZhong', function () {
    var ZrangZhongs = [{
      company: '转入方企业AAA',
      acount: '100,000.00',
      day: '2017-02-31',
      zhuangtai: '1',
    }, {
      company: '转入方企业BBB',
      acount: '100,000.00',
      day: '2017-02-31',
      zhuangtai: '0',
    }, {
      company: '转入方企业CCC',
      acount: '100,000.00',
      day: '2017-02-31',
      zhuangtai: '2',
    }]
    return {
      all: function () {
        return ZrangZhongs
      }
    }
  })
  .factory('MineChangeCompany', function () {
    var MineChangeCompanys = [{
      cpa: '中兴通讯股份有限公司'
    }, {
      cpa: '梧桐股份有限公司'
    }, {
      cpa: '三和互联网科技有限公司'
    }, {
      cpa: '中兴财务有限公司'
    }, {
      cpa: 'Oprime集团有限公司'
    }];
    return {
      all: function () {
        return MineChangeCompanys;
      }
    }
  })
  .factory('JiaoYiDuiShouMsg',function (){
    var JiaoYiDuiShouMsgs = [{
      corp:'华为科技',
      count:'12'
    },{
      corp:'腾讯科技',
      count:'2'
    },{
      corp:'小米科技',
      count:'3'
    },{
      corp:'酷派科技',
      count:'9'
    }]
    return {
        all:function (){
          return JiaoYiDuiShouMsgs;
        }
    }
  })
  //我的企业信息查询
  .factory('MineCompanyHttp', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function () {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.CMG1001, {
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //我的企业-默认企业设置
  .factory('SettingMoRenCorp', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (custNo) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.CMG1009, {
          "custNo":custNo,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //申请数字证书
  .factory('ApplyCert', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (smsCode) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.CMG1002, {
          "smsCode": smsCode,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //用户协议签
  .factory('ApplyRegisterQian', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (smsCode) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.CMG1003, {
          "smsCode": smsCode,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //交易量
  .factory('jiaoyiliangHttp', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function () {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.TVQ1000, {
          "pageNum": "1",
          "ip": "1",
          "version": "1",
          "senttime": "1",
          "sendmsgid": "1",
          "chlterminaltype": "1",
          "tn": "1",
          "sid": window.localStorage.getItem('sid'),//38772920-c284-4c8c-a07e-07c0d3212e47
          "si": "11"
        });
        return promise;
      }
    }
  })
  //我的宝券
  .factory('Minebaoquanchaxun', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function () {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.QDL1001, {
          "pageNum": "1",
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //我的宝券详情
  .factory('MinebaoquanDetail', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (id) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.QDL1002, {
          "id": id,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //手续费率查询
  .factory('freeQuery', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (bussType,chargeKind,chargeType) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.CM1005, {
          "bussTyp":bussType,//产品编号
          "chargeKind":chargeKind,//收费类型
          "chargeType": chargeType,//收费方式
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //加保机构查询
  .factory('ConfirmList', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function () {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.CM1006, {
          "pageNum":1,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //申请加保
  .factory('ConfirmApply', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (orgId,orgNm,smsCode,applyList) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.QDL1003, {
          "orgId":orgId,
          "orgNm":orgNm,
          "smsCode":smsCode,
          "applyList":applyList,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //企业查询交易对手
  .factory('MineJiaoYiDuiShou', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (pageNum) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.CPL1002, {
          "pageNum": pageNum,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //通知管理员
  .factory('MineMailAdmin', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (mailMsg) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.CPL1004, {
          "mailMsg": mailMsg,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })

  //我的银行账号查询
  .factory('MineBankSearch', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function () {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.BAM1001, {
          "pageNum": 1,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //查询银行账号
  .factory('MineBankPayCheck', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (id) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.BAM1002, {
          "id":id,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //银行账号打款
  .factory('MineBankPayCheckNoNeedMoney', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (id,smsCode) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.BAM1006, {
          "id":id,
          "smsCode":smsCode,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //银行账号打款验证
  .factory('MineBankPayCheckNeedMoney', function ($injector, config) {
  var HttpService = $injector.get('HttpService');
  return {
    http: function (id,smsCode,amount) {
      var promise = HttpService.post(config.envPath + config.httpInsertApi.BAM1007, {
        "id":id,
        "smsCode":smsCode,
        "amount":amount,
        "ip": "11",
        "version": "11",
        "senttime": "11",
        "sendmsgid": "11",
        "chlterminaltype": "11",
        "tn": "11",
        "sid": window.localStorage.getItem('sid'),
        "si": "11"
      });
      return promise;
    }
  }
})
  //删除账户
  .factory('MineDeleteBank', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (id) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.BAM1004, {
          "id":id,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //添加银行账号
  .factory('MineAddBank', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (bankCity,bankProvince,openBrhCd,openBrhNm,acctNo,openAcctNm,defRecNo) {
        //bankCity,$scope.areaId,openBrhCd,openBrhNm,acctNo,openAcctNm,defRecNo
        var promise = HttpService.post(config.envPath + config.httpInsertApi.BAM1003, {
          "bankCity":bankCity,
          "bankProvince":bankProvince,
          "openBrhCd":openBrhCd,
          "openBrhNm":openBrhNm,
          "acctNo":acctNo,
          "openAcctNm":openAcctNm,
          "defRecNo":defRecNo,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })

  //用户列表查询
  .factory('UserListSearch', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function () {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.UMM1001, {
          "pageNum": 1,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //用户详情
  .factory('UserMessageDetail', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (id) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.UMM1002, {
          "id": id,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //重置密码
  .factory('UserUpdatePwd', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (id) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.UMM1007, {
          "id": id,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //删除用户、
  .factory('UserDeletePwd', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (id) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.UMM1005, {
          "id": id,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //修改用户
  .factory('UserEdit', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (smsCode,id,corpRoleIdList) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.UMM1006, {
          "smsCode":smsCode,
          "id": id,
          "corpRoleIdList":corpRoleIdList,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //添加用户
  .factory('UserAdd', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (usrNm,idTyp,idNo,mobile,smsCode,corpRoleIdList,attachDivFront,attachDivBack,attachDivPoa) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.UMM1004, {
          "usrNm":usrNm,
          "idTyp":idTyp,
          "idNo":idNo,
          "mobile":mobile,
          "smsCode":smsCode,
          "corpRoleIdList":corpRoleIdList,
          "attachDivFront":attachDivFront,//管理员证件正面
          "attachDivBack":attachDivBack,//管理员证件反面
          "attachDivPoa":attachDivPoa,//授权委托书
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //转让-------
  //可转宝券金额（首页的可转宝券金额）
  .factory('ZrangTotal',function($injector, config){
    var HttpService = $injector.get('HttpService');
    return {
      http: function () {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.BZR1000, {
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //转让中明细查询
  .factory('ZrangDetailSearch', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (pages) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.BZR1001, {
          "pageNum": pages,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //转让撤回
  .factory('ZrangDetailCheHui', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (idx,smsCode) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.BZR1009, {
          "id": idx,
          "smsCode":smsCode,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //融资撤回
  .factory('RongziDetailCheHui', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (idx,smsCode) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.DQDL1009, {
          "id": idx,
          "smsCode":smsCode,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //转让取消
  .factory('ZrangDetailCancel', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (idx) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.BZR1008, {
          "id": idx,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //转让详情
  .factory('ZrangDetailMsg', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (idx) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.BZR1007, {
          "id": idx,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //当前企业可转让宝券详情
  .factory('ZrangCorpBaoQuan', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (condition) {

        var promise = HttpService.post(config.envPath + config.httpInsertApi.BZR1005, {
          "condition":condition,
          "pageNum":"1",
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //多转一可转宝券详情
  .factory('ZrangDZYCorpBaoQuanHasCondition', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (condition) {

        var promise = HttpService.post(config.envPath + config.httpInsertApi.BZR1011, {
          "condition":condition,
          "pageNum":"1",
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //多转一初次请求
  .factory('ZrangDZYCorpBaoQuanHasNoCondition', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function () {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.BZR1011, {
          "pageNum":"1",
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })

  //常用交易对手查询
  .factory('CounterpartyListPartner', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function () {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.CPL1002, {
          "pageNum":"2",
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  .factory('')
  //添加交易对手
  .factory('CounterpartyListAddPartner',function ($injector, config){
    var HttpService = $injector.get('HttpService');
    return {
      http: function (custNo) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.CPL1003, {
          "custNo":custNo,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //交易对手查询企业
  .factory('SearchPartnerCorpName', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (qCustCnNm) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.CPL1001, {
          "custName":qCustCnNm,
          "pageNum":1,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })

  //转让历史
  .factory('ZRHistory',function ($injector, config){
    var HttpService = $injector.get('HttpService');
    return {
      http: function (pageNum,pageSize,txnStat,isDelay,startAmt,endAmt,startDate,endDate) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.BZR1003, {
          "pageNum":pageNum,  //当前页
          'pageSize':pageSize, //每页显示条数
          'txnStat':txnStat,  //交易状态 03-已取消 05-已撤回 11-已签收 12-已驳回
          'isDelay':isDelay, //延期标志 0-否 1-是
          'startAmt':startAmt, //转让金额
          'endAmt':endAmt,  //转让金额
          'startDate':startDate, //开始时间 yyyymmdd
          'endDate':endDate,  //结束时间 yyyymmdd
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //转让详情
  .factory('ZRDetail',function ($injector, config){
    var HttpService = $injector.get('HttpService');
    return {
      http: function (id) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.BZR1002, {
          "id":id,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //一转一转让申请
  .factory('YZYApply',function ($injector, config){
    var HttpService = $injector.get('HttpService');
    return {
      http: function (ZRApplyList,smsCode) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.BZR1YZY, {
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11",
          "smsCode":smsCode,//验证码
          "drftList":ZRApplyList
        });
        return promise;
      }
    }
  })
  //一转多转让申请
  .factory('YZDToApply', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (ZRApplyList,smsCode) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.BZR1YZD, {
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11",
          "smsCode":smsCode,//验证码
          "drftList":ZRApplyList
        });
        return promise;
      }
    }
  })
  //多转一转让申请
  .factory('DZYToApply', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (ZRApplyList,smsCode) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.BZR1DZY, {
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11",
          "smsCode":smsCode,//验证码
          "drftList":ZRApplyList
        });
        return promise;
      }
    }
  })
  //宝券详情
  .factory('BQDetail', function ($injector, config) {//
    var HttpService = $injector.get('HttpService');
    return {
      http: function (id) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.QDL1002, {
          "id":id,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
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
        var promise = HttpService.post(config.envPath + config.httpInsertApi.CURC1001, {
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //上传头像、身份证
  .factory('AddUserPic', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (attachCls,attachDiv,attachSct,isImg,attachNm,attachNm,relBusiNo,file) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.CMG1011, {
          "attachCls":attachCls,//资料大类
          "attachDiv":attachDiv,//资料小类
          "attachSct":attachSct,//资料细类
          "isImg":isImg,//是否图像
          "attachNm":attachNm,//资料说明
          "relBusiNo":relBusiNo,//关联业务编号
          "file":file,//文件上传流
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })

  .factory('ReturnCorp', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (custNo) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.CURC1003, {
          "custNo":custNo,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //修改手机号
  .factory('CheckMobile', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (mobile,smsCode,bussType) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.CURC1006, {
          "mobile":mobile,
          "smsCode":smsCode,
          "bussType":bussType,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //修改手机号
  .factory('ChangeMobile', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (mobile,smsCode,bussType) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.CURC1005, {
          "mobile":mobile,
          "smsCode":smsCode,
          "bussType":bussType,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  //重置密码
  .factory('ChangePassword', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (oldPassWord,smsCode,passWord) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.CURC1007, {
          "oldPassWord":oldPassWord,
          "smsCode":smsCode,
          "passWord":passWord,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })

  .factory('GetCorpList', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function () {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.CURC1004, {
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11"
        });
        return promise;
      }
    }
  })
  .factory('ResetMail', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (email) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.CURC1002, {
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11",
          "email":email
        });
        return promise;
      }
    }
  })
  .factory('ResetAddress', function ($injector, config) {
    var HttpService = $injector.get('HttpService');
    return {
      http: function (address) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.CURC1002, {
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11",
          "address":address
        });
        return promise;
      }
    }
  })
  //使用帮助
    .factory('QueryHelpList', function ($injector, config) {
      var HttpService = $injector.get('HttpService');
      return {
        http: function (pageNum,pageSize,title) {
          var promise = HttpService.post(config.envPath + config.httpInsertApi.HMQ1001, {
            "ip": "11",
            "version": "11",
            "senttime": "11",
            "sendmsgid": "11",
            "chlterminaltype": "11",
            "tn": "11",
            "sid": window.localStorage.getItem('sid'),
            "si": "11",
            'pageNum':pageNum,
            "pageSize":pageSize,
            'title':title
          });
          return promise;
        }
      }
    })
  // 添加意见
    .factory('Adviceadd', function ($injector, config) {
      var HttpService = $injector.get('HttpService');
      return {
        http: function (opinion) {
          var promise = HttpService.post(config.envPath + config.httpInsertApi.ADM1002, {
            "ip": "11",
            "version": "11",
            "senttime": "11",
            "sendmsgid": "11",
            "chlterminaltype": "11",
            "tn": "11",
            "sid": window.localStorage.getItem('sid'),
            "si": "11",
            'opinion':opinion
          });
          return promise;
        }
      }
    })
  //意见历史查询
    .factory('Advicequer', function ($injector, config) {
      var HttpService = $injector.get('HttpService');
      return {
        http: function (pageNum,pageSize) {
          var promise = HttpService.post(config.envPath + config.httpInsertApi.ADM1001, {
            "ip": "11",
            "version": "11",
            "senttime": "11",
            "sendmsgid": "11",
            "chlterminaltype": "11",
            "tn": "11",
            "sid": window.localStorage.getItem('sid'),
            "si": "11",
            'pageNum':pageNum,
            "pageSize":pageSize
          });
          return promise;
        }
      }
    })
  //登出
    .factory('LoginOut', function ($injector, config) {
      var HttpService = $injector.get('HttpService');
      return {
        http: function () {
          var promise = HttpService.post(config.envPath + config.httpInsertApi.LG1002, {
            "ip": "11",
            "version": "11",
            "senttime": "11",
            "sendmsgid": "11",
            "chlterminaltype": "11",
            "tn": "11",
            "sid": window.localStorage.getItem('sid'),
            "si": "11"
          });
          return promise;
        }
      }
    })
  //PDF文件下载（预览）
  .factory('CertificatesFileDownload',function($injector, config){
    var HttpService = $injector.get('HttpService');
    return {
      http: function (appNo,bussType,fileType) {
        var promise = HttpService.post(config.envPath + config.httpInsertApi.CM1007, {
          "appNo":appNo,
          "bussType":bussType,
          "fileType":fileType,
          "ip": "11",
          "version": "11",
          "senttime": "11",
          "sendmsgid": "11",
          "chlterminaltype": "11",
          "tn": "11",
          "sid": window.localStorage.getItem('sid'),
          "si": "11",

        });
        return promise;
      }
    }
  })
  .factory('FileService', function ($injector,$cordovaFileTransfer,$timeout,$cordovaToast,$rootScope,$ionicPopup) {
    var HttpService = $injector.get('HttpService');
    var tool = $injector.get('ToolService');
    var filename="";
    //下载进度条默认设置
    return {
      // 载入网络文件并预览(ios载入预览，android下载)
      openFile: function (filePath,fileName) {
        $rootScope.downloadProgress=false;
        filename = fileName||"附件.pdf";//接口提供包含后缀的文件名
        if(tool.isIOS()){
          window.cordova.ThemeableBrowser.open(filePath, '_blank',{
            statusbar: {
              color: '#1093f4'
            },
            toolbar: {
              height: 44,
              color: '#1093f4'
            },
            title: {
              color: '#FFFFFF',
              showPageTitle: true
            },
            backButton: {
              wwwImage: 'img/ico-back.png',
              wwwImagePressed: 'img/ico-back.png',
              align: 'left',
              event: 'backPressed'
            },
            backButtonCanClose: true
          }).addEventListener('loadstart', function() {
            $cordovaToast.showShortBottom('下载中...');
          });
        }else{
          var targetPath = cordova.file.externalRootDirectory + filename;
          window.cordova.plugins.FileOpener.canOpenFile(targetPath,function(data){
            //是否存在可打开APP
            if(data.canBeOpen){
              //下载文件
              $cordovaFileTransfer.download(filePath, targetPath, {}, true)
                .then(function(result) {
                  // 下载成功
                  window.cordova.plugins.FileOpener.openFile(decodeURIComponent(result.nativeURL),function(data){},function(error){});
                }, function(error) {
                  // 下载失败
                }, function (progress) {
                  // 下载进行中
                  $timeout(function () {
                    $rootScope.downloadProgress = parseInt((progress.loaded / progress.total) * 100)+'%';
                    if($rootScope.downloadProgress === "100%"){
                      $rootScope.downloadProgress = false;
                    }
                  });
                });
            }else{
              $cordovaToast.showShortBottom('请安装可打开此文件的APP应用');
            }
          });
        }
      }
    }
  });

