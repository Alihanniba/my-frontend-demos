<?php 
namespace App\Model\UserPhone;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class UserPhone extends Model
{
	/**\
     * 关联的数据库中的表
     *
     * @var string
     */
    protected  $table = 'user_phone';

    //定义以下字段允许修改
    protected $fillable = array('phone', 'movie');

    //不设定自动更新数据表里字段
    public $timestamps = false;
}








