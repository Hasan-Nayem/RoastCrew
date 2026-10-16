<?php

namespace App\Services\API;

use App\Models\Category;
use App\Models\ChatMessage;
use App\Models\Product;
use App\Models\UserReview;
use App\Repositories\ProductRepository;

class ProductService
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected ProductRepository $productRepository) {}

    public function getAllProducts($request)
    {
        $query = $request->query('search');
        $userId = auth()->user()->id;

        return $this->productRepository->all($query, $userId);
    }

    public function getProductById(string $id)
    {
        $authUserId = auth()->user()->id;
        $data = $this->productRepository->findById($id);
        if ($data) {

            $hasMessages = ChatMessage::whereHas('chat', function ($query) use ($id, $authUserId) {
                $query->where('product_id', $id)
                    ->whereHas('chatMember', function ($q) use ($authUserId) {
                        $q->where('user_id', $authUserId);
                    });
            })->count() > 10;

            $hasReviewd = UserReview::where('user_id', $authUserId)->where('seller_id', $data->user_id)->exists();
            if ($hasMessages && ! $hasReviewd) {
                $data->can_review = true;
            } else {
                $data->can_review = false;
            }

            $data->avg_rating = UserReview::where('seller_id', $data->user_id)->avg('rating');
            $data->total_rating = UserReview::where('seller_id', $data->user_id)->count();

        }

        return $data;
    }

    public function getMyProducts()
    {
        $userId = auth()->user()->id;

        return $this->productRepository->myProducts($userId);
    }

    public function store($request)
    {
        $product = $request->validated();
        $product['user_id'] = auth()->user()->id;

        return $this->productRepository->store($product, $request->file('images', []));
    }

    public function updateProductById(string $id, array $data, array $images = [], array $deletedImageIds = [])
    {
        return $this->productRepository->update($id, $data, $images, $deletedImageIds);
    }

    public function deleteProductById(string $id): bool
    {
        return $this->productRepository->delete($id);
    }

    public function getCategories()
    {
        return $this->productRepository->category();
    }

    public function getCategorizedProduct(string $id): Category|array
    {
        return $this->productRepository->findByCategory($id);
    }
}
