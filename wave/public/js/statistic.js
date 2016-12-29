var statistic = {};

statistic.init = function (url, goType) {

	$(document).ready(function () {
		switch (goType) {
			case 1:
				var boxHeight = (document.body.scrollHeight - 15 * 4) / 3;
				$('.container .main, .container .main2, .container .main3').height(boxHeight).fadeIn(1000);
				$('.container .title').css('top', 54 / 359 * boxHeight).fadeIn(1000);
				$('.container .subtitle').css('top', 105 / 359 * boxHeight).fadeIn(1000);
				$('.container .value').css('top', 117 / 359 * boxHeight).fadeIn(1000);
				$('.container #phoneNum').css('top', 228 / 359 * boxHeight).fadeIn(1000);

				$('.container #main-1').click(function(event) {
					/** Act on the event */
					window.location.href = window.location.href.replace('go=1', 'go=2');
				});

				$('.container #main-2').click(function(el, event) {
					/** Act on the event */
					if ($(el.toElement).attr('id') === 'phoneNum') {
						return;
					}

					$phone = $(this).find('#phoneNum');
					if ($phone.val() === '') {
						alert('请输入手机号');
						$phone.focus();
						return;
					}

					if ($phone.val().length !== 11) { 
						alert('请输入有效的手机号'); 
						$phone.focus();
						return;
					} 

					var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
					if(!myreg.test($phone.val())) { 
						alert('请输入有效的手机号');
						$phone.focus();
						return;
					}

					alert('获取成功');
				});

				$('.container #main-3').click(function(event) {
					/** Act on the event */
					$.ajax({
						url: BASEURL + 'admin/taskApi/updateDownloadStatus',
						type: 'POST',
						dataType: 'json',
						data: {
							'pid': $('#pid').val()
						}
					})
					.done(function() {
						window.location.href = $('#downloadUri').val();
					})
					.fail(function() {
						console.log("failed to update download status");
					});

					/** jump */
				});

				$(window).bind('beforeunload', function () {
					/** ajax to store data */
					$.ajax({
						url: BASEURL + '/admin/taskApi/updateStatus',
						type: 'POST',
						dataType: 'json',
						data: {
							'pid': $('#pid').val(),
							'go': goType
						}
					})
					.done(function() {
						console.log("success");
					})
					.fail(function() {
						console.log("failed to update status");
					});
				});
				break;
			case 2:
				$('#show-area').height(document.body.scrollHeight);

				var time = 0;
				setInterval(function () {
					time++;
				}, 1000);

				$(window).bind('beforeunload', function () {
					/** ajax to store data */
					$.ajax({
						url: BASEURL + '/admin/taskApi/updateStatus',
						type: 'POST',
						dataType: 'json',
						data: {
							'mid': $('#mid').val(),
							'pid': $('#pid').val(),
							'duration': time,
							'go': goType
						},
					})
					.done(function() {
						console.log("success");
					})
					.fail(function() {
						console.log("failed to update");
					});
				});
				break;
			default:
				break;
		}
		
		document.title = $('#title').val();
	});
};
