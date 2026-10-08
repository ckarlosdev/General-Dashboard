// GET /api/v1/jobs/{jobId}/summary
export interface EmployeeSummary {
  employeeTitle: string;
  employeeName: string;
  totalReports: number;
  totalEmployeeEntries: number;
  totalHours: number;
}

export interface EquipmentSummary {
  equipmentName: string;
  totalReports: number;
  totalEquipmentEntries: number;
  totalHours: number;
}

export interface JobSummaryResponse {
  jobId: number;
  jobNumber: string;
  jobName: string;
  totalLaborHours: number;
  totalEquipmentHours: number;
  employeeSummaries: EmployeeSummary[];
  equipmentSummaries: EquipmentSummary[];
}

// GET /api/v1/jobs/{jobId}/daily-reports
export interface EmployeeDetail {
  drEmployeesId: number;
  employeeName: string;
  employeeTitle: string;
  inHour: string;
  outHour: string;
  lunch: boolean;
  hoursWorked: number;
}

export interface DailyReportGroup {
  reportDate: string;
  foreman: string;
  dailyTotalHours: number;
  employees: EmployeeDetail[];
}

export interface JobDailyReportsResponse {
  jobId: number;
  jobNumber: string;
  jobName: string;
  startDate: string;
  endDate: string;
  reportsByDate: DailyReportGroup[];
}

export interface JobDetailsData {
  jobId: number;
  jobNumber: string;
  jobName: string;
  totalLaborHours: number;
  totalEquipmentHours: number;
  employeeSummaries: EmployeeSummary[];
  equipmentSummaries: EquipmentSummary[];
}

export interface MetricDetailViewProps {
  type: string; // "Man Power" | "Equipment" | etc.
  data?: JobDetailsData;
}


export interface DashboardSummaryDTO {
  // Ajusta las propiedades según tu DTO
  totalHours?: number;
  completedTasks?: number;
  pendingTasks?: number;
  // ...
}

export interface GetDashboardSummaryParams {
  jobId: number | string;
  startDate?: string; // Formato YYYY-MM-DD
  endDate?: string;   // Formato YYYY-MM-DD
}

export interface ToolItem {
  date: string; // YYYY-MM-DD
  name: string;
  totalQuantity: number;
}

export interface ToolsDetailProps {
  tools?: ToolItem[];
}