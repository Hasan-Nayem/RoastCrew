<?php

namespace App\Repositories;

use App\Models\Track;
use Illuminate\Support\Facades\Storage;

class TrackRepository
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function all()
    {
        return Track::with('images')->latest()->get();
    }

    public function find($id)
    {
        return Track::with('images')->find($id);
    }

    public function create(array $data, array $images = [])
    {
        $track = Track::create($data);

        foreach ($images as $image) {
            $track->images()->create([
                'image' => 'storage/' . $image->store('uploads/tracks', 'public'),
            ]);
        }

        return $track->load('images');
    }

    public function update($id, array $data, array $images = [])
    {
        $track = $this->find($id);
        if (!$track) {
            return null;
        }

        $track->update($data);

        if (!empty($images)) {
            foreach ($track->images as $oldImage) {
                Storage::disk('public')->delete($oldImage->image);
            }

            $track->images()->delete();

            foreach ($images as $image) {
                $track->images()->create([
                    'image' => "storage/" . $image->store('uploads/tracks', 'public'),
                ]);
            }
        }

        return $track->load('images');
    }

    public function delete($id)
    {
        $track = $this->find($id);

        if (!$track) {
            return false;
        }

        foreach ($track->images as $image) {
            Storage::disk('public')->delete($image->image);
        }

        return $track->delete();
    }
}
