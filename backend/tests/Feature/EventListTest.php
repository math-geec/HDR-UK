<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Event;

class EventListTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_lists_events()
    {
        Event::factory()->count(3)->create();

        $response = $this->getJson('/api/events');

        $response->assertStatus(200)
             ->assertJsonCount(3);
    }
}
