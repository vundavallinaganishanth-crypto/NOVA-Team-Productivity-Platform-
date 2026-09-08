import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects");
        // Backend returns { projects: [...] }, not a raw array
        setProjects(response.data.projects || []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);

        setError(
          error.response?.data?.message || "Failed to load projects."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar />

      <div style={{ padding: "40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            <div>
              <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>
                Projects 📁
              </h1>

              <p style={{ color: "#64748b" }}>
                Manage your projects and track their progress.
              </p>
            </div>

            <button
              onClick={() => navigate("/projects/create")}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              + New Project
            </button>
          </div>

          {loading && <p style={{ color: "#64748b" }}>Loading projects...</p>}

          {error && <p style={{ color: "#dc2626" }}>{error}</p>}

          {!loading && !error && projects.length === 0 && (
            <div
              style={{
                background: "white",
                padding: "50px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                textAlign: "center",
              }}
            >
              <h2>No projects yet 📂</h2>

              <p style={{ color: "#64748b", marginTop: "10px" }}>
                Create your first project to get started.
              </p>
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
                style={{
                  background: "white",
                  padding: "24px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  cursor: "pointer",
                  transition: "box-shadow 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.08)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
                  {project.name}
                </h2>

                <p style={{ color: "#64748b", minHeight: "45px" }}>
                  {project.description || "No description provided."}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      background: "#eff6ff",
                      color: "#1d4ed8",
                      padding: "5px 10px",
                      borderRadius: "20px",
                      fontSize: "13px",
                    }}
                  >
                    {project.status}
                  </span>

                  <span
                    style={{
                      background: "#f8fafc",
                      color: "#475569",
                      padding: "5px 10px",
                      borderRadius: "20px",
                      fontSize: "13px",
                    }}
                  >
                    {project.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
