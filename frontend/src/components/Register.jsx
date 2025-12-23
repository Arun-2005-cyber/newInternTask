import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    userType: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email is invalid";
    if (!form.password || form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!form.gender) newErrors.gender = "Select gender";
    if (!form.userType) newErrors.userType = "Select user type";
    if (!form.termsAccepted) newErrors.termsAccepted = "Accept terms & conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await API.post("/register", form);
      setSuccess("Registered successfully!");
      setTimeout(() => {
        setSuccess("");
        navigate("/login");
      }, 1500);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Registration failed" });
    }
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <div className="card p-3">
        <h3 className="text-center mb-3">Register</h3>

        {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
          {errors.name && <small className="text-danger">{errors.name}</small>}

          <input className="form-control mb-2" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          {errors.email && <small className="text-danger">{errors.email}</small>}

          <div className="input-group mb-2">
            <input className="form-control" name="password" type={showPassword ? "text" : "password"} placeholder="Password" value={form.password} onChange={handleChange} />
            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <small className="text-danger">{errors.password}</small>}

          <select className="form-select mb-2" name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <small className="text-danger">{errors.gender}</small>}

          <select className="form-select mb-2" name="userType" value={form.userType} onChange={handleChange}>
            <option value="">Select User Type</option>
            <option value="student">Student</option>
            <option value="professional">Professional</option>
          </select>
          {errors.userType && <small className="text-danger">{errors.userType}</small>}

          <div className="form-check mb-2">
            <input className="form-check-input" type="checkbox" name="termsAccepted" checked={form.termsAccepted} onChange={handleChange} />
            <label className="form-check-label">I accept terms & conditions</label>
          </div>
          {errors.termsAccepted && <small className="text-danger">{errors.termsAccepted}</small>}

          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
