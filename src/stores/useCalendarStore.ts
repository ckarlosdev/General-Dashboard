import { Views, type View } from "react-big-calendar";
import type { CurrentRange } from "../types";
import { create } from "zustand";
import { endOfMonth, format, startOfMonth } from "date-fns";

type calendarStore = {
  view: View;
  date: Date;
  currentRange: CurrentRange;
  showJobModal: boolean;
  jobSelected: number | null;
  isJobFocusMode: boolean;
  selectedJobId: number | null;

  setJobSelected: (jobId: number) => void;
  setShowJobModal: (show: boolean) => void;
  setView: (view: View) => void;
  setDate: (dateValue: Date) => void;
  setCurrentRange: (range: { start: Date; end: Date }) => void;
  setIsJobFocusMode: (mode: boolean) => void;
  setSelectedJobId: (id: number | null) => void;
};

const useCalendarStore = create<calendarStore>()((set) => ({
      view: Views.WEEK,
      date: new Date(),
      currentRange: {
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date()),
      },
      showJobModal: false,
      jobSelected: null,
      isJobFocusMode: false,
      selectedJobId: null,

      setJobSelected: (jobId) => set({ jobSelected: jobId }),
      setShowJobModal: (show) => set({ showJobModal: show }),
      setView: (view) => set({ view }),
      setDate: (dateValue) => set({ date: dateValue }),
      setCurrentRange: (range: { start: Date; end: Date }) => {
        set({
          currentRange: {
            start: range.start, // Guardamos el objeto Date puro
            end: range.end,
          },
        });
      },
      setIsJobFocusMode: (mode) => set({ isJobFocusMode: mode }),
      setSelectedJobId: (id) => set({ selectedJobId: id }),
    }));

export default useCalendarStore;
