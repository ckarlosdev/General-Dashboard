import type { Report } from "../types";

export const INDICATORS_CONFIG: {
  label: string;
  key: keyof Report;
  name: string;
}[] = [
  { label: "D", key: "daily", name: "Daily" },
  { label: "H", key: "hazard", name: "Hazard" },
  { label: "S", key: "silica", name: "Silica" },
  { label: "C", key: "checklist", name: "Checklist" },
  { label: "M", key: "demo", name: "Demo" },
];

export const handleReportClick = (
  e: React.MouseEvent | React.TouchEvent,
  typeReport: string,
  isDone: boolean,
  openModal: (show: boolean) => void,
) => {
  e.stopPropagation();

  if (!isDone) {
    console.log(`⚠️ Report "${typeReport}" not created yet.`);
    return false; // Retornamos false si no se pudo abrir
  }

  openModal(true);
  return true; // Retornamos true si todo salió bien
};
