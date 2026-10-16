<?php

namespace App\Http\Controllers\API\Product;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Products\StoreProductRequest;
use App\Http\Requests\Products\UpdateProductRequest;
use App\Services\API\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ApiResponse;

    public function __construct(protected ProductService $productService) {}

    public function index(Request $request)
    {
        $products = $this->productService->getAllProducts($request);
        return $this->successResponse("Success", $products, 200);
    }

    public function show(String $id)
    {
        $product = $this->productService->getProductById($id);
        if (!$product) {
            return $this->errorResponse("Product not found", 404);
        }
        return $this->successResponse("Success", $product, 200);
    }

    public function myProducts()
    {
        $myProducts = $this->productService->getMyProducts();
        return $this->successResponse("Success", [
            'products' => $myProducts,
            'count' => $myProducts->count(),
        ], 200);
    }

    public function store(StoreProductRequest $request)
    {
        $product = $this->productService->store($request);
        return $this->successResponse("Product created successfully", $product, 201);
    }

    public function update(UpdateProductRequest $request, String $id)
    {
        $product = $this->productService->getProductById($id);
        if (!$product) {
            return $this->errorResponse('Product not found', 404);
        }
        $updatedProduct = $this->productService->updateProductById($id, $request->validated(), $request->file('images', []));
        return $this->successResponse('Product updated successfully', $updatedProduct);
    }

    public function destroy(String $id)
    {
        $product = $this->productService->getProductById($id);

        if (!$product) {
            return $this->errorResponse('Product not found', 404);
        }
        $this->productService->deleteProductById($id);
        return $this->successResponse('Product deleted successfully');
    }

    public function productCategory()
    {
        $category = $this->productService->getCategories();
        if (!$category) {
            return $this->errorResponse('No categoreis found', 404);
        }

        return $this->successResponse('Category found', $category, 200);
    }

    public function categorizedProduct(String $id)
    {
        $product = $this->productService->getCategorizedProduct($id);

        if (!$product) {
            return $this->errorResponse('No product found', 404);
        }

        return $this->successResponse('Product found', $product, 200);
    }
}
