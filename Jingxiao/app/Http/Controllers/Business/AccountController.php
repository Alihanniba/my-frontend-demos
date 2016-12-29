<?php

namespace App\Http\Controllers\Business;

use App\User;
use Auth;
use Session;
use Validator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AccountController extends Controller
{
    private $user;

    public function __construct()
    {
        $this->middleware('auth');
        $this->user = Auth::user();
    }

    public function updateNickname(Request $request)
    {
        $uid = $this->user->id;

        $user = User::find($uid);
        $user->nickname = $request->input('nickname');;
        $result = $user->save();
        if ($result) {
            return response()->json([
                'status' => 0,
                'errMsg' => '修改昵称成功'
            ]);
        } else {
            return response()->json([
                'status' => -1,
                'errMsg' => '修改昵称失败'
            ]);
        }
    }
}