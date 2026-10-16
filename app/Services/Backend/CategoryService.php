<?php

namespace App\Services\Backend;
use App\Models\Category;
use App\Repositories\CategoryRepository;
class CategoryService
{
    public function __construct(protected CategoryRepository $repository){}

    public function all(){
        return $this->repository->all();
    }

    public function find($id){
        return $this->repository->find($id);
    }

    public function create(array $data){
        $category = $this->repository->create($data);
        if($category){
            return [
                'success' => true,
                'message' => 'Category created successfully',
                'data' => $category,
            ];
        }
        return [
            'success' => false,
            'message' => 'Failed to create category',
            'data' => null,
        ];
    }

    public function update(Category $category, array $data){
        $updatedCategory = $this->repository->update($category, $data);
        if($updatedCategory){
            return [
                'success' => true,
                'message' => 'Category updated successfully',
                'data' => $updatedCategory,
            ];
        }
        return [
            'success' => false,
            'message' => 'Failed to update category',
            'data' => null,
        ];
    }

    public function delete(Category $category){
        $deletedCategory = $this->repository->delete($category);
        if($deletedCategory){
                return [
                    'success' => true,
                    'message' => 'Category deleted successfully',
                ];
        }
        return [
            'success' => false,
            'message' => 'Failed to delete category',
        ];
    }
}
