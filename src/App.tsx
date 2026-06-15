import CalendarView from "./components/CalendarView";
import Title from "./components/Title";
import JobsList from "./components/JobsList";
import JobModal from "./components/modals/JobModal";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../src/styles/sidebar.css";
import DailyModal from "./components/modals/dailyReport/DailyModal";
import HazardModal from "./components/modals/HazardModal";
import useModalStore from "./stores/useModalStore";
import ChecklistModal from "./components/modals/ChecklistModal";
import SilicaModal from "./components/modals/SilicaModal";
import DemoModal from "./components/modals/DemoModal";
import TLModal from "./components/TLModal";

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const { activeModal, show } = useModalStore();

  return (
    <>
      <div className="app-container">
        {/* Header Fijo */}
        <header className="top-header p-3 border-bottom bg-white text-center">
          <Title />
        </header>

        {/* Cuerpo con Flexbox Horizontal */}
        <div className="dashboard-body">
          {/* SIDEBAR */}
          <aside
            className={`sidebar-container ${!isOpen ? "sidebar-closed" : ""}`}
          >
            {/* Botón "Tirador" */}
            <button
              className="sidebar-toggle-btn"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <FaChevronLeft size={12} />
              ) : (
                <FaChevronRight size={12} />
              )}
            </button>

            {/* Contenido: Se oculta cuando isOpen es false */}
            {isOpen && (
              <div className="sidebar-content">
                <div className="p-3 border-bottom bg-light">
                  <h5 className="mb-0 fw-bold text-primary">Jobs List</h5>
                </div>
                <div className="p-2 flex-grow-1 overflow-auto">
                  <JobsList />
                </div>
              </div>
            )}
          </aside>

          {/* CALENDARIO: Siempre a la derecha, nunca debajo */}
          <main className="main-content">
            <div className="calendar-card shadow-sm p-3 bg-white rounded">
              <CalendarView />
            </div>
          </main>
        </div>
      </div>

      <JobModal />
      {show && activeModal === "DAILY" && <DailyModal />}
      {show && activeModal === "HAZARD" && <HazardModal />}
      {show && activeModal === "CHECKLIST" && <ChecklistModal />}
      {show && activeModal === "SILICA" && <SilicaModal />}
      {show && activeModal === "DEMO" && <DemoModal />}
      {show && activeModal === "TIMELINE" && <TLModal />}
    </>
  );
}

export default App;
