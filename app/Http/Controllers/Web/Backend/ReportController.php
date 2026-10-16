<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserReport;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display a paginated list of user reports with search/filter capabilities.
     */
    public function index(Request $request)
    {
        $query = UserReport::query();

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search by reporter name
        if ($request->filled('reporter')) {
            $query->whereHas('reporter', function ($q) use ($request) {
                $q->where(function ($query) use ($request) {
                    $query->where('first_name', 'like', '%' . $request->reporter . '%')
                        ->orWhere('last_name', 'like', '%' . $request->reporter . '%');
                });
            });
        }

        // Search by reported user name
        if ($request->filled('reported_user')) {
            $query->whereHas('reportedUser', function ($q) use ($request) {
                $q->where(function ($query) use ($request) {
                    $query->where('first_name', 'like', '%' . $request->reported_user . '%')
                        ->orWhere('last_name', 'like', '%' . $request->reported_user . '%');
                });
            });
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $paginator = $query->latest()
            ->paginate($request->items ?? 10)
            ->withQueryString();

        // Manually build the data array to ensure all keys are present in JSON
        $reports = $paginator->through(function ($report) {
            // Load users directly by ID (bypass relationships to ensure data loads)
            $reporter = User::find($report->reporter_id);
            $reportedUser = User::find($report->reported_user_id);

            return [
                'id'                  => $report->id,
                'reporter_id'         => $report->reporter_id,
                'reported_user_id'    => $report->reported_user_id,
                'description'         => $report->description,
                'status'              => $report->status,
                'admin_note'          => $report->admin_note,
                'reviewer_id'         => $report->reviewer_id,
                'reviewd_at'          => $report->reviewd_at,
                'created_at'          => $report->created_at,
                'updated_at'          => $report->updated_at,
                'created_at_formatted'=> Carbon::parse($report->created_at)->format('d M Y, h:i A'),
                'description_short'   => $report->description
                    ? (strlen($report->description) > 80
                        ? substr($report->description, 0, 80) . '...'
                        : $report->description)
                    : 'No description',
                'reporter'            => $reporter ? [
                    'id'         => $reporter->id,
                    'first_name' => $reporter->first_name,
                    'last_name'  => $reporter->last_name,
                    'email'      => $reporter->email,
                    'avatar'     => $reporter->avatar,
                    'status'     => $reporter->status,
                    'role'       => $reporter->role,
                ] : null,
                'reportedUser'        => $reportedUser ? [
                    'id'         => $reportedUser->id,
                    'first_name' => $reportedUser->first_name,
                    'last_name'  => $reportedUser->last_name,
                    'email'      => $reportedUser->email,
                    'avatar'     => $reportedUser->avatar,
                    'status'     => $reportedUser->status,
                    'role'       => $reportedUser->role,
                ] : null,
                'reviewer'            => $report->reviewer_id ? User::find($report->reviewer_id)?->only(['id', 'first_name', 'last_name', 'email']) : null,
            ];
        });

        return Inertia::render('backend/reports/index', [
            'reports' => $reports,
            'filters' => $request->only([
                'status',
                'reporter',
                'reported_user',
                'date_from',
                'date_to',
            ]),
        ]);
    }

    /**
     * Display the specified report with full details.
     */
    public function show(string $id)
    {
        $report = UserReport::findOrFail($id);

        // Load users directly by ID to ensure they're always available
        $reporter = User::find($report->reporter_id);
        $reportedUser = User::find($report->reported_user_id);
        $reviewer = $report->reviewer_id ? User::find($report->reviewer_id) : null;

        $data = [
            'id'                  => $report->id,
            'reporter_id'         => $report->reporter_id,
            'reported_user_id'    => $report->reported_user_id,
            'description'         => $report->description,
            'status'              => $report->status,
            'admin_note'          => $report->admin_note,
            'reviewer_id'         => $report->reviewer_id,
            'reviewd_at'          => $report->reviewd_at,
            'created_at'          => $report->created_at,
            'updated_at'          => $report->updated_at,
            'created_at_formatted'=> Carbon::parse($report->created_at)->format('d M Y, h:i A'),
            'reporter'            => $reporter ? [
                'id'         => $reporter->id,
                'first_name' => $reporter->first_name,
                'last_name'  => $reporter->last_name,
                'email'      => $reporter->email,
                'avatar'     => $reporter->avatar,
                'status'     => $reporter->status,
                'role'       => $reporter->role,
                'phone'      => $reporter->phone,
                'created_at' => $reporter->created_at,
            ] : null,
            'reportedUser'        => $reportedUser ? [
                'id'         => $reportedUser->id,
                'first_name' => $reportedUser->first_name,
                'last_name'  => $reportedUser->last_name,
                'email'      => $reportedUser->email,
                'avatar'     => $reportedUser->avatar,
                'status'     => $reportedUser->status,
                'role'       => $reportedUser->role,
                'phone'      => $reportedUser->phone,
                'created_at' => $reportedUser->created_at,
            ] : null,
            'reviewer'            => $reviewer ? [
                'id'         => $reviewer->id,
                'first_name' => $reviewer->first_name,
                'last_name'  => $reviewer->last_name,
                'email'      => $reviewer->email,
                'role'       => $reviewer->role,
            ] : null,
        ];

        return Inertia::render('backend/reports/show', [
            'report' => $data,
        ]);
    }

    /**
     * Show the form for editing the report.
     */
    public function edit(string $id)
    {
        $report = UserReport::findOrFail($id);

        $reporter = User::find($report->reporter_id);
        $reportedUser = User::find($report->reported_user_id);
        $reviewer = $report->reviewer_id ? User::find($report->reviewer_id) : null;

        $data = [
            'id'                  => $report->id,
            'reporter_id'         => $report->reporter_id,
            'reported_user_id'    => $report->reported_user_id,
            'description'         => $report->description,
            'status'              => $report->status,
            'admin_note'          => $report->admin_note,
            'reviewer_id'         => $report->reviewer_id,
            'reviewd_at'          => $report->reviewd_at,
            'created_at'          => $report->created_at,
            'updated_at'          => $report->updated_at,
            'created_at_formatted'=> Carbon::parse($report->created_at)->format('d M Y, h:i A'),
            'reporter'            => $reporter ? [
                'id'         => $reporter->id,
                'first_name' => $reporter->first_name,
                'last_name'  => $reporter->last_name,
                'email'      => $reporter->email,
                'avatar'     => $reporter->avatar,
                'status'     => $reporter->status,
                'role'       => $reporter->role,
            ] : null,
            'reportedUser'        => $reportedUser ? [
                'id'         => $reportedUser->id,
                'first_name' => $reportedUser->first_name,
                'last_name'  => $reportedUser->last_name,
                'email'      => $reportedUser->email,
                'avatar'     => $reportedUser->avatar,
                'status'     => $reportedUser->status,
                'role'       => $reportedUser->role,
            ] : null,
            'reviewer'            => $reviewer ? [
                'id'         => $reviewer->id,
                'first_name' => $reviewer->first_name,
                'last_name'  => $reviewer->last_name,
                'email'      => $reviewer->email,
                'role'       => $reviewer->role,
            ] : null,
        ];

        return Inertia::render('backend/reports/update', [
            'report' => $data,
        ]);
    }

    /**
     * Update the report status and add admin notes.
     */
    public function update(Request $request, string $id)
    {
        $report = UserReport::findOrFail($id);

        $validated = $request->validate([
            'status'     => ['required', 'string', 'in:pending,resolved,declined'],
            'admin_note' => ['nullable', 'string', 'max:2000'],
        ]);

        $report->update([
            'status'      => $validated['status'],
            'admin_note'  => $validated['admin_note'] ?? $report->admin_note,
            'reviewer_id' => auth()->id(),
            'reviewd_at'  => now(),
        ]);

        return redirect()->route('admin.report.show', $id)
            ->with('success', 'Report updated successfully.');
    }

    /**
     * Toggle the reported user's active status (suspend/unsuspend).
     */
    public function toggleActiveStatus(string $id)
    {
        $report = UserReport::findOrFail($id);
        $user = User::find($report->reported_user_id);

        if (!$user) {
            return redirect()->back()->with('error', 'Reported user not found.');
        }

        $user->status = !$user->status;
        $user->save();

        $action = $user->status ? 'unsuspended' : 'suspended';
        $actionTitle = $user->status ? 'Unsuspended' : 'Suspended';

        // If suspending, also resolve the pending report
        if (!$user->status && $report->status === 'pending') {
            $report->update([
                'status'      => 'resolved',
                'reviewer_id' => auth()->id(),
                'reviewd_at'  => now(),
                'admin_note'  => ($report->admin_note ? $report->admin_note . "\n" : '') . "User {$action} by admin.",
            ]);
        }

        return redirect()->back()->with(
            'success',
            "User {$actionTitle} successfully."
        );
    }
}
