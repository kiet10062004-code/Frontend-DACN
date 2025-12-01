import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const email = params.get("email");
  const otp = params.get("otp");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!newPassword || !confirmPassword) return setError("Vui lòng nhập mật khẩu và xác nhận");
    if (newPassword !== confirmPassword) return setError("Mật khẩu xác nhận không khớp");

    if (!email) return setError("Email không được để trống");
    if (!otp) return setError("OTP không được để trống");

    try {
      const res = await axios.post("https://backend-dacn-hmw1.onrender.com/api/reset-password/", {
        email,
        otp,
        new_password: newPassword
      });

      setMessage(res.data.message);
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {
      setError(err.response?.data?.error || "Có lỗi xảy ra");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "50px auto", padding: 30 }}>
      <h2>Đổi mật khẩu</h2>

      <input type="password" placeholder="Mật khẩu mới" value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)} />

      <input type="password" placeholder="Xác nhận mật khẩu" value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)} />

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <button type="submit">Đổi mật khẩu</button>
    </form>
  );
}
