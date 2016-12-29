function setValue(toId,fromId){
	$("#"+toId+"").html($("#"+fromId+"").val());
}

$(document).ready(function() {

	var userAgent = window.navigator.userAgent.toLowerCase();
	if (userAgent.match(/iphone/i) || userAgent.match(/ipad/i) || userAgent.match(/ipod/i)) {
             		$(".input-news").focus(function(event){
			$(".submit-news").css('position', 'relative');
		});

		$(".input-news").blur(function(event){
			$(".submit-news").css('position', 'fixed');
		});
	} else if (userAgent.match(/android/i)) {
	             
	} else {
	             
	}


	$("#mobile").blur(function(event) {
		if($("#mobile").val()){
			$("#mobile").css("border","none");
		}
	});
	$("#email").blur(function(event) {
		if($("#email").val()){
			$("#email").css("border","none");
		}
	});

	$("#name").blur(function(){
		if($("#name").val()){
			$("#name").css("border","none");
		}
	});
	$("#jobs").blur(function(){
		if($("#jobs").val()){
			$("#jobs").css("border","none");
		}
	});
	$("#company").blur(function(){
		if($("#company").val()){
			$("#company").css("border","none");
		}
	});
	$("#mobile").blur(function(){
		if($("#mobile").val()){
			$("#mobile").css("border","none");
		}
	});
	$("#email").blur(function(){
		if($("#email").val()){
			$("#email").css("border","none");
		}
	});

	$(".create-card").on('click', function() {
		// if(!$("#name").val()||!$("#jobs").val()||!$("#company").val()||!$("#mobile").val()||!$("#email").val()){
		// 	return;
		// }
		
		var qq = $("#qq").val();
		var wechat = $("#wechat").val();
 		if(qq==''&&tt==true){
 			alert("请输入QQ号");
 			return;
 		} if(wechat==''&&dd==true){
 			alert("请输入wechat号");
 			return;
 		} if(qq!=''&&tt==false){
 			alert("请上传QQ二维码");
 			return;
 		} if(wechat!=''&&dd==false){
 			alert("请上传wechat二维码");
 			return;
 		}

		if(!$("#name").val()){
			$("#name").focus();
			$("#name").css("border","1px solid red");
			return;
		}
		if(!$("#jobs").val()){
			$("#jobs").focus();
			$("#jobs").css("border","1px solid red");
			return;
		}
		if(!$("#company").val()){
			$("#company").focus();
			$("#company").css("border","1px solid red");
			return;
		}

		var myreg_phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 

		var myreg_email = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;

		if(!$("#mobile").val() || !myreg_phone.test($("#mobile").val())){
			$("#mobile").focus();
			$("#mobile").css("border","1px solid red");
			alert('请输入有效的手机号码！'); 
			return;
		}
		if(!$("#email").val() || !myreg_email.test($("#email").val())){
			$("#email").focus();
			$("#email").css("border","1px solid red");
			alert('提示:请输入有效的E_mail！');
			return;
		}

		$.ajax({
	                    url: './vcard.php',
	                    type: 'post',
	                    dataType: 'json',
	                    data: {
	                    	'openid':$('#openid').val(),
	                        'name' : $('#name').val(),
	                        'job'   :$('#jobs').val(),
	                        // 'headimg' : "ss",
	                        'headimg' : $("#headimg").attr('src'),
	                        'company' : $('#company').val(),
	                        'mobile' : $('#mobile').val(),
	                        'tel' : $('#tel').val(),
	                        'fax' : $('#fax').val(),
	                        'email' : $('#email').val(),
	                        'url' : $('#url').val(),
	                        'weibo' : $('#weibo').val(),
	                        'qq' : $('#qq').val(),
	                        'qq_url':$("#upload_qq").val(),
	                        'wechat' : $('#wechat').val(),
	                        'wechat_url' : $('#upload_wechat').val(),
	                        'address' : $('#address').val(),
	                        'description' : $('#description').val(),
	                    },

	                })
	                .done(function(data) {
	                    console.log("success");
	                   // console.log(data.id); 	
	                    // window.location.href = "./m.html?id=" + data.id;
	                    window.location.replace("./m.html?id=" + data.id);

	                })
	                .fail(function() {
	                    console.log("error");
	                })
	                .always(function() {
	                    console.log("complete");
	                });
	});	


		var tt = false;
		var dd = false;
     			 var BASE_URL = "./";
			// 图片上传demo
			    $(function() {
			                    $list = $('#fileList'),
			                    // 优化retina, 在retina下这个值是2
			                    ratio = window.devicePixelRatio || 1,
			                    // 缩略图大小
			                    thumbnailWidth = 100 * ratio,
			                    thumbnailHeight = 160 * ratio,
			                    // Web Uploader实例
			                   // uploader;
			                // 初始化Web Uploader
			                uploader = WebUploader.create({
			                    // 自动上传。
			                    auto: true,
			                    // swf文件路径
			                    swf: BASE_URL + 'js/Uploader.swf',
			                    // 文件接收服务端。
			                    server: './qq.php',
			                    // 选择文件的按钮。可选。
			                    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
			                    pick: '#add_qq',
			                    // 只允许选择文件，可选。
			                    accept: {
			                        title: 'Images',
			                        extensions: 'gif,jpg,jpeg,bmp,png',
			                        mimeTypes: 'image/*'
			                    }
			                });
			                // 当有文件添加进来的时候
			                uploader.on( 'fileQueued', function( file ) {
			                    var $li = $(
			                            '<div id="' + file.id + '" class="file-item thumbnail">' +
			                                '<img>' +
			                            '</div>'
			                            ),
			                        $img = $li.find('img');

			                    $list.html( $li );
			                    $("#chrysanthemum").css("display","block");
			                    // 创建缩略图
			                    uploader.makeThumb( file, function( error, src ) {
			                        if ( error ) {
			                            $img.replaceWith('<span>不能预览</span>');
			                            return;
			                        }
			                        $img.attr( 'src', src );
			                        // $img.attr( 'style', '' );
			                    }, thumbnailWidth, thumbnailHeight );
			                });

			                uploader.on( 'beforeFileQueued', function( file ) {
			                    
			                });

			                // 文件上传过程中创建进度条实时显示。
			                uploader.on( 'uploadProgress', function( file, percentage ) {
			                    var $li = $( '#'+file.id ),
			                        $percent = $li.find('.progress span');

			                        $li.on('click', 'true', function() {
			                    uploader.removeFile( file );
			                })

			                    // 避免重复创建
			                    if ( !$percent.length ) {
			                        $percent = $('<p class="progress"><span></span></p>')
			                                .appendTo( $li )
			                                .find('span');
			                    }

			                    $percent.css( 'width', percentage * 100 + '%' );
			                });

			                // 文件上传成功，给item添加成功class, 用样式标记上传成功。
			                uploader.on( 'uploadSuccess', function(file, response) {
			                    console.log(response);
			                    alert("QQ二维码上传成功");
			                    $("#upload_qq").val(response);
			                    tt = true;
			                });

			                // 文件上传失败，现实上传出错。
			                uploader.on( 'uploadError', function( file ) {
			                    var $li = $( '#'+file.id ),
			                        $error = $li.find('div.error');
			                    $("#chrysanthemum").css("display","none");


			                    // 避免重复创建
			                    if ( !$error.length ) {
			                        $error = $('<div class="error"></div>').appendTo( $li );
			                    }

			                    $error.text('上传失败');
			                    alert("QQ二维码上传失败,请重新上传");

			                });

			                // 完成上传完了，成功或者失败，先删除进度条。
			                uploader.on( 'uploadComplete', function( file ) {
			                    $( '#'+file.id ).find('.progress').remove();
			                });
			                });




	 		var BASE_URL = "./";
			// 图片上传demo
			    $(function() {
			                    $list = $('#fileList'),
			                    // 优化retina, 在retina下这个值是2
			                    ratio = window.devicePixelRatio || 1,
			                    // 缩略图大小
			                    thumbnailWidth = 100 * ratio,
			                    thumbnailHeight = 160 * ratio,
			                    // Web Uploader实例
			                   // uploader;
			                // 初始化Web Uploader
			                uploader = WebUploader.create({
			                    // 自动上传。
			                    auto: true,
			                    // swf文件路径
			                    swf: BASE_URL + 'js/Uploader.swf',
			                    // 文件接收服务端。
			                    server: './qq.php',
			                    // 选择文件的按钮。可选。
			                    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
			                    pick: '#add_wechat',
			                    // 只允许选择文件，可选。
			                    accept: {
			                        title: 'Images',
			                        extensions: 'gif,jpg,jpeg,bmp,png',
			                        mimeTypes: 'image/*'
			                    }
			                });
			                // 当有文件添加进来的时候
			                uploader.on( 'fileQueued', function( file ) {
			                    var $li = $(
			                            '<div id="' + file.id + '" class="file-item thumbnail">' +
			                                '<img>' +
			                            '</div>'
			                            ),
			                        $img = $li.find('img');

			                    $list.html( $li );
			                    $("#chrysanthemum").css("display","block");
			                    // 创建缩略图
			                    uploader.makeThumb( file, function( error, src ) {
			                        if ( error ) {
			                            $img.replaceWith('<span>不能预览</span>');
			                            return;
			                        }
			                        $img.attr( 'src', src );
			                        // $img.attr( 'style', '' );
			                    }, thumbnailWidth, thumbnailHeight );
			                });

			                uploader.on( 'beforeFileQueued', function( file ) {
			                    
			                });

			                // 文件上传过程中创建进度条实时显示。
			                uploader.on( 'uploadProgress', function( file, percentage ) {
			                    var $li = $( '#'+file.id ),
			                        $percent = $li.find('.progress span');

			                        $li.on('click', 'true', function() {
			                    uploader.removeFile( file );
			                })

			                    // 避免重复创建
			                    if ( !$percent.length ) {
			                        $percent = $('<p class="progress"><span></span></p>')
			                                .appendTo( $li )
			                                .find('span');
			                    }

			                    $percent.css( 'width', percentage * 100 + '%' );
			                });

			                // 文件上传成功，给item添加成功class, 用样式标记上传成功。
			                uploader.on( 'uploadSuccess', function(file, response) {
			                    console.log(response);
			                    alert("微信二维码上传成功");
			                    $("#upload_wechat").val(response);
			                    dd = true;
			                });

			                // 文件上传失败，现实上传出错。
			                uploader.on( 'uploadError', function( file ) {
			                    var $li = $( '#'+file.id ),
			                        $error = $li.find('div.error');
			                    $("#chrysanthemum").css("display","none");


			                    // 避免重复创建
			                    if ( !$error.length ) {
			                        $error = $('<div class="error"></div>').appendTo( $li );
			                    }

			                    $error.text('上传失败');
			                    alert("微信二维码上传失败,请重新上传");

			                });

			                // 完成上传完了，成功或者失败，先删除进度条。
			                uploader.on( 'uploadComplete', function( file ) {
			                    $( '#'+file.id ).find('.progress').remove();
			                });
			                });


			var BASE_URL = "./";
			// 头像上传demo
			$(function() {
				$list = $('#fileList'),
					// 优化retina, 在retina下这个值是2
					ratio = window.devicePixelRatio || 1,
					// 缩略图大小
					thumbnailWidth = 100 * ratio,
					thumbnailHeight = 160 * ratio,
					// Web Uploader实例
					// uploader;
					// 初始化Web Uploader
					uploader = WebUploader.create({
						// 自动上传。
						auto: true,
						// swf文件路径
						swf: BASE_URL + 'js/Uploader.swf',
						// 文件接收服务端。
						server: './headimg.php',
						// 选择文件的按钮。可选。
						// 内部根据当前运行是创建，可能是input元素，也可能是flash.
						pick: '#headimgs',
						// 只允许选择文件，可选。
						accept: {
							title: 'Images',
							extensions: 'gif,jpg,jpeg,bmp,png',
							mimeTypes: 'image/*'
						}
					});
				// 当有文件添加进来的时候
				uploader.on( 'fileQueued', function( file ) {
					var $li = $(
							'<div id="' + file.id + '" class="file-item thumbnail">' +
							'<img>' +
							'</div>'
						),
						$img = $li.find('img');

					$list.html( $li );
					$("#loading").css("display","block");
					$("#load_shadow").css("display","block");

					$("#chrysanthemum").css("display","block");
					// 创建缩略图
					uploader.makeThumb( file, function( error, src ) {
						if ( error ) {
							$img.replaceWith('<span>不能预览</span>');
							return;
						}
						$img.attr( 'src', src );
						// $img.attr( 'style', '' );
					}, thumbnailWidth, thumbnailHeight );
				});

				uploader.on( 'beforeFileQueued', function( file ) {

				});

				// 文件上传过程中创建进度条实时显示。
				uploader.on( 'uploadProgress', function( file, percentage ) {
					var $li = $( '#'+file.id ),
						$percent = $li.find('.progress span');

					$li.on('click', 'true', function() {
						uploader.removeFile( file );
					})

					// 避免重复创建
					if ( !$percent.length ) {
						$percent = $('<p class="progress"><span></span></p>')
							.appendTo( $li )
							.find('span');
					}

					$percent.css( 'width', percentage * 100 + '%' );
				});

				// 文件上传成功，给item添加成功class, 用样式标记上传成功。
				uploader.on( 'uploadSuccess', function(file, response) {
					console.log(response);
					$("#loading").css("display","none");
					$("#load_shadow").css("display","none");
					$("#headimg").attr('src',response);
					//alert("头像上传成功!");
				});

				// 文件上传失败，现实上传出错。
				uploader.on( 'uploadError', function( file ) {
					var $li = $( '#'+file.id ),
						$error = $li.find('div.error');
					$("#chrysanthemum").css("display","none");


					// 避免重复创建
					if ( !$error.length ) {
						$error = $('<div class="error"></div>').appendTo( $li );
					}

					$error.text('上传失败');
					alert("头像上传失败,请重新上传");

				});

				// 完成上传完了，成功或者失败，先删除进度条。
				uploader.on( 'uploadComplete', function( file ) {
					$( '#'+file.id ).find('.progress').remove();
				});
			});

 

 
});
