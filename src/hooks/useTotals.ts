import { useQuery } from "@tanstack/react-query";
import type { DRSummary, TimelineItem } from "../types";
import { api } from "./apiConfig";

const queryTotals = async (jobNumber: string): Promise<DRSummary[]> => {
  const url = `v1/dailyReport/summary/${jobNumber}`;
  // console.log("🚀 Llamando a:", url);
  const response = await api.get(url);
  return response.data;
};

export function useTotals(jobNumber: string) {
  const query = useQuery({
    queryKey: ["totals", jobNumber],
    queryFn: () => queryTotals(jobNumber),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    enabled: !!jobNumber,
  });

  return query;
}

const queryTimeline = async (jobNumber: string): Promise<TimelineItem[]> => {
  const url = `v1/dashboard/timeline/${jobNumber}`;
  // console.log("🚀 Llamando a:", url);
  const response = await api.get(url);
  return response.data;
};

export function useTimeline(jobNumber: string) {
  const query = useQuery({
    queryKey: ["timeline", jobNumber],
    queryFn: () => queryTimeline(jobNumber),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    enabled: !!jobNumber,
  });

  return query;
}
