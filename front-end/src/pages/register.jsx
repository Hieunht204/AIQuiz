// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useId } from '../context/IdContext';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { setUserAfterLogin } = useId();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);  // State cho popup
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // if (password === confirmPassword) {
    //   console.log('Đăng ký với:', username, password);
    // } else {
    //   alert('Mật khẩu không khớp!');
    // }


    if (password === confirmPassword) {
      try {
        const response = await fetch("http://localhost:8000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
  
        const data = await response.json();
  
        if (response.ok && data.success) {
          alert(data.message);  // Notify user of successful registration
          navigate("/login");  // Redirect to login page
        } else {
          alert(data.message || "Đăng ký thất bại. Vui lòng thử lại.");
        }
      } catch (error) {
        alert("Lỗi khi đăng ký: " + error.message);
      }
    } else {
      alert("Mật khẩu không khớp!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <Link to="/" className="text-black text-xl font-bold flex items-center justify-center my-4">
          <img href="index.html" src="logo.png" alt="Logo" className="h-8 w-8 rounded-full inline-block" />
          <a href="index.html" className="px-2">Roboz</a>
        </Link>
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Đăng ký tài khoản</h2>

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-600">Tên người dùng</label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên người dùng"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-600">Mật khẩu</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-600">Xác nhận mật khẩu</label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition-colors">
            Đăng ký
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
