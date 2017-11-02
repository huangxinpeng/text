// const  hxURL='http://192.168.1.190:8083'  //张楚杰接口
// const  hxURL='http://192.168.1.185:8083'  //接口
// const  hxURL='http://192.168.1.184:8083'   //小游接口
// const  hxURL='http://192.168.1.187:8083'   //小韦接口
// const  hxURL = '//119.23.220.239:8081'   //阿里云接口
// const  hxURL='//39.108.191.78:8081'   //阿里云生产接口
// const hxURL = '//192.168.1.162:8083'
const hxURL = '//192.168.1.141:8081'

const URL = {
  //保存token和reqtype类型
  headers: {
    token: sessionStorage.getItem('token'),
    reqType: '02'
  },
  usermng: { //配置
    contract: {
      limit: `${hxURL}/usermng/contract/limit`  //合同管理
    },
    financingmng: {
      insert: `${hxURL}/usermng/financingmng/insert`,      //融资申请
    },
    appliLoan: {
      insert: `${hxURL}/usermng/appliLoan/insert`, //提交申请
      limit: `${hxURL}/usermng/appliLoan/limit`, //分页查询
    },
    appliTransferDebt: {
      application: `${hxURL}/usermng/appliTransferDebt/application`
    },
    debtbase: {
      limit: `${hxURL}/usermng/debtbase/limit`,      //分页
      select: `${hxURL}/usermng/debtbase/select`,      //前台分页
      del: `${hxURL}/usermng/debtbase/del`,           //删除
      query: `${hxURL}/usermng/debtbase/query`, //查询id
      insert: `${hxURL}/usermng/debtbase/insert`, //应收账款新增
      edit: `${hxURL}/usermng/debtbase/edit`,       //修改
      condition: `${hxURL}/usermng/debtbase/condition`,     //条件查询
      array: `${hxURL}/usermng/debtbase/array`//导入
    },
    custaccount: {
      insert: `${hxURL}/usermng/custaccount/insert`,      //新增
      limit: `${hxURL}/usermng/custaccount/limit`,      //分页
      del: `${hxURL}/usermng/custaccount/del`,      //删除
      edit: `${hxURL}/usermng/custaccount/edit`,      //修改
      query: `${hxURL}/usermng/custaccount/query`,      //查询id
      condition: `${hxURL}/usermng/custaccount/condition`,     //条件查询
      select: `${hxURL}/usermng/custaccount/select`     //前台分页
    },
    userinfomng: {
      del: `${hxURL}/usermng/userinfomng/del`,      //删除
      limit: `${hxURL}/usermng/userinfomng/limit`,      //分页
      query: `${hxURL}/usermng/userinfomng/query`,      //查询id
      edit: `${hxURL}/usermng/userinfomng/edit`,      //修改
      insert: `${hxURL}/usermng/userinfomng/insert`     //新增
    }
  },
  external: {
    register: `${hxURL}/external/register`,      //注册
    sessionTel: `${hxURL}/external/sessionTel`,      //获取手机验证码接口
    sessionVali: `${hxURL}/external/sessionVali`,      //图片认证
    isUserName: `${hxURL}/external/isUserName`     //验证用户
  },
  pageLogin: {
    login: `${hxURL}/pageLogin/login`     //登录
  },
  userQualiation: {
    addUserManage: `${hxURL}/userQualiation/addUserManage`, //保存用户信息
    selUserManage: `${hxURL}/userQualiation/selUserManage`, //查询用户信息
    goHttpUserManage: `${hxURL}/userQualiation/goHttpUserManage`//发起认证
  },
  // -----------------------------------------------------------------
  generalQry: {
    contract: `${hxURL}/usermng/contract/limit`,
    debet: `${hxURL}/integratedquery/iouquery`,
    transfer: `${hxURL}/integratedquery/query`,
    repayRecord: `${hxURL}/integratedquery/payment-history`
  },
  userMoney: `${hxURL}/userQualiation/userMoneyNumber`,
  poolDebet: {
    download: `${hxURL}/publicmng/excelservlet/downloadExcel`,
    upload: `${hxURL}/publicmng/excelservlet/addall`
  },
  logout: `${hxURL}/pageLogin/cancellation`
}
export default URL
