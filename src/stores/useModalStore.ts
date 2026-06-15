import { create } from "zustand";
import { persist } from "zustand/middleware";

type modalStore = {
  show: boolean;
  activeModal: string | null;
  selectedId: number | null;

  openModal: (
    type: "DAILY" | "HAZARD" | "SILICA" | "CHECKLIST" | "DEMO" | "TIMELINE",
  ) => void;
  closeModal: () => void;
  setSelectedId: (id: number) => void;
};

const useModalStore = create<modalStore>()(
  persist(
    (set) => ({
      show: false,
      activeModal: null,
      selectedId: null,

      openModal: (type) => set({ activeModal: type, show: true }),
      closeModal: () => set({ activeModal: null, show: false }),
      setSelectedId: (id) => set({ selectedId: id }),
    }),
    {
      name: "modals-storage",
    },
  ),
);

export default useModalStore;
