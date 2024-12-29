const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios").default

const createQuestionRouter = express.Router()

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_URL = process.env.OPENAI_URL

// Hàm đọc nội dung từ thư mục
const extractTxtFromFolders = (taiLieu, folderChuDe) => {
    let knowledge = "";
    let questions = "";

    folderChuDe.forEach(folder => {
        const folderPath = path.join(taiLieu, folder);

        const knowledgeFile = path.join(folderPath, "knowledge.txt");
        if (fs.existsSync(knowledgeFile)) {
            knowledge += fs.readFileSync(knowledgeFile, "utf-8") + "\n";
            // const knowledgeContent = fs.readFileSync(knowledgeFile, "utf-8");
            // console.log(`Đọc từ ${knowledgeFile}:`, knowledgeContent)
            // knowledge += knowledgeContent + "\n";
        } else {
            console.log(`Không tìm thấy file ${knowledgeFile}`);
        }

        const quesFile = path.join(folderPath, "ques.txt");
        if (fs.existsSync(quesFile)) {
            // const quesContent = fs.readFileSync(quesFile, "utf-8");
            // console.log(`Đọc từ ${quesFile}:`, quesContent);
            // questions += quesContent + "\n";
            questions += fs.readFileSync(quesFile, "utf-8") + "\n";
        }
    });

    return { knowledge: knowledge.trim(), questions: questions.trim() };
};


// Hàm gọi OpenAI API
const callOpenAiApi = async (message) => {
    const payload = {
        model: "gpt-4o-mini",
        messages: message,
        temperature: 0.6
    };

    const headers = {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
    };

    try {
        const response = await axios.post(OPENAI_URL, payload, { headers });
        if (response.status === 200) {
            return response.data.choices[0].message.content;
        } else {
            throw new Error(`Error: ${response.status}, ${response.statusText}`);
        }
    } catch (error) {
        throw new Error(`Error communicating with OpenAI API: ${error}`);
    }
};

// Hàm xử lý tạo câu hỏi
const generateOpenAiCompletion = async (knowledge, sampleQues, request) => {
    const prompt = `
    - Bạn là một trợ lý AI sẽ học các kiến thức tin học lớp 8, sau đó bạn sẽ tạo ra các câu hỏi trắc nghiệm bằng tiếng Việt với 4 đáp án dựa trên yêu cầu
    - Các kiến thức sẽ được xếp theo các chủ đề
    - Các câu hỏi được tạo ra phải dựa trên các câu hỏi mẫu được cung cấp và giữ format giống như câu hỏi mẫu, có xuống dòng giữa câu hỏi và các câu trả lời, đáp án
    - Các câu hỏi mẫu cũng sẽ được phân theo các chủ đề
    - Phải luôn ghi đáp án đúng bên dưới mỗi câu hỏi
    - Nếu không có các câu hỏi mẫu, bạn có thể dựa trên các câu hỏi đã tạo trước đó hoặc tự tạo ra câu hỏi ngẫu nhiên theo kiến thức đã học
    Kiến thức: ${knowledge},
    Câu hỏi mẫu: ${sampleQues}
    `;

    const message = [
        { role: "system", content: prompt },
        { role: "user", content: request }
    ];

    return await callOpenAiApi(message);
};

createQuestionRouter.post("/", async (req, res) => {
    try {
        const { knowledge, prompt } = req.body;

        const tai_lieu = "Tai_Lieu"
        const folder_chu_de = ["Chu_De_1", "Chu_De_2"] 
        // const request = "Tạo 5 câu hỏi trong đó có 2 câu về chủ đề 1 và 3 câu về chủ đề 2" 

        // Đọc dữ liệu từ các thư mục
        const { knowledge: sample_knowledge, questions: sample_questions } = extractTxtFromFolders(tai_lieu, folder_chu_de);

        // console.log("Kiến thức đã đọc:", sample_knowledge);
        // console.log("Câu hỏi mẫu đã đọc:", sample_questions);

        // Gọi API để tạo câu hỏi
        const response = await generateOpenAiCompletion(knowledge, sample_questions, prompt);

        // Ghi kết quả vào tệp
        const outputFile = "Test_Questions.txt";
        fs.writeFileSync(outputFile, response, "utf-8");

        // Đọc lại nội dung từ response đã được format lại 
        const formattedResponse = fs.readFileSync(outputFile, "utf-8");

        // Gửi phản hồi
        res.status(200).json({ result: formattedResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = createQuestionRouter