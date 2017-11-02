import Axios from 'axios'
// import Router from '@/router'
import Router from '@/router/index.js'
// import url from '@/store/url'
import url from '@/http/url.js'
// import { Message } from 'element-ui'
const axios = Axios.create({
  // baseURL: url.baseURL,
  baseURL: url.hxURL
})
axios.interceptors.request.use(
  config => {
    config.headers['token']=sessionStorage.getItem('token'),
    config.headers['reqType']='02'
    console.log(config)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
axios.interceptors.response.use(
  response => {
    console.log(response)
    return response
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)
export default axios
