<?php
namespace App\Http\Controllers\Index;

use App\Services\MaiZuoService;
use App\Services\MaoYanService;
use App\Services\MovieService;
use App\Services\ShiGuangService;
use App\Services\WeiPiaoService;
use Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;
use Carbon\Carbon;
use App\Http\Controllers\Controller;

class MovieController extends Controller
{
    private $movieService;

    public function __construct()
    {
        $this->movieService = new MovieService();
    }

    public function getCity()
    {
        $latitude = Input::get('latitude');
        $latitude = empty($latitude) ? '22.533013' : $latitude;

        $longitude = Input::get('longitude');
        $longitude = empty($longitude) ? '113.930476' : $longitude;

        $city = $this->movieService->getMaiZuoService()->getCity($latitude,$longitude);
        return response()->json($city);

    }

    public function getNowPlaying()
    {
        $cityId = Input::get('cityId');
        $cityId = empty($cityId) ? '10' : $cityId;

        $cityName = Input::get('cityName');
        $cityName = empty($cityName) ? '深圳' : $cityName;

        $plays = $this->movieService->getMaiZuoService()->getNowPlaying($cityId,$cityName);
        return response()->json($plays);
    }

    public function getIntro()
    {
        $filmId = Input::get('filmId');
        $intro = '';
        if (!empty($filmId)) {
            $cityId = Input::get('cityId');
            $cityId = empty($cityId) ? '10' : $cityId;

            $cityName = Input::get('cityName');
            $cityName = empty($cityName) ? '深圳' : $cityName;

            $intro = $this->movieService->getMaiZuoService()->getIntro($filmId,$cityId,$cityName);

        }
        return response()->json($intro);
    }

    public function getCinemas()
    {
        $filmId = Input::get('filmId');
        $cinemas = '';
        if (!empty($filmId)) {
            $cityId = Input::get('cityId');
            $cityId = empty($cityId) ? '10' : $cityId;

            $cityName = Input::get('cityName');
            $cityName = empty($cityName) ? '深圳' : $cityName;

            $cinemas = $this->movieService->getMaiZuoService()->getCinemas($filmId,$cityId,$cityName);
        }
        return response()->json($cinemas);
    }

    public function getSchedules()
    {
        $filmId = Input::get('filmId');
        $filmName = Input::get('filmName');

        $cinemaId = Input::get('cinemaId');

        $cityId = Input::get('cityId');
        $cityId = empty($cityId) ? '10' : $cityId;

        $cityName = Input::get('cityName');
        $cityName = empty($cityName) ? '深圳' : $cityName;

        $latitude = Input::get('latitude');
        $latitude = empty($latitude) ? '22.533013' : $latitude;

        $longitude = Input::get('longitude');
        $longitude = empty($longitude) ? '113.930476' : $longitude;

        $variableData = array();
        $maiZuoService = new MaiZuoService($filmId, $cinemaId, $cityId, $cityName);
        $variableData['maiZuo'] = $maiZuoService->getSchedule();

        $maoYanService = new MaoYanService($cinemaId, $filmName, $cityName, $latitude, $longitude);
        $variableData['maoYan'] = $maoYanService->getSchedule();

        $shiGuangservice = new ShiGuangService($cinemaId, $filmName, $latitude, $longitude);
        $variableData['shiGuang'] = $shiGuangservice->getSchedule();

        $weiPiaoservice = new WeiPiaoService($cinemaId, $filmName, $cityName, $latitude, $longitude);
        $variableData['weiPiao'] = $weiPiaoservice->getSchedule();

        $result = $this->movieService->createsChedules($variableData, $cinemaId);
        return response()->json($result);
    }

    public function getSchedulesByThread()
    {
        $filmId = Input::get('filmId');
        $filmName = Input::get('filmName');

        $cinemaId = Input::get('cinemaId');

        $cityId = Input::get('cityId');
        $cityId = empty($cityId) ? '10' : $cityId;

        $cityName = Input::get('cityName');
        $cityName = empty($cityName) ? '深圳' : $cityName;

        $latitude = Input::get('latitude');
        $latitude = empty($latitude) ? '22.533013' : $latitude;

        $longitude = Input::get('longitude');
        $longitude = empty($longitude) ? '113.930476' : $longitude;

        $variableData = $this->movieService->scheduleThreadResult($filmId, $filmName, $cityId, $cityName, $latitude, $longitude, $cinemaId);
        $result = $this->movieService->createsChedules($variableData, $cinemaId);
        return response()->json($result);
    }

    public function index()
    {
        //已执行(只执行一次)
//        MaoYanService::initCinemas();

        //已执行(只执行一次)
//        MaiZuoService::initCinemas();

        //已执行(只执行一次)
//        ShiGuangService::initCinemas();

        //已执行(只执行一次)
        WeiPiaoService::initCinemas();

    }
}





