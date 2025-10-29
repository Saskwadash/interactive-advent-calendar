// pages/index.js
import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "../src/firebase";
import {
  Gift,
  Star,
  Sparkles,
  Music,
  BookOpen,
  Camera,
  Palette,
  Heart
} from "lucide-react";

const ICON_MAP = { Star, Music, Gift, BookOpen, Heart, Camera, Sparkles, Palette };

export default function Home() {
  const [calendars, setCalendars] = useState([]);
  const [currentCalendar, setCurrentCalendar] = useState(null);
  const [openDoor, setOpenDoor] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultDoorContent = Array.from({ length: 25 }).map((_, i) => {
    const icons = ["Star","Music","Gift","BookOpen","Heart","Camera","Sparkles","Palette","Music","BookOpen","Heart","Sparkles","Star","Music","Camera","BookOpen","Heart","Sparkles","Star","Gift","Sparkles","Music","BookOpen","Heart","Sparkles"];
    const titles = [
      "Welcome to December!",
      "Today's Vibe",
      "Self-Care Moment",
      "Creative Prompt",
      "Affirmation",
      "Photography Challenge",
      "Treat Yourself",
      "Art Moment",
      "Song of the Day",
      "Cooking Adventure",
      "Reading Time",
      "Mini Adventure",
      "Reflection",
      "Self-Gift",
      "Midway Point!",
      "Dance Break",
      "Memory Lane",
      "Cozy Evening",
      "Creative Freedom",
      "Learning Time",
      "Kindness",
      "Movie Night",
      "Gratitude",
      "Christmas Eve",
      "Merry Christmas!"
    ];
    return {
      icon: icons[i] || "Star",
      title: titles[i] || `Day ${i+1}`,
      content: "",
      type: "text"
    };
  });

  useEffect(() => {
    const loadCalendars = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "calendars"));
        const items = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCalendars(items);
      } catch (err) {
        console.error("Error loading calendars:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCalendars();
  }, []);

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/calendar\/(.+)/);
    if (match) {
      const id = match[1];
      (async () => {
        try {
          const snap = await getDoc(doc(db, "calendars", id));
          if (snap.exists()) setCurrentCalendar({ id: snap.id, ...snap.data() });
        } catch (err) {
          console.error("Error fetching calendar by id:", err);
        }
      })();
    }
  }, []);

  const createCalendar = async () => {
    try {
      const docRef = await addDoc(collection(db, "calendars"), {
        name: `My Calendar ${Date.now()}`,
        doors: defaultDoorContent,
        createdAt: new Date().toISOString()
      });
      const newCal = { id: docRef.id, name: `My Calendar ${Date.now()}`, doors: defaultDoorContent };
      setCalendars((p) => [newCal, ...p]);
      setCurrentCalendar(newCal);
      window.history.pushState({}, "", `/calendar/${docRef.id}`);
    } catch (err) {
      console.error("Error creating calendar:", err);
      alert("Failed to create calendar. Check console.");
    }
  };

  const handleShare = () => {
    if (!currentCalendar) return alert("Open a calendar first");
    const shareUrl = `${window.location.origin}/calendar/${currentCalendar.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied! Share it with anyone.");
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (currentCalendar) {
    const doors = Array.from({ length: 25 }).map((_, i) => currentCalendar.doors && currentCalendar.doors[i] ? currentCalendar.doors[i] : defaultDoorContent[i]);

    return (
      <div className="min-h-screen p-8 app-container">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-white">{currentCalendar.name}</h1>
          <div className="flex gap-2">
            <button onClick={handleShare} className="px-4 py-2 bg-green-600 rounded text-white">Copy Share Link</button>
            <button onClick={() => { setCurrentCalendar(null); window.history.pushState({}, "", "/"); }} className="px-4 py-2 bg-gray-800 rounded text-white">Back</button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {doors.map((door, idx) => {
            const Icon = ICON_MAP[door.icon] || Gift;
            return (
              <button
                key={idx}
                onClick={() => setOpenDoor({ ...door, index: idx + 1 })}
                className="aspect-square rounded-2xl p-4 flex flex-col items-center justify-center bg-white text-black transition transform hover:scale-105"
              >
                <Icon className="w-6 h-6 mb-2" />
                <div className="text-xl font-bold">{idx + 1}</div>
              </button>
            );
          })}
        </div>

        {openDoor && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setOpenDoor(null)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gray-900 rounded-full p-3">
                  {(ICON_MAP[openDoor.icon] || Gift)({ className: "w-8 h-8 text-white" })}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">December {openDoor.index}</h2>
                  <p className="text-gray-600">{openDoor.title}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-gray-700">{openDoor.content || 'Enjoy this surprise!'}</p>
              </div>

              <div className="mt-6 flex gap-2">
                <button onClick={() => setOpenDoor(null)} className="px-4 py-2 bg-gray-200 rounded">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 app-container">
      <h1 className="text-3xl font-bold mb-6 text-white">🎄 My Advent Calendars</h1>
      {calendars.length === 0 ? (
        <div className="text-center">
          <p className="mb-4 text-white">No calendars yet.</p>
          <button onClick={createCalendar} className="px-4 py-2 bg-green-600 text-white rounded-md">Create Your First Calendar</button>
        </div>
      ) : (
        <div className="space-y-4 max-w-lg">
          {calendars.map((c) => (
            <div key={c.id} className="p-4 bg-white rounded-lg shadow cursor-pointer" onClick={() => { setCurrentCalendar(c); window.history.pushState({}, "", `/calendar/${c.id}`); }}>
              <div className="font-semibold">{c.name}</div>
              <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
            </div>
          ))}
          <button onClick={createCalendar} className="w-full px-4 py-2 bg-green-600 text-white rounded-md">+ New Calendar</button>
        </div>
      )}
    </div>
  );
}
