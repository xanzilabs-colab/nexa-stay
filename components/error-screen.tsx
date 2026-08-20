"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw, Search } from "lucide-react";

type ErrorScreenProps = { title: string; message: string; retry?: () => void; admin?: boolean };

export function ErrorScreen({ title, message, retry, admin = false }: ErrorScreenProps) {
  return <main className={`error-screen${admin ? " admin-error" : ""}`}><div><p className="eyebrow">{admin ? "ADMIN WORKSPACE" : "NEXASTAY"}</p><span className="error-code">{retry ? "Something went wrong" : "404"}</span><h1>{title}</h1><p>{message}</p><div className="error-actions">{retry && <button className="button navy" onClick={retry}><RefreshCw size={17}/> Try again</button>}<Link className="button teal" href={admin ? "/admin" : "/properties"}>{admin ? <><ArrowLeft size={17}/> Back to admin</> : <><Search size={17}/> Explore properties</>}</Link></div></div></main>;
}