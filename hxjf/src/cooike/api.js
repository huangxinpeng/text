// 当cookie改变状态
export function tokenchangge() {
            var tokens= sessionStorage.getItem('token')
           if(tokens!=null){
             
           }else{
            alert("请先登录")
            this.$router.push('/login')
           }
}
