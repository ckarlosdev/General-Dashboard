import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import useModalStore from "../../stores/useModalStore";
import { useChecklist } from "../../hooks/useChecklist";
import { useJobs } from "../../hooks/useJobs";
import { GiMineTruck } from "react-icons/gi";
import {
  FaExclamationTriangle,
  FaCheckCircle,
  FaTools,
  FaWater,
  FaGasPump,
  FaFilter,
  FaTemperatureHigh,
  FaCogs,
} from "react-icons/fa";
import { FaDroplet } from "react-icons/fa6";
import { MdOutlineChecklist } from "react-icons/md";
import { GrUserWorker } from "react-icons/gr";

type Props = {};

function ChecklistModal({}: Props) {
  const { show, closeModal, selectedId } = useModalStore();
  const { data: checklistData, isLoading } = useChecklist(selectedId!);
  const { data: jobs } = useJobs();

  const jobData = jobs?.find((job) => job.jobsId === checklistData?.jobsId);

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${month}-${day}-${year}`;
  };

  const getStatusColor = (value: string, type: string) => {
    const v = value?.toLowerCase();
    if (v === "yes" && type === "leaking") return "text-danger"; // Fuga es malo
    if (v === "damage") return "text-danger"; // Daño es malo
    if (v === "ready" || v === "clean" || v === "full") return "text-success";
    return "text-warning";
  };

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
                  <GiMineTruck size={24} />
                </div>
                <div>
                  <h5
                    className="mb-0 fw-bold text-dark"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    Checklists Reports
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
                          Reports date
                        </div>
                        <div className="fw-semibold text-dark">
                          {formatDate(checklistData?.date)}
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
                          Totals
                        </div>
                        <div className="fw-semibold text-dark">
                          {checklistData?.checklists.length}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="equipment-checklists">
                <label
                  className="text-uppercase fw-bold text-muted mb-3 ps-1"
                  style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}
                >
                  <MdOutlineChecklist /> Equipment Inspections
                </label>

                {checklistData?.checklists.map((item) => (
                  <div
                    key={item.googleChecklistsId}
                    className="mb-3 border rounded-3 bg-white shadow-sm overflow-hidden"
                  >
                    {/* Header de la Maquina */}
                    <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-start">
                      <div className="d-flex gap-3">
                        <div
                          className="bg-primary text-white rounded-2 d-flex align-items-center justify-content-center shadow-sm"
                          style={{
                            width: "45px",
                            height: "45px",
                            flexShrink: 0,
                          }} // flexShrink evita que se aplaste
                        >
                          <FaTools size={24} />
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold">{item.equipmentName}</h6>
                          <div className="d-flex gap-2 align-items-center">
                            <span
                              className="badge bg-secondary"
                              style={{ fontSize: "0.65rem" }}
                            >
                              #{item.equipmentNumber}
                            </span>
                            {item.otherType && (
                              <span
                                className="badge bg-info text-white"
                                style={{ fontSize: "0.65rem" }}
                              >
                                {item.otherType}
                              </span>
                            )}
                            <small className="text-muted">
                              <GrUserWorker size={11} className="me-1"/>
                              {item.operator}
                            </small>
                          </div>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold text-dark">{item.odometer}</div>
                        <small
                          className="text-uppercase text-muted"
                          style={{ fontSize: "0.6rem" }}
                        >
                          Odometer
                        </small>
                      </div>
                    </div>

                    {/* Grid de Estados (Iconos Rápidos) */}
                    <div className="p-3">
                      <div className="row g-2 text-center">
                        {[
                          { label: "Oil", val: item.oil, icon: <FaDroplet /> }, // Necesitas importar FaDroplet de 'react-icons/fa6'
                          {
                            label: "Hydraulic",
                            val: item.hydraulic,
                            icon: <FaWater />,
                          },
                          {
                            label: "Diesel",
                            val: item.diesel,
                            icon: <FaGasPump />,
                          },
                          {
                            label: "Filter",
                            val: item.filter,
                            icon: <FaFilter />,
                          },
                          {
                            label: "Radiator",
                            val: item.radiator,
                            icon: <FaTemperatureHigh />,
                          },
                          {
                            label: "Tracks",
                            val: item.track,
                            icon: <FaCogs />,
                          },
                        ].map((stat, idx) => (
                          <div key={idx} className="col-4 col-md-2">
                            <div className="p-2 rounded-2 border bg-light bg-opacity-25 h-100">
                              <span
                                className={`d-block mb-1 ${getStatusColor(stat.val, stat.label)}`}
                              >
                                {stat.icon}
                              </span>
                              <div
                                className="fw-bold text-dark"
                                style={{ fontSize: "0.75rem" }}
                              >
                                {stat.val}
                              </div>
                              <div
                                className="text-muted text-uppercase"
                                style={{
                                  fontSize: "0.55rem",
                                  letterSpacing: "0.02em",
                                }}
                              >
                                {stat.label}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Alertas de Fuga y Limpieza */}
                      <div className="d-flex gap-4 mt-3 pt-3 border-top">
                        {/* Estado de Fugas */}
                        <div
                          className={`d-flex align-items-center fw-bold ${item.leaking === "Yes" ? "text-danger" : "text-success"}`}
                        >
                          {item.leaking === "Yes" ? (
                            <>
                              <FaExclamationTriangle className="me-2" />
                              <span>Leaking: YES (Action Required)</span>
                            </>
                          ) : (
                            <>
                              <FaCheckCircle className="me-2" />
                              <span>No Leaks Detected</span>
                            </>
                          )}
                        </div>

                        {/* Estado de Limpieza */}
                        <div className="d-flex align-items-center fw-bold text-muted">
                          <FaCheckCircle className="me-2 text-success" />
                          <span>Clean: {item.clean}</span>
                        </div>
                      </div>

                      {/* Comentarios / Notas Técnicas */}
                      {item.comment && (
                        <div className="mt-3 p-3 rounded-3 bg-warning bg-opacity-10 border border-warning border-opacity-25">
                          <div
                            className="d-flex align-items-center text-warning-emphasis fw-bold mb-1"
                            style={{ fontSize: "0.75rem" }}
                          >
                            <FaExclamationTriangle className="me-2" />
                            OPERATOR COMMENTS
                          </div>
                          <div
                            className="small text-dark"
                            style={{ whiteSpace: "pre-line" }}
                          >
                            {item.comment}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Container>
          )}{" "}
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

export default ChecklistModal;
