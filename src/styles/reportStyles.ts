import type { CSSProperties } from "react";

export const reportStyles = {
  statBadge: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    padding: "0 12px",
    borderLeft: "1px solid #e2e8f0",
  } as CSSProperties,

  label: {
    fontSize: "0.55rem",
    fontWeight: "700",
    color: "#64748b",
    letterSpacing: "0.05em",
    textTransform: "uppercase", // Opcional: para un look más industrial
  } as CSSProperties,

  value: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#0f172a",
  } as CSSProperties,
};
