import EventList from "@/components/EventList";

export default function EventsPage() {
  return (
    <main className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Events</h1>
      <EventList />
    </main>
  );
}
