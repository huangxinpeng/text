    // The Vue build version to load with the `import` command
    // (runtime-only or standalone) has been set in webpack.base.conf with an alias.
    import Vue from 'vue'
    import Vuex from 'vuex'
    import router from './router'
    import axios from 'axios'
    import vueresource from 'vue-resource'
    import App from './App'
    import jquert from 'jquery'
    import Axios  from '@/cooike/index.js'

    import componentTitle from '@/components/global/title'
    import store from '@/store'
    Vue.use(Vuex)
    Vue.use(vueresource)
    Vue.component('e-title', componentTitle)
    // Vue.prototype.$http=Axios
    Vue.config.productionTip = false
    Vue.http.headers.common['token'] = sessionStorage.getItem('token')
    new Vue({
      el: '#app',
      router,
      store,
      template: '<App/>',
      components: { App }
    })
   
