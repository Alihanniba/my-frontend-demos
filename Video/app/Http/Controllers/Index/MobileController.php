<?php

namespace App\Http\Controllers\Index;

use stdClass;
use Input;
use DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class MobileController extends Controller
{
    public function __construct() {

    }
    public function mobileShow(){
        function is_mobile() { 
            $user_agent = $_SERVER['HTTP_USER_AGENT']; 
            $mobile_agents = array("240x320","acer","acoon","acs-","abacho","ahong","airness","alcatel","amoi", 
            "android","anywhereyougo.com","applewebkit/525","applewebkit/532","asus","audio", 
            "au-mic","avantogo","becker","benq","bilbo","bird","blackberry","blazer","bleu", 
            "cdm-","compal","coolpad","danger","dbtel","dopod","elaine","eric","etouch","fly ", 
            "fly_","fly-","go.web","goodaccess","gradiente","grundig","haier","hedy","hitachi", 
            "htc","huawei","hutchison","inno","ipad","ipaq","iphone","ipod","jbrowser","kddi", 
            "kgt","kwc","lenovo","lg ","lg2","lg3","lg4","lg5","lg7","lg8","lg9","lg-","lge-","lge9","longcos","maemo", 
            "mercator","meridian","micromax","midp","mini","mitsu","mmm","mmp","mobi","mot-", 
            "moto","nec-","netfront","newgen","nexian","nf-browser","nintendo","nitro","nokia", 
            "nook","novarra","obigo","palm","panasonic","pantech","philips","phone","pg-", 
            "playstation","pocket","pt-","qc-","qtek","rover","sagem","sama","samu","sanyo", 
            "samsung","sch-","scooter","sec-","sendo","sgh-","sharp","siemens","sie-","softbank", 
            "sony","spice","sprint","spv","symbian","tablet","talkabout","tcl-","teleca","telit", 
            "tianyu","tim-","toshiba","tsm","up.browser","utec","utstar","verykool","virgin", 
            "vk-","voda","voxtel","vx","wap","wellco","wig browser","wii","windows ce", 
            "wireless","xda","xde","zte"); 
            $is_mobile = false; 
            foreach ($mobile_agents as $device) { 
                if (stristr($user_agent, $device)) { 
                    $is_mobile = true; 
                    break; 
                } 
            } 
            return $is_mobile; 
        } 
    }
    public function index() {
        $this->mobileShow();
        if (!is_mobile()) { 
            return redirect('index');
        } 
        return view('index.mobile.index');
    }

    public function search() {
        $this->mobileShow();
        if (!is_mobile()) { 
            return redirect('index');
        } 
        return view('index.mobile.search');
    }

    public function play(Request $request) {
        $this->mobileShow();
        if (!is_mobile()) { 
            return redirect('index');
        } 
        $title = $request->input('t','null');
        $k = $request->input('k','null');
        $index = $request->input('index','null');
        $id = $request->input('id','null');
        return view('index.mobile.play')
               ->with('title',$title)
               ->with('k',$k)
               ->with('index',$index)
               ->with('id',$id);
    }
    public function video(Request $request){
        $this->mobileShow();
        if (!is_mobile()) { 
            return redirect('index');
        } 
        $id = $request->input('id');
        return view('index.mobile.video')->with('id', $id);
    }
    public function saveData(Request $request){
        $title = $request->input('title');
        $image = $request->input('image');
        $url = $request->input('url');
        $result = DB::table('video_from_other_website')->where('url',$url)->pluck('id');
        if(!$result){
            $id = DB::table('video_from_other_website')->insertGetId([
                    'title' => $title,
                    'url'   => $url,
                    'image' => $image
                ]);
            if($id){
                return response()->json([
                    'status' => 0,
                    'errMsg' => '插入成功',
                    'id'     => $id,
                    ]);
            }else{
                return response()->json([
                    'status' => -1,
                    'errMsg' => '插入失败',
                    ]);
            }
        }else{
            return response()->json([
                'status' => 2,
                'errMsg' => '搜索成功',
                'id'     => $result,
                ]);
        }
    }

    public function getData(Request $request){
        $id = $request->input('id');
        $result = DB::table('video_from_other_website')->where('id',$id)->get();
        if($result){
            return response()->json([
                'status' => 0,
                'errMsg' => '获取成功',
                'result' => $result,
                ]);
        }else{
            return response()->json([
                'status' => -1,
                'errMsg' => '获取失败',
                ]);
        }


    }
}




