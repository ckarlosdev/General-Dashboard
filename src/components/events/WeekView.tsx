import { Button } from "react-bootstrap";
import type { Indicator, MyJobEvent } from "../../types";
import "../../styles/week.css";
import { INDICATORS_CONFIG, handleReportClick } from "../../utils/reportUtils";
import { useJobs } from "../../hooks/useJobs";
import useModalStore from "../../stores/useModalStore";

type Props = {
  event: MyJobEvent;
};

function WeekView({ event }: Props) {
  const { reports } = event;
  const { data: jobsData } = useJobs();
  const { setSelectedId, openModal } = useModalStore();

  const jobSelected = jobsData?.find((job) => job.jobsId === event.jobsId);

  const handleSetReport = (
    e: React.MouseEvent | React.TouchEvent,
    ind: Indicator,
    isDone: boolean,
    reportId: number | null,
  ) => {
    const reportTypeMap: Record<string, any> = {
      Daily: "DAILY",
      Hazard: "HAZARD",
      Silica: "SILICA",
      Checklist: "CHECKLIST",
      Demo: "DEMO",
    };

    const modalType = reportTypeMap[ind.name];

    if (modalType) {
      if (reportId) {
        setSelectedId(reportId);
      }
      handleReportClick(e, ind.name, isDone, () => openModal(modalType));
    } else {
      console.warn(`No modal configured: ${ind.name}`);
    }
  };

  return (
    <div
      title={`${jobSelected?.name}\n${jobSelected?.address}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        padding: "2px",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* ID en vertical o muy pequeño */}
      <div
        style={{
          fontSize: "10px",
          fontWeight: "bold",
          writingMode: "vertical-lr", // Opcional: gira el texto si quieres que sea ultra flaco
          textOrientation: "upright",
          marginBottom: "2px",
        }}
      >
        #{jobSelected?.number}
      </div>

      {/* Contenedor de indicadores en VERTICAL */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        {INDICATORS_CONFIG.map((ind) => {
          const isDone = !!reports[ind.key];
          return (
            <Button
              key={ind.key}
              title={ind.name}
              onClick={(e) => handleSetReport(e, ind, isDone, reports[ind.key])}
              style={{
                width: "20px",
                height: "20px",
                padding: "0", // Quitamos padding para que la letra no se mueva
                fontSize: "9px",
                fontWeight: "bold",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // Lógica de colores que ya tenías
                backgroundColor: isDone ? "#22c55e" : "rgba(255,255,255,0.3)",
                color: isDone ? "white" : "#64748b",
                border: isDone ? "none" : "1px solid rgba(0,0,0,0.1)",
                opacity: isDone ? 1 : 0.6,
              }}
            >
              {ind.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default WeekView;
