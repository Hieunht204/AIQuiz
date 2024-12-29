  import React, { useEffect, useState } from 'react';
  import { Link } from 'react-router-dom';
  import Header from '../components/header';
  import Footer from '../components/footer';

  function Content() {
    const [exams, setExams] = useState([]);

    useEffect(() => {
      fetch("http://localhost:8000/listExam")
        .then((response) => response.json())
        .then((data) => {
          // Cập nhật thời gian mặc định cho mỗi bài kiểm tra
          const updatedData = data.map((exam) => ({
            ...exam,
            startTime: "01/01/2024",
            endTime: "31/12/2025",
            scorePerQuestion: exam.QUANITY > 0 ? (10 / exam.QUANITY).toFixed(2) : 0,
          }));
          setExams(updatedData);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
      <div className="bg-gray-100 min-h-screen px-12 py-8">
        <h1 className="text-3xl font-bold text-center my-4">Danh sách Bài Kiểm Tra</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {exams.map((exam) => (
            <Link to={`/exam/${exam.EXAM_ID}`}>
              <div
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transform hover:transition duration-300 w-auto mx-auto h-80"
              >
                <h2 className="text-xl font-bold text-blue-600 mb-2 leading-tight">{exam._NAME}</h2>
                <p><span className="font-medium">Loại:</span> {exam._TYPE}</p>
                <p><span className="font-medium">Môn:</span> Tin học 8</p>
                <p><span className="font-medium">Bắt đầu:</span> {exam.startTime}</p>
                <p><span className="font-medium">Kết thúc:</span> {exam.endTime}</p>
                <p><span className="font-medium">Thời gian:</span> {exam.TIME_TEST} phút</p>
                <p><span className="font-medium">Số câu:</span> {exam.QUANITY}</p>
                <p><span className="font-medium">Số điểm cho mỗi câu:</span> {exam.scorePerQuestion}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  function ListExam() {
    return (
      <div>
        <Header />
        <Content />
        <Footer />
      </div>
    );
  }

  export default ListExam;
