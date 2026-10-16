<?php

namespace App\Repositories;

use App\Models\UserReport;

class ReportRepository
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function all() {}

    public function create(array $data)
    {
        $report = UserReport::create($data);
        return $report->load(['reporter:id,first_name,last_name,email', 'reportedUser:id,first_name,last_name,email', 'reviewer:id,first_name,last_name,email']);
    }

    public function findById(int $id)
    {
        $report = UserReport::find($id);
        return $report->load(['reporter:id,first_name,last_name,email', 'reportedUser:id,first_name,last_name,email', 'reviewer:id,first_name,last_name,email']);
    }
}
