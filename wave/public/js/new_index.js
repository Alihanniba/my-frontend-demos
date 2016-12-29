/* 
 * 绑定dropdown-click组件事件
 */
$(document).on("click", ".dropdown-click", function(event) {
	event.stopPropagation();
	$(this).toggleClass("opened");
});
$(document).on("click", function() {
	$(".dropdown-click").removeClass("opened");
});
$(document).on("click", ".dropdown-click .dropdown-menu>li", function() {
	$(this).parents(".dropdown-click").children(".dropdown-toggle").html($(this).text());
});
/* 
 * tree-select组件事件
 */
$(document).on("click", ".tree-toggle", function() {
	$(this).parents(".tree-select").toggleClass("opened");
	if($(this).parents(".tree-select").hasClass("opened")) {
		$(this).removeClass("fa-plus-square-o");
		$(this).addClass("fa-minus-square-o");
	} else {
		$(this).removeClass("fa-minus-square-o");
		$(this).addClass("fa-plus-square-o");
	}
});
/* 
 * 退出事件
 */
$(document).on('click', '#nav-user-quit', function(event) {
	event.preventDefault();
	window.location.href = BASEURL + 'admin/api/logout';
});
/* 
 * 获取时间字符串
 */
function getDateStr(AddDayCount) { 
	var dd = new Date(); 
	dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
	var y = dd.getFullYear(); 
	var m = dd.getMonth()+1;//获取当前月份的日期 
	var d = dd.getDate(); 
	return y+"-"+m+"-"+d; 
} 
/* 
 *Pagination 分页器
 */
var Pagination = function(container, params) {
	var s = this;
	s.defaults = {
		pageNo: 1,
		pageCount: 0,
		showRange: 3
	};
	params = params || {};
	var originalParams = {};
	for (var param in params) {
		if (typeof params[param] === 'object' && params[param] !== null && !(params[param].nodeType || params[param] === window || params[param] === document || (typeof Dom7 !== 'undefined' && params[param] instanceof Dom7) || (typeof jQuery !== 'undefined' && params[param] instanceof jQuery))) {
			originalParams[param] = {};
		} else {
			originalParams[param] = params[param];
		}
	}
	for (var def in s.defaults) {
		if (typeof params[def] === 'undefined') {
			params[def] = s.defaults[def];
		}
	}

	s.update = function(params) {
		for (var def in s.defaults) {
			if (typeof params[def] === 'undefined') {
				params[def] = s.defaults[def];
			}
		}
		var html = '';
		if(params.pageCount == null || params.pageCount == 0) {
			$(container).attr("data-page", params.pageNo).html(html);
		} else {
			html = '<div class="pagination-prev"><a class="fa fa-angle-left"></a></div><ul class="pagination">';
			for(var i = 1; i <= params.pageCount; i++) {
				if(params.pageNo == i) {
					html += '<li class="active"><a>' + i + '</a></li>';
					continue;
				} else if(Math.abs(params.pageNo - i) <= params.showRange) {
					html += '<li><a>' + i + '</a></li>';
					continue;
				}else if(i == 1) {
					if(params.pageNo > params.showRange + 2) {
						html += '<li><a>' + i + '</a></li><li class="ellipsis"><a>...</a></li>';
						continue;
					} else {
						html += '<li><a>' + i + '</a></li>';
						continue;
					}
				} else if(i == params.pageCount) {
					if(params.pageCount - params.pageNo > params.showRange + 1) {
						html += '<li class="ellipsis"><a>...</a></li><li><a>' + i + '</a></li>';
						continue;
					} else {
						html += '<li><a>' + i + '</a></li>';
						continue;
					}
				} 
			}
			html += '</ul><div class="pagination-next"><a class="fa fa-angle-right"></a></div>';
			$(container).attr("data-page", params.pageNo).html(html);

			if(params.pageNo == 1) {
				$(container + ">.pagination-prev").addClass("disabled");
			} else {
				$(container + ">.pagination-prev").removeClass("disabled");
			}
			if(params.pageNo == params.pageCount) {
				$(container + ">.pagination-next").addClass("disabled");
			} else {
				$(container + ">.pagination-next").removeClass("disabled");
			}

			$(container + " .pagination>li").on("click", function() {
				$(this).addClass("active").siblings().removeClass("active");
				$(container).attr("data-page", $(this).text());
			});
		}
	}
	s.update(params);
}

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
 *new_index
 */
var index = {};
index.init = function() {
	BASEURL = BASEURL || "";
	var that = this;
	var first = true;
	var chipId = getCookie("chip_id");//芯片id
	var chipNo = getCookie("chip_no");//芯片码
	var sceneName = getCookie("scene_name");//场景名城
	$('.scene-name').text(sceneName);
	$(".has-child").hover(function() {
		$(this).children('ul').addClass('on');
	}, function() {
		$(this).children('ul').removeClass('on');
	});

	allPage.renderDateSelector(-1, -1);
	this.renderChipSelector();
	this.renderPageData();
	this.renderSceneSelector(chipNo);
	$("#search-btn").on("click", function() {
		that.renderPageData();
	});
	$(document).on("click", "#chip-select .dropdown-menu>li", function() {
		$(this).parents("#chip-select").attr("data-chipNo", $(this).attr("data-chipNo"));
		$(this).parents("#chip-select").attr("data-chipId", $(this).attr("data-chipId"));
		//that.renderPageData();
		that.renderSceneSelector($(this).attr("data-chipNo"));
	});
	$(document).on("click", "#scene-select .dropdown-menu>li", function() {
		$(this).parents("#scene-select").attr("data-sceneName", $(this).attr("data-sceneName"));
		$('#scene-name').text($(this).text());
		$('.scene-name').text($(this).text());
		if($(this).attr("data-status") == "0") {
			addCookie('chip_no', $("#chip-select").attr("data-chipNo"), 2);
			addCookie('chip_id', $("#chip-select").attr('data-chipid'), 2);
			addCookie('scene_name', $("#scene-select").attr('data-scenename'), 2);
			if(first) {
				first = false;
				that.renderPageData();
			} else {
				$("#perfect-information-module .withdraw-shadow").fadeIn();
				$("#perfect-information-module .perfect-information-box").fadeIn();
			}
		} else {
			addCookie('chip_no', $("#chip-select").attr("data-chipNo"), 2);
			addCookie('chip_id', $("#chip-select").attr('data-chipid'), 2);
			addCookie('scene_name', $("#scene-select").attr('data-scenename'), 2);
			that.renderPageData();
		}
	});

	$('#perfect-information-module .withdraw-shadow').click(function() {
		$("#perfect-information-module .withdraw-shadow").fadeOut();
		$("#perfect-information-module .perfect-information-box").fadeOut();
	});

	$('#see-data').click(function() {
		$("#perfect-information-module .withdraw-shadow").fadeOut();
		$("#perfect-information-module .perfect-information-box").fadeOut();
		that.renderPageData();
	});

	//this.initPieCharts();
}
index.renderChipSelector = function() {
	var chipId = getCookie("chip_id");//芯片id
	$.ajax({
		url: BASEURL + 'admin/api/getChipTagByUser',
		type: 'POST',
		dataType: 'json'
	})
	.done(function(data) {
		if(data.success) {
			var html = '';
			for(var i = 0, len = data.result.length; i < len; i++) {
				var chipInfo = data.result[i];
				html += '<li data-chipId="' + chipInfo.id + '" data-chipNo="' + chipInfo.chip_no + '"><a>' + chipInfo.chip_name + '</a></li>';
				if(chipInfo.id == chipId || i == 0) {
					$("#chip-select .dropdown-toggle").html(""+chipInfo.chip_name);
				}
			}
			$("#chip-select .dropdown-menu").html(html);
		}
	})
	.fail(function() {
		console.log("error");
	});
}
//根据芯片id获取场景
index.renderSceneSelector = function(chipNo) {
	var sceneName = getCookie("scene_name");//场景名城
	$.ajax({
		url: BASEURL + 'admin/api/getScenesByChipCodeAll',
		type: 'POST',
		dataType: 'json',
		data: {
			chip_code: chipNo
		}
	})
	.done(function(data) {
		if(data.success) {
			if(data.result.scenes.length == 0) {
				alert("请先添加场景信息");
				history.go(-1);
			}
			var html = '';
			for(var i = 0, len = data.result.scenes.length; i < len; i++) {
				var name = data.result.scenes[i].status ? data.result.scenes[i].initial_name : data.result.scenes[i].current_name;
				html += '<li data-sceneName="' + name + '" data-status="' + data.result.scenes[i].status + '"><a>' + data.result.scenes[i].current_name + '</a></li>';
				if(name == sceneName || i == 0) {
					$("#scene-select .dropdown-toggle").html(data.result.scenes[i].current_name);
				}
			}
			$("#scene-select .dropdown-menu").html(html);
			//自动点击场景
			if(sceneName == "" || $("#scene-select .dropdown-menu>li[data-scenename='"+ sceneName +"']").length == 0) {
				$("#scene-select .dropdown-menu>li").eq(0).click();
			} else {
				$("#scene-select .dropdown-menu>li[data-scenename='"+ sceneName +"']").click();
			}
			$("#scene-select").removeClass("opened");
		}
	})
	.fail(function() {
		console.log("error");
	});
}
index.renderPageData = function() {
	$("#chip-select").attr("data-chipNo") == "" ? $("#chip-select").attr("data-chipNo", getCookie("chip_no")) : "";
	$("#chip-select").attr("data-chipId") == "" ? $("#chip-select").attr("data-chipId", getCookie("chip_id")) : "";//芯片id
	$("#scene-select").attr("data-sceneName") == "" ? $("#chip-select").attr("data-sceneName", getCookie("scene_name")) : "";//场景名城
	var chipId = $("#chip-select").attr("data-chipId");//芯片id
	var sceneName = $("#scene-select").attr("data-sceneName");//场景名城
	$('.loading-area').fadeIn();
	$.ajax({
		url: BASEURL + 'admin/api/chipDataStatistics',
		type: 'POST',
		data: {
			chip_id: chipId,
			scene_name: sceneName,
			startTime: $("#startDate").val(),
			endTime: $("#endDate").val()
		},
		dataType: 'json'
	})
	.done(function(data) {
		if(data.success) {
			//渲染场景人数
			/*for(var i = 0, len = data.result.frequency.length; i < len; i++) {
				var dom = $("#summary-data>.number-list>li").eq(i);
				dom.find(".data-number").html(data.data[i]);
			}*/
			$("#summary-data>.number-list>li").eq(0).find(".data-number").html(data.result.current);
			$("#summary-data>.number-list>li").eq(1).find(".data-number").html(data.result.distance);
			$("#summary-data>.number-list>li").eq(2).find(".data-number").html(data.result.old);
			$("#summary-data>.number-list>li").eq(3).find(".data-number").html(data.result.new);
			//渲染停留时间条形图
			for(var i = 0, len = data.result.remain_time.length, sum = eval(data.result.remain_time.join('+')); i < len; i++) {
				var percent = sum == 0 ? 0 : Math.round(data.result.remain_time[i] / sum * 100);
				var dom = $("#summary-time").children(".chart-bar-container").eq(i);
				dom.find(".data-number").html(data.result.remain_time[i]);
				dom.find(".data-percent").html(percent + "%");
				dom.find(".chart-bar>div").width(percent + "%");
			}
			//渲染出现频数条形图
			for(var i = 0, len = data.result.frequency.length, sum = eval(data.result.frequency.join('+')); i < len; i++) {
				var percent = sum == 0 ? 0 : Math.round(data.result.frequency[i] / sum * 100);
				var dom = $("#summary-frequency").children(".chart-bar-container").eq(i);
				dom.find(".data-number").html(data.result.frequency[i]);
				dom.find(".data-percent").html(percent + "%");
				dom.find(".chart-bar>div").width(percent + "%");
			}
			//渲染时间段表格
			for(var i = 0, len = data.result.period.length; i < len; i++) {
				$("#flowrate-number>td").eq(i+1).html(data.result.period[i]);
			}
			//渲染饼图
			if(data.result.current > 0 || data.result.tag.length == 0) {
				$(".chart-list").show();
				$(".no-data").hide();
				$(".chart-list").empty();
				for(var i = 0, len = data.result.tag.length; i < len; i++) {
					if(data.result.tag[i].data != undefined && data.result.tag[i] != 0 && data.result.tag[i].data != null) {
						var options = getOptions(data.result.tag[i]);
						renderPieCharts("chart-" + i, options);
					}
				}
			} else {
				$(".chart-list").hide();
				$(".no-data").show();
			}
		}
		$('.loading-area').fadeOut();
	})
	.fail(function() {
		//出现错误重置数据
		$("data-number").html("0");
		$("data-percent").html("0%");
		$(".chart-bar>div").width("0px");
		console.log("error");
	});

	function getOptions(chartData) {
		var legendData = [];
		var seriesData = [];
		var sumArray = [];
		for(var i = 0, len = chartData.data.length; i < len; i++) {
			sumArray[i] = chartData.data[i].value;
		}
		var sum = eval(sumArray.join("+"));
		for(var i = 0, len = chartData.data.length; i < len; i++) {
			var percent = chartData.data[i].value==0 || sum == 0 ? 0 : Math.round(chartData.data[i].value / sum * 100) + "%";
			var dataName = percent + "(" + chartData.data[i].name + ")";
			legendData[i] = {
				name: dataName
			};
			seriesData[i] = {
				name: dataName,
				value: chartData.data[i].value
			};
		}

		var options = {
			color: ['#ffcc99', '#cc99ff', '#99ccff', '#43ca83', '#ffcaf2',"#fff0ac","#acf4ff"],
			title: {
				text: chartData.name,
				x: 'center',
				y: 'bottom',
				textStyle: {
					fontSize: '16',
					color: '#666',
					align: 'center',
					fontFamily: 'Helvetica Neue, Helvetica, 微软雅黑, HiraginoSansGB, Arial, sans-serif, 冬青黑体',
					fontWeight: 'normal'
				}
			},
			tooltip: {
				formatter: '{b} <br/>{c}',
				textStyle: {
					fontSize: '14',
					color: '#fff',
					fontFamily: 'Helvetica Neue, Helvetica, 微软雅黑, HiraginoSansGB, Arial, sans-serif, 冬青黑体',
					align: 'center',
					fontWeight: 'normal'
				}
			},
			legend: {
				x: '180',
				y: 'center',
				itemGap: 10,
				orient: 'vertical',
				textStyle: {
					color:'#666',
					fontSize: '16',
					fontFamily: 'Helvetica Neue, Helvetica, 微软雅黑, HiraginoSansGB, Arial, sans-serif, 冬青黑体',
					align: 'left',
					fontWeight: 'normal'
				},
				data: legendData
			},
			series: [{
				center: ["80", "50%"],
				clockWise: true,
				type: 'pie',
				radius: [50, 70],
				itemStyle: {
					normal: {
						label: {
							show: false
						},
						labelLine: {
							show: false
						}
					}
				},
				data: seriesData
			}]
		};
		return options;
	}

	function renderPieCharts(domId, options) {
		$(".chart-list").append('<li class="chart-box" id="' + domId + '"></li>');
		require.config({
			paths: {
				echarts: '../js'
			}
		});
		require(
			[
				'echarts',
				'echarts/chart/pie'
			],
			function(ec) {
				var myChart = ec.init(document.getElementById(domId));
				myChart.setOption(options);
			}
		);
	}
}

/*index.initPieCharts = function() {
	getCharts();
	function getCharts() {
		$('.loading-area').fadeIn();
		$.ajax({
			url: BASEURL + 'admin/api/getCustomizeTag',
			type: 'POST',
			dataType: 'json'
		})
		.done(function(data) {
			if(data.success) {
				for(var i = 0, len = data.result.length; i < len; i++) {
					var options = getOptions(data.result[i]);
					renderPieCharts("chart-" + i, options);
				}
			}
			$('.loading-area').fadeOut();
		})
		.fail(function() {
			console.log("error");
		});
	}	
}
*/

/* 
 * new_ad
 */
var ad = {};
ad.init = function() {
	BASEURL = BASEURL || "";
	var that = this;
	allPage.renderDateSelector();
	this.renderPageData(1);
	$("#search-btn").on("click", function() {
		that.renderPageData(1);
	});
	$(document).on("click", "#status-select .dropdown-menu>li", function() {
		$(this).parents("#status-select").attr("data-status", $(this).attr("data-status"));
		that.renderPageData(1);
	});
	that.pagi = new Pagination("#ad-pagination");
	$(document).on("click", "#ad-pagination .pagination>li", function() {
		ad.renderPageData(parseInt($(this).text()));
	});
}
ad.renderPageData = function(pageNo) {
	$('.loading-area').fadeIn();
	$.ajax({
		url: BASEURL + 'admin/api/getTotalNumAboutMessages',
		type: 'POST',
		data: {
			m_title: $("#search-ad").val(),
			status: $("#status-select").attr("data-status"),
			start_date: $("#startDate").val(),
			end_date: $("#endDate").val(),
			page: pageNo
		},
		dataType: 'json'
	})
	.done(function(data) {
		if(data.success) {
			//渲染
			var clickPercentAll = data.exposureRateAll == 0 ? 0 : Math.round(data.clickRateAll / data.exposureRateAll * 100);
			var pageCount = Math.ceil(data.messageNum / 10);
			$("#message-num>p").html(data.messageNum);
			$("#exposure-rate>p").html(data.exposureRateAll);
			$("#click-rate>p").html(data.clickRateAll);
			$("#click-percent>p").html(clickPercentAll + "%");
			$("#consumption>p").html("￥" + data.consumptionAll);
			var html = "";
			for(var i = 0, len = data.totalBasic.length; i < len; i++) {
				var info = data.totalBasic[i];
				var adTitle = info.title ? info.title : "无名称";
				var clickPercent = info.exposureRate == 0 ? 0 : Math.round(info.clickRate / info.exposureRate * 100);
				var changeTime = info.ctime ? new Date(info.ctime * 1000).toLocaleString() : "无";
				var adStatus = info.status == 1 ? "播放" : "暂停";
				var adPlay = info.status == 1 ? "<span class='play-btn fa fa-pause-circle-o' data-status='0' data-mid='" + info.mid + "'></span>" : "<span class='play-btn fa fa-play-circle-o' data-status='1' data-mid='" + info.mid + "'></span>";
				var foundLimit = info.funds_limit ? "￥" + info.funds_limit : "￥0.00";
				var clickPrice = info.click_price ? "￥" + info.click_price : "￥0.00";
				html += "<tr><td>" + adTitle +  "</td><td><img class='ad-table-img' src='" + info.channel_image +  "'/></td><td>" + changeTime +  "</td><td>" + info.exposureRate +  "</td><td>" + info.clickRate +  "</td><td>" + clickPercent +  "%</td><td>" + foundLimit +  "</td><td>" + clickPrice +  "</td><td>" + adStatus + adPlay + "</td></tr>";
			}
			$("#ad-show-table>tbody").html(html);

			$("#ad-show-table").on("click", ".play-btn", function() {
				ad.changeAdStatus($(this));
			});

			ad.pagi.update({
				pageCount: pageCount,
				pageNo: pageNo
			});

			$(document).off("click", "#ad-pagination .pagination-prev");
			if(pageNo > 1) {
				$(document).on("click", "#ad-pagination .pagination-prev", function() {
					ad.renderPageData(pageNo - 1);
				});
			}
			$(document).off("click", "#ad-pagination .pagination-next");
			if(pageCount - pageNo  > 0) {
				$(document).on("click", "#ad-pagination .pagination-next", function() {
					ad.renderPageData(pageNo + 1);
				});
			}
		}
		$('.loading-area').fadeOut();
	})
	.fail(function() {
		//出现错误重置数据
		$("#message-num>p").html("0");
		$("#exposure-rate>p").html("0");
		$("#click-rate>p").html("0");
		$("#click-percent>p").html("0%");
		$("#consumption>p").html("￥0");
		$("#ad-show-table>tbody").html("");
		console.log("error");
	});
}
ad.changeAdStatus = function(jqDom) {
	$.ajax({
		url: BASEURL + 'api/advertUpdateStatus',
		type: 'POST',
		data: {
			mid: jqDom.attr("data-mid"),
			status:  jqDom.attr("data-status")
		},
		dataType: 'json'
	})
	.done(function(data) {
		if(data.success) {
			layer.msg("操作成功！");
			if(jqDom.attr("data-status") == 1) {
				jqDom.parent().html("播放<span class='play-btn fa fa-pause-circle-o' data-status='0' data-mid='" + jqDom.attr("data-mid") + "'></span>");
			} else {
				jqDom.parent().html("暂停<span class='play-btn fa fa-play-circle-o' data-status='1' data-mid='" + jqDom.attr("data-mid") + "'></span>");
			}
		} else {
			layer.msg("操作失败！"+data.errMsg);
		}
	})
	.fail(function() {
		layer.msg("操作失败！");
		console.log("error");
	});
}

/*
 * new_finance
 */
var finance = {};
finance.init = function() {
	var that = this;
	var pagi = new Pagination("#finance-pagination");
	allPage.renderDateSelector(-30, 0);
	this.getSurplus();
	renderFinancePageData(1);//加载列表数据
	$("#search-btn").on("click", function() {
		renderFinancePageData(1);
	});
	function renderFinancePageData(pageNo) {
		$('.loading-area').fadeIn();
		var snum = 20;//每页数量
		var startTime = $("#startDate").val();
		var endTime = $("#endDate").val();
		$.ajax({
			url: BASEURL + 'account/showSubCashDetails',
			type: 'POST',
			dataType: 'json',
			data: {
				start_time: startTime,
				end_time: endTime,
				page_index: pageNo,
				num_perpage: snum
			}
		})
		.done(function(data) {
			console.log(data);
			if(data.success) {
				if(data.result.datas.length > 0){
					$(".no-data").hide();
					var dataListHtml = '';
					for(var i = 0; i < data.result.datas.length; i++){
						var balance = data.result.datas[i].balance;//交易后余额
						var addDate = data.result.datas[i].createdate;//时间
						var money = data.result.datas[i].money;//交易金额
						var type = data.result.datas[i].money_handle_type;//交易类型
						var subPhone = data.result.datas[i].subPhone;//代理商手机号
						var perprice = $("#per-price").val();//单价
						var advertNum = 0;
						if(perprice != 0 && perprice != null){
							advertNum = parseInt(money / perprice);
						}
						var remarks = "";//备注
						if(type == 0){
							//给自己充值
							type = "给自己充值";
						} else if(type == 1){
							//给子账号充值
							type = "给子账号充值";
							remarks = subPhone;
						} else if(type == 2){
							//提现
							type = "提现";
						} else if(type == 3){
							//代理商给本广告主充值
							type = "代理商代为充值";
							remarks = subPhone;
						} else if(type == 4){
							//每日广告花费
							type = "每日广告花费";
						}
						
						dataListHtml += '<ul class="clearfix">';
						dataListHtml += '	<li class="add-time">' + addDate + '</li>';
						dataListHtml += '	<li class="trade-type">' + type + '</li>';
						dataListHtml += '	<li class="trade-content">' + money + '元/' + advertNum + '条</li>';
						dataListHtml += '	<li class="remarks">' + remarks + '</li>';
						dataListHtml += '</ul>';
					}
					$('#financeList-data').html(dataListHtml);
					if(data.result.list_num > snum){
						var pageCount = Math.ceil(data.result.list_num / snum);
						pagi.update({
							pageCount: pageCount,
							pageNo: pageNo
						});
						var activePage = parseInt($("#finance-pagination .pagination>.active").text());
						$(document).off("click", "#finance-pagination .pagination>li").on("click", "#finance-pagination .pagination>li", function() {
							renderFinancePageData(parseInt($(this).text()));
						});
						$(document).off("click",  "#finance-pagination .pagination-prev").on("click", "#finance-pagination .pagination-prev", function() {
							if(activePage > 1) {
								renderFinancePageData(activePage - 1);
							}
						});
						$(document).off("click", "#finance-pagination .pagination-next").on("click", "#finance-pagination .pagination-next", function() {
							if(pageCount - activePage  > 0) {
								renderFinancePageData(activePage + 1);
							}
						});
					} else{
						$("#finance-pagination").html('');
					}
				}else{
					console.log("暂无数据");
					$('#financeList-data').html("");
					$(".no-data").show();
				}
			}else if(data.errMsg == "没有相关交易记录"){
				$('#financeList-data').html("");
				$(".no-data").show();
			}
			$('.loading-area').fadeOut();
		})
		.fail(function() {
			console.log("error");
			$('.loading-area').fadeOut();
		});
	}
}
finance.getSurplus = function() {
	$.ajax({
		url: BASEURL + 'account/showSubCashBalance',
		type: 'POST',
		dataType: 'json'
	})
	.done(function(data) {
		if(data.success) {
			//渲染
			if(data.errCode == 200) {
				$("#finance-surplus").text(data.errMsg[0].balance);
				var perPrice = data.errMsg[0].perprice == null ? 0 : data.errMsg[0].perprice;
				var advSurplus = perPrice == 0 ? 0 : Math.floor(data.errMsg[0].balance / data.errMsg[0].perprice);
				$("#advert-surplus").text(advSurplus);
				$("#per-price").val(perPrice);
			} else {
				$("#finance-surplus").text("0");
				$("#advert-surplus").text("0");
				$("#per-price").val(0);
			}
		}else {
			$("#finance-surplus").text("0");
			$("#advert-surplus").text("0");
			$("#per-price").val(0);
		}
	})
	.fail(function() {
		$("#finance-surplus").html("0");
		$("#advert-surplus").text("0");
		$("#per-price").val(0);
		console.log("error");
	});
}
finance.renderPageData = function() {
	$('.loading-area').fadeIn();
	$.ajax({
		url: BASEURL + 'admin/api/AccountCenterController',
		type: 'POST',
		data: {
			start_time: $("#startDate").val(),
			end_time: $("#endDate").val()
		},
		dataType: 'json'
	})
	.done(function(data) {
		if(data.success) {
			//重新排序
			var dates = [];
			for(var date in data.result) {
				dates.push(date);
			}
			dates = dates.sort();
			//渲染
			var html = "";
			for(var i = 0, len = dates.length; i < len; i++) {
				var date = dates[i];
				var deposit = data.result[date].deposit ? data.result[date].deposit : "0.00";
				var pay = data.result[date].pay ? data.result[date].pay : "0.00";
				html += '<tr><td>' + date + '</td><td>' + deposit + '</td><td>' + pay + '</td></td>';
			}
			if(dates.length == 0) {
				html = "<tr><td>暂无数据</td></tr>";
			}
			$("#finance-show-table>tbody").html(html);
		}
		$('.loading-area').fadeOut();
	})
	.fail(function() {
		console.log("error");
	});
}

/* 
 * new_changepsw //可重构
 */
var changepsw = {};
changepsw.init = function() {
	var pswReg = /^(\w){6,16}$/;
	$("#checkPassword").on("blur", function() {
		$(this).removeClass("error-input");
		$(this).parents(".form-group").find(".form-error-box").removeClass("show-message");
	});
 	$("#newPassword").on("input propertychange", function() {
		if(!pswReg.test($(this).val())) {
			$(this).removeClass("correct-input").addClass("error-input");
			$(this).parents(".form-group").find(".form-error-box>p").html("密码长度不正确或包含非法字符（密码只能包含字母、数字和下划线）");
			$(this).parents(".form-group").find(".form-error-box").addClass("show-message");
		} else {
			$(this).removeClass("error-input").addClass("correct-input");
			$(this).parents(".form-group").find(".form-error-box").removeClass("show-message");
		}
	});
	$("#checkPassword").on("input propertychange blur", function() {
		if($("#newPassword").val() != $(this).val()) {
			$(this).removeClass("correct-input").addClass("error-input");
			$(this).parents(".form-group").find(".form-error-box>p").html("两次输入密码不一致");
			$(this).parents(".form-group").find(".form-error-box").addClass("show-message");
		} else {
			$(this).removeClass("error-input").addClass("correct-input");
			$(this).parents(".form-group").find(".form-error-box").removeClass("show-message");
		}
	});
	$("#change-psw-submit").on("click", function() {
		if(pswReg.test($("#newPassword").val()) && $("#newPassword").val() == $("#checkPassword").val()) {
			changepsw.update();
		} else {
			if(!pswReg.test($("#newPassword").val())) {
				$("#newPassword").removeClass("correct-input").addClass("error-input");
				$("#newPassword").parents(".form-group").find(".form-error-box>p").html("密码长度不正确或包含非法字符（密码只能包含字母、数字和下划线）");
				$("#newPassword").parents(".form-group").find(".form-error-box").addClass("show-message");
			}
			if($("#newPassword").val() != $("#checkPassword").val()) {
				$("#checkPassword").removeClass("correct-input").addClass("error-input");
				$("#checkPassword").parents(".form-group").find(".form-error-box>p").html("两次输入密码不一致");
				$("#checkPassword").parents(".form-group").find(".form-error-box").addClass("show-message");
			}
		}
	});
	$("#oldPassword").on("click", function() {
		$("#oldPassword").removeClass("correct-input").removeClass("error-input");
		$("#oldPassword").parents(".form-group").find(".form-error-box>p").html("当前密码不正确");
		$("#oldPassword").parents(".form-group").find(".form-error-box").removeClass("show-message");
	});
 }
 changepsw.update = function() {
 	$.ajax({
		url: BASEURL + 'account/resetAccountPw',
		type: 'POST',
		dataType: 'json',
		data: {
			oldPw: $("#oldPassword").val(),
			newPw: $("#newPassword").val(),
		},
	})
	.done(function(data) {
		if(data.success) {
			$("#oldPassword").val("");
			$("#newPassword").val("");
			$("#checkPassword").val("");
			$("#oldPassword").removeClass("error-input").addClass("correct-input");
			$("#oldPassword").parents(".form-group").find(".form-error-box").removeClass("show-message");
			layer.msg('修改密码成功', {icon: 6,time:2000});
		} else {
			$("#oldPassword").removeClass("correct-input").addClass("error-input");
			$("#oldPassword").parents(".form-group").find(".form-error-box>p").html("当前密码不正确");
			$("#oldPassword").parents(".form-group").find(".form-error-box").addClass("show-message");
		}
	})
	.fail(function() {
		console.log("error");
	})
 }

/* 
 * DSP中心
 */
dspCenter = {};
dspCenter.init = function(){
	//加载日历
	allPage.renderDateSelector(-1, -1);
	this.getSurplus();
	//广告下拉选择
	$(document).on("click", "#ad-select .dropdown-menu>li", function() {
		$(this).parents("#ad-select").attr("data-adid", $(this).attr("data-adid"));
		getTotalNumAboutMessagesEveryDay(1);
	});
	var pagi = new Pagination("#ad-pagination");
	//初始读取数据
	getTotalNumAboutMessagesEveryDay(1);
	//读取数据
	function getTotalNumAboutMessagesEveryDay(pageNo){
		$('.loading-area').fadeIn();
		$("#messagesOKNum").text('0');
		$("#messagesVerifyNum").text('0');
		$.ajax({
			url: BASEURL + 'admin/api/getTotalNumAboutMessagesEveryDay',
			type: 'POST',
			dataType: 'json',
			data: {
				page: pageNo,
				mid: $("#ad-select").attr("data-adid"),
				start_date: $("#startDate").val(),
				end_date: $("#endDate").val()
			},
		})
		.done(function(data) {
			//console.log(data);
			$("#itemContainer").html('');
			$("#messagesOKNum").text(data.messagesOKNum);
			$("#messagesVerifyNum").text(data.messagesVerifyNum);
			if(data.messages != undefined && data.messages.length > 0){
				var messagehtml = '<li id="ad-all" data-adId=""><a>全部广告</a></li>';
				for(var i = 0; i < data.messages.length; i++){
					messagehtml += '<li id="'+data.messages[i].id+'" data-adId="'+data.messages[i].id+'"><a href="#">'+data.messages[i].title+'</a></li>';
				}
				$("#all-ad-list").html(messagehtml);
			}
			if(data.messagesBasic != undefined && data.messagesBasic.length > 0){
				var datahtml = "";
				var viewNum = 0;//展示量
				var clickNum = 0;//点击量
				var clickRate = 0;//点击率
				var moneyAll = 0;//消费
				for(var i = 0; i < data.messagesBasic.length; i++){
					viewNum = parseInt(data.messageTotal[0].show_num);
					clickNum = parseInt(data.messageTotal[0].click_num);
					if(viewNum > 0){
						clickRate = clickNum / viewNum;
					}
					moneyAll = parseInt(data.messageTotal[0].cost);
					var clickRatea = 0;
					if(data.messagesBasic[i].show_num > 0){
						clickRatea = ((data.messagesBasic[i].click_num/data.messagesBasic[i].show_num)*100).toFixed(2);
					}
					var cost = data.messagesBasic[i].cost ? data.messagesBasic[i].cost : 0;
					datahtml += '<ul class="ad-data-list clearfix"><li class="time">'+data.messagesBasic[i].by_date+'</li><li class="show-account">'+data.messagesBasic[i].show_num+'</li><li class="click-num">'+data.messagesBasic[i].click_num+'</li><li class="click-rate">'+clickRatea+'%</li><li class="consumption">￥'+cost+'</li></ul>';
				}
				$("#exposureRate").text(viewNum);
				$("#clickNum").text(clickNum);
				$("#clickRate").text((Math.round(clickRate*100)) + "%");
				$("#consumptionAll").text("￥ " + moneyAll);
				$("#itemContainer").html(datahtml);
				if(data.messageNum > 10){
					var pageCount = Math.ceil(data.messageNum / 10);
					pagi.update({
						pageCount: pageCount,
						pageNo: pageNo
					});
					var activePage = parseInt($("#ad-pagination .pagination>.active").text());
					$(document).off("click", "#ad-pagination .pagination>li").on("click", "#ad-pagination .pagination>li", function() {
						getTotalNumAboutMessagesEveryDay(parseInt($(this).text()));
					});
					$(document).off("click",  "#ad-pagination .pagination-prev").on("click", "#ad-pagination .pagination-prev", function() {
						if(activePage > 1) {
							getTotalNumAboutMessagesEveryDay(activePage - 1);
						}
					});
					$(document).off("click", "#ad-pagination .pagination-next").on("click", "#ad-pagination .pagination-next", function() {
						if(pageCount - activePage  > 0) {
							getTotalNumAboutMessagesEveryDay(activePage + 1);
						}
					});
				} else{
					$("#ad-pagination").html('');
				}
				//分页的结束
			}else{
				$("#exposureRate").text('');
				$("#clickNum").text('');
				$("#clickRate").text('');
				$("#consumptionAll").text('');
				$("#itemContainer").html('');
				$("#ad-pagination").html('');
			}
			$('.loading-area').fadeOut();
		})
		.fail(function(data) {
			//console.log(data);
			$('.loading-area').fadeOut();
		});
	}

	$("#submitTime").on('click',function(event) {
		event.preventDefault();
		getTotalNumAboutMessagesEveryDay(1);
	});
}
dspCenter.getSurplus = function() {
	$.ajax({
		url: BASEURL + 'admin/api/AccountBalanceShow',
		type: 'POST',
		dataType: 'json'
	})
	.done(function(data) {
		if(data.success) {
			//渲染
			if(data.errCode == 200) {
				$("#finance-surplus").text(data.result[0].balance);	
			} else {
				$("#finance-surplus").text("0");
			}
		}
	})
	.fail(function() {
		$("#finance-surplus").html("0");
		console.log("error");
	});
}
/* 
 * 添加芯片
 */
addChip = {};
addChip.init = function(){
	$('.add-ad-submit').on('click',function(event) {
		event.preventDefault();
		var chipCode = $('#chip-code').val();
		var chipName = $('#chip-name').val();
		if (!chipCode) {
			layer.msg('请输入正确的芯片码', {icon: 5,time:2000});
			$('#chip-code').focus();
			return;
		}
		if (!chipName) {
			layer.msg('请输入正确的芯片名称', {icon: 5,time:2000});
			$('#chip-name').focus();
			return;
		}
		if (chipName.length > 10) {
			layer.msg('芯片名称应不长于10位', {icon: 5,time:2000});
			$('#chip-name').focus();
			return;
		}
		$('.loading-area').fadeIn();
		$.ajax({
			url: BASEURL + 'chip/addChipBySunAccount',
			type: 'POST',
			dataType: 'json',
			data: {
				chip_no: chipCode,
				chip_name: chipName
			},
		})
		.done(function(data) {
			if (data.success) {
				layer.msg('添加芯片完成', {icon: 6,time:2000});
				$('.loading-area').fadeOut();
				$('#chip-code').val('');
				$('#chip-name').val('');
			} else {
				layer.msg('添加失败,请再试一次', {icon: 5,time:2000});
			}
		})
		.fail(function() {
			console.log("error");
		});
	});
}


// 场景分类（首页）
var scene = {};
scene.init = function(){
	this.renderChipSelector();
	$('#page-index').val(2);
	this.renderSceneSelector(1);
	var that = this;
	$(document).on("click", "#chip-select .dropdown-menu>li", function() {
		$(this).parents("#chip-select").attr("data-chipNo", $(this).attr("data-chipNo"));
		$('#scene-item-list').html('');
		$('#page-index').val(2);
		that.renderSceneSelector(1, $("#chip-select").attr("data-chipNo"));
	});
	//获取更多
	$(document).on("click", "#more-scene", function() {
		var currentPage = $('#page-index').val();
		$('#page-index').val((parseInt(currentPage) + 1));
		that.renderSceneSelector(parseInt(currentPage), $("#chip-select").attr("data-chipNo"));
	});
	
	$('#perfect-information-module .withdraw-shadow').click(function() {
		$("#perfect-information-module .withdraw-shadow").fadeOut();
		$("#perfect-information-module .perfect-information-box").fadeOut();
	});
	
}
scene.renderChipSelector = function() {
	$.ajax({
		url: BASEURL + 'admin/api/getChipTagByUser',
		type: 'POST',
		dataType: 'json',
		data: {
			uid: ''
		}
	})
	.done(function(data) {
		if(data.success) {
			var html = '<li id="chip-all" data-chipId="" data-chipNo="undefined"><a>全部芯片</a></li>';
			for(var i = 0, len = data.result.length; i < len; i++) {
				var chipInfo = data.result[i];
				html += '<li data-chipId="' + chipInfo.id + '" data-chipNo="' + chipInfo.chip_no + '"><a>' + chipInfo.chip_name + '</a></li>';
			}
			$("#chip-select .dropdown-menu").html(html);
		}
	})
	.fail(function() {
		console.log("error");
	});
}
scene.renderSceneSelector = function(pageIndex, chipcode) {
	$('.loading-area').fadeIn();
	var snum = 12;
	chipcode = chipcode == "undefined" ? undefined : chipcode;
	$.ajax({
		url: BASEURL + 'admin/api/getScenesByChipCode',
		type: 'POST',
		dataType: 'json',
		data: {
			chip_code: chipcode,
			index: pageIndex,
			num: snum
		},
	})
	.done(function(data) {
		console.log(data);
		var sceneList = "";
		if(data.success) {
			if(data.result.total == undefined || data.result.total == null){
				return;
			}
			if(data.result.total > 0){
				$('.no-data').hide();
				$('.no-more').hide();
				$('#scene-total-num').text(data.result.total);//总数
				var pageCount = Math.ceil(data.result.total / snum);//计算总页数
				$('#page-count').val(pageCount);//设置总页数
				if(data.result.total > snum){
					$('.see-more-scene').css('display', 'block');
				} else {
					$('.see-more-scene').css('display', 'none');
				}
				for(var i = 0; i < data.result.scenes.length; i++){
					var status = data.result.scenes[i].status === 0 ? "incomplete" : "complete";
					if(status == "complete"){//完善了信息
						sceneList += '<li class="complete" data-chipid="' + data.result.scenes[i].chip_id + '" data-mac="' + data.result.scenes[i].chip_no + '" data-name="' + data.result.scenes[i].initial_name + '">';
						sceneList += '<h3 class="tit">'+ data.result.scenes[i].current_name +'</h3>';
						sceneList += '<p class="type">'+ data.result.scenes[i].scenes_name +'</p>';
						sceneList += '<p class="addr">'+ data.result.scenes[i].city.substring(0,7) +'...<span class="ad-icon addr-tips" data-tipso="'+ data.result.scenes[i].city + data.result.scenes[i].addr +'"></span></p>';
						sceneList += '</li>';
					}else if(status == "incomplete"){//未完善信息
						sceneList += '<li class="incomplete" data-chipid="' + data.result.scenes[i].chip_id + '" data-mac="' + data.result.scenes[i].chip_no + '">';
						sceneList += '<h3 class="tit">' + data.result.scenes[i].current_name + '</h3>';
						sceneList += '<p class="info-incomplete">信息未完善</p>';
						sceneList += '</li>';
					}
				}
				$('#scene-item-list').html($('#scene-item-list').html() + sceneList);
				if(pageIndex == parseInt($('#page-count').val())){
					$('.see-more-scene').css('display', 'none');
					$('.no-more').show();
				}
			} else{
				$('.no-data').show();
				$('.no-more').hide();
				$('#scene-total-num').text(0);//总数
				$('.see-more-scene').css('display', 'none');
			}
		}
		$('.loading-area').fadeOut();
		$('#scene-item-list .complete .addr .addr-tips').tipso({
			useTitle: false,
			width: 'auto',
			position: 'bottom',
			background: '#626262'
		});
	})
	.fail(function(data) {
		console.log('error');
	});
	
	
	$(document).on("click", "#scene-item-list li", function() {
		addCookie('chip_no', $(this).attr('data-mac'), 2);
		addCookie('chip_id', $(this).attr('data-chipid'), 2);
		if($(this).hasClass('complete')){
			console.log($(this).attr('data-name'));
			addCookie('scene_name', $(this).attr('data-name'), 2);
			window.location.href = BASEURL + 'admin/new_index';
		}else if($(this).hasClass('incomplete')){
			addCookie('scene_name', $(this).children('.tit').text(), 2);
			$("#scene-name").text($(this).children('.tit').text());
			$("#perfect-information-module .withdraw-shadow").fadeIn();
			$("#perfect-information-module .perfect-information-box").fadeIn();
		}
	});

}

// 完善信息
var information = {};
information.init = function(){
	var that = this;
	$('#sceneName').val(getCookie("scene_name"));//赋值旧名称
	$.ajax({
		url: BASEURL + 'admin/api/getScenesAtData',
		type: 'POST',
		dataType: 'json'
	})
	.done(function(data) {
		console.log(data.result);
		var AllSceneAt = '';//大的父级
		var firstSceneAt = firstSceneAt1 = '<div class="scene-item">';//一级类型
		var secondSceneAt = secondSceneAt1 = '<div class="second-level">';//二级类型
		var asdfas = data.result[0].length;
		for(var i = 0; i < data.result[0].length; i++){
			if(i < 7){
				firstSceneAt += '<a href="javascript:;" class="'+that.getSceneAtIcon(data.result[0][i].scenes_name)+'" data-second="scene-item-'+data.result[0][i].scenes_id+'" data-bigid="'+data.result[0][i].scenes_id+'">'+data.result[0][i].scenes_name+'</a>';
				secondSceneAt += '<div class="second-level-item clearfix" id="scene-item-'+data.result[0][i].scenes_id+'">';
				var index = parseInt(data.result[0][i].scenes_id);
				for(var j = 0; j < data.result[index].length; j++){
					secondSceneAt += '<a href="javascript:;" data-atid="'+data.result[index][j].scenes_id+'">'+data.result[index][j].scenes_name+'</a>';
				}
				secondSceneAt += '</div>';
			} else if(i < 14){
				firstSceneAt1 += '<a href="javascript:;" class="'+that.getSceneAtIcon(data.result[0][i].scenes_name)+'" data-second="scene-item-'+data.result[0][i].scenes_id+'" data-bigid="'+data.result[0][i].scenes_id+'">'+data.result[0][i].scenes_name+'</a>';
				secondSceneAt1 += '<div class="second-level-item clearfix" id="scene-item-'+data.result[0][i].scenes_id+'">';
				var index = parseInt(data.result[0][i].scenes_id);
				for(var j = 0; j < data.result[index].length; j++){
					secondSceneAt1 += '<a href="javascript:;" data-atid="'+data.result[index][j].scenes_id+'">'+data.result[index][j].scenes_name+'</a>';
				}
				secondSceneAt1 += '</div>';
			}
		}
		firstSceneAt += '</div>', secondSceneAt += '</div>', firstSceneAt1 += '</div>', secondSceneAt1 += '</div>';
		AllSceneAt = firstSceneAt + secondSceneAt + firstSceneAt1 + secondSceneAt1;
		$('#scene-type-list').html(AllSceneAt);
	})
	.fail(function() {
		console.log("error");
	});
	$(document).on("click", ".scene-item a", function() {
		$('.scene-item a').removeClass('on');
		$('.second-level-item').hide();
		var secondId = $(this).attr('data-second');
		$(this).addClass('on').siblings('a').removeClass('on');
		$("#"+secondId).fadeIn();
		$('#scene-big').val($(this).attr('data-bigid'));
	});
	$(document).on("click", ".second-level-item a", function() {
		$('.second-level-item a').removeClass('on');
		$(this).addClass('on');
		$('#scene-small').val($(this).attr('data-atid'));
	});
	$('#save-scene-btn').click(function() {
		var chipNo = getCookie("chip_no");//芯片码
		var oldName = getCookie("scene_name");//旧的名称
		if($('#sceneName').val() == ""){
			layer.msg('场景简称不能为空！', {icon: 5,time:2000});
			$('#sceneName').focus();
			return false;
		}else if($('#scene-small').val() == ""){
			layer.msg('请选择场景类型！', {icon: 5,time:2000});
			return false;
		}else if($('#city').val() == ""){
			layer.msg('省市区不能为空！', {icon: 5,time:2000});
			return false;
		}else if(chipNo == "" || oldName == ""){
			layer.msg('获取信息失败，请返回重试', {icon: 5,time:2000}, function(){
				window.location.href = BASEURL + 'admin/new_scene';
			});
			return false;
		}
		var newName = $('#sceneName').val();//新名称
		var scenes_id = $('#scene-small').val();//类型id
		var city = $('#city').val();//城市
		var address = $('#detail-adr').val();//详细地址
		$.ajax({
			url: BASEURL + 'admin/api/updateScenesInfo',
			type: 'POST',
			dataType: 'json',
			data: {
				initial_name: oldName,
				current_name: newName,
				chip_no: chipNo,
				scenes_id: scenes_id,
				city: city,
				addr: address
			},
		})
		.done(function(data) {
			console.log(data);
			if(data.success == true && data.errMsg == "更新成功"){
				layer.msg('信息更新成功', {icon: 6,time:2000}, function(){
					window.location.href = BASEURL + 'admin/new_scene';
				});
			}else if(data.success == false){
				layer.msg(data.errMsg, {icon: 5,time:2000});
			}
		})
		.fail(function(data) {
			console.log('error');
		});
	});
}
information.getSceneAtIcon = function(atName){
	if(atName == "美食"){
		return "food";
	} else if(atName == "生活服务"){
		return "life";
	} else if(atName == "丽人"){
		return "beauty";
	} else if(atName == "汽车"){
		return "car";
	} else if(atName == "出行服务"){
		return "travel";
	} else if(atName == "教育培训"){
		return "education";
	} else if(atName == "医疗健康"){
		return "health";
	} else if(atName == "旅游/本地游"){
		return "touring";
	} else if(atName == "房产"){
		return "house";
	} else if(atName == "本地酒店"){
		return "hotel";
	} else if(atName == "本地购物"){
		return "shopping";
	} else if(atName == "休闲娱乐"){
		return "leisure";
	} else if(atName == "体育健身"){
		return "sports";
	}
}
// 芯片列表
var chipList = {};
chipList.init = function(){
	$('.loading-area').fadeIn();
	var pagi = new Pagination("#chip-list-pagination");
	getChipListData(1);
	function getChipListData(pageNo){
		var snum = 20;
		$.ajax({
			url: BASEURL + 'chip/getChips',
			type: 'POST',
			dataType: 'json',
			data: {
				user_id: '',
				page_index: pageNo,
				num_perpage: snum
			}
		})
		.done(function(data) {
			console.log(data);
			$('.loading-area').fadeOut();
			if(data.success){
				if(data.result == undefined || data.result == null){
					return;
				}
				if(data.result.datas.length > 0){
					$("#chip-total-num").text(data.result.count);
					var dataListHtml = '';
					for(var i = 0; i < data.result.datas.length; i++){
						dataListHtml += '<ul class="clearfix">';
						dataListHtml += '<li class="chip-name">' + data.result.datas[i].chip_name + '</li>';
						dataListHtml += '<li class="chip-no">' + data.result.datas[i].chip_no + '</li>';
						dataListHtml += '<li class="add-time">' + data.result.datas[i].add_time + '</li>';
						dataListHtml += '<li class="scene-number">' + data.result.datas[i].scene_number + '</li>';
						dataListHtml += '<li class="operation"><a href="javascript:;" data-chipid="' + data.result.datas[i].chip_id + '">编辑</a></li>';
						dataListHtml += '</ul>';
					}
					$('#chipList-data').html(dataListHtml);
					if(data.result.count > snum){
						var pageCount = Math.ceil(data.result.count / snum);
						pagi.update({
							pageCount: pageCount,
							pageNo: pageNo
						});
						var activePage = parseInt($("#chip-list-pagination .pagination>.active").text());
						$(document).off("click", "#chip-list-pagination .pagination>li").on("click", "#chip-list-pagination .pagination>li", function() {
							getChipListData(parseInt($(this).text()));
						});
						$(document).off("click",  "#chip-list-pagination .pagination-prev").on("click", "#chip-list-pagination .pagination-prev", function() {
							if(activePage > 1) {
								getChipListData(activePage - 1);
							}
						});
						$(document).off("click", "#chip-list-pagination .pagination-next").on("click", "#chip-list-pagination .pagination-next", function() {
							if(pageCount - activePage  > 0) {
								getChipListData(activePage + 1);
							}
						});
					} else{
						$("#chip-list-pagination").html('');
					}
					//分页的结束
				}else{
					console.log("暂无数据");
				}
			}
		})
		.fail(function(data) {
			console.log(data);
		});
	}
	
	$(document).on("click", "#chipList-data ul li.operation a", function() {
		addCookie('updateChipId', $(this).attr('data-chipid'), 2);
		window.location.href = BASEURL + 'admin/new_updateChip';
	});
}

// 修改芯片
var updateChip = {};
updateChip.init = function(){
	$('.loading-area').fadeIn();
	var chipId = parseInt(getCookie('updateChipId'));
	if(chipId == undefined || chipId == null || isNaN(chipId)){
		layer.ready(function(){
			layer.msg('获取信息失败，请返回重试', {icon: 5,time:2000}, function(){
				window.location.href = BASEURL + 'admin/new_chipList';
			});
		});
	}else {
		$.ajax({
			url: BASEURL + 'admin/api/getChipsInfobyChipID',
			type: 'POST',
			dataType: 'json',
			data: {
				chip_id: chipId
			}
		})
		.done(function(data) {
			console.log(data);
			$('.loading-area').fadeOut();
			if(data.success){
				if(data.data == undefined || data.data == null){
					layer.msg('读取芯片信息失败，请返回重试', {icon: 5,time:2000}, function(){
						window.location.href = BASEURL + 'admin/new_chipList';
					});
				}
				$('#chip-id').val(data.data.id);
				$('#chip-code').val(data.data.chip_no);
				$('#chip-name').val(data.data.chip_name);
			}else{
				layer.msg('读取芯片信息失败，请返回重试', {icon: 5,time:2000}, function(){
					window.location.href = BASEURL + 'admin/new_chipList';
				});
			}
		})
		.fail(function(data) {
			console.log("error");
		});
	}
	$('#update-chip-btn').click(function() {
		var chipCode = $('#chip-code').val();
		var chipName = $('#chip-name').val();
		if (!chipCode) {
			layer.msg('请输入正确的芯片码', {icon: 5,time:2000});
			$('#chip-code').focus();
			return;
		}
		if (!chipName) {
			layer.msg('请输入正确的芯片名称', {icon: 5,time:2000});
			$('#chip-name').focus();
			return;
		}
		if (chipName.length > 10) {
			layer.msg('芯片名称应不长于10位', {icon: 5,time:2000});
			$('#chip-name').focus();
			return;
		}
		$('.loading-area').fadeIn();
		$.ajax({
			url: BASEURL + 'chip/updateChipBusiness',
			type: 'POST',
			dataType: 'json',
			data: {
				chip_id: $('#chip-id').val(),
				chip_name: $('#chip-name').val(),
				chip_no: $('#chip-code').val()
			}
		})
		.done(function(data) {
			console.log(data);
			$('.loading-area').fadeOut();
			if(data.success){
				if(data.errMsg == "修改成功"){
					layer.msg('修改芯片信息成功', {icon: 6,time:2000}, function(){
						window.location.href = BASEURL + 'admin/new_chipList';
					});
				}
			}else{
				layer.msg('修改芯片信息失败，请刷新重试', {icon: 5,time:2000});
			}
		})
		.fail(function() {
			console.log("error");
		});
	});
}

//自助添加广告
var advertForMac = {};
advertForMac.init = function() {
	this.uploadImg();
	$("input[name='mac']").on("change", function() {
		if($("#mac-1").prop("checked")) {
			var input = document.getElementById("add-txt"); 

			if(typeof FileReader==='undefined'){ 
				layer.alert("抱歉，你的浏览器不支持读取TXT文件的功能");
				input.setAttribute('disabled','disabled'); 
			}else{ 
				input.addEventListener('change', advertForMac.readFile, false); 
			} 
			$(".text-file-button").removeClass("hide");
		} else {
			$(".text-file-button").addClass("hide");
		}
	});
	$("#send-btn").on("click", function() {
		advertForMac.sendInfo();
	});
	$("#mac-list").on("blur input click", function() {
		var macArr = advertForMac.getMacList($("#mac-list").val());
		$("#mac-count").text(macArr.length);
	});

	function readFile(){ 
		var file = this.files[0];
		var reader = new FileReader(); 
		reader.readAsText(file, "UTF-8"); 
		reader.onload = function(e){ 
			$("#mac-list").val(this.result);
		} 
	} 
}
advertForMac.getMacList = function(str) {
	var arr = str.split("\n");
	var result = [];
	for (var i = 0; i < arr.length; i++) {
		if(new RegExp(/^([0-9a-fA-F]{2})(([:][0-9a-fA-F]{2}){5})$/).test(arr[i])) {
			result.push(arr[i].toLowerCase());
		}
	}
	return result;
}
advertForMac.getUrl = function(str) {
	var result = "";
	var httpReg = new RegExp(/^https?:\/\//);
	if(httpReg.test(str)) {
		result = str;
	} else {
		result = "http://" + str;
	}
	return result;
}
advertForMac.sendInfo = function() {
	var message_cover = $("#image-qiniu-url").val();
	var message_url = advertForMac.getUrl($("#ad-url").val());
	var message_mac = advertForMac.getMacList($("#mac-list").val());
	if(message_cover == "") {
		layer.alert("请上传图片");
		return;
	}
	if(message_url == "") {
		layer.alert("请输入链接");
		return;
	}
	if(message_mac.length <= 0) {
		layer.alert("请输入有效的MAC地址");
		return;
	}
	$(".loading-area").fadeIn();
	$.ajax({
		url: BASEURL + 'admin/api/messagePushContactScene',
		type: 'POST',
		dataType: 'json',
		data: {
			message_cover: message_cover,
			message_url: message_url,
			message_mac: message_mac
		}
	})
	.done(function(data) {
		if(data.success) {
			layer.alert("发布成功，请点击确定查看效果", function() {
				window.location = BASEURL + "admin/agent_ad";
			});
		} else {
			layer.alert("发布失败");
		}
		$(".loading-area").fadeOut();
	})
	.fail(function() {
		layer.alert("发布失败");
		$(".loading-area").fadeOut();
		console.log("error");
	});
}
advertForMac.readFile = function() { 
	var file = this.files[0];
	var reader = new FileReader(); 
	reader.readAsText(file, "UTF-8"); 
	reader.onload = function(e){ 
		$("#mac-list").val(this.result);
		$("#mac-list").click();
	}
} 
advertForMac.uploadImg = function() {
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
		browse_button: 'ad-img',
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
				var url = domain + infoObj.key;
				var $status = $('#uploading-kidd');
				$status.unbind('click')
						.unbind('mouseenter')
						.unbind('mouseleave')
						.text('上传成功：'+url)
						.css('cursor', 'auto');
				var $btn = $("#ad-img");
				//$btn.prop("disabled", true);
				//$btn.siblings(".file-button").addClass("disabled");
				//$('#hImg').val(domain + infoObj.key);
				$('#image-qiniu-url').val(url);
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
					$btn.text('图片不能超过100kb，请重新上传').show();
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
}

//写Cookie
function addCookie(objName, objValue, objHours) {
    var str = objName + "=" + escape(objValue);
    if (objHours > 0) {//为0时不设定过期时间，浏览器关闭时cookie自动消失
        var date = new Date();
        var ms = objHours * 3600 * 1000;
        date.setTime(date.getTime() + ms);
        str += "; expires=" + date.toGMTString();
    }
    document.cookie = str;
}

//读Cookie
function getCookie(objName) {//获取指定名称的cookie的值
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] == objName) return unescape(temp[1]);
    }
    return "";
}

