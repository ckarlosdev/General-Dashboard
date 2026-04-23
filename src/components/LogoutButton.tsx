import { useState } from "react";
import { Button } from "react-bootstrap";
import { useAuthStore } from "../stores/authStore";
import { api } from "../hooks/apiConfig";

type Props = {};

function LogoutButton({}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      if (refreshToken) {
        await api.post("/auth/revoke", { refreshToken });
      }
    } catch (error) {
      console.error(
        "Error al revocar token, cerrando sesión localmente...",
        error,
      );
    } finally {
      //   reset();
      logout();
      // setIsLoaded(false);
      window.location.href = "https://ckarlosdev.github.io/login/";
    }
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      variant="outline-danger"
      style={{
        borderRadius: "10px",
        fontWeight: "bold",
        width: "120px",
        height: "40px",
      }}
      className="no-print"
    >
      {isLoading ? <span>Logging out</span> : <>Logout</>}
    </Button>
  );
}

export default LogoutButton;
