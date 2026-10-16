<?php

namespace App\Http\Resources\Reels;

use App\Models\Follow;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReelUserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $authId = auth()->id();
        return [
            'id'         => $this->id,
            'name'       => trim("{$this->first_name} {$this->last_name}"),
            'first_name' => $this->first_name,
            'last_name'  => $this->last_name,
            'avatar'     => $this->avatar,
            'avatar'     => $this->avatar,
            'is_following' => auth()->check()
                ? Follow::where('leader_id', $this->id)
                ->where('follower_id', auth()->id())
                ->exists()
                : false,
        ];
    }
}
