/*
 * @Author: chengdan 
 * @Date: 2017-08-21 11:13:46 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-10-24 14:57:39
 */

(function($w) {
    $(document).ready(function() {
        //url赋值
        var URLPara = getParams();
        initSelData();

        function initSelData() {
            if (IFSCommonMethod.isNotBlank(URLPara.idTpy)) {
                $("#cardType").attr("data-value", URLPara.idTpy);
            }
            if (IFSCommonMethod.isNotBlank(URLPara.prov)) {
                $("#province").attr("data-value", URLPara.prov);
            }
            if (IFSCommonMethod.isNotBlank(URLPara.city)) {
                $("#city").attr("data-value", URLPara.city);
            }
        }
        //企业名称
        $("#comNameMsg").css("display", "none");
        $("#comNameErrMsg").css("display", "none");
        $("#comName").on("focus", function() {
            $("#comNameErrMsg").css("display", "none");
            $("#comNameMsg").css("display", "block");
        });

        $("#comName").on("blur", function() {
            $("#comNameMsg").css("display", "none");
            if (IFSCommonMethod.isNotBlank($(this).val())) {
                $("#comNameMsg").css("display", "none");
                $("#comNameErrMsg").css("display", "none");
                validComName($("#comName").val());
            } else {
                $("#comNameMsg").css("display", "none");
                $("#comNameErrMsg").css("display", "block");
                $("#comNameErr").text("请输入企业名称");
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
        //加载证件类型数据字典
        IFSCommonMethod.ifsRequestDic("cardType", "900003", "1");

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
        

        //所在城市
        $("#pcErrMsg").css("display", "none");
        $("#province").on("blur", function() {
            if (IFSCommonMethod.isNotBlank($(this).val())) {
                $("#pcErrMsg").css("display", "none");
            } else {
                $("#pcErrMsg").css("display", "block");
                $("#pcErr").text("请选择省");
            }
        });
        $("#city").on("blur", function() {
            if (IFSCommonMethod.isNotBlank($(this).val())) {
                $("#pcErrMsg").css("display", "none");
            } else {
                $("#pcErrMsg").css("display", "block");
                $("#pcErr").text("请选择市");
            }
        });
        //联动加载省市信息
        $("#province").getSelInfo('0010_110004', {
            parentId: "",
            areaType: "1"
        }, "areaId", "areaName", "请选择省");
        if (IFSCommonMethod.isNotBlank($("#province").attr("data-value"))) {
            $("#city").getSelInfo('0010_110004', {
                parentId: $("#province").attr("data-value"),
                areaType: "2"
            }, "areaId", "areaName", "请选择市")
        }
        $("#province").change(function() {
            $("#city").getSelInfo('0010_110004', {
                parentId: $("#province").val(),
                areaType: "2"
            }, "areaId", "areaName", "请选择市")
        });

        //详细地址
        $("#addressMsg").css("display", "none");
        $("#addressErrMsg").css("display", "none");
        $("#address").on("focus", function() {
            $("#addressErrMsg").css("display", "none");
            $("#addressMsg").css("display", "block");
        });

        $("#address").on("blur", function() {
            $("#addressMsg").css("display", "none");
            if (IFSCommonMethod.isNotBlank($(this).val())) {
                $("#addressMsg").css("display", "none");
                $("#addressErrMsg").css("display", "none");
                validAddress($("#address").val());

            } else {
                $("#addressMsg").css("display", "none");
                $("#addressErrMsg").css("display", "block");
                $("#addressErr").text("请输入详细地址");
            }
        });

        //页面btn提交
        $("#oneToTwoBtn").on("click", function() {
            //获取页面数据
            var obj = $("#companyBaseInfo").serializeArray();
            //校验数据
            $("input[type=text],select").trigger("blur");
            var checkResult = isSubmit(obj[0]["value"], obj[1]["value"], obj[2]["value"],
                obj[3]["value"], obj[4]["value"], obj[5]["value"]);

            // //数据合法，提交数据
            if (checkResult&&fileFlag[0]&&fileFlag[1]) {
                var fileInfo = [{ "name": "attachDivOri", "id": "frontUpload" },
                    { "name": "attachDivCop", "id": "backUpload" }
                ];
                fileUpload('0010_130001', fileInfo, obj, successFun);
            }else{
                if(!fileFlag[0]||!fileFlag[1]){
                    showErrorClass(IFSConfig.entType);
                    $("#errorMsg").text("证件照片不全或有误，请确认后再提交");
                }
            }
        });

        $("#oneToTwoBtn").on("blur", function() {
            hiddenErrorClass(IFSConfig.entType);
        });


        var isSubmit = function(comName, cardType, cardNo, province, city, address) {
            var flag;
            var isInputNull = false; //输入框是否为空
            var isErrNull = true; //错误提示是否为空
            if (IFSCommonMethod.isNotBlank(comName) && IFSCommonMethod.isNotBlank(cardType) && IFSCommonMethod.isNotBlank(cardNo) &&
                IFSCommonMethod.isNotBlank(province) && IFSCommonMethod.isNotBlank(city) && IFSCommonMethod.isNotBlank(address)) {
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
                $("#errorMsg").text("企业基本信息填写不全或有误，请确认后再提交");
            }
            return flag;
        }

        //企业名称
        var validComName = function(val) {
            if (!IFSRegular.regular(IFSRegularExp.cmpnNm, val)) {
                $("#comNameMsg").css("display", "none");
                $("#comNameErrMsg").css("display", "block");
                $("#comNameErr").text("只能由中文,字母,数字,书名号或括号组成，1-50位！");
                return false;
            }
            return true;
        };

        //证件号码
        var validCardNo = function(val) {
            var exp;
            var error;
            switch ($("#cardType").val()) {
                case "0":
                    exp = IFSRegularExp.orgCode;
                    error = "组织机构代码不合法";
                    break;
                case "1":
                    exp = IFSRegularExp.businessCode;
                    error = "营业执照号码不合法";
                    break;
                case "4":
                    exp = IFSRegularExp.orgCode1;
                    error = "统一社会信用代码不合法";
                    break;
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
        };

        //详细地址
        var validAddress = function(val) {
            if (!IFSRegular.regular(IFSRegularExp.rgAdr, val)) {
                $("#addressMsg").css("display", "none");
                $("#addressErrMsg").css("display", "block");
                $("#addressErr").text("只能由中文,字母,数字或-组成，1-200位！");
                return false;
            }
            return true;
        };
        //成功回调
        var successFun = function(){
            window.location.href = "register-secondStep.html?"+encodeURI(encodeURI("v=APP_VER&idTyp="+$("#cardType").val()+"&idNo="+$("#cardNo").val()+"&custCnNm="+$("#comName").val()
               +"&prov="+$("#province").val()+'&city='+$("#city").val()+'&adr='+$("#province").find("option:selected").html()+$("#city").find("option:selected").html()+$("#address").val()+"&legalIdTyp="+URLPara.legalIdTyp));
		}

        renderDataDic();

    });
}(window));