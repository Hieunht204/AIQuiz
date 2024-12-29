import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import { useId } from '../context/IdContext';


function Content() {
  const { user } = useId();  
  const [examData, setExamData] = useState([]);
  
  useEffect(() => {
    if (!user || !user.id) {
      console.warn("Không tìm thấy user ID");
      return;
    }

    const sendUserIdToBackend = async () => {
      try {
        const response = await fetch('http://localhost:8000/completedExam', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }), // Gửi userId
        });

        if (!response.ok) {
          throw new Error('Không thể gửi user ID về server');
        }

        const data = await response.json();
        setExamData(data);
      } catch (error) {
        console.error("Lỗi khi gửi user ID:", error);
        
      }
    };

    sendUserIdToBackend(); // Gọi hàm khi component render
  }, [user]);

  return (
    <div className="bg-gray-100 min-h-screen px-12 py-8 mt-16">
            <h1 className="text-3xl font-bold text-center my-4">Danh sách bài kiểm tra đã hoàn thành</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {examData.map((exam) => (
          
                  <div
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transform hover:transition duration-300 w-64 mx-auto h-80"
                  >
                    <h2 className="text-xl font-bold text-blue-600 mb-2 leading-tight">{exam._NAME}</h2>
                    <p><span className="font-medium">Loại:</span> {exam._TYPE}</p>
                    <p><span className="font-medium">Môn:</span> Tin học 8</p>
                    <p><span className="font-medium">Bắt đầu:</span> {exam.startTime}</p>
                    <p><span className="font-medium">Kết thúc:</span> {exam.endTime}</p>
                    <p><span className="font-medium">Thời gian:</span> {exam.TIME_TEST} phút</p>
                    <p><span className="font-medium">Số câu:</span> {exam.QUANITY}</p>
                    <p><span className="font-medium">Điểm:</span> {exam.TOTAL}</p>
                  </div>
      
              ))}
            </div>
          </div>
  );
}

function CompletedExam() {
  return (
    <div>
      <Header />
      <Content />
      <Footer />
    </div>
  );

}

export default CompletedExam;
