import { Accordion } from "react-bootstrap";
import useModalStore from "../../../stores/useModalStore";
import { useDailyReport } from "../../../hooks/useDaily";
import useEmployees from "../../../hooks/useEmployees";
import useEquipments from "../../../hooks/equipments";
import { countRentals, equipmentTotals } from "../../../utils/equipmentUtils";
import { reportStyles } from "../../../styles/reportStyles";
import { BsPaperclip } from "react-icons/bs";
import { GiMineTruck } from "react-icons/gi";
import { IoPerson } from "react-icons/io5";

type Props = {};

function EquipmentData({}: Props) {
  const { selectedId } = useModalStore();
  const { data: drData } = useDailyReport(selectedId!);
  const { data: employees } = useEmployees();
  const { data: equipments } = useEquipments();

  const eTotal =
    drData && drData.equipments ? equipmentTotals(drData.equipments) : null;
  const rentals =
    drData && drData.rentals ? countRentals(drData.rentals) : null;

  const equipTotal =
    eTotal?.qty || 0 + (rentals ? rentals?.A || 0 + rentals?.E || 0 : 0);
  const equipmentList = drData?.equipments ?? [];
  const onlyEquipments = equipmentList.filter((e) => e.type === "Equipment");
  const equipmentsCount = equipmentList.filter(
    (e) => e.type === "Equipment",
  ).length;
  const attachmentsCount = equipmentList.filter(
    (e) => e.type === "Attachment",
  ).length;

  return (
    <>
      <Accordion.Item eventKey="0">
        <Accordion.Header className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center flex-grow-1">
            <span
              style={{
                fontWeight: "600",
                color: "#334155",
                fontSize: "1rem",
              }}
            >
              Equipments
            </span>
          </div>

          <div className="d-flex gap-3 me-3">
            <div style={reportStyles.statBadge}>
              <span style={reportStyles.label}>TOTAL</span>
              <span style={reportStyles.value}>{equipTotal}</span>
            </div>
            <div style={reportStyles.statBadge}>
              <span style={reportStyles.label}>HOURS</span>
              <span style={reportStyles.value}>
                {Number(eTotal?.totalHours || 0).toFixed(1)}h
              </span>
            </div>
          </div>
        </Accordion.Header>
        <Accordion.Body style={{ padding: "0", backgroundColor: "#fff" }}>
          {/* Banner de Resumen Compacto */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr", // Dividimos en dos columnas
              gap: "1px", // Crea una línea divisoria sutil
              backgroundColor: "#e2e8f0", // Color de la línea divisoria
              borderBottom: "2px solid #e2e8f0",
            }}
          >
            {/* Sección: Owned / Company */}
            <div
              style={{
                backgroundColor: "#f0f9ff",
                padding: "10px 12px",
              }}
            >
              <div
                style={{
                  fontSize: "0.6rem",
                  color: "#0369a1",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                }}
              >
                Internal Assets
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    color: "#1e293b",
                  }}
                >
                  <GiMineTruck className="me-1" />
                  EQ: {equipmentsCount}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    color: "#64748b",
                  }}
                >
                  <BsPaperclip className="me-1" /> AT: {attachmentsCount}
                </span>
              </div>
            </div>

            {/* Sección: Rentals */}
            <div
              style={{
                backgroundColor: "#f0f9ff",
                padding: "10px 12px",
              }}
            >
              {" "}
              {/* Azul muy tenue para diferenciar */}
              <div
                style={{
                  fontSize: "0.6rem",
                  color: "#0369a1",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                }}
              >
                Rentals
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    color: "#0c4a6e",
                  }}
                >
                  <GiMineTruck className="me-1" /> EQ: {rentals?.E || 0}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    color: "#0c4a6e",
                  }}
                >
                  <BsPaperclip className="me-1" />
                  AT: {rentals?.A || 0}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {onlyEquipments.map((item) => {
              const usage =
                parseFloat(item.newHour || "0") -
                parseFloat(item.initialHour || "0");

              const equipment = equipments?.find(
                (equip) => equip.equipmentsId === item.equipmentsId,
              );
              const operator = employees?.find(
                (employee) => employee.employeesId === item.employeesId,
              );

              const fullName = operator?.firstName + " " + operator?.lastName;

              return (
                <div
                  key={item.drEquipmentsId}
                  style={{
                    padding: "12px",
                    paddingTop: "4px",
                    paddingBottom: "4px",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  {/* Fila Superior: ID y Horas Totales */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "0.6rem",
                          color: "#94a3b8",
                          fontWeight: "700",
                        }}
                      >
                        {equipment?.name}
                      </div>
                      <div
                        style={{
                          fontWeight: "800",
                          color: "#0f172a",
                          fontSize: "1rem",
                        }}
                      >
                        #{equipment?.number}
                      </div>
                    </div>

                    <div
                      style={{
                        textAlign: "right",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        background: usage > 0 ? "#eff6ff" : "#f8fafc",
                        border: `1px solid ${usage > 0 ? "#3b82f6" : "#e2e8f0"}`,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "800",
                          color: usage > 0 ? "#2563eb" : "#94a3b8",
                        }}
                      >
                        +{usage.toFixed(1)}
                      </span>
                      <span
                        style={{
                          fontSize: "0.6rem",
                          marginLeft: "3px",
                          fontWeight: "700",
                        }}
                      >
                        HRS
                      </span>
                    </div>
                  </div>

                  {/* Fila Inferior: Lecturas y Operador */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#64748b",
                      }}
                    >
                      <IoPerson className="me-1" />
                      Op: {fullName || "N/A"}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#475569",
                        backgroundColor: "#f1f5f9",
                        padding: "2px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      <span style={{ color: "#94a3b8" }}>
                        {item.initialHour}
                      </span>
                      <i
                        className="bi bi-arrow-right mx-1"
                        style={{ fontSize: "0.6rem" }}
                      ></i>
                      <span style={{ fontWeight: "600" }}>{item.newHour}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </>
  );
}

export default EquipmentData;
