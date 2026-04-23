import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import useCalendarStore from "../../stores/useCalendarStore";
import "../../styles/jobModal.css";
import { useJobs } from "../../hooks/useJobs";
import { useTotals } from "../../hooks/useTotals";
import {
  FaCalendarAlt,
  FaCamera,
  FaUsers,
  FaTools,
  FaTruckLoading,
  FaLink,
  FaFileContract,
  FaToolbox,
  FaKey,
  FaEllipsisH,
  FaTrashAlt,
} from "react-icons/fa";

type Props = {};

const METRIC_CONFIG: Record<string, { icon: any; color: string }> = {
  Days: { icon: <FaCalendarAlt />, color: "#4e73df" },
  Photos: { icon: <FaCamera />, color: "#1cc88a" },
  "Man Power": { icon: <FaUsers />, color: "#36b9cc" },
  Equipment: { icon: <FaTruckLoading />, color: "#f6c23e" },
  Attachment: { icon: <FaLink />, color: "#f63e9a" },
  Rental: { icon: <FaFileContract />, color: "#cb3ef6" },
  "Tool Owner": { icon: <FaToolbox />, color: "#e74a3b" },
  "Tool Rental": { icon: <FaKey />, color: "#4b4b54" },
  "Tool Other": { icon: <FaEllipsisH />, color: "#3be7e7" },
  Dumpsters: { icon: <FaTrashAlt />, color: "#5d3be7" },
};

function JobModal({}: Props) {
  const { showJobModal, setShowJobModal, jobSelected } = useCalendarStore();
  const { data: jobs } = useJobs();

  const jobData = jobs?.find((job) => job.jobsId === jobSelected);
  //   console.log(jobSelected, jobData);
  const { data: totals } = useTotals(jobData?.number!);

  //   console.log("Total: ", totals);

  return (
    <>
      <Modal
        show={showJobModal}
        onHide={() => setShowJobModal(false)}
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title
            className="w-100 text-center"
            style={{ fontWeight: "bold" }}
          >
            #{jobData?.number} {jobData?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid className="py-4">
            <Row className="g-4">
              {totals?.map((item, index) => {
                const config = METRIC_CONFIG[item.type] || {
                  icon: <FaTools />,
                  color: "#6c757d",
                };

                return (
                  <Col key={index} xs={12} md={6} lg={4} xl={2.4}>
                    <Card
                      className="h-100 border-0 shadow-lg custom-card-hover"
                      style={{ borderRadius: "15px" }}
                    >
                      <Card.Body className="d-flex align-items-center">
                        {/* Círculo del Icono */}
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle me-3"
                          style={{
                            width: "50px",
                            height: "50px",
                            backgroundColor: `${config.color}20`, // Color con 20% opacidad
                            color: config.color,
                            fontSize: "1.2rem",
                          }}
                        >
                          {config.icon}
                        </div>

                        {/* Información */}
                        <div>
                          <div
                            className="text-muted text-uppercase fw-bold"
                            style={{
                              fontSize: "0.75rem",
                              letterSpacing: "1px",
                            }}
                          >
                            {item.type}
                          </div>
                          <div className="d-flex align-items-baseline">
                            <h3
                              className="mb-0 fw-bold"
                              style={{ color: "#2c3e50" }}
                            >
                              {item.count}
                            </h3>
                            <span
                              className="ms-2 text-secondary"
                              style={{ fontSize: "0.8rem" }}
                            >
                              {item.value}
                            </span>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowJobModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default JobModal;
