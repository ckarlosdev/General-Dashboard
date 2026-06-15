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
  const { currentRange, isJobFocusMode, selectedJobId } = useCalendarStore();
  const { toggleJobSelected, jobsSelected, setJobsSelected } =
    useAssignmentStore();
  const { data: jobsData } = useJobs();
  const { openModal, setSelectedId } = useModalStore();

  const { data: events, isLoading } = useEvents(
    currentRange.start,
    currentRange.end,
    selectedJobId,
    isJobFocusMode,
  );

  const uniqueJobs = useMemo(() => {
    // 1. Validaciones iniciales
    if (!events || !jobsData || !currentRange?.start || !currentRange?.end)
      return [];

    const registry = new Map();

    const rangeStartTs = new Date(currentRange.start).setHours(0, 0, 0, 0);
    const rangeEndTs = new Date(currentRange.end).setHours(23, 59, 59, 999);

    const filteredEvents = events.filter((event) => {
      // Caso Modo Enfoque
      if (isJobFocusMode) {
        return selectedJobId
          ? Number(event.jobsId) === Number(selectedJobId)
          : false;
      }

      const eventStartTs = new Date(event.start).getTime();
      return eventStartTs >= rangeStartTs && eventStartTs <= rangeEndTs;
    });

    // 3. Mapa de Jobs (O(n))
    const jobsMap = new Map(jobsData.map((j) => [Number(j.jobsId), j]));

    // 4. Registro de únicos
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
  }, [events, jobsData, currentRange, isJobFocusMode, selectedJobId]);

  const uniqueJobsSorted = useMemo(() => {
    return [...uniqueJobs].sort((a, b) =>
      String(a.jobNumber).localeCompare(String(b.jobNumber)),
    );
  }, [uniqueJobs]);

  const lastEventsIdsRef = useRef<string>("");

  useEffect(() => {
    // 1. Si no hay eventos, limpiamos la selección y salimos
    if (!events || events.length === 0) {
      if (lastEventsIdsRef.current !== "") {
        setJobsSelected([]);
        lastEventsIdsRef.current = "";
      }
      return;
    }

    // 2. Lógica para MODO ENFOQUE
    if (isJobFocusMode && selectedJobId) {
      // Si estamos en enfoque, forzamos que solo esté seleccionado el job enfocado
      // Solo actualizamos si no es lo que ya tenemos para evitar bucles
      if (
        jobsSelected.length !== 1 ||
        jobsSelected[0] !== Number(selectedJobId)
      ) {
        setJobsSelected([Number(selectedJobId)]);
      }
      return; // Salimos para no ejecutar la lógica de modo normal
    }

    // 3. Lógica para MODO NORMAL (la que ya teníamos)
    const currentEventsIds = [...new Set(events.map((e) => e.jobsId))]
      .sort()
      .join(",");

    if (currentEventsIds !== lastEventsIdsRef.current) {
      const allIds = [...new Set(events.map((e) => Number(e.jobsId)))];
      setJobsSelected(allIds);
      lastEventsIdsRef.current = currentEventsIds;
    }
  }, [events, isJobFocusMode, selectedJobId, setJobsSelected]);
  // Importante: añadimos selectedJobId a las dependencias

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
