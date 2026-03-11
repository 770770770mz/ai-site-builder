const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI website builder server running");
});

app.post("/generate", (req, res) => {
  const prompt = req.body.prompt;

  res.json({
    message: "request received",
    prompt: prompt
  });
});

app.listen(3000, () => {
  console.log("server running");
});
