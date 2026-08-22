<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HbaqSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_name',
        'fiscal_number',
        'logo',
        'signature',
        'stamp',
        'address',
        'phone',
        'email',
        'rib',
        'vat_rate',
    ];

    protected $casts = [
        'vat_rate' => 'decimal:2',
    ];
}
