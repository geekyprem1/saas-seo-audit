"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface Section {
  id: string;
  label: string;
}

interface StickySidebarNavProps {
  sections: Section[];
}

export function StickySidebarNav({ sections }: StickySidebarNavProps) {
  const [activeSection, setActiveSection] = React.useState<string>(sections[0]?.id || "");

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the last intersecting entry to handle overlapping sections
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by top coordinate to get the highest visible section
          visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="sticky top-6 flex flex-col space-y-1">
      <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
        Report Sections
      </h3>
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={cn(
            "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
            activeSection === section.id
              ? "bg-[var(--accent)] text-[var(--foreground)]"
              : "text-[var(--muted-foreground)]"
          )}
        >
          {section.label}
        </a>
      ))}
    </nav>
  );
}
