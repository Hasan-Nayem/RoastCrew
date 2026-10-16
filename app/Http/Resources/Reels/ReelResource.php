<?php

namespace App\Http\Resources\Reels;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReelResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'type'          => $this->type ?? 'reel',
            'caption'       => $this->type == 'reel' ? $this->caption: $this->title,
            'hashtags'      => $this->hashtags ?? [],
            'video_url'     => $this->video_url,
            'thumbnail_url' => $this->thumbnail_url,
            'status'        => $this->status,
            'views'         => (int) $this->views,
            'likes'         => (int) $this->likes,
            'comments'      => (int) $this->comments,
            'shares'        => (int) $this->shares,
            'is_liked'      => $this->whenLoaded('reelLikes', function () use ($request) {
                return $this->reelLikes
                    ->where('user_id', $request->user()?->id)
                    ->isNotEmpty();
            }, false),
            'is_mine'       => $request->user()
                ? $this->user_id === $request->user()->id
                : false,
            'user'        => new ReelUserResource($this->whenLoaded('user')),
            'reel_comments' => ReelCommentResource::collection(
                $this->whenLoaded('reelComments')
            ),
            'created_at'  => $this->created_at?->toISOString(),
            'updated_at'  => $this->updated_at?->toISOString(),
        ];
    }
}
