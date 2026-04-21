<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id', 'in_stock', 'qty',
        'unit', 'qty_set', 'min_qty', 'warehouse'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
