import Vue from 'vue'
import Router from 'vue-router'
Vue.http.interceptors.push((request, next)  =>{
    var a= true;
    if(a){
      request.headers.set('reqType', '02')
    }
    
    console.log(request.headers)
    
    next((response) => {
        console.log(response.status)
        return response
    });
   
})