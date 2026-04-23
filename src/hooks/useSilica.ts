import { useQuery } from "@tanstack/react-query";
import type { Control, SilicaReport } from "../types";
import { api } from "./apiConfig";

const queryControls = (): Promise<Control[]> => {
  return api.get("v1/controls").then((response) => response.data);
};

export function useControls() {
  return useQuery({
    queryKey: ["controls"],
    queryFn: queryControls,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });
}

const querySilica = async (silicaId: number): Promise<SilicaReport> => {
  const { data } = await api.get(`v1/silica/${silicaId}`);
  return data;
};

export function useSilicaReport(silicaId: number) {
  return useQuery({
    queryKey: ["silica", silicaId],
    queryFn: () => querySilica(silicaId),
    enabled: !!silicaId,
    retry: false,
  });
}