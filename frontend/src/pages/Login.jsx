import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setAuth } from "../common/helper";
import { toast } from "react-toastify";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      let res = await axios.post(api + "/api/auth/login", form);
      console.log("res", res);
      setAuth({ token: res?.data?.token, user: res?.data?.user });
      if (res?.data.succ) {
        navigate("/");
        toast.success("Login successfully");
      } else {
        toast.error(res?.data.msg);
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed.");
      toast.error(err.response?.data?.msg || "Login failed.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light mt-5">
      <div className="card shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body">
          <h3 className="card-title mb-4 text-center">Login</h3>
          <form>
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
            <div className="mb-3"></div>
            <button onClick={handleSubmit} className="btn btn-danger w-100">
              Sign Up
            </button>
            <Link className="text-danger mt-2" to="/signup">
              New here ? Create now
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
