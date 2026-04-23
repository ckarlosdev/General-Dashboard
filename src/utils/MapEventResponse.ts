import type { EventResponse, MyJobEvent, ReportStatus } from "../types";

export const MapEventResponse = (response: EventResponse): MyJobEvent => {
  // 1. Transformamos los reportes de number/null a boolean
  const reports: ReportStatus = {
    daily: response.reports.daily,
    hazard: response.reports.hazard,
    silica: response.reports.silica,
    checklist: response.reports.checklist,
    demo: response.reports.demo,
  };

  const start = new Date(`${response.date}T${response.start}`);
  const end = new Date(`${response.date}T${response.end}`);

  return {
    id: response.id,
    jobsId: response.jobsId,
    // title: `Job #${response.jobsId}`, // Puedes agregar lógica de título aquí
    start,
    end,
    reports,
  };
};
