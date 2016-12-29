<?php
namespace App\Utile;

use App\Utile\QRrsItem;
use App\Utile\QRrs;

define("RS_SYMSIZE", 5);
define("RS_GFPOLY", 0x25);
define("RS_FCR", 1);
define("RS_PRIM", 1);
define("RS_NROOTS", 8);
define("RS_DATA_LEN", 10);
define("RS_TOTAL_LEN", (RS_DATA_LEN + RS_NROOTS));
define("RS_PAD", ((1<<RS_SYMSIZE) - 1 - RS_TOTAL_LEN));
define("BB_CHARACTERS", "0123456789abcdefghijklmnopqrstuv");

class CreateCode {
    public static function num_to_char($n) {
        $BB_CHARACTERS = "0123456789abcdefghijklmnopqrstuv";
        if ($n >= 0 && $n < 32) {
            return $BB_CHARACTERS[$n];
        }

        return -1;
    }

    public static function char_to_num($c) {
        if (ord($c) >= 48 && ord($c) <= 57) {

            $data = ord($c) - 48;


        } else if (ord($c) >= 97 && ord($c) <= 118) {

            $data = ord($c) - 87;

        }
        return $data;
    }

    public static function getCode(){
        $string = '';
        $len = 10;
        for(; $len >= 1; $len--)
        {
            $position = rand() % strlen(BB_CHARACTERS);
            $string .= substr(BB_CHARACTERS, $position, 1);
        }
        return $string;
    }

    public static function rsCode($code) {
        if($code && strlen($code) == 10) {
            $data = array();
            $rs_code = array();
            for ($i = 0; $i < RS_TOTAL_LEN; $i++) {
                if ($i < RS_DATA_LEN) {
                    $data[] = self::char_to_num($code[$i]);
                } else {

                    $data[] = 0;
                }
            }
            $qRrs = new QRrs();
            $rs = $qRrs->init_rs(RS_SYMSIZE, RS_GFPOLY, RS_FCR, RS_PRIM, RS_NROOTS, RS_PAD);
            $newcode = &$data[RS_DATA_LEN];
            $qRrsItem = new QRrsItem();
            $res = $qRrsItem->encode_rs_char($rs, $data, $newcode);

            for ($i = 0; $i < RS_DATA_LEN; $i++) {
                $rs_code[] = self::num_to_char($data[$i]);
            }
            for ($i = 0; $i < count($res); $i++) {
                $rs_code[] = self::num_to_char($res[$i]);
            }
            $newrs_code = '';
            for ($i = 0; $i < count($rs_code); $i++) {
                $newrs_code .= $rs_code[$i];
            }
            // $newrs_code .= '\0';
            return $newrs_code;
        }
        return null;
    }
}

