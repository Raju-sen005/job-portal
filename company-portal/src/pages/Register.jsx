import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // redirect ke liye

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate(); // redirect hook

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      setMsg(res.data.msg);
      setTimeout(() => navigate("/login"), 1500); // 1.5s baad login page redirect
    } catch (err) {
      setMsg(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required style={styles.input} />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required style={styles.input} />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required style={styles.input} />
          <button type="submit" style={styles.button}>Register</button>
        </form>
        <div className="text-center m-auto">
          You have an account? <a href="/login">Login</a>
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
  title: {
    marginBottom: "20px",
    color: "#333"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px"
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#007bff",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s"
  },
  msg: {
    marginTop: "15px",
    color: "#ff4d4f"
  }
};
