import { useJobs } from "../../hooks/useJobs";
import type { MyJobEvent } from "../../types";
import { INDICATORS_CONFIG } from "../../utils/reportUtils";
import ReportButton from "./ReportButton";

type Props = {
  event: MyJobEvent;
};

function DayView({ event }: Props) {
  const { reports } = event;
  const { data: jobsData } = useJobs();

  const job = jobsData?.find((job) => job.jobsId === event.jobsId);
  // console.log(reports);

  return (
    <div
      className="d-flex flex-column h-100"
      style={{ color: "#212529" }}
      title={`${job?.name}\n${job?.address}`}
    >
      {/* Header con ID y Nombre */}
      <div className="mb-1">
        <span className="text-muted fw-bold" style={{ fontSize: "18px" }}>
          #{job?.number} 
        </span>
        <div
          className="fw-bold "
          style={{ fontSize: "14px", lineHeight: "1.2" }}
        >
          {job?.name}
        </div>
      </div>

      {/* Dirección clickeable */}
      <div className="d-flex align-items-center mb-2">
        <i
          className="bi bi-geo-alt-fill text-danger me-1"
          style={{ fontSize: "12px" }}
        ></i>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job?.address || "")}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "12px",
            color: "#0d6efd", // Azul link estándar
            textDecoration: "none",
            fontWeight: "500",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {job?.address}
        </a>
      </div>

      {/* Botones de reporte (Indicadores) */}
      <div
        className=" pt-2 d-flex flex-wrap gap-1"
        style={{ borderTop: "1px solid #eee" }}
      >
        {INDICATORS_CONFIG.map((ind) => {
          const isDone = !!reports[ind.key];
          return (
            <ReportButton
              key={ind.key}
              isDone={isDone}
              ind={ind}
              reportId={reports[ind.key]}
            />
          );
        })}
      </div>
    </div>
  );
}

export default DayView;
