import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import header from './components/header'

export default new Vuex.Store ({
  modules: {
    header
  }
})
