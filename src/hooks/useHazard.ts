import { useQuery } from "@tanstack/react-query";
import { api } from "./apiConfig";
import type { HazardReport, OptionCB } from "../types";

const queryOptions = (): Promise<OptionCB[]> => {
  return api.get("v1/ptCheckboxOptions").then((response) => response.data);
};

export function useOptions() {
  return useQuery({
    queryKey: ["options"],
    queryFn: queryOptions,
    retry: false,
  });
}

const queryGetHazardReportById = async (
  preTasksId: number,
): Promise<HazardReport> => {
  const { data } = await api.get(`v1/pretask/dto/${preTasksId}`);
  return data;
};

export function useGetHazardReport(preTasksId: number) {
  return useQuery({
    queryKey: ["hazardReport", preTasksId],
    queryFn: () => queryGetHazardReportById(preTasksId),
    enabled: !!preTasksId,
    retry: false,
  });
}
