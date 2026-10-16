"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";

const DEFAULT_SECONDS = 120;
const presets = [
  { label: "1 min", seconds: 60 },
  { label: "2 min", seconds: 120 },
  { label: "3 min", seconds: 180 },
  { label: "5 min", seconds: 300 },
];

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function playFinishTone() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  [0, 0.22, 0.44].forEach((delay, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = index === 2 ? 880 : 660;
    gain.gain.setValueAtTime(0.0001, context.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.22, context.currentTime + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + delay + 0.18);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(context.currentTime + delay);
    oscillator.stop(context.currentTime + delay + 0.2);
  });
  window.setTimeout(() => void context.close(), 900);
}

declare global {
  interface Window { webkitAudioContext?: typeof AudioContext }
}

export default function SpeakingTimer() {
  const [duration, setDuration] = useState(DEFAULT_SECONDS);
  const [remaining, setRemaining] = useState(DEFAULT_SECONDS);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [recordingError, setRecordingError] = useState("");
  const endAt = useRef<number | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);

  useEffect(() => {
    if (!running) return;
    const update = () => {
      if (endAt.current === null) return;
      const next = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000));
      setRemaining(next);
      if (next === 0) {
        setRunning(false);
        setFinished(true);
        endAt.current = null;
        playFinishTone();
      }
    };
    update();
    const interval = window.setInterval(update, 200);
    return () => window.clearInterval(interval);
  }, [running]);

  useEffect(() => {
    document.title = running ? `${formatTime(remaining)} · Speaking Timer` : "Speaking Timer | Personal";
    return () => { document.title = "Speaking Timer | Personal"; };
  }, [remaining, running]);

  useEffect(() => () => {
    stream.current?.getTracks().forEach((track) => track.stop());
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  function start() {
    if (remaining === 0) setRemaining(duration);
    const seconds = remaining === 0 ? duration : remaining;
    endAt.current = Date.now() + seconds * 1000;
    setFinished(false);
    setRunning(true);
  }

  function pause() {
    if (endAt.current !== null) setRemaining(Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000)));
    endAt.current = null;
    setRunning(false);
  }

  function reset() {
    endAt.current = null;
    setRunning(false);
    setFinished(false);
    setRemaining(duration);
  }

  function choose(seconds: number) {
    endAt.current = null;
    setDuration(seconds);
    setRemaining(seconds);
    setRunning(false);
    setFinished(false);
  }

  async function startRecording() {
    setRecordingError("");
    try {
      const microphone = await navigator.mediaDevices.getUserMedia({ audio: true });
      const nextRecorder = new MediaRecorder(microphone);
      stream.current = microphone;
      recorder.current = nextRecorder;
      chunks.current = [];
      nextRecorder.addEventListener("dataavailable", (event) => {
        if (event.data.size) chunks.current.push(event.data);
      });
      nextRecorder.addEventListener("stop", () => {
        const blob = new Blob(chunks.current, { type: nextRecorder.mimeType || "audio/webm" });
        setAudioUrl((current) => {
          if (current) URL.revokeObjectURL(current);
          return URL.createObjectURL(blob);
        });
        microphone.getTracks().forEach((track) => track.stop());
        stream.current = null;
      });
      nextRecorder.start();
      setRecording(true);
    } catch {
      setRecordingError("Microphone access was unavailable. Allow microphone permission and try again.");
    }
  }

  function stopRecording() {
    if (recorder.current?.state === "recording") recorder.current.stop();
    setRecording(false);
  }

  function deleteRecording() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl("");
    setRecordingError("");
  }

  const progress = duration ? ((duration - remaining) / duration) * 100 : 0;

  return <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-violet-50 text-slate-900">
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 lg:px-8">
        <Link href="/" aria-label="Home"><Image src="/fa.png" alt="IELTS Logo" width={60} height={60} className="rounded-full" unoptimized /></Link>
        <Navbar />
      </div>
    </header>

    <section className="mx-auto grid min-h-[calc(100vh-77px)] max-w-4xl place-items-center px-6 py-10">
      <div className={`w-full overflow-hidden rounded-[2rem] border bg-white shadow-2xl transition ${finished ? "border-emerald-300 shadow-emerald-100" : "border-slate-200 shadow-slate-200/60"}`}>
        <div className="h-2 bg-slate-100"><div className={`h-full transition-all duration-200 ${finished ? "bg-emerald-500" : "bg-sky-600"}`} style={{ width: `${progress}%` }} /></div>
        <div className="p-7 text-center sm:p-12">
          <p className={`text-sm font-black uppercase tracking-[0.3em] ${finished ? "text-emerald-600" : running ? "text-sky-600" : "text-slate-400"}`}>{finished ? "Time is up" : running ? "Speaking now" : remaining < duration ? "Paused" : "Ready"}</p>
          <div role="timer" aria-live="polite" className={`my-8 font-mono text-[clamp(5rem,20vw,11rem)] font-black leading-none tracking-[-0.08em] tabular-nums ${finished ? "text-emerald-600" : "text-slate-950"}`}>{formatTime(remaining)}</div>

          <div className="mx-auto flex max-w-lg flex-wrap justify-center gap-3">
            {!running ? <button type="button" onClick={start} className="min-w-40 rounded-2xl bg-sky-600 px-8 py-4 text-lg font-black text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700">{remaining < duration && remaining > 0 ? "Resume" : "Start"}</button> : <button type="button" onClick={pause} className="min-w-40 rounded-2xl bg-amber-500 px-8 py-4 text-lg font-black text-white shadow-lg shadow-amber-200 transition hover:bg-amber-600">Pause</button>}
            <button type="button" onClick={reset} className="rounded-2xl border border-slate-300 bg-white px-8 py-4 text-lg font-black text-slate-700 transition hover:bg-slate-50">Reset</button>
          </div>

          <div className="mt-10 border-t border-slate-100 pt-7">
            <div className="flex flex-wrap justify-center gap-2">{presets.map((preset) => <button type="button" key={preset.seconds} onClick={() => choose(preset.seconds)} className={`rounded-xl border px-5 py-2.5 text-sm font-bold transition ${duration === preset.seconds ? "border-sky-600 bg-sky-50 text-sky-700" : "border-slate-200 text-slate-600 hover:border-sky-300"}`}>{preset.label}</button>)}</div>
            <label className="mt-5 inline-flex items-center gap-3 text-sm font-bold text-slate-600">Custom minutes<input aria-label="Custom timer duration in minutes" type="number" min="0.5" max="60" step="0.5" value={duration / 60} onChange={(event) => choose(Math.max(30, Math.round(Number(event.target.value || 0.5) * 60)))} className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-center outline-none focus:border-sky-400" /></label>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-7">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Speaking recorder</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              {!recording ? <button type="button" onClick={() => void startRecording()} className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-6 py-3 font-black text-white shadow-lg shadow-rose-200 transition hover:bg-rose-700"><span className="h-3 w-3 rounded-full bg-white" />Record audio</button> : <button type="button" onClick={stopRecording} className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 font-black text-white shadow-lg"><span className="h-3 w-3 animate-pulse rounded-sm bg-rose-500" />Stop recording</button>}
              {recording && <span className="inline-flex items-center gap-2 text-sm font-bold text-rose-600"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-rose-600" />Recording…</span>}
            </div>
            {recordingError && <p role="alert" className="mt-4 text-sm font-semibold text-rose-600">{recordingError}</p>}
            {audioUrl && <div className="mx-auto mt-5 flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row">
              <audio controls src={audioUrl} className="w-full flex-1" aria-label="Your speaking practice recording" />
              <div className="flex shrink-0 gap-2"><a href={audioUrl} download={`speaking-practice-${new Date().toISOString().slice(0, 10)}.webm`} className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white">Download</a><button type="button" onClick={deleteRecording} className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-bold text-rose-600">Delete</button></div>
            </div>}
            <p className="mt-4 text-xs text-slate-400">Your recording remains on this device and is not uploaded.</p>
          </div>
        </div>
      </div>
    </section>
  </main>;
}
