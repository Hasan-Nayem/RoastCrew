<?php

namespace App\Services\API;

use App\Repositories\UserReviewRepository;

class UserReviewService
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected UserReviewRepository $repository)
    {
        //
    }

    public function allSellerReview(String $sellerId)
    {
        return $this->repository->all($sellerId);
    }

    public function createSellerReview($request)
    {
        $userId = auth()->user()->id;
        $data = $request->all();
        $data['user_id'] = $userId;
        return $this->repository->create($data);
    }

    public function deleteSellerReview(String $id)
    {
        return $this->repository->delete($id);
    }
}
