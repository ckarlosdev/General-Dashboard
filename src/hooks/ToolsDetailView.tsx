import React, { useMemo, useState } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Badge,
  Nav,
  Form,
  InputGroup,
} from "react-bootstrap";
import {
  FaSearch,
  FaWrench,
  FaCalendarAlt,
  FaList,
  FaChartPie,
} from "react-icons/fa";
import type { ToolItem, ToolsDetailProps } from "../types/jobReports";

export const ToolsDetailView: React.FC<ToolsDetailProps> = ({ tools = [] }) => {
  const [viewMode, setViewMode] = useState<"grouped" | "summary">("grouped");
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrado por término de búsqueda
  const filteredTools = useMemo(() => {
    if (!searchTerm.trim()) return tools;
    return tools.filter((tool) =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tools, searchTerm]);

  // Agrupado por fecha: { "2026-09-17": [ToolItem, ToolItem], ... }
  const groupedByDate = useMemo(() => {
    return filteredTools.reduce((acc, tool) => {
      if (!acc[tool.date]) {
        acc[tool.date] = [];
      }
      acc[tool.date].push(tool);
      return acc;
    }, {} as Record<string, ToolItem[]>);
  }, [filteredTools]);

  // Totales acumulados por herramienta en el periodo
  const summaryByName = useMemo(() => {
    const map = new Map<string, number>();
    filteredTools.forEach((tool) => {
      const current = map.get(tool.name) || 0;
      map.set(tool.name, current + tool.totalQuantity);
    });

    return Array.from(map.entries())
      .map(([name, totalQuantity]) => ({ name, totalQuantity }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity);
  }, [filteredTools]);

  // Total general de herramientas registradas
  const grandTotal = useMemo(() => {
    return filteredTools.reduce((sum, item) => sum + item.totalQuantity, 0);
  }, [filteredTools]);

  if (!tools || tools.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <FaWrench size={40} className="mb-3 opacity-50" />
        <h5>Sin registros de herramientas</h5>
        <p className="mb-0 fs-6">
          No se encontraron datos de herramientas para las fechas seleccionadas.
        </p>
      </div>
    );
  }

  return (
    <div className="tools-detail-view">
      {/* Barra Superior: Búsqueda y Selector de Vista */}
      <Row className="mb-3 align-items-center g-2">
        <Col xs={12} sm={6} md={5}>
          <InputGroup>
            <InputGroup.Text className="bg-white border-end-0">
              <FaSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar herramienta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0 ps-0 shadow-none"
              style={{ fontSize: "0.95rem" }}
            />
          </InputGroup>
        </Col>

        <Col xs={12} sm={6} md={7} className="d-flex justify-content-sm-end align-items-center gap-2">
          <Badge bg="secondary" className="px-3 py-2 fs-6 rounded-pill">
            Total en periodo: <strong>{grandTotal}</strong>
          </Badge>

          <Nav variant="pills" activeKey={viewMode} onSelect={(k) => setViewMode(k as "grouped" | "summary")}>
            <Nav.Item>
              <Nav.Link eventKey="grouped" className="px-3 py-1 py-md-2">
                <FaList className="me-1" /> Por Día
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="summary" className="px-3 py-1 py-md-2">
                <FaChartPie className="me-1" /> Acumulado
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>

      {/* VISTA 1: Agrupada por Día */}
      {viewMode === "grouped" && (
        <Row className="g-3">
          {Object.entries(groupedByDate).map(([date, items]) => {
            const dayTotal = items.reduce((sum, i) => sum + i.totalQuantity, 0);

            return (
              <Col xs={12} md={6} lg={4} key={date}>
                <Card className="border-0 shadow-sm h-100" style={{ borderRadius: "12px" }}>
                  <Card.Header className="bg-white border-bottom border-light d-flex justify-content-between align-items-center py-2 px-3">
                    <span className="fw-bold text-primary d-flex align-items-center gap-2">
                      <FaCalendarAlt /> {date}
                    </span>
                    <Badge bg="info" className="text-dark fw-bold">
                      {dayTotal} unidades
                    </Badge>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table responsive hover className="mb-0 align-middle">
                      <tbody>
                        {items.map((tool, idx) => (
                          <tr key={`${date}-${tool.name}-${idx}`}>
                            <td className="ps-3 fw-medium text-dark">{tool.name}</td>
                            <td className="pe-3 text-end fw-bold text-secondary" style={{ width: "80px" }}>
                              {tool.totalQuantity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* VISTA 2: Resumen Acumulado */}
      {viewMode === "summary" && (
        <Card className="border-0 shadow-sm" style={{ borderRadius: "12px" }}>
          <Card.Body className="p-0">
            <Table responsive hover className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="ps-4 py-3">Herramienta</th>
                  <th className="pe-4 py-3 text-end">Total Acumulado</th>
                </tr>
              </thead>
              <tbody>
                {summaryByName.map((tool) => (
                  <tr key={tool.name}>
                    <td className="ps-4 py-3 fw-semibold text-dark">
                      <FaWrench className="me-2 text-muted" />
                      {tool.name}
                    </td>
                    <td className="pe-4 py-3 text-end">
                      <span className="badge bg-primary fs-6 px-3 py-2 rounded-pill">
                        {tool.totalQuantity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ToolsDetailView;