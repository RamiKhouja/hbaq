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
        'shipping_method', 'phase'
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

    public function getAvailableActions(): array {
        if ($this->phase === 'pending') {
            if ($this->shipping_method === 'delivery') {
                if ($this->payment_method === 'credit-card') {
                    return $this->status === 'paid' ? ['assign_delivery'] : ['cancel'];
                } else if ($this->payment_method === 'cash') {
                    if ($this->status === 'pending') { 
                        return ['assign_delivery', 'cancel'];
                    } else if($this->status === 'paid') {
                        return ['complete_order'];
                    } else {
                        return ['cancel'];
                    }
                }
            }
    
            if ($this->shipping_method === 'store') {
                if ($this->payment_method === 'credit-card' && $this->status === 'paid') {
                    return ['move_to_serving'];
                } else if ($this->payment_method === 'cash' && $this->status === 'pending') {
                    return ['move_to_serving', 'cancel'];
                } else {
                    return ['cancel'];
                }
            }
        }
    
        if ($this->phase === 'serving') {
            if($this->status === 'paid') {
                return ['complete_order'];
            } else {
                return ['complete_order', 'cancel'];
            }
        }
    
        if ($this->phase === 'delivery') {
            return ['mark_delivered'];
        }
    
        return [];
    }    
}
