import type { Event as CalendarEvent } from "react-big-calendar";

export type authUser = {
  email: string;
  fullName: string;
  id: string;
  roles: Role[];
};

export type Role = {
  id: number;
  name: string;
};

export type Job = {
  jobsId: number | null;
  number: string;
  type: string;
  name: string;
  address: string;
  contractor: string;
  contact: string;
  status: string;
  user: string;
};

export type Employee = {
  employeesId: number;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  status: string;
  title: string;
};

export type Equipment = {
  equipmentsId: number;
  family: string;
  number: string;
  name: string;
  manufacturing: string;
  model: string;
  year: string;
  purchaseDate: string;
  status: string;
  condition: string;
  serialNumber: string;
  hour: string;
};

export interface MyJobEvent extends CalendarEvent {
  id: number;
  jobsId: number;
  start: Date;
  end: Date;
  reports: ReportStatus;
}

export interface Report {
  daily: boolean;
  hazard: boolean;
  silica: boolean;
  checklist: boolean;
  demo: boolean;
}

export type Indicator = {
  label: string;
  key: keyof Report;
  name: string;
};

export type CurrentRange = {
  start: Date;
  end: Date;
};

export interface ReportStatus {
  daily: number | null;
  hazard: number | null;
  silica: number | null;
  checklist: number | null;
  demo: number | null;
}

export interface EventResponse {
  id: number;
  jobsId: number;
  date: string;
  start: string;
  end: string;
  reports: ReportStatus;
}

export type DRSummary = {
  type: string;
  value: string;
  count: number;
};

// *********************************************
//             DAILY REPORT
// *********************************************

export interface DailyReport {
  dailyReportId: number;
  jobsId: number;
  foreman: string;
  userName: string;
  date: string;
  description: string;
  manOther: string;
  equipmentOther: string;
  issues: string;
  employees: DrEmployee[];
  equipments: DrEquipment[];
  rentals: DrRental[];
  tools: DrTool[];
  dumpsters: DrDumpster[];
}

export interface DrEmployee {
  drEmployeesId: number;
  employeesId: number;
  inHour: string;
  outHour: string;
  lunch: string;
  ppe: string;
  comment: string;
}

export interface DrEquipment {
  drEquipmentsId: number;
  equipmentsId: number;
  employeesId: number;
  type: string;
  initialHour: string;
  newHour: string;
}

export interface DrRental {
  drRentalsId: number;
  employeesId: number;
  equipmentType: string;
  equipmentName: string;
  company: string;
  equipmentNumber: string;
  odometer: string;
}

export interface DrTool {
  drToolId: number;
  qty: number;
  name: string;
  other: string;
  comments: string;
}

export interface DrDumpster {
  drDumpstersId: number;
  sourceDumpster: string;
  sizeDumpster: string;
  typeDumpster: string;
  quantity: number;
}

// Hazard Report

export type OptionCB = {
  pretasksCheckboxOptionsId: number;
  name: string;
  type: string;
  description: string;
};

export type Activity = {
  activitiesId: number | null;
  activity: string;
  hazards: string;
  controls: string;
};

export type PretaskOption = {
  pretasksOptionsId: number | null;
  pretasksCheckboxOptionsId: number;
  other: string;
};

export type Signature = {
  temporalId: string;
  ptSignaturesId: number;
  employeesId: number;
  imgData: string | null;
};

export type HazardReport = {
  preTasksId: number | null;
  jobsId: number;
  userName: string;
  date: string;
  supervisor: string;
  comment: string;
  activities: Activity[];
  options: PretaskOption[];
  signatures: Signature[];
};

// SILICA

export type Control = {
  controlsId: number;
  controlGroup: string;
  controlType: string;
  typeDescription: string;
  descriptions: ControlDescription[];
};

export type ControlDescription = {
  controlsDescriptionsId: number;
  controlsId: number;
  controlName: string;
  componentType: string;
};

export type SilicaReport = {
  silicaId: number | null;
  jobsId: number | null;
  employeesId: number;
  eventDate: string;
  workDescription: string;
  ventilationArea: string;
  datePlan: string;
  equipmentDescription: string;
  signatureId: string;
  signatureFolder: string;
  silicaControls: SilicaControl[];
  diagramData?: string;
  createdBy: string;
  updatedBy: string;
};

export type SilicaControl = {
  silicaControlId: number;
  controlDescriptionId: number;
  controlAnswer: string;
};

// CHECKLIST

export type apiClReport = {
  equipmentsGoogleChecklistsId: number | null;
  jobsId: number;
  userName: string;
  date: string;
  checklists: apiChecklist[];
};

export type apiChecklist = {
  googleChecklistsId: number;
  equipmentNumber: string;
  equipmentName: string;
  operator: string;
  odometer: string;
  oil: string;
  hydraulic: string;
  filter: string;
  radiator: string;
  track: string;
  attachment: string;
  leaking: string;
  diesel: string;
  clean: string;
  comment: string;
  otherType: string;
};

// DEMO

export type Item = {
  demoItemsId: number;
  itemGroup: string;
  itemDescription: string;
  itemType: string;
  cardPosition: string;
  itemPosition: string;
};

export type ReportData = {
  demoChecklistsId: number | null;
  jobsId: number | null;
  checklistDate: string;
  buildingType: string | "";
  foreman: string | "";
  notes: string;
  signature: string | "";
  permits: string | "";
  items: ItemResponse[];
  createdBy: string;
  updatedBy: string;
};

export type ItemResponse = {
  temporalId: string;
  demoChecklistsItemsId: number | null;
  demoItemsId: number;
  response: string;
};

// PHOTOS

export type Photo = {
  photosId: number;
  dailyReportId: number;
  drDate: string;
  pathId: string;
  folderId: string;
  name: string;
  type: string;
};
