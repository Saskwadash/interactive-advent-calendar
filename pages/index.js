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

export default function Home() {
  const [calendars, setCalendars] = useState([]);
  const [currentCalendar, setCurrentCalendar] = useState(null);
  const [openDoor, setOpenDoor] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultDoorContent = [
    { icon: "Star", title: "Welcome to December!" },
    { icon: "Music", title: "Today's Vibe" },
    { icon: "Gift", title: "Self-Care Moment" },
    { icon: "BookOpen", title: "Creative Prompt" },
    { icon: "Heart", title: "Affirmation" },
    { icon: "Camera", title: "Photography Challenge" },
    { icon: "Sparkles", title: "Treat Yourself" },
    { icon: "Palette", title: "Art Moment" },
    // you can extend to 25 later...
  ];

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

  // If URL path contains /calendar/{id}, load that calendar
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
    return (
      <div className="min-h-screen p-8 bg-gray-50">
        <h1 className="text-3xl font-bold mb-4">{currentCalendar.name}</h1>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {currentCalendar.doors.map((door, i) => (
            <div
              key={i}
              onClick={() => setOpenDoor(door)}
              className="p-4 rounded-lg bg-green-600 text-white text-center cursor-pointer"
            >
              {i + 1}
            </div>
          ))}
        </div>

        <button
          onClick={handleShare}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Copy Share Link
        </button>

        <button
          onClick={() => { setCurrentCalendar(null); window.history.pushState({}, "", "/"); }}
          className="ml-3 px-4 py-2 bg-gray-200 rounded-md"
        >
          Back
        </button>

        {openDoor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl text-center max-w-sm w-full">
              {renderIcon(openDoor.icon)}
              <h3 className="text-xl font-semibold mt-3">{openDoor.title}</h3>
              <button onClick={() => setOpenDoor(null)} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Close</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-center">
      <h1 className="text-3xl font-bold mb-6">🎄 My Advent Calendars</h1>

      {calendars.length === 0 ? (
        <div>
          <p className="mb-4">No calendars yet.</p>
          <button onClick={createCalendar} className="px-4 py-2 bg-green-600 text-white rounded-md">Create Your First Calendar</button>
        </div>
      ) : (
        <div className="max-w-lg mx-auto">
          <div className="space-y-3 mb-4">
            {calendars.map((c) => (
              <div key={c.id} className="p-4 bg-white rounded-lg shadow cursor-pointer" onClick={() => { setCurrentCalendar(c); window.history.pushState({}, "", `/calendar/${c.id}`); }}>
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <button onClick={createCalendar} className="w-full px-4 py-2 bg-green-600 text-white rounded-md">+ New Calendar</button>
        </div>
      )}
    </div>
  );
}

function renderIcon(name) {
  const icons = { Star, Music, Gift, BookOpen, Heart, Camera, Sparkles, Palette };
  const Icon = icons[name];
  return Icon ? <Icon className="mx-auto h-12 w-12 text-green-600" /> : null;
}
