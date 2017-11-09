/**
 * Created by haibo on 2017/8/12.
 */
/* 首页版块控制 */
angular.module('zxscf.controllers.home', [])

  // Tab栏 查询信息数量
  .controller('TabCtrl', function ($scope,config,Home,$ionicLoading){
    $scope.badges={totalmsg:""};

    //var a=window.localStorage.getItem("user");
    //var b=JSON.parse(a);
    //console.log(b);
    /*enter*/
    $scope.$on('$ionicView.afterEnter',function(){
      var promise=Home.getMsgtotal(0);  /*未读消息*/
      promise.then(function(data){
        if(data.code=="000000"){
          $scope.badges.totalmsg=data.data.total;
        }else{
          $ionicLoading.show({template: data.message, noBackdrop: true, duration:1000});
        }
      });
    });


  })

  //----融资受理----   RzacceptCtrl
  .controller('RzacceptCtrl',function(config,$rootScope,$interval,$ionicLoading,$scope,DrfApprove,$ionicPopup,workgetSmsCode,$state,QueryTask,ToolService,GetDictByNo){
    $scope.cjs = ToolService;
    $scope.taskList = [];
    $scope.hasdata = false;
    //页面加载获取数据
    var promise=QueryTask.http('03',1);
    promise.then(function(res){
      console.log(res);
      if(res.code == '000000'){
        $scope.tasklist = res.data.lists.list;
        if($scope.tasklist.length){
          $scope.hasdata = true
        }else{$scope.hasdata = false};
        $scope.isSelected = {};
        $scope.tasklist.forEach(function(arr,i){
          arr.flag = false ;
          $scope.isSelected[i] = arr.flag;
        });
        $scope.selectedAll = false ;
        /*单选*/
        $scope.selection = function($index){
          $scope.tasklist[$index].flag = !$scope.tasklist[$index].flag;
          $scope.isSelected[$index] = $scope.tasklist[$index].flag;
          var isCheckNum = 0;
          for (var i = 0; i < $scope.tasklist.length; i++) {
            if(!$scope.tasklist[i].flag){//如果有一个没有被选
              $scope.selectedAll = false;
            }else if($scope.tasklist[i].flag){//计数比较
              isCheckNum++
            }
          };
          if(isCheckNum == $scope.tasklist.length){//如果全部都被选
            $scope.selectedAll = true;
          }else{
            $scope.selectedAll = false;
          }
        };
        /*全选*/
        $scope.checkAll = function () { /*全选*/
          $scope.selectedAll = !$scope.selectedAll;
          if($scope.selectedAll == true){
            $scope.tasklist.forEach(function (arr,i) {
              arr.flag = true;
              for(var k in $scope.isSelected){
                $scope.isSelected[k] = arr.flag;
              }
            })
          }else if($scope.selectedAll == false){
            $scope.tasklist.forEach(function (arr,i) {
              arr.flag = false;
              for(var k in $scope.isSelected){
                $scope.isSelected[k] = arr.flag;
              }
            })
          }
        };
      }else{
        $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
      }
    });

    //驳回
    $scope.reject=function(){
      var txtinfo = "";
      $scope.selected = [];
      $scope.selectMoneny = 0;
      for(var i = 0 ; i < $scope.tasklist.length; i ++){
        if($scope.tasklist[i].flag){
          $scope.selected.push($scope.tasklist[i].yyId);
          $scope.selectMoneny += $scope.tasklist[i].disctAmt;
        }
      };
      if(!$scope.selected.length){
        $ionicLoading.show({template: '请选择你的宝眷!', noBackdrop: true, duration:1000});
        return false;
      }
      var popReject=$ionicPopup.show({
        cssClass:'my-popup',
        templateUrl:'template/popup-rzaccept-newreject.html',
        scope:$scope
      });
      /*数据字典查询*/
      var promise = GetDictByNo.http('1000020',1,10);
      promise.then(
        function(res){
          console.log(res);
          if(res.code == '000000'){
            $scope.reason = res.data.list;
            /*判断是否选中*/
            $scope.selecheck = [];
            $scope.reason.forEach(function(arr,i){
              arr.flag = false;
              $scope.selecheck[i] = arr.flag;
            });
            $scope.checkone = function($index){
              if($scope.selecheck[$index]){
                $scope.reason[$index].flag = !$scope.reason[$index].flag;
                $scope.selecheck[$index] = $scope.reason[$index].flag;
              }else{
                $scope.reason.forEach(function(arr,i){
                  arr.flag = false;
                  $scope.selecheck[i] = arr.flag;
                });
                $scope.reason[$index].flag = !$scope.reason[$index].flag;
                $scope.selecheck[$index] = $scope.reason[$index].flag;
              }
            }
          }else{
            popReject.close();
            $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
          }
        }
      );
      $scope.handle_cancel = function(){
        popReject.close();
      };
      $scope.handle_comfirm = function(){
        $scope.selecheck.forEach(function(arr,i){
         if(arr){console.log($scope.reason[i]);txtinfo = $scope.reason[i].dataName}
        });
        if(!txtinfo || txtinfo == ""){
          $ionicLoading.show({template: '请选择驳回原因!', noBackdrop: true, duration:1000});
          return false;
        }
        console.log(txtinfo,$scope.selected);
        var promise =DrfApprove.drfApprove('03',"",'1',txtinfo,$scope.selected);
        promise.then(
          function(res){
            if(res.code == '000000'){
              popReject.close();
              $state.go('tab.rzaccept-reject',{Mon:$scope.selectMoneny,Count:$scope.selected.length})
            }else{
              popReject.close();
              $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
            }
          }
        )
      };
    };
    //同意
    $scope.agree=function(){
      var cint="";
      $scope.selected = [];
      $scope.selectMoneny=0;
      $scope.getmessageinfo="发送验证码";
      $scope.input={MsgCode:""};
      for(var i = 0 ; i < $scope.tasklist.length; i ++){
        if($scope.tasklist[i].flag){
          $scope.selected.push($scope.tasklist[i].yyId);
          console.log($scope.tasklist[i].disctAmt)
          $scope.selectMoneny +=  parseFloat($scope.tasklist[i].disctAmt,2);
        }
      }
      if(!$scope.selected.length){
        $ionicLoading.show({template: '请选择你的宝眷!', noBackdrop: true, duration:1000});
        return false;
      };
      var popAgree=$ionicPopup.show({
        cssClass:'my-popup',
        templateUrl:'template/popup-rzaccept-agree.html',
        scope:$scope
      });
      $scope.getMsgcode = function(){
        if($scope.getmessageinfo=="发送验证码"){
          var promise = workgetSmsCode.getsmsCode("RZ03");
          var smstime = config.smsTime;
          cint = $interval(function(){
            smstime--;
            $scope.getmessageinfo = smstime + 's';
            if(smstime<=0){
              $interval.cancel(cint);
              $scope.getmessageinfo="发送验证码";
            }
          },1000);
        }else{
          return;
        }
        /*获取短信验证码*/
      };
      console.log($scope.selectMoneny,$scope.selected.length)
      $scope.giveout=function(){
        popAgree.close();
        $interval.cancel(cint);
      };
      $scope.makesure=function(){
        if($scope.input.MsgCode == ""){
          $ionicLoading.show({template: "请输入短信验证码" , noBackdrop: true, duration:1000})
          return ;
        }
        DrfApprove.drfApprove('03',$scope.input.MsgCode,'3',"",$scope.selected)
          .then(
          function(res){
            if(res.code == '000000'){
              $interval.cancel(cint);
              popAgree.close();
              $state.go('tab.rzaccept-success',{Mon:$scope.selectMoneny,Count:$scope.selected.length})
            }else{
              $interval.cancel(cint);
              popAgree.close();
              $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
            }
          }
        );
      };
    };
  })
  // 融资受理 单笔
  .controller('RzacceptdanbiCtrl',function(config,$rootScope,DrfDetail,$ionicLoading,GetDictByNo,$interval,ToolService,$stateParams,$scope,$ionicPopup,$state,workgetSmsCode,DrfApprove){
    var pid = "";
    pid = $stateParams.pid;
    $scope.cjs=ToolService;
    var promise = DrfDetail.http(pid);
    promise.then(
      function(res){
        if(res.code == '000000'){
          $scope.detail = res.data;
        }else{
          $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
        }
      }
    );

    //驳回
    $scope.reject=function(){
      var txtinfo = "";
      //$scope.selectMoneny = $scope.detail.disctAmt;
      var popReject=$ionicPopup.show({
        cssClass:'my-popup',
        templateUrl:'template/popup-rzaccept-newreject.html',
        scope:$scope
      });
      /*数据字典查询*/
      var promise = GetDictByNo.http('1000020',1,10);
      promise.then(
        function(res){
          console.log(res);
          if(res.code == '000000'){
            $scope.reason = res.data.list;
            /*判断是否选中*/
            $scope.selecheck = [];
            $scope.reason.forEach(function(arr,i){
              arr.flag = false;
              $scope.selecheck[i] = arr.flag;
            });
            $scope.checkone = function($index){
              if($scope.selecheck[$index]){
                $scope.reason[$index].flag = !$scope.reason[$index].flag;
                $scope.selecheck[$index] = $scope.reason[$index].flag;
              }else{
                $scope.reason.forEach(function(arr,i){
                  arr.flag = false;
                  $scope.selecheck[i] = arr.flag;
                });
                $scope.reason[$index].flag = !$scope.reason[$index].flag;
                $scope.selecheck[$index] = $scope.reason[$index].flag;
              }
            }
          }else{
            popReject.close();
            $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
          }
        }
      );
      $scope.handle_cancel = function(){
        popReject.close();
      };
      $scope.handle_comfirm = function(){
        $scope.selecheck.forEach(function(arr,i){
          if(arr){txtinfo = $scope.reason[i].dataName}
        });
        if(!txtinfo || txtinfo == ""){
          $ionicLoading.show({template: '请选择驳回原因!', noBackdrop: true, duration:1000});
          return false;
        }
        var promise =DrfApprove.drfApprove('03',"",'1',txtinfo,[$scope.detail.yyId]);
        promise.then(
          function(res){
            if(res.code == '000000'){
              popReject.close();
              $state.go('tab.rzaccept-reject',{Mon:$scope.detail.disctAmt,Count:1})
            }else{
              popReject.close();
              $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
            }
          }
        )
      };
    };
    //同意
    $scope.agree=function(){
      var cint="";
      //$scope.selectMoneny = $scope.detail.disctAmt;
      $scope.getmessageinfo="发送验证码";
      $scope.input={MsgCode:""};
      var popAgree=$ionicPopup.show({
        cssClass:'my-popup',
        templateUrl:'template/popup-rzaccept-agree.html',
        scope:$scope
      });
      $scope.getMsgcode = function(){
        if($scope.getmessageinfo=="发送验证码"){
          var promise = workgetSmsCode.getsmsCode("RZ03");
          var smstime = config.smsTime;
          cint = $interval(function(){
            smstime--;
            $scope.getmessageinfo = smstime + 's';
            if(smstime <= 0){
              $interval.cancel(cint);
              $scope.getmessageinfo="发送验证码";
            }
          },1000);
        }else{
          return;
        }
        /*获取短信验证码*/
      };
      $scope.giveout=function(){
        popAgree.close();
        $interval.cancel(cint);
      };
      $scope.makesure=function(){
        if($scope.input.MsgCode == ""){
          $ionicLoading.show({template: "请输入短信验证码" , noBackdrop: true, duration:1000})
          return ;
        }
        $interval.cancel(cint);
        DrfApprove.drfApprove('03',$scope.input.MsgCode,'3',"",[$scope.detail.yyId])
          .then(
          function(res){
            if(res.code == '000000'){
              $interval.cancel(cint);
              popAgree.close();
              $state.go('tab.rzaccept-success',{Mon:$scope.detail.disctAmt,Count:1})
            }else{
              $interval.cancel(cint);
              popAgree.close();
              $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
            }
          }
        );
      };
    }
  })
  // 融资受理 成功
  .controller('RzacceptsucCtrl',function($scope,$ionicHistory,$stateParams,ToolService){
    var formState="";
    $scope.cjs = ToolService;

    $scope.formCount = $stateParams.Count;
    $scope.formMoneny = $stateParams.Mon;

    $scope.gohistory=function(){
      if(formState==="tab.rzaccept-danbi"){
        $ionicHistory.goBack(-2);
      }else{
        $ionicHistory.goBack(-1);
      }
    };
    $scope.$on('$stateChangeSuccess', function (event, toState,toParams,from) {
      formState=from.name;
    });
  })

  //----融资审核----   RzcheckCtrl
  .controller('RzcheckCtrl',function(config,$scope,$ionicPopup,$state,$interval,$ionicLoading,DrfApprove,workgetSmsCode,QueryTask,ToolService,GetDictByNo){
    $scope.cjs = ToolService;
    $scope.taskList = [];
    $scope.hasdata = false;
    //页面加载获取数据
    var promise=QueryTask.http('04',1);
    promise.then(function(res){
      if(res.code == '000000'){
        $scope.tasklist = res.data.lists.list;
        if($scope.tasklist.length){
          $scope.hasdata = true
        }else{$scope.hasdata = false};
        $scope.isSelected = {};
        $scope.tasklist.forEach(function(arr,i){
          arr.flag = false ;
          $scope.isSelected[i] = arr.flag;
        });
        $scope.selectedAll = false ;
        /*单选*/
        $scope.selection = function($index){
          $scope.tasklist[$index].flag = !$scope.tasklist[$index].flag;
          $scope.isSelected[$index] = $scope.tasklist[$index].flag;
          var isCheckNum = 0;
          for (var i = 0; i < $scope.tasklist.length; i++) {
            if(!$scope.tasklist[i].flag){//如果有一个没有被选
              $scope.selectedAll = false;
            }else if($scope.tasklist[i].flag){//计数比较
              isCheckNum++
            }
          };
          if(isCheckNum == $scope.tasklist.length){//如果全部都被选
            $scope.selectedAll = true;
          }else{
            $scope.selectedAll = false;
          }
        };
        /*全选*/
        $scope.checkAll = function () { /*全选*/
          $scope.selectedAll = !$scope.selectedAll;
          if($scope.selectedAll == true){
            $scope.tasklist.forEach(function (arr,i) {
              arr.flag = true;
              for(var k in $scope.isSelected){
                $scope.isSelected[k] = arr.flag;
              }
            })
          }else if($scope.selectedAll == false){
            $scope.tasklist.forEach(function (arr,i) {
              arr.flag = false;
              for(var k in $scope.isSelected){
                $scope.isSelected[k] = arr.flag;
              }
            })
          }
        };
      }else{
        $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
      }
    });
    //驳回
    $scope.reject=function(){
      var txtinfo = "";
      $scope.selected = [];
      $scope.selectMoneny = 0;
      for(var i = 0 ; i < $scope.tasklist.length; i ++){
        if($scope.tasklist[i].flag){
          $scope.selected.push($scope.tasklist[i].yyId);
          $scope.selectMoneny += $scope.tasklist[i].disctAmt;
        }
      };
      if(!$scope.selected.length){
        $ionicLoading.show({template: '请选择你的宝眷!', noBackdrop: true, duration:1000});
        return false;
      }
      var popReject=$ionicPopup.show({
        cssClass:'my-popup',
        templateUrl:'template/popup-rzaccept-newreject.html',
        scope:$scope
      });
      /*数据字典查询*/
      var promise = GetDictByNo.http('1000020',1,10);
      promise.then(
        function(res){
          console.log(res);
          if(res.code == '000000'){
            $scope.reason = res.data.list;
            /*判断是否选中*/
            $scope.selecheck = [];
            $scope.reason.forEach(function(arr,i){
              arr.flag = false;
              $scope.selecheck[i] = arr.flag;
            });
            $scope.checkone = function($index){
              if($scope.selecheck[$index]){
                $scope.reason[$index].flag = !$scope.reason[$index].flag;
                $scope.selecheck[$index] = $scope.reason[$index].flag;
              }else{
                $scope.reason.forEach(function(arr,i){
                  arr.flag = false;
                  $scope.selecheck[i] = arr.flag;
                });
                $scope.reason[$index].flag = !$scope.reason[$index].flag;
                $scope.selecheck[$index] = $scope.reason[$index].flag;
              }
            }
          }else{
            popReject.close();
            $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
          }
        }
      );
      $scope.handle_cancel = function(){
        popReject.close();
      };
      $scope.handle_comfirm = function(){
        $scope.selecheck.forEach(function(arr,i){
          if(arr){txtinfo = $scope.reason[i].dataName}
        });
        if(!txtinfo || txtinfo == ""){
          $ionicLoading.show({template: '请选择驳回原因!', noBackdrop: true, duration:1000});
          return false;
        }
        var promise =DrfApprove.drfApprove('04',"",'1',txtinfo,$scope.selected);
        promise.then(
          function(res){
            if(res.code == '000000'){
              popReject.close();
              $state.go('tab.rzcheck-reject',{Mon:$scope.selectMoneny,Count:$scope.selected.length})
            }else{
              popReject.close();
              $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
            }
          }
        )
      };
    };
    //拒绝
    $scope.sendback=function(){
      var txtinfo = "";
      $scope.selected = [];
      $scope.selectMoneny = 0;
      for(var i = 0 ; i < $scope.tasklist.length; i ++){
        if($scope.tasklist[i].flag){
          $scope.selected.push($scope.tasklist[i].yyId);
          $scope.selectMoneny += $scope.tasklist[i].disctAmt;
        }
      };
      if(!$scope.selected.length){
        $ionicLoading.show({template: '请选择你的宝眷!', noBackdrop: true, duration:1000});
        return false;
      }
      var popReject=$ionicPopup.show({
        cssClass:'my-popup',
        templateUrl:'template/popup-rzaccept-newreback.html',
        scope:$scope
      });
      /*数据字典查询*/
      var promise = GetDictByNo.http('1000020',1,10);
      promise.then(
        function(res){
          console.log(res);
          if(res.code == '000000'){
            $scope.reason = res.data.list;
            /*判断是否选中*/
            $scope.selecheck = [];
            $scope.reason.forEach(function(arr,i){
              arr.flag = false;
              $scope.selecheck[i] = arr.flag;
            });
            $scope.checkone = function($index){
              if($scope.selecheck[$index]){
                $scope.reason[$index].flag = !$scope.reason[$index].flag;
                $scope.selecheck[$index] = $scope.reason[$index].flag;
              }else{
                $scope.reason.forEach(function(arr,i){
                  arr.flag = false;
                  $scope.selecheck[i] = arr.flag;
                });
                $scope.reason[$index].flag = !$scope.reason[$index].flag;
                $scope.selecheck[$index] = $scope.reason[$index].flag;
              }
            }
          }else{
            popReject.close();
            $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
          }
        }
      );
      $scope.handle_cancel = function(){
        popReject.close();
      };
      $scope.handle_comfirm = function(){
        $scope.selecheck.forEach(function(arr,i){
          if(arr){txtinfo = $scope.reason[i].dataName}
        });
        if(!txtinfo || txtinfo == ""){
          $ionicLoading.show({template: '请选择退回原因!', noBackdrop: true, duration:1000});
          return false;
        }
        var promise =DrfApprove.drfApprove('04',"",'2',txtinfo,$scope.selected);
        promise.then(
          function(res){
            if(res.code == '000000'){
              popReject.close();
              $state.go('tab.rzcheck-reback',{Mon:$scope.selectMoneny,Count:$scope.selected.length})
            }else{
              popReject.close();
              $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
            }
          }
        )
      };
    };
    //同意
    $scope.agree=function(){
      var cint="";
      $scope.selected = [];
      $scope.selectMoneny=0;
      $scope.getmessageinfo="发送验证码";
      $scope.input={MsgCode:""};
      for(var i = 0 ; i < $scope.tasklist.length; i ++){
        if($scope.tasklist[i].flag){
          $scope.selected.push($scope.tasklist[i].yyId);
          $scope.selectMoneny += $scope.tasklist[i].disctAmt;
        }
      }
      if(!$scope.selected.length){
        $ionicLoading.show({template: '请选择你的宝眷!', noBackdrop: true, duration:1000});
        return false;
      };
      var popAgree=$ionicPopup.show({
        cssClass:'my-popup',
        templateUrl:'template/popup-rzcheck-agree.html',
        scope:$scope
      });
      $scope.getMsgcode = function(){
        if($scope.getmessageinfo=="发送验证码"){
          var promise = workgetSmsCode.getsmsCode("RZ03");
          var smstime = config.smsTime;
          cint = $interval(function(){
            smstime--;
            $scope.getmessageinfo = smstime + 's';
            if(smstime<=0){
              $interval.cancel(cint);
              $scope.getmessageinfo="发送验证码";
            }
          },1000);
        }else{
          return;
        }
        /*获取短信验证码*/
      };
      $scope.giveout=function(){
        popAgree.close();
        $interval.cancel(cint);
      };
      $scope.makesure=function(){
        if($scope.input.MsgCode == ""){
          $ionicLoading.show({template: "请输入短信验证码" , noBackdrop: true, duration:1000});
          return ;
        }
        DrfApprove.drfApprove('04',$scope.input.MsgCode,'3',"",$scope.selected)
          .then(
          function(res){
            if(res.code == '000000'){
              $interval.cancel(cint);
              popAgree.close();
              $state.go('tab.rzcheck-success',{Mon:$scope.selectMoneny,Count:$scope.selected.length})
            }else{
              $interval.cancel(cint);
              popAgree.close();
              $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
            }
          }
        );
      };
    };

  })
  // 融资审核 单笔
  .controller('RzcheckdanbiCtrl',function(config,$scope,$ionicPopup,$state,DrfDetail,$ionicLoading,GetDictByNo,$interval,ToolService,$stateParams,workgetSmsCode,DrfApprove){
    var pid = "";
    pid = $stateParams.pid;
    $scope.cjs=ToolService;
    var promise = DrfDetail.http(pid);
    promise.then(
      function(res){
        if(res.code == '000000'){
          $scope.detail = res.data;
        }else{
          $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
        }
      }
    );
    //驳回
    $scope.reject=function(){
      var txtinfo = "";
      //$scope.selectMoneny = $scope.detail.disctAmt;
      var popReject=$ionicPopup.show({
        cssClass:'my-popup',
        templateUrl:'template/popup-rzaccept-newreject.html',
        scope:$scope
      });
      /*数据字典查询*/
      var promise = GetDictByNo.http('1000020',1,10);
      promise.then(
        function(res){
          console.log(res);
          if(res.code == '000000'){
            $scope.reason = res.data.list;
            /*判断是否选中*/
            $scope.selecheck = [];
            $scope.reason.forEach(function(arr,i){
              arr.flag = false;
              $scope.selecheck[i] = arr.flag;
            });
            $scope.checkone = function($index){
              if($scope.selecheck[$index]){
                $scope.reason[$index].flag = !$scope.reason[$index].flag;
                $scope.selecheck[$index] = $scope.reason[$index].flag;
              }else{
                $scope.reason.forEach(function(arr,i){
                  arr.flag = false;
                  $scope.selecheck[i] = arr.flag;
                });
                $scope.reason[$index].flag = !$scope.reason[$index].flag;
                $scope.selecheck[$index] = $scope.reason[$index].flag;
              }
            }
          }else{
            $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
          }
        }
      );
      $scope.handle_cancel = function(){
        popReject.close();
      };
      $scope.handle_comfirm = function(){
        $scope.selecheck.forEach(function(arr,i){
          if(arr){txtinfo = $scope.reason[i].dataName}
        });
        if(!txtinfo || txtinfo == ""){
          $ionicLoading.show({template: '请选择驳回原因!', noBackdrop: true, duration:1000});
          return false;
        }
        var promise =DrfApprove.drfApprove('04',"",'1',txtinfo,[$scope.detail.yyId]);
        promise.then(
          function(res){
            if(res.code == '000000'){
              popReject.close();
              $state.go('tab.rzcheck-reject',{Mon:$scope.detail.disctAmt,Count:1})
            }else{
              popReject.close();
              $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
            }
          }
        )
      };
    };
    //退回
    $scope.sendback=function(){
      var txtinfo = "";
      //$scope.selectMoneny = $scope.detail.disctAmt;
      var popReject=$ionicPopup.show({
        cssClass:'my-popup',
        templateUrl:'template/popup-rzaccept-newreback.html',
        scope:$scope
      });
      /*数据字典查询*/
      var promise = GetDictByNo.http('1000020',1,10);
      promise.then(
        function(res){
          console.log(res);
          if(res.code == '000000'){
            $scope.reason = res.data.list;
            /*判断是否选中*/
            $scope.selecheck = [];
            $scope.reason.forEach(function(arr,i){
              arr.flag = false;
              $scope.selecheck[i] = arr.flag;
            });
            $scope.checkone = function($index){
              if($scope.selecheck[$index]){
                $scope.reason[$index].flag = !$scope.reason[$index].flag;
                $scope.selecheck[$index] = $scope.reason[$index].flag;
              }else{
                $scope.reason.forEach(function(arr,i){
                  arr.flag = false;
                  $scope.selecheck[i] = arr.flag;
                });
                $scope.reason[$index].flag = !$scope.reason[$index].flag;
                $scope.selecheck[$index] = $scope.reason[$index].flag;
              }
            }
          }else{
            popReject.close();
            $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
          }
        }
      );
      $scope.handle_cancel = function(){
        popReject.close();
      };
      $scope.handle_comfirm = function(){
        $scope.selecheck.forEach(function(arr,i){
          if(arr){txtinfo = $scope.reason[i].dataName}
        });
        if(!txtinfo || txtinfo == ""){
          $ionicLoading.show({template: '请选择驳回原因!', noBackdrop: true, duration:1000});
          return false;
        }
        var promise =DrfApprove.drfApprove('04',"",'2',txtinfo,[pid]);
        promise.then(
          function(res){
            if(res.code == '000000'){
              popReject.close();
              $state.go('tab.rzcheck-reback',{Mon:$scope.detail.disctAmt,Count:1})
            }else{
              popReject.close();
              $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
            }
          }
        )
      };
    };
    //同意
    $scope.agree=function(){
      var cint="";
      //$scope.selectMoneny = $scope.detail.disctAmt;
      $scope.getmessageinfo="发送验证码";
      $scope.input={MsgCode:""};
      var popAgree=$ionicPopup.show({
        cssClass:'my-popup',
        templateUrl:'template/popup-rzcheck-agree.html',
        scope:$scope
      });
      $scope.getMsgcode = function(){
        if($scope.getmessageinfo=="发送验证码"){
          var promise = workgetSmsCode.getsmsCode("RZ03");
          var ss = config.smsTime;
          cint = $interval(function(){
            ss--;
            $scope.getmessageinfo = ss + 's';
            if(ss<=0){
              $interval.cancel(cint);
              $scope.getmessageinfo="发送验证码";
            }
          },1000);
        }else{
          return;
        }
        /*获取短信验证码*/
      };
      $scope.giveout=function(){
        popAgree.close();
        $interval.cancel(cint);
      };
      $scope.makesure=function(){
        if($scope.input.MsgCode == ""){
          $ionicLoading.show({template: "请输入短信验证码" , noBackdrop: true, duration:1000})
          return ;
        }
        DrfApprove.drfApprove('04',$scope.input.MsgCode,'3',"",[pid])
          .then(
          function(res){
            if(res.code == '000000'){
              $interval.cancel(cint);
              popAgree.close();
              $state.go('tab.rzcheck-success',{Mon:$scope.detail.disctAmt,Count:1})
            }else{
              $interval.cancel(cint);
              popAgree.close();
              $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
            }
          }
        );
      };
    };

  })
  // 融资审核 成功
  .controller('RzchecksucCtrl',function($scope,$ionicHistory,$stateParams,ToolService){
    var formState="";
    $scope.cjs = ToolService;

    $scope.formCount = $stateParams.Count;
    $scope.formMoneny = $stateParams.Mon;

    $scope.gohistory=function(){
      if(formState==="tab.rzcheck-danbi"){
        $ionicHistory.goBack(-2);
      }else{
        $ionicHistory.goBack(-1);
      }
    };
    $scope.$on('$stateChangeSuccess', function (event, toState,toParams,from) {
      formState=from.name;
    });
  })

  //----风控审查-----  RiskreviewCtrl
  .controller('RiskreviewCtrl',function(config,$interval,$ionicLoading,$scope,DrfApprove,$ionicPopup,workgetSmsCode,$state,QueryTask,ToolService,GetDictByNo){
      $scope.cjs = ToolService;
      $scope.taskList = [];
      $scope.hasdata = false;
      //页面加载获取数据
      var promise=QueryTask.http('05',1);
      promise.then(function(res){
        console.log(res);
        if(res.code == '000000'){
          $scope.tasklist = res.data.lists.list;
          if($scope.tasklist.length){
            $scope.hasdata = true
          }else{$scope.hasdata = false};
          $scope.isSelected = {};
          $scope.tasklist.forEach(function(arr,i){
            arr.flag = false ;
            $scope.isSelected[i] = arr.flag;
          });
          $scope.selectedAll = false ;
          /*单选*/
          $scope.selection = function($index){
            $scope.tasklist[$index].flag = !$scope.tasklist[$index].flag;
            $scope.isSelected[$index] = $scope.tasklist[$index].flag;
            var isCheckNum = 0;
            for (var i = 0; i < $scope.tasklist.length; i++) {
              if(!$scope.tasklist[i].flag){//如果有一个没有被选
                $scope.selectedAll = false;
              }else if($scope.tasklist[i].flag){//计数比较
                isCheckNum++
              }
            };
            if(isCheckNum == $scope.tasklist.length){//如果全部都被选
              $scope.selectedAll = true;
            }else{
              $scope.selectedAll = false;
            }
          };
          /*全选*/
          $scope.checkAll = function () { /*全选*/
            $scope.selectedAll = !$scope.selectedAll;
            if($scope.selectedAll == true){
              $scope.tasklist.forEach(function (arr,i) {
                arr.flag = true;
                for(var k in $scope.isSelected){
                  $scope.isSelected[k] = arr.flag;
                }
              })
            }else if($scope.selectedAll == false){
              $scope.tasklist.forEach(function (arr,i) {
                arr.flag = false;
                for(var k in $scope.isSelected){
                  $scope.isSelected[k] = arr.flag;
                }
              })
            }
          };
        }else{
          $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
        }
      });

      //驳回
      $scope.reject=function(){
        var txtinfo = "";
        $scope.selected = [];
        $scope.selectMoneny = 0;
        for(var i = 0 ; i < $scope.tasklist.length; i ++){
          if($scope.tasklist[i].flag){
            $scope.selected.push($scope.tasklist[i].yyId);
            $scope.selectMoneny += $scope.tasklist[i].disctAmt;
          }
        };
        if(!$scope.selected.length){
          $ionicLoading.show({template: '请选择你的宝眷!', noBackdrop: true, duration:1000});
          return false;
        }
        var popReject=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-rzaccept-newreject.html',
          scope:$scope
        });
        /*数据字典查询*/
        var promise = GetDictByNo.http('1000020',1,10);
        promise.then(
            function(res){
              console.log(res);
              if(res.code == '000000'){
                $scope.reason = res.data.list;
                /*判断是否选中*/
                $scope.selecheck = [];
                $scope.reason.forEach(function(arr,i){
                  arr.flag = false;
                  $scope.selecheck[i] = arr.flag;
                });
                $scope.checkone = function($index){
                  if($scope.selecheck[$index]){
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }else{
                    $scope.reason.forEach(function(arr,i){
                      arr.flag = false;
                      $scope.selecheck[i] = arr.flag;
                    });
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }
                }
              }else{
                popReject.close();
                $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
              }
            }
        );
        $scope.handle_cancel = function(){
          popReject.close();
        };
        $scope.handle_comfirm = function(){
          $scope.selecheck.forEach(function(arr,i){
            if(arr){txtinfo = $scope.reason[i].dataName}
          });
          if(!txtinfo || txtinfo == ""){
            $ionicLoading.show({template: '请选择驳回原因!', noBackdrop: true, duration:1000});
            return false;
          }
          var promise =DrfApprove.drfApprove('05',"",'1',txtinfo,$scope.selected);
          promise.then(
              function(res){
                if(res.code == '000000'){
                  popReject.close();
                  $state.go('tab.riskreview-reject',{Mon:$scope.selectMoneny,Count:$scope.selected.length})
                }else{
                  popReject.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
              }
          )
        };
      };
      //同意
      $scope.agree=function(){
        var cint="";
        $scope.selected = [];
        $scope.selectMoneny=0;
        $scope.getmessageinfo="发送验证码";
        $scope.input={MsgCode:""};
        for(var i = 0 ; i < $scope.tasklist.length; i ++){
          if($scope.tasklist[i].flag){
            $scope.selected.push($scope.tasklist[i].yyId);
            $scope.selectMoneny += $scope.tasklist[i].disctAmt;
          }
        }
        if(!$scope.selected.length){
          $ionicLoading.show({template: '请选择你的宝眷!', noBackdrop: true, duration:1000});
          return false;
        };
        var popAgree=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-riskreview-agree.html',
          scope:$scope
        });
        $scope.getMsgcode = function(){
          if($scope.getmessageinfo=="发送验证码"){
            var promise = workgetSmsCode.getsmsCode("RZ04");
            var ss = config.smsTime;
            cint = $interval(function(){
              ss--;
              $scope.getmessageinfo = ss + 's';
              if(ss<=0){
                $interval.cancel(cint);
                $scope.getmessageinfo="发送验证码";
              }
            },1000);
          }else{
            return;
          }
          /*获取短信验证码*/
        };
        $scope.giveout=function(){
          popAgree.close();
          $interval.cancel(cint);
        };
        $scope.makesure=function(){
          if($scope.input.MsgCode == ""){
            $ionicLoading.show({template: "请输入短信验证码" , noBackdrop: true, duration:1000})
            return ;
          }
          DrfApprove.drfApprove('05',$scope.input.MsgCode,'3',"",$scope.selected)
              .then(
              function(res){
                if(res.code == '000000'){
                  $interval.cancel(cint);
                  popAgree.close();
                  $state.go('tab.riskreview-success',{Mon:$scope.selectMoneny,Count:$scope.selected.length})
                }else{
                  $interval.cancel(cint);
                  popAgree.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
              }
          );
        };
      };

  })
  // 风控审查 单笔
  .controller('RiskreviewdanbiCtrl',function(config,$scope,$ionicPopup,$state,DrfDetail,$ionicLoading,GetDictByNo,$interval,ToolService,$stateParams,workgetSmsCode,DrfApprove){
      var pid = "";
      pid = $stateParams.pid;
      $scope.cjs=ToolService;
      var promise = DrfDetail.http(pid);
      promise.then(
          function(res){
            if(res.code == '000000'){
              $scope.detail = res.data;
            }else{
              $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
            }
          }
      );
      //驳回
      $scope.reject=function(){
        var txtinfo = "";
        //$scope.selectMoneny = $scope.detail.disctAmt;
        var popReject=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-rzaccept-newreject.html',
          scope:$scope
        });
        /*数据字典查询*/
        var promise = GetDictByNo.http('1000020',1,10);
        promise.then(
            function(res){
              console.log(res);
              if(res.code == '000000'){
                $scope.reason = res.data.list;
                /*判断是否选中*/
                $scope.selecheck = [];
                $scope.reason.forEach(function(arr,i){
                  arr.flag = false;
                  $scope.selecheck[i] = arr.flag;
                });
                $scope.checkone = function($index){
                  if($scope.selecheck[$index]){
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }else{
                    $scope.reason.forEach(function(arr,i){
                      arr.flag = false;
                      $scope.selecheck[i] = arr.flag;
                    });
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }
                }
              }else{
                popReject.close();
                $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
              }
            }
        );
        $scope.handle_cancel = function(){
          popReject.close();
        };
        $scope.handle_comfirm = function(){
          $scope.selecheck.forEach(function(arr,i){
            if(arr){txtinfo = $scope.reason[i].dataName}
          });
          if(!txtinfo || txtinfo == ""){
            $ionicLoading.show({template: '请选择驳回原因!', noBackdrop: true, duration:1000});
            return false;
          }
          var promise =DrfApprove.drfApprove('05',"",'1',txtinfo,[$scope.detail.yyId]);
          promise.then(
              function(res){
                if(res.code == '000000'){
                  popReject.close();
                  $state.go('tab.riskreview-reject',{Mon:$scope.detail.disctAmt,Count:1})
                }else{
                  popReject.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
              }
          )
        };
      };
      //同意
      $scope.agree=function(){
        var cint="";
        //$scope.selectMoneny = $scope.detail.disctAmt;
        $scope.getmessageinfo="发送验证码";
        $scope.input={MsgCode:""};
        var popAgree=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-riskreview-agree.html',
          scope:$scope
        });
        $scope.getMsgcode = function(){
          if($scope.getmessageinfo=="发送验证码"){
            var promise = workgetSmsCode.getsmsCode("RZ04");
            var cc = config.smsTime;
            cint = $interval(function(){
              cc--;
              $scope.getmessageinfo = cc + 's';
              if(cc<=0){
                $interval.cancel(cint);
                $scope.getmessageinfo="发送验证码";
              }
            },1000);
          }else{
            return;
          }
          /*获取短信验证码*/
        };
        $scope.giveout=function(){
          popAgree.close();
          $interval.cancel(cint);
        };
        $scope.makesure=function(){
          if($scope.input.MsgCode == ""){
            $ionicLoading.show({template: "请输入短信验证码" , noBackdrop: true, duration:1000})
            return ;
          }
          DrfApprove.drfApprove('05',$scope.input.MsgCode,'3',"",[$scope.detail.yyId])
              .then(
              function(res){
                if(res.code == '000000'){
                  $interval.cancel(cint);
                  popAgree.close();
                  $state.go('tab.riskreview-success',{Mon:$scope.detail.disctAmt,Count:1})
                }else{
                  $interval.cancel(cint);
                  popAgree.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
              }
          );
        };
      }

  })
  // 风控审查 成功
  .controller('RiskreviewsucCtrl',function($scope,$ionicHistory,$stateParams,ToolService){
    var formState="";
    $scope.cjs = ToolService;

    $scope.formCount = $stateParams.Count;
    $scope.formMoneny = $stateParams.Mon;

    $scope.gohistory=function(){
      if(formState==="tab.riskreview-danbi"){
        $ionicHistory.goBack(-2);
      }else{
        $ionicHistory.goBack(-1);
      }
    };
    $scope.$on('$stateChangeSuccess', function (event, toState,toParams,from) {
      formState=from.name;
    });
  })

  //----风控审核-----  RiskcheckCtrl
  .controller('RiskcheckCtrl',function(config,$interval,$ionicLoading,$scope,DrfApprove,$ionicPopup,workgetSmsCode,$state,QueryTask,ToolService,GetDictByNo){
      $scope.cjs = ToolService;
      $scope.taskList = [];
      $scope.hasdata = false;
      //页面加载获取数据
      var promise=QueryTask.http('06',1);
      promise.then(function(res){
        if(res.code == '000000'){
          $scope.tasklist = res.data.lists.list;
          if($scope.tasklist.length){
            $scope.hasdata = true
          }else{$scope.hasdata = false};
          $scope.isSelected = {};
          $scope.tasklist.forEach(function(arr,i){
            arr.flag = false ;
            $scope.isSelected[i] = arr.flag;
          });
          $scope.selectedAll = false ;
          /*单选*/
          $scope.selection = function($index){
            $scope.tasklist[$index].flag = !$scope.tasklist[$index].flag;
            $scope.isSelected[$index] = $scope.tasklist[$index].flag;
            var isCheckNum = 0;
            for (var i = 0; i < $scope.tasklist.length; i++) {
              if(!$scope.tasklist[i].flag){//如果有一个没有被选
                $scope.selectedAll = false;
              }else if($scope.tasklist[i].flag){//计数比较
                isCheckNum++
              }
            };
            if(isCheckNum == $scope.tasklist.length){//如果全部都被选
              $scope.selectedAll = true;
            }else{
              $scope.selectedAll = false;
            }
          };
          /*全选*/
          $scope.checkAll = function () { /*全选*/
            $scope.selectedAll = !$scope.selectedAll;
            if($scope.selectedAll == true){
              $scope.tasklist.forEach(function (arr,i) {
                arr.flag = true;
                for(var k in $scope.isSelected){
                  $scope.isSelected[k] = arr.flag;
                }
              })
            }else if($scope.selectedAll == false){
              $scope.tasklist.forEach(function (arr,i) {
                arr.flag = false;
                for(var k in $scope.isSelected){
                  $scope.isSelected[k] = arr.flag;
                }
              })
            }
          };
        }else{
          $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
        }
      });

      //驳回
      $scope.reject=function(){
        var txtinfo = "";
        $scope.selected = [];
        $scope.selectMoneny = 0;
        for(var i = 0 ; i < $scope.tasklist.length; i ++){
          if($scope.tasklist[i].flag){
            $scope.selected.push($scope.tasklist[i].yyId);
            $scope.selectMoneny += $scope.tasklist[i].disctAmt;
          }
        };
        if(!$scope.selected.length){
          $ionicLoading.show({template: '请选择你的宝眷!', noBackdrop: true, duration:1000});
          return false;
        }
        var popReject=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-rzaccept-newreject.html',
          scope:$scope
        });
        /*数据字典查询*/
        var promise = GetDictByNo.http('1000020',1,10);
        promise.then(
            function(res){
              if(res.code == '000000'){
                $scope.reason = res.data.list;
                /*判断是否选中*/
                $scope.selecheck = [];
                $scope.reason.forEach(function(arr,i){
                  arr.flag = false;
                  $scope.selecheck[i] = arr.flag;
                });
                $scope.checkone = function($index){
                  if($scope.selecheck[$index]){
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }else{
                    $scope.reason.forEach(function(arr,i){
                      arr.flag = false;
                      $scope.selecheck[i] = arr.flag;
                    });
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }
                }
              }else{
                popReject.close();
                $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
              }
            }
        );
        $scope.handle_cancel = function(){
          popReject.close();
        };
        $scope.handle_comfirm = function(){
          $scope.selecheck.forEach(function(arr,i){
            if(arr){txtinfo = $scope.reason[i].dataName}
          });
          if(!txtinfo || txtinfo == ""){
            $ionicLoading.show({template: '请选择驳回原因!', noBackdrop: true, duration:1000});
            return false;
          }
          var promise =DrfApprove.drfApprove('06',"",'1',txtinfo,$scope.selected);
          promise.then(
              function(res){
                if(res.code == '000000'){
                  popReject.close();
                  $state.go('tab.riskcheck-reject',{Mon:$scope.selectMoneny,Count:$scope.selected.length})
                }else{
                  popReject.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
              }
          )
        };
      };
      //同意
      $scope.agree=function(){
        var cint="";
        $scope.selected = [];
        $scope.selectMoneny=0;
        $scope.getmessageinfo="发送验证码";
        $scope.input={MsgCode:""};
        for(var i = 0 ; i < $scope.tasklist.length; i ++){
          if($scope.tasklist[i].flag){
            $scope.selected.push($scope.tasklist[i].yyId);
            $scope.selectMoneny += $scope.tasklist[i].disctAmt;
          }
        }
        if(!$scope.selected.length){
          $ionicLoading.show({template: '请选择你的宝眷!', noBackdrop: true, duration:1000});
          return false;
        };
        var popAgree=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-riskcheck-agree.html',
          scope:$scope
        });
        $scope.getMsgcode = function(){
          if($scope.getmessageinfo=="发送验证码"){
            var promise = workgetSmsCode.getsmsCode("RZ05");
            var ss = config.smsTime;
            cint = $interval(function(){
              ss--;
              $scope.getmessageinfo = ss + 's';
              if(ss<=0){
                $interval.cancel(cint);
                $scope.getmessageinfo="发送验证码";
              }
            },1000);
          }else{
            return;
          }
          /*获取短信验证码*/
        };
        $scope.giveout=function(){
          popAgree.close();
          $interval.cancel(cint);
        };
        $scope.makesure=function(){
          if($scope.input.MsgCode == ""){
            $ionicLoading.show({template: "请输入短信验证码" , noBackdrop: true, duration:1000})
            return ;
          }
          DrfApprove.drfApprove('06',$scope.input.MsgCode,'3',"",$scope.selected)
              .then(
              function(res){
                if(res.code == '000000'){
                  $interval.cancel(cint);
                  popAgree.close();
                  $state.go('tab.riskcheck-success',{Mon:$scope.selectMoneny,Count:$scope.selected.length})
                }else{
                  $interval.cancel(cint);
                  popAgree.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
              }
          );
        };
      };

  })
  // 风控审核 单笔
  .controller('RiskcheckdanbiCtrl',function(config,$scope,$ionicPopup,$state,DrfDetail,$ionicLoading,GetDictByNo,$interval,ToolService,$stateParams,workgetSmsCode,DrfApprove){
      var pid = "";
      pid = $stateParams.pid;
      $scope.cjs=ToolService;
      var promise = DrfDetail.http(pid);
      promise.then(
          function(res){
            if(res.code == '000000'){
              $scope.detail = res.data;
            }else{
              $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
            }
          }
      );
      //驳回
      $scope.reject=function(){
        var txtinfo = "";
        //$scope.selectMoneny = $scope.detail.disctAmt;
        var popReject=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-rzaccept-newreject.html',
          scope:$scope
        });
        /*数据字典查询*/
        var promise = GetDictByNo.http('1000020',1,10);
        promise.then(
            function(res){
              console.log(res);
              if(res.code == '000000'){
                $scope.reason = res.data.list;
                /*判断是否选中*/
                $scope.selecheck = [];
                $scope.reason.forEach(function(arr,i){
                  arr.flag = false;
                  $scope.selecheck[i] = arr.flag;
                });
                $scope.checkone = function($index){
                  if($scope.selecheck[$index]){
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }else{
                    $scope.reason.forEach(function(arr,i){
                      arr.flag = false;
                      $scope.selecheck[i] = arr.flag;
                    });
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }
                }
              }else{
                popReject.close();
                $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
              }
            }
        );
        $scope.handle_cancel = function(){
          popReject.close();
        };
        $scope.handle_comfirm = function(){
          $scope.selecheck.forEach(function(arr,i){
            if(arr){txtinfo = $scope.reason[i].dataName}
          });
          if(!txtinfo || txtinfo == ""){
            $ionicLoading.show({template: '请选择驳回原因!', noBackdrop: true, duration:1000});
            return false;
          }
          var promise =DrfApprove.drfApprove('06',"",'1',txtinfo,[$scope.detail.yyId]);
          promise.then(function(res){
                if(res.code == '000000'){
                  popReject.close();
                  $state.go('tab.riskcheck-reject',{Mon:$scope.detail.disctAmt,Count:1})
                }else{
                  popReject.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
             }
          )
        };
      };
      //同意
      $scope.agree=function(){
        var cint="";
        //$scope.selectMoneny = $scope.detail.disctAmt;
        $scope.getmessageinfo="发送验证码";
        $scope.input={MsgCode:""};
        var popAgree=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-riskcheck-agree.html',
          scope:$scope
        });
        $scope.getMsgcode = function(){
          if($scope.getmessageinfo=="发送验证码"){
            var promise = workgetSmsCode.getsmsCode("RZ05");
            var ss = config.smsTime;
            cint = $interval(function(){
              ss--;
              $scope.getmessageinfo = ss + 's';
              if(ss<=0){
                $interval.cancel(cint);
                $scope.getmessageinfo="发送验证码";
              }
            },1000);
          }else{
            return;
          }
          /*获取短信验证码*/
        };
        $scope.giveout=function(){
          popAgree.close();
          $interval.cancel(cint);
        };
        $scope.makesure=function(){
          if($scope.input.MsgCode == ""){
            $ionicLoading.show({template: "请输入短信验证码" , noBackdrop: true, duration:1000})
            return ;
          }
          DrfApprove.drfApprove('06',$scope.input.MsgCode,'3',"",[$scope.detail.yyId])
              .then(
              function(res){
                if(res.code == '000000'){
                  $interval.cancel(cint);
                  popAgree.close();
                  $state.go('tab.riskcheck-success',{Mon:$scope.detail.disctAmt,Count:1})
                }else{
                  $interval.cancel(cint);
                  popAgree.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
              }
          );
        };
      }

  })
  // 风控审核 成功
  .controller('RiskchecksucCtrl',function($scope,$ionicHistory,$stateParams,ToolService){
    var formState="";
      $scope.cjs = ToolService;

      $scope.formCount = $stateParams.Count;
      $scope.formMoneny = $stateParams.Mon;

    $scope.gohistory=function(){
      if(formState==="tab.riskcheck-danbi"){
        $ionicHistory.goBack(-2);
      }else{
        $ionicHistory.goBack(-1);
      }
    };
    $scope.$on('$stateChangeSuccess', function (event, toState,toParams,from) {
      formState=from.name;
    });
  })

  //----融资审批----   RzapproveCtrl
  .controller('RzapproveCtrl',function(config,$interval,$ionicLoading,$scope,DrfApprove,$ionicPopup,workgetSmsCode,$state,QueryTask,ToolService,GetDictByNo){
      $scope.cjs = ToolService;
      $scope.taskList = [];
      $scope.hasdata = false;
      //页面加载获取数据
      var promise=QueryTask.http('07',1);
      promise.then(function(res){
        console.log(res);
        if(res.code == '000000'){
          $scope.tasklist = res.data.lists.list;
          if($scope.tasklist.length){
            $scope.hasdata = true
          }else{$scope.hasdata = false};
          $scope.isSelected = {};
          $scope.tasklist.forEach(function(arr,i){
            arr.flag = false ;
            $scope.isSelected[i] = arr.flag;
          });
          $scope.selectedAll = false ;
          /*单选*/
          $scope.selection = function($index){
            $scope.tasklist[$index].flag = !$scope.tasklist[$index].flag;
            $scope.isSelected[$index] = $scope.tasklist[$index].flag;
            var isCheckNum = 0;
            for (var i = 0; i < $scope.tasklist.length; i++) {
              if(!$scope.tasklist[i].flag){//如果有一个没有被选
                $scope.selectedAll = false;
              }else if($scope.tasklist[i].flag){//计数比较
                isCheckNum++
              }
            };
            if(isCheckNum == $scope.tasklist.length){//如果全部都被选
              $scope.selectedAll = true;
            }else{
              $scope.selectedAll = false;
            }
          };
          /*全选*/
          $scope.checkAll = function () { /*全选*/
            $scope.selectedAll = !$scope.selectedAll;
            if($scope.selectedAll == true){
              $scope.tasklist.forEach(function (arr,i) {
                arr.flag = true;
                for(var k in $scope.isSelected){
                  $scope.isSelected[k] = arr.flag;
                }
              })
            }else if($scope.selectedAll == false){
              $scope.tasklist.forEach(function (arr,i) {
                arr.flag = false;
                for(var k in $scope.isSelected){
                  $scope.isSelected[k] = arr.flag;
                }
              })
            }
          };
        }else{
          $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
        }
      });
      //驳回
      $scope.reject=function(){
        var txtinfo = "";
        $scope.selected = [];
        $scope.selectMoneny = 0;
        for(var i = 0 ; i < $scope.tasklist.length; i ++){
          if($scope.tasklist[i].flag){
            $scope.selected.push($scope.tasklist[i].yyId);
            $scope.selectMoneny += $scope.tasklist[i].disctAmt;
          }
        };
        if(!$scope.selected.length){
          $ionicLoading.show({template: '请选择你的宝眷!', noBackdrop: true, duration:1000});
          return false;
        }
        var popReject=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-rzaccept-newreject.html',
          scope:$scope
        });
        /*数据字典查询*/
        var promise = GetDictByNo.http('1000020',1,10);
        promise.then(
            function(res){
              console.log(res);
              if(res.code == '000000'){
                $scope.reason = res.data.list;
                /*判断是否选中*/
                $scope.selecheck = [];
                $scope.reason.forEach(function(arr,i){
                  arr.flag = false;
                  $scope.selecheck[i] = arr.flag;
                });
                $scope.checkone = function($index){
                  if($scope.selecheck[$index]){
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }else{
                    $scope.reason.forEach(function(arr,i){
                      arr.flag = false;
                      $scope.selecheck[i] = arr.flag;
                    });
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }
                }
              }else{
                popReject.close();
                $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
              }
            }
        );
        $scope.handle_cancel = function(){
          popReject.close();
        };
        $scope.handle_comfirm = function(){
          $scope.selecheck.forEach(function(arr,i){
            if(arr){txtinfo = $scope.reason[i].dataName}
          });
          if(!txtinfo || txtinfo == ""){
            $ionicLoading.show({template: '请选择驳回原因!', noBackdrop: true, duration:1000});
            return false;
          }
          var promise =DrfApprove.drfApprove('07',"",'1',txtinfo,$scope.selected);
          promise.then(
              function(res){
                if(res.code == '000000'){
                  popReject.close();
                  $state.go('tab.rzapprove-reject',{Mon:$scope.selectMoneny,Count:$scope.selected.length})
                }else{
                  popReject.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
              }
          )
        };
      };
      //退回
      $scope.sendback=function(){
        var txtinfo = "";
        $scope.selected = [];
        $scope.selectMoneny = 0;
        for(var i = 0 ; i < $scope.tasklist.length; i ++){
          if($scope.tasklist[i].flag){
            $scope.selected.push($scope.tasklist[i].yyId);
            $scope.selectMoneny += $scope.tasklist[i].disctAmt;
          }
        };
        if(!$scope.selected.length){
          $ionicLoading.show({template: '请选择你的宝眷!', noBackdrop: true, duration:1000});
          return false;
        }
        var popReject=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-rzaccept-newreback.html',
          scope:$scope
        });
        /*数据字典查询*/
        var promise = GetDictByNo.http('1000020',1,10);
        promise.then(
            function(res){
              if(res.code == '000000'){
                $scope.reason = res.data.list;
                /*判断是否选中*/
                $scope.selecheck = [];
                $scope.reason.forEach(function(arr,i){
                  arr.flag = false;
                  $scope.selecheck[i] = arr.flag;
                });
                $scope.checkone = function($index){
                  if($scope.selecheck[$index]){
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }else{
                    $scope.reason.forEach(function(arr,i){
                      arr.flag = false;
                      $scope.selecheck[i] = arr.flag;
                    });
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }
                }
              }else{
                popReject.close();
                $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
              }
            }
        );
        $scope.handle_cancel = function(){
          popReject.close();
        };
        $scope.handle_comfirm = function(){
          $scope.selecheck.forEach(function(arr,i){
            if(arr){txtinfo = $scope.reason[i].dataName}
          });
          if(!txtinfo || txtinfo == ""){
            $ionicLoading.show({template: '请选择退回原因!', noBackdrop: true, duration:1000});
            return false;
          }
          var promise =DrfApprove.drfApprove('07',"",'2',txtinfo,$scope.selected);
          promise.then(
              function(res){
                if(res.code == '000000'){
                  popReject.close();
                  $state.go('tab.rzapprove-reback',{Mon:$scope.selectMoneny,Count:$scope.selected.length})
                }else{
                  popReject.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
              }
          )
        };
      };
      //同意
      $scope.agree=function(){
        var cint="";
        $scope.selected = [];
        $scope.selectMoneny=0;
        $scope.getmessageinfo="发送验证码";
        $scope.input={MsgCode:""};
        for(var i = 0 ; i < $scope.tasklist.length; i ++){
          if($scope.tasklist[i].flag){
            $scope.selected.push($scope.tasklist[i].yyId);
            $scope.selectMoneny += $scope.tasklist[i].disctAmt;
          }
        }
        if(!$scope.selected.length){
          $ionicLoading.show({template: '请选择你的宝眷!', noBackdrop: true, duration:1000});
          return false;
        };
        var popAgree=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-rzapprove-agree.html',
          scope:$scope
        });
        $scope.getMsgcode = function(){
          if($scope.getmessageinfo=="发送验证码"){
            var promise = workgetSmsCode.getsmsCode("RZ06");
            var ss = config.smsTime;
            cint = $interval(function(){
              ss--;
              $scope.getmessageinfo = ss + 's';
              if(ss<=0){
                $interval.cancel(cint);
                $scope.getmessageinfo="发送验证码";
              }
            },1000);
          }else{
            return;
          }
          /*获取短信验证码*/
        };
        $scope.giveout=function(){
          popAgree.close();
          $interval.cancel(cint);
        };
        $scope.makesure=function(){
          if($scope.input.MsgCode == ""){
            $ionicLoading.show({template: "请输入短信验证码" , noBackdrop: true, duration:1000});
            return ;
          }
          DrfApprove.drfApprove('07',$scope.input.MsgCode,'3',"",$scope.selected)
              .then(
              function(res){
                if(res.code == '000000'){
                  $interval.cancel(cint);
                  popAgree.close();
                  $state.go('tab.rzapprove-success',{Mon:$scope.selectMoneny,Count:$scope.selected.length})
                }else{
                  $interval.cancel(cint);
                  popAgree.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
              }
          );
        };
      };

  })
  // 融资审批  单笔
  .controller('RzapprovedanbiCtrl',function(config,$scope,$ionicPopup,$state,DrfDetail,$ionicLoading,GetDictByNo,$interval,ToolService,$stateParams,workgetSmsCode,DrfApprove){
      var pid = "";
      pid = $stateParams.pid;
      $scope.cjs=ToolService;
      var promise = DrfDetail.http(pid);
      promise.then(
          function(res){
            if(res.code == '000000'){
              $scope.detail = res.data;
            }else{
              $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
            }
          }
      );
      //驳回
      $scope.reject=function(){
        var txtinfo = "";
        //$scope.selectMoneny = $scope.detail.disctAmt;
        var popReject=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-rzaccept-newreject.html',
          scope:$scope
        });
        /*数据字典查询*/
        var promise = GetDictByNo.http('1000020',1,10);
        promise.then(
            function(res){
              console.log(res);
              if(res.code == '000000'){
                $scope.reason = res.data.list;
                /*判断是否选中*/
                $scope.selecheck = [];
                $scope.reason.forEach(function(arr,i){
                  arr.flag = false;
                  $scope.selecheck[i] = arr.flag;
                });
                $scope.checkone = function($index){
                  if($scope.selecheck[$index]){
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }else{
                    $scope.reason.forEach(function(arr,i){
                      arr.flag = false;
                      $scope.selecheck[i] = arr.flag;
                    });
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }
                }
              }else{
                popReject.close();
                $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
              }
            }
        );
        $scope.handle_cancel = function(){
          popReject.close();
        };
        $scope.handle_comfirm = function(){
          $scope.selecheck.forEach(function(arr,i){
            if(arr){txtinfo = $scope.reason[i].dataName}
          });
          if(!txtinfo || txtinfo == ""){
            $ionicLoading.show({template: '请选择驳回原因!', noBackdrop: true, duration:1000});
            return false;
          }
          var promise =DrfApprove.drfApprove('07',"",'1',txtinfo,[$scope.detail.yyId]);
          promise.then(
              function(res){
                if(res.code == '000000'){
                  popReject.close();
                  $state.go('tab.rzapprove-reject',{Mon:$scope.detail.disctAmt,Count:1})
                }else{
                  popReject.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
              }
          )
        };
      };
      //退回
      $scope.sendback=function(){
        var txtinfo = "";
        //$scope.selectMoneny = $scope.detail.disctAmt;
        var popReject=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-rzaccept-newreject.html',
          scope:$scope
        });
        /*数据字典查询*/
        var promise = GetDictByNo.http('1000020',1,10);
        promise.then(
            function(res){
              console.log(res);
              if(res.code == '000000'){
                $scope.reason = res.data.list;
                /*判断是否选中*/
                $scope.selecheck = [];
                $scope.reason.forEach(function(arr,i){
                  arr.flag = false;
                  $scope.selecheck[i] = arr.flag;
                });
                $scope.checkone = function($index){
                  if($scope.selecheck[$index]){
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }else{
                    $scope.reason.forEach(function(arr,i){
                      arr.flag = false;
                      $scope.selecheck[i] = arr.flag;
                    });
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }
                }
              }else{
                popReject.close();
                $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
              }
            }
        );
        $scope.handle_cancel = function(){
          popReject.close();
        };
        $scope.handle_comfirm = function(){
          $scope.selecheck.forEach(function(arr,i){
            if(arr){txtinfo = $scope.reason[i].dataName}
          });
          if(!txtinfo || txtinfo == ""){
            $ionicLoading.show({template: '请选择驳回原因!', noBackdrop: true, duration:1000});
            return false;
          }
          var promise =DrfApprove.drfApprove('07',"",'2',txtinfo,[$scope.detail.length]);
          promise.then(
              function(res){
                if(res.code == '000000'){
                  popReject.close();
                  $state.go('tab.rzapprove-reback',{Mon:$scope.detail.disctAmt,Count:1})
                }else{
                  popReject.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
              }
          )
        };
      };
      //同意
      $scope.agree=function(){
        var cint="";
        //$scope.selectMoneny = $scope.detail.disctAmt;
        $scope.getmessageinfo="发送验证码";
        $scope.input={MsgCode:""};
        var popAgree=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-rzapprove-agree.html',
          scope:$scope
        });
        $scope.getMsgcode = function(){
          if($scope.getmessageinfo=="发送验证码"){
            var promise = workgetSmsCode.getsmsCode("RZ06");
            var ss = config.smsTime;
            cint = $interval(function(){
              ss--;
              $scope.getmessageinfo = ss + 's';
              if(ss<=0){
                $interval.cancel(cint);
                $scope.getmessageinfo="发送验证码";
              }
            },1000);
          }else{
            return;
          }
          /*获取短信验证码*/
        };
        $scope.giveout=function(){
          popAgree.close();
          $interval.cancel(cint);
        };
        $scope.makesure=function(){
          if($scope.input.MsgCode == ""){
            $ionicLoading.show({template: "请输入短信验证码" , noBackdrop: true, duration:1000})
            return ;
          }
          DrfApprove.drfApprove('07',$scope.input.MsgCode,'3',"",[$scope.detail.yyId])
              .then(
              function(res){
                if(res.code == '000000'){
                  $interval.cancel(cint);
                  popAgree.close();
                  $state.go('tab.rzapprove-success',{Mon:$scope.detail.disctAmt,Count:1})
                }else{
                  $interval.cancel(cint);
                  popAgree.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
              }
          );
        };
      };

  })
  // 融资审批  成功
  .controller('RzapprovesucCtrl',function($scope,$ionicHistory,$stateParams,ToolService){
    var formState="";
      $scope.cjs = ToolService;

      $scope.formCount = $stateParams.Count;
      $scope.formMoneny = $stateParams.Mon;

    $scope.gohistory=function(){
      if(formState==="tab.rzapprove-danbi"){
        $ionicHistory.goBack(-2);
      }else{
        $ionicHistory.goBack(-1);
      }
    };
    $scope.$on('$stateChangeSuccess', function (event, toState,toParams,from) {
      formState=from.name;
    });
  })

  //----计财审核----   FiscalcheckCtrl
  .controller('FiscalcheckCtrl',function(config,$interval,$ionicLoading,$scope,DrfApprove,$ionicPopup,workgetSmsCode,$state,QueryTask,ToolService,GetDictByNo){
      $scope.cjs = ToolService;
      $scope.taskList = [];
      $scope.hasdata = false;
      //页面加载获取数据
      var promise=QueryTask.http('0B',1);
      promise.then(function(res){
        if(res.code == '000000'){
          $scope.tasklist = res.data.lists.list;
          if($scope.tasklist.length){
            $scope.hasdata = true
          }else{$scope.hasdata = false};
          $scope.isSelected = {};
          $scope.tasklist.forEach(function(arr,i){
            arr.flag = false ;
            $scope.isSelected[i] = arr.flag;
          });
          $scope.selectedAll = false ;
          /*单选*/
          $scope.selection = function($index){
            $scope.tasklist[$index].flag = !$scope.tasklist[$index].flag;
            $scope.isSelected[$index] = $scope.tasklist[$index].flag;
            var isCheckNum = 0;
            for (var i = 0; i < $scope.tasklist.length; i++) {
              if(!$scope.tasklist[i].flag){//如果有一个没有被选
                $scope.selectedAll = false;
              }else if($scope.tasklist[i].flag){//计数比较
                isCheckNum++
              }
            };
            if(isCheckNum == $scope.tasklist.length){//如果全部都被选
              $scope.selectedAll = true;
            }else{
              $scope.selectedAll = false;
            }
          };
          /*全选*/
          $scope.checkAll = function () { /*全选*/
            $scope.selectedAll = !$scope.selectedAll;
            if($scope.selectedAll == true){
              $scope.tasklist.forEach(function (arr,i) {
                arr.flag = true;
                for(var k in $scope.isSelected){
                  $scope.isSelected[k] = arr.flag;
                }
              })
            }else if($scope.selectedAll == false){
              $scope.tasklist.forEach(function (arr,i) {
                arr.flag = false;
                for(var k in $scope.isSelected){
                  $scope.isSelected[k] = arr.flag;
                }
              })
            }
          };
        }else{
          $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
        }
      });
      //同意
      $scope.agree=function(){
        var cint="";
        $scope.selected = [];
        $scope.selectMoneny=0;
        $scope.getmessageinfo="发送验证码";
        $scope.input={MsgCode:"",isok:""};
        for(var i = 0 ; i < $scope.tasklist.length; i ++){
          if($scope.tasklist[i].flag){
            $scope.selected.push($scope.tasklist[i].yyId);
            $scope.selectMoneny += $scope.tasklist[i].disctAmt;
          }
        }
        if(!$scope.selected.length){
          $ionicLoading.show({template: '请选择你的宝眷!', noBackdrop: true, duration:1000});
          return false;
        };
        var popAgree=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-fiscalcheck-agree.html',
          scope:$scope
        });
        $scope.getMsgcode = function(){
          if($scope.getmessageinfo=="发送验证码"){
            var promise = workgetSmsCode.getsmsCode("RZ07");
            var ss = config.smsTime;
            cint = $interval(function(){
              ss--;
              $scope.getmessageinfo = ss + 's';
              if(ss<=0){
                $interval.cancel(cint);
                $scope.getmessageinfo="发送验证码";
              }
            },1000);
          }else{
            return;
          }
          /*获取短信验证码*/
        };
        $scope.giveout=function(){
          popAgree.close();
          $interval.cancel(cint);
        };
        $scope.makesure=function(){
          if($scope.input.MsgCode == ""){
            $ionicLoading.show({template: "请输入短信验证码" , noBackdrop: true, duration:1000});
            return ;
          }
          if(!$scope.input.isok){
            $ionicLoading.show({template: "请确认同意协议和通知" , noBackdrop: true, duration:1000});
            return ;
          }
          DrfApprove.drfApprove('08',$scope.input.MsgCode,'3',"",$scope.selected)
              .then(
              function(res){
                if(res.code == '000000'){
                  $interval.cancel(cint);
                  popAgree.close();
                  $state.go('tab.fiscalcheck-success',{Mon:$scope.selectMoneny,Count:$scope.selected.length})
                }else{
                  $interval.cancel(cint);
                  popAgree.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
              }
          );
        };
      };

  })
  // 计财审核 单笔
  .controller('FiscalcheckdanbiCtrl',function(config,$scope,$ionicPopup,$state,DrfDetail,$ionicLoading,GetDictByNo,$interval,ToolService,$stateParams,workgetSmsCode,DrfApprove){
      var pid = "";
      pid = $stateParams.pid;
      $scope.cjs=ToolService;
      var promise = DrfDetail.http(pid);
      promise.then(
          function(res){
            if(res.code == '000000'){
              $scope.detail = res.data;
            }else{
              $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
            }
          }
      );
      //同意
      $scope.agree=function(){
        var cint="";
        //$scope.selectMoneny = $scope.detail.disctAmt;
        $scope.getmessageinfo="发送验证码";
        $scope.input={MsgCode:"",isok:""};
        var popAgree=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-fiscalcheck-agree.html',
          scope:$scope
        });
        $scope.getMsgcode = function(){
          if($scope.getmessageinfo=="发送验证码"){
            var promise = workgetSmsCode.getsmsCode("RZ07");
            var ss = config.smsTime;
            cint = $interval(function(){
              ss--;
              $scope.getmessageinfo = ss + 's';
              if(ss<=0){
                $interval.cancel(cint);
                $scope.getmessageinfo="发送验证码";
              }
            },1000);
          }else{
            return;
          }
          /*获取短信验证码*/
        };
        $scope.giveout=function(){
          popAgree.close();
          $interval.cancel(cint);
        };
        $scope.makesure=function(){
          if($scope.input.MsgCode == ""){
            $ionicLoading.show({template: "请输入短信验证码" , noBackdrop: true, duration:1000})
            return ;
          }
          if(!$scope.input.isok){
            $ionicLoading.show({template: "请确认同意协议和通知" , noBackdrop: true, duration:1000});
            return ;
          }
          DrfApprove.drfApprove('08',$scope.input.MsgCode,'3',"",[$scope.detail.yyId])
              .then(
              function(res){
                if(res.code == '000000'){
                  $interval.cancel(cint);
                  popAgree.close();
                  $state.go('tab.fiscalcheck-success',{Mon:$scope.detail.disctAmt,Count:1})
                }else{
                  $interval.cancel(cint);
                  popAgree.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
              }
          );
        };
      };

  })
  // 计财审核 成功
  .controller('FiscalchecksucCtrl',function($scope,$ionicHistory,$stateParams,ToolService){
    var formState="";
      $scope.cjs = ToolService;

      $scope.formCount = $stateParams.Count;
      $scope.formMoneny = $stateParams.Mon;

    $scope.gohistory=function(){
      if(formState==="tab.fiscalcheck-danbi"){
        $ionicHistory.goBack(-2);
      }else{
        $ionicHistory.goBack(-1);
      }
    };
    $scope.$on('$stateChangeSuccess', function (event, toState,toParams,from) {
      formState=from.name;
    });
  })

  //----融资到期----   RzdueCtrl
  .controller('RzdueCtrl',function(ToolService,$scope,PayDrftList,$rootScope,ApplyForOwner,$ionicLoading,$state){
      $scope.cjs = ToolService;
      $scope.parseInt = parseInt;
      $scope.taskList = [];
      $scope.hasdata = false;
      //页面加载获取数据
      var promise=PayDrftList.http(1);
      promise.then(function(res){
        console.log(res);
        if(res.code == '000000'){
          $scope.tasklist = res.data.list;
          if(res.data.list.length && res.data.list != null){
            $scope.hasdata = true
          }else{$scope.hasdata = false};
          $scope.isSelected = {};
          $scope.tasklist.forEach(function(arr,i){
            arr.flag = false ;
            $scope.isSelected[i] = arr.flag;
          });
          $scope.selectedAll = false ;
          /*单选*/
          $scope.selection = function($index){
            $scope.tasklist[$index].flag = !$scope.tasklist[$index].flag;
            $scope.isSelected[$index] = $scope.tasklist[$index].flag;
            var isCheckNum = 0;
            for (var i = 0; i < $scope.tasklist.length; i++) {
              if(!$scope.tasklist[i].flag){//如果有一个没有被选
                $scope.selectedAll = false;
              }else if($scope.tasklist[i].flag){//计数比较
                isCheckNum++
              }
            };
            if(isCheckNum == $scope.tasklist.length){//如果全部都被选
              $scope.selectedAll = true;
            }else{
              $scope.selectedAll = false;
            }
          };
          /*全选*/
          $scope.checkAll = function () { /*全选*/
            $scope.selectedAll = !$scope.selectedAll;
            if($scope.selectedAll == true){
              $scope.tasklist.forEach(function (arr,i) {
                arr.flag = true;
                for(var k in $scope.isSelected){
                  $scope.isSelected[k] = arr.flag;
                }
              })
            }else if($scope.selectedAll == false){
              $scope.tasklist.forEach(function (arr,i) {
                arr.flag = false;
                for(var k in $scope.isSelected){
                  $scope.isSelected[k] = arr.flag;
                }
              })
            }
          };
        }else{
          $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
        }
      });
      //同意
      $scope.agree = function(){
        $rootScope.selectedBqArr = [];
        var custNo = JSON.parse(window.localStorage.getItem("user")).custNo;
        var custCnNm = JSON.parse(window.localStorage.getItem("user")).custCnNm;
        for(var i = 0 ; i < $scope.tasklist.length; i++){
          if($scope.tasklist[i].flag){
            var obj = {};
            obj.rcvCustNo = custNo;
            obj.rcvCustNm = custCnNm;
            obj.isseAmt = $scope.tasklist[i].validAmt;
            obj.dueDays = $scope.tasklist[i].dueDays;
            obj.delayDays = $scope.tasklist[i].dueDt;
            obj.id = $scope.tasklist[i].id;
            obj.drftNo = $scope.tasklist[i].drftNo;
            $rootScope.selectedBqArr.push(obj)
          }
        }
        if($rootScope.selectedBqArr.length){
          $state.go("tab.rzdue-batch")
        }else{
          $ionicLoading.show({template: '请选择您的宝券!', noBackdrop: true, duration:1000});
        }
      };

  })
  // 融资到期 批量
  .controller('RzduebatcCtrl',function(config,workgetSmsCode,$scope,$rootScope,$ionicPopup,$state,ListAcct,ApplyForOwner,ToolService,$interval){
      $scope.cjs = ToolService;
      $scope.parseInt = parseInt;
      $scope.showList = false;
      console.log( $rootScope.selectedBqArr);

      /*银行账户查询*/
      var promise = ListAcct.listacct('1',30);
      promise.then(function(res) {
        if (res.code == '000000') {
          $scope.acctList = res.data.list;
          for (var i = 0; i < $scope.acctList.length; i++) {
            if ($scope.acctList[i].defRecNo == '1') {
              console.log($scope.acctList[i]);
              //$scope.showName = $scope.acctList[i].openBrhNm;
              $scope.showCo = $scope.acctList[i].acctNo;
              $scope.showRo = $scope.acctList[i].defRecNo;
              //$scope.showCity = $scope.acctList[i].bankCity;
            }
          }
        }else{
          $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
        }
      });
      /*收款账号选择*/
      $scope.droplist = function(){
        //var countNo = document.getElementById("countNoList");
        $scope.showList = !$scope.showList;
        $scope.chooseNo = function($index){
          $scope.showCo = $scope.acctList[$index].acctNo;
          $scope.showRo = $scope.acctList[$index].defRecNo;
          $scope.showList = !$scope.showList;
        }
      };
      /*申请兑付*/
      $scope.confirm=function(){
        /*添加收款账号到报文*/
        for(var i = 0;i < $rootScope.selectedBqArr.length; i++){
          $rootScope.selectedBqArr[i].acctNo = $scope.showCo;
        }
        var popReject=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'/template/popup-rzdue-agree.html',
          scope:$scope
        });
        var cint = "";
        $scope.messageinfo = '发送验证码';
        $scope.input = {MsgCode:""};
        /*获取短信验证码*/
        $scope.getMsgcode = function () {
          if($scope.messageinfo == "发送验证码"){
            var promise = workgetSmsCode.getsmsCode("JF02");
            var ss = config.smsTime;
            cint = $interval(function(){
              ss--;
              $scope.messageinfo = ss + 's';
              if(ss <= 0){
                $interval.cancel(cint);
                $scope.messageinfo = "发送验证码";
              }
            },1000);
          }else{
            return;
          }
        };

        $scope.makesure = function(){
          console.log($rootScope.selectedBqArr);
          if($scope.input.MsgCode != "" && $scope.input.MsgCode != null){
            var promise = ApplyForOwner.http($scope.input.MsgCode.toString(),$rootScope.selectedBqArr);
            promise.then(
                function(res){
                  if(res.code == '000000'){
                    $interval.cancel(cint);
                    popReject.close();
                    $state.go('tab.rzdue-success');
                  }else{
                    popReject.close();
                    $interval.cancel(cint);
                    $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                  }
                }
            )
          }
        };
        $scope.giveout = function(){
          $interval.cancel(cint);
          popReject.close();
        }
      }
    })
  // 融资到期  单笔
  .controller('RzduedanbiCtrl',function($ionicLoading,config,TxnApproveDetail,$stateParams,$scope,$ionicPopup,$state,workgetSmsCode,$rootScope,ListAcct,ToolService,$interval){
      $scope.cjs = ToolService;
      $scope.parseInt = parseInt;
      $scope.showList = false;
      var sendArr = [];
      var id = $stateParams.id;
      var promise = TxnApproveDetail.http(id);
      promise.then(
          function (res) {
            if(res.code == '000000'){
              $scope.bqdetail = res.data;
              var obj = {};
              obj.rcvCustNo = JSON.parse(window.localStorage.getItem("user")).custNo;
              obj.rcvCustNm = JSON.parse(window.localStorage.getItem("user")).custCnNm;
              obj.isseAmt = $scope.bqdetail.validAmt;
              obj.dueDays = $scope.bqdetail.dueDays;
              obj.delayDays = $scope.bqdetail.dueDt;
              obj.id = $scope.bqdetail.id;
              obj.drftNo = $scope.bqdetail.drftNo;
              sendArr.push(obj)
            }else{
              $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
            }
          }
      );
      var promiseCoun = ListAcct.listacct('1',100);
      promiseCoun.then(function(res) {
        if (res.code == '000000') {
          $scope.acctList = res.data.list;
          for (var i = 0; i < $scope.acctList.length; i++) {
            if ($scope.acctList[i].defRecNo == 1) {
              //$scope.showName = $scope.acctList[i].openBrhNm;
              $scope.showCo = $scope.acctList[i].acctNo;
              $scope.showRo = $scope.acctList[i].defRecNo;
              //$scope.showCity = $scope.acctList[i].bankCity;
            }
          }
        }else{
          $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
        }
      });
      /*收款账号选择*/
      $scope.droplist = function(){
        $scope.showList = !$scope.showList;
        $scope.chooseNo = function($index){
          $scope.showCo = $scope.acctList[$index].acctNo;
          $scope.showRo = $scope.acctList[$index].defRecNo;
          $scope.showList = !$scope.showList;
        }
      };
      /*申请兑付*/
      $scope.agree=function(){
        /*添加到报文*/
        sendArr[0].acctNo = $scope.showCo;
        var popReject=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'/template/popup-rzdue-agree.html',
          scope:$scope
        });
        var cint = "";
        $scope.messageinfo = '发送验证码';
        $scope.input = {MsgCode:""};
        /*获取短信验证码*/
        $scope.getMsgcode = function () {
          if($scope.messageinfo == "发送验证码"){
            var promise = workgetSmsCode.getsmsCode("JF02");
            var ss = config.smsTime;
            cint = $interval(function(){
              ss--;
              $scope.messageinfo = ss + 's';
              if(ss <= 0){
                $interval.cancel(cint);
                $scope.messageinfo = "发送验证码";
              }
            },1000);
          }else{
            return;
          }
        };

        $scope.makesure = function(){
          if($scope.input.MsgCode != "" && $scope.input.MsgCode != null){
            var promise = ApplyForOwner.http($scope.input.MsgCode.toString(),sendArr);
            promise.then(
                function(res){
                  if(res.code == '000000'){
                    $interval.cancel(cint);
                    popReject.close();
                    $state.go('tab.rzdue-success');
                  }else{
                    $interval.cancel(cint);
                    popReject.close();
                    $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                  }
                }
            )
          }
        };
        $scope.giveout=function(){
          $interval.cancel(cint);
          popReject.close();
        }
      }


    /*//驳回 reject
    $scope.reject=function(){
      var popReject=$ionicPopup.show({
        cssClass:'my-popup',
        templateUrl:'template/popup-rzdue-reject.html',
        scope:$scope
      })
      $scope.giveout=function(){
        popReject.close();
      }
      $scope.makesure=function(){
        popReject.close();
      }
    }
    //同意
    $scope.agree=function(){
      var popAgree=$ionicPopup.show({
        cssClass:'my-popup',
        templateUrl:'template/popup-rzdue-agree.html',
        scope:$scope
      })
      $scope.giveout=function(){
        popAgree.close();
      };
      $scope.makesure=function(){
        popAgree.close();
        $state.go('tab.rzdue-success')
      }

    }*/
  })
  // 融资到期  成功
  .controller('RzduesucCtrl',function($scope,$ionicHistory){
    var formState="";
    $scope.gohistory=function(){
      if(formState==="tab.rzdue-danbi"){
        $ionicHistory.goBack(-2);
      }else{
        $ionicHistory.goBack(-1);
      }
    };
    $scope.$on('$stateChangeSuccess', function (event, toState,toParams,from) {
      formState=from.name;
    });
  })

  //----付款审核----   PaycheckCtrl
  .controller('PaycheckCtrl',function(config,GetDictByNo,$ionicLoading,workgetSmsCode,PrsntPayApprove,$interval,PayApproveList,ToolService,$scope,$ionicPopup,$state){
      $scope.cjs = ToolService;
      $scope.taskList = [];
      $scope.hasdata = false;
      //页面加载获取数据
      var promise=PayApproveList.http(1);
      promise.then(function(res){
        console.log(res);
        if(res.code == '000000'){
          $scope.tasklist = res.data.list;
          if(res.data.list.length && res.data.list != null){
            $scope.hasdata = true
          }else{$scope.hasdata = false};
          $scope.isSelected = {};
          $scope.tasklist.forEach(function(arr,i){
            arr.flag = false ;
            $scope.isSelected[i] = arr.flag;
          });
          $scope.selectedAll = false ;
          /*单选*/
          $scope.selection = function($index){
            $scope.tasklist[$index].flag = !$scope.tasklist[$index].flag;
            $scope.isSelected[$index] = $scope.tasklist[$index].flag;
            var isCheckNum = 0;
            for (var i = 0; i < $scope.tasklist.length; i++) {
              if(!$scope.tasklist[i].flag){//如果有一个没有被选
                $scope.selectedAll = false;
              }else if($scope.tasklist[i].flag){//计数比较
                isCheckNum++
              }
            };
            if(isCheckNum == $scope.tasklist.length){//如果全部都被选
              $scope.selectedAll = true;
            }else{
              $scope.selectedAll = false;
            }
          };
          /*全选*/
          $scope.checkAll = function () { /*全选*/
            $scope.selectedAll = !$scope.selectedAll;
            if($scope.selectedAll == true){
              $scope.tasklist.forEach(function (arr,i) {
                arr.flag = true;
                for(var k in $scope.isSelected){
                  $scope.isSelected[k] = arr.flag;
                }
              })
            }else if($scope.selectedAll == false){
              $scope.tasklist.forEach(function (arr,i) {
                arr.flag = false;
                for(var k in $scope.isSelected){
                  $scope.isSelected[k] = arr.flag;
                }
              })
            }
          };
        }else{
          $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
        }
      });
      //驳回
      $scope.reject=function(){
        var txtinfo = "";
        $scope.selected = [];
        $scope.selectMoneny = 0;
        for(var i = 0 ; i < $scope.tasklist.length; i ++){
          if($scope.tasklist[i].flag){
            $scope.selected.push($scope.tasklist[i].id);
            $scope.selectMoneny += $scope.tasklist[i].disctAmt;
          }
        };
        if(!$scope.selected.length){
          $ionicLoading.show({template: '请选择你的宝眷!', noBackdrop: true, duration:1000});
          return false;
        }
        var popReject=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-rzaccept-newreject.html',
          scope:$scope
        });
        /*数据字典查询*/
        var promise = GetDictByNo.http('1000020',1,10);
        promise.then(
            function(res){
              console.log(res);
              if(res.code == '000000'){
                $scope.reason = res.data.list;
                /*判断是否选中*/
                $scope.selecheck = [];
                $scope.reason.forEach(function(arr,i){
                  arr.flag = false;
                  $scope.selecheck[i] = arr.flag;
                });
                $scope.checkone = function($index){
                  if($scope.selecheck[$index]){
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }else{
                    $scope.reason.forEach(function(arr,i){
                      arr.flag = false;
                      $scope.selecheck[i] = arr.flag;
                    });
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }
                }
              }else{
                popReject.close();
                $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
              }
            }
        );
        $scope.handle_cancel = function(){
          popReject.close();
        };
        $scope.handle_comfirm = function(){
          $scope.selecheck.forEach(function(arr,i){
            if(arr){txtinfo = $scope.reason[i].dataName}
          });
          if(!txtinfo || txtinfo == ""){
            $ionicLoading.show({template: '请选择驳回原因!', noBackdrop: true, duration:1000});
            return false;
          }
          PrsntPayApprove.http('2',"",$scope.selected,txtinfo)
            .then(
                function(res){
                  if(res.code == '000000'){
                    popReject.close();
                    $state.go('tab.paycheck-reject',{Mon:$scope.selectMoneny,Count:$scope.selected.length})
                  }else{
                    popReject.close();
                    $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                  }
                }
            )
        };
      };
      //同意
      $scope.agree=function(){
        var cint="";
        $scope.selected = [];
        $scope.selectMoneny=0;
        $scope.getmessageinfo="发送验证码";
        $scope.input={MsgCode:""};
        for(var i = 0 ; i < $scope.tasklist.length; i ++){
          if($scope.tasklist[i].flag){
            $scope.selected.push($scope.tasklist[i].id);
            $scope.selectMoneny += $scope.tasklist[i].disctAmt;
          }
        }
        if(!$scope.selected.length){
          $ionicLoading.show({template: '请选择你的宝眷!', noBackdrop: true, duration:1000});
          return false;
        };
        var popAgree=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-paycheck-agree.html',
          scope:$scope
        });
        $scope.getMsgcode = function(){
          if($scope.getmessageinfo=="发送验证码"){
            var promise = workgetSmsCode.getsmsCode("JF02");
            var ss = config.smsTime;
            cint = $interval(function(){
              ss--;
              $scope.getmessageinfo = ss + 's';
              if(ss<=0){
                $interval.cancel(cint);
                $scope.getmessageinfo="发送验证码";
              }
            },1000);
          }else{
            return;
          }
          /*获取短信验证码*/
        };
        $scope.giveout=function(){
          popAgree.close();
          $interval.cancel(cint);
        };
        $scope.makesure=function(){
          if($scope.input.MsgCode == ""){
            $ionicLoading.show({template: "请输入短信验证码" , noBackdrop: true, duration:1000})
            return ;
          }
          PrsntPayApprove.http('1',$scope.input.MsgCode,$scope.selected)
              .then(
              function(res){
                if(res.code == '000000'){
                  $interval.cancel(cint);
                  popAgree.close();
                  $state.go('tab.paycheck-success',{Mon:$scope.selectMoneny,Count:$scope.selected.length})
                }else{
                  $interval.cancel(cint);
                  popAgree.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
              }
          );
        };
      };

  })
  // 付款审核 单笔
  .controller('PaycheckdanbiCtrl',function(config,GetDictByNo,$ionicLoading,$interval,workgetSmsCode,PrsntPayApprove,PayqueryDetail,ToolService,$stateParams,$scope,$ionicPopup,$state){
      var pid = "";
      pid = $stateParams.pid;
      $scope.cjs=ToolService;
      var promise = PayqueryDetail.http(pid);
      promise.then(
          function(res){
            if(res.code == '000000'){
              console.log(res);
              $scope.detail = res.data;
            }else{
              $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
            }
          }
      );
      //驳回
      $scope.reject=function(){
        var txtinfo = "";
        //$scope.selectMoneny = $scope.detail.disctAmt;
        var popReject=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-rzaccept-newreject.html',
          scope:$scope
        });
        /*数据字典查询*/
        var promise = GetDictByNo.http('1000020',1,10);
        promise.then(
            function(res){
              console.log(res);
              if(res.code == '000000'){
                $scope.reason = res.data.list;
                /*判断是否选中*/
                $scope.selecheck = [];
                $scope.reason.forEach(function(arr,i){
                  arr.flag = false;
                  $scope.selecheck[i] = arr.flag;
                });
                $scope.checkone = function($index){
                  if($scope.selecheck[$index]){
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }else{
                    $scope.reason.forEach(function(arr,i){
                      arr.flag = false;
                      $scope.selecheck[i] = arr.flag;
                    });
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }
                }
              }else{
                popReject.close();
                $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
              }
            }
        );
        $scope.handle_cancel = function(){
          popReject.close();
        };
        $scope.handle_comfirm = function(){
          $scope.selecheck.forEach(function(arr,i){
            if(arr){txtinfo = $scope.reason[i].dataName}
          });
          if(!txtinfo || txtinfo == ""){
            $ionicLoading.show({template: '请选择驳回原因!', noBackdrop: true, duration:1000});
            return false;
          }
          var promise =PayqueryDetail.http('2',"",[pid],txtinfo);
          promise.then(
              function(res){
                if(res.code == '000000'){
                  popReject.close();
                  $state.go('tab.paycheck-reject',{Mon:$scope.detail.disctAmt,Count:1})
                }else{
                  popReject.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
              }
          )
        };
      };
      //同意
      $scope.agree=function(){
        var cint="";
        //$scope.selectMoneny = $scope.detail.disctAmt;
        $scope.getmessageinfo="发送验证码";
        $scope.input={MsgCode:""};
        var popAgree=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-paycheck-agree.html',
          scope:$scope
        });
        $scope.getMsgcode = function(){
          if($scope.getmessageinfo=="发送验证码"){
            var promise = workgetSmsCode.getsmsCode("JF02");
            var ss = config.smsTime;
            cint = $interval(function(){
              ss--;
              $scope.getmessageinfo = ss + 's';
              if(ss<=0){
                $interval.cancel(cint);
                $scope.getmessageinfo="发送验证码";
              }
            },1000);
          }else{
            return;
          }
          /*获取短信验证码*/
        };
        $scope.giveout=function(){
          popAgree.close();
          $interval.cancel(cint);
        };
        $scope.makesure=function(){
          if($scope.input.MsgCode == ""){
            $ionicLoading.show({template: "请输入短信验证码" , noBackdrop: true, duration:1000})
            return ;
          }
          PrsntPayApprove.http('1',$scope.input.MsgCode,[pid])
              .then(
              function(res){
                if(res.code == '000000'){
                  $interval.cancel(cint);
                  popAgree.close();
                  $state.go('tab.paycheck-success',{Mon:$scope.detail.disctAmt,Count:1})
                }else{
                  $interval.cancel(cint);
                  popAgree.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
              }
          );
        };
      }

  })
  // 付款审核 成功
  .controller('PaychecksucCtrl',function($scope,$ionicHistory,$stateParams,ToolService){
    var formState="";
      $scope.cjs = ToolService;

      $scope.formCount = $stateParams.Count;
      $scope.formMoneny = $stateParams.Mon;

    $scope.gohistory=function(){
      if(formState==="tab.paycheck-danbi"){
        $ionicHistory.goBack(-2);
      }else{
        $ionicHistory.goBack(-1);
      }
    };
    $scope.$on('$stateChangeSuccess', function (event, toState,toParams,from) {
      formState=from.name;
    });
  })

  //----企业审核----   UsercheckCtrl
  .controller('UsercheckCtrl',function(config,GetDictByNo,$ionicLoading,workgetSmsCode,CurrentapproveList,$interval,Currentapprove,ToolService,$scope,$ionicPopup,$state){
      $scope.cjs = ToolService;
      $scope.taskList = [];
      $scope.hasdata = false;
      //页面加载获取数据
      var promise=CurrentapproveList.http(1);
      promise.then(function(res){
        console.log(res);
        if(res.code == '000000'){
          $scope.tasklist = res.data.list;
          if(res.data.list.length && res.data.list != null){
            $scope.hasdata = true
          }else{$scope.hasdata = false};
          $scope.isSelected = {};
          $scope.tasklist.forEach(function(arr,i){
            arr.flag = false ;
            $scope.isSelected[i] = arr.flag;
          });
          $scope.selectedAll = false ;
          /*单选*/
          $scope.selection = function($index){
            $scope.tasklist[$index].flag = !$scope.tasklist[$index].flag;
            $scope.isSelected[$index] = $scope.tasklist[$index].flag;
            var isCheckNum = 0;
            for (var i = 0; i < $scope.tasklist.length; i++) {
              if(!$scope.tasklist[i].flag){//如果有一个没有被选
                $scope.selectedAll = false;
              }else if($scope.tasklist[i].flag){//计数比较
                isCheckNum++
              }
            };
            if(isCheckNum == $scope.tasklist.length){//如果全部都被选
              $scope.selectedAll = true;
            }else{
              $scope.selectedAll = false;
            }
          };
          /*全选*/
          $scope.checkAll = function () { /*全选*/
            $scope.selectedAll = !$scope.selectedAll;
            if($scope.selectedAll == true){
              $scope.tasklist.forEach(function (arr,i) {
                arr.flag = true;
                for(var k in $scope.isSelected){
                  $scope.isSelected[k] = arr.flag;
                }
              })
            }else if($scope.selectedAll == false){
              $scope.tasklist.forEach(function (arr,i) {
                arr.flag = false;
                for(var k in $scope.isSelected){
                  $scope.isSelected[k] = arr.flag;
                }
              })
            }
          };
        }else{
          $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
        }
      });
      //驳回
      $scope.reject=function(){
        var txtinfo = "";
        $scope.selected = [];
        for(var i = 0 ; i < $scope.tasklist.length; i ++){
          if($scope.tasklist[i].flag){
            $scope.selected.push($scope.tasklist[i].custNo);
          }
        };
        if(!$scope.selected.length){
          $ionicLoading.show({template: '请选择你的要审核的企业!', noBackdrop: true, duration:1000});
          return false;
        }
        var popReject=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-rzaccept-newreject.html',
          scope:$scope
        });
        /*数据字典查询*/
        var promise = GetDictByNo.http('1000020',1,10);
        promise.then(
            function(res){
              console.log(res);
              if(res.code == '000000'){
                $scope.reason = res.data.list;
                /*判断是否选中*/
                $scope.selecheck = [];
                $scope.reason.forEach(function(arr,i){
                  arr.flag = false;
                  $scope.selecheck[i] = arr.flag;
                });
                $scope.checkone = function($index){
                  if($scope.selecheck[$index]){
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }else{
                    $scope.reason.forEach(function(arr,i){
                      arr.flag = false;
                      $scope.selecheck[i] = arr.flag;
                    });
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }
                }
              }else{
                popReject.close();
                $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
              }
            }
        );
        $scope.handle_cancel = function(){
          popReject.close();
        };
        $scope.handle_comfirm = function(){
          $scope.selecheck.forEach(function(arr,i){
            if(arr){txtinfo = $scope.reason[i].dataName}
          });
          if(!txtinfo || txtinfo == ""){
            $ionicLoading.show({template: '请选择驳回原因!', noBackdrop: true, duration:1000});
            return false;
          }
          var promise = Currentapprove.http('2',$scope.selected,txtinfo);
          promise.then(
              function(res){
                if(res.code == '000000'){
                  popReject.close();
                  $state.go('tab.usercheck-reject',{Count:$scope.selected.length})
                }else{
                  popReject.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
              }
          )
        };
      };
      //同意
      $scope.agree=function(){
        $scope.selected = [];
        for(var i = 0 ; i < $scope.tasklist.length; i ++){
          if($scope.tasklist[i].flag){
            $scope.selected.push($scope.tasklist[i].custNo);
          }
        }
        if(!$scope.selected.length){
          $ionicLoading.show({template: '请选择您要审核的企业!', noBackdrop: true, duration:1000});
          return false;
        };
        var popAgree=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-usercheck-reject.html',
          scope:$scope
        });
        $scope.giveout=function(){
          popAgree.close();
        };
        $scope.makesure=function(){
          Currentapprove.http('1',$scope.selected)
              .then(
              function(res){
                if(res.code == '000000'){
                  popAgree.close();
                  $state.go('tab.usercheck-success',{Count:$scope.selected.length})
                }else{
                  popAgree.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
              }
          );
        };
      };

  })
  // 企业审核 单笔
  .controller('UsercheckdanbiCtrl',function(ViewAttach,GetDictByNo,$ionicLoading,$interval,workgetSmsCode,Currentapprove,CurrentapproveDetail,ToolService,$stateParams,$scope,$ionicPopup,$state){
      var pid = "";
      pid = $stateParams.pid;
      $scope.cjs=ToolService;
      var promise = CurrentapproveDetail.http(pid);
      promise.then(
          function(res){
            if(res.code == '000000'){
              console.log(res);
              $scope.detail = res.data;
              $scope.imgUrl = {};
              /*获取图片信息*/
              $scope.detail.attachDivList.forEach(function(arr,i){
                /*ViewAttach.http(arr.id).then(
                    function(res){
                      if(res.code == '000000'){
                        console.log(res);
                        $scope.imgUrl.arr.attachDiv = res.data;
                      }else{
                        $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                      }
                    }
                )*/
                $scope.imgUrl.arr[i] = config.envPath + config.HttpInsertApis.viewAttach + '?id=' + arr;
              })
            }else{
              $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
            }
          }
      );
      //驳回
      $scope.reject=function(){
        var txtinfo = "";
        //$scope.selectMoneny = $scope.detail.disctAmt;
        var popReject=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-rzaccept-newreject.html',
          scope:$scope
        });
        /*数据字典查询*/
        var promise = GetDictByNo.http('1000020',1,10);
        promise.then(
            function(res){
              console.log(res);
              if(res.code == '000000'){
                $scope.reason = res.data.list;
                /*判断是否选中*/
                $scope.selecheck = [];
                $scope.reason.forEach(function(arr,i){
                  arr.flag = false;
                  $scope.selecheck[i] = arr.flag;
                });
                $scope.checkone = function($index){
                  if($scope.selecheck[$index]){
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }else{
                    $scope.reason.forEach(function(arr,i){
                      arr.flag = false;
                      $scope.selecheck[i] = arr.flag;
                    });
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }
                }
              }else{
                popReject.close();
                $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
              }
            }
        );
        $scope.handle_cancel = function(){
          popReject.close();
        };
        $scope.handle_comfirm = function(){
          $scope.selecheck.forEach(function(arr,i){
            if(arr){txtinfo = $scope.reason[i].dataName}
          });
          if(!txtinfo || txtinfo == ""){
            $ionicLoading.show({template: '请选择驳回原因!', noBackdrop: true, duration:1000});
            return false;
          }
          var promise =Currentapprove.http('2',[pid],txtinfo);
          promise.then(
              function(res){
                if(res.code == '000000'){
                  popReject.close();
                  $state.go('tab.usercheck-reject',{Count:1})
                }else{
                  popReject.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
              }
          )
        };
      };
      //同意
      $scope.agree=function(){
        //$scope.selectMoneny = $scope.detail.disctAmt;
        var popAgree=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-usercheck-reject.html',
          scope:$scope
        });
        $scope.giveout=function(){
          popAgree.close();
        };
        $scope.makesure=function(){
          Currentapprove.http('1',[pid])
              .then(
              function(res){
                if(res.code == '000000'){
                  popAgree.close();
                  $state.go('tab.usercheck-success',{Count:1})
                }else{
                  popAgree.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
              }
          );
        };
      };

  })
  // 企业审核 成功
  .controller('UserchecksucCtrl',function($scope,$ionicHistory,$stateParams,ToolService){
    var formState="";

      $scope.cjs = ToolService;

      $scope.formCount = $stateParams.Count;

    $scope.gohistory=function(){
      if(formState==="tab.usercheck-danbi"){
        $ionicHistory.goBack(-2);
      }else{
        $ionicHistory.goBack(-1);
      }
    };
    $scope.$on('$stateChangeSuccess', function (event, toState,toParams,from) {
      formState=from.name;
    });
  })

  //----用户管理员审核-----
  .controller('AdmincheckCtrl',function(config,QueryUserAudit,UserAudit,GetDictByNo,$ionicPopup,$state,$interval,workgetSmsCode,$scope,ToolService,$ionicLoading){
      $scope.cjs = ToolService;
      console.log('1111111111111');
      $scope.$on('$ionicView.enter',function(){
        $scope.loadData.doRefresh();
      });
      /*请求数据*/
      $scope.condition = {
        pages:0,
        pageSize :10,
        pageNum:1
      };
      $scope.loadData = {
        //初始化 loadType:null 默认刷新 1 加载
        init: function (loadType) {
          $scope.isLoadMore = true;
          QueryUserAudit.http($scope.condition).then(function (res) {// 成功回调
            $scope.getdata = res.data;
            $scope.condition.pages = Math.ceil($scope.getdata.list.total / $scope.condition.pageSize);
            if ($scope.condition.pages == $scope.condition.pageNum) {
              $scope.isLoadMore = false;
            }
            if(loadType === 1  && $scope.condition.pages >= $scope.condition.pageNum){
              var len = $scope.tasklist.length;
              /*拼接状态*/
              for (var i = 0; i < $scope.getdata.list.length; i++) {
                $scope.getdata.list[i].flag = false;
                $scope.isSelected[len + i] = $scope.getdata.list[i].flag;
              }
              $scope.tasklist = $scope.tasklist.concat($scope.getdata.list);
            } else {
              $scope.tasklist = $scope.getdata.list;
              //init，记录被选中的checkbox
              $scope.isSelected = {};
              for (var i = 0; i < $scope.tasklist.length; i++) {
                $scope.tasklist[i].flag = false;
                //初始化数据，使每个$scope.ischecked[index]都记录当前是否被选择
                $scope.isSelected[i] = $scope.tasklist[i].flag;
              }
              if($scope.tasklist.length === 0){
                $scope.isLoadMore = false;
              }
              $scope.$broadcast('scroll.refreshComplete');
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        },
        doRefresh: function () {
          $scope.condition.pageNum = 1;
          this.init();
        },
        loadMore: function (){
          if ($scope.tasklist !== undefined && $scope.tasklist.length !== 0) {
            $scope.condition.pageNum ++;
            this.init(1);
          }
        }
      };
      $scope.selectedAll = false ;
      /*单选*/
      $scope.selection = function($index){
        $scope.tasklist[$index].flag = !$scope.tasklist[$index].flag;
        $scope.isSelected[$index] = $scope.tasklist[$index].flag;
        var isCheckNum = 0;
        for (var i = 0; i < $scope.tasklist.length; i++) {
          if(!$scope.tasklist[i].flag){//如果有一个没有被选
            $scope.selectedAll = false;
          }else if($scope.tasklist[i].flag){//计数比较
            isCheckNum++
          }
        };
        if(isCheckNum == $scope.tasklist.length){//如果全部都被选
          $scope.selectedAll = true;
        }else{
          $scope.selectedAll = false;
        }
      };
      /*全选*/
      $scope.checkAll = function () { /*全选*/
        $scope.selectedAll = !$scope.selectedAll;
        if($scope.selectedAll == true){
          $scope.tasklist.forEach(function (arr,i) {
            arr.flag = true;
            for(var k in $scope.isSelected){
              $scope.isSelected[k] = arr.flag;
            }
          })
        }else if($scope.selectedAll == false){
          $scope.tasklist.forEach(function (arr,i) {
            arr.flag = false;
            for(var k in $scope.isSelected){
              $scope.isSelected[k] = arr.flag;
            }
          })
        }
      };
      //驳回
      $scope.reject=function(){
        var txtinfo = "";
        $scope.selected = [];
        for(var i = 0 ; i < $scope.tasklist.length; i ++){
          if($scope.tasklist[i].flag){
            $scope.selected.push($scope.tasklist[i].id);
          }
        };
        if(!$scope.selected.length){
          $ionicLoading.show({template: '请选择你的要审核的用户!', noBackdrop: true, duration:1000});
          return false;
        }
        var popReject=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-admincheck-newreject.html',
          scope:$scope
        });
        /*数据字典查询*/
        var promise = GetDictByNo.http('1000020',1,10);
        promise.then(
            function(res){
              console.log(res);
              if(res.code == '000000'){
                $scope.reason = res.data.list;
                /*判断是否选中*/
                $scope.selecheck = [];
                $scope.reason.forEach(function(arr,i){
                  arr.flag = false;
                  $scope.selecheck[i] = arr.flag;
                });
                $scope.checkone = function($index){
                  if($scope.selecheck[$index]){
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }else{
                    $scope.reason.forEach(function(arr,i){
                      arr.flag = false;
                      $scope.selecheck[i] = arr.flag;
                    });
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }
                }
              }else{
                popReject.close();
                $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
              }
            }
        );
        $scope.handle_cancel = function(){
          popReject.close();
        };
        $scope.handle_comfirm = function(){
          $scope.selecheck.forEach(function(arr,i){
            if(arr){txtinfo = $scope.reason[i].dataName}
          });
          if(!txtinfo || txtinfo == ""){
            $ionicLoading.show({template: '请选择驳回原因!', noBackdrop: true, duration:1000});
            return false;
          }
          var promise = UserAudit.http('2',$scope.selected,'',txtinfo);
          promise.then(
              function(res){
                if(res.code == '000000'){
                  popReject.close();
                  $state.go('tab.admincheck-reject',{Count:$scope.selected.length})
                }else{
                  popReject.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
              }
          )
        };
      };
      //同意
      $scope.agree=function(){
        var cint="";
        $scope.getmessageinfo="发送验证码";
        $scope.input={MsgCode:""};
        $scope.selected = [];
        for(var i = 0 ; i < $scope.tasklist.length; i ++){
          if($scope.tasklist[i].flag){
            $scope.selected.push($scope.tasklist[i].id);
          }
        }
        if(!$scope.selected.length){
          $ionicLoading.show({template: '请选择您要审核的用户!', noBackdrop: true, duration:1000});
          return false;
        };
        var popAgree=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-admincheck-agree.html',
          scope:$scope
        });
        $scope.getMsgcode = function(){
          if($scope.getmessageinfo=="发送验证码"){
            var promise = workgetSmsCode.getsmsCode("BD02");
            var smstime = config.smsTime;
            cint = $interval(function(){
              smstime--;
              $scope.getmessageinfo = smstime + 's';
              if(smstime<=0){
                $interval.cancel(cint);
                $scope.getmessageinfo="发送验证码";
              }
            },1000);
          }else{
            return;
          }
          /*获取短信验证码*/
        };
        $scope.giveout=function(){
          popAgree.close();
          $interval.cancel(cint);
        };
        $scope.makesure=function(){
          if($scope.input.MsgCode !== ''){
            UserAudit.http('1',$scope.selected,$scope.input.MsgCode).then(function(res){
                  if(res.code == '000000'){
                    $interval.cancel(cint);
                    popAgree.close();
                    $state.go('tab.admincheck-success',{Count:$scope.selected.length})
                  }else{
                    $interval.cancel(cint);
                    popAgree.close();
                    $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                  }
                }
            );
          }else{
            $ionicLoading.show({template:'请输入短信验证码!' , noBackdrop: true, duration:1000});
          }
        };
      };

  })
  // 用户审核 单笔
  .controller('AdmincheckdanbiCtrl',function(config,QueryUserAuditDetail,ViewAttach,UserAudit,GetDictByNo,$ionicLoading,$interval,workgetSmsCode,ToolService,$stateParams,$scope,$ionicPopup,$state){
      var pid = "";
      pid = $stateParams.pid;
      $scope.cjs=ToolService;
      var promise = QueryUserAuditDetail.http(pid);
      promise.then(
          function(res){
            if(res.code == '000000'){
              $scope.detail = res.data;
              $scope.imgUrl = {attachDiv:''};
              /*获取图片信息*/
              $scope.imgUrl.attachDiv = config.envPath + config.HttpInsertApis.viewAttach + '?id=' + $scope.detail.poaImg;
            }else{
              $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
            }
          }
      );
      //驳回
      $scope.reject=function(){
        var txtinfo = "";
        //$scope.selectMoneny = $scope.detail.disctAmt;
        var popReject=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-admincheck-newreject.html',
          scope:$scope
        });
        /*数据字典查询*/
        var promise = GetDictByNo.http('1000020',1,10);
        promise.then(
            function(res){
              console.log(res);
              if(res.code == '000000'){
                $scope.reason = res.data.list;
                /*判断是否选中*/
                $scope.selecheck = [];
                $scope.reason.forEach(function(arr,i){
                  arr.flag = false;
                  $scope.selecheck[i] = arr.flag;
                });
                $scope.checkone = function($index){
                  if($scope.selecheck[$index]){
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }else{
                    $scope.reason.forEach(function(arr,i){
                      arr.flag = false;
                      $scope.selecheck[i] = arr.flag;
                    });
                    $scope.reason[$index].flag = !$scope.reason[$index].flag;
                    $scope.selecheck[$index] = $scope.reason[$index].flag;
                  }
                }
              }else{
                popReject.close();
                $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
              }
            }
        );
        $scope.handle_cancel = function(){
          popReject.close();
        };
        $scope.handle_comfirm = function(){
          $scope.selecheck.forEach(function(arr,i){
            if(arr){txtinfo = $scope.reason[i].dataName}
          });
          if(!txtinfo || txtinfo == ""){
            $ionicLoading.show({template: '请选择驳回原因!', noBackdrop: true, duration:1000});
            return false;
          }
          var promise =UserAudit.http('2',[pid],'',txtinfo);
          promise.then(
              function(res){
                if(res.code == '000000'){
                  popReject.close();
                  $state.go('tab.admincheck-reject',{Count:1})
                }else{
                  popReject.close();
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
                }
              }
          )
        };
      };
      //同意
      $scope.agree=function(){
        var cint="";
        $scope.getmessageinfo="发送验证码";
        $scope.input={MsgCode:""};
        //$scope.selectMoneny = $scope.detail.disctAmt;
        var popAgree=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-admincheck-agree.html',
          scope:$scope
        });
        $scope.getMsgcode = function(){
          if($scope.getmessageinfo=="发送验证码"){
            var promise = workgetSmsCode.getsmsCode("BD02");
            var smstime = config.smsTime;
            cint = $interval(function(){
              smstime--;
              $scope.getmessageinfo = smstime + 's';
              if(smstime<=0){
                $interval.cancel(cint);
                $scope.getmessageinfo="发送验证码";
              }
            },1000);
          }else{
            return;
          }
          /*获取短信验证码*/
        };
        $scope.giveout=function(){
          popAgree.close();
          $interval.cancel(cint);
        };
        $scope.makesure=function(){
          if($scope.input.MsgCode !== ''){
            UserAudit.http('1',pid,$scope.input.MsgCode).then(function(res){
              if(res.code == '000000'){
                $interval.cancel(cint);
                popAgree.close();
                $state.go('tab.admincheck-success',{Count:$scope.selected.length})
              }else{
                $interval.cancel(cint);
                popAgree.close();
                $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
              }
            })
          }else{
            $ionicLoading.show({template:'请输入短信验证码!' , noBackdrop: true, duration:1000});
          }
        };
      };

    })
  // 用户审核 成功
  .controller('AdminchecksucCtrl',function($scope,$ionicHistory,$stateParams,ToolService){
      var formState="";

      $scope.cjs = ToolService;

      $scope.formCount = $stateParams.Count;

      $scope.gohistory=function(){
        if(formState==="tab.usercheck-danbi"){
          $ionicHistory.goBack(-2);
        }else{
          $ionicHistory.goBack(-1);
        }
      };
      $scope.$on('$stateChangeSuccess', function (event, toState,toParams,from) {
        formState=from.name;
      });
    })
;
