"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type DatePickerProps = { name: string; label: string; value: string; onChange: (value: string) => void; min?: string; max?: string; disabled?: boolean };
const dayMilliseconds = 86_400_000;
function iso(date: Date) { return date.toISOString().slice(0, 10); }
function parse(value: string) { return new Date(`${value}T00:00:00`); }
function display(value: string) { return value ? parse(value).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" }) : "Select date"; }

export function DatePicker({ name, label, value, onChange, min, max, disabled }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => value ? parse(value) : new Date());
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => { const close = (event: MouseEvent) => { if (!container.current?.contains(event.target as Node)) setOpen(false); }; document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close); }, []);
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const blanks = Array.from({ length: first.getDay() });
  const minimum = min ? parse(min) : new Date(new Date().setHours(0, 0, 0, 0));
  const maximum = max ? parse(max) : null;
  const choose = (day: number) => { const selected = new Date(month.getFullYear(), month.getMonth(), day); onChange(iso(selected)); setOpen(false); };
  return <div className="date-picker" ref={container}><input type="hidden" name={name} value={value}/><button type="button" disabled={disabled} className="date-picker-trigger" onClick={() => setOpen(!open)}><CalendarDays size={17}/><span><small>{label}</small>{display(value)}</span></button>{open && <div className="date-picker-popover"><div className="calendar-head"><button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="Previous month"><ChevronLeft size={18}/></button><strong>{month.toLocaleDateString("en-ZA", { month: "long", year: "numeric" })}</strong><button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="Next month"><ChevronRight size={18}/></button></div><div className="calendar-weekdays">{["S","M","T","W","T","F","S"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div><div className="calendar-days">{blanks.map((_, index) => <i key={`blank-${index}`}/>)}{Array.from({ length: days }, (_, index) => { const day = index + 1; const date = new Date(month.getFullYear(), month.getMonth(), day); const dateValue = iso(date); const unavailable = date < minimum || (maximum !== null && date > maximum); return <button type="button" key={day} disabled={unavailable} className={dateValue === value ? "selected" : ""} onClick={() => choose(day)}>{day}</button>; })}</div></div>}</div>;
}