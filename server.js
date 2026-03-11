import express from "express";
import { Configuration, OpenAIApi } from "openai";

const app = express();
app.use(express.json());

// חיבור ל-OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/generate", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a website planner. Convert user requests into JSON website structures." },
        { role: "user", content: prompt }
      ],
    });

    const aiOutput = completion.data.choices[0].message.content;
    res.json({ aiOutput });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating site" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
