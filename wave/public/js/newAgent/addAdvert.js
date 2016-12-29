/*
 *global
 */
var allPage = {};
allPage.renderDateSelector = function(initialValueStart, initialValueEnd) {
	var startSelector = rome(startDate, {
		time: false,
		initialValue: getDateStr(initialValueStart),
		dateValidator: rome.val.beforeEq(endDate)
	});
	var endSelector = rome(endDate, {
		time: false,
		initialValue: getDateStr(initialValueEnd),
		dateValidator: rome.val.afterEq(startDate)
	});
}

/*
 * new_addAd
 */
var addAdvert = {};
addAdvert.zoneTypes = {};
addAdvert.sceneTypes = {};
addAdvert.step = 1;
addAdvert.imgUrls = {'img': []};
addAdvert.init = function() {
	allPage.renderDateSelector();

	//this.getChildAccount();
	this.renderPage();
	this.bindStepEvent();
	this.uploadImg();

	this.renderPiriodSelector("piriod-selector");
}

//获取所有子账号
/*addAdvert.getChildAccount = function() {
	$.ajax({
		url: BASEURL + 'admin/api/ChildAccountGet',
		type: 'POST',
		dataType: 'json'
	})
	.done(function(data) {
		if(data.success) {
			var html = '';
			if(data.data.length <= 0){
				var html = '<li id="child-all" data-childid="undefined" data-phone="undefined"><a>暂无子账号</a></li>';
			}
			for(var i = 0; i < data.data.length; i++) {
				var userInfo = data.data[i];
				html += '<li data-childid="' + userInfo.uid + '" data-phone="' + userInfo.phone + '"><a>' + userInfo.phone + '</a></li>';
			}
			$("#child-account-select .dropdown-menu").html(html);
		}
	})
	.fail(function(data) {
		console.log("error");
	});
	$(document).on("click", "#child-account-select .dropdown-menu>li", function() {
		$(this).parents("#child-account-select").attr("data-childid", $(this).attr("data-childid"));
		addAdvert.reviewData();
	});
}*/


addAdvert.renderPiriodSelector = function(dom) {
	var html = [];
	var weekdayArr = ["", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
	for (var i = 0; i < 8; i++) {
		html.push('<div class="piriod-weekday clearfix">');
		if(i == 0) {
			html.push('<div class="none-select fl">' + weekdayArr[i] + '</div>');
			for (var j = 0; j < 24; j++) {
				var space = "";
				if(j % 6 == 0) {
					space = " space";
				}
				html.push('<div class="piriod-select' + space + ' active fl"><span class="fa fa-arrow-down"></span></div>');
			}
		} else {
			html.push('<div class="weekday-select fl"><label><input type="checkbox" id="weekday-check-' + i + '" class="regular-checkbox" checked><label for="weekday-check-' + i + '"></label>' + weekdayArr[i] + '</label></div>');
			for (var j = 0; j < 24; j++) {
				var space = "";
				if(j % 6 == 0) {
					space = " space";
				}
				html.push('<div class="piriod-hour' + space + ' active fl">' + j + '</div>');
			}
		}

		html.push('</div>');
	}
	$("#"+dom).html(html.join(""));

	$("#"+dom).find(".weekday-select input[type='checkbox']").on("change", function() {
		var hour = $(this).parents(".weekday-select").siblings(".piriod-hour");
		if($(this).prop("checked")) {
			hour.addClass("active");
		} else {
			hour.removeClass("active");
		}
	});
	$("#"+dom).find(".piriod-select").on("click", function() {
		var hour = $(this).parents(".piriod-selector").find(".piriod-weekday").find(".piriod-hour:eq(" + $(".piriod-select").index($(this)) + ")");
		$(this).toggleClass("active");
		if($(this).hasClass("active")) {
			hour.addClass("active");
		} else {
			hour.removeClass("active");
		}
	});
	$("#"+dom).find(".piriod-hour").on("click", function() {
		if($(this).hasClass("active")) {
			$(this).removeClass("active");
		} else {
			$(this).addClass("active");
		}
	});

	$("input[name='piriod']").on("change", function() {
		if($("#piriod-1").prop("checked")) {
			$("#piriod-selector-box").addClass("active");
		} else {
			$("#piriod-selector-box").removeClass("active");
		}
	});
}

addAdvert.bindStepEvent = function() {
	if($(".step-process>li").length > 0) {
		checkStep(addAdvert.step);
		$("#next-step").on("click", function() {
			if(addAdvert.step == 1) {
				/*if($("#child-account-select").attr("data-childid") == "") {
					layer.alert("请选择子账号");
					return;
				}*/
				if($("#ad-name").val() == "") {
					layer.alert("请输入广告名称");
					return;
				}
				if($("#startDate").val() == "") {
					layer.alert("请选择开始日期");
					return;
				}
				if($("#daily-budget").val() == "") {
					layer.alert("请输入您的每日预算");
					return;
				}
				if($("#piriod-1").prop("checked") && $("#piriod-selector").find(".piriod-hour.active").length == 0) {
					layer.alert("请选择投放时段");
					return;
				}
				if($("#hasTimeEnd").prop("checked") && $("#endDate").val() == "") {
					layer.alert("请选择结束日期");
					return;
				}
				$("#hasTimeEnd").on("change", function() {
					if($(this).prop("checked")) {
						$("#endDate").prop("disabled", false);
					} else {
						$("#endDate").prop("disabled", true);
					}
				});
			}
			if(addAdvert.step == 2) {
				if($("#areas-2").prop("checked") && $("#region-selector-box input[type='checkbox']:checked").length == 0) {
					layer.alert("请选择投放省市");
					return;
				}
				if($("#areas-3").prop("checked") && $("#zone-selector-box input[type='checkbox']:checked").length == 0) {
					layer.alert("请选择投放行政区/商圈");
					return;
				}
				if($("#scenes-2").prop("checked") && $("#scene-review-list").children("li").length == 0) {
					layer.alert("请选择推广场景");
					return;
				}
				if($("#scenes-3").prop("checked") && $("#scene-diy-review-list").children("li").length == 0) {
					layer.alert("请选择推广场景");
					return;
				}
			}
			addAdvert.step++;
			checkStep(addAdvert.step);
			addAdvert.reviewData();
		});
		$("#prev-step").on("click", function() {
			addAdvert.step--;
			checkStep(addAdvert.step);
			addAdvert.reviewData();
		});
		$("#save-step").on("click", function() {
			if(addAdvert.imgUrls.img.length == 0) {
				layer.alert("请上传推广图片");
				return false;
			}
			if($("#add-ad-url").val() == "") {
				layer.alert("请输入推广链接");
				return false;
			}
			addAdvert.bindDataEvent();  //组装返回数据
		});
	}
	function checkStep(step) {
		$(window).scrollTop(0);
		$(".step-process").children("li").removeClass("active");
		$(".step-process").children("li").eq(step - 1).addClass("active");
		$(".add-ad-step").removeClass("active");
		$(".add-ad-step" + step).addClass("active");
		if(step == 1) {
			$("#prev-step").hide();
			$("#next-step").show();
			$("#save-step").hide();
			$(".step-process").children("li").removeClass("done");
		} else if (step == $(".step-process>li").length) {
			$("#prev-step").show();
			$("#next-step").hide();
			$("#save-step").show();
			$(".step-process").children("li").addClass("done");
			$(".step-process").children("li").last().removeClass("done");
		} else {
			$("#prev-step").show();
			$("#next-step").show();
			$("#save-step").hide();
			$(".step-process").children("li").removeClass("done");
			$(".step-process").children("li:lt(" + (step - 1) + ")").addClass("done");
		}
	}
}

addAdvert.renderPage = function() {
	//$('.loading-area').fadeIn();
	$.ajax({
		url: BASEURL + 'admin/api/getMessagesPushJson',
		type: 'GET',
		dataType: 'json'
	})
	.done(function(data) {
		if(data.success) {
			addAdvert.zoneTypes = data.result.areaJson;
			addAdvert.sceneTypes = data.result.sceneJson;
			addAdvert.scenesMessage = data.result.scenesMessage;
			for(var key in data.result) {
				if(key == "areas" || key == "scenes") {
					$(".add-ad-step2").append(makeRadiobox(key, data.result[key]));
				} else if (key == "areaJson") {
					getRegionBox();
				} else if (key == "sceneJson") {
					getSceneBox();
				} else if (key == "scenesMessage") {
					getDiySceneBox();
				} else {
					$(".add-ad-step2").append(makeCheckbox(key, data.result[key]));
				}
			}

			addAdvert.bindSelectEvent();
			addAdvert.getRegionSelector("#region-selector-box", addAdvert.zoneTypes);
			addAdvert.getZoneDropdown();
			addAdvert.bindRegionEvent();

			addAdvert.getSceneSelector("#scene-selector-box", addAdvert.sceneTypes);
			addAdvert.bindSceneEvent();
			addAdvert.getDiySceneSelector("#scene-diy-selector-box", addAdvert.scenesMessage);
			addAdvert.bindDiySceneEvent();

			//$('.loading-area').fadeOut();
		}
	})
	.fail(function() {
		console.log("error");
	});
	addAdvert.reviewData();

	function makeCheckbox(key, data) {
		var html = '<div class="form-group"><label>' + data.name + '</label><div>';
		for(var i = 0, len = data.data.length; i < len; i++) {
			if(i == 0) {
				html += '<label class="radio-inline pointer select-all">';
				html += '	<input name="' + key + '" id="' + key + '-all" class="regular-radio" type="radio" value="' + data.data[i].id + '" checked="">';
				html += '	<label for="' + key + '-all"></label>';
				html += '	<span class="radio-name">' + data.data[i].text + '</span>';
				html += '</label>';
			} else {
				html += '<label class="checkbox-inline pointer select">';
				html += '	<input name="' + key + '" id="' + key + '-' + data.data[i].id + '" class="regular-checkbox" type="checkbox" value="' + data.data[i].id + '">';
				html += '	<label for="' + key + '-' + data.data[i].id + '"></label>';
				html += '	<span class="checkbox-name">' + data.data[i].text + '</span>';
				html += '</label>';
			}
		}
		html += '</div></div>';
		return html;
	}

	function makeRadiobox(key, data) {
		var html = '<div class="form-group"><label>' + data.name + '</label><div>';
		for(var i = 0, len = data.data.length; i < len; i++) {
			if(i == 0) {
				html += '<label class="radio-inline pointer select-all">';
				html += '	<input name="' + key + '" id="' + key + '-all" class="regular-radio" type="radio" value="' + data.data[i].id + '" checked="">';
				html += '	<label for="' + key + '-all"></label>';
				html += '	<span class="radio-name">' + data.data[i].text + '</span>';
				html += '</label>';
			} else {
				html += '<label class="radio-inline pointer select">';
				html += '	<input name="' + key + '" id="' + key + '-' + data.data[i].id + '" class="regular-radio" type="radio" value="' + data.data[i].id + '">';
				html += '	<label for="' + key + '-' + data.data[i].id + '"></label>';
				html += '	<span class="radio-name">' + data.data[i].text + '</span>';
				html += '</label>';
			}
		}
		html += '</div></div>';
		return html;
	}

	function getRegionBox() {
		$(".add-ad-step2").append($("#region-selector-box").detach());
		$(".add-ad-step2").append($("#zone-selector-box").detach());
	}

	function getSceneBox() {
		$(".add-ad-step2").append($("#scene-selector-box").detach());
	}

	function getDiySceneBox() {
		$(".add-ad-step2").append($("#scene-diy-selector-box").detach());
	}
}



addAdvert.isDirect = function(text){
	var isDirect = text == '北京市' || text == '上海市' || text == '天津市' || text == '重庆市' || text == '澳门特别行政区' || text == '香港特别行政区' || text == '台湾省';
	return isDirect;
}


addAdvert.bindSelectEvent = function() {
	$("#hasTimeEnd").on("change", function() {
		if($(this).prop("checked")) {
			$("#endDate").prop("disabled", false);
		} else {
			$("#endDate").prop("disabled", true);
		}
	});
	$(".select-all>input").on("change", function() {
		if($(this).prop("checked")) {
			$(this).parent().siblings(".select").children("input").prop("checked", false);
		}
	});
	$(".select-all").siblings(".select").children("input[type=checkbox]").on("change", function() {
		var checked = $(this).parent().parent().children(".select").children("input[type=checkbox]:checked");
		var children = $(this).parent().parent().children(".select").children("input[type=checkbox]");
		var all = $(this).parent().siblings(".select-all").children("input");
		if(checked.length == 0 || checked.length == children.length) {
			all.prop("checked", true);
			children.prop("checked", false);
		} else {
			all.prop("checked", false);
		}
	});
	$("#areas-2").on("change", function() {
		if($(this).prop("checked")) {
			$("#zone-selector-box").removeClass("active");
			$("#region-selector-box").addClass("active");
		} else {
			$("#region-selector-box").removeClass("active");
		}
	});
	$("#areas-3").on("change", function() {
		if($(this).prop("checked")) {
			$("#region-selector-box").removeClass("active");
			$("#zone-selector-box").addClass("active");
		} else {
			$("#zone-selector-box").removeClass("active");
		}
	});
	$("#areas-all").on("change", function () {
		if($(this).prop("checked")) {
			$("#region-selector-box").removeClass("active");
			$("#zone-selector-box").removeClass("active");
		}
	});
	$("#scenes-2").on("change", function () {
		if($(this).prop("checked")) {
			$("#scene-diy-selector-box").removeClass("active");
			$("#scene-selector-box").addClass("active");
		} else {
			$("#scene-selector-box").removeClass("active");
		}
	});
	$("#scenes-3").on("change", function () {
		if($(this).prop("checked")) {
			$("#scene-selector-box").removeClass("active");
			$("#scene-diy-selector-box").addClass("active");
		} else {
			$("#scene-diy-selector-box").removeClass("active");
		}
	});
	$("#scenes-all").on("change", function () {
		if($(this).prop("checked")) {
			$("#scene-selector-box").removeClass("active");
			$("#scene-diy-selector-box").removeClass("active");
		}
	});

	$(".form-group input").on("change blur", function() {
		addAdvert.reviewData();
	});

	$("#img-review").on("click", ".close-btn", function() {
		if($(this).parents("li").index() == $("#img-review").find("li").length - 1) {
			$('.preview-screen').empty();
		}
		$(this).parents("li").remove();
		addAdvert.imgUrls.img.splice($(this).parents("li").index(), 1);
		$("#img-count").text(addAdvert.imgUrls.img.length);
	});
	$("#img-review").on("click", ".close-all-btn", function() {
		layer.confirm("确认删除全部广告？", {
			btn: ['确定', '取消'] //按钮
		}, function(){
			$("#img-review").children("ul").empty();
			$('.preview-screen').empty();
			addAdvert.imgUrls.img = [];
			$("#img-count").text(0);
			layer.msg("删除成功", {
				time: 1000
			});
		}, function(){});
	});

	$("#ad-name").on("propertychange input", function() {
		if($(this).val().length > 20) {
			$(this).val($(this).val().substring(0, 20));
		}
	});
	$("#daily-budget").on("propertychange input", function() {
		if(isNaN($(this).val())) {
			$(this).val("");
			layer.alert("请输入数字");
		}
	});
	$("#daily-budget").on("blur", function() {
		if(!isNaN($(this).val()) && parseInt($(this).val()) < 1000) {
			layer.alert("请输入大于等于1000的数字");
			return;
		}
		if(!isNaN(parseInt($(this).val()))) {
			$(this).val(parseInt($(this).val()));
		}
	});

	$("#tab-phone").on("click", function() {
		$(".preview-tab").removeClass("active");
		$(this).addClass("active");
		$(".preview-content").removeClass("active");
		$(".preview-phone").addClass("active");
	});
	$("#tab-pad").on("click", function() {
		$(".preview-tab").removeClass("active");
		$(this).addClass("active");
		$(".preview-content").removeClass("active");
		$(".preview-pad").addClass("active");
	});
}

addAdvert.getRegionSelector = function(dom, data) {
	var province = data;
	var html = "";
	var reviewHtml = "";
	if(province != undefined) {
		for(var i = 0, ilen = province.length; i < ilen; i++) {
			var name = province[i].text.replace(/市|省|壮族|回族|维吾尔|自治区|特别行政区/g, "");
			html += '<li title="' + name + '"><label class="checkbox-inline pointer"><input name="region" id="region-province-' + province[i].id + '" class="regular-checkbox region-lv1" type="checkbox" value="' + province[i].id + '"><label for="region-province-' + province[i].id + '"></label><span class="checkbox-name">' + name + '</span></label>';
			reviewHtml += '<li title="' + name + '" data-rid="region-province-' + province[i].id + '"><p>' + name + '<span class="fa fa-close pointer"></span></p>';
			var isDirect = addAdvert.isDirect(province[i].text);
			if(!isDirect && province[i].put_city != undefined) {
				var city = province[i].put_city;
				html += '<ul class="city-select-list">';
				reviewHtml += '<ul class="city-review-list clearfix">';
				for(var j = 0, jlen = city.length; j < jlen; j++) {
					html += '<li title="' + city[j].text + '"><label class="checkbox-inline pointer"><input name="region" id="region-city-' + city[j].id + '" class="regular-checkbox region-lv2" type="checkbox" value="' + city[j].id + '"><label for="region-city-' + city[j].id + '"></label><span class="checkbox-name">' + city[j].text + '</span></label></li>';
					reviewHtml += '<li title="' + city[j].text + '" data-rid="region-city-' + city[j].id + '" class="fl">' + city[j].text + '<span class="fa fa-close pointer"></span></li>';
				}
				html += '</ul>';
				reviewHtml += '</ul>';
			}

			html += '</li>';
			reviewHtml += '</li>';
		}
	}

	$(dom + " .region-select-list").html(html);
	$(dom + " .region-review-list").html(reviewHtml);
}

addAdvert.getZoneSelector = function(dom, data) {
	var city = data.put_area != undefined ? data.put_area : data.put_city;
	var html = "";
	var reviewHtml = "";

	for(var i = 0, ilen = city.length; i < ilen; i++) {
		var name = city[i].text;
		html += '<li title="' + name + '"><label class="checkbox-inline pointer"><input name="region" id="region-area-' + city[i].id + '" class="regular-checkbox region-lv1" type="checkbox" value="' + city[i].id + '"><label for="region-area-' + city[i].id + '"></label><span class="checkbox-name">' + name + '</span></label>';
		reviewHtml += '<li title="' + name + '" data-rid="region-area-' + city[i].id + '"><p>' + name + '<span class="fa fa-close pointer"></span></p>';

		var zone = city[i].put_zone != undefined ? city[i].put_zone : city[i].put_area;
		html += '<ul class="city-select-list">';
		reviewHtml += '<ul class="city-review-list clearfix">';
		for(var j = 0, jlen = zone.length; j < jlen; j++) {
			html += '<li title="' + zone[j].text + '"><label class="checkbox-inline pointer"><input name="region" id="region-zone-' + zone[j].id + '" class="regular-checkbox region-lv2" type="checkbox" value="' + zone[j].id + '"><label for="region-zone-' + zone[j].id + '"></label><span class="checkbox-name">' + zone[j].text + '</span></label></li>';
			reviewHtml += '<li title="' + zone[j].text + '" data-rid="region-zone-' + zone[j].id + '" class="fl">' + zone[j].text + '<span class="fa fa-close pointer"></span></li>';
		}
		html += '</ul>';
		reviewHtml += '</ul>';

		html += '</li>';
		reviewHtml += '</li>';
	}


	$(dom + " .region-select-list").html(html);
	$(dom + " .region-review-list").html(reviewHtml);
}

addAdvert.getZoneDropdown = function() {
	var province = this.zoneTypes;
	var html = "";
	for(var i = 0, ilen = province.length; i < ilen; i++) {
		if(i == 0) {
			$("#province-dropdown .dropdown-toggle").html("请选择省份");
			//$("#province-dropdown .dropdown-toggle").parent().attr("data-provinceid", province[i].id);
		}
		html += '<li data-provinceId="' + province[i].id + '">' + province[i].text + '</li>';
	}
	$("#province-dropdown .dropdown-menu").html(html);

	//addAdvert.getZoneList(addAdvert.zoneTypes[0]);
	this.bindZoneEvent();
}

addAdvert.getZoneCityDropdown = function(data) {
	var city = data.put_city;
	var html = "";
	for(var i = 0, ilen = city.length; i < ilen; i++) {
		if(i == 0) {
			$("#city-dropdown .dropdown-toggle").html("请选择城市");
			//$("#city-dropdown .dropdown-toggle").parent().attr("data-cityId", city[i].id);
		}
		html += '<li data-cityId="' + city[i].id + '">' + city[i].text + '</li>';
	}
	$("#city-dropdown .dropdown-menu").html(html);
	//addAdvert.getZoneList(city[0]);
	this.bindZoneCityEvent(city);
}

addAdvert.bindZoneEvent = function() {
	$(document).on("click", "#province-dropdown .dropdown-menu>li", function() {
		var data = addAdvert.zoneTypes[$(this).index()];
		if(addAdvert.isDirect(data.text)) {
			addAdvert.getZoneList(data);
			$("#city-dropdown").hide();
		} else {
			addAdvert.getZoneCityDropdown(data);
			$("#zone-selector-box .region-review-list").empty();
			$("#zone-selector-box .region-select-list").empty();
			$("#city-dropdown").show();
		}
		$(this).parents(".dropdown-click").attr("data-provinceid", $(this).attr("data-provinceid"));
	});
}

addAdvert.bindZoneCityEvent = function (cityData) {
	$(document).on("click", "#city-dropdown .dropdown-menu>li", function() {
		var data = cityData[$(this).index()];
		addAdvert.getZoneList(data);
		$(this).parents(".dropdown-click").attr("data-cityid", $(this).attr("data-cityid"));
	});
}

addAdvert.bindRegionEvent = function() {
	$(".region-select-all input").on("change", function() {
		if($(this).prop("checked")) {
			$(this).parents(".region-select-all").siblings(".region-select-list").find("input").prop("checked", true);
			//review
			$(this).parents(".region-selector-box").find(".region-review-list li").addClass("review-show");
		} else {
			$(this).parents(".region-select-all").siblings(".region-select-list").find("input").prop("checked", false);
			//review
			$(this).parents(".region-selector-box").find(".region-review-list li").removeClass("review-show");
		}
	});

	$(".region-select-list").on("change", ".region-lv1", function() {
		$(this).removeClass("check-half");
		if($(this).prop("checked")) {
			//判断同级标签勾选个数决定是否勾选全选按钮
			if($(this).parents(".region-select-list").find(".region-lv1").length == $(this).parents(".region-select-list").find(".region-lv1:checked").length) {
				$(this).parents(".region-select-list").siblings(".region-select-all").find("input").prop("checked", true);
			}
			//勾选二级按钮
			$(this).parent().siblings(".city-select-list").find(".region-lv2").prop("checked", true);
			//review
			$(this).parents(".region-selector-box").find(".region-review-list li[data-rid=" + $(this).attr("id") + "]").addClass("review-show");
			$(this).parents(".region-selector-box").find(".region-review-list li[data-rid=" + $(this).attr("id") + "] li").addClass("review-show");
		} else {
			$(this).parents(".region-select-list").siblings(".region-select-all").find("input").prop("checked", false);
			$(this).parent().siblings(".city-select-list").find(".region-lv2").prop("checked", false);
			//review
			$(this).parents(".region-selector-box").find(".region-review-list li[data-rid=" + $(this).attr("id") + "]").removeClass("review-show");
			$(this).parents(".region-selector-box").find(".region-review-list li[data-rid=" + $(this).attr("id") + "] li").removeClass("review-show");
		}
	});

	$(".region-select-list").on("change", ".region-lv2", function() {
		if($(this).prop("checked")) {
			//判断同级标签个数决定是否勾选父一级标签
			$(this).parents(".city-select-list").parent().find(".region-lv1").prop("checked", true);
			//判断一级标签勾选个数决定是否勾选全选按钮
			if($(this).parents(".region-select-list").find("input").length == $(this).parents(".region-select-list").find("input:checked").length) {
				$(this).parents(".region-select-list").siblings(".region-select-all").find("input").prop("checked", true);
			}
			//review
			$(this).parents(".region-selector-box").find(".region-review-list li[data-rid=" + $(this).attr("id") + "]").addClass("review-show");
			$(this).parents(".region-selector-box").find(".region-review-list li[data-rid=" + $(this).attr("id") + "]").parents("li").addClass("review-show");
		} else {
			if($(this).parents(".city-select-list").find(".region-lv2:checked").length == 0) {
				$(this).parents(".city-select-list").parent().find(".region-lv1").prop("checked", false);
			}
			$(this).parents(".region-select-list").siblings(".region-select-all").find("input").prop("checked", false);
			//review
			$(this).parents(".region-selector-box").find(".region-review-list li[data-rid=" + $(this).attr("id") + "]").removeClass("review-show");
			if($(this).parents(".region-selector-box").find(".region-review-list li[data-rid=" + $(this).attr("id") + "]").siblings(".review-show").length == 0) {
				$(this).parents(".region-selector-box").find(".region-review-list li[data-rid=" + $(this).attr("id") + "]").parents("li").removeClass("review-show");
			}
		}
		if($(this).parents(".city-select-list").find(".region-lv2").length != $(this).parents(".city-select-list").find(".region-lv2:checked").length && $(this).parents(".city-select-list").find(".region-lv2:checked").length != 0) {
			$(this).parents(".city-select-list").parent().find(".region-lv1").addClass("check-half");
		} else {
			$(this).parents(".city-select-list").parent().find(".region-lv1").removeClass("check-half");
		}
	});

	$(document).off("click", ".review-show span").on("click", ".review-show span", function() {
		var rid = $(this).parents(".review-show").attr("data-rid");
		//console.log($("#region-" + rid));
		$("#" + rid).click();
	});
}

addAdvert.getZoneList = function(data) {
	//var zoneTypes = this.zoneTypes;
	//var data = zoneTypes.children[0];
	this.getZoneSelector("#zone-selector-box", data);
}

addAdvert.getSceneSelector = function(dom, data) {
	var parents = data[0];
	var html = "";
	var reviewHtml = "";
	for(var i = 0, ilen = parents.length; i < ilen; i++) {
		html += '<li class="tree-select"><div class="tree-parent"><span class="tree-toggle fa fa-plus-square-o pointer"></span><span class="parent-name" id="scene-' + parents[i].scenes_id + '">' + parents[i].scenes_name + '</span></div>';

		var leaves = data[parents[i].scenes_id];
		html += '<ul class="tree-children">';
		for(var j = 0, jlen = leaves.length; j < jlen; j++) {
			html += '<li><span class="child-name" id="scene-' + leaves[j].scenes_id + '">' + leaves[j].scenes_name + '</span></li>';
		}
		html += '</ul>';

		html += '</li>';
	}

	$(dom + " .trees").html(html);
}

addAdvert.getDiySceneSelector = function(dom, data) {
	var parents = data;
	var html = "";
	var reviewHtml = "";
	for(var i = 0, ilen = parents.length; i < ilen; i++) {
		html += '<li class="tree-select"><div class="tree-parent"><span class="tree-toggle fa fa-plus-square-o pointer"></span><span class="parent-name" id="scene-' + parents[i].scene_id + '">' + parents[i].current_name + '</span></div>';

		/*var leaves = data[parents[i].scenes_id];
		html += '<ul class="tree-children">';
		for(var j = 0, jlen = leaves.length; j < jlen; j++) {
			html += '<li><span class="child-name" id="scene-' + leaves[j].scenes_id + '">' + leaves[j].scenes_name + '</span></li>';
		}
		html += '</ul>';*/

		html += '</li>';
	}

	$(dom + " .trees").html(html);
}

addAdvert.bindSceneEvent = function() {
	$("#scene-selector-box .tree-select .parent-name").on("click", function() {
		var psid = $(this).attr("id").replace(/scene-/g, "");
		var pname = $(this).text();

		var html = '';
		for(var i = 0; i < $(this).parents(".tree-select").find(".tree-children li").length; i++) {
			var child = $(this).parents(".tree-select").find(".tree-children li span").eq(i);
			var csid = child.attr("id").replace(/scene-/g, "");
			html += '<li title="' + child.text() + '" data-sid="' + csid + '">' + child.text() + '<span class="fa fa-close pointer fr"></span></li>';
		}

		if($("#scene-review-list li[data-sid=" + psid + "]").length == 0) {
			$("#scene-review-list").append('<li data-sid="' + psid + '">' + pname + '<span class="fa fa-close pointer fr"></span><ul class="scene-children-review-list"></ul></li>');
		}
		$("#scene-review-list li[data-sid=" + psid + "] .scene-children-review-list").html(html);
	});

	$("#scene-selector-box .tree-select .child-name").on("click", function() {
		var csid = $(this).attr("id").replace(/scene-/g, "");
		var cname = $(this).text();
		var psid = $(this).parents(".tree-select").find(".parent-name").attr("id").replace(/scene-/g, "");
		var pname = $(this).parents(".tree-select").find(".parent-name").text();
		if($("#scene-review-list li[data-sid=" + psid + "]").length == 0) {
			$("#scene-review-list").append('<li data-sid="' + psid + '">' + pname + '<span class="fa fa-close pointer fr"></span><ul class="scene-children-review-list"></ul></li>');
		}
		if($("#scene-review-list li[data-sid=" + csid + "]").length == 0) {
			$("#scene-review-list li[data-sid=" + psid + "] .scene-children-review-list").append('<li data-sid="' + csid + '">' + cname + '<span class="fa fa-close pointer fr"></span></li>');
		}
	});

	$(document).on("click", "#scene-review-list .scene-children-review-list>li", function(event) {
		event.stopPropagation();
		$(this).remove();
	});
	$(document).on("click", "#scene-review-list>li", function(event) {
		event.stopPropagation();
		$(this).remove();
	});
}

addAdvert.bindDiySceneEvent = function() {
	$("#scene-diy-selector-box .tree-select .parent-name").on("click", function() {
		var psid = $(this).attr("id").replace(/scene-/g, "");
		var pname = $(this).text();

		var html = '';
		for(var i = 0; i < $(this).parents(".tree-select").find(".tree-children li").length; i++) {
			var child = $(this).parents(".tree-select").find(".tree-children li span").eq(i);
			var csid = child.attr("id").replace(/scene-/g, "");
			html += '<li title="' + child.text() + '" data-sid="' + csid + '">' + child.text() + '<span class="fa fa-close pointer fr"></span></li>';
		}

		if($("#scene-diy-review-list li[data-sid=" + psid + "]").length == 0) {
			$("#scene-diy-review-list").append('<li data-sid="' + psid + '">' + pname + '<span class="fa fa-close pointer fr"></span><ul class="scene-children-review-list"></ul></li>');
		}
		$("#scene-diy-review-list li[data-sid=" + psid + "] .scene-children-review-list").html(html);
	});

	$("#scene-diy-selector-box .tree-select .child-name").on("click", function() {
		var csid = $(this).attr("id").replace(/scene-/g, "");
		var cname = $(this).text();
		var psid = $(this).parents(".tree-select").find(".parent-name").attr("id").replace(/scene-/g, "");
		var pname = $(this).parents(".tree-select").find(".parent-name").text();
		if($("#scene-diy-review-list li[data-sid=" + psid + "]").length == 0) {
			$("#scene-diy-review-list").append('<li data-sid="' + psid + '">' + pname + '<span class="fa fa-close pointer fr"></span><ul class="scene-children-review-list"></ul></li>');
		}
		if($("#scene-diy-review-list li[data-sid=" + csid + "]").length == 0) {
			$("#scene-diy-review-list li[data-sid=" + psid + "] .scene-children-review-list").append('<li data-sid="' + csid + '">' + cname + '<span class="fa fa-close pointer fr"></span></li>');
		}
	});

	$(document).on("click", "#scene-diy-review-list .scene-children-review-list>li", function(event) {
		event.stopPropagation();
		$(this).remove();
	});
	$(document).on("click", "#scene-diy-review-list>li", function(event) {
		event.stopPropagation();
		$(this).remove();
	});
}

addAdvert.uploadImg = function() {
	var domain = 'http://share.soundtooth.cn/';
	var isHover = false;
	var uploadStatus = '';

	var showUploadInfos = function(up, file) {
		if (!isHover) {
			$('#uploading-kidd').text(file.percent + '%');
		}
	};

	var uploader = Qiniu.uploader({
		runtimes: 'html5,html4',
		browse_button: 'add-ad-img',
		//container: 'img-box',
		// drop_element: 'container',
		max_file_size: '100kb',
		// flash_swf_url: 'js/plupload/Moxie.swf',
		// dragdrop: true,
		multi_selection: false,
		chunk_size: '4mb',
		uptoken_url: BASEURL + "admin/api/getUploadToken",
		domain: domain,
		unique_names: true,
		get_new_uptoken: true,
		auto_start: true,
		filters : {
			max_file_size : '100kb',
			prevent_duplicates: false,
			// Specify what files to browse for
			mime_types: [
				{title : "Image files", extensions : "jpg,gif,png"}, // 限定jpg,gif,png后缀上传
			]
		},
		init: {
			'FilesAdded': function(up, files) {
				var _up = up;
				plupload.each(files, function(file) {
					isHover = false;
					// 文件添加进队列后,处理相关的事情
					var _file = file;
					var $btn = $('#uploaded-status');
					var $status = $('#uploading-kidd');

					/**
					 * unillegal files
					 */
					uploadStatus = 'uploading';

					$btn.hide();
					$status.text('上传中')
							.css('display', 'inline-block');

					var currentText = '';
					$status.hover(function () {
						currentText = $(this).text();
						isHover = true;
						$(this).text('取消')
								.click(function () {
									_up.removeFile(_file);
									$(this).unbind('mouseenter')
											.unbind('mouseleave')
											.unbind('click');
									$status.hide();
									$btn.text('选择文件').show();
								});
					}, function () {
						isHover = false;
						$(this).text(currentText)
								.unbind('click');
					});
				});
			},
			'BeforeUpload': function(up, file) {},
			'UploadProgress': function(up, file) {
				showUploadInfos(up, file);
			},
			'UploadComplete': function() {},
			'FileUploaded': function(up, file, info) {
				"use strict";
				uploadStatus = 'uploaded';
				var infoObj = JSON.parse(info);
				var $status = $('#uploading-kidd');
				$status.unbind('click')
						.unbind('mouseenter')
						.unbind('mouseleave')
						.text('上传成功')
						.css('cursor', 'auto');
				//$('#add-image').attr('disabled','disabled');
				//$('#hImg').val(domain + infoObj.key);
				var imageInfoObj = Qiniu.imageInfo(file.target_name);
				if(checkImgPx(imageInfoObj.width, imageInfoObj.height)) {
					var url = domain + infoObj.key;
					$('#image-qiniu-url').val(url);
					addAdvert.imgUrls.img.push({
						'url': url,
						'size': file.size,
						'width': imageInfoObj.width,
						'height': imageInfoObj.height
					});
					//console.log(file);
					$("#img-count").text(addAdvert.imgUrls.img.length);
					var size = file.size > 1000 ? Math.ceil(file.size / 1000) + "KB" : Math.ceil(file.size) + "B";
					var html = '<li class="clearfix"><div class="img-review-pic fl"><img src="' + url + '"/></div><div class="img-review-size fl">尺寸:' + imageInfoObj.width + '*' + imageInfoObj.height + '</div><div class="img-review-type fl">格式:' + getFileType(file.name) + '</div><div class="img-review-space fl">大小:' + size+ '</div><div class="fa fa-close close-btn"></div></li>';
					$('#img-review').children("ul").append(html);
					var preview = '<img src="' + url + '">';
					$('.preview-screen').empty().append(preview);
				} else {
					layer.alert("图片宽高不符合要求，请重新上传");
				}
			},
			'Error': function(up, err, errTip) {
				uploadStatus = 'error';
				var $btn = $('#uploaded-status');
				var $status = $('#uploading-kidd');

				$status.unbind('mouseenter')
						.unbind('mouseleave')
						.unbind('click')
						.hide();
				if(err.code == -600) {
					$btn.text('图片过大，请重新上传').show();
				} else {
					$btn.text('请重新上传').show();
				}
			}
		}
	});

	function checkImgPx(width, height) {
		var sizeArr = ["800*120", "600*500", "640*270", "960*640", "600 *300", "480*800", "640*960", "720*1280", "768*1024", "728*90", "468*60", "600*500", "1024*768", "1280*800", "1366*768"];
		var imgSize = width + "*" + height;
		if($.inArray(imgSize, sizeArr) < 0) {
			return false;
		} else {
			return true;
		}
	}

	function getFileType(filename) {
		return filename.substring(filename.lastIndexOf(".") + 1, filename.length);
	}
}



addAdvert.bindDataEvent = function() {
	var fd = {};
	var formData = getFormData(".step-box");
	var dateData = getDateData();
	var piriodData = getPiriodData();
	var accountData = getAccountData();

	var fd = $.extend({}, formData, dateData, addAdvert.imgUrls, accountData, piriodData);
	if($("#areas-2").prop("checked")) {
		var regionData = getRegionData();
		fd = $.extend({}, fd, regionData);
	} else if ($("#areas-3").prop("checked")) {
		var zoneData = getZoneData();
		fd = $.extend({}, fd, zoneData);
	}

	if($("#scenes-2").prop("checked")) {
		var sceneData = getSceneData();
		fd = $.extend({}, fd, sceneData);
	} else if ($("#scenes-3").prop("checked")) {
		var sceneData = getDiySceneData();
		fd = $.extend({}, fd, sceneData);
	}
	layer.confirm('请确认您的广告信息' + $("#ad-summary").html(), {
		btn: ['确定', '取消'] //按钮
	}, function(){
		$('.loading-area').fadeIn();
		$.ajax({
			url: BASEURL + 'api/addAdvert',
			type: 'POST',
			dataType: 'json',
			data: fd
		})
		.done(function(data) {
			if(data.success) {
				$(".step-process-flex").children("li").last().removeClass("active").addClass("done");
				setTimeout(function() {
					window.location.href = BASEURL + "agentIndex";
				}, 3000);
				layer.msg("发布成功！3秒后跳转到广告列表页面", {
					time: 6000,
					shade: 0.3
				});
			}
			$('.loading-area').fadeOut();
		})
		.fail(function() {
			console.log("error");
		});
	}, function(){});

	function getAccountData() {
		var result = {};
		result['user_id'] = $("#child-account-select").attr("data-childid");
		return result;
	}
	function getPiriodData() {
		var result = {};
		result.piriodArr = [];
		$("#piriod-selector").find(".piriod-weekday").each(function() {
			if($(this).index() == 0) {
				return;
			}
			var weekday = [];
			$(this).find(".piriod-hour.active").each(function() {
				weekday.push(parseInt($(this).text()));
			});
			result.piriodArr.push(weekday);
		});
		return result;
	}
	function getFormData(parentDom) {
		var result = {};
		$(parentDom).find(".form-group input").each(function(){
			if($(this).prop("disabled")) {
				return;
			}
			var type = $(this).attr("type");
			if(type && (type.toLocaleLowerCase() == "radio" || type.toLocaleLowerCase() == "checkbox") && !$(this).prop("checked")) {
				return;
			}
			var name = $(this).attr("name");
			var value = $(this).val();
			if(name && value) {
				if(type.toLocaleLowerCase() == "checkbox") {
					var tempArr = [];
					if(!result[name]) {
						result[name] = value;
					} else {
						tempArr.push(result[name]);
						tempArr.push(value);
						result[name] = tempArr.join("|");
					}
				} else {
					result[name] = value;
				}
			}
		});
		return result;
	}

	function getDateData() {
		var result = {};
		result.adDate = {};
		result.adDate.startDate = $("#startDate").val();
		if($("#hasTimeEnd").prop("checked") && $("#endDate").val() != "") {
			result.adDate.endDate = $("#endDate").val();
		} else {
			result.adDate.endDate = "";
		}
		return result;
	}

	function getRegionData() {
		var result = {};
		result.province = [];
		var province = result.province;
		var provinceLi = $("#region-selector-box").find(".region-select-list").children("li");
		if(provinceLi.children("label").children("input").length > provinceLi.children("label").children("input:checked").length) {
			provinceLi.children("label").children("input:checked").each(function() {
				var pdom = $(this).parent().parent();
				province.push({
					'id': $(this).val()
				});
				var cityLi = pdom.children(".city-select-list").children("li");
				if(cityLi.children("label").children("input").length > cityLi.children("label").children("input:checked").length) {
					province[province.length - 1].city = [];
					cityLi.children("label").children("input:checked").each(function() {
						province[province.length - 1].city.push({
							'id': $(this).val()
						});
					});
				}
			});
		}
		return result;
	}

	function getZoneData() {
		var result = {};
		//result.province = $("#province-dropdown").attr("data-provinceid");
		//result.city = $("#city-dropdown").attr("data-cityid");
		result.area = [];
		var areaLi = $("#zone-selector-box").find(".region-select-list").children("li");
		if(areaLi.children("label").children("input").length > areaLi.children("label").children("input:checked").length) {
			areaLi.children("label").children("input:checked").each(function() {
				var pdom = $(this).parent().parent();
				result.area.push({
					'id': $(this).val()
				});
				var cityLi = pdom.children(".city-select-list").children("li");
				if(cityLi.children("label").children("input").length > cityLi.children("label").children("input:checked").length) {
					result.area[result.area.length - 1].zone = [];
					cityLi.children("label").children("input:checked").each(function() {
						result.area[result.area.length - 1].zone.push({
							'id': $(this).val()
						});
					});
				}
			});
		}
		return result;
	}

	function getSceneData() {
		var result = {};
		result.scene = [];
		$("#scene-review-list").children("li").each(function() {
			var childrenData = [];
			$(this).children(".scene-children-review-list").children("li").each(function() {
				childrenData.push($(this).attr("data-sid"));
			});
			result.scene.push({
				'id': $(this).attr("data-sid"),
				'children': childrenData
			});
		});
		return result;
	}

	function getDiySceneData() {
		var result = {};
		result.diyScene = [];
		$("#scene-diy-review-list").children("li").each(function() {
			result.diyScene.push($(this).attr("data-sid"));
		});
		return result;
	}
}

addAdvert.reviewData = function() {
	var html = '';
	var result = {};
	var dateHtml = '<p class="clearfix"><span class="summary-title">推广日期</span><span class="summary-con">' + $("#startDate").val();
	if($("#hasTimeEnd").prop("checked") && $("#endDate").val() != "") {
		dateHtml += ' 至 ' + $("#endDate").val();
	} else {
		dateHtml += ' 起';
	}
	dateHtml += '</span></p>';

	/*var accountHtml = '<p>关联子账号：' + $("#child-account-select>.dropdown-toggle").text();
	html += accountHtml;*/
	var dom = '';
	$(".add-ad-step:lt(" + addAdvert.step + ")  .form-group input").each(function() {
		if($(this).prop("disabled")) {
			return;
		}
		var type = $(this).attr("type");
		if(type && (type.toLocaleLowerCase() == "radio" || type.toLocaleLowerCase() == "checkbox") && !$(this).prop("checked")) {
			return;
		}
		var name = $(this).attr("name");
		var value = $(this).val();
		if(name) {
			if(type.toLocaleLowerCase() == "checkbox") {
				if(!result[name]) {
					result[name] = [];
				}
				result[name].push($(this).siblings("span").text());
				if($(".form-group input[type='checkbox'][name='" + name + "']:checked").length == result[name].length) {
					html += '<p class="clearfix"><span class="summary-title">' + $(this).parents(".form-group").children("label").text() + '</span><span class="summary-con">' + result[name].join(",") + '</span></p>';
				}
			} else if (type.toLocaleLowerCase() == "radio") {
				html += '<p class="clearfix"><span class="summary-title">' + $(this).parents(".form-group").children("label").text() + '</span><span class="summary-con">' + $(this).siblings("span").text() + '</span></p>';
			} else {
				if(name == "add-ad-img") {
					return;
				}
				html += '<p class="clearfix"><span class="summary-title">' + $(this).parents(".form-group").children("label").text() + '</span><span class="summary-con">' + $(this).val() + '</span></p>';
				if(name == "daily-budget") {
					html += dateHtml;
				}
			}
		}
	});
	$("#ad-summary>p").remove();
	$("#ad-summary").append(html);
}

/*addAdvert.finalData = {
	"adName": "地方美食",
	"adDate": {
		"startDate": "2016-06-01",
		"endDate": "2016-06-28"
	},
	"promotionWay": 0, //推广方式
	"dailyBudget": 10,  //预算
	"operators": "",  //运营商
	"network": "",  //网络类型
	"system": "",  //操作系统
	"area": {
		"type": "",  //省市region   /	商圈zone
		"data": ""  //1|2|3
	},
	"scene": {
		"type": "",  //自定义diy
		"data": ""  //123|456
	},
	"sex": "",
	"age": "",
	"marry": "",
	"kids": "",
	"img": [{
		"url": "http://www.soundtooth.cn",
		"width": 300,
		"height": 50,
		"size": 102400
	},
	{
		"url": "",
		"width": "",
		"height": "",
		"size": ""
	},
	{
		"url": "",
		"width": "",
		"height": "",
		"size": ""
	}],
	"url": ""
}*/
