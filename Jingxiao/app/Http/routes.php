<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    // return Redirect::to('/index');
    return view("business.index");
});

Route::get('home', 'Admin\HomeController@index');

Route::controllers([
    'auth' => 'Auth\AuthController',
    'password' => 'Auth\PasswordController',
]);

Route::get('login',function(){
    return view("business.index");
});

Route::group(['namespace' => 'Index'], function()
{
    Route::any('index', 'IndexController@index');
    Route::any('list', 'IndexController@listUrl');

});





Route::group(['namespace' => 'Business'], function () {
    Route::get('business', 'LoginController@showIndex');
    Route::get('business/list', 'VideoController@showList');
    Route::get('business/account', 'VideoController@showAccountInfo');

    Route::post('business/api/login', 'LoginController@login'); // 登录
    Route::post('business/api/register', 'LoginController@register'); // 注册
    Route::post('business/api/verifyMessage', 'LoginController@verifyMessage'); // 发送短信认证码
    Route::post('business/api/resetPasswordAuth', 'LoginController@resetPasswordAuth'); // 忘记密码验证手机
    Route::post('business/api/resetPassword', 'LoginController@resetPassword'); // 忘记密码重置密码
    Route::post('business/api/updateNickname','AccountController@updateNickname');
});

Route::group(['prefix' => 'admin', 'namespace' => 'Admin','middleware' => 'auth'], function()
{
    Route::any('/', 'HomeController@index');
    Route::resource('pages','PagesController');
    Route::resource('comments', 'CommentsController');

});

Route::group(['namespace' => 'Sell'], function()
{
    Route::POST('sell/goIn', 'SellController@goIn');
    Route::POST('sell/save', 'SellController@saveUserInfo');
    Route::GET('sell/index', 'SellController@index');
    Route::POST('sell/list', 'SellController@showList');
    Route::POST('sell/businessList', 'SellController@showBusiness');
});







