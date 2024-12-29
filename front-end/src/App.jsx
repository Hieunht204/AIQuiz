import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';  // Trang chính
import Login from './pages/login';  // Trang đăng nhập
import Register from './pages/register';  // Trang đăng ký
import ListExam from './pages/listExam';
import Exam from './pages/exam';
import CreateQuestion from './pages/createQuestion';
import { IdProvider } from './context/IdContext';

function App() {
  return (
    <IdProvider>
      <Router>
        <div className="App">
          <Routes> 
            <Route path="/" element={<Home />} />  {/* Trang chính */}
            <Route path="/login" element={<Login />} />  {/* Trang đăng nhập */}
            <Route path="/register" element={<Register />} /> {/* Trang đăng ký */}
            <Route path="/ListExam" element={<ListExam />} />  
            <Route path="/exam/:examId" element={<Exam />} />
            <Route path="/createQuestion" element={<CreateQuestion />} />  
          </Routes>
        </div>
      </Router>
    </IdProvider>
  );
}

export default App;
