import type { ReactNode } from "react";
import type { AdvantageIconId } from "@/lib/advantageIcons";

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export function AdvantageIcon({ name }: { name: AdvantageIconId }) {
  switch (name) {
    case "compliance":
      return (
        <Svg>
          <path d="M12 3.4 5.2 6.2v5.4c0 4.4 3 7.5 6.8 8.8 3.8-1.3 6.8-4.4 6.8-8.8V6.2z" />
          <path d="M8.4 12.1 11 14.7l4.8-5.2" />
        </Svg>
      );
    case "materials":
      return (
        <Svg>
          <path d="M4.8 16.4 12 19.8l7.2-3.4" />
          <path d="M4.8 12.6 12 16l7.2-3.4" />
          <path d="M12 4.2 4.8 7.6 12 11l7.2-3.4z" />
          <path d="M16.6 5.2 18 3.8M18.4 6.4h2M16.8 7.6 18 8.8" />
        </Svg>
      );
    case "qc":
      return (
        <Svg>
          <path d="M8.2 5.2h7.6a1.6 1.6 0 0 1 1.6 1.6v12a1.6 1.6 0 0 1-1.6 1.6H8.2A1.6 1.6 0 0 1 6.6 18.8v-12A1.6 1.6 0 0 1 8.2 5.2z" />
          <path d="M9.4 5.2V4.4a1.4 1.4 0 0 1 1.4-1.4h2.4A1.4 1.4 0 0 1 14.6 4.4v.8" />
          <path d="m8.8 10.6 1.5 1.5 2.8-3" />
          <path d="m8.8 14.8 1.5 1.5 2.8-3" />
        </Svg>
      );
    case "production":
      return (
        <Svg>
          <path d="M12 3.6c2.2 0 4 1.1 5 2.8-1 1.7-2.8 2.8-5 2.8s-4-1.1-5-2.8c1-1.7 2.8-2.8 5-2.8z" />
          <circle cx="12" cy="6.4" r="1.2" />
          <path d="M4 19.4h16" />
          <path d="M5.4 19.4V11.6L8.8 9l2.6 2 2.6-2.2 4.6 3v7.6" />
          <path d="M8.6 19.4v-3.2h3v3.2" />
          <path d="M7.4 13.4h2v1.8h-2zM11 13.4h2v1.8h-2zM14.6 13.4h2v1.8h-2z" />
        </Svg>
      );
    case "aftersales":
      return (
        <Svg>
          <path d="M5.6 12.6v-1.8A6.4 6.4 0 0 1 12 4.6a6.4 6.4 0 0 1 6.4 6.2v1.8" />
          <path d="M5.6 12H7.8A1.4 1.4 0 0 1 9.2 13.4v2.2A1.4 1.4 0 0 1 7.8 17H6.2A1.6 1.6 0 0 1 4.6 15.4v-1.8A1.6 1.6 0 0 1 5.6 12z" />
          <path d="M18.4 12h-2.2A1.4 1.4 0 0 0 14.8 13.4v2.2A1.4 1.4 0 0 0 16.2 17h1.6a1.6 1.6 0 0 0 1.6-1.6v-1.8A1.6 1.6 0 0 0 18.4 12z" />
          <path d="M12 16.8v.8a1.6 1.6 0 0 0 1.6 1.6" />
          <path d="m9.2 19.6 1.7 1.6 3.8-4" />
        </Svg>
      );
    case "innovation":
      return (
        <Svg>
          <path d="M9.2 14.4c-.2-2.2-2.2-3.2-2.2-6A5 5 0 0 1 12 3.6a5 5 0 0 1 5 4.8c0 2.8-2 3.8-2.2 6" />
          <path d="M9.6 14.4h4.8" />
          <path d="M10 16.4h4M10.5 18.4h3" />
          <path d="M12 2.4v-.6M19.2 8.4h.6M4.2 8.4h-.6M16.8 4.2l.5-.5M7.2 4.2l-.5-.5" />
        </Svg>
      );
    default:
      return (
        <Svg>
          <circle cx="12" cy="12" r="7" />
        </Svg>
      );
  }
}
