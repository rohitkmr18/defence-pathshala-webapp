"use client";

import { useEffect, useState } from "react";
import { getHealth, type HealthResponse } from "@/lib/api";

export default function Home() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHealth()
      .then(setHealth)
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Unable to reach backend"
        );
      });
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-xl rounded-2xl border p-8">
        <h1 className="text-3xl font-bold">Defence Pathshala</h1>

        <p className="mt-2 text-gray-600">
          UPSC Defence PYQ Intelligence Platform
        </p>

        <div className="mt-8">
          <h2 className="font-semibold">Backend Status</h2>

          {health && (
            <div className="mt-3 rounded-lg bg-green-50 p-4">
              <p>Status: {health.status}</p>
              <p>Service: {health.service}</p>
              <p>Version: {health.version}</p>
            </div>
          )}

          {error && (
            <div className="mt-3 rounded-lg bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {!health && !error && (
            <p className="mt-3 text-gray-500">Connecting to backend...</p>
          )}
        </div>
      </div>
    </main>
  );
}