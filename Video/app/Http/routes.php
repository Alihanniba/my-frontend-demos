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
    return Redirect::to('/index');
});

Route::get('home', 'Admin\HomeController@index');

Route::controllers([
    'auth' => 'Auth\AuthController',
    'password' => 'Auth\PasswordController',
]);
Route::group(['namespace' => 'Index'], function()
{
    // 移动端页面
    Route::get('m/index', 'MobileController@index'); // 首页
    Route::get('m/search', 'MobileController@search'); // 搜索
    Route::get('m/play', 'MobileController@play'); // 显示详细信息页
    Route::get('m/video', 'MobileController@video'); // 播放页
    Route::post('m/saveData', 'MobileController@saveData'); // 保存视频信息
    Route::post('m/getData', 'MobileController@getData'); // 播放页获取视频信息

});

Route::group(['namespace' => 'UserPhone'], function()
{
    Route::any('userPhone', 'UserPhoneController@index');
});








