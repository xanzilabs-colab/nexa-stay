import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { siteAsset } from "@/lib/site-assets";

export function OwnerPanel() {
  return <div className="site-container">
    <div className="owner-panel">
      <div className="owner-panel-copy">
        <h2>Own property in Gauteng? Talk to NexaStay.</h2>
        <p>Speak to the team about how short-term stays are presented, enquired on and looked after.</p>
        <ul><li><Check />Professional, clearly presented listings</li><li><Check />A local team handling guest enquiries</li><li><Check />A focus on the developments guests return to</li></ul>
        <Link className="button button-teal" href="/contact?topic=owners">Owners &amp; investors enquiry <ArrowRight /></Link>
      </div>
      <div className="owner-panel-image"><Image src={siteAsset("hero/Ellipse-ns-slider-1-1024x576.jpeg")} alt="Ellipse residences in Waterfall City" fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
    </div>
  </div>;
}
