const express = require("express");
const path = require("path");
const Airtable = require("airtable");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 Variables d’environnement (Render)
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = "HikmaQuiz";

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir le front
app.use(express.static(path.join(__dirname, "public")));

// API pour enregistrer les données
app.post("/save", async (req, res) => {
  try {
    const { name, email, company, score } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Nom et Email requis" });
    }

    await base(AIRTABLE_TABLE_NAME).create({
      Name: name,
      Email: email,
      Company: company,
      Score: score || 0
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Erreur Airtable:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Fallback SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
