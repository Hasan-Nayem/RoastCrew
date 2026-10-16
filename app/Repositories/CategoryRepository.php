<?php

namespace App\Repositories;

use App\Models\Category;

class CategoryRepository
{

    public function all(){
        return Category::latest()->get();
    }

    public function find($id){
        return Category::find($id);
    }

    public function create(array $data){
        return Category::create($data);
    }

    public function update(Category $category, array $data){
        return $category->update($data);
    }

    public function delete(Category $category){
        return $category->delete();
    }
    
}

