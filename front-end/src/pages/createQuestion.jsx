import React, { useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useId } from '../context/IdContext';

// Header Component
<Header/>

// Main Content Component
function Content() {
  const [knowledge, setKnowledge] = useState(''); // Kiến thức nhập vào
  const [prompt, setPrompt] = useState(''); // Prompt yêu cầu tạo câu hỏi
  const [result, setResult] = useState(''); // Kết quả hiển thị

  // Hàm để gửi yêu cầu
  const handleGenerateQuestions = async () => {
      if (prompt.trim() !== '' && knowledge.trim() !== '') {
        try {
            const response = await axios.post('http://localhost:8000/createQuestion', {
                knowledge,
                prompt
            });
            setResult(response.data.result);
        } catch (error) {
            console.error('Error generating questions:', error);
            setResult('Đã xảy ra lỗi khi tạo câu hỏi.');
        }
        // Giả lập kết quả từ AI (sau này có thể tích hợp API)
        // setResult(`Generated questions based on the knowledge: ${knowledge}\nPrompt: ${prompt}`);
        setPrompt('');
      }
  };

  return (
      <div className="w-full max-w-4xl mx-auto my-10 p-4 bg-white shadow-lg rounded-lg">
          {/* Ô nhập kiến thức */}
          <div className="mb-4">
              <textarea
                  value={knowledge}
                  onChange={(e) => setKnowledge(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg h-32"
                  placeholder="Nhập kiến thức..."
              ></textarea>
          </div>

          {/* Input prompt và nút gửi */}
          <div className="flex items-center space-x-4 mb-4">
              <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                  placeholder="Nhập yêu cầu tạo câu hỏi..."
              />
              <button
                  onClick={handleGenerateQuestions}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                  Gửi
              </button>
          </div>

          {/* Ô hiển thị kết quả */}
          <div className="p-4 border border-gray-300 rounded-lg bg-gray-100 h-64 overflow-y-auto">
              <pre>{result ? result : "Kết quả sẽ được hiển thị ở đây..."}</pre>
          </div>
      </div>
  );
}

function CreateQuestion() {
    return (
        <div>
          <Header />
          <Content />
          <Footer />
        </div>
      );
}

export default CreateQuestion;