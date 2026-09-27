"use client";

import { useSyncExternalStore } from "react";

const key = "aeris.preferred-city";
const eventName = "aeris:city-change";
let memoryPreference: string | null = null;

function getSnapshot() {
  if (memoryPreference !== null) return memoryPreference;
  try {
    return window.localStorage.getItem(key) ?? memoryPreference;
  } catch {
    return memoryPreference;
  }
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) {
      memoryPreference = event.newValue;
      onChange();
    }
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(eventName, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(eventName, onChange);
  };
}

export function rememberCity(slug: string) {
  memoryPreference = slug;
  try {
    window.localStorage.setItem(key, slug);
  } catch {
    // Browsing remains functional when persistent storage is unavailable.
  }
  window.dispatchEvent(new Event(eventName));
}

export function usePreferredCity() {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
