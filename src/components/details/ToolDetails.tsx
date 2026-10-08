import React, { useMemo } from "react";
import { Row, Col, Card, Button, Badge } from "react-bootstrap";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTools,
  FaCalendarAlt,
  FaWrench,
} from "react-icons/fa";

export interface ToolItem {
  date: string;
  name: string;
  totalQuantity: number;
}

interface ToolsDetailsProps {
  data: ToolItem[];
  startDate: string;
  endDate: string;
  title?: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export const ToolsDetails: React.FC<ToolsDetailsProps> = ({
  data,
  startDate,
  endDate,
  title = "Tools Summary",
  onPrevWeek,
  onNextWeek,
}) => {
  // 1. Agrupar las herramientas por fecha
  const groupedData = useMemo(() => {
    if (!data) return {};
    return data.reduce(
      (acc, item) => {
        if (!acc[item.date]) {
          acc[item.date] = [];
        }
        acc[item.date].push(item);
        return acc;
      },
      {} as Record<string, ToolItem[]>,
    );
  }, [data]);

  // 2. Total general de unidades de herramientas en la semana
  const totalQuantitySum = useMemo(() => {
    return data?.reduce((acc, item) => acc + item.totalQuantity, 0) || 0;
  }, [data]);

  const dates = Object.keys(groupedData);

  return (
    <div className="d-flex flex-column gap-3">
      {/* Cabecera con Navegación Semanal */}
      <div className="d-flex justify-content-between align-items-center bg-white p-3 rounded-3 shadow-sm border">
        <div>
          <h6 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
            <FaTools className="text-warning" /> {title}
          </h6>
          <small className="text-muted">
            Total quantity in range: <strong>{totalQuantitySum} units</strong>
          </small>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={onPrevWeek}
            className="d-flex align-items-center gap-1"
          >
            <FaChevronLeft /> Prev Week
          </Button>

          <span className="badge bg-light text-dark border px-3 py-2 fw-semibold d-flex align-items-center gap-1">
            <FaCalendarAlt className="text-muted" /> {startDate} to {endDate}
          </span>

          <Button
            variant="outline-secondary"
            size="sm"
            onClick={onNextWeek}
            className="d-flex align-items-center gap-1"
          >
            Next Week <FaChevronRight />
          </Button>
        </div>
      </div>

      {/* Renderizado Agrupado por Día */}
      {dates.length === 0 ? (
        <div className="text-center text-muted py-5 bg-white rounded-3 border">
          <FaTools size={32} className="text-secondary opacity-50 mb-2" />
          <p className="mb-0">No tools records found for this week.</p>
        </div>
      ) : (
        <Row className="g-3">
          {dates.map((date) => {
            const dayItems = groupedData[date];
            const dayTotalUnits = dayItems.reduce(
              (acc, curr) => acc + curr.totalQuantity,
              0,
            );

            return (
              <Col key={date} xs={12} md={6} lg={4}>
                <Card
                  className="h-100 border-0 shadow-sm"
                  style={{ borderRadius: "12px" }}
                >
                  {/* Encabezado del Día */}
                  <Card.Header className="bg-light border-0 d-flex justify-content-between align-items-center py-2 px-3">
                    <span
                      className="fw-bold text-dark"
                      style={{ fontSize: "0.85rem" }}
                    >
                      <FaCalendarAlt className="me-1 text-warning" size={12} />
                      {date}
                    </span>
                    <Badge bg="dark" className="rounded-pill px-2 py-1">
                      {dayTotalUnits} total units
                    </Badge>
                  </Card.Header>

                  {/* Listado de Herramientas */}
                  <Card.Body className="p-2">
                    <div className="d-flex flex-column gap-1">
                      {dayItems.map((subItem, idx) => (
                        <div
                          key={idx}
                          className="d-flex align-items-center justify-content-between p-2 rounded"
                          style={{
                            fontSize: "0.8rem",
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <FaWrench className="text-secondary" size={11} />
                            <span className="fw-semibold text-dark">
                              {subItem.name.trim()}
                            </span>
                          </div>

                          <Badge
                            bg="warning"
                            text="dark"
                            className="fw-bold px-2 py-1"
                          >
                            x{subItem.totalQuantity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};
