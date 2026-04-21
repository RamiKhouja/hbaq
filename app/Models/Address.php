<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;
    protected $fillable = ['country','address_1','address_2','zip','city','state','type','user_id'];

    function user() {
        return $this->belongsTo(User::class, 'user_id');

    }


}
