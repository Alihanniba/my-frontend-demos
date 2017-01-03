<?php

namespace App\Http\Controllers\Business;

use Auth;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Services\File\UploadFile;

class UploadController extends Controller
{
    public function __construct(Request $request)
    {
        $this->middleware('auth');
    }

    public function uploadImage(Request $request, UploadFile $uploader)
    {
        return $uploader->upLoad($request, 'upload_image');
    }

    
}
