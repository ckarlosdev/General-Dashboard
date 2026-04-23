import { Accordion, Alert } from "react-bootstrap";
import { reportStyles } from "../../../styles/reportStyles";
import useModalStore from "../../../stores/useModalStore";
import { useDailyReport } from "../../../hooks/useDaily";
import { BsInfoCircleFill } from "react-icons/bs";

type Props = {};

function ToolData({}: Props) {
  const { selectedId } = useModalStore();
  const { data: drData } = useDailyReport(selectedId!);

  const totalTools = drData?.tools.reduce(
    (acc, tool) => acc + Number(tool.qty || 0),
    0,
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
              Tools
            </span>
          </div>

          <div className="d-flex gap-3 me-3">
            <div style={reportStyles.statBadge}>
              <span style={reportStyles.label}>TOTAL</span>
              <span style={reportStyles.value}>{totalTools || 0}</span>
            </div>
          </div>
        </Accordion.Header>
        <Accordion.Body style={{ padding: "4px", backgroundColor: "#fff" }}>
          {totalTools === 0 ? (
            <Alert
              variant="secondary"
              className="d-flex align-items-center my-2"
            >
              <BsInfoCircleFill className="me-2" />
              No tools added.
            </Alert>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {(drData?.tools ?? []).map((tool) => (
                <div
                  key={tool.drToolId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 16px",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  {/* Badge de Cantidad Cantidad */}
                  <div
                    style={{
                      minWidth: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                      color: "#334155",
                      marginRight: "12px",
                      fontSize: "0.85rem",
                    }}
                  >
                    {tool.qty}
                  </div>

                  {/* Info de la Herramienta */}
                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: "600",
                        color: "#1e293b",
                        fontSize: "0.9rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {tool.name === "Other" ? tool.other : tool.name}
                    </div>

                    {/* Comentarios o Notas */}
                    {tool.comments && (
                      <div
                        style={{
                          color: "#94a3b8",
                          fontSize: "0.75rem",
                          display: "flex",
                          alignItems: "center",
                          marginTop: "2px",
                        }}
                      >
                        <i
                          className="bi bi-chat-left-text me-1"
                          style={{ fontSize: "0.65rem" }}
                        ></i>
                        <span style={{ fontStyle: "italic" }}>
                          {tool.comments}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Indicador Visual Derecho */}
                  <div style={{ marginLeft: "10px" }}>
                    <i
                      className="bi bi-box-seam"
                      style={{ color: "#cbd5e1" }}
                    ></i>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </>
  );
}

export default ToolData;
