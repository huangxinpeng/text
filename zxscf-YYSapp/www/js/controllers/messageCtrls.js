/**
 * Created by haibo on 2017/8/12.
 */
/* 信息版块控制 */
angular.module('zxscf.controllers.message', [])

  //------//
  .controller('MessageCtrl',function($scope,ToolService,$ionicLoading,ReadOpt,Home,Delmessages){
    $scope.cjs = ToolService;
      $scope.dataerror = false;
    $scope.isCur=true; //已读未读消息切换
    $scope.isDel=false; //删除按钮显示隐藏
    $scope.choose="选择"; // 按钮文字
    /*未读消息*/
    var loadUnreadMsg = function(pageNum,pageSize){
      var readFlag='0';
      var unread=Home.getMsgtotal(readFlag,pageNum,pageSize);
      unread.then(
        function(res){
          if(res.code=='000000'){
            $scope.unreadmsgs=res.data.list;
            if($scope.unreadmsgs != null){
              var length=$scope.unreadmsgs.length;
            }
            if(length){
              for(var i=0;i<length;i++){
                if($scope.unreadmsgs[i].bussType=='QS01'){$scope.unreadmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //签收
                if($scope.unreadmsgs[i].bussType=='ZR01'){$scope.unreadmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //转让复核
                if($scope.unreadmsgs[i].bussType=='ZR02'){$scope.unreadmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //转让撤销复核
                if($scope.unreadmsgs[i].bussType=='RZ01'){$scope.unreadmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //融资复核
                if($scope.unreadmsgs[i].bussType=='RZ02'){$scope.unreadmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //融资撤销复核

                if($scope.unreadmsgs[i].bussType=='RZ03'){$scope.unreadmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //-融资受理核
                if($scope.unreadmsgs[i].bussType=='RZ04'){$scope.unreadmsgs[i].imgUrl='./img/icon/rongzishenhe.png'} //-融资审核
                if($scope.unreadmsgs[i].bussType=='RZ05'){$scope.unreadmsgs[i].imgUrl='./img/icon/fengkongshencha.png'} //-风控审查
                if($scope.unreadmsgs[i].bussType=='RZ06'){$scope.unreadmsgs[i].imgUrl='./img/icon/fengkongshenhe.png'} //-风控审核
                if($scope.unreadmsgs[i].bussType=='RZ07'){$scope.unreadmsgs[i].imgUrl='./img/icon/rongzishenpi.png'} //-融资审批
                if($scope.unreadmsgs[i].bussType=='RZ08'){$scope.unreadmsgs[i].imgUrl='./img/icon/jicaishenhe.pn'} //-计财审核
                if($scope.unreadmsgs[i].bussType=='JF01'){$scope.unreadmsgs[i].imgUrl='./img/icon/rongzidaoqi.png'} //-到期解付申请
                if($scope.unreadmsgs[i].bussType=='JF02'){$scope.unreadmsgs[i].imgUrl='./img/icon/fengongshenhe.png'} //-到期解付确认

                if($scope.unreadmsgs[i].bussType=='ZH01'){$scope.unreadmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //系统消息
                if($scope.unreadmsgs[i].bussType=='YH01'){$scope.unreadmsgs[i].imgUrl='./img/icon/yonghushenhe.png'} //-用户审核
                if($scope.unreadmsgs[i].bussType=='YH02'){$scope.unreadmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //系统消息
                if($scope.unreadmsgs[i].bussType=='YH03'){$scope.unreadmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //系统消息
                if($scope.unreadmsgs[i].bussType=='YH04'){$scope.unreadmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //系统消息
                if($scope.unreadmsgs[i].bussType=='XT')  {$scope.unreadmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //系统消息
              }

              $scope.ischeckedU = [];
              $scope.unreadmsgs.forEach(function(arr,i){
                arr.flag = false;
                $scope.ischeckedU[i] = arr.flag;
              });

            }
          }
        }
      );
      unread.catch(function(err){
        $scope.dataerror = true;
      })
    };
    /*已读消息*/
    var loadReadMsg = function(pageNum,pageSize){
      var readFlag='1';
      var read=Home.getMsgtotal(readFlag,pageNum,pageSize);
      read.then(function(res){
          if(res.code=='000000'){
            $scope.readmsgs=res.data.list;
            if($scope.readmsgs != null){
              var length=$scope.readmsgs.length;
            }
            if(length){
              for(var i=0;i<length;i++){
                if($scope.readmsgs[i].bussType=='QS01'){$scope.readmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //签收
                if($scope.readmsgs[i].bussType=='ZR01'){$scope.readmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //转让复核
                if($scope.readmsgs[i].bussType=='ZR02'){$scope.readmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //转让撤销复核
                if($scope.readmsgs[i].bussType=='RZ01'){$scope.readmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //融资复核
                if($scope.readmsgs[i].bussType=='RZ02'){$scope.readmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //融资撤销复核
                if($scope.readmsgs[i].bussType=='RZ03'){$scope.readmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //融资撤销复核
                if($scope.readmsgs[i].bussType=='RZ04'){$scope.readmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //系统消息
                if($scope.readmsgs[i].bussType=='RZ05'){$scope.readmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //系统消息
                if($scope.readmsgs[i].bussType=='RZ06'){$scope.readmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //系统消息
                if($scope.readmsgs[i].bussType=='RZ07'){$scope.readmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //系统消息
                if($scope.readmsgs[i].bussType=='RZ08'){$scope.readmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //系统消息
                if($scope.readmsgs[i].bussType=='JF01'){$scope.readmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //到期解付申请
                if($scope.readmsgs[i].bussType=='JF02'){$scope.readmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //到期解付确认
                if($scope.readmsgs[i].bussType=='ZH01'){$scope.readmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //系统消息
                if($scope.readmsgs[i].bussType=='YH01'){$scope.readmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //系统消息
                if($scope.readmsgs[i].bussType=='YH02'){$scope.readmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //系统消息
                if($scope.readmsgs[i].bussType=='YH03'){$scope.readmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //系统消息
                if($scope.readmsgs[i].bussType=='YH04'){$scope.readmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //系统消息
                if($scope.readmsgs[i].bussType=='XT')  {$scope.readmsgs[i].imgUrl='./img/icon/rongzishouli.png'} //系统消息
              }

              $scope.ischeckedR = [];
              $scope.readmsgs.forEach(function(arr,i){
                arr.flag = false;
                $scope.ischeckedR[i] = arr.flag;
              });

            }
          }
        }
      );
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
    $scope.$on('$ionicView.enter',function(){
      loadUnreadMsg(1);
      loadReadMsg(1);
    });

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
    };
    //全选
    $scope.doSomething=function(){
      if($scope.isCur){    /*未读消息全选*/
        if($scope.UCheckNum == $scope.ischeckedU.length){
          $scope.unreadmsgs.forEach(function(arr,i){
            arr.flag = false;
            $scope.ischeckedU[i] = arr.flag;
          })
        }else if($scope.UCheckNum != $scope.ischeckedU.length){
          $scope.unreadmsgs.forEach(function(arr,i){
            arr.flag = true ;
            $scope.ischeckedU[i] = arr.flag;
          })
        }
      } else {            /*已读消息全选*/
        if($scope.RCheckNum == $scope.ischeckedR.length){
          $scope.readmsgs.forEach(function(arr,i){
            arr.flag = false;
            $scope.ischeckedR[i] = arr.flag;
          })
        }else if($scope.RCheckNum != $scope.ischeckedR.length){
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
          return;
        }
        var promise = ReadOpt.readOpt(selectedArr);
        promise.then(
          function(res){
            if(res.code == '000000'){
              $ionicLoading.show({template: "已经标记为已读", noBackdrop: true, duration:1000});
              loadUnreadMsg(1);
              loadReadMsg(1);;
            }
          }
        ).catch()
      }else{
        $ionicLoading.show({template: "消息已经为已读", noBackdrop: true, duration:1000})
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
      var promise = Delmessages.delMsg(selectedArr);
      promise.then(
        function(res){
          if(res.code == '000000'){
            $ionicLoading.show({template: "消息已删除成功", noBackdrop: true, duration:1000})
            loadUnreadMsg(1);
            loadReadMsg(1);
          }
        }
      ).catch()
    };


  })


;
