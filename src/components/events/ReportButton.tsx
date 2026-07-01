import { Button } from "react-bootstrap";
import type { Indicator } from "../../types";
import { handleReportClick } from "../../utils/reportUtils";
import useModalStore from "../../stores/useModalStore";

type Props = { ind: Indicator; isDone: boolean; reportId: number | null };

function ReportButton({ ind, isDone, reportId }: Props) {
  const { setSelectedId, openModal } = useModalStore();

  const handleSetReport = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();

    if (e.type === "touchstart") {
      e.preventDefault();
    }

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
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <Button
        key={ind.key}
        title={ind.name} // Al pasar el mouse muestra el nombre completo
        onClick={(e) => handleSetReport(e)}
        onTouchStart={handleSetReport}
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          fontWeight: "bold",
          cursor: "pointer",
          backgroundColor: isDone ? "#22c55e" : "rgba(255,255,255,0.3)",
          color: isDone ? "white" : "#64748b",
          border: isDone ? "none" : "1px solid rgba(0,0,0,0.1)",
          opacity: isDone ? 1 : 0.6,
        }}
      >
        {ind.label}
      </Button>
    </div>
  );
}

export default ReportButton;
