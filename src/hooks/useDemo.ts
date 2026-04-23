import { useQuery } from "@tanstack/react-query";
import type { Item, ReportData } from "../types";
import { api } from "./apiConfig";

const queryItems = (): Promise<Item[]> => {
  return api.get("v1/demoItems/actives").then((response) => response.data);
};

export function useItems() {
  return useQuery({
    queryKey: ["items"],
    queryFn: queryItems,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });
}

const queryDemoChecklist = async (
  demoChecklist: number,
): Promise<ReportData> => {
  const { data } = await api.get(`/v1/demoChecklist/${demoChecklist}`);
  return data;
};

export function useDemoChecklist(demoChecklist: number) {
  return useQuery({
    queryKey: ["demoChecklist", demoChecklist],
    queryFn: () => queryDemoChecklist(demoChecklist),
    enabled: !!demoChecklist,
    retry: false,
  });
}