"use client";
import { useEffect } from "react";
import { ErrorScreen } from "@/components/error-screen";
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) { useEffect(() => { console.error(error); }, [error]); return <ErrorScreen admin title="The admin workspace could not load." message="This may be a temporary data or connection issue. Try again to reload the workspace." retry={reset} />; }