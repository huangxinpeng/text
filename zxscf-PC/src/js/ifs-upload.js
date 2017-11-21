jQuery
		.extend({
			// 生成的表单
			uploadForm : null,
			// 生成的iframe
			targetIframe : null,
			createUploadIframe : function(id, uri) {
				// create frame
				var frameId = 'jUploadFrame' + id;
				
				if (window.ActiveXObject) {
					// fix ie9 and ie 10-------------
					if (BrowserDetect.version == "9"
							|| BrowserDetect.version == "10") {
						var io = document.createElement('iframe');
						io.id = frameId;
						io.name = frameId;
					} else if (BrowserDetect.version == "6"
							|| BrowserDetect.version == "7"
							|| BrowserDetect.version == "8") {
						var io = document.createElement('<iframe id="'
								+ frameId + '" name="' + frameId + '" />');
						if (typeof uri == 'boolean') {
							io.src = 'javascript:false';
						} else if (typeof uri == 'string') {
							io.src = uri;
						}
					}
				} else {
					var io = document.createElement('iframe');
					io.id = frameId;
					io.name = frameId;
				}
				io.style.position = 'absolute';
				io.style.top = '-1000px';
				io.style.left = '-1000px';

				document.body.appendChild(io);

				return io;
			},
			createUploadForm : function(id, fileElement, data, _si, _cn, _vc, _tn) {
				// create form
				var formId = 'jUploadForm' + id;
				var fileId = 'jUploadFile' + id;
				var form = jQuery('<form  action="" method="POST" name="'
						+ formId + '" id="' + formId
						+ '" enctype="multipart/form-data"></form>');
				//报文包
				if (data) {
					for(var i in data)
                        {
                        // var input = jQuery('<input type="hidden" name="'+data[i].name+'" />');
                        // input.val(data[i].value);
                        // input.appendTo(form);
                        jQuery('<input type="hidden" name="'+data[i].name+'" value="' +
                            data[i].value + '" />').appendTo(form);
                        }
				}
				// //交易码
				// if (_si) {
				// 	var siInput = jQuery('<input type="hidden" name="_si" />');
				// 	siInput.val(_si);
				// 	siInput.appendTo(form);
				// }
				//
				// //渠道码
				// if (_cn) {
				// 	var cnInput = jQuery('<input type="hidden" name="_cn" />');
				// 	cnInput.val(_cn);
				// 	cnInput.appendTo(form);
				// }
				//
				// //验证码
				// if (_vc) {
				// 	var vcInput = jQuery('<input type="hidden" name="_vc" />');
				// 	vcInput.val(_vc);
				// 	vcInput.appendTo(form);
				// }
				
				//Token
				// if (_tn) {
				// 	var tnInput = jQuery('<input type="hidden" name="_tn" />');
				// 	tnInput.val(getCookie("IFS_CAS_TOKEN"));
				// 	tnInput.appendTo(form);
				// }
				
				for ( var i = 0; i < fileElement.length; i++) {
					var oldElement = jQuery(fileElement[i]);
					//得到原input中的onchange事件的内容
					var onchangeStr = jQuery(oldElement).attr("onchange");
					var newElement = jQuery(oldElement).removeAttr("onchange").clone();
					jQuery(oldElement).attr('id', fileId+i);
					newElement.attr('value',"");
					newElement.attr('name',fileElement[i].attr('name"'));
					newElement.attr("onchange",onchangeStr);
					jQuery(oldElement).before(newElement);
					jQuery(oldElement).appendTo(form);
				}

				// set attributes
				jQuery(form).css('position', 'absolute');
				jQuery(form).css('top', '-1200px');
				jQuery(form).css('left', '-1200px');
				jQuery(form).appendTo('body');
				return form;
			},

			ajaxFileUpload : function(s) {
				// 通过交易码匹配FS路由前置
				var code = s.code;
				s.url = IFSRouterMatch.match(code);
				if (s.url == null) {
                    alert("交易码没有匹配到路由前置,无法上传文件");
					return;
				}
				s.dataType = "json";
				s.secureuri = false;

				// TODO introduce global settings, allowing the client to modify
				// them for all requests, not only timeout
				s = jQuery.extend({}, jQuery.ajaxSettings, s);
				var id = new Date().getTime();
				var form = jQuery.createUploadForm(id, s.fileElement,
						(typeof (s.data) == 'undefined' ? false : s.data),
						(typeof (s.transcode) == 'undefined' ? false : s.transcode),
						(typeof (s.channel) == 'undefined' ? false : s.channel),
						(typeof (s.vc) == 'undefined' ? false : s.vc),
						(typeof (s.token) == 'undefined' ? false : s.token));
				var io = jQuery.createUploadIframe(id, s.secureuri);
				this.uploadForm = form;
				this.targetIframe = io;
				var frameId = 'jUploadFrame' + id;
				var formId = 'jUploadForm' + id;
				// Watch for a new set of requests
				if (s.global && !jQuery.active++) {

					jQuery.event.trigger("ajaxStart");
					// 加载load
					if (s.load) {
                        //IFSConfig.showLoadingDialog("加载中...");
					}

				}
				var requestDone = false;
				// Create the request object
				var xml = {}
				if (s.global)
					jQuery.event.trigger("ajaxSend", [ xml, s ]);
				// Wait for a response to come back
				var uploadCallback = function(isTimeout) {
					var io = document.getElementById(frameId);
					try {
						if (io.contentWindow) {
							xml.responseText = io.contentWindow.document.body ? io.contentWindow.document.body.innerHTML
									: null;
							xml.responseXML = io.contentWindow.document.XMLDocument ? io.contentWindow.document.XMLDocument
									: io.contentWindow.document;

						} else if (io.contentDocument) {
							xml.responseText = io.contentDocument.document.body ? io.contentDocument.document.body.innerHTML
									: null;
							xml.responseXML = io.contentDocument.document.XMLDocument ? io.contentDocument.document.XMLDocument
									: io.contentDocument.document;
						}
					} catch (e) {
						jQuery.handleError(s, xml, null, e);
					}
					if (xml || isTimeout == "timeout") {
						requestDone = true;
						var status;
						try {
							status = isTimeout != "timeout" ? "tobechecked"
									: "error";
							// Make sure that the request was successful or
							// notmodified
							if (status != "error") {
								// process the data (runs the xml through
								// httpData regardless of callback)
								//var data = jQuery.uploadHttpData(s.load, xml,
								//		s.dataType, s.callBackFn, s.msgShow);
								// If a local callback was specified, fire it
								// and pass it the data 

								var msg = xml.responseText;
								msg = msg.substring(msg.indexOf(">{")+1,msg.indexOf("}<")+1);
								msg = $.parseJSON(msg);
								if (s.callBackFn)
									s.callBackFn(msg);

								// Fire the global callback
								if (s.global)
									jQuery.event.trigger("ajaxSuccess", [ xml,
											s ]);
							} else
								jQuery.handleError(s, xml, status);
						} catch (e) {
							status = "error";
							jQuery.handleError(s, xml, status, e);
							if(s.load){
								//cannelLoadingDialog();
							}
						}

						// The request was completed
						if (s.global)
							jQuery.event.trigger("ajaxComplete", [ xml, s ]);

						// Handle the global AJAX counter
						if (s.global && !--jQuery.active)
							jQuery.event.trigger("ajaxStop");

						// Process result

						if (s.complete)
							s.complete(xml, status);

						jQuery(io).unbind()

						setTimeout(function() {
							try {
								jQuery(io).remove();
								jQuery(form).remove();

							} catch (e) {
								jQuery.handleError(s, xml, null, e);
							}

						}, 100)

						xml = null

					}
				}
				// Timeout checker
				if (s.timeout > 0) {
					setTimeout(function() {
						// Check to see if the request is still happening
						if (!requestDone)
							uploadCallback("timeout");
					}, s.timeout);
				}
				try {

					var form = jQuery('#' + formId);
					jQuery(form).attr('action', s.url);
					jQuery(form).attr('method', 'POST');
					jQuery(form).attr('target', frameId);
					if (form.encoding) {
						jQuery(form).attr('encoding', 'multipart/form-data');
					} else {
						jQuery(form).attr('enctype', 'multipart/form-data');
					}
					jQuery(form).submit();

				} catch (e) {
					jQuery.handleError(s, xml, null, e);
				}

				jQuery('#' + frameId).load(uploadCallback);
				return {
					abort : function() {
					}
				};

			},
			handleError: function( s, xhr, status, e ) {
				// If a local callback was specified, fire it  
		        if ( s.error ) {  
		            s.error.call( s.context || s, xhr, status, e );  
		        }  
		        // Fire the global callback  
		        if ( s.global ) {  
		            (s.context ? jQuery(s.context) : jQuery.event).trigger( "ajaxError", [xhr, s, e] );  
		        } 
			},
			uploadHttpData : function(load, r, type, callBackfunc, msgShow) {
				// 卸载load
				if (load) {
                    //IFSConfig.cancelLoadingDialog();
				}

				var data = !type;
				data = type == "xml" || data ? r.responseXML : r.responseText;

				if (type == "json") {
					// var tmp = '<pre style="word-wrap: break-word;
					// white-space: pre-wrap;">';
					// var envelop = data.substring(tmp.length, data.length -
					// 6);
					// var res = eval('(' + envelop + ')');
					var res = eval('(' + data + ')');
					$(msgShow).html(res.head._rm);

					if ("" != msgShow && msgShow != undefined) {
						if(res.head._rd == 'cassessionerror') {
							removeCookie("IFS_CAS_TOKEN", {path: "/"});//清除cookies  
						}
						if ("alert" == msgShow) {
							if (res.head._rm != null && res.head._rm != "") {
								alert(res.head._rm);
							}
						} else if ("dialog" == msgShow) {
							if (res.head._rm != null && res.head._rm != "") {
								showDialog(res.head._rm);
							}
						} else {
							if (res.head._rm != null && res.head._rm != ""
									&& $(res.show) != undefined) {
								$(msgShow).html(res.head._rm);
							}
						}
					}

					if (callBackfunc != null && callBackfunc != undefined) {
						callBackfunc(res);
						return;
					}

					// $("#"+ e + "_file_path").val(res.body.data);
				}

				return data;
			}
		})

/**
 * 添加文件
 * 
 * @param inputEl
 *            当前input file
 * @param uploadForm
 *            这个file所在的form
 * @returns
 */
function addInputFile(inputEl, uploadForm) {
	var oldElement = jQuery(inputEl);
	var newElement = jQuery(oldElement).clone();
	jQuery(oldElement).attr('id',
			oldElement.attr("id") + "_tmp" + new Date().getTime());
	jQuery(oldElement).before(newElement);
	jQuery(oldElement).appendTo(uploadForm);
	jQuery(oldElement).hide();
	return jQuery(oldElement);
}

function batchUpload(e, inputEl, uploadForm, show) {
	var fileName = getFileName(e);
	var oldElement = jQuery(inputEl);
	//得到原input中的onchange事件的内容
	var onchangeStr = jQuery(oldElement).attr("onchange");
	var newElement = jQuery(oldElement).removeAttr("onchange").clone();
	var id = oldElement.attr("id") + "_tmp_" + new Date().getTime();
	jQuery(oldElement).attr('id',
			id);
	jQuery(oldElement).attr('ht-muti',
			false);
	newElement.attr('value',"");
	newElement.attr("onchange",onchangeStr);
	jQuery(oldElement).before(newElement);
	jQuery(oldElement).appendTo(uploadForm);
	jQuery(oldElement).hide();
	showFileMsg(fileName, show,id);
}

/**
 * 使用form提交的方式提交文件下载请求
 * @param url
 * @param data
 * @param code
 * @param channel
 * @param vc
 * @param token
 */
function fileDownload(url, data, _si, _cn, _vc, _tn) {
	// create form
	var form = jQuery('<form  action="' + url + '" method="POST" enctype="multipart/form-data"></form>');
	//报文包
	if (data) {
		var input = jQuery('<input type="hidden" name="envelop" />');
		input.val(data);
		input.appendTo(form);
	}
	//交易码
	if (_si) {
		var siInput = jQuery('<input type="hidden" name="_si" />');
		siInput.val(_si);
		siInput.appendTo(form);
	}
	
	//渠道码
	if (_cn) {
		var cnInput = jQuery('<input type="hidden" name="_cn" />');
		cnInput.val(_cn);
		cnInput.appendTo(form);
	}
	
	//验证码
	if (_vc) {
		var vcInput = jQuery('<input type="hidden" name="_vc" />');
		vcInput.val(_vc);
		vcInput.appendTo(form);
	}
	
	//Token
	// if (_tn) {
	// 	var tnInput = jQuery('<input type="hidden" name="_tn" />');
	// 	tnInput.val(getCookie("IFS_CAS_TOKEN"));
	// 	tnInput.appendTo(form);
	// }
	// set attributes
	jQuery(form).css('position', 'absolute');
	jQuery(form).css('top', '-1200px');
	jQuery(form).css('left', '-1200px');
	jQuery(form).appendTo('body');
	jQuery(form).submit().remove();
}

/**
 * 解析文件名称
 * @param el
 * @returns {String}
 */
function extrctorFileInfo(e) {
	var fileName = "";
	var fileSize = 0;
	if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
		el.select();

		fileName = document.selection.createRange().text;
		var extIdx = fileName.lastIndexOf("\\") + 1;
		if (extIdx > 0) {
			fileName = fileName.substr(extIdx, fileName.length);
		}
		
	} else if (window.navigator.userAgent.indexOf("Firefox") >= 1) {
		file = el.files[0];
		fileName = file.name;
		fileSize = file.size;
	} else {
		if (el.files && el.files[0]) {
			fileName = el.files[0].name;
			file = el.files[0];
			fileSize = file.size;
		}

	}
	return fileName;
}

function getFileName(e) {
	var src=e.target || window.event.srcElement; //获取事件源，兼容chrome/IE

    src.style.background='red';
    //测试chrome浏览器、IE6，获取的文件名带有文件的path路径

    //下面把路径截取为文件名

    var filename=src.value;

    //获取文件名的后缀名（文件格式）
    var fileName = filename.substring( filename.lastIndexOf('\\')+1 );
    return fileName;
}

/**
 * 显示批量上传文件的信息
 * @param el
 * @param show
 * @param id
 */
function showFileMsg(fileName, show, id) {
	if(show == "" || show == null || show == undefined) {
		return;
	}
	$("#" + show).show();

	if ( fileName != "") {
		var li = '<li class="qq-file-id-'
				+ 0
				+ '" id="li_'
				+ id
				+ '">'
				+ '<span class="qq-upload-file-selector qq-upload-file">'
				+ fileName
				+ '</span>'
				+ '<span class="qq-upload-status-text-selector qq-upload-status-text"></span>'
				+ '<a class="qq-upload-cancel-selector qq-upload-cancel" href="javascript:cancelFile(\''+id+'\')">取消</a>'
				+ '</li>';
		$("#" + show).append(li);
	}
	
}

/**
 * 取消上传的文件
 * @param id
 */
function cancelFile(id) {
	$("#" + id).remove();
	$("#li_" + id).remove();
}

/**
 * 单个文件上传时，重新选择文件
 * 
 * @param el
 * @param show
 */
function changeSelect(el, show) {
	if(show == "" || show == null || show == undefined) {
		return;
	}
	var fileName = "";
	if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
		// IE下，使用滤镜
		el.select();
		fileName = document.selection.createRange().text;
		var extIdx = fileName.lastIndexOf("\\") + 1;
		if (extIdx > 0) {
			fileName = fileName.substr(extIdx, fileName.length);
		}
		document.selection.empty();
	} else if (window.navigator.userAgent.indexOf("Firefox") >= 1) {
		file = el.files[0];
		fileName = file.name;
		fileSize = file.size;
	} else {
		if (el.files && el.files[0]) {
			fileName = el.files[0].name;
			file = el.files[0];
			fileSize = file.size;
		}

	}

	if ( fileName != "") {
		$("#" + show).find("li").remove();

		$("#" + show).show();
		var li = '<li class="qq-file-id-0">'
				+ '<span class="qq-upload-file-selector qq-upload-file">'
				+ fileName
				+ '</span>'
				+ '<span class="qq-upload-status-text-selector qq-upload-status-text"></span>'
				+ '</li>';
		$("#" + show).append(li);
	}
}


function changeFile(e, show) {
	if(show == "" || show == null || show == undefined) {
		return;
	}
	var fileName = "";
	var src=e.target || window.event.srcElement; //获取事件源，兼容chrome/IE

    src.style.background='red';
    //测试chrome浏览器、IE6，获取的文件名带有文件的path路径

    //下面把路径截取为文件名

    var filename=src.value;

    //获取文件名的后缀名（文件格式）
    fileName = filename.substring( filename.lastIndexOf('\\')+1 );
    

	if ( fileName != "") {
		$("#" + show).find("li").remove();

		$("#" + show).show();
		var li = '<li class="qq-file-id-0">'
				+ '<span class="qq-upload-file-selector qq-upload-file">'
				+ fileName
				+ '</span>'
				+ '<span class="qq-upload-status-text-selector qq-upload-status-text"></span>'
				+ '</li>';
		$("#" + show).append(li);
	}
}

/**
 * 图片预览
 * 
 * @param docObj
 * @param preview
 * @param width
 * @param height
 * @returns {Boolean}
 */
function uploadPreview(docObj, preview, width, height) {
	var imgObjPreview = document.getElementById(preview);
	if (docObj.files && docObj.files[0]) {
		// 火狐下，直接设img属性
		imgObjPreview.style.display = 'block';
		imgObjPreview.style.width = width + 'px';
		imgObjPreview.style.height = height + 'px';
		// imgObjPreview.src = docObj.files[0].getAsDataURL();

		// 火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
		imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
	} else {
		// IE下，使用滤镜
		docObj.select();
		var imgSrc = document.selection.createRange().text;
		var localImagId = document.getElementById("localImag");
		// 必须设置初始大小
		localImagId.style.width = width + 'px';
		localImagId.style.height = height + 'px';
		// 图片异常的捕捉，防止用户修改后缀来伪造图片
		try {
			localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
			localImagId.filters
					.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
		} catch (e) {
			alert("您上传的图片格式不正确，请重新选择!");
			return false;
		}
		imgObjPreview.style.display = 'none';
		document.selection.empty();
	}
}

var BrowserDetect = {
		init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
		|| this.searchVersion(navigator.appVersion)
		|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
		},
		searchString: function (data) {
		for (var i=0;i<data.length;i++) {
		var dataString = data[i].string;
		var dataProp = data[i].prop;
		this.versionSearchString = data[i].versionSearch || data[i].identity;
		if (dataString) {
		if (dataString.indexOf(data[i].subString) != -1)
		return data[i].identity;
		}
		else if (dataProp)
		return data[i].identity;
		}
		},
		searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
		},
		dataBrowser: [
		{
		string: navigator.userAgent,
		subString: "Chrome",
		identity: "Chrome"
		},
		{ string: navigator.userAgent,
		subString: "OmniWeb",
		versionSearch: "OmniWeb/",
		identity: "OmniWeb"
		},
		{
		string: navigator.vendor,
		subString: "Apple",
		identity: "Safari",
		versionSearch: "Version"
		},
		{
		prop: window.opera,
		identity: "Opera",
		versionSearch: "Version"
		},
		{
		string: navigator.vendor,
		subString: "iCab",
		identity: "iCab"
		},
		{
		string: navigator.vendor,
		subString: "KDE",
		identity: "Konqueror"
		},
		{
		string: navigator.userAgent,
		subString: "Firefox",
		identity: "Firefox"
		},
		{
		string: navigator.vendor,
		subString: "Camino",
		identity: "Camino"
		},
		{ // for newer Netscapes (6+)
		string: navigator.userAgent,
		subString: "Netscape",
		identity: "Netscape"
		},
		{
		string: navigator.userAgent,
		subString: "MSIE",
		identity: "Explorer",
		versionSearch: "MSIE"
		},
		{
		string: navigator.userAgent,
		subString: "Gecko",
		identity: "Mozilla",
		versionSearch: "rv"
		},
		{ // for older Netscapes (4-)
		string: navigator.userAgent,
		subString: "Mozilla",
		identity: "Netscape",
		versionSearch: "Mozilla"
		}
		],
		dataOS : [
		{
		string: navigator.platform,
		subString: "Win",
		identity: "Windows"
		},
		{
		string: navigator.platform,
		subString: "Mac",
		identity: "Mac"
		},
		{
		string: navigator.userAgent,
		subString: "iPhone",
		identity: "iPhone/iPod"
		},
		{
		string: navigator.platform,
		subString: "Linux",
		identity: "Linux"
		}
		]

		};
		BrowserDetect.init();