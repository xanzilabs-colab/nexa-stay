"use client";
import { useEffect } from "react";
import { ErrorScreen } from "@/components/error-screen";
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) { useEffect(() => { console.error(error); }, [error]); return <ErrorScreen title="We could not load this page." message="The page ran into a temporary problem. Please try again, or continue exploring our stays." retry={reset} />; }