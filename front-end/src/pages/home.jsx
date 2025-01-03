// src/pages/Home.js
import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { useId } from '../context/IdContext';

// Header Component
<Header/>

// Main Content Component
function Content() {
  const { user } = useId();  // Lấy dữ liệu từ IdContext
  
  return (
    <main className="p-8 text-center mt-16">
      <h1 className="text-2xl font-semibold">Trang Trắc Nghiệm Tin Học Lớp 8</h1>
      <h2 className="text-xl mt-3">Chào mừng bạn đến với hệ thống trắc nghiệm tin học!</h2>

      {/* <div className="flex space-x-4 items-center font-medium justify-center mt-8">
        {user ? (
            <>
                {user.role === "teacher" ? (
                    <div className="bg-green-600 text-white py-2 px-4 rounded">
                        Giáo viên: {user.username}
                    </div>
                ) : user.role === "student" ? (
                    <div className="bg-blue-950 text-white py-2 px-4 rounded">
                        Học sinh: {user.username}
                    </div>
                ) : (
                    <div className="bg-gray-600 text-white py-2 px-4 rounded">
                        Vai trò không xác định
                    </div>
                )}
            </>
          ) : (
              <div className="bg-gray-600 text-white py-2 px-4 rounded">
                  Bạn chưa đăng nhập
              </div>
          )}
      </div> */}



    </main>
  );

}

// Footer Component

// Home Component that combines Header, Content, and Footer
function Home() {
  return (
    <div>
      <Header />
      <Content />
      <Footer />
    </div>
  );
}

export default Home;
