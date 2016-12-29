var seller={};

seller.init = function(){
	BASEURL = BASEURL || "";

	window.history.forward(1);

    //处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
    function banBackSpace(e) {   
        var ev = e || window.event;//获取event对象   
        var obj = ev.target || ev.srcElement;//获取事件源   
        
        var t = obj.type || obj.getAttribute('type');//获取事件源类型  
        
        //获取作为判断条件的事件类型
        var vReadOnly = obj.getAttribute('readonly');
        var vEnabled = obj.getAttribute('enabled');
        //处理null值情况
        vReadOnly = (vReadOnly == null) ? false : vReadOnly;
        vEnabled = (vEnabled == null) ? true : vEnabled;
        
        //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
        //并且readonly属性为true或enabled属性为false的，则退格键失效
        var flag1=(ev.keyCode == 8 && (t=="password" || t=="text" || t=="textarea") 
                    && (vReadOnly==true || vEnabled!=true))?true:false;
       
        //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
        var flag2=(ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea")
                    ?true:false;        
        
        //判断
        if(flag2){
            return false;
        }
        if(flag1){   
            return false;   
        }   
    }

    //禁止后退键 作用于Firefox、Opera
    document.onkeypress = banBackSpace;
    //禁止后退键  作用于IE、Chrome
    document.onkeydown = banBackSpace;
}
seller.initIndex = function (){
	var messageType = {1:"other",2:"Website"};
	var service_provider = {"1":"other","2":"China Unicom","3":"China Mobile","4":"China Telecom"};
	var network_type={"1":"other","2":"2G","3":"3G","4":"4G","5":"wifi"};
	var user_type={"1":"other","2":"business","3":"App Developer"};
	var terminal_type={"1":"other","2":"IOS","3":"Android"};// console.log(service_provider);
	checkMessage();
	$('.supporter_quit').click(function(event) {
		window.location.href = BASEURL + 'admin/api/logout';
	});
	 $('.supporter_nav_container').on('click', '.nav_section', function(event) {
        event.preventDefault();
        $(this).toggleClass('supporter_mose_active');
        $(this).parent(".supporter_sections").children('.supporter_sections ul').toggle();
    });
	$('ul.message_list').on('click', '.Tolist_detail', function(event) {
		event.preventDefault();
		$('.mes_list').hide();
		setTimeout(function() {
			$('.messageDetail').fadeIn();
		}, 600);
	});
	$('ul.personal_center').on('click', '.profile_setting', function(event) {
	    $('.mes_list').hide();
	    $('#basic_info_set').fadeIn();
	});
	$('ul.personal_center').on('click', '.modify_pasw', function(event) {
		$('.mes_list').hide();
		$('#change_password').fadeIn();
	});
	$('.nav_addMessage').click(function(event) {
		/* Act on the event */
		event.preventDefault();
		$('.mes_list').hide();
		$('.seller_addMessage').fadeIn();
	});
	//提交增加消息
	$('.seller_addMessage').on('click', '.submit_addMessage', function(event) {
		event.preventDefault();
		var content = $("input[name='messageContent']").val();
		var messageType = $("#message_type option:selected").val();
		var description = $("input[name='description']").val();
		
		if (description == '') {
			alert('请填写推送描述！');
			return;
		}

		if (content == '') {
			alert('请填写推送的内容！');
			return;
		}

		if (messageType == '2') {
			$('.website_describe').show();
			if (!CheckUrl(content)) {
				alert('请填写正确的网址!');
				return;
			}
			if (description == '') {
				alert('请填写推送描述！');
				return;
			}	
		}

		addMessage(messageType,content,description);
		$('.mes_list').hide();
		checkMessage();
		setTimeout(function(){
			$('.seller_checkMessage').fadeIn();
		},500);
	});
	//查看全部信息
	$('ul.message_list').on('click', '.Tolist_all', function(event) {
		$('.mes_list').hide();
		checkMessage();
		setTimeout(function (){
			$('.seller_checkMessage').fadeIn();
		});
	});
	//查看单条信息
	$('.view_allmessage tbody').on('click', '.mes_type,.mes_content,.mes_description,.mes_ctime,.mes_date', function(event) {
	    event.preventDefault();
	    var this_messageID=$(this).parent('tr').find('.mes_id').html();
	    // console.log(this_messageID);
	    getMessageDetail(this_messageID);
	    userMessage(this_messageID);
	    $('.mes_list').hide();
	    setTimeout(function() {
	    	$('.messageDetail').fadeIn();
	    }, 600);
	});
	/**查看用户的轨迹*/
	$('.userFigure').on('click', '.user_track', function(event) {
        var userid = $(this).attr('data-uid');
        // console.log(userid);
        usertrack(userid);
        $('.mes_list').hide();
        $('#backward').show();
        $('#user_gps').fadeIn();
    });
	/** 后台首页 */
    $('.supporter_backstage_mian').click(function(event) {
        /* Act on the event */
        $('.Tolist_all').click();
    });

    /** backstage logo */
    $('.supporter_st').click(function(event) {
        /* Act on the event */
        window.location.href = BASEURL;
    });
    $('.backward').click(function() {
    	getMessageDetail();
	    userMessage();
	    $('.mes_list').hide();
	    setTimeout(function() {
	    	$('.messageDetail').fadeIn();
	    }, 600);
    });
	// 下一页上一页
	$('.seller_checkMessage').on('click', '.prev', function(event) {
	    var per_href = $(this).attr('data-per');
	    if (per_href==''||per_href=='null') {
	        return false;
	    }
	    else{
	        checkMessage(per_href);
	    }
	});
	$('.seller_checkMessage').on('click', '.next', function(event) {
	    var next_href = $(this).attr('data-next');
	    if (next_href==''||next_href=='null') {
	        return false;
	    }else{
	        checkMessage(next_href);
	    }
	});
	$('.userFigure ').on('click', '.prev', function(event) {
		var per_href = $(this).attr('data-per');
		var mid = $(this).attr('data-id');
	    if (per_href==''||per_href=='null') {
	        return false;
	    }
	    else{
	       	userMessage(mid,per_href);
	    }
	});
	$('.userFigure').on('click', '.next', function(event) {
		var next_href = $(this).attr('data-next');
		var mid = $(this).attr('data-id');
	    if (next_href==''||next_href=='null') {
	        return false;
	    }else{
	        userMessage(mid,next_href);
	    }
	});
	$('#user_gps').on('click', '.prev', function(event) {
        var per_href = $(this).attr('data-per');
        var uid = $(this).attr('data-uid');
        if (per_href==''||per_href=='null') {
            return false;
        }
        else{
            usertrack(uid,per_href);
        }
    });
    $('#user_gps').on('click', '.next', function(event) {
        var next_href = $(this).attr('data-next');
        var uid = $(this).attr('data-uid');
        if (next_href==''||next_href=='null') {
            return false;
        }else{
            usertrack(uid,next_href);
        }
    });
	
	// 删除
	$('.seller_checkMessage').on('click', '.control_delete', function(event) {
	    var thisContent = $(this).parent().siblings('.mes_content').children().text();
	    var thismesID = $(this).parent().siblings('.mes_id').html();
	    if (deleteMessage(thisContent)) {
	    	$.ajax({
	    		url: BASEURL + 'admin/api/deleteMessage',
	    		type: 'POST',
	    		dataType: 'json',
	    		data: {
	    			id: thismesID,
	    		},
	    	})
	    	.done(function(data) {
	    		if (data.success) {
			    	setTimeout(function (){
			    		checkMessage();
			    	});
	    		}
	    		else{
	    			alert('不能删除该数据');
	    			console.log(data.errMsg);
		    		checkMessage();
	    		}
	    	})
	    	.fail(function() {
	    		console.log("服务器错误");
	    		return false;
	    	})
	    	
	    }	        
	});

	//修改
	$('.seller_checkMessage').on('click', '.control_edit', function(event) {
		event.preventDefault();
		var thisContent = $(this).parent().siblings('.mes_content').children().text();
	    var thismesID = $(this).parent().siblings('.mes_id').html();
	    var thisDescribtion =$(this).parent().siblings('.mes_description').children().text();
		var thisMessageType =$(this).parent().siblings('.mes_type').attr('data-id');
		$(".seller_editMessage #messageContent").val(thisContent);
		$(".seller_editMessage #description").val(thisDescribtion);
		$(".seller_editMessage #edit_mes_id").val(thismesID);
		$('.mes_list').hide();
		$('.seller_editMessage').fadeIn();
	});

	$('.seller_editMessage').on('click', '.submit_editMessage', function(event) {
		
		var content = $(".seller_editMessage input[name='messageContent']").val();
		var messageType = $(".seller_editMessage #message_type option:selected").val();
		var description = $(".seller_editMessage input[name='description']").val();
		var messageID =$(".seller_editMessage #edit_mes_id").val();

		if (description == '') {
			alert('请填写推送描述！');
			return;
		}
		
		if (content == '') {
			alert('请填写推送的内容！');
			return;
		}

		if (messageType == '2') {
			$('.website_describe').show();
			if (!CheckUrl(content)) {
				alert('请填写正确的网址!');
				return;
			}
		}
		editMessage(messageID,messageType,content,description);
	});

	$.ajax({
	    url: BASEURL+'admin/api/getInfo',
	    type: 'POST',
	    dataType: 'json',
	    data: {},
	})
	.done(function(data) {
	    if(data.success){
	        $("#basic_info_name").val(data.result.name);
	        $("#basic_info_email").val(data.result.email);
	        $("#basic_info_addr").val(data.result.addr);
	        $("#basic_info_qq").val(data.result.qq_id);
	        $("#basic_info_weibo").val(data.result.weibo_id);
	        $("#basic_info_nickname").val(data.result.nickname);
	    }
	})
	.fail(function() {
	    console.log("error");
	})

	//验证汉字
	var checkName = function (name) {
	    var reg = /^[\u4e00-\u9fa5]{2,10}$/;
	    return reg.test(name);
	};
	//验证邮箱
	var myreg_email = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;

	//保存用户基本信息
	$("#basic_info_set .enter_save").on('click',function(event) {
	    event.preventDefault();
	    /* Act on the event */
	    if(!checkName($("#basic_info_name").val()) || $("#basic_info_name").val() == ''){
	        alert("联系人姓名为必填选项,请输入正确的汉字");
	        return;
	    }
	    if($("#basic_info_email").val() == '' || !myreg_email.test($("#basic_info_email").val())){
	        alert("邮箱为必填选项,请输入正确的邮箱");
	        return;
	    }
	    if($("#basic_info_addr").val() == ''){
	        alert("联系地址为必填选项,请输入正确的联系地址");
	        return;
	    }

	    $.ajax({
	        url: BASEURL+'admin/api/setInfo',
	        type: 'POST',
	        dataType: 'json',
	        data: {
	            name: $("#basic_info_name").val(),
	            email: $("#basic_info_email").val(),
	            addr: $("#basic_info_addr").val(),
	            nickname: $("#basic_info_nickname").val(),
	            weibo: $("#basic_info_weibo").val(),
	            qq: $("#basic_info_qq").val(),
	        },
	    })
	    .done(function(data) {
	        if(data.success){
	            alert("保存成功!");
                $('.Tolist_all').click();
	            checkMessage();
	        }else{
	            alert("保存失败,请重新保存!");
	        }
	    })
	    .fail(function() {
	        console.log("error");
	    })
	});

	//修改密码
	$("#change_password .enter_save").on('click',function(event) {
	    event.preventDefault();
	    /* Act on the event */
	    if(!$("#change_old_password").val()){
	        alert("请输入旧密码!");
	        return;
	    }
	    if(!$("#change_new_password").val()){
	        alert("请输入新密码!");
	        return;
	    }
	    if($("#change_new_password").val().length < 8){
	        alert("密码长度必须大于或等于八位");
	        return;
	    }
	    if(!$("#enter_new_password").val()){
	        alert("请确认新密码!");
	        return;
	    }
	    if($("#change_new_password").val() != $("#enter_new_password").val()){
	        alert("新密码两次输入不相等,请重新输入");
	        return;
	    }
	    $.ajax({
	        url: BASEURL+'admin/api/updatePasswd',
	        type: 'POST',
	        dataType: 'json',
	        data: {
	            oldPw: $("#change_old_password").val(),
	            newPw: $("#change_new_password").val(),
	        },
	    })
	    .done(function(data) {
	        if(data.success){
	            alert("更新成功");
                $('.Tolist_all').click();
	            checkMessage();
	        }
	    })
	    .fail(function() {
	        console.log("error");
	    })
	});
	function userMessage(mid,url){
		if (!url) {
			url = BASEURL+'admin/api/businessGetUsersInfo';
		};
		$.ajax({
			url: url,
			type: 'POST',
			dataType: 'json',
			data: {
				mid: mid
			},
		})
		.done(function(data) {
			// console.log(data);
			if (data.success) {
				var user_list = data.result.data;
                var current_page = data.result.current_page;
                var totalPage = Math.ceil(data.result.total/data.result.per_page);
                $('.userFigure .table_footer').html('');
                $('.userFigure tbody').html('');
                $('.userFigure .table_footer').append(
                    '<div class="page_btn" style="height: 50px;">'+
                        '<span class="page_box">'+
                            '<a data-id="'+mid+'" data-per="'+data.result.prev_page_url+'" class="prev"></a>'+
                            '<a data-id="'+mid+'" data-next="'+data.result.next_page_url+'" class="next"></a>'+
                        '</span>'+
                    '</div>'
                );
                if (data.result.prev_page_url !=null) {
                    $('.userFigure .prev').css('border-right', '10px solid #000');
                }
                if (data.result.next_page_url !=null ) {
                    $('.userFigure .next').css('border-left', '10px solid #000');
                }
			    for (var i = 0; i < user_list.length; i++) {
			        var date = new Date(parseInt(user_list[i].ctime)*1000).format('yyyy-MM-dd');
			        $('.userFigure tbody').append(
			            '<tr>'+
			                '<td class="user_mac"><div class="inner">'+user_list[i].mac_addr+'</div></td>'+
			                '<td class="user_deviceID"><div class="inner" title="' + user_list[i].device_id + '">'+user_list[i].device_id+'</div></td>'+
			                '<td class="user_provider"><div class="inner">'+service_provider[user_list[i].service_provider_id]+'</div></td>'+
			                '<td class="user_network"><div class="inner">'+network_type[user_list[i].network_type_id]+'</div></td>'+
			                '<td class="user_terminal"><div class="inner">'+user_list[i].terminal_name+'</div></td>'+
			                '<td class="user_terminalVersion"><div class="inner">'+user_list[i].terminal_version+'</div></td>'+
			                '<td class="user_machine"><div class="inner">'+user_list[i].machine_type+'</div></td>'+
			                '<td class="user_ctime"><div class="inner">'+date+'</div></td>'+
			                '<td class="user_control"><div class="inner">'+
			                    '<a data-uid="'+user_list[i].id+'" class="user_track" href="#">查看轨迹</a>'+
			                '</div></td>'+
			            '</tr>'
			        );
			    };
			}
			
		})
		.fail(function(data) {
			console.log(data.errMsg);
		})
	}
	function editMessage(id,message_type_id,content,description){
		$.ajax({
			url: BASEURL + 'admin/api/updateMessage',
			type: 'POST',
			dataType: 'json',
			data: {
				id: id,
				message_type_id:message_type_id,
				content:content,
				description:description,
			},
		})
		.done(function(data) {
			console.log("success");
			$('.mes_list').hide();
			checkMessage();
			alert('修改成功');
			$('.seller_checkMessage ').fadeIn();
		})
		.fail(function() {
			console.log("error");
		})
	}
	function deleteMessage(Messa){
		if (confirm('你确定要删除'+Messa+'这条数据吗？')) {
		    return true;
		}
		else{
		    return false;
		}
	}
	function CheckUrl(url){
		var RegUrl = new RegExp();
        RegUrl.compile("^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$");
        if (!RegUrl.test(url)) {
            return false;
        }
        return true;
	}
	function getMessageDetail(mid){
		// console.log(mid);
		$.ajax({
			url:BASEURL + 'admin/api/showMessageInfo',
			type: 'POST',
			dataType: 'json',
			data: {
				mid: mid
			},
		})
		.done(function(data) {
			// console.log("success");
			// console.log(data);
			if (data.success) {
				$('.messageDetail .message_data').html('');
				$('.messageDetail .info').html('');
				var minute =Math.floor(parseInt(data.result.view_duration)/60);
				var second =parseInt(data.result.view_duration)%60;
                var date = new Date(parseInt(data.messageInfo.ctime) * 1000).format('yyyy-MM-dd');

				$('.messageDetail .message_data').append('<div class="digest_block">'+
					'<div class="main-title">推送次数(昨日)</div>'+
					'<div class="digest_data">'+data.result.receive_num+'</div>'+
					'<div class="digest_trend"></div>'+
				'</div>'+
				'<div class="digest_block">'+
					'<div class="main-title">浏览次数(昨日)</div>'+
					'<div class="digest_data">'+data.result.conversion_rate+'</div>'+
					'<div class="digest_trend"></div>'+
				'</div>'+
				'<div class="digest_block">'+
					'<div class="main-title">平均浏览时长(昨天)</div>'+
					'<div class="digest_data">'+minute+'分'+second+'秒</div>'+
					'<div class="digest_trend"></div>'+
				'</div>'+
				'<div class="digest_block">'+
					'<div class="main-title">平均转化率(昨日)</div>'+
					'<div class="digest_data">'+data.result.conversion_rate+'%</div>'+
					'<div class="digest_trend"></div>'+
				'</div>');

				$('.messageDetail .info').append('<div class="info-item">\
                    <div class="name">推送描述:</div>\
                    <div id="app-name" class="value">' + data.messageInfo.description + '</div>\
                </div>\
                <div class="info-item">\
                    <div class="name">推送內容:</div>\
                    <div id="app-appkey" class="value">' + data.messageInfo.content + '</div>\
                </div>\
                <div class="info-item">\
                    <div class="name">创建时间:</div>\
                    <div id="app-ctime" class="value">' + date + '</div>\
                </div>\
                <div class="info-item">\
                    <div class="name">推送单价</div>\
                    <div id="message-push-price" class="value">￥' + data.messageInfo.push_price + '</div>\
                </div>\
                <div class="info-item">\
                    <div class="name">点击单价</div>\
                    <div id="message-click-price" class="value">￥' + data.messageInfo.click_price + '</div>\
                </div>');
			}
		})
		.fail(function() {
			console.log("error");
		})

	}
	function addMessage(messageType,content,description){
		$.ajax({
			url: BASEURL + 'admin/api/addMessage',
			type: 'POST',
			dataType: 'json',
			data: {
				messageType: messageType,
				content: content,
				description:description
			},
		})
		.done(function(data) {
			if (data.success) {
				return true;
			}
		})
		.fail(function() {
			console.log("failed to add message");
			return false; 
		})
	}
	function checkMessage(url){
		if (!url) {
			var url = BASEURL + 'admin/api/showMessageList';
		}
		$.ajax({
			url: url ,
			type: 'GET',
			dataType: 'json',
		})
		.done(function(data) {
			if (data.success) {
				// console.log(data);
				var data_list = data.result.data;
				$('.seller_checkMessage .table_footer').html('');
				$('.seller_checkMessage tbody').html('');
				$('.seller_checkMessage .table_footer').append(
				    '<div class="page_btn" style="height: 50px; text-align: center; padding-top: 20px;">'+
                        '<span class="page_box">'+
                            '<a  data-per="'+data.result.prev_page_url+'" class="prev"></a>'+
                            '<a  data-next="'+data.result.next_page_url+'" class="next"></a>'+
                        '</span>'+
                    '</div>'
				);
				if (data.result.prev_page_url !=null) {
				    $('.seller_checkMessage .prev').css('border-right', '10px solid #000');
				}
				if (data.result.next_page_url !=null ) {
				    $('.seller_checkMessage .next').css('border-left', '10px solid #000');
				}
				for (var i = 0; i < data_list.length; i++) {
					var time = new Date(parseInt(data_list[i].ctime)*1000).format('yyyy-MM-dd hh:mm:ss');
					$('.seller_checkMessage tbody').append(
						'<tr>'+
							'<td class="mes_type" data-id="'+data_list[i].message_type_id+'"><div class="inner">'+messageType[data_list[i].message_type_id]+'</div></td>'+
							'<td class="mes_description"><div class="inner" title="' + data_list[i].description + '">'+data_list[i].description+'</div></td>'+
							'<td class="mes_content"><div class="inner" title="' + data_list[i].content + '">'+data_list[i].content+'</div></td>'+
							'<td class="mes_ctime"><div class="inner">'+time+'</div></td>'+
							'<td class="mes_control">'+
								'<a class="control_edit" href="#">编辑</a>'+
                                '<a class="control_delete" href="#">删除</a>'+
							'</td>'+
							'<td class="mes_id" style="display:none">'+data_list[i].id+'</td>'+
						'</tr>'
					);

				}
			}
		})
		.fail(function() {
			console.log("error");
		})
	}
	function usertrack(userid,url){
	    var userid;
	    if (!userid){
	        alert('抱歉，无法获得该用户的行为轨迹');
	    }
	    var url;
	    if (!url) {
	        url = BASEURL + 'admin/api/getMotionTrail'; 
	    }
	    $.ajax({
	        url: url,
	        type: 'POST',
	        dataType: 'json',
	        data: {
	            uid: userid
	        },
	    })
	    .done(function(data) {
	        // console.log(data);
	        $('.users_position tbody').html('');
	        if (data.success) {
	            var gpsList = data.result.data;
	            $('.users_position .table_footer').html('');
	            var totalPage = Math.ceil(data.result.total/data.result.per_page);
	            $('.users_position .table_footer').append(
	                '<div class="page_btn" style="height: 50px; text-align: center; padding-top: 20px;">'+
	                    '<span class="page_box">'+
	                        '<a data-uid="'+userid+'" data-per="'+data.result.prev_page_url+'" class="prev"></a>'+
	                        '<a data-uid="'+userid+'" data-next="'+data.result.next_page_url+'" class="next"></a>'+
	                    '</span>'+
	                '</div>'
	            );
	            if (data.result.prev_page_url !=null) {
	                $('#user_gps .prev').css('border-right', '10px solid #000');
	            }
	            if (data.result.next_page_url !=null ) {
	                $('#user_gps .next').css('border-left', '10px solid #000');
	            }
	            for (var i = 0; i < gpsList.length; i++) {
	                var date = new Date(parseInt(gpsList[i].ctime)*1000).format('yyyy-MM-dd hh:mm:ss');
	                $('.users_position tbody').append(
	                    '<tr>'+
	                        '<td class="gps_uid"><div class="inner">'+gpsList[i].app_uid+'</div></td>'+
	                        '<td class="gps_longitude"><div class="inner">'+gpsList[i].longitude+'</div></td>'+
	                        '<td class="gps_latitude"><div class="inner">'+gpsList[i].latitude+'</div></td>'+
	                        '<td class="gps_date"><div class="inner">'+date+'</div></td>'+
	                    '</tr>'
	                );
	            };
	        } 
	        else{
	            console.log('抱歉，无法获得该用户的行为轨迹');
	            loadcurrent_app();
	        };
	    })
	    .fail(function() {
	        console.log("error");
	    })  
	}
	Date.prototype.format = function(fmt){ //author: meizz
	    var o = {
	        "M+": this.getMonth() + 1, //月份
	        "d+": this.getDate(), //日
	        "h+": this.getHours(), //小时
	        "m+": this.getMinutes(), //分
	        "s+": this.getSeconds(), //秒
	        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
	        "S": this.getMilliseconds() //毫秒
	    };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	        if (new RegExp("(" + k + ")").test(fmt))
	            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
	}
	supports_history_api();
	function supports_history_api(){
		return !!(window.history && history.pushState);
	}
} 