import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useId } from '../context/IdContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUserAfterLogin } = useId();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);  // State cho popup
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // console.log("Data truyền vào setUserAfterLogin:", {
      //   id: data.user.id,
      //   username: data.user.username,
      //   role: data.user.role,
      // });
      setUserAfterLogin({
        id: data.user.id,
        username: data.user.username,
        role: data.user.role
      });
      setError('');  // Xóa thông báo lỗi
      setShowSuccessPopup(true);  // Hiển thị popup thành công
      setTimeout(() => {
        setShowSuccessPopup(false);  // Ẩn popup sau 1.5 giây
        navigate('/');  // Điều hướng sau khi popup biến mất
      }, 1500);
    } else {
      setError(data.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-green-500 text-lg font-semibold mb-2">Đăng nhập thành công!</h3>
            <p className="text-gray-700">Bạn sẽ được chuyển hướng trong giây lát...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Đăng nhập</h2>

        <form onSubmit={handleLogin}>
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

          <div className="mb-6">
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

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition-colors">
            Đăng nhập
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">Đăng ký</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
