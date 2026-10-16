<?php

namespace App\Http\Controllers\API\Block;

use App\Http\Controllers\Controller;
use App\Http\Requests\Block\BlockUserRequest;
use App\Services\API\BlockService;
use Illuminate\Http\Request;

class BlockController extends Controller
{
    public function __construct(protected BlockService $service)
    {
        
    }

    public function index(Request $request){
        return $this->service->getBlockedUsers($request);
    }

    public function blockUser(BlockUserRequest $request){
        return $this->service->blockUser($request);
    }

    public function unblockUser(BlockUserRequest $request){
        return $this->service->unblockUser($request);
    }

    public function isUserBlocked(BlockUserRequest $request){
        return $this->service->isUserBlocked($request);
    }

    public function getBlockedUsers(Request $request){
        return $this->service->getBlockedUsers($request);
    }
}
