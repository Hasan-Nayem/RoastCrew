<?php

// use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Web\Backend\CategoryController;
use App\Http\Controllers\Web\Backend\DashboardController;
use App\Http\Controllers\Web\Backend\DynamicPageController;
use App\Http\Controllers\Web\Backend\FaqController;
use App\Http\Controllers\Web\Backend\LogController;
use App\Http\Controllers\Web\Backend\Post\PostController;
use App\Http\Controllers\Web\Backend\ProductController;
use App\Http\Controllers\Web\Backend\ProfileController;
use App\Http\Controllers\Web\Backend\QueueController;
use App\Http\Controllers\Web\Backend\ReelAdAdminController;
use App\Http\Controllers\Web\Backend\ReelsAdminController;
use App\Http\Controllers\Web\Backend\ReportController;
use App\Http\Controllers\Web\Backend\SystemSettingsController;
use App\Http\Controllers\Web\Backend\TrackController;
use App\Http\Controllers\Web\Backend\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard.index');

    // User APIs controller 
    Route::get('/users', [UserController::class, 'index'])->name('admin.user.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('admin.users.create');
    Route::post('/users', [UserController::class, 'store'])->name('admin.users.store');
    Route::get('/user/edit/{id}', [UserController::class, 'edit'])->name('admin.users.edit');
    Route::get('/user/show/{id}', [UserController::class, 'show'])->name('admin.users.show');
    Route::put('/users/{id}', [UserController::class, 'update'])->name('admin.users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');
    Route::get('users/{user}/sessions', [UserController::class, 'sessions'])->name('admin.users.sessions');

    // System setting here 
    Route::get('/settings/system', [SystemSettingsController::class, 'index'])->name('admin.settings.system.index');
    Route::post('/settings/system/update', [SystemSettingsController::class, 'update'])->name('admin.settings.system.update');

    Route::get('/settings/smtp', [SystemSettingsController::class, 'smtp'])->name('admin.settings.smtp');
    Route::post('/settings/smtp/update', [SystemSettingsController::class, 'updateSmtp'])->name('admin.settings.smtp.update');
    Route::get('/settings/stripe', [SystemSettingsController::class, 'stripe'])->name('admin.settings.stripe');
    Route::post('/settings/stripe/update', [SystemSettingsController::class, 'updateStripe'])->name('admin.settings.stripe.update');

    Route::get('/settings/reels-ads', [SystemSettingsController::class, 'reelsAds'])->name('admin.settings.reels-ads');
    Route::post('/settings/reels-ads/update', [SystemSettingsController::class, 'updateReelsAds'])->name('admin.settings.reels-ads.update');

    //profile routes and controller
    Route::get('/profile', [ProfileController::class, 'index'])->name('admin.profile.index');
    Route::put('/profile', [ProfileController::class, 'update'])->name('admin.profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('admin.profile.password.update');

    //Dynamic Pages routes and controller
    Route::get('/page/{slug}', [DynamicPageController::class, 'dynamicPage'])->name('admin.page.index');
    Route::post('/page/update/{slug}', [DynamicPageController::class, 'updatePage'])->name('admin.page.update');

    //profile routes and controller
    Route::get('/faq/list', [FaqController::class, 'index'])->name('admin.faq.index');
    Route::get('/faq/create', [FaqController::class, 'create'])->name('admin.faq.create');
    Route::post('/faq/store', [FaqController::class, 'store'])->name('admin.faq.store');
    Route::get('/faq/edit/{id}', [FaqController::class, 'edit'])->name('admin.faq.edit');
    Route::post('/faq/update/{id}', [FaqController::class, 'update'])->name('admin.faq.update');
    Route::delete('/faq/delete/{id}', [FaqController::class, 'destroy'])->name('admin.faq.delete');

    //Logs controller
    Route::get('/logs', [LogController::class, 'index'])->name('admin.log.index');
    Route::delete('/logs', [LogController::class, 'clear'])->name('admin.log.clear');

    Route::get('/queues', [QueueController::class, 'index'])->name('admin.queues.index');
    Route::get('/failed-jobs', [QueueController::class, 'failed'])->name('admin.failed-jobs.index');
    Route::post('/failed-jobs/{id}/retry', [QueueController::class, 'retry'])->name('admin.failed-jobs.retry');
    Route::delete('/failed-jobs/{id}', [QueueController::class, 'destroy'])->name('admin.failed-jobs.destroy');

    // Products routes and controller
    Route::group(['prefix' => 'product'], function () {
        Route::get('/', [ProductController::class, 'index'])->name('admin.product.index');
        Route::get('/create', [ProductController::class, 'create'])->name('admin.product.create');
        Route::post('/', [ProductController::class, 'store'])->name('admin.product.store');
        Route::get('/show/{id}', [ProductController::class, 'show'])->name('admin.product.show');
        Route::get('/edit/{id}', [ProductController::class, 'edit'])->name('admin.product.edit');
        Route::put('/{id}', [ProductController::class, 'update'])->name('admin.product.update');
        Route::delete('/{id}', [ProductController::class, 'destroy'])->name('admin.product.destroy');
    });

    // Category routes and controller
    Route::prefix('category')->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('admin.category.index');
        Route::get('/create', [CategoryController::class, 'create'])->name('admin.category.create');
        Route::post('/', [CategoryController::class, 'store'])->name('admin.category.store');
        Route::get('/show/{id}', [CategoryController::class, 'show'])->name('admin.category.show');
        Route::get('/edit/{id}', [CategoryController::class, 'edit'])->name('admin.category.edit');
        Route::put('/{id}', [CategoryController::class, 'update'])->name('admin.category.update');
        Route::delete('/{id}', [CategoryController::class, 'destroy'])->name('admin.category.destroy');
    });

    // Track routes and controller
    Route::prefix('track')->group(function () {
        Route::get('/', [TrackController::class, 'index'])->name('admin.track.index');
        Route::get('/create', [TrackController::class, 'create'])->name('admin.track.create');
        Route::post('/', [TrackController::class, 'store'])->name('admin.track.store');
        Route::get('/show/{id}', [TrackController::class, 'show'])->name('admin.track.show');
        Route::get('/edit/{id}', [TrackController::class, 'edit'])->name('admin.track.edit');
        Route::put('/{id}', [TrackController::class, 'update'])->name('admin.track.update');
        Route::delete('/delete/{id}', [TrackController::class, 'destroy'])->name('admin.track.delete');
    });

    // Post CRUD routes
    Route::group(['prefix' => 'posts'], function () {
        Route::get('/', [PostController::class, 'index'])->name('admin.posts.index');
        Route::get('/show/{id}', [PostController::class, 'show'])->name('admin.posts.show');
        Route::get('/edit/{id}', [PostController::class, 'edit'])->name('admin.posts.edit');

        Route::get('/create', [PostController::class, 'create'])->name('admin.posts.create');
        Route::post('/', [PostController::class, 'store'])->name('admin.posts.store');
        // Route::get('/posts/{post}', [PostController::class, 'show'])->name('admin.posts.show');
        // Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->name('admin.posts.edit');
        Route::put('/{post}', [PostController::class, 'update'])->name('admin.posts.update');
        Route::delete('/{post}', [PostController::class, 'destroy'])->name('admin.posts.destroy');
    });

    // Reports routes
    Route::prefix('reports')->group(function () {
        Route::get('/', [ReportController::class, 'index'])->name('admin.report.index');
        Route::get('/show/{id}', [ReportController::class, 'show'])->name('admin.report.show');
        Route::get('/edit/{id}', [ReportController::class, 'edit'])->name('admin.report.edit');
        Route::put('/update/{id}', [ReportController::class, 'update'])->name('admin.report.update');
        Route::put('/toggle-active-status/{id}', [ReportController::class, 'toggleActiveStatus'])->name('admin.report.toggleStatus');
    });



    // Reels admin routes
    Route::prefix('reels')->controller(ReelsAdminController::class)->group(function () {
        Route::get('/', 'index')->name('admin.reels.index');
        Route::get('/create', 'create')->name('admin.reels.create');
        Route::get('/show/{id}', 'show')->name('admin.reels.show');
        Route::post('/store', 'store')->name('admin.reels.store');
        Route::get('/edit/{id}', 'edit')->name('admin.reels.edit');
        Route::post('/update/{id}', 'update')->name('admin.reels.update');
        Route::delete('/delete/{id}', 'destroy')->name('admin.reels.delete');
        Route::post('/bulk-delete', 'bulkDelete')->name('admin.reels.bulkDelete');
    });

    // Reel Ads routes
    Route::prefix('reel-ads')->controller(ReelAdAdminController::class)->group(function () {
        Route::get('/', 'index')->name('admin.reel-ads.index');
        Route::get('/create', 'create')->name('admin.reel-ads.create');
        Route::get('/show/{id}', 'show')->name('admin.reel-ads.show');
        Route::post('/store', 'store')->name('admin.reel-ads.store');
        Route::get('/edit/{id}', 'edit')->name('admin.reel-ads.edit');
        Route::post('/update/{id}', 'update')->name('admin.reel-ads.update');
        Route::delete('/delete/{id}', 'destroy')->name('admin.reel-ads.delete');
        Route::post('/bulk-delete', 'bulkDelete')->name('admin.reel-ads.bulkDelete');
    });
});
