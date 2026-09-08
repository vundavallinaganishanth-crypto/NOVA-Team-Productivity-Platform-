import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const badgeStyle = {
  padding: "5px 10px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: 500,
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New task form
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [taskAssignee, setTaskAssignee] = useState("");
  const [taskError, setTaskError] = useState("");
  const [creatingTask, setCreatingTask] = useState(false);

  // Add member form
  const [memberEmail, setMemberEmail] = useState("");
  const [memberError, setMemberError] = useState("");
  const [addingMember, setAddingMember] = useState(false);

  const isOwner = project && user && project.owner?._id === user.id;

  const fetchProject = async () => {
    const response = await api.get(`/projects/${id}`);
    // Backend returns { project: {...} }, not the project directly
    setProject(response.data.project);
  };

  const fetchTasks = async () => {
    const response = await api.get(`/tasks/project/${id}`);
    setTasks(response.data.tasks || []);
  };

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchProject(), fetchTasks()]);
      } catch (error) {
        console.error("Failed to load project:", error);
        setError(error.response?.data?.message || "Failed to load project.");
      } finally {
        setLoading(false);
      }
    };

    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setTaskError("");
    setCreatingTask(true);

    try {
      await api.post("/tasks", {
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority,
        project: id,
        assignedTo: taskAssignee || undefined,
      });

      setTaskTitle("");
      setTaskDescription("");
      setTaskPriority("Medium");
      setTaskAssignee("");

      await fetchTasks();
    } catch (error) {
      console.error("Failed to create task:", error);
      setTaskError(error.response?.data?.message || "Failed to create task.");
    } finally {
      setCreatingTask(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      await fetchTasks();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      await fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setMemberError("");
    setAddingMember(true);

    try {
      await api.post(`/team/${id}/members`, { email: memberEmail });
      setMemberEmail("");
      await fetchProject();
    } catch (error) {
      console.error("Failed to add member:", error);
      setMemberError(error.response?.data?.message || "Failed to add member.");
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await api.delete(`/team/${id}/members/${userId}`);
      await fetchProject();
    } catch (error) {
      console.error("Failed to remove member:", error);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
        <Navbar />
        <div style={{ padding: "40px" }}>Loading project...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
        <Navbar />
        <div style={{ padding: "40px", color: "#dc2626" }}>{error}</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
        <Navbar />
        <div style={{ padding: "40px" }}>Project not found.</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar />

      <div style={{ padding: "40px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <button
            onClick={() => navigate("/projects")}
            style={{
              background: "transparent",
              border: "none",
              color: "#2563eb",
              cursor: "pointer",
              marginBottom: "20px",
              padding: 0,
              fontSize: "15px",
            }}
          >
            ← Back to Projects
          </button>

          {/* Project info */}
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              marginBottom: "24px",
            }}
          >
            <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
              {project.name}
            </h1>

            <p style={{ color: "#64748b", marginBottom: "20px" }}>
              {project.description || "No description provided."}
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "10px",
              }}
            >
              <span style={{ ...badgeStyle, background: "#eff6ff", color: "#1d4ed8" }}>
                Status: {project.status}
              </span>
              <span style={{ ...badgeStyle, background: "#f8fafc", color: "#475569" }}>
                Priority: {project.priority}
              </span>
              {project.dueDate && (
                <span style={{ ...badgeStyle, background: "#f8fafc", color: "#475569" }}>
                  Due: {new Date(project.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Team members */}
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              marginBottom: "24px",
            }}
          >
            <h2 style={{ marginBottom: "15px" }}>Team 👥</h2>

            <div style={{ marginBottom: "16px" }}>
              <p style={{ margin: "0 0 4px" }}>
                <strong>{project.owner?.name}</strong>{" "}
                <span style={{ color: "#64748b", fontSize: "13px" }}>
                  (Owner)
                </span>
              </p>
              <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
                {project.owner?.email}
              </p>
            </div>

            {project.members
              ?.filter((member) => member._id !== project.owner?._id)
              .map((member) => (
                <div
                  key={member._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderTop: "1px solid #f1f5f9",
                  }}
                >
                  <div>
                    <strong>{member.name}</strong>
                    <div style={{ color: "#64748b", fontSize: "14px" }}>
                      {member.email}
                    </div>
                  </div>

                  {isOwner && (
                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#dc2626",
                        cursor: "pointer",
                        fontSize: "13px",
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

            {isOwner && (
              <form
                onSubmit={handleAddMember}
                style={{ display: "flex", gap: "10px", marginTop: "20px" }}
              >
                <input
                  type="email"
                  placeholder="Add member by email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                  }}
                />
                <button
                  type="submit"
                  disabled={addingMember}
                  style={{
                    background: "#111827",
                    color: "white",
                    border: "none",
                    padding: "10px 18px",
                    borderRadius: "8px",
                    cursor: addingMember ? "not-allowed" : "pointer",
                  }}
                >
                  {addingMember ? "Adding..." : "Add"}
                </button>
              </form>
            )}

            {memberError && (
              <p style={{ color: "#dc2626", marginTop: "10px" }}>{memberError}</p>
            )}
          </div>

          {/* Tasks */}
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}
          >
            <h2 style={{ marginBottom: "15px" }}>Tasks ✅</h2>

            {tasks.length === 0 && (
              <p style={{ color: "#64748b" }}>No tasks yet. Add one below.</p>
            )}

            {tasks.map((task) => (
              <div
                key={task._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "14px 0",
                  borderBottom: "1px solid #f1f5f9",
                  gap: "12px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <strong>{task.title}</strong>
                  {task.description && (
                    <p style={{ color: "#64748b", fontSize: "14px", margin: "4px 0" }}>
                      {task.description}
                    </p>
                  )}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "6px" }}>
                    <span style={{ ...badgeStyle, background: "#f8fafc", color: "#475569" }}>
                      Priority: {task.priority}
                    </span>
                    {task.assignedTo && (
                      <span style={{ ...badgeStyle, background: "#f8fafc", color: "#475569" }}>
                        Assigned: {task.assignedTo.name}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                    }}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>

                  {isOwner && (
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#dc2626",
                        cursor: "pointer",
                        fontSize: "13px",
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* New task form */}
            <form onSubmit={handleCreateTask} style={{ marginTop: "24px" }}>
              <h3 style={{ marginBottom: "12px", fontSize: "16px" }}>
                Add a task
              </h3>

              <div style={{ marginBottom: "12px" }}>
                <input
                  type="text"
                  placeholder="Task title"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <textarea
                  placeholder="Description (optional)"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                    resize: "vertical",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                  }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>

                <select
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                  }}
                >
                  <option value="">Unassigned</option>
                  {project.owner && (
                    <option value={project.owner._id}>
                      {project.owner.name} (Owner)
                    </option>
                  )}
                  {project.members
                    ?.filter((member) => member._id !== project.owner?._id)
                    .map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name}
                      </option>
                    ))}
                </select>
              </div>

              {taskError && (
                <p style={{ color: "#dc2626", marginBottom: "12px" }}>{taskError}</p>
              )}

              <button
                type="submit"
                disabled={creatingTask}
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: creatingTask ? "not-allowed" : "pointer",
                  fontWeight: "600",
                }}
              >
                {creatingTask ? "Adding..." : "Add Task"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
