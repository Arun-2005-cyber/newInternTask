import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const autoClear = () => setTimeout(() => setMessage({ type: "", text: "" }), 3000);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        API.get("/profile", { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                if (res.data.success) {
                    setUser(res.data.user);
                    setForm({
                        age: res.data.user.age || "",
                        dob: res.data.user.dob || "",
                        contact: res.data.user.contact || "",
                        gender: res.data.user.gender || "",
                        userType: res.data.user.userType || "",
                    });
                } else {
                    navigate("/login");
                }
            })
            .catch(() => navigate("/login"));
    }, [navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.put("/profile", form);
            if (res.data.success) {
                setUser(res.data.user);
                setMessage({ type: "success", text: "Profile updated successfully" });
                autoClear();
            }
        } catch {
            setMessage({ type: "error", text: "Update failed" });
            autoClear();
        }
        setLoading(false);
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (!user) return <h4 className="text-center mt-5">Loading...</h4>;

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="d-flex justify-content-between align-items-center">
                    <h3>{user.name}</h3>
                    <button className="btn btn-danger btn-sm" onClick={logout}>Logout</button>
                </div>

                {message.text && (
                    <div className={`alert alert-${message.type === "success" ? "success" : "danger"}`}>
                        {message.text} <span className="close-btn" onClick={() => setMessage({ type: "", text: "" })}>×</span>
                    </div>
                )}

                <p><strong>Email:</strong> {user.email}</p>

                <form onSubmit={handleUpdate}>
                    <div className="row">
                        <div className="col-md-4 mb-2">
                            <input className="form-control" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
                        </div>
                        <div className="col-md-4 mb-2">
                            <input className="form-control" placeholder="DOB" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
                        </div>
                        <div className="col-md-4 mb-2">
                            <input className="form-control" placeholder="Contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
                        </div>
                    </div>

                    <div className="row mb-2">
                        <div className="col-md-6">
                            <select className="form-select" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <select className="form-select" value={form.userType} onChange={(e) => setForm({ ...form, userType: e.target.value })}>
                                <option value="">Select User Type</option>
                                <option value="student">Student</option>
                                <option value="professional">Professional</option>
                            </select>
                        </div>
                    </div>

                    <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                        {loading ? <span className="loader"></span> : "Update Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
}
