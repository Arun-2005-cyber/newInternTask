import React, { useState } from "react";
import API, { setToken } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.post("/login", form);
            setToken(res.data.token);
            localStorage.setItem("token", res.data.token);
            navigate("/profile");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
            autoClear(setError);
        }
        setLoading(false);
    };

    const autoClear = (setter) => setTimeout(() => setter(""), 3000);

    return (
        <div className="container mt-5">
            <div className="card">
                <h3 className="text-center mb-3">Login</h3>

                {error && <div className="alert alert-danger">
                    {error} <span className="close-btn" onClick={() => setError("")}>×</span>
                </div>}

                <form onSubmit={handleSubmit}>
                    <input
                        className="form-control mb-2"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                    />

                    <div className="input-group mb-3">
                        <input
                            className="form-control"
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <button className="btn btn-success w-100" type="submit" disabled={loading}>
                        {loading ? <span className="loader"></span> : "Login"}
                    </button>

                    <p className="text-center mt-2">
                        Don't have an account? <a href="/register">Register</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
