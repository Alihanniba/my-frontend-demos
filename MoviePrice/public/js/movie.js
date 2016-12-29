var movie = {};
/**
 * [init description]初始化通用js
 * @type {[type]}
 */
movie.init = function(){
    "use strict";
};

var current_city_id;
var current_city_name;
var backShow = 0;
var slide_index=0;

/**
 * [initIndex description]首页
 */
movie.initIndex = function(){
    "use strict";
    var turnback_movieId=$("#turnback_movieId").val();
	var $avatarEl = $('.avatar');
	var $avatarHolderEl = $('.avatar-holder');
	var images = [];
	var avatars = [];
	var loadContrl;
	var firstFilmId;

	$(document).ready(function(){
		var localLatitude  = 0;
    	var localLongitude = 0;
		var gradeArr = [{"grade": 1,"position": ["0 -127px"]},{"grade": 2,"position": ["0 -112px"]},{"grade": 3,"position": ["0 -98px"]},{"grade": 4,"position": ["0 -84px"]},{"grade": 5,"position": ["0 -70px"]},{"grade": 6,"position": ["0 -56px"]},{"grade": 7,"position": ["0 -42px"]},{"grade": 8,"position": ["0 -28px"]},{"grade": 9,"position": ["0 -14px"]}];
		var current_film_id;
		var current_film_name;

		/**
		 * [filmCinemasShow description]根据filmId获取电影院信息及计算距离
		 * @param  {[type]} filmId   [description]
		 * @param  {[type]} cityId   [description]
		 * @param  {[type]} cityName [description]
		 * @return {[type]}          [description]
		 */
		function filmCinemasShow(filmId,cityId,cityName){
			$(".cinema-list").children().remove();
			$.ajax({
				url: BASEURL + 'movie/cinemas',
				type: 'POST',
				dataType: 'json',
				data: {
					filmId: filmId,
					cityId: cityId,
					cityName: cityName,
				},
			})
			.done(function(data) {
				// console.log(data);
				if(data.status === 0){
					var cinemas = data.data.cinemas;
					if(cinemas.length > 0){
						var distance = new Array();
						var distanceInfo = new Array();
						var cinemaLatitude = 0;
						var cinemaLongitude = 0;
						var cinemaId = 0;
						var cinemaAddress = '';
						var cinemaName = '';
						var cinemasInfo = new Array();
						var cinemasInfoOne = new Array();
						var cinemaAddAndName = new Array();
						for (var i = 0; i < cinemas.length; i++) {
							cinemaLatitude = cinemas[i].geocode['latitude'];
							cinemaLongitude = cinemas[i].geocode['longitude'];
							distance =  getDisance(localLatitude,localLongitude,cinemaLatitude,cinemaLongitude);
							distanceInfo.push(distance);
							cinemaAddress = cinemas[i].address;
							cinemaName = cinemas[i].name;
							cinemaId = cinemas[i].id;
							cinemaAddAndName = {"address":cinemaAddress,"cinemaName":cinemaName,"cinemaId":cinemaId};
							cinemasInfoOne[distanceInfo.length-1] = cinemaAddAndName;
							cinemasInfo[i] = [distanceInfo[i],cinemasInfoOne[i]];
						}
						cinemasInfo.sort(function(a,b){
							return parseFloat(a[0])-parseFloat(b[0]);
						});
						cinemasInfo.join();
						// console.log(cinemasInfo);
						for (var i = 0; i < cinemasInfo.length; i++) {
							if(cinemasInfo[i][0] > 500){
								cinemasInfo[i][0] = 0;
							}
							$(".cinema-list").append(
								'<li class="theater" data-cinemaid="'+cinemasInfo[i][1].cinemaId+'">'+
								'<div class="check"></div>'+
								'<div class="theater-messages">'+
								'<div class="theater-title">'+cinemasInfo[i][1].cinemaName+'</div>'+
								'<div class="theater-place">'+
								'<div class="sepcific-place">'+cinemasInfo[i][1].address+'</div>'+
								'<div class="distance">'+cinemasInfo[i][0]+'km'+'</div>'+
								'</div>'+
								'</div>'+
								'</li>'
							);
						}
						if (loadContrl!=0||cinemasInfo.length!=0) {
							$("#uploadMore").hide();
						};
					}
				}
			})
			.fail(function() {
				console.log("error");
			})
		}
		/**
		 * [getLocation description]调用html5地理位置函数得到本地经纬度
		 * @return {[type]} [description]
		 */
		function getLocation(){
			if (navigator.geolocation){
				navigator.geolocation.getCurrentPosition(showPosition);
			}else{
				console.log("该浏览器不支持获取地理位置。");
			}
		}

		/**
		 * [showPosition description]成功获取经纬度的回调函数
		 * @param  {[type]} position [description]
		 * @return {[type]}          [description]
		 */
		function showPosition(position){
			localLatitude = position.coords.latitude;
			localLongitude = position.coords.longitude;
			// localLatitude = 22.61667;
			// localLongitude = 114.06667;
			$.ajax({
				url: BASEURL + 'movie/city',
				type: 'POST',
				dataType: 'json',
				data: {
					latitude: localLatitude,
					longitude: localLongitude
				},
			})
			.done(function(data) {
				// console.log(data);
				if(data.status === 0){
					var cityId = data.data.city['id'];
					var cityName = data.data.city['name'];
					current_city_id=cityId;
					current_city_name=cityName;
					$(".specific-place").html(current_city_name);
					PostMovie(current_city_id,current_city_name);
				}
			})
			.fail(function() {
				console.log("error");
			})
		}
		getLocation();

		/**
		 * [toRad description]根据两地经纬度计算距离
		 * @param  {[type]} d [description]
		 * @return {[type]}   [description]
		 */
		function toRad(d) {
			return d * Math.PI / 180;
		}
		function getDisance(lat1, lng1, lat2, lng2) {
			//lat为纬度, lng为经度, 一定不要弄错
		    var dis = 0;
		    var radLat1 = toRad(lat1);
		    var radLat2 = toRad(lat2);
		    var deltaLat = radLat1 - radLat2;
		    var deltaLng = toRad(lng1) - toRad(lng2);
		    var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
		    return ((dis * 6378137)/1000).toFixed(1);
		}
		// 获得正在上映的海报及相关信息
		function PostMovie(current_city_id,current_city_name){
			jQuery.ajax({
			    url: BASEURL + 'movie/plays',
			    type: 'POST',
			    dataType: 'json',
			    data: {
			  		cityId:current_city_id,
			  		cityName:current_city_name
			    },
			    success: function(data) {
				    if(data.status === 0){
				  		var postLength=data.data.films.length;
				  		var firstFilmId = data.data.films[0].id;
						filmCinemasShow(firstFilmId,current_city_id,current_city_name);
				  		for (var i = 0; i < postLength; i++) {
				  			$(".swiper-wrapper").append(
				  			'<div class="swiper-slide" index='+i+'>'+
				  			'<input type="hidden" id="img_filmId" value="'+data.data.films[i].id+'">'+
				  			'<input type="hidden" id="img_filmName" value="'+data.data.films[i].name+'">'+
				  			'<img src="'+data.data.films[i].poster.thumbnail+'" alt="" data-title="'+data.data.films[i].name+'"  data-grade="'+data.data.films[i].grade+'">'+
							'</div>'
				  			);
			  			};
				  		var mySwiper = new Swiper('.swiper-container',{
				  		    paginationClickable: true,
				  		    centeredSlides: true,
				  		    slidesPerView: 2,
				  		    watchActiveIndex: true,
				  		    spaceBetween:28,
				  		    grabCursor:true,
				  		    runCallbacksOnInit:true,
				  		    onSlideChangeStart:function(swiper){
				  		    	$(".last_slide_img").hide();
				  		    	$(".swiper-wrapper div").show();
				  		    },
				  		    onSlideChangeEnd: function(swiper, direction){
				  		       	eachFilm();
				  		       	slide_index=mySwiper.activeIndex;
				  		       	var changeFilmId = $("#img_filmId").val();
								filmCinemasShow(changeFilmId,current_city_id,current_city_name);
				  		    }
				  		});
					}
    				eachFilm();
					loadContrl=postLength;
				},
			    error: function(xhr, textStatus, errorThrown) {
			    	//called when there is an error
			    }
			});
		}
			//根据前面变大的图片改变后面的背景
			//选中该li之后check改变，背景颜色也改变
		$(".cinema-content").on("click","li",function(event){
			if (limit_check().length<3) {
				$(this).find(".check").toggleClass("checked-box");
				$(this).eq(0).toggleClass("checked");
				if ($(".cinema-content li").hasClass("checked")) {
					$(".Comparative-price").show();
				}else{
					$(".Comparative-price").hide();
				}

			}else if(limit_check().length=3){
				$(this).find(".check").removeClass("checked-box");
				$(this).eq(0).removeClass("checked");
				//弹出提示框：最多只能比较三家影院
				var tips_hight= event.pageY || (event.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
				var tips_left=$(this).width()/5;
				if (limit_check().length<3) {
				}
				else{
					new Toast({context:$(this),message:'抱歉，只能选取最多三个影院',top:tips_hight,left:tips_left}).show();
				}
			}
		})
		//toast模板
		var Toast = function(config){
		    this.context = config.context==null?$('.cinema-list'):config.context;//上下文
		    this.message = config.message;//显示内容
		    this.time = config.time==null?3000:config.time;//持续时间
		    this.left = config.left;//距容器左边的距离
		    this.top = config.top;//距容器上方的距离
		    this.init();
		}
		var msgEntity;
		Toast.prototype = {
		    //初始化显示的位置内容等
		    init : function(){
		        $("#toastMessage").remove();
		        //设置消息体
		        var msgDIV = new Array();
		        msgDIV.push('<div id="toastMessage">');
		        msgDIV.push('<span>'+this.message+'</span>');
		        msgDIV.push('</div>');
		        msgEntity = $(msgDIV.join('')).appendTo(this.context);
		        //设置消息样式
		        var left = this.left == null ? '30px' : this.left;
		        var top = this.top == null ? '400px' : this.top;
		        msgEntity.css({position:'absolute',top:top,'z-index':'99',left:left,'background-color':'black',color:'white','font-size':'14px',padding:'5px',margin:'5px','border-radius':'4px'});
		        msgEntity.hide();
		    },
		    //显示动画
		    show :function(){
		        msgEntity.fadeIn(this.time/2);
		        msgEntity.fadeOut(this.time/2);
		    }

		}

		// 点击滚动的电影,获取具体的电影信息
		$(".poster-list").on("click",".swiper-slide",function(){
			var postmovieId=$(this).children('#img_filmId').val();
			var postmovieName=$(this).children('#img_filmName').val();
			window.location.href="account?movieId="+postmovieId+"&movie_title="+postmovieName+"&slide_index="+slide_index+"&current_city_id="+current_city_id+"&current_city_name="+current_city_name;
		})
		$(".poster-list").on("click",".last_slide_img",function(){
			var postmovieId=$(this).attr('data-movieid');
			var postmovieName=$(this).attr('data-moviename');
			var slide_index=$(this).attr('data-index');
			window.location.href="account?movieId="+postmovieId+"&movie_title="+postmovieName+"&slide_index="+slide_index+"&current_city_id="+current_city_id+"&current_city_name="+current_city_name;
		})
		//点击比价购票获得点击的影院信息
		$(".Comparative-price").click(function(){
			var cinemas_id=new Array();
			var current_To_film=new Array();
			for (var i = 0; i <limit_check().length; i++) {
				cinemas_id.push(limit_check()[i].attributes[1].value);
			};
			// console.log(cinemas_id);//获得选择的电影院的cinemaid数组
			current_To_film={"cinemas_id":cinemas_id,"film_id":current_film_id,"film_name":current_film_name};
			current_To_film=JSON.stringify(current_To_film)
			window.location.href="price?current_To_film="+encodeURI(current_To_film)+"&current_film_name="+current_film_name+"&current_city_id="+current_city_id+"&current_city_name="+current_city_name+"&localLatitude="+localLatitude+"&localLongitude="+localLongitude;
		})
		function eachFilm(){
			var back_slide_index=document.getElementById('slide_index').value;
			if(!back_slide_index){
				backShow = 1;
			}
			$(".swiper-wrapper div").each(function(){
		 		var list=$(this).attr("class").split(" ");
		 		var listId=$(this).find('#img_filmId').val();
		 		if(backShow === 0){
  		       		var last_slide_img=$(".swiper-wrapper div[index="+back_slide_index+"]").find('img').attr('src');
	   				var index_movie_id=$(".swiper-wrapper div[index="+back_slide_index+"]").children(0).val();
	   				var index_movie_name=$(".swiper-wrapper div[index="+back_slide_index+"]").find('#img_filmName').val();
  		       		$(".swiper-container").append('<img data-movieid="'+index_movie_id+'" data-moviename="'+index_movie_name+'" data-index="'+back_slide_index+'" class="last_slide_img" src="'+last_slide_img+'" alt="">');
			 		$(".swiper-wrapper div[index="+back_slide_index+"]").addClass('swiper-slide-visible').siblings().removeClass('swiper-slide-visible');
			 		$(".swiper-wrapper div[index="+back_slide_index+"]").addClass('swiper-slide-active').siblings().removeClass('swiper-slide-active');
					var backFilmId = $(".swiper-wrapper div[index="+back_slide_index+"]").children(0).val();
					filmCinemasShow(backFilmId,current_city_id,current_city_name);
			 		backShow = 1;
			 		$(".swiper-wrapper div").hide();
  		       	}
		 		for (var i = 0; i < list.length; i++) {
			 		if (list[i]=="swiper-slide-active") {
			 			var imgurl=$(this).children('img').attr('src');
			 			// 调用插件改变背景图片
			 			avatars.push(imgurl);
			 			$avatarHolderEl.backgroundBlur(imgurl);
			 			var movieName=$(this).children('img').attr('data-title');
			 			var movieGrade=Math.floor($(this).children('img').attr('data-grade'))-1;
			 			var starPosition=gradeArr[movieGrade].position;
			 			current_film_id=$(this).children('#img_filmId').val();
		    			current_film_name=$(this).children('#img_filmName').val();
			     		$(".shadow-masage .movie-title").html(movieName);
			     		$(".shadow-masage .star").css('background-position',starPosition);
			 		};
			 	};
			})
		}
	})

	$avatarHolderEl.backgroundBlur({
	    imageURL : avatars[0], // URL to the image that will be used for blurring
	    blurAmount : 50, // Amount of blur (higher amount degrades browser performance)
	    imageClass : 'avatar-blur' // CSS class that will be applied to the image and to the SVG element,
	});
}
//获得选中的电影院信息
function limit_check(){
	var had_checked=new Array;
	var lilist=$(".cinema-list").children("li");
	for (var i = 0; i < lilist.length; i++) {
		if (lilist[i].className=="theater checked") {
			had_checked.push(lilist[i]);
		};
	};
	return had_checked;
}



/**
 * [initAccount description]详情页
 * @type {[type]}
 */

movie.initAccount = function(){
    "use strict";
    var current_city_id=document.getElementById('current_city_id').value;
    var current_city_name=document.getElementById('current_city_name').value;
    var movieId=document.getElementById('movieId').value;
    var slide_index=document.getElementById('slide_index').value;
    $(".account_movie_buy_tickets").on('click', function(event) {
    	event.preventDefault();
    	window.location.href = BASEURL + 'index?movieId='+movieId+"&slide_index="+slide_index;
    	// window.history.back(-1);
    });
    $(".goback_movie").on('click',function(){
    	window.location.href = BASEURL + 'index';
    })
    $(document).ready(function() {
    	/**
    	 * [url description]根据参数获取影片详情信息并渲染
    	 * @type {[type]}
    	 */
	    $.ajax({
	    	url: BASEURL + 'movie/intro',
	    	type: 'POST',
	    	dataType: 'json',
	    	data: {
	    		filmId: movieId,
	    		cityId: current_city_id,
	    		cityName:current_city_name
	    	},
	    })
	    .done(function(data) {
	    	if(data.status === 0 && data.data.length !== 0){
	    		var film = data.data.film;
	    		var actors = '';
	    		$("#account_Movie_Name").html(film.name);
	    		for (var i = 0; i < film.actors.length; i++) {
			    	var actor = film.actors[i].name;
			    	actors = actors + actor + '/';
			    }
	    		$("#account_movie_box").append(
	    			'<div id="account_movie_cover">'+
						// '<img src="'+film.cover['origin']+'" alt="背景" class="movie_background">'+
						'<div class="container">'+
  							'<div class="content"></div>'+
						'</div>'+
						'<figure>'+
							'<img src="'+film.poster['origin']+'" alt="封面" class="film_cover">'+
							'<div class="movie_info">'+
								'<figcaption>'+film.name+'</figcaption>'+
								// '<p class="movie_english_name">The Martian</p>'+
								'<p class="icon_star"></p>'+
								'<p class="movie_director">导演:<span>'+film.director+'</span>	</p>'+
								// '<p class="movie_scriptwriter">编剧:<span>德鲁·高达 /安迪·威尔</span></p>'+
								'<p class="movie_starring">主演:<span>'+actors+'</span></p>'+
								'<p class="movie_type">类型:<span>'+film.category+'</span></p>'+
								'<p class="movie_film_length">片长:<span>'+film.mins+'</span>分钟</p>'+
								// '<p class="movie_released">上映日期:<span>2015-11-25</span></p>'+
							'</div>'+
						'</figure>'+
						'<div class="movie_film_icon">'+
							'<img src="'+BASEURL+'images/iconLike@2x.png" alt="喜欢" class="movie_film_like">'+
							'<img src="'+BASEURL+'images/iconShare@2x.png" alt="分享" class="movie_film_share">'+
						'</div>'+
					'</div>'+
					'<div class="account_movie_story_box">'+
						'<div class="account_movie_story">'+
							'<p class="movie_story_intro">剧情简介</p>'+
							'<p class="movie_story_details">'+film.synopsis+'</p>'+
						'</div>'+
						'<img src="'+BASEURL+'images/参考框@2x.png" alt="更多" class="movie_story_details_more">'+
					'</div>'+
					'<div class="account_movie_stills_box">'+
						'<p class="account_movie_stills">剧照</p>'+
					"</div>"
	    		);
				for (var i = 0; i < 5; i++) {
					// console.log(film.photos.length);
					if(film.photos.length > 0){
						var bigPictureAddress = film.photos[i]['bigPictureAddress'];
						$(".account_movie_stills_box").append(
							'<img src="'+bigPictureAddress+'" alt="剧照图">'
						);
					}
				}
				$(".account_movie_story_box .movie_story_details").on('click',function(event) {
			    	$(".account_movie_story_box .movie_story_details_more").hide();
			    	$(this).css({
			    		'height':'100%',
			    		'overflow':'visible',
			    	});
			    });
			    $("#account_movie_cover figure .container .bg-blur-overlay").css('background-image', 'url('+film.cover["origin"]+')');
	    		$('.container .content').backgroundBlur({
				    imageURL : film.cover["origin"],
				    blurAmount : 50,
				    imageClass : 'bg-blur'
				});
	    		$("#uploadMore").hide();
	    	}
	    })
	    .fail(function() {
	    	console.log("error");
	    })
    });
}
/**
 * [initPrice description]比价页
 * @type {[type]}
 */
movie.initPrice = function(){
    "use strict";
    $(document).ready(function() {
    	$(".price_movie_date li").on('click',function(event) {
    		$(this).addClass('movie_date_time').siblings().removeClass('movie_date_time');
    	});
    	$(".goback_movie").on('click',function(event) {
    		window.location.href = BASEURL + 'index';
    	});
    	/**
    	 * [url description]获取电影院影片价格及场次信息
    	 * @type {[type]}
    	 */
    	var current_to_film = JSON.parse($("#current_To_film").val());
    	var cinemas_id = current_to_film['cinemas_id'];
    	var cinemasAjax = new Array();
    	var PfilmId = current_to_film['film_id'];
    	var PfilmName = $("#current_film_name").val();
    	var PcityId = $("#current_city_id").val();
    	var PcityName = $("#current_city_name").val();
    	var latitude = $("#localLatitude").val();
    	var longitude = $("#localLongitude").val();
    	for (var x = 0; x < cinemas_id.length; x++) {
	    	var cinemaHttp = $.ajax({
					    		url: BASEURL + 'movie/schedule',
					    		type: 'POST',
					    		dataType: 'json',
					    		data: {
					    			filmId: PfilmId,
					    			filmName: PfilmName,
					    			cinemaId: parseInt(cinemas_id[x]),
					    			cityId: PcityId,
					    			cityName: PcityName,
					    			latitude:latitude,
					    			longitude:longitude,
					    		},
					    	})
			    			.done(function(data) {
					    		// if(data[0].data.length > 0){
					    			var cinema_id = data[0].cinemaInfo.cinema_id;
					    			var startPrice;
					    			if(data[0].data.length > 0){
					    				var startPrice = data[0].data[0].price;
					    			}else{
					    				startPrice = 0;
					    			}
					    			$("#tabBox1-bd").append(
					    					'<div class="con">'+
								            	'<div class="price_movie_particulars price_movie_particulars_'+cinema_id+'">'+
													'<div class="movie_praticulars_left"></div>'+
													'<div class="movie_praticulars_main">'+
														'<div class="movie_praticulars_main_info">'+
															'<p class="movie_main_store_name">'+data[0].cinemaInfo.name+'</p>'+
															'<span class="movie_main_store_address">'+data[0].cinemaInfo.address+'</span><br>'+
															'本片余<span class="movie_main_store_surplus">'+data[0].data.length+'</span>场<br>'+
															'<button class="movie_film_heat">热度</button><span class="movie_film_heat_icon"></span><span class="movie_film_base_price">'+startPrice+'起</span>'+
														'</div>'+
														'<div class="movie_film_cinema_screening">'+
														'</div>'+
													'</div>'+
													'<div class="movie_praticulars_right"></div>'+
												'</div>'+
								            '</div>'
					    				);
					    			var datas = data[0].data;
					    			for (var i = 0; i < datas.length; i++) {
					    				var flats = '';
					    				var cssLink = 0;
					    				for (var j = 0; j < datas[i]['flats'].length; j++) {
					    					if(datas[i]['flats'][j].sites == '猫眼网'){
					    						cssLink = data[0].cinemaInfo.css;
					    						var flat = '<input type="radio" name="channel">'+
													'<ul class="movie_film_buy_channel_one">'+
														'<li class="movie_film_buy_channel_name">'+datas[i]['flats'][j].sites+'</li>'+
														'<li class="movie_film_buy_channel_price"><span>'+datas[i]['flats'][j].price+'</span>元<span class="movie_film_buy_channel_select"></span></li>'+
														'<span class="hidden_movie_buy_url">'+datas[i]['flats'][j].url+'</span>'+
													'</ul>';
												flats = flats + flat;
					    					}else{
					    						var flat = '<input type="radio" name="channel">'+
													'<ul class="movie_film_buy_channel_one">'+
														'<li class="movie_film_buy_channel_name">'+datas[i]['flats'][j].sites+'</li>'+
														'<li class="movie_film_buy_channel_price"><span>'+datas[i]['flats'][j].price+'</span>元<span class="movie_film_buy_channel_select"></span></li>'+
														'<span class="hidden_movie_buy_url">'+datas[i]['flats'][j].url+'</span>'+
													'</ul>';
												flats = flats + flat;
					    					}
					    				}
					    				$(".price_movie_particulars_"+cinema_id+" .movie_praticulars_main .movie_film_cinema_screening").append(
					    						'<div class="movie_film_cinema_box">'+
													'<ul class="movie_film_cinema_ul">'+
														'<li class="movie_film_cinema_ul_time">'+
															'<span class="movie_film_start_time">'+datas[i].showAt+'</span><br>'+
															'<span class="movie_film_stop_time">'+datas[i].stopAt+'</span>散场'+
														'</li>'+
														'<li class="movie_film_cinema_ul_address">'+
															'<span class="movie_film_language">'+datas[i].language + datas[i].imagery+'</span><br>'+
															'<span class="movie_film_hall">'+datas[i].hallName+'</span>'+
														'</li>'+
														'<li class="movie_film_cinema_ul_buy">'+
															'<span class="movie_film_price">'+datas[i].price+'</span><br>'+
															'<span class="movie_film_buy_channel">'+datas[i]['flats'].length+'</span>家渠道'+
															'<img src="'+BASEURL+'images/参考框@2x.png" alt="更多">'+
														'</li>'+
													'</ul>'+
													'<div class="movie_film_buy_channel_box">'+flats+'</div>'+
												'</div>'
					    					);
										var cssStyle = '';
										var t;
										for (var l = 0; l < cssLink.length; l++) {
											for(t in cssLink[l]) {
												$(".price_movie_particulars_"+cinema_id+" "+t).css({
													'text-indent': cssLink[l][t].indent,
													'width': cssLink[l][t].width,
												});
											}
										}
					    			}
					    		// }
					    	})
					    	.fail(function() {
					    		console.log("error");
					    	})
	    	cinemasAjax.push(cinemaHttp);
	    }
	    $.when.apply(this,cinemasAjax).done(function(data){
	    	$("#uploadMore").hide();
	    	var boxLen = $("#tabBox1-bd").children().length;
	    	if(boxLen > 0){
	    		TouchSlide({ slideCell:"#tabBox1",
					endFun:function(i){
						var bd = document.getElementById("tabBox1-bd");
						bd.parentNode.style.height = bd.children[i].children[0].offsetHeight+"px";
						if(i>0)bd.parentNode.style.transition="1000ms";
						$('body,html').scrollTop(0);
						/**
						 * 优化页面滑动时出现滑动失效现象
						 */
						$($("#tabBox1-bd").eq(0).children(0)[i].children[0].children[1].children[1]).show();
						var bdChildrenLen = $($("#tabBox1-bd").eq(0).children(0)[i]).siblings().children().length;
						for (var j = 0; j < bdChildrenLen; j++) {
							// console.log($($("#tabBox1-bd").eq(0).children(0)[i]).siblings().children(0)[j].children[1].children[1]);
							$($($("#tabBox1-bd").eq(0).children(0)[i]).siblings().children(0)[j].children[1].children[1]).hide();
						};
					}
				});
	    	}else{
	    		$("#noFilmInfo").show();
	    	}
			$("#tabBox1-bd").on('click',".price_movie_particulars .movie_praticulars_main  .movie_film_cinema_screening .movie_film_cinema_ul", function(event) {
	    		$(this).next().toggle();
	    	});
	    	$('.account_movie_buy_tickets').on('click',function(event) {
	    		var radios = $('input:radio[name="channel"]:checked').next().eq(0).children()[2];
	    		if(radios !== undefined){
	    			var movieBuyUrl = radios.innerHTML;
	    			movieBuyUrl = movieBuyUrl.replace(/&amp;/g,"&");
	    			window.location.href = movieBuyUrl;
	    		}
	    	});
	    })
    });
}




