import { useQuery } from "@tanstack/react-query";
import type { DailyReport, Photo } from "../types";
import { api } from "./apiConfig";

const queryDaily = async (drId: number): Promise<DailyReport> => {
  const response = await api.get(`v1/dailyReport/dto/${drId}`);
  return response.data;
};

export function useDailyReport(drId: number) {
  const query = useQuery({
    queryKey: ["DailyReport", drId],
    queryFn: () => queryDaily(drId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    enabled: !!drId,
  });

  return query;
}

const queryPhotos = async (type: string, drId: number): Promise<Photo[]> => {
  const url = `v1/photo/type/${drId}?typeReport=${encodeURIComponent(type)}`;
  console.log("🚀 Llamando a:", url);
  const response = await api.get(url);
  return response.data;
};

export function usePhotosByType(type: string, drId: number | null | undefined) {
  const query = useQuery({
    queryKey: ["photos", type, drId],
    queryFn: () => queryPhotos(type, drId!),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    enabled: !!type && !!drId,
  });

  return query;
}
