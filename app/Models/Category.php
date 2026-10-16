<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    protected $appends = [
        'product_count', 'url'
    ];

    public function getUrlAttribute(){
        return $this->image ? asset($this->image): null;
    }
    
    public function getProductCountAttribute(){
        return $this->products()->count();
    }

    public function products(){
        return $this->hasMany(Product::class);
    }
}
