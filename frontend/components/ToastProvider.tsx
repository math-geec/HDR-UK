"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type Toast = { id: number; type: "success" | "error"; message: string };

const ToastContext = createContext<{ show: (type: Toast["type"], message: string, ttl?: number) => void } | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Provide a safe no-op fallback so components can be rendered in tests
    // without wrapping in the provider. Tests that need visual toasts
    // should still wrap with `ToastProvider`.
    return { show: (_type: Toast["type"], _message: string, _ttl?: number) => {} };
  }
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback((type: Toast["type"], message: string, ttl = 4000) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ttl);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <div key={t.id} className={`px-4 py-2 rounded shadow-md text-white ${t.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
