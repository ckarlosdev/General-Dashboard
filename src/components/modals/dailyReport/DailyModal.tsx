import { Accordion, Button, Col, Container, Modal, Row } from "react-bootstrap";
import useModalStore from "../../../stores/useModalStore";
import { useDailyReport, usePhotosByType } from "../../../hooks/useDaily";
import { useJobs } from "../../../hooks/useJobs";
import ManpowerData from "./ManpowerData";
import ToolData from "./ToolData";
import DumpsterData from "./DumpsterData";
import { TbReport } from "react-icons/tb";
import EquipmentData from "./EquipmentData";
import { BsCardText, BsImages } from "react-icons/bs";
import { MdNotes } from "react-icons/md";
import { FaGoogleDrive } from "react-icons/fa";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

type Props = {};

function DailyModal({}: Props) {
  const { show, closeModal, selectedId } = useModalStore();
  const { data: drData, isLoading } = useDailyReport(selectedId!);
  const { data: jobs } = useJobs();
  const { data: photos } = usePhotosByType("DailyReport", selectedId);

  const jobData = jobs?.find((job) => job.jobsId === drData?.jobsId);

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${month}-${day}-${year}`;
  };

  const folderId = photos && photos.length > 0 ? photos[0].folderId : null;
  const driveUrl = folderId
    ? `https://drive.google.com/drive/folders/${folderId}`
    : "https://drive.google.com/drive/folders/15FnBtRLDSclJM9ewghViWrdNO6ORM5Ia";

  console.log("photos: ", photos, folderId);

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
                  <TbReport size={24} />
                </div>
                <div>
                  <h5
                    className="mb-0 fw-bold text-dark"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    Daily Report
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
                          {drData?.foreman || "Not assigned"}
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
                          {formatDate(drData?.date)}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              <div
                className="mb-4 d-flex align-items-center justify-content-between p-3 rounded-3 bg-white border shadow-sm"
                style={{ borderLeft: "4px solid #198754 !important" }}
              >
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <BsImages style={{ fontSize: "2rem" }}  />
                  </div>
                  <div>
                    <div className="d-flex align-items-center mt-1">
                      <span
                        className="badge rounded-pill bg-success me-2"
                        style={{
                          fontSize: "0.9rem",
                          padding: "0.4em 0.8em",
                          boxShadow: "0 2px 4px rgba(25, 135, 84, 0.2)",
                        }}
                      >
                        {photos?.length || 0}
                      </span>
                      <span
                        className="fw-bold text-dark"
                        style={{ fontSize: "0.9rem" }}
                      >
                        Photos Attached
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botón estilo Glassmorphism o Minimalista */}
                <a
                  href={driveUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary btn-sm rounded-pill px-3 d-flex align-items-center transition-all"
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    borderWidth: "1.5px",
                  }}
                >
                  <FaGoogleDrive className="me-2" />
                  Open Drive
                  <FaArrowUpRightFromSquare
                    className="ms-2"
                    style={{ fontSize: "0.7rem" }}
                  />
                </a>
              </div>
              <Row className="mb-3">
                <Col>
                  <div className="d-flex flex-column">
                    {/* Etiqueta elegante fuera de la caja */}
                    <label
                      className="text-uppercase fw-bold text-muted mb-2 ps-1"
                      style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}
                    >
                      <BsCardText className="me-1 text-primary" />
                      <span className="text-primary">Work Description</span>
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
                        {drData?.description ? (
                          drData.description
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
              <Row className="mb-2">
                <Col>
                  <div className="d-flex flex-column">
                    {/* Etiqueta elegante fuera de la caja */}
                    <label
                      className="fw-bold text-muted mb-2 ps-1"
                      style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}
                    >
                      <MdNotes className="me-1 text-primary" />
                      <span className="text-primary">
                        Issues, events or visits
                      </span>
                    </label>

                    <div
                      className="custom-issues-scroll p-3 rounded-3 border bg-white shadow-sm"
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
                        {drData?.issues ? (
                          drData.issues
                        ) : (
                          <span className="text-muted fst-italic">
                            No issues provided.
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
                    <ManpowerData />
                    <ToolData />
                  </Accordion>
                </Col>
                <Col>
                  <Accordion>
                    <EquipmentData />
                    <DumpsterData />
                  </Accordion>
                </Col>
              </Row>
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
              {drData?.userName ?? "Unknown"}
            </small>
          </div>
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

export default DailyModal;
