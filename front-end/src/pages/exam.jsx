import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useId } from '../context/IdContext';


function Header({ timeLeft, questionsAnswered, handleSubmit }) {
  return (
    <div className="fixed top-0 left-0 pl-8 pr-6 w-full bg-blue-950 text-white py-4 z-50 shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <span className="font-semibold">Thời gian còn lại:</span> {timeLeft}
        </div>
        <div>
          <span className="font-semibold">Số câu đã làm:</span> {questionsAnswered}
        </div>
        <button
          onClick={handleSubmit}
          className="bg-white text-black px-4 py-2 rounded hover:bg-blue-300"
        >
          Nộp bài
        </button>
      </div>
    </div>
  );
}

// Giao diện hiển thị câu hỏi trắc nghiệm và lựa chọn
function Content({ questions, onAnswerSelect, answers }) {
  return (
    <div className="p-6 mt-20">
      {questions.map((question, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transform hover:transition duration-300 max-w-2xl mx-auto mb-6">
          <h2 className="text-xl font-bold mb-4">Câu {index + 1}: {question.text}</h2>
          {question.options.map((option, idx) => (
            <label key={idx} className="block mb-2">
              <input
                type="radio"
                name={`question-${index}`}
                value={option}
                onChange={() => onAnswerSelect(index, option)}
                checked={answers[index] === option}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}

function Exam() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [questions, setQuestions] = useState([]);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null); // State để lưu điểm số
  const { examId } = useParams();
  const { user } = useId();  // Lấy dữ liệu từ IdContext

  useEffect(() => {
    async function getExamData() {
      try {
        const response = await fetch('http://localhost:8000/exam/questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ examId })
        });

        const data = await response.json();
        if (data[0]?.TIME_TEST) {
        setTimeLeft(data[0].TIME_TEST * 60); // Giả định thời gian trả về là số phút
      }
        const formattedQuestions = data.map(item => ({
          text: item.CONTENT,
          options: [
            `A. ${item.OPTION_A}`,
            `B. ${item.OPTION_B}`,
            `C. ${item.OPTION_C}`,
            `D. ${item.OPTION_D}`
          ],
          correctAnswer: item.CORRECT_ANSWER
        }));
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
      }
    }

    getExamData();
  }, [examId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = seconds => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers({ ...answers, [questionIndex]: answer });
    setQuestionsAnswered(Object.keys(answers).length + 1);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
  };

  const confirmSubmit = async() => {

    // Tính toán điểm số
    const correctCount = questions.reduce((count, question, index) => {
      // Lấy chữ cái đại diện cho đáp án từ `answers`
      const selectedAnswer = answers[index]?.split('.')[0]; // Lấy phần đầu, ví dụ 'A' từ 'A. Đáp án 1'
  
      if (selectedAnswer === question.correctAnswer) {
        return count + 1;
      }
      return count;
    }, 0);
     
    // console.log("Điểm số: ", correctCount); 
  
    setScore(correctCount); // Lưu điểm số
    setIsSubmitting(false);

    // const response = await fetch('http://localhost:8000/exam', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     userId: user,         // user.id từ context
    //     examId: examId,          // examId từ URL hoặc state
    //     total: correctCount,     // Điểm số của người dùng
    //   }),
    // });
    console.log("User ID:", user.id);
    console.log("Exam ID:", examId);
    console.log("Total Score:", correctCount);

    try {
      const response = await fetch('http://localhost:8000/exam/submit', {
        method: 'POST',  // Sử dụng phương thức POST để gửi dữ liệu
        headers: {
          'Content-Type': 'application/json',  // Gửi dữ liệu dưới dạng JSON
        },
        body: JSON.stringify({
          userId: user.id,         // user.id từ context
          examId: examId,         // examId từ URL hoặc state
          total: correctCount,    // Điểm số của người dùng
        }),
      });
  
      if (!response.ok) {
        throw new Error('Không thể gửi dữ liệu lên server');
      }
  
      const result = await response.json();  // Nhận kết quả từ server
  
      // In ra kết quả từ server
      console.log('Kết quả từ backend:', result);

  
      // Hiển thị thông báo và quay về trang chủ sau 3 giây
      // setTimeout(() => {
      //   navigate('/');
      // }, 3000);
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu lên backend:", error);
    }
  };
  

  const cancelSubmit = () => {
    setIsSubmitting(false);
  };

  return (
    <div>
      <Header
        timeLeft={formatTime(timeLeft)}
        questionsAnswered={questionsAnswered}
        handleSubmit={handleSubmit}
      />
      <Content questions={questions} onAnswerSelect={handleAnswerSelect} answers={answers} />
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-lg text-center">
            <p className="mb-4">Bạn có chắc chắn muốn nộp bài?</p>
            <button
              onClick={confirmSubmit}
              className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600 mr-2"
            >
              Xác nhận
            </button>
            <button
              onClick={cancelSubmit}
              className="bg-gray-500 px-4 py-2 rounded text-white hover:bg-gray-600"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
      {score !== null && (
        // <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        //   <div className="bg-white p-8 rounded shadow-lg text-center">
        //     <p className="text-lg font-semibold mb-4">
        //       Bạn đã hoàn thành bài thi với số số câu trả lời đúng: {score}/{questions.length}
        //     </p>
        //     <p>Cảm ơn bạn đã tham gia!</p>
        //   </div>
        // </div>
        // <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center overflow-auto">
        //   <div className="bg-white p-8 pt-20 rounded shadow-lg text-center max-w-4xl mx-auto overflow-auto">
        //     <p className="text-lg font-semibold mb-4">
        //       Bạn đã hoàn thành bài thi với số câu trả lời đúng: {score}/{questions.length}
        //     </p>
        //     <div className="text-left">
        //       {questions.map((question, index) => {
        //         const selectedAnswer = answers[index] || "Không trả lời";
        //         const isCorrect =
        //           selectedAnswer.split(".")[0] === question.correctAnswer; // So sánh ký tự đầu tiên
        //         return (
        //           <div
        //             key={index}
        //             className={`p-4 rounded-lg mb-4 ${
        //               isCorrect ? "bg-green-100" : "bg-red-100"
        //             }`}
        //           >
        //             <p className="font-semibold">Câu {index + 1}: {question.text}</p>
        //             <p>
        //               <span className="font-semibold">Đáp án đúng: </span>
        //               {question.correctAnswer}.
        //             </p>
        //             <p>
        //               <span className="font-semibold">Bạn đã chọn: </span>
        //               {selectedAnswer} {isCorrect ? "(Đúng)" : "(Sai)"}
        //             </p>
        //           </div>
        //         );
        //       })}
        //     </div>

        //     <p>Cảm ơn bạn đã tham gia!</p>

        //     <button
        //       className="mt-4 bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-600"
        //       onClick={() => navigate("/")}
        //     >
        //       Về trang chủ
        //     </button>
        //   </div>
        // </div>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center overflow-auto">
          <div className="bg-white p-8 pt-24 rounded shadow-lg max-w-4xl mx-auto text-center overflow-y-auto">
            <p className="text-lg font-semibold mb-4">
              Bạn đã hoàn thành bài thi với số câu trả lời đúng: {score}/{questions.length}
            </p>
            <div className="text-left">
              {questions.map((question, index) => {
                const userAnswer = answers[index]?.split('.')[0]; // Lấy A, B, C, D
                const isCorrect = userAnswer === question.correctAnswer;
                return (
                  <div key={index} className="mb-6 p-4 border-b border-gray-300">
                    <p className="text-xl font-bold mb-2">
                      Câu {index + 1}: {question.text}
                    </p>
                    <div>
                      {question.options.map((option, idx) => {
                        const optionKey = option.split('.')[0]; // Lấy A, B, C, D
                        let textColor = 'text-gray-500'; // Màu mặc định

                        if (optionKey === userAnswer) {
                          textColor = isCorrect ? 'text-green-500' : 'text-red-500';
                        }

                        if (optionKey === question.correctAnswer && optionKey !== userAnswer) {
                          textColor = 'text-green-700'; // Hiển thị màu xanh đậm cho đáp án đúng
                        }

                        return (
                          <p key={idx} className={`mb-2 ${textColor}`}>
                            {option} {optionKey === userAnswer && '(Bạn đã chọn)'}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <p>Cảm ơn bạn đã tham gia!</p>

            <button
              className="mt-4 bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-600"
              onClick={() => navigate("/")}
            >
              Về trang chủ
            </button>
          </div>
          
        </div>
      )}
    </div>
  );
}

export default Exam;
