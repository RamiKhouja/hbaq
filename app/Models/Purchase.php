<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    use HasFactory;
    protected $fillable = [
        'quantity',
        'type',
        'price'
    ];
    public function product() {
        return $this->hasOne(Product::class);
    }

}
