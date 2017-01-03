<?php

namespace App\Http\Controllers\Index;

use stdClass;
use Input;
use DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class MovieViewController extends Controller
{
    public function __construct() {

    }
    public function index(Request $request) {
        $movieId=$request->input('movieId');
        $slide_index=$request->input('slide_index');
        return view('movie.index')->with('movieId',$movieId)
                                  ->with('slide_index',$slide_index);

    }

    public function account(Request $request) {
        $movieId=$request->input('movieId');
        $movie_title=$request->input('movie_title');
        $slide_index=$request->input('slide_index');
        $current_city_id=$request->input('current_city_id');
        $current_city_name=$request->input('current_city_name');
        return view('movie.account')->with('movieId',$movieId)
                                    ->with('movie_title',$movie_title)
                                    ->with('slide_index',$slide_index)
                                    ->with('current_city_id',$current_city_id)
                                    ->with('current_city_name',$current_city_name);
    }

    public function price(Request $request) {
        $current_To_film=$request->input('current_To_film');
        $current_film_name=$request->input('current_film_name');
        $current_city_id=$request->input('current_city_id');
        $current_city_name=$request->input('current_city_name');
        $localLatitude=$request->input('localLatitude');
        $localLongitude=$request->input('localLongitude');
        return view('movie.price')->with('current_To_film',$current_To_film)
                                  ->with('current_film_name',$current_film_name)
                                  ->with('current_city_id',$current_city_id)
                                  ->with('current_city_name',$current_city_name)
                                  ->with('localLatitude',$localLatitude)
                                  ->with('localLongitude',$localLongitude);
    }
}




