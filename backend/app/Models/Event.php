<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory; 

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
