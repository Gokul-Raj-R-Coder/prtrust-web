"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  
  // State for our sliders
  const [settings, setSettings] = useState({ ai_weight: 35, trust_weight: 25, auto_merge_threshold: 85 });
  const [isSaving, setIsSaving] = useState(false);

  // Fetch settings when the dashboard loads
  useEffect(() => {
    if (session) {
      fetch("/api/settings")
        .then((res) => res.json())
        .then((data) => setSettings(data));
    }
  }, [session]);

  const handleSave = async () => {
    setIsSaving(true);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setIsSaving(false);
    alert("Settings saved successfully!");
  };

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;

  // LOGGED IN STATE
  if (session) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-10 font-sans">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center gap-4">
              <img src={session.user.image} alt="Avatar" className="w-12 h-12 rounded-full" />
              <div>
                <h1 className="text-2xl font-bold">Welcome, {session.user.name}</h1>
                <p className="text-gray-400">PRTrust Control Panel</p>
              </div>
            </div>
            <button onClick={() => signOut()} className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition">
              Sign Out
            </button>
          </div>
          
          {/* Risk Dial Controls */}
          <div className="mt-8 p-6 bg-gray-800 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6">Algorithm Settings</h2>
            
            <div className="space-y-8">
              {/* Slider 1: AI Weight */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-semibold text-gray-300">AI Code Analysis Weight</label>
                  <span className="text-blue-400 font-mono">{settings.ai_weight}%</span>
                </div>
                <input 
                  type="range" min="0" max="80" 
                  value={settings.ai_weight} 
                  onChange={(e) => setSettings({...settings, ai_weight: parseInt(e.target.value)})}
                  className="w-full accent-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">How much should Gemini's code review impact the final score?</p>
              </div>

              {/* Slider 2: Trust Weight */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-semibold text-gray-300">Developer Trust Track Record</label>
                  <span className="text-blue-400 font-mono">{settings.trust_weight}%</span>
                </div>
                <input 
                  type="range" min="0" max="80" 
                  value={settings.trust_weight} 
                  onChange={(e) => setSettings({...settings, trust_weight: parseInt(e.target.value)})}
                  className="w-full accent-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">How much should a developer's past merge history impact the score?</p>
              </div>

              {/* Slider 3: Auto-Merge Threshold */}
              <div className="pt-4 border-t border-gray-700">
                <div className="flex justify-between mb-2">
                  <label className="font-semibold text-green-400">Auto-Merge Threshold</label>
                  <span className="text-green-400 font-mono">{settings.auto_merge_threshold} / 100</span>
                </div>
                <input 
                  type="range" min="50" max="100" 
                  value={settings.auto_merge_threshold} 
                  onChange={(e) => setSettings({...settings, auto_merge_threshold: parseInt(e.target.value)})}
                  className="w-full accent-green-500"
                />
                <p className="text-sm text-gray-500 mt-1">Scores above this number are marked "Safe to Merge". Scores below require a human reviewer.</p>
              </div>
            </div>

            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="mt-8 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Algorithm Settings"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED OUT STATE (Keep your existing logged out state here)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white font-sans">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">PR<span className="text-blue-500">Trust</span></h1>
        <p className="text-gray-400 mb-8 text-lg">Stop reviewing noise. Auto-merge safe code. Gatekeep the risky stuff.</p>
        <button onClick={() => signIn('github')} className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition">
          Sign In with GitHub
        </button>
      </div>
    </div>
  );
}
