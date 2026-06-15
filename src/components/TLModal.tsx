import { Accordion, Button, Modal } from "react-bootstrap";
import useModalStore from "../stores/useModalStore";
import { useJobs } from "../hooks/useJobs";
import { getGroupedMonths } from "../utils/reportUtils";
// import data from "../mocks/timeLineData.json";
import { IoFolderOpenOutline } from "react-icons/io5";
import { useTimeline } from "../hooks/useTotals";
import useCalendarStore from "../stores/useCalendarStore";
import { endOfDay, startOfDay } from "date-fns";

type Props = {};

function TLModal({}: Props) {
  const { show, closeModal, selectedId } = useModalStore();
  const { data: jobs } = useJobs();
  const { setView, setDate, setCurrentRange } = useCalendarStore();
  const jobData = jobs?.find((job) => job.jobsId === selectedId);

  const { data } = useTimeline(jobData?.number!!);

  //   console.log(jobData);

  const groupedMonths = getGroupedMonths(data!!);

  //   console.log(groupedMonths);

  const handleDayButtonClick = (fullDateStr: string) => {
    // 1. TypeScript se quejaba porque date-fns no acepta strings.
    // Al añadir "T00:00:00" evitamos desfases de zona horaria (UTC vs Local)
    const fechaObjeto = new Date(fullDateStr + "T00:00:00");

    // 2. Calculamos el rango de 24 horas matemáticamente en el acto
    const s = startOfDay(fechaObjeto);
    const e = endOfDay(fechaObjeto);

    // 3. Despachamos todo al store de un solo golpe
    setDate(fechaObjeto);
    setView("day");
    setCurrentRange({ start: s, end: e });
  };

  return (
    <Modal show={show} onHide={() => closeModal()}>
      <Modal.Header closeButton>
        <Modal.Title
          className="w-100 text-center"
          style={{ fontWeight: "bold" }}
        >
          {"#"}
          {jobData?.number} {jobData?.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="overflow-auto pr-2" // Habilita el scroll automático
        style={{
          maxHeight: "65vh", // Ocupará máximo el 65% de la altura de la pantalla
          scrollBehavior: "smooth", // Hace que el movimiento sea suave
        }}
      >
        <Accordion
          defaultActiveKey="0"
          className="bg-transparent"
          id="minimalTimelineAccordion"
        >
          {!groupedMonths ? (
            <p>Cargando reportes...</p>
          ) : (
            groupedMonths?.map(([monthYear, reports], index) => (
              <Accordion.Item
                eventKey={String(index)}
                key={monthYear}
                className="border-0 mb-3 shadow-sm rounded overflow-hidden"
              >
                <Accordion.Header className="fw-bold">
                  <IoFolderOpenOutline
                    className="me-2 text-secondary"
                    size={18}
                  />
                  {monthYear}
                  <span
                    className="badge bg-light text-dark border ms-2"
                    style={{ fontSize: "0.75rem", fontWeight: "normal" }}
                  >
                    {reports.length} d
                  </span>
                </Accordion.Header>

                <Accordion.Body className="p-0">
                  <div className="accordion-body bg-white py-3 px-4">
                    {/* CONTENEDOR PRINCIPAL DE LA LÍNEA DE TIEMPO */}
                    {/* Creamos la línea vertical gris izquierda usando un borde */}
                    <div
                      className="minimal-timeline"
                      style={{
                        position: "relative",
                        borderLeft: "2px solid #e9ecef",
                        paddingLeft: "20px",
                        marginLeft: "10px",
                      }}
                    >
                      {reports.map((report) => (
                        <div
                          className="timeline-item-node fw-semibold d-flex align-items-center mb-3"
                          key={report.drId}
                          style={{
                            cursor: "pointer",
                            position: "relative",
                          }}
                          onClick={() => handleDayButtonClick(report.fullDate)}
                        >
                          {/* EL PUNTO DE LA LÍNEA DE TIEMPO */}
                          {/* Este div se posiciona justo encima de la línea vertical */}
                          <div
                            style={{
                              position: "absolute",
                              left: "-27px", // Centrado exacto sobre la línea gris
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              backgroundColor: "#0d6efd", // Azul Bootstrap (puedes cambiarlo a text-secondary si prefieres gris)
                              border: "2px solid #fff", // Efecto de corte con fondo blanco
                            }}
                          />

                          {/* CAJA DE LA FECHA (CON TAMAÑO FIJO IGUAL PARA TODAS) */}
                          <span
                            className="badge bg-light text-secondary border me-2 text-center d-inline-block"
                            style={{
                              width: "75px", // 👈 Ancho fijo idéntico para todas las fechas
                              paddingTop: "6px",
                              paddingBottom: "6px",
                              fontSize: "0.85rem",
                            }}
                          >
                            {report.dayLabel}
                          </span>

                          {/* INFORMACIÓN DEL CAPATAZ */}
                          <span
                            className="text-muted small"
                            style={{ fontSize: "0.80rem" }}
                          >
                            • {report.foreman}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))
          )}
        </Accordion>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => closeModal()}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TLModal;
