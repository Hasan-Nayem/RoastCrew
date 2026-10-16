<?php

namespace App\Http\Resources\Reels;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReelCommentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'reel_id'    => $this->reel_id,
            'comment'    => $this->comment,
            'user'       => new ReelUserResource($this->whenLoaded('user')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
