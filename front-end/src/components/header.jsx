import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useId } from '../context/IdContext';

function Header() {
    const { user, logout } = useId(); // Lấy thông tin user và logout từ IdContext
    const [showPopup, setShowPopup] = useState(false); // Trạng thái hiển thị popup

    const handleLogout = () => {
        logout(); // Gọi hàm logout khi nhấn nút đăng xuất
    };

    const handleClickTest = () => {
        if (!user) {
            setShowPopup(true); // Hiển thị popup nếu chưa đăng nhập
        }
    };

    return (
        <header className="bg-white p-4 flex justify-between items-center px-16 py-4 shadow-xl">
            {/* Logo */}
            <Link to="/" className="text-black text-xl font-bold flex items-center">
                <img src="logo.png" alt="Logo" className="h-8 w-8 rounded-full inline-block" />
                <span className="px-2">Roboz</span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex flex-1 items-center">
                <ul className="flex justify-center space-x-6 px-8">
                    <li><a href="#features" className="text-black hover:underline">Giới thiệu</a></li>
                    <li>
                        {user ? (
                            <Link to="/ListExam" className="text-black hover:underline">Làm bài kiểm tra</Link>
                        ) : (
                            <button onClick={handleClickTest} className="text-black hover:underline">Làm bài kiểm tra</button>
                        )}
                    </li>
                    <li><a href="#features" className="text-black hover:underline">Xem điểm</a></li>
                    <li><a href="#guide" className="text-black hover:underline">Hướng dẫn</a></li>
                    <li><a href="#contact" className="text-black hover:underline">Liên hệ</a></li>

                    {/* Chức năng "Tạo câu hỏi" chỉ hiển thị với giáo viên */}
                    {user && user.role === "teacher" && (
                        <li><Link to="/createQuestion" className="text-black hover:underline">Tạo câu hỏi</Link></li>
                    )}
                </ul>
            </nav>

            {/* Login/Register or User ID */}
            <div className="flex space-x-4 items-center font-medium">
                {user ? (
                    <>
                        <span className="bg-blue-950 text-white py-2 px-4 rounded cursor-pointer">
                            {user.username}  {/* Hiển thị ID của người dùng */}
                        </span>
                        <Link to="/">
                            <button 
                                onClick={handleLogout} 
                                className="bg-red-600 text-white py-2 px-4 rounded cursor-pointer hover:bg-red-500 transition-colors">
                                Đăng xuất
                            </button>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="bg-blue-950 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">Đăng nhập</Link>
                        <Link to="/register" className="bg-white text-black py-2 px-4 hover:underline transition-colors">Đăng ký</Link>
                    </>
                )}
            </div>

            {/* Popup thông báo */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-xs text-center">
                        <p className="mb-4">Vui lòng đăng nhập trước khi làm bài kiểm tra!</p>
                        <button 
                            onClick={() => setShowPopup(false)} 
                            className="bg-blue-950 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;
