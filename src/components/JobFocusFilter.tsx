import { Form } from "react-bootstrap";
import useCalendarStore from "../stores/useCalendarStore";
import { useJobs } from "../hooks/useJobs";
import { useGetEventsById } from "../hooks/useCalendar";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiTarget } from "react-icons/fi";

type Props = {};

function JobFocusFilter({}: Props) {
  const {
    isJobFocusMode,
    setIsJobFocusMode,
    setSelectedJobId,
    setDate,
    setView,
    selectedJobId,
  } = useCalendarStore();
  const { data: allJobs } = useJobs();
  const { data: events } = useGetEventsById(selectedJobId ?? 0);

  // 1. Estado local para el filtro de estatus
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [yearFilter, setYearFilter] = useState<string>("ALL");

  const hasJumped = useRef(false);

  const handleJobChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const jobId = Number(e.target.value);
    if (!jobId) {
      setSelectedJobId(null);
      hasJumped.current = false;
      return;
    }

    hasJumped.current = true;
    setSelectedJobId(jobId);
  };

  useEffect(() => {
    if (!hasJumped.current) return;

    if (
      events &&
      events.length > 0 &&
      Number(events[0].jobsId) === Number(selectedJobId)
    ) {
      const dates = events
        .map((e) => new Date(e.start).getTime())
        .filter((t) => !isNaN(t));

      if (dates.length > 0) {
        const maxTimestamp = Math.max(...dates);
        const targetDate = new Date(maxTimestamp);

        hasJumped.current = false;

        setDate(targetDate);
        setView("month");
      }
    }
  }, [events, selectedJobId, setDate, setView]);

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const active = e.target.checked;
    setIsJobFocusMode(active);
    if (!active) {
      setSelectedJobId(null);
      setStatusFilter("ALL");
      hasJumped.current = false;
    }
  };

  const statusList = useMemo(() => {
    if (!allJobs) return [];
    const statuses = allJobs
      .map((j) => j.status)
      .filter((status): status is string => !!status); // Evita nulos o undefined
    return Array.from(new Set(statuses)); // Elimina duplicados
  }, [allJobs]);

  const yearsList = useMemo(() => {
    if (!allJobs) return [];

    const years = allJobs
      .map((j) => {
        if (!j.number || j.number.length < 2) return null;
        const prefijo = j.number.substring(0, 2); // Toma los 2 primeros caracteres (ej: "24")
        if (isNaN(Number(prefijo))) return null; // Asegura que sean números
        return `20${prefijo}`; // Lo convierte en "2024"
      })
      .filter((year): year is string => !!year);

    // Ordenar los años de más reciente a más antiguo
    return Array.from(new Set(years)).sort((a, b) => b.localeCompare(a));
  }, [allJobs]);

  const jobsFilteredAndSorted = useMemo(() => {
    if (!allJobs) return [];

    let resultado = [...allJobs];

    // Filtro A: Estatus
    if (statusFilter !== "ALL") {
      resultado = resultado.filter((j) => j.status === statusFilter);
    }

    // Filtro B: Año (NUEVO)
    if (yearFilter !== "ALL") {
      const dosDigitosAnio = yearFilter.substring(2, 4); // "2024" -> "24"
      resultado = resultado.filter(
        (j) => j.number && j.number.startsWith(dosDigitosAnio),
      );
    }

    // Paso C: Ordenar
    return resultado.sort((a, b) =>
      (b.number || "").localeCompare(a.number || ""),
    );
  }, [allJobs, statusFilter, yearFilter]);

  useEffect(() => {
    if (selectedJobId) {
      const jobActual = allJobs?.find((j) => j.jobsId === selectedJobId);
      if (jobActual) {
        const prefijoAnio = jobActual.number?.substring(0, 2);
        const cumpleStatus =
          statusFilter === "ALL" || jobActual.status === statusFilter;
        const cumpleAnio =
          yearFilter === "ALL" || yearFilter.endsWith(prefijoAnio || "---");

        if (!cumpleStatus || !cumpleAnio) {
          setSelectedJobId(null);
        }
      }
    }
  }, [statusFilter, yearFilter, selectedJobId, allJobs, setSelectedJobId]);

  return (
    <div className="mx-2 mb-4 p-3 rounded-3 border bg-white shadow-sm">
      {/* Header del Filtro con Switch */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center">
          <div
            className={`me-2 p-1 rounded ${isJobFocusMode ? "bg-primary text-white" : "bg-light text-muted"}`}
          >
            <FiTarget style={{ fontSize: "0.9rem" }} />
          </div>
          <span
            className="fw-bold text-dark"
            style={{ fontSize: "0.8rem", letterSpacing: "0.02em" }}
          >
            FOCUS MODE
          </span>
        </div>

        <Form.Check
          type="switch"
          id="focus-mode-switch"
          checked={isJobFocusMode}
          onChange={handleSwitchChange}
          className="custom-switch-lg"
          style={{ cursor: "pointer" }}
        />
      </div>

      {/* FILTROS SECUNDARIOS (Estatus y Año uno al lado del otro) */}
      <div className="row g-2 mb-2">
        {/* Selector de Estatus */}
        <div className="col-7">
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            disabled={!isJobFocusMode}
            className={`border-0 bg-light py-1.5 shadow-none text-muted ${!isJobFocusMode ? "opacity-50" : ""}`}
            style={{ fontSize: "0.75rem", borderRadius: "6px" }}
          >
            <option value="ALL">All Status</option>
            {statusList.map((status) => (
              <option key={status} value={status}>
                {status.toUpperCase()}
              </option>
            ))}
          </Form.Select>
        </div>

        {/* Selector de Año (NUEVO) */}
        <div className="col-5">
          <Form.Select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            disabled={!isJobFocusMode}
            className={`border-0 bg-light py-1.5 shadow-none text-muted ${!isJobFocusMode ? "opacity-50" : ""}`}
            style={{ fontSize: "0.75rem", borderRadius: "6px" }}
          >
            <option value="ALL">All Years</option>
            {yearsList.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Form.Select>
        </div>
      </div>

      {/* Selector de Job */}
      <div className="position-relative">
        <Form.Select
          value={selectedJobId || ""}
          onChange={handleJobChange}
          disabled={!isJobFocusMode}
          className={`border-0 bg-light py-2 shadow-none ${!isJobFocusMode ? "opacity-50" : ""}`}
          style={{
            fontSize: "0.85rem",
            borderRadius: "8px",
            fontWeight: selectedJobId ? "600" : "400",
            transition: "all 0.2s ease",
          }}
        >
          <option value="">
            {jobsFilteredAndSorted.length === 0 && isJobFocusMode
              ? "No projects found..."
              : "Select a project..."}
          </option>
          {jobsFilteredAndSorted.map((j) => (
            <option key={j.jobsId} value={j.jobsId!}>
              {j.number} - {j.name}
            </option>
          ))}
        </Form.Select>
      </div>
    </div>
  );
}

export default JobFocusFilter;
