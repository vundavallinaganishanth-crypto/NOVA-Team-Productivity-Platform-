import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const CreateProject = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Planning",
    priority: "Medium",
    dueDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Bug fix: previously posted an undefined `projectData` variable
      await api.post("/projects", formData);
      navigate("/projects");
    } catch (error) {
      console.error("Failed to create project:", error);
      setError(error.response?.data?.message || "Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar />

      <div style={{ padding: "40px" }}>
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            background: "white",
            padding: "35px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
          }}
        >
          <h1 style={{ fontSize: "30px", marginBottom: "8px" }}>
            Create New Project 🚀
          </h1>

          <p style={{ color: "#64748b", marginBottom: "30px" }}>
            Create a project and start managing your work.
          </p>

          {error && (
            <div
              style={{
                background: "#fef2f2",
                color: "#dc2626",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Project Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter project name"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project"
                rows="4"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                  }}
                >
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                  }}
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                  }}
                >
                  Priority
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                  }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Due Date
              </label>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "12px 22px",
                  borderRadius: "8px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "600",
                }}
              >
                {loading ? "Creating..." : "Create Project"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/projects")}
                style={{
                  background: "#e2e8f0",
                  color: "#334155",
                  border: "none",
                  padding: "12px 22px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
