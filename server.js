import express from 'express';
import cors from 'cors';
import multer from 'multer';
import pdf from 'pdf-parse';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded');
    let dataBuffer = fs.readFileSync(req.file.path);
    try {
        const data = await pdf(dataBuffer);
        // Placeholder: integrate Gemini API here to generate quiz
        res.json({ text: data.text, quiz: "Quiz generation placeholder" });
    } catch (err) {
        res.status(500).send(err.toString());
    } finally {
        fs.unlinkSync(req.file.path);
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));