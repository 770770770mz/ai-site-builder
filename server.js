import express from "express";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

dotenv.config(); // קורא את משתני הסביבה

const app = express();
app.use(express.json());

// חיבור ל-OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// פונקציה שמייצרת HTML מתוך JSON
function generateHTML(siteJSON) {
  const { site_name, home_sections, style } = siteJSON;

  let html = `
  <!DOCTYPE html>
  <html lang="he" dir="${style.direction}">
  <head>
    <meta charset="UTF-8">
    <title>${site_name}</title>
    <style>
      body { font-family: Arial, sans-serif; background: ${style.colors[0]}; color: ${style.colors[1]}; margin: 0; padding: 0; }
      header, footer { padding: 20px; text-align: center; background: ${style.colors[1]}; color: ${style.colors[0]}; }
      section { padding: 40px; }
    </style>
  </head>
  <body>
    <header><h1>${site_name}</h1></header>
  `;

  home_sections.forEach(section => {
    html += `<section id="${section}"><h2>${section}</h2><p>תוכן לדוגמה עבור ${section}</p></section>`;
  });

  html += `<footer>© ${new Date().getFullYear()} ${site_name}</footer></body></html>`;
  return html;
}

// Route ליצירת אתר
app.post("/generate", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    // שליחת הבקשה ל-AI
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a website planner. Convert user requests into JSON website structures."
        },
        { role: "user", content: prompt }
      ]
    });

    // המרה ל-JSON
    const aiJSON = JSON.parse(completion.data.choices[0].message.content);
    const html = generateHTML(aiJSON);

    res.json({ aiJSON, html });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating site" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
