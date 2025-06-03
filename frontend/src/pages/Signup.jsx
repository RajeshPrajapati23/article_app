import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState({});
  const navigate = useNavigate();
  let api = import.meta.env.VITE_API;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const err = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isvalid = true;
    if (!form.name) {
      err.name = "Name is required";
    } else if (!nameRegex.test(form.name)) {
      err.name = "Only letters are allowed";
    }

    if (!form.email) {
      err.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      err.email = "Invalid email address";
    }

    if (!form.password) {
      err.password = "Password is required";
    } else if (form.password.trim() < 5) {
      err.password = "Password must be 5 or long";
    }
    setError(err);
    return Object.keys(err).length >= 1 ? false : true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setError({});
    try {
      let res = await axios.post(api + "/api/auth/signup", form);
      console.log("res", res);
      if (res?.data.succ) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100 bg-light"
      style={{ marginTop: "60px" }}
    >
      <div className="card shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body">
          <h3 className="card-title mb-4 text-center">Register</h3>
          <form>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
              <span className="text-danger">{error.name}</span>
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                required
              />
              <span className="text-danger">{error.email}</span>
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                required
              />
              <span className="text-danger">{error.password}</span>
            </div>
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                name="role"
                className="form-select"
                value={form.role}
                onChange={handleChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button onClick={handleSubmit} className="btn btn-danger w-100">
              Sign Up
            </button>
            <Link className="text-danger mt-2" to="/login">
              Already have an account? Login now
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
