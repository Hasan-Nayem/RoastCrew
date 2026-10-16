<?php

namespace App\Services\Backend;

use App\Repositories\TrackRepository;

class TrackService
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected TrackRepository $repository)
    {
        //
    }

    public function all(){
        return $this->repository->all();
    }

    public function find(int $id){
        return $this->repository->find($id);
    }

    public function create(array $data, array $images = []){
        return $this->repository->create($data, $images);
    }

    public function update(int $id, array $data, array $images = []){
        return $this->repository->update($id, $data, $images);
    }

    public function delete(int $id){
        return $this->repository->delete($id);
    }
}
