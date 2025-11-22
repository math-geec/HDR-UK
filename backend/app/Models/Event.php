<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'name',
        'date',
        'registration_count',
        'max_registrations',
    ];

    protected $casts = [
        'date' => 'date',
        'registration_count' => 'integer',
        'max_registrations' => 'integer',
    ];
}
