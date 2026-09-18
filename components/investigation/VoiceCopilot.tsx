"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Keyboard, Loader2, Mic, Square, Volume2 } from "lucide-react";
import { speakText, transcribeAudio } from "@/lib/api";
import { logError } from "@/lib/logger";
import { cn } from "@/lib/utils";

type Phase = "idle" | "recording" | "transcribing" | "typing";

const LANGUAGE_FLAGS: Record<string, string> = {
  "en-IN": "🇮🇳 English",
  "hi-IN": "🇮🇳 Hindi",
  "kn-IN": "🇮🇳 Kannada",
  "ta-IN": "🇮🇳 Tamil",
  "bn-IN": "🇮🇳 Bengali",
};

function Waveform() {
  return (
    <div className="flex h-5 items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="w-1 rounded-full bg-brand-yellow"
          animate={{ height: ["30%", "100%", "45%", "80%", "30%"] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}

export function VoiceCopilot({ merchantMessage }: { merchantMessage: string }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [transcript, setTranscript] = useState<string | null>(null);
  const [languageCode, setLanguageCode] = useState<string>("en-IN");
  const [typedText, setTypedText] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const runTranscription = useCallback(async (blob: Blob) => {
    setPhase("transcribing");
    setError(null);
    try {
      const result = await transcribeAudio(blob);
      setTranscript(result.transcript);
      setLanguageCode(result.languageCode);
      setPhase("idle");
    } catch (err) {
      logError("Voice transcription failed", err);
      setError("Couldn't reach voice transcription — you can type instead.");
      setPhase("typing");
    }
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        void runTranscription(blob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setPhase("recording");
    } catch (err) {
      logError("Microphone access failed", err);
      setError("Microphone access isn't available — you can type instead.");
      setPhase("typing");
    }
  }, [runTranscription]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
  }, []);

  const handleTypedSubmit = useCallback(() => {
    if (!typedText.trim()) return;
    setTranscript(typedText.trim());
    setLanguageCode("en-IN");
    setTypedText("");
    setPhase("idle");
  }, [typedText]);

  const handleSpeak = useCallback(async () => {
    setSpeaking(true);
    try {
      const result = await speakText(merchantMessage, languageCode);
      const audio = new Audio(`data:audio/${result.audioFormat};base64,${result.audioBase64}`);
      audioRef.current = audio;
      audio.onended = () => setSpeaking(false);
      audio.onerror = () => setSpeaking(false);
      await audio.play();
    } catch (err) {
      logError("Text-to-speech playback failed", err);
      setSpeaking(false);
    }
  }, [merchantMessage, languageCode]);

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <p className="label-caps text-white/40">Voice Copilot</p>
        {transcript && (
          <span className="rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-2.5 py-1 text-[10px] font-semibold text-brand-yellow">
            {LANGUAGE_FLAGS[languageCode] ?? languageCode}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        {phase === "recording" ? (
          <button
            type="button"
            onClick={stopRecording}
            aria-label="Stop recording"
            className="group inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            <Square className="h-3.5 w-3.5" />
            Stop Recording
          </button>
        ) : (
          <button
            type="button"
            onClick={startRecording}
            disabled={phase === "transcribing"}
            aria-label={phase === "transcribing" ? "Transcribing your voice" : "Speak to Niriksh"}
            className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-5 py-2.5 text-sm font-bold text-ink transition-all hover:-translate-y-0.5 active:scale-95 disabled:cursor-wait disabled:opacity-60 disabled:active:scale-100"
          >
            {phase === "transcribing" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
            {phase === "transcribing" ? "Transcribing..." : "Speak to Niriksh"}
          </button>
        )}

        {phase === "recording" && <Waveform />}

        <button
          type="button"
          onClick={() => setPhase(phase === "typing" ? "idle" : "typing")}
          aria-label="Type your message instead of speaking"
          aria-pressed={phase === "typing"}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2.5 text-xs font-semibold text-white/70 transition-all hover:border-white/40 hover:text-white active:scale-95"
        >
          <Keyboard className="h-3.5 w-3.5" />
          Type instead
        </button>

        <button
          type="button"
          onClick={handleSpeak}
          disabled={speaking}
          aria-label={speaking ? "Niriksh is speaking" : "Listen to Niriksh's investigation"}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2.5 text-xs font-semibold text-white/70 transition-all hover:border-white/40 hover:text-white active:scale-95 disabled:opacity-50"
        >
          <Volume2 className={cn("h-3.5 w-3.5", speaking && "animate-pulse text-brand-yellow")} />
          {speaking ? "Speaking..." : "Listen to Niriksh"}
        </button>
      </div>

      <AnimatePresence>
        {phase === "typing" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTypedSubmit()}
                placeholder="Type what you'd say to Niriksh..."
                aria-label="Type what you'd say to Niriksh"
                className="flex-1 rounded-full border border-white/15 bg-black/20 px-4 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-yellow/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleTypedSubmit}
                className="rounded-full bg-brand-yellow px-4 py-2 text-xs font-bold text-ink transition-transform active:scale-95"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="mt-2 text-xs text-warning">{error}</p>}

      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            aria-live="polite"
            className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3.5"
          >
            <p className="label-caps text-white/30">Transcript</p>
            <p className="mt-1 text-sm text-white/80">&ldquo;{transcript}&rdquo;</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
