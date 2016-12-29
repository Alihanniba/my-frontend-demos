var love = {
	init: function() {
		//resizewindow
		resizeHtml();
		window.onresize = function(){
			resizeHtml();
		};
		function resizeHtml(){
			//set <html> font-size for rem
			document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth / 10 + 'px';
			//set .swiper-container height for fullscreen
			document.getElementsByClassName('swiper-container')[0].style.height = document.documentElement.clientHeight + 'px';
		}
		
		//swipe && result
		var first=true;
		function showResult(){
			$(".passdown-spe").show();
			mySwiper.unlockSwipes();
			mySwiper.slideTo(2);
			first=false;
		}
		var mySwiper = new Swiper('.swiper-container', {
			paginationClickable: true,
			followFinger: false,
			slidesPerView : 'auto',
			direction: 'vertical',
			onSlideChangeStart: function(swiper){
				if(swiper.activeIndex==1 && first){
					mySwiper.lockSwipeToNext();
				}else{
					mySwiper.unlockSwipeToNext();
				}
			}
		});
		$('.start').click(function(){
			mySwiper.slideNext();
		});
		$('#submit').click(function(){
			showResult();
		});
		
		//code
		var countdown = 60;
		$('#get-code').on("click",function(){
			setCountdownTime(this);
		});
		function setCountdownTime(val) {
			if(countdown == 0) {
				val.setAttribute("disabled", false);
				val.removeAttribute("disabled");
				val.innerHTML ="获取验证码";
				$(val).removeClass("btn-disable").addClass("btn-able");
				countdown = 60;
			} else {
				if(countdown == 60) {
					$(val).removeClass("btn-able").addClass("btn-disable");
				}
				val.setAttribute("disabled", true);
				val.innerHTML = countdown + "秒后重新发送";
				countdown--;
				setTimeout(function() {
					setCountdownTime(val);
				},1000);
			}
			
		}
	}
};