import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Headers from '@/components/header.vue'
import Footers from '@/components/footder.vue'
import Banner from '@/components/banner.vue'
import Content from '@/components/content.vue'
import Ligon from '@/components/ligon.vue'
import product from '@/components/product.vue'
import contDown from '@/components/contDown.vue' //合同下载
/*-----*/
import Register from '@/components/pages/Register.vue'
import Opinstructions from '@/components/pages/Opinstructions.vue'
import ContactUS from '@/components/pages/ContactUS.vue'
import Login from '@/components/pages/Login.vue'
import Homepage from '@/components/pages/Homepage.vue'
import Success from '@/components/pages/Success.vue'
import ChangePwd from '@/components/pages/ChangePwd.vue'
import BankCardInfo from '@/components/pages/BankCardInfo.vue'
import PoolContMng from '@/components/pages/PoolContMng.vue'
import PoolDebtMng from '@/components/pages/PoolDebtMng.vue'
import PoolDebtAdd from '@/components/pages/PoolDebtAdd.vue'
import PoolLoanInfo from '@/components/pages/PoolLoanInfo.vue'
import DebtAdd from '@/components/pages/DebtAdd.vue'
import EnterpriseInfo from '@/components/pages/EnterpriseInfo.vue'
import userMng from '@/components/pages/userMng.vue'
import countMng from '@/components/pages/countMng.vue'
import query from '@/components/pages/countMng.vue'
import ContDownload from '@/components/pages/ContDownload.vue'
import receivableMng from '@/components/pages/receivableMng.vue'
import LoanApplyMng from '@/components/pages/LoanApplyMng.vue'
import DebtAssignment from '@/components/pages/DebtAssignment.vue'
import PoolAssignment from '@/components/pages/PoolAssignment.vue'
import GeneralQry from '@/components/pages/GeneralQry.vue'
import UserDetails from '@/components/pages/userDetails.vue'
import debloanApply from '@/components/pages/debloanApply.vue'
import Details from '@/components/pages/details.vue'
import LoanApply from '@/components/pages/LoanApply.vue'




Vue.use(Router)
export default new Router({
  routes: [
    //404页面
    {
      path: '*',
      component: Banner
    },
    {
      path: '/product', //产品
      name: 'product',
      component: product
    },
    {
      path: '/contDown',
      name: 'contDown',
      component: contDown
    },
    {
      path: '/a',
      name: 'Hello',
      component: Hello
    },
    {
      path: 'vue', //最外层组件
      name: 'Vue',
      component: Vue
    },
    {
      path: '/header', //头部
      name: 'Headers',
      component: Headers
    },
    {
      path: '/content', //内容主题
      name: 'Content',
      component: Content
    },
    {
      path: '/contactUS', //联系我们
      name: 'ContactUS',
      component: ContactUS
    },
    {
      path: '/',//banner
      name: 'Banner',
      component: Banner
    },
    {
      // path: '/footer',
      path: '/footers',//底部
      name: 'Footers',
      component: Footers
    },
    {
      path: '/ligon',//登录成功头部-------
      name: 'Ligon',
      component: Ligon
    },
    {
      path: '/register',//用户注册
      name: 'Register',
      component: Register
    },
    {
      path: '/Opinstructions',//操作指引
      name: 'Opinstructions',
      component: Opinstructions
    },
    {
      path: '/login',//用户登录
      name: 'Login',
      component: Login
    },
    {
      path: '/homepage',//用户主页
      name: 'Homepage',
      component: Homepage
    },
    {
      path: '/success',//登录成功
      name: 'Success',
      component: Success
    },
    {
      path: '/LoanApply',//意向融资
      name: 'LoanApply',
      component: LoanApply
    },
    {
      path: '/changePwd',//修改密码
      name: 'ChangePwd',
      component: ChangePwd
    },
    {
      path: '/bankCardInfo',//银行卡管理
      name: 'BankCardInfo',
      component: BankCardInfo
    },
    {
      path: '/poolDebtAdd',//池保理单笔应收账款新增
      name: 'PoolDebtAdd',
      component: PoolDebtAdd
    },
    {
      path: '/poolContMng',//池保理合同管理
      name: 'PoolContMng',
      component: PoolContMng
    },
    {
      path: '/PoolAssignment',//池保理转让管理
      name: 'PoolAssignment',
      component: PoolAssignment
    },


    {
      path: '/debtAdd',//单保理应收账款新增页面
      name: 'DebtAdd',
      component: DebtAdd
    },
    {
      path: '/poolDebtMng',//池保理应收账款管理页面
      name: 'PoolDebtMng',
      component: PoolDebtMng
    },
    {
      path: '/poolLoanInfo',//池保理放款信息查询
      name: 'PoolLoanInfo',
      component: PoolLoanInfo
    },
    {
      path: '/UserDetails',//用户详情页面
      name: 'UserDetails',
      component: UserDetails
    },


    //--------------用户/基础/查询统计
    {
      path: '/enterpriseInfo',//企业信息管理页面
      name: 'EnterpriseInfo',
      component: EnterpriseInfo
    },
    {
      path: '/userMng',//企业账户管理页面
      name: 'userMng',
      component: userMng
    },
    {
      path: '/countMng',//企业操作用户管理页面
      name: 'countMng',
      component: countMng
    },
    {
      path: '/generalQry',//综合查询
      name: 'GeneralQry',
      component: GeneralQry
    },
    {
      path: '/Details',//借据详情
      name: 'Details',
      component: Details
    },
    //定保理业务管理
    {
      path: '/debtAssignment',//应收账款转让申请
      name: 'DebtAssignment',
      component: DebtAssignment
    },
    {
      path: '/contDownload',//保理合同签订下载
      name: 'ContDownload',
      component: ContDownload
    },
    {
      path: '/debloanApply',//定保理融资申请
      name: 'debloanApply',
      component: debloanApply
    },

    {
      path: '/receivableMng',//应收账款管理页面
      name: 'receivableMng',
      component: receivableMng
    },
    {
      path: '/LoanApplyMng',//放款申请
      name: 'LoanApplyMng',
      component: LoanApplyMng
    }
  ]
})



