const express = require("express");
const path = require("path");
const Airtable = require("airtable");

const app = express();
const PORT = process.env.PORT || 3000;

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = "HikmaQuiz"; 

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/save", async (req, res) => {
  try {
    const { name, email, company, score, answers } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Nom et Email requis" });

    await base(AIRTABLE_TABLE_NAME).create({
      "Name": name,
      "Email": email,
      "Company": company || "",
      "Score": score || 0,
      "Answers": answers ? JSON.stringify(answers) : ""
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Airtable error:", err);
    res.status(500).json({ error: "Erreur", details: err.message });
  }
});

// LA CORRECTION EST ICI : (.*) au lieu de *
app.get("(.*)", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});