<?php

use App\Http\Controllers\API\Auth\AuthApiController;
use App\Http\Controllers\API\Auth\SocialAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::controller(AuthApiController::class)->prefix('auth')->middleware('throttle:auth-api')->group(function () {
    Route::post('register', 'register');
    Route::post('verify/register', 'verifyRegister');
    Route::post('resend/register-otp', 'resendRegisterOtp');
    Route::post('login', 'login');
    Route::post('logout', 'logout')->middleware('auth:sanctum');
    Route::post('forgetpass', 'forgotPassword');
    Route::post('resend/forgot-otp', 'resendForgotOtp');
    Route::post('verify-email', 'verifyForgetPass');
    Route::post('change-password', 'resetPassword');

    Route::post('google/callback', 'googleCallBackFunction');
    Route::post('google/callback', 'googleCallBackFunction');
    Route::post('apple/callback', 'appleCallBackFunction');
});

Route::controller(SocialAuthController::class)->prefix('auth')->middleware('throttle:auth-api')->group(function () {
    Route::post('/social/login', 'socialLogin');
    Route::post('google/callback', 'googleCallBackFunction');
    Route::post('google/callback', 'googleCallBackFunction');
    Route::post('apple/callback', 'appleCallBackFunction');
});
