import { useEffect, useMemo, useState } from "react";
import { useNotes } from "../features/notes/useNotes";
import { 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  BookOpen, 
  HardDrive, 
  Layers, 
  Sparkles, 
  Download,
  Info,
  Clock,
  FileText
} from "lucide-react";

const steps = [
  "Create the shell",
  "Make it installable",
  "Make it offline",
  "Test the boundary",
  "Deploy it"
];

export default function Home() {
  const { notes, addNote, deleteNote } = useNotes();

  const [done, setDone] = useState<number[]>([]);
  const [online, setOnline] = useState(navigator.onLine);
  const [simulatedOffline, setSimulatedOffline] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const isActuallyOnline = simulatedOffline ? false : online;

  const progress = useMemo(() => Math.round((done.length / steps.length) * 100), [done]);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    
    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => { 
      window.removeEventListener("online", on); 
      window.removeEventListener("offline", off);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  function saveNote() {
    addNote(title, body);
    setTitle("");
    setBody("");
  }

  async function handleInstallClick() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setInstallSuccess(true);
      }
      setDeferredPrompt(null);
    } else {
      alert("To install this PWA, use your browser's address bar icon (Chrome/Edge) or 'Add to Home Screen' in browser settings.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f5] text-[#1d1d1b] selection:bg-stone-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#faf9f5]/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#1d1d1b] text-white flex items-center justify-center font-bold text-base shadow-sm ring-1 ring-black/10">
            N
          </div>
          <div>
            <div className="flex items-center gap-2">
              <strong className="text-base font-semibold tracking-tight text-stone-900">
                Offline Notes Lab
              </strong>
              <span className="hidden sm:inline-flex text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-stone-200/70 text-stone-700">
                v2 PWA
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden md:block">
              Progressive Web App Workshop
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick Offline Simulator Button for testing */}
          <button
            type="button"
            onClick={() => setSimulatedOffline(!simulatedOffline)}
            className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors ${
              simulatedOffline 
                ? "bg-amber-100 border-amber-300 text-amber-900" 
                : "bg-white border-stone-200 text-stone-600 hover:bg-stone-100/70"
            }`}
            title="Toggle simulated network drop"
          >
            {simulatedOffline ? "Restore Real Network" : "Test Offline State"}
          </button>

          {/* Network Status Badge */}
          <div 
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isActuallyOnline
                ? "bg-emerald-50 border-emerald-200 text-emerald-800 shadow-xs"
                : "bg-amber-50 border-amber-300 text-amber-900 shadow-xs animate-pulse"
            }`}
          >
            <span className="relative flex h-2 w-2">
              {isActuallyOnline && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isActuallyOnline ? "bg-emerald-500" : "bg-amber-600"}`}></span>
            </span>
            {isActuallyOnline ? (
              <span className="flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                Online
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                Offline
              </span>
            )}
          </div>

          {/* Install PWA Button */}
          {deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 bg-[#1d1d1b] text-white hover:bg-stone-800 text-xs font-medium px-3 py-1.5 rounded-lg shadow-xs transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] transition-all">
        {/* Workshop Map Sidebar */}
        <aside className="border-b lg:border-b-0 lg:border-r border-stone-200/80 p-5 sm:p-7 bg-stone-50/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200/60">
              <p className="text-[11px] font-bold tracking-wider text-stone-500 uppercase flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                WORKSHOP MAP
              </p>
              <span className="text-xs font-semibold text-stone-600 bg-stone-200/60 px-2 py-0.5 rounded-full">
                {done.length}/{steps.length}
              </span>
            </div>

            <p className="text-xs text-stone-500 mb-4 leading-relaxed">
              Click any step as you complete it to monitor your laboratory progress:
            </p>

            <nav className="space-y-1.5">
              {steps.map((step, index) => {
                const isDone = done.includes(index);
                return (
                  <button
                    key={step}
                    type="button"
                    onClick={() =>
                      setDone(
                        isDone 
                          ? done.filter((x) => x !== index) 
                          : [...done, index]
                      )
                    }
                    className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium transition-all duration-150 border ${
                      isDone
                        ? "bg-emerald-50/70 border-emerald-200/70 text-emerald-900 shadow-xs"
                        : "bg-white border-stone-200/70 text-stone-700 hover:border-stone-300 hover:bg-stone-50"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors shrink-0 ${
                        isDone
                          ? "bg-emerald-600 text-white"
                          : "bg-stone-100 text-stone-500 group-hover:bg-stone-200"
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : index + 1}
                    </span>
                    <span className={`flex-1 truncate ${isDone ? "line-through opacity-85" : ""}`}>
                      {step}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Progress Card */}
          <div className="mt-8 pt-5 border-t border-stone-200/80">
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="font-medium text-stone-600">Workshop Completion</span>
              <span className="font-bold text-stone-900">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-stone-900 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 text-[11px] text-stone-500 leading-normal flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
              <span>{progress === 100 ? "All 5 lab checkpoints verified!" : `${steps.length - done.length} steps remaining`}</span>
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="p-6 sm:p-10 lg:p-12 max-w-5xl">
          {/* Header Section */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-200/70 text-stone-700 text-xs font-semibold tracking-wider uppercase mb-3">
              <Layers className="w-3 h-3 text-stone-500" />
              FOUNDATION TRACK
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-stone-900 leading-[1.15] max-w-2xl">
              Keep learning when the network leaves.
            </h1>
            <p className="lede mt-3.5 text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl font-normal">
              Save a note, refresh the page, then test the same experience with the network turned off.
            </p>

            {/* Architecture Highlights Pill Row */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5 text-xs text-stone-600">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200/80 shadow-2xs">
                <HardDrive className="w-3.5 h-3.5 text-stone-500" />
                <span>Storage: <strong>localStorage</strong></span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200/80 shadow-2xs">
                <Layers className="w-3.5 h-3.5 text-stone-500" />
                <span>Cache: <strong>offline-notes-lab-v2</strong></span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200/80 shadow-2xs">
                <FileText className="w-3.5 h-3.5 text-stone-500" />
                <span>Shell: <strong>/ & /manifest.webmanifest</strong></span>
              </div>
            </div>
          </div>

          {/* Dual Columns: Notes Display + Note Creation Form */}
          <section className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-8 items-start">
            {/* Left: Notes from the Lab */}
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-stone-900 tracking-tight">
                    Notes from the lab
                  </h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                    {notes.length}
                  </span>
                </div>
                {notes.length > 0 && (
                  <span className="text-xs text-stone-500">
                    Auto-saved
                  </span>
                )}
              </div>

              {notes.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white border border-dashed border-stone-300 text-center">
                  <FileText className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-stone-700">No notes in the lab yet</p>
                  <p className="text-xs text-stone-500 mt-1">
                    Fill out the form on the right to log your first observation.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {notes.map((note) => (
                    <article
                      key={note.id}
                      className="group p-5 rounded-xl bg-white border border-stone-200/90 shadow-2xs hover:shadow-xs transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold text-stone-900 text-base leading-snug">
                          {note.title}
                        </h3>
                        <button
                          type="button"
                          onClick={() => deleteNote(note.id)}
                          className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-600 transition-opacity p-1 rounded-md hover:bg-stone-100"
                          title="Delete note"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="mt-2 text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">
                        {note.body}
                      </p>

                      <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500">
                          <Clock className="w-3 h-3 text-stone-400" />
                          {note.updated}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          Stored locally
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Write a Note Form Card */}
            <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs sticky top-20">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100">
                <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-stone-900 tracking-tight">
                  Write a note
                </h2>
              </div>

              <form 
                onSubmit={(event) => {
                  event.preventDefault();
                  saveNote();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="e.g. Testing cache fallback"
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50/50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all placeholder:text-stone-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Observation
                  </label>
                  <textarea
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    rows={5}
                    placeholder="Describe what happens when you reload or disconnect the network..."
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50/50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all placeholder:text-stone-400 resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!title.trim() || !body.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-[#1d1d1b] hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm py-3 px-6 rounded-xl transition-all shadow-xs active:scale-[0.99] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save locally</span>
                </button>
              </form>

              <div className="mt-4 pt-3.5 border-t border-stone-100 text-center">
                <p className="text-[11px] text-stone-500">
                  Notes are synced instantly to browser <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700 font-mono">localStorage</code>.
                </p>
              </div>
            </div>
          </section>

          {/* Interactive Testing Guide Accordion */}
          <div className="mt-12 p-5 rounded-2xl bg-white border border-stone-200">
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200/70 text-amber-800 flex items-center justify-center">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    Workshop Offline Test Instructions
                  </h3>
                  <p className="text-xs text-stone-500">
                    How to verify service worker caching and offline persistence
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-md">
                {showGuide ? "Hide Guide" : "Show Guide"}
              </span>
            </button>

            {showGuide && (
              <div className="mt-4 pt-4 border-t border-stone-100 text-xs text-stone-600 space-y-2.5 leading-relaxed">
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    <strong>Load once online:</strong> Ensure the service worker registers <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800">/sw.js</code>.
                  </li>
                  <li>
                    <strong>Disconnect network:</strong> In Developer Tools &rarr; <strong>Network</strong>, set throttling to <strong>Offline</strong> (or click the "Test Offline State" button above).
                  </li>
                  <li>
                    <strong>Reload:</strong> Notice the shell loads smoothly from Cache Storage even with zero network.
                  </li>
                  <li>
                    <strong>Create note & refresh:</strong> Create a new note while offline; it stays permanently in <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800">localStorage</code>.
                  </li>
                </ol>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Website Footer */}
      <footer className="mt-auto border-t border-stone-200/90 bg-stone-50/70 px-4 sm:px-8 py-5 text-center text-xs text-stone-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <p className="font-medium text-stone-800 tracking-tight">
            Project By: <span className="font-semibold text-stone-950">Ode Caleb Onahinyohe</span> &nbsp;|&nbsp; Matric NO: <span className="font-semibold text-stone-950">2024/1/97767CP</span>
          </p>
          <p className="text-stone-400 text-[11px]">
            Offline Notes Lab &bull; Progressive Web App
          </p>
        </div>
      </footer>
    </div>
  );
}
