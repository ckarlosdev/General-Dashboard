import type { GroupedData, Report, TimelineItem } from "../types";

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

export const getGroupedMonths = (timelineData: TimelineItem[]) => {
  const groups: GroupedData = {};

  timelineData?.forEach((item) => {
    const dateObj = new Date(item.drDate + "T00:00:00");

    const monthYear = dateObj.toLocaleDateString("en-EN", {
      month: "long",
      year: "numeric",
    });
    const formattedMonthStr =
      monthYear.charAt(0).toUpperCase() + monthYear.slice(1);

    const dayLabel = dateObj.toLocaleDateString("en-EN", {
      weekday: "short",
      day: "2-digit",
    });
    const formattedDayStr =
      dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1);

    if (!groups[formattedMonthStr]) {
      groups[formattedMonthStr] = [];
    }

    const alreadyExists = groups[formattedMonthStr].some(
      (g) => g.drId === item.drId,
    );

    if (!alreadyExists) {
      groups[formattedMonthStr].push({
        dayLabel: formattedDayStr, // "Mon 01"
        drId: item.drId, // 1160
        foreman: item.foreman, // "Deno D Teat"
        fullDate: item.drDate, // "2026-06-01"
      });
    }
  });

  // Retorna la matriz lista para el .map() en React
  return Object.entries(groups);
};
