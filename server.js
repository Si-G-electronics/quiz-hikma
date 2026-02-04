// server.js
const express = require("express");
const path = require("path");
const Airtable = require("airtable");

const app = express();
const PORT = process.env.PORT || 3000; // ✅ Une seule déclaration

// 🔐 Variables d’environnement (Render)
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = "HikmaQuiz"; // Le nom exact de ta table Airtable

// Connexion Airtable
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

// Middleware pour lire JSON et formulaires
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir le front
app.use(express.static(path.join(__dirname, "public")));

// API pour enregistrer les réponses
app.post("/save", async (req, res) => {
  try {
    const { name, email, company, score, answers } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Nom et Email requis" });
    }

    await base(AIRTABLE_TABLE_NAME).create({
      Name: name,
      Email: email,
      Company: company || "",
      Score: score || 0,
      Answers: answers ? JSON.stringify(answers) : ""
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Erreur Airtable:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Fallback SPA (React ou site statique)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Lancement du serveur
app.listen(PORT, "0.0.0.0", () => {
  console.log("Serveur lancé sur le port " + PORT);
});
