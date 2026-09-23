import { useMemo, useState } from "react";
import type { MetricDetailViewProps } from "../../types/jobReports";
import {
  Badge,
  Card,
  Col,
  Form,
  InputGroup,
  Nav,
  Row,
  Table,
} from "react-bootstrap";
import {
  FaBuilding,
  FaClock,
  FaHardHat,
  FaSearch,
  FaTools,
  FaTruck,
  FaUserTie,
} from "react-icons/fa";

export const MetricDetailView: React.FC<MetricDetailViewProps> = ({
  type,
  data,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");

  // -------------------------------------------------------------
  // CÁLCULOS Y FILTROS PARA "MAN POWER"
  // -------------------------------------------------------------
  const manpowerStats = useMemo(() => {
    if (!data?.employeeSummaries)
      return { total: 0, laborHours: 0, supervisorHours: 0 };

    const supervisorHours = data.employeeSummaries
      .filter((e) => e.employeeTitle.toLowerCase().includes("supervisor"))
      .reduce((acc, curr) => acc + curr.totalHours, 0);

    const laborHours = data.employeeSummaries
      .filter((e) => !e.employeeTitle.toLowerCase().includes("supervisor"))
      .reduce((acc, curr) => acc + curr.totalHours, 0);

    return {
      total: data.totalLaborHours || supervisorHours + laborHours,
      supervisorHours,
      laborHours,
    };
  }, [data]);

  const filteredEmployees = useMemo(() => {
    if (!data?.employeeSummaries) return [];
    return data.employeeSummaries.filter((emp) => {
      const matchesSearch = emp.employeeName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const isSupervisor = emp.employeeTitle
        .toLowerCase()
        .includes("supervisor");

      if (activeTab === "supervisor") return matchesSearch && isSupervisor;
      if (activeTab === "labor") return matchesSearch && !isSupervisor;
      return matchesSearch;
    });
  }, [data, searchTerm, activeTab]);

  // -------------------------------------------------------------
  // CÁLCULOS Y FILTROS PARA "EQUIPMENT"
  // -------------------------------------------------------------
  const equipmentStats = useMemo(() => {
    if (!data?.equipmentSummaries)
      return { total: 0, ownerHours: 0, rentalHours: 0 };

    const rentalHours = data.equipmentSummaries
      .filter((e) => e.equipmentName.toLowerCase().includes("rental"))
      .reduce((acc, curr) => acc + curr.totalHours, 0);

    const ownerHours = data.equipmentSummaries
      .filter((e) => !e.equipmentName.toLowerCase().includes("rental"))
      .reduce((acc, curr) => acc + curr.totalHours, 0);

    return {
      total: data.totalEquipmentHours || ownerHours + rentalHours,
      ownerHours,
      rentalHours,
    };
  }, [data]);

  const filteredEquipment = useMemo(() => {
    if (!data?.equipmentSummaries) return [];
    return data.equipmentSummaries.filter((eq) => {
      const matchesSearch = eq.equipmentName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const isRental = eq.equipmentName.toLowerCase().includes("rental");

      if (activeTab === "rental") return matchesSearch && isRental;
      if (activeTab === "owner") return matchesSearch && !isRental;
      return matchesSearch;
    });
  }, [data, searchTerm, activeTab]);

  if (!data) {
    return (
      <div className="text-center py-4 text-muted">
        No data found.
      </div>
    );
  }

  // =============================================================
  // RENDER: VISTA MAN POWER
  // =============================================================
  if (type === "Man Power") {
    return (
      <div>
        {/* Tarjetas resumen de KPIs */}
        <Row className="g-3 mb-4">
          <Col xs={12} md={4}>
            <Card className="border-0 bg-primary bg-opacity-10 text-primary p-3 rounded-3">
              <div className="d-flex align-items-center">
                <FaClock className="fs-1 me-3" />
                <div>
                  <small className="text-uppercase fw-bold text-muted">
                    Total Manpower
                  </small>
                  <h4 className="mb-0 fw-bold">
                    {manpowerStats.total.toLocaleString()} hrs
                  </h4>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card className="border-0 bg-info bg-opacity-10 text-info p-3 rounded-3">
              <div className="d-flex align-items-center">
                <FaUserTie className="fs-1 me-3" />
                <div>
                  <small className="text-uppercase fw-bold text-muted">
                    Supervisor Hours
                  </small>
                  <h4 className="mb-0 fw-bold">
                    {manpowerStats.supervisorHours.toLocaleString()} hrs
                  </h4>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card className="border-0 bg-warning bg-opacity-10 text-dark p-3 rounded-3">
              <div className="d-flex align-items-center">
                <FaHardHat className="fs-1 me-3 text-warning" />
                <div>
                  <small className="text-uppercase fw-bold text-muted">
                    Labor Hours
                  </small>
                  <h4 className="mb-0 fw-bold">
                    {manpowerStats.laborHours.toLocaleString()} hrs
                  </h4>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Barra de Búsqueda y Navegación */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
          <Nav
            variant="pills"
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k || "all")}
          >
            <Nav.Item>
              <Nav.Link eventKey="all">
                All ({data.employeeSummaries.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="supervisor">Supervisores</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="labor">Labor</Nav.Link>
            </Nav.Item>
          </Nav>

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

        {/* Tabla de Empleados */}
        <div className="table-responsive rounded-3 border">
          <Table hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Employee Name</th>
                <th className="text-center">Days</th>
                <th className="text-end">Hours</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp, idx) => {
                const isSup = emp.employeeTitle
                  .toLowerCase()
                  .includes("supervisor");
                return (
                  <tr key={idx}>
                    <td>
                      <Badge bg={isSup ? "info" : "secondary"}>
                        {emp.employeeTitle}
                      </Badge>
                    </td>
                    <td className="fw-semibold">{emp.employeeName}</td>
                    <td className="text-center">{emp.totalReports}</td>
                    <td className="text-end fw-bold">{emp.totalHours} hrs</td>
                  </tr>
                );
              })}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-3">
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }

  // =============================================================
  // RENDER: VISTA EQUIPMENT
  // =============================================================
  if (type === "Equipment") {
    return (
      <div>
        {/* Tarjetas resumen de KPIs */}
        <Row className="g-3 mb-4">
          <Col xs={12} md={4}>
            <Card className="border-0 bg-warning bg-opacity-10 text-dark p-3 rounded-3">
              <div className="d-flex align-items-center">
                <FaTools className="fs-1 me-3 text-warning" />
                <div>
                  <small className="text-uppercase fw-bold text-muted">
                    Total
                  </small>
                  <h4 className="mb-0 fw-bold">
                    {equipmentStats.total.toLocaleString()} hrs
                  </h4>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card className="border-0 bg-success bg-opacity-10 text-success p-3 rounded-3">
              <div className="d-flex align-items-center">
                <FaBuilding className="fs-1 me-3" />
                <div>
                  <small className="text-uppercase fw-bold text-muted">
                    Owner Equipment
                  </small>
                  <h4 className="mb-0 fw-bold">
                    {equipmentStats.ownerHours.toLocaleString()} hrs
                  </h4>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card className="border-0 bg-danger bg-opacity-10 text-danger p-3 rounded-3">
              <div className="d-flex align-items-center">
                <FaTruck className="fs-1 me-3" />
                <div>
                  <small className="text-uppercase fw-bold text-muted">
                    Rental / External
                  </small>
                  <h4 className="mb-0 fw-bold">
                    {equipmentStats.rentalHours.toLocaleString()} hrs
                  </h4>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Filtros de Equipo */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
          <Nav
            variant="pills"
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k || "all")}
          >
            <Nav.Item>
              <Nav.Link eventKey="all">
                All ({data.equipmentSummaries.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="owner">Owner</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="rental">Rental</Nav.Link>
            </Nav.Item>
          </Nav>

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

        {/* Tabla de Equipos */}
        <div className="table-responsive rounded-3 border">
          <Table hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Type</th>
                <th>Equipment Name</th>
                <th className="text-center">Days</th>
                <th className="text-end">Hours</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map((eq, idx) => {
                const isRental = eq.equipmentName
                  .toLowerCase()
                  .includes("rental");
                return (
                  <tr key={idx}>
                    <td>
                      <Badge bg={isRental ? "danger" : "success"}>
                        {isRental ? "Rental" : "Owner"}
                      </Badge>
                    </td>
                    <td className="fw-semibold">{eq.equipmentName}</td>
                    <td className="text-center">{eq.totalReports}</td>
                    <td className="text-end fw-bold">{eq.totalHours} hrs</td>
                  </tr>
                );
              })}
              {filteredEquipment.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-3">
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }

  // Vista predeterminada para otras métricas
  return (
    <div className="text-center py-4 text-muted">
      No data found for selection: <strong>{type}</strong>
    </div>
  );
};
