import React, { useState } from "react";
import API, { setToken } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "", email: "", password: "", age: "", dob: "", contact: "", gender: "", userType: "", termsAccepted: false,
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.termsAccepted) {
            setError("Please accept terms & conditions");
            autoClear(setError);
            return;
        }
        setLoading(true);
        try {
            await API.post("/register", form);
            setSuccess("Registered successfully!");
            autoClear(setSuccess);
            setTimeout(() => navigate("/login"), 1000);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
            autoClear(setError);
        }
        setLoading(false);
    };

    const autoClear = (setter) => setTimeout(() => setter(""), 3000);

    return (
        <div className="container mt-5">
            <div className="card">
                <h3 className="text-center mb-3">Register</h3>

                {error && <div className="alert alert-danger">
                    {error} <span className="close-btn" onClick={() => setError("")}>×</span>
                </div>}

                {success && <div className="alert alert-success">
                    {success} <span className="close-btn" onClick={() => setSuccess("")}>×</span>
                </div>}

                <form onSubmit={handleSubmit}>
                    <input className="form-control mb-2" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
                    <input className="form-control mb-2" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />

                    <div className="input-group mb-2">
                        <input className="form-control" name="password" type={showPassword ? "text" : "password"} placeholder="Password" value={form.password} onChange={handleChange} required />
                        <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-2">
                            <input className="form-control" name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} />
                        </div>
                        <div className="col-md-6 mb-2">
                            <input className="form-control" name="dob" placeholder="DOB (YYYY-MM-DD)" value={form.dob} onChange={handleChange} />
                        </div>
                    </div>

                    <input className="form-control mb-2" name="contact" placeholder="Contact Number" value={form.contact} onChange={handleChange} />

                    <div className="row mb-2">
                        <div className="col-md-6">
                            <select className="form-select" name="gender" value={form.gender} onChange={handleChange} required>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <select className="form-select" name="userType" value={form.userType} onChange={handleChange} required>
                                <option value="">Select User Type</option>
                                <option value="student">Student</option>
                                <option value="professional">Professional</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" name="termsAccepted" checked={form.termsAccepted} onChange={handleChange} />
                        <label className="form-check-label">I accept terms & conditions</label>
                    </div>

                    <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                        {loading ? <span className="loader"></span> : "Register"}
                    </button>

                    <p className="text-center mt-2">
                        Already have an account? <a href="/login">Login</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
