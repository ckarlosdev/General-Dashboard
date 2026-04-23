import {
  Accordion,
  Button,
  ButtonGroup,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { useDailyReport } from "../../../hooks/useDaily";
import useEmployees from "../../../hooks/useEmployees";
import useModalStore from "../../../stores/useModalStore";
import {
  manpowerRoleCounts,
  manpowerTotals,
} from "../../../utils/manpowerUtils";
import { reportStyles } from "../../../styles/reportStyles";
import { useMemo } from "react";
import type { Employee } from "../../../types";

type Props = {};

function ManpowerData({}: Props) {
  const { selectedId } = useModalStore();
  const { data: drData } = useDailyReport(selectedId!);
  const { data: employees } = useEmployees();

  const mpTotal =
    drData && drData.employees ? manpowerTotals(drData?.employees!) : null;
  const mpRoles =
    drData && drData.employees
      ? manpowerRoleCounts(drData?.employees!, employees!)
      : null;

  const employeeMap = useMemo(() => {
    return employees?.reduce(
      (acc, emp) => {
        acc[emp.employeesId] = emp;
        return acc;
      },
      {} as Record<number, Employee>,
    );
  }, [employees]);

  const assignedCrew = useMemo(() => {
    if (!drData?.employees) return [];

    return drData.employees.map((assigned) => {
      // 1. Corregimos el acceso: objeto?.[id]
      // 2. Verifica si tu propiedad es 'employeeId' o 'employeesId'
      if (!employeeMap) return null;
      const info = employeeMap[assigned.employeesId];

      return {
        ...assigned,
        fullName: info
          ? `${info.firstName} ${info.lastName}`
          : `ID: ${assigned.employeesId}`,
      };
    });
  }, [drData?.employees, employeeMap]);

  // console.log("empp", assignedCrew);

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
              Man Power
            </span>
          </div>

          <div className="d-flex gap-3 me-3">
            <div style={reportStyles.statBadge}>
              <span style={reportStyles.label}>TOTAL</span>

              <Dropdown align="end" onClick={(e) => e.stopPropagation()}>
                {/* Usamos 'as="div"' para que no herede estilos de botón de Bootstrap */}
                <Dropdown.Toggle
                  as="div"
                  className="p-0 border-0 bg-transparent"
                  style={{
                    ...reportStyles.value, // Hereda tu estilo de fuente exacto
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {mpTotal?.qty || 0}
                  <i
                    className="bi bi-chevron-down"
                    style={{ fontSize: "0.6rem", opacity: 0.5 }}
                  ></i>
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow border-0 mt-2">
                  {assignedCrew.map((emp) => (
                    <Dropdown.Item
                      key={emp?.employeesId}
                      eventKey={emp?.employeesId}
                      className="d-flex justify-content-between align-items-center py-2"
                      style={{ minWidth: "200px" }}
                    >
                      <span style={{ fontSize: "0.85rem" }}>
                        {emp?.fullName}
                      </span>

                      {emp?.lunch === "FALSE" ? (
                        <span
                          className="badge rounded-pill bg-danger-subtle text-danger ms-2"
                          style={{ fontSize: "0.6rem" }}
                        >
                          No lunch
                        </span>
                      ) : (
                        <span
                          className="badge rounded-pill bg-success-subtle text-success ms-2"
                          style={{ fontSize: "0.6rem" }}
                        >
                          Lunch
                        </span>
                      )}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div style={reportStyles.statBadge}>
              <span style={reportStyles.label}>HOURS</span>
              <span style={reportStyles.value}>
                {/* {mpTotal?.totalHours || 0}h */}
                {Number(mpTotal?.totalHours || 0).toFixed(2)}h
              </span>
            </div>
          </div>
        </Accordion.Header>
        <Accordion.Body style={{ padding: "0" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {Object.entries(mpRoles ?? {}).map(([key, role]) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "5px 20px",
                  borderBottom: "1px solid #f1f5f9",
                  transition: "background 0.2s",
                }}
              >
                {/* Cantidad con un círculo sutil */}
                <div
                  style={{
                    minWidth: "35px",
                    height: "35px",
                    borderRadius: "8px",
                    background: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    color: "#475569",
                    fontSize: "0.9rem",
                    marginRight: "15px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  {role.qty}
                </div>

                {/* Información del Rol */}
                <div style={{ flexGrow: 1 }}>
                  <div
                    style={{
                      fontWeight: "600",
                      color: "#1e293b",
                      fontSize: "0.95rem",
                    }}
                  >
                    {role.title}
                  </div>
                  <div
                    style={{
                      color: "#94a3b8",
                      fontSize: "0.75rem",
                      marginTop: "2px",
                    }}
                  >
                    Shift: {role.in} - {role.out}
                  </div>
                </div>

                {/* Total de Horas a la derecha */}
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      color: "#0f172a",
                    }}
                  >
                    {role.total * role.qty} hrs
                  </div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "#64748b",
                      textTransform: "uppercase",
                    }}
                  >
                    Totals
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </>
  );
}

export default ManpowerData;
