<?php

namespace App\Services\API;

use App\Concerns\ApiResponse;
use App\Models\User;
use App\Repositories\ReportRepository;
use Illuminate\Http\JsonResponse;

class ReportService
{
    /**
     * Create a new class instance.
     */
    use ApiResponse;
    public function __construct(protected ReportRepository $repository, protected NotificationService $notificationService)
    {
        //
    }

    public function createReport(array $data): jsonresponse
    {
        $data['reporter_id'] = auth()->id();
        $report = $this->repository->create($data);
        $admins = User::where('role', 'admin')->orWhere('role', 'super_admin')->get();
        foreach ($admins as $admin) {
            $this->notificationService->notify($admin, auth()->user(), 'report_created', $report);
        }
        return $this->successResponse('Report created successfully', $report, 201);
    }

    public function findById(int $id): jsonresponse
    {
        $report = $this->repository->findById($id);
        if (!$report) {
            return $this->errorResponse('Report not found', 404);
        }
        return $this->successResponse('Report retrieved successfully', $report, 200);
    }
}
