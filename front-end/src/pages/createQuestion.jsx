import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useId } from '../context/IdContext';

// Header Component
<Header/>

// Sidebar Component
function Sidebar({ knowledgeByTopic, onSelectTopic }) {
    return (
      <div className="sidebar w-52 h-full bg-gray-200 p-4 overflow-y-auto me-5 rounded-lg">
        <h2 className="text-xl font-semibold mb-3 ">Danh sách chủ đề</h2>
        <ul>
          {Object.keys(knowledgeByTopic).map((topic) => (
            <li
              key={topic}
              className="cursor-pointer hover:text-blue-500 mb-2"
              onClick={() => onSelectTopic(topic)} // Khi click vào chủ đề, sẽ gọi hàm onSelectTopic
            >
              {topic}
            </li>
          ))}
        </ul>
      </div>
    );
}

// Modal Component
function Modal({ isOpen, onClose, content }) {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(content).then(() => {
          setIsCopied(true); // Hiển thị thông báo sao chép thành công
          setTimeout(() => setIsCopied(false), 3000); // Ẩn thông báo sau 3 giây
        }).catch(err => {
          console.error("Lỗi sao chép nội dung:", err);
        });
      };
  
    if (!isOpen) return null;
  
    return (
      <div className="z-50 fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center flex-col items-center">
        <h3 className="text-xl font-semibold mb-4 text-center w-1/2 h-auto mt-3 mb-0 p-3 bg-white rounded-t-lg">Nội dung của chủ đề </h3>
        <div className="bg-white p-6 w-1/2 h-auto overflow-y-auto relative">
          <button
            onClick={onClose}
            className="fixed top-2 right-2 text-3xl font-bold"
          >
            X
          </button>
          <pre className="whitespace-pre-wrap mb-4">{content}</pre>
        </div>
        <div className="text-xl font-semibold mb-4 text-center w-1/2 h-auto mb-3 p-3 bg-white rounded-b-lg ">
            <button
            onClick={copyToClipboard}
            className="bg-blue-500 text-white text-lg px-4 py-1 rounded-lg hover:bg-blue-600 flex justify-self-center"
            >
            Sao chép
            </button>
        </div>
        {/* Thông báo sao chép thành công */}
        {isCopied && (
          <div className="absolute top-10 p-4 bg-green-500 text-white rounded-lg shadow-lg">
            Nội dung đã được sao chép!
          </div>
        )}
      </div>
    );
  }

// Main Content Component
function Content() {
    const [knowledge, setKnowledge] = useState(''); // Kiến thức nhập vào
    const [prompt, setPrompt] = useState(''); // Prompt yêu cầu tạo câu hỏi
    const [result, setResult] = useState(''); // Kết quả hiển thị

    const [sampleKnowledge, setSampleKnowledge] = useState({});
    const [selectedTopic, setSelectedTopic] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    // Fetch dữ liệu từ backend khi component mount
    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:8000/createQuestion");
            setSampleKnowledge(response.data.knowledgeByTopic);
            console.log("Dữ liệu nhận được từ backend:", response.data);
        } catch (error) {
            console.error("Lỗi khi gọi GET:", error);
        }
        };
        fetchData();
    }, []);

    // Hàm để gửi yêu cầu tạo câu hỏi
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

    // Hàm để khi click vào topic, hiển thị nội dung
    const handleSelectTopic = (topic) => {
        setSelectedTopic(topic);
        setIsModalOpen(true); // Mở modal khi chọn chủ đề
    };

    // Đóng modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        // <div className="w-full max-w-4xl mx-auto my-10 p-4 bg-white shadow-lg rounded-lg">
        //     {/* Sidebar */}
        //     <Sidebar
        //         knowledgeByTopic={sampleKnowledge}
        //         onSelectTopic={handleSelectTopic}
        //     />
        //     {/* Hiển thị nội dung của chủ đề đã chọn */}
        //     {selectedTopic && (
        //     <div className="mb-4">
        //         <h3 className="text-lg font-semibold">{selectedTopic}</h3>
        //         <pre className="whitespace-pre-wrap">{sampleKnowledge[selectedTopic]}</pre>
        //     </div>
        //     )}

        //     {/* Ô nhập kiến thức */}
        //     <div className="mb-4">
        //         <textarea
        //             value={knowledge}
        //             onChange={(e) => setKnowledge(e.target.value)}
        //             className="w-full p-2 border border-gray-300 rounded-lg h-32"
        //             placeholder="Nhập kiến thức..."
        //         ></textarea>
        //     </div>

        //     {/* Input prompt và nút gửi */}
        //     <div className="flex items-center space-x-4 mb-4">
        //         <input
        //             type="text"
        //             value={prompt}
        //             onChange={(e) => setPrompt(e.target.value)}
        //             className="flex-1 p-2 border border-gray-300 rounded-lg"
        //             placeholder="Nhập yêu cầu tạo câu hỏi..."
        //         />
        //         <button
        //             onClick={handleGenerateQuestions}
        //             className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        //         >
        //             Gửi
        //         </button>
        //     </div>

        //     {/* Ô hiển thị kết quả */}
        //     <div className="p-4 border border-gray-300 rounded-lg bg-gray-100 h-64 overflow-y-auto">
        //         <pre style={{fontFamily: 'Arial, sans-serif'}}>{result ? result : "Kết quả sẽ được hiển thị ở đây..."}</pre>
        //     </div>
        // </div>

        <div className="flex mt-24 my-12 justify-center"> {/* pt-16 để Sidebar nằm dưới Header */}
        {/* Sidebar */}
        <Sidebar
            knowledgeByTopic={sampleKnowledge}
            onSelectTopic={handleSelectTopic}
        />

        {/* Content */}
        <div className="w-3/4 p-4 bg-white shadow-lg rounded-lg ml-1/4 pt-0">
            {/* Ô nhập kiến thức */}
            <div className="mb-4">
            <textarea
                value={knowledge}
                onChange={(e) => setKnowledge(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg h-40"
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
            <pre style={{ fontFamily: 'Arial, sans-serif' }}>
                {result ? result : "Kết quả sẽ được hiển thị ở đây..."}
            </pre>
            </div>
        </div>

        {/* Modal hiển thị nội dung kiến thức của chủ đề */}
        <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            content={sampleKnowledge[selectedTopic] || ''}
        />
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