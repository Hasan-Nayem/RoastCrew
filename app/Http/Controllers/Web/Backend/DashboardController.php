<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use App\Models\PostReaction;
use App\Models\Product;
use App\Models\Reel;
use App\Models\ReelComment;
use App\Models\ReelLike;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function home(Request $request)
    {
        return redirect()->route('admin.dashboard.index');
    }

    public function index(Request $request)
    {
        $now = now();
        $currentYear = $now->year;
        $years = range($currentYear, $currentYear - 6);

        $postInteractions = $this->monthlyCounts(PostReaction::query(), $currentYear);
        $postComments = $this->monthlyCounts(Comment::query(), $currentYear);
        $reelInteractions = $this->monthlyCounts(ReelLike::query(), $currentYear);
        $reelComments = $this->monthlyCounts(ReelComment::query(), $currentYear);

        $postInteractionTotals = array_map(
            fn (int $likes, int $comments): int => $likes + $comments,
            $postInteractions,
            $postComments,
        );
        $reelInteractionTotals = array_map(
            fn (int $likes, int $comments): int => $likes + $comments,
            $reelInteractions,
            $reelComments,
        );

        $currentMonthInteractions = $this->interactionCountForMonth($now);
        $previousMonthInteractions = $this->interactionCountForMonth($now->copy()->subMonth());

        $topLikedPosts = Post::query()
            ->with(['user:id,first_name,last_name,user_name', 'latestImage'])
            ->withCount('reactions')
            ->orderByDesc('reactions_count')
            ->latest('id')
            ->paginate(5, ['id', 'user_id', 'title'], 'posts_page')
            ->withQueryString();

        $topLikedReels = Reel::query()
            ->with('user:id,first_name,last_name,user_name')
            ->withCount('reelLikes')
            ->orderByDesc('reel_likes_count')
            ->latest('id')
            ->paginate(5, ['id', 'user_id', 'caption', 'thumbnail'], 'reels_page')
            ->withQueryString();

        return Inertia::render('backend/dashboard/index', [
            'totals' => [
                'posts' => Post::count(),
                'reels' => Reel::count(),
                'products' => Product::count(),
            ],
            'weeklyTrends' => [
                'posts' => $this->weeklyTrend(Post::query(), $now),
                'reels' => $this->weeklyTrend(Reel::query(), $now),
                'products' => $this->weeklyTrend(Product::query(), $now),
            ],
            'userGrowth' => [
                'year' => $currentYear,
                'data' => $this->monthlyCounts(User::query(), $currentYear),
            ],
            'contentVolume' => [
                'years' => $years,
                'posts' => $this->yearlyCounts(Post::query(), $years),
                'reels' => $this->yearlyCounts(Reel::query(), $years),
            ],
            'interactions' => [
                'posts' => $postInteractionTotals,
                'reels' => $reelInteractionTotals,
                'trend' => $this->percentageChange($currentMonthInteractions, $previousMonthInteractions),
            ],
            'topLikedPosts' => $topLikedPosts,
            'topLikedReels' => $topLikedReels,
        ]);
    }

    private function monthlyCounts(Builder $query, int $year): array
    {
        $monthExpression = DB::getDriverName() === 'sqlite'
            ? "CAST(strftime('%m', created_at) AS INTEGER)"
            : 'MONTH(created_at)';

        $counts = $query
            ->whereYear('created_at', $year)
            ->selectRaw("{$monthExpression} as month, COUNT(*) as aggregate")
            ->groupByRaw($monthExpression)
            ->pluck('aggregate', 'month');

        return array_map(
            fn (int $month): int => (int) ($counts[$month] ?? 0),
            range(1, 12),
        );
    }

    private function yearlyCounts(Builder $query, array $years): array
    {
        $yearExpression = DB::getDriverName() === 'sqlite'
            ? "CAST(strftime('%Y', created_at) AS INTEGER)"
            : 'YEAR(created_at)';

        $counts = $query
            ->whereBetween('created_at', [Carbon::create(min($years), 1, 1), now()])
            ->selectRaw("{$yearExpression} as year, COUNT(*) as aggregate")
            ->groupByRaw($yearExpression)
            ->pluck('aggregate', 'year');

        return array_map(
            fn (int $year): int => (int) ($counts[$year] ?? 0),
            $years,
        );
    }

    private function weeklyTrend(Builder $query, CarbonInterface $now): float
    {
        $current = (clone $query)->whereBetween('created_at', [
            $now->copy()->subDays(6)->startOfDay(),
            $now,
        ])->count();
        $previous = (clone $query)->whereBetween('created_at', [
            $now->copy()->subDays(13)->startOfDay(),
            $now->copy()->subDays(7)->endOfDay(),
        ])->count();

        return $this->percentageChange($current, $previous);
    }

    private function interactionCountForMonth(CarbonInterface $month): int
    {
        return collect([
            PostReaction::query(),
            Comment::query(),
            ReelLike::query(),
            ReelComment::query(),
        ])->sum(fn (Builder $query): int => $query
            ->whereBetween('created_at', [
                $month->copy()->startOfMonth(),
                $month->copy()->endOfMonth(),
            ])
            ->count());
    }

    private function percentageChange(int $current, int $previous): float
    {
        if ($previous === 0) {
            return $current === 0 ? 0 : 100;
        }

        return round((($current - $previous) / $previous) * 100, 2);
    }
}
