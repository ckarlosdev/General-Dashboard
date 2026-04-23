import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import useModalStore from "../../stores/useModalStore";
import { useDemoChecklist, useItems } from "../../hooks/useDemo";
import { useJobs } from "../../hooks/useJobs";
import { VscChecklist } from "react-icons/vsc";
import { BsCardText, BsCollectionFill } from "react-icons/bs";

type Props = {};

function DemoModal({}: Props) {
  const { show, closeModal, selectedId } = useModalStore();
  const { data: demoData, isLoading } = useDemoChecklist(selectedId!);
  const { data: jobs } = useJobs();
  const { data: items } = useItems();

  const jobData = jobs?.find((job) => job.jobsId === demoData?.jobsId);

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${month}-${day}-${year}`;
  };

  // console.log(demoData);
  // console.log(items);

  const combineAndGroupData = () => {
    const itemMap = items?.reduce((acc: Record<number, any>, item) => {
      acc[item.demoItemsId] = item;
      return acc;
    }, {});

    return demoData?.items.reduce((groups: Record<string, any[]>, res) => {
      const details = itemMap?.[res.demoItemsId];

      // Si el ID de la respuesta no existe en las definiciones, lo ignoramos
      if (!details) return groups;

      const groupName = details.itemGroup;
      if (!groups[groupName]) {
        groups[groupName] = [];
      }

      groups[groupName].push({
        ...res,
        description: details.itemDescription,
        type: details.itemType,
        position: parseInt(details.itemPosition),
      });

      return groups;
    }, {});
  };

  const groupedData = combineAndGroupData();

  // console.log(groupedData);

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
                  <VscChecklist size={24} />
                </div>
                <div>
                  <h5
                    className="mb-0 fw-bold text-dark"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    Demo Checklist
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
                          {demoData?.foreman}
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
                          {formatDate(demoData?.checklistDate)}
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
                      <BsCardText className="bi bi-card-text me-1" /> Notes
                    </label>

                    <div
                      className="custom-description-scroll p-3 rounded-3 border bg-white shadow-sm"
                      style={{
                        maxHeight: "180px",
                        overflowY: "auto",
                        borderLeft: "4px solid #0d6efd !important",
                      }}
                    >
                      <div
                        className="text-dark lh-base"
                        style={{
                          fontSize: "0.92rem",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {demoData?.notes ? (
                          demoData.notes
                        ) : (
                          <span className="text-muted fst-italic">
                            No notes provided.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <div className="p-2">
                {Object.entries(groupedData ?? {}).map(([groupName, items]) => (
                  <div key={groupName} className="mb-4">
                    <div className="d-flex flex-column h-100">
                      {/* Etiqueta del Grupo (Label superior) */}
                      <label
                        className="text-uppercase fw-bold text-primary mb-2 ps-1"
                        style={{ fontSize: "0.65rem", letterSpacing: "0.05em" }}
                      >
                        <BsCollectionFill className="me-1" />{" "}
                        {groupName}
                      </label>

                      {/* Contenedor de los Ítems (Chips Container) */}
                      <div className="d-flex flex-wrap gap-2 p-3 rounded-3 border bg-white shadow-sm h-100 align-content-start">
                        {items.length > 0 ? (
                          items
                            .sort((a: any, b: any) => a.position - b.position)
                            .map((item: any) => (
                              <span
                                key={item.demoChecklistsItemsId}
                                className={`badge border px-2 py-2 fw-medium d-flex align-items-center text-secondary border-secondary-subtle bg-secondary bg-opacity-10`}
                                style={{ fontSize: "0.75rem" }}
                              >
                                <i
                                  className={`bi ${
                                    item.response?.toLowerCase() === "yes"
                                      ? "bi-check-circle-fill"
                                      : item.response?.toLowerCase() === "no"
                                        ? "bi-x-circle-fill"
                                        : "bi-info-circle-fill"
                                  } me-1`}
                                ></i>

                                <span className="me-1">
                                  {item.description}:
                                </span>
                                <span className="fw-bold text-uppercase">
                                  {item.response}
                                </span>
                              </span>
                            ))
                        ) : (
                          <span className="text-muted fst-italic small p-2">
                            No items recorded.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
              {demoData?.createdBy ?? "Unknown"}
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

export default DemoModal;
