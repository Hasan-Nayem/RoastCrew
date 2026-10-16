<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ReelAd;
use App\Services\Reels\MuxVideoService;
use Exception;
use Illuminate\Support\Facades\Log;

class ReelAdAdminController extends Controller
{
    protected $mux;

    public function __construct(MuxVideoService $mux)
    {
        $this->mux = $mux;
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $query = ReelAd::latest();
        
        if ($search) {
            $query->where('title', 'like', '%' . $search . '%');
        }

        $ads = $query->paginate(10);

        return Inertia::render('backend/reel-ads/index', [
            'ads' => $ads,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('backend/reel-ads/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'video' => 'required|file|mimes:mp4,mov,avi,wmv|max:50000',
            'target_url' => 'nullable|url',
            'status' => 'nullable|boolean',
        ]);

        try {
            // Upload to Mux
            $muxFile = $this->mux->upload($request->file('video'));
            
            ReelAd::create([
                'title' => $request->title,
                'asset_id' => $muxFile['asset_id'] ?? null,
                'video_url' => $muxFile['video_url'] ?? null,
                'thumbnail_url' => $muxFile['thumbnail'] ?? null,
                'target_url' => $request->target_url,
                'status' => $request->status ?? true,
            ]);

            return redirect()->route('admin.reel-ads.index')->with('success', 'Reel Ad created successfully.');
        } catch (Exception $e) {
            Log::error('Mux Upload Failed: ' . $e->getMessage());
            return back()->with('error', 'Video upload failed: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        $ad = ReelAd::findOrFail($id);

        return Inertia::render('backend/reel-ads/show', [
            'ad' => $ad
        ]);
    }

    public function edit($id)
    {
        $ad = ReelAd::findOrFail($id);

        return Inertia::render('backend/reel-ads/edit', [
            'ad' => $ad
        ]);
    }

    public function update(Request $request, $id)
    {
        $ad = ReelAd::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'video' => 'nullable|file|mimes:mp4,mov,avi,wmv|max:50000',
            'target_url' => 'nullable|url',
            'status' => 'nullable|boolean',
        ]);

        $data = [
            'title' => $request->title,
            'target_url' => $request->target_url,
            'status' => $request->status ?? true,
        ];

        try {
            if ($request->hasFile('video')) {
                // Delete old Mux asset if exists
                if ($ad->asset_id) {
                    try {
                        $this->mux->delete($ad->asset_id);
                    } catch (Exception $e) {
                        Log::warning('Failed to delete old Mux asset: ' . $e->getMessage());
                    }
                }

                // Upload new video
                $muxFile = $this->mux->upload($request->file('video'));
                
                $data['asset_id'] = $muxFile['asset_id'] ?? null;
                $data['video_url'] = $muxFile['video_url'] ?? null;
                $data['thumbnail_url'] = $muxFile['thumbnail'] ?? null;
            }

            $ad->update($data);

            return redirect()->route('admin.reel-ads.index')->with('success', 'Reel Ad updated successfully.');
        } catch (Exception $e) {
            Log::error('Mux Update Failed: ' . $e->getMessage());
            return back()->with('error', 'Video update failed: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $ad = ReelAd::findOrFail($id);

        if ($ad->asset_id) {
            try {
                $this->mux->delete($ad->asset_id);
            } catch (Exception $e) {
                Log::warning('Failed to delete Mux asset for Ad ID ' . $ad->id . ': ' . $e->getMessage());
            }
        }

        $ad->delete();

        return redirect()->route('admin.reel-ads.index')->with('success', 'Reel Ad deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids');
        
        if (is_array($ids)) {
            $ads = ReelAd::whereIn('id', $ids)->get();
            
            foreach ($ads as $ad) {
                if ($ad->asset_id) {
                    try {
                        $this->mux->delete($ad->asset_id);
                    } catch (Exception $e) {
                        Log::warning('Failed to delete Mux asset for Ad ID ' . $ad->id . ': ' . $e->getMessage());
                    }
                }
                $ad->delete();
            }
        }
        
        return redirect()->route('admin.reel-ads.index')->with('success', 'Selected ads deleted successfully.');
    }
}
