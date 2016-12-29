var customs = {};
var phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;


customs.edit = function () {
    var phoneNum = document.getElementById('phone-num');
    var nickName = document.getElementById('nick-name');
    var unitPrice = document.getElementById('unit-price');
    var hardwareNum = document.getElementById('hardware-num');
    var shareScene = document.getElementById('share-scene');
    var messageManage = document.getElementById('message-manage');

    var customAuth = document.getElementsByName('checkbox');
    var messagePrice = document.getElementById('message-price');
    var messageBox = document.getElementById('message-box');
    var submitButton = document.getElementById('submit-button');

    messageManage.onchange = function () {
        messageBox.style.display = messageManage.checked ? "block" : "none";
        messagePrice.value = messageManage.checked ? messagePrice.value : '';
    };

    submitButton.onclick = function () {
        var scene_powers = 0;
        var ad_powers = 0;

        if (!phoneNum.value || !phoneReg.test(phoneNum.value)) {
            alert("请输入正确的手机号码");
            return;
        }
        if (!nickName.value) {
            alert("请输入客户昵称");
            return;
        }
        if (!unitPrice.value) {
            alert("请输入硬件单价");
            return;
        }
        if (!hardwareNum.value) {
            alert("请输入硬件数量");
            return;
        }

        scene_powers = shareScene.checked ? 1 : 0;
        ad_powers = messageManage.checked ? 1 : 0;

        if (messageManage.checked && !messagePrice.value) {
            alert("请输入广告单价");
            return;
        }

        $.ajax({
            url: BASEURL + 'account/addSubAccount',
            type: 'POST',
            dataType: 'json',
            data: {
                sub_phone: phoneNum.value,
				sub_nickname: nickName.value,
				share_premit: scene_powers,
				ad_permit: ad_powers,
				ad_perprice: messagePrice.value,
				chip_perprice: unitPrice.value,
				chip_num: hardwareNum.value
            }
        })
        .done(function(data) {
            if (data.success) {
                alert("添加子账号完成");
				window.location.reload();
			} else {
                alert("data.errMsg");
			}
        })
        .fail(function() {
            console.log(data);
			console.log("error");
            alert("添加子账号失败，请刷新重试");
        });
    };
};
