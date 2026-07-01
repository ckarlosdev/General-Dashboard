import { create } from "zustand";

type assignmentStore = {
  typeView: string;
  jobsSelected: number[];

  setTypeView: (type: string) => void;
  setJobsSelected: (jobIds: number[]) => void;
  toggleJobSelected: (jobId: number) => void;
  clearSelected: () => void;
  syncJobsWithData: (
    eventIds: number[],
    isFocus: boolean,
    focusId: number | null,
  ) => void;
};

const useAssignmentStore = create<assignmentStore>()((set, get) => ({
  typeView: "Actual",
  jobsSelected: [],

  setTypeView: (type) =>
    set((state) => ({
      ...state,
      typeView: type,
    })),
  setJobsSelected: (jobIds) =>
    set((state) => {
      const current = state.jobsSelected;

      const same =
        current.length === jobIds.length &&
        current.every((id) => jobIds.includes(id));

      if (same) {
        return state;
      }

      return {
        jobsSelected: jobIds,
      };
    }),
  toggleJobSelected: (jobId) =>
    set((state) => {
      const isAlreadySelected = state.jobsSelected.includes(jobId);
      if (isAlreadySelected) {
        // Si ya está, lo filtramos (REMOVE)
        return {
          jobsSelected: state.jobsSelected.filter((id) => id !== jobId),
        };
      } else {
        // Si no está, lo agregamos (ADD)
        return {
          jobsSelected: [...state.jobsSelected, jobId],
        };
      }
    }),
  clearSelected: () => set({ jobsSelected: [] }),

  syncJobsWithData: (
    eventIds: number[],
    isFocus: boolean,
    focusId: number | null,
  ) => {
    if (isFocus && focusId) {
      const current = get().jobsSelected;

      if (current.length !== 1 || current[0] !== focusId) {
        set({ jobsSelected: [focusId] });
      }

      return;
    } else {
      const current = get().jobsSelected;
      const hasChanged =
        current.length !== eventIds.length ||
        !eventIds.every((id) => current.includes(id));

      if (hasChanged) {
        set({ jobsSelected: eventIds });
      }
    }
  },
}));

export default useAssignmentStore;
