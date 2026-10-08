import {
  Button,
  Card,
  Col,
  Container,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
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
  FaTimes,
} from "react-icons/fa";
import { useState } from "react";
import {
  useDashboardSummary,
  useJobDailyReports,
  useJobSummary,
} from "../../hooks/useMetricDetails";
import { MetricDetailView } from "./MetricDetailView";
import { WeeklyReportsView } from "./WeeklyReportsView";
import { DashboardMetricDetailView } from "./DashboardMetricDetailView";

type Props = {};

interface MetricType {
  type: string;
  count: number | string;
  value?: string;
}

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

const formatDateToISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Obtiene el Domingo de la semana en curso (inicio de semana)
const getCurrentWeekSunday = (): string => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);
  return formatDateToISO(sunday);
};

// Obtiene el Sábado de la semana en curso (fin de semana)
const getCurrentWeekSaturday = (): string => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const saturday = new Date(today);
  saturday.setDate(today.getDate() + (6 - dayOfWeek));
  return formatDateToISO(saturday);
};

function JobModal({}: Props) {
  const { showJobModal, setShowJobModal, jobSelected } = useCalendarStore();
  const { data: jobs } = useJobs();
  // Estado local para rastrear la métrica seleccionada
  const [selectedMetric, setSelectedMetric] = useState<MetricType | null>(null);
  const [startDate, setStartDate] = useState(getCurrentWeekSunday);
  const [endDate, setEndDate] = useState(getCurrentWeekSaturday);

  const jobData = jobs?.find((job) => job.jobsId === jobSelected);
  const { data: totals } = useTotals(jobData?.number!);
  const {
    data: dailyReportsData,
    isLoading: isDailyReportsLoading,
    isError: isDailyReportsError,
  } = useJobDailyReports(jobData?.jobsId!, startDate, endDate);

  const {
    data: dashboardSummary,
    isLoading: isDashboardLoading,
    isError: isDashboardSummaryLoading,
  } = useDashboardSummary({
    jobId: jobData?.jobsId!,
    startDate,
    endDate,
  });

  // console.log(startDate, endDate);
  const {
    data: metricDetails,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useJobSummary(jobData?.jobsId!);

  const handlePrevWeek = () => {
    const currentStart = new Date(startDate);
    const currentEnd = new Date(endDate);

    currentStart.setDate(currentStart.getDate() - 7);
    currentEnd.setDate(currentEnd.getDate() - 7);

    setStartDate(currentStart.toISOString().split("T")[0]);
    setEndDate(currentEnd.toISOString().split("T")[0]);
  };

  const handleNextWeek = () => {
    const currentStart = new Date(startDate);
    const currentEnd = new Date(endDate);

    currentStart.setDate(currentStart.getDate() + 7);
    currentEnd.setDate(currentEnd.getDate() + 7);

    setStartDate(currentStart.toISOString().split("T")[0]);
    setEndDate(currentEnd.toISOString().split("T")[0]);
  };

  const handleCloseModal = () => {
    setSelectedMetric(null);
    setShowJobModal(false);
  };

  // Componente de Carga
  const LoadingSpinner = ({ message = "Loading..." }: { message?: string }) => (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" />
      <p className="mt-2 text-muted mb-0">{message}</p>
    </div>
  );

  // Componente de Error
  const ErrorMessage = ({
    message = "Error loading data.",
  }: {
    message?: string;
  }) => <div className="alert alert-danger text-center mb-0">{message}</div>;

  return (
    <Modal
      show={showJobModal}
      onHide={handleCloseModal}
      backdrop="static"
      keyboard={false}
      dialogClassName="modal-90w"
    >
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center fw-bold">
          #{jobData?.number} {jobData?.name}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Container fluid className="py-4">
          {/* Rejilla Principal de Tarjetas */}
          <Row className="g-4">
            {totals?.map((item, index) => {
              const config = METRIC_CONFIG[item.type] || {
                icon: <FaTools />,
                color: "#6c757d",
              };
              const isSelected = selectedMetric?.type === item.type;

              return (
                <Col key={index} xs={12} md={6} lg={4} xl={2.4}>
                  <Card
                    onClick={() => setSelectedMetric(isSelected ? null : item)}
                    className={`h-100 border-0 shadow-sm custom-card-hover ${
                      isSelected ? "ring-active" : ""
                    }`}
                    style={{
                      borderRadius: "15px",
                      cursor: "pointer",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      border: isSelected
                        ? `2px solid ${config.color}`
                        : "2px solid transparent",
                      transform: isSelected ? "translateY(-4px)" : "none",
                    }}
                  >
                    <Card.Body className="d-flex align-items-center">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle me-3"
                        style={{
                          width: "50px",
                          height: "50px",
                          backgroundColor: `${config.color}20`,
                          color: config.color,
                          fontSize: "1.2rem",
                        }}
                      >
                        {config.icon}
                      </div>

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
                          {item.value && (
                            <span
                              className="ms-2 text-secondary"
                              style={{ fontSize: "0.8rem" }}
                            >
                              {item.value}
                            </span>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* Panel de Detalles Desplegable */}
          {selectedMetric && (
            <Row className="mt-4">
              <Col xs={12}>
                <Card
                  className="border-0 shadow-lg"
                  style={{
                    borderRadius: "15px",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center pt-3 px-4">
                    <div className="d-flex align-items-center">
                      <span
                        className="me-2 fw-bold"
                        style={{
                          color:
                            METRIC_CONFIG[selectedMetric.type]?.color ||
                            "#2c3e50",
                        }}
                      >
                        Details {selectedMetric.type}
                      </span>
                    </div>
                    <Button
                      variant="link"
                      className="text-muted p-0"
                      onClick={() => setSelectedMetric(null)}
                    >
                      <FaTimes />
                    </Button>
                  </Card.Header>

                  <Card.Body className="px-4 pb-4">
                    {/* CASO 1: Métrica 'Days' */}
                    {selectedMetric.type === "Days" ? (
                      isDailyReportsLoading ? (
                        <LoadingSpinner message="Loading daily reports..." />
                      ) : isDailyReportsError ? (
                        <ErrorMessage message="Error loading daily reports." />
                      ) : (
                        <WeeklyReportsView
                          data={dailyReportsData}
                          onPrevWeek={handlePrevWeek}
                          onNextWeek={handleNextWeek}
                        />
                      )
                    ) : /* CASO 2: Métricas de Man Power / Equipment */
                    selectedMetric.type === "Man Power" ||
                      selectedMetric.type === "Equipment" ? (
                      isSummaryLoading ? (
                        <LoadingSpinner message="Loading details..." />
                      ) : isSummaryError ? (
                        <ErrorMessage message="Error loading details." />
                      ) : (
                        <MetricDetailView
                          type={selectedMetric.type}
                          data={metricDetails}
                        />
                      )
                    ) : /* CASO 3: Resto de métricas (Dumpsters, Photos, Rentals, Tools, etc.) */ isDashboardLoading ? (
                      <LoadingSpinner message="Loading dashboard summary..." />
                    ) : isDashboardSummaryLoading ? (
                      <ErrorMessage message="Error loading dashboard summary." />
                    ) : (
                      <DashboardMetricDetailView
                        type={selectedMetric.type}
                        data={dashboardSummary}
                        startDate={startDate}
                        endDate={endDate}
                        onPrevWeek={handlePrevWeek}
                        onNextWeek={handleNextWeek}
                      />
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default JobModal;
