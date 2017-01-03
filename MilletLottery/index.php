<?php
require_once("./data.php");
if(!$_GET['uid']){
    exit;
}
$uid = $_GET['uid'];

$temp = $dbh->prepare('SELECT prize FROM `user` WHERE `uid` = :uid');
$temp->bindParam(':uid' , $uid , PDO::PARAM_STR);
if(!$temp->execute()){
    echo " error";
}else{
    $prize = $temp->fetch();
    // echo $prize['prize'];
}

?>



<!DOCTYPE html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>alihanniba大抽奖</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <meta name="keywords" content="alihanniba大抽奖" />
        <meta name="description" content="alihanniba大抽奖" />
        <link rel="stylesheet" href="./css/index.css">
    </head>
    <body>
        <input type="hidden" value=" <?php echo $uid; ?>" id="hidden_uid">
        <input type="hidden" value=" <?php echo $prize['prize']; ?> " id="hidden_key">
        <div id="content">
            <img src="./img/title-start@2x.png" alt="alihanniba大抽奖" id="director">
            <div id="lottery">
                <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                        <td class="lottery-unit lottery-unit-0"><img src="img/pic-gift-1@2x.png"></td>
                        <td class="lottery-unit lottery-unit-1"><img src="img/pic-gift-0@2x.png"></td>
                        <td class="lottery-unit lottery-unit-2"><img src="img/pic-gift-3@2x.png"></td>
                        <td class="lottery-unit lottery-unit-3"><img src="img/pic-gift-0@2x.png"></td>
                    </tr>
                    <tr>
                        <td class="lottery-unit lottery-unit-11"><img src="img/pic-gift-0@2x.png"></td>
                        <td colspan="2" rowspan="2"><a href="javascript:void(0);"></a></td>
                        <td class="lottery-unit lottery-unit-4"><img src="img/pic-gift-4@2x.png"></td>
                    </tr>
                    <tr>
                        <td class="lottery-unit lottery-unit-10"><img src="img/pic-gift-2@2x.png"></td>
                        <td class="lottery-unit lottery-unit-5"><img src="img/pic-gift-0@2x.png"></td>
                    </tr>
                    <tr>
                        <td class="lottery-unit lottery-unit-9"><img src="img/pic-gift-0@2x.png"></td>
                        <td class="lottery-unit lottery-unit-8"><img src="img/pic-gift-3@2x.png"></td>
                        <td class="lottery-unit lottery-unit-7"><img src="img/pic-gift-0@2x.png"></td>
                        <td class="lottery-unit lottery-unit-6"><img src="img/pic-gift-4@2x.png"></td>
                    </tr>
                </table>
            </div>
            <button id="lottery_rule"></button>
        </div>
        <div id="black_shadow"></div>
        <div id="small_flip">
            <img src="./img/title-result-non@2x.png" alt="别灰心">
            <p>攒着人品今晚买彩票！</p>
        </div>
        <div id="lottery_rule_intro">
            <img src="./img/title-rule@2x.png" alt="抽奖规则">
            <ol>
                <li>在活动结束3个工作日内，alihanniba大抽奖官方通过电话17600813005与中奖者确认具体信息并寄送</li>
                <li>奖品通过电话17600813005与中奖者确认具体信息，请在活动结束后3个工作日内注意接听电话，期间如果3个工作日内或者未按照要求确认信息的用户视为自动放弃中奖机会</li>
                <li>每个手机、每个状态只有一次抽奖机会</li>
                <li>获奖名单在活动结束后7个工作日内，公布在alihanniba大抽奖官方微博</li>
                <li>活动最终解释权归alihanniba大抽奖官方所有</li>
            </ol>
        </div>
        <div id="winning">
            <img src="./img/title-result-get@2x.png" alt="中奖啦" id="wined">
            <img src="./img/pic-gift-big-4@2x.png" alt="小米" id="wined_gift">
            <p id="gift_name">四等奖：小米运动手环</p>
            <div id="warning">
                <p>注意事项:</p>
                <p>在活动结束后三个工作日内，由alihanniba大抽奖官方通过17600813005电话联系您确认中奖结果与投寄信息，请留意接听，若未能确认中奖信息则视为放弃领奖。</p>
            </div>
        </div>
        <script type="text/javascript" src="./js/jquery-2.1.4.min.js"></script>
        <script src="./js/index.js"></script>
        <script type="text/javascript">
            var lottery = {
                index: 0, //当前转动到哪个位置，起点位置
                count: 0, //总共有多少个位置
                timer: 0, //setTimeout的ID，用clearTimeout清除
                speed: 20, //初始转动速度
                times: 0, //转动次数
                cycle: 50, //转动基本次数：即至少需要转动多少次再进入抽奖环节
                prize: 0, //中奖位置
                init: function(id) {
                    if ($("#" + id).find(".lottery-unit").length > 0) {
                        $lottery = $("#" + id);
                        $units = $lottery.find(".lottery-unit");
                        this.obj = $lottery;
                        this.count = $units.length;
                        $lottery.find(".lottery-unit-" + this.index).addClass("active");
                    }
                },
                roll: function() {
                    var index = this.index;
                    var count = this.count;
                    var lottery = this.obj;
                    $(lottery).find(".lottery-unit-" + index).removeClass("active");
                    index += 1;
                    if (index > count - 1) {
                        index = 0;
                    }
                    $(lottery).find(".lottery-unit-" + index).addClass("active");
                    this.index = index;
                    return false;
                },
                stop: function(index) {
                    this.prize = index;
                    return false;
                }
            };

            function roll() {
                lottery.times += 1;
                lottery.roll();
                var prize_site = $("#lottery").attr("prize_site");

                if (lottery.times > lottery.cycle + 10 && lottery.index == prize_site) {
                    var prize_id = $("#lottery").attr("prize_id");
                    var prize_name = $("#lottery").attr("prize_name");
                    if(lottery.index !== ''){
                        $("#black_shadow").show();
                        bingo(lottery.index);
                    }
                    switch(lottery.index){
                        case 2:
                            $("#gift_name").text("三等奖：小米蓝牙音响");
                            $("#wined_gift").attr("src","./img/pic-gift-big-3@2x.png");
                            $("#winning").show();
                        break;
                        case 4:
                            $("#winning").show();
                        break;
                        case 6:
                            $("#winning").show();
                        break;
                        case 8:
                            $("#gift_name").text("三等奖：小米蓝牙音响");
                            $("#wined_gift").attr("src","./img/pic-gift-big-3@2x.png");
                            $("#winning").show();
                        break;
                        case 10:
                            $("#gift_name").text("二等奖：小米运动相机");
                            $("#wined_gift").attr("src","./img/pic-gift-big-2@2x.png");
                            $("#winning").show();
                        break;
                        default:
                            $("#small_flip").css("display","table");
                        break;
                    }

                    //alert("前端中奖位置："+prize_site+"\n"+"中奖名称："+prize_name+"\n中奖id："+prize_id)
                    clearTimeout(lottery.timer);
                    lottery.prize = -1;
                    lottery.times = 0;
                    click = false;

                } else{
                    if (lottery.times < lottery.cycle) {
                        lottery.speed -= 10;
                    } else if (lottery.times == lottery.cycle) {
                        var index = Math.random() * (lottery.count) | 0;
                        lottery.prize = index;
                    } else {
                        if (lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
                            lottery.speed += 110;
                        } else {
                            lottery.speed += 20;
                        }
                    }
                    if (lottery.speed < 40) {
                        lottery.speed = 40;
                    }
                    lottery.timer = setTimeout(roll, lottery.speed);
                    // console.log(lottery.index);



                }
                //console.log(lottery.index);
                // console.log(prize_id);
                return false;
            }

            var click = false;

            function bingo(index){
                var prize_grade;
                switch(index){
                    case 2:
                        prize_grade = 3
                    break;
                    case 4:
                        prize_grade = 4
                    break;
                    case 6:
                        prize_grade = 4
                    break;
                    case 8:
                        prize_grade = 3
                    break;
                    case 10:
                        prize_grade = 2
                    break;
                    default:
                        prize_grade = 10
                    break;
                }
                $.ajax({
                    url: './cc.php',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        uid:"<?php echo $uid; ?>",
                        prize: prize_grade,
                    },
                })
                .done(function(data) {
                    console.log(data);
                })
                .fail(function() {
                    console.log("error");
                })

            }

            $(function() {
                var click = false;
                lottery.init('lottery');
                $("#lottery a ").click(function() {
                    var index=lottery.index;
                     if (click) {
                        // switch(index){
                        //     case 3:
                        //         console.log('3');
                        //     break;
                        //     case 5:
                        //         console.log('5');
                        //     break;
                        //     case 6:
                        //         console.log('6');
                        //     break;
                        //     case 8:
                        //         console.log('8');
                        //     break;
                        //     case 10:
                        //         console.log('10');
                        //     break;
                        //     default:
                        //         console.log('美誉');


                        // }
                        //window.location.href = gotoWebSiteArray[key];
                        click = false;
                        return false;
                    } else {
                        lottery.speed = 100;

                        $.post("ajax.php", {uid: 1}, function(data) { //获取奖品，也可以在这里判断是否登陆状态
                            $("#lottery").attr("prize_site", data.prize_site);
                            $("#lottery").attr("prize_id", data.prize_id);
                            $("#lottery").attr("prize_name", data.prize_name);
                            roll();
                            click = true;
                            return false;
                        }, "json")

                    }
                });
                // $(".getGift").click(function() {
                //     var index=lottery.index;
                //      if (click) {
                //         switch(index){
                //             case 3:
                //                 console.log('3');
                //             break;
                //             case 5:
                //                 console.log('5');
                //             break;
                //             case 6:
                //                 console.log('6');
                //             break;
                //             case 8:
                //                 console.log('8');
                //             break;
                //             case 10:
                //                 console.log('10');
                //             break;
                //             default:
                //                 console.log('美誉');


                //         }
                //         //window.location.href = gotoWebSiteArray[key];
                //         click = false;
                //         return false;
                //     } else {
                //         lottery.speed = 100;

                //         $.post("ajax.php", {uid: 1}, function(data) { //获取奖品，也可以在这里判断是否登陆状态
                //             $("#lottery").attr("prize_site", data.prize_site);
                //             $("#lottery").attr("prize_id", data.prize_id);
                //             $("#lottery").attr("prize_name", data.prize_name);
                //             roll();
                //             click = true;
                //             return false;
                //         }, "json")

                //     }
                // });
            })
        </script>
    </body>
</html>
