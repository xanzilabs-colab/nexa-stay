"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

function readSavedStays() {
  try {
    const value: unknown = JSON.parse(localStorage.getItem("nx-saved") ?? "[]");
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function SaveStayButton({ propertyId, label }: { propertyId: string; label: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const updateSavedState = () => setSaved(readSavedStays().includes(propertyId));
    const frame = window.requestAnimationFrame(updateSavedState);
    window.addEventListener("storage", updateSavedState);
    window.addEventListener("saved-stays-change", updateSavedState);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("storage", updateSavedState);
      window.removeEventListener("saved-stays-change", updateSavedState);
    };
  }, [propertyId]);

  function toggleSaved() {
    const stays = readSavedStays();
    const next = stays.includes(propertyId) ? stays.filter((id) => id !== propertyId) : [...stays, propertyId];
    localStorage.setItem("nx-saved", JSON.stringify(next));
    setSaved(next.includes(propertyId));
    window.dispatchEvent(new Event("saved-stays-change"));
  }

  return <button className={`save-stay${saved ? " saved" : ""}`} type="button" onClick={toggleSaved} aria-label={`${saved ? "Remove" : "Save"} ${label}`} aria-pressed={saved}>
    <Heart size={18} fill={saved ? "currentColor" : "none"} />
  </button>;
}
