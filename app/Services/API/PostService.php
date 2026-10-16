<?php

namespace App\Services\API;

use App\Repositories\PostRepository;

class PostService
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected PostRepository $repository)
    {
        //
    }

    public function getPosts()
    {
        $userID = auth()->user()->id;
        $posts = $this->repository->all($userID);
        return $posts;
    }

    public function getPostById(String $id)
    {
        return $this->repository->findById($id);
    }

    public function myPost($paginate, $serarch)
    {
        $post = $this->repository->userPost($paginate, $serarch);
        return $post;
    }

    public function create($request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();

        return $this->repository->create(
            $data,
            $request->file('images', []),
            $request->lat ?? [],
            $request->lon ?? []
        );
    }

    public function update(String $id, array $data, $images = [])
    {
        return $this->repository->update($id, $data, $images);
    }

    public function delete(String $id): bool
    {
        return $this->repository->delete($id);
    }

    public function toggleReaction(String $postId)
    {
        $user_id = auth()->user()->id;

        return $this->repository->existingReaction($user_id, $postId);
    }
}
