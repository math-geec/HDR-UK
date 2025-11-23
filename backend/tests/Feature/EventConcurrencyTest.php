<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use App\Models\Event;

class EventConcurrencyTest extends TestCase
{
    use RefreshDatabase;

    public function test_concurrent_registration()
    {
        $event = Event::factory()->create(['registration_count' => 0]);

        // Simulate two sequential transactions that would normally be concurrent.
        DB::transaction(function () use ($event) {
            $e = Event::where('id', $event->id)->lockForUpdate()->first();
            $e->registration_count++;
            $e->save();
        });

        DB::transaction(function () use ($event) {
            $e = Event::where('id', $event->id)->lockForUpdate()->first();
            $e->registration_count++;
            $e->save();
        });

        $this->assertEquals(2, $event->fresh()->registration_count);
    }
}
