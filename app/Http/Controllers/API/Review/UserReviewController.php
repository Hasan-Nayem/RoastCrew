<?php

namespace App\Http\Controllers\API\Review;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserReview\StoreUserReviewRequest;
use App\Services\API\UserReviewService;

class UserReviewController extends Controller
{
    use ApiResponse;

    public function __construct(protected UserReviewService $service) {}

    public function index(String $sellerId)
    {
        $data = $this->service->allSellerReview($sellerId);
        if (! $data) {
            return $this->errorResponse();
        }

        return $this->successResponse('Seller review fetched successfully', $data, 200);
    }

    public function store(StoreUserReviewRequest $request)
    {
        $data = $this->service->createSellerReview($request);
        if (! $data) {
            return $this->errorResponse();
        }

        return $this->successResponse('Seller review added', $data, 200);
    }

    public function destroy(string $id)
    {
        $data = $this->service->deleteSellerReview($id);

        if (! $data) {
            return $this->errorResponse();
        }

        return $this->successResponse('Review deleted successfully');
    }
}
