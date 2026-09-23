import { useMemo, useState } from "react";
import {
  Accordion,
  Badge,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaSearch,
  FaUserCheck,
  FaUserTie,
  FaHardHat,
  FaUtensils,
} from "react-icons/fa";

export interface MetricEmployee {
  drEmployeesId: number;
  employeeName: string;
  employeeTitle: string;
  inHour: string;
  outHour: string;
  lunch: boolean;
  hoursWorked: number;
}

export interface DailyReport {
  reportDate: string;
  foreman: string;
  dailyTotalHours: number;
  employees: MetricEmployee[];
}

export interface WeeklyJobData {
  jobId: number;
  jobNumber: string;
  jobName: string;
  startDate: string;
  endDate: string;
  reportsByDate: DailyReport[];
}

interface WeeklyReportsViewProps {
  data?: WeeklyJobData;
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
}

export const WeeklyReportsView: React.FC<WeeklyReportsViewProps> = ({
  data,
  onPrevWeek,
  onNextWeek,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // -------------------------------------------------------------
  // MÉTRICAS GENERALES DE LA SEMANA
  // -------------------------------------------------------------
  const weeklyStats = useMemo(() => {
    if (!data?.reportsByDate) {
      return { totalHours: 0, uniqueEmployees: 0, daysReported: 0 };
    }

    const totalHours = data.reportsByDate.reduce(
      (acc, day) => acc + (day.dailyTotalHours || 0),
      0,
    );

    // Set de IDs o nombres para contar empleados únicos trabajados en la semana
    const employeeSet = new Set<string>();
    data.reportsByDate.forEach((day) => {
      day.employees?.forEach((emp) => {
        employeeSet.add(emp.employeeName);
      });
    });

    return {
      totalHours,
      uniqueEmployees: employeeSet.size,
      daysReported: data.reportsByDate.length,
    };
  }, [data]);

  // -------------------------------------------------------------
  // ORDENAR Y FILTRAR DÍAS/EMPLEADOS
  // -------------------------------------------------------------
  const sortedAndFilteredReports = useMemo(() => {
    if (!data?.reportsByDate) return [];

    // Ordenar de más reciente a más antiguo dentro de la semana
    const sorted = [...data.reportsByDate].sort(
      (a, b) =>
        new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime(),
    );

    if (!searchTerm.trim()) return sorted;

    const term = searchTerm.toLowerCase();

    return sorted
      .map((day) => {
        const matchingEmployees = day.employees.filter(
          (emp) =>
            emp.employeeName.toLowerCase().includes(term) ||
            emp.employeeTitle.toLowerCase().includes(term),
        );
        return { ...day, employees: matchingEmployees };
      })
      .filter((day) => day.employees.length > 0);
  }, [data, searchTerm]);

  if (!data) {
    return <div className="text-center py-5 text-muted">No data found.</div>;
  }

  // Formateador de horas HH:MM:SS a 12 horas (ej. "06:00 AM")
  const formatTime = (timeStr: string) => {
    if (!timeStr) return "--:--";
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  // Formateador de Fecha corta
  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-EN", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateMDY = (dateStr?: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year}`;
  };

  return (
    <div className="weekly-reports-container">
      {/* 1. CABECERA Y RESUMEN SEMANAL */}
      <Card className="border-0 shadow-sm mb-4 bg-light">
        <Card.Body className="p-3 p-md-4">
          {/* Encabezado y Navegación de Semanas */}
          <Row className="align-items-center mb-3 gy-2">
            <Col xs={12} md={7} lg={8}>
              <h5 className="mb-1 text-primary fw-bold text-truncate">
                Job #{data.jobNumber} — {data.jobName}
              </h5>
              <div className="text-muted d-flex align-items-center gap-2 flex-wrap">
                <FaCalendarAlt className="flex-shrink-0" />
                <span className="fw-medium">
                  Week: {formatDateMDY(data.startDate)} to{" "}
                  {formatDateMDY(data.endDate)}
                </span>
              </div>
            </Col>

            <Col xs={12} md={5} lg={4} className="text-md-end mt-2 mt-md-0">
              <div className="btn-group w-100 w-sm-auto">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="d-flex align-items-center justify-content-center gap-1"
                  onClick={onPrevWeek}
                >
                  <FaChevronLeft /> Prev week
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="d-flex align-items-center justify-content-center gap-1"
                  onClick={onNextWeek}
                >
                  Next week <FaChevronRight />
                </Button>
              </div>
            </Col>
          </Row>

          {/* Tarjetas de Métricas de la Semana */}
          {/* Usamos md={6} para que en iPad Vertical (768px) queden 2 arriba y 1 abajo con espacio suficiente */}
          <Row className="g-3">
            <Col xs={12} md={6} lg={4}>
              <Card className="border-0 bg-white p-3 rounded-3 shadow-xs h-100">
                <div className="d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 p-2 p-md-3 rounded-circle text-primary me-3 flex-shrink-0">
                    <FaClock className="fs-4" />
                  </div>
                  <div className="overflow-hidden">
                    <small className="text-uppercase fw-bold text-muted d-block text-truncate">
                      Total Hours
                    </small>
                    <h6 className="mb-0 fw-bold text-truncate">
                      {weeklyStats.totalHours.toFixed(2)} hrs
                    </h6>
                  </div>
                </div>
              </Card>
            </Col>

            <Col xs={12} md={6} lg={4}>
              <Card className="border-0 bg-white p-3 rounded-3 shadow-xs h-100">
                <div className="d-flex align-items-center">
                  <div className="bg-success bg-opacity-10 p-2 p-md-3 rounded-circle text-success me-3 flex-shrink-0">
                    <FaUserCheck className="fs-4" />
                  </div>
                  <div className="overflow-hidden">
                    <small className="text-uppercase fw-bold text-muted d-block text-truncate">
                      Man Power
                    </small>
                    <h6 className="mb-0 fw-bold text-truncate">
                      {weeklyStats.uniqueEmployees} Employees
                    </h6>
                  </div>
                </div>
              </Card>
            </Col>

            <Col xs={12} md={6} lg={4}>
              <Card className="border-0 bg-white p-3 rounded-3 shadow-xs h-100">
                <div className="d-flex align-items-center">
                  <div className="bg-info bg-opacity-10 p-2 p-md-3 rounded-circle text-info me-3 flex-shrink-0">
                    <FaCalendarAlt className="fs-4" />
                  </div>
                  <div className="overflow-hidden">
                    <small className="text-uppercase fw-bold text-muted d-block text-truncate">
                      Days Worked
                    </small>
                    <h6 className="mb-0 fw-bold text-truncate">
                      {weeklyStats.daysReported} Days
                    </h6>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* 2. BARRA DE BÚSQUEDA */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0 text-secondary">
          Days ({sortedAndFilteredReports.length})
        </h6>
        <InputGroup style={{ maxWidth: "300px" }}>
          <InputGroup.Text className="bg-white border-end-0">
            <FaSearch className="text-muted" />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search..."
            className="border-start-0 ps-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>

      {/* 3. LISTADO DESPLEGABLE POR DÍAS */}
      <Accordion className="shadow-sm" alwaysOpen>
        {sortedAndFilteredReports.map((dayReport, index) => {
          const supervisorCount = dayReport.employees.filter((e) =>
            e.employeeTitle.toLowerCase().includes("supervisor"),
          ).length;

          const laborCount = dayReport.employees.length - supervisorCount;

          return (
            <Accordion.Item
              eventKey={index.toString()}
              key={dayReport.reportDate}
            >
              <Accordion.Header>
                <div className="d-flex flex-wrap align-items-center justify-content-between w-100 me-3">
                  <div>
                    <span className="fw-bold text-capitalize text-dark fs-6">
                      {formatDateLabel(dayReport.reportDate)}
                    </span>
                    <small className="text-muted ms-2">
                      ({formatDateMDY(dayReport.reportDate)})
                    </small>
                    <div className="small text-muted mt-1">
                      Foreman:{" "}
                      <strong className="text-dark">
                        {dayReport.foreman || "N/A"}
                      </strong>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3 mt-2 mt-sm-0">
                    <Badge bg="light" className="text-dark border">
                      <FaUserTie className="me-1 text-info" /> {supervisorCount}{" "}
                      Sup
                    </Badge>
                    <Badge bg="light" className="text-dark border">
                      <FaHardHat className="me-1 text-warning" /> {laborCount}{" "}
                      Labor
                    </Badge>
                    <Badge bg="primary" className="px-3 py-2 fs-6">
                      {dayReport.dailyTotalHours} hrs
                    </Badge>
                  </div>
                </div>
              </Accordion.Header>

              <Accordion.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "120px" }}>Title</th>
                        <th>Employee</th>
                        <th className="text-center">In</th>
                        <th className="text-center">Out</th>
                        <th className="text-center">Lunch</th>
                        <th className="text-end">Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dayReport.employees.map((emp) => {
                        const isSupervisor = emp.employeeTitle
                          .toLowerCase()
                          .includes("supervisor");

                        return (
                          <tr key={emp.employeeName}>
                            <td>
                              <Badge
                                bg={isSupervisor ? "info" : "secondary"}
                                className="fw-normal"
                              >
                                {emp.employeeTitle}
                              </Badge>
                            </td>
                            <td className="fw-semibold">{emp.employeeName}</td>
                            <td className="text-center text-muted">
                              {formatTime(emp.inHour)}
                            </td>
                            <td className="text-center text-muted">
                              {formatTime(emp.outHour)}
                            </td>
                            <td className="text-center">
                              {emp.lunch ? (
                                <Badge
                                  bg="outline-success"
                                  bg-opacity="10"
                                  className="text-success"
                                >
                                  <FaUtensils className="me-1" /> Yes
                                </Badge>
                              ) : (
                                <Badge
                                  bg="warning"
                                  bg-opacity="10"
                                  className="text-dark"
                                >
                                  No
                                </Badge>
                              )}
                            </td>
                            <td className="text-end fw-bold text-dark">
                              {emp.hoursWorked.toFixed(2)} hrs
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          );
        })}

        {sortedAndFilteredReports.length === 0 && (
          <div className="bg-white p-4 text-center text-muted border rounded">
            No data found.
          </div>
        )}
      </Accordion>
    </div>
  );
};
