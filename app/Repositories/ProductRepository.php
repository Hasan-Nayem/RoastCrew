<?php

namespace App\Repositories;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Models\UserBlock;
use Illuminate\Support\Facades\Storage;

class ProductRepository
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function all(?string $search, int $userId)
    {
        $blockedUserIds = UserBlock::query()->select('blocked_user_id')->where('user_id', $userId);
        $blockingUserIds = UserBlock::query()->select('user_id')->where('blocked_user_id', $userId);

        return Product::with('user:id,first_name,last_name,avatar,created_at', 'images', 'category')
            ->when($search, function ($query, $search) {
                $query->where(function ($searchQuery) use ($search) {
                    $searchQuery->where('title', 'like', '%' . $search . '%')
                        ->orWhere('description', 'like', '%' . $search . '%');
                });
            })
            ->where('user_id', '!=', $userId)
            ->whereNotIn('user_id', $blockedUserIds)
            ->whereNotIn('user_id', $blockingUserIds)
            ->latest()
            ->get();
    }

    public function findById(String $id){
        return Product::with('user:id,first_name,last_name,avatar,created_at', 'images', 'category')->find($id);
    }

    public function myProducts(String $id){
        $user = User::find($id);
        return $user->products->load(['images']);
    }

    public function store(Array $data, $images = []){
        $product = Product::create($data);
        if($images){
            foreach($images as $image){
                $path = $image->store('uploads/products', 'public');
                $product->images()->create(['image' => $path]); 
            }
        }
        return $product->load('images', 'user', 'category');
    }


public function update(string $id, array $data, array $images = [], array $deletedImageIds = [])
{
    $product = $this->findById($id);
    if (!$product) {
        return null;
    }

    $product->update($data);

    if (!empty($deletedImageIds)) {
        $imagesToDelete = $product->images()->whereIn('id', $deletedImageIds)->get();
        foreach ($imagesToDelete as $oldImage) {
            Storage::disk('public')->delete($oldImage->image);
        }
        $product->images()->whereIn('id', $deletedImageIds)->delete();
    }

    if (!empty($images)) {
        foreach ($images as $image) {
            $path = $image->store('uploads/products', 'public');
            $product->images()->create(['image' => $path]);
        }
    }
    return $product->load('images', 'user:id,first_name,last_name,created_at');
}

    public function delete(string $id): bool
    {
        $product = $this->findById($id);

        if (!$product) {
            return false;
        }

        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image);
        }

        return (bool) $product->delete();
    }

    public function category(){
        $category = Category::where('status', true)->latest()->get(); 
        if (!$category) {
            return false;
        }
        return $category;
    }

    public function findByCategory(String $id){
        $product = Category::with('products.images')->find($id);
        if (!$product) {
            return false;
        }
        return $product;
    }

}
