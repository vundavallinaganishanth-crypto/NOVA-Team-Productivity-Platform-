import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 40px",
        background: "white",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <Link
        to="/dashboard"
        style={{ textDecoration: "none", color: "#0f172a" }}
      >
        <h2 style={{ margin: 0 }}>NOVA 🚀</h2>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <Link
          to="/dashboard"
          style={{ textDecoration: "none", color: "#334155", fontWeight: 500 }}
        >
          Dashboard
        </Link>
        <Link
          to="/projects"
          style={{ textDecoration: "none", color: "#334155", fontWeight: 500 }}
        >
          Projects
        </Link>
        <span style={{ color: "#64748b" }}>{user?.name}</span>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            background: "white",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
