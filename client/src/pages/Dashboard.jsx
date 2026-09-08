import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get("/dashboard/stats");
        setStats(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch dashboard stats:",
          error.response?.data?.message || error.message
        );
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar />

      <div style={{ padding: "40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
            Welcome to NOVA 🚀
          </h1>

          <p style={{ color: "#64748b", marginBottom: "30px" }}>
            Hello, {user?.name || "User"}! Here's your productivity overview.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            >
              <h3>Projects</h3>
              <p style={{ fontSize: "28px", fontWeight: "bold" }}>
                {stats.projects}
              </p>
            </div>

            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            >
              <h3>Tasks</h3>
              <p style={{ fontSize: "28px", fontWeight: "bold" }}>
                {stats.tasks}
              </p>
            </div>

            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            >
              <h3>In Progress</h3>
              <p style={{ fontSize: "28px", fontWeight: "bold" }}>
                {stats.inProgress}
              </p>
            </div>

            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            >
              <h3>Completed</h3>
              <p style={{ fontSize: "28px", fontWeight: "bold" }}>
                {stats.completed}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
