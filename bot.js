import { Telegraf } from "telegraf";
import pdf from "pdf-parse";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// Telegram bot init
const bot = new Telegraf(process.env.BOT_TOKEN);

// Start command
bot.start(ctx => ctx.reply(
    "Welcome! Send me a PDF file and I will generate a quiz for you."
));

// Listen for PDF documents
bot.on("document", async ctx => {
    try {
        const fileId = ctx.message.document.file_id;

        // Get the direct download link of the PDF
        const fileLink = await ctx.telegram.getFileLink(fileId);

        // Fetch PDF content as buffer
        const res = await fetch(fileLink.href);
        const buffer = Buffer.from(await res.arrayBuffer());

        // Extract text from PDF
        const data = await pdf(buffer);

        // --- Gemini API Quiz Call (Replace with actual endpoint) ---
        // Example placeholder:
        const quizResponse = await fetch("https://api.gemini.example/quiz", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: data.text })
        });

        const quiz = await quizResponse.json();

        // Send a portion of extracted text + quiz back to user
        ctx.reply(
            `📄 Extracted PDF Text (first 200 chars):\n${data.text.substring(0, 200)}...\n\n📝 Quiz Generated:\n${JSON.stringify(quiz, null, 2)}`
        );

    } catch (err) {
        console.error(err);
        ctx.reply(`❌ Error processing your PDF: ${err.message}`);
    }
});

// Launch bot
bot.launch();
console.log("✅ Telegram PDF Quiz Bot is running...");