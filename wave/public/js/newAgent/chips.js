// 获取终端的相关信息
var Terminal = {
    // 辨别移动终端类型
    platform : function(){
        var u = navigator.userAgent, app = navigator.appVersion;
        return {
            // 是否为windows
            windows: u.indexOf('Windows NT') > -1 ,
            // 是否为mac
            mac: u.indexOf('Mac')
        };
    }(),
    // 辨别移动终端的语言：zh-cn、en-us、ko-kr、ja-jp...
    language : (navigator.browserLanguage || navigator.language).toLowerCase()
};
if(Terminal.platform.windows){
    $('html').addClass('windows').removeClass('mac');
}else if(Terminal.platform.mac){
    $('html').addClass('mac').removeClass('windows');
}else{
    $('html').removeClass('windows').removeClass('mac');
}

var chips = {};
var chipReg = /^[a-z0-9]{12}$/i;
var phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;



chips.addChips = function () {
    var chipCode = document.getElementById('chip-code');
    var chipName = document.getElementById('chip-name');
    var addPersonName = document.getElementById('add-person-name');
    var phoneNum = document.getElementById('phone-num');
    var verifyCode = document.getElementById('verify-code');
    var getVerifyCode = document.getElementById('get-verify-code');
    var submitButton = document.getElementById('submit-button');

    getVerifyCode.onclick = function () {
        if (!phoneNum.value || !phoneReg.test(phoneNum.value)) {
			alert("请输入正确的手机号码");
			return;
		}

        var _this = this;
        _this.setAttribute("disabled", "disabled");
        _this.innerHTML = "发送中";
        _this.style.color = "#e9e9e9";

        $.ajax({
            url: BASEURL + 'admin/api/verifyMessage',
            type: "POST",
            dataType: 'json',
            data: {
                phone: phoneNum.value
            }
        }).done(function(data) {
            // console.log(data);
            if (data.status === 0) {
                _this.innerHTML = "已发送";
                _this.setAttribute("disabled", "disabled");
                _this.style.color = "#6799ff";
                verifyCode.focus();
                var timer = 60;
                setTimeout(function(){
                    var times = setInterval(function(){
                        timer--;
                        _this.innerHTML = timer + "秒";
                        if (timer < 0){
                            _this.removeAttribute('disabled');
                            _this.innerHTML = "获取验证码";
                            clearInterval(times);
                        }
                    },1000);
                },500);
            } else {
                alert(data.errMsg);
            }
        }).fail(function() {
            alert("服务器错误");
        });
        // _this = '';
    };

    submitButton.onclick = function () {
        if (!chipCode.value || !chipReg.test(chipCode.value)) {
			alert("请输入正确芯片码");
			return;
		}
        if (!chipName.value) {
			alert("请输入芯片名称");
			return;
		}
        if (!addPersonName.value) {
			alert("请输入您的名字");
			return;
		}
        if (!phoneNum.value || !phoneReg.test(phoneNum.value)) {
			alert("请输入正确的手机号码");
			return;
		}
        if (!verifyCode.value) {
			alert("请输入正确芯片码");
			return;
		}

        console.log(verifyCode.value);

        $.ajax({
            url: BASEURL + 'chip/addChipByAgent',
            type: 'POST',
            dataType: 'json',
            data: {
                chip_no: chipCode.value,
                chip_name: chipName.value,
                name_add: addPersonName.value,
                phone_add: phoneNum.value,
                code_auth: verifyCode.value,
            }
        })
        .done(function(data) {
            console.log(data);
            //路由不完善,待完善
            switch (data.errCode) {
                case 200:
                    alert("添加成功");
                    chipCode.value = '';
                    chipName.value = '';
                    addPersonName.value = '';
                    phoneNum.value = '';
                    verifyCode.value = '';
                    break;
                default:
                    alert(data.errMsg);
            }
        })
        .fail(function() {
            console.log("error");
        });
    };
};

chips.editChips = function () {
    $('.loading-area').fadeIn();
    var chipId = $('#chip-id').val();
	$.ajax({
		url: BASEURL + 'admin/api/AgentgetChipsInfobyChipID',
		type: 'POST',
		dataType: 'json',
		data: {
			chip_id: chipId
		}
	})
	.done(function(data) {
		console.log(data);
		if(data.success){
			if(data.data == undefined || data.data == null){
				layer.msg('读取芯片信息失败，请返回重试', {icon: 5,time:2000}, function(){
					window.location.href = BASEURL + 'admin/agent_chipList';
				});
			}
			$('#chip-uid').val(data.data.uid);
			$('#chip-id').val(data.data.id);
			$('#chip-code').val(data.data.chip_no);
			$('#chip-name').val(data.data.chip_name);
            $('#add-person-name').val(data.data.name_add);
            $('#phone-num').val(data.data.phone_add);
		}
		$('.loading-area').fadeOut();
	})
	.fail(function(data) {
		console.log("error");
	});

    var chipCode = document.getElementById('chip-code');
    var chipName = document.getElementById('chip-name');
    var addPersonName = document.getElementById('add-person-name');
    var phoneNum = document.getElementById('phone-num');
    var verifyCode = document.getElementById('verify-code');
    var getVerifyCode = document.getElementById('get-verify-code');
    var submitButton = document.getElementById('submit-button');

    getVerifyCode.onclick = function () {
        if (!phoneNum.value || !phoneReg.test(phoneNum.value)) {
			alert("请输入正确的手机号码");
			return;
		}

        var _this = this;
        _this.setAttribute("disabled", "disabled");
        _this.innerHTML = "发送中";
        _this.style.color = "#e9e9e9";

        $.ajax({
            url: BASEURL + 'admin/api/verifyMessage',
            type: "POST",
            dataType: 'json',
            data: {
                phone: phoneNum.value
            }
        }).done(function(data) {
            // console.log(data);
            if (data.status === 0) {
                _this.innerHTML = "已发送";
                _this.setAttribute("disabled", "disabled");
                _this.style.color = "#6799ff";
                verifyCode.focus();
                var timer = 60;
                setTimeout(function(){
                    var times = setInterval(function(){
                        timer--;
                        _this.innerHTML = timer + "秒";
                        if (timer < 0){
                            _this.removeAttribute('disabled');
                            _this.innerHTML = "获取验证码";
                            clearInterval(times);
                        }
                    },1000);
                },500);
            } else {
                alert(data.errMsg);
            }
        }).fail(function() {
            alert("服务器错误");
        });
        // _this = '';
    };

    submitButton.onclick = function () {
        if (!chipCode.value || !chipReg.test(chipCode.value)) {
			alert("请输入正确芯片码");
			return;
		}
        if (!chipName.value) {
			alert("请输入芯片名称");
			return;
		}
        if (!addPersonName.value) {
			alert("请输入您的名字");
			return;
		}
        if (!phoneNum.value || !phoneReg.test(phoneNum.value)) {
			alert("请输入正确的手机号码");
			return;
		}
        if (!verifyCode.value) {
			alert("请输入正确芯片码");
			return;
		}

        console.log(verifyCode.value);

        $.ajax({
            url: BASEURL + 'chip/updateChipAgent',
            type: 'POST',
            dataType: 'json',
            data: {
                chip_id: parseInt($('#chip-id').val()),
				chip_name: $('#chip-name').val(),
				chip_no: $('#chip-code').val(),
                phone_add: $('#phone-num').val(),
                name_add: $('#add-person-name').val(),
				chip_createid: parseInt($('#chip-uid').val()),
                verify_code: $('#verify-code').val()
            }
        })
        .done(function(data) {
            $('.loading-area').fadeOut();
			if(data.success == true && data.errMsg == "修改成功"){
				layer.msg('修改芯片信息成功', {icon: 6,time:2000}, function(){
					window.location.href = BASEURL + 'chipList';
				});
			}else{
				layer.msg(data.errMsg, {icon: 5,time:2000});
			}
        })
        .fail(function() {
            console.log("error");
        });
    };




}
