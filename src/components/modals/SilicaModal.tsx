import { Accordion, Button, Col, Container, Modal, Row } from "react-bootstrap";
import useModalStore from "../../stores/useModalStore";
import { useControls, useSilicaReport } from "../../hooks/useSilica";
import { useJobs } from "../../hooks/useJobs";
import { GiDustCloud } from "react-icons/gi";
import useEmployees from "../../hooks/useEmployees";
import { useMemo } from "react";
import CanvasRenderer from "./CanvasRenderer";
import {
  BsCardText,
  BsFileEarmarkText,
  BsFillCheckCircleFill,
  BsTools,
} from "react-icons/bs";
import { FaCalendarAlt, FaPencilRuler, FaWind } from "react-icons/fa";

type Props = {};

function SilicaModal({}: Props) {
  const { show, closeModal, selectedId } = useModalStore();
  const { data: silicaData, isLoading } = useSilicaReport(selectedId!);
  const { data: jobs } = useJobs();
  const { data: employees } = useEmployees();
  const { data: controls } = useControls();

  const jobData = jobs?.find((job) => job.jobsId === silicaData?.jobsId);
  const foreman = employees?.find(
    (emp) => emp.employeesId === silicaData?.employeesId,
  );
  const fullName = foreman?.firstName + " " + foreman?.lastName;

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${month}-${day}-${year}`;
  };

  const silicaReport = useMemo(() => {
    const answersMap =
      silicaData?.silicaControls?.reduce(
        (acc, ans) => {
          acc[ans.controlDescriptionId] = ans.controlAnswer;
          return acc;
        },
        {} as Record<number, string>,
      ) || {};

    // 2. Mapeamos la estructura original agregando las respuestas
    return controls
      ?.map((group) => {
        const answeredDescriptions = group.descriptions
          .map((desc) => ({
            ...desc,
            answer: answersMap[desc.controlsDescriptionsId],
          }))
          .filter((desc) => desc.answer !== undefined); // Solo las que tienen respuesta

        return {
          ...group,
          descriptions: answeredDescriptions,
        };
      })
      .filter((group) => group.descriptions.length > 0); // Solo grupos con respuestas
  }, [controls, silicaData]);

  const planInfo = useMemo(() => {
    return {
      date: silicaData?.datePlan || "N/A",
      ventilation:
        silicaData?.ventilationArea || "No ventilation details provided.",
      equipment:
        silicaData?.equipmentDescription || "No equipment details provided.",
      hasData: !!(
        silicaData?.datePlan ||
        silicaData?.ventilationArea ||
        silicaData?.equipmentDescription
      ),
    };
  }, [silicaData]);

  // console.log(silicaReport);

  return (
    <>
      <Modal show={show} onHide={() => closeModal()} size="lg">
        <Modal.Header className="border-0 pb-0">
          <Modal.Title className="w-100">
            <div className="d-flex align-items-start justify-content-between w-100">
              <div className="d-flex align-items-center">
                <div
                  className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center me-3"
                  style={{ width: "42px", height: "42px" }}
                >
                  <GiDustCloud size={24} />
                </div>
                <div>
                  <h5
                    className="mb-0 fw-bold text-dark"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    Silica Report
                  </h5>
                </div>
              </div>
              <div className="text-end">
                <div className="badge rounded-pill bg-white text-secondary border px-3 py-2 shadow-sm">
                  <span className="text-primary fw-bold">
                    #{jobData?.number}
                  </span>
                  <span className="mx-2 text-muted">|</span>
                  <span className="text-dark fw-semibolder">
                    {jobData?.name}
                  </span>
                </div>
              </div>
            </div>
            <hr className="mt-3 mb-0 opacity-5" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <div>Loading data...</div>
          ) : (
            <Container>
              <div className="bg-light rounded-3 p-3 mb-3 border-0 shadow-sm">
                <Row className="align-items-center">
                  {/* Columna Foreman */}
                  <Col sm={6} className="border-end-sm">
                    <div className="d-flex align-items-center px-2">
                      <div className="text-primary opacity-75 me-3">
                        <i
                          className="bi bi-person-badge"
                          style={{ fontSize: "1.2rem" }}
                        ></i>
                      </div>
                      <div>
                        <div
                          className="text-uppercase text-muted fw-bold"
                          style={{
                            fontSize: "0.65rem",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Foreman
                        </div>
                        <div className="fw-semibold text-dark">
                          {fullName || "Unknown"}
                        </div>
                      </div>
                    </div>
                  </Col>
                  {/* Columna Date */}
                  <Col sm={6}>
                    <div className="d-flex align-items-center px-2 mt-3 mt-sm-0">
                      <div className="text-primary opacity-75 me-3">
                        <i
                          className="bi bi-calendar3"
                          style={{ fontSize: "1.2rem" }}
                        ></i>
                      </div>
                      <div>
                        <div
                          className="text-uppercase text-muted fw-bold"
                          style={{
                            fontSize: "0.65rem",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Report Date
                        </div>
                        <div className="fw-semibold text-dark">
                          {formatDate(silicaData?.eventDate)}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <Row className="mb-3">
                <Col>
                  <div className="d-flex flex-column">
                    {/* Etiqueta elegante fuera de la caja */}
                    <label
                      className="text-uppercase fw-bold text-muted mb-2 ps-1"
                      style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}
                    >
                      <BsCardText className="bi bi-card-text me-1" />
                      Work Description
                    </label>

                    <div
                      className="custom-description-scroll p-3 rounded-3 border bg-white shadow-sm"
                      style={{
                        maxHeight: "180px", // Altura máxima antes de activar scroll
                        overflowY: "auto", // Scroll vertical solo si es necesario
                        borderLeft: "4px solid #0d6efd !important", // Mantenemos el acento visual
                      }}
                    >
                      <div
                        className="text-dark lh-base"
                        style={{
                          fontSize: "0.92rem",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {silicaData?.workDescription ? (
                          silicaData.workDescription
                        ) : (
                          <span className="text-muted fst-italic">
                            No description provided.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Accordion>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        <h6
                          className="mb-0 fw-bold text-primary text-uppercase"
                          style={{
                            fontSize: "0.85rem",
                            letterSpacing: "0.02em",
                          }}
                        >
                          Controls
                        </h6>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="silica-report-container mt-3">
                          {silicaReport?.map((group) => (
                            <div
                              key={group.controlsId}
                              className="mb-4 border rounded-3 shadow-sm bg-white overflow-hidden"
                            >
                              {/* Encabezado del Grupo */}
                              <div className="bg-light p-3 border-bottom">
                                <div className="d-flex align-items-center justify-content-between">
                                  <h6
                                    className="mb-0 fw-bold text-primary text-uppercase"
                                    style={{
                                      fontSize: "0.85rem",
                                      letterSpacing: "0.02em",
                                    }}
                                  >
                                    {group.controlType}
                                  </h6>
                                  <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary-subtle px-3">
                                    {group.controlGroup}
                                  </span>
                                </div>
                                {group.typeDescription && (
                                  <small className="text-muted d-block mt-1 fst-italic">
                                    {group.typeDescription}
                                  </small>
                                )}
                              </div>

                              {/* Lista de Respuestas dentro del Grupo */}
                              <div className="p-0">
                                <table
                                  className="table table-hover mb-0"
                                  style={{ fontSize: "0.9rem" }}
                                >
                                  <tbody className="border-top-0">
                                    {group.descriptions.map((desc) => (
                                      <tr key={desc.controlsDescriptionsId}>
                                        <td
                                          className="text-secondary ps-3 py-2 w-50"
                                          style={{ backgroundColor: "#fafbfc" }}
                                        >
                                          {desc.controlName}
                                        </td>
                                        <td className="fw-medium text-dark py-2 ps-3">
                                          {/* Estilo especial para respuestas tipo YES/NO */}
                                          {desc.answer?.toLowerCase() ===
                                          "yes" ? (
                                            <span className="text-success">
                                              <BsFillCheckCircleFill className="me-2" />
                                              Yes
                                            </span>
                                          ) : desc.answer?.toLowerCase() ===
                                              "no" ||
                                            desc.answer?.toLowerCase() ===
                                              "n/a" ? (
                                            <span className="text-muted fst-italic">
                                              {desc.answer}
                                            </span>
                                          ) : (
                                            desc.answer
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col>
                  <div className="mt-4">
                    <label
                      className="text-uppercase fw-bold text-muted mb-2 d-flex align-items-center"
                      style={{ fontSize: "0.7rem" }}
                    >
                      <FaPencilRuler className="me-2" />
                      Site Diagram / Layout
                    </label>

                    <div
                      className="position-relative rounded-3 border bg-white shadow-sm overflow-hidden"
                      style={{
                        height: "350px",
                        backgroundImage: `linear-gradient(#f1f5f9 1px, transparent 1px), linear-gradient(90deg, #f1f5f9 1px, transparent 1px)`,
                        backgroundSize: "20px 20px",
                      }}
                    >
                      {silicaData?.diagramData ? (
                        <CanvasRenderer data={silicaData?.diagramData} />
                      ) : (
                        <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted opacity-50">
                          <i
                            className="bi bi-slash-circle mb-2"
                            style={{ fontSize: "2rem" }}
                          ></i>
                          <span className="small">No diagram provided</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
              <div className="mb-4">
                <label
                  className="text-uppercase fw-bold text-muted mb-2 ps-1"
                  style={{ fontSize: "0.65rem", letterSpacing: "0.05em" }}
                >
                  <BsFileEarmarkText className="me-1" />
                  Plan Data
                </label>

                <div className="rounded-3 border bg-white shadow-sm overflow-hidden">
                  {/* Encabezado con la Fecha */}
                  <div className="d-flex align-items-center justify-content-between p-3 border-bottom bg-light bg-opacity-50">
                    <span
                      className="fw-bold text-dark"
                      style={{ fontSize: "0.9rem" }}
                    >
                      Work Plan Details
                    </span>
                    <span className="badge bg-white text-primary border border-primary-subtle px-3 py-2">
                      <FaCalendarAlt className="me-2" />
                      {planInfo.date}
                    </span>
                  </div>

                  <div className="p-3">
                    <Row className="g-3">
                      {/* Columna de Ventilación / Área */}
                      <Col md={6}>
                        <div
                          className="d-flex flex-column h-100 p-2 rounded-2"
                          style={{ backgroundColor: "#f8fafc" }}
                        >
                          <span
                            className="text-uppercase text-primary fw-bold mb-2"
                            style={{ fontSize: "0.65rem" }}
                          >
                            <FaWind className="me-1" />
                            Work Area & Ventilation
                          </span>
                          <p
                            className="text-secondary mb-0 lh-base"
                            style={{
                              fontSize: "0.88rem",
                              whiteSpace: "pre-line",
                            }}
                          >
                            {planInfo.ventilation}
                          </p>
                        </div>
                      </Col>

                      {/* Columna de Equipos / Herramientas */}
                      <Col md={6}>
                        <div
                          className="d-flex flex-column h-100 p-2 rounded-2"
                          style={{ backgroundColor: "#f8fafc" }}
                        >
                          <span
                            className="text-uppercase text-success fw-bold mb-2"
                            style={{ fontSize: "0.65rem" }}
                          >
                            <BsTools className="me-1" />
                            Silica Equipment
                          </span>
                          <p
                            className="text-secondary mb-0 lh-base"
                            style={{
                              fontSize: "0.88rem",
                              whiteSpace: "pre-line",
                            }}
                          >
                            {planInfo.equipment}
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </Container>
          )}
          <div
            className="d-flex justify-content-end mt-3"
            style={{ marginRight: "20px" }}
          >
            <small
              className="text-muted fst-italic fw-light"
              style={{ fontSize: "0.82rem" }}
            >
              {"Created by: "}
              {silicaData?.createdBy ?? "Unknown"}
            </small>
          </div>{" "}
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="outline-secondary"
            style={{ width: "200px", fontWeight: "bold" }}
            onClick={() => closeModal()}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SilicaModal;
