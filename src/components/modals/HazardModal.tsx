import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import useModalStore from "../../stores/useModalStore";
import { GiHazardSign } from "react-icons/gi";
import { useJobs } from "../../hooks/useJobs";
import { useGetHazardReport, useOptions } from "../../hooks/useHazard";
import { useMemo } from "react";
import {
  BsCardText,
  BsCardChecklist,
  BsExclamationOctagonFill,
  BsTools,
} from "react-icons/bs";
import { FaExclamationTriangle } from "react-icons/fa";
import { RiShieldCheckFill } from "react-icons/ri";
import { GoDotFill } from "react-icons/go";
import { CiSquareCheck } from "react-icons/ci";

type Props = {};

export default function HazardModal({}: Props) {
  const { show, closeModal, selectedId } = useModalStore();
  const { data: hazardData, isLoading } = useGetHazardReport(selectedId!);
  const { data: jobs } = useJobs();
  const { data: options } = useOptions();

  const jobData = jobs?.find((job) => job.jobsId === hazardData?.jobsId);

  // console.log(hazardData);

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${month}-${day}-${year}`;
  };

  const activityInfo = useMemo(() => {
    const firstRecord = hazardData?.activities?.[0];

    return {
      activity: firstRecord?.activity || "No activities recorded",
      hazards: firstRecord?.hazards || "No hazards identified",
      controls: firstRecord?.controls || "No controls implemented",
      hasData: !!firstRecord, // Booleano para saber si pintar la sección o no
    };
  }, [hazardData]);

  const groupedTasks = useMemo(() => {
    const optionsMap =
      options?.reduce(
        (acc, opt) => {
          acc[opt.pretasksCheckboxOptionsId] = opt;
          return acc;
        },
        {} as Record<number, any>,
      ) || {};

    // Definimos la estructura inicial con un cast de tipo
    const initialGroups = {
      issues: [] as any[],
      tools: [] as any[],
    };

    return (
      hazardData?.options?.reduce((acc, item) => {
        const info = optionsMap[item.pretasksCheckboxOptionsId];
        // Forzamos el tipo basándonos en la data o usamos 'tools' por defecto
        const type = info?.type === "Issue" ? "issues" : "tools";

        acc[type].push({
          ...item,
          name: info?.name || `ID: ${item.pretasksCheckboxOptionsId}`,
        });
        return acc;
      }, initialGroups) || initialGroups
    ); // Usamos el objeto con el tipo ya definido
  }, [hazardData, options]);

  // console.log(groupedTasks);

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
                  <GiHazardSign size={24} />
                </div>
                <div>
                  <h5
                    className="mb-0 fw-bold text-dark"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    Hazard Report
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
                          {hazardData?.supervisor || "Not assigned"}
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
                          {formatDate(hazardData?.date)}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <Row className="mb-4">
                <Col>
                  <div className="p-3 rounded-3 border-start border-4 border-primary bg-light shadow-sm">
                    <div
                      className="text-uppercase fw-bold text-primary mb-2"
                      style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}
                    >
                      <BsCardChecklist className="me-2" />
                      Work Activities
                    </div>
                    <div
                      className="text-dark lh-base"
                      style={{ fontSize: "0.9rem", whiteSpace: "pre-line" }}
                    >
                      {activityInfo.activity || "No activities recorded."}
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Sección de Seguridad: Hazards y Controls (Dos columnas) */}
              <Row className="g-3 mb-4">
                <Col md={6}>
                  <div
                    className="h-100 p-3 rounded-3 border bg-white shadow-sm"
                    style={{ borderLeft: "4px solid #dc3545 !important" }}
                  >
                    <div
                      className="text-uppercase fw-bold text-danger mb-2"
                      style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}
                    >
                      <FaExclamationTriangle className=" me-2" /> Identified
                      Hazards
                    </div>
                    <div
                      className="text-secondary lh-base"
                      style={{ fontSize: "0.88rem", whiteSpace: "pre-line" }}
                    >
                      {activityInfo.hazards || "No hazards identified."}
                    </div>
                  </div>
                </Col>

                <Col md={6}>
                  <div
                    className="h-100 p-3 rounded-3 border bg-white shadow-sm"
                    style={{ borderLeft: "4px solid #198754 !important" }}
                  >
                    <div
                      className="text-uppercase fw-bold text-success mb-2"
                      style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}
                    >
                      <RiShieldCheckFill className="me-2" />
                      Safety Controls
                    </div>
                    <div
                      className="text-secondary lh-base"
                      style={{ fontSize: "0.88rem", whiteSpace: "pre-line" }}
                    >
                      {activityInfo.controls || "No controls implemented."}
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="g-3 mb-4">
                {/* Bloque de Issues */}
                <Col>
                  <div className="d-flex flex-column h-100">
                    <label
                      className="text-uppercase fw-bold text-danger mb-2 ps-1"
                      style={{ fontSize: "0.65rem", letterSpacing: "0.05em" }}
                    >
                      <BsExclamationOctagonFill className="me-1" />
                      Safety Issues
                    </label>
                    <div className="d-flex flex-wrap gap-2 p-3 rounded-3 border bg-white shadow-sm h-100 align-content-start">
                      {groupedTasks.issues.length > 0 ? (
                        groupedTasks.issues.map((task) => (
                          <span
                            key={task.pretasksOptionsId}
                            className="badge border text-danger border-danger-subtle bg-danger bg-opacity-10 px-2 py-2 fw-medium"
                          >
                            <GoDotFill className="me-1" />
                            {task.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted fst-italic small p-2">
                          No issues selected.
                        </span>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <div className="d-flex flex-column h-100">
                    <label
                      className="text-uppercase fw-bold text-primary mb-2 ps-1"
                      style={{ fontSize: "0.65rem", letterSpacing: "0.05em" }}
                    >
                      <BsTools className="me-1" />
                      Equipment & Tools
                    </label>
                    <div className="d-flex flex-wrap gap-2 p-3 rounded-3 border bg-white shadow-sm h-100 align-content-start">
                      {groupedTasks.tools.length > 0 ? (
                        groupedTasks.tools.map((task) => (
                          <span
                            key={task.pretasksOptionsId}
                            className="badge border text-primary border-primary-subtle bg-primary bg-opacity-10 px-2 py-2 fw-medium"
                          >
                            <CiSquareCheck className="me-1" />
                            {task.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted fst-italic small p-2">
                          No tools selected.
                        </span>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="d-flex flex-column">
                    {/* Etiqueta elegante fuera de la caja */}
                    <label
                      className="text-uppercase fw-bold text-muted mb-2 ps-1"
                      style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}
                    >
                      <BsCardText className="bi bi-card-text me-1" /> Comments
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
                        {hazardData?.comment ? (
                          hazardData.comment
                        ) : (
                          <span className="text-muted fst-italic">
                            No comments provided.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
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
              {hazardData?.userName ?? "Unknown"}
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
