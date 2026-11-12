import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { isAdminSession } from "@/lib/admin-auth";
import { siteAsset } from "@/lib/site-assets";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const authenticated = await isAdminSession();

  return (
    <div className="admin-app-shell">
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="admin-topbar-primary">
            <Link className="admin-brand" href={authenticated ? "/admin" : "/"}>
              <Image className="admin-brand-logo" src={siteAsset("logo.png")} alt="NexaStay" width={64} height={64} />
              <span><small>ADMIN</small></span>
            </Link>
            {authenticated ? (
              <form action="/api/admin/logout" method="post">
                <button className="admin-topbar-logout" type="submit">Sign out</button>
              </form>
            ) : (
              <Link className="admin-topbar-back" href="/">Back to website</Link>
            )}
          </div>
          {authenticated && (
            <nav className="admin-topbar-nav" aria-label="Admin navigation">
              <Link href="/admin">Overview</Link>
              <Link href="/admin/settings/whatsapp">WhatsApp settings</Link>
            </nav>
          )}
        </div>
      </header>
      {children}
    </div>
  );
}
