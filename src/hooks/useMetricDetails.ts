import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type {
  DashboardSummaryDTO,
  GetDashboardSummaryParams,
  JobDailyReportsResponse,
  JobSummaryResponse,
} from "../types/jobReports";
import { api } from "./apiConfig";

export const fetchJobSummary = async (
  jobId: number,
): Promise<JobSummaryResponse> => {
  const { data } = await api.get<JobSummaryResponse>(`/v1/dr/${jobId}/summary`);
  return data;
};

export const fetchJobDailyReports = async (
  jobId: number,
  startDate: string,
  endDate: string,
): Promise<JobDailyReportsResponse> => {
  const { data } = await api.get<JobDailyReportsResponse>(
    `/v1/dr/${jobId}/daily-reports`,
    {
      params: { startDate, endDate },
    },
  );
  return data;
};

export const fetchDashboardSummary = async ({
  jobId,
  startDate,
  endDate,
}: GetDashboardSummaryParams): Promise<DashboardSummaryDTO> => {
  const { data } = await api.get<DashboardSummaryDTO>(
    `/v1/dr/${jobId}/dashboard-summary`,
    {
      params: {
        startDate,
        endDate,
      },
    },
  );
  return data;
};

export const useJobSummary = (jobId: number) => {
  return useQuery({
    queryKey: ["jobSummary", jobId],
    queryFn: () => fetchJobSummary(jobId),
    enabled: !!jobId && !isNaN(jobId), // Ejecutar solo si existe un jobId válido
    staleTime: 1000 * 60 * 5, // 5 minutos de cache (datos de resumen no cambian tan seguido)
  });
};

// Hook 2: Detalle de Reportes Diarios con Filtro de Fechas
export const useJobDailyReports = (
  jobId: number,
  startDate: string,
  endDate: string,
) => {
  return useQuery({
    queryKey: ["jobDailyReports", jobId, startDate, endDate],
    queryFn: () => fetchJobDailyReports(jobId, startDate, endDate),
    // Previene la ejecución si falta el jobId o el rango de fechas
    enabled: !!jobId && !!startDate && !!endDate,
    staleTime: 1000 * 60 * 2, // 2 minutos de cache
  });
};

export const useDashboardSummary = ({
  jobId,
  startDate,
  endDate,
}: GetDashboardSummaryParams): UseQueryResult<DashboardSummaryDTO, Error> => {
  return useQuery({
    queryKey: ["dashboard-summary", jobId, startDate, endDate],

    queryFn: () => fetchDashboardSummary({ jobId, startDate, endDate }),
    enabled: Boolean(jobId),
  });
};
