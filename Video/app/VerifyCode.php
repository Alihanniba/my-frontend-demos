<?php
/**
 * Created by PhpStorm.
 * User: aleen42
 * Date: 10/14/15
 * Time: 10:27 PM
 */

namespace App;

use Illuminate\Database\Eloquent\Model;

class VerifyCode extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'verfication_code';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['ctime', 'phone', 'code'];

    public $timestamps = false;

}
