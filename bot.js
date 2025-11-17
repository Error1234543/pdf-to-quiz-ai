import { Telegraf } from "telegraf";
import fs from "fs";
import pdf from "pdf-parse";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx => ctx.reply("Welcome! Send me a PDF to generate a quiz."));

bot.on("document", async ctx => {
    try {
        const fileId = ctx.message.document.file_id;
        const fileLink = await ctx.telegram.getFileLink(fileId);

        // Download PDF
        const res = await fetch(fileLink.href);
        const buffer = Buffer.from(await res.arrayBuffer());

        // Extract text from PDF
        const data = await pdf(buffer);

        // --- Gemini API Quiz Call (Example) ---
        // Replace this with your actual Gemini API integration
        const quizResponse = await fetch("https://api.gemini.example/quiz", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: data.text })
        });
        const quiz = await quizResponse.json();

        // Send quiz back to user
        ctx.reply(`PDF Text Extracted (first 200 chars):\n${data.text.substring(0, 200)}...\n\nQuiz:\n${JSON.stringify(quiz, null, 2)}`);
    } catch (err) {
        console.error(err);
        ctx.reply(`Error processing PDF: ${err.message}`);
    }
});

bot.launch();
console.log("Bot is running...");
