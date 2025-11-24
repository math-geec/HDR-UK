<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $events = [
            ['name' => 'Business Update', 'date' => now()->addDays(3)->toDateString(), 'registration_count' => 2, 'max_registrations' => 100],
            ['name' => 'Team Lunch', 'date' => now()->addDays(7)->toDateString(), 'registration_count' => 5, 'max_registrations' => 10],
            ['name' => 'Team Fun', 'date' => now()->addDays(30)->toDateString(), 'registration_count' => 0, 'max_registrations' => 10],
        ];

        foreach ($events as $ev) {
            // Create if not exists (by name + date) to avoid duplicates on repeated seeds
            Event::firstOrCreate([
                'name' => $ev['name'],
                'date' => $ev['date'],
            ], $ev);
        }
    }
}
