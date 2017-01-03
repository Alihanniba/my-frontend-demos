<?php

namespace App\Http\Controllers\Sell;

use Auth;
use Session;
use App\Model\Business\Sell;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;

use App\Utile\shortUrl\dwz;
use App\Utile\Common;

class SellController extends Controller
{
    private $user;
    public function __construct()
    {
        $this->user = Auth::user();
    }

    public function index(Request $request){
        return view('sell.index',['phone'=>Session::get("user_phone"),'level'=>$request->level]);
            // ->with(["phone", ],["level", );
    }
    /**
    登陆时判断,如果数据库存在信息,则直接进入经销主页,否则进入选择页面
     * 
     */
    public function goIn(Request $request){
        $phone = $request->input('phone');
        $level = DB::table('user')->where('phone',$phone)->pluck('level');
        if($level){
            return response()->json([
                    'status'=>0,
                    'errMsg'=>'成功',
                    'level' =>$level,
                ]);
        }else{
            return response()->json([
                    'status' => -1,
                    'errMsg' => '查询失败',
                    'level' =>$level,
                ]);
        }

    }






    /**
     * 
     保存首次登陆经销商信息
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    public function saveUserInfo(Request $request){
        $data = array();
        $data["phone"] = $request->input('phone');
        $data["name"]  = $request->input('name');
        $data["level"] = $request->input('level');
        $data["pay"]   = $request->input('pay');
        $data["area"]   = $request->input('area');
        $data["deposit"]   = $request->input('deposit');
        $data["purchase_price"]   = $request->input('purchase_price');
        $id = DB::table('user')->insertGetId($data);
        if($id){
            return response()->json([
                    'status' => 0,
                    'errMsg' => '插入成功'
                ]);
        }else{
            return response()->json([
                    'status' => -1,
                    'errMsg' => '插入失败'
                ]);
        }
    }

    /**
      展示自己出货详细信息
     * @return [type] [description]
     */
    public function showList(){
        $info = DB::table('wemall_order')->get();
        $count = DB::table('wemall_order')->count();
        if($info&&$count){
            return response()->json([
                    'status' => 0,
                    'errMsg' => '查询成功',
                    'info'   => $info,
                    'count'  => $count,
                ]);
        }else{
            return response()->json([
                    'status' => -1,
                    'errMsg' => '查询失败'
                ]);
        }
    }

    /**
      展示管辖区域内经销商信息及自己得到的利润
     */
    public function showBusiness(){            //这里匹配自己的管辖区域
        $businessInfo = DB::table('user')->where('area','LIKE','华南地区%')->get();
        if($businessInfo){
            return response()->json([
                    'status' => 0,
                    'errMsg' => '查询成功',
                    'info'   => $businessInfo,
                ]);
        }else{
            return response()->json([
                    'status' => -1,
                    'errMsg' => '查询失败'
                ]);
        }
    }
}
    