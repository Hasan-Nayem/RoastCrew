<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\UserReview;

class UserReviewRepository
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function create(array $data)
    {
        return UserReview::create($data);
    }

    public function all(string $sellerId)
    {
        $seller = User::select(['id', 'first_name', 'last_name', 'avatar', 'created_at'])
            ->with(['sellerReviews.user:id,first_name,last_name,avatar', 'products:id,user_id,title,price',
                'products.images' => function ($query) {
                    $query->select(['id', 'product_id', 'image'])
                        ->limit(1);
                },
            ])
            ->withAvg('sellerReviews as avg_rating', 'rating')
            ->withCount('sellerReviews as total_reviews')
            ->findOrFail($sellerId);
        $seller->avg_rating = $seller->avg_rating ? round($seller->avg_rating, 1) : 0.0;
        // dd(gettype($seller->avg_rating));
        return $seller;
    }

    public function find(string $reviewId)
    {
        return UserReview::find($reviewId);
    }

    public function delete(string $id)
    {
        $review = $this->find($id);
        if ($review) {
            $review->delete();

            return true;
        }

        return false;
    }
}
