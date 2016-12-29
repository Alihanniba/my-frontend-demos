<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

/*Route::get('/', function () {
    return view('welcome');
});*/

Route::get('/', function () {
    return view('/movie/index');
});


/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/
Route::group(['namespace' => 'Index'], function()
{
    Route::any('movie/index', 'MovieController@index');
    Route::any('movie/city', 'MovieController@getCity'); //根据经纬度获取当前城市信息
    Route::any('movie/plays', 'MovieController@getNowPlaying');//获取正在上映的电影
    Route::any('movie/intro', 'MovieController@getIntro');//获取电影简介等信息
    Route::any('movie/cinemas', 'MovieController@getCinemas');//获取电影院信息
    Route::any('movie/schedule', 'MovieController@getSchedules');//获取各个平台的电影票价格



    //移动端页面路由
    Route::get('index', 'MovieViewController@index'); // 首页
    Route::get('account', 'MovieViewController@account'); // 详情页
    Route::get('price', 'MovieViewController@price'); // 比价页

});

Route::group(['middleware' => ['web']], function () {
    //
});
