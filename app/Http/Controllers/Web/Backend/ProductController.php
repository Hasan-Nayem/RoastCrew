<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Models\UserReview;
use App\Services\API\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Initialize the service.
     */
    public function __construct(protected ProductService $productService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $products = Product::query()
            ->with(['user:id,first_name,last_name,email', 'images', 'category:id,name'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($request->category_id, function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $categories = Category::where('status', true)->orderBy('name')->get(['id', 'name']);

        return Inertia::render('backend/products/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::where('status', true)->orderBy('name')->get(['id', 'name']);

        return Inertia::render('backend/products/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'status' => ['nullable'],
            'images' => ['nullable', 'array', 'max:5'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:5120'],
        ]);

        $images = $request->file('images', []);
        unset($validated['images']);

        $validated['status'] = $request->boolean('status');
        $validated['user_id'] = $request->user()->id;

        $product = Product::create($validated);

        foreach ($images as $image) {
            $product->images()->create([
                'image' => $image->store('uploads/products', 'public'),
            ]);
        }

        return redirect()
            ->route('admin.product.index')
            ->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        $product = Product::with([
            'user:id,first_name,last_name,email,avatar',
            'images',
            'category:id,name,slug',
        ])->findOrFail($id);

        $allowedSorts = ['rating', 'created_at'];
        $sort = in_array($request->string('sort')->toString(), $allowedSorts, true)
            ? $request->string('sort')->toString()
            : 'created_at';
        $direction = $request->string('direction')->toString() === 'asc' ? 'asc' : 'desc';
        $perPage = in_array($request->integer('per_page'), [5, 10, 25, 50], true)
            ? $request->integer('per_page')
            : 10;

        $reviewsQuery = UserReview::query()->where('seller_id', $product->user_id);

        $reviewMetrics = [
            'total' => (clone $reviewsQuery)->count(),
            'average_rating' => round((float) (clone $reviewsQuery)->avg('rating'), 1),
            'five_star' => (clone $reviewsQuery)->where('rating', '>=', 4.5)->count(),
            'with_comments' => (clone $reviewsQuery)
                ->whereNotNull('review')
                ->where('review', '!=', '')
                ->count(),
            'distribution' => collect(range(5, 1))->mapWithKeys(fn ($rating) => [
                $rating => (clone $reviewsQuery)
                    ->where('rating', '>=', $rating - 0.5)
                    ->where('rating', '<', $rating + 0.5)
                    ->count(),
            ]),
        ];

        $reviews = $reviewsQuery
            ->with('user:id,first_name,last_name,email,avatar')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->toString();
                $query->where(function ($query) use ($search) {
                    $query->where('review', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($query) use ($search) {
                            $query->where('first_name', 'like', "%{$search}%")
                                ->orWhere('last_name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->when($request->filled('rating'), function ($query) use ($request) {
                $rating = max(1, min(5, $request->integer('rating')));
                $query->where('rating', '>=', $rating - 0.5)
                    ->where('rating', '<', $rating + 0.5);
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage, ['*'], 'reviews_page')
            ->withQueryString();

        return Inertia::render('backend/products/show', [
            'product' => $product,
            'reviews' => $reviews,
            'reviewMetrics' => $reviewMetrics,
            'filters' => [
                ...$request->only(['search', 'rating', 'per_page']),
                'sort' => $sort,
                'direction' => $direction,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $product = Product::with([
            'user:id,first_name,last_name,email',
            'images',
            'category:id,name',
        ])->findOrFail($id);

        $categories = Category::where('status', true)->orderBy('name')->get(['id', 'name']);
        $sellers = User::orderBy('first_name')
            ->orderBy('last_name')
            ->orderBy('email')
            ->get(['id', 'first_name', 'last_name', 'email']);

        return Inertia::render('backend/products/edit', [
            'product' => $product,
            'categories' => $categories,
            'sellers' => $sellers,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'user_id' => ['required', 'exists:users,id'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'status' => ['nullable'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:5120'],
            'deleted_image_ids' => ['nullable', 'array'],
            'deleted_image_ids.*' => ['integer', 'exists:product_images,id'],
        ]);

        $images = $request->file('images', []);
        $deletedImageIds = $request->input('deleted_image_ids', []);
        unset($validated['images']);
        unset($validated['deleted_image_ids']);

        $validated['status'] = $request->boolean('status');

        $this->productService->updateProductById($id, $validated, $images, $deletedImageIds);

        return redirect()
            ->route('admin.product.index')
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->productService->deleteProductById($id);

        return back()->with('success', 'Product deleted successfully.');
    }
}
