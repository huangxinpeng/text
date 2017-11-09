/**
 * Created by HHS on 2017/8/2.
 */
/* 主版块控制(包含登录、忘记密码)，tab三栏版块控制(包含工作台、信息、我的) */
angular.module('zxscf.controllers', ['zxscf.controllers.home','zxscf.controllers.message','zxscf.controllers.mine'])

  // //公共
  .controller('InitCtrl',function($rootScope,$state){
    /* 页面跳转方法 */
    $rootScope.jumpto=function(desPath,args){
      $state.go(desPath,args);
    };
    /* 短信验证码时间 */
    $rootScope.sstime = 60;
  })

  //登录页
  .controller('LoginCtrl', function (config,$rootScope,$interval,$scope,$ionicLoading,PortalSysGetSmsCode,$state,Login){
    //$scope.user={'phonenumber':'111111',password:'123456',msgcode:''};/*admin*/
    $scope.user={'phonenumber':'',password:'',msgcode:''};/*admin*/
    var vertityTyp = "0";
    var int = "";
    $scope.tooMore = false;
    $scope.getcode = '获取验证码';
    /*点击获取短信验证码*/
    $scope.code = function(){
      if($scope.getcode == '获取验证码'){
        PortalSysGetSmsCode.getsmsCode($scope.user.phonenumber,'DL01');
        $scope.ss = config.smsTime;
        int = $interval(function(){
          $scope.ss--;
          $scope.getcode = $scope.ss + 's';
          if($scope.ss <= 0){
            $interval.cancel(int);
            $scope.getcode = "获取验证码";
          }
        },1000)
      }else{
        return;
      }
    };
    $scope.login=function(){
      /*$scope.getcode = '获取验证码';*/
      var phonenumber=$scope.user.phonenumber;
      var password=$scope.user.password;
      var vertityCode=$scope.user.msgcode;
      if(/*(/^1[34578]\d{9}$/.test(phonenumber))&&*/phonenumber!==""&&password!==""){
        if (vertityTyp=="1"&&vertityCode!=="") {
          var promise = Login.toLogin(phonenumber, password, vertityTyp, vertityCode);
        }else {
          var promise = Login.toLogin(phonenumber, password, vertityTyp);
        };
        promise.then(function(data){
          //登录成功基本信息缓存设置
          if(data.code == "000000"){
            $interval.cancel(int);
            console.log(data.data);
            var user={
              tlrno:data.data.tlrno,
              tlrName:data.data.tlrName,
              orgId:data.data.orgId,
              sid:data.data.sid,
              corpRoleId:data.data.corpRoleId,
              mobile:data.data.mobile
            };
            window.localStorage.setItem('user',JSON.stringify(user));
            window.localStorage.setItem('isLogin',"true");
            $state.go('tab.home')
          }else if(data.code == "150005"){
            $ionicLoading.show({template: '服务器异常,请稍后重试!', noBackdrop: true, duration:1000});
          }else if(data.code == "160004"){
            $ionicLoading.show({template: '用户名或密码错误!', noBackdrop: true, duration:1000});
          }else if(data.code == "160011"){
            vertityTyp="1";
            $scope.tooMore=true;
            $ionicLoading.show({template: '用户名或密码连续错误3次,请输入验证码!', noBackdrop: true, duration:1000});
          }else{/**/}
        });
      }else{
        $ionicLoading.show({template: '用户名或密码格式不正确!', noBackdrop: true, duration:1000});
      }
    }


  })
  //忘记密码
  .controller('forgetpwdCtrl', function (config,$rootScope,$interval,$scope,$ionicLoading,$state,Forgetpwd,PortalSysGetSmsCode){
    $scope.changepwd={};
    $scope.blur=function(){
      if($scope.changepwd.newpwd !== $scope.changepwd.confirmpwd){
        $ionicLoading.show({template: '前后输入的密码不一致!', noBackdrop: true, duration:1000})
      }
    };
      /*看见密码*/
      $scope.isseeA = false;
      $scope.isseeB = false;
      $scope.seepwdA = function(){
        $scope.isseeA = !$scope.isseeA;
        if($scope.isseeA){
          document.getElementById("inputA").setAttribute('type','number')
        }else{
          document.getElementById("inputA").setAttribute('type','password')
        }
      };
      $scope.seepwdB = function(){
        $scope.isseeB = !$scope.isseeB;
        if($scope.isseeB){
          document.getElementById("inputB").setAttribute('type','text')
        }else{
          document.getElementById("inputB").setAttribute('type','password')
        }
      };
    /*短信验证码 .... */
    $scope.messageInfo = '发送验证码';
    $scope.getmsgcode = function(){
      if($scope.messageInfo == '发送验证码'){
        var cc = config.smsTime;
        var promise = PortalSysGetSmsCode.getsmsCode($scope.changepwd.username,'MM03');
        promise.then().catch(function(err){
          $interval.cancel($scope.inter);
          $scope.getMessageInfo = '发送验证码';
        });
        $scope.inter = $interval(function(){
          cc--;
          $scope.messageInfo = cc + 's';
          if(cc <= 0){
            $interval.cancel($scope.inter);
            $scope.getMessageInfo = '发送验证码';
          }
        },1000)
      }else{
        return;
      }

    };

    $scope.findpwd=function(){
      var userid=$scope.changepwd.userid;
      var phonenumber=$scope.changepwd.username;
      var newpwd=$scope.changepwd.newpwd;
      var confirmpwd=$scope.changepwd.confirmpwd;
      var msgcode=$scope.changepwd.msgcode;
      if((/^1[34578]\d{9}$/.test(phonenumber))&&userid!==""&&phonenumber!==""&&newpwd===confirmpwd&&msgcode!==""&&confirmpwd!==""){
        var promise = Forgetpwd.toChange(phonenumber,newpwd,confirmpwd,msgcode,userid);
        promise.then(function(data){
            if(data.code=="000000"){
              $interval.cancel($scope.inter);
              $ionicLoading.show({template: '修改密码成功,请登入!', noBackdrop: true, duration:1000});
              $state.go('login')
            }else{
              $ionicLoading.show({template: data.message, noBackdrop: true, duration:1000});
            }
          })
      }else if(newpwd!==confirmpwd){
        $ionicLoading.show({template: '新密码和确认密码不一致!', noBackdrop: true, duration:1000});
      }else if(/^1[34578]\d{9}$/.test(phonenumber)&&phonenumber!==""){
        $ionicLoading.show({template: '请输入正确的手机号码!', noBackdrop: true, duration:1000});
      }
    }
  })

;
