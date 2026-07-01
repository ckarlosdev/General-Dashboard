import { Button, ListGroup } from "react-bootstrap";
import useAssignmentStore from "../stores/useAssignmentStore";
import { useEffect, useMemo, useRef } from "react";
import { useEvents } from "../hooks/useCalendar";
import useCalendarStore from "../stores/useCalendarStore";
import { useJobs } from "../hooks/useJobs";
import JobFocusFilter from "./JobFocusFilter";
import useModalStore from "../stores/useModalStore";
import { RiTimelineView } from "react-icons/ri";

type Props = {};

function JobsList({}: Props) {

  const isJobFocusMode = useCalendarStore((state) => state.isJobFocusMode);
  const selectedJobId = useCalendarStore((state) => state.selectedJobId);

  const currentRangeStartStr = useCalendarStore((state) =>
    state.currentRange?.start?.toISOString(),
  );
  const currentRangeEndStr = useCalendarStore((state) =>
    state.currentRange?.end?.toISOString(),
  );

  const toggleJobSelected = useAssignmentStore(
    (state) => state.toggleJobSelected,
  );
  const jobsSelected = useAssignmentStore((state) => state.jobsSelected);
  const setJobsSelected = useAssignmentStore((state) => state.setJobsSelected);
  const { data: jobsData } = useJobs();
  const { openModal, setSelectedId } = useModalStore();

  const { data: events, isLoading } = useEvents(
    currentRangeStartStr ? new Date(currentRangeStartStr) : new Date(),
    currentRangeEndStr ? new Date(currentRangeEndStr) : new Date(),
    selectedJobId,
    isJobFocusMode,
  );

  const uniqueJobs = useMemo(() => {
    if (!events || !jobsData || !currentRangeStartStr || !currentRangeEndStr)
      return [];

    const registry = new Map();
    const rangeStartTs = new Date(currentRangeStartStr).setHours(0, 0, 0, 0);
    const rangeEndTs = new Date(currentRangeEndStr).setHours(23, 59, 59, 999);

    const filteredEvents = events.filter((event) => {
      if (isJobFocusMode) {
        return selectedJobId
          ? Number(event.jobsId) === Number(selectedJobId)
          : false;
      }
      const eventStartTs = new Date(event.start).getTime();
      return eventStartTs >= rangeStartTs && eventStartTs <= rangeEndTs;
    });

    const jobsMap = new Map(jobsData.map((j) => [Number(j.jobsId), j]));

    filteredEvents.forEach((event) => {
      const eJobId = Number(event.jobsId);
      if (!registry.has(eJobId)) {
        const jobDetail = jobsMap.get(eJobId);
        registry.set(eJobId, {
          id: eJobId,
          title: jobDetail?.name || jobDetail?.number || `Job #${eJobId}`,
          address: jobDetail?.address || "No address",
          jobNumber: jobDetail?.number || "N/A",
        });
      }
    });

    return Array.from(registry.values());
  }, [
    events,
    jobsData,
    currentRangeStartStr,
    currentRangeEndStr,
    isJobFocusMode,
    selectedJobId,
  ]);

  const uniqueJobsSorted = useMemo(() => {
    return [...uniqueJobs].sort((a, b) =>
      String(a.jobNumber).localeCompare(String(b.jobNumber)),
    );
  }, [uniqueJobs]);

  const jobsSelectedRef = useRef<number[]>([]);

  useEffect(() => {
    jobsSelectedRef.current = jobsSelected;
  }, [jobsSelected]);


  useEffect(() => {
    if (!events || events.length === 0) return;

    if (isJobFocusMode && selectedJobId) {
      setJobsSelected([Number(selectedJobId)]);
      return;
    }

    const allIds = [...new Set(events.map((e) => Number(e.jobsId)))];

    setJobsSelected(allIds);
  }, [events, isJobFocusMode, selectedJobId, setJobsSelected]);

  if (isLoading) return <div>Loading Jobs...</div>;

  return (
    <div
      style={{
        marginTop: "20px",
        maxHeight: "70vh", // Ajusta este valor según cuánto espacio ocupen tus headers/filtros
        overflowY: "auto",
        paddingRight: "5px", // Pequeño espacio para que el scrollbar no tape el contenido
      }}
    >
      <JobFocusFilter />

      <ListGroup>
        {uniqueJobsSorted.length === 0 ? (
          // 🔍 CASO VERDADERO: Qué mostrar si la lista está vacía
          <ListGroup.Item className="text-center py-4 text-muted bg-light border-dashed">
            <i
              className="bi bi-folder-x d-block mb-2"
              style={{ fontSize: "1.5rem" }}
            ></i>
            No Reports Data Found.
          </ListGroup.Item>
        ) : (
          // 📋 CASO FALSO: Tu .map actual para renderizar los ítems
          uniqueJobsSorted.map((job) => (
            <ListGroup.Item
              // ... (todo tu código intacto)
              as="li"
              className="d-flex justify-content-between align-items-center"
              action
              title={job.address}
              key={job.id}
              onClick={() => toggleJobSelected(job.id)}
              active={jobsSelected.includes(job.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="ms-2 me-auto">
                <div className="fw-bold">
                  {job.jobNumber}
                  {" - "}
                  {job.title}
                </div>
              </div>
              <Button
                variant="link"
                size="sm"
                className="text-reset p-2 border-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(job.id);
                  openModal("TIMELINE");
                }}
                title="Ver calendario"
              >
                <RiTimelineView size={20} />
              </Button>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </div>
  );
}

export default JobsList;
