/*
 * @Author: chengdan 
 * @Date: 2017-08-24 10:19:41 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-08-24 10:37:26
 */
(function($w) {
    $(document).ready(function() {
        //页面btn提交
        $("#fourToIndex").on("click", function() {
            $w.location.href = "/";
        });
    });
}(window));