/**
 * Created by haibo on 2017/8/12.
 */
/* 首页版块控制 */
angular.module('zxscf.controllers.home', [])
  .controller('HomeCtrl', function ($scope,tabHomeCorpList,jiaoyiliangHttp,SignTask,TxnTask,DisctTask,QueryMessages,ChangeCorp){


    //离开当前页设置
    $scope.$on('$ionicView.leave', function () {
      $scope.isActive = false;
    });

    $scope.$on('$ionicView.enter',function(){
      //获取localStorage--------
      var items =JSON.parse(window.localStorage.getItem('user'));
      console.log(items);
      //企业名称
      $scope.showCompany = items.custCnNm;
      $scope.isActive=false;
      //获取用户归属企业列表
      var promise = tabHomeCorpList.http();
      promise.then(function (res) {
        console.log(res)
        $scope.companysList = res.data.list;
        $scope.companysList.forEach(function (data,idx) {
          if(data.isLogin == '1'){
            $scope.showCompany = $scope.companysList[idx].custCnNm;
            $scope.company = {
              choose:$scope.companysList[idx].custNo
            }
          }
        });
      });
      //-----切换企业模态框
      $scope.show_companys = function(){
        if($scope.isActive){
          $scope.isActive = !$scope.isActive;
          var promise = ChangeCorp.http($scope.CompancustNo);
          promise.then(
            function(res){
              if(res.code == '000000'){
                items.custNo = $scope.CompancustNo;
                items.custCnNm = $scope.showCompany;
                var userData = JSON.stringify(items)
                window.localStorage.setItem('user',userData);
                AgainLoad();
              }
            }
          ).catch()
        }else{
          $scope.isActive = !$scope.isActive;
        }
      };
      $scope.query = function(){
        for (var i = 0; i < $scope.companysList.length; i++) {
          if($scope.companysList[i].custNo == $scope.company.choose){
            $scope.showCompany = $scope.companysList[i].custCnNm;
            $scope.CompancustNo = $scope.companysList[i].custNo;
          }
        }
      };
      AgainLoad()
    });

    /*首页数据加载*/
    var AgainLoad = function () {
      //交易量
      var promise = jiaoyiliangHttp.http();
      promise.then(function (res) {
        $scope.jiaoyiliangHttpData =  res.data;
      }).catch(function (err) {console.log('交易量获取失败')});
      //签收任务总数查询
      var signtotal=SignTask.signTask();
      signtotal.then(
        function(res){
          if(res.code=='000000'){
            $scope.signtasktotal=res.data.taskTotal;
          }
        }
      ).catch();
      //转让待复核任务总数查询
      var txntotal=TxnTask.txnTask();
      txntotal.then(
        function(res){
          if(res.code=='000000'){
            $scope.txntasktotal=res.data.taskTotal;
          }
        }
      ).catch();
      //融资待复核任务总数查询
      var discttotal=DisctTask.disctTask();
      discttotal.then(
        function(res){
          if(res.code=='000000'){
            $scope.discttasktotal=res.data.taskTotal;
          }
        }
      ).catch();
      //未读消息
      var messagetotal=QueryMessages.querymessage('0',1,'');
      messagetotal.then(
        function(res){
          if(res.code == '000000'){
            if(res.data.total){
              $scope.hasnews = true;
            }else{
              $scope.hasnews = false;
            }
            console.log($scope.hasnews)
          }
        }
      ).catch();
    }

  })

  // 系统消息 已读-未读
  .controller("SystemmessageCtrl",function($scope,QueryMessages,ToolService,$ionicLoading,MsgReadOpt,DelMessages){
    $scope.cmjs=ToolService;
    /*$scope.unreadmsgs="";
    $scope.readmsgs="";*/
    $scope.isCur=true; //已读未读消息切换
    $scope.isDel=false; //删除按钮显示隐藏
    $scope.choose="选择"; // 按钮文字
    var loadUnreadMsg=function(pageNum,pageSize){
      var readFlag='0';
      var unread=QueryMessages.querymessage(readFlag,pageNum,pageSize);
      unread.then(
        function(res){
          if(res.code=='000000'){
            $scope.unreadmsgs=res.data.list;
            if($scope.unreadmsgs != null){
              var length=$scope.unreadmsgs.length;
            }
            if(length){
              for(var i=0;i<length;i++){
                if($scope.unreadmsgs[i].bussType=='QS01'){$scope.unreadmsgs[i].imgUrl='./img/icon2.x/dingdan@2x.png'} //签收
                if($scope.unreadmsgs[i].bussType=='ZR01'){$scope.unreadmsgs[i].imgUrl='./img/icon2.x/zhuanrang3@2x.png'} //转让复核
                if($scope.unreadmsgs[i].bussType=='ZR02'){$scope.unreadmsgs[i].imgUrl='./img/icon2.x/zhuanrang3@2x.png'} //转让撤销复核
                if($scope.unreadmsgs[i].bussType=='RZ01'){$scope.unreadmsgs[i].imgUrl='./img/icon2.x/rongzi@2x.png'} //融资复核
                if($scope.unreadmsgs[i].bussType=='RZ02'){$scope.unreadmsgs[i].imgUrl='./img/icon2.x/rongzi@2x.png'} //融资撤销复核
                if($scope.unreadmsgs[i].bussType=='JF01'){$scope.unreadmsgs[i].imgUrl='./img/icon2.x/fukuan@2x.png'} //到期解付申请
                if($scope.unreadmsgs[i].bussType=='JF02'){$scope.unreadmsgs[i].imgUrl='./img/icon2.x/fukuan@2x.png'} //到期解付确认
                if($scope.unreadmsgs[i].bussType=='ZH01'){$scope.unreadmsgs[i].imgUrl='./img/icon2.x/zhanghu@2x.png'} //银行账户打款验证
                if($scope.unreadmsgs[i].bussType=='YH02'){$scope.unreadmsgs[i].imgUrl='./img/icon2.x/gongyingshang3@2x.png'} //用户详情
                if($scope.unreadmsgs[i].bussType=='YH03'){$scope.unreadmsgs[i].imgUrl='./img/icon2.x/mine3@2x.png'} //添加用户
                if($scope.unreadmsgs[i].bussType=='YH04'){$scope.unreadmsgs[i].imgUrl='./img/icon2.x/mine2@2x.png'} //修改用户
                if($scope.unreadmsgs[i].bussType=='XT')  {$scope.unreadmsgs[i].imgUrl='./img/icon2.x/setting.png'} //系统消息
              }

              $scope.ischeckedU = [];
              $scope.unreadmsgs.forEach(function(arr,i){
                arr.flag = false;
                $scope.ischeckedU[i] = arr.flag;
              });
              $scope.selectedAllU = false ;


            }
          }
        }
      ).catch();
    };
    var loadReadMsg=function(pageNum,pageSize){
      var readFlag='1';
      var read=QueryMessages.querymessage(readFlag,pageNum,pageSize);
      read.then(function(res){
          if(res.code=='000000'){
            $scope.readmsgs=res.data.list;
            if($scope.readmsgs != null){
              var length=$scope.readmsgs.length;
            }
            if(length){
              for(var i=0;i<length;i++){
                if($scope.readmsgs[i].bussType=='QS01'){$scope.readmsgs[i].imgUrl='./img/icon2.x/dingdan@2x.png'} //签收
                if($scope.readmsgs[i].bussType=='ZR01'){$scope.readmsgs[i].imgUrl='./img/icon2.x/zhuanrang3@2x.png'} //转让复核
                if($scope.readmsgs[i].bussType=='ZR02'){$scope.readmsgs[i].imgUrl='./img/icon2.x/zhuanrang3@2x.png'} //转让撤销复核
                if($scope.readmsgs[i].bussType=='RZ01'){$scope.readmsgs[i].imgUrl='./img/icon2.x/rongzi@2x.png'} //融资复核
                if($scope.readmsgs[i].bussType=='RZ02'){$scope.readmsgs[i].imgUrl='./img/icon2.x/rongzi@2x.png'} //融资撤销复核
                if($scope.readmsgs[i].bussType=='JF01'){$scope.readmsgs[i].imgUrl='./img/icon2.x/fukuan@2x.png'} //到期解付申请
                if($scope.readmsgs[i].bussType=='JF02'){$scope.readmsgs[i].imgUrl='./img/icon2.x/fukuan@2x.png'} //到期解付确认
                if($scope.readmsgs[i].bussType=='ZH01'){$scope.readmsgs[i].imgUrl='./img/icon2.x/zhanghu@2x.png'} //银行账户打款验证
                if($scope.readmsgs[i].bussType=='YH02'){$scope.readmsgs[i].imgUrl='./img/icon2.x/gongyingshang3@2x.png'} //用户详情
                if($scope.readmsgs[i].bussType=='YH03'){$scope.readmsgs[i].imgUrl='./img/icon2.x/mine3@2x.png'} //添加用户
                if($scope.readmsgs[i].bussType=='YH04'){$scope.readmsgs[i].imgUrl='./img/icon2.x/mine2@2x.png'} //修改用户
                if($scope.readmsgs[i].bussType=='XT')  {$scope.readmsgs[i].imgUrl='./img/icon2.x/setting.png'} //系统消息
              }


              $scope.ischeckedR = [];
              $scope.readmsgs.forEach(function(arr,i){
                arr.flag = false;
                $scope.ischeckedR[i] = arr.flag;
              });
              $scope.selectedAllR = false ;

            }
          }
        }
      ).catch();
    };
    //点击未读消息
    $scope.showUnreadmsg=function(){
      $scope.isCur=true;
    };
    //点击已读消息
    $scope.showReadmsg=function(){
      $scope.isCur=false;
    };
    //初次加载 未读消息加载；
    loadUnreadMsg(1);
    loadReadMsg(1);
    //点击选择按钮
    $scope.chooseMsg = function (){
      $scope.isDel = !$scope.isDel;
      if($scope.choose == "取消"){
        $scope.choose = "选择";
      }
      else{
        $scope.choose="取消";
      }
    };

    /*未读复选框点击事件*/
    $scope.Ucheckbtn = function ($index) {
      $scope.unreadmsgs[$index].flag = !$scope.unreadmsgs[$index].flag;
      $scope.ischeckedU[$index] = $scope.unreadmsgs[$index].flag;
      $scope.UCheckNum = 0;
      for (var i = 0; i < $scope.unreadmsgs.length; i++) {
        if (!$scope.unreadmsgs[i].flag) {
          $scope.checkedAll = false;
        } else if ($scope.unreadmsgs.flag) {
          $scope.UCheckNum++;
        }
      }
      if($scope.UCheckNum == $scope.unreadmsgs.length){
        $scope.selectedAllU = true ;
      }else{
        $scope.selectedAllU = false ;
      }
    };
    /*已读复选框点击事件*/
    $scope.Rcheckbtn = function ($index) {
      $scope.readmsgs[$index].flag = !$scope.readmsgs[$index].flag;
      $scope.ischeckedR[$index] = $scope.readmsgs[$index].flag;
      $scope.RCheckNum = 0;
      for (var i = 0; i < $scope.readmsgs.length; i++) {
        if (!$scope.readmsgs[i].flag) {
          $scope.checkedAll = false;
        } else if ($scope.readmsgs.flag) {
          $scope.RCheckNum++;
        }
      }
      if($scope.RCheckNum == $scope.readmsgs.length){
        $scope.selectedAllR = true ;
      }else{
        $scope.selectedAllR = false ;
      }
    };

    //全选
    $scope.doSomething=function(){
      console.log($scope.isCur)
      if($scope.isCur){    /*未读消息全选*/
        $scope.selectedAllU = !$scope.selectedAllU;
        if($scope.selectedAllU == false){
          $scope.unreadmsgs.forEach(function(arr,i){
            arr.flag = false;
            $scope.ischeckedU[i] = arr.flag;
          })
        }else if($scope.UCheckNumR != true){
          $scope.unreadmsgs.forEach(function(arr,i){
            arr.flag = true ;
            $scope.ischeckedU[i] = arr.flag;
          })
        }
      }else {            /*已读消息全选*/
        $scope.selectedAllR = !$scope.selectedAllR;
        if($scope.selectedAllR == false){
          if($scope.selectedAllU == false)
          $scope.readmsgs.forEach(function(arr,i){
            arr.flag = false;
            $scope.ischeckedR[i] = arr.flag;
          })
        }else if($scope.selectedAllR != true){
          $scope.readmsgs.forEach(function(arr,i){
            arr.flag = true ;
            $scope.ischeckedR[i] = arr.flag;
          })
        }
      }
    };

    //置为已读
    $scope.MarkerRd = function(){
      if($scope.isCur&&$scope.isDel){
        var selectedArr = [];
        for (var i = 0; i < $scope.ischeckedU.length; i++) {
          if($scope.ischeckedU[i]){
            selectedArr.push($scope.unreadmsgs[i].imId);
          }
        };
        if(!selectedArr.length){
          $ionicLoading.show({template: "请选择消息", noBackdrop: true, duration:1000})
          return;
        }
        var promise = MsgReadOpt.readopt(selectedArr);
        promise.then(
          function(res){
            if(res.code == '000000'){
              $ionicLoading.show({template: "消息已经标记为已读", noBackdrop: true, duration:1000});
              loadUnreadMsg(1);
            }
          }
        ).catch()
      }else{
        $ionicLoading.show({template: "该消息已经为已读", noBackdrop: true, duration:1000})
      }
    };

    //删除消息
    $scope.Updeleted = function(){
      var msglists = '',selectedArr = [];
      /*未读消息删除*/
      if($scope.isCur && $scope.isDel){
        msglists = $scope.unreadmsgs;
      }
      /*已读消息删除*/
      if(!$scope.isCur && $scope.isDel){
        msglists = $scope.readmsgs;
      }
      for (var i = 0; i < msglists.length; i++) {
        if(msglists[i].flag){
          selectedArr.push(msglists[i].imId);
        }
      };
      if(!selectedArr.length){
        return;
      }
      var promise = DelMessages.delmessages(selectedArr);
      promise.then(
        function(res){
          if(res.code == '000000'){
            $ionicLoading.show({template: "消息已删除成功", noBackdrop: true, duration:1500})
            loadUnreadMsg(1);
            loadReadMsg(1);
          }
        }
      ).catch()
    };

  })

  // 签收
  .controller('QianshouCtrl',function(GetDictByNo,$ionicLoading,$scope,$ionicPopup,$state,$interval,$rootScope,SignList,ToolService,Sign,getSmsCode,SignTask){

    $scope.qianshouTotal=0; //签收总额
    $scope.qianshouList=[]; //数据列表
    $scope.cjs=ToolService;
    $scope.hassign=true;  //全选框没有数据隐藏
    var promise=SignList.signList('1');
    promise.then(function(res){
      if(res.code=='000000'){
        console.log(res)
        $scope.qianshouList=res.data.lists;
        if(res.data.lists.list.length){
          $scope.hassign=true;$scope.qianshouTotal=res.data.sum
        }
        else{
          $scope.hassign=false;
        }

        $scope.isSelected = {};
        $scope.qianshouList.list.forEach(function(arr,i){
          arr.flag = false ;
          $scope.isSelected[i] = arr.flag;
        });
        $scope.selectedAll = false ;
        $scope.selection = function($index){
          $scope.qianshouList.list[$index].flag = !$scope.qianshouList.list[$index].flag;
          $scope.isSelected[$index] = $scope.qianshouList.list[$index].flag;
          var isCheckNum = 0;
          for (var i = 0; i < $scope.qianshouList.list.length; i++) {
            if(!$scope.qianshouList.list[i].flag){//如果有一个没有被选
              $scope.selectedAll = false;
            }else if($scope.qianshouList.list[i].flag){//计数比较
              isCheckNum++
            }
          }
          if(isCheckNum == $scope.qianshouList.list.length){//如果全部都被选
            $scope.selectedAll = true;
          }else{
            $scope.selectedAll = false;
          }
        };
        $scope.checkAll = function () { /*全选*/
          $scope.selectedAll = !$scope.selectedAll;
          if($scope.selectedAll == true){
            $scope.qianshouList.list.forEach(function (arr,i) {
              arr.flag = true;
              for(var k in $scope.isSelected){
                $scope.isSelected[k] = arr.flag;
              }
            })
          }else if($scope.selectedAll == false){
            $scope.qianshouList.list.forEach(function (arr,i) {
              arr.flag = false;
              for(var k in $scope.isSelected){
                $scope.isSelected[k] = arr.flag;
              }
            })
          }
        }
      }
    });

    // 点击事件 确认签收
    $scope.sign_in=function(){
      var cint="";   //定时器
      $scope.selected = [];
      $rootScope.qianshouXieyiLists = [];
      $scope.selectMoneny=0;
      $scope.getmessageinfo="发送验证码";
      $scope.input={MsgCode:"",isok:""};
      for(var i = 0 ; i < $scope.qianshouList.list.length; i ++){
        if($scope.qianshouList.list[i].flag){
          $scope.selected.push($scope.qianshouList.list[i].id);
          var obj = {};
          obj.id = $scope.qianshouList.list[i].id;
          obj.srcDrftNo = $scope.qianshouList.list[i].srcDrftNo;

          $rootScope.qianshouXieyiLists.push(obj);
          $scope.selectMoneny += $scope.qianshouList.list[i].txnAmt;
        }
      }
      if(!$scope.selected.length){
        $ionicLoading.show({template: '请选择你的宝眷!', noBackdrop: true, duration:1000});
        return false;
      }
      var popUp=$ionicPopup.show({
        cssClass:'my-popup',
        templateUrl:'template/popup-qianshou-comfirm.html',
        scope:$scope
      });
      $scope.getMsgcode=function(){
        if($scope.getmessageinfo=="发送验证码"){
          var promise = getSmsCode.getsmscode("QS01");
          var ss = 120 ;
          cint = $interval(function(){
            ss--;
            $scope.getmessageinfo=ss + "s";
            if(ss<=0){
              $interval.cancel(cint);
              $scope.getmessageinfo="发送验证码";
            }
          },1000);
        }else{
          return;
        }
      };
      $scope.handleOn=function(){
        if($scope.getmessageinfo>=0&&$scope.input.MsgCode!=""&&$scope.input.isok){
          var promiseSign=Sign.sign('1',$scope.selected,$scope.input.MsgCode);
          promiseSign.then(
            function(res){
              if(res.code =='000000'){
                $interval.cancel(cint);
                popUp.close();
                $state.go('tab.qianshouwangcheng',{Mon:$scope.selectMoneny,Count:$scope.selected.length});
              }
            }
          ).catch(function(err){
              popUp.close();
              $ionicLoading.show({template: err , noBackdrop: true, duration:1000})
            })
        }else if($scope.input.MsgCode = "" || $scope.input.MsgCode == undefined){
          $ionicLoading.show({template: '请填写输入短信验证码!', noBackdrop: true, duration:1000});
        }
      };
      $scope.handleOff=function(){
        $interval.cancel(cint);
        popUp.close();
      };
      //协议、通知书
      $scope.toQSXieYiFile = function () {
        console.log($rootScope.qianshouXieyiLists);
        if($rootScope.qianshouXieyiLists.length == 1 ){
          var id = $rootScope.qianshouXieyiLists[0].id;
          popUp.close();
          $rootScope.jumpto('tab.QianShouXieYi',{id:id});

        }else{
          popUp.close();
          $rootScope.jumpto('tab.QianShouXieYiList');

        }
      }
      $scope.toQSTongZhiFile = function () {
        console.log($rootScope.qianshouXieyiLists);
        if($rootScope.qianshouXieyiLists.length == 1 ){
          var id = $rootScope.qianshouXieyiLists[0].id;
          popUp.close();
          $rootScope.jumpto('tab.QianShouTongZhi',{id:id});

        }else{
          popUp.close();
          $rootScope.jumpto('tab.QianShouTongZhiList');

        }
      }
    };
    // 点击事件 驳回
    $scope.backup = function(){
      var txtinfo = "";
      $scope.selected = [];
      $scope.selectMoneny=0;
      for(var i = 0 ; i < $scope.qianshouList.list.length; i ++){
        if($scope.qianshouList.list[i].flag){
          $scope.selected.push($scope.qianshouList.list[i].id);
          $scope.selectMoneny += $scope.qianshouList.list[i].txnAmt;
        }
      }
      if(!$scope.selected.length){
        $ionicLoading.show({template: '请选择你的宝眷!', noBackdrop: true, duration:500});
        return false;
      }
      var popUp=$ionicPopup.show({
        cssClass:'my-popup',
        templateUrl:'template/popup-qianshou-newreject.html',
        scope:$scope
      });
      /*数据字典查询驳回原因*/
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
            }
          }
      );
      $scope.handle_cancel = function(){
        popUp.close();
      };
      $scope.handle_comfirm = function(){
        $scope.selecheck.forEach(function(arr,i){
          if(arr){txtinfo = $scope.reason[i].dataName}
        });
        if(!txtinfo || txtinfo == ""){
          $ionicLoading.show({template: '请选择驳回原因!', noBackdrop: true, duration:1000});
          return false;
        }
        var promise = Sign.sign('2',$scope.selected,'',txtinfo);
        promise.then(
            function(res){
              if(res.code == '000000'){
                popUp.close();
                $state.go('tab.qianshoumarksuccess',{Mon:$scope.selectMoneny,Count:$scope.selected.length})
              }
            }
        )
      }
    }
  })
  .controller('QianShouTongZhiCtrl', function ($scope,SignWaitSignDetail,$stateParams,ToolService) {
    SignWaitSignDetail.signdetail($stateParams.id).then(function (res) {
      console.log(res);
      $scope.tool = ToolService;
      $scope.QianShouDetails = res.data;
      var arr = $scope.QianShouDetails.txnDt.split('');
      $scope.year = arr[0]+arr[1]+arr[2]+arr[3];
      $scope.mon = arr[4]+arr[5];
      $scope.day = arr[6]+arr[7]
    })

  })
  .controller('QianShouTongZhiListCtrl', function ($scope,$rootScope) {
    $scope.fileLists = $rootScope.qianshouXieyiLists;
    $scope.toReadFileBtn = function (id) {
      $rootScope.jumpto('tab.QianShouTongZhi',{id:id});
    }
  })
  .controller('QianShouXieYiCtrl', function ($scope,$stateParams,SignWaitSignDetail,ToolService) {
    SignWaitSignDetail.signdetail($stateParams.id).then(function (res) {
      console.log(res);
      $scope.tool = ToolService;
      $scope.QianShouDetails = res.data;
      $scope.reqInfo = $scope.QianShouDetails.reqInfo;
      $scope.rcvInfo = $scope.QianShouDetails.rcvInfo
    })
  })
  .controller('QianShouXieYiListCtrl', function ($scope,$rootScope) {
    $scope.fileLists = $rootScope.qianshouXieyiLists || $rootScope.ReadFileList;
    $scope.toReadFileBtn = function (id) {
      $rootScope.jumpto('tab.QianShouXieYi',{id:id});
    }
  })
  // 签收单
  .controller('QianshoudanbiCtrl',function(GetDictByNo,$rootScope,$ionicLoading,$scope,$ionicPopup,$state,ToolService,SignWaitSignDetail,$stateParams,SignDetail,getSmsCode,$interval){

    var pid="";  //接受参数
    pid=$stateParams.sid;
    $scope.cjs=ToolService;
    console.log($stateParams);
    var promise=SignWaitSignDetail.signdetail(pid);
    promise.then(function(res){
      console.log(res);
      if(res.code=='000000'){
        $scope.detailList=res.data;
      }
    });

    // 点击事件 确认签收
    $scope.sign_in=function() {
      var cint = "";
      $scope.getmessageinfo = "发送验证码";
      $scope.input = {MsgCode: "", isok: ""};
      var popUp = $ionicPopup.show({
        cssClass: 'my-popup',
        templateUrl: 'template/popup-qianshou-comfirm.html',
        scope: $scope
      });
      $scope.getMsgcode = function () {
        if ($scope.getmessageinfo == "发送验证码") {
          var promise = getSmsCode.getsmscode("QS01");
          var ss = 120;
          cint = $interval(function () {
            ss--;
            $scope.getmessageinfo = ss + 's';
            if (ss <= 0) {
              $interval.cancel(cint);
              $scope.getmessageinfo = "发送验证码";
            }
          }, 1000);
        } else {
          return;
        }
      };
      $scope.handleOn = function () {
        if ($scope.getmessageinfo >= 0 && $scope.input.MsgCode != "" && $scope.input.isok) {
          var promiseSign = Sign.sign('1', $scope.detailList.id, $scope.input.MsgCode);
          promiseSign.then(
            function (res) {
              if (res.code = '000000') {
                $interval.cancel(cint);
                popUp.close();
                $state.go('tab.qianshouwangcheng', {Mon: $scope.detailList.txnAmt, count: 1});
              }
            }
          ).catch(function (err) {
              popUp.close();
              $ionicLoading.show({template: err, noBackdrop: true, duration: 1000});
            })
        } else if ($scope.input.MsgCode = "" || $scope.input.MsgCode == undefined) {
          $ionicLoading.show({template: '请填写输入短信验证码!', noBackdrop: true, duration: 1000});
        }
      };
      $scope.handleOff = function () {
        $interval.cancel(cint);
        popUp.close();
      };
      //协议通知
      $scope.toQSXieYiFile = function () {
        popUp.close();
        $rootScope.jumpto('tab.QianShouXieYi', {id: pid});
        $rootScope.jumpto('tab.QianShouXieYi', {id: pid});
      }
      $scope.toQSTongZhiFile = function () {
        popUp.close();
        $rootScope.jumpto('tab.QianShouTongZhi', {id: pid});
      };
    }
    // 点击事件 驳回
    $scope.backup = function(){
      var txtinfo = "";
      var popUp=$ionicPopup.show({
        cssClass:'my-mark',
        templateUrl:'template/popup-qianshou-newreject.html',
        scope:$scope
      });
      /*数据字典查询驳回原因*/
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
            }
          }
      );
      $scope.handle_cancel = function(){
        popUp.close();
      };
      $scope.handle_comfirm = function(){
        $scope.selecheck.forEach(function(arr,i){
          if(arr){txtinfo = $scope.reason[i].dataName}
        });
        if(!txtinfo || txtinfo == ""){
          $ionicLoading.show({template: '请选择驳回原因!', noBackdrop: true, duration:1000});
          return false;
        }
        var promise = Sign.sign('2',$scope.selected,'',txtinfo);
        promise.then(
            function(res){
              if(res.code == '000000'){
                popUp.close();
                $state.go('tab.qianshoumarksuccess',{Mon:$scope.detailList.txnAmt,Count:1})
              }
            }
        )
      }
    }
  })

     // 确认签收成功
    .controller('QiangshouSuccCtrl',function($scope,$state,$ionicHistory,$stateParams,ToolService){
      $scope.cjs = ToolService;
      var formState="";
      $scope.formCount = $stateParams.Count;
      $scope.formMoneny = $stateParams.Mon;
      //融资成功返回
      $scope.qsGoBack=function(){
        // 判断由来
        if(formState==="tab.qianshou-danbi"){
          $ionicHistory.goBack(-2);
        }else{
          $ionicHistory.goBack(-1);
        }
      };
      $scope.$on('$stateChangeSuccess', function (event, toState,toParams,from) {
        formState=from.name;
      });
    })

  // 签收历史记录
  .controller('QianshouhistoryCtrl',function($scope,$state,QuerySignHisList,ToolService){
    $scope.signhistoryAll=0;
    $scope.cjs = ToolService;
    var promise = QuerySignHisList.getsignhislist('1');
    promise.then(function(res){
        console.log(res);
        if(res.code=='000000'){
          $scope.signhisList=res.data.list;
          //签收历史跳转筛选
          $scope.chojump=function(signstate,signID){
            if(signstate == "0"){
              $state.go('tab.qianshoudetailok',{signID:signID});
            };

            //if(signstate=="12"){
            //
            //  $state.go('tab.qianshoudetailerr',{signID:signID});
            //};
          };
        };
      });
  })

  // 签收历史详情(已签收)
  .controller('QsdetailokCtrl',function($scope,$stateParams,SignDetail,ToolService,TxnDownload,QueryTranCert,$rootScope,$http,$state){
    $scope.cjs=ToolService;
    var signID='';
    signID=$stateParams.signID;
    var promise = SignDetail.signdetail(signID);
    promise.then(function(res){
        console.log(res);
        if(res.code=='000000'){
          $scope.signOK=res.data;
          //协议、通知书、凭证
          var appNo = $scope.signOK.appNo;
          var bussType = '20';

          var tnCode = '2';
          var FileDownload = $rootScope.FileDownload;
          $scope.toZRXieYi = function () {
            var fileType = 'MB05';
            console.log(appNo, bussType, fileType, tnCode);
            FileDownload(appNo,bussType,fileType,tnCode);
            //$state.go('tab.QianShouZRXieYi');
          }
          $scope.toZRPingZheng = function () {
            console.log('转让凭证未测');
            //$state.go('tab.QianShouZRPingZheng');
          }
          $scope.toZRTongZhi = function () {
            var fileType = 'MB06';
            console.log(appNo, bussType, fileType, tnCode);
            FileDownload(appNo,bussType,fileType,tnCode);
            //$state.go('tab.QianShouZRTongZhi');
          }
          $scope.toKaiLiXieYi = function () {
            var fileType = 'MB04';
            bussType = '10';
            console.log(appNo, bussType, fileType, tnCode);
            FileDownload(appNo,bussType,fileType,tnCode);
            //$state.go('tab.QianShouZRXieYi');
          }
        }
      }
    );

    $scope.certificate = function(){

      var promise = QueryTranCert.http('1');
      promise.then(function(res){
        console.log(res);
        //$scope.appNo = res.list.appNo;
        });

      //TxnDownload.http('200220171009000092').then(function(res){
      //  $scope.imgdate = res.data;
      //  console.log(res)
      //})
      //$http({
      //  method:'get',
      //  url:'/esif-webapp/certificates/txnDownload?appNo='+200220171009000092,
      //
      //}).then(function (res) {
      //  console.log(res);
      //})
    };


  })
  .controller('QianShouZRPingZheng',function($scope,$cordovaToast){
    // 好友分享
    $scope.wxfShare=function(){
      wxShare(Wechat.Scene.SESSION);
    }
    // 朋友圈分享
    //$scope.wxqShare=function(){
    //  wxShare(Wechat.Scene.TIMELIN);
    //}

    function wxShare(scene){
      var shareInfo={
        title:"签收凭证分享", // 分享标题
        desc:"别怕，擎天柱在测试",  // 分享描述信息
        icon:"",  // 分享图标（网络地址的图标）
        url:"http://www.baidu.com"    // 分享路径
      };
      Wechat.share({
        message: {
          title: shareInfo.title,
          description: shareInfo.desc,
          thumb: shareInfo.icon,
          media: {
            type: Wechat.Type.WEBPAGE,
            webpageUrl: shareInfo.url
          }
        },
        scene: scene
      }, function () {
        $cordovaToast.showShortCenter('分享成功~');
      }, function (reason) {
        if (reason === "未安装微信") {
          $cordovaToast.showShortCenter(reason);
        }
      });
    };
  })

  // 签收历史详情(已驳回)
  .controller('QsdetailerrCtrl',function($scope,$stateParams,SignDetail){
    var signID='';
    signID=$stateParams.sid[0];
    var promise = SignDetail.signdetail(signID);
    promise.then(
      function(res){
        if(res.code=='000000'){
          $scope.signErr=res.data;
        }
      }
    ).catch()
  })

  // 转让复核
  .controller('ZrangcheckCtrl',function(GetDictByNo,$ionicLoading,$scope,$ionicPopup,$state,TxnApproveList,$rootScope,ToolService,getSmsCode,TxnApprove,$interval){
    $scope.cjs=ToolService;
    $scope.trfTotal=0;
    $scope.revTotal=0;
    $scope.isCur=true; // 转让复核和转让撤销待复核 显示切换
    $scope.zrtrfList=[]; //数据列表
    $scope.zrrevList=[]; //数据列表
    $scope.haszrtrf=false;  //全选框没有数据隐藏
    $scope.haszrrev=false;  //全选框没有数据隐藏

    $scope.showcheck=function(){             //-转让复核
      $scope.isCur=true;
      var promisetrf=TxnApproveList.gettxnapprlist('01',1);
      promisetrf.then(function(res){
        if(res.code=='000000'){
          console.log(res);
          $scope.zrtrfList=res.data.lists;
          $scope.trfTotal=res.data.sum;
          if($scope.zrtrfList.list.length){$scope.haszrtrf=true;}else{$scope.haszrtrf=false;};


          $scope.ischeckedtrf = {};
          $scope.zrtrfList.list.forEach(function (arr,i) {
            arr.flag = false;
            //初始化数据，使每个$scope.ischecked[index]都记录当前是否被选择
            $scope.ischeckedtrf[i] = arr.flag;
          });
          $scope.trfallCheck = false;
          $scope.trfSelection = function ($index) {
            //判断哪个被点中
            $scope.zrtrfList.list[$index].flag = !$scope.zrtrfList.list[$index].flag;
            $scope.ischeckedtrf[$index] = $scope.zrtrfList.list[$index].flag;
            var isCheckNum = 0;
            for (var i = 0; i < $scope.zrtrfList.list.length; i++) {
              if(!$scope.zrtrfList.list[i].flag){//如果有一个没有被选
                $scope.trfallCheck = false;
              }else if($scope.zrtrfList.list[i].flag){//计数比较
                isCheckNum++
              }
            }
            if(isCheckNum == $scope.zrtrfList.list.length){//如果全部都被选
              $scope.trfallCheck = true;
            }else{
              $scope.trfallCheck = false;
            }
          };
          $scope.checkAlltrf = function () { /*全选*/
            $scope.trfallCheck = !$scope.trfallCheck;
            if($scope.trfallCheck == true){
              $scope.zrtrfList.list.forEach(function (arr,i) {
                arr.flag = true;
                for(var k in $scope.ischeckedtrf){
                  $scope.ischeckedtrf[k] = arr.flag;
                }
              })
            }else if($scope.trfallCheck == false){
              $scope.zrtrfList.list.forEach(function (arr,i) {
                arr.flag = false;
                for(var k in $scope.ischeckedtrf){
                  $scope.ischeckedtrf[k] = arr.flag;
                }
              })
            }
          }
        }
      }).catch()
    };
    $scope.showcheck();  //@进入页面执行
    $scope.showrevocation=function(){      //-转让撤销待复核
      $scope.isCur=false;
      var promiserev=TxnApproveList.gettxnapprlist('02',1);
      promiserev.then(function(res){
        if(res.code=='000000'){
          console.log(res);
          $scope.zrrevList=res.data.lists;
          $scope.revTotal=res.data.sum;
          if($scope.zrrevList.list.length){$scope.haszrrev=true;}else{$scope.haszrrev=false;};

          $scope.ischeckedrev = {};
          $scope.zrrevList.list.forEach(function (arr,i) {
            arr.flag = false;
            //初始化数据，使每个$scope.ischecked[index]都记录当前是否被选择
            $scope.ischeckedrev[i] = arr.flag;
          });
          $scope.revallCheck = false;
          $scope.revSelection = function ($index) {
            //判断哪个被点中
            $scope.zrrevList.list[$index].flag = !$scope.zrrevList.list[$index].flag;
            $scope.ischeckedrev[$index] = $scope.zrrevList.list[$index].flag;
            var isCheckNum = 0;
            for (var i = 0; i < $scope.zrrevList.list.length; i++) {
              if(!$scope.zrrevList.list[i].flag){//如果有一个没有被选
                $scope.revallCheck = false;
              }else if($scope.zrrevList.list[i].flag){//计数比较
                isCheckNum++
              }
            }
            if(isCheckNum == $scope.zrrevList.list.length){//如果全部都被选
              $scope.revallCheck = true;
            }else{
              $scope.revallCheck = false;
            }
          };
          $scope.checkAllrev = function () { /*全选*/
            $scope.revallCheck = !$scope.revallCheck;
            if($scope.revallCheck == true){
              $scope.zrrevList.list.forEach(function (arr,i) {
                arr.flag = true;
                for(var k in $scope.ischeckedrev){
                  $scope.ischeckedrev[k] = arr.flag;
                }
              })
            }else if($scope.revallCheck == false){
              $scope.zrrevList.list.forEach(function (arr,i) {
                arr.flag = false;
                for(var k in $scope.ischeckedrev){
                  $scope.ischeckedrev[k] = arr.flag;
                }
              })
            }
          }

        }
      }).catch()
    };


    // 确认复核
    $scope.zrcheck=function(){

      $scope.input={MsgCode:"",isok:""}; //用户输入的短信验证码&是否同意
      $scope.getmessageinfo="发送验证码";
      var trfcint="";       //定时器
      var revcint="";       //定时器

      if($scope.isCur){ /*转让待复核*/

        $scope.selectedtrf = [];

        $scope.selectMoneny=0;
        for (var i = 0; i < $scope.zrtrfList.list.length; i++) {
          if($scope.zrtrfList.list[i].flag){
            var obj = {};
            obj.id = $scope.zrtrfList.list[i].id;
            obj.srcDrftNo = $scope.zrtrfList.list[i].srcDrftNo;
            $scope.selectedtrf.push(obj);
            $scope.selectMoneny += $scope.zrtrfList.list[i].txnAmt;
          }
        };
        $rootScope.ReadFileList = $scope.selectedtrf;

        if(!$scope.selectedtrf.length){
          $ionicLoading.show({template: '请选择你的宝眷!', noBackdrop: true, duration:1000});
          return;
        }
        $scope.reCheck = '复核';

        var popUp=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-zhuangrang-comfirm.html',
          scope:$scope
        });
        $scope.getMsgcode=function(){
          if($scope.getmessageinfo=="发送验证码"){
            var promise = getSmsCode.getsmscode("ZR02");
            var ss = 120;
            trfcint = $interval(function(){
              ss--;
              $scope.getmessageinfo=ss + 's';
              if(ss<=0){
                $interval.cancel(trfcint);
                $scope.getmessageinfo="发送验证码";
              }
            },1000);
          }else{
            return;
          }
        };
        $scope.handleOn=function(){
          if($scope.getmessageinfo>=0&&$scope.input.MsgCode!=""&&$scope.input.isok){
            var promiseSign=TxnApprove.txnapprove('01','1',$scope.input.MsgCode,$scope.selectedtrf);
            promiseSign.then(
              function(res){
                if(res.code='000000'){
                  $interval.cancel(trfcint);
                  popUp.close();
                  $state.go('tab.zrangcheckok',{Mon:$scope.selectMoneny,count:$scope.selectedtrf.length});
                }
              }
            ).catch(function(err){
                popUp.close();
                $ionicLoading.show({template: err, noBackdrop: true, duration:3000});
              })
          }else if($scope.input.MsgCode = "" || $scope.input.MsgCode == undefined){
            $ionicLoading.show({template: '请填写输入短信验证码!', noBackdrop: true, duration:1000});
          }
        };
        // 取消 确认复核
        $scope.handleOff=function(){
         $interval.cancel(trfcint);
          popUp.close();
        }
      }else{
      /*撤销待复核*/

        $scope.selectedrev = [];
        $scope.selectMoneny=0;
        for (var i = 0; i < $scope.zrrevList.list.length; i++) {
          if($scope.zrrevList.list[i].flag){
            var obj = {};
            obj.id = $scope.zrrevList.list[i].id;
            obj.srcDrftNo = $scope.zrrevList.list[i].srcDrftNo;
            $scope.selectedrev.push(obj);
            $scope.selectMoneny += $scope.zrrevList.list[i].txnAmt;
          }
        };
        $rootScope.ReadFileList = $scope.selectedrev;
        if(!$scope.selectedrev.length){

          $ionicLoading.show({template: '请选择你的宝眷!', noBackdrop: true, duration:1000});
          return;

          return false;

          $ionicLoading.show({template: '请选择你的宝眷!', noBackdrop: true, duration:1000});
          return false;

        }
        $scope.reCheck = '撤销复核';
        var popUp=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-zhuangrang-comfirm.html',
          scope:$scope
        });
        $scope.getMsgcode=function(){
          if($scope.getmessageinfo=="发送验证码"){
            var promise = getSmsCode.getsmscode("ZR02");
            $scope.getmessageinfo=60;
            revcint = $interval(function(){
              $scope.getmessageinfo--;
              if($scope.getmessageinfo<=0){
                $interval.cancel(revcint);
                $scope.getmessageinfo="发送验证码";
              }
            },1000);
          }else{
            return;
          }
        };
        $scope.handleOn=function(){
          console.log($scope.selectedrev.length)
          $interval.cancel(revcint);
          if($scope.getmessageinfo>=0&&$scope.input.MsgCode!=""&&$scope.input.isok&&$scope.selectedrev.length!=0){
            var promiserev=TxnApprove.txnapprove('02','1',$scope.input.MsgCode,$scope.selectedrev);
            promiserev.then(
              function(res){
                if(res.code='000000'){
                  $interval.cancel(revcint);
                  $scope.getmessageinfo="发送验证码";
                  $scope.input.MsgCode="";
                  $scope.input.isok=false;
                  popUp.close();
                  $state.go('tab.zrangcancelok',{Mon:$scope.selectMoneny,count:$scope.selectedrev.length});

                }

              }
            ).catch(function(err){
                $ionicLoading.show({template: err, noBackdrop: true, duration:500});
              })
          }else{
            $scope.getmessageinfo="发送验证码";
            $scope.input.MsgCode="";
            $scope.input.isok=false;
          }
        };
        // 取消 确认复核
        $scope.handleOff=function(){
          $scope.getmessageinfo="发送验证码";
          $scope.input.isok="";
          $scope.input.MsgCode="";
          if(trfcint){$interval.cancel(trfcint);}
          if(revcint){$interval.cancel(revcint);}
          popUp.close();
        }
      }
      // xieyi tongzhi
      $scope.ZRFHxieyiBtn = function () {
        console.log($rootScope.ReadFileList);
        //只选择一个的时候
        if($rootScope.ReadFileList.length == 1){
          var id = $rootScope.ReadFileList[0].id;
          popUp.close();
          $rootScope.jumpto('tab.QianShouXieYi',{id:id});
        }else{//多个的时候跳到列表
          popUp.close();
          $rootScope.jumpto('tab.QianShouXieYiList');

        }
      }
      $scope.ZRFHtongzhi = function () {
        console.log($rootScope.ReadFileList);
        //只选择一个的时候
        if($rootScope.ReadFileList.length == 1){
          var id = $rootScope.ReadFileList[0].id;
          popUp.close();
          $rootScope.jumpto('tab.QianShouTongZhi',{id:id});
        }else{//多个的时候跳到列表
          popUp.close();
          $rootScope.jumpto('tab.QianShouTongZhiList');

        }
      }
    };

    // 点击驳回 弹出
    $scope.reject=function(){
      var txtinfo = "";
      $scope.selectedList = [];
      $scope.selectedMoneny = 0;
      if($scope.isCur){
        for(var i = 0 ; i < $scope.zrtrfList.list.length; i++){
          if($scope.zrtrfList.list[i].flag){
            var obj = {};
            obj.id = $scope.zrtrfList.list[i].id;
            obj.srcDrftNo = $scope.zrtrfList.list[i].srcDrftNo;
            $scope.selectedList.push(obj);
            $scope.selectedMoneny += $scope.zrtrfList.list[i].txnAmt;
          }
        };
        if(!$scope.selectedList.length){
          $ionicLoading.show({template:'请选择你的宝券', noBackdrop: true, duration:1000});
          return false;
        };
        var popUp = $ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-zrang-newreject.html',
          scope:$scope
        });
        $scope.ischecked = true;
        $scope.checka = function(){
          $scope.ischecked = true;
        };
        $scope.checkb = function(){
          $scope.ischecked = false;
        };
        $scope.handle_cancel = function(){
          popUp.close();
        };
        $scope.handle_comfirm = function(){
            popUp.close();
            if($scope.ischecked){txtinfo = '转让信息填写错误'}else{txtinfo = '其他'};
            var promise = TxnApprove.txnapprove('01','2','',$scope.selectedList,txtinfo);
            promise.then(
              function(res){
                if(res.code == '000000'){
                  popUp.close();
                  $state.go('tab.zrangcheck-rejecta',{Mon:$scope.selectedMoneny,count:$scope.selectedList.length})
                }
              }
            ).catch(
              function(err){
                popUp.close();
                $ionicLoading.show({template: err, noBackdrop: true, duration:2000})
              }
            );

        }
      }else {
        for(var i = 0 ; i < $scope.zrrevList.list.length; i++){
          if($scope.zrrevList.list[i].flag){
            var obj = {};
            obj.id = $scope.zrrevList.list[i].id;
            obj.srcDrftNo = $scope.zrrevList.list[i].srcDrftNo;
            $scope.selectedList.push(obj);
            $scope.selectedMoneny += $scope.zrrevList.list[i].txnAmt;
          }
        };
        if(!$scope.selectedList.length){
          return false;
        };
        var txtinfo = "";
        var popUp = $ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-zrang-newrejectrev.html',
          scope:$scope
        });
        $scope.ischecked = true;
        $scope.checka = function(){
          $scope.ischecked = true;
        };
        $scope.checkb = function(){
          $scope.ischecked = false;
        };
        $scope.handle_cancel = function(){
          popUp.close();
        };
        $scope.handle_comfirm = function(){
          popUp.close();
          if($scope.ischecked){txtinfo = '转让信息填写错误'}else{txtinfo = '其他'};
            var promise = TxnApprove.txnapprove('02','2','',$scope.selectedList,txtinfo);
            promise.then(
              function(res){
                if(res.code == '000000'){
                  NextPop.close();
                  $state.go('tab.zrangcheck-rejectb',{Mon:$scope.selectedMoneny,count:$scope.selectedList.length})
                }
              }
            ).catch(
              function(err){
                popUp.close();
                $ionicLoading.show({template: err, noBackdrop: true, duration:2000})
              }
            );
        }
      }
    };

  })

  //转让历史单笔详情
  .controller('ZrangcheckhistoryCtrldetail',function($scope,ZRDetail,ToolService,$stateParams){
    var getId = $stateParams.id;
    $scope.cmjs = ToolService;
    var promise = ZRDetail.http(getId);
    promise.then(
      function(res){
        if(res.code == '000000'){
          console.log(res)
          $scope.details = res.data
        }
      }
    ).catch()
  })

  //转让单笔详情
  .controller('ZRdetailCtrl',function($ionicLoading,$scope,$state,TxnApproveDetail,$rootScope,$interval,$ionicPopup,getSmsCode,ToolService,TxnApprove,$stateParams){
    $scope.cmjs = ToolService;
    $scope.obj={};
    $scope.selectArr=[];
    var getId = $stateParams.id;
    var srcDrftNo = $stateParams.no;
    var bt = $stateParams.bt;
    $scope.obj.srcDrftNo = srcDrftNo;
    $scope.obj.id = getId;
    $scope.selectArr.push($scope.obj);
    var promise = TxnApproveDetail.gettxnapprdetail(getId);
    promise.then(
      function(res){
        console.log(res);
        if(res.code == '000000'){
          $scope.details = res.data;
        }
      }
    ).catch()

    /*转让复核 确认*/
    $scope.Cfcheck = function(){
      $scope.getmessageinfo="发送验证码";
      $scope.input={MsgCode:"",isok:""};
      var cint="";
      if(bt){
        var stateName = 'tab.zrangcheckok';
        $scope.reCheck = '该宝券';
        var popUp=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-zhuangrang-comfirm.html',
          scope:$scope
        });
        $scope.handleOn=function(){
          $interval.cancel(cint);
          if($scope.getmessageinfo>=0&&$scope.input.MsgCode!=""&&$scope.input.isok){
            var promise=TxnApprove.txnapprove('01','1',$scope.input.MsgCode,$scope.selectArr);
            promise.then(
              function(res){
                if(res.code='000000'){
                  $interval.cancel(cint);
                  $scope.getmessageinfo="发送验证码";
                  $scope.input.MsgCode="";
                  $scope.input.isok=false;
                  popUp.close();
                  $state.go(stateName,{Mon:$scope.details.txnAmt,count:'1'});
                }
              }
            ).catch(function(err){
                popUp.close();
                $ionicLoading.show({template: err, noBackdrop: true, duration:500});
              })

          }else{
            $scope.getmessageinfo="发送验证码";
            $scope.input.MsgCode="";
            $scope.input.isok=false;
          }
        };
        $scope.handleOff=function(){
          $scope.messageinfo="发送验证码";
          $scope.input.isok="";
          $scope.input.MsgCode="";
          if(!!cint){
            $interval.cancel(cint);
          }
          popUp.close();
        }
      }else{
        var stateName = 'tab.zrangcancelok';
        $scope.reCheck = '该转让撤销';
        var popUp=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-zhuangrang-comfirm.html',
          scope:$scope
        });
        $scope.handleOn=function(){
          $interval.cancel(cint);
          if($scope.getmessageinfo>=0&&$scope.input.MsgCode!=""&&$scope.input.isok){
            var promise=TxnApprove.txnapprove('01','1',$scope.input.MsgCode,$scope.selectArr);
            promise.then(
              function(res){
                if(res.code='000000'){
                  $interval.cancel(cint);
                  $scope.getmessageinfo="发送验证码";
                  $scope.input.MsgCode="";
                  $scope.input.isok=false;
                  popUp.close();
                  $state.go(stateName,{Mon:$scope.details.txnAmt,count:'1'});
                }
              }
            ).catch(function(err){
                popUp.close();
                $ionicLoading.show({template: err, noBackdrop: true, duration:500});
              })

          }else{
            $scope.getmessageinfo="发送验证码";
            $scope.input.MsgCode="";
            $scope.input.isok=false;
          }
        };
        $scope.handleOff=function(){
          $scope.messageinfo="发送验证码";
          $scope.input.isok="";
          $scope.input.MsgCode="";
          if(!!cint){
            $interval.cancel(cint);
          }
          popUp.close();
        }
      }
      $scope.getMsgcode=function(){
        if($scope.getmessageinfo=="发送验证码"){
          var promise = getSmsCode.getsmscode("ZR02");
          $scope.getmessageinfo=120;
          cint = $interval(function(){
            $scope.getmessageinfo--;
            if($scope.getmessageinfo<=0){
              $interval.cancel(cint);
              $scope.getmessageinfo="发送验证码";
            }
          },1000);
        }else{
          return;
        }
      };
      $scope.ZRFHxieyiBtn = function () {

          popUp.close();
          $rootScope.jumpto('tab.QianShouXieYi',{id:getId});
      }
      $scope.ZRFHtongzhi = function () {
          popUp.close();
          $rootScope.jumpto('tab.QianShouTongZhi',{id:getId});
      }
    }


    /* 驳回 */
    $scope.reject = function (){
      if (bt) {
        var popUp = $ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-zrang-newreject.html',
          scope:$scope
        });
        var txtinfo = '';
        $scope.ischecked = true;
        $scope.checka = function(){
          $scope.ischecked = true;
        };
        $scope.checkb = function(){
          $scope.ischecked = false;
        };
        $scope.handle_cancel = function(){
          popUp.close();
        };
        $scope.handle_comfirm = function(){
          popUp.close();
          if($scope.ischecked){txtinfo = '转让信息填写错误'}else{txtinfo = '其他'};

            var promise = TxnApprove.txnapprove('01','2','',$scope.selectArr,txtinfo);
            promise.then(
              function(res){
                if(res.code == '000000'){
                  NextPop.close();
                  $state.go('tab.zrangcheck-rejecta',{Mon:$scope.details.txnAmt,count:'1'})
                }
              }
            ).catch(
              function(err){
                popUp.close();
                $ionicLoading.show({template: err, noBackdrop: true, duration:2000})
              }
            );

        }

      } else {
        var popUp = $ionicPopup.show({
          cssClass:'my-mark',
          templateUrl:'template/popup-zrang-newrejectrev.html',
          scope:$scope
        });
        var txtinfo = "";
        $scope.ischecked = true;
        $scope.checka = function(){
          $scope.ischecked = true;
        };
        $scope.checkb = function(){
          $scope.ischecked = false;
        };
        $scope.handle_cancel = function(){
          popUp.close();
        };
        $scope.handle_comfirm = function(){
          popUp.close();
          if($scope.ischecked){txtinfo = '转让信息填写错误'}else{txtinfo = '其他'};
            var promise = TxnApprove.txnapprove('02','2','',$scope.selectArr,txtinfo);
            promise.then(
              function(res){
                if(res.code == '000000'){
                  NextPop.close();
                  $state.go('tab.zrangcheck-rejectb',{Mon:$scope.details.txnAmt,count:'1'})
                }
              }
            ).catch(
              function(err){
                popUp.close();
                $ionicLoading.show({template: err, noBackdrop: true, duration:2000})
              }
            );
        }

      }
    }

  })

  // 转让复核成功
  .controller('ZrangcheckSuccCtrl',function($scope,$state,$ionicHistory,$stateParams,ToolService){
      $scope.cjs=ToolService;
      $scope.getmoneny = $stateParams.Mon;
      $scope.getcount = $stateParams.count;
      var formState="";
      //融资成功返回
      $scope.zrGoBack=function(){
        // 判断由来
        if(formState==="tab.zrangcheckdetail"){
          $ionicHistory.goBack(-2);
        }else{
          $ionicHistory.goBack(-1);
        }
      };
      $scope.$on('$stateChangeSuccess', function (event, toState,toParams,from) {
        formState=from.name;
      });
    })

  // 转让复核历史记录
  .controller('ZrangcheckhistoryCtrl', function ($scope,QueryTxnHisTask,ToolService){
    $scope.isCur=true;
    $scope.cjs = ToolService;
    $scope.zrtrfHisList=[];
    $scope.zrrevHisList=[];

    $scope.showcheck=function(){
      $scope.isCur=true;
      var promisetrf = QueryTxnHisTask.gettxnhislist('01','1');
      promisetrf.then(
        function(res){
          if(res.code=='000000'){
            $scope.zrtrfHisList = res.data.list;
          }
        }
      ).catch()
    };
    $scope.showcheck();
    $scope.showrevocation=function(){
      $scope.isCur=false;
      var promiserev = QueryTxnHisTask.gettxnhislist('02',1);
      promiserev.then(
        function(res){
          if(res.code=='000000'){
            $scope.zrrevHisList = res.data.list;
          }
        }
      ).catch()
    }



  })

  // 融资复核
  .controller('RzckeckCtrl',function($ionicLoading,$scope,$rootScope,$ionicPopup,$state,QueryDisctList,DisctApproveForCorp,ToolService,getSmsCode,$interval){
    $scope.cjs=ToolService;
    $scope.disTotal=0;
    $scope.bacTotal=0;
    $scope.isshow=true; //融资复核和融资撤销待复核 显示切换
    $scope.messageinfo='发送验证码';
    $scope.rzdisList=[];  //
    $scope.rzbacList=[];  //
    $scope.hasrzdis=false;  //全选框没有数据隐藏
    $scope.hasrzbac=false;  //全选框没有数据隐藏
    $scope.input={MsgCode:"",isok:""}; //用户输入的短信验证码&是否同意
    $scope.selecteddis=[];   //选中的提交融资
    $scope.selectedbac=[];   //选中的提交撤回融资
    var discint="";       //定时器
    var baccint="";       //定时器

    $scope.showcheck=function(){
      $scope.isshow=true;
      var dispromise = QueryDisctList.querydisclist('01',1);
      dispromise.then(
        function(res){
          if(res.code=='000000'){
            console.log(res.data);
            $scope.rzdisList=res.data.lists;
            $scope.disTotal=res.data.sum;
            if($scope.rzdisList.list.length){$scope.hasrzdis=true;}else{$scope.hasrzdis=false;};
            $scope.ischeckeddis = {};
            $scope.rzdisList.list.forEach(function (arr,i) {
              arr.flag = false;
              //初始化数据，使每个$scope.ischecked[index]都记录当前是否被选择
              $scope.ischeckeddis[i] = arr.flag;
            });
            $scope.disallCheck = false;
            $scope.disSelection = function ($index) {
              //判断哪个被点中
              $scope.rzdisList.list[$index].flag = !$scope.rzdisList.list[$index].flag;
              $scope.ischeckeddis[$index] = $scope.rzdisList.list[$index].flag;
              var isCheckNum = 0;
              for (var i = 0; i < $scope.rzdisList.list.length; i++) {
                if(!$scope.rzdisList.list[i].flag){//如果有一个没有被选
                  $scope.disallCheck = false;
                }else if($scope.rzdisList.list[i].flag){//计数比较
                  isCheckNum++
                }
              }
              if(isCheckNum == $scope.rzdisList.list.length){//如果全部都被选
                $scope.disallCheck = true;
              }else{
                $scope.disallCheck = false;
              }
            };
            $scope.checkAlldis = function () { /*全选*/
              $scope.disallCheck = !$scope.disallCheck;
              if($scope.disallCheck == true){
                $scope.rzdisList.list.forEach(function (arr,i) {
                  arr.flag = true;
                  for(var k in $scope.ischeckeddis){
                    $scope.ischeckeddis[k] = arr.flag;
                  }
                })
              }else if($scope.disallCheck == false){
                $scope.rzdisList.list.forEach(function (arr,i) {
                  arr.flag = false;
                  for(var k in $scope.ischeckeddis){
                    $scope.ischeckeddis[k] = arr.flag;
                  }
                })
              }
            }
          }
        }
      ).catch()
    };
    $scope.showcheck();
    $scope.showrevocation=function(){
      $scope.isshow=false;
      var bacpromise = QueryDisctList.querydisclist('02',1);
      bacpromise.then(
        function(res){
          if(res.code=='000000'){
            console.log(res);
            $scope.rzbacList=res.data.lists;
            $scope.bacTotal=res.data.sum;
            if($scope.rzbacList.list.length){$scope.hasrzbac=true;}else{$scope.hasrzbac=false;};
            $scope.ischeckedbac = {};
            $scope.rzbacList.list.forEach(function (arr,i) {
              arr.flag = false;
              //初始化数据，使每个$scope.ischecked[index]都记录当前是否被选择
              $scope.ischeckedbac[i] = arr.flag;
            });
            $scope.bacallCheck = false;
            $scope.bacSelection = function ($index) {
              //判断哪个被点中
              $scope.rzbacList.list[$index].flag = !$scope.rzbacList.list[$index].flag;
              $scope.ischeckedbac[$index] = $scope.rzbacList.list[$index].flag;
              var isCheckNum = 0;
              for (var i = 0; i < $scope.rzbacList.list.length; i++) {
                if(!$scope.rzbacList.list[i].flag){//如果有一个没有被选
                  $scope.bacallCheck = false;
                }else if($scope.rzbacList.list[i].flag){//计数比较
                  isCheckNum++
                }
              }
              if(isCheckNum == $scope.rzbacList.list.length){//如果全部都被选
                $scope.bacallCheck = true;
              }else{
                $scope.bacallCheck = false;
              }
            };
            $scope.checkAllbac = function () { /*全选*/
              $scope.bacallCheck = !$scope.bacallCheck;
              if($scope.bacallCheck == true){
                $scope.rzbacList.list.forEach(function (arr,i) {
                  arr.flag = true;
                  for(var k in $scope.ischeckedbac){
                    $scope.ischeckedbac[k] = arr.flag;
                  }
                })
              }else if($scope.bacallCheck == false){
                $scope.rzbacList.list.forEach(function (arr,i) {
                  arr.flag = false;
                  for(var k in $scope.ischeckedbac){
                    $scope.ischeckedbac[k] = arr.flag;
                  }
                })
              }
            }


          }
        }
      ).catch()
    };


    //同意兑付 确认复核按钮
    $scope.ApplyCheck=function(){
      /*转让待复核*/
      if($scope.isshow){

        $scope.selecteddis = [];
        $rootScope.HHSarr = []
        $scope.selectMoneny=0;
        for (var i = 0; i < $scope.rzdisList.list.length; i++) {
          if($scope.rzdisList.list[i].flag){
            var obj = $scope.rzdisList.list[i].id;
            var arr = {};
            arr.id = $scope.rzdisList.list[i].id;
            arr.srcDrftNo = $scope.rzdisList.list[i].srcDrftNo;
            $scope.selecteddis.push(obj);
            $rootScope.HHSarr.push(arr);
            $scope.selectMoneny += $scope.rzdisList.list[i].txnAmt;
          }
        };
        if(!$scope.selecteddis.length){
          $ionicLoading.show({template: '请选择您的宝券', noBackdrop: true, duration:500});
          return;
        }
        $scope.difWordShow = '该宝券';
        var popUp=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-rongzi-comfirm.html',
          scope:$scope
        });
        $scope.getMsgcode=function(){
          if($scope.messageinfo=="发送验证码"){
            var promise = getSmsCode.getsmscode("RZ02");
            $scope.messageinfo=120;
            discint = $interval(function(){
              $scope.messageinfo--;
              if($scope.messageinfo<=0){
                $interval.cancel(discint);
                $scope.messageinfo="发送验证码";
              }
            },1000);
          }else{
            return;
          }
        };
        $scope.handleOn=function(){
          $interval.cancel(discint);
          if($scope.messageinfo>=0&&$scope.input.MsgCode!=""&&$scope.input.isok&&$scope.selecteddis.length!=0){
            var promise=DisctApproveForCorp.txnapprove('01',$scope.input.MsgCode,'2',$scope.selecteddis);
            promise.then(
              function(res){
                if(res.code='000000'){
                  $interval.cancel(discint);
                  $scope.messageinfo="发送验证码";
                  $scope.input.MsgCode="";
                  $scope.input.isok=false;
                  popUp.close();
                  $state.go('tab.rzicheckok',{Mon:$scope.selectMoneny,count:$scope.selecteddis.length});
                }

              }
            ).catch(function(err){
                popUp.close();
                $ionicLoading.show({template: err, noBackdrop: true, duration:500});
              })
          }else{
            $scope.messageinfo="发送验证码";
            $scope.input.MsgCode="";
            $scope.input.isok=false;
          }
        };
        // 取消 确认复核
        $scope.handleOff=function(){

          $scope.messageinfo="发送验证码";
          $scope.input.isok="";
          $scope.input.MsgCode="";
          $interval.cancel(discint);
          popUp.close();
        };

        /*撤销待复核*/
      }else{
        $scope.selectedbac = [];
        $rootScope.HHSarr = []
        $scope.selectMoneny=0;
        for (var i = 0; i < $scope.rzbacList.list.length; i++) {
          if($scope.rzbacList.list[i].flag){
            var obj = $scope.rzbacList.list[i].id;
            var arr = {};
            arr.id = $scope.rzbacList.list[i].id;
            arr.srcDrftNo = $scope.rzbacList.list[i].srcDrftNo;
            $scope.selectedbac.push(obj);
            $rootScope.HHSarr.push(arr);

            $scope.selectMoneny += $scope.rzbacList.list[i].txnAmt;
          }
        };
        if(!$scope.selectedbac.length){
          $ionicLoading.show({template: '请选择您的宝券!', noBackdrop: true, duration:2000});
          return ;
        }
        $scope.difWordShow = '该融资撤销';
        var popUp=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-rongzi-comfirm.html',
          scope:$scope
        });
        $scope.getMsgcode=function(){
          if($scope.messageinfo=="发送验证码"){
            var promise = getSmsCode.getsmscode("RZ02");
            $scope.messageinfo=60;
            baccint = $interval(function(){
              $scope.messageinfo--;
              if($scope.messageinfo<=0){
                $interval.cancel(baccint);
                $scope.messageinfo="发送验证码";
              }
            },1000);
          }else{
            return;
          }
        };
        $scope.handleOn=function(){
          $interval.cancel(baccint);
          if($scope.messageinfo>=0&&$scope.input.MsgCode!=""&&$scope.input.isok&&$scope.selectedbac.length!=0){
            var promise=DisctApproveForCorp.txnapprove('02',$scope.input.MsgCode,'2',$scope.selectedbac);
            promise.then(
              function(res){
                if(res.code='000000'){
                  $interval.cancel(baccint);
                  $scope.messageinfo="发送验证码";
                  $scope.input.MsgCode="";
                  $scope.input.isok=false;
                  popUp.close();
                  $state.go('tab.rzicheck-cancelok',{Mon:$scope.selectMoneny,count:$scope.selectedbac.length});
                }

              }
            ).catch(function(err){
                popUp.close();
                $ionicLoading.show({template: err, noBackdrop: true, duration:500});
              })
          }else{
            $scope.messageinfo="发送验证码";
            $scope.input.MsgCode="";
            $scope.input.isok=false;
          }
        };
        // 取消 确认复核
        $scope.handleOff=function(){
          $scope.messageinfo="发送验证码";
          $scope.input.isok="";
          $scope.input.MsgCode="";
          $interval.cancel(baccint);
          popUp.close();
        }
      }
      //协议、通知查看
      $scope.RZxieyiBtn = function () {
        //只选择一个的时候
        console.log($rootScope.HHSarr);
        if($rootScope.HHSarr.length == 1){
          var id = $rootScope.HHSarr[0].id;
          popUp.close();
          $rootScope.jumpto('tab.FileReadXieYiOne',{id:id});
        }else{//多个的时候跳到列表
          popUp.close();
          $rootScope.jumpto('tab.FileReadXieYiMore');

        }
      }
      $scope.RZtongzhi = function() {
        //只选择一个的时候
        console.log($rootScope.HHSarr);
        if($rootScope.HHSarr.length == 1){
          var id = $rootScope.HHSarr[0].id;
          popUp.close();
          $rootScope.jumpto('tab.FileReadTongZhiOne',{id:id});
        }else{//多个的时候跳到列表
          popUp.close();
          $rootScope.jumpto('tab.FileReadTongZhiMore');

        }

      }
    };


    // 点击驳回 弹出
    $scope.reject=function(){
      var selectedArr = [];
      var selectedMoneny = 0;
      var templateUrl = "",successPage = '',operateType = '',lists='',txtinfo = "";

      if($scope.isshow){
        templateUrl = 'template/popup-rzi-newreject.html';
        operateType = '01';
        successPage = 'tab.rzicheck-jecectappr';
        lists = $scope.rzdisList;
        var txt1 = '融资信息填写错误';
        var txt2 = '其他'
      }else {
        templateUrl = 'template/popup-rzi-newrejectrev.html';
        operateType = '02';
        successPage = 'tab.rzicheck-jecectcancel' ;
        lists = $scope.rzbacList;
        var txt1 = '融资撤回信息填写错误';
        var txt2 = '其他'
      }

      for (var i = 0; i < lists.list.length; i++) {
        if(lists.list[i].flag){
          var obj = lists.list[i].id;
          selectedArr.push(obj);
          selectedMoneny += lists.list[i].txnAmt;
        }
      };
      if(!selectedArr.length){
        $ionicLoading.show({template: '请选择您的宝券!', noBackdrop: true, duration:2000});
        return;
      }
      var popReject=$ionicPopup.show({
        cssClass:'my-popup',
        templateUrl:templateUrl,
        scope:$scope
      });
      $scope.ischecked = true;
      $scope.checka = function(){
        $scope.ischecked = true;
      };
      $scope.checkb = function(){
        $scope.ischecked = false;
      };
      $scope.handle_cancel = function(){
        popReject.close();
      };
      $scope.handle_comfirm = function(){
        popReject.close();
        if($scope.ischecked){txtinfo = txt1 }else{txtinfo = txt2 };
          var promise = DisctApproveForCorp.txnapprove(operateType,'','1',selectedArr,txtinfo);
          promise.then(
            function (res) {
                if(res.code == '000000'){
                  popReject.close();
                $state.go(successPage,{Mon:selectedMoneny,count:selectedArr.length})
              }
            }
          ).catch(
            function(err){
              popReject.close();
              $ionicLoading.show({template: err, noBackdrop: true, duration:2000})
            }
          )
      };
    };
  })
  //阅读协议单个
  .controller('FileReadXieYiOneCtrl', function ($scope,$stateParams,RZbusinessDetail) {
    $scope.finTypNohas = false;
    $scope.finTypHas = false;
    console.log($stateParams.id);
    RZbusinessDetail.http($stateParams.id).then(function (res) {
      console.log(res);
      if(res.code === '000000'){
        if(res.data.finTyp == '1'){
          $scope.finTypNohas = true;
        }
        if(res.data.finTyp == '2'){
          $scope.finTypHas = true;
        }
        $scope.disctInfo = res.data.disctInfo;


      }
    })
  })
  //阅读协议多个
  .controller('FileReadXieYiMoreCtrl',function($scope,$rootScope){
    $scope.fileLists = $rootScope.HHSarr;
    $scope.toReadFileBtn = function (id) {
      $rootScope.jumpto('tab.FileReadXieYiOne',{id:id})
    }
  })
  //阅读通知单个
  .controller('FileReadTongZhiOneCtrl',function($scope,$stateParams,RZbusinessDetail,ToolService){
    $scope.tool = ToolService;
    console.log($stateParams.id);
    RZbusinessDetail.http($stateParams.id).then(function (res) {
      console.log(res);
      if(res.code === '000000'){
        $scope.FileReadTongZhiOne = res.data;
        var dat = $scope.FileReadTongZhiOne.txnDt;
        var arr = dat.split('');
        $scope.year = arr[0]+arr[1]+arr[2]+arr[3];
        $scope.mon = arr[4]+arr[5];
        $scope.day = arr[6]+arr[7]
      }
    })
    })
  //阅读通知多个
  .controller('FileReadTongZhiMoreCtrl',function($scope,$rootScope){
    $scope.fileLists = $rootScope.HHSarr;
    $scope.toReadFileBtn = function (id) {
      $rootScope.jumpto('tab.FileReadTongZhiOne',{id:id})
    }
  })
  // 融资成功页面
  .controller('RzckeckSuccessCtrl',function($scope,$state,$ionicHistory,$stateParams,ToolService){
    $scope.cjs = ToolService;
    $scope.getmoneny = $stateParams.Mon;
    $scope.getcount = $stateParams.count;
    var formState="";
    //融资成功返回
    $scope.rzGoBack=function(){
      // 判断由来
      if(formState==="tab.rzicheckdetail"){
        $ionicHistory.goBack(-2);
      }else{
        $ionicHistory.goBack(-1);
      }
    };
    $scope.$on('$stateChangeSuccess', function (event, toState,toParams,from) {
      formState=from.name;
    });
  })

  // 融资复核历史单笔详情
  .controller('RzcheckhistorydetailCtrl',function($scope,QueryDisctDetail,ToolService,$stateParams){
    var getId = $stateParams.id;
    $scope.cjs = ToolService;
    var promise = QueryDisctDetail.gettxnapprdetail(getId);
    promise.then(
      function(res){
        if(res.code == '000000'){
          console.log(res);
          $scope.rzitem = res.data
        }
      }
    ).catch()
  })

  // 融资复核-详情信息
  .controller('RzicheckdetailCtrl',function($ionicLoading,$scope,$ionicPopup,$stateParams,$rootScope,$interval,$state,getSmsCode,RZbusinessDetail,ToolService,DisctApproveForCorp){
    var getId = $stateParams.id;
    var bt = $stateParams.bt;
    $scope.cjs = ToolService;
    $scope.selectArr = [];
    $scope.selectArr[0] = getId;

    var promise = RZbusinessDetail.http(getId);
    promise.then(
      function(res){
        console.log(res);
        if(res.code=='000000'){
          $scope.rzitem = res.data;
        }
      })

    /*确认复核*/
    $scope.ApproveCheck = function(){
      $scope.getmessageinfo="发送验证码";
      $scope.input={MsgCode:"",isok:""};
      var cint="";
      if(bt){ //融资复核
        var sgo = 'tab.rzicheckok';
        $scope.difWordShow = '该融资撤销';
        var popUp=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-rongzi-comfirm.html',
          scope:$scope
        });
        $scope.handleOn = function(){
          $interval.cancel(cint);
          if($scope.getmessageinfo>=0&&$scope.input.MsgCode!=""&&$scope.input.isok){
            var promise=DisctApproveForCorp.txnapprove('01',$scope.input.MsgCode,'2',$scope.selectArr);
            promise.then(
              function(res){
                if(res.code='000000'){
                  $interval.cancel(cint);
                  $scope.getmessageinfo="发送验证码";
                  $scope.input.MsgCode="";
                  $scope.input.isok=false;
                  popUp.close();
                  $state.go(sgo,{Mon:$scope.rzitem.txnAmt,count:'1'});
                }

              }
            ).catch(function(err){
                popUp.close();
                $ionicLoading.show({template: err, noBackdrop: true, duration:2000});
              })
          }else{
            $scope.getmessageinfo="发送验证码";
            $scope.input.MsgCode="";
            $scope.input.isok=false;
          }
        };
        $scope.handleOff=function(){
          $scope.getmessageinfo="发送验证码";
          $scope.input.isok="";
          $scope.input.MsgCode="";
          if(cint){
            $interval.cancel(cint);
          }
          popUp.close();
        }
      }else{  //撤销待复核
        var ot = '02';
        var sgo = 'tab.rzicheck-cancelok';
        $scope.difWordShow = '该融资撤销';
        var popUp=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-rongzi-comfirm.html',
          scope:$scope
        });
        $scope.handleOn = function(){
          $interval.cancel(cint);
          if($scope.getmessageinfo>=0&&$scope.input.MsgCode!=""&&$scope.input.isok){
            var promise=DisctApproveForCorp.txnapprove('02',$scope.input.MsgCode,'2',$scope.selectArr);
            primise.then(
              function(res){
                if(res.code='000000'){
                  $interval.cancel(cint);
                  $scope.getmessageinfo="发送验证码";
                  $scope.input.MsgCode="";
                  $scope.input.isok=false;
                  popUp.close();
                  $state.go(sgo,{Mon:$scope.rzitem.txnAmt,count:'1'});
                }
              }
            ).catch(
              function(err){
                popUp.close();
                $ionicLoading.show({template: err, noBackdrop: true, duration:500});
              }
            )
          }else{
            $scope.getmessageinfo="发送验证码";
            $scope.input.MsgCode="";
            $scope.input.isok=false;
          }
        };
        $scope.handleOff=function(){
          $scope.getmessageinfo="发送验证码";
          $scope.input.isok="";
          $scope.input.MsgCode="";
          if(cint){
            $interval.cancel(cint);

          }
          popUp.close();
        }
      }
      $scope.getMsgcode=function(){
        if($scope.getmessageinfo=="发送验证码"){
          var promise = getSmsCode.getsmscode("RZ02");
          $scope.getmessageinfo=120;
          cint = $interval(function(){
            $scope.getmessageinfo--;
            if($scope.getmessageinfo<=0){
              $interval.cancel(cint);
              $scope.getmessageinfo="发送验证码";
            }
          },1000);
        }else{
          return;
        }
      };

      //协议、通知查看
      $scope.RZxieyiBtn = function () {

          popUp.close();
          $rootScope.jumpto('tab.FileReadXieYiOne',{id:getId});
      }
      $scope.RZtongzhi = function() {

          popUp.close();
          $rootScope.jumpto('tab.FileReadTongZhiOne',{id:getId});
      }


    };



    /*  驳回  */
    $scope.reject=function(){
      var txtinfo = '';
      var templateUrl = "",successPage = '',operateType = '';
      if (bt) {
        templateUrl = 'template/popup-rzi-newreject.html';
        operateType = '01';
        successPage = 'tab.rzicheck-jecectappr';
        var txt1 = '融资信息填写错误';
        var txt2 = '其他'
      }else {
        templateUrl = 'template/popup-rzi-newrejectrev.html';
        operateType = '02';
        successPage = 'tab.rzicheck-jecectcancel' ;
        var txt1 = '融资撤回信息填写错误';
        var txt2 = '其他'
      }
      var popReject=$ionicPopup.show({
        cssClass:'my-popup',
        templateUrl:templateUrl,
        scope:$scope
      });
      $scope.ischecked = true;
      $scope.checka = function(){
        $scope.ischecked = true;
      };
      $scope.checkb = function(){
        $scope.ischecked = false;
      };
      $scope.handle_cancel = function(){
        popReject.close();
      };
      $scope.handle_comfirm = function(){
        popReject.close();
        if($scope.ischecked){txtinfo = txt1}else{txtinfo = txt2};
          var promise = DisctApproveForCorp.txnapprove(operateType,'','1',selectedArr,txtinfo);
          promise.then(
            function (res) {
              if(res.code == '000000'){
                $state.go(successPage,{Mon:$scope.rzitem.txnAmt,count:1})
              }
            }
          ).catch(
            function(err){
              popReject.close();
              $ionicLoading.show({template: err, noBackdrop: true, duration:2000})
            }
          )

      };
    }


  })

  // 融资复核历史记录
  .controller('RzcheckhistoryCtrl', function ($scope,QueryDisctHisLis,ToolService){
    $scope.isCur=true;
    $scope.rztrfHisList=[];
    $scope.rzrevHisList=[];
    $scope.cjs = ToolService;

    $scope.showcheck=function(){
      $scope.isCur=true;
      var promisetrf = QueryDisctHisLis.getdiscthislist('01',1);
      promisetrf.then(
        function(res){
          if(res.code=='000000'){
            console.log(res);
            $scope.trfList = res.data.list;
          }
        }
      ).catch()
    };
    $scope.showcheck();
    $scope.showrevocation=function(){
      $scope.isCur=false;
      var promiserev = QueryDisctHisLis.getdiscthislist('02',1);
      promiserev.then(
        function(res){
          if(res.code=='000000'){
            console.log(res);
            $scope.revList = res.data.list;
          }
        }
      ).catch()
    }
  })



  // 宝券到期 付款申请
  .controller('BquandaoqiCtrl',function($ionicLoading,$scope,$rootScope,$ionicPopup,$state,QueryPayDrftList,ToolService){
    $scope.cjs = ToolService;
    $scope.parseInt = parseInt;
    var promise = QueryPayDrftList.querypaydrftList(1,10);
    promise.then(
      function ( res ) {
        if(res.code == '000000'){
          console.log(res);
          $scope.bqDue = res.data.list;

          $scope.ischecked = [];
          $scope.ischeckedAll = false;
          $scope.bqDue.forEach(function(arr,i){
            arr.flag = false ;
            $scope.ischecked[i] = arr.flag;
          })

        }
      }
    ).catch();

    /*复选框点击事件*/
    $scope.checkthis = function($index){
      $scope.bqDue[$index].flag = !$scope.bqDue[$index].flag;
      $scope.ischecked[$index] = $scope.bqDue[$index].flag;
      var checkNum = 0;
      for (var i = 0; i< $scope.bqDue.length; i++) {
        if(!$scope.ischecked[i]){
          $scope.ischeckedAll = false;
        }else if($scope.ischecked[i]){
          checkNum++;
        }
      };
      if(checkNum == $scope.ischecked.length){
        $scope.ischeckedAll = true;
      }else{
        $scope.ischeckedAll = false;
      }
    };
    /*全选框点击事件*/
    $scope.checkAll = function(){
      $scope.ischeckedAll = !$scope.ischeckedAll;
      if($scope.ischeckedAll){
        $scope.bqDue.forEach(function(arr,i){
          arr.flag = true ;
          for(var k in $scope.ischecked){
            $scope.ischecked[k] = arr.flag;
          }
        })
      }else{
        $scope.bqDue.forEach(function(arr,i){
          arr.flag = false ;
          for(var k in $scope.ischecked){
            $scope.ischecked[k] = arr.flag;
          }
        })
      }
    };

    /*申请兑付*/
    $scope.solutionpay = function () {
      $rootScope.selectedBqArr = [];
      var custNo = JSON.parse(window.localStorage.getItem("user")).custNo;
      var custCnNm = JSON.parse(window.localStorage.getItem("user")).custCnNm;
      for(var i = 0 ; i < $scope.bqDue.length; i++){
        if($scope.bqDue[i].flag){
          var obj = {};
          obj.rcvCustNo = custNo;
          obj.rcvCustNm = custCnNm;
          obj.isseAmt = $scope.bqDue[i].validAmt;
          obj.dueDays = $scope.bqDue[i].dueDays;
          obj.delayDays = $scope.bqDue[i].dueDt;
          obj.id = $scope.bqDue[i].id;
          obj.drftNo = $scope.bqDue[i].drftNo;
          $rootScope.selectedBqArr.push(obj)
        }
      }
      if($rootScope.selectedBqArr.length){
        $state.go("tab.bquanduihua-batch")
      }else{
        $ionicLoading.show({template: '请选择您的宝券!', noBackdrop: true, duration:2000});
      }
    }
  })

  // 宝券兑换
  .controller('BquanduihuanCtrl',function($scope,$rootScope,$ionicPopup,$state,ToolService,ListAcct,getSmsCode,$interval,ApplyForCorp){
    $scope.cjs = ToolService;
    $scope.parseInt = parseInt;
    $scope.showList = false;
    console.log( $rootScope.selectedBqArr);

    /*银行账户查询*/
    var promise = ListAcct.listacct('1',100);
    promise.then(
      function(res){
        $scope.acctList = res.data.list;
        for(var i = 0 ; i < $scope.acctList.length ; i++){

          if($scope.acctList[i].defRecNo == '1'){
            console.log($scope.acctList[i])
            //$scope.showName = $scope.acctList[i].openBrhNm;
            $scope.showCo = $scope.acctList[i].acctNo;
            $scope.showRo = $scope.acctList[i].defRecNo;
            //$scope.showCity = $scope.acctList[i].bankCity;
          }
        }
      }
    ).catch();
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
        templateUrl:'/template/popup-duihuang-check.html',
        scope:$scope
      });
      var cint = "";
      $scope.messageinfo = '发送验证码';
      $scope.input = {MsgCode:""};
      /*获取短信验证码*/
      $scope.getMsgcode = function () {
        if($scope.messageinfo == "发送验证码"){
          var promise = getSmsCode.getsmscode("JF01");
          $scope.messageinfo = 120;
          cint = $interval(function(){
            $scope.messageinfo--;
            if($scope.messageinfo <= 0){
              $interval.cancel(cint);
              $scope.messageinfo = "发送验证码";
            }
          },1000);
        }else{
          return;
        }
      };

      $scope.handle_comfirm=function(){
        $interval.cancel(cint);
        if($scope.input.MsgCode != "" && $scope.input.MsgCode != null){
          var promise = ApplyForCorp.applyforcorp($scope.input.MsgCode.toString(),$rootScope.selectedBqArr);
          promise.then(
            function(res){
              if(res.code == '000000'){
                popReject.close();
                $state.go('tab.bquanduihua-apply-ok');
              }
            }
          ).catch(
            function(err){
              popReject.close();
              $ionicLoading.show({template: err, noBackdrop: true, duration:500});
            }
          );
        }
      };
      $scope.handle_cancel=function(){
        $interval.cancel(cint);
        popReject.close();
      }
    }
  })

  // 宝券兑换成功页面
  .controller('BqdueSuccessCtrl',function($scope,$state,$ionicHistory,$stateParams){
    var formState="";
    $scope.dueGoBack = function () {
      console.log(formState)
      if(formState==="tab.bquanduihuan-info"){
        console.log('-2')
        $ionicHistory.goBack(-3);
      }else{
        $ionicHistory.goBack(-2);
        console.log('-2')
      }
    };
    $scope.$on('$stateChangeSuccess', function (event, toState,toParams,from) {
      formState=from.name;
      console.log(formState)
    });
  })

  // 宝券兑换单笔详情
  .controller('BqdueDetailCtrl',function($scope,$state,ToolService,$ionicPopup,QueryDrftDetail,$stateParams,ListAcct,$interval,getSmsCode,ApplyForCorp){
    $scope.cjs = ToolService;
    $scope.showList = false;
    var sendArr = [];
    var id = $stateParams.id;
    var promise = QueryDrftDetail.drftdetail(id);
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
        }
      }
    ).catch();
    /*银行账户查询*/
    var promiseCoun = ListAcct.listacct('1',100);
    promiseCoun.then(
      function(res){
        $scope.acctList = res.data.list;
        for(var i = 0 ; i < $scope.acctList.length ; i++){
          if($scope.acctList[i].defRecNo == 1){
            //$scope.showName = $scope.acctList[i].openBrhNm;
            $scope.showCo = $scope.acctList[i].acctNo;
            $scope.showRo = $scope.acctList[i].defRecNo;
            //$scope.showCity = $scope.acctList[i].bankCity;
          }
        }
      }
    ).catch();
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
    $scope.confirm=function(){
      /*添加到报文*/
      sendArr[0].acctNo = $scope.showCo;
      var popReject=$ionicPopup.show({
        cssClass:'my-popup',
        templateUrl:'/template/popup-duihuang-check.html',
        scope:$scope
      });
      var cint = "";
      $scope.messageinfo = '发送验证码';
      $scope.input = {MsgCode:""};
      /*获取短信验证码*/
      $scope.getMsgcode = function () {
        if($scope.messageinfo == "发送验证码"){
          var promise = getSmsCode.getsmscode("JF01");
          $scope.messageinfo = 120;
          cint = $interval(function(){
            $scope.messageinfo--;
            if($scope.messageinfo <= 0){
              $interval.cancel(cint);
              $scope.messageinfo = "发送验证码";
            }
          },1000);
        }else{
          return;
        }
      };

      $scope.handle_comfirm=function(){
        $interval.cancel(cint);
        if($scope.input.MsgCode != "" && $scope.input.MsgCode != null){
          var promise = ApplyForCorp.applyforcorp($scope.input.MsgCode.toString(),sendArr);
          promise.then(
            function(res){
              if(res.code == '000000'){
                popReject.close();
                $state.go('tab.bquanduihua-apply-ok');
              }
            }
          ).catch($scope.messageinfo = '发送验证码');
        }
      };
      $scope.handle_cancel=function(){
        $interval.cancel(cint);
        popReject.close();
      }
    }

  })

  // 我的金币
  .controller('MycoinCtrl',function($scope,QueryBonus,QueryinBonus,QueryGenBonus,ToolService){
    $scope.isshow = true;
    $scope.cjs = ToolService;
    /*金币查询*/
    var prmiseCoin = QueryBonus.querybonus();
    prmiseCoin.then(
      function(res){
        if(res.code == '000000'){
          $scope.mycoins = res.data;
        }
      }
    ).catch();
    /*收支统计查询*/
    var promiseInBonus = QueryinBonus.queryinbonus();
    promiseInBonus.then(
      function(res){
        if(res.code == '000000'){
          $scope.Inbonus = res.data;
        }
      }
    ).catch();
    /*转让收益*/
    var promiseZR = QueryGenBonus.querygenbonus(1,10,'01','2');
    promiseZR.then(
      function(res){
        if(res.code == '000000'){
          $scope.zrList = res.data.list;
        }
      }
    ).catch();
    /*融资收益*/
    var promiseRZ = QueryGenBonus.querygenbonus(1,10,'02','2');
    promiseRZ.then(
      function(res){
        if(res.code == '000000'){
          $scope.rzList = res.data.list;
        }
      }
    ).catch();

    $scope.showZR = function(){
      console.log('1');
      $scope.isshow = true;
    };
    $scope.showRZ = function(){
      console.log('2');
      $scope.isshow = false;
    }

  })

  // 收支统计  -收益
  .controller('MycoinSYCtrl',function($scope,QueryGenBonus,ToolService){
    $scope.isshow = true;
    $scope.cjs = ToolService;
    /*转让收益*/
    var promiseZR = QueryGenBonus.querygenbonus(1,10,'01','2');
    promiseZR.then(
      function(res){
        if(res.code == '000000'){
          $scope.zrList = res.data.list;
        }
      }
    ).catch();
    /*融资收益*/
    var promiseRZ = QueryGenBonus.querygenbonus(1,10,'02','2');
    promiseRZ.then(
      function(res){
        if(res.code == '000000'){
          $scope.rzList = res.data.list;
        }
      }
    ).catch();

    $scope.showZR = function () {
      $scope.isshow = true;
    };
    $scope.showRZ = function () {
      $scope.isshow = false;
    }

  })

  // 收益筛选
  .controller('MycoinSaiXuanCtrl',function($scope,$rootScope,$cordovaDatePicker){
    var sTime = '';
    var eTime = '';
    /*开始时间*/
    $scope.Startpick = function(){
      var options = {
        date: new Date(),
        mode: 'date', // or 'time' 'date'
        minDate: new Date() - 10000,
        format: 'yyyy-mm',
        linkFormat: 'yyyymm',
        allowOldDates: true,
        allowFutureDates: true,
        doneButtonLabel: 'DONE',
        doneButtonColor: '#F2F3F4',
        cancelButtonLabel: 'CANCEL',
        cancelButtonColor: '#000000',
        androidTheme:3
      };
      document.addEventListener("deviceready", function () {
        $cordovaDatePicker.show(options).then(function(date){
          sTime = date;
          $rootScope.startdate = date.toLocaleDateString().split('/').slice(0,3);
        });
      }, false);
    }
    /*结束时间*/
    $scope.Endpick = function(){
      var options = {
        date: sTime,
        mode: 'date', // or 'time' 'date'
        minDate:sTime,
        allowOldDates: false,
        allowFutureDates: true,
        doneButtonLabel: 'DONE',
        doneButtonColor: '#F2F3F4',
        cancelButtonLabel: 'CANCEL',
        cancelButtonColor: '#000000',
        androidTheme:3
      };
      document.addEventListener("deviceready", function () {
        $cordovaDatePicker.show(options).then(function(date){
          $rootScope.enddate = date.toLocaleDateString().split('/').slice(0,3);
        });
      }, false);
    }


    $scope.GoBack = function(){

    }


  })

  // 收支统计  -使用
  .controller('MycoinUsedCtrl',function($scope,ToolService,QueryUsedBonus){
    $scope.cjs = ToolService;
    var promise = QueryUsedBonus.queryusedBonus(1,10);
    promise.then(
      function(res){
        if(res.code == '000000'){
          $scope.uesedInfo = res.data.list;
        }
      }
    ).catch()
  })

  // 收支统计  -未入账
  .controller('MycoinunenterCtrl',function($scope,ToolService,QueryGenBonus){
    $scope.cjs = ToolService;
    var promise = QueryGenBonus.querygenbonus(1,10,'','1');
    promise.then(
      function(res){
        if(res.code == '000000'){
          $scope.unenterDate = res.data.list;
        }
      }
    ).catch()
  })


  // 交易量
  .controller("TransactionsCtrl",function($scope,$rootScope,$state,ZRHistory,QySignHisList,ToolService,DisctHisList){
    var formState="";
    $scope.cjs = ToolService;
    $scope.$on('$stateChangeSuccess', function (event, toState,toParams,from) {
      formState=from.name;
    });
    $scope.$on('$ionicView.enter',function(){
      if(formState=='tab.transactionsQSsearch'){
        $scope.rzdetail = false;
        $scope.qsdetail = true;
        $scope.zrdetail = false;
        $scope.qstxtinfo = $rootScope.qstxnStat;
        $scope.issearchqs = true;
        var promiseQS = QySignHisList.signhistory(1,10,$rootScope.qstxnStat,'','','','');
        promiseQS.then(
          function (res) {
            if(res.code == '000000'){
              $scope.qsList = res.data.lists;
            }
          }
        ).catch();
      }else if(formState=='tab.transactionsZRsearch'){
        $scope.rzdetail = false;
        $scope.qsdetail = false;
        $scope.zrdetail = true;
        $scope.zrtxtinfo = $rootScope.zrtxnStat;
        $scope.issearchzr = true;
        console.log($scope.zrtxtinfo)
        var promiseZR = ZRHistory.http(1,10,$rootScope.zrtxnStat,'','','','','');
        promiseZR.then(
          function (res) {
            if(res.code == '000000'){
              $scope.zrList = res.data.lists;
            }
          }
        ).catch();
      }else if(formState=='tab.transactionsRZsearch'){
        $scope.rzdetail = true;
        $scope.qsdetail = false;
        $scope.zrdetail = false;
        $scope.rztxtinfo = $rootScope.rztxnStat;
        $scope.issearchrz = true;
        console.log($scope.rztxtinfo)
        var promiseRZ = DisctHisList.discthislist(1,10,$rootScope.rztxnStat,'','','','');
        promiseRZ.then(
          function (res) {
            if(res.code == '000000'){
              $scope.rzList = res.data.lists;
            }
          }
        ).catch();
      }else if(formState=='tab.home'){
        $scope.rztxtinfo = '本月融资明细';
        $scope.qstxtinfo = '本月签收明细';
        $scope.zrtxtinfo = '本月转让明细';
        $scope.issearchrz = false;
        $scope.issearchqs = false;
        $scope.issearchzr = false;
        /*--融资查询--*/
        var promiseRZ = DisctHisList.discthislist(1,10,'','','',startDate,endDate);
        promiseRZ.then(
            function (res) {
              if(res.code == '000000'){
                $scope.rzList = res.data.lists;
              }
            }
        ).catch();
        /*--签收--*/
        var promiseQS = QySignHisList.signhistory(1,10,'','','',startDate,endDate);
        promiseQS.then(
            function (res) {
              if(res.code == '000000'){
                $scope.qsList = res.data.lists;
              }
            }
        ).catch();
        /*--转让--*/
        var promiseZR = ZRHistory.http(1,10,'','','','',startDate,endDate);
        promiseZR.then(
            function (res) {
              if(res.code == '000000'){
                $scope.zrList = res.data.lists;
              }
            }
        ).catch();
      }else{
        $scope.rzdetail = true;
        $scope.qsdetail = false;
        $scope.zrdetail = false;
      }
    });


    /*定义方法返回当前月份的最大日期*/
    var DateTool = function(){
      this.maxDayOfDate = function(date){
        date = arguments[0] || new Date();
        date.setDate(1);
        date.setMonth(date.getMonth() + 1);
        var time = date.getTime() - 24 * 60 * 60 * 1000;
        var newDate = new Date(time);
        return newDate.getDate();
      };
      return this;
    };
    /*获取查询的当前月份的开始时间和结束时间*/
    var gettime = new Date().toLocaleDateString().split('/');
    if(gettime[1].length != 2){
      gettime[1] = gettime[1].replace(/^/,0);
    }
    var startDate = gettime.slice(0,2).join('').concat('01');
    var endDate = gettime.slice(0,2).join('').concat(DateTool().maxDayOfDate());


    /*页面初次加载*/
    $scope.$on('$ionicView.loaded',function(){


    });


    // 融资
    $scope.rongzi=function(){
      $scope.rzdetail = true;
      $scope.qsdetail = false;
      $scope.zrdetail = false;
    };
    // 签收
    $scope.qianshou=function(){
      $scope.rzdetail = false;
      $scope.qsdetail = true;
      $scope.zrdetail = false;
    };
    // 转让
    $scope.zuangrang=function(){
      $scope.rzdetail = false;
      $scope.qsdetail = false;
      $scope.zrdetail = true;
    };

    $scope.jump=function(){
      if($scope.rzdetail) $state.go('tab.transactionsRZsearch')
      else if($scope.qsdetail) $state.go('tab.transactionsQSsearch')
      else if($scope.zrdetail) $state.go('tab.transactionsZRsearch')
    }


  })
  //签收搜索
  .controller('TransSignSearchCtrl',function($scope,$rootScope,$state){
    $scope.search = function(state){
      $rootScope.qstxnStat = state;
      $state.go('tab.transactions')
    }
  })
  //转让搜索
  .controller('TransApprSearchCtrl',function($scope,$rootScope,$state){
    $scope.search = function(state){
      $rootScope.zrtxnStat = state;
      $state.go('tab.transactions')
    }
  })
  //融资搜索
  .controller('TransDiscSearchCtrl',function($scope,$rootScope,$state){
    $scope.search = function(state){
      $rootScope.rztxnStat = state;
      $state.go('tab.transactions')
    }
  })
  //按时间筛选
  .controller('TransactionsSaixuanCtrl',function($scope,$rootScope,$state,$cordovaDatePicker){
      var sTime = '';
      var eTime = '';
      var formState = '';
      /*开始时间*/
      $scope.Startpick = function(){
        var options = {
          date: new Date(),
          mode: 'date', // or 'time' 'date'
          minDate: new Date() - 10000,
          format: 'yyyy-mm',
          linkFormat: 'yyyymm',
          allowOldDates: true,
          allowFutureDates: true,
          doneButtonLabel: 'DONE',
          doneButtonColor: '#F2F3F4',
          cancelButtonLabel: 'CANCEL',
          cancelButtonColor: '#000000',
          androidTheme:3
        };
        document.addEventListener("deviceready", function () {
          $cordovaDatePicker.show(options).then(function(date){
            sTime = date;
            $scope.st = date.toLocaleDateString().split('/').slice(0,3);
          });
        }, false);
      };
      /*结束时间*/
      $scope.Endpick = function(){
        var options = {
          date: sTime,
          mode: 'date', // or 'time' 'date'
          minDate:sTime,
          allowOldDates: false,
          allowFutureDates: true,
          doneButtonLabel: 'DONE',
          doneButtonColor: '#F2F3F4',
          cancelButtonLabel: 'CANCEL',
          cancelButtonColor: '#000000',
          androidTheme:3
        };
        document.addEventListener("deviceready", function () {
          $cordovaDatePicker.show(options).then(function(date){
            $scope.et = date.toLocaleDateString().split('/').slice(0,3);
          });
        }, false);
      };
      /*保存时间*/
      $scope.$on('$stateChangeSuccess', function (event, toState,toParams,from) {
        formState=from.name;
      });
      $scope.$on('$ionicView.enter',function(){
        if(formState=='tab.transactionsQSsearch'){
          $rootScope.qsst = $scope.st;
          $rootScope.qset = $scope.et;
        }
        if(formState=='tab.transactionsZRsearch'){
          $rootScope.zrst = $scope.st;
          $rootScope.zret = $scope.et;
        }
        if(formState=='tab.transactionsRZsearch'){
          $rootScope.rzst = $scope.st;
          $rootScope.rzet = $scope.et;
        }
      });
      /*筛选时间 跳转*/
      $scope.GoBack = function(){
        $state.go(formState);
      }



  })



;



















