<?php

namespace App\Services\API;

use App\Models\User;
use App\Repositories\Auth\SocialAuthRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class SocialAuthService
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected SocialAuthRepository $repository)
    {
        //
    }

    public function auth($request){

        try {
            if($request->provider_id === 'google'){
            $socialUser = Socialite::driver('google')->stateless()->userFromToken($request->token);

            }else if($request->provider_id === 'apple'){
                $socialUser = Socialite::driver('apple')->stateless()->userFromToken($request->token); 
            }else {
                Log::error('Unsupported provider');
                return false;
            }

            if ($socialUser) {

                //find user
                $user = $this->repository->findUserByEmail($socialUser->email);
                
                if (!$user) {
                    $password = Str::random(16);

                    $name = $socialUser->getName();
                    $username = Str::slug($name);

                    while (User::where('user_name', $username)->exists()) {
                        $randomString = Str::random(5);
                        $username = Str::slug($name) . '-' . $randomString;
                    }

                    $data = [
                        'provider_id' => $request->provider_id,
                        'first_name' => $name,
                        'email' => $socialUser->email,
                        'user_name' => $username,
                        'password' => Hash::make($password),
                        'avatar' => $socialUser->getAvatar(),
                        'email_verified_at' => now(),
                    ];

                    $user = $this->repository->createUser($data);
                }
                Auth::login($user);

                $token = $user->createToken('AuthToken')->plainTextToken;
                $info = $this->repository->findUserByEmail($socialUser->email);
                $userInfo = [
                    'token' => $token,
                    'token_type' => 'Bearer',
                    'user' => $info,
                ];
                return $userInfo;
                // return response()->json([
                //     'status' => 200,
                //     'message' => 'Login Successful',
                //     'token_type' => 'Bearer',
                //     'token' => $token,
                //     'data' => $info
                // ]);

            } else {
                Log::error('Invalid or Expired Token');
                return false;
            }
        } catch (\Exception $e) {
            \Log::error('Social login failed: ' . $e->getMessage());
            return false;
        }
    }
}
