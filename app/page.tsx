"use client";

import { useRouter } from "next/navigation";
import { Gift, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#0B1221] text-white flex flex-col items-center justify-start p-8">
      <header className="w-full flex justify-between items-center max-w-5xl mb-10">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold">✨ My Advent Calendars</span>
        </div>
        <Button
          className="bg-white text-black hover:bg-gray-200"
          onClick={() => router.push("/calendar/new")}
        >
          <Plus className="mr-2 h-4 w-4" /> New Calendar
        </Button>
      </header>

      <section className="bg-white/5 rounded-2xl p-16 flex flex-col items-center justify-center w-full max-w-4xl">
        <Gift className="text-gray-400 w-16 h-16 mb-6" />
        <h2 className="text-2xl font-semibold mb-2">No Calendars Yet</h2>
        <p className="text-gray-400 mb-6 text-center">
          Create your first Advent calendar to get started!
        </p>
        <Button
          className="bg-white text-black hover:bg-gray-200"
          onClick={() => router.push("/calendar/new")}
        >
          Create Your First Calendar
        </Button>
      </section>
    </main>
  );
}
