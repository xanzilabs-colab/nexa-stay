"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Option = { label: string; value: string };

type CustomSelectProps = {
  name?: string;
  options: Option[];
  defaultValue?: string;
  ariaLabel: string;
  className?: string;
};

export function CustomSelect({ name, options, defaultValue = "", ariaLabel, className = "" }: CustomSelectProps) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [menuRect, setMenuRect] = useState<{ left: number; top: number; width: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) { setOpen(false); setMenuRect(null); }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className={`custom-select ${className}`} ref={containerRef}>
      {name && <input type="hidden" name={name} value={value} />}
      <button type="button" ref={triggerRef} className="custom-select-trigger" aria-label={ariaLabel} aria-expanded={open} onClick={() => { if (open) { setOpen(false); setMenuRect(null); return; } const rect = triggerRef.current?.getBoundingClientRect(); if (rect) setMenuRect({ left: rect.left, top: rect.bottom + 8, width: rect.width }); setOpen(true); }}>
        <span>{selected.label}</span><ChevronDown size={17} aria-hidden="true" />
      </button>
      {open && menuRect && <div className="custom-select-menu" style={{ position: "fixed", left: menuRect.left, top: menuRect.top, width: menuRect.width }} role="listbox" aria-label={ariaLabel}>
        {options.map((option) => <button type="button" key={option.value} role="option" aria-selected={option.value === value} className={option.value === value ? "selected" : ""} onClick={() => { setValue(option.value); setOpen(false); }}>{option.label}</button>)}
      </div>}
    </div>
  );
}
