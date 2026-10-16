<?php

namespace App\Http\Controllers\API\Track;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\Backend\TrackService;
use Illuminate\Http\Request;

class TrackController extends Controller
{

    use ApiResponse;

    public function __construct(protected TrackService $service){}

    public function index(){
        $tracks = $this->service->all();
        return $this->successResponse('All tracks fetched', $tracks, 200);
    }

    public function show(String $id){
        $track = $this->service->find($id);
        if(!$track){
            return $this->errorResponse('No tracks found!', 404);
        }
        return $this->successResponse('Track found!', $track, 200);
    }
}
