<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    use HasFactory;
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'message',
        'date',
        'total',
        'status',
        'payed',
        'payment_method',
        'is_read',
        'nb_persons'
    ];

    public function services()
    {
        return $this->belongsToMany(Service::class, 'services_requests')
                    ->withTimestamps();
    }
}
