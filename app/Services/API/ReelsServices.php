<?php

namespace App\Services\API;

use App\Concerns\ApiResponse;
use App\Http\Requests\Reels\StoreReelRequest;
use App\Http\Requests\Reels\UpdateReelRequest;
use App\Models\Credential;
use App\Models\ReelAd;
use App\Models\ReelComment;
use App\Repositories\ReelsRepositories;
use App\Services\Reels\MuxVideoService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ReelsServices
{
    protected ReelsRepositories $reelsRepo;

    public $mux;

    public $authId;

    use ApiResponse;


    public function __construct(ReelsRepositories $reelsRepo, MuxVideoService $mux)
    {
        $this->reelsRepo = $reelsRepo;
        $this->mux = $mux;
        $this->authId = Auth::id();
    }

    public function list(array $data)
    {
        // Rename variable to $reels to avoid confusing it with the incoming input array $data
        $reels = $this->reelsRepo->list(
            $data['order'] ?? 'latest'
        );

        // Inject ads based on admin settings
        $conditionType = Credential::getValue('reels_ad', 'condition_type', 'disabled');

        if ($conditionType !== 'disabled') {
            $ad = ReelAd::where('status', true)->inRandomOrder()->first();

            if ($ad) {
                // Determine the injection interval
                if ($conditionType === 'static') {
                    $frequency = (int) Credential::getValue('reels_ad', 'static_frequency', 5);
                } else {
                    // random
                    $min = (int) Credential::getValue('reels_ad', 'random_min', 3);
                    $max = (int) Credential::getValue('reels_ad', 'random_max', 7);
                    $frequency = rand($min, $max);
                }

                // FIXED: Directly use $reels since it is already an Eloquent Collection
                $result = collect();
                $counter = 0;

                foreach ($reels as $reel) {
                    // Set type as a dynamic property — model stays an Eloquent object
                    $reel->type = 'reel';
                    $result->push($reel);
                    $counter++;

                    if ($counter % $frequency === 0) {
                        $adClone = clone $ad;
                        $adClone->type = 'ad';
                        $result->push($adClone);

                        // Pick a fresh random ad for the next slot
                        $ad = ReelAd::where('status', true)->inRandomOrder()->first() ?? $ad;
                    }
                }

                return $result;
            } else {
                return $reels->each(function ($reel) {
                    $reel->type = 'reel';
                });
            }
        } else {
            return $reels->each(function ($reel) {
                $reel->type = 'reel';
            });
        }
    }

    public function mylist(array $data)
    {
        $paginator = $this->reelsRepo->mylist(
            $data['order'] ?? 'latest',
            $data['items'] ?? 10
        );

        // Tag all items with type=reel for API consistency
        $paginator->setCollection(
            collect($paginator->items())->each(function ($reel) {
                $reel->type = 'reel';
            })
        );

        return $paginator;
    }

    public function show($id)
    {
        return $this->reelsRepo->findById((int) $id);
    }

    public function store(StoreReelRequest $request)
    {
        $userId = $this->authId;
        // Store In Mux Video Storage
        $muxFile = $this->mux->upload($request->file('video'));

        // Find the #(Hash) tag.
        preg_match_all('/#([\p{L}\p{N}_]+)/u', $request->caption ?? '', $matches);
        $hashtags = array_values(array_unique($matches[1]));
        $data = [
            'user_id' => $userId,
            'asset_id' => $muxFile['asset_id'] ?? null,
            'video' => $muxFile['video_url'],
            'thumbnail' => $muxFile['thumbnail'],
            'caption' => $request->caption,
            'hashtags' => $hashtags ?? [],
            'status' => $request->status ?? true,
        ];

        return $this->reelsRepo->create($data);
    }

    public function update($id, UpdateReelRequest $request)
    {
        $reel = $this->reelsRepo->findById((int) $id);
        if (! $reel) {
            return null;
        }
        // Only the owner can update
        if ($reel->user_id !== $this->authId) {
            abort(403, 'Unauthorized.');
        }
        $data = $request->only(['caption', 'hashtags', 'status']);

        return $this->reelsRepo->update((int) $id, $data);
    }

    public function delete($id): bool
    {
        $reel = $this->reelsRepo->findById((int) $id);

        if (! $reel) {
            return false;
        }

        $user = Auth::user();

        if (
            $reel->user_id !== $user->id &&
            $user->role !== 'admin'
        ) {
            abort(403, 'Unauthorized.');
        }

        $this->mux->delete($reel->asset_id);

        return $this->reelsRepo->delete((int) $id);
    }

    public function toggleLike($reelId): ?array
    {
        return $this->reelsRepo->toggleLike($this->authId, (int) $reelId);
    }

    public function addComment($reelId, array $data): mixed
    {
        return $this->reelsRepo->addComment(
            (int) $reelId,
            $this->authId,
            $data['comment']
        );
    }

    public function getComments($reelId)
    {
        return $this->reelsRepo->getComments((int) $reelId);
    }

    public function deleteComment($reelId, $commentId): bool
    {
        return $this->reelsRepo->deleteComment(
            (int) $reelId,
            (int) $commentId,
            $this->authId
        );
    }

    public function incrementView($reelId)
    {
        return $this->reelsRepo->incrementView((int) $reelId);
    }

    public function incrementShare($reelId)
    {
        return $this->reelsRepo->incrementShare((int) $reelId);
    }

    public function updateComment($request, $reelId, $commentId)
    {
        $comment = ReelComment::where('reel_id', $reelId)
            ->where('id', $commentId)
            ->first();

        if (! $comment) {
            return null;
        }

        $comment->update([
            'comment' => $request->comment,
        ]);

        return $comment->fresh();
    }
}
