<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Track\StoreTrackRequest;
use App\Http\Requests\Track\UpdateTrackRequest;
use App\Models\Track;
use App\Services\Backend\TrackService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrackController extends Controller
{
    /**
     * Injecting Service.
     */
    public function __construct(protected TrackService $service){}
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $tracks = Track::query()
            ->with('images')

            ->when($request->search, function ($query, $search) {

                $query->where(function ($q) use ($search) {

                    $q->where('title', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('backend/track/index', [
            'tracks' => $tracks,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('backend/track/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTrackRequest $request)
    {
        $validated = $request->validated();
        $images = $request->file('images', []);
        unset($validated['images']);

        $this->service->create($validated, $images);
        return redirect()->route('admin.track.index')->with('success', 'Track created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $track = $this->service->find($id);
        return Inertia::render('backend/track/show', [
            'track' => $track,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $track = $this->service->find($id);
        return Inertia::render('backend/track/edit', [
            'track' => $track,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTrackRequest $request, string $id)
    {
        $validated = $request->validated();
        $images = $request->file('images', []);
        unset($validated['images']);

        $validated['status'] = $request->boolean('status');
        $validated['is_featured'] = $request->boolean('is_featured');

        $this->service->update($id, $validated, $images);
        return redirect()->route('admin.track.index')->with('success', 'Track updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $track = $this->service->delete($id);
        if ($track) {
            return redirect()->route('admin.track.index')->with('success', 'Track deleted successfully.');
        }
        return redirect()->route('admin.track.index')->with('error', 'Track not found.');
    }
}
