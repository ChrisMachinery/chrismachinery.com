"use client";

import { useEffect, useState } from "react";
import footprint from "../../../public/data/footprint.json";

type Node = { id: string; name: string; units: number; x: number; y: number };

export function FootprintMap() {
  const [active, setActive] = useState<Node | null>(null);
  const [nodes, setNodes] = useState<Node[]>(footprint.nodes as Node[]);

  useEffect(() => {
    fetch("/data/footprint.json")
      .then((res) => res.json())
      .then((data) => setNodes(data.nodes))
      .catch(() => undefined);
  }, []);

  return (
    <div className="relative mt-8 overflow-hidden rounded-lg bg-[#2a2a2a] p-4">
      <svg
        viewBox="0 0 100 60"
        className="h-auto w-full"
        role="img"
        aria-label={footprint.alt}
      >
        <rect width="100" height="60" fill="#1a1a1a" />
        <ellipse cx="22" cy="38" rx="16" ry="12" fill="#E0E0E0" />
        <ellipse cx="50" cy="34" rx="14" ry="10" fill="#E0E0E0" />
        <ellipse cx="62" cy="48" rx="8" ry="6" fill="#E0E0E0" />
        <ellipse cx="78" cy="42" rx="12" ry="9" fill="#E0E0E0" />
        <ellipse cx="84" cy="70" rx="8" ry="5" fill="#E0E0E0" transform="translate(0 -18)" />
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y * 0.6}
              r="1.4"
              fill="#FFE696"
              className="cursor-pointer"
              onMouseEnter={() => setActive(node)}
              onMouseLeave={() => setActive(null)}
            />
          </g>
        ))}
      </svg>
      {active ? (
        <div className="pointer-events-none absolute start-4 top-4 rounded bg-white px-3 py-2 text-sm text-brand shadow">
          {active.name}: {active.units} units shipped
        </div>
      ) : (
        <p className="mt-3 text-sm text-white/70">{footprint.alt}</p>
      )}
    </div>
  );
}
