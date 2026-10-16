<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    protected $fillable = [
        'product_id',
        'image'
    ];
    protected $hidden = [
        'updated_at',
        'created_at'
    ];
    protected $appends = [
        'url',
    ];
    public function getUrlAttribute(){
        return $this->image ? asset('storage/' . $this->image) : null;
    }
    public function product(){
        return $this->belongsTo(Product::class);
    }
}
