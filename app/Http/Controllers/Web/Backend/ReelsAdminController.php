<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reels\StoreReelRequest;
use App\Http\Requests\Reels\UpdateReelRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Repositories\ReelsRepositories;
use App\Services\API\ReelsServices;

class ReelsAdminController extends Controller
{
    protected $reelsRepository;
    protected $reelsService;

    public function __construct(ReelsRepositories $reelsRepository, ReelsServices $reelsService)
    {
        $this->reelsRepository = $reelsRepository;
        $this->reelsService = $reelsService;
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $reels = $this->reelsRepository->adminList(10, $search);

        return Inertia::render('backend/reels/index', [
            'reels' => $reels,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('backend/reels/create');
    }

    public function store(StoreReelRequest $request)
    {
        $this->reelsService->store($request);

        return redirect()->route('admin.reels.index')->with('success', 'Reel created successfully.');
    }

    public function show($id)
    {
        $reel = $this->reelsRepository->findById($id);

        return Inertia::render('backend/reels/show', [
            'reel' => $reel
        ]);
    }

    public function edit($id)
    {
        $reel = $this->reelsRepository->findById($id);

        return Inertia::render('backend/reels/edit', [
            'reel' => $reel
        ]);
    }

    public function update(UpdateReelRequest $request, $id)
    {
        $reel = $this->reelsService->update($id, $request);

        if (!$reel) {
            // return $this->errorResponse('Reel not found.', 404);
            return redirect()->route('admin.reels.index')->with('error', 'Reel not found.');
        }
        return redirect()->route('admin.reels.index')->with('success', 'Reel updated successfully.');
    }

    public function destroy($id)
    {
        $this->reelsService->delete($id);
        return redirect()->route('admin.reels.index')->with('success', 'Reel deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids');
        if (is_array($ids)) {
            foreach ($ids as $id) {
                $this->reelsService->delete($id);
            }
        }
        return redirect()->route('admin.reels.index')->with('success', 'Selected reels deleted successfully.');
    }
}
