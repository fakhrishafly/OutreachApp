"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

interface UseSpeechToTextOptions {
  onResult: (finalText: string) => void;
  lang?: string;
}

function subscribeNoop() {
  return () => {};
}

function getSupportSnapshot() {
  return Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition);
}

function getServerSupportSnapshot() {
  return false;
}

export function useSpeechToText({ onResult, lang = "id-ID" }: UseSpeechToTextOptions) {
  const supported = useSyncExternalStore(
    subscribeNoop,
    getSupportSnapshot,
    getServerSupportSnapshot
  );
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<InstanceType<
    NonNullable<Window["SpeechRecognition"]>
  > | null>(null);

  const start = useCallback(() => {
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          text += event.results[i][0].transcript;
        }
      }
      if (text.trim()) onResult(text.trim());
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [lang, onResult]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  return { supported, listening, start, stop };
}
