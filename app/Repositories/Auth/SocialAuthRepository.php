<?php

namespace App\Repositories\Auth;

use App\Models\User;

class SocialAuthRepository
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function findUserByEmail(String $email){
        $data = User::where('email', $email)->first();
        return $data;
    }

    public function createUser(Array $data){
        return User::create($data);
    }
}
