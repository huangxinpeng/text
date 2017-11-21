var public={
  openId:function(){
    //return openId='012';
    return openId=getParams().openId;
  }
};
//引用公用
var openId=public.openId();
//console.log(openId);
