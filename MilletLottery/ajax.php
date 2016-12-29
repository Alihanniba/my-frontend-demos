<?php
session_start();

//prize表示奖项内容，v表示中奖几率(若数组中七个奖项的v的总和为100，如果v的值为1，则代表中奖几率为1%，依此类推)
$prize_arr = array(
    '0' => array('id' => 1, 'prize' => '一等奖', 'v' => 0),
    '1' => array('id' => 2, 'prize' => '谢谢参与', 'v' => 20),
    '2' => array('id' => 3, 'prize' => '三等奖', 'v' => 0),
    '3' => array('id' => 4, 'prize' => '谢谢参与', 'v' => 20),
    '4' => array('id' => 5, 'prize' => '四等奖', 'v' => 0),
    '5' => array('id' => 6, 'prize' => '谢谢参与', 'v' => 20),
    '6' => array('id' => 7, 'prize' => '四等奖', 'v' => 0),
    '7' => array('id' => 8, 'prize' => '谢谢参与', 'v' => 20),
    '8' => array('id' => 9, 'prize' => '三等奖', 'v' => 0),
    '9' => array('id' => 10, 'prize' => '谢谢参与', 'v' => 10),
    '10' => array('id' => 11, 'prize' => '二等奖', 'v' => 0),
    '11' => array('id' => 12, 'prize' => '谢谢参与', 'v' => 10),
);
// $prize_arr = array(
//     '0' => array('id' => 1, 'prize' => '一等奖', 'v' => 0),
//     '1' => array('id' => 2, 'prize' => '谢谢参与', 'v' => 19.9),
//     '2' => array('id' => 3, 'prize' => '三等奖', 'v' => 0.01),
//     '3' => array('id' => 4, 'prize' => '谢谢参与', 'v' => 20),
//     '4' => array('id' => 5, 'prize' => '四等奖', 'v' => 0.035),
//     '5' => array('id' => 6, 'prize' => '谢谢参与', 'v' => 20),
//     '6' => array('id' => 7, 'prize' => '四等奖', 'v' => 0.035),
//     '7' => array('id' => 8, 'prize' => '谢谢参与', 'v' => 20),
//     '8' => array('id' => 9, 'prize' => '三等奖', 'v' => 0.01),
//     '9' => array('id' => 10, 'prize' => '谢谢参与', 'v' => 10),
//     '10' => array('id' => 11, 'prize' => '二等奖', 'v' => 0.01),
//     '11' => array('id' => 12, 'prize' => '谢谢参与', 'v' => 10),
// );
foreach ($prize_arr as $k=>$v) {
    $arr[$v['id']] = $v['v'];

}

$prize_id = getRand($arr); //根据概率获取奖项id
foreach($prize_arr as $k=>$v){ //获取前端奖项位置
    if($v['id'] == $prize_id){
     $prize_site = $k;
     break;
    }
}
$res = $prize_arr[$prize_id - 1]; //中奖项

$data['prize_name'] = $res['prize'];
$data['prize_site'] = $prize_site;//前端奖项从-1开始
$data['prize_id'] = $prize_id;
echo json_encode($data);



// $index = $prize_id - 1;
// $prize = $res['prize'];
// $datatime = date('Y-m-d', time());



function getRand($proArr) {
    $data = '';
    $proSum = array_sum($proArr); //概率数组的总概率精度

    foreach ($proArr as $k => $v) { //概率数组循环
        $randNum = mt_rand(1, $proSum);
        if ($randNum <= $v) {
            $data = $k;
            break;
        } else {
            $proSum -= $v;
        }
    }
    unset($proArr);

    return $data;
}
