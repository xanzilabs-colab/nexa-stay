"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, Mail, MessageCircle, X } from "lucide-react";
import type { Agent } from "@/types/property";

const tones = ["agent-tone-1", "agent-tone-2", "agent-tone-3", "agent-tone-4", ""];
const initials = (name: string) => name.split(" ").map((part) => part[0]).join("").slice(0, 3);

export function AgentGrid({ agents }: { agents: Agent[] }) {
  const [selected, setSelected] = useState<Agent | null>(null);

  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [selected]);

  const whatsapp = (selected?.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "27730884239").replace(/\D/g, "");
  const message = selected ? encodeURIComponent(`Hi NexaStay, I'd like to speak to ${selected.name}.`) : "";

  return <>
    <div className="agent-design-grid">{agents.map((agent, index) => <button
      className="agent-design-card"
      type="button"
      onClick={() => setSelected(agent)}
      key={agent.id}
    >
      <div className={`agent-design-image ${tones[index % tones.length]}`}>
        {agent.image_url
          ? <Image src={agent.image_url} alt={agent.name} fill sizes="(max-width: 700px) 56vw, 220px" />
          : <span>{initials(agent.name)}</span>}
      </div>
      <div><span className="agent-position">{agent.position}</span><h2>{agent.name}</h2><p>{agent.bio}</p><span className="text-link">View profile <ArrowRight /></span></div>
    </button>)}</div>
    {selected && <div className="agent-sheet" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) setSelected(null);
    }}>
      <section className="agent-sheet-card" role="dialog" aria-modal="true" aria-labelledby="selected-agent-name">
        <button className="agent-sheet-close" type="button" onClick={() => setSelected(null)} aria-label="Close agent details"><X /></button>
        <div className={`agent-sheet-avatar ${tones[agents.indexOf(selected) % tones.length]}`}>
          {selected.image_url ? <Image src={selected.image_url} alt="" fill sizes="76px" /> : initials(selected.name)}
        </div>
        <p className="agent-position">{selected.position}</p>
        <h2 id="selected-agent-name">{selected.name}</h2>
        <p className="agent-sheet-bio">{selected.bio} Message {selected.name.split(" ")[0]} through the NexaStay team and we&apos;ll connect you.</p>
        <div className="agent-sheet-actions">
          <a className="button button-whatsapp" href={`https://wa.me/${whatsapp}?text=${message}`} target="_blank" rel="noreferrer"><MessageCircle />Message {selected.name.split(" ")[0]}</a>
          <a className="button button-outline" href={`mailto:${selected.email}?subject=${encodeURIComponent(`Enquiry for ${selected.name}`)}`}><Mail />Email the team</a>
        </div>
      </section>
    </div>}
  </>;
}
