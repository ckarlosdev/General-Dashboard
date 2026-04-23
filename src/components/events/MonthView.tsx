import { useJobs } from "../../hooks/useJobs";
import type { MyJobEvent } from "../../types";

type Props = {
  event: MyJobEvent;
};

function MonthView({ event }: Props) {
  const { data: jobsData } = useJobs();

  const jobSelected = jobsData?.find((job) => job.jobsId === event.jobsId);

  return (
    <div
      title={`${jobSelected?.name}\n${jobSelected?.address}`}
      style={{
        fontSize: "9px",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%", // Ocupa todo el alto de la pildora
        paddingLeft: "4px",
      }}
    >
      #{jobSelected?.number}
    </div>
  );
}

export default MonthView;
