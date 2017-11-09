/**
 * Created by haibo on 2017/8/12.
 */
 /* 我的版块控制 */
 angular.module('zxscf.controllers.mine', [])
 /*个人信息*/
 .controller('MineCtrl', function ($scope,getUserMsg1,LoginOut,$state,$location){
      //user center
      $scope.$on('$ionicView.enter', function () {
       getUserMsg1.http().then(function (res) {
        console.log(res);
        $scope.getUserInfo = res.data;
      });
     });
      

      //退出登录
      $scope.loginout = function(){
        LoginOut.http().then(function(res){
          if(res.code == '000000'){
            window.localStorage.clear();

            //$state.go('login');
            $location.path('/login')
          }
        })
      };

      $scope.$on('$ionicView.beforeEnter', function() {

        if(!window.localStorage.isLogin){
          $state.go('login')
        }
      });

    })


  //-----历史任务
  /*1.融资受理*/
  .controller('RzaccepthistCtrl',function($scope,ToolService,QueryhistoryTask,$ionicLoading){
    var bussType = '03'; /*业务类型*/
    var clstate = true; /*目前排序状态*/
    var pageNum = 1;    /*记录当前页数*/
    var hasMore = true;/*是否有更多消息*/
    $scope.byT = true;
    $scope.byM = true;
    $scope.cjs = ToolService;

    /* 加载历史任务查询页面 */
    var load = function(bussType,condition,pageNum,pageSize){
      QueryhistoryTask.http(bussType,condition,pageNum,pageSize).then(
        function(res){
          if(res.code == '000000'){
            if(pageNum == 1){
              $scope.histList = res.data.list;
              if($scope.histList.length < 10){
                hasMore = false;
              }
            }
            if(pageNum > 1){
              $scope.histList = $scope.histList.concat(res.data.list);
              $scope.$broadcast('scroll.infiniteScrollComplete');
              if(res.data.list.length < 10){
                hasMore = false;
              }
            }
          }
        }
        )
    };

    /*页面初次加载*/
    $scope.$on('$ionicView.enter',function(){
      $scope.histList = load(bussType,'01',1);
    });
    /*下拉加载更多*/
    var doloadMore = function(clstate,pageNum,bussType){
      console.log(pageNum);
      if(clstate){
        if($scope.byT){
          load(bussType,'02',pageNum);
        }else{
          load(bussType,'01',pageNum);
        }
      }else{
        if($scope.byM){
          load(bussType,'04',pageNum);
        }else{
          load(bussType,'03',pageNum);
        }
      }
    };
    $scope.loadMore = function(){
      if(!hasMore){
        $ionicLoading.show({template: '没有更多数据啦!', noBackdrop: true, duration:500});
        return ; /*没有更多数据，返回*/
      }
      pageNum++;
      doloadMore(clstate,pageNum,bussType)
    };
    /*点击按时间排序*/
    $scope.oByT = function(){
      clstate = true;
      pageNum = 1;
      $scope.byT = !$scope.byT;
      if($scope.byT){
        load(bussType,'01',1);
      }else{
        load(bussType,'02',1);
      }
    };
    /*点击按金额排序*/
    $scope.oByM = function(){
      clstate = false;
      pageNum = 1;
      $scope.byM = !$scope.byM;
      if($scope.byM){
        load(bussType,'04',1);
      }else{
        load(bussType,'03',1);
      }
    };

  })
  /*2.融资审核*/
  .controller('RzcheckhistCtrl',function($scope,ToolService,QueryhistoryTask,$ionicLoading){
    var bussType = '04'; /*业务类型*/
    var clstate = true; /*目前排序状态*/
    var pageNum = 1;
    var hasMore = true;/*是否有更多消息*/
    $scope.byT = true;
    $scope.byM = true;
    $scope.cjs = ToolService;


    /* 加载历史任务查询页面 */
    var load = function(bussType,condition,pageNum,pageSize){
      QueryhistoryTask.http(bussType,condition,pageNum,pageSize).then(
        function(res){
          if(res.code == '000000'){
            if(pageNum == 1){
              $scope.histList = res.data.list;
              if($scope.histList.length < 10){
                hasMore = false;
              }
            }
            if(pageNum > 1){
              $scope.histList = $scope.histList.concat(res.data.list);
              $scope.$broadcast('scroll.infiniteScrollComplete');
              if(res.data.list.length < 10){
                hasMore = false;
                    //$ionicLoading.show({template: '没有更多数据啦!', noBackdrop: true, duration:500});
                  }
                }
              }
            }
            )
    };

    /*页面初次加载*/
    $scope.$on('$ionicView.enter',function(){
      $scope.histList = load(bussType,'01',1);
    });
    /*下拉加载更多*/
    var doloadMore = function(clstate,pageNum,bussType){
      if(clstate){
        if($scope.byT){
          load(bussType,'02',pageNum);
        }else{
          load(bussType,'01',pageNum);
        }
      }else{
        if($scope.byM){
          load(bussType,'04',pageNum);
        }else{
          load(bussType,'03',pageNum);
        }
      }
    };
    $scope.loadMore = function(){
      if(!hasMore){
        $ionicLoading.show({template: '没有更多数据啦!', noBackdrop: true, duration:500});
        return ; /*没有更多数据，返回*/
      }
      pageNum++;
      doloadMore(clstate,pageNum,bussType)
    };
    /*点击按时间排序*/
    $scope.oByT = function(){
      clstate = true;
      pageNum = 1;
      $scope.byT = !$scope.byT;
      if($scope.byT){
        load(bussType,'01',1);
      }else{
        load(bussType,'02',1);
      }
    };
    /*点击按金额排序*/
    $scope.oByM = function(){
      clstate = false;
      pageNum = 1;
      $scope.byM = !$scope.byM;
      if($scope.byM){
        load(bussType,'04',1);
      }else{
        load(bussType,'03',1);
      }
    };
  })
  /*3.付款审核*/
  .controller('PaycheckhistCtrl',function($ionicLoading,QpayhistoryTask,$scope,ToolService){
    var clstate = true; /*目前排序状态*/
    var pageNum = 1;
    var hasMore = true;/*是否有更多消息*/
    $scope.byT = true;
    $scope.byM = true;
    $scope.cjs = ToolService;

    /* 加载历史任务查询页面 */
    var load = function(condition,pageNum,pageSize){
      QpayhistoryTask.http(condition,pageNum,pageSize).then(
        function(res){
          if(res.code == '000000'){
            if(pageNum == 1){
              $scope.histList = res.data.list;
              if($scope.histList.length < 10){
                hasMore = false;
              }
            }
            if(pageNum > 1){
              $scope.histList = $scope.histList.concat(res.data.list);
              $scope.$broadcast('scroll.infiniteScrollComplete');
              if(res.data.list.length < 10){
                hasMore = false;
                    //$ionicLoading.show({template: '没有更多数据啦!', noBackdrop: true, duration:500});
                  }
                }
              }
            }
            )
    };

    /*页面初次加载*/
    $scope.$on('$ionicView.enter',function(){
      $scope.histList = load('01',1);
    });
    /*下拉加载更多*/
    var doloadMore = function(clstate,pageNum){
      if(clstate){
        if($scope.byT){
          load('02',pageNum);
        }else{
          load('01',pageNum);
        }
      }else{
        if($scope.byM){
          load('04',pageNum);
        }else{
          load('03',pageNum);
        }
      }
    };
    $scope.loadMore = function(){
      if(!hasMore){
        $ionicLoading.show({template: '没有更多数据啦!', noBackdrop: true, duration:500});
        return ; /*没有更多数据，返回*/
      }
      pageNum++;
      doloadMore(clstate,pageNum)
    };
    /*点击按时间排序*/
    $scope.oByT = function(){
      clstate = true;
      pageNum = 1;
      $scope.byT = !$scope.byT;
      if($scope.byT){
        load('01',1);
      }else{
        load('02',1);
      }
    };
    /*点击按金额排序*/
    $scope.oByM = function(){
      clstate = false;
      pageNum = 1;
      $scope.byM = !$scope.byM;
      if($scope.byM){
        load('04',1);
      }else{
        load('03',1);
      }
    };


  })
  /*4.风控审查*/
  .controller('RiskreviewhistCtrl',function($scope,ToolService,QueryhistoryTask,$ionicLoading){
    var bussType = '05'; /*业务类型*/
    var clstate = true; /*目前排序状态*/
    var pageNum = 1;
    var hasMore = true;/*是否有更多消息*/
    $scope.byT = true;
    $scope.byM = true;
    $scope.cjs = ToolService;


    /* 加载历史任务查询页面 */
    var load = function(bussType,condition,pageNum,pageSize){
      QueryhistoryTask.http(bussType,condition,pageNum,pageSize).then(
        function(res){
          if(res.code == '000000'){
            if(pageNum == 1){
              $scope.histList = res.data.list;
              if($scope.histList.length < 10){
                hasMore = false;
              }
            }
            if(pageNum > 1){
              $scope.histList = $scope.histList.concat(res.data.list);
              $scope.$broadcast('scroll.infiniteScrollComplete');
              if(res.data.list.length < 10){
                hasMore = false;
                    //$ionicLoading.show({template: '没有更多数据啦!', noBackdrop: true, duration:500});
                  }
                }
              }
            }
            )
    };

    /*页面初次加载*/
    $scope.$on('$ionicView.enter',function(){
      $scope.histList = load(bussType,'01',1);
    });
    /*下拉加载更多*/
    var doloadMore = function(clstate,pageNum,bussType){
      if(clstate){
        if($scope.byT){
          load(bussType,'02',pageNum);
        }else{
          load(bussType,'01',pageNum);
        }
      }else{
        if($scope.byM){
          load(bussType,'04',pageNum);
        }else{
          load(bussType,'03',pageNum);
        }
      }
    };
    $scope.loadMore = function(){
      if(!hasMore){
        $ionicLoading.show({template: '没有更多数据啦!', noBackdrop: true, duration:500});
        return ; /*没有更多数据，返回*/
      }
      pageNum++;
      doloadMore(clstate,pageNum,bussType)
    };
    /*点击按时间排序*/
    $scope.oByT = function(){
      clstate = true;
      pageNum = 1;
      $scope.byT = !$scope.byT;
      if($scope.byT){
        load(bussType,'01',1);
      }else{
        load(bussType,'02',1);
      }
    };
    /*点击按金额排序*/
    $scope.oByM = function(){
      clstate = false;
      pageNum = 1;
      $scope.byM = !$scope.byM;
      if($scope.byM){
        load(bussType,'04',1);
      }else{
        load(bussType,'03',1);
      }
    };
  })
  /*5.风控审核*/
  .controller('RiskcheckhistCtrl',function($scope,ToolService,QueryhistoryTask,$ionicLoading){
    var bussType = '06'; /*业务类型*/
    var clstate = true; /*目前排序状态*/
    var pageNum = 1;
    var hasMore = true;/*是否有更多消息*/
    $scope.byT = true;
    $scope.byM = true;
    $scope.cjs = ToolService;


    /* 加载历史任务查询页面 */
    var load = function(bussType,condition,pageNum,pageSize){
      QueryhistoryTask.http(bussType,condition,pageNum,pageSize).then(
        function(res){
          if(res.code == '000000'){
            if(pageNum == 1){
              $scope.histList = res.data.list;
              if($scope.histList.length < 10){
                hasMore = false;
              }
            }
            if(pageNum > 1){
              $scope.histList = $scope.histList.concat(res.data.list);
              $scope.$broadcast('scroll.infiniteScrollComplete');
              if(res.data.list.length < 10){
                hasMore = false;
                    //$ionicLoading.show({template: '没有更多数据啦!', noBackdrop: true, duration:500});
                  }
                }
              }
            }
            )
    };

    /*页面初次加载*/
    $scope.$on('$ionicView.enter',function(){
      $scope.histList = load(bussType,'01',1);
    });
    /*下拉加载更多*/
    var doloadMore = function(clstate,pageNum,bussType){
      if(clstate){
        if($scope.byT){
          load(bussType,'02',pageNum);
        }else{
          load(bussType,'01',pageNum);
        }
      }else{
        if($scope.byM){
          load(bussType,'04',pageNum);
        }else{
          load(bussType,'03',pageNum);
        }
      }
    };
    $scope.loadMore = function(){
      if(!hasMore){
        $ionicLoading.show({template: '没有更多数据啦!', noBackdrop: true, duration:500});
        return ; /*没有更多数据，返回*/
      }
      pageNum++;
      doloadMore(clstate,pageNum,bussType)
    };
    /*点击按时间排序*/
    $scope.oByT = function(){
      clstate = true;
      pageNum = 1;
      $scope.byT = !$scope.byT;
      if($scope.byT){
        load(bussType,'01',1);
      }else{
        load(bussType,'02',1);
      }
    };
    /*点击按金额排序*/
    $scope.oByM = function(){
      clstate = false;
      pageNum = 1;
      $scope.byM = !$scope.byM;
      if($scope.byM){
        load(bussType,'04',1);
      }else{
        load(bussType,'03',1);
      }
    };
  })
  /*6.融资审批*/
  .controller('RzapprovehistCtrl',function($scope,ToolService,QueryhistoryTask,$ionicLoading){
    var bussType = '07'; /*业务类型*/
    var clstate = true; /*目前排序状态*/
    var pageNum = 1;
    var hasMore = true;/*是否有更多消息*/
    $scope.byT = true;
    $scope.byM = true;
    $scope.cjs = ToolService;


    /* 加载历史任务查询页面 */
    var load = function(bussType,condition,pageNum,pageSize){
      QueryhistoryTask.http(bussType,condition,pageNum,pageSize).then(
        function(res){
          if(res.code == '000000'){
            if(pageNum == 1){
              $scope.histList = res.data.list;
              if($scope.histList.length < 10){
                hasMore = false;
              }
            }
            if(pageNum > 1){
              $scope.histList = $scope.histList.concat(res.data.list);
              $scope.$broadcast('scroll.infiniteScrollComplete');
              if(res.data.list.length < 10){
                hasMore = false;
                    //$ionicLoading.show({template: '没有更多数据啦!', noBackdrop: true, duration:500});
                  }
                }
              }
            }
            )
    };

    /*页面初次加载*/
    $scope.$on('$ionicView.enter',function(){
      $scope.histList = load(bussType,'01',1);
    });
    /*下拉加载更多*/
    var doloadMore = function(clstate,pageNum,bussType){
      if(clstate){
        if($scope.byT){
          load(bussType,'02',pageNum);
        }else{
          load(bussType,'01',pageNum);
        }
      }else{
        if($scope.byM){
          load(bussType,'04',pageNum);
        }else{
          load(bussType,'03',pageNum);
        }
      }
    };
    $scope.loadMore = function(){
      if(!hasMore){
        $ionicLoading.show({template: '没有更多数据啦!', noBackdrop: true, duration:500});
        return ; /*没有更多数据，返回*/
      }
      pageNum++;
      doloadMore(clstate,pageNum,bussType)
    };
    /*点击按时间排序*/
    $scope.oByT = function(){
      clstate = true;
      pageNum = 1;
      $scope.byT = !$scope.byT;
      if($scope.byT){
        load(bussType,'01',1);
      }else{
        load(bussType,'02',1);
      }
    };
    /*点击按金额排序*/
    $scope.oByM = function(){
      clstate = false;
      pageNum = 1;
      $scope.byM = !$scope.byM;
      if($scope.byM){
        load(bussType,'04',1);
      }else{
        load(bussType,'03',1);
      }
    };
  })
  /*7.计财审核*/
  .controller('FiscalcheckhistCtrl',function($scope,ToolService,QueryhistoryTask,$ionicLoading){
    var bussType = '08'; /*业务类型*/
    var clstate = true; /*目前排序状态*/
    var pageNum = 1;
    var hasMore = true;/*是否有更多消息*/
    $scope.byT = true;
    $scope.byM = true;
    $scope.cjs = ToolService;


    /* 加载历史任务查询页面 */
    var load = function(bussType,condition,pageNum,pageSize){
      QueryhistoryTask.http(bussType,condition,pageNum,pageSize).then(
        function(res){
          if(res.code == '000000'){
            if(pageNum == 1){
              $scope.histList = res.data.list;
              if($scope.histList.length < 10){
                hasMore = false;
              }
            }
            if(pageNum > 1){
              $scope.histList = $scope.histList.concat(res.data.list);
              $scope.$broadcast('scroll.infiniteScrollComplete');
              if(res.data.list.length < 10){
                hasMore = false;
                    //$ionicLoading.show({template: '没有更多数据啦!', noBackdrop: true, duration:500});
                  }
                }
              }
            }
            )
    };

    /*页面初次加载*/
    $scope.$on('$ionicView.enter',function(){
      $scope.histList = load(bussType,'01',1);
    });
    /*下拉加载更多*/
    var doloadMore = function(clstate,pageNum,bussType){
      pageNum++;
      if(clstate){
        if($scope.byT){
          load(bussType,'02',pageNum);
        }else{
          load(bussType,'01',pageNum);
        }
      }else{
        if($scope.byM){
          load(bussType,'04',pageNum);
        }else{
          load(bussType,'03',pageNum);
        }
      }
    };
    $scope.loadMore = function(){
      if(!hasMore){
        $ionicLoading.show({template: '没有更多数据啦!', noBackdrop: true, duration:500});
        return ; /*没有更多数据，返回*/
      }
      pageNum++;
      doloadMore(clstate,pageNum,bussType)
    };
    /*点击按时间排序*/
    $scope.oByT = function(){
      clstate = true;
      pageNum = 1;
      $scope.byT = !$scope.byT;
      if($scope.byT){
        load(bussType,'01',1);
      }else{
        load(bussType,'02',1);
      }
    };
    /*点击按金额排序*/
    $scope.oByM = function(){
      clstate = false;
      pageNum = 1;
      $scope.byM = !$scope.byM;
      if($scope.byM){
        load(bussType,'04',1);
      }else{
        load(bussType,'03',1);
      }
    };
  })
  /*8.用户审核*/
  .controller('UsercheckhistCtrl',function($scope,ToolService,QuserhistoryTask,$ionicLoading){
    var pageNum = 1;
    var hasMore = true;/*是否有更多消息*/
    $scope.cjs = ToolService;

    /* 加载历史任务查询页面 */
    var load = function(pageNum,pageSize){
      QuserhistoryTask.http(pageNum,pageSize).then(
        function(res){
          if(res.code == '000000'){
            if(pageNum == 1){
              $scope.histList = res.data.list;
              if($scope.histList.length < 10){
                hasMore = false;
              }
            }
            if(pageNum > 1){
              $scope.histList = $scope.histList.concat(res.data.list);
              $scope.$broadcast('scroll.infiniteScrollComplete');
              if(res.data.list.length < 10){
                hasMore = false;
                    //$ionicLoading.show({template: '没有更多数据啦!', noBackdrop: true, duration:500});
                  }
                }
              }
            }
            )
    };

    /*页面初次加载*/
    $scope.$on('$ionicView.enter',function(){
      $scope.histList = load(1,10);
    });
    /*下拉加载更多*/
    $scope.loadMore = function(){
      pageNum++;
      load(pageNum,pageSize);
    };

  })
  /*密码*/
 .controller('ResetPasswordCtrl', function (config,$scope,$ionicLoading,$interval,workgetSmsCode,ChangePassword,$ionicHistory) {
    $scope.oldPwd = {value:''};  //原始密码
    $scope.newPwd = {value:''};  //新密码
    $scope.newPwdMakeSure = {value:''};   //确认新密码
    $scope.msCode = {value:''};   //验证码
    //获取验证码
    $scope.getMessageInfo = '获取验证码';
    $scope.getCodeBtn = function () {
      // alert(1);
      //防止多次点击
      if($scope.getMessageInfo != '获取验证码'){
        return;
      }else{
        //获取验证码
        console.log(1);
        var promise = workgetSmsCode.getsmsCode("DL01");
        var count = config.smsTime;
        $scope.cint = $interval(function(){
          count--;
          $scope.getMessageInfo = count + 'S';
          if(count <= 0){
            $interval.cancel($scope.cint);
            $scope.getMessageInfo = "获取验证码";
          };
        },1000);
      }
    };
    //确定
    $scope.MakeSureBtn = function(){
      if($scope.oldPwd.value == ''){
        $ionicLoading.show({template: "原密码不能为空", noBackdrop: true, duration: 1000});
      }
      if($scope.newPwd.value == ''){
        $ionicLoading.show({template: "新密码不能为空", noBackdrop: true, duration: 1000});
      }
      if($scope.newPwdMakeSure.value == ''){
        $ionicLoading.show({template: "确认密码不能为空", noBackdrop: true, duration: 1000});
      }
      if($scope.msCode.value == ''){
        $ionicLoading.show({template: "验证码不能为空", noBackdrop: true, duration: 1000});
      }
      ChangePassword.http($scope.oldPwd.value,$scope.msCode.value,$scope.newPwd.value,$scope.newPwdMakeSure.value).then(function (res) {
        if(res.code === '000000'){
          $ionicLoading.show({template: "操作成功", noBackdrop: true, duration: 1000});
          $ionicHistory.goBack(-2);
        }else{
          $ionicLoading.show({template: "操作失败", noBackdrop: true, duration: 1000});
        }
      })
    }
  })
    //重置电话号码
      .controller('PhonenumberFirstStepCtrl', function (config,$scope,getUserMsg,workgetSmsCode,$interval,CheckMobile,$state,$ionicLoading) {
      console.log(2);
      getUserMsg.http().then(function (res) {
        console.log(res);
          // if(res.code === '000000'){
            $scope.mobile = res.data.mobile;
            $scope.msCode = {value:''};
            $scope.getMessageInfo = '发送验证码';
            $scope.getCodeBtn = function () {
              //防止多次点击
              if($scope.getMessageInfo != '发送验证码'){
                return;
              }else{
                //发送验证码
                var promise = workgetSmsCode.getsmsCode("MM04");
                var count = config.smsTime;
                $scope.cint = $interval(function(){
                  count--;
                  $scope.getMessageInfo = count + 'S';
                  if(count <= 0){
                    $interval.cancel($scope.cint);
                    $scope.getMessageInfo = "发送验证码";
                  };
                },1000);
              }
            };
            $scope.toNextStepBtn = function(){
              CheckMobile.http($scope.mobile,$scope.msCode.value,'MM04').then(function (res) {
                console.log(res);
                if(res.code === '000000'){
                  $ionicLoading.show({template: "身份校验成功", noBackdrop: true, duration: 1000});
                  $state.go('tab.accsecurity-phonenumber');
                }else{
                  $ionicLoading.show({template: "校验错误", noBackdrop: true, duration: 1000});
                }
                // $state.go('tab.accsecurity-phonenumber');

              })
            }
          // }

        })
    })

   //重置电话号码
  .controller('ResetPhoneNumberCtrl', function (config,$scope,$interval,$ionicLoading,$ionicHistory,PortalSysGetSmsCode,ChangeMobile) {
    $scope.mobile = {value:''};
    $scope.msCode = {value:''};
    $scope.getMessageInfo = '发送验证码';
    $scope.getCodeBtn = function () {
      if($scope.mobile.value == ''){
        $ionicLoading.show({template: "请输入手机号", noBackdrop: true, duration: 1000});
        return;
      };
      //防止多次点击
      if($scope.getMessageInfo != '发送验证码'){
        return;
      }else{
        //发送验证码
        var promise = PortalSysGetSmsCode.getsmsCode($scope.mobile.value,"MM04");
        var count = config.smsTime;
        $scope.cint = $interval(function(){
          count--;
          $scope.getMessageInfo = count + 'S';
          if(count <= 0){
            $interval.cancel($scope.cint);
            $scope.getMessageInfo = "发送验证码";
          };
        },1000);
      }
    };
    $scope.toNextStepBtn = function () {
      if($scope.mobile.value == '' || $scope.msCode.value == ''){
        $ionicLoading.show({template: "请输入验证码或者手机号", noBackdrop: true, duration: 1000});
        return;
      }
      ChangeMobile.http($scope.mobile.value,$scope.msCode.value,'MM04').then(function (res) {
        console.log(res);
        if(res.code === '000000'){
        $ionicLoading.show({template: "操作成功", noBackdrop: true, duration: 1000});
          $ionicHistory.goBack(-2);
        }
      })
    }
  })
  //关于版本
  .controller('VersionsCtrl',function($scope,config){
    $scope.version = config.appVersion;
  })
   ;
