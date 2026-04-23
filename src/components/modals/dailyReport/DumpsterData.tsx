import { Accordion, Alert } from "react-bootstrap";
import { reportStyles } from "../../../styles/reportStyles";
import useModalStore from "../../../stores/useModalStore";
import { useDailyReport } from "../../../hooks/useDaily";
import { BsInfoCircleFill } from "react-icons/bs";

type Props = {};

function DumpsterData({}: Props) {
  const { selectedId } = useModalStore();
  const { data: drData } = useDailyReport(selectedId!);

  const dumpsterList = drData?.dumpsters ?? [];
  // Total de unidades (la suma de todas las cantidades)
  const totalUnits = dumpsterList.reduce(
    (acc, curr) => acc + (curr.quantity || 0),
    0,
  );

  // Desglose para el tooltip o texto secundario (opcional)
  const dumpsterTotals = dumpsterList.reduce(
    (acc, curr) => {
      const type = curr.typeDumpster;
      acc[type] = (acc[type] || 0) + curr.quantity;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <>
      <Accordion.Item eventKey="1">
        <Accordion.Header className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center flex-grow-1">
            <span
              style={{
                fontWeight: "600",
                color: "#334155",
                fontSize: "1rem",
              }}
            >
              Dumpsters
            </span>
          </div>

          <div className="d-flex gap-0">
            {Object.keys(dumpsterTotals).length > 0 ? (
              Object.entries(dumpsterTotals).map(([label, value]) => (
                <div key={label} className="d-flex">
                  <div style={reportStyles.statBadge}>
                    <span style={reportStyles.label}>{label}</span>
                    <span style={reportStyles.value}>{value}</span>
                  </div>
                </div>
              ))
            ) : (
              /* Badge por defecto cuando está vacío */
              <div style={reportStyles.statBadge}>
                <span style={reportStyles.label}>DUMPSTERS</span>
                <span style={reportStyles.value}>0</span>
              </div>
            )}
          </div>
        </Accordion.Header>
        <Accordion.Body style={{ padding: "4px", backgroundColor: "#f8fafc" }}>
          {totalUnits === 0 ? (
            <Alert
              variant="secondary"
              className="d-flex align-items-center my-2"
            >
              <BsInfoCircleFill className="me-2" />
              No tools added.
            </Alert>
          ) : (
            ["Disposal", "External"].map((source) => {
              const items =
                drData?.dumpsters?.filter((d) => d.sourceDumpster === source) ||
                [];
              if (items.length === 0) return null;

              return (
                <div
                  key={source}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    padding: "12px",
                    marginBottom: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* Título del Grupo */}
                  <div
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: "800",
                      color: source === "External" ? "#0ea5e9" : "#6366f1",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{source} Source</span>
                    <span
                      style={{
                        backgroundColor: "#f1f5f9",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        color: "#64748b",
                      }}
                    >
                      {items.length} units
                    </span>
                  </div>

                  {/* Contenedor de Chips/Badges */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {items.map((item) => (
                      <div
                        key={item.drDumpstersId}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px 10px",
                          backgroundColor: "#f1f5f9",
                          borderRadius: "8px",
                          border: "1px solid #f1f5f9",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              fontWeight: "700",
                              fontSize: "0.85rem",
                              color: "#1e293b",
                            }}
                          >
                            {item.quantity}×
                          </div>
                          <div
                            style={{
                              fontSize: "0.85rem",
                              fontWeight: "600",
                              color: "#334155",
                            }}
                          >
                            {item.typeDumpster}
                          </div>
                        </div>

                        <div
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: "700",
                            color: "#fff",
                            backgroundColor: "#475569",
                            padding: "2px 8px",
                            borderRadius: "6px",
                          }}
                        >
                          {item.sizeDumpster}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </Accordion.Body>
      </Accordion.Item>
    </>
  );
}

export default DumpsterData;
