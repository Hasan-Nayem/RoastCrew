<?php

namespace Tests\Feature;

use App\Models\Follow;
use App\Models\User;
use App\Repositories\FollowRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FollowRepositorySearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_followers_can_be_filtered_by_name_search(): void
    {
        $user = User::factory()->create();
        $matchingFollower = User::factory()->create([
            'first_name' => 'Alice',
            'last_name' => 'Johnson',
        ]);
        $nonMatchingFollower = User::factory()->create([
            'first_name' => 'Bob',
            'last_name' => 'Smith',
        ]);

        Follow::create([
            'leader_id' => $user->id,
            'follower_id' => $matchingFollower->id,
        ]);
        Follow::create([
            'leader_id' => $user->id,
            'follower_id' => $nonMatchingFollower->id,
        ]);

        $repository = new FollowRepository;
        $result = $repository->getFollowersList((string) $user->id, 'Alice', 10);

        $this->assertTrue($result->contains('id', $matchingFollower->id));
        $this->assertFalse($result->contains('id', $nonMatchingFollower->id));
    }

    public function test_following_can_be_filtered_by_name_search(): void
    {
        $user = User::factory()->create();
        $matchingFollowing = User::factory()->create([
            'first_name' => 'Carol',
            'last_name' => 'Davis',
        ]);
        $nonMatchingFollowing = User::factory()->create([
            'first_name' => 'Eve',
            'last_name' => 'Brown',
        ]);

        Follow::create([
            'leader_id' => $matchingFollowing->id,
            'follower_id' => $user->id,
        ]);
        Follow::create([
            'leader_id' => $nonMatchingFollowing->id,
            'follower_id' => $user->id,
        ]);

        $repository = new FollowRepository;
        $result = $repository->getFollowingList((string) $user->id, 'Carol', 10);

        $this->assertTrue($result->contains('id', $matchingFollowing->id));
        $this->assertFalse($result->contains('id', $nonMatchingFollowing->id));
    }

    public function test_follower_list_includes_mutual_relationship_status(): void
    {
        $user = User::factory()->create();
        $follower = User::factory()->create();

        Follow::create([
            'leader_id' => $user->id,
            'follower_id' => $follower->id,
        ]);
        Follow::create([
            'leader_id' => $follower->id,
            'follower_id' => $user->id,
        ]);

        $result = (new FollowRepository)->getFollowersList((string) $user->id, null, 10);
        $listedFollower = $result->getCollection()->firstWhere('id', $follower->id);

        $this->assertNotNull($listedFollower);
        $this->assertTrue($listedFollower->is_following);
        $this->assertTrue($listedFollower->is_followed_by);
        $this->assertTrue($listedFollower->is_mutual);
    }

    public function test_follower_list_marks_a_one_way_follow_as_follow_back_available(): void
    {
        $user = User::factory()->create();
        $follower = User::factory()->create();

        Follow::create([
            'leader_id' => $user->id,
            'follower_id' => $follower->id,
        ]);

        $result = (new FollowRepository)->getFollowersList((string) $user->id, null, 10);
        $listedFollower = $result->getCollection()->firstWhere('id', $follower->id);

        $this->assertNotNull($listedFollower);
        $this->assertFalse($listedFollower->is_following);
        $this->assertTrue($listedFollower->is_followed_by);
        $this->assertFalse($listedFollower->is_mutual);
    }
}
