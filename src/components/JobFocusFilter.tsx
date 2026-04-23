import { Form } from "react-bootstrap";
import useCalendarStore from "../stores/useCalendarStore";
import { useJobs } from "../hooks/useJobs";
import { useGetEventsById } from "../hooks/useCalendar";
import { useEffect, useRef } from "react";
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

  const hasJumped = useRef(false);

  const handleJobChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const jobId = Number(e.target.value);
    if (!jobId) {
      setSelectedJobId(null);
      hasJumped.current = false;
      return;
    }

    // Preparamos el salto
    hasJumped.current = true;
    setSelectedJobId(jobId);
  };

  useEffect(() => {
    if (
      hasJumped.current &&
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
      hasJumped.current = false;
    }
  };

  return (
    <div className="mx-2 mb-4 p-3 rounded-3 border bg-white shadow-sm">
      {/* Header del Filtro con Switch */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center">
          <div
            className={`me-2 p-1 rounded ${isJobFocusMode ? "bg-primary text-white" : "bg-light text-muted"}`}
          >
            <i className="bi bi-target" style={{ fontSize: "0.9rem" }}></i>
            <FiTarget style={{ fontSize: "0.9rem" }}/>
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
          <option value="">Select a project...</option>
          {allJobs?.map((j) => (
            <option key={j.jobsId} value={j.jobsId!}>
              {j.number} — {j.name}
            </option>
          ))}
        </Form.Select>

        {/* Indicador visual cuando está desactivado */}
        {/* {!isJobFocusMode && (
          <div
            className="position-absolute top-100 start-0 mt-1 ps-1 text-muted fw-light"
            style={{ fontSize: "0.7rem" }}
          >
            <i className="bi bi-info-circle me-1"></i>
            Enable to filter by specific job
          </div>
        )} */}
      </div>
    </div>
    // <div className="d-flex align-items-center gap-3 mb-3 p-2 bg-light rounded">
    //   <Form.Check
    //     type="switch"
    //     label=""
    //     checked={isJobFocusMode}
    //     onChange={handleSwitchChange}
    //   />

    //   <Form.Select
    //     value={selectedJobId || ""}
    //     onChange={handleJobChange}
    //     disabled={!isJobFocusMode}
    //   >
    //     <option value="">Select job...</option>
    //     {allJobs?.map((j) => (
    //       <option
    //         key={j.jobsId}
    //         value={j.jobsId!}
    //       >{`${j.number} - ${j.name}`}</option>
    //     ))}
    //   </Form.Select>
    // </div>
  );
}

export default JobFocusFilter;
