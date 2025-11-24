<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;

class EventController extends Controller
{
    // Return all events as JSON
    public function index()
    {
        try {
            $events = Event::all();
            Log::info('Fetched all events', ['count' => $events->count()]);
            // Converts events to JSON and returns
            return response()->json($events);
        } catch (\Exception $e) {
            Log::error('Failed to fetch events', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to fetch events'], 500);
        }
    }

    // Register (increase count) for an event
    public function register(Request $request, Event $event)
    {
        Log::info('EventController@register called', ['event_id' => $event->id]);

        try {
            // Wrap in DB transaction for concurrency safety
            return DB::transaction(function () use ($event) {
                // Lock the event row in the database to safely increment
                $e = Event::where('id', $event->id)->lockForUpdate()->first();

                if (!$e) {
                    Log::warning('Register: event not found', ['event_id' => $event->id]);
                    return response()->json(['error' => 'Event not found'], 404);
                }

                // If max registrations is set and we're at capacity, reject
                if ($e->max_registrations && $e->registration_count >= $e->max_registrations) {
                    // Return a 400 error if event is full
                    Log::info('Register: event full', ['event_id' => $event->id, 'count' => $e->registration_count, 'max' => $e->max_registrations]);
                    return response()->json(['error' => 'Event full'], 400);
                }

                // Otherwise, increment the registration count by 1
                $old = $e->registration_count;
                $e->registration_count += 1;

                // Save the updated event back to database
                $e->save();

                Log::info('Register: incremented registration_count', ['event_id' => $e->id, 'old' => $old, 'new' => $e->registration_count]);

                // Return the updated event info as JSON
                return response()->json($e);
            });
        } catch (\Throwable $t) {
            Log::error('Register failed', ['event_id' => $event->id, 'message' => $t->getMessage()]);
            return response()->json(['error' => 'Could not register'], 500);
        }
    }

    // Leave (decrease count) for an event
    public function leave(Request $request, Event $event)
    {
        Log::info('EventController@leave called', ['event_id' => $event->id]);

        try {
            // Use a DB transaction for concurrency safety
            return DB::transaction(function () use ($event) {
                // Lock the event row in the database to safely decrement
                $e = Event::where('id', $event->id)->lockForUpdate()->first();

                if (!$e) {
                    Log::warning('Leave: event not found', ['event_id' => $event->id]);
                    return response()->json(['error' => 'Event not found'], 404);
                }

                // If there's nobody registered, can't decrement below zero
                if ($e->registration_count <= 0) {
                    // Return error if already at 0
                    Log::info('Leave: no registrations to remove', ['event_id' => $event->id]);
                    return response()->json(['error' => 'No registrations'], 400);
                }

                // Otherwise, decrement registration count by 1
                $old = $e->registration_count;
                $e->registration_count -= 1;

                // Save the updated event to the database
                $e->save();

                Log::info('Leave: decremented registration_count', ['event_id' => $e->id, 'old' => $old, 'new' => $e->registration_count]);

                // Return updated event as JSON
                return response()->json($e);
            });
        } catch (\Throwable $t) {
            Log::error('Leave failed', ['event_id' => $event->id, 'message' => $t->getMessage()]);
            return response()->json(['error' => 'Could not leave event'], 500);
        }
    }
}