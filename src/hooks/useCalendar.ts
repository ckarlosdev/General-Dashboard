import { useQuery } from "@tanstack/react-query";
import type { EventResponse } from "../types";
import { api } from "./apiConfig";
import { MapEventResponse } from "../utils/MapEventResponse";
import { format } from "date-fns";

export function useEvents(
  startDate: Date,
  endDate: Date,
  jobId: number | null,
  isFocusMode: boolean,
) {
  const startStr = format(startDate, "yyyy-MM-dd");
  const endStr = format(endDate, "yyyy-MM-dd");
  
  const query = useQuery({
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
