import { useMemo } from "react";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import {
  FaBuilding,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaFileContract,
  FaTruckLoading,
} from "react-icons/fa";

export interface RentalItem {
  date: string;
  equipmentType: string;
  company: string;
  equipmentName: string;
}

interface RentalsDetailsProps {
  data: RentalItem[];
  startDate: string;
  endDate: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export const RentalsDetails: React.FC<RentalsDetailsProps> = ({
  data,
  startDate,
  endDate,
  onPrevWeek,
  onNextWeek,
}) => {
  // 1. Agrupar los elementos por fecha
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
      {} as Record<string, RentalItem[]>,
    );
  }, [data]);

  // 2. Total de rentas registradas en el rango
  const totalRentals = data?.length || 0;
  const dates = Object.keys(groupedData);

  return (
    <div className="d-flex flex-column gap-3">
      {/* Cabecera con Navegación Semanal */}
      <div className="d-flex justify-content-between align-items-center bg-white p-3 rounded-3 shadow-sm border">
        <div>
          <h6 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
            <FaFileContract style={{ color: "#cb3ef6" }} /> Rentals Summary
          </h6>
          <small className="text-muted">
            Total in range: <strong>{totalRentals} items rented</strong>
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
          <FaFileContract
            size={32}
            className="text-secondary opacity-50 mb-2"
          />
          <p className="mb-0">No rental records found for this week.</p>
        </div>
      ) : (
        <Row className="g-3">
          {dates.map((date) => {
            const dayItems = groupedData[date];

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
                      <FaCalendarAlt
                        className="me-1"
                        style={{ color: "#cb3ef6" }}
                        size={12}
                      />
                      {date}
                    </span>
                    <Badge bg="secondary" className="rounded-pill px-2 py-1">
                      {dayItems.length}{" "}
                      {dayItems.length === 1 ? "item" : "items"}
                    </Badge>
                  </Card.Header>

                  {/* Detalle Compacto de Equipos Rentados */}
                  <Card.Body className="p-2">
                    <div className="d-flex flex-column gap-1">
                      {dayItems.map((subItem, idx) => (
                        <div
                          key={idx}
                          className="d-flex align-items-center justify-content-between p-2 rounded border-sm"
                          style={{
                            fontSize: "0.8rem",
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          <div className="d-flex align-items-center gap-2 overflow-hidden me-2">
                            <FaTruckLoading
                              className="text-secondary flex-shrink-0"
                              size={12}
                            />
                            <span className="fw-semibold text-dark text-truncate">
                              {subItem.equipmentName.trim()}
                            </span>
                          </div>

                          <div className="d-flex align-items-center gap-1 flex-shrink-0">
                            <span className="badge bg-white text-secondary border d-flex align-items-center gap-1 text-capitalize">
                              <FaBuilding size={10} className="text-muted" />
                              {subItem.company.trim()}
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
