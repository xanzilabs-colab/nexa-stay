import Link from "next/link";
import { AgentGrid } from "@/components/agent-grid";
import { OwnerPanel } from "@/components/owner-panel";
import { getTeamAgents } from "@/lib/data";

export default async function AgentsPage() {
  const agents = await getTeamAgents();
  return <main className="reference-page">
    <section className="page-intro"><div className="site-container">
      <div className="breadcrumbs"><Link href="/">Home</Link><span>›</span><span>Agents</span></div>
      <h1>Local people, helpful advice</h1>
      <p>Our team knows these places and is ready to help you find the right fit.</p>
    </div></section>
    <section className="design-section"><div className="site-container"><AgentGrid agents={agents} /></div></section>
    <section className="design-section section-soft"><OwnerPanel /></section>
  </main>;
}