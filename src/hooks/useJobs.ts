import { useQuery } from "@tanstack/react-query";
import { api } from "./apiConfig";
import type { Job } from "../types";

const queryJobs = async (): Promise<Job[]> => {
  const response = await api.get("v1/job");
  return response.data;
};

export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: queryJobs,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });
}