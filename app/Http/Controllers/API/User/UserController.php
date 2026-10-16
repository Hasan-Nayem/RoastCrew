<?php

namespace App\Http\Controllers\API\User;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePassword;
use App\Http\Requests\UserUpdateRequest;
use App\Models\ChatMessage;
use App\Services\Auth\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Carbon\Carbon;
use Illuminate\Support\Number;
use Carbon\CarbonInterval;

class UserController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected AuthService $service
    ) {}

    private array $notificationFields = [
        'email_notifications',
        'push_notifications',
        'sms_notifications',
        'match_notifications',
        'message_notifications',
        'like_notifications',
        'marketing_notifications',
    ];

    public function profile()
    {
        $user = auth()->user()->loadCount([
            'receivedReactions as likes',
            'followers',
            'following',
        ]);

        $user->setAttribute('likes', Number::abbreviate($user->likes ?? 0));
        $user->setAttribute('followers', Number::abbreviate($user->followers_count ?? 0));
        $user->setAttribute('following', Number::abbreviate($user->following_count ?? 0));
        $user->setAttribute('unread_notification', $user->unreadNotifications()->count() > 0 ? true : false);
        $user->setAttribute('has_unread', ChatMessage::query()
            ->where('user_id', '!=', $user->id)
            ->whereNull('read_at')
            ->whereHas('chat.chatMember', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->exists());

        unset($user->followers_count, $user->following_count);

        return $this->successResponse('Profile details', $user);
    }

    public function update(UserUpdateRequest $request)
    {
        return $this->service->update(
            $request->user(),
            $request->validated()
        );
    }

    public function updatePassword(UpdatePassword $request)
    {
        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return $this->errorResponse(
                'Current password is incorrect',
                422,
                [
                    'current_password' => [
                        'Current password is incorrect',
                    ],
                ]
            );
        }

        $user->update([
            'password' => $request->password,
        ]);

        return $this->successResponse(
            'Password updated successfully'
        );
    }

    public function updateNotifications(Request $request)
    {
        $rules = collect($this->notificationFields)
            ->mapWithKeys(fn($field) => [
                $field => ['sometimes', 'required', 'boolean'],
            ])
            ->toArray();

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return $this->errorResponse(
                'Validation failed',
                422,
                $validator->errors()
            );
        }

        $data = $validator->validated();

        if (empty($data)) {
            return $this->errorResponse(
                'Please provide at least one notification setting',
                422
            );
        }

        $user = $request->user();
        $user->update($data);

        return $this->successResponse(
            'Notification settings updated successfully',
            $user->fresh()->only($this->notificationFields)
        );
    }

    public function destroy(Request $request)
    {
        return $this->service->delete($request->user());
    }

    public function recentTracks(Request $request)
    {
        // $tracks = auth()->user()->posts->sortBy('created_at');
        // $tracks->load([
        //     'track',
        //     'images' => function($q) {
        //             $q->limit(1); 
        //         }
        //     ]);
        // return $this->successResponse('Tracks fetched successfully', $tracks, 200);

        $query = auth()->user()->posts();

        $filter = $request->query('filter');

        if ($filter === 'weekly') {
            $query->where('created_at', '>=', Carbon::now()->subWeek());
        } elseif ($filter === 'monthly') {
            $query->where('created_at', '>=', Carbon::now()->subMonth());
        } elseif ($filter === 'yearly') {
            $query->where('created_at', '>=', Carbon::now()->subYear());
        }

        $tracks = $query->orderBy('created_at', 'desc')->get();

        $tracks->load([
            'images'
        ]);

        return $this->successResponse('Tracks fetched successfully', $tracks, 200);
    }

    public function recentImages()
    {
        $posts = auth()->user()->posts()->with('images')->get();
        $images = $posts->pluck('images')->flatten()->sortByDesc('created_at')->values();
        return $this->successResponse('Data found', $images, 200);
    }

    public function overview(Request $request)
    {
        $query = auth()->user()->posts();

        $filter = $request->query('filter');

        if ($filter === 'weekly') {
            $query->where('created_at', '>=', Carbon::now()->subWeek());
        } elseif ($filter === 'monthly') {
            $query->where('created_at', '>=', Carbon::now()->subMonth());
        } elseif ($filter === 'yearly') {
            $query->where('created_at', '>=', Carbon::now()->subYear());
        }

        $maxPace = (float) $query->max('pace') ?? 0;
        $data['top_speed'] = number_format($maxPace, 2) . ' Km/h';

        $totalMinutes = (int) $query->sum('duration');
        $data['total_time'] = CarbonInterval::minutes($totalMinutes)->cascade()->forHumans(['short' => false, 'parts' => 2]);

        $sumDistance = (float) $query->sum('distance') ?? 0;
        $data['total_duration'] = Number::abbreviate($sumDistance) . ' Km';

        return $this->successResponse('Overview fetched successfully', $data, 200);
    }
}
