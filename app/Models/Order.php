<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    use HasFactory;
    protected $fillable = [
        'user_id', 'total', 'subTotal', 'status', 'delivery', 'purchases',
        'payment_method', 'message', 'cutlery', 'deliveryman_id', 'profile_id',
        'shipping_method', 'phase', 'language'
    ];
    protected $cast =[
        "purchases" =>'array'
    ];
    public function user() {
        return $this->belongsTo(User::class);
    }
    public function deliveryman()
    {
        return $this->belongsTo(User::class, 'deliveryman_id');
    }
    public function profile() {
        return $this->belongsTo(Profile::class);
    }

    public function getAvailableActions(): array
    {
        return match ($this->status) {
            'pending' => ['preparing', 'cancel'],
            'preparing' => $this->shipping_method === 'delivery'
                ? ['delivering', 'cancel']
                : ['done', 'cancel'],
            'delivering' => ['done', 'cancel'],
            'cancel' => ['close'],
            default => [],
        };
    }
}
