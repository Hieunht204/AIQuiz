import React, { createContext, useContext, useState } from 'react';

// Tạo Context
const IdContext = createContext();

// Component Provider
export const IdProvider = ({ children }) => {
  // Lưu `user` (id) sau khi đăng nhập thành công
  const [user, setUser] = useState(null);

  // Hàm để thiết lập `user` sau khi đăng nhập
  const setUserAfterLogin = (userData) => {
    console.log("Đang cập nhật user:", userData); // Ghi log để kiểm tra
    setUser(userData); // Luôn cập nhật lại user khi đăng nhập
  };

  // Hàm để đăng xuất (xóa thông tin người dùng)
  const logout = () => {
    setUser(null); // Xóa thông tin user khi đăng xuất
  };

  return (
    <IdContext.Provider value={{ user, setUserAfterLogin, logout }}>
      {children}
    </IdContext.Provider>
  );
};

// Custom hook để sử dụng IdContext
export const useId = () => useContext(IdContext);
