<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;

Route::get('/test', function () {
    return 'API OK';
});

// Get all events
Route::get('/events', [EventController::class, 'index']);

// Register for event (increment registration_count)
Route::post('/events/{event}/register', [EventController::class, 'register']);

// Leave event (decrement registration_count)
Route::post('/events/{event}/leave', [EventController::class, 'leave']);
