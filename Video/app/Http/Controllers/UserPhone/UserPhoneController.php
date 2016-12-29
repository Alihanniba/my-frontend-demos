<?php
namespace App\Http\Controllers\UserPhone;

use DB;
use App\Utile\Common;
use App\Model\UserPhone\UserPhone;
use App\Http\Requests;
use Illuminate\Database\Eloquent\Model;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

/**
* 
*/
class UserPhoneController extends Controller
{
	
	public function index (Request $request) {
		$phone = $request->input('phone');
		$movie = $request->input('movie');
		
		$result = UserPhone::create([
            'phone' => $phone,
            'movie' => $movie,
        ]);
        if($result){
        	return response()->json([
	            'status' => 0,
	            'errMsg' => "插入数据库成功"
        	]);
        }else{
        	return response()->json([
	            'status' => -1,
	            'errMsg' => "插入数据库失败"
        	]);
        }
        
	}
}





