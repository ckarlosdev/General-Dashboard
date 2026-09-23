import { useMemo } from "react";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import {
  FaCalendarAlt,
  FaCamera,
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
  FaFolder,
} from "react-icons/fa";

export interface PhotoItem {
  date: string;
  type: string;
  folderId: string;
  totalQuantity: number;
}

interface PhotosDetailsProps {
  data: PhotoItem[];
  startDate: string;
  endDate: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export const PhotosDetails: React.FC<PhotosDetailsProps> = ({
  data,
  startDate,
  endDate,
  onPrevWeek,
  onNextWeek,
}) => {
  // Calculamos el total de fotos en la semana
  const totalPhotos = useMemo(() => {
    return data?.reduce((acc, item) => acc + item.totalQuantity, 0) || 0;
  }, [data]);

  const formatDateMDY = (dateStr?: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year}`;
  };

  return (
    <div className="d-flex flex-column gap-3">
      {/* Cabecera con Navegación Semanal */}
      <div className="d-flex justify-content-between align-items-center bg-white p-3 rounded-3 shadow-sm border">
        <div>
          <h6 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
            <FaCamera className="text-success" /> Photos Summary
          </h6>
          <small className="text-muted">
            Total in range: <strong>{totalPhotos} photos</strong>
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

      {/* Grid de Tarjetas de Fotos por Día */}
      {!data || data.length === 0 ? (
        <div className="text-center text-muted py-5 bg-white rounded-3 border">
          <FaCamera size={32} className="text-secondary opacity-50 mb-2" />
          <p className="mb-0">No photos found for this week.</p>
        </div>
      ) : (
        <Row className="g-3">
          {data.map((item, index) => {
            const driveUrl = `https://drive.google.com/drive/folders/${item.folderId}`;

            return (
              <Col key={index} xs={12} md={6} lg={4}>
                <Card
                  className="h-100 border-0 shadow-sm custom-card-hover"
                  style={{ borderRadius: "12px", backgroundColor: "#ffffff" }}
                >
                  <Card.Body className="p-3 d-flex flex-column justify-content-between">
                    <div>
                      {/* Encabezado con Fecha y Tipo */}
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span
                          className="fw-bold text-dark d-flex align-items-center gap-2"
                          style={{ fontSize: "0.85rem" }}
                        >
                          <FaCalendarAlt className="text-success" size={12} />
                          {formatDateMDY(item.date)}
                        </span>
                        <Badge bg="success" className="rounded-pill px-2 py-1">
                          {item.totalQuantity}{" "}
                          {item.totalQuantity === 1 ? "photo" : "photos"}
                        </Badge>
                      </div>

                      {/* Tipo de reporte / Etiqueta */}
                      <div className="mb-3">
                        <span
                          className="badge bg-light text-secondary border fw-normal"
                          style={{ fontSize: "0.75rem" }}
                        >
                          <FaFolder className="me-1 text-warning" /> {item.type}
                        </span>
                      </div>
                    </div>

                    {/* Botón para abrir la carpeta de Drive */}
                    <Button
                      as="a"
                      href={driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline-primary"
                      size="sm"
                      className="w-100 d-flex align-items-center justify-content-center gap-2 fw-semibold"
                      style={{ borderRadius: "8px" }}
                    >
                      <span>Open Drive Folder</span>
                      <FaExternalLinkAlt size={12} />
                    </Button>
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
