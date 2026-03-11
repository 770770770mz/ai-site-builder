import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Website Builder Server is running");
});

app.post("/generate", (req, res) => {
  const prompt = req.body.prompt;
  res.json({
    message: "Request received",
    prompt: prompt
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
