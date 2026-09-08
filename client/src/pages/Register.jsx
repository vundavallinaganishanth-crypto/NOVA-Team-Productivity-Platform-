import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post("/auth/register", formData);

      console.log("Register response:", response.data);

      setMessage("Registration successful! 🎉");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);

      setMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "30px",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          NOVA 🚀
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "25px",
          }}
        >
          Plan. Collaborate. Deliver.
        </p>

        <h2 style={{ marginBottom: "20px" }}>
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label>Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "6px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "6px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              minLength="6"
              required
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "6px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              background: "#111827",
              color: "white",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            Already have an account?{" "}

            <Link
              to="/login"
              style={{
                color: "#111827",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Login
            </Link>
          </p>
        </form>

        {message && (
          <p
            style={{
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;