import { useQuery } from "@tanstack/react-query";
import { api } from "./apiConfig";
import type { apiClReport } from "../types";

const queryChecklist = async (checklistId: number): Promise<apiClReport> => {
  const { data } = await api.get(`v1/cl/${checklistId}`);
  return data;
};

export function useChecklist(checklistId: number) {
  return useQuery({
    queryKey: ["checklist", checklistId],
    queryFn: () => queryChecklist(checklistId),
    enabled: !!checklistId,
    retry: false,
  });
}