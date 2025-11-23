<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Event;

class EventLeaveTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_decrements_registration_count()
    {
        $event = Event::factory()->create(['registration_count' => 2]);

        $response = $this->postJson("/api/events/{$event->id}/leave");

        $response->assertStatus(200)
             ->assertJson(['registration_count' => 1]);

        $this->assertEquals(1, $event->fresh()->registration_count);
    }

    public function test_it_does_not_decrement_below_zero()
    {
        $event = Event::factory()->create(['registration_count' => 0]);

        $response = $this->postJson("/api/events/{$event->id}/leave");

        // Controller returns 400 when attempting to leave with zero registrations
        $response->assertStatus(400);

        $this->assertEquals(0, $event->fresh()->registration_count);
    }
}
