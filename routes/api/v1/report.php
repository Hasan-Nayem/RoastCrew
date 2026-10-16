<?php

use App\Http\Controllers\API\Report\ReportController;
use Illuminate\Support\Facades\Route;


Route::controller(ReportController::class)->prefix('report')->middleware(['auth:sanctum'])->group(function () {
    Route::post('/report-user', 'reportUser');
    Route::get('/get-report/{id}', 'getReport');
});
