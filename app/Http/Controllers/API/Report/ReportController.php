<?php

namespace App\Http\Controllers\API\Report;

use App\Http\Controllers\Controller;
use App\Http\Requests\Report\StoreReportRequest;
use App\Services\API\ReportService;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function __construct(protected ReportService $service)
    {
        
    }

    public function reportUser(StoreReportRequest $request)
    {
        return $this->service->createReport($request->validated());
    }

    public function getReport($id)
    {
        return $this->service->findById($id);
    }
    
}
