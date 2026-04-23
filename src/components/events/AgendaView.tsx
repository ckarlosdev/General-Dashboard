import { useJobs } from "../../hooks/useJobs";
import type { MyJobEvent } from "../../types";
import { INDICATORS_CONFIG } from "../../utils/reportUtils";
import ReportButton from "./ReportButton";

type Props = {
  event: MyJobEvent;
};

function AgendaView({ event }: Props) {
  const { reports } = event;
  const { data: jobsData } = useJobs();

  const jobSelected = jobsData?.find((job) => job.jobsId === event.jobsId);

  // console.log(reports);

  return (
    <div
      title={`${jobSelected?.name}\n${jobSelected?.address}`}
      style={{ padding: "2px 0", fontSize: "11px", textAlign: "right" }}
    >
      <div
        style={{ fontWeight: "bold", marginBottom: "2px", color: "#212529" }}
      >
        <span style={{ color: "#6c757d", marginRight: "5px" }}>
          {event.id} #{jobSelected?.number}
        </span>
        {jobSelected?.name}
      </div>

      <div style={{ marginBottom: "6px" }}>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(jobSelected?.address || "")}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "11px",
            color: "#0d6efd",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <i
            className="bi bi-geo-alt-fill me-1"
            style={{ fontSize: "10px" }}
          ></i>
          {jobSelected?.address}
        </a>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end", // <--- Esto lo carga a la izquierda
          gap: "4px",
          flexWrap: "wrap",
        }}
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

export default AgendaView;
