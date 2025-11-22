<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class EventController extends Controller
{
    // Return all events as JSON
    public function index()
    {
        // Get all events from database as array
        return response()->json(Event::all()); // Converts events to JSON and returns
    }

    // Register (increase count) for an event
    public function register(Request $request, Event $event)
    {
        // Wrap in DB transaction for concurrency safety
        return DB::transaction(function () use ($event) {
            // Lock the event row in the database to safely increment
            $event = Event::where('id', $event->id)->lockForUpdate()->first();

            // If max registrations is set and we're at capacity, reject
            if ($event->max_registrations && $event->registration_count >= $event->max_registrations) {
                // Return a 400 error if event is full
                return response()->json(['error' => 'Event full'], 400);
            }

            // Otherwise, increment the registration count by 1
            $event->registration_count += 1;

            // Save the updated event back to database
            $event->save();

            // Return the updated event info as JSON
            return response()->json($event);
        });
    }

    // Leave (decrease count) for an event
    public function leave(Request $request, Event $event)
    {
        // Use a DB transaction for concurrency safety
        return DB::transaction(function () use ($event) {
            // Lock the event row in the database to safely decrement
            $event = Event::where('id', $event->id)->lockForUpdate()->first();

            // If there's nobody registered, can't decrement below zero
            if ($event->registration_count <= 0) {
                // Return error if already at 0
                return response()->json(['error' => 'No registrations'], 400);
            }

            // Otherwise, decrement registration count by 1
            $event->registration_count -= 1;

            // Save the updated event to the database
            $event->save();

            // Return updated event as JSON
            return response()->json($event);
        });
    }
}