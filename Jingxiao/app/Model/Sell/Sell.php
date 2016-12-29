<?php

namespace App\Model\Sell;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Sell extends Model
{
    /**\
     * 关联的数据库中的表
     *
     * @var string
     */
    protected  $table = 'user';

    public $timestamps = false;


//    protected $guarded = ['id'];

    protected $fillable = ['id', 'phone', 'level', 'pay','area'];
    /**
     * 配置one-to-many关联关系
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
   

}
