"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { getSavedStayIds, SAVED_STAYS_CHANGE_EVENT, toggleSavedStay } from "@/lib/saved-stays";

export function SaveStayButton({ propertyId, label }: { propertyId: string; label: string }) {
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    const updateSavedState = () => setSaved(getSavedStayIds().includes(propertyId));
    const frame = window.requestAnimationFrame(updateSavedState);
    window.addEventListener("storage", updateSavedState);
    window.addEventListener(SAVED_STAYS_CHANGE_EVENT, updateSavedState);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("storage", updateSavedState);
      window.removeEventListener(SAVED_STAYS_CHANGE_EVENT, updateSavedState);
    };
  }, [propertyId]);

  function toggleSaved() {
    try {
      setSaved(toggleSavedStay(propertyId));
      setSaveError("");
    } catch (error) {
      console.error("Unable to save this stay in local storage.", error);
      setSaveError("Could not save this stay. Check your browser storage settings and try again.");
    }
  }

  return <>
    <button className={`save-stay${saved ? " saved" : ""}`} type="button" onClick={toggleSaved} aria-label={`${saved ? "Remove" : "Save"} ${label}`} aria-pressed={saved}>
      <Heart size={18} fill={saved ? "currentColor" : "none"} />
    </button>
    {saveError && <span className="sr-only" role="alert">{saveError}</span>}
  </>;
}
