import { useMemo } from "react";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaCube,
  FaTrashAlt,
} from "react-icons/fa";

export interface DumpsterItem {
  date: string;
  sourceDumpster: string;
  sizeDumpster: string;
  typeDumpster: string;
  totalQuantity: number;
}

interface DumpstersDetailsProps {
  data: DumpsterItem[];
  startDate: string;
  endDate: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export const DumpstersDetails: React.FC<DumpstersDetailsProps> = ({
  data,
  startDate,
  endDate,
  onPrevWeek,
  onNextWeek,
}) => {

  const formatDateMDY = (dateStr?: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year}`;
  };

  const groupedData = useMemo(() => {
    if (!data) return {};
    return data.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = [];
      }
      acc[item.date].push(item);
      return acc;
    }, {} as Record<string, DumpsterItem[]>);
  }, [data]);

  // 2. Calcular total global de la semana
  const totalWeeklyQuantity = useMemo(() => {
    return data?.reduce((acc, item) => acc + item.totalQuantity, 0) || 0;
  }, [data]);

  const dates = Object.keys(groupedData);

  return (
    <div className="d-flex flex-column gap-3">
      {/* Cabecera con Navegación Semanal */}
      <div className="d-flex justify-content-between align-items-center bg-white p-3 rounded-3 shadow-sm border">
        <div>
          <h6 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
            <FaTrashAlt className="text-primary" /> Dumpsters Summary
          </h6>
          <small className="text-muted">
            Total in range: <strong>{totalWeeklyQuantity} units</strong>
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
            <FaCalendarAlt className="text-muted" /> {formatDateMDY(startDate)}{" "}
            to {formatDateMDY(endDate)}
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

      {/* Grid de Tarjetas de Dumpsters */}
      {dates.length === 0 ? (
        <div className="text-center text-muted py-5 bg-white rounded-3 border">
          <FaTrashAlt size={32} className="text-secondary opacity-50 mb-2" />
          <p className="mb-0">No dumpster records found for this week.</p>
        </div>
      ) : (
        <Row className="g-3">
          {dates.map((date) => {
            const dayItems = groupedData[date];
            const dayTotal = dayItems.reduce(
              (sum, item) => sum + item.totalQuantity,
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
                    <span className="fw-bold text-dark style={{ fontSize: '0.85rem' }}">
                      <FaCalendarAlt className="me-1 text-primary" size={12} />
                      {date}
                    </span>
                    <Badge bg="primary" className="rounded-pill px-2 py-1">
                      {dayTotal} {dayTotal === 1 ? "unit" : "units"}
                    </Badge>
                  </Card.Header>

                  {/* Detalle Compacto de la Jornada */}
                  <Card.Body className="p-2">
                    <div className="d-flex flex-column gap-1">
                      {dayItems.map((subItem, idx) => (
                        <div
                          key={idx}
                          className="d-flex align-items-center justify-content-between bg-white p-2 rounded border-sm"
                          style={{
                            fontSize: "0.8rem",
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <FaCube className="text-secondary" size={12} />
                            <span className="fw-semibold text-dark">
                              {subItem.sizeDumpster}
                            </span>
                            <span className="text-muted">|</span>
                            <span className="text-secondary">
                              {subItem.typeDumpster}
                            </span>
                          </div>

                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-light text-dark border">
                              {subItem.sourceDumpster}
                            </span>
                            <span className="fw-bold text-dark">
                              x{subItem.totalQuantity}
                            </span>
                          </div>
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
