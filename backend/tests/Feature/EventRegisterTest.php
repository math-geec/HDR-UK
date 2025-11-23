<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Event;

class EventRegisterTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_increments_registration_count()
    {
        $event = Event::factory()->create(['registration_count' => 1]);

        $response = $this->postJson("/api/events/{$event->id}/register");

        $response->assertStatus(200)
             ->assertJson(['registration_count' => 2]);

        $this->assertEquals(2, $event->fresh()->registration_count);
    }
}
