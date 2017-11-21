/*
 * @Author: chengdan 
 * @Date: 2017-08-22 09:23:12 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-08-24 09:58:07
 */

(function($w) {
    $(document).ready(function() {
        //url赋值
        var URLPara = getParams();
        initSelData();
        function initSelData(){
            if(IFSCommonMethod.isNotBlank(URLPara.legalIdTyp)){
                $("#cardType").attr("data-value",URLPara.legalIdTyp);
            }
            if(IFSCommonMethod.isNotBlank(URLPara.idTyp)&&
                IFSCommonMethod.isNotBlank(URLPara.prov)&&
                IFSCommonMethod.isNotBlank(URLPara.city)){
                $("#twoToOneBtn").click(function(){
                    window.location.href = "../../views/register/register-firstStep.html?"+encodeURI(encodeURI("v=APP_VER&idTpy="+URLPara.idTyp+"&prov="+URLPara.prov+"&city="+URLPara.city+"&legalIdTyp="+$("#cardType").val()));
                });
            }else{
                $("#twoToOneBtn").click(function(){
                    window.location.href = "../../views/register/register-firstStep.html?v=APP_VER";
                });
            }            
        }
        //法人代表
        $("#lealPersonMsg").css("display", "none");
        $("#lealPersonErrMsg").css("display", "none");
        $("#lealPerson").on("focus", function() {
            $("#lealPersonErrMsg").css("display", "none");
            $("#lealPersonMsg").css("display", "block");
        });

        $("#lealPerson").on("blur", function() {
            $("#lealPersonMsg").css("display", "none");
            if (IFSCommonMethod.isNotBlank($(this).val())) {
                $("#lealPersonMsg").css("display", "none");
                $("#lealPersonErrMsg").css("display", "none");
                validLealPerson($("#lealPerson").val());
            } else {
                $("#lealPersonMsg").css("display", "none");
                $("#lealPersonErrMsg").css("display", "block");
                $("#lealPersonErr").text("请输入法人代表姓名");
            }
        });

        //证件类型
        $("#cardTypeErrMsg").css("display", "none");
        $("#cardType").on("blur", function() {
            if (IFSCommonMethod.isNotBlank($(this).val())) {
                $("#cardTypeErrMsg").css("display", "none");
            } else {
                $("#cardTypeErrMsg").css("display", "block");
                $("#cardTypeErr").text("请选择证件类型");
            }
        });
        $("#cardType").on("change", function() {
            $("#cardNo").focus();
        });
        //
        IFSCommonMethod.ifsRequestDic("cardType","900004","1");
        //手机号码
        $("#phoneNumErrMsg").css("display", "none");
        $("#phoneNum").on("blur", function() {
            if($(this).prop("disabled") == true){
                $("#phoneNumErrMsg").css("display", "none");
                return;
            }
            if (IFSCommonMethod.isNotBlank($(this).val())) {
                $("#phoneNumErrMsg").css("display", "none");
                validPhoneNum($("#phoneNum").val())
            } else {
                $("#phoneNumErrMsg").css("display", "block");
                $("#phoneNumErr").text("请输入手机号码");
            }
        });
        //文件上传
        $("#frontImg").click(function(){
            $("#frontUpload").trigger("click");
        });
        $("#backImg").click(function(){
            $("#backUpload").trigger("click");
        });

        //文件校验
        var fileFlag =[false,false];
        $("#backUpload").on('change',function(){
            uploadPreview(this,'backImg','135','90');
            fileFlag[1] =  checkImgFile($("#backUpload"),$("#fileErrMsg2"),"证件反面");
        });
        $("#frontUpload").on('change',function(){
            uploadPreview(this,'frontImg','135','90');
            fileFlag[0] =  checkImgFile($("#frontUpload"),$("#fileErrMsg"),"证件正面");
        });
        //证件号码
        $("#cardNoMsg").css("display", "none");
        $("#cardNoErrMsg").css("display", "none");
        $("#cardNo").on("focus", function() {
            $("#cardNoErrMsg").css("display", "none");
            $("#cardNoMsg").css("display", "block");
        });

        $("#cardNo").on("blur", function() {
            $("#cardNoMsg").css("display", "none");
            if (IFSCommonMethod.isNotBlank($(this).val())) {
                $("#cardNoMsg").css("display", "none");
                $("#cardNoErrMsg").css("display", "none");
                validCardNo($("#cardNo").val());
            } else {
                $("#cardNoMsg").css("display", "none");
                $("#cardNoErrMsg").css("display", "block");
                $("#cardNoErr").text("请输入证件号码");
            }
        });

        //页面btn提交
        $("#twoToThreeBtn").on("click", function() {
            var obj = $("#companyBaseInfo").serializeArray();
            obj = obj.concat([{name:'idTyp',value:getParams().idTyp},{name:'idNo',value:getParams().idNo}])
            if (isSubmit(obj[0]["value"], obj[1]["value"], obj[2]["value"])&&fileFlag[0]&&fileFlag[1]) {
                //$w.location.href = "register-thirdStep.html";
                var fileInfo = [{"name":"attachDivFront","id":"frontUpload"},
                    {"name":"attachDivBack","id":"backUpload"}];
                fileUpload('0010_130002',fileInfo,obj,successFun);
            }else if(!fileFlag[0]||!fileFlag[1]){
                showErrorClass(IFSConfig.entType);
                $("#errorMsg").text("文件上传不全或有误，请确认后再提交");
            }
        });

        $("#twoToThreeBtn").on("blur", function() {
            hiddenErrorClass(IFSConfig.entType);
        });


        var isSubmit = function(lealPerson, cardType, cardNo) {
            var flag = false;
            var isInputNull = false; //输入框是否为空
            var isErrNull = true; //错误提示是否为空
            if (IFSCommonMethod.isNotBlank(lealPerson) && IFSCommonMethod.isNotBlank(cardType) && IFSCommonMethod.isNotBlank(cardNo)) {
                isInputNull = true;
            }
            $(".ruleErr").each(function() {
                var tempFlag = false;
                if ($(this).css("display") == "none") {
                    tempFlag = true;
                }
                isErrNull = isErrNull && tempFlag;
            });
            flag = isInputNull && isErrNull;
            if (!flag) {
                showErrorClass(IFSConfig.entType);
                $("#errorMsg").text("法人信息填写不全或有误，请确认后再提交");
            }
            return flag;
        }

        //法人代表
        var validLealPerson = function(val) {
            if (!IFSRegular.regular(IFSRegularExp.lealPerson, val)) {
                $("#lealPersonMsg").css("display", "none");
                $("#lealPersonErrMsg").css("display", "block");
                $("#lealPersonErr").text("只能由中文和字母组成，1-20位");
                return false;
            }
            return true;
        }

        //证件号码
        var validCardNo = function(val) {
            var exp;
            var error;
            switch ($("#cardType").val()) {
                case "0":
                    exp = IFSRegularExp.idCard;
                    error = "身份证号格式不正确";
                    break;
                // case "1":
                //     exp = IFSRegularExp.hkmakao;
                //     error = "户口簿格式不正确";
                //     break;
                case "2":
                    exp = IFSRegularExp.passport;
                    error = "护照号格式不正确";
                    break;s
                case "5":
                    exp = IFSRegularExp.hkmakao;
                    error = "港澳居民来往内地通行证号格式不正确";
                    break;
                // case "6":
                //     exp = IFSRegularExp.;
                //     error = "台湾同胞来往内地通行证号格式不正确";
                //     break;
                // case "X":
                //     exp = IFSRegularExp.;
                //     error = "其他证件号";
                //     break;
                default:
                    exp = "";
                    error = "";
                    break;
            }
            if (exp != "") {
                if (!IFSRegular.regular(exp, val)) {
                    $("#cardNoMsg").css("display", "none");
                    $("#cardNoErrMsg").css("display", "block");
                    $("#cardNoErr").text(error);
                    return false;
                }
            }
            return true;
        }
         //手机号码
        var validPhoneNum = function(val) {
            if (!IFSRegular.regular(IFSRegularExp.phoneNum, val)) {
                $("#phoneNumErrMsg").css("display", "block");
                $("#phoneNumErr").text("您输入的手机号码不符合规则");
                return false;
            }
            return true;
        }
        //成功回调
        var successFun = function(){
            window.location.href = "register-thirdStep.html?"+encodeURI(encodeURI("v=APP_VER"+"&addr="+URLPara.adr+"&idNo="+URLPara.idNo+"&custCnNm="+URLPara.custCnNm+"&legal="+$("#lealPerson").val()+"&legalIdTyp="+$("#cardType").val()+"&legalIdNo="+$("#cardNo").val()+"&legalMobile="+$("#phoneNum").val()+"&idTyp="+URLPara.idTyp+"&prov="+URLPara.prov+"&city="+URLPara.city));
        }

        renderDataDic();
    });
}(window));