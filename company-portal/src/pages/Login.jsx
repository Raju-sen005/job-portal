import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ import for redirect

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate(); // ✅ hook for redirect

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      setMsg(res.data.msg);

      // JWT token and user info store
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ redirect to dashboard
      navigate("/company-profile");
    } catch (err) {
      setMsg(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>
        <div className="text-center m-auto">
          You have don't an account? <a href="/register">Register</a>
        </div>
        {msg && <p style={styles.msg}>{msg}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f0f2f5",
    padding: "20px"
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center"
  },
  title: { marginBottom: "20px", color: "#333" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px" },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#28a745",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s"
  },
  msg: { marginTop: "15px", color: "#ff4d4f" }
};
