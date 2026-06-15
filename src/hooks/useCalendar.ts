import { useQuery } from "@tanstack/react-query";
import type { EventResponse } from "../types";
import { api } from "./apiConfig";
import { MapEventResponse } from "../utils/MapEventResponse";
import { addDays, format, isSameDay } from "date-fns";

export function useEvents(
  startDate: Date,
  endDate: Date,
  jobId: number | null,
  isFocusMode: boolean,
) {
  // CORRECCIÓN AQUÍ: Si startDate y endDate son el mismo día (Vista de Día),
  // le sumamos un día a la fecha de fin para la consulta de la API,
  // así el backend buscará desde el 2026-06-15 00:00 hasta el 2026-06-16 00:00
  const adjustedEndDate = isSameDay(startDate, endDate)
    ? addDays(endDate, 1)
    : endDate;

  const startStr = format(startDate, "yyyy-MM-dd");
  const endStr = format(adjustedEndDate, "yyyy-MM-dd");

  const query = useQuery({
    // Mantén las strings ajustadas en la queryKey para que React Query sepa que el rango cambió
    queryKey: ["events", startStr, endStr, jobId, isFocusMode],
    queryFn: async () => {
      if (isFocusMode && jobId) {
        const response = await api.get(`v1/dashboard/events/${jobId}`);
        return response.data || [];
      }

      const response = await api.get(
        `v1/dashboard/events?start=${startStr}&end=${endStr}`,
      );
      if (response.status === 204 || !response.data) return [];
      return response.data;
    },
    select: (data: EventResponse[]) => data.map(MapEventResponse),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    enabled: !!startDate && !!endDate,
  });

  return query;
}

const queryEventsById = async (jobId: number): Promise<EventResponse[]> => {
  const response = await api.get(`v1/dashboard/events/${jobId}`);
  if (response.status === 204 || !response.data) {
    return [];
  }
  return response.data || [];
};

export function useGetEventsById(jobId: number) {
  const query = useQuery({
    queryKey: ["events", jobId],
    queryFn: () => queryEventsById(jobId),
    select: (data: EventResponse[]) => data.map(MapEventResponse),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    enabled: !!jobId, // no ejecuta si no hay fechas
  });

  return query;
}
