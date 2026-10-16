<?php

namespace App\Http\Controllers\API\Auth;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\SocialLoginRequest;
use App\Services\API\SocialAuthService;
use Illuminate\Http\Request;

class SocialAuthController extends Controller
{
    use ApiResponse;

    public function __construct(protected SocialAuthService $service)
    {
        
    }

    public function socialLogin(SocialLoginRequest $request){
        $user = $this->service->auth($request);  
        
        if(!$user){
            return $this->errorResponse('Something went wrong');
        }

        return $this->successResponse("Login Success", $user, 200);
    }
}
