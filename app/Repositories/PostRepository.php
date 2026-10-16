<?php

namespace App\Repositories;

use App\Models\Post;
use App\Models\PostImage;
use App\Models\PostLocation;
use App\Models\UserBlock;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PostRepository
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function all($userID)
    {
        $blockedUserIds = UserBlock::query()->select('blocked_user_id')->where('user_id', $userID);

        $blockingUserIds = UserBlock::query()->select('user_id')->where('blocked_user_id', $userID);

        $data = Post::where('is_published', true)
            ->whereNotIn('user_id', $blockedUserIds)
            ->whereNotIn('user_id', $blockingUserIds)
            ->with([
                'images',
                'user:id,first_name,last_name,avatar',
                'locations'
            ])->latest()->get();
        return $data;
    }

    public function findById($id)
    {
        $data = Post::with([
            'locations',
            'images',
            'user:id,first_name,last_name,avatar',
            'locations'
        ])->find($id);
        return $data;
    }

    public function userPost(int $paginate = 10, ?string $search = null)
    {
        return auth()->user()
            ->posts()
            ->with(['images', 'locations'])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('descriptions', 'like', "%{$search}%")
                        ->orWhere('address', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($paginate);
    }

    public function create($data, $images = [], $latitudes = [], $longitudes = [])
    {
        return DB::transaction(function () use ($data, $images, $latitudes, $longitudes) {


            if (!empty($latitudes) && !empty($longitudes)) {
                $data['start_latitude']  = $latitudes[0];
                $data['start_longitude'] = $longitudes[0];

                $lastIndex = min(count($latitudes), count($longitudes)) - 1;

                $data['end_latitude']    = $latitudes[$lastIndex];
                $data['end_longitude']   = $longitudes[$lastIndex];
            }

            // Remove arrays before creating post
            unset($data['lat'], $data['lon'], $data['images']);

            $post = Post::create($data);
            // Save Images
            foreach ($images as $image) {
                $path = $image->store('posts', 'public');
                PostImage::create([
                    'post_id' => $post->id,
                    'image'   => 'storage/' . $path,
                ]);
            }

            // Save Route Points
            foreach ($latitudes as $index => $latitude) {

                if (!isset($longitudes[$index])) {
                    continue;
                }

                PostLocation::create([
                    'post_id'     => $post->id,
                    'point_order' => $index + 1,
                    'latitude'    => $latitude,
                    'longitude'   => $longitudes[$index],
                ]);
            }

            return $post->load(['images', 'locations']);
        });
    }

    public function update(string $id, array $data, $images = [])
    {
        $post = $this->findById($id);

        if (!$post) {
            return null;
        }

        $existingImageIds = [];

        if (!empty($data['existing_images'])) {
            foreach ($data['existing_images'] as $image) {
                if (isset($image['id'])) {
                    $existingImageIds[] = (int) $image['id'];
                }
            }
        }

        unset($data['existing_images']);

        $post->update($data);

        if (!empty($existingImageIds)) {

            foreach ($post->images as $oldImage) {

                if (!in_array($oldImage->id, $existingImageIds)) {

                    Storage::disk('public')->delete(
                        str_replace('storage/', '', $oldImage->image)
                    );

                    $oldImage->delete();
                }
            }
        } elseif (!empty($images)) {

            foreach ($post->images as $oldImage) {

                Storage::disk('public')->delete(
                    str_replace('storage/', '', $oldImage->image)
                );

                $oldImage->delete();
            }
        }

        foreach ($images as $image) {

            $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

            $path = $image->storeAs('uploads/post', $filename, 'public');

            $post->images()->create([
                'image' => 'storage/' . $path
            ]);
        }

        return $post->load(['locations', 'images']);
    }

    public function delete(string $id): bool
    {
        $post = $this->findById($id);

        if (!$post) {
            return false;
        }

        foreach ($post->images as $image) {
            Storage::disk('public')->delete($image->image);
        }

        return (bool) $post->delete();
    }

    public function existingReaction(String $userId, $postId) {}
}
