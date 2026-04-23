import { Button } from "react-bootstrap";
import hmbLogo from "../assets/hmbLogo.png";
import { useAuthStore } from "../stores/authStore";
import LogoutButton from "./LogoutButton";
import { IoHomeSharp } from "react-icons/io5";

type Props = {};

function Title({}: Props) {
  const { user: userAuth } = useAuthStore();

  return (
    <>
      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
          marginBottom: "10px",
        }}
      >
        <div>
          <img style={{ width: "200px" }} src={hmbLogo} alt="" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Button
              variant="outline-danger"
              className="no-print"
              style={{ fontWeight: "bold" }}
              onClick={() => {
                window.location.href = `https://ckarlosdev.github.io/HMBrandt/`;
              }}
            >
              <IoHomeSharp className="me-2" />
              Home
            </Button>
          </div>
          <div>
            <h4
              style={{
                fontWeight: "bold",
                marginTop: "20px",
                marginBottom: "10px",
              }}
            >
              Dashboard
            </h4>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
              marginLeft: "auto",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                color: "#6c757d",
                borderRight: "1px solid #dee2e6",
                paddingRight: "15px",
                fontWeight: "500",
              }}
            >
              <span style={{ opacity: 0.7 }}>User: </span>
              <span className="text-dark">{userAuth?.fullName || "Guest"}</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>
    </>
  );
}

export default Title;
