<?php

namespace App\Http\Controllers\Business;

use App\User;
use App\VerifyCode;
use Auth;
use Session;
use Validator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class LoginController extends Controller
{

    public function showIndex()
    {
        return view("business.index");
    }

    private function loginValidator(array $data)
    {
        return Validator::make($data, [
            'phone' => 'required|max:11|min:11',
            'password' => 'required',
        ]);
    }

    private function registerValidator(array $data)
    {
        return Validator::make($data, [
            'phone' => 'required|max:11|min:11|unique:users',
            'password' => 'required|min:6',
        ]);
    }

    public function login(Request $request)
    {
        $data = array();
        $data['phone'] = $request->input('phone');
        $data['password'] = $request->input('password');
        $validator = $this->loginValidator($data);
        if ($validator->passes()) {
            if (Auth::attempt(['phone' => $data['phone'], 'password' => $data['password']])) {
                $user = Auth::user();
                Session::put("user_id", $user->id);
                Session::put("user_phone", $user->phone);
                
                return response()->json([
                    'status' => 0,
                    'errMsg' => '登录成功'
                ]);
            } else {
                return response()->json([
                    'status' => 2,
                    'errMsg' => '用户名或密码错误'
                ]);
            }
        } else {
            return response()->json([
                'status' => 1,
                'errMsg' => $validator->messages()
            ]);
        }
    }

    public function register(Request $request)
    {
        $data = array();
        $data['phone'] = $request->input('phone');
        $data['password'] = $request->input('password');
        $data['code'] = $request->input('code');

        $codeVerify = $this->verifyCode($data['phone'], $data['code']);
        if ($codeVerify['status'] != 0) {
            return response()->json($codeVerify);
        }
        $count = User::where(['phone' => $data['phone']])->count();
        if ($count) {
            return response()->json([
                'status' => 1,
                'errMsg' => "www.alihanniba.com"
            ]);
        } else {
            User::create([
                'phone' => $data['phone'],
                'password' => bcrypt($data['password']),
            ]);
            return response()->json([
                'status' => 0,
                'errMsg' => "注册成功"
            ]);
        }
    }

    public function logout()
    {
        Auth::logout();
        return view("business.index");
    }

    /**
     * [resetPasswordAuth 检查忘记密码的验证码]
     */
    public function resetPasswordAuth(Request $request)
    {
        $data = array();
        $data['phone'] = $request->input('phone');
        $data['code'] = $request->input('code');
        $codeVerify = $this->verifyCode($data['phone'], $data['code']);
        if ($codeVerify['status'] != 0) {
            return response()->json($codeVerify);
        } else {
            Session::put('resetPasswordAuth_phone', $data['phone']);
            return response()->json([
                'status' => 0,
                'errMsg' => "验证成功"
            ]);
        }
    }

    /**
     * [resetPassword 重置密码]
     */
    public function resetPassword(Request $request)
    {
        if (!Session::has('resetPasswordAuth_phone')) {
            return response()->json([
                'status' => -1,
                'errMsg' => "未通过短信验证"
            ]);
        }
        $data = array();
        $data['phone'] = Session::get('resetPasswordAuth_phone');
        $data['password'] = $request->input('password');
        $data['password_confirmation'] = $request->input('password_confirmation');
        if (!$data['password'] || !$data['password_confirmation']) {
            return response()->json([
                'status' => -3,
                'errMsg' => "参数不足"
            ]);
        } else if ($data['password'] != $data['password_confirmation']) {
            return response()->json([
                'status' => -2,
                'errMsg' => "密码不一致"
            ]);
        }
        User::where('phone', $data['phone'])->update(['password' => bcrypt($data['password'])]);
        return response()->json([
            'status' => 0,
            'errMsg' => "重置成功"
        ]);
    }

    /**
     * [verifyMessage 发送验证短信]
     */
    public function verifyMessage(Request $request)
    {
        $verifyCode = new VerifyCode();
        $phone = trim($request->input('phone'));

        VerifyCode::where('phone', $phone)->delete();


        $code = rand(100000, 999999);
        $message = "您好！验证码是：" . $code;
        $createtime = time();

        $data = array();
        $verifyCode->ctime = $createtime;
        $verifyCode->phone = $phone;
        $verifyCode->code = $code;
        $verifyCode->save();

        $account = 'www.alihanniba.com';
        $password = 'www.alihanniba.com';

        // send message
        $post_data = array();
        $post_data['account'] = iconv('GB2312', 'GB2312', $account);
        $post_data['pswd'] = iconv('GB2312', 'GB2312', $password);
        $post_data['mobile'] = $phone;
        $post_data['msg'] = mb_convert_encoding("$message", 'UTF-8', 'auto');
        $url = 'http://222.73.117.158/msg/HttpBatchSendSM?';
        $o = "";
        foreach ($post_data as $k => $v) {
            $o .= "$k=" . urlencode($v) . "&";
        }
        $post_data = substr($o, 0, -1);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $result = curl_exec($ch);
        $return = substr(strstr($result, ','), 1, strlen(strstr($result, ',') - 1));
        if ($return == 0) {
            return response()->json([
                'status' => 0,
                'errMsg' => "发送成功"
            ]);
        } else {
            return response()->json([
                'status' => -1,
                'errMsg' => $phone . '发送失败'
            ]);
        }
    }

    /**
     * [verifyCode 验证短信验证码]
     */
    private function verifyCode($phone, $code)
    {
        $result = VerifyCode::where('phone', $phone)->select('code', 'ctime')->first();
        if($result == NULL)
            return ([
                'status' => -1,
                'errMsg' => '未生成验证码'
            ]);
        if (intval($result['ctime']) < intval(time()) - 60 * 30) {
            VerifyCode::where('phone', $phone)->delete();
            return ([
                'status' => -2,
                'errMsg' => '验证码失效'
            ]);
        }
        if ($result['code'] != $code) {
            return ([
                'status' => -3,
                'errMsg' => '验证码错误'
            ]);
        } else {
            VerifyCode::where('phone', $phone)->delete();
            return ([
                'status' => 0,
                'errMsg' => '验证成功'
            ]);
        }
    }
}