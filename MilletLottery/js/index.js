/**
 *
 * @authors \alihanniba\
 * @email   \alihanniba@gmail.com\
 * @date    2016-01-20 11:45:56
 * @version \www.alihanniba.com\
 */
$(document).ready(function() {
    var winWidth;
    winWidth = $(window).width();
    $("#lottery").css({
        "height": winWidth*0.88 + "px",
        "width": winWidth*0.88 + "px",
    });
    $("#lottery table").css({
        "height": winWidth*0.88 + "px",
        "width": winWidth*0.88 + "px",
    });
    $("#lottery table tbody").css({
        "height": winWidth*0.88 + "px",
        "width": winWidth*0.88 + "px",
    });
    $("#lottery table tr").css({
        "height": winWidth*0.22 + "px!important",
    });
    $("#lottery table td").css({
        "height": winWidth*0.22 + "px",
        "width": winWidth*0.22 + "px",
    });
    $("#lottery table td a").css({
        "height": winWidth*0.44 + "px",
        "width": winWidth*0.44 + "px",
    });
    $("#lottery table td img").css({
        "height": "100%",
        "width": "100%",
    });
    // console.log(parseInt($("#content").css("height")));
    // console.log($(document).height());
    //遮罩层自适应高度
    $("#black_shadow").css("height",$(document).height() + "px");

    //浏览器窗口高度自适应
    if(parseInt($("#content").css("height")) < $(window).height()){
        $("#content").css("height",$(window).height() + "px");
    }
    $("#lottery_rule").on('click',  function(event) {
        event.preventDefault();
        /* Act on the event */
        $("#lottery_rule_intro").show("fast");
    });
    $("#lottery_rule_intro").on('click',function(event) {
        event.preventDefault();
        /* Act on the event */
        $(this).hide('fast');
    });
    var prize_grades = $("#hidden_key").val();
    console.log(prize_grades);
    if(prize_grades == 10 ||prize_grades == 2 ||prize_grades == 3 ||prize_grades == 4){
        if(prize_grades == 10){
            $("#small_flip p").html("您已经抽过奖啦 <br/> 中奖情况为：买彩票");
        }
        if(prize_grades == 2){
            $("#small_flip p").html("您已经抽过奖啦 <br/> 中奖情况为：二等奖");
        }
        if(prize_grades == 3){
            $("#small_flip p").html("您已经抽过奖啦 <br/> 中奖情况为：三等奖");
        }
        if(prize_grades == 4){
            $("#small_flip p").html("您已经抽过奖啦 <br/> 中奖情况为：四等奖");
        }
        $("#small_flip img").attr("src","./img/title-result-again@2x.png");
        $("#black_shadow").show();
        $("#small_flip").css("display","table");
    }
});


