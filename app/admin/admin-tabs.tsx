"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";

type TabKey = "analytics" | "invites" | "feedback";

export function AdminTabs({
  analytics,
  invites,
  feedback,
  unreadFeedback,
}: {
  analytics: ReactNode;
  invites: ReactNode;
  feedback: ReactNode;
  unreadFeedback: number;
}) {
  const [tab, setTab] = useState<TabKey>("analytics");

  const tabs: { key: TabKey; label: string; badge?: number }[] = [
    { key: "analytics", label: "Analytics" },
    { key: "invites", label: "Birthday invites" },
    { key: "feedback", label: "Feedback", badge: unreadFeedback },
  ];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Admin sections"
        className="mx-auto mt-8 flex max-w-5xl flex-wrap gap-1 rounded-2xl border-[2px] border-ink/85 bg-white p-1"
      >
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.key)}
              className={`relative flex-1 rounded-xl px-4 py-2.5 font-wordmark text-sm transition ${
                active ? "text-[var(--bg)]" : "text-ink/70 hover:text-ink"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="admin-tab-pill"
                  className="absolute inset-0 rounded-xl bg-ink shadow-[0_3px_0_rgba(26,37,64,0.45)]"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <span className="relative inline-flex items-center gap-2">
                {t.label}
                {t.badge !== undefined && t.badge > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      active ? "bg-[var(--bg)] text-ink" : "bg-accent text-white"
                    }`}
                  >
                    {t.badge}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <div hidden={tab !== "analytics"}>{analytics}</div>
        <div hidden={tab !== "invites"}>{invites}</div>
        <div hidden={tab !== "feedback"}>{feedback}</div>
      </div>
    </div>
  );
}
